// app/api/auth/login/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/jwt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/username and password are required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    }).select("+password +refreshToken");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // ✅ Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    // ✅ FIXED: Return "accessToken" instead of "token"
    // Also added "refreshToken" in response for completeness
    return NextResponse.json({
      success: true,
      accessToken, // ✅ Key name changed: token → accessToken
      refreshToken, // ✅ Optional: frontend ko bhi de de
      user: {
        _id: user._id, // ✅ id → _id (consistent with MongoDB)
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar, // ✅ Agar avatar field hai to include kar
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
