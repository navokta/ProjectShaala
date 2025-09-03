// src/components/Home/TrustBanner.jsx
import React from 'react';

const TrustBanner = () => {
  return (
    <section className="relative py-16 px-6 sm:px-10 lg:px-20 bg-slate-950 overflow-hidden">
      {/* Optional Floating Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-purple-200 bg-clip-text text-transparent">
            Built for Trust, Designed for Developers
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
            Every transaction is secure, every conversation is private, and every project is verified.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="group p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Secure Payments</h3>
            <p className="text-gray-400 text-sm">
              Powered by Razorpay. No external links. 100% on-platform security.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Private In-App Chat</h3>
            <p className="text-gray-400 text-sm">
              Talk to developers without sharing phone or email.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Instant Download</h3>
            <p className="text-gray-400 text-sm">
              Get source code instantly after purchase. No delays.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Verified Reviews</h3>
            <p className="text-gray-400 text-sm">
              Real feedback from real buyers. No fake ratings.
            </p>
          </div>
        </div>

        {/* Optional Bottom CTA */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
            How It Works →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustBanner;