import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/i18n/locales";
import { getSiteOrigin } from "@/lib/site-origin";
import { publicAlternates } from "@/lib/i18n/seo";
import CasesIndexClient from "@/app/cases/CasesIndexClient";

interface LocalizedCasesProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalizedCasesProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  if (!locale) return {};

  const origin = getSiteOrigin() ?? new URL("https://vertextarget.com");
  const alternates = publicAlternates("/cases", origin, locale);

  return {
    title: "Cases & Architecture Studies | VertexTarget",
    description: "Detailed architecture case studies, technical challenges and proven results.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  };
}

export default async function LocalizedCasesPage({ params }: LocalizedCasesProps) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  if (!locale) notFound();

  return <CasesIndexClient />;
}
