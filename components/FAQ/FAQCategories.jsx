// components/FAQ/FAQCategories.jsx
"use client";

import {
  QuestionMarkCircleIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export default function FAQCategories({ activeCategory, onCategoryChange }) {
  const categories = [
    {
      id: "all",
      label: "All",
      icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
    },
    {
      id: "general",
      label: "General",
      icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
    },
    {
      id: "developers",
      label: "For Developers",
      icon: <UserGroupIcon className="w-5 h-5" />,
    },
    {
      id: "clients",
      label: "For Clients",
      icon: <BriefcaseIcon className="w-5 h-5" />,
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CurrencyRupeeIcon className="w-5 h-5" />,
    },
    {
      id: "security",
      label: "Security",
      icon: <ShieldCheckIcon className="w-5 h-5" />,
    },
    {
      id: "support",
      label: "Support",
      icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-poppins font-medium text-sm transition-all duration-300 ${
            activeCategory === category.id
              ? "bg-gray-900 text-white shadow-lg"
              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-900 hover:bg-gray-50"
          }`}
        >
          {category.icon}
          <span className="hidden sm:inline">{category.label}</span>
        </button>
      ))}
    </div>
  );
}
