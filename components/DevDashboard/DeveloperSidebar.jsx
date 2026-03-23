// components/DevDashboard/DeveloperSidebar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  CurrencyRupeeIcon,
  UserCircleIcon,
  StarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  EyeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/developer", icon: HomeIcon },
  {
    name: "My Bids",
    href: "/developer/bids",
    icon: ClipboardDocumentListIcon,
    badge: true,
  },
  { name: "Active Projects", href: "/developer/projects", icon: BriefcaseIcon },
  { name: "Earnings", href: "/developer/earnings", icon: CurrencyRupeeIcon },
  { name: "Profile", href: "/developer/profile", icon: UserCircleIcon },
  { name: "Portfolio", href: "/developer/portfolio", icon: EyeIcon },
  { name: "Reviews", href: "/developer/reviews", icon: StarIcon },
  { name: "Analytics", href: "/developer/analytics", icon: ChartBarIcon },
  { name: "Settings", href: "/developer/settings", icon: Cog6ToothIcon },
];

export default function DeveloperSidebar({ developer, stats, onLogout }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Developer Profile Mini */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={
                  developer?.avatar ||
                  "https://placehold.co/40/111827/ffffff?text=U"
                }
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-poppins font-medium text-gray-900 truncate">
                  {developer?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {developer?.title}
                </p>
              </div>
            </div>
            {/* Rating Badge */}
            <div className="flex items-center gap-1 mt-3">
              <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-900">
                {developer?.rating}
              </span>
              <span className="text-xs text-gray-500">
                ({developer?.totalReviews} reviews)
              </span>
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}
                  />
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.badge && stats?.pendingBids > 0 && (
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${isActive ? "bg-white/20 text-white" : "bg-gray-900 text-white"}`}
                    >
                      {stats.pendingBids}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Hourly Rate + Logout */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-3">
            <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Hourly Rate</p>
              <p className="font-poppins font-semibold text-gray-900 text-lg">
                ₹{developer?.hourlyRate}/hr
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 
                hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-xl bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Open sidebar"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
    </>
  );
}
