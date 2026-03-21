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
      label: "Total Listed Requirements",
      value: stats.totalProjects,
      icon: <FolderIcon className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Spend",
      value: `₹${stats.totalSpend.toLocaleString("en-IN")}`,
      icon: <CurrencyRupeeIcon className="w-6 h-6" />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: <ClockIcon className="w-6 h-6" />,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completed",
      value: stats.completedProjects,
      icon: <CheckCircleIcon className="w-6 h-6" />,

      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Pending Bids",
      value: stats.pendingBids,
      icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
      color: "bg-gray-50 text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
