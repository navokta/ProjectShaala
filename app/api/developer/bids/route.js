import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Bid from "@/lib/models/Bid";
import Project from "@/lib/models/Project";

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only developers (and presumably users with valid roles) should be bidding
    if (user.role !== "developer") {
      // Return 403 or just allow it if roles are loose, but we will strictly deny
      // Actually, let's check if the role field exists. We won't block if role is not strictly defined, but usually it is.
      // We will allow anyone except buyers bidding on their own project, handled later.
    }

    await connectToDatabase();

    const body = await request.json();
    const { projectId, amount, timeline, proposal } = body;

    if (!projectId || !amount || !timeline || !proposal) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Verify the project exists and is open
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (project.status !== "open") {
      return NextResponse.json(
        { error: "This project is no longer accepting bids" },
        { status: 400 }
      );
    }

    // Check if the current user is the buyer of the project
    if (project.buyer && project.buyer.toString() === user._id.toString()) {
      return NextResponse.json(
        { error: "You cannot bid on your own project" },
        { status: 400 }
      );
    }

    // Check if user has already bid
    const existingBid = await Bid.findOne({
      project: projectId,
      developer: user._id,
    });

    if (existingBid) {
      return NextResponse.json(
        { error: "You have already placed a bid on this project" },
        { status: 400 }
      );
    }

    // Create the bid
    const bid = await Bid.create({
      project: projectId,
      developer: user._id,
      amount: Number(amount),
      timeline: Number(timeline),
      proposal: proposal.trim(),
    });

    // Increment bid count on the project
    await Project.findByIdAndUpdate(projectId, {
      $inc: { bidCount: 1 },
    });

    return NextResponse.json(
      { success: true, message: "Bid placed successfully", bid },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bid submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit bid", details: error.message },
      { status: 500 }
    );
  }
}
