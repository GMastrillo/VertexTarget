import { normalizeLocale, DEFAULT_LOCALE, type Locale } from './locales.ts';
import type { DictionaryDomain, DomainDictionaryMap } from './types.ts';

const VALID_DOMAINS = new Set<DictionaryDomain>([
  'common',
  'marketing',
  'platform',
  'auth',
  'os',
  'admin',
  'legal',
  'cases',
]);

export async function loadDictionary<D extends DictionaryDomain>(
  localeInput: unknown,
  domain: D
): Promise<DomainDictionaryMap[D]> {
  const locale: Locale = normalizeLocale(localeInput) ?? DEFAULT_LOCALE;

  if (!VALID_DOMAINS.has(domain)) {
    throw new Error(`Invalid dictionary domain: ${String(domain)}`);
  }

  try {
    const mod = await import(`./messages/${locale}/${domain}.ts`);
    return mod.default as DomainDictionaryMap[D];
  } catch (error) {
    if (locale !== DEFAULT_LOCALE) {
      const fallbackMod = await import(`./messages/${DEFAULT_LOCALE}/${domain}.ts`);
      return fallbackMod.default as DomainDictionaryMap[D];
    }
    throw error;
  }
}

export async function loadDictionaries(
  localeInput: unknown,
  domains: readonly DictionaryDomain[]
): Promise<Partial<DomainDictionaryMap>> {
  const result: Partial<DomainDictionaryMap> = {};
  await Promise.all(
    domains.map(async (domain) => {
      const dict = await loadDictionary(localeInput, domain);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[domain] = dict;
    })
  );
  return result;
}
