import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUPPORTED_LOCALES,
  normalizeLocale,
  resolveLocale,
  DEFAULT_LOCALE,
} from '../../src/lib/i18n/locales.ts';
import {
  localizedPath,
  switchLocaleHref,
  isPublicLocalizedPath,
  extractLocaleFromPath,
} from '../../src/lib/i18n/routing.ts';

test('normalizeLocale: maps legacy pt to pt-BR and validates supported codes', () => {
  assert.equal(normalizeLocale('pt'), 'pt-BR');
  assert.equal(normalizeLocale('pt-BR'), 'pt-BR');
  assert.equal(normalizeLocale('en'), 'en');
  assert.equal(normalizeLocale('es'), 'es');
  assert.equal(normalizeLocale('fr'), 'fr');
  assert.equal(normalizeLocale('de'), 'de');
  assert.equal(normalizeLocale('it'), 'it');

  assert.equal(normalizeLocale('xx'), null);
  assert.equal(normalizeLocale(''), null);
  assert.equal(normalizeLocale(null), null);
  assert.equal(normalizeLocale(undefined), null);
  assert.equal(normalizeLocale(123), null);
  assert.equal(normalizeLocale({}), null);
});

test('resolveLocale: defaults to pt-BR on invalid input', () => {
  assert.equal(resolveLocale('en'), 'en');
  assert.equal(resolveLocale('pt'), 'pt-BR');
  assert.equal(resolveLocale('invalid'), 'pt-BR');
  assert.equal(resolveLocale(null), 'pt-BR');
  assert.equal(DEFAULT_LOCALE, 'pt-BR');
  assert.deepEqual(SUPPORTED_LOCALES, ['pt-BR', 'en', 'es', 'fr', 'de', 'it']);
});

test('localizedPath: only handles approved public routes and rejects private routes', () => {
  assert.equal(localizedPath('/', 'en'), '/en');
  assert.equal(localizedPath('/plataforma', 'de'), '/de/plataforma');
  assert.equal(localizedPath('/cases', 'fr'), '/fr/cases');
  assert.equal(localizedPath('/cases/elon-watches', 'es'), '/es/cases/elon-watches');
  assert.equal(localizedPath('/privacidade', 'it'), '/it/privacidade');
  assert.equal(localizedPath('/termos', 'en'), '/en/termos');

  // Private routes return null
  assert.equal(localizedPath('/os', 'de'), null);
  assert.equal(localizedPath('/os/workspace', 'de'), null);
  assert.equal(localizedPath('/admin', 'de'), null);
  assert.equal(localizedPath('/admin/comercial', 'de'), null);
  assert.equal(localizedPath('/login', 'de'), null);
  assert.equal(localizedPath('/api/os/ai', 'de'), null);
  assert.equal(localizedPath('/auth/callback', 'de'), null);
  assert.equal(localizedPath('/sites/meu-slug', 'de'), null);
});

test('switchLocaleHref: safely switches locale, preserves hash and allowed query params', () => {
  assert.equal(
    switchLocaleHref('/fr/cases/case-real?utm_campaign=x#resultado', 'de'),
    '/de/cases/case-real?utm_campaign=x#resultado'
  );

  assert.equal(
    switchLocaleHref('/plataforma?utm_source=google&gclid=123&disallowed=bad', 'en'),
    '/en/plataforma?utm_source=google&gclid=123'
  );

  assert.equal(
    switchLocaleHref('/es#faq', 'pt-BR'),
    '/pt-BR#faq'
  );

  // Security checks: external URLs, javascript, double-slash protocol-relative
  assert.equal(switchLocaleHref('//evil.example', 'en'), null);
  assert.equal(switchLocaleHref('https://evil.example/plataforma', 'en'), null);
  assert.equal(switchLocaleHref('javascript:alert(1)', 'en'), null);
  assert.equal(switchLocaleHref('/os/prospects', 'en'), null);
  assert.equal(switchLocaleHref('/admin/financeiro', 'en'), null);
});

test('extractLocaleFromPath and isPublicLocalizedPath', () => {
  assert.deepEqual(extractLocaleFromPath('/de/plataforma'), { locale: 'de', cleanPath: '/plataforma' });
  assert.deepEqual(extractLocaleFromPath('/pt-BR/cases/elon'), { locale: 'pt-BR', cleanPath: '/cases/elon' });
  assert.deepEqual(extractLocaleFromPath('/en'), { locale: 'en', cleanPath: '/' });
  assert.deepEqual(extractLocaleFromPath('/os/entrar'), { locale: null, cleanPath: '/os/entrar' });
  assert.deepEqual(extractLocaleFromPath('/plataforma'), { locale: null, cleanPath: '/plataforma' });

  assert.equal(isPublicLocalizedPath('/en/plataforma'), true);
  assert.equal(isPublicLocalizedPath('/xx/plataforma'), false);
  assert.equal(isPublicLocalizedPath('/en/os'), false);
});
