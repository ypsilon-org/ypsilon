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

const UNIT_COLORS: Record<string, string> = {
  Einherjar: "#6FF3FF",
  "Legio X Equestris": "#8A3FFC",
  Myrmidons: "#A6FF00",
  "Narayani Sena": "#FFC83D",
  Spartans: "#FF6A00",
};

const chatStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

  .gchat-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #080604;
    font-family: 'EB Garamond', Georgia, serif;
  }

  /* HEADER */
  .gchat-header {
    padding: 1.2rem 2rem;
    border-bottom: 1px solid rgba(200,168,75,0.09);
    background: linear-gradient(to bottom, rgba(20,13,6,0.9), rgba(8,6,4,0.7));
    flex-shrink: 0;
    position: relative;
  }
  .gchat-header-bar {
    position: absolute;
    top: 0; left: 0;
    height: 1px; width: 100%;
    background: linear-gradient(to right, #C8A84B, transparent);
  }
  .gchat-header-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.62rem;
    letter-spacing: 0.48em;
    text-transform: uppercase;
    color: #7D6328;
    font-weight: 300;
    margin-bottom: 0.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .gchat-header-label::before {
    content: '';
    display: inline-block;
    width: 14px; height: 1px;
    background: #7D6328;
    opacity: 0.5;
  }
  .gchat-header-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    font-style: italic;
    color: #EDE3D0;
    line-height: 1.1;
  }
  .gchat-header-count {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.72rem;
    font-style: italic;
    color: rgba(200,168,75,0.35);
    font-weight: 300;
    margin-top: 0.1rem;
  }

  /* MESSAGES AREA */
  .gchat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(200,168,75,0.15) transparent;
  }
  .gchat-messages::-webkit-scrollbar { width: 4px; }
  .gchat-messages::-webkit-scrollbar-track { background: transparent; }
  .gchat-messages::-webkit-scrollbar-thumb { background: rgba(200,168,75,0.15); border-radius: 2px; }

  /* DATE SEPARATOR */
  .gchat-date-sep {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0 0.5rem;
  }
  .gchat-date-line { flex: 1; height: 1px; background: rgba(200,168,75,0.07); }
  .gchat-date-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.62rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(200,168,75,0.25);
    font-weight: 300;
    font-style: italic;
  }

  /* EMPTY STATE */
  .gchat-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.8rem;
  }
  .gchat-empty-ornament {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    font-weight: 900;
    font-style: italic;
    color: rgba(200,168,75,0.05);
    line-height: 1;
    user-select: none;
  }
  .gchat-empty-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem;
    font-style: italic;
    color: rgba(201,180,154,0.25);
    text-align: center;
    font-weight: 300;
  }

  /* MESSAGE ROW */
  .msg-row {
    display: flex;
    flex-direction: column;
    padding: 0.25rem 0;
  }
  .msg-row-mine { align-items: flex-end; }
  .msg-row-other { align-items: flex-start; }

  /* Sender meta (shown for others only) */
  .msg-sender-meta {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin-bottom: 0.25rem;
    padding: 0 0.2rem;
  }
  .msg-sender-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    line-height: 1;
  }
  .msg-sender-unit {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.62rem;
    font-style: italic;
    font-weight: 300;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(201,180,154,0.35);
  }

  /* Bubble */
  .msg-bubble {
    max-width: min(72%, 520px);
    padding: 0.65rem 1rem;
    position: relative;
    word-break: break-word;
    line-height: 1.55;
  }

  .msg-bubble-mine {
    background: rgba(139,10,10,0.22);
    border: 1px solid rgba(139,10,10,0.3);
    border-bottom-right-radius: 0;
  }
  .msg-bubble-mine::after {
    content: '';
    position: absolute;
    bottom: 0; right: -5px;
    width: 0; height: 0;
    border-left: 5px solid rgba(139,10,10,0.3);
    border-bottom: 5px solid transparent;
  }

  .msg-bubble-other {
    background: rgba(18,13,6,0.8);
    border: 1px solid rgba(200,168,75,0.1);
    border-bottom-left-radius: 0;
  }
  .msg-bubble-other::after {
    content: '';
    position: absolute;
    bottom: 0; left: -5px;
    width: 0; height: 0;
    border-right: 5px solid rgba(200,168,75,0.1);
    border-bottom: 5px solid transparent;
  }

  .msg-text {
    font-family: 'EB Garamond', serif;
    font-size: 1rem;
    color: #EDE3D0;
    line-height: 1.55;
  }
  .msg-text-mine { color: rgba(237,227,208,0.92); }
  .msg-text-other { color: rgba(237,227,208,0.85); }

  /* Edit mode inside bubble */
  .msg-edit-area {
    width: 100%;
    background: rgba(8,6,4,0.6);
    border: 1px solid rgba(200,168,75,0.2);
    color: #EDE3D0;
    font-family: 'EB Garamond', serif;
    font-size: 0.98rem;
    padding: 0.4rem 0.6rem;
    resize: none;
    outline: none;
    line-height: 1.5;
  }
  .msg-edit-area:focus { border-color: rgba(200,168,75,0.4); }

  .msg-edit-actions { display: flex; gap: 0.5rem; margin-top: 0.4rem; }
  .msg-edit-btn {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.62rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    font-weight: 400;
    padding: 0.25rem 0.7rem;
    border: 1px solid;
    cursor: pointer;
    background: transparent;
    transition: background 0.2s;
  }
  .msg-edit-btn-save {
    color: #A6FF00;
    border-color: rgba(166,255,0,0.35);
  }
  .msg-edit-btn-save:hover { background: rgba(166,255,0,0.08); }
  .msg-edit-btn-cancel {
    color: rgba(201,180,154,0.5);
    border-color: rgba(201,180,154,0.18);
  }
  .msg-edit-btn-cancel:hover { background: rgba(201,180,154,0.05); }

  /* Footer meta */
  .msg-footer {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-top: 0.2rem;
    padding: 0 0.2rem;
  }
  .msg-time {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.6rem;
    font-style: italic;
    color: rgba(201,180,154,0.3);
    font-weight: 300;
    letter-spacing: 0.08em;
  }
  .msg-action-btn {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(200,168,75,0.3);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }
  .msg-action-btn:hover { color: rgba(200,168,75,0.75); }
  .msg-edited {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.6rem;
    font-style: italic;
    color: rgba(201,180,154,0.22);
    font-weight: 300;
  }

  /* INPUT BAR */
  .gchat-input-bar {
    flex-shrink: 0;
    border-top: 1px solid rgba(200,168,75,0.09);
    padding: 1rem 2rem;
    background: rgba(10,7,4,0.95);
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  .gchat-input {
    flex: 1;
    background: rgba(18,13,6,0.8);
    border: 1px solid rgba(200,168,75,0.14);
    color: #EDE3D0;
    font-family: 'EB Garamond', serif;
    font-size: 1rem;
    padding: 0.65rem 1rem;
    outline: none;
    transition: border-color 0.25s;
    caret-color: #C8A84B;
  }
  .gchat-input::placeholder {
    color: rgba(201,180,154,0.22);
    font-style: italic;
  }
  .gchat-input:focus { border-color: rgba(200,168,75,0.32); }

  .gchat-send-btn {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.65rem;
    letter-spacing: 0.38em;
    text-transform: uppercase;
    font-weight: 600;
    color: #EDE3D0;
    background: transparent;
    border: 1px solid rgba(139,10,10,0.55);
    padding: 0.65rem 1.6rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
    white-space: nowrap;
  }
  .gchat-send-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: #8B0A0A;
    transform: translateX(-101%);
    transition: transform 0.4s cubic-bezier(0.77,0,0.175,1);
  }
  .gchat-send-btn:hover:not(:disabled)::before { transform: translateX(0); }
  .gchat-send-btn:hover:not(:disabled) { border-color: #8B0A0A; }
  .gchat-send-btn span { position: relative; z-index: 1; }
  .gchat-send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* LOADING */
  .gchat-loading {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.82rem;
    font-style: italic;
    color: rgba(201,180,154,0.25);
    letter-spacing: 0.25em;
  }
`;

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
        .limit(200);
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
        { event: "INSERT", schema: "public", table: "general_messages" },
        async (payload) => {
          const { data } = await supabase
            .from("general_messages_with_units")
            .select("*")
            .eq("id", payload.new.id)
            .single();
          if (data) {
            setMessages((c) => [...c, data]);
            setTimeout(scrollToBottom, 100);
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "general_messages" },
        async (payload) => {
          const { data } = await supabase
            .from("general_messages_with_units")
            .select("*")
            .eq("id", payload.new.id)
            .single();
          if (data)
            setMessages((c) => c.map((m) => (m.id === data.id ? data : m)));
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "general_messages" },
        (payload) => {
          setMessages((c) => c.filter((m) => m.id !== payload.old.id));
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
      username,
      unit_id: unitId,
      message: newMessage.trim(),
    });
    if (!error) setNewMessage("");
    else alert("Failed to send: " + error.message);
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
    } else alert("Failed to edit: " + error.message);
  };
  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase
      .from("general_messages")
      .delete()
      .eq("id", id);
    if (error) alert("Failed to delete: " + error.message);
  };

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <style>{chatStyles}</style>
      <div className="gchat-root">
        {/* Header */}
        <div className="gchat-header">
          <div className="gchat-header-bar" />
          <p className="gchat-header-label">General</p>
          <h2 className="gchat-header-title">All Units</h2>
          <p className="gchat-header-count">{messages.length} dispatches</p>
        </div>

        {/* Messages */}
        {loading ? (
          <div className="gchat-loading">Loading dispatches…</div>
        ) : (
          <div className="gchat-messages">
            {messages.length === 0 ? (
              <div className="gchat-empty">
                <div className="gchat-empty-ornament">✦</div>
                <p className="gchat-empty-text">
                  No messages yet.
                  <br />
                  Be the first to speak.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.user_id === userId;
                const unitColor = msg.unit_name
                  ? (UNIT_COLORS[msg.unit_name] ?? "#C8A84B")
                  : "#C8A84B";
                return (
                  <div
                    key={msg.id}
                    className={`msg-row ${isMine ? "msg-row-mine" : "msg-row-other"}`}
                  >
                    {!isMine && (
                      <div className="msg-sender-meta">
                        <span
                          className="msg-sender-name"
                          style={{ color: unitColor }}
                        >
                          @{msg.username}
                        </span>
                        {msg.unit_name && (
                          <span className="msg-sender-unit">
                            {msg.unit_name}
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className={`msg-bubble ${isMine ? "msg-bubble-mine" : "msg-bubble-other"}`}
                    >
                      {editingId === msg.id ? (
                        <>
                          <textarea
                            className="msg-edit-area"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            autoFocus
                          />
                          <div className="msg-edit-actions">
                            <button
                              className="msg-edit-btn msg-edit-btn-save"
                              onClick={() => saveEdit(msg.id)}
                            >
                              Save
                            </button>
                            <button
                              className="msg-edit-btn msg-edit-btn-cancel"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <p
                          className={`msg-text ${isMine ? "msg-text-mine" : "msg-text-other"}`}
                        >
                          {msg.message}
                        </p>
                      )}
                    </div>

                    {editingId !== msg.id && (
                      <div className="msg-footer">
                        <span className="msg-time">
                          {formatTime(msg.created_at)}
                        </span>
                        {msg.is_edited && (
                          <span className="msg-edited">edited</span>
                        )}
                        {isMine && (
                          <>
                            <button
                              className="msg-action-btn"
                              onClick={() => startEdit(msg)}
                            >
                              Edit
                            </button>
                            <button
                              className="msg-action-btn"
                              onClick={() => deleteMessage(msg.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <form className="gchat-input-bar" onSubmit={handleSend}>
          <input
            className="gchat-input"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Speak to all units…"
            maxLength={2000}
            disabled={sending}
          />
          <button
            className="gchat-send-btn"
            type="submit"
            disabled={sending || !newMessage.trim()}
          >
            <span>{sending ? "Sending…" : "Send"}</span>
          </button>
        </form>
      </div>
    </>
  );
}
