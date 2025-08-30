import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-gray-200">
      {/* Main Footer Content */}
      <div className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ProjectShaala
            </Link>
            <p className="text-white mt-4 font-medium">Empowering developers. Monetizing innovation.</p>
            <p className="text-gray-300 mt-2">A dynamic marketplace to buy and sell software projects.</p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://github.com/navokta" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition-colors duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a 
                href="https://x.com/navokta" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/navokta/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/navokta/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Buyers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Advanced Search
                </Link>
              </li>
              <li>
                <Link href="/guide/buying" className="text-gray-300 hover:text-white transition-colors duration-300">
                  How to Buy
                </Link>
              </li>
            </ul>
          </div>

          {/* For Developers */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Developers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/list-project" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Sell a Project
                </Link>
              </li>
              <li>
                <Link href="/guide/selling" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Developer Guidelines
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Pricing & Fees
                </Link>
              </li>
              <li>
                <Link href="/dashboard/messages" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Chat Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
            
            {/* Trust Badge */}
            <div className="mt-6 p-3 bg-slate-900 rounded-lg">
              <p className="text-sm text-gray-300">Secure Payments via</p>
              <div className="font-bold text-white mt-1">Razorpay</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="px-6 py-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 ProjectShaala. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;