// components/Dashboard/ActivityFeed.jsx
"use client";

export default function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "project_update",
      icon: "🔄",
      title: "E-Commerce Dashboard",
      description: "Bhavy uploaded new screenshots for review",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "bid_received",
      icon: "📩",
      title: "Mobile App Project",
      description: "3 new bids received from developers",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "payment",
      icon: "💰",
      title: "API Integration",
      description: "Milestone payment of ₹4,000 released",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "completed",
      icon: "✅",
      title: "Landing Page",
      description: "Project marked as completed by Sneha",
      time: "2 days ago",
    },
    {
      id: 5,
      type: "message",
      icon: "💬",
      title: "New Message",
      description: "Priya sent you a message about UI feedback",
      time: "3 days ago",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-poppins font-bold text-gray-900 mb-6 text-lg">
        📋 Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                {activity.icon}
              </div>
              {index < activities.length - 1 && (
                <div className="w-px h-full bg-gray-200 my-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <p className="font-poppins font-semibold text-gray-900 text-sm">
                {activity.title}
              </p>
              <p className="font-sans text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              <p className="font-sans text-xs text-gray-400 mt-2">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <a
          href="/dashboard/activity"
          className="font-poppins text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          View All Activity →
        </a>
      </div>
    </div>
  );
}
