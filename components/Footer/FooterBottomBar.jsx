// components/Footer/FooterBottomBar.jsx
import Link from 'next/link';

const FooterBottomBar = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-gray-200 pt-6 mt-12 flex flex-col sm:flex-row justify-center items-center text-xs text-gray-500 font-sans">
      <p>© {currentYear} ProjectShaala. All rights reserved.</p>
    </div>
  );
};

export default FooterBottomBar;