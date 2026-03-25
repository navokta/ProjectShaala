// app/api/projects/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";

// 🔹 GET: Fetch user's projects with pagination & filters
export async function GET(request) {
  try {
    const user = await getCurrentUser(request);

    console.log("🔍 GET /api/projects - Auth User:", user); // 🔍 DEBUG

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

    // Build query - only fetch projects belonging to this user
    const query = { client: user._id };

    console.log("🔍 Query filter:", query);

    if (status && status !== "all") query.status = status;
    if (category && category !== "All") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    console.log("🔍 Final query:", JSON.stringify(query, null, 2));

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Project.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query),
    ]);

    console.log(`📊 Found ${total} projects, returning ${data.length}`);

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
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// 🔹 POST: Create a new project
// app/api/projects/route.js - POST handler (updated)
export async function POST(request) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📥 Parse body
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
    } = body;

    // ✅ Validate required fields (frontend + backend)
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
    if (budget === undefined || isNaN(budget) || budget < 0) {
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

    // 🔹 Map frontend data to backend model schema
    const projectData = {
      title: title.trim(),
      description: description.trim(),
      category: category || "Other",
      skills: Array.isArray(skills) ? skills.filter((s) => s?.trim()) : [],

      // 💰 Budget handling - support both single budget + range
      budget: Number(budget),
      budgetType: budgetType,
      budgetMin:
        budgetType === "fixed" ? Number(budgetRange?.min ?? budget) : undefined,
      budgetMax:
        budgetType === "fixed" ? Number(budgetRange?.max ?? budget) : undefined,
      hourlyRate: budgetType === "hourly" ? Number(budget) : undefined,

      // 📅 Timeline - use frontend value or default
      timeline: timeline || "2-4 weeks",

      // 📋 Requirements & Deliverables
      requirements: requirements.filter((r) => r.trim()),
      deliverables: deliverables.filter((d) => d.trim()),

      // 👤 Buyer info - DERIVE from authenticated user (don't trust frontend)
      buyer: user._id,
      buyerEmail: user.email,
      buyerName: user.name,
      client: user._id, // Alias if your schema uses 'client'

      // 🎯 Other fields
      experienceLevel: experienceLevel || "Intermediate",
      projectType: projectType || "One-time project",
      visibility: visibility || "public",
      status: "open",
    };

    // 🆕 Create project
    const project = await Project.create(projectData);
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
    console.error("Projects POST error:", error);

    // Handle Mongoose validation errors with helpful messages
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
