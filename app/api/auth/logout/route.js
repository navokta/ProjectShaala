import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyRefreshToken } from '@/lib/utils/jwt';
import { clearTokenCookies } from '@/lib/utils/cookies';

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      await connectToDatabase();
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded) {
        await User.updateOne(
          { _id: decoded.userId, refreshToken },
          { $unset: { refreshToken: 1 } }
        );
      }
    }

    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    clearTokenCookies(response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    const response = NextResponse.json(
      { message: 'Logged out' },
      { status: 200 }
    );
    clearTokenCookies(response);
    return response;
  }
}