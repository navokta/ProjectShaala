import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { sendEmail } from '@/lib/utils/email';
import { generateRandomPassword } from '@/lib/utils/password';
import bcrypt from 'bcryptjs';

// GET: fetch pending applications
export async function GET(request) {
  try {
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
  } catch (error) {
    console.error('GET applications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: approve or reject an application
export async function PATCH(request) {
  try {
    const admin = await getCurrentUser(request);
    if (!admin || (admin.role !== 'admin' && admin.role !== 'owner')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, action } = await request.json();
    if (!userId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await connectToDatabase();

    const targetUser = await User.findById(userId).select('+password +refreshToken');
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.developerApplication?.status !== 'pending') {
      return NextResponse.json({ error: 'Application not pending' }, { status: 400 });
    }

    if (action === 'approve') {
      let newPassword = null;
      if (!targetUser.password) {
        newPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        targetUser.password = hashedPassword;
      }

      targetUser.role = 'developer';
      targetUser.developerApplication.status = 'approved';
      targetUser.developerApplication.reviewedAt = new Date();
      targetUser.developerApplication.reviewedBy = admin._id;

      await targetUser.save();

      // Send email
      const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ProjectShaala Developer Program!</h2>
          <p>Dear ${targetUser.name},</p>
          <p>Your application to become a developer on ProjectShaala has been approved. You can now start browsing projects and bidding on work.</p>
          ${newPassword ? `
            <p>Because you signed up via OAuth, we have generated a password for your account. You can use this password to log in with your email.</p>
            <p><strong>Your new password:</strong> ${newPassword}</p>
            <p><em>We recommend changing this password after logging in.</em></p>
          ` : ''}
          <p>To get started, visit your developer dashboard:</p>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/developer" style="display: inline-block; background-color: #1f2937; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Go to Dashboard</a></p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Happy building!<br/>The ProjectShaala Team</p>
        </div>
      `;
      await sendEmail({
        to: targetUser.email,
        subject: 'Your Developer Application is Approved!',
        html: emailHtml,
      });

      return NextResponse.json({ message: 'Application approved, email sent' });
    }

    // Reject action
    if (action === 'reject') {
      targetUser.developerApplication.status = 'rejected';
      targetUser.developerApplication.reviewedAt = new Date();
      targetUser.developerApplication.reviewedBy = admin._id;
      await targetUser.save();

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Update on Your Developer Application</h2>
          <p>Dear ${targetUser.name},</p>
          <p>Thank you for your interest in becoming a developer on ProjectShaala.</p>
          <p>After careful review, we regret to inform you that your application has not been approved at this time.</p>
          <p>You can apply again in the future after improving your portfolio or gaining more experience.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br/>The ProjectShaala Team</p>
        </div>
      `;
      await sendEmail({
        to: targetUser.email,
        subject: 'Your Developer Application Status',
        html: emailHtml,
      });

      return NextResponse.json({ message: 'Application rejected, email sent' });
    }

    // Fallback (should never reach here)
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('PATCH application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}