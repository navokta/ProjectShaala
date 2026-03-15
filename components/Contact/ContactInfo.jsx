// components/Contact/ContactInfo.jsx
"use client";

import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  TwitterIcon,
  LinkedInIcon,
  GitHubIcon,
  InstagramIcon,
} from "react-icons";

export default function ContactInfo() {
  const contactDetails = [
    {
      icon: <EnvelopeIcon className="w-6 h-6" />,
      label: "Email Us",
      value: "support@projectshaala.com",
      href: "mailto:support@projectshaala.com",
    },
    {
      icon: <PhoneIcon className="w-6 h-6" />,
      label: "Call Us",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
    },
    {
      icon: <MapPinIcon className="w-6 h-6" />,
      label: "Visit Us",
      value: "Tech Park, Bangalore, India",
      href: "#",
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      label: "Working Hours",
      value: "Mon - Sat, 9AM - 6PM IST",
      href: "#",
    },
  ];

  const socialLinks = [
    { icon: <TwitterIcon className="w-5 h-5" />, href: "#", label: "Twitter" },
    {
      icon: <LinkedInIcon className="w-5 h-5" />,
      href: "#",
      label: "LinkedIn",
    },
    { icon: <GitHubIcon className="w-5 h-5" />, href: "#", label: "GitHub" },
    {
      icon: <InstagramIcon className="w-5 h-5" />,
      href: "#",
      label: "Instagram",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Contact Cards */}
      <div className="space-y-4">
        <h3 className="font-poppins text-xl font-bold text-gray-900 mb-6">
          Contact Information
        </h3>

        {contactDetails.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-white hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:bg-white group-hover:text-gray-900 group-hover:border group-hover:border-gray-900 transition-all duration-300">
              {item.icon}
            </div>
            <div>
              <p className="font-sans text-sm text-gray-500 mb-1">
                {item.label}
              </p>
              <p className="font-poppins font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                {item.value}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Social Links */}
      <div className="pt-8 border-t border-gray-200">
        <h3 className="font-poppins text-lg font-bold text-gray-900 mb-4">
          Follow Us
        </h3>
        <div className="flex gap-3">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              aria-label={social.label}
              className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Quick Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="font-sans text-sm text-blue-800 leading-relaxed">
          💡 <strong>Quick Tip:</strong> For project-related queries, please
          include your project ID in the subject line for faster response.
        </p>
      </div>
    </div>
  );
}
