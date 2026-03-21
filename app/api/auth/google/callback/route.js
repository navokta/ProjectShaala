import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateAccessToken, generateRefreshToken } from '@/lib/utils/jwt';
import { setTokenCookies } from '@/lib/utils/cookies';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = request.cookies.get('oauth_state')?.value;

  // Log for debugging
  console.log('Google callback called', { codeExists: !!code, state, storedState });

  // Verify state
  if (!state || state !== storedState) {
    console.error('State mismatch', { state, storedState });
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=Invalid%20state`
    );
  }

  if (!code) {
    console.error('No code provided');
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=No%20code`
    );
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed', tokens);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=Token%20exchange%20failed`
      );
    }

    // Google returns an id_token (JWT) with user info
    const idToken = tokens.id_token;
    if (!idToken) {
      console.error('No id_token in response', tokens);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=No%20id_token`
      );
    }

    // Decode id_token
    const payloadBase64 = idToken.split('.')[1];
    const userInfo = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());

    console.log('Google userInfo', { email: userInfo.email, name: userInfo.name, sub: userInfo.sub });

    const email = userInfo.email;
    const name = userInfo.name;
    const picture = userInfo.picture;
    const googleId = userInfo.sub;

    await connectToDatabase();

    // Find or create user
    let user = await User.findOne({ $or: [{ email }, { googleId }] });
    if (!user) {
      // Create new user
      // Generate a unique username (simplified)
      let username = email.split('@')[0];
      let existing = await User.findOne({ username });
      if (existing) {
        username = username + '_' + Math.random().toString(36).substring(2, 6);
      }
      user = await User.create({
        name,
        email,
        username,
        googleId,
        emailVerified: true,
        avatar: picture,
        role: 'buyer',
      });
      console.log('New user created', { userId: user._id });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      if (!user.avatar) user.avatar = picture;
      await user.save();
      console.log('Google linked to existing user', { userId: user._id });
    } else {
      console.log('User already has Google ID', { userId: user._id });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
    setTokenCookies(response, accessToken, refreshToken);
    // Clear state cookie
    response.cookies.set('oauth_state', '', { maxAge: -1 });
    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=OAuth%20failed`
    );
  }
}