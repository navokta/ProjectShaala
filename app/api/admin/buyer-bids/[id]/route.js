import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { getCurrentUser } from "@/lib/utils/auth";


// GET: Fetch single buyer bid (project)
export async function GET(request, { params }) {
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

    const project = await Project.findById(id).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("GET /api/admin/buyer-bids/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update a buyer bid (Admin only)
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
    const { title, description, status, category, budgetMin, budgetMax } = body;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title: title?.trim(),
        description: description?.trim(),
        status,
        category,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Buyer bid updated successfully",
      updatedProject,
    });
  } catch (error) {
    console.error("PUT /api/admin/buyer-bids/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update buyer bid" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a buyer bid (Admin only)
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

    const project = await Project.findById(id).lean();
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Buyer bid not found" },
        { status: 404 }
      );
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Buyer bid deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/buyer-bids/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete buyer bid" },
      { status: 500 }
    );
  }
}
