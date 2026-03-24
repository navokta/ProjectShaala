// components/Dashboard/ProjectCard.jsx
"use client";

import Link from "next/link";
import {
  ClockIcon,
  CurrencyRupeeIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

const statusColors = {
  open: "bg-green-100 text-green-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
  closed: "bg-gray-100 text-gray-800",
  draft: "bg-yellow-100 text-yellow-800",
};

export default function ProjectCard({ project }) {
  return (
    <Link href={`/dashboard/bids/${project._id}`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-900 hover:shadow-lg transition-all duration-200">
        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || statusColors.open}`}
          >
            {project.status}
          </span>
          <span className="text-xs text-gray-500">
            {project.age || "Recently"}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-poppins font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
          {project.title}
        </h3>

        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <FolderIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{project.category}</span>
        </div>

        {/* Description Preview */}
        <p className="text-gray-600 font-inter text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.skills?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
            >
              {skill}
            </span>
          ))}
          {project.skills?.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs">
              +{project.skills.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <CurrencyRupeeIcon className="w-4 h-4 text-gray-400" />
            <span className="font-poppins font-semibold text-gray-900 text-sm">
              {project.budgetType === "hourly"
                ? `₹${project.hourlyRate}/hr`
                : `₹${project.budgetMin?.toLocaleString()} - ₹${project.budgetMax?.toLocaleString()}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ClockIcon className="w-4 h-4" />
            <span>{project.timeline}</span>
          </div>
        </div>

        {/* Bids Count */}
        {project.bidCount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {project.bidCount} {project.bidCount === 1 ? "bid" : "bids"}{" "}
              received
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
