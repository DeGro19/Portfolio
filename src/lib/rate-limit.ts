/**
 * Fixed-window rate limiter held in process memory.
 *
 * Caveat worth knowing: serverless instances do not share memory, so the
 * effective limit is per instance rather than global. That is fine for a
 * contact form on a portfolio, where the goal is blunting casual abuse. A
 * real multi-instance deployment needs shared state (Redis, Upstash, or
 * Vercel KV) instead.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function rateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;

  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) {
      if (now > v.resetAt) buckets.delete(k);
    }
  }

  if (entry.count > MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
