"use client";

export default function HomePage() {
  return (
    <div className="godfather-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --crimson: #8B0000;
          --crimson-light: #A0001A;
          --gold: #C9A84C;
          --gold-dim: #7A6230;
          --parchment: #F0E6D3;
          --ink: #0A0705;
          --shadow: #1A1108;
          --mid: #2A1F10;
          --fog: rgba(10, 7, 5, 0.85);
        }

        .godfather-root {
          min-height: 100vh;
          background-color: var(--ink);
          color: var(--parchment);
          font-family: 'EB Garamond', 'Garamond', serif;
          overflow-x: hidden;
          cursor: default;
        }

        /* Noise grain overlay */
        .godfather-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1000;
          opacity: 0.4;
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

        /* Chiaroscuro vignette */
        .hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(5, 3, 2, 0.7) 80%, rgba(2, 1, 1, 0.95) 100%);
        }

        /* Decorative rose image placeholder — chiaroscuro silhouette */
        .hero-silhouette {
          position: absolute;
          right: -5%;
          top: 50%;
          transform: translateY(-50%);
          width: 55%;
          height: 110%;
          background:
            radial-gradient(ellipse 70% 80% at 60% 50%, rgba(25, 15, 8, 0.3) 0%, transparent 70%),
            linear-gradient(to left, transparent 0%, var(--ink) 80%);
          /* Simulated dark photography with CSS */
          clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%);
        }

        /* The "dark figure" CSS art */
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
          color: var(--parchment);
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

        .btn-primary {
          display: inline-block;
          background: transparent;
          border: 1px solid var(--crimson);
          color: var(--parchment);
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 1.1rem 3rem;
          cursor: pointer;
          position: relative;
          transition: all 0.4s ease;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--crimson);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
        }

        .btn-primary:hover::before { transform: scaleX(1); }
        .btn-primary span { position: relative; z-index: 1; }

        .btn-ghost {
          display: inline-block;
          background: transparent;
          border: none;
          color: var(--gold-dim);
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 1.1rem 2rem;
          cursor: pointer;
          transition: color 0.3s;
        }
        .btn-ghost:hover { color: var(--gold); }

        .cta-row { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }

        /* ─── PILLARS ─── */
        .pillars {
          position: relative;
          padding: 10vw 6vw;
          background: linear-gradient(to bottom, var(--ink) 0%, #0D0907 50%, var(--ink) 100%);
        }

        .section-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .section-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.75rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--gold-dim);
          margin-bottom: 1rem;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          color: var(--parchment);
          line-height: 1.1;
        }

        .section-title em {
          font-style: italic;
          color: rgba(240, 230, 211, 0.4);
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1px;
          max-width: 1100px;
          margin: 0 auto;
          border: 1px solid rgba(201, 168, 76, 0.1);
        }

        .pillar {
          padding: 3.5rem 2.8rem;
          background: rgba(15, 10, 5, 0.8);
          border: 1px solid rgba(201, 168, 76, 0.07);
          position: relative;
          transition: background 0.5s ease;
          overflow: hidden;
        }

        .pillar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, var(--crimson), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s ease;
        }

        .pillar:hover { background: rgba(20, 13, 7, 1); }
        .pillar:hover::before { transform: scaleX(1); }

        .pillar-number {
          font-family: 'Playfair Display', serif;
          font-size: 4rem;
          font-weight: 900;
          color: rgba(201, 168, 76, 0.06);
          line-height: 1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.05em;
        }

        .pillar-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--parchment);
          margin-bottom: 1rem;
        }

        .pillar-body {
          font-family: 'EB Garamond', serif;
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(240, 230, 211, 0.45);
          font-style: italic;
        }

        /* ─── QUOTE BREAK ─── */
        .quote-break {
          position: relative;
          padding: 10vw 6vw;
          text-align: center;
          overflow: hidden;
        }

        .quote-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139, 0, 0, 0.05) 0%, transparent 70%),
            linear-gradient(to bottom, var(--ink), #0E0908, var(--ink));
        }

        .quote-mark {
          font-family: 'Playfair Display', serif;
          font-size: 8rem;
          line-height: 0.5;
          color: var(--crimson);
          opacity: 0.2;
          display: block;
          margin-bottom: 1rem;
        }

        .quote-text {
          position: relative;
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 3.5vw, 2.8rem);
          font-style: italic;
          font-weight: 400;
          color: var(--parchment);
          max-width: 800px;
          margin: 0 auto 2rem;
          line-height: 1.4;
        }

        .quote-attr {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold-dim);
        }

        /* ─── CTA ─── */
        .cta-section {
          padding: 10vw 6vw;
          position: relative;
        }

        .cta-inner {
          max-width: 900px;
          margin: 0 auto;
          border: 1px solid rgba(201, 168, 76, 0.12);
          padding: 6rem 5rem;
          position: relative;
          text-align: center;
          background: linear-gradient(135deg, rgba(20, 12, 6, 0.9), rgba(10, 7, 5, 0.95));
        }

        /* Corner ornaments */
        .cta-inner::before,
        .cta-inner::after {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          border-color: var(--gold);
          border-style: solid;
          opacity: 0.3;
        }
        .cta-inner::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
        .cta-inner::after { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }

        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 900;
          color: var(--parchment);
          margin-bottom: 1rem;
          line-height: 1.0;
        }

        .cta-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-style: italic;
          color: rgba(240, 230, 211, 0.45);
          max-width: 500px;
          margin: 0 auto 3rem;
          line-height: 1.7;
        }

        .cta-buttons { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }

        /* ─── FOOTER ─── */
        footer {
          border-top: 1px solid rgba(201, 168, 76, 0.08);
          padding: 3rem 6vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-brand {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-style: italic;
          color: rgba(240, 230, 211, 0.25);
        }

        .footer-copy {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: rgba(240, 230, 211, 0.2);
        }

        @media (max-width: 640px) {
          .cta-inner { padding: 3rem 2rem; }
          .hero-figure { display: none; }
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

          <div className="cta-row">
            <button className="btn-primary">
              <span>Request Admission</span>
            </button>
            <button className="btn-ghost">Learn the Way</button>
          </div>
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section className="pillars">
        <div className="section-header">
          <p className="section-label">The Three Pillars</p>
          <h2 className="section-title">
            Power. Loyalty. <em>Legacy.</em>
          </h2>
        </div>

        <div className="pillars-grid">
          {[
            {
              n: "I",
              title: "Connect",
              body: "Every great alliance begins with a handshake in a darkened room. Find those who share your vision.",
            },
            {
              n: "II",
              title: "Learn",
              body: "Knowledge is the only inheritance that cannot be seized. Accumulate it with the same gravity as power.",
            },
            {
              n: "III",
              title: "Engage",
              body: "Presence commands respect. Show yourself, make your mark, and let your reputation precede you.",
            },
          ].map((item) => (
            <div className="pillar" key={item.n}>
              <div className="pillar-number">{item.n}</div>
              <h3 className="pillar-title">{item.title}</h3>
              <p className="pillar-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── QUOTE BREAK ─── */}
      <section className="quote-break">
        <div className="quote-bg" />
        <div style={{ position: "relative" }}>
          <span className="quote-mark">"</span>
          <blockquote className="quote-text">
            Behind every great fortune, there is a community of men who dared to
            think beyond the ordinary.
          </blockquote>
          <p className="quote-attr">— The Founding Principle</p>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h3 className="cta-title">
            Ready to be
            <br />
            <em style={{ fontStyle: "italic", color: "rgba(240,230,211,0.5)" }}>
              initiated?
            </em>
          </h3>
          <p className="cta-sub">
            Membership is not given. It is earned. Prove your worth and join the
            family.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary">
              <span>Enter the Family</span>
            </button>
            <button className="btn-ghost">Speak First</button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer>
        <div className="footer-brand">the name.</div>
        <p className="footer-copy">
          &copy; 2026 — All rights reserved. Omertà.
        </p>
      </footer>
    </div>
  );
}
