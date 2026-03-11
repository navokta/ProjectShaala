// components/Footer/FooterMarketplaceLinks.jsx
import Link from 'next/link';

const links = [
  { name: '?', href: '#' },
];

const FooterBuyersLinks = () => {
  return (
    <div>
      <h3 className="font-poppins font-semibold text-white mb-4">Buyers</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className="font-sans text-sm text-gray-400 hover:text-white transition">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterBuyersLinks;