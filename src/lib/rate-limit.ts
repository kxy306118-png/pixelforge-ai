import { NextRequest, NextResponse } from "next/server";

/**
 * Simple in-memory rate limiter.
 * For production with multiple server instances, replace with Upstash Redis:
 *   https://docs.upstash.com/redis/sdts/ratelimiting
 *
 * Usage in an API route:
 *   const limited = rateLimit(req, { limit: 10, windowMinutes: 1 });
 *   if (limited) return limited;
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

export function rateLimit(
  req: NextRequest,
  options: { limit?: number; windowMinutes?: number; keyPrefix?: string } = {}
): NextResponse | null {
  const { limit = 20, windowMinutes = 1, keyPrefix = "" } = options;

  // Get client identifier: IP address from headers or fall back to a generic key
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown";

  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;

  cleanup();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // First request or window expired
    store.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      {
        error: "Too many requests. Please slow down.",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}

// Preset configurations for different endpoint types
export const RATE_LIMITS = {
  auth: { limit: 5, windowMinutes: 1, keyPrefix: "auth" },       // login/register: 5/min
  ai: { limit: 10, windowMinutes: 1, keyPrefix: "ai" },          // AI tools: 10/min
  free: { limit: 30, windowMinutes: 1, keyPrefix: "free" },      // free tools: 30/min
  contact: { limit: 3, windowMinutes: 1, keyPrefix: "contact" }, // contact form: 3/min
  general: { limit: 60, windowMinutes: 1, keyPrefix: "general" }, // everything else: 60/min
};
