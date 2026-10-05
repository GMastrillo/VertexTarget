import test from 'node:test';
import assert from 'node:assert/strict';

import { parseSiteDocument } from '../../src/lib/os/document-validation.ts';
import { getDocumentRegion, upgradeDocument } from '../../src/lib/os/document-version.ts';
import { publicDocument } from '../../src/lib/os/publication-utils.ts';
import { validDocument } from './os-fixtures.mjs';

const validDocumentV1 = {
  ...validDocument,
  schemaVersion: 1,
};

const validDocumentV2 = {
  ...validDocument,
  schemaVersion: 2,
  locale: 'en',
  country: 'US',
  timeZone: 'America/New_York',
  whatsapp: '+1 202-555-0123',
};

test('v1_roundtrip: parseSiteDocument accepts and preserves v1 documents', () => {
  const result = parseSiteDocument(validDocumentV1);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.schemaVersion, 1);
    assert.equal(result.value.businessName, validDocumentV1.businessName);
    const region = getDocumentRegion(result.value);
    assert.deepEqual(region, { locale: 'pt-BR', country: 'BR', timeZone: 'UTC' });
  }
});

test('v2_international: parseSiteDocument accepts valid v2 documents with international phones', () => {
  const result = parseSiteDocument(validDocumentV2);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.schemaVersion, 2);
    if (result.value.schemaVersion === 2) {
      assert.equal(result.value.locale, 'en');
      assert.equal(result.value.country, 'US');
      assert.equal(result.value.timeZone, 'America/New_York');
      assert.equal(result.value.whatsapp, '+12025550123');
      const region = getDocumentRegion(result.value);
      assert.deepEqual(region, { locale: 'en', country: 'US', timeZone: 'America/New_York' });
    }
  }
});

test('foreign_national_rejected: v2 rejects foreign or domestic national numbers without +', () => {
  const badPhoneV2 = {
    ...validDocumentV2,
    whatsapp: '2025550123',
  };
  const result = parseSiteDocument(badPhoneV2);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.reason, /whatsapp|telefone/i);
  }
});

test('unknown_version: parseSiteDocument rejects unknown schema versions', () => {
  const badVersion = {
    ...validDocumentV1,
    schemaVersion: 3,
  };
  const result = parseSiteDocument(badVersion);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.reason, /schemaversion/i);
  }
});

test('extra_private_keys: parseSiteDocument rejects injected internal keys in v1 and v2', () => {
  const injectedV1 = {
    ...validDocumentV1,
    ownerId: 'injected-user',
    workspaceId: 'injected-ws',
  };
  assert.equal(parseSiteDocument(injectedV1).ok, false);

  const injectedV2 = {
    ...validDocumentV2,
    ownerId: 'injected-user',
    internalSecret: 'secret',
  };
  assert.equal(parseSiteDocument(injectedV2).ok, false);
});

test('upgradeDocument converts v1 to v2 with regional preferences and canonical E.164 phone', () => {
  const prefs = {
    locale: 'de',
    country: 'DE',
    timeZone: 'Europe/Berlin',
  };
  const upgraded = upgradeDocument(validDocumentV1, prefs);
  assert.equal(upgraded.schemaVersion, 2);
  assert.equal(upgraded.locale, 'de');
  assert.equal(upgraded.country, 'DE');
  assert.equal(upgraded.timeZone, 'Europe/Berlin');
  assert.equal(upgraded.whatsapp.startsWith('+55'), true);

  // Upgraded document passes v2 validation
  const validationResult = parseSiteDocument(upgraded);
  assert.equal(validationResult.ok, true);
});

test('publicDocument preserves version, region and never leaks private internal fields', () => {
  const pubV1 = publicDocument(validDocumentV1);
  assert.equal(pubV1.schemaVersion, 1);
  assert.equal('ownerId' in pubV1, false);

  const pubV2 = publicDocument(validDocumentV2);
  assert.equal(pubV2.schemaVersion, 2);
  if (pubV2.schemaVersion === 2) {
    assert.equal(pubV2.locale, 'en');
    assert.equal(pubV2.country, 'US');
    assert.equal(pubV2.timeZone, 'America/New_York');
  }
  assert.equal('workspaceId' in pubV2, false);
});
