// app/faq/page.js
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQHero from "@/components/FAQ/FAQHero";
import FAQSearch from "@/components/FAQ/FAQSearch";
import FAQCategories from "@/components/FAQ/FAQCategories";
import FAQAccordion from "@/components/FAQ/FAQAccordion";
import FAQCTA from "@/components/FAQ/FAQCTA";
// import SectionDivider from "@/components/UI/SectionDivider";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openQuestions, setOpenQuestions] = useState([]);

  const toggleQuestion = (index) => {
    setOpenQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="min-h-screen bg-white">
        <FAQHero />
        {/* <SectionDivider variant="simple" /> */}

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-12">
          <FAQSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          {/* <SectionDivider variant="simple" className="py-8" /> */}
          <FAQCategories
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* <SectionDivider variant="dotted" /> */}

        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-20 py-16">
          <FAQAccordion
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            openQuestions={openQuestions}
            onToggleQuestion={toggleQuestion}
          />
        </div>

        {/* <SectionDivider variant="gradient" /> */}
        <FAQCTA />
      </main>

      <Footer />
    </>
  );
}
