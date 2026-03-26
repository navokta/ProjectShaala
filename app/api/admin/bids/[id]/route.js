import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Bid from "@/lib/models/Bid";
import Project from "@/lib/models/Project";
import { getCurrentUser } from "@/lib/utils/auth";

// GET: Fetch single bid
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    // We should await params in nextjs 15, but just taking it from params
    const id = params.id;

    const admin = await getCurrentUser(request);
    if (!admin || (admin.role !== "admin" && admin.role !== "owner")) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const bid = await Bid.findById(id)
      .populate("developer", "name email avatar title username headline location")
      .populate("project", "title category status budget")
      .lean();

    if (!bid) {
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, bid });
  } catch (error) {
    console.error("GET /api/admin/bids/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update a bid (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const id = params.id;

    const admin = await getCurrentUser(request);
    if (!admin || (admin.role !== "admin" && admin.role !== "owner")) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { proposal, bidAmount, timeline, status, coverLetter } = body;

    // Validate required fields
    if (!proposal || bidAmount === undefined || !timeline || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate status enum
    const validStatuses = ["pending", "accepted", "rejected", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
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
        updatedBy: admin._id,
      },
      { new: true, runValidators: true },
    )
      .populate("developer", "name email avatar")
      .populate("project", "title category")
      .lean();

    if (!updatedBid) {
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bid updated successfully",
      updatedBid,
    });
  } catch (error) {
    console.error("PUT /api/admin/bids/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update bid" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a bid (Admin only)
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const id = params.id;

    const admin = await getCurrentUser(request);
    if (!admin || (admin.role !== "admin" && admin.role !== "owner")) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    // Find bid first to get project reference
    const bid = await Bid.findById(id).lean();
    if (!bid) {
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 }
      );
    }

    // Delete the bid
    await Bid.findByIdAndDelete(id);

    // Decrement bidCount on the associated project
    if (bid.project) {
      await Project.findByIdAndUpdate(
        bid.project,
        { $inc: { bidCount: -1 } },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bid deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/bids/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete bid" },
      { status: 500 }
    );
  }
}
