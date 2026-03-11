// app/page.jsx
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/Home/HeroSection";
import TrustBanner from "@/components/Home/TrustBanner";
import HowItWorks from "@/components/Home/HowItWorks";
import Testimonials from "@/components/Home/Testimonials";
import SectionDivider from "@/components/UI/SectionDivider";

export default function HomePage() {
  const [projects, setProjects] = useState([]);

  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="overflow-hidden">
        <HeroSection />
        <SectionDivider variant="arrow" />
        <HowItWorks />
        <SectionDivider variant="gradient" />
        <TrustBanner />
        <SectionDivider variant="dotted" />
        <Testimonials />
      </main>

      <Footer />
    </>
  );
}
