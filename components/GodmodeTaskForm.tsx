"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getUnitColor } from "@/lib/unitColors";

interface Unit {
  id: string;
  name: string;
}

interface GodmodeTaskFormProps {
  units: Unit[];
  ownerId: string;
}

export default function GodmodeTaskForm({
  units,
  ownerId,
}: GodmodeTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [unitId, setUnitId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const supabase = createClient();

  // Color keyed by unit_id — rename-safe
  const selectedColor = unitId ? getUnitColor(unitId).primary : "#C8A84B";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !points || !unitId) {
      setMessage({
        type: "error",
        text: "Title, points, and unit are required.",
      });
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });

    const { error } = await supabase.from("tasks").insert({
      title: title.trim(),
      description: description.trim() || null,
      points: parseInt(points),
      unit_id: unitId,
      created_by: ownerId,
      created_by_owner: true,
      status: "unassigned",
      assigned_to: null,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Order dispatched to unit." });
      setTitle("");
      setDescription("");
      setPoints("");
      setUnitId("");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
    >
      <style>{`
        .gf-field{display:flex;flex-direction:column;gap:.45rem;}
        .gf-label{font-family:'Cormorant Garamond',serif;font-size:.68rem;letter-spacing:.42em;text-transform:uppercase;color:#7D6328;font-weight:300;}
        .gf-input,.gf-select,.gf-textarea{width:100%;padding:.8rem 1rem;background:rgba(5,3,2,.85);border:1px solid rgba(200,168,75,.12);color:#EDE3D0;font-family:'EB Garamond',serif;font-size:1rem;outline:none;transition:border-color .3s;border-radius:0;-webkit-appearance:none;}
        .gf-input::placeholder,.gf-textarea::placeholder{color:rgba(201,180,154,.2);font-style:italic;}
        .gf-input:focus,.gf-select:focus,.gf-textarea:focus{border-color:rgba(139,10,10,.5);}
        .gf-select option{background:#0D0A06;color:#EDE3D0;}
        .gf-textarea{resize:vertical;min-height:90px;}
        .gf-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
        @media(max-width:560px){.gf-row{grid-template-columns:1fr;}}
        .gf-msg{padding:.7rem 1rem;font-family:'Cormorant Garamond',serif;font-size:.88rem;font-style:italic;border:1px solid;}
        .gf-msg.error{background:rgba(139,10,10,.07);border-color:rgba(139,10,10,.28);color:rgba(220,150,150,.85);}
        .gf-msg.success{background:rgba(200,168,75,.05);border-color:rgba(200,168,75,.22);color:rgba(200,168,75,.8);}
        .gf-btn{font-family:'Cormorant Garamond',serif;font-size:.72rem;font-weight:600;letter-spacing:.38em;text-transform:uppercase;color:#080604;background:#C8A84B;border:1px solid #C8A84B;padding:.85rem 2rem;cursor:pointer;transition:box-shadow .3s ease,opacity .2s;width:100%;}
        .gf-btn:hover:not(:disabled){box-shadow:0 0 28px rgba(200,168,75,.28);}
        .gf-btn:disabled{opacity:.4;cursor:not-allowed;}
      `}</style>

      <div className="gf-row">
        <div className="gf-field">
          <label className="gf-label">Mission Title</label>
          <input
            className="gf-input"
            placeholder="Name the order..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="gf-field">
          <label className="gf-label">Points</label>
          <input
            className="gf-input"
            type="number"
            min="1"
            placeholder="e.g. 150"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="gf-field">
        <label className="gf-label">Dispatch to Unit</label>
        <select
          className="gf-select"
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
          required
          style={{
            borderColor: unitId ? `${selectedColor}45` : "rgba(200,168,75,.12)",
          }}
        >
          <option value="">Select a unit...</option>
          {/* unit names come from DB — always current */}
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="gf-field">
        <label className="gf-label">Description (optional)</label>
        <textarea
          className="gf-textarea"
          placeholder="Describe the mission in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {message.text && (
        <div className={`gf-msg ${message.type}`}>{message.text}</div>
      )}

      <button className="gf-btn" type="submit" disabled={loading}>
        {loading ? "Issuing Order..." : "Issue Order to Unit"}
      </button>
    </form>
  );
}
