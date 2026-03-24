// app/dashboard/bids/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import BidList from "@/components/Dashboard/BidList";
import ProjectStatus from "@/components/Dashboard/ProjectStatus";
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
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setUser({
      name: "Bhavy Sharma",
      email: "bhavy@example.com",
      avatar: "https://placehold.co/100/111827/ffffff?text=BS",
      role: "buyer",
    });

    fetchProject();
    fetchBids();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setProject(data.data);
      }
    } catch (error) {
      console.error("Fetch project error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}/bids`);
      const data = await res.json();

      if (data.success) {
        setBids(data.data);
      }
    } catch (error) {
      console.error("Fetch bids error:", error);
    }
  };

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
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/projects/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard/bids");
      } else {
        alert(data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

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
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="flex-1">
        <DashboardHeader user={user} />

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
                  Posted {project.age || "Recently"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/bids/${params.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-900 transition-all"
              >
                <PencilIcon className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting || project.bidCount > 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
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
                          : `₹${project.budgetMin.toLocaleString()} - ₹${project.budgetMax.toLocaleString()}`}
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
