import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function GET(request) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No token' });
  }
  const decoded = verifyAccessToken(token);
  return NextResponse.json({ decoded });
}