import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";

// Unit color configuration
const UNIT_COLORS = {
  Einherjar: {
    primary: "#6FF3FF",
    light: "#E0FCFF",
    dark: "#00B8CC",
    text: "#6FF3FF",
  },
  "Legio X Equestris": {
    primary: "#8A3FFC",
    light: "#F0E6FF",
    dark: "#6929C4",
    text: "#8A3FFC",
  },
  Myrmidons: {
    primary: "#A6FF00",
    light: "#F0FFD6",
    dark: "#7ABE00",
    text: "#A6FF00",
  },
  "Narayani Sena": {
    primary: "#FFC83D",
    light: "#FFF5E0",
    dark: "#E09600",
    text: "#FFC83D",
  },
  Spartans: {
    primary: "#FF6A00",
    light: "#FFE8D6",
    dark: "#CC5500",
    text: "#FF6A00",
  },
};

// Default colors for users without a unit
const DEFAULT_COLORS = {
  primary: "#3B82F6",
  light: "#EFF6FF",
  dark: "#1E40AF",
  text: "#3B82F6",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // Get user profile with unit information
  const { data: profile } = await supabase
    .from("profiles_with_units")
    .select("username, full_name, unit_name, unit_description, unit_id")
    .eq("id", user.id)
    .single();

  // Get count of members in the same unit
  let unitMemberCount = 0;
  if (profile?.unit_id) {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("unit_id", profile.unit_id);

    unitMemberCount = count || 0;
  }

  // Get colors for the user's unit
  const unitColors =
    profile?.unit_name &&
    UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      ? UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      : DEFAULT_COLORS;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 bg-[#1A2332]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              {profile?.unit_name && (
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold border"
                  style={{
                    borderColor: unitColors.primary,
                    color: unitColors.text,
                    backgroundColor: `${unitColors.primary}15`,
                  }}
                >
                  {profile.unit_name}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <SignOut />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Welcome Card */}
          <div className="bg-[#1A2332] rounded-xl border border-gray-800 overflow-hidden">
            <div
              className="h-1 w-full"
              style={{ backgroundColor: unitColors.primary }}
            ></div>
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Welcome back{profile?.username ? `, @${profile.username}` : ""}!
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${unitColors.primary}20` }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: unitColors.primary }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Username</p>
                      <p className="text-base font-semibold text-white">
                        {profile?.username || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${unitColors.primary}20` }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: unitColors.primary }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-base font-semibold text-white">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {profile?.full_name && (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${unitColors.primary}20` }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: unitColors.primary }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Full Name</p>
                        <p className="text-base font-semibold text-white">
                          {profile.full_name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {profile?.unit_name && (
                  <div
                    className="rounded-lg p-6 border"
                    style={{
                      backgroundColor: `${unitColors.primary}10`,
                      borderColor: `${unitColors.primary}40`,
                    }}
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2">
                      Your Unit
                    </p>
                    <p
                      className="text-2xl font-bold mb-2"
                      style={{ color: unitColors.text }}
                    >
                      {profile.unit_name}
                    </p>
                    {profile.unit_description && (
                      <p className="text-sm text-gray-300">
                        {profile.unit_description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {profile?.unit_name && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1A2332] rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      Unit Members
                    </p>
                    <p
                      className="text-4xl font-bold"
                      style={{ color: unitColors.text }}
                    >
                      {unitMemberCount}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {unitMemberCount === 1 ? "warrior" : "warriors"} in{" "}
                      {profile.unit_name}
                    </p>
                  </div>
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${unitColors.primary}20` }}
                  >
                    <svg
                      className="w-8 h-8"
                      style={{ color: unitColors.primary }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A2332] rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      Your Rank
                    </p>
                    <p
                      className="text-4xl font-bold"
                      style={{ color: unitColors.text }}
                    >
                      Recruit
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Keep training to advance
                    </p>
                  </div>
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${unitColors.primary}20` }}
                  >
                    <svg
                      className="w-8 h-8"
                      style={{ color: unitColors.primary }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Protected Info */}
          <div
            className="rounded-lg p-5 border"
            style={{
              backgroundColor: `${unitColors.primary}10`,
              borderColor: `${unitColors.primary}30`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${unitColors.primary}20` }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: unitColors.primary }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">
                  Protected Dashboard
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  🛡️ This is a protected page. Only authenticated users can see
                  this content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
