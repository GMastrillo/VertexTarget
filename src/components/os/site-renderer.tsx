import React from 'react';
import type { SiteDocument } from '@/lib/os/types';
import { contactHref } from '@/lib/os/contact';
import { THEME_STYLES, type ThemeStyles } from './site-theme-styles';

export interface SiteRendererProps {
  document: SiteDocument;
  preview?: boolean;
}

interface SectionProps {
  document: SiteDocument;
  theme: ThemeStyles;
  primaryHref: string;
  waLink: string | null;
  mailLink: string | null;
}

function SiteHeader({ document, theme, primaryHref, waLink }: Omit<SectionProps, 'mailLink'>): React.JSX.Element {
  return (
    <header className={`border-b ${theme.border} px-6 py-4`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-xl font-bold tracking-tight ${theme.heading}`}>
            {document.businessName}
          </span>
          {document.city && (
            <span className={`hidden text-xs rounded-full border px-2.5 py-0.5 sm:inline-block ${theme.badge}`}>
              {document.city}
            </span>
          )}
        </div>
        <a
          href={primaryHref}
          target={waLink ? '_blank' : undefined}
          rel={waLink ? 'noopener noreferrer' : undefined}
          className={`rounded-lg px-4 py-2 text-sm transition-all duration-150 ${theme.primaryButton}`}
        >
          {document.ctaLabel}
        </a>
      </div>
    </header>
  );
}

function SiteHero({ document, theme, primaryHref, waLink, mailLink }: SectionProps): React.JSX.Element {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        {document.subtitle && (
          <p className={`mb-4 inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${theme.badge}`}>
            {document.subtitle}
          </p>
        )}
        <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl ${theme.heading}`}>
          {document.title}
        </h1>
        <p className={`mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed ${theme.subtext}`}>
          {document.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={primaryHref}
            target={waLink ? '_blank' : undefined}
            rel={waLink ? 'noopener noreferrer' : undefined}
            className={`rounded-lg px-6 py-3.5 text-base font-semibold shadow-lg transition-transform hover:scale-[1.02] ${theme.primaryButton}`}
          >
            {document.ctaLabel}
          </a>
          {mailLink && waLink && (
            <a
              href={mailLink}
              className={`rounded-lg border px-5 py-3.5 text-base font-medium transition-colors ${theme.secondaryButton}`}
            >
              Enviar E-mail
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function SiteServices({ document, theme }: { document: SiteDocument; theme: ThemeStyles }): React.JSX.Element | null {
  if (!document.services || document.services.length === 0) return null;

  const isConsulting = document.templateId === 'consulting';
  const subtitle = isConsulting
    ? 'Metodologia orientada a resultados estratégicos comprovados.'
    : 'Excelência no atendimento e execução personalizada.';
  const heading = document.templateId === 'commerce' ? 'Catálogo & Ofertas' : 'Nossas Soluções';

  return (
    <section className={`border-t ${theme.border} px-6 py-16 md:py-24`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className={`text-3xl font-bold ${theme.heading}`}>{heading}</h2>
          <p className={`mt-2 text-sm ${theme.subtext}`}>{subtitle}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {document.services.map((service, index) => (
            <article
              key={index}
              className={`rounded-xl border p-6 transition-all hover:translate-y-[-2px] ${theme.card}`}
            >
              <span className={`inline-block text-xs font-bold tracking-widest ${theme.badge} rounded px-2 py-0.5 mb-3`}>
                0{index + 1}
              </span>
              <h3 className={`text-lg font-bold ${theme.heading}`}>{service.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${theme.subtext}`}>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteContact({ document, theme, primaryHref, waLink }: Omit<SectionProps, 'mailLink'>): React.JSX.Element {
  return (
    <section id="contato" className={`border-t ${theme.border} px-6 py-16 md:py-20`}>
      <div className="mx-auto max-w-3xl rounded-2xl border p-8 md:p-12 text-center backdrop-blur-sm shadow-xl">
        <h2 className={`text-2xl sm:text-3xl font-bold ${theme.heading}`}>Pronto para iniciar?</h2>
        <p className={`mx-auto mt-3 max-w-xl text-sm sm:text-base ${theme.subtext}`}>
          Fale diretamente com nossa equipe especializada. Atendimento rápido e transparente.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href={primaryHref}
            target={waLink ? '_blank' : undefined}
            rel={waLink ? 'noopener noreferrer' : undefined}
            className={`rounded-lg px-6 py-3 font-semibold shadow-md ${theme.primaryButton}`}
          >
            {document.ctaLabel}
          </a>
          {document.city && (
            <span className={`text-xs ${theme.subtext} self-center`}>
              Atendendo em {document.city} e região
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function PreviewBanner(): React.JSX.Element {
  return (
    <aside
      aria-label="Aviso de modo prévia"
      className="sticky top-0 z-50 flex items-center justify-between border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-500 backdrop-blur-md"
    >
      <span>Modo Prévia Interativa — Alterações não publicadas até você clicar em Publicar</span>
      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase">Rascunho</span>
    </aside>
  );
}

export function SiteRenderer({ document, preview = false }: SiteRendererProps): React.JSX.Element {
  const theme = THEME_STYLES[document.themeId] || THEME_STYLES['cyan-dark'];
  const waLink = contactHref({ whatsapp: document.whatsapp });
  const mailLink = contactHref({ email: document.email });
  const primaryHref = waLink || mailLink || '#contato';

  return (
    <div className={`min-h-screen w-full font-sans transition-colors duration-200 ${theme.wrapper}`}>
      {preview && <PreviewBanner />}
      <SiteHeader document={document} theme={theme} primaryHref={primaryHref} waLink={waLink} />
      <main>
        <SiteHero
          document={document}
          theme={theme}
          primaryHref={primaryHref}
          waLink={waLink}
          mailLink={mailLink}
        />
        <SiteServices document={document} theme={theme} />
        <SiteContact document={document} theme={theme} primaryHref={primaryHref} waLink={waLink} />
      </main>
      <footer className={`border-t ${theme.border} px-6 py-8 text-center text-xs ${theme.subtext}`}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {document.businessName}. Todos os direitos reservados.</p>
          <p className="opacity-75">
            Publicado via <span className="font-semibold">Vertex OS</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
