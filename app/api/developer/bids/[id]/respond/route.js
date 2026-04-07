import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Bid from "@/lib/models/Bid";
import Project from "@/lib/models/Project";
import { verifyAccessToken } from "@/lib/utils/jwt";

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    const user = await verifyAccessToken(accessToken);
    if (!user || (!user.userId && !user._id && !user.id)) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }
    const userId = user.userId || user._id || user.id;

    const body = await request.json();
    const { status } = body;

    if (status !== "accepted" && status !== "rejected") {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    // Verify bid exists and belongs to this developer
    const bid = await Bid.findOne({ _id: id, developer: userId });
    if (!bid) {
      return NextResponse.json({ success: false, message: "Bid not found or unauthorized." }, { status: 404 });
    }

    if (!bid.isDirectHire) {
      return NextResponse.json({ success: false, message: "Only direct hire requests can be responded to by the developer." }, { status: 400 });
    }

    bid.status = status;
    await bid.save();

    // If developer accepts the hire, update the private project status as well
    if (status === "accepted") {
      await Project.findByIdAndUpdate(bid.project, {
         status: "in-progress",
         selectedBid: bid._id
      });
    }

    return NextResponse.json({ success: true, message: `Request ${status} successfully` });
  } catch (error) {
    console.error("Bid response error:", error);
    return NextResponse.json({ success: false, message: "Failed to respond", details: error.message }, { status: 500 });
  }
}
