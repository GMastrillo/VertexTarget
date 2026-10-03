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
  title: "Vertex OS | Crie e publique sites profissionais com IA",
  description:
    "Identifique oportunidades no mercado local com busca grounded, gere landing pages de alta conversão com copywriting por IA e publique com domínio e links seguros.",
  keywords: [
    "criador de sites ia",
    "landing pages profissionais",
    "prospecção comercial",
    "sites para empresas locais",
    "vertex os",
  ],
  openGraph: {
    title: "Vertex OS | Crie e publique sites profissionais com IA",
    description:
      "Identifique oportunidades com busca grounded e gere páginas profissionais com IA e proteção contra perda de dados.",
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
          "Plataforma completa para criação de sites profissionais e prospecção com copywriting por inteligência artificial.",
        offers: [
          {
            "@type": "Offer",
            name: "Plano Gratuito",
            price: "0",
            priceCurrency: "BRL",
          },
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
