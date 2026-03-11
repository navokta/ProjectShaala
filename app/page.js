"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/Home/HeroSection";
import TrustBanner from "@/components/Home/TrustBanner";
import HowItWorks from "@/components/Home/HowItWorks";
import Testimonials from "@/components/Home/Testimonials";

export default function HomePage() {
  const [projects, setProjects] = useState([]);

  return (
    <>
      <Header userType="public" isDashboard={false} />
      <main>
        <HeroSection />
        <HowItWorks />
        <TrustBanner />
        {/* <TrendingProjectsClient /> */}
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
