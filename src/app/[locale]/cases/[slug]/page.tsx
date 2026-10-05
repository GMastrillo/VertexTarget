import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASES } from "@/lib/constants";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";
import { SUPPORTED_LOCALES, normalizeLocale } from "@/lib/i18n/locales";
import { getSiteOrigin } from "@/lib/site-origin";
import { publicAlternates } from "@/lib/i18n/seo";
import CaseStudyClient from "@/app/cases/[slug]/CaseStudyClient";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const result: Array<{ locale: string; slug: string }> = [];
  for (const locale of SUPPORTED_LOCALES) {
    for (const c of CASES) {
      result.push({ locale, slug: c.id });
    }
  }
  return result;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = normalizeLocale(rawLocale);
  const item = CASES.find((c) => c.id === slug);

  if (!locale || !item) {
    return { title: "Case not found | VertexTarget" };
  }

  const study = getCaseStudy(slug, locale) ?? CASE_STUDIES[slug]?.pt;
  const description = study?.summary ?? item.description;

  const origin = getSiteOrigin() ?? new URL("https://vertextarget.com");
  const alternates = publicAlternates(`/cases/${slug}`, origin, locale);

  return {
    title: `${item.title} — Case Study | VertexTarget`,
    description: description.slice(0, 155),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: `${item.title} — Case Study`,
      description: description.slice(0, 155),
      type: "article",
    },
  };
}

export default async function LocalizedCaseStudyPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = normalizeLocale(rawLocale);
  const item = CASES.find((c) => c.id === slug);

  if (!locale || !item) {
    notFound();
  }

  return <CaseStudyClient slug={slug} />;
}
