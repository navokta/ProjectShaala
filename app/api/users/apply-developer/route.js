import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only buyers can apply
  if (user.role !== 'buyer') {
    return NextResponse.json({ error: 'Only buyers can apply to become a developer' }, { status: 403 });
  }

  // Check if already applied
  if (user.developerApplication?.status === 'pending') {
    return NextResponse.json({ error: 'Application already pending' }, { status: 400 });
  }
  if (user.role === 'developer') {
    return NextResponse.json({ error: 'You are already a developer' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { githubProfile, portfolioLink, topProjects, skills, bio } = body;

    // Basic validation
    if (!githubProfile || !portfolioLink || !topProjects?.length) {
      return NextResponse.json({ error: 'GitHub profile, portfolio, and at least one project are required' }, { status: 400 });
    }

    await connectToDatabase();

    user.developerApplication = {
      status: 'pending',
      submittedAt: new Date(),
      githubProfile,
      portfolioLink,
      topProjects,
      skills: skills || [],
      bio: bio || '',
    };
    await user.save();

    return NextResponse.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply developer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}