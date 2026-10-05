import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/i18n/locales";
import { getSiteOrigin } from "@/lib/site-origin";
import { publicAlternates } from "@/lib/i18n/seo";
import PlataformaClientShell from "@/components/plataforma/PlataformaClientShell";
import PlataformaHero from "@/components/plataforma/PlataformaHero";
import NichesMarquee from "@/components/plataforma/NichesMarquee";
import PainPointsSection from "@/components/plataforma/PainPointsSection";
import PlatformHubSection from "@/components/plataforma/PlatformHubSection";
import TemplatesCoverflow from "@/components/plataforma/TemplatesCoverflow";
import PlataformaPricing from "@/components/plataforma/PlataformaPricing";
import PlataformaFaq from "@/components/plataforma/PlataformaFaq";
import PlataformaFinalCta from "@/components/plataforma/PlataformaFinalCta";

interface LocalizedPlataformaProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalizedPlataformaProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  if (!locale) return {};

  const origin = getSiteOrigin() ?? new URL("https://vertextarget.com");
  const alternates = publicAlternates("/plataforma", origin, locale);

  return {
    title: "Vertex OS | High-Performance Web & Landing Pages",
    description: "Create, customize and publish high-converting landing pages with AI assistance.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  };
}

export default async function LocalizedPlataformaPage({ params }: LocalizedPlataformaProps) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  if (!locale) notFound();

  return (
    <PlataformaClientShell>
      <main>
        <PlataformaHero />
        <NichesMarquee />
        <PainPointsSection />
        <PlatformHubSection />
        <TemplatesCoverflow />
        <PlataformaPricing />
        <PlataformaFaq />
        <PlataformaFinalCta />
      </main>
    </PlataformaClientShell>
  );
}
