// app/pricing/page.js
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingHero from "@/components/Pricing/PricingHero";
import PricingModel from "@/components/Pricing/PricingModel";
import PricingFeatures from "@/components/Pricing/PricingFeatures";
import PricingCalculator from "@/components/Pricing/PricingCalculator";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
// import SectionDivider from "@/components/UI/SectionDivider";

export default function PricingPage() {
  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="min-h-screen bg-white">
        <PricingHero />
        {/* <SectionDivider variant="simple" /> */}
        <PricingModel />
        {/* <SectionDivider variant="dotted" /> */}
        <PricingCalculator />
        {/* <SectionDivider variant="gradient" /> */}
        <PricingFeatures />
        {/* <SectionDivider variant="simple" /> */}
        <PricingFAQ />
      </main>

      <Footer />
    </>
  );
}
