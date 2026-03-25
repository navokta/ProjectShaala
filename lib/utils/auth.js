import { verifyAccessToken } from "./jwt";
import { connectToDatabase } from "../mongodb";
import User from "../models/User";

export async function getCurrentUser(request) {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Check cookies
    if (!token && request.cookies) {
      token = request.cookies.get("accessToken")?.value;
    }

    // Fallback: manual cookie parsing
    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
          const [name, ...val] = cookie.trim().split("=");
          acc[name] = val.join("=");
          return acc;
        }, {});
        token = cookies.accessToken;
      }
    }

    if (!token) return null;

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) return null;

    await connectToDatabase();
    const user = await User.findById(decoded.userId).select("-password -refreshToken -__v");
    return user;
  } catch (error) {
    console.error("❌ getCurrentUser error:", error.message);
    return null;
  }
}