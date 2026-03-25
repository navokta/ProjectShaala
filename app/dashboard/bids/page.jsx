// app/dashboard/bids/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import ProjectCard from "@/components/Dashboard/Bids/ProjectCard";
import {
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const categories = [
  "All",
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "Backend/API",
  "Database",
  "DevOps",
  "AI/ML",
  "Blockchain",
  "Other",
];

const statuses = [
  { value: "all", label: "All Status" },
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "closed", label: "Closed" },
];

export default function AllBidsPage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, logout } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  // Memoized fetch function
  const fetchProjects = useCallback(
    async (page = 1) => {
      if (!authUser?._id) return;

      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page,
          limit: 10,
          // Backend will get user ID from auth token (cookie), no need to send client-side
        });

        if (selectedStatus !== "all") {
          queryParams.append("status", selectedStatus);
        }
        if (selectedCategory !== "All") {
          queryParams.append("category", selectedCategory);
        }
        if (searchTerm) {
          queryParams.append("search", searchTerm);
        }

        // 👇 CRITICAL: credentials: "include" sends HttpOnly cookies to server
        const res = await fetch(`/api/projects?${queryParams}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        console.log("📡 API Response Status:", res.status);
        console.log("🔑 Auth User:", authUser);
        console.log("📝 Query Params:", queryParams.toString());

        // Handle auth errors
        if (res.status === 401 || res.status === 403) {
          console.warn("🔐 Auth expired, redirecting to login");
          logout();
          router.replace("/login?expired=1");
          return;
        }

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ API Error:", {
            status: res.status,
            body: errorText,
          });
          throw new Error(`Failed to fetch projects: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          console.log("✅ Projects count:", data.data?.length || 0);
          setProjects(data.data || []);
          setPagination(data.pagination || { page: 1, total: 0, pages: 0 });
        } else {
          throw new Error(data.error || "Failed to load projects");
        }
      } catch (err) {
        console.error("💥 Fetch projects error:", err);
        setError(err.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    },
    [authUser, selectedStatus, selectedCategory, searchTerm, logout, router],
  );

  // Fetch when auth is ready or filters change
  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      router.replace("/login");
      return;
    }

    fetchProjects();
  }, [authUser, authLoading, fetchProjects, router]);

  // Debounced search effect (optional: improves performance)
  useEffect(() => {
    if (!authUser) return;

    const timer = setTimeout(() => {
      fetchProjects(1); // Reset to page 1 on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // 👈 Send cookies so server can clear them
      });
    } catch (err) {
      console.warn("Logout API call failed:", err);
    } finally {
      logout(); // Clears context state + redirects
    }
  };

  // Filter projects client-side (for search/category)
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      !searchTerm ||
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Loading states
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-inter text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">
            Unable to load projects
          </h3>
          <p className="font-inter text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => fetchProjects(1)}
            className="px-5 py-2.5 bg-gray-900 text-white font-inter rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!authUser) {
    return null; // useEffect will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      <Sidebar user={authUser} onLogout={handleLogout} />

      <div className="flex-1">
        <DashboardHeader user={authUser} />

        <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-poppins font-bold text-2xl text-gray-900">
                My Projects
              </h1>
              <p className="text-gray-500 mt-1">
                Manage all your posted projects and bids
              </p>
            </div>
            <Link
              href="/dashboard/bids/create"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-poppins font-medium hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Post New Project
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    fetchProjects(1); // Reset pagination
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    fetchProjects(1); // Reset pagination
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => fetchProjects(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 font-inter text-sm"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-600 font-inter text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchProjects(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 font-inter text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FunnelIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-poppins font-semibold text-gray-900 text-lg mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ||
                selectedCategory !== "All" ||
                selectedStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by posting your first project"}
              </p>
              <Link
                href="/dashboard/bids/create"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-poppins font-medium hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all"
              >
                <PlusIcon className="w-5 h-5" />
                Post New Project
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
