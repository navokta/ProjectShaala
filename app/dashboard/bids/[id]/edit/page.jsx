// app/dashboard/bids/[id]/edit/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import ProjectForm from "@/components/Dashboard/Bids/ProjectForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { user: authUser, loading: authLoading, logout } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch project - memoized with useCallback
  const fetchProject = useCallback(async () => {
    if (!authUser?._id) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/projects/${params.id}`, {
        credentials: "include", // 👈 HttpOnly cookies auto-send
        cache: "no-store",
      });

      // Handle auth errors
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

  // ✅ Fetch on mount / auth ready
  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      router.replace("/login");
      return;
    }

    fetchProject();
  }, [authUser, authLoading, fetchProject, router]);

  // ✅ Submit handler - cookies auto-sent, no token header needed
  const handleSubmit = async (projectData) => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
        credentials: "include", // 👈 Browser sends accessToken cookie automatically
        // ❌ NO Authorization header needed - backend reads from cookies
      });

      const data = await res.json();

      // Handle auth errors
      if (res.status === 401 || res.status === 403) {
        logout();
        router.replace("/login?expired=1");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to update project");
      }

      router.push(`/dashboard/bids/${params.id}`);
      router.refresh(); // Refresh server components if needed
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to update project");
    } finally {
      setSubmitting(false);
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
