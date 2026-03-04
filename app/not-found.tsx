import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NotFound() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="nf-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        :root { --bone:#EDE3D0; --parchment:#C9B49A; --crimson:#8B0A0A; --gold:#C8A84B; --gold-dim:#7D6328; --ink:#080604; --dark:#0D0A06; }

        .nf-root {
          min-height: 100vh;
          background: var(--ink);
          color: var(--bone);
          font-family: 'EB Garamond', Georgia, serif;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nf-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: .038;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: overlay;
        }

        .nf-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,10,10,.07) 0%, transparent 70%),
            radial-gradient(ellipse 100% 60% at 50% 100%, rgba(8,6,4,.8) 0%, transparent 60%),
            linear-gradient(to bottom, #130A04 0%, var(--ink) 15%);
          pointer-events: none;
          z-index: 0;
        }

        .nf-watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Playfair Display', serif;
          font-size: clamp(18rem, 40vw, 32rem);
          font-weight: 900;
          font-style: italic;
          color: rgba(200,168,75,.025);
          line-height: 1;
          user-select: none;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
        }

        .nf-inner {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 640px;
          padding: clamp(2rem, 6vw, 4rem) clamp(1.5rem, 4vw, 3rem);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .nf-frame {
          position: relative;
          padding: clamp(2.5rem, 5vw, 4rem) clamp(2rem, 4vw, 3.5rem);
          border: 1px solid rgba(200,168,75,.1);
          background: linear-gradient(135deg, rgba(18,12,6,.97), rgba(10,7,4,.99));
        }
        .nf-frame::before, .nf-frame::after {
          content: '';
          position: absolute;
          width: 32px; height: 32px;
          border-color: rgba(200,168,75,.3);
          border-style: solid;
        }
        .nf-frame::before { top:-1px; left:-1px; border-width: 1px 0 0 1px; }
        .nf-frame::after  { bottom:-1px; right:-1px; border-width: 0 1px 1px 0; }
        .nf-corner-tr, .nf-corner-bl {
          position: absolute;
          width: 32px; height: 32px;
          border-color: rgba(200,168,75,.3);
          border-style: solid;
        }
        .nf-corner-tr { top:-1px; right:-1px; border-width: 1px 1px 0 0; }
        .nf-corner-bl { bottom:-1px; left:-1px; border-width: 0 0 1px 1px; }

        .nf-top-bar {
          position: absolute;
          top: 0; left: 0;
          height: 1px; width: 100%;
          background: linear-gradient(to right, var(--crimson), rgba(139,10,10,.3), transparent);
        }

        .nf-eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: .68rem;
          letter-spacing: .48em;
          text-transform: uppercase;
          color: var(--gold-dim);
          font-weight: 300;
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .8rem;
        }
        .nf-eyebrow::before, .nf-eyebrow::after {
          content: '';
          display: inline-block;
          width: 22px; height: 1px;
          background: var(--gold-dim);
          opacity: .5;
        }

        .nf-code {
          font-family: 'Playfair Display', serif;
          font-size: clamp(5rem, 16vw, 9rem);
          font-weight: 900;
          font-style: italic;
          line-height: 1;
          color: var(--bone);
          letter-spacing: -.02em;
          margin-bottom: .1em;
        }
        .nf-code span { color: var(--crimson); text-shadow: 0 0 60px rgba(139,10,10,.4); }

        .nf-rule {
          width: 100%; height: 1px;
          background: linear-gradient(to right, transparent, rgba(200,168,75,.2), transparent);
          margin: 2rem 0;
        }

        .nf-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 700;
          font-style: italic;
          color: var(--bone);
          margin-bottom: .6rem;
        }

        .nf-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-style: italic;
          font-weight: 300;
          color: rgba(201,180,154,.45);
          line-height: 1.7;
          max-width: 400px;
          margin: 0 auto;
        }

        .nf-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }

        .nf-btn-primary {
          font-family: 'Cormorant Garamond', serif;
          font-size: .72rem;
          letter-spacing: .38em;
          text-transform: uppercase;
          font-weight: 400;
          color: var(--ink);
          background: var(--gold);
          border: 1px solid var(--gold);
          padding: .75rem 2rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          transition: box-shadow .3s ease;
          position: relative;
          overflow: hidden;
        }
        .nf-btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,.08);
          transform: translateX(-100%);
          transition: transform .4s ease;
        }
        .nf-btn-primary:hover::before { transform: translateX(0); }
        .nf-btn-primary:hover { box-shadow: 0 0 28px rgba(200,168,75,.25); }

        .nf-btn-ghost {
          font-family: 'Cormorant Garamond', serif;
          font-size: .72rem;
          letter-spacing: .38em;
          text-transform: uppercase;
          font-weight: 300;
          color: rgba(201,180,154,.45);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          transition: color .3s ease;
          border-bottom: 1px solid transparent;
          padding-bottom: 1px;
        }
        .nf-btn-ghost:hover { color: var(--gold); border-bottom-color: rgba(200,168,75,.3); }
      `}</style>

      <div className="nf-watermark">404</div>

      <div className="nf-inner">
        <div className="nf-frame">
          <div className="nf-top-bar" />
          <span className="nf-corner-tr" />
          <span className="nf-corner-bl" />

          <p className="nf-eyebrow">Error · Sector Unknown</p>

          <p className="nf-code">
            4<span>0</span>4
          </p>

          <div className="nf-rule" />

          <h1 className="nf-title">This Ground Does Not Exist</h1>

          <p className="nf-subtitle">
            The page you seek has been lost to history — buried, burned, or
            perhaps never forged at all. The path ends here.
          </p>

          <div className="nf-actions">
            <Link href="/" className="nf-btn-primary">
              ← Return to the Front
            </Link>
            {user ? (
              <Link href="/dashboard" className="nf-btn-ghost">
                My Quarters
              </Link>
            ) : (
              <Link href="/signup" className="nf-btn-ghost">
                Join Us
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
