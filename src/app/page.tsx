"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/ui/Preloader";
import HeroSection from "@/components/hero/HeroSection";
import ServicesSection from "@/components/services/ServicesSection";
import CasesSection from "@/components/cases/CasesSection";
import AboutSection from "@/components/about/AboutSection";
import AILabSection from "@/components/ai-lab/AILabSection";
import FAQSection from "@/components/faq/FAQSection";
import TrustedBy from "@/components/trusted/TrustedBy";
import ContactSection from "@/components/contact/ContactSection";

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <SmoothScrollProvider>
      <Preloader onComplete={() => setPreloaderDone(true)} />
      <CustomCursor />
      <Navigation />

      <main>
        <HeroSection />
        <TrustedBy />
        <ServicesSection />
        <CasesSection />
        <AboutSection />
        <AILabSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
