import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Bid from "@/lib/models/Bid";
import Project from "@/lib/models/Project";
import { verifyAccessToken } from "@/lib/utils/jwt";

// PUT to accept a bid
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id, bidId } = await params;

    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    const user = await verifyAccessToken(accessToken);
    if (!user || (!user.userId && !user._id && !user.id)) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }
    const userId = user.userId || user._id || user.id;

    // Verify ownership
    const project = await Project.findById(id).select("+buyer");
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (project.buyer.toString() !== userId.toString()) {
       return NextResponse.json({ success: false, message: "Unauthorized to accept bids on this project" }, { status: 403 });
    }

    // Verify bid exists
    const acceptedBid = await Bid.findOne({ _id: bidId, project: id });
    if (!acceptedBid) {
       return NextResponse.json({ success: false, message: "Bid not found" }, { status: 404 });
    }

    if (project.status === "in-progress" || project.status === "completed" || project.status === "closed") {
      return NextResponse.json({ success: false, message: "Project is no longer open for accepting bids" }, { status: 400 });
    }

    // Mark the selected bid as accepted
    acceptedBid.status = "accepted";
    await acceptedBid.save();

    // Mark all other bids as rejected
    await Bid.updateMany(
      { project: id, _id: { $ne: bidId } },
      { $set: { status: "rejected" } }
    );

    // Update Project status
    project.status = "in-progress";
    project.selectedBid = bidId;
    await project.save();

    return NextResponse.json({ success: true, message: "Bid accepted successfully" });
  } catch (error) {
    console.error("Accept bid error:", error);
    return NextResponse.json({ success: false, message: "Failed to accept bid", details: error.message }, { status: 500 });
  }
}
