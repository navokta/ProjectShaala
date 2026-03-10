// components/Header/Logo.jsx
import Link from 'next/link';
import { CodeBracketIcon } from '@heroicons/react/24/solid';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-0.5 md:space-x-2 group">
      <div className="bg-gray-900 p-2 rounded-lg group-hover:bg-gray-800 transition-colors">
        <CodeBracketIcon className="h-6 w-6 text-blue-400" />
      </div>
      <div>
        <span className="font-mono text-xl font-bold">
          <span className="text-gray-900">&lt;</span>
          <span className="text-gray-700">PS</span>
          <span className="text-gray-900">/&gt;</span>
        </span>
        {/* Tagline only visible on medium screens and up */}
        <span className="font-sans text-[10px] font-medium text-gray-500 block -mt-1 hidden md:block">
          dev marketplace
        </span>
      </div>
    </Link>
  );
};

export default Logo;