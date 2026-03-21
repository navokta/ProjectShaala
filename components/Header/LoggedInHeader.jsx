// components/Header/LoggedInHeader.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Bars3Icon, 
  XMarkIcon, 
  EnvelopeIcon, 
  BellIcon,
  ShieldCheckIcon   // icon for admin link
} from '@heroicons/react/24/outline';
import Logo from './Logo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import UserActions from './UserActions';
import MobileMenu from './MobileMenu';

const LoggedInHeader = ({ userType, role }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Projects', href: '/projects' },
    { name: 'Developers', href: '/developers' },
  ];

  if (userType === 'buyer') {
    navLinks.push({ name: 'Post Project', href: '/dashboard/projects/create' });
  } else if (userType === 'developer') {
    navLinks.push({ name: 'Browse Projects', href: '/developer/projects' });
  }

  // Determine if we should show admin link (admin or owner)
  const showAdminLink = role === 'admin' || role === 'owner';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 font-sans">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavLinks links={navLinks} />
          </div>

          {/* Desktop Right side */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <SearchBar withFilter={true} />

            {/* Admin link (visible only for admin/owner) */}
            {showAdminLink && (
              <Link
                href="/admin"
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md transition"
              >
                <ShieldCheckIcon className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}

            <UserActions userType={userType} />
          </div>

          {/* Mobile Layout: Search Bar + Icons + Hamburger */}
          <div className="flex md:hidden items-center space-x-2 flex-1 justify-end">
            {/* Mobile Search Bar */}
            <div className="flex-1 max-w-[160px]">
              <SearchBar mobile withFilter={true} />
            </div>
            
            {/* Message Icon (mobile) */}
            <Link href="/messages" className="p-2 text-gray-400 hover:text-gray-500">
              <EnvelopeIcon className="h-5 w-5" />
            </Link>
            
            {/* Notification Icon (mobile) */}
            <Link href={`/${userType}/notifications`} className="p-2 text-gray-400 hover:text-gray-500">
              <BellIcon className="h-5 w-5" />
            </Link>

            {/* Hamburger Menu */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Only Navigation Links & User Actions (without icons) */}
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <div className="space-y-1 px-2 pb-3 pt-2">
            <NavLinks links={navLinks} mobile onLinkClick={() => setMobileMenuOpen(false)} />
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="px-2 space-y-1">
              {/* Admin link in mobile menu (visible only for admin/owner) */}
              {showAdminLink && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              <Link
                href="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  console.log('logout');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </MobileMenu>
      </nav>
    </header>
  );
};

export default LoggedInHeader;