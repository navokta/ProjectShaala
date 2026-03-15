// components/About/AboutHero.jsx
"use client";

import { SparklesIcon, HeartIcon } from "@heroicons/react/24/solid";

export default function AboutHero() {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
            <SparklesIcon className="w-5 h-5 text-gray-900" />
            <span className="font-sans text-sm font-medium text-gray-700">
              About ProjectShaala
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Building the Future of{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Development</span>
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
            We're on a mission to connect talented developers with ambitious
            project owners, creating opportunities for everyone in the tech
            ecosystem.
          </p>

          {/* Values */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              "Transparency",
              "Fair Pricing",
              "Quality Work",
              "Community First",
            ].map((value, index) => (
              <div
                key={index}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-full font-sans text-sm font-medium text-gray-700 shadow-sm"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
