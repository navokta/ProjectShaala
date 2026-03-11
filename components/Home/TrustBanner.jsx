// src/components/Home/TrustBanner.jsx
'use client';

import React from 'react';
import {
  LockClosedIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon, // Changed icon for custom projects
  StarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const TrustBanner = () => {
  return (
    <section className="relative py-16 px-6 sm:px-10 lg:px-20 bg-gray-50 border-y border-gray-200 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-gray-900">
            Built for Trust, Designed for Developers
          </h2>
          <p className="font-sans text-gray-600 mt-4 text-lg max-w-3xl mx-auto">
            Every transaction is secure, every conversation is private, and every project is verified.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 - Secure Payments */}
          <div className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
              <LockClosedIcon className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
            </div>
            <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
              Secure Payments
            </h3>
            <p className="font-sans text-gray-600 text-sm leading-relaxed">
              Powered by Razorpay. No external links. 100% on-platform security.
            </p>
          </div>

          {/* Card 2 - Private In-App Chat */}
          <div className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
            </div>
            <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
              Private In-App Chat
            </h3>
            <p className="font-sans text-gray-600 text-sm leading-relaxed">
              Talk to developers without sharing phone or email.
            </p>
          </div>

          {/* Card 3 - Custom Projects (Replaced Instant Download) */}
          <div className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
              <PencilSquareIcon className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
            </div>
            <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
              Build Your Dream Project
            </h3>
            <p className="font-sans text-gray-600 text-sm leading-relaxed">
              Get custom web, app, or software projects built exactly as you envision.
            </p>
          </div>

          {/* Card 4 - Verified Reviews */}
          <div className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
              <StarIcon className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
            </div>
            <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
              Verified Reviews
            </h3>
            <p className="font-sans text-gray-600 text-sm leading-relaxed">
              Real feedback from real buyers. No fake ratings.
            </p>
          </div>
        </div>

        {/* Bottom CTA with enhanced hover */}
        <div className="text-center mt-12">
          <Link
            href="/how-it-works"
            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-poppins font-medium rounded-lg shadow-md hover:bg-white hover:text-gray-900 hover:border-2 hover:border-gray-900 transition-all duration-300 group"
          >
            <span>How It Works</span>
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrustBanner;