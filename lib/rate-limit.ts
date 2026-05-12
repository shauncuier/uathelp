import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

/**
 * Rate limit middleware
 * @param key - Unique identifier (usually IP or email)
 * @param limit - Max requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const entry = rateLimitStore[key];

  // If no entry or window expired, reset
  if (!entry || now > entry.resetTime) {
    rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  // Check if limit exceeded
  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  // Increment count
  entry.count++;
  const remaining = limit - entry.count;
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

  return { allowed: true, remaining, retryAfter };
}

/**
 * Get client IP from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip.trim();
}

/**
 * Create rate limit response
 */
export function createRateLimitResponse(
  message: string,
  retryAfter: number
): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

/**
 * Login rate limiter - 5 attempts per 15 minutes
 */
export function checkLoginRateLimit(email: string) {
  return checkRateLimit(`login:${email}`, 5, 15 * 60 * 1000);
}

/**
 * API rate limiter - 100 requests per minute
 */
export function checkApiRateLimit(ip: string) {
  return checkRateLimit(`api:${ip}`, 100, 60 * 1000);
}

/**
 * Signup rate limiter - 3 attempts per hour
 */
export function checkSignupRateLimit(email: string) {
  return checkRateLimit(`signup:${email}`, 3, 60 * 60 * 1000);
}

// Cleanup old entries every hour to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  }
}, 60 * 60 * 1000);
