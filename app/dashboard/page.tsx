import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";

const UNIT_COLORS = {
  Einherjar: {
    primary: "#6FF3FF",
    light: "#E0FCFF",
    dark: "#00B8CC",
    text: "#6FF3FF",
  },
  "Legio X Equestris": {
    primary: "#8A3FFC",
    light: "#F0E6FF",
    dark: "#6929C4",
    text: "#8A3FFC",
  },
  Myrmidons: {
    primary: "#A6FF00",
    light: "#F0FFD6",
    dark: "#7ABE00",
    text: "#A6FF00",
  },
  "Narayani Sena": {
    primary: "#FFC83D",
    light: "#FFF5E0",
    dark: "#E09600",
    text: "#FFC83D",
  },
  Spartans: {
    primary: "#FF6A00",
    light: "#FFE8D6",
    dark: "#CC5500",
    text: "#FF6A00",
  },
};

const DEFAULT_COLORS = {
  primary: "#C8A84B",
  light: "#FFF8E7",
  dark: "#7D6328",
  text: "#C8A84B",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: profile } = await supabase
    .from("profiles_with_units")
    .select("username, full_name, unit_name, unit_description, unit_id")
    .eq("id", user.id)
    .single();

  let unitMemberCount = 0;
  if (profile?.unit_id) {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("unit_id", profile.unit_id);
    unitMemberCount = count || 0;
  }

  const unitColors =
    profile?.unit_name &&
    UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      ? UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      : DEFAULT_COLORS;

  return (
    <div className="dash-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bone: #EDE3D0; --parchment: #C9B49A; --crimson: #8B0A0A;
          --gold: #C8A84B; --gold-dim: #7D6328; --ink: #080604; --dark: #0D0A06;
        }

        .dash-root {
          min-height: 100vh;
          background: var(--ink);
          color: var(--bone);
          font-family: 'EB Garamond', Georgia, serif;
          position: relative;
          overflow-x: hidden;
        }

        .dash-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.038; pointer-events: none; z-index: 9999; mix-blend-mode: overlay;
        }

        .dash-root::after {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(139,10,10,0.05) 0%, transparent 60%),
            linear-gradient(to bottom, #130A04 0%, var(--ink) 20%);
          pointer-events: none; z-index: 0;
        }

        .dash-main {
          position: relative; z-index: 1;
          max-width: 1300px; margin: 0 auto;
          padding: clamp(5rem, 10vw, 8rem) clamp(1.5rem, 4vw, 3rem) clamp(2rem, 5vw, 4rem);
        }

        .dash-stack { display: flex; flex-direction: column; gap: 2rem; }

        .page-eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.7rem; letter-spacing: 0.48em; text-transform: uppercase;
          color: var(--gold-dim); font-weight: 300; margin-bottom: 0.6rem;
          display: flex; align-items: center; gap: 0.8rem;
        }
        .page-eyebrow::before {
          content: ''; display: inline-block;
          width: 28px; height: 1px; background: var(--gold-dim); opacity: 0.5;
        }

        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900;
          color: var(--bone); line-height: 0.95; letter-spacing: -0.01em;
        }
        .page-title em { font-style: italic; display: block; }

        .panel {
          background: linear-gradient(135deg, rgba(18,12,6,0.97), rgba(10,7,4,0.99));
          border: 1px solid rgba(200,168,75,0.12);
          position: relative; overflow: hidden;
        }
        .panel::before, .panel::after {
          content: ''; position: absolute; width: 26px; height: 26px;
          border-color: rgba(200,168,75,0.22); border-style: solid;
        }
        .panel::before { top:-1px; left:-1px; border-width: 1px 0 0 1px; }
        .panel::after  { bottom:-1px; right:-1px; border-width: 0 1px 1px 0; }
        .panel-corner-tr, .panel-corner-bl {
          position: absolute; width: 26px; height: 26px;
          border-color: rgba(200,168,75,0.22); border-style: solid; z-index: 1;
        }
        .panel-corner-tr { top:-1px; right:-1px; border-width: 1px 1px 0 0; }
        .panel-corner-bl { bottom:-1px; left:-1px; border-width: 0 0 1px 1px; }
        .panel-top-bar { height: 2px; width: 100%; }
        .panel-body { padding: clamp(2rem, 4vw, 3rem); }

        .profile-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2.5rem; align-items: start;
        }
        @media (max-width: 700px) { .profile-grid { grid-template-columns: 1fr; } }

        .info-stack { display: flex; flex-direction: column; gap: 1.4rem; }
        .info-row {
          display: flex; align-items: flex-start; gap: 1rem;
          padding-bottom: 1.4rem; border-bottom: 1px solid rgba(200,168,75,0.07);
        }
        .info-row:last-child { border-bottom: none; padding-bottom: 0; }
        .info-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 0.1rem; }
        .info-label {
          font-family: 'Cormorant Garamond', serif; font-size: 0.68rem;
          letter-spacing: 0.4em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300; margin-bottom: 0.25rem;
        }
        .info-value { font-family: 'EB Garamond', serif; font-size: 1.05rem; color: var(--bone); font-style: italic; }

        .unit-panel { padding: 2rem 2.2rem; border: 1px solid; position: relative; }
        .unit-label {
          font-family: 'Cormorant Garamond', serif; font-size: 0.68rem;
          letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300; margin-bottom: 0.7rem;
        }
        .unit-name {
          font-family: 'Playfair Display', serif; font-size: 2rem;
          font-weight: 900; font-style: italic; line-height: 1; margin-bottom: 0.6rem;
        }
        .unit-divider { width: 28px; height: 1px; background: var(--gold); opacity: 0.35; margin-bottom: 1rem; }
        .unit-description { font-family: 'EB Garamond', serif; font-size: 0.98rem; font-style: italic; color: rgba(201,180,154,0.55); line-height: 1.7; }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
        @media (max-width: 560px) { .stats-grid { grid-template-columns: 1fr; } }

        .stat-card {
          background: linear-gradient(135deg, rgba(18,12,6,0.97), rgba(10,7,4,0.99));
          border: 1px solid rgba(200,168,75,0.1);
          padding: 2rem; position: relative; overflow: hidden;
        }
        .stat-card::after {
          content: ''; position: absolute; top: 0; left: 0;
          width: 1px; height: 0; background: var(--gold);
          transition: height 0.6s cubic-bezier(0.77,0,0.175,1);
        }
        .stat-card:hover::after { height: 100%; }
        .stat-top-bar { position: absolute; top: 0; left: 0; width: 0%; height: 1px; transition: width 0.5s ease; }
        .stat-card:hover .stat-top-bar { width: 100%; }
        .stat-label {
          font-family: 'Cormorant Garamond', serif; font-size: 0.68rem;
          letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300; margin-bottom: 0.8rem;
        }
        .stat-value { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900; font-style: italic; line-height: 1; margin-bottom: 0.4rem; }
        .stat-sub { font-family: 'Cormorant Garamond', serif; font-size: 0.82rem; font-style: italic; color: rgba(201,180,154,0.4); font-weight: 300; }

        /* Notice — with sign-out inside */
        .notice {
          padding: 1.5rem 2rem;
          border: 1px solid;
          display: flex; gap: 1.2rem; align-items: flex-start;
        }
        .notice-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 0.05rem; }
        .notice-content { flex: 1; }
        .notice-title {
          font-family: 'Cormorant Garamond', serif; font-size: 0.72rem;
          letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300; margin-bottom: 0.4rem;
        }
        .notice-body {
          font-family: 'EB Garamond', serif; font-size: 0.98rem; font-style: italic;
          color: rgba(201,180,154,0.55); line-height: 1.6; margin-bottom: 1.1rem;
        }
        .notice-rule { width: 100%; height: 1px; background: rgba(200,168,75,0.08); margin-bottom: 1rem; }

        /* SignOut button */
        .dash-root button[type="button"],
        .dash-root form button {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.72rem; letter-spacing: 0.38em; text-transform: uppercase;
          color: rgba(201,180,154,0.35); background: none; border: none;
          cursor: pointer; padding: 0; transition: color 0.3s; font-weight: 300;
        }
        .dash-root button[type="button"]:hover,
        .dash-root form button:hover { color: rgba(220,140,140,0.75); }
      `}</style>

      <main className="dash-main">
        <div className="dash-stack">
          {/* Header */}
          <div>
            <p className="page-eyebrow">Members' Quarters</p>
            <h1 className="page-title">
              Welcome back
              {profile?.username && (
                <em style={{ color: unitColors.text }}>@{profile.username}</em>
              )}
            </h1>
          </div>

          {/* Profile panel */}
          <div className="panel">
            <span className="panel-corner-tr" />
            <span className="panel-corner-bl" />
            <div
              className="panel-top-bar"
              style={{
                background: `linear-gradient(to right, ${unitColors.primary}, transparent)`,
              }}
            />
            <div className="panel-body">
              <div className="profile-grid">
                <div className="info-stack">
                  <div className="info-row">
                    <div className="info-icon">
                      <svg
                        width="16"
                        height="16"
                        style={{ color: unitColors.primary }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="info-label">Username</p>
                      <p className="info-value">
                        {profile?.username || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-icon">
                      <svg
                        width="16"
                        height="16"
                        style={{ color: unitColors.primary }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="info-label">Email</p>
                      <p className="info-value">{user.email}</p>
                    </div>
                  </div>
                  {profile?.full_name && (
                    <div className="info-row">
                      <div className="info-icon">
                        <svg
                          width="16"
                          height="16"
                          style={{ color: unitColors.primary }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="info-label">Full Name</p>
                        <p className="info-value">{profile.full_name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {profile?.unit_name && (
                  <div
                    className="unit-panel"
                    style={{
                      borderColor: `${unitColors.primary}25`,
                      backgroundColor: `${unitColors.primary}07`,
                    }}
                  >
                    <p className="unit-label">Your Allegiance</p>
                    <p className="unit-name" style={{ color: unitColors.text }}>
                      {profile.unit_name}
                    </p>
                    <div
                      className="unit-divider"
                      style={{ background: unitColors.primary }}
                    />
                    {profile.unit_description && (
                      <p className="unit-description">
                        {profile.unit_description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          {profile?.unit_name && (
            <div className="stats-grid">
              <div className="stat-card">
                <div
                  className="stat-top-bar"
                  style={{
                    background: `linear-gradient(to right, ${unitColors.primary}, transparent)`,
                  }}
                />
                <p className="stat-label">Unit Members</p>
                <p className="stat-value" style={{ color: unitColors.text }}>
                  {unitMemberCount}
                </p>
                <p className="stat-sub">
                  {unitMemberCount === 1 ? "warrior" : "warriors"} in{" "}
                  {profile.unit_name}
                </p>
              </div>
              <div className="stat-card">
                <div
                  className="stat-top-bar"
                  style={{
                    background: `linear-gradient(to right, ${unitColors.primary}, transparent)`,
                  }}
                />
                <p className="stat-label">Your Rank</p>
                <p className="stat-value" style={{ color: unitColors.text }}>
                  Recruit
                </p>
                <p className="stat-sub">Keep training to advance</p>
              </div>
            </div>
          )}

          {/* Notice — SignOut lives here */}
          <div
            className="notice"
            style={{
              borderColor: `${unitColors.primary}20`,
              backgroundColor: `${unitColors.primary}06`,
            }}
          >
            <div className="notice-icon">
              <svg
                width="16"
                height="16"
                style={{ color: unitColors.primary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="notice-content">
              <p className="notice-title">Protected Quarters</p>
              <p className="notice-body">
                This sanctuary is sealed. Only those who have sworn the oath may
                enter.
              </p>
              <div className="notice-rule" />
              <SignOut />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
