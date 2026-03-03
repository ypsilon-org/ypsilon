"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TaskCompleteButton({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleComplete = async () => {
    setLoading(true);
    await supabase
      .from("tasks")
      .update({ status: "pending_approval" })
      .eq("id", taskId);
    router.refresh();
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .task-complete-btn {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(166, 255, 0, 0.8);
          background: none;
          border: 1px solid rgba(166, 255, 0, 0.3);
          cursor: pointer;
          padding: 0.35rem 0.9rem;
          position: relative;
          overflow: hidden;
          transition: color 0.3s ease, border-color 0.3s ease;
          white-space: nowrap;
        }
        .task-complete-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(166, 255, 0, 0.1);
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .task-complete-btn:hover { color: rgba(166, 255, 0, 1); border-color: rgba(166, 255, 0, 0.6); }
        .task-complete-btn:hover::before { transform: translateX(0); }
        .task-complete-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .task-complete-btn span { position: relative; z-index: 1; }
      `}</style>
      <button
        className="task-complete-btn"
        onClick={handleComplete}
        disabled={loading}
      >
        <span>{loading ? "Submitting..." : "Mark Complete"}</span>
      </button>
    </>
  );
}
