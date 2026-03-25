import * as jose from 'jose';

const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);

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

// You may also include generation functions if needed in edge contexts,
// but here we only need verification.