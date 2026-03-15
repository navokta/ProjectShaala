// components/Auth/EmailSent.jsx
"use client";

import { CheckCircleIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function EmailSent({ email, onResend }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
      </div>

      {/* Heading */}
      <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-3">
        Check Your Email
      </h1>

      <p className="font-sans text-gray-600 mb-6">
        We've sent a password reset link to
      </p>

      {/* Email Display */}
      <div className="inline-flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-6">
        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
        <span className="font-sans text-sm font-medium text-gray-900">
          {email}
        </span>
      </div>

      {/* Instructions */}
      <div className="text-left p-5 bg-gray-50 border border-gray-200 rounded-xl mb-6">
        <p className="font-sans text-sm text-gray-700 mb-3">
          <strong>Next Steps:</strong>
        </p>
        <ol className="font-sans text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>Open the email from ProjectShaala</li>
          <li>Click on the "Reset Password" button</li>
          <li>Create your new password</li>
          <li>Log in with your new credentials</li>
        </ol>
      </div>

      {/* Resend Link */}
      <button
        onClick={onResend}
        className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-poppins font-medium text-sm hover:text-gray-900 transition-colors"
      >
        <ArrowPathIcon className="w-4 h-4" />
        Didn't receive email? Resend
      </button>

      {/* Security Note */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="font-sans text-xs text-gray-500">
          🔒 For security, this link will expire in 1 hour.
        </p>
      </div>
    </div>
  );
}
