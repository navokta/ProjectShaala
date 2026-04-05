"use client";

import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function AdminHeader({ user }) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="font-poppins text-xl font-semibold text-gray-900">
          Admin Panel
        </h1>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <BellIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}