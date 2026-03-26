// app/api/admin/bids/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Bid from "@/lib/models/Bid";
import Project from "@/lib/models/Project";
import { verifyAccessToken } from "@/lib/utils/jwt";

// ✅ Helper: Verify admin role only
async function verifyAdmin(request) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) return null;

    const user = await verifyAccessToken(accessToken);
    if (!user || user.role !== "admin") return null;

    return {
      userId: user.userId || user._id || user.id,
      role: user.role,
      ...user,
    };
  } catch (error) {
    console.error("verifyAdmin error:", error);
    return null;
  }
}

// 🔐 GET: Fetch all bids with search, filter, pagination (Admin only)
export async function GET(request) {
  try {
    await connectToDatabase();

    const admin = await verifyAdmin(request);
    if (!admin) {
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
    console.error("GET /api/admin/bids error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// 🔐 PUT: Update a bid (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { proposal, bidAmount, timeline, status, coverLetter } = body;

    // Validate required fields
    if (!proposal || bidAmount === undefined || !timeline || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate status enum
    const validStatuses = ["pending", "accepted", "rejected", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 },
      );
    }

    // Validate bidAmount is a positive number
    if (typeof bidAmount !== "number" || bidAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Bid amount must be a positive number" },
        { status: 400 },
      );
    }

    // Update bid
    const updatedBid = await Bid.findByIdAndUpdate(
      id,
      {
        proposal: proposal.trim(),
        bidAmount: Number(bidAmount),
        timeline: timeline.trim(),
        status,
        coverLetter: coverLetter?.trim() || "",
        updatedAt: new Date(),
        updatedBy: admin.userId,
      },
      { new: true, runValidators: true },
    )
      .populate("developer", "name email avatar")
      .populate("project", "title category")
      .lean();

    if (!updatedBid) {
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bid updated successfully",
      updatedBid,
    });
  } catch (error) {
    console.error("PUT /api/admin/bids error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update bid" },
      { status: 500 },
    );
  }
}

// 🔐 DELETE: Delete a bid (Admin only)
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }

    // Find bid first to get project reference
    const bid = await Bid.findById(id).lean();
    if (!bid) {
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 },
      );
    }

    // Delete the bid
    await Bid.findByIdAndDelete(id);

    // Decrement bidCount on the associated project
    if (bid.project) {
      await Project.findByIdAndUpdate(
        bid.project,
        { $inc: { bidCount: -1 } },
        { new: true },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bid deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/bids error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete bid" },
      { status: 500 },
    );
  }
}
