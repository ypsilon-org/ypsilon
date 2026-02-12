import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";
import Link from "next/link";

// Unit color configuration
const UNIT_COLORS = {
  Einherjar: {
    primary: "#6FF3FF",
    text: "#6FF3FF",
  },
  "Legio X Equestris": {
    primary: "#8A3FFC",
    text: "#8A3FFC",
  },
  Myrmidons: {
    primary: "#A6FF00",
    text: "#A6FF00",
  },
  "Narayani Sena": {
    primary: "#FFC83D",
    text: "#FFC83D",
  },
  Spartans: {
    primary: "#FF6A00",
    text: "#FF6A00",
  },
};

const DEFAULT_COLORS = {
  primary: "#3B82F6",
  text: "#3B82F6",
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
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 bg-[#1A2332]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">
                {profile.unit_name} - Leader Dashboard
              </h1>
              <span
                className="px-3 py-1 rounded-lg text-xs font-bold border"
                style={{
                  borderColor: unitColors.primary,
                  color: unitColors.text,
                  backgroundColor: `${unitColors.primary}20`,
                }}
              >
                COMMANDER
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                My Profile
              </Link>
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
              <h2 className="text-3xl font-bold mb-2 text-white">
                Welcome, Commander @{profile.username}
              </h2>
              <p className="text-gray-400 text-base">
                You are the leader of {profile.unit_name}. Use this dashboard to
                oversee your unit and its members.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Members */}
            <div className="bg-[#1A2332] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">
                    Total Warriors
                  </p>
                  <p
                    className="text-4xl font-bold"
                    style={{ color: unitColors.text }}
                  >
                    {totalMembers || 0}
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${unitColors.primary}20` }}
                >
                  <svg
                    className="w-7 h-7"
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
            <div className="bg-[#1A2332] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">
                    New Recruits (7 days)
                  </p>
                  <p
                    className="text-4xl font-bold"
                    style={{ color: unitColors.text }}
                  >
                    {recentMembers || 0}
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${unitColors.primary}20` }}
                >
                  <svg
                    className="w-7 h-7"
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
            <div className="bg-[#1A2332] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">
                    Unit Status
                  </p>
                  <p
                    className="text-4xl font-bold"
                    style={{ color: unitColors.text }}
                  >
                    Active
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${unitColors.primary}20` }}
                >
                  <svg
                    className="w-7 h-7"
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
          <div className="bg-[#1A2332] rounded-xl border border-gray-800 overflow-hidden">
            <div
              className="h-1 w-full"
              style={{ backgroundColor: unitColors.primary }}
            ></div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">
                Unit Roster
              </h3>

              {unitMembers && unitMembers.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-800">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead>
                      <tr className="bg-[#0B1120]">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {unitMembers.map((member) => (
                        <tr
                          key={member.id}
                          className="hover:bg-[#0B1120]/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-white">
                                @{member.username}
                              </span>
                              {member.is_leader && (
                                <span
                                  className="px-2 py-1 text-xs font-bold rounded"
                                  style={{
                                    backgroundColor: `${unitColors.primary}20`,
                                    color: unitColors.text,
                                  }}
                                >
                                  LEADER
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {member.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {member.is_leader ? "Commander" : "Warrior"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(member.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${unitColors.primary}15` }}
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400">
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
