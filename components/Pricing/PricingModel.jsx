// components/Pricing/PricingModel.jsx
"use client";

import {
  PercentBadgeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function PricingModel() {
  const pricingPoints = [
    {
      icon: <PercentBadgeIcon className="w-8 h-8" />,
      title: "What We Charge",
      description:
        "We take only 2% of the overall project cost that you publish on the platform.",
      details: "For a ₹10,000 project, we charge just ₹200. You keep ₹9,800.",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500",
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Payment Protection",
      description:
        "Your payment is held securely and only released when the buyer confirms project completion.",
      details:
        "No risk of non-payment. Our escrow system protects both parties.",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-500",
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Team Collaboration",
      description:
        "Share your project with other developers and split the payment automatically.",
      details: "Build teams, delegate tasks, and share earnings fairly.",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-500",
    },
  ];

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, transparent pricing with built-in protection for everyone
          </p>
        </div>

        {/* Pricing Points Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pricingPoints.map((point, index) => (
            <div
              key={index}
              className={`relative ${point.bgColor} border-2 ${point.borderColor} rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300`}
            >
              {/* Icon */}
              <div
                className={`${point.iconBg} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}
              >
                {point.icon}
              </div>

              {/* Title */}
              <h3 className="font-poppins text-xl font-bold text-gray-900 mb-3">
                {point.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-gray-700 mb-4 leading-relaxed">
                {point.description}
              </p>

              {/* Details */}
              <div className="pt-4 border-t border-gray-200">
                <p className="font-sans text-sm text-gray-600 italic">
                  {point.details}
                </p>
              </div>

              {/* Decorative Number */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-poppins font-bold text-lg shadow-lg">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="mt-12 bg-gray-900 rounded-2xl p-8 lg:p-10 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-poppins text-xl font-bold mb-2">
                Payment Security Guarantee
              </h3>
              <p className="font-sans text-gray-300 leading-relaxed">
                Your payment is <strong>not released</strong> to the developer
                until you confirm that the project is completed to your
                satisfaction. This ensures quality work and protects your
                investment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
