import { OsError } from '../os/errors.ts';
import type { InterestInput } from './types.ts';

export interface InterestPorts {
  reserve: () => Promise<'new' | 'replay'>;
  verify: () => Promise<boolean>;
  save: () => Promise<void>;
}

/**
 * Pure control flow for public interest submission.
 * - Idempotency replay returns early without consuming a captcha token.
 * - New submissions verify the captcha challenge before saving.
 * - Any database or network error fails explicitly without claiming false success.
 */
export async function executeInterest(
  _input: InterestInput,
  ports: InterestPorts
): Promise<void> {
  const status = await ports.reserve();

  if (status === 'replay') {
    return;
  }

  const verified = await ports.verify();
  if (!verified) {
    throw new OsError('invalid', 'Verificação de segurança falhou.');
  }

  await ports.save();
}
