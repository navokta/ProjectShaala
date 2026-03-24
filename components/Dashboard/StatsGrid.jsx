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
  // ✅ Safety: Agar stats nahi aaye to empty object use karo
  const safeStats = stats || {};

  const statCards = [
    {
      label: "Total Listed Requirements",
      value: safeStats.totalProjects ?? 0,
      icon: <FolderIcon className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Spend",
      value: `₹${(safeStats.totalSpend ?? 0).toLocaleString("en-IN")}`,
      icon: <CurrencyRupeeIcon className="w-6 h-6" />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Active Projects",
      value: safeStats.activeProjects ?? 0,
      icon: <ClockIcon className="w-6 h-6" />,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completed",
      value: safeStats.completedProjects ?? 0,
      icon: <CheckCircleIcon className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Pending Bids",
      value: safeStats.pendingBids ?? 0,
      icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
      color: "bg-gray-50 text-gray-600",
    },
    // ✅ FIX: Added missing Unread Messages card
    {
      label: "Unread Messages",
      value: safeStats.messages ?? 0,
      icon: <ChatBubbleLeftIcon className="w-6 h-6" />,
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-400 hover:shadow-md transition-all duration-300 cursor-default"
        >
          <div className="flex items-center justify-between mb-3">
            {/* Icon Container */}
            <div
              className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}
            >
              {stat.icon}
            </div>
            {/* Trend indicator removed since API doesn't send it yet */}
          </div>

          {/* Value - Poppins for headings */}
          <div className="font-poppins text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </div>

          {/* Label - Inter for body text */}
          <div className="font-sans text-sm text-gray-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
