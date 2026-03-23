// components/DevDashboard/ActiveProjects.jsx
"use client";

import Link from "next/link";

export default function ActiveProjects({ projects, limit = 3 }) {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-900 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-semibold text-gray-900 text-lg">
          Active Projects
        </h3>
        <Link
          href="/developer/projects"
          className="text-sm text-gray-900 hover:underline font-inter"
        >
          View All
        </Link>
      </div>

      <div className="space-y-5">
        {displayProjects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-gray-50 rounded-xl border border-gray-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-poppins font-medium text-gray-900">
                  {project.title}
                </p>
                <p className="text-sm text-gray-500">{project.client}</p>
              </div>
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-200">
                Due: {project.deadline}
              </span>
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{project.milestone}</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <Link
              href={`/developer/projects/${project.id}`}
              className="inline-flex items-center gap-1 text-sm text-gray-900 hover:underline font-inter"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 font-inter">No active projects</p>
          <Link
            href="/project"
            className="mt-2 inline-block text-sm text-gray-900 hover:underline"
          >
            Find Projects →
          </Link>
        </div>
      )}
    </div>
  );
}
