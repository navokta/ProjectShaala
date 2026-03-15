// app/terms/page.js
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TermsHero from "@/components/Terms/TermsHero";
import TermsTOC from "@/components/Terms/TermsTOC";
import TermsContent from "@/components/Terms/TermsContent";
import TermsFooter from "@/components/Terms/TermsFooter";
// import SectionDivider from "@/components/UI/SectionDivider";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="min-h-screen bg-white">
        <TermsHero />
        {/* <SectionDivider variant="simple" /> */}

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Left: Table of Contents (Sticky) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <TermsTOC
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                />
              </div>
            </div>

            {/* Right: Terms Content */}
            <div className="lg:col-span-3">
              <TermsContent
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>
          </div>
        </div>

        {/* <SectionDivider variant="gradient" /> */}
        <TermsFooter />
      </main>

      <Footer />
    </>
  );
}
