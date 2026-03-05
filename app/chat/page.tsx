import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatTabs from "@/components/ChatTabs";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles_with_units")
    .select("username, unit_id, unit_name, is_owner")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#080604",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'EB Garamond', Georgia, serif",
        }}
      >
        <div style={{ textAlign: "center", color: "#C9B49A" }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.48em",
              textTransform: "uppercase",
              color: "#7D6328",
              marginBottom: "1rem",
            }}
          >
            Error
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#EDE3D0",
              marginBottom: "0.75rem",
            }}
          >
            Profile Not Found
          </h2>
          <p style={{ fontStyle: "italic", opacity: 0.5 }}>
            Unable to load your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .chat-page-root {
          height: 100dvh;
          background: #080604;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding-top: 72px;
        }
        .chat-page-inner {
          flex: 1;
          min-height: 0;
          padding: clamp(0.5rem, 1.5vw, 1.25rem);
        }
        .chat-page-wrap {
          height: 100%;
          max-width: 1300px;
          margin: 0 auto;
        }
        @media (max-width: 600px) {
          .chat-page-inner {
            padding: 0;
          }
        }
      `}</style>
      <div className="chat-page-root">
        <div className="chat-page-inner">
          <div className="chat-page-wrap">
            <ChatTabs
              userId={user.id}
              username={profile.username}
              unitId={profile.unit_id}
              unitName={profile.unit_name}
              isOwner={profile.is_owner ?? false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
