import { NextResponse } from 'next/server';
import { getGitHubAuthUrl, generateState } from '@/lib/utils/oauth';

export async function GET() {
  const state = generateState();
  const url = getGitHubAuthUrl(state);

  const response = NextResponse.redirect(url);
  response.cookies.set('oauth_state', state, { httpOnly: true, maxAge: 600, path: '/' });

  return response;
}