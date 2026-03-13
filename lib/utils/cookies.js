export const setTokenCookies = (response, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set({
    name: 'accessToken',
    value: accessToken,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  response.cookies.set({
    name: 'refreshToken',
    value: refreshToken,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
};

export const clearTokenCookies = (response) => {
  response.cookies.set({
    name: 'accessToken',
    value: '',
    maxAge: -1,
    path: '/',
  });

  response.cookies.set({
    name: 'refreshToken',
    value: '',
    maxAge: -1,
    path: '/',
  });

  return response;
};