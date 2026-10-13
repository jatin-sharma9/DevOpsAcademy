import { logger } from '../utils/logger.js';

/**
 * HTTP Request Logging Middleware
 * 
 * Intercepts response lifecycle, measures duration, captures response status,
 * and outputs structured log entry correlated with Request ID.
 */
export const httpLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = req.id || req.headers['x-request-id'] || 'no-req-id';

  // Listen for the finish event on response stream
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const statusCode = res.statusCode;
    const contentLength = res.getHeader('content-length') || 0;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    const userId = req.user ? req.user.id : undefined;
    const username = req.user ? req.user.username : undefined;

    const logMeta = {
      requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode,
      durationMs,
      contentLength: Number(contentLength),
      ip,
      userAgent,
      userId,
      username,
    };

    // Determine appropriate log level based on HTTP response status code
    if (statusCode >= 500) {
      logger.error(`HTTP ${req.method} ${req.originalUrl} ${statusCode} (${durationMs}ms)`, logMeta);
    } else if (statusCode >= 400) {
      logger.warn(`HTTP ${req.method} ${req.originalUrl} ${statusCode} (${durationMs}ms)`, logMeta);
    } else {
      // Don't overwhelm logs in production for health checks if needed
      logger.info(`HTTP ${req.method} ${req.originalUrl} ${statusCode} (${durationMs}ms)`, logMeta);
    }
  });

  next();
};

export default httpLogger;
