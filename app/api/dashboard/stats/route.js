// app/api/dashboard/stats/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Bid from "@/lib/models/Bid";
import Message from "@/lib/models/Message";

// Cache control for dashboard stats (optional: adjust based on your needs)
const CACHE_MAX_AGE = 60; // 60 seconds

export async function GET(request) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser(request);

    if (!user || !user._id) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing authentication" },
        { status: 401 },
      );
    }

    // 2. Connect to database
    await connectToDatabase();

    // 3. Fetch stats in parallel where possible for better performance
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
      // Calculate total spend from completed projects
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
      // Get user's project IDs for bid counting
      Project.find({ client: user._id })
        .select("_id")
        .catch(() => []),
      // Count unread messages
      Message.countDocuments({ receiver: user._id, read: false }).catch(
        () => 0,
      ),
    ]);

    // 4. Calculate pending bids on user's projects
    const projectIds = userProjects.map((p) => p._id);
    const pendingBids =
      projectIds.length > 0
        ? await Bid.countDocuments({
            project: { $in: projectIds },
            status: "pending",
          }).catch(() => 0)
        : 0;

    // 5. Calculate total spend safely
    const totalSpend =
      completedProjectsAgg.length > 0
        ? Number(completedProjectsAgg[0].total) || 0
        : 0;

    // 6. Calculate profile completion
    const profileComplete = calculateProfileCompletion(user);

    // 7. Build safe user data object (sanitize sensitive fields)
    const userData = {
      id: user._id.toString(),
      name: user.name || "Anonymous",
      email: user.email || "",
      username: user.username || "",
      phone: user.phone || "",
      avatar: user.avatar
        ? user.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=111827&color=fff&size=128`,
      role: user.role || "buyer",
      profileComplete,
      // Optional: add lastLogin, memberSince, etc. if available
      ...(user.createdAt && { memberSince: user.createdAt }),
    };

    // 8. Build stats object with fallbacks
    const stats = {
      totalProjects: Number(totalProjects) || 0,
      activeProjects: Number(activeProjects) || 0,
      completedProjects: Number(completedProjects) || 0,
      totalSpend,
      pendingBids: Number(pendingBids) || 0,
      messages: Number(unreadMessages) || 0,
    };

    // 9. Return response with cache headers (optional)
    const response = NextResponse.json({ user: userData, stats });

    // Add cache control headers for performance (adjust as needed)
    response.headers.set(
      "Cache-Control",
      `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`,
    );

    return response;
  } catch (error) {
    // 10. Comprehensive error logging
    console.error("💥 Dashboard stats API error:", {
      message: error?.message,
      name: error?.name,
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      userId: error?.userId, // If you add user context to errors
      timestamp: new Date().toISOString(),
    });

    // 11. Return appropriate error response
    // Don't expose internal error details to client
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

/**
 * Calculate profile completion percentage
 * @param {Object} user - User document from database
 * @returns {number} Completion percentage (0-100)
 */
function calculateProfileCompletion(user) {
  if (!user) return 0;

  // Define required fields for a "complete" profile
  const profileFields = [
    { key: "name", weight: 1 },
    { key: "username", weight: 1 },
    { key: "phone", weight: 1 },
    { key: "avatar", weight: 1 },
    { key: "bio", weight: 1 }, // Optional: add more fields as needed
  ];

  const totalWeight = profileFields.reduce(
    (sum, field) => sum + field.weight,
    0,
  );
  const completedWeight = profileFields.reduce((sum, field) => {
    const value = user[field.key];
    // Consider field complete if it exists and is non-empty
    const isComplete =
      value != null &&
      value !== "" &&
      (typeof value !== "string" || value.trim() !== "");
    return sum + (isComplete ? field.weight : 0);
  }, 0);

  return Math.round((completedWeight / totalWeight) * 100);
}
