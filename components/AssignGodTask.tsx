"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  username: string;
}

interface AssignGodTaskProps {
  taskId: string;
  members: Member[];
  unitColor: string;
}

export default function AssignGodTask({
  taskId,
  members,
  unitColor,
}: AssignGodTaskProps) {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleAssign = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    const { error } = await supabase
      .from("tasks")
      .update({ assigned_to: selected, status: "active" })
      .eq("id", taskId);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <style>{`
        .agt-row { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
        .agt-select {
          padding: .38rem .75rem;
          background: rgba(5,3,2,.9); border: 1px solid rgba(200,168,75,.15);
          color: #EDE3D0; font-family: 'Cormorant Garamond', serif; font-size: .78rem;
          outline: none; border-radius: 0; -webkit-appearance: none; cursor: pointer;
          letter-spacing: .05em; transition: border-color .25s;
        }
        .agt-select:focus { border-color: rgba(200,168,75,.35); }
        .agt-select option { background: #0D0A06; }
        .agt-btn {
          font-family: 'Cormorant Garamond', serif; font-size: .62rem; font-weight: 600;
          letter-spacing: .3em; text-transform: uppercase;
          padding: .38rem 1rem; border: 1px solid; cursor: pointer;
          background: transparent; transition: background .2s, color .2s;
        }
        .agt-btn:disabled { opacity: .35; cursor: not-allowed; }
        .agt-err { font-family: 'Cormorant Garamond', serif; font-size: .72rem; font-style: italic; color: rgba(220,100,100,.7); }
      `}</style>
      <div className="agt-row">
        <select
          className="agt-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Assign to soldier...</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              @{m.username}
            </option>
          ))}
        </select>
        <button
          className="agt-btn"
          style={{
            borderColor: selected ? `${unitColor}55` : "rgba(200,168,75,.15)",
            color: selected ? unitColor : "rgba(201,180,154,.3)",
          }}
          onClick={handleAssign}
          disabled={loading || !selected}
        >
          {loading ? "Assigning..." : "Assign"}
        </button>
      </div>
      {error && <p className="agt-err">{error}</p>}
    </div>
  );
}
