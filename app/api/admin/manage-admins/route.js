import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

// Only owner can access
export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user || user.role !== 'owner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const admins = await User.find({ role: 'admin' }, 'name email username createdAt');
  return NextResponse.json(admins);
}

// Add a new admin (by email or user ID)
export async function POST(request) {
  const user = await getCurrentUser(request);
  if (!user || user.role !== 'owner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await request.json();
  await connectToDatabase();
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (targetUser.role === 'owner') {
    return NextResponse.json({ error: 'Cannot change owner role' }, { status: 400 });
  }

  targetUser.role = 'admin';
  await targetUser.save();
  return NextResponse.json({ message: 'Admin added' });
}

// Remove admin (demote to buyer)
export async function DELETE(request) {
  const user = await getCurrentUser(request);
  if (!user || user.role !== 'owner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await request.json();
  await connectToDatabase();
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (targetUser.role !== 'admin') {
    return NextResponse.json({ error: 'User is not an admin' }, { status: 400 });
  }

  targetUser.role = 'buyer';
  await targetUser.save();
  return NextResponse.json({ message: 'Admin removed' });
}