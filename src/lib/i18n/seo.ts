import { SUPPORTED_LOCALES, type Locale } from './locales.ts';
import { extractLocaleFromPath } from './routing.ts';

export interface PublicAlternatesResult {
  canonical: string;
  languages: Record<Locale | 'x-default', string>;
}

export function publicAlternates(
  rawPathname: string,
  origin: URL,
  activeLocale: Locale
): PublicAlternatesResult {
  const { cleanPath } = extractLocaleFromPath(rawPathname);
  const normalizedPath = cleanPath === '/' ? '' : cleanPath;
  const baseUrl = origin.origin;

  const languages = {} as Record<Locale | 'x-default', string>;

  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = `${baseUrl}/${locale}${normalizedPath}`;
  }

  // x-default points to global English
  languages['x-default'] = `${baseUrl}/en${normalizedPath}`;

  const canonical = `${baseUrl}/${activeLocale}${normalizedPath}`;

  return {
    canonical,
    languages,
  };
}
