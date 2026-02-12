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

    const { data, error } = await supabase.auth.signInWithPassword({
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

  const handleForgotPassword = async () => {
    if (!identifier) {
      setMessage({ type: "error", text: "Please enter your email first" });
      return;
    }

    let email = identifier;

    if (!identifier.includes("@")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", identifier.toLowerCase())
        .single();

      if (!profile) {
        setMessage({ type: "error", text: "User not found" });
        return;
      }

      email = profile.email;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Password reset email sent! Check your inbox.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-[#1A2332] rounded-2xl border border-gray-800 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 mb-4">
              <svg
                className="w-7 h-7 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
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
                  className="w-full px-4 py-3 bg-[#0B1120] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username or email"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
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
                  className="w-full px-4 py-3 bg-[#0B1120] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {message.text && (
              <div
                className={`rounded-lg p-4 ${
                  message.type === "error"
                    ? "bg-red-500/10 border border-red-500/30 text-red-400"
                    : "bg-green-500/10 border border-green-500/30 text-green-400"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
