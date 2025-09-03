'use client';

import { useState, useEffect } from 'react';

export default function TrendingProjectsClient() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/projects?sort=downloads');
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch trending projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 sm:px-10 lg:px-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-8 py-3 mb-8 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 text-lg font-medium rounded-full border border-purple-500/40">
            🔥 Trending Projects
          </div>
          <p className="text-gray-400 text-xl">Loading the most popular projects...</p>
        </div>
      </section>
    );
  }

  if (!projects.length) {
    return (
      <section className="py-20 px-6 sm:px-10 lg:px-20 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-300">No projects trending yet</h3>
          <p className="text-gray-500 mt-2">Check back soon — great code always rises to the top.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 bg-slate-950 relative overflow-hidden">
      {/* Background Gradient Orb */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-600/30 to-pink-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-600/20 to-cyan-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Ribbon */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-full text-purple-200 font-semibold text-lg mb-6 transform hover:scale-105 transition-transform duration-300 shadow-2xl shadow-purple-500/10">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></span>
            🔥 TRENDING THIS WEEK
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent leading-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Hottest</span> Projects
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Built by developers. Loved by startups. Downloaded hundreds of times.
          </p>
        </div>

        {/* Scrollable Project Carousel */}
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide px-2">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="flex-shrink-0 w-80 snap-start group hover:scale-105 transform transition-all duration-500 cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 transform hover:shadow-2xl hover:shadow-purple-500/20">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                    ⚡ {project.downloadCount}+
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-purple-300 line-clamp-2 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">by {project.seller}</p>

                  {/* Rating + Price */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-yellow-400 flex items-center gap-1">
                      ⭐ {project.rating}
                    </span>
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                      ₹{project.price}
                    </span>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.techStack.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-md border border-gray-700 group-hover:bg-purple-900/30 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 2 && (
                      <span className="text-xs text-gray-500">+{project.techStack.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
            View All Projects →
          </button>
        </div>
      </div>
    </section>
  );
}