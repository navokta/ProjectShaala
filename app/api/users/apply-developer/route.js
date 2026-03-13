import { NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/utils/auth';
import User from '@/lib/models/User';

export async function POST(request) {
  const user = await authMiddleware(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only buyers can apply
  if (user.role !== 'buyer') {
    return NextResponse.json({ error: 'Only buyers can apply' }, { status: 403 });
  }

  if (user.developerApplication?.status === 'pending') {
    return NextResponse.json({ error: 'Application already pending' }, { status: 400 });
  }

  user.developerApplication = {
    status: 'pending',
    submittedAt: new Date(),
  };
  await user.save();

  return NextResponse.json({ message: 'Application submitted' });
}