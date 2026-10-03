import test from 'node:test';
import assert from 'node:assert/strict';

import { documentFromBriefing, parseSiteDocument } from '../../src/lib/os/validation.ts';
import { validBriefing } from './os-fixtures.mjs';

test('documentFromBriefing converts valid briefing into valid SiteDocument without invented metrics', () => {
  const doc = documentFromBriefing(validBriefing);

  // Validate that document complies strictly with SiteDocument contract
  const parseResult = parseSiteDocument(doc);
  assert.equal(parseResult.ok, true, `document must be valid SiteDocument: ${parseResult.reason || ''}`);

  // Assert essential fields
  assert.equal(doc.businessName, validBriefing.businessName);
  assert.equal(doc.templateId, validBriefing.templateId);
  assert.equal(doc.services.length, validBriefing.services.length);
  assert.equal(doc.email, validBriefing.email);

  // No hallucinated testimonials, fake metrics, or unverified claims
  assert.equal('testimonials' in doc, false);
  assert.equal('rating' in doc, false);
  assert.equal('metrics' in doc, false);
});
