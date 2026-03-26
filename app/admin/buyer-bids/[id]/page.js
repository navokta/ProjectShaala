"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import Footer from "@/components/Footer";

export default function AdminBuyerBidDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!authUser || (authUser.role !== "admin" && authUser.role !== "owner")) {
      router.replace("/dashboard");
      return;
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    if (id && authUser && (authUser.role === "admin" || authUser.role === "owner")) {
      fetchProject();
    }
  }, [id, authUser]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/buyer-bids/${id}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to fetch project");
      setProject(data.project);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/buyer-bids/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          status: newStatus,
          category: project.category,
          budgetMin: project.budgetMin,
          budgetMax: project.budgetMax,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      
      setProject(data.updatedProject || { ...project, status: newStatus });
      alert("Project status updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error || "Project not found"}</p>
            <Link href="/admin/buyer-bids" className="text-blue-600 hover:underline">
              Return to Buyer Bids
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      <Sidebar user={authUser} onLogout={() => {}} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader user={authUser} />

        <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-poppins font-bold text-2xl text-gray-900">
              Buyer Bid (Project) Details
            </h1>
            <Link href="/admin/buyer-bids" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              Back to Buyer Bids
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Project Title & Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-semibold mb-4">
                  {project.category}
                </span>
                
                <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700 text-sm">
                  {project.description || "No description provided."}
                </div>
                
                {project.requirements && project.requirements.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      {project.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {project.skills && project.skills.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills Needed</h4>
                    <div className="flex flex-wrap gap-2">
                       {project.skills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">{skill}</span>
                       ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Budget & Timeline */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Logistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Budget Setup</p>
                    <p className="text-lg font-bold text-gray-900">
                      {project.budgetType === 'hourly' ? `Hourly (₹${project.hourlyRate}/nr)` : `Fixed (₹${project.budgetMin} - ₹${project.budgetMax})`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Timeline</p>
                    <p className="text-lg font-medium text-gray-900">{project.timeline}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Experience Level</p>
                    <p className="text-md font-medium text-gray-900">{project.experienceLevel}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Visibility</p>
                    <p className="text-md font-medium text-gray-900">{project.visibility}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Status Management */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border mb-4 ${
                  project.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' :
                  project.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  project.status === 'closed' || project.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {project.status?.toUpperCase()}
                </span>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Change Status (Admin)</label>
                  <select 
                    value={project.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updating}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="draft">Draft</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Buyer Info</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-700">Name:</span> {project.buyerName}</p>
                  <p><span className="font-medium text-gray-700">Email:</span> {project.buyerEmail}</p>
                  <Link href={`/admin/users?email=${project.buyerEmail}`} className="text-blue-600 hover:underline inline-block mt-4 text-xs font-semibold uppercase tracking-wider">
                    Search Buyer
                  </Link>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                   <div className="bg-gray-50 p-3 rounded border border-gray-100">
                     <p className="text-xl font-bold text-gray-900">{project.bidCount}</p>
                     <p className="text-xs text-gray-500 uppercase">Bids</p>
                   </div>
                   <div className="bg-gray-50 p-3 rounded border border-gray-100">
                     <p className="text-xl font-bold text-gray-900">{project.viewCount}</p>
                     <p className="text-xs text-gray-500 uppercase">Views</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
