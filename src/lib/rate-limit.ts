type RateEntry = {
  count: number;
  resetAt: number;
};

const store: Record<string, RateEntry> = {};

export function checkRateLimit(key: string, limitPerMinute = 20) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const entry = store[key];
  if (!entry || now > entry.resetAt) {
    store[key] = { count: 1, resetAt: now + windowMs };
    return { allowed: true, remaining: limitPerMinute - 1 };
  }
  if (entry.count >= limitPerMinute) {
    return { allowed: false, retryAfter: Math.max(0, entry.resetAt - now) };
  }
  entry.count += 1;
  return { allowed: true, remaining: limitPerMinute - entry.count };
}
