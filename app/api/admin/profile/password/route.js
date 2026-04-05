import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  const user = await getCurrentUser(request);
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current and new password required' }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  await connectToDatabase();
  const dbUser = await User.findById(user._id).select('+password');
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, dbUser.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
  }

  // Hash and update new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  dbUser.password = hashedPassword;
  await dbUser.save();

  return NextResponse.json({ message: 'Password updated successfully' });
}