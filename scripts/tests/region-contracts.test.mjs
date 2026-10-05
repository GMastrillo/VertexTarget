import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeInternationalPhone,
  parseRegionalPreferences,
  isValidCountryCode,
  isValidTimeZone,
} from '../../src/lib/region/validation.ts';
import {
  COUNTRY_CODES,
  PRIORITY_COUNTRIES,
} from '../../src/lib/region/countries.ts';
import {
  formatCountryName,
  formatRegionalDate,
} from '../../src/lib/region/format.ts';
import {
  normalizeBrazilianPhone,
  contactHref,
} from '../../src/lib/os/contact.ts';

test('normalizeInternationalPhone formats valid E.164 phone numbers with + and digits', () => {
  assert.equal(normalizeInternationalPhone('+55 (11) 99999-9999'), '+5511999999999');
  assert.equal(normalizeInternationalPhone('+1 202-555-0123'), '+12025550123');
  assert.equal(normalizeInternationalPhone('+44 20 7946 0958'), '+442079460958');
  assert.equal(normalizeInternationalPhone('+33 1 42 68 53 00'), '+33142685300');
  assert.equal(normalizeInternationalPhone('+49 30 123456'), '+4930123456');
  assert.equal(normalizeInternationalPhone('+41 22 767 61 11'), '+41227676111');
});

test('normalizeInternationalPhone rejects national numbers without +, letters, extensions, controls or invalid length', () => {
  // Foreign or domestic national numbers without +
  assert.equal(normalizeInternationalPhone('2025550123'), null);
  assert.equal(normalizeInternationalPhone('11999999999'), null);
  // Leading zero after +
  assert.equal(normalizeInternationalPhone('+0123456789'), null);
  // Too short (< 2 digits after +)
  assert.equal(normalizeInternationalPhone('+1'), null);
  // Too long (> 15 digits after +)
  assert.equal(normalizeInternationalPhone('+1234567890123456'), null);
  // Letters or extensions
  assert.equal(normalizeInternationalPhone('+1 800-555-0199 ext 123'), null);
  assert.equal(normalizeInternationalPhone('+55 (11) 99999-ABCD'), null);
  // Null or empty
  assert.equal(normalizeInternationalPhone(''), null);
  assert.equal(normalizeInternationalPhone(null), null);
  // Control characters or injection
  assert.equal(normalizeInternationalPhone('+5511999999999\n'), null);
  assert.equal(normalizeInternationalPhone('+5511999999999\0'), null);
});

test('normalizeBrazilianPhone remains intact for legacy v1', () => {
  assert.equal(normalizeBrazilianPhone('11999999999'), '5511999999999');
  assert.equal(normalizeBrazilianPhone('(11) 99999-9999'), '5511999999999');
  assert.equal(normalizeBrazilianPhone('+55 11 99999-9999'), '5511999999999');
  assert.equal(normalizeBrazilianPhone('123'), null);
  assert.equal(normalizeBrazilianPhone(''), null);
});

test('contactHref supports legacy-br and e164 phone formats', () => {
  // Default is legacy-br
  assert.equal(contactHref({ whatsapp: '11999999999' }), 'https://wa.me/5511999999999');
  assert.equal(contactHref({ whatsapp: '11999999999', phoneFormat: 'legacy-br' }), 'https://wa.me/5511999999999');

  // e164 format removes + for wa.me target
  assert.equal(contactHref({ whatsapp: '+1 202-555-0123', phoneFormat: 'e164' }), 'https://wa.me/12025550123');
  assert.equal(contactHref({ whatsapp: '+44 20 7946 0958', phoneFormat: 'e164' }), 'https://wa.me/442079460958');
  assert.equal(contactHref({ whatsapp: '+55 11 99999-9999', phoneFormat: 'e164' }), 'https://wa.me/5511999999999');

  // e164 rejects invalid phones without +
  assert.equal(contactHref({ whatsapp: '2025550123', phoneFormat: 'e164' }), null);

  // Email fallback
  assert.equal(contactHref({ email: 'contato@vertex.com' }), 'mailto:contato@vertex.com');
  assert.equal(contactHref({ whatsapp: 'invalid', email: 'contato@vertex.com', phoneFormat: 'e164' }), 'mailto:contato@vertex.com');
});

test('parseRegionalPreferences validates independent valid combinations', () => {
  const result = parseRegionalPreferences({
    locale: 'de',
    country: 'BR',
    timeZone: 'America/New_York',
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.locale, 'de');
    assert.equal(result.value.country, 'BR');
    assert.equal(result.value.timeZone, 'America/New_York');
  }
});

test('parseRegionalPreferences accepts UTC as timezone', () => {
  const result = parseRegionalPreferences({
    locale: 'pt-BR',
    country: 'BR',
    timeZone: 'UTC',
  });
  assert.equal(result.ok, true);
});

test('parseRegionalPreferences rejects invalid fields with specific codes', () => {
  assert.deepEqual(
    parseRegionalPreferences({ locale: 'xx', country: 'BR', timeZone: 'UTC' }),
    { ok: false, code: 'locale' }
  );

  assert.deepEqual(
    parseRegionalPreferences({ locale: 'en', country: 'ZZ', timeZone: 'UTC' }),
    { ok: false, code: 'country' }
  );

  assert.deepEqual(
    parseRegionalPreferences({ locale: 'en', country: 'US', timeZone: 'Mars/Olympus' }),
    { ok: false, code: 'timeZone' }
  );

  assert.equal(parseRegionalPreferences(null).ok, false);
  assert.equal(parseRegionalPreferences('not-an-object').ok, false);
});

test('PRIORITY_COUNTRIES contains exactly the 21 specified countries and all belong to COUNTRY_CODES', () => {
  const expectedPriority = [
    'BR', 'US', 'CA', 'GB', 'MX', 'AR', 'CL', 'CO', 'PE', 'UY',
    'PT', 'ES', 'FR', 'DE', 'IT', 'AT', 'BE', 'NL', 'IE', 'LU', 'CH',
  ];
  assert.equal(PRIORITY_COUNTRIES.length, 21);
  assert.deepEqual([...PRIORITY_COUNTRIES], expectedPriority);

  for (const code of PRIORITY_COUNTRIES) {
    assert.equal(isValidCountryCode(code), true, `Country code ${code} must be valid`);
    assert.equal(COUNTRY_CODES.includes(code), true, `Country code ${code} must be in COUNTRY_CODES`);
  }
  assert.equal(isValidTimeZone('UTC'), true);
  assert.equal(isValidTimeZone('Invalid/TZ'), false);
});

test('formatCountryName renders localized country names', () => {
  const namePt = formatCountryName('BR', 'pt-BR');
  assert.equal(namePt, 'Brasil');

  const nameEn = formatCountryName('US', 'en');
  assert.equal(nameEn, 'United States');

  const nameDe = formatCountryName('DE', 'de');
  assert.equal(nameDe, 'Deutschland');
});

test('formatRegionalDate formats timestamp in the configured timezone', () => {
  const timestamp = '2026-11-01T04:30:00Z';
  const prefsNy = { locale: 'en', country: 'US', timeZone: 'America/New_York' };
  const prefsUtc = { locale: 'en', country: 'US', timeZone: 'UTC' };

  // In New York (EDT/EST, UTC-4), 04:30 UTC is 00:30 on Nov 1
  const nyFormatted = formatRegionalDate(timestamp, prefsNy);
  assert.match(nyFormatted, /Nov/);

  // In UTC, it's Nov 1 04:30
  const utcFormatted = formatRegionalDate(timestamp, prefsUtc);
  assert.match(utcFormatted, /Nov/);
});
