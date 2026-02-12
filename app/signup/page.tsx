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

      if (data && !error) {
        setUnits(data);
      }
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

    const timeoutId = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(timeoutId);
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

    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    if (!usernamePattern.test(username)) {
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
      setMessage({
        type: "error",
        text: "Please select a unit to join",
      });
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
        text: `Username "${username}" is already taken. Please choose another.`,
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
        data: {
          username: username.toLowerCase(),
        },
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
        email: email,
        username: username.toLowerCase(),
        updated_at: new Date().toISOString(),
      };

      if (selectedUnit) {
        profileData.unit_id = selectedUnit;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData, {
          onConflict: "id",
        });

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
          text: "Account created successfully! Redirecting...",
        });
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } else {
        setMessage({
          type: "success",
          text: "Success! Check your email for the confirmation link.",
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

    if (checkingUsername) {
      return (
        <p className="text-sm text-gray-400 mt-2 flex items-center">
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Checking availability...
        </p>
      );
    }

    if (usernameAvailable === true) {
      return (
        <p className="text-sm text-green-400 mt-2 flex items-center">
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Username available!
        </p>
      );
    }

    if (usernameAvailable === false) {
      return (
        <p className="text-sm text-red-400 mt-2 flex items-center">
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Username already taken
        </p>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h2>
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignUp}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
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
                  className={`w-full px-4 py-3 bg-[#0B1120] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    usernameAvailable === false
                      ? "border-red-500/50 focus:ring-red-500"
                      : usernameAvailable === true
                        ? "border-green-500/50 focus:ring-green-500"
                        : "border-gray-700 focus:ring-blue-500"
                  }`}
                  placeholder="Choose a username"
                />
                {getUsernameIndicator()}
              </div>

              <div>
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1120] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              {/* Unit Selection */}
              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Choose your unit
                </label>
                <select
                  id="unit"
                  name="unit"
                  required
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1120] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">Select a unit...</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} - {unit.description}
                    </option>
                  ))}
                </select>
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1120] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
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
                  className="w-full px-4 py-3 bg-[#0B1120] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
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
              disabled={
                loading || usernameAvailable === false || checkingUsername
              }
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
