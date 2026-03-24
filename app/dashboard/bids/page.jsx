// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // Redirect if not authenticated
    if (!authUser) {
      router.replace("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Get token from localStorage with correct key
        const token = localStorage.getItem("accessToken");

        // If no token, redirect to login
        if (!token) {
          router.replace("/login");
          return;
        }

        // Fetch protected API with Authorization header
        const res = await fetch("/api/dashboard/stats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store", // Disable Next.js caching
        });

        // Handle unauthorized/expired token
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          logout();
          router.replace("/login");
          return;
        }

        // Handle other errors
        if (!res.ok) {
          throw new Error(`Failed to fetch dashboard: ${res.status}`);
        }

        const data = await res.json();

        // Update state with API response
        setUser(data.user);
        setStats(data.stats);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authUser, authLoading, router, logout]);

  // Logout handler using context
  const handleLogout = () => {
    logout();
  };

  // Show loading spinner while auth or data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-sans text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if data failed to load
  if (!user || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="font-sans text-gray-600 mb-4">
            Unable to load dashboard.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-poppins text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex font-inter">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <DashboardHeader user={user} />

          <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-10">
            {/* Stats Grid */}
            <StatsGrid stats={stats} />

            {/* Quick Actions + Profile Completion */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 mt-4">
              <div className="lg:col-span-3">
                <QuickActions />
              </div>
              <div className="lg:col-span-1">
                <ProfileCompletion user={user} />
              </div>
            </div>

            {/* Budget + Developer Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-1">
                <BudgetOverview spent={stats.totalSpend} budget={100000} />
              </div>
              <div className="lg:col-span-2">
                <DeveloperSuggestions />
              </div>
            </div>

            {/* Optional Components - Uncomment when ready */}
            {/* <RecentProjects /> */}
            {/* <RecentMessages count={stats.messages} /> */}
            {/* <ActivityFeed /> */}
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
