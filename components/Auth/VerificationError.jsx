// components/Auth/VerificationError.jsx
"use client";

import { XCircleIcon } from "@heroicons/react/24/solid";

export default function VerificationError({ message, onRetry }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
      {/* Error Icon */}
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircleIcon className="w-12 h-12 text-red-600" />
      </div>

      {/* Heading */}
      <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-3">
        Verification Failed ✗
      </h1>

      <p className="font-sans text-gray-600 mb-6">
        {message || "The verification link is invalid or has expired."}
      </p>

      {/* Help Box */}
      <div className="text-left p-5 bg-gray-50 border border-gray-200 rounded-xl mb-6">
        <p className="font-sans text-sm font-semibold text-gray-800 mb-3">
          💡 Possible reasons:
        </p>
        <ul className="font-sans text-sm text-gray-600 space-y-2">
          <li>• Link expired (valid for 24 hours)</li>
          <li>• Link already used</li>
          <li>• Invalid or tampered URL</li>
          <li>• Email address not found</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full inline-flex items-center justify-center px-6 py-4 bg-gray-900 text-white font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300"
        >
          Sign Up Again →
        </button>
        <a
          href="/contact"
          className="block w-full py-3 text-center font-poppins font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Contact Support for Help
        </a>
      </div>

      {/* Security Note */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="font-sans text-xs text-gray-500">
          🔐 For security, verification links can only be used once.
        </p>
      </div>
    </div>
  );
}
