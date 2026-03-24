// app/dashboard/bids/create/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import ProjectForm from "@/components/Dashboard/Bids/ProjectForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CreateProjectPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "Bhavy Sharma",
    email: "bhavy@example.com",
    avatar: "https://placehold.co/100/111827/ffffff?text=BS",
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FIX 1: correct token key
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const handleSubmit = async (projectData) => {
    try {
      setLoading(true);
      setError(null);

      // ✅ FIX 2: correct key
      const token = localStorage.getItem("accessToken");

      // ❌ Agar token hi nahi hai → stop
      if (!token) {
        throw new Error("Please login again");
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ✅ FIX 3: safe header
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      // ✅ Success
      router.push("/dashboard/bids");
    } catch (err) {
      console.error("Create project error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="flex-1">
        <DashboardHeader user={user} />

        <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-20 py-10">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/bids"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Projects
            </Link>

            <h1 className="font-poppins font-bold text-2xl text-gray-900">
              Post New Project
            </h1>

            <p className="text-gray-500 mt-1">
              Describe your requirements and get bids from developers
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <ProjectForm onSubmit={handleSubmit} loading={loading} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
