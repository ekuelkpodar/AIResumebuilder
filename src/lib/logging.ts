export function logInfo(message: string, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "test") return;
  console.log(`[INFO] ${message}`, meta ? sanitize(meta) : "");
}

export function logError(message: string, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "test") return;
  console.error(`[ERROR] ${message}`, meta ? sanitize(meta) : "");
}

// Avoid logging large payloads or PII-heavy data.
function sanitize(meta: Record<string, unknown>) {
  const safe: Record<string, unknown> = {};
  Object.entries(meta).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 400) {
      safe[key] = `${value.slice(0, 400)}...`;
    } else {
      safe[key] = value;
    }
  });
  return safe;
}
