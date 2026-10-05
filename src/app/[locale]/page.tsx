import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/i18n/locales";
import { getSiteOrigin } from "@/lib/site-origin";
import { publicAlternates } from "@/lib/i18n/seo";
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
import HomePlatformHighlight from "@/components/home/HomePlatformHighlight";
import ContactSection from "@/components/contact/ContactSection";

interface LocalizedHomeProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalizedHomeProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  if (!locale) return {};

  const origin = getSiteOrigin() ?? new URL("https://vertextarget.com");
  const alternates = publicAlternates("/", origin, locale);

  return {
    title: "VertexTarget — Digital Engineering & Vertex OS",
    description: "Marketing digital, automação com IA e experiências web imersivas.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  };
}

export default async function LocalizedHomePage({ params }: LocalizedHomeProps) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  if (!locale) notFound();

  return (
    <ClientLandingShell>
      <main>
        <HeroSection />
        <TrustedBy />
        <MetricsBand />
        <HomePlatformHighlight />
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
