// components/Dashboard/QuickActions.jsx
"use client";

import {
  PlusIcon,
  ChatBubbleLeftRightIcon,
  FolderPlusIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

export default function QuickActions() {
  const actions = [
    {
      icon: <PlusIcon className="w-6 h-6" />,
      label: "Post New Project",
      description: "Create a new project and get bids",
      href: "/dashboard/projects/new",
      primary: true,
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      label: "View Messages",
      description: "Check conversations with developers",
      href: "/dashboard/messages",
      primary: false,
    },
    {
      icon: <FolderPlusIcon className="w-6 h-6" />,
      label: "Browse Projects",
      description: "Explore project templates",
      href: "/projects",
      primary: false,
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      label: "Find Developers",
      description: "Search skilled developers",
      href: "/developers",
      primary: false,
    },
    {
      icon: <DocumentTextIcon className="w-6 h-6" />,
      label: "View Contracts",
      description: "Manage project agreements",
      href: "/dashboard/contracts",
      primary: false,
    },
    {
      icon: <CreditCardIcon className="w-6 h-6" />,
      label: "Payment History",
      description: "Track your transactions",
      href: "/dashboard/payments",
      primary: false,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-poppins font-bold text-gray-900 mb-4 text-lg">
        ⚡ Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
              action.primary
                ? "bg-gray-900 border-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-900 hover:shadow-sm"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                action.primary ? "bg-white/20" : "bg-gray-900 text-white"
              }`}
            >
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-poppins font-semibold text-sm truncate ${
                  action.primary ? "text-white" : "text-gray-900"
                }`}
              >
                {action.label}
              </p>
              <p
                className={`font-sans text-xs truncate ${
                  action.primary ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {action.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
