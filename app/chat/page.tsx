import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UnitChat from "@/components/UnitChat";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // Get user profile with unit info
  const { data: profile } = await supabase
    .from("profiles_with_units")
    .select("username, unit_id, unit_name")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.unit_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Unit Assigned
          </h2>
          <p className="text-gray-600">
            You need to be assigned to a unit to access the chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)]">
        <UnitChat
          userId={user.id}
          username={profile.username}
          unitId={profile.unit_id}
          unitName={profile.unit_name}
        />
      </div>
    </div>
  );
}
