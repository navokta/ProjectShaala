// components/Home/SearchFilters.jsx
'use client';

import React, { useState, useEffect } from 'react';

const SearchFilters = ({ onResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [techStack, setTechStack] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Tech options
  const techOptions = ['nextjs', 'react', 'nodejs', 'python', 'flutter', 'django', 'ai-ml', 'blockchain'];

  // Categories
  const categories = [
    'all',
    'web-app',
    'mobile-app',
    'api',
    'dashboard',
    'ai-bot',
    'automation',
    'saas-template',
  ];

  // Fetch projects based on filters
  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const url = new URL('/api/projects', window.location.origin);
      url.searchParams.append('search', searchTerm);
      if (category && category !== 'all') url.searchParams.append('category', category);
      url.searchParams.append('minPrice', minPrice);
      url.searchParams.append('maxPrice', maxPrice);
      if (techStack) url.searchParams.append('techStack', techStack);

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch');

      onResults(data); // Pass results to parent (e.g., ProjectGrid)
    } catch (err) {
      setError(err.message);
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger on mount and on filter change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 500); // Debounce search

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, category, minPrice, maxPrice, techStack]);

  return (
    <section className="py-10 px-6 sm:px-10 lg:px-20 bg-slate-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-8">
          Discover Projects
        </h2>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search projects... (e.g., 'Admin Dashboard', 'AI Chatbot')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-4 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            {categories.filter(c => c !== 'all').map((cat) => (
              <option key={cat} value={cat} className="bg-gray-800">
                {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </option>
            ))}
          </select>

          {/* Tech Stack */}
          <select
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="p-4 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Tech Stacks</option>
            {techOptions.map((tech) => (
              <option key={tech} value={tech} className="bg-gray-800 capitalize">
                {tech.replace('-', ' ')}
              </option>
            ))}
          </select>

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
            className="p-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Max Price */}
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value) || 10000)}
            className="p-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Sort / Apply (Optional) */}
          <button
            onClick={fetchProjects}
            disabled={loading}
            className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-70"
          >
            {loading ? 'Searching...' : 'Apply'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-center py-4 bg-red-900/20 border border-red-800 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </section>
  );
};

export default SearchFilters;