"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import Footer from "@/components/Footer";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function HireDeveloperPage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    developerId: "",
    title: "",
    description: "",
    budget: "",
    timeline: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/dashboard/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to hire developer");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/bids");
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return null;
  if (!authUser) {
    router.replace("/login");
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      <Sidebar user={authUser} onLogout={handleLogout} />
      
      <div className="flex-1">
        <DashboardHeader user={authUser} />
        
        <main className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
          <div className="mb-8 flex items-center gap-4">
            <Link href="/dashboard/bids" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-poppins font-bold text-2xl text-gray-900">Directly Hire a Developer</h1>
              <p className="text-gray-500 mt-1">Send a direct project request to an exact developer by their ID.</p>
            </div>
          </div>

          <div className="bg-white border text-black border-gray-200 rounded-2xl p-8 shadow-sm">
            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                <p className="text-gray-600">The developer has been notified of your project.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Developer ID</label>
                  <input required type="text" name="developerId" value={formData.developerId} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="Paste Developer's exactly ID here..." />
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-poppins font-semibold text-lg text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                      <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="e.g. Build an E-commerce App" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                      <textarea required rows="4" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="Provide full details of your requirements here..."></textarea>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
                        <input required type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="e.g. 50000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timeline (Days)</label>
                        <input required type="number" name="timeline" value={formData.timeline} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="e.g. 30" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-8">
                  <Link href="/dashboard/bids" className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">Cancel</Link>
                  <button type="submit" disabled={submitting} className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition font-medium disabled:opacity-50">
                    {submitting ? "Sending..." : "Send Job Offer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
