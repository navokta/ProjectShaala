// app/api/admin/developer-bids/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Bid from "@/lib/models/Bid";
import Project from "@/lib/models/Project";
import { getCurrentUser } from "@/lib/utils/auth";



// 🔐 GET: Fetch all bids with search, filter, pagination (Admin only)
export async function GET(request) {
  try {
    await connectToDatabase();

    const admin = await getCurrentUser(request);
    if (!admin || (admin.role !== "admin" && admin.role !== "owner")) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get("limit")) || 20),
    );
    const search = searchParams.get("search")?.trim().toLowerCase();
    const status = searchParams.get("status");

    // Build filter object
    const filter = {};

    // Status filter
    if (status && status !== "all") {
      filter.status = status;
    }

    // Search filter: developer name, email, project title, proposal, coverLetter
    if (search) {
      const projectIds = await Project.find({
        title: { $regex: search, $options: "i" },
      }).distinct("_id");

      filter.$or = [
        { proposal: { $regex: search, $options: "i" } },
        { coverLetter: { $regex: search, $options: "i" } },
      ];

      // Search by developer name/email via populated fields (we'll handle in aggregation if needed)
      // For now, we filter by project match + text fields
      if (projectIds.length > 0) {
        filter.$or.push({ project: { $in: projectIds } });
      }
    }

    const skip = (page - 1) * limit;

    // Fetch bids with population and pagination
    const [bids, total] = await Promise.all([
      Bid.find(filter)
        .populate("developer", "name email avatar rating title")
        .populate("project", "title category postedBy")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Bid.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      bids,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/developer-bids error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

