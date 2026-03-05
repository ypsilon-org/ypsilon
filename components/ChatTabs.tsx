"use client";

import { useState, useEffect } from "react";
import UnitChat from "@/components/UnitChat";
import GeneralChat from "@/components/GeneralChat";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getUnitColor } from "@/lib/unitColors";

interface ChatTabsProps {
  userId: string;
  username: string;
  unitId: string | null;
  unitName: string | null;
  isOwner: boolean;
}

interface UnitRow {
  id: string;
  name: string;
}

// Numerals keyed by unit_id — unaffected by renames
const UNIT_ID_NUMERALS: Record<string, string> = {
  "5cda9c6d-3f43-4f39-b771-8e2be8d098fa": "III",
  "b7dddd87-4a44-45fd-8bc2-2d3dc00fa95c": "V",
  "c53fe16c-fb92-48c4-9ede-9135f6cb2d00": "II",
  "dce3f79c-602b-409f-99c2-a8f9601c0de9": "I",
  "fb549072-d2eb-4107-9922-07d6bbf70699": "IV",
};

export default function ChatTabs({
  userId,
  username,
  unitId,
  unitName,
  isOwner,
}: ChatTabsProps) {
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [activeTab, setActiveTab] = useState<string>(
    isOwner ? "general" : unitId ? "unit" : "general",
  );
  const [loadingUnits, setLoadingUnits] = useState(isOwner);

  useEffect(() => {
    if (!isOwner) return;
    const supabase = createClient();
    supabase
      .from("units")
      .select("id, name")
      .order("name")
      .then(({ data }) => {
        if (data) setUnits(data);
        setLoadingUnits(false);
      });
  }, [isOwner]);

  const activeUnit = units.find((u) => u.id === activeTab);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
    .chat-shell{display:flex;height:100%;gap:1px;background:rgba(200,168,75,0.08);border:1px solid rgba(200,168,75,0.10);position:relative;overflow:hidden;}
    .chat-shell::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");opacity:0.038;pointer-events:none;z-index:9999;mix-blend-mode:overlay;}
    .chat-corner{position:absolute;width:22px;height:22px;border-color:rgba(200,168,75,0.22);border-style:solid;z-index:2;}
    .chat-corner-tl{top:-1px;left:-1px;border-width:1px 0 0 1px;}
    .chat-corner-tr{top:-1px;right:-1px;border-width:1px 1px 0 0;}
    .chat-corner-bl{bottom:-1px;left:-1px;border-width:0 0 1px 1px;}
    .chat-corner-br{bottom:-1px;right:-1px;border-width:0 1px 1px 0;}
    .chat-sidebar{width:230px;flex-shrink:0;background:#0A0704;display:flex;flex-direction:column;border-right:1px solid rgba(200,168,75,0.08);}
    .sidebar-header{padding:1.6rem 1.5rem 1.2rem;border-bottom:1px solid rgba(200,168,75,0.08);}
    .sidebar-eyebrow{font-family:'Cormorant Garamond',serif;font-size:0.6rem;letter-spacing:0.45em;text-transform:uppercase;color:#7D6328;font-weight:300;margin-bottom:0.4rem;display:flex;align-items:center;gap:0.5rem;}
    .sidebar-eyebrow::before{content:'';display:inline-block;width:16px;height:1px;background:#7D6328;opacity:0.5;}
    .sidebar-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;font-style:italic;color:#EDE3D0;line-height:1.1;}
    .sidebar-back{display:block;font-family:'Cormorant Garamond',serif;font-size:0.65rem;letter-spacing:0.3em;text-transform:uppercase;color:#7D6328;font-weight:300;text-decoration:none;margin-top:0.9rem;opacity:0.7;transition:opacity 0.2s;}
    .sidebar-back:hover{opacity:1;}
    .sidebar-nav{flex:1;overflow-y:auto;padding:1rem 0;}
    .sidebar-section-label{font-family:'Cormorant Garamond',serif;font-size:0.58rem;letter-spacing:0.5em;text-transform:uppercase;color:rgba(125,99,40,0.5);font-weight:300;padding:0 1.5rem;margin:0.8rem 0 0.5rem;}
    .sidebar-divider{height:1px;background:rgba(200,168,75,0.07);margin:0.6rem 1rem;}
    .nav-btn{width:100%;display:flex;align-items:center;gap:0.8rem;padding:0.75rem 1.5rem;background:transparent;border:none;cursor:pointer;position:relative;transition:background 0.25s ease;text-align:left;}
    .nav-btn:hover{background:rgba(200,168,75,0.04);}
    .nav-btn.active{background:rgba(200,168,75,0.07);}
    .nav-btn.active::before{content:'';position:absolute;left:0;top:0;width:2px;height:100%;background:var(--tab-color,#C8A84B);}
    .nav-btn-indicator{width:6px;height:6px;border-radius:50%;flex-shrink:0;background:var(--tab-color,rgba(200,168,75,0.4));opacity:0.5;transition:opacity 0.2s;}
    .nav-btn.active .nav-btn-indicator{opacity:1;}
    .nav-btn-label{font-family:'Cormorant Garamond',serif;font-size:0.82rem;font-weight:400;color:rgba(201,180,154,0.45);letter-spacing:0.02em;transition:color 0.2s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .nav-btn.active .nav-btn-label{color:#EDE3D0;}
    .nav-btn:hover .nav-btn-label{color:rgba(201,180,154,0.75);}
    .nav-btn-numeral{font-family:'Playfair Display',serif;font-size:0.65rem;font-style:italic;font-weight:900;margin-left:auto;opacity:0.2;flex-shrink:0;}
    .nav-btn.active .nav-btn-numeral{opacity:0.5;}
    .chat-main{flex:1;overflow:hidden;background:#080604;display:flex;flex-direction:column;}
    .no-unit-state{flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1.2rem;padding:3rem;}
    .no-unit-ornament{font-family:'Playfair Display',serif;font-size:4rem;font-weight:900;font-style:italic;color:rgba(200,168,75,0.06);line-height:1;}
    .no-unit-title{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;font-style:italic;color:#EDE3D0;text-align:center;}
    .no-unit-body{font-family:'Cormorant Garamond',serif;font-size:1rem;font-style:italic;color:rgba(201,180,154,0.4);text-align:center;max-width:300px;line-height:1.7;}
    .loading-state{display:flex;align-items:center;justify-content:center;height:100%;font-family:'Cormorant Garamond',serif;font-size:0.85rem;font-style:italic;color:rgba(201,180,154,0.3);letter-spacing:0.2em;}
    @media(max-width:600px){.chat-sidebar{width:180px;}}
  `;

  if (isOwner) {
    return (
      <>
        <style>{styles}</style>
        <div className="chat-shell">
          <span className="chat-corner chat-corner-tl" />
          <span className="chat-corner chat-corner-tr" />
          <span className="chat-corner chat-corner-bl" />
          <span className="chat-corner chat-corner-br" />

          <aside className="chat-sidebar">
            <div className="sidebar-header">
              <p className="sidebar-eyebrow">God Mode</p>
              <h2 className="sidebar-title">All Channels</h2>
              <Link href="/godmode" className="sidebar-back">
                ← God Mode
              </Link>
            </div>
            <nav className="sidebar-nav">
              <p className="sidebar-section-label">General</p>
              <button
                className={`nav-btn ${activeTab === "general" ? "active" : ""}`}
                style={{ "--tab-color": "#C8A84B" } as React.CSSProperties}
                onClick={() => setActiveTab("general")}
              >
                <span className="nav-btn-indicator" />
                <span className="nav-btn-label">All Units</span>
                <span className="nav-btn-numeral" style={{ color: "#C8A84B" }}>
                  ✦
                </span>
              </button>
              <div className="sidebar-divider" />
              <p className="sidebar-section-label">Units</p>
              {loadingUnits ? (
                <div className="loading-state" style={{ height: "6rem" }}>
                  Loading…
                </div>
              ) : (
                units.map((unit) => {
                  const color = getUnitColor(unit.id).primary;
                  const numeral = UNIT_ID_NUMERALS[unit.id] ?? "";
                  return (
                    <button
                      key={unit.id}
                      className={`nav-btn ${activeTab === unit.id ? "active" : ""}`}
                      style={{ "--tab-color": color } as React.CSSProperties}
                      onClick={() => setActiveTab(unit.id)}
                    >
                      <span
                        className="nav-btn-indicator"
                        style={{ background: color }}
                      />
                      <span className="nav-btn-label">{unit.name}</span>
                      <span className="nav-btn-numeral" style={{ color }}>
                        {numeral}
                      </span>
                    </button>
                  );
                })
              )}
            </nav>
          </aside>

          <div className="chat-main">
            {activeTab === "general" ? (
              <GeneralChat
                userId={userId}
                username={username}
                unitId={null}
                unitName={null}
              />
            ) : activeUnit ? (
              <UnitChat
                userId={userId}
                username={username}
                unitId={activeUnit.id}
                unitName={activeUnit.name}
              />
            ) : (
              <div className="loading-state">Select a channel</div>
            )}
          </div>
        </div>
      </>
    );
  }

  const memberUnitColor = getUnitColor(unitId).primary;
  const memberUnitNumeral = unitId ? (UNIT_ID_NUMERALS[unitId] ?? "") : "";

  return (
    <>
      <style>{styles}</style>
      <div className="chat-shell">
        <span className="chat-corner chat-corner-tl" />
        <span className="chat-corner chat-corner-tr" />
        <span className="chat-corner chat-corner-bl" />
        <span className="chat-corner chat-corner-br" />

        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <p className="sidebar-eyebrow">Channels</p>
            <h2 className="sidebar-title">War Room</h2>
            <Link href="/dashboard" className="sidebar-back">
              ← Dashboard
            </Link>
          </div>
          <nav className="sidebar-nav">
            {unitId && unitName && (
              <>
                <p className="sidebar-section-label">Your Unit</p>
                <button
                  className={`nav-btn ${activeTab === "unit" ? "active" : ""}`}
                  style={
                    { "--tab-color": memberUnitColor } as React.CSSProperties
                  }
                  onClick={() => setActiveTab("unit")}
                >
                  <span
                    className="nav-btn-indicator"
                    style={{ background: memberUnitColor }}
                  />
                  <span className="nav-btn-label">{unitName}</span>
                  <span
                    className="nav-btn-numeral"
                    style={{ color: memberUnitColor }}
                  >
                    {memberUnitNumeral}
                  </span>
                </button>
                <div className="sidebar-divider" />
              </>
            )}
            <p className="sidebar-section-label">General</p>
            <button
              className={`nav-btn ${activeTab === "general" ? "active" : ""}`}
              style={{ "--tab-color": "#C8A84B" } as React.CSSProperties}
              onClick={() => setActiveTab("general")}
            >
              <span className="nav-btn-indicator" />
              <span className="nav-btn-label">All Units</span>
              <span className="nav-btn-numeral" style={{ color: "#C8A84B" }}>
                ✦
              </span>
            </button>
          </nav>
        </aside>

        <div className="chat-main">
          {activeTab === "unit" ? (
            unitId && unitName ? (
              <UnitChat
                userId={userId}
                username={username}
                unitId={unitId}
                unitName={unitName}
              />
            ) : (
              <div className="no-unit-state">
                <div className="no-unit-ornament">✦</div>
                <h3 className="no-unit-title">No Unit Assigned</h3>
                <p className="no-unit-body">
                  You must be sworn into a unit before you may speak within its
                  walls.
                </p>
              </div>
            )
          ) : (
            <GeneralChat
              userId={userId}
              username={username}
              unitId={unitId}
              unitName={unitName}
            />
          )}
        </div>
      </div>
    </>
  );
}
