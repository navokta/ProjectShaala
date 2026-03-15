// app/contact/page.js
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactHero from "@/components/Contact/ContactHero";
import ContactForm from "@/components/Contact/ContactForm";
import ContactInfo from "@/components/Contact/ContactInfo";
import ContactFAQ from "@/components/Contact/ContactFAQ";
// import SectionDivider from "@/components/UI/SectionDivider";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = () => {
    // Simulate form submission
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <>
      <Header userType="public" isDashboard={false} />

      <main className="min-h-screen bg-white">
        <ContactHero />
        {/* <SectionDivider variant="simple" /> */}

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Contact Info */}
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm
                onSubmit={handleFormSubmit}
                submitted={formSubmitted}
              />
            </div>
          </div>
        </div>

        {/* <SectionDivider variant="dotted" /> */}
        <ContactFAQ />
      </main>

      <Footer />
    </>
  );
}
