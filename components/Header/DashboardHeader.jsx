// components/Header/DashboardHeader.jsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bars3Icon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import UserActions from './UserActions';

const DashboardHeader = ({ userType = 'buyer' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  let pageTitle = 'Dashboard';
  if (pathname.includes('/messages')) pageTitle = 'Messages';
  else if (pathname.includes('/projects')) pageTitle = 'Projects';
  else if (pathname.includes('/settings')) pageTitle = 'Settings';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 font-sans">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Sidebar toggle + page title */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="font-poppins text-xl font-semibold text-gray-900">{pageTitle}</h1>
          </div>

          {/* Right side: Search, User Actions */}
          <div className="flex items-center space-x-4">
            <SearchBar withFilter={true} />
            <UserActions userType={userType} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardHeader;