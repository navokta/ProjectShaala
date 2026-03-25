// app/api/projects/[id]/bids/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Bid from "@/lib/models/Bid";

// GET bids for a project
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    // 👇 CRITICAL FIX: Await params first (Next.js 15+)
    const { id } = await params;

    // Validate id
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Project ID is required" },
        { status: 400 },
      );
    }

    const bids = await Bid.find({ project: id })
      .populate("developer", "name email avatar rating title")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: bids });
  } catch (error) {
    console.error("GET bids error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bids" },
      { status: 500 },
    );
  }
}

// POST new bid (auth required)
export async function POST(request, { params }) {
  try {
    await connectToDatabase();

    // 👇 Await params first
    const { id } = await params;

    // Read accessToken from cookie
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
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { proposal, bidAmount, timeline, coverLetter } = body;

    if (!proposal || !bidAmount || !timeline) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if developer already bid on this project
    const existingBid = await Bid.findOne({
      project: id,
      developer: user.userId,
    });

    if (existingBid) {
      return NextResponse.json(
        { success: false, message: "You have already bid on this project" },
        { status: 400 },
      );
    }

    const newBid = await Bid.create({
      project: id,
      developer: user.userId,
      proposal,
      bidAmount,
      timeline,
      coverLetter,
    });

    // Increment project bid count
    await Project.findByIdAndUpdate(id, { $inc: { bidCount: 1 } });

    return NextResponse.json({ success: true, data: newBid }, { status: 201 });
  } catch (error) {
    console.error("POST bid error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit bid" },
      { status: 500 },
    );
  }
}
