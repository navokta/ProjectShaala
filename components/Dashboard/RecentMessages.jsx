// components/Dashboard/RecentMessages.jsx
"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function RecentMessages({ count }) {
  const messages = [
    {
      id: 1,
      from: "Rahul Verma",
      avatar: "https://placehold.co/40/111827/ffffff?text=RV",
      preview: "Hi! I've completed the dashboard module. Please review...",
      time: "2m ago",
      unread: true,
    },
    {
      id: 2,
      from: "Priya Sharma",
      avatar: "https://placehold.co/40/111827/ffffff?text=PS",
      preview: "The UI designs are ready for your feedback.",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      from: "Arjun Patel",
      avatar: "https://placehold.co/40/111827/ffffff?text=AP",
      preview: "Can we schedule a call to discuss the API endpoints?",
      time: "3h ago",
      unread: false,
    },
    {
      id: 4,
      from: "Sneha Gupta",
      avatar: "https://placehold.co/40/111827/ffffff?text=SG",
      preview: "Project delivered! Let me know if you need any changes.",
      time: "1d ago",
      unread: false,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-poppins font-bold text-gray-900 text-lg">
            💬 Messages
          </h3>
          {count > 0 && (
            <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-sans font-bold rounded-full">
              {count}
            </span>
          )}
        </div>
        <a
          href="/dashboard/messages"
          className="inline-flex items-center gap-1 text-sm font-poppins font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          View All
          <ArrowRightIcon className="w-4 h-4" />
        </a>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <a
            key={msg.id}
            href={`/dashboard/messages/${msg.id}`}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
              msg.unread
                ? "bg-blue-50 border border-blue-200 hover:bg-blue-100"
                : "bg-gray-50 border border-gray-200 hover:bg-white hover:border-gray-400"
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={msg.avatar}
                alt={msg.from}
                className="w-10 h-10 rounded-full object-cover"
              />
              {msg.unread && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p
                  className={`font-poppins font-semibold text-sm truncate ${
                    msg.unread ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {msg.from}
                </p>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {msg.time}
                </span>
              </div>
              <p
                className={`font-sans text-sm truncate ${
                  msg.unread ? "text-gray-700 font-medium" : "text-gray-500"
                }`}
              >
                {msg.preview}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Empty State */}
      {count === 0 && (
        <div className="text-center py-8">
          <p className="font-sans text-gray-500 text-sm">🎉 No new messages!</p>
        </div>
      )}
    </div>
  );
}
