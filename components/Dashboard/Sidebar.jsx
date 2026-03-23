// components/Dashboard/Sidebar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  FolderIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "My Projects", href: "/dashboard/projects", icon: FolderIcon },
  { name: "Post a Project", href: "/dashboard/post-project", icon: PlusIcon },
  {
    name: "Bids & Proposals",
    href: "/dashboard/bids",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: ChatBubbleLeftRightIcon,
    badge: true,
  },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCardIcon },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircleIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

export default function Sidebar({ user, onLogout }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    // Optional: clear localStorage, redirect, etc.
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out font-inter
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-poppins font-bold text-xl text-gray-900">
                ProjectShaala
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* User Profile Mini */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.avatar || "https://placehold.co/40/111827/ffffff?text=U"
                }
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-poppins font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${isActive ? "bg-white/20 text-white" : "bg-gray-900 text-white"}`}
                    >
                      New
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 
                hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 text-gray-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-xl bg-gray-900 text-white shadow-lg hover:bg-gray-800"
        aria-label="Open sidebar"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
    </>
  );
}
