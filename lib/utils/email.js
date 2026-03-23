// lib/utils/email.js
// Replace this with actual email sending (Nodemailer, Resend, etc.)

export async function sendEmail({ to, subject, html }) {
  console.log(`📧 Email would be sent to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${html}`);
  // In production, integrate your email provider here
}