// components/Header/UserActions.jsx
import Link from 'next/link';
import { EnvelopeIcon, BellIcon } from '@heroicons/react/24/outline';
import ProfileDropdown from './ProfileDropdown';

const UserActions = ({ userType, mobile = false, onLinkClick }) => {
  if (mobile) {
    return (
      <div className="space-y-1 px-2">
        {/* Show Become Developer button only for buyers */}
        {userType === 'buyer' && (
          <Link
            href="/apply-developer"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
            onClick={onLinkClick}
          >
            Become Developer
          </Link>
        )}
        <Link
          href="/messages"
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
          onClick={onLinkClick}
        >
          Messages
        </Link>
        <Link
          href={`/${userType}/notifications`}
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
          onClick={onLinkClick}
        >
          Notifications
        </Link>
        <Link
          href={userType === 'buyer' ? '/dashboard' : '/developer'}
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
          onClick={onLinkClick}
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
          onClick={onLinkClick}
        >
          Profile
        </Link>
        <Link
          href="/settings"
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
          onClick={onLinkClick}
        >
          Settings
        </Link>
        <button
          onClick={() => {
            // handle logout
            if (onLinkClick) onLinkClick();
          }}
          className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Show Become Developer button only for buyers */}
      {userType === 'buyer' && (
        <Link
          href="/apply-developer"
          className="text-sm font-medium border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-900 hover:text-white hover:border-gray-900 transition"
        >
          Become Developer
        </Link>
      )}
      {/* Messages Icon */}
      <Link href="/messages" className="relative p-2 text-gray-400 hover:text-gray-500">
        <EnvelopeIcon className="h-6 w-6" />
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
      </Link>

      {/* Notifications Icon */}
      <Link href={`/${userType}/notifications`} className="relative p-2 text-gray-400 hover:text-gray-500">
        <BellIcon className="h-6 w-6" />
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
      </Link>

      {/* Dashboard Button */}
      <Link
        href={userType === 'buyer' ? '/dashboard' : '/developer'}
        className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
      >
        Dashboard
      </Link>

      {/* Profile Dropdown */}
      <ProfileDropdown userType={userType} />
    </div>
  );
};

export default UserActions;