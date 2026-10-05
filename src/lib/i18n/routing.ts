import { normalizeLocale, type Locale } from './locales.ts';

export type { Locale };

const ALLOWED_QUERY_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
]);

const PUBLIC_BASE_ROUTES = [
  '/',
  '/plataforma',
  '/cases',
  '/privacidade',
  '/termos',
] as const;

export function isPublicPath(cleanPath: string): boolean {
  if (cleanPath === '' || cleanPath === '/') {
    return true;
  }
  if (PUBLIC_BASE_ROUTES.some((route) => route !== '/' && cleanPath === route)) {
    return true;
  }
  if (cleanPath.startsWith('/cases/')) {
    const slug = cleanPath.slice('/cases/'.length);
    return slug.length > 0 && !slug.includes('/');
  }
  return false;
}

export function extractLocaleFromPath(pathname: string): {
  locale: Locale | null;
  cleanPath: string;
} {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return { locale: null, cleanPath: '/' };
  }

  const potentialLocale = normalizeLocale(segments[0]);
  if (potentialLocale) {
    const rest = segments.slice(1);
    const cleanPath = rest.length > 0 ? `/${rest.join('/')}` : '/';
    return { locale: potentialLocale, cleanPath };
  }

  return { locale: null, cleanPath: pathname.startsWith('/') ? pathname : `/${pathname}` };
}

export function isPublicLocalizedPath(pathname: string): boolean {
  const { locale, cleanPath } = extractLocaleFromPath(pathname);
  if (!locale) {
    return false;
  }
  return isPublicPath(cleanPath);
}

export function localizedPath(pathname: string, locale: Locale): string | null {
  const { cleanPath } = extractLocaleFromPath(pathname);
  if (!isPublicPath(cleanPath)) {
    return null;
  }
  return cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`;
}

function parseRelativePath(href: string): { rawPath: string; remainder: string } | null {
  if (typeof href !== 'string') {
    return null;
  }
  const trimmed = href.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return null;
  }
  const qIdx = trimmed.indexOf('?');
  const hIdx = trimmed.indexOf('#');
  const pathEnd = Math.min(
    qIdx !== -1 ? qIdx : trimmed.length,
    hIdx !== -1 ? hIdx : trimmed.length
  );
  const colonIndex = trimmed.indexOf(':');
  if (colonIndex !== -1 && colonIndex < pathEnd) {
    return null;
  }
  return {
    rawPath: trimmed.slice(0, pathEnd),
    remainder: trimmed.slice(pathEnd),
  };
}

function filterAllowedQueryParams(remainder: string): string {
  const qIdx = remainder.indexOf('?');
  if (qIdx === -1) {
    return '';
  }
  const hIdx = remainder.indexOf('#');
  const queryPart = hIdx !== -1 && hIdx > qIdx
    ? remainder.slice(qIdx + 1, hIdx)
    : remainder.slice(qIdx + 1);

  const searchParams = new URLSearchParams(queryPart);
  const filtered = new URLSearchParams();
  for (const [key, val] of searchParams.entries()) {
    if (ALLOWED_QUERY_PARAMS.has(key)) {
      filtered.append(key, val);
    }
  }
  const str = filtered.toString();
  return str ? `?${str}` : '';
}

function extractHash(remainder: string): string {
  const hIdx = remainder.indexOf('#');
  return hIdx !== -1 ? remainder.slice(hIdx) : '';
}

export function switchLocaleHref(href: string, targetLocale: Locale): string | null {
  const parsed = parseRelativePath(href);
  if (!parsed) {
    return null;
  }

  const { cleanPath } = extractLocaleFromPath(parsed.rawPath);
  if (!isPublicPath(cleanPath)) {
    return null;
  }

  const newBasePath = localizedPath(cleanPath, targetLocale);
  if (!newBasePath) {
    return null;
  }

  const query = filterAllowedQueryParams(parsed.remainder);
  const hash = extractHash(parsed.remainder);
  return `${newBasePath}${query}${hash}`;
}
