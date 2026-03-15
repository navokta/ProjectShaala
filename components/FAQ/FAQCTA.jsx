// components/FAQ/FAQCTA.jsx
"use client";

import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function FAQCTA() {
  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 lg:p-16 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <div>
              <h2 className="font-poppins text-3xl lg:text-4xl font-bold mb-4">
                Still Have Questions?
              </h2>
              <p className="font-sans text-gray-300 mb-8 leading-relaxed">
                Can't find what you're looking for? Our support team is here to
                help. Reach out and we'll get back to you within 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-900 font-poppins font-semibold rounded-xl border-2 border-white hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Contact Support
                </a>
                <a
                  href="/messages"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-transparent text-white font-poppins font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Live Chat
                </a>
              </div>
            </div>

            {/* Right: Quick Links */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="font-poppins text-xl font-bold mb-6">
                Quick Links
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Help Center", href: "/help", icon: "📚" },
                  { label: "Video Tutorials", href: "/tutorials", icon: "🎥" },
                  { label: "Community Forum", href: "/community", icon: "💬" },
                  { label: "API Documentation", href: "/docs", icon: "📖" },
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-sans text-gray-300 group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 ml-auto text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
