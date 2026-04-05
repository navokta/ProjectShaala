"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminBidDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();

  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Role check – layout already does this, but double‑check
  useEffect(() => {
    if (authLoading) return;
    if (!authUser || (authUser.role !== "admin" && authUser.role !== "owner")) {
      router.replace("/admin");
      return;
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    if (id && authUser && (authUser.role === "admin" || authUser.role === "owner")) {
      fetchBid();
    }
  }, [id, authUser]);

  const fetchBid = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/developer-bids/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch bid");
      setBid(data.bid);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/developer-bids/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposal: bid.proposal,
          bidAmount: bid.bidAmount || bid.amount,
          timeline: bid.timeline,
          status: newStatus,
          coverLetter: bid.coverLetter || "",
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      setBid(data.updatedBid || { ...bid, status: newStatus });
      alert("Status updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !bid) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600 mb-6">{error || "Bid not found"}</p>
        <Link href="/admin/developer-bids" className="text-blue-600 hover:underline">
          Return to Bids
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-poppins font-bold text-2xl text-gray-900">Bid Details</h1>
        <Link href="/admin/developer-bids" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          Back to Bids
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Proposal & Cover Letter */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Proposal</h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700 text-sm">
              {bid.proposal || "No proposal provided."}
            </div>

            {bid.coverLetter && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700 text-sm">
                  {bid.coverLetter}
                </div>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Terms</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Bid Amount</p>
                <p className="text-xl font-bold text-gray-900">₹{(bid.bidAmount || bid.amount)?.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Timeline</p>
                <p className="text-lg font-medium text-gray-900">{bid.timeline}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border mb-4 ${
                bid.status === "accepted"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : bid.status === "rejected"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : bid.status === "completed"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {bid.status?.toUpperCase()}
            </span>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Change Status (Admin)</label>
              <select
                value={bid.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={updating}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-gray-900"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Developer Info */}
          {bid.developer && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Developer Info</h3>
              <div className="flex items-center gap-3 mb-4">
                {bid.developer.avatar && (
                  <img
                    src={bid.developer.avatar}
                    alt={bid.developer.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                )}
                <div>
                  <p className="font-poppins font-medium text-gray-900">{bid.developer.name}</p>
                  <p className="text-xs text-gray-500">@{bid.developer.username}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Email:</span> {bid.developer.email}
                </p>
                {bid.developer.title && (
                  <p>
                    <span className="font-medium">Title:</span> {bid.developer.title}
                  </p>
                )}
                {bid.developer.location && (
                  <p>
                    <span className="font-medium">Location:</span> {bid.developer.location}
                  </p>
                )}
                <Link
                  href={`/admin/users/${bid.developer._id}`}
                  className="text-blue-600 hover:underline inline-block mt-2"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          )}

          {/* Project Info */}
          {bid.project && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Project Info</h3>
              <p className="font-medium text-gray-900 mb-1">{bid.project.title}</p>
              <p className="text-sm text-gray-500 mb-3">{bid.project.category}</p>
              {bid.project.budget && (
                <p className="text-sm">
                  <span className="font-medium">Project Budget:</span> ₹{bid.project.budget.toLocaleString()}
                </p>
              )}
              {bid.project.status && (
                <p className="text-sm mt-1">
                  <span className="font-medium">Project Status:</span> {bid.project.status}
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm italic text-gray-500">Links to project details are unavailable here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}