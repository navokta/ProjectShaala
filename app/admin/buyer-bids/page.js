"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import Footer from "@/components/Footer";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function AdminBuyerBidsPage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, logout } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      router.replace("/login");
      return;
    }
    if (authUser.role !== "owner" && authUser.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
  }, [authUser, authLoading, router]);

  const fetchProjects = useCallback(
    async (page = 1) => {
      if (authUser?.role !== "admin" && authUser?.role !== "owner") return;

      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page,
          limit: 20,
        });

        if (searchTerm.trim()) queryParams.append("search", searchTerm.trim());
        if (statusFilter !== "all") queryParams.append("status", statusFilter);

        const res = await fetch(`/api/admin/buyer-bids?${queryParams}`, {
          credentials: "include",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401 || res.status === 403) {
          logout();
          router.replace("/login?expired=1");
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch buyer bids");

        if (data.success) {
          setProjects(data.projects || []);
          setPagination(data.pagination || { page: 1, total: 0, pages: 0 });
        }
      } catch (err) {
        setError(err.message || "Failed to load buyer bids");
      } finally {
        setLoading(false);
      }
    },
    [authUser, searchTerm, statusFilter, logout, router],
  );

  useEffect(() => {
    if (authUser?.role === "admin" || authUser?.role === "owner") {
      fetchProjects();
    }
  }, [authUser, fetchProjects]);

  useEffect(() => {
    if (authUser?.role !== "admin" && authUser?.role !== "owner") return;
    const timer = setTimeout(() => fetchProjects(1), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this buyer bid (project)? This cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(projectId);
      const res = await fetch(`/api/admin/buyer-bids/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete buyer bid");

      alert("Buyer bid deleted successfully");
      fetchProjects(pagination.page);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authUser || (authUser.role !== "admin" && authUser.role !== "owner")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      <Sidebar user={authUser} onLogout={logout} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader user={authUser} />

        <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">
                Manage Buyer Bids
              </h1>
              <p className="text-gray-500 mt-1">
                Search, view, and manage projects posted by buyers
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
              <span>{error}</span>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, description, or buyer email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-black pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter text-sm transition-shadow"
                />
              </div>

              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    fetchProjects(1);
                  }}
                  className="w-full text-black px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {loading && projects.length === 0 ? (
                <div className="p-8 flex justify-center">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    No buyer bids found
                  </p>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Project / Buyer
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr
                        key={project._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <Link href={`/admin/buyer-bids/${project._id}`} className="font-poppins font-medium text-gray-900 hover:text-blue-600 block truncate max-w-xs">{project.title}</Link>
                          <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                           {project.buyerName} ({project.buyerEmail})
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {project.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                          {project.budgetType === "hourly" ? `₹${project.hourlyRate}/nr` : `₹${project.budgetMin} - ₹${project.budgetMax}`}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                              project.status === "open"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : project.status === "closed" || project.status === "cancelled"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {project.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center justify-end gap-2">
                          <Link
                             href={`/admin/buyer-bids/${project._id}`}
                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                             title="View Details"
                           >
                             <EyeIcon className="h-5 w-5" />
                           </Link>
                          <button
                            onClick={() => handleDelete(project._id)}
                            disabled={deletingId === project._id}
                            className={`p-2 rounded-lg transition-colors ${
                              deletingId === project._id
                                ? "text-gray-400 bg-gray-50"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                            title="Delete Project"
                          >
                            {deletingId === project._id ? (
                              <div className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                            ) : (
                              <TrashIcon className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
                <span className="text-sm text-gray-500">
                  Page <span className="font-medium text-gray-900">{pagination.page}</span> of{" "}
                  <span className="font-medium text-gray-900">{pagination.pages}</span> (
                  {pagination.total} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchProjects(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchProjects(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
