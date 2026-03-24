// app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import StatsGrid from "@/components/Dashboard/StatsGrid";
import QuickActions from "@/components/Dashboard/QuickActions";
import RecentProjects from "@/components/Dashboard/RecentProjects";
import RecentMessages from "@/components/Dashboard/RecentMessages";
import BudgetOverview from "@/components/Dashboard/BudgetOverview";
import ActivityFeed from "@/components/Dashboard/ActivityFeed";
import DeveloperSuggestions from "@/components/Dashboard/DeveloperSuggestions";
import ProfileCompletion from "@/components/Dashboard/ProfileCompletion";

export default function DashboardPage() {
  const { user: authUser, loading: authLoading } = useAuth();

  // State management
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch dashboard data with retry logic
  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      window.location.href = "/login";
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/dashboard/stats", {
          credentials: "include", // 👈 Critical: sends auth cookies
          headers: {
            "Content-Type": "application/json",
          },
          // Optional: add cache busting for dev
          // cache: "no-store",
        });

        // Read response as text first for better debugging
        const responseText = await res.text();

        if (!res.ok) {
          console.error("❌ API Error Details:", {
            status: res.status,
            statusText: res.statusText,
            url: res.url,
            body: responseText,
            retryAttempt: retryCount + 1,
          });

          // Handle specific status codes
          if (res.status === 401) {
            // Token expired or invalid - redirect to login
            window.location.href = "/login?expired=1";
            return;
          }
          if (res.status === 403) {
            throw new Error("Access denied. Please check your permissions.");
          }
          if (res.status === 404) {
            throw new Error("Dashboard endpoint not found.");
          }
          if (res.status >= 500) {
            throw new Error("Server error. Please try again later.");
          }

          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        // Parse JSON only after confirming OK status
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("❌ JSON Parse Error:", parseError);
          console.error("Raw response:", responseText);
          throw new Error("Invalid response format from server");
        }

        // Validate expected data structure
        if (!data.user || !data.stats) {
          console.warn("⚠️ Unexpected API response structure:", data);
        }

        setUser(data.user);
        setStats(data.stats);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error("💥 Dashboard fetch failed:", err);
        setError(err.message || "Failed to load dashboard data");

        // Auto-retry for transient errors (max 2 retries)
        if (retryCount < 2 && !err.message?.includes("401")) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(
            `🔄 Retrying in ${delay}ms... (attempt ${retryCount + 1}/2)`,
          );
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, delay);
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authUser, authLoading, retryCount]); // Added retryCount as dependency

  // Handle logout with API call
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout API call failed:", err);
    } finally {
      // Always redirect to login
      window.location.href = "/login";
    }
  };

  // Handle manual retry
  const handleRetry = () => {
    setError(null);
    setRetryCount((prev) => prev + 1);
    setLoading(true);
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-inter text-gray-600">Loading dashboard...</p>
          {retryCount > 0 && (
            <p className="font-inter text-gray-400 text-sm mt-2">
              Attempt {retryCount + 1}...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error || !user || !stats) {
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
            Unable to load dashboard
          </h3>
          <p className="font-inter text-gray-500 mb-6">
            {error || "Something went wrong. Please try again."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 bg-gray-900 text-white font-inter rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 font-inter rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Go Home
            </button>
          </div>
          {process.env.NODE_ENV === "development" && error && (
            <details className="mt-6 text-left">
              <summary className="font-inter text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                Developer details
              </summary>
              <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 overflow-auto max-h-40">
                {error}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Success state - render dashboard
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex font-inter">
        <Sidebar user={user} onLogout={handleLogout} />
        <div className="flex-1 lg:ml-0">
          <DashboardHeader user={user} />
          <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-10">
            <StatsGrid stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 mt-4">
              <div className="lg:col-span-3">
                <QuickActions />
              </div>
              <div className="lg:col-span-1">
                <ProfileCompletion user={user} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-1">
                <BudgetOverview spent={stats.totalSpend} budget={100000} />
              </div>
              <div className="lg:col-span-2">
                <DeveloperSuggestions />
              </div>
            </div>

            {/* Uncomment when components are ready */}
            {/* <RecentProjects projects={stats.recentProjects} /> */}
            {/* <RecentMessages count={stats.messages} /> */}
            {/* <ActivityFeed activities={stats.recentActivity} /> */}
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
