// app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import StatsGrid from "@/components/Dashboard/StatsGrid";
import QuickActions from "@/components/Dashboard/QuickActions";
import RecentProjects from "@/components/Dashboard/RecentProjects";
import RecentMessages from "@/components/Dashboard/RecentMessages";
import BudgetOverview from "@/components/Dashboard/BudgetOverview";
import ActivityFeed from "@/components/Dashboard/ActivityFeed";
import DeveloperSuggestions from "@/components/Dashboard/DeveloperSuggestions";
import ProfileCompletion from "@/components/Dashboard/ProfileCompletion";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 12,
    activeProjects: 4,
    completedProjects: 7,
    totalSpend: 45750,
    pendingBids: 23,
    messages: 8,
  });

  useEffect(() => {
    // Mock user data - replace with API call
    setUser({
      name: "Bhavy Sharma",
      email: "bhavy@example.com",
      avatar: "https://placehold.co/100/111827/ffffff?text=BS",
      role: "buyer",
      profileComplete: 75,
    });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-sans text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header userType="buyer" isDashboard={true} />

      <main className="min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <DashboardHeader user={user} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-8">
          {/* Stats Grid */}
          <StatsGrid stats={stats} />

          {/* Quick Actions + Profile Completion */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <QuickActions />
            </div>
            <div className="lg:col-span-1">
              <ProfileCompletion percentage={user.profileComplete} />
            </div>
          </div>

          {/* Main Grid: Projects + Messages + Budget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Projects (2/3 width) */}
            <div className="lg:col-span-2">
              <RecentProjects />
            </div>

            {/* Budget Overview (1/3 width) */}
            <div className="lg:col-span-1">
              <BudgetOverview spent={stats.totalSpend} budget={100000} />
            </div>
          </div>

          {/* Secondary Grid: Messages + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Messages */}
            <div className="lg:col-span-1">
              <RecentMessages count={stats.messages} />
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
          </div>

          {/* Developer Suggestions */}
          <DeveloperSuggestions />
        </div>
      </main>

      <Footer />
    </>
  );
}
