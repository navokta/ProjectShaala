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

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    // 👇 Create response FIRST, then set cookies
    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
      },
    });

    // 👇 Set accessToken as HttpOnly cookie (primary auth method)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true, // 🔒 Not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // 🌐 HTTPS only in prod
      sameSite: "lax", // 🛡️ CSRF protection
      maxAge: 15 * 60, // ⏱️ 15 minutes (short-lived access token)
      path: "/", // 📍 Available to all routes
    });

    // 👇 Set refreshToken as HttpOnly cookie (for token refresh flow)
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 🗓️ 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
