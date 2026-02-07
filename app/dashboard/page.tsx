import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";

// Unit color configuration
const UNIT_COLORS = {
  Einherjar: {
    primary: "#6FF3FF",
    light: "#DFFBFF",
    dark: "#29848e",
    text: "#08343A",
  },
  "Legio X Equestris": {
    primary: "#8A3FFC",
    light: "#E6D9FF",
    dark: "#5A23B0",
    text: "#2A0E4F",
  },
  Myrmidons: {
    primary: "#A6FF00",
    light: "#ECFFD1",
    dark: "#5FAE00",
    text: "#1F3300",
  },
  "Narayani Sena": {
    primary: "#FFC83D",
    light: "#FFF1C2",
    dark: "#C99700",
    text: "#3D2A00",
  },
  Spartans: {
    primary: "#FF6A00",
    light: "#FFE2CC",
    dark: "#C94F00",
    text: "#3B1A00",
  },
};

// Default colors for users without a unit
const DEFAULT_COLORS = {
  primary: "#3B82F6",
  light: "#EFF6FF",
  dark: "#1E40AF",
  text: "#1E3A8A",
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
    .select("username, full_name, unit_name, unit_description")
    .eq("id", user.id)
    .single();

  // Get colors for the user's unit
  const unitColors =
    profile?.unit_name &&
    UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      ? UNIT_COLORS[profile.unit_name as keyof typeof UNIT_COLORS]
      : DEFAULT_COLORS;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar with Unit Color */}
      <nav
        className="shadow"
        style={{
          background: `linear-gradient(135deg, ${unitColors.primary} 0%, ${unitColors.dark} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              {profile?.unit_name && (
                <span
                  className="ml-4 px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Main Profile Card with Unit Theme */}
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
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: unitColors.text }}
              >
                Welcome{profile?.username ? `, @${profile.username}` : ""}!
              </h2>

              <div className="space-y-3 text-gray-700">
                <div className="flex items-center">
                  <span className="font-semibold w-32">Username:</span>
                  <span>{profile?.username || "Not set"}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold w-32">Email:</span>
                  <span>{user.email}</span>
                </div>

                {profile?.full_name && (
                  <div className="flex items-center">
                    <span className="font-semibold w-32">Full Name:</span>
                    <span>{profile.full_name}</span>
                  </div>
                )}

                {profile?.unit_name && (
                  <div className="flex items-center">
                    <span className="font-semibold w-32">Unit:</span>
                    <span
                      className="font-bold text-lg"
                      style={{ color: unitColors.primary }}
                    >
                      {profile.unit_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Unit Description Card */}
              {profile?.unit_name && profile?.unit_description && (
                <div
                  className="rounded-lg p-5 mt-6 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${unitColors.light} 0%, white 100%)`,
                    border: `2px solid ${unitColors.primary}`,
                  }}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className="w-1 h-6 rounded-full mr-3"
                      style={{ backgroundColor: unitColors.primary }}
                    ></div>
                    <p
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: unitColors.text }}
                    >
                      About Your Unit
                    </p>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    {profile.unit_description}
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div
                className="rounded-md p-4 mt-6"
                style={{
                  backgroundColor: unitColors.light,
                  border: `1px solid ${unitColors.primary}`,
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: unitColors.text }}
                >
                  🛡️ This is a protected page. Only authenticated users can see
                  this content.
                </p>
              </div>
            </div>
          </div>

          {/* Unit Stats or Additional Info Cards */}
          {profile?.unit_name && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div
                className="rounded-lg p-6 shadow"
                style={{
                  background: "white",
                  borderLeft: `4px solid ${unitColors.primary}`,
                }}
              >
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ color: unitColors.text }}
                >
                  Unit Members
                </h3>
                <p
                  className="text-3xl font-bold"
                  style={{ color: unitColors.primary }}
                >
                  ---
                </p>
                <p className="text-sm text-gray-500 mt-1">Coming soon</p>
              </div>

              <div
                className="rounded-lg p-6 shadow"
                style={{
                  background: "white",
                  borderLeft: `4px solid ${unitColors.primary}`,
                }}
              >
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ color: unitColors.text }}
                >
                  Your Rank
                </h3>
                <p
                  className="text-3xl font-bold"
                  style={{ color: unitColors.primary }}
                >
                  ---
                </p>
                <p className="text-sm text-gray-500 mt-1">Coming soon</p>
              </div>

              <div
                className="rounded-lg p-6 shadow"
                style={{
                  background: "white",
                  borderLeft: `4px solid ${unitColors.primary}`,
                }}
              >
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ color: unitColors.text }}
                >
                  Achievements
                </h3>
                <p
                  className="text-3xl font-bold"
                  style={{ color: unitColors.primary }}
                >
                  0
                </p>
                <p className="text-sm text-gray-500 mt-1">Start your journey</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
