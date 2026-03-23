// app/developer/page.jsx
"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import DeveloperSidebar from "@/components/DevDashboard/DeveloperSidebar";
import DeveloperHeader from "@/components/DevDashboard/DeveloperHeader";
import DeveloperStatsGrid from "@/components/DevDashboard/DeveloperStatsGrid";
import EarningsOverview from "@/components/DevDashboard/EarningsOverview";
import BidsHistory from "@/components/DevDashboard/BidsHistory";
import ActiveProjects from "@/components/DevDashboard/ActiveProjects";
import AvailabilityToggle from "@/components/DevDashboard/AvailabilityToggle";
import SkillsSection from "@/components/DevDashboard/SkillsSection";
import RecentMessages from "@/components/DevDashboard/RecentMessages";
import DeveloperActivityFeed from "@/components/DevDashboard/DeveloperActivityFeed";

export default function DeveloperDashboard() {
  const [developer, setDeveloper] = useState(null);
  const [stats, setStats] = useState({
    totalEarnings: 128500,
    activeProjects: 3,
    completedProjects: 18,
    avgRating: 4.9,
    pendingBids: 5,
    messages: 12,
    profileViews: 342,
  });

  const [bids, setBids] = useState([
    {
      id: 1,
      projectTitle: "E-commerce Platform",
      client: "TechStart Inc.",
      amount: 45000,
      status: "pending",
      date: "2026-03-20",
    },
    {
      id: 2,
      projectTitle: "Mobile App UI",
      client: "Appify Labs",
      amount: 28000,
      status: "accepted",
      date: "2026-03-18",
    },
    {
      id: 3,
      projectTitle: "API Integration",
      client: "DataFlow Co.",
      amount: 15000,
      status: "rejected",
      date: "2026-03-15",
    },
    {
      id: 4,
      projectTitle: "Dashboard Redesign",
      client: "MetricsHub",
      amount: 32000,
      status: "pending",
      date: "2026-03-12",
    },
    {
      id: 5,
      projectTitle: "Chat Bot Development",
      client: "SupportAI",
      amount: 22000,
      status: "pending",
      date: "2026-03-10",
    },
  ]);

  const [activeProjects, setActiveProjects] = useState([
    {
      id: 1,
      title: "Mobile App UI",
      client: "Appify Labs",
      deadline: "2026-04-15",
      progress: 65,
      milestone: "UI Components",
    },
    {
      id: 2,
      title: "Payment Gateway",
      client: "PayFast India",
      deadline: "2026-04-30",
      progress: 30,
      milestone: "API Setup",
    },
    {
      id: 3,
      title: "Admin Panel",
      client: "CloudManage",
      deadline: "2026-05-10",
      progress: 85,
      milestone: "Final Testing",
    },
  ]);

  const [skills, setSkills] = useState([
    "React",
    "Node.js",
    "MongoDB",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
    "Socket.IO",
    "Express.js",
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "bid",
      message: "Submitted bid for 'E-commerce Platform'",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "message",
      message: "New message from Appify Labs",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "milestone",
      message: "Completed 'UI Components' milestone",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "review",
      message: "Received 5★ review from TechStart Inc.",
      time: "2 days ago",
    },
    {
      id: 5,
      type: "payment",
      message: "₹28,000 released from escrow",
      time: "3 days ago",
    },
  ]);

  useEffect(() => {
    // Mock developer data — replace with API call to /api/developers/me
    setDeveloper({
      name: "Rahul Verma",
      email: "rahul.dev@example.com",
      avatar: "https://placehold.co/100/111827/ffffff?text=RV",
      role: "developer",
      title: "Full-Stack Developer",
      hourlyRate: 850,
      availability: true,
      rating: 4.9,
      totalReviews: 24,
      profileComplete: 90,
      joinedDate: "2024-03-15",
      location: "Bangalore, India",
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const toggleAvailability = (status) => {
    // API call: PATCH /api/developers/me/availability
    console.log("Availability updated:", status);
    // Optimistic update
    setDeveloper((prev) => (prev ? { ...prev, availability: status } : null));
  };

  const handleSkillUpdate = (newSkills) => {
    setSkills(newSkills);
    // API call: PATCH /api/developers/me/skills
  };

  if (!developer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-inter text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      {/* Sidebar */}
      <DeveloperSidebar
        developer={developer}
        stats={stats}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <DeveloperHeader developer={developer} />

        <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-10">
          {/* Stats Grid */}
          <DeveloperStatsGrid stats={stats} />

          {/* Top Row: Earnings + Availability */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 mt-4">
            <div className="lg:col-span-3">
              <EarningsOverview
                pending={28500}
                released={100000}
                total={stats.totalEarnings}
              />
            </div>
            <div className="lg:col-span-1">
              <AvailabilityToggle
                isAvailable={developer.availability}
                onToggle={toggleAvailability}
              />
            </div>
          </div>

          {/* Main Grid: Active Projects + Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ActiveProjects projects={activeProjects} />
            <BidsHistory bids={bids} />
          </div>

          {/* Secondary Grid: Skills + Messages */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SkillsSection
                skills={skills}
                onSkillUpdate={handleSkillUpdate}
              />
            </div>
            <div className="lg:col-span-1">
              <RecentMessages count={stats.messages} />
            </div>
          </div>

          {/* Activity Feed */}
          <DeveloperActivityFeed activities={activities} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
