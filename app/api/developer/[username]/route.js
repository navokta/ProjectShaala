import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getCurrentUser } from '@/lib/utils/auth';

export async function GET(request, { params }) {
  const { username } = await params;
  await connectToDatabase();

  const user = await User.findOne({ username }).select('-password -refreshToken');
  if (!user) {
    return NextResponse.json({ error: 'Developer not found' }, { status: 404 });
  }

  // Get current user to check follow status
  const currentUser = await getCurrentUser(request);
  const isFollowing = currentUser ? user.followers?.includes(currentUser._id) : false;

  // Privacy settings – ensure object exists
  const privacy = user.privacySettings || {};

  // Build public profile respecting privacy
  const profile = {
    _id: user._id,
    username: user.username,
    name: privacy.name === false ? null : user.name,
    avatar: privacy.avatar === false ? null : user.avatar,
    title: privacy.title === false ? null : user.title,
    location: privacy.location === false ? null : user.location,
    hourlyRate: privacy.hourlyRate === false ? null : user.hourlyRate,
    availability: privacy.availability === false ? null : user.availability,
    bio: privacy.bio === false ? null : user.bio,
    skills: privacy.skills === false ? [] : user.skills || [],
    portfolio: privacy.portfolio === false ? [] : user.portfolio || [],
    social: privacy.social === false ? {} : user.social || {},
    stats: privacy.stats === false ? null : {
      profileViews: user.profileViews,
      completedProjects: user.completedProjects,
      totalEarnings: user.totalEarnings,
    },
    joinedDate: user.createdAt,
    isFollowing,
  };

  // Increment profile views (if not the owner)
  if (currentUser && currentUser._id.toString() !== user._id.toString()) {
    await User.findByIdAndUpdate(user._id, { $inc: { profileViews: 1 } });
  }

  return NextResponse.json(profile);
}