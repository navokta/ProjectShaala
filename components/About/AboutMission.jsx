// components/About/AboutMission.jsx
"use client";

import {
  CodeBracketIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function AboutMission() {
  const missionPoints = [
    {
      icon: <CodeBracketIcon className="w-7 h-7" />,
      title: "What is ProjectShaala?",
      description:
        "ProjectShaala is a dynamic marketplace where clients hire skilled developers to build web, app, and software projects. We bridge the gap between ideas and execution.",
      details:
        "Think of us as your digital workshop - where developers showcase their skills and clients find the perfect talent to bring their visions to life.",
    },
    {
      icon: <RocketLaunchIcon className="w-7 h-7" />,
      title: "Our Mission",
      description:
        "To democratize software development by making it accessible, affordable, and fair for everyone - from solo developers to enterprise clients.",
      details:
        "We believe great ideas shouldn't die due to lack of technical skills or resources. We're here to change that.",
    },
    {
      icon: <ShieldCheckIcon className="w-7 h-7" />,
      title: "Our Promise",
      description:
        "Transparent pricing, secure payments, quality assurance, and continuous support throughout your project journey.",
      details:
        "With only 2% platform fee and built-in payment protection, we ensure everyone wins.",
    },
  ];

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What We're All About
          </h2>
          <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
            More than just a marketplace - we're building a community of
            creators, innovators, and problem-solvers.
          </p>
        </div>

        {/* Mission Points */}
        <div className="space-y-8">
          {missionPoints.map((point, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Icon & Content */}
              <div
                className={`lg:col-span-7 ${index % 2 === 1 ? "lg:col-start-6" : ""}`}
              >
                <div className="flex items-start gap-5 p-6 bg-gray-50 border border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {point.icon}
                  </div>
                  <div>
                    <h3 className="font-poppins text-xl font-bold text-gray-900 mb-3">
                      {point.title}
                    </h3>
                    <p className="font-sans text-gray-700 mb-3 leading-relaxed">
                      {point.description}
                    </p>
                    <p className="font-sans text-sm text-gray-600 italic border-t border-gray-200 pt-3">
                      {point.details}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div
                className={`lg:col-span-5 ${index % 2 === 1 ? "lg:col-start-1 lg:text-right" : "lg:text-left"}`}
              >
                <div className="text-8xl font-poppins font-bold text-gray-100 select-none">
                  0{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
