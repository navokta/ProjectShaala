// components/Terms/TermsFooter.jsx
"use client";

import {
  DocumentTextIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function TermsFooter() {
  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Related Documents */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white mb-5">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <h3 className="font-poppins font-bold text-gray-900 mb-3">
              Privacy Policy
            </h3>
            <p className="font-sans text-gray-600 text-sm mb-5">
              Learn how we collect, use, and protect your personal information.
            </p>
            <a
              href="/privacy"
              className="inline-flex items-center text-gray-900 font-poppins font-semibold text-sm hover:underline"
            >
              Read Privacy Policy →
            </a>
          </div>

          {/* Cookie Policy */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white mb-5">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="font-poppins font-bold text-gray-900 mb-3">
              Cookie Policy
            </h3>
            <p className="font-sans text-gray-600 text-sm mb-5">
              Understand how we use cookies and similar technologies on our
              platform.
            </p>
            <a
              href="/cookies"
              className="inline-flex items-center text-gray-900 font-poppins font-semibold text-sm hover:underline"
            >
              Read Cookie Policy →
            </a>
          </div>

          {/* Contact Legal */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white mb-5">
              <EnvelopeIcon className="w-6 h-6" />
            </div>
            <h3 className="font-poppins font-bold text-gray-900 mb-3">
              Legal Questions?
            </h3>
            <p className="font-sans text-gray-600 text-sm mb-5">
              Have questions about these terms? Our legal team is here to help.
            </p>
            <a
              href="mailto:legal@projectshaala.com"
              className="inline-flex items-center text-gray-900 font-poppins font-semibold text-sm hover:underline"
            >
              Contact Legal Team →
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="font-sans text-sm text-gray-500">
            <strong>Disclaimer:</strong> This document is for informational
            purposes only and does not constitute legal advice. For legal
            concerns, please consult with a qualified attorney.
          </p>
        </div>
      </div>
    </div>
  );
}
