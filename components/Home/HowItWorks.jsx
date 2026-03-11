// components/Home/HowItWorks.jsx
"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  CreditCardIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  TagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function HowItWorks() {
  const [activeRole, setActiveRole] = useState("buyer");

  // Steps for Buyer (Client)
  const buyerSteps = [
    {
      title: "Post Your Requirement",
      description:
        "Describe your idea, set your budget, and define deliverables in minutes.",
      icon: <MagnifyingGlassIcon className="w-7 h-7" />,
      stepNumber: "01",
    },
    {
      title: "Review Bids",
      description:
        "Receive proposals from skilled developers with portfolios and ratings.",
      icon: <ChatBubbleLeftIcon className="w-7 h-7" />,
      stepNumber: "02",
    },
    {
      title: "Hire & Collaborate",
      description:
        "Select your developer, start the workspace, and track progress in real-time.",
      icon: <CreditCardIcon className="w-7 h-7" />,
      stepNumber: "03",
    },
    {
      title: "Deliver & Release",
      description:
        "Approve the final work, release payment, and launch your product.",
      icon: <ArrowDownOnSquareIcon className="w-7 h-7" />,
      stepNumber: "04",
    },
  ];

  // Steps for Seller (Developer)
  const sellerSteps = [
    {
      title: "Apply as Developer",
      description:
        "Submit your profile, showcase your skills, and get approved by our team.",
      icon: <ArrowUpOnSquareIcon className="w-7 h-7" />,
      stepNumber: "01",
    },
    {
      title: "Browse Projects",
      description:
        "Explore client requirements that match your expertise and interests.",
      icon: <MagnifyingGlassIcon className="w-7 h-7" />,
      stepNumber: "02",
    },
    {
      title: "Place Your Bid",
      description:
        "Submit your proposal with timeline, cost, and approach to win the project.",
      icon: <TagIcon className="w-7 h-7" />,
      stepNumber: "03",
    },
    {
      title: "Earn & Grow",
      description:
        "Complete projects, get paid securely, and build your reputation on the platform.",
      icon: <ChartBarIcon className="w-7 h-7" />,
      stepNumber: "04",
    },
  ];

  const steps = activeRole === "buyer" ? buyerSteps : sellerSteps;
  const roleLabel = activeRole === "buyer" ? "For Clients" : "For Developers";

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How ProjectShaala Works
          </h2>
          <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're hiring talent or building your career, our platform
            makes collaboration simple, secure, and successful.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setActiveRole("buyer")}
              className={`px-6 py-3 text-sm font-poppins font-medium rounded-lg transition-all duration-300 ${
                activeRole === "buyer"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Clients
            </button>
            <button
              onClick={() => setActiveRole("developer")}
              className={`px-6 py-3 text-sm font-poppins font-medium rounded-lg transition-all duration-300 ${
                activeRole === "developer"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Developers
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-200 rounded-2xl p-6 lg:p-7 hover:border-gray-900 hover:shadow-lg transition-all duration-300"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-poppins font-bold text-sm shadow-md">
                {step.stepNumber}
              </div>

              {/* Icon Circle */}
              <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-900 mb-5 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-300">
                {step.icon}
              </div>

              {/* Step Title */}
              <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-3 group-hover:text-gray-900 transition-colors">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Hover Arrow */}
              <div className="mt-4 flex items-center text-gray-400 group-hover:text-gray-900 transition-colors">
                <span className="text-sm font-sans font-medium">
                  Learn more
                </span>
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
      </div>
    </section>
  );
}
