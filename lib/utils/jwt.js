import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("Missing JWT secrets in environment variables");
}

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ FIX: Async hata diya kyunki jwt.verify sync hai
export const verifyAccessToken = (token) => {
  try {
    if (!token || token === "undefined" || token === "null") {
      return null;
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    console.log("Token verification error:", error.message);
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.log("Refresh token error:", error.message);
    return null;
  }
};
