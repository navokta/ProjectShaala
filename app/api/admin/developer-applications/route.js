import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

// Only admin/owner can access
export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const applications = await User.find(
    { 'developerApplication.status': 'pending' },
    'name email username developerApplication createdAt'
  ).sort({ 'developerApplication.submittedAt': -1 });

  return NextResponse.json(applications);
}

// Approve or reject an application
export async function PATCH(request) {
  const user = await getCurrentUser(request);
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, action } = await request.json(); // action: 'approve' or 'reject'

  await connectToDatabase();
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (targetUser.developerApplication?.status !== 'pending') {
    return NextResponse.json({ error: 'Application not pending' }, { status: 400 });
  }

  if (action === 'approve') {
    targetUser.role = 'developer';
    targetUser.developerApplication.status = 'approved';
  } else if (action === 'reject') {
    targetUser.developerApplication.status = 'rejected';
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  targetUser.developerApplication.reviewedAt = new Date();
  targetUser.developerApplication.reviewedBy = user._id;
  await targetUser.save();

  return NextResponse.json({ message: `Application ${action}d` });
}