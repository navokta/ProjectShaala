import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/lib/utils/jwt';
import { setTokenCookies } from '@/lib/utils/cookies';

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ _id: decoded.userId, refreshToken });
    if (!user) {
      return NextResponse.json({ error: 'Refresh token not found' }, { status: 401 });
    }

    // Rotate tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    const response = NextResponse.json({ message: 'Token refreshed' }, { status: 200 });
    setTokenCookies(response, newAccessToken, newRefreshToken);
    return response;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}