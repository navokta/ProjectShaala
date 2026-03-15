// app/api/auth/forgot-password/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  console.log("🔥 [API] Forgot Password Hit!");

  try {
    const body = await request.json();
    console.log("📥 [API] Request Body:", body);

    const { email } = body;
    if (!email) {
      console.warn("⚠️ [API] Email missing in request");
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    console.log("🗄️ [API] Database Connected");

    const user = await User.findOne({ email });

    // Security: Don't reveal if email exists
    if (!user) {
      console.log("ℹ️ [API] No user found (Security: not revealing)");
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent" },
        { status: 200 },
      );
    }
    console.log("👤 [API] User Found:", user._id);

    // 🔐 TOKEN GENERATION - YE PART MISSING THA!
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Hash token before storing (security best practice)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    console.log("🔑 [API] Reset token generated & saved");
    // 🔐 TOKEN GENERATION END

    // Create reset URL - Ab resetToken defined hai! ✅
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;
    console.log("🔗 [API] Generated Reset URL:", resetUrl);

    console.log("🚀 [API] Calling sendEmail function...");
    await sendEmail({
      to: user.email,
      subject: "🔐 Reset Your ProjectShaala Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: #111827; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">ProjectShaala</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #111827; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Hi ${user.name},<br><br>
              You requested to reset your password. Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" 
                 style="background: #111827; color: white; padding: 14px 32px; 
                        text-decoration: none; border-radius: 8px; display: inline-block;
                        font-weight: 600; font-size: 16px;">
                Reset Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; background: #f9fafb; padding: 16px; border-radius: 8px;">
              <strong>Link expires in:</strong> 1 hour<br>
              <strong>Requested from:</strong> ${new Date().toLocaleString()}
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
              If you didn't request this, please ignore this email or contact support.
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

    console.log("✅ [API] Reset email sent successfully");

    return NextResponse.json(
      { message: "If an account exists, a reset link has been sent" },
      { status: 200 },
    );
  } catch (error) {
    console.error("💥 [API] GLOBAL ERROR:", {
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
