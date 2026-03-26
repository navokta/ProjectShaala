import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request, { params }) {
  try {
    const adminUser = await getCurrentUser(request);
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'owner')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // We should await params in nextjs 15, but just taking it from params
    const id = params.id;
    
    const targetUser = await User.findById(id, '-password -refreshToken');
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(targetUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const adminUser = await getCurrentUser(request);
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'owner')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await request.json();
    
    // Admins can't make someone an owner or admin unless they are an owner
    if ((role === 'admin' || role === 'owner') && adminUser.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    const id = params.id;
    
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (role) targetUser.role = role;
    
    await targetUser.save();

    return NextResponse.json({ success: true, user: targetUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const adminUser = await getCurrentUser(request);
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'owner')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const id = params.id;
    
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Protection to not delete owners or yourself
    if (targetUser.role === 'owner' || targetUser._id.toString() === adminUser._id.toString()) {
        return NextResponse.json({ error: 'Cannot delete this user' }, { status: 403 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
