import crypto from 'crypto';
import { createRequestLogger } from '../utils/logger.js';

/**
 * Request ID Middleware
 * 
 * Extracts incoming 'X-Request-Id' header if valid, or generates a unique,
 * collision-resistant identifier.
 * Attaches requestId to req.id and response headers.
 * Attaches a child Winston logger to req.log pre-bound with requestId.
 */
export const requestIdMiddleware = (req, res, next) => {
  const incomingId = req.headers['x-request-id'];

  // Accept incoming request ID if non-empty and alphanumeric, or generate new
  let requestId;
  if (incomingId && typeof incomingId === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(incomingId.trim())) {
    requestId = incomingId.trim();
  } else {
    const timestampPart = Date.now().toString(36);
    const randomHex = crypto.randomBytes(6).toString('hex');
    requestId = `req-${timestampPart}-${randomHex}`;
  }

  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  // Bind request context to child logger
  req.log = createRequestLogger(requestId, {
    method: req.method,
    url: req.originalUrl || req.url,
  });

  next();
};

export default requestIdMiddleware;
