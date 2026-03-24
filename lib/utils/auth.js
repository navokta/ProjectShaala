// lib/utils/auth.js
import { cookies } from "next/headers";
import { verifyAccessToken } from "./jwt";
import { connectToDatabase } from "../mongodb";
import User from "../models/User";

export async function getCurrentUser(request) {
  try {
    let token = null;

    // ✅ Method 1: Check Authorization header (for API clients / mobile apps)
    const authHeader =
      request?.headers?.get("authorization") ||
      request?.headers?.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // ✅ Method 2: Fallback to HttpOnly cookie (for browser requests)
    if (!token) {
      const cookieStore = cookies();
      token = cookieStore.get("accessToken")?.value;
    }

    // ❌ No valid token found
    if (!token || token === "undefined" || token === "null") {
      console.log("❌ No valid token found in request");
      return null;
    }

    // ✅ Verify token
    const decoded = await verifyAccessToken(token);
    if (!decoded || !decoded.userId) {
      console.log("❌ Token verification failed");
      return null;
    }

    // ✅ Fetch user from DB
    await connectToDatabase();
    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken -__v",
    );

    return user;
  } catch (error) {
    console.error("❌ getCurrentUser error:", error.message);
    return null;
  }
}
