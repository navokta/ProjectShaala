'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSection from '@/components/Home/HeroSection';
import TrustBanner from '@/components/Home/TrustBanner';
import SearchFilters from '@/components/Home/SearchFilters';
import ProjectGrid from '@/components/Home/ProjectGrid';
import TrendingProjectsClient from '@/components/Home/TrendingProjectsClient';

export default function HomePage() {
  const [projects, setProjects] = useState([]);

  return (
    <>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <TrustBanner />
        <SearchFilters onResults={setProjects} />
        <ProjectGrid projects={projects} />
        <TrendingProjectsClient />
      </main>
      <Footer />
    </>
  );
}