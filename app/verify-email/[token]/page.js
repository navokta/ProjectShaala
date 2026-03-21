// app/verify-email/[token]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VerificationSuccess from "@/components/Auth/VerificationSuccess";
import VerificationError from "@/components/Auth/VerificationError";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading, success, error, already-verified
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `/api/auth/verify-email?token=${params.token}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Verification failed");
        }

        if (data.alreadyVerified) {
          setStatus("already-verified");
        } else {
          setStatus("success");
          setUserData({ email: data.email, name: data.name });
        }
        setMessage(data.message);
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(err.message || "Something went wrong");
      }
    };

    if (params.token) {
      verifyEmail();
    }
  }, [params.token]);

  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          {status === "loading" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="font-poppins text-xl font-bold text-gray-900 mb-2">
                Verifying Your Email...
              </h2>
              <p className="font-sans text-gray-600">
                Please wait while we confirm your email address.
              </p>
            </div>
          )}

          {status === "success" && (
            <VerificationSuccess
              name={userData?.name}
              email={userData?.email}
              onContinue={() => router.push("/login")}
            />
          )}

          {status === "already-verified" && (
            <VerificationSuccess
              name={userData?.name}
              email={userData?.email}
              alreadyVerified={true}
              onContinue={() => router.push("/login")}
            />
          )}

          {status === "error" && (
            <VerificationError
              message={message}
              onRetry={() => router.push("/signup")}
            />
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
