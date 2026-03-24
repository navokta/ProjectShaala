import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Message from '@/lib/models/Message';

export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ projects: [], messages: [] });
  }

  await connectToDatabase();

  // Search projects (open projects for developer to browse)
  const projects = await Project.find({
    status: 'open',
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ],
  }).limit(5).select('title description budget deadline');

  // Search messages where user is participant (either sender or receiver)
  const messages = await Message.find({
    $or: [
      { sender: user._id, content: { $regex: q, $options: 'i' } },
      { receiver: user._id, content: { $regex: q, $options: 'i' } },
    ],
  }).limit(5).populate('sender receiver', 'name avatar').sort('-createdAt');

  return NextResponse.json({ projects, messages });
}