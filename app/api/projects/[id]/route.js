// app/api/projects/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import { verifyToken } from "@/lib/auth";

// GET single project
export async function GET(request, { params }) {
  try {
    await connectDB();

    const project = await Project.findById(params.id).select("-buyer");

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    // Increment view count
    await Project.findByIdAndUpdate(params.id, { $inc: { viewCount: 1 } });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("GET project error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

// PUT update project
export async function PUT(request, { params }) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    // Find project and verify ownership
    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    if (project.buyer.toString() !== user.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to edit this project" },
        { status: 403 },
      );
    }

    const body = await request.json();

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    ).select("-buyer");

    return NextResponse.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error("PUT project error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update project" },
      { status: 500 },
    );
  }
}

// DELETE project
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    // Find project and verify ownership
    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    if (project.buyer.toString() !== user.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to delete this project" },
        { status: 403 },
      );
    }

    // Check if project has bids
    if (project.bidCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete project with existing bids. Please close the project instead.",
        },
        { status: 400 },
      );
    }

    await Project.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("DELETE project error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete project" },
      { status: 500 },
    );
  }
}
