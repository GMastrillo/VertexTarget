"use client";

import { useState } from "react";
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
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import MetricsBand from "@/components/metrics/MetricsBand";
import CommandPalette from "@/components/layout/CommandPalette";
import ContactSection from "@/components/contact/ContactSection";

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <SmoothScrollProvider>
      <Preloader onComplete={() => setPreloaderDone(true)} />
      <CustomCursor />
      <Navigation />
      <CommandPalette />

      <main>
        <HeroSection canvasReady={preloaderDone} />
        <TrustedBy />
        <MetricsBand />
        <ServicesSection />
        <CasesSection />
        <TestimonialsSection />
        <AboutSection />
        <AILabSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
