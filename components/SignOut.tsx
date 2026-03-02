"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
    router.refresh();
  };

  return (
    <>
      <style>{`
        .gf-signout {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: rgba(220, 160, 160, 0.75);
          background: none;
          border: 1px solid rgba(139, 10, 10, 0.511);
          cursor: pointer;
          padding: 0.45rem 1.1rem;
          position: relative;
          overflow: hidden;
          transition: color 0.3s ease, border-color 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
        }

        .gf-signout::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(139, 10, 10, 0.18);
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
        }

        .gf-signout:hover {
          color: rgba(240, 190, 190, 1);
          border-color: rgba(139, 10, 10, 0.7);
        }

        .gf-signout:hover::before {
          transform: translateX(0);
        }

        .gf-signout:focus-visible {
          outline: 1px solid rgba(139, 10, 10, 0.5);
          outline-offset: 3px;
        }

        .gf-signout span,
        .gf-signout svg {
          position: relative;
          z-index: 1;
        }

        .gf-signout svg {
          opacity: 0.7;
          transition: opacity 0.3s ease;
          flex-shrink: 0;
        }

        .gf-signout:hover svg { opacity: 1; }
      `}</style>

      <button className="gf-signout" onClick={handleSignOut}>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Depart</span>
      </button>
    </>
  );
}
