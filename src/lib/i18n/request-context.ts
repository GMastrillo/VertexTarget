import { normalizeLocale, resolveLocale, type Locale } from './locales.ts';
import { extractLocaleFromPath, isPublicPath, localizedPath } from './routing.ts';

export const COOKIE_LOCALE_NAME = 'vt-locale';
export const HEADER_LOCALE_NAME = 'x-vt-locale';
export const HEADER_SITE_SLUG_NAME = 'x-vt-site-slug';

export interface RequestLocaleInputs {
  pathLocale?: unknown;
  cookieLocale?: unknown;
  headerLocale?: unknown;
}

export function resolveRequestLocale(inputs: RequestLocaleInputs): Locale {
  const fromPath = normalizeLocale(inputs.pathLocale);
  if (fromPath) {
    return fromPath;
  }

  const fromCookie = normalizeLocale(inputs.cookieLocale);
  if (fromCookie) {
    return fromCookie;
  }

  return resolveLocale(inputs.headerLocale);
}

export interface RoutingDecisionNext {
  type: 'next';
  locale: Locale;
}

export interface RoutingDecisionRedirect {
  type: 'redirect';
  destination: string;
  statusCode: 308;
  locale: Locale;
}

export type RoutingDecision = RoutingDecisionNext | RoutingDecisionRedirect;

export function resolveI18nRouting(options: {
  pathname: string;
  search?: string;
  cookieLocale?: unknown;
}): RoutingDecision {
  const { pathname, search = '', cookieLocale } = options;
  const { locale: pathLocale, cleanPath } = extractLocaleFromPath(pathname);

  const effectiveLocale = resolveRequestLocale({
    pathLocale,
    cookieLocale,
  });

  // If path already has a valid locale prefix and points to a public path
  if (pathLocale && isPublicPath(cleanPath)) {
    return {
      type: 'next',
      locale: pathLocale,
    };
  }

  // If path is a public route WITHOUT locale prefix (e.g. '/' or '/plataforma')
  if (!pathLocale && isPublicPath(pathname)) {
    const targetLocalizedPath = localizedPath(pathname, effectiveLocale);
    if (targetLocalizedPath) {
      return {
        type: 'redirect',
        destination: `${targetLocalizedPath}${search}`,
        statusCode: 308,
        locale: effectiveLocale,
      };
    }
  }

  // Otherwise (private routes like /os, /admin, /api, /login, /sites), keep path as-is
  return {
    type: 'next',
    locale: effectiveLocale,
  };
}

/**
 * Server-only helper to read the resolved locale from request headers in App Router
 */
export async function getRequestLocale(): Promise<Locale> {
  try {
    const { headers } = await import('next/headers');
    const headerList = await headers();

    const siteSlug = headerList.get(HEADER_SITE_SLUG_NAME);
    if (siteSlug && /^[a-z0-9-]+$/i.test(siteSlug)) {
      try {
        const { getPublishedSite } = await import('../os/publication-repository.ts');
        const { getDocumentRegion } = await import('../os/document-version.ts');
        const site = await getPublishedSite(siteSlug);
        if (site?.document) {
          const region = getDocumentRegion(site.document);
          return region.locale;
        }
      } catch {
        // Fallback to headers if repository fails
      }
    }

    const headerValue = headerList.get(HEADER_LOCALE_NAME);
    return resolveLocale(headerValue);
  } catch {
    return resolveLocale(null);
  }
}
