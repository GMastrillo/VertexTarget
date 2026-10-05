export function getSiteOrigin(overrideUrl?: string | null): URL | null {
  const candidate =
    overrideUrl ??
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    null;

  if (!candidate || typeof candidate !== 'string') {
    return null;
  }

  try {
    const parsed = new URL(candidate.trim());
    if (parsed.protocol === 'https:') {
      return new URL(parsed.origin);
    }
    if (
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '::1')
    ) {
      return new URL(parsed.origin);
    }
    return null;
  } catch {
    return null;
  }
}
