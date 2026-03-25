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
// 🔐 PUT update project (auth required - cookie based)
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params; // 👈 Await params first (Next.js 15+)

    // Read accessToken from HttpOnly cookie
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    // Verify token
    const user = await verifyAccessToken(accessToken);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // 🔍 DEBUG: Log token structure to understand what we're getting
    console.log("🔐 Token user object:", JSON.stringify(user, null, 2));

    // ✅ Handle both possible token structures: user.userId OR user._id
    const userId = user.userId || user._id || user.id;
    if (!userId) {
      console.error("❌ No userId found in token:", user);
      return NextResponse.json(
        { success: false, message: "Invalid token structure" },
        { status: 401 },
      );
    }

    // Find project WITH buyer field for ownership check
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    // 🔍 DEBUG: Log ownership check values
    console.log("👤 Project buyer:", project.buyer?.toString());
    console.log("🔑 Token userId:", userId);

    // ✅ Safe ownership check - convert both to string for comparison
    const projectBuyerId = project.buyer?.toString();
    if (!projectBuyerId || projectBuyerId !== String(userId)) {
      console.warn("⚠️ Ownership mismatch:", { projectBuyerId, userId });
      return NextResponse.json(
        { success: false, message: "Unauthorized to edit this project" },
        { status: 403 },
      );
    }

    const body = await request.json();

    // ✅ Optional: Sanitize/validate body fields here if needed

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    ).select("-buyer"); // Exclude buyer from response

    return NextResponse.json({ success: true, data: updatedProject });
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
    const { id } = await params; // 👈 Await params first

    // Read accessToken from HttpOnly cookie
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const user = await verifyAccessToken(accessToken);
    if (!user || !user.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Find project WITH buyer field for ownership check
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    // ✅ Safe ownership check with null checks
    if (!project.buyer || project.buyer.toString() !== user.userId) {
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
