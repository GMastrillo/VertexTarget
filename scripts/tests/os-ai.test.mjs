import test from 'node:test';
import assert from 'node:assert/strict';

import { executeMetered } from '../../src/lib/os/ai-execution.ts';
import { validDocument } from './os-fixtures.mjs';

test('executeMetered in copy flow sends call only once and records tokens upon success', async () => {
  let markCalled = false;
  let sendCalled = 0;
  let completedRecord = null;

  const result = await executeMetered({
    reserve: async () => ({ operationId: 'op-copy-1', state: 'reserved', executor: true }),
    markSent: async (id) => {
      markCalled = true;
      assert.equal(id, 'op-copy-1');
      return true;
    },
    send: async () => {
      sendCalled++;
      return { value: { ...validDocument, title: 'Título Sugerido por IA' }, tokens: 450 };
    },
    complete: async (id, comp) => {
      completedRecord = { id, comp };
    },
    release: async () => {
      assert.fail('should not release completed operation');
    },
    now: () => 1000,
  });

  assert.equal(result.title, 'Título Sugerido por IA');
  assert.equal(markCalled, true);
  assert.equal(sendCalled, 1);
  assert.equal(completedRecord?.comp?.status, 'completed');
  assert.equal(completedRecord?.comp?.tokens, 450);
});

test('executeMetered in copy flow does NOT release quota if provider fails after markSent', async () => {
  let markCalled = false;
  let released = false;
  let completedFail = null;

  await assert.rejects(
    async () => {
      await executeMetered({
        reserve: async () => ({ operationId: 'op-copy-fail', state: 'reserved', executor: true }),
        markSent: async () => {
          markCalled = true;
          return true;
        },
        send: async () => {
          throw new Error('Gemini 429 Quota Exceeded or Timeout');
        },
        complete: async (id, comp) => {
          completedFail = { id, comp };
        },
        release: async () => {
          released = true;
        },
        now: () => 1000,
      });
    },
    /Gemini 429/
  );

  assert.equal(markCalled, true);
  assert.equal(released, false, 'sent quota must not be released back');
  assert.equal(completedFail?.comp?.status, 'failed');
  assert.equal(completedFail?.comp?.errorCode, 'Gemini 429 Quota Exceeded or Timeout');
});

test('executeMetered rejects non-executor call without executing send', async () => {
  let sendCalled = false;

  await assert.rejects(
    async () => {
      await executeMetered({
        reserve: async () => ({ operationId: 'op-dupe', state: 'reserved', executor: false }),
        markSent: async () => assert.fail('should not markSent'),
        send: async () => {
          sendCalled = true;
          return { value: validDocument, tokens: 0 };
        },
        complete: async () => {},
        release: async () => {},
        now: () => 1000,
      });
    },
    /processamento por outra requisição/
  );

  assert.equal(sendCalled, false);
});
