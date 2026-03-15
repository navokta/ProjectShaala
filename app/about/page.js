// app/about/page.js
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/About/AboutHero";
import AboutMission from "@/components/About/AboutMission";
import AboutHowItHelps from "@/components/About/AboutHowItHelps";
import AboutEarning from "@/components/About/AboutEarning";
import AboutFreelancing from "@/components/About/AboutFreelancing";
import AboutStats from "@/components/About/AboutStats";
// import SectionDivider from "@/components/UI/SectionDivider";

export default function AboutPage() {
  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="min-h-screen bg-white">
        <AboutHero />
        {/* <SectionDivider variant="simple" /> */}
        <AboutMission />
        {/* <SectionDivider variant="dotted" /> */}
        <AboutHowItHelps />
        {/* <SectionDivider variant="gradient" /> */}
        <AboutEarning />
        {/* <SectionDivider variant="simple" /> */}
        <AboutFreelancing />
        {/* <SectionDivider variant="dotted" /> */}
        <AboutStats />
      </main>

      <Footer />
    </>
  );
}
