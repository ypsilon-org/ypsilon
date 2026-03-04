import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";
import Link from "next/link";
import TaskAssignForm from "@/components/TaskAssignForm";
import TaskApproveButtons from "@/components/TaskApproveButtons";
import AssignGodTask from "@/components/AssignGodTask";

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
    .from("profiles_with_rank")
    .select("id, username, total_points, rank_name, rank_numeral, created_at", {
      count: "exact",
    })
    .eq("unit_id", profile.unit_id)
    .order("total_points", { ascending: false });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { count: recentMembers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("unit_id", profile.unit_id)
    .gte("created_at", sevenDaysAgo.toISOString());

  const { data: allTasks } = await supabase
    .from("tasks_with_profiles")
    .select("*")
    .eq("unit_id", profile.unit_id)
    .order("created_at", { ascending: false });

  // Separate godfather-dispatched tasks that need member assignment
  const godTasks =
    allTasks?.filter((t) => t.created_by_owner && t.status === "unassigned") ??
    [];
  const pendingTasks =
    allTasks?.filter((t) => t.status === "pending_approval") ?? [];
  const activeTasks = allTasks?.filter((t) => t.status === "active") ?? [];
  const completedTasks =
    allTasks?.filter((t) => t.status === "completed") ?? [];

  const unitColors =
    profile?.unit_name &&
    UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      ? UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      : DEFAULT_COLORS;

  const members = (unitMembers ?? []).map((m) => ({
    id: m.id,
    username: m.username,
  }));

  return (
    <div className="leader-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{--bone:#EDE3D0;--parchment:#C9B49A;--crimson:#8B0A0A;--gold:#C8A84B;--gold-dim:#7D6328;--ink:#080604;--dark:#0D0A06;}
        .leader-root{min-height:100vh;background:var(--ink);color:var(--bone);font-family:'EB Garamond',Georgia,serif;position:relative;overflow-x:hidden;}
        .leader-root::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");opacity:.038;pointer-events:none;z-index:9999;mix-blend-mode:overlay;}
        .leader-root::after{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(139,10,10,.05) 0%,transparent 60%),linear-gradient(to bottom,#130A04 0%,var(--ink) 20%);pointer-events:none;z-index:0;}
        .leader-main{position:relative;z-index:1;max-width:1300px;margin:0 auto;padding:clamp(5rem,10vw,8rem) clamp(1.5rem,4vw,3rem) clamp(3rem,6vw,5rem);}
        .leader-stack{display:flex;flex-direction:column;gap:2rem;}
        .page-eyebrow{font-family:'Cormorant Garamond',serif;font-size:.7rem;letter-spacing:.48em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;margin-bottom:.6rem;display:flex;align-items:center;gap:.8rem;}
        .page-eyebrow::before{content:'';display:inline-block;width:28px;height:1px;background:var(--gold-dim);opacity:.5;}
        .page-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3rem);font-weight:900;color:var(--bone);line-height:.95;margin-bottom:.2em;}
        .page-title em{font-style:italic;display:block;}
        .page-sub{font-family:'Cormorant Garamond',serif;font-size:1rem;font-style:italic;font-weight:300;color:rgba(201,180,154,.45);margin-top:.8rem;max-width:520px;line-height:1.65;}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(200,168,75,.08);border:1px solid rgba(200,168,75,.08);}
        @media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:480px){.stats-grid{grid-template-columns:1fr;}}
        .stat-card{background:var(--dark);padding:2.5rem 2.2rem;position:relative;overflow:hidden;transition:background .4s ease;}
        .stat-card::after{content:'';position:absolute;top:0;left:0;width:1px;height:0;background:var(--gold);transition:height .6s cubic-bezier(.77,0,.175,1);}
        .stat-card:hover{background:#0E0B07;}.stat-card:hover::after{height:100%;}
        .stat-top-bar{position:absolute;top:0;left:0;height:2px;width:0%;transition:width .5s ease;}
        .stat-card:hover .stat-top-bar{width:100%;}
        .stat-label{font-family:'Cormorant Garamond',serif;font-size:.68rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;margin-bottom:1rem;}
        .stat-value{font-family:'Playfair Display',serif;font-size:3.2rem;font-weight:900;font-style:italic;line-height:1;margin-bottom:.3rem;}
        .stat-sub{font-family:'Cormorant Garamond',serif;font-size:.8rem;font-style:italic;color:rgba(201,180,154,.35);font-weight:300;}
        .panel{background:linear-gradient(135deg,rgba(18,12,6,.97),rgba(10,7,4,.99));border:1px solid rgba(200,168,75,.12);position:relative;overflow:hidden;}
        .panel::before,.panel::after{content:'';position:absolute;width:26px;height:26px;border-color:rgba(200,168,75,.22);border-style:solid;}
        .panel::before{top:-1px;left:-1px;border-width:1px 0 0 1px;}.panel::after{bottom:-1px;right:-1px;border-width:0 1px 1px 0;}
        .panel-corner-tr,.panel-corner-bl{position:absolute;width:26px;height:26px;border-color:rgba(200,168,75,.22);border-style:solid;z-index:1;}
        .panel-corner-tr{top:-1px;right:-1px;border-width:1px 1px 0 0;}.panel-corner-bl{bottom:-1px;left:-1px;border-width:0 0 1px 1px;}
        .panel-top-bar{height:2px;width:100%;}.panel-body{padding:clamp(2rem,4vw,3rem);}
        .section-eyebrow{font-family:'Cormorant Garamond',serif;font-size:.68rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;margin-bottom:.5rem;display:flex;align-items:center;gap:.7rem;}
        .section-eyebrow::before{content:'';display:inline-block;width:22px;height:1px;background:var(--gold-dim);opacity:.45;}
        .section-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;font-style:italic;color:var(--bone);margin-bottom:1.5rem;}
        .task-list{display:flex;flex-direction:column;gap:1px;background:rgba(200,168,75,.08);border:1px solid rgba(200,168,75,.08);}
        .task-row{background:var(--dark);padding:1.6rem 2rem;display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:center;position:relative;overflow:hidden;transition:background .3s ease;}
        @media(max-width:640px){.task-row{grid-template-columns:1fr;}}
        .task-row:hover{background:#0E0B07;}
        .task-accent-bar{position:absolute;top:0;left:0;width:2px;height:0;transition:height .4s ease;}
        .task-row:hover .task-accent-bar{height:100%;}
        .task-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:600;color:var(--bone);margin-bottom:.25rem;}
        .task-desc{font-family:'EB Garamond',serif;font-size:.95rem;font-style:italic;color:rgba(201,180,154,.5);line-height:1.5;margin-bottom:.5rem;}
        .task-meta{display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap;margin-bottom:.5rem;}
        .task-pts{font-family:'Cormorant Garamond',serif;font-size:.72rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);font-weight:400;}
        .task-assignee{font-family:'Cormorant Garamond',serif;font-size:.72rem;font-style:italic;color:rgba(201,180,154,.4);font-weight:300;}
        .task-assignee-rank{font-family:'Cormorant Garamond',serif;font-size:.68rem;font-style:italic;color:rgba(201,180,154,.28);font-weight:300;}
        .task-actions{display:flex;flex-direction:column;align-items:flex-end;gap:.6rem;}
        .task-badge{font-family:'Cormorant Garamond',serif;font-size:.62rem;letter-spacing:.3em;text-transform:uppercase;padding:.22rem .7rem;border:1px solid;font-weight:400;white-space:nowrap;}
        .god-banner{display:flex;align-items:center;gap:.6rem;margin-bottom:1.2rem;padding:.6rem 1rem;border:1px solid rgba(139,10,10,.25);background:rgba(139,10,10,.05);}
        .god-banner-text{font-family:'Cormorant Garamond',serif;font-size:.72rem;letter-spacing:.25em;text-transform:uppercase;color:rgba(220,150,150,.6);font-weight:300;font-style:italic;}
        .task-empty{text-align:center;padding:3rem 2rem;font-family:'Cormorant Garamond',serif;font-size:.95rem;font-style:italic;color:rgba(201,180,154,.28);font-weight:300;}
        .roster-table-wrap{overflow-x:auto;border:1px solid rgba(200,168,75,.1);}
        .roster-table{width:100%;border-collapse:collapse;min-width:580px;}
        .roster-table thead tr{border-bottom:1px solid rgba(200,168,75,.1);background:rgba(5,3,2,.5);}
        .roster-table th{padding:1rem 1.5rem;text-align:left;font-family:'Cormorant Garamond',serif;font-size:.65rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;white-space:nowrap;}
        .roster-table tbody tr{border-bottom:1px solid rgba(200,168,75,.06);transition:background .25s ease;}
        .roster-table tbody tr:last-child{border-bottom:none;}
        .roster-table tbody tr:hover{background:rgba(200,168,75,.03);}
        .roster-table td{padding:1.1rem 1.5rem;vertical-align:middle;}
        .td-username{font-family:'EB Garamond',serif;font-size:1.02rem;font-style:italic;color:var(--bone);display:flex;align-items:center;gap:.7rem;}
        .you-badge{font-family:'Cormorant Garamond',serif;font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;padding:.2rem .6rem;border:1px solid rgba(200,168,75,.3);color:rgba(200,168,75,.7);background:rgba(200,168,75,.06);font-style:normal;}
        .td-rank{display:flex;align-items:baseline;gap:.55rem;}
        .td-rank-numeral{font-family:'Playfair Display',serif;font-size:1rem;font-style:italic;color:var(--gold);line-height:1;}
        .td-rank-name{font-family:'Cormorant Garamond',serif;font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;}
        .td-points{font-family:'Playfair Display',serif;font-size:1.1rem;font-style:italic;color:var(--gold);}
        .td-missions{font-family:'Cormorant Garamond',serif;font-size:.88rem;font-style:italic;color:rgba(201,180,154,.4);font-weight:300;}
        .notice{padding:1.5rem 2rem;border:1px solid;display:flex;gap:1.2rem;align-items:flex-start;}
        .notice-icon{width:32px;height:32px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:.05rem;}
        .notice-content{flex:1;}
        .notice-title{font-family:'Cormorant Garamond',serif;font-size:.72rem;letter-spacing:.38em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;margin-bottom:.4rem;}
        .notice-body{font-family:'EB Garamond',serif;font-size:.98rem;font-style:italic;color:rgba(201,180,154,.55);line-height:1.6;margin-bottom:1.1rem;}
        .notice-rule{width:100%;height:1px;background:rgba(200,168,75,.08);margin-bottom:1rem;}
        .back-link{font-family:'Cormorant Garamond',serif;font-size:.72rem;letter-spacing:.3em;text-transform:uppercase;color:rgba(201,180,154,.35);text-decoration:none;font-weight:300;display:inline-flex;align-items:center;gap:.5rem;transition:color .3s;}
        .back-link:hover{color:var(--gold);}
      `}</style>

      <main className="leader-main">
        <div className="leader-stack">
          {/* HEADER */}
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

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div
                className="stat-top-bar"
                style={{
                  background: `linear-gradient(to right,${unitColors.primary},transparent)`,
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
                  background: `linear-gradient(to right,${unitColors.primary},transparent)`,
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
                  background:
                    godTasks.length > 0
                      ? "linear-gradient(to right,#8B0A0A,transparent)"
                      : `linear-gradient(to right,${unitColors.primary},transparent)`,
                }}
              />
              <p className="stat-label">Godfather Orders</p>
              <p
                className="stat-value"
                style={{
                  color: godTasks.length > 0 ? "#E07070" : unitColors.text,
                }}
              >
                {godTasks.length}
              </p>
              <p className="stat-sub">
                {godTasks.length === 1 ? "order needs" : "orders need"}{" "}
                assignment
              </p>
            </div>
            <div className="stat-card">
              <div
                className="stat-top-bar"
                style={{
                  background:
                    pendingTasks.length > 0
                      ? "linear-gradient(to right,#A6FF00,transparent)"
                      : `linear-gradient(to right,${unitColors.primary},transparent)`,
                }}
              />
              <p className="stat-label">Pending Approval</p>
              <p
                className="stat-value"
                style={{
                  color: pendingTasks.length > 0 ? "#A6FF00" : unitColors.text,
                }}
              >
                {pendingTasks.length}
              </p>
              <p className="stat-sub">
                {pendingTasks.length === 1
                  ? "mission awaits"
                  : "missions await"}{" "}
                review
              </p>
            </div>
          </div>

          {/* GODFATHER ORDERS — needs member assignment */}
          {godTasks.length > 0 && (
            <div className="panel">
              <span className="panel-corner-tr" />
              <span className="panel-corner-bl" />
              <div
                className="panel-top-bar"
                style={{
                  background: "linear-gradient(to right,#8B0A0A,transparent)",
                }}
              />
              <div className="panel-body">
                <div className="god-banner">
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="rgba(220,100,100,.6)"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <span className="god-banner-text">
                    Orders from the Godfather — assign each to a soldier
                  </span>
                </div>
                <p className="section-eyebrow">Direct Decree</p>
                <h2 className="section-title">Godfather's Orders</h2>
                <div className="task-list">
                  {godTasks.map((task) => (
                    <div key={task.id} className="task-row">
                      <div
                        className="task-accent-bar"
                        style={{ background: "#8B0A0A" }}
                      />
                      <div>
                        <p className="task-title">{task.title}</p>
                        {task.description && (
                          <p className="task-desc">{task.description}</p>
                        )}
                        <div className="task-meta">
                          <span className="task-pts">✦ {task.points} pts</span>
                          <span
                            className="task-assignee"
                            style={{ color: "rgba(220,100,100,.45)" }}
                          >
                            from the Godfather
                          </span>
                        </div>
                        <AssignGodTask
                          taskId={task.id}
                          members={members}
                          unitColor={unitColors.primary}
                        />
                      </div>
                      <div className="task-actions">
                        <span
                          className="task-badge"
                          style={{
                            borderColor: "rgba(139,10,10,.4)",
                            color: "#E07070",
                            backgroundColor: "rgba(139,10,10,.07)",
                          }}
                        >
                          Unassigned
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PENDING APPROVAL */}
          {pendingTasks.length > 0 && (
            <div className="panel">
              <span className="panel-corner-tr" />
              <span className="panel-corner-bl" />
              <div
                className="panel-top-bar"
                style={{
                  background: "linear-gradient(to right,#A6FF00,transparent)",
                }}
              />
              <div className="panel-body">
                <p className="section-eyebrow">Action Required</p>
                <h2 className="section-title">Awaiting Your Verdict</h2>
                <div className="task-list">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="task-row">
                      <div
                        className="task-accent-bar"
                        style={{ background: "#A6FF00" }}
                      />
                      <div>
                        <p className="task-title">{task.title}</p>
                        {task.description && (
                          <p className="task-desc">{task.description}</p>
                        )}
                        <div className="task-meta">
                          <span className="task-pts">✦ {task.points} pts</span>
                          <span className="task-assignee">
                            @{task.assigned_username}
                          </span>
                          {task.assignee_rank_name && (
                            <span className="task-assignee-rank">
                              {task.assignee_rank_numeral
                                ? `${task.assignee_rank_numeral} · `
                                : ""}
                              {task.assignee_rank_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="task-actions">
                        <span
                          className="task-badge"
                          style={{
                            borderColor: "#A6FF0040",
                            color: "#A6FF00",
                            backgroundColor: "#A6FF000D",
                          }}
                        >
                          Pending
                        </span>
                        <TaskApproveButtons taskId={task.id} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ISSUE OWN ORDERS */}
          <div className="panel">
            <span className="panel-corner-tr" />
            <span className="panel-corner-bl" />
            <div
              className="panel-top-bar"
              style={{
                background: `linear-gradient(to right,${unitColors.primary},transparent)`,
              }}
            />
            <div className="panel-body">
              <p className="section-eyebrow">Issue Orders</p>
              <h2 className="section-title">Assign a Mission</h2>
              <TaskAssignForm
                unitId={profile.unit_id}
                leaderId={user.id}
                members={members}
                unitColor={unitColors.primary}
              />
            </div>
          </div>

          {/* ACTIVE MISSIONS */}
          <div className="panel">
            <span className="panel-corner-tr" />
            <span className="panel-corner-bl" />
            <div
              className="panel-top-bar"
              style={{
                background: `linear-gradient(to right,${unitColors.primary}88,transparent)`,
              }}
            />
            <div className="panel-body">
              <p className="section-eyebrow">In Progress</p>
              <h2 className="section-title">Active Missions</h2>
              {activeTasks.length > 0 ? (
                <div className="task-list">
                  {activeTasks.map((task) => (
                    <div key={task.id} className="task-row">
                      <div
                        className="task-accent-bar"
                        style={{ background: unitColors.primary }}
                      />
                      <div>
                        <p className="task-title">{task.title}</p>
                        {task.description && (
                          <p className="task-desc">{task.description}</p>
                        )}
                        <div className="task-meta">
                          <span className="task-pts">✦ {task.points} pts</span>
                          <span className="task-assignee">
                            @{task.assigned_username}
                          </span>
                          {task.assignee_rank_name && (
                            <span className="task-assignee-rank">
                              {task.assignee_rank_numeral
                                ? `${task.assignee_rank_numeral} · `
                                : ""}
                              {task.assignee_rank_name}
                            </span>
                          )}
                          {task.created_by_owner && (
                            <span
                              className="task-assignee"
                              style={{ color: "rgba(220,100,100,.4)" }}
                            >
                              · godfather order
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="task-actions">
                        <span
                          className="task-badge"
                          style={{
                            borderColor: `${unitColors.primary}40`,
                            color: unitColors.primary,
                            backgroundColor: `${unitColors.primary}0D`,
                          }}
                        >
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="task-empty">
                  All quiet. No missions currently active.
                </p>
              )}
            </div>
          </div>

          {/* UNIT ROSTER */}
          <div className="panel">
            <span className="panel-corner-tr" />
            <span className="panel-corner-bl" />
            <div
              className="panel-top-bar"
              style={{
                background: `linear-gradient(to right,${unitColors.primary},transparent)`,
              }}
            />
            <div className="panel-body">
              <p className="section-eyebrow">The Roll</p>
              <h2 className="section-title">Unit Roster</h2>
              {unitMembers && unitMembers.length > 0 ? (
                <div className="roster-table-wrap">
                  <table className="roster-table">
                    <thead>
                      <tr>
                        <th>Warrior</th>
                        <th>Rank</th>
                        <th>Points</th>
                        <th>Missions Done</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitMembers.map((member) => {
                        const pts = member.total_points ?? 0;
                        const done = completedTasks.filter(
                          (t) => t.assigned_to === member.id,
                        ).length;
                        return (
                          <tr key={member.id}>
                            <td>
                              <div className="td-username">
                                @{member.username}
                                {member.id === user.id && (
                                  <span className="you-badge">You</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="td-rank">
                                <span className="td-rank-numeral">
                                  {member.rank_numeral}
                                </span>
                                <span className="td-rank-name">
                                  {member.rank_name}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="td-points">
                                {pts.toLocaleString()}
                              </span>
                            </td>
                            <td>
                              <span className="td-missions">
                                {done} completed
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="task-empty">No warriors yet.</p>
              )}
            </div>
          </div>

          {/* COMPLETED ARCHIVE */}
          {completedTasks.length > 0 && (
            <div className="panel">
              <span className="panel-corner-tr" />
              <span className="panel-corner-bl" />
              <div
                className="panel-top-bar"
                style={{
                  background: "linear-gradient(to right,#6FF3FF22,transparent)",
                }}
              />
              <div className="panel-body">
                <p className="section-eyebrow">Archive</p>
                <h2 className="section-title">Completed Missions</h2>
                <div className="task-list">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="task-row"
                      style={{ opacity: 0.55 }}
                    >
                      <div
                        className="task-accent-bar"
                        style={{ background: "#6FF3FF" }}
                      />
                      <div>
                        <p className="task-title">{task.title}</p>
                        <div className="task-meta">
                          <span className="task-pts">
                            ✦ +{task.points} pts awarded
                          </span>
                          <span className="task-assignee">
                            @{task.assigned_username}
                          </span>
                        </div>
                      </div>
                      <div className="task-actions">
                        <span
                          className="task-badge"
                          style={{
                            borderColor: "#6FF3FF25",
                            color: "#6FF3FF66",
                            backgroundColor: "#6FF3FF07",
                          }}
                        >
                          Done
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FOOTER */}
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
