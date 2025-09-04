'use client';

import { useState } from 'react';

export default function HowItWorks() {
  const [activeRole, setActiveRole] = useState('buyer');

  // Steps for Buyer
  const buyerSteps = [
    {
      title: 'Discover Projects',
      description: 'Browse 100+ ready-to-use software projects by category, tech stack, and price.',
      icon: '🔍',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      title: 'Chat with Developer',
      description: 'Ask questions securely using our in-app chat — no phone or email sharing.',
      icon: '💬',
      gradient: 'from-purple-500 to-pink-400'
    },
    {
      title: 'Buy Securely',
      description: 'Pay safely via Razorpay — no external links, no risk.',
      icon: '💳',
      gradient: 'from-green-500 to-emerald-400'
    },
    {
      title: 'Download & Deploy',
      description: 'Get instant access to source code and deploy in minutes.',
      icon: '📦',
      gradient: 'from-orange-500 to-red-400'
    }
  ];

  // Steps for Seller
  const sellerSteps = [
    {
      title: 'Upload Your Project',
      description: 'Share your completed side projects, templates, or tools with the world.',
      icon: '📤',
      gradient: 'from-indigo-500 to-purple-400'
    },
    {
      title: 'Set Price & License',
      description: 'Choose a price and license (MIT, Commercial, etc.) in seconds.',
      icon: '🏷️',
      gradient: 'from-teal-500 to-cyan-400'
    },
    {
      title: 'Earn Passive Income',
      description: 'Get 80% of every sale — paid directly to your account.',
      icon: '💸',
      gradient: 'from-green-500 to-lime-400'
    },
    {
      title: 'Grow Your Profile',
      description: 'Build credibility, get reviews, and grow your follower network.',
      icon: '📈',
      gradient: 'from-pink-500 to-rose-400'
    }
  ];

  const steps = activeRole === 'buyer' ? buyerSteps : sellerSteps;

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 bg-slate-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-600/10 to-cyan-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-purple-100 bg-clip-text text-transparent">
            How Project Shaala Works
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Whether you're buying or selling, the process is simple, secure, and built for developers.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-flex bg-gray-900 p-1 rounded-2xl border border-gray-800 shadow-2xl">
            <button
              onClick={() => setActiveRole('buyer')}
              className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative z-10 ${
                activeRole === 'buyer'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              For Buyers
            </button>
            <button
              onClick={() => setActiveRole('seller')}
              className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative z-10 ${
                activeRole === 'seller'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              For Sellers
            </button>

            {/* Slider Background */}
            <div
              className={`absolute inset-0 m-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl transform transition-transform duration-300 z-0 ${
                activeRole === 'seller' ? 'translate-x-full' : 'translate-x-0'
              }`}
              style={{
                width: 'calc(50% - 0.5rem)',
                height: 'calc(100% - 0.5rem)'
              }}
            ></div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Icon Circle */}
              <div
                className={`w-14 h-14 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {step.icon}
              </div>

              {/* Step Title */}
              <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-purple-300 transition-colors">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Step Number */}
              <div className="absolute top-6 right-6 w-8 h-8 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => setActiveRole(activeRole === 'buyer' ? 'seller' : 'buyer')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Switch to {activeRole === 'buyer' ? 'Sellers' : 'Buyers'} →
          </button>
        </div>
      </div>
    </section>
  );
}