"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  message: string;
  username: string;
  user_id: string;
  created_at: string;
  is_edited: boolean;
}

interface UnitChatProps {
  userId: string;
  username: string;
  unitId: string;
  unitName: string;
}

export default function UnitChat({
  userId,
  username,
  unitId,
  unitName,
}: UnitChatProps) {
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
        .from("unit_messages")
        .select("*")
        .eq("unit_id", unitId)
        .order("created_at", { ascending: true });

      if (data && !error) {
        setMessages(data);
        setTimeout(scrollToBottom, 100);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [supabase, unitId]);

  useEffect(() => {
    const channel = supabase
      .channel(`unit_chat_${unitId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "unit_messages",
          filter: `unit_id=eq.${unitId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
          setTimeout(scrollToBottom, 100);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "unit_messages",
          filter: `unit_id=eq.${unitId}`,
        },
        (payload) => {
          setMessages((current) =>
            current.map((msg) =>
              msg.id === payload.new.id ? (payload.new as Message) : msg,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "unit_messages",
          filter: `unit_id=eq.${unitId}`,
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
  }, [supabase, unitId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const { error } = await supabase.from("unit_messages").insert({
      unit_id: unitId,
      user_id: userId,
      username: username,
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
      .from("unit_messages")
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
      .from("unit_messages")
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-bold">{unitName} Unit Chat</h2>
        <p className="text-sm text-blue-100">{messages.length} messages</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Be the first to say something!
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
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.user_id !== userId && (
                  <div className="text-xs font-semibold mb-1">
                    {msg.username}
                  </div>
                )}
                {editingId === msg.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-2 py-1 text-gray-900 rounded"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(msg.id)}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 bg-gray-500 text-white text-xs rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="warp-break-words">{msg.message}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs opacity-75">
                        {formatTime(msg.created_at)}
                        {msg.is_edited && " (edited)"}
                      </span>
                      {msg.user_id === userId && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(msg)}
                            className="text-xs opacity-75 hover:opacity-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="text-xs opacity-75 hover:opacity-100"
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

      <form
        onSubmit={handleSend}
        className="border-t border-gray-200 p-4 flex gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          maxLength={2000}
          disabled={sending}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
