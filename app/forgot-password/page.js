// app/forgot-password/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import EmailSent from "@/components/Auth/EmailSent";

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleEmailSent = (email) => {
    setUserEmail(email);
    setEmailSent(true);
  };

  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          {!emailSent ? (
            <ForgotPasswordForm onEmailSent={handleEmailSent} />
          ) : (
            <EmailSent email={userEmail} onResend={() => setEmailSent(false)} />
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="font-sans text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
