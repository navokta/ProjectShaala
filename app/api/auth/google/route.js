import { NextResponse } from 'next/server';
import { getGoogleAuthUrl, generateState } from '@/lib/utils/oauth';

export async function GET() {
  const state = generateState();
  const url = getGoogleAuthUrl(state);

  // Store state in a cookie to verify on callback (optional, you can also store in session)
  const response = NextResponse.redirect(url);
  response.cookies.set('oauth_state', state, { httpOnly: true, maxAge: 600, path: '/' });

  return response;
}