// components/Pricing/PricingHero.jsx
"use client";

import { BanknotesIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function PricingHero() {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
            <BanknotesIcon className="w-5 h-5 text-gray-900" />
            <span className="font-sans text-sm font-medium text-gray-700">
              Simple & Transparent Pricing
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            ProjectShaala{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Pricing</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-gray-900 -z-0"
                viewBox="0 0 200 9"
                fill="none"
              >
                <path
                  d="M3 7C3 7 25 4 60 4C95 4 120 7 120 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="font-sans text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
            Fair pricing for everyone. We only succeed when you succeed. No
            hidden fees, no surprises.
          </p>

          {/* Key Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-10">
            <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">2%</span>
              </div>
              <div className="text-left">
                <p className="font-poppins font-semibold text-gray-900">
                  Platform Fee
                </p>
                <p className="font-sans text-sm text-gray-500">
                  Only 2% commission
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-poppins font-semibold text-gray-900">
                  Payment Protection
                </p>
                <p className="font-sans text-sm text-gray-500">100% secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
