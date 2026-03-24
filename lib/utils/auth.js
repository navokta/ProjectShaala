// lib/utils/auth.js
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

    // ✅ Method 2: Fallback - Read cookies from request object (for Route Handlers)
    if (!token && request?.cookies) {
      // Next.js Route Handler: request.cookies is a RequestCookies object
      token = request.cookies.get("accessToken")?.value;
    }

    // ✅ Method 3: Manual cookie parsing as last fallback (for edge cases)
    if (!token) {
      const cookieHeader = request?.headers?.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
          const [name, ...val] = cookie.trim().split("=");
          acc[name] = val.join("=");
          return acc;
        }, {});
        token = cookies.accessToken;
      }
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
