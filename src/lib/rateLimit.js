// Simple in-memory rate limiter (suitable for small scale & single server)
// key structure: `${scope}:${identifier}` (identifier can be IP or user id)
// For production horizontal scaling, replace with Redis-based store.

const buckets = new Map();

/**
 * rateLimit
 * @param {Object} options
 * @param {string} options.scope logical scope name (e.g. 'upload')
 * @param {number} options.limit number of allowed actions
 * @param {number} options.windowMs time window in ms
 * @param {function(Request): string} options.keyGenerator function to extract key (default: ip)
 * @returns function(request) -> { allowed: boolean, remaining: number, retryAfter?: number }
 */
export function createRateLimiter({
  scope,
  limit = 20,
  windowMs = 60_000,
  keyGenerator,
}) {
  if (!scope) throw new Error("scope required");

  return function rateLimit(request) {
    const now = Date.now();
    const keyBase = keyGenerator
      ? keyGenerator(request)
      : request.headers.get("x-forwarded-for") || "anon";
    const key = `${scope}:${keyBase}`;
    let entry = buckets.get(key);
    if (!entry || entry.expiresAt < now) {
      entry = { count: 0, expiresAt: now + windowMs };
      buckets.set(key, entry);
    }
    if (entry.count >= limit) {
      const retryAfter = Math.max(0, Math.ceil((entry.expiresAt - now) / 1000));
      return { allowed: false, remaining: 0, retryAfter };
    }
    entry.count += 1;
    return { allowed: true, remaining: limit - entry.count, retryAfter: 0 };
  };
}

// Preconfigured limiter for uploads (5 uploads / 30s per IP)
export const uploadRateLimiter = createRateLimiter({
  scope: "upload",
  limit: 5,
  windowMs: 30_000,
});
