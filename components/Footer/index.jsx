// components/Footer/index.jsx
import FooterBrand from './FooterBrand';
import FooterMarketplaceLinks from './FooterBuyersLinks';
import FooterCompanyLinks from './FooterCompanyLinks';
import FooterSupportLinks from './FooterDeveloperLinks';
import FooterBottomBar from './FooterBottomBar';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-200 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
       
        {/* Main Footer Links - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand - takes 2 columns on lg */}
          <div className="lg:col-span-3">
            <FooterBrand />
          </div>

          {/* Marketplace */}
          <div className="lg:col-span-1">
            <FooterMarketplaceLinks />
          </div>

          {/* Support */}
          <div className="lg:col-span-1">
            <FooterSupportLinks />
          </div>

          {/* Company */}
          <div className="lg:col-span-1">
            <FooterCompanyLinks />
          </div>

        </div>

        {/* Bottom Bar */}
        <FooterBottomBar />
      </div>
    </footer>
  );
};

export default Footer;