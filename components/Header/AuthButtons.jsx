// components/Header/AuthButtons.jsx
import Link from 'next/link';

const AuthButtons = ({ mobile = false, onLinkClick }) => {
  if (mobile) {
    return (
      <div className="space-y-1 px-2">
        <Link
          href="/login"
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-900 hover:text-white rounded-md transition"
          onClick={onLinkClick}
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="block px-3 py-2 text-base font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-md transition"
          onClick={onLinkClick}
        >
          Signup
        </Link>
        <Link
          href="/apply-developer"
          className="block px-3 py-2 text-base font-medium border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 rounded-md transition"
          onClick={onLinkClick}
        >
          Become Developer
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/login"
        className="text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-white px-4 py-2 rounded-md transition"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
      >
        Signup
      </Link>
      <Link
        href="/apply-developer"
        className="text-sm font-medium border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-900 hover:text-white hover:border-gray-900 transition"
      >
        Become Developer
      </Link>
    </div>
  );
};

export default AuthButtons;