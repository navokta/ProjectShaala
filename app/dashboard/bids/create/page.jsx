// app/dashboard/bids/create/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import ProjectForm from "@/components/Dashboard/Bids/ProjectForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CreateProjectPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch current user from API (cookies sent automatically)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // 🍪 Send cookies with request
        });

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login"); // Redirect if not logged in
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // 🔹 Logout: Call API to clear cookies server-side
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // 🍪 Send cookies so server can clear them
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/login");
    }
  };

  const handleSubmit = async (projectData) => {
    try {
      setSubmitting(true);
      setError(null);

      console.log("📤 Sending project data:", projectData); // 🔍 Debug log

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
        credentials: "include",
      });

      // 🔍 Read response safely
      const contentType = res.headers.get("content-type");
      let data;

      if (contentType?.includes("application/json")) {
        data = await res.json();
        console.log("📥 Server response:", { status: res.status, data }); // 🔍 Debug log
      } else {
        const text = await res.text();
        throw new Error(
          `Server returned ${res.status}: ${text || "No response body"}`,
        );
      }

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          throw new Error("Session expired. Please login again.");
        }
        // ✅ Show the ACTUAL validation error from server
        throw new Error(data.error || data.message || `Error ${res.status}`);
      }

      // ✅ Success
      router.push("/dashboard/bids");
      router.refresh();
    } catch (err) {
      console.error("❌ Create project error:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 Loading state while fetching user
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // 🔹 Redirect if no user (shouldn't happen due to useEffect, but safe fallback)
  if (!user) {
    return null;
  }

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
          <ProjectForm onSubmit={handleSubmit} loading={submitting} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
