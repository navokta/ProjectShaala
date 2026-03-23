import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  // If email query param exists, search for a specific user (owner only)
  if (email) {
    if (user.role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can search users' }, { status: 403 });
    }
    await connectToDatabase();
    const foundUser = await User.findOne({ email: email.toLowerCase() }).select('name email username role _id');
    if (!foundUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(foundUser);
  }

  // Otherwise, return all users (admin or owner)
  await connectToDatabase();
  const users = await User.find({}, '-password -refreshToken').sort({ createdAt: -1 });
  return NextResponse.json(users);
}