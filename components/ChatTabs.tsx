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

    /* ── SHELL ─────────────────────────────────────────── */
    .chat-shell {
      display: flex;
      height: 100%;
      gap: 1px;
      background: rgba(200,168,75,0.08);
      border: 1px solid rgba(200,168,75,0.10);
      position: relative;
      overflow: hidden;
    }
    .chat-shell::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: 0.038;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: overlay;
    }
    .chat-corner {
      position: absolute;
      width: 22px; height: 22px;
      border-color: rgba(200,168,75,0.22);
      border-style: solid;
      z-index: 2;
      pointer-events: none;
    }
    .chat-corner-tl { top:-1px; left:-1px; border-width:1px 0 0 1px; }
    .chat-corner-tr { top:-1px; right:-1px; border-width:1px 1px 0 0; }
    .chat-corner-bl { bottom:-1px; left:-1px; border-width:0 0 1px 1px; }
    .chat-corner-br { bottom:-1px; right:-1px; border-width:0 1px 1px 0; }

    /* ── DESKTOP SIDEBAR ───────────────────────────────── */
    .chat-sidebar {
      width: 220px;
      flex-shrink: 0;
      background: #0A0704;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(200,168,75,0.08);
    }
    .sidebar-header {
      padding: 1.4rem 1.4rem 1rem;
      border-bottom: 1px solid rgba(200,168,75,0.08);
      flex-shrink: 0;
    }
    .sidebar-eyebrow {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.6rem;
      letter-spacing: 0.45em;
      text-transform: uppercase;
      color: #7D6328;
      font-weight: 300;
      margin-bottom: 0.3rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .sidebar-eyebrow::before {
      content: '';
      display: inline-block;
      width: 14px; height: 1px;
      background: #7D6328;
      opacity: 0.5;
    }
    .sidebar-title {
      font-family: 'Playfair Display', serif;
      font-size: 1rem;
      font-weight: 700;
      font-style: italic;
      color: #EDE3D0;
      line-height: 1.1;
    }
    .sidebar-back {
      display: block;
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.62rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #7D6328;
      font-weight: 300;
      text-decoration: none;
      margin-top: 0.8rem;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .sidebar-back:hover { opacity: 1; }
    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 0.8rem 0;
      scrollbar-width: thin;
      scrollbar-color: rgba(200,168,75,0.1) transparent;
    }
    .sidebar-section-label {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.56rem;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: rgba(125,99,40,0.5);
      font-weight: 300;
      padding: 0 1.4rem;
      margin: 0.7rem 0 0.4rem;
    }
    .sidebar-divider {
      height: 1px;
      background: rgba(200,168,75,0.07);
      margin: 0.5rem 1rem;
    }

    /* ── NAV BUTTON (sidebar) ──────────────────────────── */
    .nav-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 1.4rem;
      background: transparent;
      border: none;
      cursor: pointer;
      position: relative;
      transition: background 0.25s ease;
      text-align: left;
    }
    .nav-btn:hover { background: rgba(200,168,75,0.04); }
    .nav-btn.active { background: rgba(200,168,75,0.07); }
    .nav-btn.active::before {
      content: '';
      position: absolute;
      left: 0; top: 0;
      width: 2px; height: 100%;
      background: var(--tab-color, #C8A84B);
    }
    .nav-btn-indicator {
      width: 6px; height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--tab-color, rgba(200,168,75,0.4));
      opacity: 0.5;
      transition: opacity 0.2s;
    }
    .nav-btn.active .nav-btn-indicator { opacity: 1; }
    .nav-btn-label {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.82rem;
      font-weight: 400;
      color: rgba(201,180,154,0.45);
      letter-spacing: 0.02em;
      transition: color 0.2s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    .nav-btn.active .nav-btn-label { color: #EDE3D0; }
    .nav-btn:hover .nav-btn-label { color: rgba(201,180,154,0.75); }
    .nav-btn-numeral {
      font-family: 'Playfair Display', serif;
      font-size: 0.65rem;
      font-style: italic;
      font-weight: 900;
      opacity: 0.2;
      flex-shrink: 0;
    }
    .nav-btn.active .nav-btn-numeral { opacity: 0.5; }

    /* ── MOBILE TAB BAR ────────────────────────────────── */
    .chat-mobile-tabs {
      display: none;
      background: #0A0704;
      border-bottom: 1px solid rgba(200,168,75,0.1);
      overflow-x: auto;
      scrollbar-width: none;
      flex-shrink: 0;
    }
    .chat-mobile-tabs::-webkit-scrollbar { display: none; }
    .chat-mobile-tabs-inner {
      display: flex;
      align-items: stretch;
      min-width: max-content;
      padding: 0 0.5rem;
    }
    .mob-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;
      padding: 0.6rem 1rem;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      white-space: nowrap;
      position: relative;
    }
    .mob-tab.active {
      border-bottom-color: var(--tab-color, #C8A84B);
      background: rgba(200,168,75,0.05);
    }
    .mob-tab-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--tab-color, rgba(200,168,75,0.4));
      opacity: 0.5;
      transition: opacity 0.2s;
    }
    .mob-tab.active .mob-tab-dot { opacity: 1; }
    .mob-tab-label {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      color: rgba(201,180,154,0.45);
      transition: color 0.2s;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mob-tab.active .mob-tab-label { color: #EDE3D0; }

    /* ── MAIN CHAT AREA ────────────────────────────────── */
    .chat-main {
      flex: 1;
      overflow: hidden;
      background: #080604;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    /* ── STATES ────────────────────────────────────────── */
    .no-unit-state {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 1.2rem;
      padding: 3rem;
    }
    .no-unit-ornament {
      font-family: 'Playfair Display', serif;
      font-size: 4rem;
      font-weight: 900;
      font-style: italic;
      color: rgba(200,168,75,0.06);
      line-height: 1;
    }
    .no-unit-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      font-weight: 700;
      font-style: italic;
      color: #EDE3D0;
      text-align: center;
    }
    .no-unit-body {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1rem;
      font-style: italic;
      color: rgba(201,180,154,0.4);
      text-align: center;
      max-width: 300px;
      line-height: 1.7;
    }
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.85rem;
      font-style: italic;
      color: rgba(201,180,154,0.3);
      letter-spacing: 0.2em;
    }

    /* ── RESPONSIVE ────────────────────────────────────── */
    @media (max-width: 640px) {
      .chat-shell {
        flex-direction: column;
        border-left: none;
        border-right: none;
        border-radius: 0;
      }
      .chat-sidebar { display: none; }
      .chat-mobile-tabs { display: flex; }
      .chat-corner { display: none; }
    }
  `;

  // ── Build tab list for mobile ───────────────────────────────────
  type TabItem = { id: string; label: string; color: string; numeral?: string };
  let mobileTabs: TabItem[] = [];

  if (isOwner) {
    mobileTabs = [
      { id: "general", label: "All Units", color: "#C8A84B", numeral: "✦" },
      ...units.map((u) => ({
        id: u.id,
        label: u.name,
        color: getUnitColor(u.id).primary,
        numeral: UNIT_ID_NUMERALS[u.id] ?? "",
      })),
    ];
  } else {
    if (unitId && unitName) {
      mobileTabs.push({
        id: "unit",
        label: unitName,
        color: getUnitColor(unitId).primary,
        numeral: UNIT_ID_NUMERALS[unitId] ?? "",
      });
    }
    mobileTabs.push({
      id: "general",
      label: "All Units",
      color: "#C8A84B",
      numeral: "✦",
    });
  }

  // ── Render ──────────────────────────────────────────────────────
  const renderChatArea = () => {
    if (isOwner) {
      if (activeTab === "general") {
        return (
          <GeneralChat
            userId={userId}
            username={username}
            unitId={null}
            unitName={null}
          />
        );
      }
      if (activeUnit) {
        return (
          <UnitChat
            userId={userId}
            username={username}
            unitId={activeUnit.id}
            unitName={activeUnit.name}
          />
        );
      }
      return <div className="loading-state">Select a channel</div>;
    }

    if (activeTab === "unit") {
      if (unitId && unitName) {
        return (
          <UnitChat
            userId={userId}
            username={username}
            unitId={unitId}
            unitName={unitName}
          />
        );
      }
      return (
        <div className="no-unit-state">
          <div className="no-unit-ornament">✦</div>
          <h3 className="no-unit-title">No Unit Assigned</h3>
          <p className="no-unit-body">
            You must be sworn into a unit before you may speak within its walls.
          </p>
        </div>
      );
    }

    return (
      <GeneralChat
        userId={userId}
        username={username}
        unitId={unitId}
        unitName={unitName}
      />
    );
  };

  if (isOwner) {
    return (
      <>
        <style>{styles}</style>
        <div className="chat-shell">
          <span className="chat-corner chat-corner-tl" />
          <span className="chat-corner chat-corner-tr" />
          <span className="chat-corner chat-corner-bl" />
          <span className="chat-corner chat-corner-br" />

          {/* Desktop sidebar */}
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

          {/* Mobile top tabs */}
          <div className="chat-mobile-tabs">
            <div className="chat-mobile-tabs-inner">
              {loadingUnits ? (
                <div
                  style={{
                    padding: "0.8rem 1rem",
                    color: "rgba(201,180,154,0.3)",
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: "0.75rem",
                    fontStyle: "italic",
                  }}
                >
                  Loading…
                </div>
              ) : (
                mobileTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`mob-tab ${activeTab === tab.id ? "active" : ""}`}
                    style={{ "--tab-color": tab.color } as React.CSSProperties}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span
                      className="mob-tab-dot"
                      style={{ background: tab.color }}
                    />
                    <span className="mob-tab-label">{tab.label}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="chat-main">{renderChatArea()}</div>
        </div>
      </>
    );
  }

  // ── Member view ─────────────────────────────────────────────────
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

        {/* Desktop sidebar */}
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

        {/* Mobile top tabs */}
        <div className="chat-mobile-tabs">
          <div className="chat-mobile-tabs-inner">
            {mobileTabs.map((tab) => (
              <button
                key={tab.id}
                className={`mob-tab ${activeTab === tab.id ? "active" : ""}`}
                style={{ "--tab-color": tab.color } as React.CSSProperties}
                onClick={() => setActiveTab(tab.id)}
              >
                <span
                  className="mob-tab-dot"
                  style={{ background: tab.color }}
                />
                <span className="mob-tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="chat-main">{renderChatArea()}</div>
      </div>
    </>
  );
}
