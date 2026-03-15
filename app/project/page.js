// app/project/page.js
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectFilter from "@/components/Project/ProjectFilter";
import ProjectsGrid from "@/components/Project/ProjectsGrid";
// import SectionDivider from "@/components/UI/SectionDivider";

export default function ProjectsPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    priceRange: "all",
    sortBy: "newest",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="min-h-screen bg-white">
        {/* Page Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-12">
            <h1 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore Projects
            </h1>
            <p className="font-sans text-lg text-gray-600 max-w-3xl">
              Discover ready-to-use software projects, templates, and tools
              built by talented developers. Buy, customize, and launch your idea
              faster.
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="sticky top-20 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-4">
            <ProjectFilter onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-12">
          <ProjectsGrid filters={filters} />
        </div>

        {/* <SectionDivider variant="gradient" /> */}
      </main>

      <Footer />
    </>
  );
}
