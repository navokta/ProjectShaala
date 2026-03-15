// components/Contact/ContactFAQ.jsx
"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer:
        "We typically respond within 24 hours during business days (Mon-Sat). For urgent matters, please call our support line.",
    },
    {
      question: "Can I request a callback?",
      answer:
        "Yes! Mention your preferred time and phone number in the message, and our team will schedule a callback.",
    },
    {
      question: "Do you offer phone support?",
      answer:
        "Yes, phone support is available for premium users and urgent project-related issues during working hours.",
    },
    {
      question: "Where can I find answers to common questions?",
      answer:
        "Check out our FAQ page or Help Center for instant answers to common questions about projects, payments, and accounts.",
    },
  ];

  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Quick Answers
          </h2>
          <p className="font-sans text-lg text-gray-600">
            Find answers to common questions before reaching out.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-poppins font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <MinusIcon className="w-5 h-5 text-gray-900" />
                  ) : (
                    <PlusIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="font-sans text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Help Center Link */}
        <div className="mt-10 text-center">
          <p className="font-sans text-gray-600 mb-4">
            Need more help? Visit our detailed documentation.
          </p>
          <a
            href="/faq"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Go to Help Center →
          </a>
        </div>
      </div>
    </div>
  );
}
