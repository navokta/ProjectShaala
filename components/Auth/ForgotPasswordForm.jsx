// components/Auth/ForgotPasswordForm.jsx
"use client";

import { useState } from "react";
import { EnvelopeIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ForgotPasswordForm({ onEmailSent }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
      setTimeout(() => {
        onEmailSent(email);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <EnvelopeIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-2">
          Forgot Password?
        </h1>
        <p className="font-sans text-gray-600 text-sm">
          No worries! Enter your email and we'll send you reset instructions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isLoading || success}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-sans text-gray-900 placeholder-gray-400 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="font-sans text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="font-sans text-sm text-emerald-700">
              Reset link sent successfully! Redirecting...
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send Reset Link
              <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="font-sans text-xs text-gray-600 text-center">
          💡 <strong>Tip:</strong> Check your spam folder if you don't see the
          email in your inbox.
        </p>
      </div>
    </div>
  );
}
