import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublishedSite } from '@/lib/os/publication-repository';
import { SiteRenderer } from '@/components/os/site-renderer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = await getPublishedSite(slug);
  if (!site) {
    return {
      title: 'Site não encontrado | Vertex OS',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${site.document.title} | ${site.document.businessName}`,
    description: site.document.description,
    robots: { index: true, follow: true },
    openGraph: {
      title: `${site.document.title} | ${site.document.businessName}`,
      description: site.document.description,
      type: 'website',
    },
  };
}

export default async function PublishedSitePage({ params }: PageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const site = await getPublishedSite(slug);

  if (!site) {
    notFound();
  }

  return <SiteRenderer document={site.document} preview={false} />;
}
