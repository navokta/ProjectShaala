import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/lib/models/Conversation";
import Message from "@/lib/models/Message";

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !['admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const conversation = await Conversation.findById(id)
      .populate("participants", "name email role avatar")
      .lean();
      
    if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const messages = await Message.find({ conversationId: id })
      .populate("sender", "name")
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ success: true, data: { ...conversation, messages } });
  } catch (error) {
    console.error("Admin GET Conversation Error:", error);
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !['admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['active', 'restricted', 'pending'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectToDatabase();

    const conversation = await Conversation.findById(id);
    if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    conversation.status = status;
    await conversation.save();

    return NextResponse.json({ success: true, data: conversation, message: `Conversation status changed to ${status}` });
  } catch (error) {
    console.error("Admin PATCH Conversation Error:", error);
    return NextResponse.json({ error: "Failed to update conversation status" }, { status: 500 });
  }
}
