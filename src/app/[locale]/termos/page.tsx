import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { normalizeLocale } from '@/lib/i18n/locales';
import { getSiteOrigin } from '@/lib/site-origin';
import { publicAlternates } from '@/lib/i18n/seo';

interface LocalizedTermosProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalizedTermosProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  if (!locale) return {};

  const origin = getSiteOrigin() ?? new URL('https://vertextarget.com');
  const alternates = publicAlternates('/termos', origin, locale);

  return {
    title: 'Terms of Service | VertexTarget',
    description: 'General conditions for using VertexTarget and Vertex OS.',
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  };
}

export default async function LocalizedTermosPage({ params }: LocalizedTermosProps): Promise<React.JSX.Element> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  if (!locale) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="border-b border-border px-6 py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
            VertexTarget
          </Link>
          <Link href="/os/entrar" className="text-xs font-semibold text-primary hover:underline">
            Acessar Vertex OS →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 space-y-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Termos de Serviço
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Última atualização: Outubro de 2026 · Válido para a plataforma VertexTarget e o sistema Vertex OS.
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">1. Objeto e Aceitação</h2>
          <p>
            Estes Termos de Serviço regem o acesso e a utilização dos serviços de desenvolvimento de landing pages sob
            medida e da plataforma de software Vertex OS fornecidos pela VertexTarget. Ao criar uma conta ou utilizar
            qualquer funcionalidade do sistema, você concorda integralmente com estes termos.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">2. Plano Gratuito e Quotas Operacionais</h2>
          <p>
            O Vertex OS oferece uma camada gratuita com limites mensais claros para permitir experimentação transparente
            sem surpresas ou cobranças automáticas:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Workspaces e Projetos:</strong> Limite de 1 workspace ativo e 1 projeto com persistência de dados.
            </li>
            <li>
              <strong>Publicação:</strong> 1 site publicado simultaneamente com URL segura gerada pelo sistema.
            </li>
            <li>
              <strong>Pipeline Comercial:</strong> Até 50 prospects cadastrados com campos estruturados e etapas visuais.
            </li>
            <li>
              <strong>Geração de Copy com IA:</strong> Até 3 gerações de copy por mês civil UTC.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
