// components/Auth/VerificationSuccess.jsx
"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function VerificationSuccess({
  name,
  email,
  alreadyVerified,
  onContinue,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
      </div>

      {/* Heading */}
      <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-3">
        {alreadyVerified
          ? "Email Already Verified! ✓"
          : "Email Verified Successfully! ✓"}
      </h1>

      <p className="font-sans text-gray-600 mb-2">
        {alreadyVerified
          ? "Your email is already confirmed."
          : `Great news, ${name?.split(" ")[0] || "there"}!`}
      </p>

      {email && <p className="font-sans text-sm text-gray-500 mb-6">{email}</p>}

      {/* Benefits */}
      {!alreadyVerified && (
        <div className="text-left p-5 bg-emerald-50 border border-emerald-200 rounded-xl mb-6">
          <p className="font-sans text-sm font-semibold text-emerald-800 mb-3">
            🎉 You can now:
          </p>
          <ul className="font-sans text-sm text-emerald-700 space-y-2">
            <li>✓ Post projects and hire developers</li>
            <li>✓ Receive payment protection</li>
            <li>✓ Access all platform features</li>
            <li>✓ Get priority support</li>
          </ul>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full inline-flex items-center justify-center px-6 py-4 bg-gray-900 text-white font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300"
      >
        Continue to Login →
      </button>

      {/* Security Note */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="font-sans text-xs text-gray-500">
          🔒 Your account is now secure and ready to use.
        </p>
      </div>
    </div>
  );
}
