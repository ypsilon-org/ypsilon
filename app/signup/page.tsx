"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Unit } from "@/types/database.types";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchUnits = async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .order("name");
      if (data && !error) setUnits(data);
    };
    fetchUnits();
  }, [supabase]);

  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      setCheckingUsername(true);
      const { data: existingUser, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username.toLowerCase())
        .maybeSingle();
      if (error && error.code !== "PGRST116") {
        setUsernameAvailable(null);
      } else {
        setUsernameAvailable(!existingUser);
      }
      setCheckingUsername(false);
    };
    const id = setTimeout(checkUsername, 500);
    return () => clearTimeout(id);
  }, [username, supabase]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    if (username.length < 3) {
      setMessage({
        type: "error",
        text: "Username must be at least 3 characters",
      });
      setLoading(false);
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setMessage({
        type: "error",
        text: "Username can only contain letters, numbers, and underscores",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      setLoading(false);
      return;
    }
    if (!selectedUnit) {
      setMessage({ type: "error", text: "Please select a unit to join" });
      setLoading(false);
      return;
    }
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username.toLowerCase())
      .maybeSingle();
    if (checkError && checkError.code !== "PGRST116") {
      setMessage({
        type: "error",
        text: "Error checking username availability. Please try again.",
      });
      setLoading(false);
      return;
    }
    if (existingUser) {
      setMessage({
        type: "error",
        text: `Username "${username}" is already taken.`,
      });
      setUsernameAvailable(false);
      setLoading(false);
      return;
    }
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { username: username.toLowerCase() },
      },
    });
    if (authError) {
      setMessage({ type: "error", text: authError.message });
      setLoading(false);
      return;
    }
    if (authData.user) {
      const profileData: any = {
        id: authData.user.id,
        email,
        username: username.toLowerCase(),
        updated_at: new Date().toISOString(),
      };
      if (selectedUnit) profileData.unit_id = selectedUnit;
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "id" });
      if (profileError) {
        setMessage({
          type: "error",
          text: "Error creating profile: " + profileError.message,
        });
        setLoading(false);
        return;
      }
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        setMessage({
          type: "success",
          text: "Account created! Redirecting...",
        });
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } else {
        setMessage({
          type: "success",
          text: "Check your email for the confirmation link.",
        });
        setLoading(false);
      }
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSelectedUnit("");
      setUsernameAvailable(null);
    }
  };

  const getUsernameIndicator = () => {
    if (username.length < 3) return null;
    if (checkingUsername)
      return (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.8rem",
            fontStyle: "italic",
            color: "rgba(200,168,75,0.45)",
            marginTop: "0.4rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <svg
            style={{
              animation: "spin 1s linear infinite",
              width: 12,
              height: 12,
            }}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              opacity="0.25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Checking availability...
        </p>
      );
    if (usernameAvailable === true)
      return (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.8rem",
            fontStyle: "italic",
            color: "rgba(160,210,140,0.75)",
            marginTop: "0.4rem",
          }}
        >
          ✦ Name is available
        </p>
      );
    if (usernameAvailable === false)
      return (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.8rem",
            fontStyle: "italic",
            color: "rgba(220,150,150,0.8)",
            marginTop: "0.4rem",
          }}
        >
          ✦ Name already taken
        </p>
      );
    return null;
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
            radial-gradient(ellipse 70% 55% at 50% 25%, rgba(139,10,10,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 85% 80%, rgba(30,18,8,0.5) 0%, transparent 55%),
            linear-gradient(160deg, #130A04 0%, var(--ink) 45%, #0A0806 100%);
          pointer-events: none;
        }
        .auth-vignette {
          position: fixed; inset: 0;
          background: radial-gradient(ellipse 95% 95% at 50% 50%, transparent 35%, rgba(3,2,1,0.88) 100%);
          pointer-events: none;
        }
        .auth-card {
          position: relative; z-index: 2; width: 100%; max-width: 480px;
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
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-header { text-align: center; margin-bottom: 2.5rem; position: relative; }
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
          font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 2.8rem);
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
        .auth-divider-line:last-child { background: linear-gradient(to left, transparent, rgba(200,168,75,0.28)); }
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
        .auth-form { display: flex; flex-direction: column; gap: 1.3rem; position: relative; }
        .field-group { display: flex; flex-direction: column; gap: 1.15rem; }
        .field { display: flex; flex-direction: column; gap: 0.45rem; }
        .field-label {
          font-family: 'Cormorant Garamond', serif; font-size: 0.7rem;
          letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold-dim); font-weight: 300;
        }
        .field-input, .field-select {
          width: 100%; padding: 0.85rem 1rem; background: rgba(5,3,2,0.75);
          border: 1px solid rgba(200,168,75,0.11); color: var(--bone);
          font-family: 'EB Garamond', serif; font-size: 1rem; outline: none;
          transition: border-color 0.3s, box-shadow 0.3s; border-radius: 0; -webkit-appearance: none;
        }
        .field-input::placeholder { color: rgba(201,180,154,0.2); font-style: italic; }
        .field-input:focus, .field-select:focus {
          border-color: rgba(139,10,10,0.45);
          box-shadow: 0 0 0 1px rgba(139,10,10,0.12), inset 0 0 18px rgba(139,10,10,0.03);
        }
        .field-select option { background: #0D0A06; color: var(--bone); }
        .field-input.available { border-color: rgba(140,200,120,0.3); }
        .field-input.taken { border-color: rgba(139,10,10,0.4); }
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
          transition: border-color 0.4s ease; margin-top: 0.3rem;
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
            Join
            <em>the family.</em>
          </h1>
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-ornament">✦</span>
            <span className="auth-divider-line" />
          </div>
          <p className="auth-subtitle">
            Already a member? <Link href="/signin">Return home</Link>
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSignUp}>
          <div className="field-group">
            <div className="field">
              <label htmlFor="username" className="field-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`field-input ${usernameAvailable === true ? "available" : usernameAvailable === false ? "taken" : ""}`}
                placeholder="Choose your name"
              />
              {getUsernameIndicator()}
            </div>

            <div className="field">
              <label htmlFor="email-address" className="field-label">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="unit" className="field-label">
                Choose Your Unit
              </label>
              <select
                id="unit"
                name="unit"
                required
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="field-select"
              >
                <option value="">Select your allegiance...</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} — {unit.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="field">
              <label htmlFor="confirm-password" className="field-label">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="field-input"
                placeholder="Confirm your secret"
              />
            </div>
          </div>

          {message.text && (
            <div className={`auth-message ${message.type}`}>{message.text}</div>
          )}

          <button
            type="submit"
            disabled={
              loading || usernameAvailable === false || checkingUsername
            }
            className="btn-submit"
          >
            <span>
              {loading ? "Entering the ranks..." : "Request Admission"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
