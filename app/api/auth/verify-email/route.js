// app/api/auth/verify-email/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(request) {
  console.log("🔐 [API] Verify Email Hit!");

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    console.log("🔑 [API] Token received:", token ? "✓" : "✗");

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() },
    }).select(
      "+emailVerificationToken +emailVerificationExpiry +emailVerified",
    );

    if (!user) {
      console.log("⚠️ [API] Invalid or expired token");
      return NextResponse.json(
        { message: "Invalid or expired verification link" },
        { status: 400 },
      );
    }

    // If already verified
    if (user.emailVerified) {
      console.log("ℹ️ [API] Email already verified");
      return NextResponse.json(
        { message: "Email already verified", alreadyVerified: true },
        { status: 200 },
      );
    }

    // Update user: set emailVerified to true and clear token
    user.emailVerified = true;
    user.clearVerificationToken();
    await user.save();

    console.log("✅ [API] Email verified for user:", user._id);

    return NextResponse.json(
      {
        message: "Email verified successfully",
        email: user.email,
        name: user.name,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("💥 [API] Verify Email Error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
