import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user || user.role !== 'developer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const fullUser = await User.findById(user._id).select('-password -refreshToken');
  if (!fullUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Convert privacySettings Map to object if it's a Map
  const userObj = fullUser.toObject();
  if (userObj.privacySettings && userObj.privacySettings.constructor === Map) {
    userObj.privacySettings = Object.fromEntries(userObj.privacySettings);
  }

  return NextResponse.json(userObj);
}

export async function PATCH(request) {
  const currentUser = await getCurrentUser(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 });
  }
  if (currentUser.role !== 'developer') {
    return NextResponse.json({ error: 'Forbidden - You are not a developer' }, { status: 403 });
  }

  const body = await request.json();
  const { name, title, location, hourlyRate, availability, bio, skills, social, portfolio, privacySettings } = body;

  await connectToDatabase();
  const user = await User.findById(currentUser._id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Update basic fields
  if (name !== undefined) user.name = name?.trim() || '';
  if (title !== undefined) user.title = title?.trim() || '';
  if (location !== undefined) user.location = location?.trim() || '';
  if (hourlyRate !== undefined) user.hourlyRate = Number(hourlyRate) || 0;
  if (availability !== undefined) user.availability = Boolean(availability);
  if (bio !== undefined) user.bio = bio?.trim() || '';

  // Update skills (array of strings)
  if (skills !== undefined) user.skills = Array.isArray(skills) ? skills.map(s => s.trim()).filter(s => s) : [];

  // Update social links (object)
  if (social !== undefined) {
    user.social = { ...user.social, ...social };
    // Trim and clean each social URL
    for (const key of Object.keys(user.social)) {
      if (user.social[key]) user.social[key] = user.social[key].trim();
    }
  }

  // Update portfolio (full array)
  if (portfolio !== undefined) {
    user.portfolio = Array.isArray(portfolio) ? portfolio : [];
  }

  // Update privacy settings (if stored as Map)
  if (privacySettings !== undefined && typeof privacySettings === 'object') {
    // Convert object to Map if needed
    user.privacySettings = new Map(Object.entries(privacySettings));
  }

  await user.save();

  return NextResponse.json({ message: 'Profile updated successfully' });
}