// components/About/AboutEarning.jsx
"use client";

import {
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  WalletIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function AboutEarning() {
  const earningSteps = [
    {
      number: "01",
      icon: <WalletIcon className="w-6 h-6" />,
      title: "Complete Projects",
      description:
        "Deliver high-quality work on time and exceed client expectations",
      earning: "Earn ₹5,000 - ₹50,000+ per project",
    },
    {
      number: "02",
      icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
      title: "Build Reputation",
      description: "Get positive reviews and ratings to attract more clients",
      earning: "Top developers earn 3x more",
    },
    {
      number: "03",
      icon: <BanknotesIcon className="w-6 h-6" />,
      title: "Get Paid",
      description: "Receive 98% of project value after our 2% platform fee",
      earning: "Withdraw within 24-48 hours",
    },
  ];

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            <CurrencyRupeeIcon className="w-5 h-5 text-emerald-600" />
            <span className="font-sans text-sm font-medium text-emerald-700">
              Monetize Your Skills
            </span>
          </div>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How You Can Earn Money
          </h2>
          <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
            Turn your coding skills into a sustainable income. Here's how
            developers are earning on ProjectShaala.
          </p>
        </div>

        {/* Earning Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {earningSteps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-900 hover:shadow-xl transition-all duration-300"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center font-poppins font-bold text-lg shadow-lg">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-5">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="font-poppins text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="font-sans text-gray-600 mb-4">{step.description}</p>

              {/* Earning Highlight */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="font-sans text-sm font-semibold text-emerald-700">
                  💰 {step.earning}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Earning Potential Box */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-poppins text-2xl lg:text-3xl font-bold mb-4">
                Real Earning Potential
              </h3>
              <p className="font-sans text-gray-300 mb-6 leading-relaxed">
                Our developers are earning anywhere from ₹20,000 to ₹2,00,000+
                per month depending on their skills, availability, and project
                complexity.
              </p>
              <ul className="space-y-3">
                {[
                  "Beginner: ₹20,000 - ₹50,000/month",
                  "Intermediate: ₹50,000 - ₹1,00,000/month",
                  "Expert: ₹1,00,000 - ₹2,00,000+/month",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span className="font-sans text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="text-sm font-sans text-gray-400 mb-2">
                Average Monthly Earnings
              </div>
              <div className="font-poppins text-5xl lg:text-6xl font-bold text-white mb-2">
                ₹75k+
              </div>
              <div className="text-sm font-sans text-emerald-400">
                ↑ 35% growth this year
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
