import { SUPPORTED_LOCALES, type Locale } from './types.ts';

export { SUPPORTED_LOCALES, type Locale };

export const DEFAULT_LOCALE: Locale = 'pt-BR';

export const LOCALE_LABELS: Record<Locale, string> = {
  'pt-BR': 'Português (Brasil)',
  en: 'English (Global)',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  'pt-BR': '🇧🇷',
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
};

export function normalizeLocale(input: unknown): Locale | null {
  if (typeof input !== 'string') {
    return null;
  }
  const clean = input.trim();
  if (clean === 'pt' || clean === 'pt-BR' || clean === 'pt_BR') {
    return 'pt-BR';
  }
  if ((SUPPORTED_LOCALES as readonly string[]).includes(clean)) {
    return clean as Locale;
  }
  return null;
}

export function resolveLocale(input: unknown): Locale {
  return normalizeLocale(input) ?? DEFAULT_LOCALE;
}
