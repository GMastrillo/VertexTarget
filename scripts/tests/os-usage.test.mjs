import test from 'node:test';
import assert from 'node:assert/strict';

import { executeMetered } from '../../src/lib/os/ai-execution.ts';

test('executeMetered successfully completes execution when executor is true and markSent succeeds', async () => {
  let marked = false;
  let sent = false;
  let completed = false;
  let released = false;

  const ports = {
    reserve: async () => ({
      operationId: 'op-1',
      state: 'reserved',
      executor: true,
    }),
    markSent: async (id) => {
      marked = id === 'op-1';
      return true;
    },
    send: async () => {
      sent = true;
      return { value: 'Generated copy output', tokens: 420 };
    },
    complete: async (id, result) => {
      completed = id === 'op-1' && result.status === 'completed' && result.tokens === 420;
    },
    release: async () => {
      released = true;
    },
    now: () => 1000,
  };

  const output = await executeMetered(ports);
  assert.equal(output, 'Generated copy output');
  assert.equal(marked, true, 'markSent should be called');
  assert.equal(sent, true, 'send should be called');
  assert.equal(completed, true, 'complete should be called with tokens');
  assert.equal(released, false, 'release should NOT be called on success');
});

test('executeMetered never calls send when executor is false', async () => {
  let sent = false;

  const ports = {
    reserve: async () => ({
      operationId: 'op-1',
      state: 'reserved',
      executor: false,
    }),
    markSent: async () => true,
    send: async () => {
      sent = true;
      return { value: 'fail', tokens: 0 };
    },
    complete: async () => {},
    release: async () => {},
    now: () => 1000,
  };

  await assert.rejects(
    async () => executeMetered(ports),
    (err) => {
      assert.equal(err.code, 'conflict');
      return true;
    }
  );

  assert.equal(sent, false, 'send must never be called when executor is false');
});

test('executeMetered marks failed on send error and does NOT release sent operation', async () => {
  let completedStatus = null;
  let released = false;

  const ports = {
    reserve: async () => ({
      operationId: 'op-1',
      state: 'reserved',
      executor: true,
    }),
    markSent: async () => true,
    send: async () => {
      throw new Error('API timeout');
    },
    complete: async (_id, result) => {
      completedStatus = result.status;
    },
    release: async () => {
      released = true;
    },
    now: () => 1000,
  };

  await assert.rejects(
    async () => executeMetered(ports),
    /API timeout/
  );

  assert.equal(completedStatus, 'failed', 'should record failed status in operation');
  assert.equal(released, false, 'must NOT release quota after operation was marked sent');
});

test('executeMetered releases unsent operation if error occurs before markSent', async () => {
  let releasedId = null;

  const ports = {
    reserve: async () => ({
      operationId: 'op-2',
      state: 'reserved',
      executor: true,
    }),
    markSent: async () => {
      throw new Error('DB lock acquisition error');
    },
    send: async () => ({ value: 'fail', tokens: 0 }),
    complete: async () => {},
    release: async (id) => {
      releasedId = id;
    },
    now: () => 1000,
  };

  await assert.rejects(
    async () => executeMetered(ports),
    /DB lock acquisition error/
  );

  assert.equal(releasedId, 'op-2', 'should release reservation if error occurred before send');
});
