import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateAccessToken, generateRefreshToken } from '@/lib/utils/jwt';
import { setTokenCookies } from '@/lib/utils/cookies';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, username, phone, address, headline } = body;

    // Validate required fields
    if (!name || !email || !password || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Username format validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters and can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // Password strength (at least 6 chars)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already taken' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      headline: headline || '',
      role: 'buyer', // default role
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // ... after creating user and tokens
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
  { status: 201 }
);

// Set cookies using the fixed function
setTokenCookies(response, accessToken, refreshToken);

return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}