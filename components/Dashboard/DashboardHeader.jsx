// components/Dashboard/DashboardHeader.jsx
"use client";

import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function DashboardHeader({ user }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-6">
        <div className="flex items-center justify-between">
          {/* Welcome */}
          <div>
            <h1 className="font-poppins text-2xl lg:text-3xl font-bold text-gray-900">
              Welcome back, {user.name.split(" ")[0]}! 👋
            </h1>
            <p className="font-sans text-gray-600 mt-1">
              Here's what's happening with your dashboard today.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <BellIcon className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
            </button>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-xl border-2 border-gray-200 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
