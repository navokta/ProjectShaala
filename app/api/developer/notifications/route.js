import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/lib/models/Notification';

export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  // Get unread count
  const unreadCount = await Notification.countDocuments({ user: user._id, read: false });

  // Get latest 5 notifications (unread first)
  const notifications = await Notification.find({ user: user._id })
    .sort({ read: 1, createdAt: -1 })
    .limit(5)
    .lean();

  return NextResponse.json({ unreadCount, notifications });
}

// Mark notification as read (optional)
export async function PATCH(request) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { notificationId } = await request.json();
  if (!notificationId) {
    return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
  }

  await connectToDatabase();
  const notification = await Notification.findOne({ _id: notificationId, user: user._id });
  if (!notification) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }

  notification.read = true;
  await notification.save();

  return NextResponse.json({ success: true });
}