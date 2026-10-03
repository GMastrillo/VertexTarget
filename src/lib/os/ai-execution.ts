import { OsError } from './errors.ts';
import type { UsageReservation, OperationCompletion } from './types.ts';

export interface MeteredPorts<T> {
  reserve: () => Promise<UsageReservation>;
  markSent: (id: string) => Promise<boolean>;
  send: () => Promise<{ value: T; tokens: number }>;
  complete: (id: string, result: OperationCompletion) => Promise<void>;
  release: (id: string) => Promise<void>;
  now: () => number;
}

async function sendAndRecord<T>(
  ports: MeteredPorts<T>,
  opId: string
): Promise<T> {
  const start = ports.now();

  try {
    const result = await ports.send();
    const latencyMs = Math.max(0, ports.now() - start);

    await ports.complete(opId, {
      status: 'completed',
      tokens: result.tokens,
      latencyMs,
      errorCode: null,
    });

    return result.value;
  } catch (err: unknown) {
    const latencyMs = Math.max(0, ports.now() - start);
    const code = err instanceof Error ? err.message.slice(0, 50) : 'send-failed';

    await ports.complete(opId, {
      status: 'failed',
      tokens: 0,
      latencyMs,
      errorCode: code,
    }).catch(() => {});

    throw err;
  }
}

/**
 * Pure control flow for metered operations (AI text assistance & grounded search).
 * Enforces atomic quotas:
 * - Only the elected executor proceeds to send.
 * - CAS ensures send is called only once per reservation.
 * - Quota sent is non-refundable on timeout/network crash (preventing cost bleeding).
 * - Unsent reservations before send are cleanly released back to the user.
 */
export async function executeMetered<T>(ports: MeteredPorts<T>): Promise<T> {
  const reservation = await ports.reserve();

  if (!reservation.executor) {
    const msg = reservation.state === 'completed'
      ? 'Operação já finalizada anteriormente.'
      : 'Operação já em processamento por outra requisição.';
    throw new OsError('conflict', msg);
  }

  const opId = reservation.operationId;
  let sentMarked = false;

  try {
    const marked = await ports.markSent(opId);
    if (!marked) {
      throw new OsError('conflict', 'Operação já enviada por outra instância.');
    }
    sentMarked = true;
  } catch (err: unknown) {
    if (!sentMarked) {
      await ports.release(opId).catch(() => {});
    }
    throw err;
  }

  return sendAndRecord(ports, opId);
}
