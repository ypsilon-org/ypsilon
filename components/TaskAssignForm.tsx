"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Member {
  id: string;
  username: string;
}

interface Props {
  unitId: string;
  leaderId: string;
  members: Member[];
  unitColor: string;
}

export default function TaskAssignForm({
  unitId,
  leaderId,
  members,
  unitColor,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [points, setPoints] = useState("100");
  const [assignedTo, setAssigned] = useState(members[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!title.trim() || !assignedTo) return;
    setLoading(true);
    await supabase.from("tasks").insert({
      unit_id: unitId,
      created_by: leaderId,
      assigned_to: assignedTo,
      title: title.trim(),
      description: description.trim() || null,
      points: Math.max(1, parseInt(points) || 100),
      status: "active",
    });
    setTitle("");
    setDesc("");
    setPoints("100");
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
    router.refresh();
  };

  return (
    <>
      <style>{`
        .assign-form { display: flex; flex-direction: column; gap: 1.2rem; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
        @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }

        .form-field { display: flex; flex-direction: column; gap: 0.4rem; }

        .form-label {
          font-family: 'Cormorant Garamond', serif; font-size: 0.68rem;
          letter-spacing: 0.4em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300;
        }

        .form-input, .form-select, .form-textarea {
          font-family: 'EB Garamond', serif; font-size: 1rem; font-style: italic;
          color: var(--bone); background: rgba(5, 3, 2, 0.6);
          border: 1px solid rgba(200, 168, 75, 0.15);
          padding: 0.75rem 1rem;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          width: 100%;
          border-radius: 0;
          -webkit-appearance: none;
        }
        .form-input::placeholder, .form-textarea::placeholder { color: rgba(201,180,154,0.25); font-style: italic; }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: rgba(200, 168, 75, 0.45);
          box-shadow: 0 0 0 1px rgba(200, 168, 75, 0.1) inset;
        }
        .form-select option { background: #0D0A06; color: var(--bone); }
        .form-textarea { resize: vertical; min-height: 80px; }

        .form-submit {
          font-family: 'Cormorant Garamond', serif; font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.38em; text-transform: uppercase; color: var(--bone);
          background: transparent; border: 1px solid rgba(139,10,10,0.55);
          cursor: pointer; padding: 0.85rem 2.5rem; align-self: flex-start;
          position: relative; overflow: hidden;
          transition: border-color 0.4s ease;
        }
        .form-submit::before {
          content: ''; position: absolute; inset: 0;
          background: var(--crimson);
          transform: translateX(-101%);
          transition: transform 0.45s cubic-bezier(0.77,0,0.175,1);
        }
        .form-submit:hover::before { transform: translateX(0); }
        .form-submit:hover { border-color: var(--crimson); }
        .form-submit span { position: relative; z-index: 1; }
        .form-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        .form-success {
          font-family: 'Cormorant Garamond', serif; font-size: 0.85rem; font-style: italic;
          color: rgba(166, 255, 0, 0.7); font-weight: 300;
          display: flex; align-items: center; gap: 0.5rem; padding-top: 0.2rem;
        }
      `}</style>

      <div className="assign-form">
        <div className="form-field">
          <label className="form-label">Mission Title</label>
          <input
            className="form-input"
            placeholder="e.g. Recruit three new members..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ "--focus-color": unitColor } as React.CSSProperties}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Description (optional)</label>
          <textarea
            className="form-textarea"
            placeholder="Provide details, context, or specific instructions..."
            value={description}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Assign To</label>
            <select
              className="form-select"
              value={assignedTo}
              onChange={(e) => setAssigned(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  @{m.username}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Points Reward</label>
            <input
              className="form-input"
              type="number"
              min="1"
              placeholder="100"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <button
            className="form-submit"
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
          >
            <span>{loading ? "Issuing..." : "Issue Mission"}</span>
          </button>
          {success && <span className="form-success">✦ Mission issued.</span>}
        </div>
      </div>
    </>
  );
}
