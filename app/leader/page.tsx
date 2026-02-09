import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";
import Link from "next/link";

// Unit color configuration
const UNIT_COLORS = {
  Einherjar: {
    primary: "#6FF3FF",
    light: "#E0FCFF",
    dark: "#00B8CC",
    text: "#004D57",
  },
  "Legio X Equestris": {
    primary: "#8A3FFC",
    light: "#F0E6FF",
    dark: "#6929C4",
    text: "#2D1A52",
  },
  Myrmidons: {
    primary: "#A6FF00",
    light: "#F0FFD6",
    dark: "#7ABE00",
    text: "#2D4000",
  },
  "Narayani Sena": {
    primary: "#FFC83D",
    light: "#FFF5E0",
    dark: "#E09600",
    text: "#5C3D00",
  },
  Spartans: {
    primary: "#FF6A00",
    light: "#FFE8D6",
    dark: "#CC5500",
    text: "#5C2800",
  },
};

const DEFAULT_COLORS = {
  primary: "#3B82F6",
  light: "#EFF6FF",
  dark: "#1E40AF",
  text: "#1E3A8A",
};

export default async function LeaderDashboard() {
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
    .select("*")
    .eq("id", user.id)
    .single();

  // Check if user is a leader
  if (!profile?.is_leader) {
    redirect("/dashboard");
  }

  // Get all members of this leader's unit
  const { data: unitMembers, count: totalMembers } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("unit_id", profile.unit_id)
    .order("created_at", { ascending: false });

  // Get recent members (joined in last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: recentMembers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("unit_id", profile.unit_id)
    .gte("created_at", sevenDaysAgo.toISOString());

  // Get colors for the unit
  const unitColors =
    profile?.unit_name &&
    UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      ? UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      : DEFAULT_COLORS;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav
        className="shadow"
        style={{
          background: `linear-gradient(135deg, ${unitColors.primary} 0%, ${unitColors.dark} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">
                {profile.unit_name} - Leader Dashboard
              </h1>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                }}
              >
                COMMANDER
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-white hover:text-gray-200 text-sm font-medium"
              >
                My Profile
              </Link>
              <SignOut />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Card */}
          <div
            className="rounded-lg shadow-lg overflow-hidden mb-6"
            style={{
              background: "white",
              borderTop: `4px solid ${unitColors.primary}`,
            }}
          >
            <div
              className="p-6"
              style={{
                background: `linear-gradient(to bottom, ${unitColors.light} 0%, white 100%)`,
              }}
            >
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: unitColors.text }}
              >
                Welcome, Commander @{profile.username}
              </h2>
              <p className="text-gray-600">
                You are the leader of {profile.unit_name}. Use this dashboard to
                oversee your unit and its members.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total Members */}
            <div
              className="rounded-lg p-6 shadow-lg"
              style={{
                background: "white",
                borderLeft: `4px solid ${unitColors.primary}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Warriors
                  </p>
                  <p
                    className="text-4xl font-bold"
                    style={{ color: unitColors.primary }}
                  >
                    {totalMembers || 0}
                  </p>
                </div>
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: unitColors.light }}
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

            {/* Recent Recruits */}
            <div
              className="rounded-lg p-6 shadow-lg"
              style={{
                background: "white",
                borderLeft: `4px solid ${unitColors.primary}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    New Recruits (7 days)
                  </p>
                  <p
                    className="text-4xl font-bold"
                    style={{ color: unitColors.primary }}
                  >
                    {recentMembers || 0}
                  </p>
                </div>
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: unitColors.light }}
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Unit Status */}
            <div
              className="rounded-lg p-6 shadow-lg"
              style={{
                background: "white",
                borderLeft: `4px solid ${unitColors.primary}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Unit Status
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: unitColors.primary }}
                  >
                    Active
                  </p>
                </div>
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: unitColors.light }}
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Unit Members List */}
          <div
            className="rounded-lg shadow-lg overflow-hidden"
            style={{
              background: "white",
              borderTop: `4px solid ${unitColors.primary}`,
            }}
          >
            <div
              className="p-6"
              style={{
                background: `linear-gradient(to bottom, ${unitColors.light} 0%, white 100%)`,
              }}
            >
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: unitColors.text }}
              >
                Unit Roster
              </h3>

              {unitMembers && unitMembers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {unitMembers.map((member) => (
                        <tr
                          key={member.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: unitColors.primary }}
                              ></div>
                              <span className="text-sm font-medium text-gray-900">
                                @{member.username}
                              </span>
                              {member.is_leader && (
                                <span
                                  className="ml-2 px-2 py-1 text-xs font-bold rounded"
                                  style={{
                                    backgroundColor: unitColors.light,
                                    color: unitColors.text,
                                  }}
                                >
                                  LEADER
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.is_leader ? "Commander" : "Warrior"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(member.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No members found in your unit yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
