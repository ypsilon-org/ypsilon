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
          minHeight: "100vh",
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
    <div
      style={{
        minHeight: "100vh",
        background: "#080604",
        paddingTop: "clamp(5rem, 10vh, 7rem)",
        paddingBottom: "2rem",
        paddingLeft: "clamp(1rem, 3vw, 2rem)",
        paddingRight: "clamp(1rem, 3vw, 2rem)",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          height: "calc(100vh - clamp(7rem, 12vh, 9rem))",
        }}
      >
        <ChatTabs
          userId={user.id}
          username={profile.username}
          unitId={profile.unit_id}
          unitName={profile.unit_name}
          isOwner={profile.is_owner ?? false}
        />
      </div>
    </div>
  );
}
