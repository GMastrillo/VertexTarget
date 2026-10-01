import type { Metadata } from "next";
import PlataformaClientShell from "@/components/plataforma/PlataformaClientShell";
import PlataformaHero from "@/components/plataforma/PlataformaHero";
import NichesMarquee from "@/components/plataforma/NichesMarquee";
import PainPointsSection from "@/components/plataforma/PainPointsSection";
import PlatformHubSection from "@/components/plataforma/PlatformHubSection";
import TemplatesCoverflow from "@/components/plataforma/TemplatesCoverflow";
import PlataformaPricing from "@/components/plataforma/PlataformaPricing";
import PlataformaFaq from "@/components/plataforma/PlataformaFaq";
import PlataformaFinalCta from "@/components/plataforma/PlataformaFinalCta";

export const metadata: Metadata = {
  title: "Vertex OS | Crie e venda sites de alta conversão com IA",
  description:
    "Ache negócios sem site no Google Maps, gere páginas profissionais em menos de 1 minuto com inteligência artificial e cobre de R$ 600 a R$ 2.500 por projeto.",
  keywords: [
    "criador de sites ia",
    "vender sites comércio local",
    "gerador de landing pages",
    "prospecção google maps",
    "automação de sites",
    "software criação de sites",
  ],
  openGraph: {
    title: "Vertex OS | Crie e venda sites de alta conversão com IA",
    description:
      "Ache negócios sem site no Google Maps, gere páginas profissionais em menos de 1 minuto com IA e cobre de R$ 600 a R$ 2.500.",
    url: "https://vertextarget.com/plataforma",
    siteName: "VertexTarget",
    locale: "pt_BR",
    type: "website",
  },
};

export default function PlataformaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Vertex OS",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Encontre comércios no Google Maps, gere sites profissionais com IA em 1 minuto e feche contratos.",
        offers: [
          {
            "@type": "Offer",
            name: "Starter Anual",
            price: "697",
            priceCurrency: "BRL",
          },
          {
            "@type": "Offer",
            name: "Pro Anual",
            price: "897",
            priceCurrency: "BRL",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlataformaClientShell>
        <PlataformaHero />
        <NichesMarquee />
        <PainPointsSection />
        <PlatformHubSection />
        <TemplatesCoverflow />
        <PlataformaPricing />
        <PlataformaFaq />
        <PlataformaFinalCta />
      </PlataformaClientShell>
    </>
  );
}
