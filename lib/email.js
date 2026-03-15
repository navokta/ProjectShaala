// lib/email.js
import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  console.log("📧 [EMAIL] Starting email process for:", to);

  let transporter;
  try {
    console.log("📧 [EMAIL] SMTP Config Check:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPass: !!process.env.SMTP_PASS, // Password hide karo
    });

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true, // 👈 SMTP traffic console mein dikhayega
      logger: true, // 👈 Nodemailer internal logs
    });

    console.log("🔌 [EMAIL] Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ [EMAIL] SMTP Connection Verified!");

    console.log("📤 [EMAIL] Attempting to send...");
    const info = await transporter.sendMail({
      from: `"ProjectShaala" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("🎉 [EMAIL] Sent Successfully! Message ID:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ [EMAIL] CRITICAL ERROR:", {
      name: error.name,
      message: error.message,
      code: error.code,
      response: error.response?.body, // Gmail/SMTP specific errors yahan aayenge
    });
    throw error; // Error ko upar propagate karo taaki API route pakad sake
  } finally {
    if (transporter) await transporter.close();
  }
}
