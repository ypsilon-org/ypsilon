import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";
import Link from "next/link";

const UNIT_COLORS: Record<string, { primary: string; text: string }> = {
  Einherjar: { primary: "#6FF3FF", text: "#6FF3FF" },
  "Legio X Equestris": { primary: "#8A3FFC", text: "#8A3FFC" },
  Myrmidons: { primary: "#A6FF00", text: "#A6FF00" },
  "Narayani Sena": { primary: "#FFC83D", text: "#FFC83D" },
  Spartans: { primary: "#FF6A00", text: "#FF6A00" },
};
const DEFAULT_COLOR = { primary: "#C8A84B", text: "#C8A84B" };

export default async function OwnerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  // Guard — owner only
  const { data: self } = await supabase
    .from("profiles")
    .select("username, is_owner")
    .eq("id", user.id)
    .single();
  if (!self?.is_owner) redirect("/dashboard");

  // All units
  const { data: units } = await supabase
    .from("units")
    .select("*")
    .order("name");

  // All members with rank
  const { data: allMembers } = await supabase
    .from("profiles_with_rank")
    .select(
      "id, username, unit_id, total_points, rank_name, rank_numeral, is_leader, created_at",
    )
    .order("total_points", { ascending: false });

  // All tasks
  const { data: allTasks } = await supabase
    .from("tasks_with_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const totalMembers = allMembers?.length ?? 0;
  const totalTasks = allTasks?.length ?? 0;
  const pendingCount =
    allTasks?.filter((t) => t.status === "pending_approval").length ?? 0;
  const completedCount =
    allTasks?.filter((t) => t.status === "completed").length ?? 0;

  return (
    <div className="ow-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{--bone:#EDE3D0;--parchment:#C9B49A;--crimson:#8B0A0A;--gold:#C8A84B;--gold-dim:#7D6328;--ink:#080604;--dark:#0D0A06;}
        .ow-root{min-height:100vh;background:var(--ink);color:var(--bone);font-family:'EB Garamond',Georgia,serif;position:relative;overflow-x:hidden;}
        .ow-root::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");opacity:.038;pointer-events:none;z-index:9999;mix-blend-mode:overlay;}
        .ow-root::after{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(139,10,10,.07) 0%,transparent 60%),linear-gradient(to bottom,#130A04 0%,var(--ink) 20%);pointer-events:none;z-index:0;}

        .ow-main{position:relative;z-index:1;max-width:1400px;margin:0 auto;padding:clamp(5rem,10vw,8rem) clamp(1.5rem,4vw,3rem) clamp(3rem,6vw,5rem);}
        .ow-stack{display:flex;flex-direction:column;gap:2.5rem;}

        /* HEADER */
        .page-eyebrow{font-family:'Cormorant Garamond',serif;font-size:.7rem;letter-spacing:.48em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;margin-bottom:.6rem;display:flex;align-items:center;gap:.8rem;}
        .page-eyebrow::before{content:'';display:inline-block;width:28px;height:1px;background:var(--gold-dim);opacity:.5;}
        .page-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:900;color:var(--bone);line-height:.95;}
        .page-title em{font-style:italic;color:var(--crimson);display:block;}
        .page-sub{font-family:'Cormorant Garamond',serif;font-size:.95rem;font-style:italic;font-weight:300;color:rgba(201,180,154,.38);margin-top:.8rem;line-height:1.65;}

        /* STATS */
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(200,168,75,.08);border:1px solid rgba(200,168,75,.08);}
        @media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:480px){.stats-grid{grid-template-columns:1fr;}}
        .stat-card{background:var(--dark);padding:2.5rem 2.2rem;position:relative;overflow:hidden;transition:background .4s ease;}
        .stat-card::after{content:'';position:absolute;top:0;left:0;width:1px;height:0;background:var(--gold);transition:height .6s cubic-bezier(.77,0,.175,1);}
        .stat-card:hover{background:#0E0B07;}.stat-card:hover::after{height:100%;}
        .stat-top-bar{position:absolute;top:0;left:0;height:2px;width:0%;transition:width .5s ease;}
        .stat-card:hover .stat-top-bar{width:100%;}
        .stat-label{font-family:'Cormorant Garamond',serif;font-size:.65rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;margin-bottom:.9rem;}
        .stat-value{font-family:'Playfair Display',serif;font-size:3rem;font-weight:900;font-style:italic;line-height:1;color:var(--bone);margin-bottom:.3rem;}
        .stat-sub{font-family:'Cormorant Garamond',serif;font-size:.78rem;font-style:italic;color:rgba(201,180,154,.32);font-weight:300;}

        /* PANEL */
        .panel{background:linear-gradient(135deg,rgba(18,12,6,.97),rgba(10,7,4,.99));border:1px solid rgba(200,168,75,.12);position:relative;overflow:hidden;}
        .panel::before,.panel::after{content:'';position:absolute;width:26px;height:26px;border-color:rgba(200,168,75,.22);border-style:solid;}
        .panel::before{top:-1px;left:-1px;border-width:1px 0 0 1px;}.panel::after{bottom:-1px;right:-1px;border-width:0 1px 1px 0;}
        .panel-corner-tr,.panel-corner-bl{position:absolute;width:26px;height:26px;border-color:rgba(200,168,75,.22);border-style:solid;z-index:1;}
        .panel-corner-tr{top:-1px;right:-1px;border-width:1px 1px 0 0;}.panel-corner-bl{bottom:-1px;left:-1px;border-width:0 0 1px 1px;}
        .panel-top-bar{height:2px;width:100%;}.panel-body{padding:clamp(2rem,4vw,3rem);}

        /* SECTION */
        .section-eyebrow{font-family:'Cormorant Garamond',serif;font-size:.65rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;margin-bottom:.5rem;display:flex;align-items:center;gap:.7rem;}
        .section-eyebrow::before{content:'';display:inline-block;width:22px;height:1px;background:var(--gold-dim);opacity:.45;}
        .section-title{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:700;font-style:italic;color:var(--bone);margin-bottom:1.5rem;}

        /* UNITS GRID */
        .units-overview{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px;background:rgba(200,168,75,.08);border:1px solid rgba(200,168,75,.08);}
        .unit-block{background:var(--dark);padding:2.2rem 2rem;position:relative;overflow:hidden;transition:background .3s ease;}
        .unit-block:hover{background:#0E0B07;}
        .unit-block-bar{position:absolute;top:0;left:0;height:2px;width:0%;transition:width .5s ease;}
        .unit-block:hover .unit-block-bar{width:100%;}
        .unit-block-name{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;font-style:italic;margin-bottom:.3rem;}
        .unit-block-meta{font-family:'Cormorant Garamond',serif;font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;margin-bottom:1rem;}
        .unit-block-stats{display:flex;gap:1.5rem;}
        .unit-stat{font-family:'Cormorant Garamond',serif;font-size:.78rem;font-style:italic;color:rgba(201,180,154,.4);font-weight:300;}
        .unit-stat strong{font-family:'Playfair Display',serif;font-size:1.1rem;font-style:italic;color:var(--bone);font-weight:700;margin-right:.25rem;}

        /* ROSTER TABLE */
        .table-wrap{overflow-x:auto;border:1px solid rgba(200,168,75,.1);}
        .roster-table{width:100%;border-collapse:collapse;min-width:700px;}
        .roster-table thead tr{border-bottom:1px solid rgba(200,168,75,.1);background:rgba(5,3,2,.6);}
        .roster-table th{padding:.9rem 1.4rem;text-align:left;font-family:'Cormorant Garamond',serif;font-size:.62rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;white-space:nowrap;}
        .roster-table tbody tr{border-bottom:1px solid rgba(200,168,75,.06);transition:background .2s ease;}
        .roster-table tbody tr:last-child{border-bottom:none;}
        .roster-table tbody tr:hover{background:rgba(200,168,75,.03);}
        .roster-table td{padding:1rem 1.4rem;vertical-align:middle;}
        .td-username{font-family:'EB Garamond',serif;font-size:1rem;font-style:italic;color:var(--bone);}
        .td-rank-wrap{display:flex;align-items:center;gap:.5rem;}
        .td-rank-numeral{font-family:'Playfair Display',serif;font-size:.72rem;font-style:italic;color:rgba(200,168,75,.3);font-weight:700;}
        .td-rank-name{font-family:'Cormorant Garamond',serif;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;}
        .td-points{font-family:'Playfair Display',serif;font-size:1.05rem;font-style:italic;color:var(--gold);}
        .td-unit{font-family:'Cormorant Garamond',serif;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;font-weight:300;}
        .badge{font-family:'Cormorant Garamond',serif;font-size:.58rem;letter-spacing:.25em;text-transform:uppercase;padding:.18rem .55rem;border:1px solid;font-weight:300;}

        /* TASK LIST */
        .task-list{display:flex;flex-direction:column;gap:1px;background:rgba(200,168,75,.08);border:1px solid rgba(200,168,75,.08);}
        .task-row{background:var(--dark);padding:1.4rem 1.8rem;display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:center;position:relative;overflow:hidden;transition:background .25s ease;}
        .task-row:hover{background:#0E0B07;}
        .task-accent-bar{position:absolute;top:0;left:0;width:2px;height:0;transition:height .35s ease;}
        .task-row:hover .task-accent-bar{height:100%;}
        .task-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;color:var(--bone);margin-bottom:.2rem;}
        .task-meta{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;}
        .task-pts{font-family:'Cormorant Garamond',serif;font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);font-weight:400;}
        .task-who{font-family:'Cormorant Garamond',serif;font-size:.68rem;font-style:italic;color:rgba(201,180,154,.35);font-weight:300;}
        .task-badge{font-family:'Cormorant Garamond',serif;font-size:.58rem;letter-spacing:.28em;text-transform:uppercase;padding:.18rem .6rem;border:1px solid;font-weight:300;white-space:nowrap;}

        /* NOTICE */
        .notice{padding:1.5rem 2rem;border:1px solid;display:flex;gap:1.2rem;align-items:flex-start;}
        .notice-content{flex:1;}
        .notice-title{font-family:'Cormorant Garamond',serif;font-size:.68rem;letter-spacing:.38em;text-transform:uppercase;color:var(--gold-dim);font-weight:300;margin-bottom:.4rem;}
        .notice-body{font-family:'EB Garamond',serif;font-size:.95rem;font-style:italic;color:rgba(201,180,154,.5);line-height:1.6;margin-bottom:1rem;}
        .notice-rule{width:100%;height:1px;background:rgba(200,168,75,.08);margin-bottom:1rem;}
      `}</style>

      <main className="ow-main">
        <div className="ow-stack">
          {/* HEADER */}
          <div>
            <p className="page-eyebrow">The Seat of Power</p>
            <h1 className="page-title">
              The Godfather
              <em>All-Seeing Command</em>
            </h1>
            <p className="page-sub">
              You see everything. Every soldier, every order, every whisper
              across all five units.
            </p>
          </div>

          {/* GLOBAL STATS */}
          <div className="stats-grid">
            {[
              {
                label: "Total Units",
                value: units?.length ?? 0,
                sub: "active orders",
              },
              {
                label: "Total Soldiers",
                value: totalMembers,
                sub: "across all units",
              },
              {
                label: "Total Missions",
                value: totalTasks,
                sub: `${completedCount} completed`,
              },
              {
                label: "Pending Verdict",
                value: pendingCount,
                sub: "awaiting approval",
                accent: pendingCount > 0,
              },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div
                  className="stat-top-bar"
                  style={{
                    background: s.accent
                      ? "linear-gradient(to right,#A6FF00,transparent)"
                      : "linear-gradient(to right,var(--crimson),transparent)",
                  }}
                />
                <p className="stat-label">{s.label}</p>
                <p
                  className="stat-value"
                  style={{ color: s.accent ? "#A6FF00" : "var(--bone)" }}
                >
                  {s.value}
                </p>
                <p className="stat-sub">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* UNITS OVERVIEW */}
          <div className="panel">
            <span className="panel-corner-tr" />
            <span className="panel-corner-bl" />
            <div
              className="panel-top-bar"
              style={{
                background:
                  "linear-gradient(to right,var(--crimson),transparent)",
              }}
            />
            <div className="panel-body">
              <p className="section-eyebrow">The Five Orders</p>
              <h2 className="section-title">All Units</h2>
              <div className="units-overview">
                {units?.map((unit) => {
                  const uc = UNIT_COLORS[unit.name] ?? DEFAULT_COLOR;
                  const members =
                    allMembers?.filter((m) => m.unit_id === unit.id) ?? [];
                  const leaders = members.filter((m) => m.is_leader);
                  const tasks =
                    allTasks?.filter((t) => t.unit_id === unit.id) ?? [];
                  const pending = tasks.filter(
                    (t) => t.status === "pending_approval",
                  );
                  return (
                    <div key={unit.id} className="unit-block">
                      <div
                        className="unit-block-bar"
                        style={{
                          background: `linear-gradient(to right,${uc.primary},transparent)`,
                        }}
                      />
                      <p className="unit-block-name" style={{ color: uc.text }}>
                        {unit.name}
                      </p>
                      <p className="unit-block-meta">
                        {leaders.length}{" "}
                        {leaders.length === 1 ? "leader" : "leaders"}
                      </p>
                      <div className="unit-block-stats">
                        <span className="unit-stat">
                          <strong>{members.length}</strong>soldiers
                        </span>
                        <span className="unit-stat">
                          <strong>{tasks.length}</strong>missions
                        </span>
                        {pending.length > 0 && (
                          <span
                            className="unit-stat"
                            style={{ color: "#A6FF00" }}
                          >
                            <strong style={{ color: "#A6FF00" }}>
                              {pending.length}
                            </strong>
                            pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FULL ROSTER */}
          <div className="panel">
            <span className="panel-corner-tr" />
            <span className="panel-corner-bl" />
            <div
              className="panel-top-bar"
              style={{
                background: "linear-gradient(to right,var(--gold),transparent)",
              }}
            />
            <div className="panel-body">
              <p className="section-eyebrow">All Soldiers</p>
              <h2 className="section-title">Global Roster</h2>
              <div className="table-wrap">
                <table className="roster-table">
                  <thead>
                    <tr>
                      <th>Soldier</th>
                      <th>Unit</th>
                      <th>Rank</th>
                      <th>Points</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allMembers?.map((m) => {
                      const unit = units?.find((u) => u.id === m.unit_id);
                      const uc = unit
                        ? (UNIT_COLORS[unit.name] ?? DEFAULT_COLOR)
                        : DEFAULT_COLOR;
                      return (
                        <tr key={m.id}>
                          <td>
                            <span className="td-username">@{m.username}</span>
                          </td>
                          <td>
                            <span
                              className="td-unit"
                              style={{ color: uc.primary }}
                            >
                              {unit?.name ?? "—"}
                            </span>
                          </td>
                          <td>
                            <div className="td-rank-wrap">
                              <span className="td-rank-numeral">
                                {m.rank_numeral}
                              </span>
                              <span className="td-rank-name">
                                {m.rank_name ?? "Private"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="td-points">
                              {(m.total_points ?? 0).toLocaleString()}
                            </span>
                          </td>
                          <td>
                            {m.is_leader ? (
                              <span
                                className="badge"
                                style={{
                                  borderColor: "rgba(200,168,75,.3)",
                                  color: "var(--gold)",
                                }}
                              >
                                Leader
                              </span>
                            ) : (
                              <span
                                className="badge"
                                style={{
                                  borderColor: "rgba(201,180,154,.15)",
                                  color: "rgba(201,180,154,.35)",
                                }}
                              >
                                Member
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ALL PENDING TASKS */}
          {pendingCount > 0 && (
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
                <p className="section-eyebrow">Across All Units</p>
                <h2 className="section-title">Pending Approvals</h2>
                <div className="task-list">
                  {allTasks
                    ?.filter((t) => t.status === "pending_approval")
                    .map((task) => {
                      const unit = units?.find((u) => u.id === task.unit_id);
                      const uc = unit
                        ? (UNIT_COLORS[unit.name] ?? DEFAULT_COLOR)
                        : DEFAULT_COLOR;
                      return (
                        <div key={task.id} className="task-row">
                          <div
                            className="task-accent-bar"
                            style={{ background: "#A6FF00" }}
                          />
                          <div>
                            <p className="task-title">{task.title}</p>
                            <div className="task-meta">
                              <span className="task-pts">
                                ✦ {task.points} pts
                              </span>
                              <span className="task-who">
                                @{task.assigned_username}
                              </span>
                              <span
                                className="task-who"
                                style={{ color: uc.primary }}
                              >
                                — {unit?.name}
                              </span>
                            </div>
                          </div>
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
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ALL TASKS — RECENT */}
          <div className="panel">
            <span className="panel-corner-tr" />
            <span className="panel-corner-bl" />
            <div
              className="panel-top-bar"
              style={{
                background:
                  "linear-gradient(to right,rgba(200,168,75,.4),transparent)",
              }}
            />
            <div className="panel-body">
              <p className="section-eyebrow">Full Intelligence</p>
              <h2 className="section-title">All Missions</h2>
              <div className="task-list">
                {allTasks?.slice(0, 40).map((task) => {
                  const unit = units?.find((u) => u.id === task.unit_id);
                  const uc = unit
                    ? (UNIT_COLORS[unit.name] ?? DEFAULT_COLOR)
                    : DEFAULT_COLOR;
                  const statusColors: Record<string, string> = {
                    active: "var(--gold)",
                    pending_approval: "#A6FF00",
                    completed: "#6FF3FF",
                    rejected: "#FF6A00",
                  };
                  const sc = statusColors[task.status] ?? "var(--gold)";
                  return (
                    <div key={task.id} className="task-row">
                      <div
                        className="task-accent-bar"
                        style={{ background: uc.primary }}
                      />
                      <div>
                        <p className="task-title">{task.title}</p>
                        <div className="task-meta">
                          <span className="task-pts">✦ {task.points} pts</span>
                          <span className="task-who">
                            @{task.assigned_username}
                          </span>
                          <span
                            className="task-who"
                            style={{ color: uc.primary }}
                          >
                            — {unit?.name}
                          </span>
                        </div>
                      </div>
                      <span
                        className="task-badge"
                        style={{
                          borderColor: `${sc}40`,
                          color: sc,
                          backgroundColor: `${sc}0D`,
                        }}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* NOTICE + SIGNOUT */}
          <div
            className="notice"
            style={{
              borderColor: "rgba(139,10,10,.3)",
              backgroundColor: "rgba(139,10,10,.04)",
            }}
          >
            <div className="notice-content">
              <p className="notice-title">Omertà</p>
              <p className="notice-body">
                You carry the weight of all five families. What is seen here,
                stays here.
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
