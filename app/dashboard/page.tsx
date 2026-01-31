import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOut from "@/components/SignOut";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <SignOut />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome{profile?.username ? `, @${profile.username}` : ""}!
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-semibold">Username:</span>{" "}
                {profile?.username || "Not set"}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              {profile?.full_name && (
                <p>
                  <span className="font-semibold">Full Name:</span>{" "}
                  {profile.full_name}
                </p>
              )}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
              <p className="text-sm text-blue-800">
                This is a protected page. Only authenticated users can see this
                content.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
