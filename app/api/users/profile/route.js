import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, username, phone, headline, address, bio, currentPassword, newPassword, avatar } = body;

    await connectToDatabase();

    const updates = {};

    // Basic info
    if (name !== undefined) updates.name = name;
    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already taken' }, { status: 409 });
      }
      updates.email = email;
    }
    if (username !== undefined) {
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
      }
      updates.username = username;
    }
    if (phone !== undefined) updates.phone = phone;
    if (headline !== undefined) updates.headline = headline;
    if (address !== undefined) updates.address = address;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    // Password change
    if (currentPassword && newPassword) {
      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      }
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    // Perform update
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}