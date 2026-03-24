// app/api/projects/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { verifyAccessToken } from "@/lib/utils/jwt";

// GET all projects (with filters)
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const buyerId = searchParams.get("buyerId");

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (buyerId) query.buyer = buyerId;

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-buyer"); // Hide buyer ObjectId from public

    const total = await Project.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// POST new project
export async function POST(request) {
  try {
    await connectToDatabase();

    // Verify authentication
    const authHeader = request.headers.get("authorization");

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const user = await verifyAccessToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "category",
      "skills",
      "budgetType",
      "budgetMin",
      "budgetMax",
      "timeline",
      "requirements",
      "deliverables",
      "experienceLevel",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Validate budget
    if (body.budgetType === "fixed" && body.budgetMax < body.budgetMin) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum budget must be greater than minimum",
        },
        { status: 400 },
      );
    }

    // Create project
    const project = await Project.create({
      ...body,
      buyer: user.userId,
      buyerName: user.name,
      buyerEmail: user.email,
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error("POST project error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create project" },
      { status: 500 },
    );
  }
}
