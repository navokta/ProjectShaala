import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/lib/models/Conversation";
import Message from "@/lib/models/Message";

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();

    // Verify participant
    const conversation = await Conversation.findOne({
      _id: id,
      participants: user._id
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const messages = await Message.find({ conversationId: id })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("GET Messages Error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

    await connectToDatabase();

    const conversation = await Conversation.findOne({
      _id: id,
      participants: user._id
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (conversation.status !== 'active') {
      return NextResponse.json({ error: `Cannot send message, status is ${conversation.status}` }, { status: 400 });
    }

    const message = await Message.create({
      conversationId: id,
      sender: user._id,
      content
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    await message.populate("sender", "name avatar");

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    console.error("POST Message Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
