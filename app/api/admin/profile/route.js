import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const fullUser = await User.findById(user._id).select('-password -refreshToken');
  return NextResponse.json(fullUser);
}

export async function PUT(request) {
  const user = await getCurrentUser(request);
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, username, phone, avatar, title, location, bio } = body;

  await connectToDatabase();
  const dbUser = await User.findById(user._id);

  // Update allowed fields
  if (name) dbUser.name = name;
  if (email) dbUser.email = email;
  if (username) dbUser.username = username;
  if (phone !== undefined) dbUser.phone = phone;
  if (avatar !== undefined) dbUser.avatar = avatar;
  if (title !== undefined) dbUser.title = title;
  if (location !== undefined) dbUser.location = location;
  if (bio !== undefined) dbUser.bio = bio;

  await dbUser.save();
  return NextResponse.json({ message: 'Profile updated successfully' });
}