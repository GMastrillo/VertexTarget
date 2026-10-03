import test from 'node:test';
import assert from 'node:assert/strict';

import { readLimitedJson, requireCanonicalOrigin } from '../../src/lib/os/http.ts';
import { OsError } from '../../src/lib/os/errors.ts';

test('readLimitedJson parses valid payload within limit', async () => {
  const payload = { test: 'hello world' };
  const req = new Request('https://vertex.test/api', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const parsed = await readLimitedJson(req, 8192);
  assert.deepEqual(parsed, payload);
});

test('readLimitedJson aborts stream exceeding byte limit before accumulating', async () => {
  const hugeString = 'X'.repeat(8193);
  const payload = { data: hugeString };
  const req = new Request('https://vertex.test/api', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  await assert.rejects(
    async () => {
      await readLimitedJson(req, 8192);
    },
    (err) => {
      assert.ok(err instanceof OsError);
      assert.equal(err.code, 'too-large');
      assert.equal(err.status, 413);
      return true;
    }
  );
});

test('readLimitedJson rejects deceptive Content-Length header exceeding limit immediately', async () => {
  const req = new Request('https://vertex.test/api', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'content-length': '99999',
    },
    body: JSON.stringify({ a: 1 }),
  });

  await assert.rejects(
    async () => {
      await readLimitedJson(req, 8192);
    },
    (err) => {
      assert.ok(err instanceof OsError);
      assert.equal(err.code, 'too-large');
      assert.equal(err.status, 413);
      return true;
    }
  );
});

test('requireCanonicalOrigin validates matching origin and rejects external or forged origin', () => {
  const appUrl = 'https://vertex.test';

  // Matching origin
  const validReq = new Request('https://vertex.test/api', {
    method: 'POST',
    headers: { origin: 'https://vertex.test' },
  });
  assert.doesNotThrow(() => {
    requireCanonicalOrigin(validReq, appUrl);
  });

  // Mismatched origin
  const evilReq = new Request('https://vertex.test/api', {
    method: 'POST',
    headers: { origin: 'https://evil-phishing.com' },
  });
  assert.throws(
    () => {
      requireCanonicalOrigin(evilReq, appUrl);
    },
    (err) => {
      assert.ok(err instanceof OsError);
      assert.equal(err.code, 'forbidden');
      assert.equal(err.status, 403);
      return true;
    }
  );
});
