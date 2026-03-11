// components/Footer/FooterBrand.jsx
import Link from 'next/link';
import { CodeBracketIcon } from '@heroicons/react/24/solid';
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from 'react-icons/fa';

const FooterBrand = () => {
  return (
    <div className="space-y-4">
      {/* Logo - adjusted for dark bg */}
      <Link href="/" className="flex items-center space-x-2 group">
        <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-gray-700 transition-colors">
          <CodeBracketIcon className="h-6 w-6 text-blue-400" />
        </div>
        <span className="font-mono text-xl font-bold">
          <span className="text-white">&lt;</span>
          <span className="text-gray-300">PS</span>
          <span className="text-white">/&gt;</span>
        </span>
      </Link>

      {/* Description - light gray */}
      <p className="font-sans text-sm text-gray-400 leading-relaxed max-w-xs">
        Empowering developers. Monetizing innovation.
        A dynamic marketplace to buy and sell software projects.
      </p>

      {/* Social Icons - light gray, hover white */}
      <div className="flex space-x-4 pt-2">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
          <FaLinkedin className="h-5 w-5" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
          <FaTwitter className="h-5 w-5" />
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
          <FaGithub className="h-5 w-5" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
          <FaInstagram className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};

export default FooterBrand;