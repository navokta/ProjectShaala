// lib/utils/oauth.js

// Generate a random string for CSRF protection
export function generateState() {
  return Math.random().toString(36).substring(2, 15);
}

// Google OAuth URL
export function getGoogleAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// GitHub OAuth URL
export function getGitHubAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/github/callback`,
    scope: 'user:email',
    state,
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}