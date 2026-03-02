"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  message: string;
  username: string;
  user_id: string;
  unit_id: string | null;
  unit_name: string | null;
  created_at: string;
  is_edited: boolean;
}

interface GeneralChatProps {
  userId: string;
  username: string;
  unitId: string | null;
  unitName: string | null;
}

// Unit colors mapping
const UNIT_COLORS: { [key: string]: string } = {
  Einherjar: "text-purple-600",
  "Legio X Equestris": "text-red-600",
  Myrmidons: "text-blue-600",
  "Narayani Sena": "text-orange-600",
  Spartans: "text-green-600",
};

export default function GeneralChat({
  userId,
  username,
  unitId,
  unitName,
}: GeneralChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("general_messages_with_units")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(200); // Limit to last 200 messages for performance

      if (data && !error) {
        setMessages(data);
        setTimeout(scrollToBottom, 100);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("general_chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "general_messages",
        },
        async (payload) => {
          // Fetch full message with unit info
          const { data } = await supabase
            .from("general_messages_with_units")
            .select("*")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setMessages((current) => [...current, data]);
            setTimeout(scrollToBottom, 100);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "general_messages",
        },
        async (payload) => {
          const { data } = await supabase
            .from("general_messages_with_units")
            .select("*")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setMessages((current) =>
              current.map((msg) => (msg.id === data.id ? data : msg)),
            );
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "general_messages",
        },
        (payload) => {
          setMessages((current) =>
            current.filter((msg) => msg.id !== payload.old.id),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const { error } = await supabase.from("general_messages").insert({
      user_id: userId,
      username: username,
      unit_id: unitId,
      message: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
    } else {
      alert("Failed to send message: " + error.message);
    }
    setSending(false);
  };

  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(msg.message);
  };

  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;

    const { error } = await supabase
      .from("general_messages")
      .update({ message: editText.trim() })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      setEditText("");
    } else {
      alert("Failed to edit message: " + error.message);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;

    const { error } = await supabase
      .from("general_messages")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete message: " + error.message);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getUnitColor = (unitName: string | null) => {
    if (!unitName) return "text-gray-600";
    return UNIT_COLORS[unitName] || "text-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-bold">🌍 General Chat</h2>
        <p className="text-sm text-purple-100">
          All units • {messages.length} messages
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Be the first to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.user_id === userId ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.user_id === userId
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.user_id !== userId && (
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-bold ${getUnitColor(msg.unit_name)}`}
                    >
                      {msg.username}
                    </span>
                    {msg.unit_name && (
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                        {msg.unit_name}
                      </span>
                    )}
                  </div>
                )}
                {editingId === msg.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-2 py-1 text-gray-900 rounded border border-gray-300"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(msg.id)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="wrap-break-word">{msg.message}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs ${
                          msg.user_id === userId
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(msg.created_at)}
                        {msg.is_edited && " (edited)"}
                      </span>
                      {msg.user_id === userId && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(msg)}
                            className="text-xs opacity-75 hover:opacity-100 underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="text-xs opacity-75 hover:opacity-100 underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="border-t border-gray-200 p-4 flex gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message all units..."
          maxLength={2000}
          disabled={sending}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
