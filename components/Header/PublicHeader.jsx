// components/Header/PublicHeader.jsx
'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Explore Projects', href: '/projects' },
    { name: 'Developers', href: '/developers' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 font-sans">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavLinks links={navLinks} />
          </div>

          {/* Right side: Search + Auth Buttons - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <SearchBar withFilter={false} />
            <AuthButtons />
          </div>

          {/* Mobile Layout: Search Bar + Hamburger */}
          <div className="flex md:hidden items-center space-x-3 flex-1 justify-end">
            {/* Mobile Search Bar - Always visible in header */}
            <div className="flex-1 max-w-[200px]">
              <SearchBar mobile withFilter={false} />
            </div>
            
            {/* Hamburger Menu Button */}
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

        {/* Mobile Menu - Only Navigation Links, No Search Bar */}
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <div className="space-y-1 px-2 pb-3 pt-2">
            <NavLinks links={navLinks} mobile onLinkClick={() => setMobileMenuOpen(false)} />
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <AuthButtons mobile onLinkClick={() => setMobileMenuOpen(false)} />
          </div>
        </MobileMenu>
      </nav>
    </header>
  );
};

export default PublicHeader;