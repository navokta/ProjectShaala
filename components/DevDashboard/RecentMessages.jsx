// components/DevDashboard/RecentMessages.jsx
"use client";

import Link from "next/link";

const mockMessages = [
  {
    id: 1,
    from: "Appify Labs",
    preview: "Can we discuss the timeline for...",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    from: "TechStart Inc.",
    preview: "Great work on the last deliverable!",
    time: "1h ago",
    unread: false,
  },
  {
    id: 3,
    from: "PayFast India",
    preview: "Payment has been processed for...",
    time: "3h ago",
    unread: true,
  },
  {
    id: 4,
    from: "CloudManage",
    preview: "When can we schedule the demo?",
    time: "1d ago",
    unread: false,
  },
];

export default function RecentMessages({ count = 4 }) {
  const displayMessages = mockMessages.slice(0, count);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-900 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-semibold text-gray-900 text-lg">
          Messages
        </h3>
        <Link
          href="/developer/messages"
          className="text-sm text-gray-900 hover:underline font-inter"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {displayMessages.map((msg) => (
          <Link
            key={msg.id}
            href={`/developer/messages/${msg.id}`}
            className={`block p-3 rounded-xl border transition-all ${
              msg.unread
                ? "bg-gray-50 border-gray-300 hover:border-gray-900"
                : "border-gray-200 hover:border-gray-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-poppins font-medium truncate ${msg.unread ? "text-gray-900" : "text-gray-700"}`}
                  >
                    {msg.from}
                  </p>
                  {msg.unread && (
                    <span className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {msg.preview}
                </p>
              </div>
              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                {msg.time}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {mockMessages.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500 font-inter text-sm">No new messages</p>
        </div>
      )}
    </div>
  );
}
