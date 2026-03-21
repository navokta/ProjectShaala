import * as jose from 'jose';

const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);

export const generateAccessToken = async (userId) => {
  return await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(secret);
};

export const generateRefreshToken = async (userId) => {
  return await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(refreshSecret);
};

export const verifyAccessToken = async (token) => {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (token) => {
  try {
    const { payload } = await jose.jwtVerify(token, refreshSecret);
    return payload;
  } catch {
    return null;
  }
};