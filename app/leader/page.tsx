import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";
import Link from "next/link";

const UNIT_COLORS = {
  Einherjar: { primary: "#6FF3FF", text: "#6FF3FF" },
  "Legio X Equestris": { primary: "#8A3FFC", text: "#8A3FFC" },
  Myrmidons: { primary: "#A6FF00", text: "#A6FF00" },
  "Narayani Sena": { primary: "#FFC83D", text: "#FFC83D" },
  Spartans: { primary: "#FF6A00", text: "#FF6A00" },
};

const DEFAULT_COLORS = { primary: "#C8A84B", text: "#C8A84B" };

export default async function LeaderDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: profile } = await supabase
    .from("profiles_with_units")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.is_leader) redirect("/dashboard");

  const { data: unitMembers, count: totalMembers } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("unit_id", profile.unit_id)
    .order("created_at", { ascending: false });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: recentMembers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("unit_id", profile.unit_id)
    .gte("created_at", sevenDaysAgo.toISOString());

  const unitColors =
    profile?.unit_name &&
    UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      ? UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      : DEFAULT_COLORS;

  return (
    <div className="leader-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bone: #EDE3D0; --parchment: #C9B49A; --crimson: #8B0A0A;
          --gold: #C8A84B; --gold-dim: #7D6328; --ink: #080604; --dark: #0D0A06;
        }

        .leader-root {
          min-height: 100vh; background: var(--ink); color: var(--bone);
          font-family: 'EB Garamond', Georgia, serif;
          position: relative; overflow-x: hidden;
        }

        .leader-root::before {
          content: ''; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.038; pointer-events: none; z-index: 9999; mix-blend-mode: overlay;
        }

        .leader-root::after {
          content: ''; position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(139,10,10,0.05) 0%, transparent 60%),
            linear-gradient(to bottom, #130A04 0%, var(--ink) 20%);
          pointer-events: none; z-index: 0;
        }

        .leader-main {
          position: relative; z-index: 1;
          max-width: 1300px; margin: 0 auto;
          padding: clamp(5rem, 10vw, 8rem) clamp(1.5rem, 4vw, 3rem) clamp(2rem, 5vw, 4rem);
        }

        .leader-stack { display: flex; flex-direction: column; gap: 2rem; }

        .page-eyebrow {
          font-family: 'Cormorant Garamond', serif; font-size: 0.7rem;
          letter-spacing: 0.48em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300; margin-bottom: 0.6rem;
          display: flex; align-items: center; gap: 0.8rem;
        }
        .page-eyebrow::before {
          content: ''; display: inline-block; width: 28px; height: 1px;
          background: var(--gold-dim); opacity: 0.5;
        }

        .page-title {
          font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900; color: var(--bone); line-height: 0.95; margin-bottom: 0.2em;
        }
        .page-title em { font-style: italic; display: block; }

        .page-sub {
          font-family: 'Cormorant Garamond', serif; font-size: 1rem;
          font-style: italic; font-weight: 300; color: rgba(201,180,154,0.45);
          margin-top: 0.8rem; max-width: 520px; line-height: 1.65;
        }

        .stats-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(200,168,75,0.08); border: 1px solid rgba(200,168,75,0.08);
        }
        @media (max-width: 720px) { .stats-grid { grid-template-columns: 1fr; } }

        .stat-card {
          background: var(--dark); padding: 2.5rem 2.2rem;
          position: relative; overflow: hidden; transition: background 0.4s ease;
        }
        .stat-card::after {
          content: ''; position: absolute; top: 0; left: 0;
          width: 1px; height: 0; background: var(--gold);
          transition: height 0.6s cubic-bezier(0.77,0,0.175,1);
        }
        .stat-card:hover { background: #0E0B07; }
        .stat-card:hover::after { height: 100%; }
        .stat-top-bar { position: absolute; top: 0; left: 0; height: 2px; width: 0%; transition: width 0.5s ease; }
        .stat-card:hover .stat-top-bar { width: 100%; }
        .stat-label {
          font-family: 'Cormorant Garamond', serif; font-size: 0.68rem;
          letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300; margin-bottom: 1rem;
        }
        .stat-value { font-family: 'Playfair Display', serif; font-size: 3.2rem; font-weight: 900; font-style: italic; line-height: 1; margin-bottom: 0.3rem; }
        .stat-sub { font-family: 'Cormorant Garamond', serif; font-size: 0.8rem; font-style: italic; color: rgba(201,180,154,0.35); font-weight: 300; }

        .panel {
          background: linear-gradient(135deg, rgba(18,12,6,0.97), rgba(10,7,4,0.99));
          border: 1px solid rgba(200,168,75,0.12); position: relative; overflow: hidden;
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

        .roster-eyebrow {
          font-family: 'Cormorant Garamond', serif; font-size: 0.68rem;
          letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300; margin-bottom: 0.6rem;
          display: flex; align-items: center; gap: 0.7rem;
        }
        .roster-eyebrow::before {
          content: ''; display: inline-block; width: 22px; height: 1px;
          background: var(--gold-dim); opacity: 0.45;
        }
        .roster-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; font-style: italic; color: var(--bone); margin-bottom: 2rem; }

        .roster-table-wrap { overflow-x: auto; border: 1px solid rgba(200,168,75,0.1); }
        .roster-table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .roster-table thead tr { border-bottom: 1px solid rgba(200,168,75,0.1); background: rgba(5,3,2,0.5); }
        .roster-table th {
          padding: 1rem 1.5rem; text-align: left;
          font-family: 'Cormorant Garamond', serif; font-size: 0.65rem;
          letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300; white-space: nowrap;
        }
        .roster-table tbody tr { border-bottom: 1px solid rgba(200,168,75,0.06); transition: background 0.25s ease; }
        .roster-table tbody tr:last-child { border-bottom: none; }
        .roster-table tbody tr:hover { background: rgba(200,168,75,0.03); }
        .roster-table td { padding: 1.1rem 1.5rem; vertical-align: middle; }
        .td-username { font-family: 'EB Garamond', serif; font-size: 1.02rem; font-style: italic; color: var(--bone); display: flex; align-items: center; gap: 0.7rem; }
        .leader-badge {
          font-family: 'Cormorant Garamond', serif; font-size: 0.58rem;
          letter-spacing: 0.3em; text-transform: uppercase;
          padding: 0.2rem 0.6rem; border: 1px solid rgba(139,10,10,0.45);
          color: rgba(220,140,140,0.8); background: rgba(139,10,10,0.07); font-style: normal;
        }
        .td-email { font-family: 'Cormorant Garamond', serif; font-size: 0.9rem; font-style: italic; color: rgba(201,180,154,0.4); font-weight: 300; }
        .td-role { font-family: 'Cormorant Garamond', serif; font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold-dim); font-weight: 300; }
        .td-date { font-family: 'Cormorant Garamond', serif; font-size: 0.88rem; font-style: italic; color: rgba(201,180,154,0.35); font-weight: 300; }
        .roster-empty { text-align: center; padding: 5rem 2rem; }
        .roster-empty-ornament { color: rgba(200,168,75,0.15); font-size: 3rem; margin-bottom: 1.2rem; font-family: 'Playfair Display', serif; font-style: italic; }
        .roster-empty-text { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; color: rgba(201,180,154,0.35); font-weight: 300; }

        /* Bottom notice with sign-out */
        .notice {
          padding: 1.5rem 2rem; border: 1px solid;
          display: flex; gap: 1.2rem; align-items: flex-start;
        }
        .notice-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 0.05rem; }
        .notice-content { flex: 1; }
        .notice-title {
          font-family: 'Cormorant Garamond', serif; font-size: 0.72rem;
          letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300; margin-bottom: 0.4rem;
        }
        .notice-body { font-family: 'EB Garamond', serif; font-size: 0.98rem; font-style: italic; color: rgba(201,180,154,0.55); line-height: 1.6; margin-bottom: 1.1rem; }
        .notice-rule { width: 100%; height: 1px; background: rgba(200,168,75,0.08); margin-bottom: 1rem; }

        .leader-root button[type="button"],
        .leader-root form button {
          font-family: 'Cormorant Garamond', serif; font-size: 0.72rem;
          letter-spacing: 0.38em; text-transform: uppercase;
          color: rgba(201,180,154,0.35); background: none; border: none;
          cursor: pointer; padding: 0; transition: color 0.3s; font-weight: 300;
        }
        .leader-root button[type="button"]:hover,
        .leader-root form button:hover { color: rgba(220,140,140,0.75); }

        .back-link {
          font-family: 'Cormorant Garamond', serif; font-size: 0.72rem;
          letter-spacing: 0.3em; text-transform: uppercase; color: rgba(201,180,154,0.35);
          text-decoration: none; font-weight: 300; display: inline-flex;
          align-items: center; gap: 0.5rem; transition: color 0.3s;
        }
        .back-link:hover { color: var(--gold); }
      `}</style>

      <main className="leader-main">
        <div className="leader-stack">
          {/* Header */}
          <div>
            <p className="page-eyebrow">Command Quarters</p>
            <h1 className="page-title">
              The High Command
              <em style={{ color: unitColors.text }}>{profile.unit_name}</em>
            </h1>
            <p className="page-sub">
              Welcome, Commander @{profile.username}. The fate of your unit
              rests in your hands.
            </p>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div
                className="stat-top-bar"
                style={{
                  background: `linear-gradient(to right, ${unitColors.primary}, transparent)`,
                }}
              />
              <p className="stat-label">Total Warriors</p>
              <p className="stat-value" style={{ color: unitColors.text }}>
                {totalMembers || 0}
              </p>
              <p className="stat-sub">sworn to {profile.unit_name}</p>
            </div>
            <div className="stat-card">
              <div
                className="stat-top-bar"
                style={{
                  background: `linear-gradient(to right, ${unitColors.primary}, transparent)`,
                }}
              />
              <p className="stat-label">New Recruits</p>
              <p className="stat-value" style={{ color: unitColors.text }}>
                {recentMembers || 0}
              </p>
              <p className="stat-sub">joined in the last 7 days</p>
            </div>
            <div className="stat-card">
              <div
                className="stat-top-bar"
                style={{
                  background: `linear-gradient(to right, ${unitColors.primary}, transparent)`,
                }}
              />
              <p className="stat-label">Unit Status</p>
              <p className="stat-value" style={{ color: unitColors.text }}>
                Active
              </p>
              <p className="stat-sub">standing by for orders</p>
            </div>
          </div>

          {/* Roster */}
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
              <p className="roster-eyebrow">The Roll</p>
              <h2 className="roster-title">Unit Roster</h2>
              {unitMembers && unitMembers.length > 0 ? (
                <div className="roster-table-wrap">
                  <table className="roster-table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitMembers.map((member) => (
                        <tr key={member.id}>
                          <td>
                            <div className="td-username">
                              @{member.username}
                              {member.is_leader && (
                                <span className="leader-badge">Leader</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="td-email">{member.email}</span>
                          </td>
                          <td>
                            <span className="td-role">
                              {member.is_leader ? "Commander" : "Warrior"}
                            </span>
                          </td>
                          <td>
                            <span className="td-date">
                              {new Date(member.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="roster-empty">
                  <div className="roster-empty-ornament">✦</div>
                  <p className="roster-empty-text">
                    No warriors have yet sworn allegiance to {profile.unit_name}
                    .
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notice + SignOut */}
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
              <p className="notice-title">Command Clearance</p>
              <p className="notice-body">
                This chamber is sealed to all but the highest rank. You bear the
                weight of command.
              </p>
              <div className="notice-rule" />
              <div
                style={{ display: "flex", alignItems: "center", gap: "2rem" }}
              >
                <SignOut />
                <Link href="/dashboard" className="back-link">
                  ← My Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
