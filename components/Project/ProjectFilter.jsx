// components/Project/ProjectFilter.jsx
"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function ProjectFilter({ onFilterChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    priceRange: "all",
    sortBy: "newest",
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web-app", label: "Web Application" },
    { value: "mobile-app", label: "Mobile App" },
    { value: "saas", label: "SaaS Platform" },
    { value: "ecommerce", label: "E-Commerce" },
    { value: "dashboard", label: "Dashboard" },
    { value: "api", label: "API/Backend" },
    { value: "landing-page", label: "Landing Page" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-50", label: "Under ₹50" },
    { value: "50-100", label: "₹50 - ₹100" },
    { value: "100-200", label: "₹100 - ₹200" },
    { value: "200+", label: "₹200 & Above" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  const handleInputChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: "",
      category: "all",
      priceRange: "all",
      sortBy: "newest",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Search + Toggle Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by name, tech stack, or keywords..."
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-sans text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-poppins font-medium hover:bg-gray-800 transition-colors"
        >
          <FunnelIcon className="w-5 h-5" />
          Filters
        </button>

        {/* Sort Dropdown (Desktop) */}
        <div className="hidden sm:block">
          <select
            value={filters.sortBy}
            onChange={(e) => handleInputChange("sortBy", e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-sans text-gray-900 cursor-pointer min-w-[180px]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className={`${showFilters ? "block" : "hidden"} sm:block space-y-3`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-sans text-gray-900 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">
              Price Range
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleInputChange("priceRange", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-sans text-gray-900 cursor-pointer"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort (Mobile) */}
          <div className="sm:hidden">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleInputChange("sortBy", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-sans text-gray-900 cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters + Clear Button */}
        {(filters.category !== "all" ||
          filters.priceRange !== "all" ||
          filters.search) && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-sans">
                  Search: {filters.search}
                  <button
                    onClick={() => handleInputChange("search", "")}
                    className="hover:text-gray-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filters.category !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-sans">
                  {categories.find((c) => c.value === filters.category)?.label}
                  <button
                    onClick={() => handleInputChange("category", "all")}
                    className="hover:text-gray-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filters.priceRange !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-sans">
                  {
                    priceRanges.find((p) => p.value === filters.priceRange)
                      ?.label
                  }
                  <button
                    onClick={() => handleInputChange("priceRange", "all")}
                    className="hover:text-gray-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm font-poppins font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
