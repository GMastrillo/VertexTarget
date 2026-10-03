import { createHmac } from 'node:crypto';

/**
 * Creates a deterministic HMAC-SHA256 hash of an identifier (IP address, email, etc.)
 * using a server-side secret salt. This avoids storing raw PII or IP in rate-limit logs.
 */
export function hashIdentifier(value: string, secret: string): string {
  const normalized = value.trim().toLowerCase();
  return createHmac('sha256', secret).update(normalized).digest('hex');
}

/**
 * Extracts client IP from request headers according to configured trusted proxy model.
 */
export function extractClientIp(
  request: Request,
  trustedProxy: 'vercel' | 'cloudflare' | 'none'
): string {
  if (trustedProxy === 'cloudflare') {
    const cfIp = request.headers.get('cf-connecting-ip');
    if (cfIp) return cfIp.trim();
  }

  if (trustedProxy === 'vercel' || trustedProxy === 'cloudflare') {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      const parts = forwarded.split(',');
      if (parts[0]) return parts[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) return realIp.trim();
  }

  // Fallback identifier if behind none or unconfigured proxy
  return '127.0.0.1';
}
