// app/reset-password/[token]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const [isValidToken, setIsValidToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(
          `/api/auth/reset-password?token=${params.token}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Invalid or expired token");
        }

        setIsValidToken(true);
      } catch (err) {
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.token) {
      validateToken();
    }
  }, [params.token]);

  if (isLoading) {
    return (
      <>
        <Header userType="public" isDashboard={false} />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-sans text-gray-600">Validating reset link...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isValidToken) {
    return (
      <>
        <Header userType="public" isDashboard={false} />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-3">
                Invalid or Expired Link
              </h1>
              <p className="font-sans text-gray-600 mb-6">
                This password reset link has expired or is invalid. Please
                request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-poppins font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <ResetPasswordForm token={params.token} />

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
