import test from 'node:test';
import assert from 'node:assert/strict';
import { getSiteOrigin } from '../../src/lib/site-origin.ts';
import { publicAlternates } from '../../src/lib/i18n/seo.ts';
import { SUPPORTED_LOCALES } from '../../src/lib/i18n/locales.ts';

test('getSiteOrigin: validates valid URLs and rejects invalid origins', () => {
  // HTTPS production URL
  const prod = getSiteOrigin('https://vertextarget.com');
  assert.ok(prod);
  assert.equal(prod.origin, 'https://vertextarget.com');

  // Localhost allowed
  const dev = getSiteOrigin('http://localhost:3004');
  assert.ok(dev);
  assert.equal(dev.origin, 'http://localhost:3004');

  // Invalid / malicious URLs rejected
  assert.equal(getSiteOrigin('javascript:alert(1)'), null);
  assert.equal(getSiteOrigin('not-a-url'), null);
  assert.equal(getSiteOrigin(''), null);
  assert.equal(getSiteOrigin(null), null);
});

test('publicAlternates: generates canonical and all 6 language alternates plus x-default', () => {
  const origin = new URL('https://vertextarget.com');
  const alternates = publicAlternates('/plataforma', origin, 'de');

  assert.equal(alternates.canonical, 'https://vertextarget.com/de/plataforma');
  assert.equal(alternates.languages['x-default'], 'https://vertextarget.com/en/plataforma');

  for (const locale of SUPPORTED_LOCALES) {
    assert.equal(
      alternates.languages[locale],
      `https://vertextarget.com/${locale}/plataforma`
    );
  }
});

test('publicAlternates: preserves case study slugs correctly', () => {
  const origin = new URL('https://vertextarget.com');
  const alternates = publicAlternates('/cases/elon-watches', origin, 'fr');

  assert.equal(alternates.canonical, 'https://vertextarget.com/fr/cases/elon-watches');
  assert.equal(alternates.languages['x-default'], 'https://vertextarget.com/en/cases/elon-watches');
  assert.equal(alternates.languages['pt-BR'], 'https://vertextarget.com/pt-BR/cases/elon-watches');
});
