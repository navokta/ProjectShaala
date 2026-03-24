// app/developer/page.jsx
"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import DeveloperSidebar from "@/components/DevDashboard/DeveloperSidebar";
import DeveloperHeader from "@/components/DevDashboard/DeveloperHeader";
import DeveloperStatsGrid from "@/components/DevDashboard/DeveloperStatsGrid";
import EarningsOverview from "@/components/DevDashboard/EarningsOverview";
// import BidsHistory from "@/components/DevDashboard/BidsHistory";
import ActiveProjects from "@/components/DevDashboard/ActiveProjects";
// import AvailabilityToggle from "@/components/DevDashboard/AvailabilityToggle";
import SkillsSection from "@/components/DevDashboard/SkillsSection";
// import RecentMessages from "@/components/DevDashboard/RecentMessages";
// import DeveloperActivityFeed from "@/components/DevDashboard/DeveloperActivityFeed";

export default function DeveloperDashboard() {
  const [developer, setDeveloper] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data (will be replaced with real API calls)
  const [bids, setBids] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();

        // Developer profile
        setDeveloper({
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar,
          role: data.user.role,
          title: data.user.title || "",
          location: data.user.location || "",
          hourlyRate: data.user.hourlyRate || 0,
          availability: data.user.availability !== undefined ? data.user.availability : true,
          rating: data.stats.avgRating || 0,
          totalReviews: data.stats.totalReviews || 0,
          profileComplete: data.user.profileComplete || 0,
          joinedDate: data.user.createdAt,
        });

        // Stats
        setStats({
          totalEarnings: data.stats.totalEarnings || 0,
          activeProjects: data.stats.activeProjects || 0,
          completedProjects: data.stats.completedProjects || 0,
          avgRating: data.stats.avgRating || 0,
          pendingBids: data.stats.pendingBids || 0,
          messages: data.stats.messages || 0,
          profileViews: data.stats.profileViews || 0,
          pendingEarnings: data.stats.pendingEarnings || 0,
          releasedEarnings: data.stats.releasedEarnings || 0,
        });

        // TODO: Replace with actual API calls for:
        // - Active projects: fetch("/api/developer/projects")
        // - Bids: fetch("/api/developer/bids")
        // - Skills: fetch("/api/developer/skills") (might come from user.skills)
        // - Activities: fetch("/api/developer/activities")
        // For now, we keep mock data to avoid breaking layout.
        setBids([]);
        setActiveProjects([]);
        setSkills([]);
        setActivities([]);
      } catch (err) {
        console.error("Dashboard data error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const toggleAvailability = (status) => {
    // API call: PATCH /api/developer/availability
    console.log("Availability updated:", status);
    setDeveloper((prev) => (prev ? { ...prev, availability: status } : null));
  };

  const handleSkillUpdate = (newSkills) => {
    setSkills(newSkills);
    // API call: PATCH /api/developer/skills
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-inter text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !developer || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      <DeveloperSidebar
        developer={developer}
        stats={stats}
        onLogout={handleLogout}
      />

      <div className="flex-1 lg:ml-0">
        <DeveloperHeader developer={developer} />

        <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-10">
          <DeveloperStatsGrid stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-4">
            <div className="lg:col-span-3">
              <EarningsOverview
                pending={stats.pendingEarnings || 0}
                released={stats.releasedEarnings || 0}
                total={stats.totalEarnings}
              />
            </div>
            {/* <div className="lg:col-span-1">
              <AvailabilityToggle
                isAvailable={developer.availability}
                onToggle={toggleAvailability}
              />
            </div> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            <ActiveProjects projects={activeProjects} />
            {/* <BidsHistory bids={bids} /> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-4">
              <SkillsSection skills={skills} onSkillUpdate={handleSkillUpdate} />
            </div>
            {/* <div className="lg:col-span-1">
              <RecentMessages count={stats.messages} />
            </div> */}
          </div>

          {/* <DeveloperActivityFeed activities={activities} /> */}
        </main>

        <Footer />
      </div>
    </div>
  );
}