// app/dashboard/bids/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import ProjectForm from "@/components/Dashboard/ProjectForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUser({
      name: "Bhavy Sharma",
      email: "bhavy@example.com",
      avatar: "https://placehold.co/100/111827/ffffff?text=BS",
      role: "buyer",
    });

    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setProject(data.data);
      } else {
        setError("Project not found");
      }
    } catch (error) {
      console.error("Fetch project error:", error);
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (projectData) => {
    try {
      setSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");

      const res = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update project");
      }

      router.push(`/dashboard/bids/${params.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
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
            {error || "Project not found"}
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

        <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-20 py-10">
          <div className="mb-8">
            <Link
              href={`/dashboard/bids/${params.id}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Project
            </Link>
            <h1 className="font-poppins font-bold text-2xl text-gray-900">
              Edit Project
            </h1>
            <p className="text-gray-500 mt-1">
              Update your project requirements
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <ProjectForm
            onSubmit={handleSubmit}
            loading={submitting}
            initialData={project}
            isEdit={true}
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}
