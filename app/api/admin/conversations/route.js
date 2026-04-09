import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/lib/models/Conversation";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !['admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const conversations = await Conversation.find({})
      .populate("participants", "name email role avatar")
      .populate("initiator", "name email")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: conversations });
  } catch (error) {
    console.error("Admin GET Conversations Error:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
