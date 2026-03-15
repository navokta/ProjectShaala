// components/About/AboutHowItHelps.jsx
"use client";

import {
  UserGroupIcon,
  BriefcaseIcon,
  CurrencyRupeeIcon,
  TrophyIcon,
  ShoppingCartIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

export default function AboutHowItHelps() {
  const forDevelopers = [
    {
      icon: <CurrencyRupeeIcon className="w-6 h-6" />,
      title: "Earn Money",
      description: "Get paid fairly for your work with our 98% payout rate",
    },
    {
      icon: <BriefcaseIcon className="w-6 h-6" />,
      title: "Find Projects",
      description:
        "Access a steady stream of quality projects matching your skills",
    },
    {
      icon: <TrophyIcon className="w-6 h-6" />,
      title: "Build Portfolio",
      description: "Showcase your work and build credibility with reviews",
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work with other developers and split earnings",
    },
  ];

  const forBuyers = [
    {
      icon: <ShoppingCartIcon className="w-6 h-6" />,
      title: "Find Talent",
      description: "Connect with pre-vetted, skilled developers instantly",
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: "Save Time",
      description: "No lengthy hiring process - post and get bids in hours",
    },
    {
      icon: <CheckCircleIcon className="w-6 h-6" />,
      title: "Quality Assurance",
      description: "Payment only released when you're satisfied",
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: "Direct Communication",
      description: "Chat directly with developers throughout the project",
    },
  ];

  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How ProjectShaala Helps Everyone
          </h2>
          <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're a developer looking for work or a client with a
            project, we've got you covered.
          </p>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* For Developers */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 lg:p-10 hover:border-gray-900 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <UserGroupIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-poppins text-2xl font-bold text-gray-900">
                  For Developers
                </h3>
                <p className="font-sans text-sm text-gray-500">
                  Grow your career & income
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {forDevelopers.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="font-sans text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/apply-developer"
              className="mt-8 block w-full py-4 bg-gray-900 text-white text-center font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Become a Developer →
            </a>
          </div>

          {/* For Buyers/Clients */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 lg:p-10 hover:border-gray-900 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <BriefcaseIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-poppins text-2xl font-bold text-gray-900">
                  For Clients
                </h3>
                <p className="font-sans text-sm text-gray-500">
                  Build your ideas faster
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {forBuyers.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="font-sans text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/projects"
              className="mt-8 block w-full py-4 bg-gray-900 text-white text-center font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Explore Projects →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
