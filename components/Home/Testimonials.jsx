'use client';

import { useState, useEffect } from 'react';

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Bhavy Sharma',
      role: 'Full-Stack Developer',
      image: 'https://placehold.co/100/1e293b/8b5cf6?text=BS',
      rating: 5,
      badge: 'Top Seller',
      text: "I made ₹45k in 3 months just by uploading my old side projects. Project Shaala turned my unused code into passive income."
    },
    {
      id: 2,
      name: 'Priya Mehta',
      role: 'Startup Founder',
      image: 'https://placehold.co/100/1e293b/ec4899?text=PM',
      rating: 4.8,
      badge: 'Buyer',
      text: "Found a Next.js SaaS template that saved me over 2 weeks of development. The developer was responsive and the code was clean."
    },
    {
      id: 3,
      name: 'Sakshi Jain',
      role: 'Open-Source Creator',
      image: 'https://placehold.co/100/1e293b/06b6d4?text=SJ',
      rating: 4.9,
      badge: 'Top Seller',
      text: "Finally, a marketplace that treats developers fairly. I can monetize my tools without giving up ownership or control."
    }
  ];

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 bg-slate-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-600/10 to-cyan-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 text-sm font-medium rounded-full border border-purple-500/30 mb-4">
            🌟 Real Stories from Real Developers
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-purple-100 bg-clip-text text-transparent">
            What Our Community Says
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Don’t just take our word for it — hear from developers and buyers who’ve built, bought, and grown on Project Shaala.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transition: `all 0.5s ease ${index * 150}ms`
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-xl border border-gray-700 shadow-lg"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-100">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
                <div className="ml-auto px-2 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                  {testimonial.badge}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    {i < Math.floor(testimonial.rating) ? '⭐' : '☆'}
                  </span>
                ))}
                <span className="text-sm text-gray-400 ml-1">({testimonial.rating})</span>
              </div>

              {/* Quote */}
              <blockquote className="text-gray-300 leading-relaxed text-sm md:text-base">
                "{testimonial.text}"
              </blockquote>

              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-gray-700 opacity-20 group-hover:opacity-40 transition-opacity">
                “
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
            Join the Community →
          </button>
        </div>
      </div>
    </section>
  );
}