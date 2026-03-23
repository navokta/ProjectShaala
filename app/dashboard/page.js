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
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      window.location.href = "/login";
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();
        setUser(data.user);
        setStats(data.stats);
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authUser, authLoading]);

  const handleLogout = () => {
    // Clear auth cookies – you can call /api/auth/logout
    fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      window.location.href = "/login";
    });
  };

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

  if (!user || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="font-sans text-gray-600">Unable to load dashboard. Please try again.</p>
      </div>
    );
  }

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

            {/* Uncomment later when other components are ready */}
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