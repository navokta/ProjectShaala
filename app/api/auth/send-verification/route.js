// app/api/auth/send-verification/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  console.log("🔐 [API] Send Verification Email Hit!");

  try {
    const { email } = await request.json();
    console.log("📧 [API] Request to verify email:", email);

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email }).select(
      "+emailVerificationToken +emailVerificationExpiry",
    );

    if (!user) {
      console.log("⚠️ [API] No user found for email");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // If already verified, no need to send again
    if (user.emailVerified) {
      console.log("ℹ️ [API] Email already verified");
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 },
      );
    }

    // Generate verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();
    console.log("🔑 [API] Verification token generated");

    // Create verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${verificationToken}`;
    console.log("🔗 [API] Verification URL:", verificationUrl);

    // Send verification email
    console.log("📤 [API] Sending verification email...");
    await sendEmail({
      to: user.email,
      subject: "🔐 Verify Your ProjectShaala Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: #111827; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">ProjectShaala</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #111827; margin-top: 0;">Verify Your Email Address</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Hi ${user.name},<br><br>
              Welcome to ProjectShaala! Please verify your email address to unlock all features:
            </p>
            <ul style="color: #4b5563; line-height: 1.8; margin: 20px 0; padding-left: 20px;">
              <li>✅ Post and manage projects</li>
              <li>✅ Hire developers securely</li>
              <li>✅ Receive payment protection</li>
              <li>✅ Access full platform features</li>
            </ul>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verificationUrl}" 
                 style="background: #111827; color: white; padding: 14px 32px; 
                        text-decoration: none; border-radius: 8px; display: inline-block;
                        font-weight: 600; font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; background: #f9fafb; padding: 16px; border-radius: 8px;">
              <strong>Link expires in:</strong> 24 hours<br>
              <strong>Requested from:</strong> ${new Date().toLocaleString()}
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
              If you didn't create a ProjectShaala account, please ignore this email.
            </p>
          </div>
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
            <p>© ${new Date().getFullYear()} ProjectShaala. All rights reserved.</p>
            <p style="margin-top: 8px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact" style="color: #6b7280;">Contact Support</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ [API] Verification email sent successfully");

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("💥 [API] Send Verification Error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
