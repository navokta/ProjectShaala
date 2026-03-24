// components/Dashboard/ProjectStatus.jsx
"use client";

const statusConfig = {
  draft: {
    label: "Draft",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  open: {
    label: "Open",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    label: "Completed",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export default function ProjectStatus({ status }) {
  const config = statusConfig[status] || statusConfig.open;

  return (
    <span
      className={`inline-block px-4 py-2 rounded-xl text-sm font-medium border ${config.color}`}
    >
      {config.label}
    </span>
  );
}
