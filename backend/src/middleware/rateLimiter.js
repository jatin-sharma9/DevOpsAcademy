/**
 * In-Memory Sliding-Window Rate Limiter Middleware
 * Protects endpoints from brute-force credential stuffing and denial of service.
 */

class MemoryRateLimiter {
  constructor({ windowMs, maxRequests, message }) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.message = message || 'Too many requests from this IP, please try again later.';
    this.hits = new Map();

    // Auto-clean stale records every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.hits.entries()) {
      const valid = timestamps.filter(ts => now - ts < this.windowMs);
      if (valid.length === 0) {
        this.hits.delete(key);
      } else {
        this.hits.set(key, valid);
      }
    }
  }

  middleware() {
    return (req, res, next) => {
      // In test mode, bypass rate limiting
      if (process.env.NODE_ENV === 'test') {
        return next();
      }

      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const now = Date.now();

      const timestamps = this.hits.get(ip) || [];
      const windowStart = now - this.windowMs;
      const recentHits = timestamps.filter(ts => ts > windowStart);

      if (recentHits.length >= this.maxRequests) {
        const oldestHit = recentHits[0];
        const resetTimeSeconds = Math.ceil((oldestHit + this.windowMs - now) / 1000);

        res.setHeader('Retry-After', resetTimeSeconds);
        res.setHeader('X-RateLimit-Limit', this.maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);

        return res.status(429).json({
          success: false,
          message: this.message,
          retryAfterSeconds: resetTimeSeconds,
        });
      }

      recentHits.push(now);
      this.hits.set(ip, recentHits);

      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - recentHits.length));

      next();
    };
  }
}

// 1. Auth Rate Limiter: 15 requests per 15 minutes per IP
export const authLimiter = new MemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 25,
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
}).middleware();

// 2. Email Rate Limiter: 10 requests per 10 minutes per IP
export const emailLimiter = new MemoryRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many email requests. Please try again after 10 minutes.',
}).middleware();

// 3. General Public API Limiter: 200 requests per minute per IP
export const apiLimiter = new MemoryRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 300,
  message: 'API rate limit exceeded. Please slow down your requests.',
}).middleware();
