// components/Contact/ContactForm.jsx
"use client";

import { useState } from "react";
import { PaperAirplaneIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ContactForm({ onSubmit, submitted }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-12 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
        </div>
        <h3 className="font-poppins text-2xl font-bold text-emerald-900 mb-3">
          Message Sent Successfully!
        </h3>
        <p className="font-sans text-emerald-700 mb-6">
          Thank you for reaching out. Our team will get back to you within 24
          hours.
        </p>
        <button
          onClick={() => onSubmit()}
          className="px-6 py-3 bg-emerald-600 text-white font-poppins font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 lg:p-10 shadow-sm">
      <h3 className="font-poppins text-2xl font-bold text-gray-900 mb-2">
        Send us a Message
      </h3>
      <p className="font-sans text-gray-600 mb-8">
        Fill out the form below and we'll get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-sans text-gray-900 placeholder-gray-400 transition-all"
            />
          </div>

          <div>
            <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-sans text-gray-900 placeholder-gray-400 transition-all"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            Subject *
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-sans text-gray-900 transition-all cursor-pointer"
          >
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="billing">Billing & Payments</option>
            <option value="partnership">Partnership Opportunities</option>
            <option value="feedback">Feedback & Suggestions</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Tell us how we can help you..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-sans text-gray-900 placeholder-gray-400 transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send Message
              <PaperAirplaneIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
