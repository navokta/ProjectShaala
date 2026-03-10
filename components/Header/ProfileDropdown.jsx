// components/Header/ProfileDropdown.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const ProfileDropdown = ({ userType = 'buyer' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
    {
      name: userType === 'buyer' ? 'Payments' : 'Earnings',
      href: userType === 'buyer' ? '/dashboard/payments' : '/developer/earnings',
    },
    { name: 'Logout', href: '#', onClick: () => console.log('logout') },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center space-x-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <UserCircleIcon className="h-8 w-8 text-gray-400" />
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setIsOpen(false);
                  if (item.onClick) item.onClick();
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;