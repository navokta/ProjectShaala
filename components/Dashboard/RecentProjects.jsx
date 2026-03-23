// components/Dashboard/RecentProjects.jsx
"use client";

import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  PencilIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function RecentProjects() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Dashboard",
      status: "active",
      developer: "Bhavy Sharma",
      progress: 75,
      dueDate: "2 days left",
      budget: "₹15,000",
      lastUpdate: "2 hours ago",
    },
    {
      id: 2,
      title: "Mobile App UI Design",
      status: "review",
      developer: "Priya Sharma",
      progress: 100,
      dueDate: "Ready for review",
      budget: "₹8,500",
      lastUpdate: "5 hours ago",
    },
    {
      id: 3,
      title: "API Integration",
      status: "pending",
      developer: "Arjun Patel",
      progress: 30,
      dueDate: "5 days left",
      budget: "₹12,000",
      lastUpdate: "1 day ago",
    },
    {
      id: 4,
      title: "Landing Page Redesign",
      status: "completed",
      developer: "Sneha Gupta",
      progress: 100,
      dueDate: "Completed",
      budget: "₹6,250",
      lastUpdate: "3 days ago",
    },
  ];

  const getStatusConfig = (status) => {
    const config = {
      active: {
        label: "In Progress",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <ClockIcon className="w-4 h-4" />,
      },
      review: {
        label: "Review Needed",
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: <ExclamationCircleIcon className="w-4 h-4" />,
      },
      pending: {
        label: "Awaiting Start",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: <ClockIcon className="w-4 h-4" />,
      },
      completed: {
        label: "Completed",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: <CheckCircleIcon className="w-4 h-4" />,
      },
    };
    return config[status] || config.pending;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-bold text-gray-900 text-lg">
          📁 Recent Projects
        </h3>
        <a
          href="/dashboard/projects"
          className="inline-flex items-center gap-1 text-sm font-poppins font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          View All
          <ArrowRightIcon className="w-4 h-4" />
        </a>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => {
          const status = getStatusConfig(project.status);
          return (
            <div
              key={project.id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-poppins font-semibold text-gray-900 truncate">
                      {project.title}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-sans font-medium border ${status.color}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>👨‍💻 {project.developer}</span>
                    <span>💰 {project.budget}</span>
                    <span>🕐 {project.lastUpdate}</span>
                  </div>

                  {/* Progress Bar */}
                  {project.status !== "completed" && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Due Date */}
                  <p className="text-xs text-gray-500">📅 {project.dueDate}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {project.status === "review" && (
                    <button
                      className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                      title="Approve"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="View"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
