import { verifyAccessToken } from "./jwt";
import { connectToDatabase } from "../mongodb";
import User from "../models/User";

export async function getCurrentUser(request) {
  try {
    let token = null;

    // ✅ FIX 1: Pehle Authorization Header check karo (LocalStorage based auth ke liye)
    // Next.js headers case-insensitive hote hain, par safe rehne ke liye dono check kar lo
    const authHeader =
      request.headers.get("authorization") ||
      request.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // "Bearer <token>" mein se sirf token nikalo
      token = authHeader.split(" ")[1];
    }
    // ✅ FIX 2: Fallback - Agar header nahi mila, to Cookies manually parse karo
    // (Kyunki App Router mein request.cookies.get() direct kaam nahi karta route handlers mein)
    else {
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

    // ❌ Agar token abhi bhi nahi mila ya invalid string hai
    if (!token || token === "undefined" || token === "null") {
      console.log("❌ No valid token found in request");
      return null;
    }

    // ✅ Token verify karo
    const decoded = await verifyAccessToken(token);
    if (!decoded) {
      console.log("❌ Token verification failed");
      return null;
    }

    // ✅ Database se user fetch karo
    await connectToDatabase();

    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken -__v", // Sensitive fields hata do
    );

    return user;
  } catch (error) {
    console.error("❌ getCurrentUser error:", error.message);
    return null;
  }
}
