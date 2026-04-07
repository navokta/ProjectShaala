import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Bid from "@/lib/models/Bid";
import User from "@/lib/models/User";
import { verifyAccessToken } from "@/lib/utils/jwt";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    const userToken = await verifyAccessToken(accessToken);
    if (!userToken || (!userToken.userId && !userToken._id && !userToken.id)) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }
    const userId = userToken.userId || userToken._id || userToken.id;

    // Get Full User to retrieve email and name to satisfy Project Schema
    const buyer = await User.findById(userId);
    if (!buyer) {
       return NextResponse.json({ success: false, message: "Buyer missing from system." }, { status: 404 });
    }

    const body = await request.json();
    const { developerId, title, description, budget, timeline } = body;

    if (!developerId || !title || !description || !budget || !timeline) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    // Verify Developer Exists
    const developer = await User.findById(developerId);
    if (!developer || developer.role !== "developer") {
       return NextResponse.json({ success: false, message: "Developer not found or invalid ID" }, { status: 404 });
    }

    // 1. Create Private Project
    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      category: "Other",
      skills: ["General Request"],
      budgetMin: Number(budget),
      budgetMax: Number(budget),
      budgetType: "fixed",
      timeline: `${timeline} days`,
      requirements: ["Direct Hire Request"],
      deliverables: ["Deliverables to be negotiated directly"],
      visibility: "private",
      status: "open",
      buyer: buyer._id,
      buyerEmail: buyer.email,
      buyerName: buyer.name,
      client: buyer._id, // Add client explicitly based on the newer standards 
      bidCount: 1
    });

    // 2. Create the "Direct Hire" Bid
    const bid = await Bid.create({
      project: project._id,
      developer: developer._id,
      amount: Number(budget),
      timeline: Number(timeline),
      proposal: description.trim(),
      isDirectHire: true,
      status: "pending"
    });

    return NextResponse.json({ success: true, message: "Requests sent", projectId: project._id }, { status: 201 });
  } catch (error) {
    console.error("Direct hire error:", error);
    return NextResponse.json({ success: false, message: "Failed to send request", details: error.message }, { status: 500 });
  }
}
