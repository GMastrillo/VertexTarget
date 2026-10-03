/**
 * Pure validation helper for hCaptcha siteverify responses.
 */

export interface CaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export function isValidCaptchaResponse(
  input: unknown,
  expectedHostname?: string | null
): boolean {
  if (!input || typeof input !== 'object') {
    return false;
  }

  const record = input as Record<string, unknown>;
  if (record.success !== true) {
    return false;
  }

  if (expectedHostname) {
    if (typeof record.hostname !== 'string' || record.hostname !== expectedHostname) {
      return false;
    }
  }

  return true;
}
