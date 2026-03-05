"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    let email = identifier;
    if (!identifier.includes("@")) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", identifier.toLowerCase())
        .single();
      if (profileError || !profile) {
        setMessage({ type: "error", text: "Invalid username or password" });
        setLoading(false);
        return;
      }
      email = profile.email;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage({ type: "error", text: "Invalid username/email or password" });
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="auth-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bone: #EDE3D0; --parchment: #C9B49A; --crimson: #8B0A0A;
          --gold: #C8A84B; --gold-dim: #7D6328; --ink: #080604; --dark: #0D0A06;
        }
        .auth-root {
          min-height: 100vh; background: var(--ink); color: var(--bone);
          font-family: 'EB Garamond', Georgia, serif;
          display: flex; align-items: center; justify-content: center;
          padding: 3rem 1.5rem; position: relative; overflow: hidden;
        }
        .auth-root::before {
          content: ''; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.038; pointer-events: none; z-index: 9999; mix-blend-mode: overlay;
        }
        .auth-bg {
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 70% 55% at 50% 30%, rgba(139,10,10,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 15% 80%, rgba(30,18,8,0.6) 0%, transparent 55%),
            linear-gradient(160deg, #130A04 0%, var(--ink) 45%, #0A0806 100%);
          pointer-events: none;
        }
        .auth-vignette {
          position: fixed; inset: 0;
          background: radial-gradient(ellipse 95% 95% at 50% 50%, transparent 35%, rgba(3,2,1,0.88) 100%);
          pointer-events: none;
        }
        .auth-card {
          position: relative; z-index: 2; width: 100%; max-width: 440px;
          background: linear-gradient(135deg, rgba(20,13,6,0.97), rgba(10,8,4,0.99));
          border: 1px solid rgba(200,168,75,0.13);
          padding: clamp(2.5rem, 5vw, 3.5rem) clamp(2rem, 4vw, 3rem);
          animation: fadeUp 0.85s ease forwards;
        }
        .auth-card::before, .auth-card::after {
          content: ''; position: absolute; width: 32px; height: 32px;
          border-color: rgba(200,168,75,0.25); border-style: solid;
        }
        .auth-card::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
        .auth-card::after  { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }
        .corner-tr, .corner-bl {
          position: absolute; width: 32px; height: 32px;
          border-color: rgba(200,168,75,0.25); border-style: solid;
        }
        .corner-tr { top: -1px; right: -1px; border-width: 1px 1px 0 0; }
        .corner-bl { bottom: -1px; left: -1px; border-width: 0 0 1px 1px; }
        .card-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 45% at 50% 0%, rgba(139,10,10,0.05) 0%, transparent 65%);
          pointer-events: none;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-header { text-align: center; margin-bottom: 2.8rem; position: relative; }
        .auth-eyebrow {
          font-family: 'Cormorant Garamond', serif; font-size: 0.68rem;
          letter-spacing: 0.48em; text-transform: uppercase; color: var(--gold-dim);
          font-weight: 300; margin-bottom: 1.1rem;
          display: flex; align-items: center; justify-content: center; gap: 0.9rem;
        }
        .auth-eyebrow::before, .auth-eyebrow::after {
          content: ''; display: inline-block; width: 28px; height: 1px;
          background: var(--gold-dim); opacity: 0.45;
        }
        .auth-title {
          font-family: 'Playfair Display', serif; font-size: clamp(2.2rem, 5vw, 3rem);
          font-weight: 900; color: var(--bone); line-height: 0.92;
          letter-spacing: -0.01em; text-shadow: 0 2px 30px rgba(0,0,0,0.8); margin-bottom: 0.15em;
        }
        .auth-title em { display: block; font-style: italic; color: var(--crimson); }
        .auth-divider {
          display: flex; align-items: center; justify-content: center;
          gap: 0.9rem; margin: 1.3rem 0 1rem;
        }
        .auth-divider-line {
          height: 1px; width: 40px;
          background: linear-gradient(to right, transparent, rgba(200,168,75,0.28));
        }
        .auth-divider-line:last-child {
          background: linear-gradient(to left, transparent, rgba(200,168,75,0.28));
        }
        .auth-divider-ornament { color: var(--gold-dim); font-size: 0.55rem; opacity: 0.5; }
        .auth-subtitle {
          font-family: 'Cormorant Garamond', serif; font-size: 0.95rem;
          font-style: italic; font-weight: 300; color: rgba(201,180,154,0.45);
        }
        .auth-subtitle a {
          color: rgba(200,168,75,0.65); text-decoration: none; font-style: normal;
          font-weight: 400; letter-spacing: 0.02em; transition: color 0.3s;
        }
        .auth-subtitle a:hover { color: var(--gold); }
        .auth-form { display: flex; flex-direction: column; gap: 1.5rem; position: relative; }
        .field-group { display: flex; flex-direction: column; gap: 1.25rem; }
        .field { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-label {
          font-family: 'Cormorant Garamond', serif; font-size: 0.7rem;
          letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold-dim); font-weight: 300;
        }
        .field-input {
          width: 100%; padding: 0.85rem 1rem; background: rgba(5,3,2,0.75);
          border: 1px solid rgba(200,168,75,0.11); color: var(--bone);
          font-family: 'EB Garamond', serif; font-size: 1rem; outline: none;
          transition: border-color 0.3s, box-shadow 0.3s; border-radius: 0; -webkit-appearance: none;
        }
        .field-input::placeholder { color: rgba(201,180,154,0.2); font-style: italic; }
        .field-input:focus {
          border-color: rgba(139,10,10,0.45);
          box-shadow: 0 0 0 1px rgba(139,10,10,0.12), inset 0 0 18px rgba(139,10,10,0.03);
        }
        .auth-message {
          padding: 0.85rem 1rem; font-family: 'Cormorant Garamond', serif;
          font-size: 0.92rem; font-style: italic; letter-spacing: 0.02em; border: 1px solid;
        }
        .auth-message.error {
          background: rgba(139,10,10,0.07); border-color: rgba(139,10,10,0.22);
          color: rgba(220,150,150,0.85);
        }
        .auth-message.success {
          background: rgba(200,168,75,0.05); border-color: rgba(200,168,75,0.18);
          color: rgba(200,168,75,0.78);
        }
        .btn-submit {
          width: 100%; font-family: 'Cormorant Garamond', serif; font-size: 0.77rem;
          font-weight: 600; letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--bone); background: transparent; border: 1px solid rgba(139,10,10,0.5);
          padding: 1.1rem 2rem; cursor: pointer; position: relative; overflow: hidden;
          transition: border-color 0.4s ease; margin-top: 0.2rem;
        }
        .btn-submit::before {
          content: ''; position: absolute; inset: 0; background: var(--crimson);
          transform: translateX(-101%); transition: transform 0.45s cubic-bezier(0.77,0,0.175,1);
        }
        .btn-submit:hover:not(:disabled)::before { transform: translateX(0); }
        .btn-submit:hover:not(:disabled) { border-color: var(--crimson); }
        .btn-submit span { position: relative; z-index: 1; }
        .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div className="auth-bg" />
      <div className="auth-vignette" />

      <div className="auth-card">
        <span className="corner-tr" />
        <span className="corner-bl" />
        <div className="card-glow" />

        <div className="auth-header">
          <p className="auth-eyebrow">Est. MMXXVI</p>
          <h1 className="auth-title">
            Welcome<em>back.</em>
          </h1>
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-ornament">✦</span>
            <span className="auth-divider-line" />
          </div>
          <p className="auth-subtitle">
            No account yet? <Link href="/signup">Request admission</Link>
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSignIn}>
          <div className="field-group">
            <div className="field">
              <label htmlFor="identifier" className="field-label">
                Username or Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="field-input"
                placeholder="Your name or address"
              />
            </div>
            <div className="field">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="Your secret"
              />
            </div>
          </div>
          {message.text && (
            <div className={`auth-message ${message.type}`}>{message.text}</div>
          )}
          <button type="submit" disabled={loading} className="btn-submit">
            <span>{loading ? "Entering..." : "Enter the Family"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
