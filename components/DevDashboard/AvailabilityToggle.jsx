// components/DevDashboard/AvailabilityToggle.jsx
"use client";

import { useState } from "react";

export default function AvailabilityToggle({ isAvailable, onToggle }) {
  const [localAvailable, setLocalAvailable] = useState(isAvailable);

  const handleChange = () => {
    const newStatus = !localAvailable;
    setLocalAvailable(newStatus);
    if (onToggle) onToggle(newStatus);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-900 transition-all">
      <h3 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
        Availability
      </h3>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-inter text-gray-900 font-medium">
            {localAvailable
              ? "Available for new projects"
              : "Currently unavailable"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {localAvailable
              ? "Clients can see your profile and send invites"
              : "You won't receive new project invites"}
          </p>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleChange}
          className={`relative w-14 h-8 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
            localAvailable ? "bg-gray-900" : "bg-gray-300"
          }`}
          role="switch"
          aria-checked={localAvailable}
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ${
              localAvailable ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-5 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Profile Views</p>
          <p className="font-poppins font-semibold text-gray-900">342</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Invite Rate</p>
          <p className="font-poppins font-semibold text-gray-900">+12%</p>
        </div>
      </div>
    </div>
  );
}
