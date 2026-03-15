// app/api/auth/forgot-password/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    // Find user
    const user = await User.findOne({ email });

    // Don't reveal if email exists (security best practice)
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent" },
        { status: 200 },
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save token to database (hashed)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Reset Your ProjectShaala Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #111827; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">ProjectShaala</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #111827; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              You requested to reset your password for your ProjectShaala account.
              Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #111827; color: white; padding: 15px 40px; 
                        text-decoration: none; border-radius: 10px; display: inline-block;
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #111827; word-break: break-all; font-size: 14px;">
              ${resetUrl}
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              <strong>Note:</strong> This link will expire in 1 hour for security reasons.
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
          <div style="background: #111827; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ProjectShaala. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Reset link sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
