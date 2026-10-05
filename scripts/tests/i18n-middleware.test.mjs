import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveRequestLocale,
  resolveI18nRouting,
  COOKIE_LOCALE_NAME,
  HEADER_LOCALE_NAME,
} from '../../src/lib/i18n/request-context.ts';

test('resolveRequestLocale: path wins over cookie and header', () => {
  // 1. Path has 'de', cookie has 'fr', header has 'en' -> 'de'
  assert.equal(
    resolveRequestLocale({ pathLocale: 'de', cookieLocale: 'fr', headerLocale: 'en' }),
    'de'
  );

  // 2. Path has no locale, cookie has 'fr' -> 'fr'
  assert.equal(
    resolveRequestLocale({ pathLocale: null, cookieLocale: 'fr', headerLocale: 'en' }),
    'fr'
  );

  // 3. Path has no locale, cookie is invalid -> defaults to pt-BR
  assert.equal(
    resolveRequestLocale({ pathLocale: null, cookieLocale: 'invalid', headerLocale: null }),
    'pt-BR'
  );

  // 4. Legacy 'pt' maps to 'pt-BR'
  assert.equal(
    resolveRequestLocale({ pathLocale: null, cookieLocale: 'pt', headerLocale: null }),
    'pt-BR'
  );
});

test('resolveI18nRouting: public route redirects to localized 308, private routes do not redirect', () => {
  // Public root '/' -> 308 redirect to '/pt-BR' (or cookie locale)
  const rootDecision = resolveI18nRouting({
    pathname: '/',
    search: '?utm_source=test',
    cookieLocale: 'en',
  });
  assert.equal(rootDecision.type, 'redirect');
  assert.equal(rootDecision.statusCode, 308);
  assert.equal(rootDecision.destination, '/en?utm_source=test');

  // Public unlocalized '/plataforma' -> 308 redirect to '/en/plataforma'
  const plataformaDecision = resolveI18nRouting({
    pathname: '/plataforma',
    search: '',
    cookieLocale: 'en',
  });
  assert.equal(plataformaDecision.type, 'redirect');
  assert.equal(plataformaDecision.destination, '/en/plataforma');

  // Already localized public route '/de/plataforma' -> 'next', sets x-vt-locale to 'de'
  const localizedDecision = resolveI18nRouting({
    pathname: '/de/plataforma',
    search: '',
    cookieLocale: 'fr',
  });
  assert.equal(localizedDecision.type, 'next');
  assert.equal(localizedDecision.locale, 'de');

  // Private routes -> 'next', no redirect, sets x-vt-locale from cookie or default
  const osDecision = resolveI18nRouting({
    pathname: '/os/projetos',
    search: '',
    cookieLocale: 'fr',
  });
  assert.equal(osDecision.type, 'next');
  assert.equal(osDecision.locale, 'fr');

  const adminDecision = resolveI18nRouting({
    pathname: '/admin/financeiro',
    search: '',
    cookieLocale: 'de',
  });
  assert.equal(adminDecision.type, 'next');
  assert.equal(adminDecision.locale, 'de');
});

test('constants: header and cookie names', () => {
  assert.equal(COOKIE_LOCALE_NAME, 'vt-locale');
  assert.equal(HEADER_LOCALE_NAME, 'x-vt-locale');
});
