// components/Dashboard/StatsGrid.jsx
"use client";

import {
  FolderIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

export default function StatsGrid({ stats }) {
  const statCards = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: <FolderIcon className="w-6 h-6" />,
      trend: "+3 this month",
      trendUp: true,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Spend",
      value: `₹${stats.totalSpend.toLocaleString("en-IN")}`,
      icon: <CurrencyRupeeIcon className="w-6 h-6" />,
      trend: "Within budget",
      trendUp: true,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: <ClockIcon className="w-6 h-6" />,
      trend: "2 due this week",
      trendUp: false,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completed",
      value: stats.completedProjects,
      icon: <CheckCircleIcon className="w-6 h-6" />,
      trend: "98% satisfaction",
      trendUp: true,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Pending Bids",
      value: stats.pendingBids,
      icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
      trend: "Review now",
      trendUp: null,
      color: "bg-gray-50 text-gray-600",
    },
    {
      label: "Unread Messages",
      value: stats.messages,
      icon: <ChatBubbleLeftIcon className="w-6 h-6" />,
      trend: stats.messages > 0 ? "Reply soon" : "All caught up!",
      trendUp: stats.messages === 0,
      color:
        stats.messages > 0
          ? "bg-red-50 text-red-600"
          : "bg-gray-50 text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-400 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}
            >
              {stat.icon}
            </div>
            {stat.trendUp !== null && (
              <span
                className={`text-xs font-sans font-medium ${
                  stat.trendUp ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {stat.trendUp ? "↑" : "↓"}
              </span>
            )}
          </div>
          <div className="font-poppins text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="font-sans text-sm text-gray-500 mb-2">
            {stat.label}
          </div>
          <div
            className={`text-xs font-sans ${
              stat.trendUp === true
                ? "text-emerald-600"
                : stat.trendUp === false
                  ? "text-amber-600"
                  : "text-gray-400"
            }`}
          >
            {stat.trend}
          </div>
        </div>
      ))}
    </div>
  );
}
