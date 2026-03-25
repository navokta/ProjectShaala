// app/api/projects/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import mongoose from "mongoose";

// 🔹 GET: Fetch user's projects with pagination & filters
export async function GET(request) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      console.warn("⚠️ No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit")) || 10),
    );
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // 🔹 Build query - Check MULTIPLE fields for backward compatibility
    // This handles: new projects (client), old projects (buyer), and broken projects (buyerEmail)
    const query = {
      $or: [
        { client: user._id }, // ✅ Primary field (new standard)
        { buyer: user._id }, // ✅ Legacy field (old projects)
        { buyerEmail: user.email }, // ✅ Fallback (projects missing ObjectId refs)
      ],
    };

    // Apply additional filters
    if (status && status !== "all") {
      // Add status filter to each $or condition
      query.$or = query.$or.map((condition) => ({ ...condition, status }));
    }

    if (category && category !== "All") {
      query.$or = query.$or.map((condition) => ({ ...condition, category }));
    }

    if (search) {
      query.$and = [
        query,
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    console.log(
      "🔍 GET /api/projects - User:",
      user._id,
      "Query:",
      JSON.stringify(query),
    );

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Project.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query),
    ]);

    console.log(
      `📊 Found ${total} projects for user ${user._id}, returning ${data.length}`,
    );

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Projects GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error.message },
      { status: 500 },
    );
  }
}

// 🔹 POST: Create a new project
export async function POST(request) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📥 Parse body safely
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const {
      title,
      description,
      category,
      skills = [],
      budget,
      budgetType = "fixed",
      budgetRange,
      timeline,
      requirements = [],
      deliverables = [],
      experienceLevel,
      projectType,
      visibility = "public",
      attachments = [],
    } = body;

    // ✅ Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Project title is required" },
        { status: 400 },
      );
    }
    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 },
      );
    }
    if (
      budget === undefined ||
      budget === null ||
      isNaN(budget) ||
      budget < 0
    ) {
      return NextResponse.json(
        { error: "Valid budget amount is required" },
        { status: 400 },
      );
    }
    if (
      !Array.isArray(requirements) ||
      requirements.filter((r) => r.trim()).length === 0
    ) {
      return NextResponse.json(
        { error: "At least one requirement is needed" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // 🔹 Map frontend data to backend model - ENSURE ObjectId fields are set correctly
    const projectData = {
      title: title.trim(),
      description: description.trim(),
      category: category || "Other",
      skills: Array.isArray(skills) ? skills.filter((s) => s?.trim()) : [],

      // 💰 Budget handling
      budget: Number(budget),
      budgetType: budgetType,
      budgetMin:
        budgetType === "fixed" ? Number(budgetRange?.min ?? budget) : undefined,
      budgetMax:
        budgetType === "fixed" ? Number(budgetRange?.max ?? budget) : undefined,
      hourlyRate: budgetType === "hourly" ? Number(budget) : undefined,

      // 📅 Timeline & other fields
      timeline: timeline || "2-4 weeks",
      requirements: requirements.filter((r) => r.trim()),
      deliverables: deliverables.filter((d) => d.trim()),
      experienceLevel: experienceLevel || "Intermediate",
      projectType: projectType || "One-time project",
      visibility: visibility || "public",
      status: "open",
      featured: false,
      bidCount: 0,
      viewCount: 0,
      attachments: Array.isArray(attachments) ? attachments : [],

      // 👤 CRITICAL: Set BOTH ObjectId reference fields (not just strings!)
      // Convert to ObjectId to ensure proper MongoDB reference type
      client: new mongoose.Types.ObjectId(user._id),
      buyer: new mongoose.Types.ObjectId(user._id),

      // Keep email/name for quick display without joining
      buyerEmail: user.email,
      buyerName: user.name,
    };

    console.log("📝 Creating project for user:", user._id, "with data:", {
      title: projectData.title,
      client: projectData.client,
      buyer: projectData.buyer,
    });

    // 🆕 Create project
    const project = await Project.create(projectData);

    // Fetch fresh project with all fields populated
    const createdProject = await Project.findById(project._id).lean();

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        project: createdProject,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Projects POST error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A project with this title already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create project", details: error.message },
      { status: 500 },
    );
  }
}

// 🔹 Optional: DELETE endpoint for completeness
export async function DELETE(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Ensure user can only delete their own projects
    const project = await Project.findOneAndDelete({
      _id: projectId,
      $or: [
        { client: user._id },
        { buyer: user._id },
        { buyerEmail: user.email },
      ],
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("❌ Projects DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
