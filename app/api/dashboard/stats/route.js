import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Bid from '@/lib/models/Bid';
import Message from '@/lib/models/Message';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Stats for buyer
    const totalProjects = await Project.countDocuments({ client: user._id });
    const activeProjects = await Project.countDocuments({ client: user._id, status: 'in-progress' });
    const completedProjects = await Project.countDocuments({ client: user._id, status: 'completed' });

    // Calculate total spend (sum of budgets of all completed projects)
    const completedProjectsAgg = await Project.aggregate([
      { $match: { client: user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$budget' } } },
    ]);
    const totalSpend = completedProjectsAgg.length > 0 ? completedProjectsAgg[0].total : 0;

    // Pending bids on user's projects
    const userProjects = await Project.find({ client: user._id }).select('_id');
    const projectIds = userProjects.map(p => p._id);
    const pendingBids = await Bid.countDocuments({ project: { $in: projectIds }, status: 'pending' });

    // Unread messages count (where user is receiver)
    const messages = await Message.countDocuments({ receiver: user._id, read: false });

    // Profile completion percentage
    const profileComplete = calculateProfileCompletion(user);

    // User data for header
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,   // ✅ add this
      phone: user.phone,         // ✅ add this
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=111827&color=fff`,
      role: user.role,
      profileComplete,
    };

    const stats = {
      totalProjects,
      activeProjects,
      completedProjects,
      totalSpend,
      pendingBids,
      messages,
    };

    return NextResponse.json({ user: userData, stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper to calculate profile completion
function calculateProfileCompletion(user) {
  let completed = 0;
  const total = 5; // name, email, username, phone, avatar (optional)
  if (user.name) completed++;
  if (user.email) completed++;
  if (user.username) completed++;
  if (user.phone) completed++;
  if (user.avatar) completed++;
  return Math.round((completed / total) * 100);
}