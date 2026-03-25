// app/dashboard/bids/[id]/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import BidList from "@/components/Dashboard/Bids/BidList";
import ProjectStatus from "@/components/Dashboard/Bids/ProjectStatus";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  FolderIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user: authUser, loading: authLoading, logout } = useAuth();

  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ Fetch project - memoized with useCallback
  const fetchProject = useCallback(async () => {
    if (!authUser?._id) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/projects/${params.id}`, {
        credentials: "include", // 👈 HttpOnly cookies send karega
        cache: "no-store",
      });

      // Auth expired handling
      if (res.status === 401 || res.status === 403) {
        logout();
        router.replace("/login?expired=1");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch project");
      }

      const data = await res.json();
      if (data.success) {
        setProject(data.data);
      } else {
        setError(data.message || "Project not found");
      }
    } catch (err) {
      console.error("Fetch project error:", err);
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [authUser, params.id, logout, router]);

  // ✅ Fetch bids - memoized
  const fetchBids = useCallback(async () => {
    if (!authUser?._id) return;

    try {
      const res = await fetch(`/api/projects/${params.id}/bids`, {
        credentials: "include",
        cache: "no-store",
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        router.replace("/login?expired=1");
        return;
      }

      if (!res.ok) return;

      const data = await res.json();
      if (data.success) {
        setBids(data.data || []);
      }
    } catch (err) {
      console.error("Fetch bids error:", err);
    }
  }, [authUser, params.id, logout, router]);

  // ✅ Fetch on mount / auth ready
  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      router.replace("/login");
      return;
    }

    fetchProject();
    fetchBids();
  }, [authUser, authLoading, fetchProject, fetchBids, router]);

  // ✅ DELETE handler - cookies auto-sent, no token header needed
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeleting(true);

      const res = await fetch(`/api/projects/${params.id}`, {
        method: "DELETE",
        credentials: "include", // 👈 Browser automatically sends accessToken cookie
        // ❌ NO Authorization header needed - backend reads from cookies
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard/bids");
        router.refresh();
      } else {
        // Handle specific error: bids exist
        if (res.status === 400) {
          alert(
            "Cannot delete project with existing bids. Please close the project instead.",
          );
        } else {
          alert(data.message || "Failed to delete project");
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Logout - call API to clear HttpOnly cookies server-side
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // 👈 Send cookies so server can clear them
      });
    } catch (err) {
      console.warn("Logout API call failed:", err);
    } finally {
      logout(); // Clears context + redirects to /login
    }
  };

  // ✅ Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  // ✅ Error state
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
            Unable to load project
          </h3>
          <p className="font-inter text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchProject();
            }}
            className="px-5 py-2.5 bg-gray-900 text-white font-inter rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ Not authenticated - redirect handled in useEffect
  if (!authUser) {
    return null;
  }

  // ✅ Project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-poppins font-semibold text-gray-900 text-xl mb-2">
            Project not found
          </h2>
          <Link
            href="/dashboard/bids"
            className="text-gray-900 hover:underline"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      <Sidebar user={authUser} onLogout={handleLogout} />

      <div className="flex-1">
        <DashboardHeader user={authUser} />

        <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/bids"
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="font-poppins font-bold text-2xl text-gray-900">
                  {project.title}
                </h1>
                <p className="text-gray-500 mt-1">
                  Posted{" "}
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString()
                    : "Recently"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/bids/${params.id}/edit`}
                className="inline-flex text-black items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-900 transition-all"
              >
                <PencilIcon className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting || project.bidCount > 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  project.bidCount > 0
                    ? "Cannot delete project with bids"
                    : "Delete project"
                }
              >
                <TrashIcon className="w-4 h-4" />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-8">
            <ProjectStatus status={project.status} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
                  Project Overview
                </h2>
                <p className="text-gray-600 font-inter leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {project.requirements?.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-600 font-inter">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
                  Deliverables
                </h2>
                <ul className="space-y-2">
                  {project.deliverables?.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-600 font-inter">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-xl text-sm font-inter"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Budget & Timeline */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
                  Project Details
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-xl">
                      <CurrencyRupeeIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-poppins font-semibold text-gray-900">
                        {project.budgetType === "hourly"
                          ? `₹${project.hourlyRate}/hr`
                          : `₹${project.budgetMin?.toLocaleString()} - ₹${project.budgetMax?.toLocaleString()}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <ClockIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Timeline</p>
                      <p className="font-poppins font-semibold text-gray-900">
                        {project.timeline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-xl">
                      <FolderIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="font-poppins font-semibold text-gray-900">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-xl">
                      <UserGroupIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Experience Level</p>
                      <p className="font-poppins font-semibold text-gray-900">
                        {project.experienceLevel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
                  Engagement
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="font-poppins font-bold text-2xl text-gray-900">
                      {project.bidCount || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Bids</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="font-poppins font-bold text-2xl text-gray-900">
                      {project.viewCount || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Views</p>
                  </div>
                </div>
              </div>

              {/* Project Type */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <p className="text-xs text-gray-500 mb-1">Project Type</p>
                <p className="font-poppins font-semibold text-gray-900">
                  {project.projectType}
                </p>
              </div>
            </div>
          </div>

          {/* Bids Section */}
          {bids.length > 0 && (
            <div className="mt-10">
              <h2 className="font-poppins font-semibold text-gray-900 text-xl mb-6">
                Developer Bids ({bids.length})
              </h2>
              <BidList
                bids={bids}
                projectId={params.id}
                onSelectBid={() => {}}
              />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
