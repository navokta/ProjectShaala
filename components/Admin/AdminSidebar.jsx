"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Overview", href: "/admin", icon: HomeIcon },
  {
    name: "Developer Applications",
    href: "/admin/developer-requests",
    icon: DocumentTextIcon,
  },
  { name: "Users", href: "/admin/users", icon: UserGroupIcon },
  { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
  { name: "Buyer Bids", href: "/admin/buyer-bids", icon: TagIcon },
  { name: "Developer Bids", href: "/admin/developer-bids", icon: DocumentTextIcon },
];

// For owner, add "Manage Admins" link
const ownerOnly = [
  { name: "Manage Admins", href: "/admin/admins", icon: UserGroupIcon },
];

const AdminSidebar = ({ role }) => {
  const pathname = usePathname();
  const navItems =
    role === "owner" ? [...navigation, ...ownerOnly] : navigation;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 pt-20">
      <nav className="mt-8 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 my-1 rounded-lg transition ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
