'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSection from '@/components/Home/HeroSection';
import TrustBanner from '@/components/Home/TrustBanner';
import SearchFilters from '@/components/Home/SearchFilters';
import ProjectGrid from '@/components/Home/ProjectGrid';
// import TrendingProjectsClient from '@/components/Home/TrendingProjectsClient';
import HowItWorks from '@/components/Home/HowItWorks';
import Testimonials from '@/components/Home/Testimonials';
import StartSellingCTA from '@/components/Home/StartSellingCTA';

export default function HomePage() {
  const [projects, setProjects] = useState([]);

  return (
    <>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <SearchFilters onResults={setProjects} />
        <ProjectGrid projects={projects} />
        <StartSellingCTA />
        <HowItWorks />
        <TrustBanner />
        {/* <TrendingProjectsClient /> */}
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}