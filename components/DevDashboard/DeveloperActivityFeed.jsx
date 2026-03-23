// components/DevDashboard/DeveloperActivityFeed.jsx
"use client";

import {
  ClipboardDocumentIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  StarIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";

const iconMap = {
  bid: ClipboardDocumentIcon,
  message: ChatBubbleLeftIcon,
  milestone: CheckCircleIcon,
  review: StarIcon,
  payment: CurrencyRupeeIcon,
};

const colorMap = {
  bid: "text-blue-600 bg-blue-50",
  message: "text-purple-600 bg-purple-50",
  milestone: "text-green-600 bg-green-50",
  review: "text-yellow-600 bg-yellow-50",
  payment: "text-emerald-600 bg-emerald-50",
};

export default function DeveloperActivityFeed({ activities }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-900 transition-all">
      <h3 className="font-poppins font-semibold text-gray-900 text-lg mb-6">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type] || ClipboardDocumentIcon;
          const colors = colorMap[activity.type] || colorMap.bid;

          return (
            <div key={activity.id} className="flex gap-4">
              <div className={`flex-shrink-0 p-2 rounded-xl ${colors}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter text-gray-900 text-sm">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 font-inter text-sm">No recent activity</p>
        </div>
      )}
    </div>
  );
}
