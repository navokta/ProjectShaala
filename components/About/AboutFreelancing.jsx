// components/About/AboutFreelancing.jsx
"use client";

import {
  ComputerDesktopIcon,
  GlobeAsiaAustraliaIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function AboutFreelancing() {
  const benefits = [
    {
      icon: <ComputerDesktopIcon className="w-6 h-6" />,
      title: "Work From Anywhere",
      description:
        "No office, no commute. Work from your home, cafe, or while traveling the world.",
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: "Flexible Hours",
      description:
        "You choose when to work. Morning person or night owl - it's your call.",
    },
    {
      icon: <GlobeAsiaAustraliaIcon className="w-6 h-6" />,
      title: "Global Clients",
      description:
        "Work with clients from India and around the world. Expand your horizons.",
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Career Growth",
      description:
        "Build diverse portfolio, learn new technologies, and level up your skills.",
    },
  ];

  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Freelancing on ProjectShaala
          </h2>
          <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the freedom of freelancing with the security of a trusted
            platform. Be your own boss while we handle the rest.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex gap-5 p-6 bg-white border border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-poppins font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="font-sans text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* How to Start */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 lg:p-12">
          <h3 className="font-poppins text-2xl font-bold text-gray-900 mb-8 text-center">
            How to Start Freelancing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Create Profile",
                desc: "Sign up and showcase your skills",
              },
              {
                step: "2",
                title: "Browse Projects",
                desc: "Find projects that match your expertise",
              },
              {
                step: "3",
                title: "Place Bids",
                desc: "Submit proposals to clients",
              },
              {
                step: "4",
                title: "Start Earning",
                desc: "Complete projects and get paid",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center font-poppins font-bold text-2xl mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h4 className="font-poppins font-bold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="font-sans text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/apply-developer"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Start Your Freelance Journey →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
