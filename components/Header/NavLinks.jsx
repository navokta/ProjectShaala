// components/Header/NavLinks.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLinks = ({ links, mobile = false, onLinkClick }) => {
  const pathname = usePathname();

  const baseClass = mobile
    ? 'block px-3 py-2 text-base font-medium rounded-md transition'
    : 'text-sm font-medium px-3 py-2 rounded-md transition';

  const getLinkClass = (href) => {
    // Check if current path matches the link's href (exact match)
    const isActive = pathname === href;
    // Active: dark background (like signup button)
    // Hover: same as active but slightly lighter (applies even if not active)
    const activeClass = 'bg-gray-900 text-white hover:bg-gray-800';
    const inactiveClass = 'text-gray-700 hover:bg-gray-900 hover:text-white';
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={getLinkClass(link.href)}
          onClick={onLinkClick}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;