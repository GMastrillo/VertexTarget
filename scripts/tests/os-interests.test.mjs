import test from 'node:test';
import assert from 'node:assert/strict';

import { executeInterest } from '../../src/lib/interests/execution.ts';
import { hashIdentifier } from '../../src/lib/interests/rate-limit.ts';
import { validInterest } from './os-fixtures.mjs';

test('executeInterest executes verify and save for new interest', async () => {
  let verified = false;
  let saved = false;

  const ports = {
    reserve: async () => 'new',
    verify: async () => {
      verified = true;
      return true;
    },
    save: async () => {
      saved = true;
    },
  };

  await executeInterest(validInterest, ports);
  assert.equal(verified, true, 'captcha should be verified');
  assert.equal(saved, true, 'record should be saved');
});

test('executeInterest short-circuits on replay without re-verifying captcha or saving', async () => {
  let verified = false;
  let saved = false;

  const ports = {
    reserve: async () => 'replay',
    verify: async () => {
      verified = true;
      return true;
    },
    save: async () => {
      saved = true;
    },
  };

  await executeInterest(validInterest, ports);
  assert.equal(verified, false, 'should not verify captcha on replay');
  assert.equal(saved, false, 'should not re-save on replay');
});

test('executeInterest rejects when captcha verification fails', async () => {
  let saved = false;

  const ports = {
    reserve: async () => 'new',
    verify: async () => false,
    save: async () => {
      saved = true;
    },
  };

  await assert.rejects(
    async () => executeInterest(validInterest, ports),
    (err) => {
      assert.equal(err.code, 'invalid');
      assert.equal(err.status, 400);
      return true;
    }
  );
  assert.equal(saved, false, 'should not save if captcha fails');
});

test('executeInterest propagates save failure without faking success', async () => {
  const ports = {
    reserve: async () => 'new',
    verify: async () => true,
    save: async () => {
      throw new Error('DB connection failed');
    },
  };

  await assert.rejects(
    async () => executeInterest(validInterest, ports),
    /DB connection failed/
  );
});

test('hashIdentifier produces stable HMAC-SHA256 hex hashes and isolates secrets', () => {
  const secret = 'super-secret-request-salt-2026';
  const h1 = hashIdentifier('192.168.1.1', secret);
  const h2 = hashIdentifier('192.168.1.1', secret);
  const h3 = hashIdentifier('192.168.1.2', secret);

  assert.equal(h1, h2, 'same input should produce identical hash');
  assert.notEqual(h1, h3, 'different input should produce different hash');
  assert.equal(h1.length, 64, 'sha256 hex is 64 characters');
});
