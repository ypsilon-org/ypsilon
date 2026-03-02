"use client";

import Link from "next/link";

const UNIT_COLORS = {
  Einherjar: { primary: "#6FF3FF", accent: "#29848e" },
  "Legio X Equestris": { primary: "#8A3FFC", accent: "#5A23B0" },
  Myrmidons: { primary: "#A6FF00", accent: "#5FAE00" },
  "Narayani Sena": { primary: "#FFC83D", accent: "#C99700" },
  Spartans: { primary: "#FF6A00", accent: "#C94F00" },
};

const units = [
  {
    name: "Einherjar",
    description: "Warriors chosen for valor and honor",
    fullDescription:
      "Named after the legendary Norse warriors who dwell in Valhalla, the Einherjar embody courage, loyalty, and the warrior spirit. Members of this unit value honor above all else.",
  },
  {
    name: "Legio X Equestris",
    description: "Strategic minds and tactical excellence",
    fullDescription:
      "Following in the footsteps of Caesar's most trusted legion, this unit represents discipline, strategy, and tactical mastery. Members excel in planning and execution.",
  },
  {
    name: "Myrmidons",
    description: "Elite fighters and skilled warriors",
    fullDescription:
      "Drawing inspiration from Achilles' legendary warriors, the Myrmidons are known for their exceptional combat prowess and unwavering dedication to excellence in every endeavor.",
  },
  {
    name: "Narayani Sena",
    description: "Divine warriors with unbreakable resolve",
    fullDescription:
      "Named after the celestial army of Hindu mythology, this unit represents spiritual strength, wisdom, and an indomitable will to overcome any challenge.",
  },
  {
    name: "Spartans",
    description: "Disciplined, resilient, and relentless",
    fullDescription:
      "Embodying the spirit of ancient Sparta, these warriors are known for their discipline, physical prowess, and the famous Spartan resolve to never surrender.",
  },
];

const coreValues = [
  {
    title: "Excellence",
    body: "Striving for the highest standards in everything we do",
  },
  { title: "Community", body: "Supporting each other and growing together" },
  {
    title: "Integrity",
    body: "Acting with honor and staying true to our principles",
  },
  {
    title: "Growth",
    body: "Continuously learning and evolving as individuals",
  },
];

const generals = [
  {
    numeral: "I",
    name: "Odin",
    unit: "Einherjar",
    color: "#6FF3FF",
    epithet:
      "The Allfather who sacrificed an eye for wisdom — he sees what others cannot, and leads with the calm authority of one who has already glimpsed the end.",
  },
  {
    numeral: "II",
    name: "Caesar",
    unit: "Legio X Equestris",
    color: "#8A3FFC",
    epithet:
      "He crossed the Rubicon alone. A strategist without equal — Caesar does not wait for permission to make history.",
  },
  {
    numeral: "III",
    name: "Achilles",
    unit: "Myrmidons",
    color: "#A6FF00",
    epithet:
      "The swiftest, the deadliest — a warrior who chose a short life of glory over a long life of obscurity. His rage is a weapon; his loyalty, unbreakable.",
  },
  {
    numeral: "IV",
    name: "Krishna",
    unit: "Narayani Sena",
    color: "#FFC83D",
    epithet:
      "On the eve of the greatest war ever fought, he delivered the Gita. Warrior, philosopher, god — he leads not just armies but souls.",
  },
  {
    numeral: "V",
    name: "Hercules",
    unit: "Spartans",
    color: "#FF6A00",
    epithet:
      "Twelve labors. Twelve impossibilities. Completed. He does not bend to the weight of the world — he lifts it.",
  },
];

const steps = [
  {
    n: "I",
    title: "Sign Up",
    body: "Create your account and choose the unit that best represents your values and aspirations.",
  },
  {
    n: "II",
    title: "Connect",
    body: "Join your unit's community, meet fellow members, and participate in discussions and events.",
  },
  {
    n: "III",
    title: "Grow",
    body: "Earn achievements, rise through the ranks, and contribute to your unit's legacy.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bone: #EDE3D0;
          --parchment: #C9B49A;
          --crimson: #8B0A0A;
          --gold: #C8A84B;
          --gold-dim: #7D6328;
          --ink: #080604;
          --dark: #0D0A06;
          --mid: #181108;
          --warm: #201508;
        }

        .about-root {
          min-height: 100vh;
          background: var(--ink);
          color: var(--bone);
          font-family: 'EB Garamond', Georgia, serif;
          overflow-x: hidden;
          cursor: default;
        }

        .about-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.038;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: overlay;
        }

        /* ─── HERO ─── */
        .hero {
          position: relative;
          min-height: 72vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(9rem, 18vh, 15rem) 6vw 7rem;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 70% 50%, rgba(30,18,8,0.0) 0%, var(--ink) 70%),
            radial-gradient(ellipse 40% 60% at 30% 40%, rgba(139,0,0,0.08) 0%, transparent 60%),
            linear-gradient(160deg, #1A0D05 0%, var(--ink) 40%, #0D0A06 100%);
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(5,3,2,0.7) 80%, rgba(2,1,1,0.95) 100%);
        }

        .hero-figure {
          position: absolute;
          right: 8%;
          top: 50%;
          transform: translateY(-50%);
          width: 300px;
          height: 460px;
          opacity: 0.09;
          background: linear-gradient(to bottom, rgba(201,168,76,0.3) 0%, rgba(201,168,76,0.05) 40%, transparent 100%);
          border-top: 1px solid rgba(201,168,76,0.2);
          filter: blur(0.5px);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          animation: fadeIn 2s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.7rem, 1.2vw, 0.9rem);
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--gold-dim);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .eyebrow::before {
          content: '';
          display: inline-block;
          width: 40px; height: 1px;
          background: var(--gold-dim);
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.5rem, 8vw, 7rem);
          font-weight: 900;
          line-height: 0.92;
          letter-spacing: -0.02em;
          color: var(--bone);
          text-shadow: 0 0 120px rgba(139,0,0,0.15), 2px 4px 20px rgba(0,0,0,0.8);
          margin-bottom: 0.2em;
        }
        .hero-title em { font-style: italic; color: var(--crimson); display: block; }

        .hero-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
        }
        .hero-divider-line {
          height: 1px; flex: 1; max-width: 80px;
          background: linear-gradient(to right, var(--gold), transparent);
        }
        .hero-divider-ornament { color: var(--gold); font-size: 1rem; opacity: 0.6; }

        .hero-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          font-weight: 300;
          font-style: italic;
          color: rgba(240,230,211,0.55);
          max-width: 520px;
          line-height: 1.7;
        }

        /* ─── SHARED ─── */
        .section-eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.72rem;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: var(--gold-dim);
          font-weight: 300;
          margin-bottom: 1.4rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .section-eyebrow::before {
          content: '';
          display: inline-block;
          width: 35px; height: 1px;
          background: var(--gold-dim);
          opacity: 0.55;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          font-weight: 700;
          color: var(--bone);
          line-height: 1.05;
          text-shadow: 0 2px 30px rgba(0,0,0,0.5);
        }
        .section-title em {
          font-style: italic;
          color: rgba(237,227,208,0.38);
          font-weight: 400;
        }

        /* ─── INTERSTITIAL ─── */
        .interstitial {
          text-align: center;
          padding: 2rem 0 1.5rem;
          color: rgba(200,168,75,0.28);
          font-size: 1.1rem;
          letter-spacing: 1.2em;
        }

        /* ─── MISSION ─── */
        .mission {
          padding: clamp(4rem, 9vh, 8rem) 6vw;
          max-width: 1300px;
          margin: 0 auto;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
        }
        @media (max-width: 820px) {
          .mission-grid { grid-template-columns: 1fr; gap: 3rem; }
        }

        .mission-body {
          font-family: 'EB Garamond', serif;
          font-size: 1.12rem;
          line-height: 1.9;
          color: var(--parchment);
          opacity: 0.8;
          font-style: italic;
          margin-bottom: 1.4rem;
        }

        .values-panel {
          background: linear-gradient(135deg, rgba(20,13,6,0.95), rgba(13,10,6,0.98));
          border: 1px solid rgba(200,168,75,0.13);
          padding: 3.5rem 3rem;
          position: relative;
        }
        .values-panel::before, .values-panel::after {
          content: '';
          position: absolute;
          width: 28px; height: 28px;
          border-color: rgba(200,168,75,0.28);
          border-style: solid;
        }
        .values-panel::before { top:-1px; left:-1px; border-width: 1px 0 0 1px; }
        .values-panel::after  { bottom:-1px; right:-1px; border-width: 0 1px 1px 0; }

        .values-panel-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--bone);
          margin-bottom: 2rem;
          font-style: italic;
        }

        .value-item {
          display: flex;
          gap: 1.2rem;
          padding: 1.4rem 0;
          border-bottom: 1px solid rgba(200,168,75,0.08);
        }
        .value-item:last-child { border-bottom: none; padding-bottom: 0; }
        .value-item:first-child { padding-top: 0; }

        .value-bullet { color: var(--crimson); font-size: 1.2rem; line-height: 1.6; flex-shrink: 0; }
        .value-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--bone);
          margin-bottom: 0.3rem;
        }
        .value-body {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          font-style: italic;
          color: var(--parchment);
          opacity: 0.65;
          line-height: 1.6;
        }

        /* ─── UNITS ─── */
        .units-section {
          padding: clamp(4rem, 9vh, 8rem) 6vw;
          max-width: 1300px;
          margin: 0 auto;
        }
        .units-header { margin-bottom: 4.5rem; }

        .units-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(200,168,75,0.08);
          border: 1px solid rgba(200,168,75,0.08);
        }
        @media (max-width: 900px) { .units-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .units-grid { grid-template-columns: 1fr; } }

        .unit-card {
          background: var(--dark);
          padding: 3rem 2.8rem;
          position: relative;
          overflow: hidden;
          transition: background 0.5s ease;
        }
        .unit-top-bar {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.77,0,0.175,1);
        }
        .unit-card:hover .unit-top-bar { transform: scaleX(1); }
        .unit-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 1px; height: 0;
          background: var(--gold);
          transition: height 0.65s cubic-bezier(0.77,0,0.175,1);
        }
        .unit-card:hover { background: #0E0B07; }
        .unit-card:hover::after { height: 100%; }

        .unit-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1.1;
        }
        .unit-description {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.82rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold-dim);
          font-weight: 300;
          margin-bottom: 1.5rem;
        }
        .unit-rule {
          width: 28px; height: 1px;
          background: var(--gold);
          margin-bottom: 1.5rem;
          opacity: 0.4;
          transition: width 0.4s ease, opacity 0.4s ease;
        }
        .unit-card:hover .unit-rule { width: 50px; opacity: 0.85; }
        .unit-body {
          font-family: 'EB Garamond', serif;
          font-size: 1.02rem;
          font-style: italic;
          line-height: 1.85;
          color: var(--parchment);
          opacity: 0.65;
        }

        /* ─── GENERALS ─── */
        .generals-section {
          padding: clamp(4rem, 9vh, 8rem) 6vw;
          max-width: 1300px;
          margin: 0 auto;
        }
        .generals-header { margin-bottom: 4.5rem; }

        .generals-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1px;
          background: rgba(200,168,75,0.08);
          border: 1px solid rgba(200,168,75,0.08);
        }
        @media (max-width: 1100px) { .generals-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px)  { .generals-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 380px)  { .generals-grid { grid-template-columns: 1fr; } }

        .general-card {
          background: var(--dark);
          padding: 2.8rem 2.2rem;
          position: relative;
          overflow: hidden;
          transition: background 0.5s ease;
          display: flex;
          flex-direction: column;
        }
        .general-top-bar {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.77,0,0.175,1);
        }
        .general-card:hover .general-top-bar { transform: scaleX(1); }
        .general-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 1px; height: 0;
          background: var(--gold);
          transition: height 0.65s cubic-bezier(0.77,0,0.175,1);
        }
        .general-card:hover { background: #0E0B07; }
        .general-card:hover::after { height: 100%; }

        .general-numeral {
          font-family: 'Playfair Display', serif;
          font-size: 3.8rem;
          font-weight: 900;
          font-style: italic;
          color: rgba(200,168,75,0.05);
          line-height: 1;
          margin-bottom: 1.4rem;
          user-select: none;
        }
        .general-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 1.0;
          margin-bottom: 0.4rem;
        }
        .general-unit-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold-dim);
          font-weight: 300;
          margin-bottom: 1.4rem;
        }
        .general-rule {
          width: 24px; height: 1px;
          background: var(--gold);
          margin-bottom: 1.3rem;
          opacity: 0.4;
          transition: width 0.4s ease, opacity 0.4s ease;
        }
        .general-card:hover .general-rule { width: 46px; opacity: 0.85; }
        .general-epithet {
          font-family: 'EB Garamond', serif;
          font-size: 0.98rem;
          font-style: italic;
          line-height: 1.85;
          color: var(--parchment);
          opacity: 0.62;
        }

        /* ─── HOW IT WORKS ─── */
        .how-section {
          padding: clamp(5rem, 10vh, 9rem) 6vw;
          background: linear-gradient(to bottom, var(--ink) 0%, #0C0906 50%, var(--ink) 100%);
        }
        .how-inner { max-width: 1300px; margin: 0 auto; }
        .how-header { margin-bottom: 5rem; }

        .how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(200,168,75,0.08);
          border: 1px solid rgba(200,168,75,0.08);
        }
        @media (max-width: 720px) { .how-grid { grid-template-columns: 1fr; } }

        .how-step {
          background: var(--dark);
          padding: 4rem 3.2rem;
          position: relative;
          overflow: hidden;
          transition: background 0.5s ease;
        }
        .how-step::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 2px;
          background: linear-gradient(to right, var(--crimson), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.55s cubic-bezier(0.77,0,0.175,1);
        }
        .how-step::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 1px; height: 0;
          background: var(--gold);
          transition: height 0.65s cubic-bezier(0.77,0,0.175,1);
        }
        .how-step:hover { background: #121009; }
        .how-step:hover::before { transform: scaleX(1); }
        .how-step:hover::after { height: 100%; }

        .step-num {
          font-family: 'Playfair Display', serif;
          font-size: 5rem;
          font-weight: 900;
          font-style: italic;
          color: rgba(200,168,75,0.06);
          line-height: 1;
          margin-bottom: 2rem;
        }
        .step-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--bone);
          margin-bottom: 1rem;
        }
        .step-rule {
          width: 28px; height: 1px;
          background: var(--gold);
          margin-bottom: 1.5rem;
          opacity: 0.4;
          transition: width 0.4s ease, opacity 0.4s ease;
        }
        .how-step:hover .step-rule { width: 50px; opacity: 0.85; }
        .step-body {
          font-family: 'EB Garamond', serif;
          font-size: 1.05rem;
          font-style: italic;
          line-height: 1.9;
          color: var(--parchment);
          opacity: 0.65;
        }

        /* ─── CTA ─── */
        .cta-section {
          padding: clamp(5rem, 10vh, 9rem) 6vw;
          max-width: 1100px;
          margin: 0 auto;
        }
        .cta-inner {
          background: linear-gradient(135deg, rgba(20,13,6,0.95), rgba(13,10,6,0.98));
          border: 1px solid rgba(200,168,75,0.13);
          padding: clamp(4rem, 7vw, 7rem) clamp(3rem, 6vw, 6rem);
          position: relative;
          text-align: center;
          overflow: hidden;
        }
        .cta-inner::before, .cta-inner::after,
        .cta-tr, .cta-bl {
          position: absolute;
          width: 36px; height: 36px;
          border-color: rgba(200,168,75,0.28);
          border-style: solid;
          content: '';
        }
        .cta-inner::before { top:-1px; left:-1px;   border-width: 1px 0 0 1px; }
        .cta-inner::after  { bottom:-1px; right:-1px; border-width: 0 1px 1px 0; }
        .cta-tr { top:-1px; right:-1px;  border-width: 1px 1px 0 0; }
        .cta-bl { bottom:-1px; left:-1px; border-width: 0 0 1px 1px; }

        .cta-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,10,10,0.04) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 900;
          color: var(--bone);
          line-height: 1.0;
          margin-bottom: 1.2rem;
          position: relative;
        }
        .cta-title em {
          font-style: italic;
          color: rgba(237,227,208,0.42);
          font-weight: 400;
          display: block;
        }
        .cta-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-style: italic;
          color: rgba(240,230,211,0.45);
          max-width: 520px;
          margin: 0 auto 3rem;
          line-height: 1.75;
          position: relative;
        }
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1.2rem;
          flex-wrap: wrap;
          position: relative;
        }

        /* ─── BUTTONS ─── */
        .btn-primary {
          display: inline-block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: var(--bone);
          background: transparent;
          border: 1px solid rgba(139,10,10,0.6);
          padding: 1.15rem 3.2rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: border-color 0.4s ease;
          text-decoration: none;
        }
        .btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--crimson);
          transform: translateX(-101%);
          transition: transform 0.45s cubic-bezier(0.77,0,0.175,1);
        }
        .btn-primary:hover::before { transform: translateX(0); }
        .btn-primary:hover { border-color: var(--crimson); }
        .btn-primary span { position: relative; z-index: 1; }

        .btn-ghost {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.78rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--parchment);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 1.15rem 2.2rem;
          opacity: 0.6;
          transition: opacity 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-ghost:hover { opacity: 1; }

        /* ─── FOOTER ─── */
        footer {
          border-top: 1px solid rgba(200,168,75,0.09);
          padding: 3.2rem 6vw;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-brand {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-style: italic;
          color: var(--parchment);
          opacity: 0.45;
          letter-spacing: 0.05em;
        }
        .footer-copy {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          color: var(--gold-dim);
          opacity: 0.45;
          font-weight: 300;
        }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-vignette" />
        <div className="hero-figure" />
        <div className="hero-content">
          <div className="eyebrow">Est. MMXXVI</div>
          <h1 className="hero-title">
            About
            <em>the name.</em>
          </h1>
          <div className="hero-divider">
            <div className="hero-divider-line" />
            <span className="hero-divider-ornament">✦</span>
          </div>
          <p className="hero-sub">
            A community of like-minded individuals united by shared values,
            organized into legendary units — each with its own identity,
            purpose, and honor.
          </p>
        </div>
      </section>

      <div className="interstitial">· · ·</div>

      {/* ─── MISSION ─── */}
      <section className="mission">
        <div className="mission-grid">
          <div>
            <p className="section-eyebrow">Why We Exist</p>
            <h2 className="section-title" style={{ marginBottom: "2.5rem" }}>
              Our Mission
            </h2>
            <p className="mission-body">
              We believe in the power of community to transform individuals and
              create lasting impact. Our mission is to provide a space where
              people can connect with others who share their passions, learn
              from each other, and grow together.
            </p>
            <p className="mission-body">
              Through our unique unit system, members find their tribe and
              contribute to something greater than themselves.
            </p>
          </div>
          <div className="values-panel">
            <h3 className="values-panel-title">Core Values</h3>
            {coreValues.map((v) => (
              <div key={v.title} className="value-item">
                <span className="value-bullet">✦</span>
                <div>
                  <div className="value-title">{v.title}</div>
                  <div className="value-body">{v.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="interstitial">· · ·</div>

      {/* ─── UNITS ─── */}
      <section className="units-section">
        <div className="units-header">
          <p className="section-eyebrow">The Orders</p>
          <h2 className="section-title">Our Units</h2>
          <h2 className="section-title">
            <em>Choose your allegiance.</em>
          </h2>
        </div>
        <div className="units-grid">
          {units.map((unit) => {
            const colors = UNIT_COLORS[unit.name as keyof typeof UNIT_COLORS];
            return (
              <div key={unit.name} className="unit-card">
                <div
                  className="unit-top-bar"
                  style={{
                    background: `linear-gradient(to right, ${colors.primary}, transparent)`,
                  }}
                />
                <h3 className="unit-name" style={{ color: colors.primary }}>
                  {unit.name}
                </h3>
                <p className="unit-description">{unit.description}</p>
                <div className="unit-rule" />
                <p className="unit-body">{unit.fullDescription}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="interstitial">· · ·</div>

      {/* ─── THE FIVE GENERALS ─── */}
      <section className="generals-section">
        <div className="generals-header">
          <p className="section-eyebrow">The High Command</p>
          <h2 className="section-title">The Five Generals</h2>
          <h2 className="section-title">
            <em>Legends who lead.</em>
          </h2>
        </div>
        <div className="generals-grid">
          {generals.map((g) => (
            <div key={g.name} className="general-card">
              <div
                className="general-top-bar"
                style={{
                  background: `linear-gradient(to right, ${g.color}, transparent)`,
                }}
              />
              <div className="general-numeral">{g.numeral}</div>
              <h3 className="general-name" style={{ color: g.color }}>
                {g.name}
              </h3>
              <p className="general-unit-label">{g.unit}</p>
              <div className="general-rule" />
              <p className="general-epithet">{g.epithet}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="interstitial">· · ·</div>

      {/* ─── HOW IT WORKS ─── */}
      <section className="how-section">
        <div className="how-inner">
          <div className="how-header">
            <p className="section-eyebrow">The Path</p>
            <h2 className="section-title">How It Works</h2>
            <h2 className="section-title">
              <em>Three steps to the family.</em>
            </h2>
          </div>
          <div className="how-grid">
            {steps.map((s) => (
              <div key={s.n} className="how-step">
                <div className="step-num">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <div className="step-rule" />
                <p className="step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="cta-inner">
          <span className="cta-tr" />
          <span className="cta-bl" />
          <div className="cta-glow" />
          <h3 className="cta-title">
            Ready to find
            <em>your unit?</em>
          </h3>
          <p className="cta-sub">
            Membership is not given. It is earned. Choose your unit, prove your
            worth, and join the family.
          </p>
          <div className="cta-buttons">
            <Link href="/signup" className="btn-primary">
              <span>Join Now</span>
            </Link>
            <Link href="/" className="btn-ghost">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer>
        <span className="footer-brand">the name.</span>
        <span className="footer-copy">
          © 2026 — All rights reserved. Omertà.
        </span>
      </footer>
    </div>
  );
}
