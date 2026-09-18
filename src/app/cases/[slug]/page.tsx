import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASES } from "@/lib/constants";
import { CASE_STUDIES } from "@/lib/case-studies";
import CaseStudyClient from "./CaseStudyClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = CASES.find((c) => c.id === slug);
  if (!item) return { title: "Case não encontrado | VertexTarget" };

  const study = CASE_STUDIES[slug]?.pt;
  const description = study?.summary ?? item.description;

  return {
    title: `${item.title} — Estudo de Arquitetura | VertexTarget`,
    description: description.slice(0, 155),
    openGraph: {
      title: `${item.title} — Estudo de Arquitetura`,
      description: description.slice(0, 155),
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const item = CASES.find((c) => c.id === slug);
  if (!item) notFound();

  return <CaseStudyClient slug={slug} />;
}
