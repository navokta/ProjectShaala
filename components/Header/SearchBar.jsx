// components/Header/SearchBar.jsx
'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ mobile = false, withFilter = false }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('projects');

  // Mobile ke liye full width, otherwise fixed width
  const widthClass = mobile ? 'w-full' : withFilter ? 'w-72' : 'w-60';

  return (
    <div className={`relative ${widthClass}`}>
      <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-sm focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 overflow-hidden">
        {withFilter && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-full rounded-l-full border-0 bg-gray-50 py-2 pl-3 pr-7 text-xs text-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
          >
            <option value="projects">Projects</option>
            <option value="developers">Developers</option>
            <option value="teams">Teams</option>
          </select>
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={withFilter ? `Search ${filter}...` : 'Search projects...'}
          className="block w-full border-0 py-2 pl-3 pr-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-0"
        />
        <button className="flex items-center rounded-r-full px-3 py-2 text-gray-400 hover:text-gray-600">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;