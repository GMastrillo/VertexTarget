import { notFound } from "next/navigation";
import { normalizeLocale, SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import { loadDictionaries } from "@/lib/i18n/load-dictionary";
import LanguageProvider from "@/providers/LanguageProvider";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  if (!locale) {
    notFound();
  }

  const dictionaries = await loadDictionaries(locale, [
    "common",
    "marketing",
    "platform",
    "legal",
    "cases",
  ]);

  return (
    <LanguageProvider initialLocale={locale} dictionaries={dictionaries}>
      {children}
    </LanguageProvider>
  );
}
