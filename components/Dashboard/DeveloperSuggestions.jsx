// components/Dashboard/DeveloperSuggestions.jsx
"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function DeveloperSuggestions() {
  const developers = [
    {
      id: 1,
      name: "Vikram Singh",
      role: "Full-Stack Developer",
      avatar: "https://placehold.co/60/111827/ffffff?text=VS",
      rating: 4.9,
      reviews: 127,
      skills: ["React", "Node.js", "MongoDB"],
      hourlyRate: "₹800/hr",
      availability: "Available",
    },
    {
      id: 2,
      name: "Ananya Das",
      role: "UI/UX Designer",
      avatar: "https://placehold.co/60/111827/ffffff?text=AD",
      rating: 5.0,
      reviews: 89,
      skills: ["Figma", "React", "Tailwind"],
      hourlyRate: "₹650/hr",
      availability: "Available in 2 days",
    },
    {
      id: 3,
      name: "Rohan Mehta",
      role: "Mobile Developer",
      avatar: "https://placehold.co/60/111827/ffffff?text=RM",
      rating: 4.8,
      reviews: 156,
      skills: ["React Native", "Firebase", "Redux"],
      hourlyRate: "₹900/hr",
      availability: "Available",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-poppins font-bold text-gray-900 text-lg">
            👥 Recommended Developers
          </h3>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Based on your project history and preferences
          </p>
        </div>
        <a
          href="/developers"
          className="inline-flex items-center gap-1 text-sm font-poppins font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Browse All
          <ArrowRightIcon className="w-4 h-4" />
        </a>
      </div>

      {/* Developers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {developers.map((dev) => (
          <div
            key={dev.id}
            className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-md transition-all duration-300"
          >
            {/* Avatar + Name */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={dev.avatar}
                alt={dev.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-poppins font-semibold text-gray-900 truncate">
                  {dev.name}
                </p>
                <p className="font-sans text-xs text-gray-500">{dev.role}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <StarIcon className="w-4 h-4 text-amber-400" />
              <span className="font-sans text-sm font-bold text-gray-900">
                {dev.rating}
              </span>
              <span className="font-sans text-xs text-gray-400">
                ({dev.reviews})
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {dev.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-sans text-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Rate + Availability */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-poppins font-bold text-gray-900">
                {dev.hourlyRate}
              </span>
              <span
                className={`text-xs font-sans px-2 py-1 rounded-full ${
                  dev.availability === "Available"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {dev.availability}
              </span>
            </div>

            {/* Hire Button */}
            <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-poppins font-semibold rounded-lg border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
