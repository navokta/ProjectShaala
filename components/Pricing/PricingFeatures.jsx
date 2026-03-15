// components/Pricing/PricingFeatures.jsx
"use client";

import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

export default function PricingFeatures() {
  const features = [
    {
      icon: <CheckCircleIcon className="w-6 h-6" />,
      title: "Lowest Platform Fee",
      description: "Only 2% commission - the lowest in the industry",
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "Payment Protection",
      description: "Secure escrow system protects both buyers and developers",
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: "Fast Withdrawals",
      description: "Get paid within 24-48 hours of project completion",
    },
    {
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      title: "Multiple Payment Methods",
      description: "Razorpay, UPI, Credit/Debit Cards, Net Banking",
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Share projects and split payments with team members",
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Our team is always here to help resolve disputes",
    },
  ];

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Heading */}
          <div>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="font-sans text-lg text-gray-600 mb-8 leading-relaxed">
              We provide all the tools and protection you need to focus on what
              you do best - building amazing projects.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="font-poppins font-bold text-gray-900 mb-3">
                Why Choose ProjectShaala?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-gray-700">
                    No monthly fees or subscriptions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-gray-700">
                    Only pay when you earn
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-gray-700">
                    Transparent pricing, no hidden charges
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
