// lib/utils/cookies.js
export const setTokenCookies = (response, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: false,          // ← force false for localhost
    sameSite: 'lax',        // use 'lax' for redirects
    maxAge: 15 * 60,
    path: '/',
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return response;
};