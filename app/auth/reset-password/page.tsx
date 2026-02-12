"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setMessage({
          type: "error",
          text: "Invalid or expired reset link. Please request a new one.",
        });
      }
    };

    checkSession();
  }, [supabase]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

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

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
    } else {
      setMessage({
        type: "success",
        text: "Password updated successfully! Redirecting to sign in...",
      });

      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/signin");
      }, 2000);
    }
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Reset your password
            </h2>
            <p className="text-gray-400">Enter your new password below</p>
          </div>

          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1120] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1120] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  minLength={6}
                />
              </div>
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
              {loading ? "Updating password..." : "Update password"}
            </button>

            <div className="text-center">
              <Link
                href="/signin"
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                ← Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
