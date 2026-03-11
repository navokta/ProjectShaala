// app/page.jsx
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/Home/HeroSection";
import TrustBanner from "@/components/Home/TrustBanner";
import HowItWorks from "@/components/Home/HowItWorks";
import Testimonials from "@/components/Home/Testimonials";

// Sundar Divider – Premium & Minimal
const SectionDivider = () => (
  <div className="bg-white w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center py-10">
        <div className="flex items-center gap-4">
          {/* Left Line – longer with soft gradient */}
          <div className="w-24 h-[2px] bg-gradient-to-r from-white via-gray-600 to-gray-700"></div>
          
          {/* Center Dot – with subtle inner glow */}
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-gray-700 blur-[1px] opacity-40"></div>
          </div>
          
          {/* Right Line – longer with soft gradient */}
          <div className="w-24 h-[2px] bg-gradient-to-r from-gray-700 via-gray-600 to-white"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="overflow-hidden">
        <HeroSection />
        <SectionDivider />

        <HowItWorks />
        <SectionDivider />

        <TrustBanner />
        <SectionDivider />

        <Testimonials />
      </main>

      <Footer />
    </>
  );
}