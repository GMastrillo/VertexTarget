import test from 'node:test';
import assert from 'node:assert/strict';

import { isValidCaptchaResponse } from '../../src/lib/captcha-validation.ts';

test('isValidCaptchaResponse validates true only when success is true and hostname matches', () => {
  const expectedHostname = 'vertextarget.com.br';

  const validResponse = {
    success: true,
    hostname: 'vertextarget.com.br',
    challenge_ts: '2026-10-02T12:00:00Z',
  };
  assert.equal(isValidCaptchaResponse(validResponse, expectedHostname), true);

  // Mismatched hostname
  const wrongHostResponse = {
    success: true,
    hostname: 'phishing-site.test',
  };
  assert.equal(isValidCaptchaResponse(wrongHostResponse, expectedHostname), false);

  // Failure response
  const failedResponse = {
    success: false,
    'error-codes': ['invalid-input-response'],
  };
  assert.equal(isValidCaptchaResponse(failedResponse, expectedHostname), false);

  // Null or invalid shape
  assert.equal(isValidCaptchaResponse(null, expectedHostname), false);
  assert.equal(isValidCaptchaResponse({}, expectedHostname), false);
});
