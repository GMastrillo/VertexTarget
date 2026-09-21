import ClientLandingShell from "@/components/layout/ClientLandingShell";
import HeroSection from "@/components/hero/HeroSection";
import ServicesSection from "@/components/services/ServicesSection";
import CasesSection from "@/components/cases/CasesSection";
import AboutSection from "@/components/about/AboutSection";
import AILabSection from "@/components/ai-lab/AILabSection";
import FAQSection from "@/components/faq/FAQSection";
import TrustedBy from "@/components/trusted/TrustedBy";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import MetricsBand from "@/components/metrics/MetricsBand";
import ContactSection from "@/components/contact/ContactSection";

export default function HomePage() {
  return (
    <ClientLandingShell>
      <main>
        <HeroSection />
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
    </ClientLandingShell>
  );
}
