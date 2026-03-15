// components/Pricing/PricingFAQ.jsx
"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How is the 2% fee calculated?",
      answer:
        "The 2% fee is calculated on the total project amount you publish. For example, if your project is worth ₹10,000, we charge ₹200 as platform fee, and you receive ₹9,800.",
    },
    {
      question: "When do I pay the platform fee?",
      answer:
        "The platform fee is automatically deducted from your payment when the project is completed and the buyer releases the payment. You never pay upfront.",
    },
    {
      question: "What if the buyer doesn't confirm project completion?",
      answer:
        "Our team reviews the project delivery and ensures fair resolution. If you've delivered as promised, we'll release your payment within 7 days even if the buyer is unresponsive.",
    },
    {
      question: "Can I collaborate with other developers?",
      answer:
        "Yes! You can share your project with other developers and split the payment. The platform fee remains 2% regardless of how many people you collaborate with.",
    },
    {
      question: "Are there any hidden charges?",
      answer:
        "No, absolutely not. The 2% platform fee is the only charge. No monthly fees, no subscription costs, no hidden charges. What you see is what you pay.",
    },
    {
      question: "How do I withdraw my earnings?",
      answer:
        "Once the payment is released, you can withdraw to your bank account via Razorpay. Withdrawals are processed within 24-48 hours.",
    },
  ];

  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-lg text-gray-600">
            Got questions? We've got answers.
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
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
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

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="font-sans text-gray-600 mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
