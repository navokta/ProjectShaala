import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/lib/models/Conversation";
import mongoose from "mongoose";
// Load User and Message for population
import User from "@/lib/models/User";
import Message from "@/lib/models/Message";

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // Fetch conversations where user is participant
    const conversations = await Conversation.find({
      participants: user._id
    })
      .populate("participants", "name avatar role")
      .populate("initiator", "name avatar")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: conversations });
  } catch (error) {
    console.error("GET Conversations Error:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { receiverId } = body;

    if (!receiverId) return NextResponse.json({ error: "Receiver ID required" }, { status: 400 });

    await connectToDatabase();

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [user._id, receiverId] }
    });

    if (conversation) {
      return NextResponse.json({ success: true, data: conversation, message: "Conversation already exists" });
    }

    conversation = await Conversation.create({
      participants: [user._id, receiverId],
      initiator: user._id,
      status: 'pending' // requires acceptance
    });

    return NextResponse.json({ success: true, data: conversation, message: "Chat request sent" }, { status: 201 });
  } catch (error) {
    console.error("POST Conversations Error:", error);
    return NextResponse.json({ error: "Failed to initiate conversation" }, { status: 500 });
  }
}
