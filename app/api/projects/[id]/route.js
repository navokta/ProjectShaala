// app/api/projects/[id]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { verifyAccessToken } from "@/lib/utils/jwt";

// ✅ GET single project (public - no auth needed)
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params; // 👈 Await params first (Next.js 15+)

    const project = await Project.findById(id).select("-buyer");

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    // Increment view count (fire & forget)
    await Project.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("GET project error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

// 🔐 PUT update project (auth required - cookie based)
// 🔐 PUT update project
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const user = await verifyAccessToken(accessToken);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const userId = user.userId || user._id || user.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token structure" },
        { status: 401 },
      );
    }

    // 👇 CRITICAL FIX: Include buyer field for ownership check
    const project = await Project.findById(id).select("+buyer");
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    // ✅ Safe ownership check
    const projectBuyerId = project.buyer?.toString();
    if (!projectBuyerId || projectBuyerId !== String(userId)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to edit this project" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    ).select("-buyer"); // 👈 Exclude buyer from RESPONSE (not from fetch)

    return NextResponse.json({ success: true, updatedProject });
  } catch (error) {
    console.error("PUT project error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update project" },
      { status: 500 },
    );
  }
}

// 🔐 DELETE project (auth required - cookie based)
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    // Read accessToken from HttpOnly cookie
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const user = await verifyAccessToken(accessToken);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const userId = user.userId || user._id || user.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token structure" },
        { status: 401 },
      );
    }

    // 👇 CRITICAL FIX: Explicitly include +buyer to load the buyer field
    const project = await Project.findById(id).select("+buyer");

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    // 🔍 Debug logs (optional - remove in production)
    console.log("🔐 DELETE - Project buyer:", project.buyer?.toString());
    console.log("🔑 DELETE - Token userId:", userId);

    // ✅ Safe ownership check
    const projectBuyerId = project.buyer?.toString();
    if (!projectBuyerId || projectBuyerId !== String(userId)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to delete this project" },
        { status: 403 },
      );
    }

    // Prevent deletion if bids exist
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

    await Project.findByIdAndDelete(id);

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
