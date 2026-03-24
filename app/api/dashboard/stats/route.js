// app/api/dashboard/stats/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Bid from "@/lib/models/Bid";
import Message from "@/lib/models/Message";

export async function GET(request) {
  try {
    // ✅ Pass the request object to getCurrentUser
    const user = await getCurrentUser(request);

    if (!user || !user._id) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing authentication" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    // Fetch stats in parallel for better performance
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      completedProjectsAgg,
      userProjects,
      unreadMessages,
    ] = await Promise.all([
      Project.countDocuments({ client: user._id }).catch(() => 0),
      Project.countDocuments({ client: user._id, status: "in-progress" }).catch(
        () => 0,
      ),
      Project.countDocuments({ client: user._id, status: "completed" }).catch(
        () => 0,
      ),
      Project.aggregate([
        {
          $match: {
            client: user._id,
            status: "completed",
            budget: { $type: "number" },
          },
        },
        { $group: { _id: null, total: { $sum: "$budget" } } },
      ]).catch(() => []),
      Project.find({ client: user._id })
        .select("_id")
        .catch(() => []),
      Message.countDocuments({ receiver: user._id, read: false }).catch(
        () => 0,
      ),
    ]);

    // Calculate pending bids
    const projectIds = userProjects.map((p) => p._id);
    const pendingBids =
      projectIds.length > 0
        ? await Bid.countDocuments({
            project: { $in: projectIds },
            status: "pending",
          }).catch(() => 0)
        : 0;

    // Calculate total spend safely
    const totalSpend =
      completedProjectsAgg.length > 0
        ? Number(completedProjectsAgg[0].total) || 0
        : 0;

    // Calculate profile completion
    const profileComplete = calculateProfileCompletion(user);

    // Build safe user data object
    const userData = {
      id: user._id?.toString(),
      name: user.name || "Anonymous",
      email: user.email || "",
      username: user.username || "",
      phone: user.phone || "",
      avatar: user.avatar
        ? user.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=111827&color=fff&size=128`,
      role: user.role || "buyer",
      profileComplete,
    };

    // Build stats object with fallbacks
    const stats = {
      totalProjects: Number(totalProjects) || 0,
      activeProjects: Number(activeProjects) || 0,
      completedProjects: Number(completedProjects) || 0,
      totalSpend,
      pendingBids: Number(pendingBids) || 0,
      messages: Number(unreadMessages) || 0,
    };

    return NextResponse.json({ user: userData, stats });
  } catch (error) {
    console.error("💥 Dashboard stats API error:", {
      message: error?.message,
      name: error?.name,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `Server error: ${error?.message}`
            : "Failed to load dashboard data. Please try again.",
      },
      { status: 500 },
    );
  }
}

// Helper to calculate profile completion
function calculateProfileCompletion(user) {
  if (!user) return 0;

  const profileFields = [
    { key: "name", weight: 1 },
    { key: "username", weight: 1 },
    { key: "phone", weight: 1 },
    { key: "avatar", weight: 1 },
    { key: "bio", weight: 1 },
  ];

  const totalWeight = profileFields.reduce(
    (sum, field) => sum + field.weight,
    0,
  );
  const completedWeight = profileFields.reduce((sum, field) => {
    const value = user[field.key];
    const isComplete =
      value != null &&
      value !== "" &&
      (typeof value !== "string" || value.trim() !== "");
    return sum + (isComplete ? field.weight : 0);
  }, 0);

  return Math.round((completedWeight / totalWeight) * 100);
}
