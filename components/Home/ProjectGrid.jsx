// components/Home/ProjectGrid.jsx
import React from 'react';

const ProjectGrid = ({ projects = [], isLoading = false }) => {
  // Mock loading state
  if (isLoading) {
    return (
      <section className="py-12 px-6 sm:px-10 lg:px-20 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-80"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!projects.length) {
    return (
      <section className="py-16 px-6 sm:px-10 lg:px-20 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-medium text-gray-400 mb-4">No projects found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 sm:px-10 lg:px-20 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.imageUrl || '/placeholder-project.jpg'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 text-xs text-white rounded-full">
                  {project.license}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-100 group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{project.description}</p>

                {/* Seller & Rating */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">by {project.seller}</span>
                  <span className="text-sm text-yellow-400">⭐ {project.rating}</span>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-200 rounded-lg border border-purple-800/30"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-xs px-2 py-1 text-gray-500">+{project.techStack.length - 3}</span>
                  )}
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between mt-6">
                  <span className="text-lg font-bold text-purple-300">₹{project.price}</span>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                    View Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGrid;