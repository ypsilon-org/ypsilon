"use client";

import { useState } from "react";
import UnitChat from "@/components/UnitChat";
import GeneralChat from "@/components/GeneralChat";
import Link from "next/link";

interface ChatTabsProps {
  userId: string;
  username: string;
  unitId: string | null;
  unitName: string | null;
}

export default function ChatTabs({
  userId,
  username,
  unitId,
  unitName,
}: ChatTabsProps) {
  const [activeTab, setActiveTab] = useState<"unit" | "general">("unit");

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header with Tabs */}
      <div className="bg-white border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("unit")}
              className={`px-6 py-2 font-medium rounded-lg transition-colors ${
                activeTab === "unit"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              disabled={!unitId}
            >
              {unitName ? `${unitName} Chat` : "Unit Chat"}
            </button>
            <button
              onClick={() => setActiveTab("general")}
              className={`px-6 py-2 font-medium rounded-lg transition-colors ${
                activeTab === "general"
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              🌍 General Chat
            </button>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            ← Back
          </Link>
        </div>
        {!unitId && activeTab === "unit" && (
          <div className="px-4 pb-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 text-sm text-yellow-800">
              ⚠️ You need to be assigned to a unit to access unit chat
            </div>
          </div>
        )}
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "unit" ? (
          unitId && unitName ? (
            <UnitChat
              userId={userId}
              username={username}
              unitId={unitId}
              unitName={unitName}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">No Unit Assigned</h3>
                <p>You need to be assigned to a unit to access unit chat.</p>
              </div>
            </div>
          )
        ) : (
          <GeneralChat
            userId={userId}
            username={username}
            unitId={unitId}
            unitName={unitName}
          />
        )}
      </div>
    </div>
  );
}
