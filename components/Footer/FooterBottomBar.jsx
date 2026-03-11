// components/Footer/FooterBottomBar.jsx
import Link from 'next/link';

const FooterBottomBar = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-gray-200 pt-6 mt-12 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 font-sans">
      <p>© {currentYear} ProjectShaala. All rights reserved.</p>
      <div className="flex space-x-4 mt-2 sm:mt-0">
        <Link href="/terms" className="hover:text-gray-900 transition">
          Terms
        </Link>
        <Link href="/privacy" className="hover:text-gray-900 transition">
          Privacy
        </Link>
        <Link href="/cookies" className="hover:text-gray-900 transition">
          Cookies
        </Link>
      </div>
    </div>
  );
};

export default FooterBottomBar;