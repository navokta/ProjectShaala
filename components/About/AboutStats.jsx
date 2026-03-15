// components/About/AboutStats.jsx
"use client";

export default function AboutStats() {
  const stats = [
    { value: "2,500+", label: "Active Developers", suffix: "" },
    { value: "1,200+", label: "Projects Completed", suffix: "" },
    { value: "₹2.5Cr+", label: "Total Earnings", suffix: "" },
    { value: "98%", label: "Client Satisfaction", suffix: "" },
    { value: "4.9", label: "Average Rating", suffix: "/5" },
    { value: "24h", label: "Avg. Response Time", suffix: "" },
  ];

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Impact So Far
          </h2>
          <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
            Numbers that reflect our growing community and the trust we've built
            together.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:border-gray-900 hover:shadow-lg transition-all duration-300"
            >
              <div className="font-poppins text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
                <span className="text-gray-600">{stat.suffix}</span>
              </div>
              <div className="font-sans text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 lg:p-14 text-white">
            <h3 className="font-poppins text-2xl lg:text-3xl font-bold mb-4">
              Ready to Be Part of Our Story?
            </h3>
            <p className="font-sans text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and clients who are already building
              the future with ProjectShaala.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-poppins font-semibold rounded-xl border-2 border-white hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                Get Started Free
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-poppins font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
