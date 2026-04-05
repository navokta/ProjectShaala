"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function AdminDeveloperBidsPage() {
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

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchBids = useCallback(async (page = 1) => {
    if (authUser?.role !== "admin" && authUser?.role !== "owner") return;

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ page, limit: 20 });
      if (searchTerm.trim()) queryParams.append("search", searchTerm.trim());
      if (statusFilter !== "all") queryParams.append("status", statusFilter);

      const res = await fetch(`/api/admin/developer-bids?${queryParams}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch bids");

      setBids(data.data || []);
      setPagination(data.pagination || { page: 1, total: 0, pages: 0 });
    } catch (err) {
      setError(err.message);
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [authUser, searchTerm, statusFilter]);

  useEffect(() => {
    if (authUser?.role === "admin" || authUser?.role === "owner") {
      fetchBids();
    }
  }, [authUser, fetchBids]);

  useEffect(() => {
    const timer = setTimeout(() => fetchBids(1), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleEdit = (bid) => {
    setEditingBid(bid._id);
    setEditForm({
      bidAmount: bid.bidAmount || 0,
      timeline: bid.timeline || "",
      status: bid.status || "pending",
    });
  };

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
      if (!res.ok) throw new Error(data.message);
      setBids(prev => prev.map(b => b._id === bidId ? { ...b, ...editForm } : b));
      setEditingBid(null);
      showNotification("Bid updated");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bidId) => {
    if (!confirm("Delete this bid?")) return;
    try {
      setDeletingId(bidId);
      const res = await fetch(`/api/admin/developer-bids/${bidId}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBids(prev => prev.filter(b => b._id !== bidId));
      setPagination(p => ({ ...p, total: Math.max(0, p.total - 1) }));
      showNotification("Bid deleted");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusStyles = (status) => ({
    pending: "bg-gray-100 text-gray-700 border-gray-200",
    accepted: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
  }[status] || "bg-gray-100 text-gray-700 border-gray-200");

  if (authLoading || (loading && bids.length === 0)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-gray-900">Manage Developer Bids</h1>
          <p className="text-gray-500 mt-1">Search, edit, and remove bids across all projects</p>
        </div>
        <button onClick={() => fetchBids(pagination.page)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100">
          <ArrowPathIcon className="w-4 h-4" /> Refresh
        </button>
      </div>

      {notification && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 ${notification.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
          {notification.type === "error" ? <XMarkIcon className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}><XMarkIcon className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by developer, email, or project..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Filter by Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr><th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Developer</th><th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Project</th><th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Bid Amount</th><th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Timeline</th><th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th><th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {bids.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-500">No bids found</td></tr>
              ) : (
                bids.map(bid => (
                  <tr key={bid._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {bid.developer ? (
                        <div className="flex items-center gap-3">
                          {bid.developer.avatar && <img src={bid.developer.avatar} className="w-10 h-10 rounded-full border" />}
                          <div><p className="font-medium text-gray-900 text-sm">{bid.developer.name}</p><p className="text-xs text-gray-500">{bid.developer.email}</p></div>
                        </div>
                      ) : <span className="text-gray-400">Deleted User</span>}
                    </td>
                    <td className="px-6 py-4"><p className="text-sm text-gray-900 max-w-xs">{bid.project?.title || "Unknown Project"}</p>{bid.project?.category && <span className="text-xs text-gray-400">{bid.project.category}</span>}</td>
                    <td className="px-6 py-4">
                      {editingBid === bid._id ? (
                        <input type="number" value={editForm.bidAmount} onChange={(e) => setEditForm({ ...editForm, bidAmount: Number(e.target.value) })} className="w-28 px-2 py-1 text-sm border rounded" min="0" />
                      ) : <span className="font-semibold">₹{bid.bidAmount?.toLocaleString("en-IN")}</span>}
                    </td>
                    <td className="px-6 py-4">
                      {editingBid === bid._id ? (
                        <input type="text" value={editForm.timeline} onChange={(e) => setEditForm({ ...editForm, timeline: e.target.value })} className="w-32 px-2 py-1 text-sm border rounded" placeholder="e.g., 2 weeks" />
                      ) : <span className="text-gray-600">{bid.timeline}</span>}
                    </td>
                    <td className="px-6 py-4">
                      {editingBid === bid._id ? (
                        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="px-3 py-1 text-sm border rounded bg-white">
                          <option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option><option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyles(bid.status)}`}>{bid.status}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        {editingBid === bid._id ? (
                          <>
                            <button onClick={() => handleSave(bid._id)} disabled={submitting} className="p-2 text-green-600 hover:bg-green-50 rounded">{submitting ? <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" /> : <CheckIcon className="w-4 h-4" />}</button>
                            <button onClick={() => { setEditingBid(null); setEditForm({}); }} className="p-2 text-gray-600 hover:bg-gray-100 rounded"><XMarkIcon className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <>
                            <Link href={`/admin/developer-bids/${bid._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><EyeIcon className="w-4 h-4" /></Link>
                            <button onClick={() => handleEdit(bid)} className="p-2 text-gray-600 hover:bg-gray-100 rounded"><PencilIcon className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(bid._id)} disabled={deletingId === bid._id} className="p-2 text-red-600 hover:bg-red-50 rounded">
                              {deletingId === bid._id ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /> : <TrashIcon className="w-4 h-4" />}
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

        {pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-3">
            <p className="text-sm text-gray-500">Showing {(pagination.page-1)*20+1} to {Math.min(pagination.page*20, pagination.total)} of {pagination.total} bids</p>
            <div className="flex gap-2">
              <button onClick={() => fetchBids(pagination.page-1)} disabled={pagination.page===1} className="px-4 py-2 rounded-xl border disabled:opacity-50 hover:bg-gray-100">Previous</button>
              <span className="px-3 py-2 text-gray-600 bg-gray-50 rounded-lg">Page {pagination.page} of {pagination.pages}</span>
              <button onClick={() => fetchBids(pagination.page+1)} disabled={pagination.page===pagination.pages} className="px-4 py-2 rounded-xl border disabled:opacity-50 hover:bg-gray-100">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}