// components/DevDashboard/DeveloperStatsGrid.jsx
"use client";

import {
  CurrencyRupeeIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  StarIcon,
  EyeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const statCards = [
  {
    label: "Total Earnings",
    value: "₹1,28,500",
    icon: CurrencyRupeeIcon,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Active Projects",
    value: "3",
    icon: BriefcaseIcon,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Completed",
    value: "18",
    icon: CheckCircleIcon,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Profile Views",
    value: "342",
    icon: EyeIcon,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    label: "Pending Bids",
    value: "5",
    icon: ClockIcon,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export default function DeveloperStatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-900 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-inter">{stat.label}</p>
              <p className="font-poppins font-semibold text-gray-900 text-lg">
                {stats
                  ? stats[stat.label.toLowerCase().replace(/\s+/g, "")] ||
                    stat.value
                  : stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
