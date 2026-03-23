// components/Project/ProjectsGrid.jsx
"use client";

import ProjectCard from "./ProjectCard";
import ProjectSkeleton from "./ProjectSkeleton";
import { useState } from "react";

// Sample data (replace with API call later)
const sampleProjects = [
  {
    id: 1,
    title: "E-Commerce Dashboard with Analytics",
    description:
      "Complete admin dashboard with real-time analytics, order management, and inventory tracking built with Next.js and Tailwind CSS.",
    category: "Dashboard",
    price: 149,
    originalPrice: 199,
    discount: 25,
    rating: 4.9,
    reviews: 127,
    views: "2.4k",
    sales: 342,
    techStack: ["Next.js", "Tailwind", "MongoDB"],
    developer: {
      name: "Bhavy Sharma",
      avatar: "https://placehold.co/100/111827/ffffff?text=RV",
      level: "Top Rated",
    },
    thumbnail: "https://placehold.co/600x400/f3f4f6/1f2937?text=Dashboard",
  },
  {
    id: 2,
    title: "SaaS Landing Page Template",
    description:
      "Modern, responsive landing page for SaaS products with pricing tables, features section, and contact forms.",
    category: "Landing Page",
    price: 79,
    rating: 4.7,
    reviews: 89,
    views: "1.8k",
    sales: 256,
    techStack: ["React", "Tailwind", "Framer Motion"],
    developer: {
      name: "Priya Sharma",
      avatar: "https://placehold.co/100/111827/ffffff?text=PS",
      level: "Pro Developer",
    },
    thumbnail: "https://placehold.co/600x400/f3f4f6/1f2937?text=Landing+Page",
  },
  {
    id: 3,
    title: "REST API Boilerplate - Node.js",
    description:
      "Production-ready REST API with authentication, rate limiting, logging, and database integration.",
    category: "API/Backend",
    price: 99,
    rating: 4.8,
    reviews: 156,
    views: "3.1k",
    sales: 478,
    techStack: ["Node.js", "Express", "PostgreSQL"],
    developer: {
      name: "Arjun Patel",
      avatar: "https://placehold.co/100/111827/ffffff?text=AP",
      level: "Top Rated",
    },
    thumbnail: "https://placehold.co/600x400/f3f4f6/1f2937?text=API",
  },
  {
    id: 4,
    title: "Mobile Food Delivery App",
    description:
      "Complete food delivery application with real-time tracking, payment integration, and admin panel.",
    category: "Mobile App",
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.9,
    reviews: 203,
    views: "5.2k",
    sales: 189,
    techStack: ["React Native", "Firebase", "Redux"],
    developer: {
      name: "Sneha Gupta",
      avatar: "https://placehold.co/100/111827/ffffff?text=SG",
      level: "Expert",
    },
    thumbnail: "https://placehold.co/600x400/f3f4f6/1f2937?text=Mobile+App",
  },
  {
    id: 5,
    title: "Task Management Web App",
    description:
      "Collaborative task management tool with drag-and-drop, team assignments, and progress tracking.",
    category: "Web Application",
    price: 179,
    rating: 4.6,
    reviews: 94,
    views: "2.1k",
    sales: 167,
    techStack: ["Vue.js", "Node.js", "MySQL"],
    developer: {
      name: "Vikram Singh",
      avatar: "https://placehold.co/100/111827/ffffff?text=VS",
      level: "Pro Developer",
    },
    thumbnail: "https://placehold.co/600x400/f3f4f6/1f2937?text=Task+App",
  },
  {
    id: 6,
    title: "E-Commerce Full Stack Platform",
    description:
      "Complete e-commerce solution with cart, checkout, payment gateway, and admin dashboard.",
    category: "E-Commerce",
    price: 349,
    originalPrice: 499,
    discount: 30,
    rating: 5.0,
    reviews: 312,
    views: "8.7k",
    sales: 521,
    techStack: ["Next.js", "Stripe", "Prisma"],
    developer: {
      name: "Ananya Das",
      avatar: "https://placehold.co/100/111827/ffffff?text=AD",
      level: "Top Rated",
    },
    thumbnail: "https://placehold.co/600x400/f3f4f6/1f2937?text=E-Commerce",
  },
];

export default function ProjectsGrid({ filters }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState(sampleProjects);

  // Filter and sort logic (client-side for demo)
  const filteredProjects = projects.filter((project) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.techStack.some((tech) =>
          tech.toLowerCase().includes(searchLower),
        );
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category !== "all") {
      const categoryMap = {
        "web-app": "Web Application",
        "mobile-app": "Mobile App",
        saas: "SaaS Platform",
        ecommerce: "E-Commerce",
        dashboard: "Dashboard",
        api: "API/Backend",
        "landing-page": "Landing Page",
      };
      if (categoryMap[filters.category] !== project.category) return false;
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange
        .split("-")
        .map((val) => (val === "+" ? Infinity : parseInt(val)));
      if (max && (project.price < min || project.price > max)) return false;
      if (!max && project.price < min) return false;
    }

    return true;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "popular":
        return b.sales - a.sales;
      default:
        return 0; // newest
    }
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {[...Array(6)].map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="font-sans text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {sortedProjects.length}
          </span>{" "}
          projects
        </p>
      </div>

      {/* Grid */}
      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <CodeBracketIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="font-poppins text-xl font-bold text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="font-sans text-gray-600 max-w-md mx-auto">
            Try adjusting your filters or search criteria to find what you're
            looking for.
          </p>
        </div>
      )}
    </div>
  );
}
