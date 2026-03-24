// app/api/auth/refresh/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, generateAccessToken } from "@/lib/utils/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST() {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const decoded = await verifyRefreshToken(refreshToken);
    if (!decoded?.userId) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 },
      );
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: "Token mismatch" }, { status: 401 });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    const response = NextResponse.json({ success: true });

    // Update access token cookie
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { error: "Token refresh failed" },
      { status: 500 },
    );
  }
}
