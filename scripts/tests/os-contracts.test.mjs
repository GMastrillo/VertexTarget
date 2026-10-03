import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseSiteDocument,
  parseProjectBriefing,
  parseProspectInput,
} from '../../src/lib/os/validation.ts';
import { normalizeBrazilianPhone, isSafeHttpUrl } from '../../src/lib/os/contact.ts';
import { usagePeriod } from '../../src/lib/os/policy.ts';
import { parseInterestInput } from '../../src/lib/interests/validation.ts';
import { validBriefing, validDocument, validInterest, validProspect } from './os-fixtures.mjs';

test('parseSiteDocument accepts valid document fixture', () => {
  const result = parseSiteDocument(validDocument);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.businessName, validDocument.businessName);
    assert.equal(result.value.themeId, 'cyan-dark');
  }
});

test('parseSiteDocument rejects more than 6 services', () => {
  const overServices = {
    ...validDocument,
    services: [
      { title: 'S1', description: 'D1' },
      { title: 'S2', description: 'D2' },
      { title: 'S3', description: 'D3' },
      { title: 'S4', description: 'D4' },
      { title: 'S5', description: 'D5' },
      { title: 'S6', description: 'D6' },
      { title: 'S7', description: 'D7' },
    ],
  };
  const result = parseSiteDocument(overServices);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.reason, /serviço/i);
  }
});

test('parseSiteDocument rejects title exceeding 120 chars', () => {
  const longTitle = {
    ...validDocument,
    title: 'A'.repeat(121),
  };
  const result = parseSiteDocument(longTitle);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.reason, /título/i);
  }
});

test('parseSiteDocument rejects extra keys like ownerId or workspaceId', () => {
  const withInjectedKeys = {
    ...validDocument,
    ownerId: 'injected-user-id',
    workspaceId: 'injected-workspace-id',
  };
  const result = parseSiteDocument(withInjectedKeys);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.reason, /propriedade não permitida|extra/i);
  }
});

test('parseSiteDocument rejects unknown themeId or templateId', () => {
  const badTheme = { ...validDocument, themeId: 'neon-purple' };
  assert.equal(parseSiteDocument(badTheme).ok, false);

  const badTemplate = { ...validDocument, templateId: 'enterprise-saas' };
  assert.equal(parseSiteDocument(badTemplate).ok, false);
});

test('parseProjectBriefing validates correctly', () => {
  const result = parseProjectBriefing(validBriefing);
  assert.equal(result.ok, true);

  const invalidBriefing = { ...validBriefing, businessName: 'A' }; // min 2 chars
  assert.equal(parseProjectBriefing(invalidBriefing).ok, false);
});

test('normalizeBrazilianPhone formats standard BR numbers to E.164 with 55 prefix', () => {
  assert.equal(normalizeBrazilianPhone('(11) 99999-9999'), '5511999999999');
  assert.equal(normalizeBrazilianPhone('11999999999'), '5511999999999');
  assert.equal(normalizeBrazilianPhone('+55 (21) 98888-7777'), '5521988887777');
  assert.equal(normalizeBrazilianPhone('123'), null);
  assert.equal(normalizeBrazilianPhone(''), null);
});

test('isSafeHttpUrl rejects javascript:, data:, and control characters', () => {
  assert.equal(isSafeHttpUrl('javascript:alert(1)'), false);
  assert.equal(isSafeHttpUrl('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isSafeHttpUrl('https://exemplo.com.br\u0000/teste'), false);
  assert.equal(isSafeHttpUrl('https://studiovertex.com.br'), true);
  assert.equal(isSafeHttpUrl('http://meunegocio.com.br'), true);
});

test('usagePeriod computes period and renewsAt in UTC', () => {
  const date = new Date('2026-10-31T23:59:59Z');
  const period = usagePeriod(date);
  assert.equal(period.period, '2026-10');
  assert.equal(period.renewsAt, '2026-11-01T00:00:00.000Z');
});

test('parseProspectInput validates valid and invalid prospect input', () => {
  const okResult = parseProspectInput(validProspect);
  assert.equal(okResult.ok, true);

  const emptyName = { ...validProspect, name: '' };
  assert.equal(parseProspectInput(emptyName).ok, false);
});

test('parseInterestInput validates correct input and flags honeypot or bad emails', () => {
  const okResult = parseInterestInput(validInterest);
  assert.equal(okResult.ok, true);

  const botSubmission = { ...validInterest, honeypot: 'i-am-a-bot' };
  assert.equal(parseInterestInput(botSubmission).ok, false);

  const badEmail = { ...validInterest, email: 'not-an-email' };
  assert.equal(parseInterestInput(badEmail).ok, false);
});
