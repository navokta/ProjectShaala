// app/api/projects/[id]/bids/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Bid from "@/lib/models/Bid";

// GET all bids for a project
export async function GET(request, { params }) {
  try {
    await connectDB();

    const bids = await Bid.find({ project: params.id })
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
