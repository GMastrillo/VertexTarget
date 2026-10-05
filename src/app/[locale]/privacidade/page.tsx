import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { normalizeLocale } from '@/lib/i18n/locales';
import { getSiteOrigin } from '@/lib/site-origin';
import { publicAlternates } from '@/lib/i18n/seo';

interface LocalizedPrivacidadeProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalizedPrivacidadeProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  if (!locale) return {};

  const origin = getSiteOrigin() ?? new URL('https://vertextarget.com');
  const alternates = publicAlternates('/privacidade', origin, locale);

  return {
    title: 'Privacy Policy | VertexTarget',
    description: 'Transparency regarding data processing, authentication and quotas.',
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  };
}

export default async function LocalizedPrivacidadePage({ params }: LocalizedPrivacidadeProps): Promise<React.JSX.Element> {
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
            Política de Privacidade
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Última atualização: Outubro de 2026 · Em conformidade com a LGPD e regulamentações internacionais de privacidade.
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">1. Informações que Coletamos</h2>
          <p>
            Coletamos apenas as informações estritamente necessárias para a prestação dos nossos serviços de
            desenvolvimento sob medida e para a operação do sistema Vertex OS:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Dados de Contato e Interesse:</strong> Nome, e-mail corporativo e número de contato informados
              voluntariamente no formulário de contato.
            </li>
            <li>
              <strong>Dados de Conta e Acesso:</strong> E-mail e credenciais de acesso criptografadas para autenticação e
              gerenciamento do seu workspace no Vertex OS.
            </li>
            <li>
              <strong>Dados de Conteúdo:</strong> Informações de briefing, textos e contatos inseridos em projetos para
              geração e publicação de landing pages.
            </li>
            <li>
              <strong>Registros de Uso e Quotas:</strong> Contadores agregados de operações mensais vinculados à sua
              identidade de acesso para prevenção de abusos.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">2. Finalidade e Tratamento</h2>
          <p>
            Seus dados são tratados exclusivamente para viabilizar as funcionalidades da plataforma, responder a contatos
            comerciais solicitados e assegurar a integridade técnica dos nossos serviços. Não comercializamos dados.
          </p>
        </section>
      </main>
    </div>
  );
}
