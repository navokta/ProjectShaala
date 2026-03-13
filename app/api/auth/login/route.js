import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateAccessToken, generateRefreshToken } from '@/lib/utils/jwt';
import { setTokenCookies } from '@/lib/utils/cookies';

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, password } = body; // identifier can be email or username

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    }).select('+password +refreshToken');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // ... after successful login
const response = NextResponse.json(
  {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  },
  { status: 200 }
);

setTokenCookies(response, accessToken, refreshToken);

return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}