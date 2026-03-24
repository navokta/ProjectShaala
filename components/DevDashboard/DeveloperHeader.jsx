"use client";

import { useState } from "react";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function DeveloperHeader({ developer }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/developer/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 sm:px-10 lg:px-20 py-4">
      <div className="flex items-center justify-between">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, messages..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                font-inter text-sm text-gray-900 placeholder-gray-500"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
            onClick={() => router.push('/developer/notifications')}
          >
            <BellIcon className="w-6 h-6 text-gray-600" />
            {/* This would be dynamically fetched */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {/* Developer Info */}
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="font-poppins font-medium text-gray-900 text-sm">
                {developer?.name}
              </p>
              <p className="text-xs text-gray-500">{developer?.location}</p>
            </div>
            <img
              src={developer?.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}