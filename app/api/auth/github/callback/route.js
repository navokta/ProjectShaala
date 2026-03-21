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

  console.log('GitHub callback called', { codeExists: !!code, state, storedState });

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
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/github/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessTokenGithub = tokenData.access_token;

    if (!accessTokenGithub) {
      console.error('Failed to get access token', tokenData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=GitHub%20token%20failed`
      );
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessTokenGithub}` },
    });
    const githubUser = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Failed to fetch GitHub user', githubUser);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=GitHub%20user%20failed`
      );
    }

    // Get primary email
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessTokenGithub}` },
    });
    const emails = await emailsResponse.json();
    const primaryEmail = emails.find(email => email.primary)?.email || emails[0]?.email;

    if (!primaryEmail) {
      console.error('No email found from GitHub', emails);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=No%20email`
      );
    }

    const name = githubUser.name || githubUser.login;
    const avatar = githubUser.avatar_url;
    const githubId = githubUser.id.toString();

    console.log('GitHub user', { email: primaryEmail, name, githubId });

    await connectToDatabase();

    // Find or create user
    let user = await User.findOne({ $or: [{ email: primaryEmail }, { githubId }] });
    if (!user) {
      // Create new user
      let username = githubUser.login;
      let existing = await User.findOne({ username });
      if (existing) {
        username = username + '_' + Math.random().toString(36).substring(2, 6);
      }
      user = await User.create({
        name,
        email: primaryEmail,
        username,
        githubId,
        emailVerified: true,
        avatar,
        role: 'buyer',
      });
      console.log('New user created', { userId: user._id });
    } else if (!user.githubId) {
      user.githubId = githubId;
      if (!user.avatar) user.avatar = avatar;
      await user.save();
      console.log('GitHub linked to existing user', { userId: user._id });
    } else {
      console.log('User already has GitHub ID', { userId: user._id });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
    setTokenCookies(response, accessToken, refreshToken);
    response.cookies.set('oauth_state', '', { maxAge: -1 });
    return response;
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=OAuth%20failed`
    );
  }
}