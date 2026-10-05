import test from 'node:test';
import assert from 'node:assert/strict';
import { SUPPORTED_LOCALES } from '../../src/lib/i18n/locales.ts';
import { loadDictionary, loadDictionaries } from '../../src/lib/i18n/load-dictionary.ts';

const DOMAINS = [
  'common',
  'marketing',
  'platform',
  'auth',
  'os',
  'admin',
  'legal',
  'cases',
];

function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(flattenKeys(value, fullKey));
    } else {
      keys.push({ key: fullKey, type: typeof value, isArray: Array.isArray(value) });
    }
  }
  return keys.sort((a, b) => a.key.localeCompare(b.key));
}

test('six_locale_key_parity: all 6 locales have identical structure and non-empty strings across all domains', async () => {
  for (const domain of DOMAINS) {
    const referenceDict = await loadDictionary('pt-BR', domain);
    const referenceKeys = flattenKeys(referenceDict);

    assert.ok(referenceKeys.length > 0, `Domain ${domain} should have keys`);

    for (const locale of SUPPORTED_LOCALES) {
      const dict = await loadDictionary(locale, domain);
      const currentKeys = flattenKeys(dict);

      assert.deepEqual(
        currentKeys.map(k => k.key),
        referenceKeys.map(k => k.key),
        `Domain ${domain} keys mismatch for locale ${locale}`
      );

      // Verify no empty strings
      for (const { key } of referenceKeys) {
        const parts = key.split('.');
        let cur = dict;
        for (const p of parts) {
          cur = cur[p];
        }
        assert.ok(
          typeof cur === 'string' ? cur.trim().length > 0 : true,
          `Key ${key} in ${domain} (${locale}) must not be an empty string`
        );
      }
    }
  }
});

test('loadDictionaries: loads multiple domains concurrently', async () => {
  const result = await loadDictionaries('en', ['common', 'marketing']);
  assert.ok(result.common);
  assert.ok(result.marketing);
  assert.equal(result.common.brand, 'VertexTarget');
});
