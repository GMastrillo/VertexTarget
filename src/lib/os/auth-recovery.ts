import { createHmac } from 'node:crypto';
import { getOsConfig } from './config.ts';

export const RECOVERY_COOKIE_NAME = 'vt_recovery_proof';
export const RECOVERY_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function createRecoveryProof(userId: string, email: string): string {
  const config = getOsConfig();
  const secret = config.authRecoverySecret || 'vt-default-recovery-secret-2026';
  const exp = Date.now() + RECOVERY_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ userId, email, exp })).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function parseProofPayload(payloadB64: string): { userId: string; email: string } | null {
  try {
    const raw = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const parsed = JSON.parse(raw) as { userId?: string; email?: string; exp?: number };
    if (!parsed.userId || !parsed.email || typeof parsed.exp !== 'number') return null;
    return Date.now() <= parsed.exp ? { userId: parsed.userId, email: parsed.email } : null;
  } catch {
    return null;
  }
}

export function verifyRecoveryProof(token: string | null | undefined): { userId: string; email: string } | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  const [payloadB64, sig] = parts;
  const config = getOsConfig();
  const secret = config.authRecoverySecret || 'vt-default-recovery-secret-2026';
  const expectedSig = createHmac('sha256', secret).update(payloadB64).digest('base64url');

  if (sig !== expectedSig) return null;
  return parseProofPayload(payloadB64);
}
