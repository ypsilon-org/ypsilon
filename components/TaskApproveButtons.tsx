"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TaskApproveButtons({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleApprove = async () => {
    setLoading("approve");
    await supabase.rpc("approve_task", { task_id: taskId });
    router.refresh();
    setLoading(null);
  };

  const handleReject = async () => {
    setLoading("reject");
    await supabase.rpc("reject_task", { task_id: taskId });
    router.refresh();
    setLoading(null);
  };

  return (
    <>
      <style>{`
        .approve-btns { display: flex; gap: 0.5rem; }

        .btn-approve {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.68rem; font-weight: 500; letter-spacing: 0.3em;
          text-transform: uppercase; color: rgba(166, 255, 0, 0.85);
          background: none; border: 1px solid rgba(166, 255, 0, 0.35);
          cursor: pointer; padding: 0.35rem 0.9rem;
          position: relative; overflow: hidden;
          transition: color 0.3s, border-color 0.3s;
        }
        .btn-approve::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(166, 255, 0, 0.12);
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .btn-approve:hover { color: rgba(166, 255, 0, 1); border-color: rgba(166, 255, 0, 0.7); }
        .btn-approve:hover::before { transform: translateX(0); }

        .btn-reject {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.68rem; font-weight: 500; letter-spacing: 0.3em;
          text-transform: uppercase; color: rgba(220, 120, 120, 0.7);
          background: none; border: 1px solid rgba(139, 10, 10, 0.3);
          cursor: pointer; padding: 0.35rem 0.9rem;
          position: relative; overflow: hidden;
          transition: color 0.3s, border-color 0.3s;
        }
        .btn-reject::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(139, 10, 10, 0.12);
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .btn-reject:hover { color: rgba(240, 160, 160, 1); border-color: rgba(139, 10, 10, 0.65); }
        .btn-reject:hover::before { transform: translateX(0); }

        .btn-approve span, .btn-reject span { position: relative; z-index: 1; }
        .btn-approve:disabled, .btn-reject:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>
      <div className="approve-btns">
        <button
          className="btn-approve"
          onClick={handleApprove}
          disabled={!!loading}
        >
          <span>{loading === "approve" ? "..." : "Approve"}</span>
        </button>
        <button
          className="btn-reject"
          onClick={handleReject}
          disabled={!!loading}
        >
          <span>{loading === "reject" ? "..." : "Reject"}</span>
        </button>
      </div>
    </>
  );
}
