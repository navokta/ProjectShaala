// components/FAQ/FAQSearch.jsx
"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function FAQSearch({ searchQuery, onSearchChange }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search for answers..."
          className="w-full pl-14 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-sans text-lg text-gray-900 placeholder-gray-400 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
