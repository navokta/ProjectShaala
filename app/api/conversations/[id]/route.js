import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/lib/models/Conversation";

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();

    const conversation = await Conversation.findOne({
      _id: id,
      participants: user._id
    })
      .populate("participants", "name avatar role")
      .populate("initiator", "name")
      .lean();

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: conversation });
  } catch (error) {
    console.error("GET Conversation Error:", error);
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { status } = body; // 'active', 'rejected'

    if (!['active', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectToDatabase();

    const conversation = await Conversation.findOne({
      _id: id,
      participants: user._id
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Only the non-initiator can accept/reject
    if (conversation.initiator.toString() === user._id.toString() && conversation.status === 'pending') {
       return NextResponse.json({ error: "Initiator cannot accept the request" }, { status: 403 });
    }

    conversation.status = status;
    await conversation.save();

    return NextResponse.json({ success: true, data: conversation, message: `Conversation ${status}` });
  } catch (error) {
    console.error("PATCH Conversation Error:", error);
    return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 });
  }
}
