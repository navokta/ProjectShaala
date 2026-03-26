// app/admin/developer-bids/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function AdminDeveloperBidsPage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, logout } = useAuth();

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  const [editingBid, setEditingBid] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // ✅ Role check & redirect
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

  // ✅ Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ✅ Fetch bids with search/filter/pagination
  const fetchBids = useCallback(
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

        const res = await fetch(`/api/admin/developer-bids?${queryParams}`, {
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
        if (!res.ok) throw new Error(data.message || "Failed to fetch bids");

        if (data.success) {
          setBids(data.data || []);
          setPagination(data.pagination || { page: 1, total: 0, pages: 0 });
        }
      } catch (err) {
        console.error("Fetch bids error:", err);
        setError(err.message || "Failed to load bids");
        showNotification(err.message || "Failed to load bids", "error");
      } finally {
        setLoading(false);
      }
    },
    [authUser, searchTerm, statusFilter, logout, router],
  );

  // ✅ Initial fetch + auth dependency
  useEffect(() => {
    if (authUser?.role === "admin" || authUser?.role === "owner") {
      fetchBids();
    }
  }, [authUser, fetchBids]);

  // ✅ Debounced search
  useEffect(() => {
    if (authUser?.role !== "admin" && authUser?.role !== "owner") return;
    const timer = setTimeout(() => fetchBids(1), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ Edit bid handler
  const handleEdit = (bid) => {
    setEditingBid(bid._id);
    setEditForm({
      proposal: bid.proposal || "",
      bidAmount: bid.bidAmount || 0,
      timeline: bid.timeline || "",
      status: bid.status || "pending",
      coverLetter: bid.coverLetter || "",
    });
  };

  // ✅ Save edited bid
  const handleSave = async (bidId) => {
    try {
      setSubmitting(true);
      const res = await fetch(`/api/admin/developer-bids/${bidId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update bid");

      setBids((prev) =>
        prev.map((b) => (b._id === bidId ? { ...b, ...editForm } : b)),
      );
      setEditingBid(null);
      setEditForm({});
      showNotification("Bid updated successfully!");
    } catch (err) {
      console.error("Save error:", err);
      showNotification(err.message || "Failed to save changes", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Delete bid handler
  const handleDelete = async (bidId) => {
    if (
      !confirm(
        "Are you sure you want to delete this bid? This cannot be undone.",
      )
    )
      return;

    try {
      setDeletingId(bidId);
      const res = await fetch(`/api/admin/developer-bids/${bidId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete bid");

      setBids((prev) => prev.filter((b) => b._id !== bidId));
      setPagination((p) => ({
        ...p,
        total: Math.max(0, p.total - 1),
        pages: p.total - 1 === 0 ? 1 : Math.ceil((p.total - 1) / 20),
      }));
      showNotification("Bid deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      showNotification(err.message || "Failed to delete bid", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      logout();
    }
  };

  // ✅ Loading / Auth states
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authUser || (authUser.role !== "admin" && authUser.role !== "owner")) {
    return null;
  }

  // ✅ Status badge styles
  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-gray-100 text-gray-700 border-gray-200",
      accepted: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      completed: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      <Sidebar user={authUser} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader user={authUser} />

        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 animate-fade-in ${
              notification.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            {notification.type === "error" ? (
              <ExclamationTriangleIcon className="w-5 h-5" />
            ) : (
              <CheckIcon className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:opacity-70"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-10 flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">
              Manage Developer Bids
            </h1>
              <p className="text-gray-500 mt-1">
                Search, edit, and remove bids across all projects
              </p>
            </div>
            <button
              onClick={() => fetchBids(pagination.page)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all text-sm font-medium"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Filters Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                  Search
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by developer, email, or project..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-black pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter text-sm transition-shadow"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    fetchBids(1);
                  }}
                  className="w-full px-4 text-black py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <button
                onClick={() => fetchBids(pagination.page)}
                className="text-red-700 hover:underline text-sm font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Bids Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Developer
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Project
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Bid Amount
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Timeline
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bids.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <FunnelIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="font-poppins font-medium text-gray-900">
                          No bids found
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Try adjusting your search or filters
                        </p>
                      </td>
                    </tr>
                  ) : (
                    bids.map((bid) => (
                      <tr
                        key={bid._id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        {/* Developer */}
                        <td className="px-6 py-4">
                          {bid.developer ? (
                            <div className="flex items-center gap-3">
                              {bid.developer.avatar && (
                                <img
                                  src={bid.developer.avatar}
                                  alt={bid.developer.name}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                />
                              )}
                              <div>
                                <p className="font-poppins font-medium text-gray-900 text-sm">
                                  {bid.developer.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {bid.developer.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Deleted User
                            </span>
                          )}
                        </td>

                        {/* Project */}
                        <td className="px-6 py-4">
                          <p className="font-inter text-sm text-gray-900 line-clamp-2 max-w-xs">
                            {bid.project?.title || "Unknown Project"}
                          </p>
                          {bid.project?.category && (
                            <span className="text-xs text-gray-400">
                              {bid.project.category}
                            </span>
                          )}
                        </td>

                        {/* Bid Amount */}
                        <td className="px-6 py-4">
                          {editingBid === bid._id ? (
                            <input
                              type="number"
                              value={editForm.bidAmount}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  bidAmount: Number(e.target.value),
                                })
                              }
                              className="w-28 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900"
                              min="0"
                            />
                          ) : (
                            <span className="font-poppins font-semibold text-gray-900">
                              ₹{bid.bidAmount?.toLocaleString("en-IN")}
                            </span>
                          )}
                        </td>

                        {/* Timeline */}
                        <td className="px-6 py-4">
                          {editingBid === bid._id ? (
                            <input
                              type="text"
                              value={editForm.timeline}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  timeline: e.target.value,
                                })
                              }
                              className="w-32 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900"
                              placeholder="e.g., 2 weeks"
                            />
                          ) : (
                            <span className="text-gray-600 text-sm">
                              {bid.timeline}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {editingBid === bid._id ? (
                            <select
                              value={editForm.status}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  status: e.target.value,
                                })
                              }
                              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 bg-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                              <option value="completed">Completed</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyles(
                                bid.status,
                              )}`}
                            >
                              {bid.status}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {editingBid === bid._id ? (
                              <>
                                <button
                                  onClick={() => handleSave(bid._id)}
                                  disabled={submitting}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Save"
                                >
                                  {submitting ? (
                                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <CheckIcon className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingBid(null);
                                    setEditForm({});
                                  }}
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Cancel"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <Link
                                  href={`/admin/developer-bids/${bid._id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleEdit(bid)}
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(bid._id)}
                                  disabled={deletingId === bid._id}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete"
                                >
                                  {deletingId === bid._id ? (
                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <TrashIcon className="w-4 h-4" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-3">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {(pagination.page - 1) * 20 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700">
                    {Math.min(pagination.page * 20, pagination.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {pagination.total}
                  </span>{" "}
                  bids
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchBids(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 font-inter text-sm transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-gray-600 font-inter text-sm bg-gray-50 rounded-lg">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchBids(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 font-inter text-sm transition-colors"
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
