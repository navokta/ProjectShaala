// components/Home/Testimonials.jsx
"use client";

import { useState, useEffect } from "react";
import { StarIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Bhavy Sharma",
      role: "Full-Stack Developer",
      avatar: "https://placehold.co/100/111827/ffffff?text=BS",
      rating: 5.0,
      badge: "Top Rated",
      text: "ProjectShaala turned my unused side projects into ₹45k passive income in just 3 months. The bidding system is fair, and clients are serious about quality.",
      earnings: "₹45,000 earned",
      color: "from-amber-400 to-orange-500",
    },
    {
      id: 3,
      name: "Sakshi Jain",
      role: "Open-Source Creator",
      avatar: "https://placehold.co/100/111827/ffffff?text=SJ",
      rating: 5.0,
      badge: "Rising Star",
      text: "Finally, a platform that respects developer ownership. I monetize my tools without losing control, and the payment protection gives me peace of mind.",
      projects: "18 projects delivered",
      color: "from-violet-400 to-purple-500",
    },
  ];

  return (
    <section className="py-24 px-6 sm:px-10 lg:px-20 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-40 left-1/3 w-72 h-72 bg-gradient-to-tr from-gray-100 to-gray-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Unique Typography */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-600 rounded-full blur-lg opacity-20 animate-pulse" />
              <div className="relative px-6 py-2 bg-gray-50 border border-gray-200 rounded-full">
                <span className="font-sans text-sm font-medium text-gray-700 tracking-wide">
                  💬 TESTIMONIALS
                </span>
              </div>
            </div>
          </div>

          <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Loved by{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Developers
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 -z-0"
                viewBox="0 0 200 9"
                fill="none"
              >
                <path
                  d="M2 7C2 7 40 2 100 2C160 2 198 7 198 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />& Clients Worldwide
          </h2>

          <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real stories from our community. See how ProjectShaala is
            transforming the way developers work and clients build.
          </p>
        </div>

        {/* Testimonials Grid - Asymmetrical Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className={`md:col-span-4 group relative bg-white rounded-3xl p-8 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } ${index === 1 ? "md:-mt-8" : ""}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Card with Border and Shadow */}
              <div className="relative h-full bg-white border border-gray-200 rounded-3xl p-8 hover:border-gray-400 hover:shadow-2xl transition-all duration-500">
                {/* Large Decorative Quote */}
                <div className="absolute -top-4 -left-2 w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-lg">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
                </div>

                {/* Badge */}
                <div className="absolute top-8 right-8">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${testimonial.color} text-white shadow-md`}
                  >
                    {testimonial.badge}
                  </span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-6 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(testimonial.rating)
                          ? "text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-sans text-sm font-bold text-gray-900">
                    {testimonial.rating}
                  </span>
                </div>

                {/* Testimonial Text */}
                <blockquote className="font-sans text-gray-700 text-base leading-relaxed mb-8 min-h-[120px]">
                  {testimonial.text}
                </blockquote>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mb-6" />

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-600 rounded-full blur-sm" />
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="relative w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans font-bold text-gray-900 text-lg leading-tight">
                      {testimonial.name}
                    </h3>
                    <p className="font-sans text-sm text-gray-500 mt-0.5">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Stats Footer */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-medium text-gray-900">
                      {testimonial.earnings || testimonial.projects}
                    </span>
                    <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      View Profile
                      <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Hover Gradient Border Effect */}
                <div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
                  style={{
                    padding: "1px",
                    background:
                      "linear-gradient(135deg, #111827 0%, #374151 50%, #111827 100%)",
                  }}
                />
              </div>
            </article>
          ))}
        </div>

        {/* Stats Section - Unique Design */}

        {/* CTA Section - Premium Design */}
      </div>
    </section>
  );
}
