// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Include phone in the response
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        phone: user.phone,
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}