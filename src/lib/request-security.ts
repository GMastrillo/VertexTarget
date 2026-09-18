import "server-only";

type RateLimitEntry = { count: number; resetAt: number };

const rateLimitStores = new Map<string, Map<string, RateLimitEntry>>();

export function isSameOriginRequest(request: Request) {
  const originHeader = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!originHeader || !host) return false;

  try {
    const origin = new URL(originHeader);
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const requestProtocol = forwardedProto || new URL(request.url).protocol.replace(":", "");
    return origin.host === host && origin.protocol === `${requestProtocol}:`;
  } catch {
    return false;
  }
}

// Public endpoints can still be called by trusted server-side clients without Origin,
// but an explicitly supplied cross-origin browser Origin is always rejected.
export function isSameOriginIfPresent(request: Request) {
  return !request.headers.get("origin") || isSameOriginRequest(request);
}

export function hasJsonContentType(request: Request) {
  return request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() === "application/json";
}

export async function parseJsonBody<T>(request: Request, maxBytes: number): Promise<{ ok: true; value: T } | { ok: false; reason: "too-large" | "invalid" }> {
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) return { ok: false, reason: "too-large" };
  try {
    return { ok: true, value: JSON.parse(raw) as T };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

export function getClientAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || request.headers.get("cf-connecting-ip")
    || "unknown";
}

export function isSafeInternalPath(value: string | null) {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\"));
}

export function isRateLimited(namespace: string, key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  let store = rateLimitStores.get(namespace);
  if (!store) {
    store = new Map();
    rateLimitStores.set(namespace, store);
  }

  if (store.size > 10_000) {
    for (const [storedKey, entry] of store) {
      if (entry.resetAt <= now) store.delete(storedKey);
    }
  }

  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  return current.count > maxRequests;
}
