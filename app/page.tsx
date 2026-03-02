"use client";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const heroContentRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (heroContentRef.current) {
      heroContentRef.current.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContentRef.current.style.opacity = `${Math.max(0, 1 - scrollY / 550)}`;
    }
  }, [scrollY]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bone: #EDE3D0;
          --parchment: #C9B49A;
          --crimson: #8B0A0A;
          --crimson-glow: #A01515;
          --gold: #C8A84B;
          --gold-dim: #7D6328;
          --ink: #080604;
          --dark: #0D0A06;
          --mid: #181108;
          --warm: #201508;
          --fog: rgba(8,6,4,0.93);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--ink);
          color: var(--bone);
          font-family: 'EB Garamond', Georgia, serif;
          overflow-x: hidden;
          cursor: default;
        }

        /* Film grain overlay */
        body::before {
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
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 6vw;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 70% 50%, rgba(30, 18, 8, 0.0) 0%, var(--ink) 70%),
            radial-gradient(ellipse 40% 60% at 30% 40%, rgba(139, 0, 0, 0.08) 0%, transparent 60%),
            linear-gradient(160deg, #1A0D05 0%, var(--ink) 40%, #0D0A06 100%);
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(5, 3, 2, 0.7) 80%, rgba(2, 1, 1, 0.95) 100%);
        }

        .hero-figure {
          position: absolute;
          right: 8%;
          top: 50%;
          transform: translateY(-50%);
          width: 340px;
          height: 520px;
          opacity: 0.12;
          background: linear-gradient(to bottom, rgba(201, 168, 76, 0.3) 0%, rgba(201, 168, 76, 0.05) 40%, transparent 100%);
          border-top: 1px solid rgba(201, 168, 76, 0.2);
          filter: blur(0.5px);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 680px;
          animation: fadeIn 2s ease forwards;
          will-change: transform, opacity;
          padding-top: clamp(7rem, 14vh, 11rem);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
          width: 40px;
          height: 1px;
          background: var(--gold-dim);
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.5rem, 8vw, 7rem);
          font-weight: 900;
          line-height: 0.92;
          letter-spacing: -0.02em;
          color: var(--bone);
          text-shadow:
            0 0 120px rgba(139, 0, 0, 0.15),
            2px 4px 20px rgba(0,0,0,0.8);
          margin-bottom: 0.2em;
        }

        .hero-title em {
          font-style: italic;
          color: var(--crimson);
          display: block;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .divider-line {
          height: 1px;
          flex: 1;
          max-width: 80px;
          background: linear-gradient(to right, var(--gold), transparent);
        }

        .divider-ornament {
          color: var(--gold);
          font-size: 1rem;
          opacity: 0.6;
        }

        .hero-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          font-weight: 300;
          font-style: italic;
          color: rgba(240, 230, 211, 0.55);
          max-width: 440px;
          line-height: 1.7;
          margin-bottom: 3rem;
        }

        .hero-cta {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

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
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
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
        }
        .btn-ghost:hover { opacity: 1; }

        @media (max-width: 640px) {
          .hero-figure { display: none; }
        }

        /* ─── INTERSTITIAL ─── */
        .interstitial {
          text-align: center;
          padding: 2rem 0 1.5rem;
          color: rgba(200,168,75,0.3);
          font-size: 1.1rem;
          letter-spacing: 1.2em;
        }

        /* ─── PILLARS ─── */
        .pillars {
          padding: clamp(5rem, 11vh, 9rem) clamp(2.5rem, 8vw, 8rem);
          max-width: 1380px;
          margin: 0 auto;
        }

        .pillars-header {
          margin-bottom: 5.5rem;
        }

        .section-eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.7rem;
          letter-spacing: 0.52em;
          text-transform: uppercase;
          color: var(--gold-dim);
          font-weight: 300;
          margin-bottom: 1.6rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .section-eyebrow::before {
          content: '';
          display: block;
          width: 35px;
          height: 1px;
          background: var(--gold-dim);
          opacity: 0.5;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 6.5vw, 5.5rem);
          font-weight: 700;
          color: var(--bone);
          line-height: 1.0;
          text-shadow: 0 2px 30px rgba(0,0,0,0.6);
        }

        .section-title em {
          display: block;
          font-style: italic;
          color: rgba(237,227,208,0.35);
          font-weight: 400;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(200,168,75,0.08);
          border: 1px solid rgba(200,168,75,0.08);
        }

        @media (max-width: 780px) {
          .pillars-grid { grid-template-columns: 1fr; }
        }

        .pillar {
          background: var(--dark);
          padding: 4rem 3.2rem;
          position: relative;
          overflow: hidden;
          transition: background 0.5s ease;
        }

        /* Top crimson reveal bar */
        .pillar::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, var(--crimson), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.55s cubic-bezier(0.77,0,0.175,1);
        }

        /* Left gold vertical line */
        .pillar::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 1px;
          height: 0;
          background: var(--gold);
          transition: height 0.65s cubic-bezier(0.77,0,0.175,1);
        }

        .pillar:hover { background: #121009; }
        .pillar:hover::before { transform: scaleX(1); }
        .pillar:hover::after { height: 100%; }

        .pillar-num {
          font-family: 'Playfair Display', serif;
          font-size: 5rem;
          font-weight: 900;
          font-style: italic;
          color: rgba(200,168,75,0.06);
          line-height: 1;
          margin-bottom: 2rem;
        }

        .pillar-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--bone);
          margin-bottom: 1.1rem;
        }

        .pillar-rule {
          width: 28px;
          height: 1px;
          background: var(--gold);
          margin-bottom: 1.6rem;
          opacity: 0.45;
          transition: width 0.4s ease, opacity 0.4s ease;
        }

        .pillar:hover .pillar-rule { width: 55px; opacity: 0.9; }

        .pillar-body {
          font-family: 'EB Garamond', serif;
          font-size: 1.08rem;
          font-style: italic;
          line-height: 1.95;
          color: var(--parchment);
          opacity: 0.68;
        }

        /* ─── QUOTE ─── */
        .quote-section {
          padding: clamp(6rem, 14vh, 12rem) clamp(2.5rem, 8vw, 8rem);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .quote-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 90% 70% at 50% 50%, rgba(139,10,10,0.055) 0%, transparent 65%),
            linear-gradient(to bottom, var(--ink), #0B0805, var(--ink));
        }

        .quote-mark {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 9rem;
          line-height: 0.45;
          color: var(--crimson);
          opacity: 0.18;
          margin-bottom: 1rem;
          position: relative;
        }

        .quote-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 4vw, 3.2rem);
          font-style: italic;
          font-weight: 400;
          color: var(--bone);
          max-width: 820px;
          margin: 0 auto;
          line-height: 1.45;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 40px rgba(0,0,0,0.7);
        }

        .quote-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin: 2.5rem auto;
          max-width: 300px;
        }

        .q-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--gold-dim));
        }
        .q-line:last-child {
          background: linear-gradient(to left, transparent, var(--gold-dim));
        }

        .q-ornament {
          color: var(--gold-dim);
          font-size: 0.7rem;
          opacity: 0.6;
        }

        .quote-attr {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.75rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--gold-dim);
          font-weight: 300;
          position: relative;
          z-index: 1;
        }

        /* ─── CTA ─── */
        .cta-section {
          padding: clamp(4rem, 9vh, 8rem) clamp(2.5rem, 8vw, 8rem);
          max-width: 1380px;
          margin: 0 auto;
        }

        .cta-inner {
          background: linear-gradient(135deg, rgba(24,17,8,0.95), rgba(13,10,6,0.98));
          border: 1px solid rgba(200,168,75,0.13);
          padding: clamp(3.5rem, 7vw, 7rem) clamp(3rem, 6vw, 6rem);
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 5rem;
        }

        @media (max-width: 720px) {
          .cta-inner { grid-template-columns: 1fr; gap: 2.5rem; }
        }

        /* Corner brackets — all four */
        .cta-inner::before,
        .cta-inner::after {
          content: '';
          position: absolute;
          width: 40px;
          height: 40px;
          border-color: rgba(200,168,75,0.28);
          border-style: solid;
        }
        .cta-inner::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
        .cta-inner::after { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }

        .cta-corner-tr,
        .cta-corner-bl {
          position: absolute;
          width: 40px;
          height: 40px;
          border-color: rgba(200,168,75,0.28);
          border-style: solid;
        }
        .cta-corner-tr { top: -1px; right: -1px; border-width: 1px 1px 0 0; }
        .cta-corner-bl { bottom: -1px; left: -1px; border-width: 0 0 1px 1px; }

        /* Atmospheric bleed */
        .cta-inner .cta-glow {
          position: absolute;
          top: 0; right: 0;
          width: 50%;
          height: 100%;
          background: radial-gradient(ellipse 70% 80% at 80% 50%, rgba(139,10,10,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 5.5vw, 4.8rem);
          font-weight: 700;
          color: var(--bone);
          line-height: 1.05;
          margin-bottom: 1.2rem;
        }

        .cta-title em {
          font-style: italic;
          color: rgba(237,227,208,0.42);
          font-weight: 400;
        }

        .cta-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-style: italic;
          color: var(--parchment);
          font-weight: 300;
          opacity: 0.7;
          line-height: 1.7;
        }

        .cta-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex-shrink: 0;
        }

        /* ─── FOOTER ─── */
        footer {
          border-top: 1px solid rgba(200,168,75,0.09);
          padding: 3.2rem clamp(2.5rem, 8vw, 8rem);
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

        /* ─── ANIMATIONS ─── */
        @keyframes riseUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scanLine {
          0%   { transform: translateX(-100%); }
          45%  { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.28; }
        }

        .quote-mark { animation: pulse 4s ease-in-out infinite; }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-vignette" />
        <div className="hero-figure" />

        <div className="hero-content" ref={heroContentRef}>
          <div className="eyebrow">Est. MMXXVI</div>

          <h1 className="hero-title">
            An Offer You
            <br />
            <em>Cannot Refuse.</em>
          </h1>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-ornament">✦</span>
          </div>

          <p className="hero-sub">
            A circle of minds bound by loyalty, purpose,
            <br />
            and the quiet currency of trust.
          </p>

          <div className="hero-cta">
            <button className="btn-primary">
              <span>Request Admission</span>
            </button>
            <button className="btn-ghost">Learn the Way</button>
          </div>
        </div>
      </section>

      <div className="interstitial">· · ·</div>

      {/* ─── PILLARS ─── */}
      <section className="pillars">
        <div className="pillars-header">
          <p className="section-eyebrow">The Three Pillars</p>
          <h2 className="section-title">
            Power. Loyalty.
            <em>Legacy.</em>
          </h2>
        </div>

        <div className="pillars-grid">
          {[
            {
              n: "I",
              title: "Connect",
              body: "Every great alliance begins in a darkened room. Those who share blood — of ambition, of vision — find each other here. Every introduction is an alliance forged in silence.",
            },
            {
              n: "II",
              title: "Learn",
              body: "Knowledge is the only inheritance that cannot be seized. Those who share it earn loyalty. Those who hoard it, earn nothing. We grow through honest counsel and hard-won wisdom.",
            },
            {
              n: "III",
              title: "Engage",
              body: "A family gathers — it does not merely communicate. Presence commands respect. Show yourself, make your mark, and let your reputation speak before you enter the room.",
            },
          ].map((item) => (
            <div className="pillar" key={item.n}>
              <div className="pillar-num">{item.n}</div>
              <h3 className="pillar-title">{item.title}</h3>
              <div className="pillar-rule" />
              <p className="pillar-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── QUOTE ─── */}
      <section className="quote-section">
        <span className="quote-mark">"</span>
        <blockquote className="quote-text">
          Behind every great fortune there is a community of men who dared to
          think beyond the ordinary — bound not by blood, but by will.
        </blockquote>
        <div className="quote-divider">
          <span className="q-line" />
          <span className="q-ornament">✦</span>
          <span className="q-line" />
        </div>
        <p className="quote-attr">— The Founding Principle</p>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="cta-inner">
          <span className="cta-corner-tr" />
          <span className="cta-corner-bl" />
          <div className="cta-glow" />
          <div>
            <h3 className="cta-title">
              Ready to be <em>initiated?</em>
            </h3>
            <p className="cta-sub">
              Membership is not applied for. It is offered. Prove your worth,
              and join the family.
            </p>
          </div>
          <div className="cta-actions">
            <button className="btn-primary">
              <span>Enter the Family</span>
            </button>
            <button className="btn-ghost">Speak First</button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer>
        <span className="footer-brand">the name.</span>
        <span className="footer-copy">
          © 2026 · All rights reserved · Omertà
        </span>
      </footer>
    </>
  );
}
