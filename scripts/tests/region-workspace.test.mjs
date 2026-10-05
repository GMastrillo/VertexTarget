import test from 'node:test';
import assert from 'node:assert/strict';

import { parseWorkspaceInput } from '../../src/lib/os/workspace-validation.ts';

test('parseWorkspaceInput accepts valid create input with or without regionalPreferences', () => {
  const minimal = {
    name: 'Vertex Studio',
    journey: 'business',
    termsAccepted: true,
    noticeVersion: '2026-10-01',
  };
  const minResult = parseWorkspaceInput(minimal, 'create');
  assert.equal(minResult.ok, true);
  if (minResult.ok) {
    assert.equal(minResult.value.name, 'Vertex Studio');
    assert.equal(minResult.value.journey, 'business');
    assert.equal(minResult.value.termsAccepted, true);
    assert.equal(minResult.value.noticeVersion, '2026-10-01');
  }

  const withRegion = {
    ...minimal,
    regionalPreferences: {
      locale: 'de',
      country: 'DE',
      timeZone: 'Europe/Berlin',
    },
  };
  const regResult = parseWorkspaceInput(withRegion, 'create');
  assert.equal(regResult.ok, true);
  if (regResult.ok) {
    assert.equal(regResult.value.regionalPreferences?.locale, 'de');
    assert.equal(regResult.value.regionalPreferences?.country, 'DE');
    assert.equal(regResult.value.regionalPreferences?.timeZone, 'Europe/Berlin');
  }
});

test('parseWorkspaceInput in create mode requires terms and noticeVersion', () => {
  const missingTerms = {
    name: 'Studio',
    journey: 'professional',
    noticeVersion: '2026-10-01',
  };
  assert.deepEqual(parseWorkspaceInput(missingTerms, 'create'), { ok: false, code: 'terms' });

  const missingNotice = {
    name: 'Studio',
    journey: 'professional',
    termsAccepted: true,
  };
  assert.deepEqual(parseWorkspaceInput(missingNotice, 'create'), { ok: false, code: 'terms' });
});

test('parseWorkspaceInput rejects invalid name and journey', () => {
  const shortName = {
    name: 'A',
    journey: 'business',
    termsAccepted: true,
    noticeVersion: '2026-10-01',
  };
  assert.deepEqual(parseWorkspaceInput(shortName, 'create'), { ok: false, code: 'name' });

  const badJourney = {
    name: 'Valid Name',
    journey: 'enterprise',
    termsAccepted: true,
    noticeVersion: '2026-10-01',
  };
  assert.deepEqual(parseWorkspaceInput(badJourney, 'create'), { ok: false, code: 'journey' });
});

test('parseWorkspaceInput rejects invalid regionalPreferences', () => {
  const badRegion = {
    name: 'Valid Name',
    journey: 'business',
    termsAccepted: true,
    noticeVersion: '2026-10-01',
    regionalPreferences: {
      locale: 'invalid-locale',
      country: 'BR',
      timeZone: 'UTC',
    },
  };
  assert.deepEqual(parseWorkspaceInput(badRegion, 'create'), { ok: false, code: 'region' });
});

test('parseWorkspaceInput rejects injected extra keys like ownerId, plan, status', () => {
  const injected = {
    name: 'Valid Name',
    journey: 'business',
    termsAccepted: true,
    noticeVersion: '2026-10-01',
    ownerId: 'injected-user',
    plan: 'enterprise',
    status: 'active',
  };
  assert.deepEqual(parseWorkspaceInput(injected, 'create'), { ok: false, code: 'extra_keys' });
});

test('parseWorkspaceInput validates update mode correctly', () => {
  const validUpdate = {
    name: 'Updated Name',
    journey: 'professional',
    regionalPreferences: {
      locale: 'fr',
      country: 'FR',
      timeZone: 'Europe/Paris',
    },
  };
  const result = parseWorkspaceInput(validUpdate, 'update');
  assert.equal(result.ok, true);

  // Update mode must not accept create-only fields or injected keys
  const updateWithTerms = {
    ...validUpdate,
    termsAccepted: true,
  };
  assert.deepEqual(parseWorkspaceInput(updateWithTerms, 'update'), { ok: false, code: 'extra_keys' });
});
