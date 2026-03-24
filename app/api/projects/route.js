// app/api/projects/route.js

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { verifyAccessToken } from "@/lib/utils/jwt";

// ==========================
// GET all projects (with filters)
// ==========================
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const buyerId = searchParams.get("buyerId");

    const skip = (page - 1) * limit;

    const query = {};

    // Filters
    if (status) query.status = status;
    if (category) query.category = category;

    // 🔐 AUTH (optional but recommended)
    const authHeader = request.headers.get("authorization");
    let loggedInUser = null;
    console.log("AUTH HEADER:", authHeader);

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      // ✅ FIX
      if (token && token !== "undefined" && token !== "null") {
        try {
          const user = await verifyAccessToken(token);
          if (user?.userId) {
            loggedInUser = user.userId;
          }
        } catch (err) {
          console.log("Invalid token skipped");
        }
      }
    }

    // ✅ PRIORITY:
    // 1. If buyerId is valid → use it
    // 2. Else if logged user → use that
    if (buyerId && mongoose.Types.ObjectId.isValid(buyerId)) {
      query.buyer = buyerId;
    } else if (loggedInUser) {
      query.buyer = loggedInUser;
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-buyer"); // hide buyer ObjectId

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
      {
        success: false,
        message: error.message || "Failed to fetch projects",
      },
      { status: 500 },
    );
  }
}

// ==========================
// POST new project
// ==========================
export async function POST(request) {
  try {
    await connectToDatabase();

    // 🔐 AUTH REQUIRED
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    const user = await verifyAccessToken(token);

    if (!user || !user.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // ✅ Required fields
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

    const missingFields = requiredFields.filter(
      (field) =>
        body[field] === undefined || body[field] === null || body[field] === "",
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // ✅ Budget validation
    if (
      body.budgetType === "fixed" &&
      Number(body.budgetMax) < Number(body.budgetMin)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum budget must be greater than minimum",
        },
        { status: 400 },
      );
    }

    // ✅ Create project
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
      {
        success: false,
        message: error.message || "Failed to create project",
      },
      { status: 500 },
    );
  }
}
