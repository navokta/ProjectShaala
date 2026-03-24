import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  const currentUser = await getCurrentUser(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { username, action } = await request.json();
  if (!username || !['follow', 'unfollow'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await connectToDatabase();

  const targetUser = await User.findOne({ username });
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (targetUser._id.toString() === currentUser._id.toString()) {
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
  }

  // Ensure arrays exist (though default schema should provide them)
  if (!targetUser.followers) targetUser.followers = [];
  if (!currentUser.following) currentUser.following = [];

  if (action === 'follow') {
    if (!targetUser.followers.includes(currentUser._id)) {
      await User.findByIdAndUpdate(targetUser._id, { $addToSet: { followers: currentUser._id } });
      await User.findByIdAndUpdate(currentUser._id, { $addToSet: { following: targetUser._id } });
    }
  } else {
    if (targetUser.followers.includes(currentUser._id)) {
      await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: currentUser._id } });
      await User.findByIdAndUpdate(currentUser._id, { $pull: { following: targetUser._id } });
    }
  }

  return NextResponse.json({ success: true });
}