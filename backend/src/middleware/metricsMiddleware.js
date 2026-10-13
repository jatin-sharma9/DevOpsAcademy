import {
  httpRequestCounter,
  httpRequestDurationHistogram,
  activeRequestsGauge,
} from '../utils/metrics.js';

/**
 * Normalizes request paths to avoid high-cardinality label explosion in Prometheus
 * e.g., /api/courses/123 -> /api/courses/:id
 * e.g., /api/enrollments/certificates/verify/DEV-123 -> /api/enrollments/certificates/verify/:hash
 */
const normalizeRoute = (req) => {
  if (req.route && req.route.path) {
    const baseUrl = req.baseUrl || '';
    return `${baseUrl}${req.route.path}`;
  }

  const url = req.originalUrl || req.url;
  const pathWithoutQuery = url.split('?')[0];

  return pathWithoutQuery
    .replace(/\/[0-9]+(?=\/|$)/g, '/:id')
    .replace(/\/certificates\/verify\/[a-zA-Z0-9_-]+/g, '/certificates/verify/:hash')
    .replace(/\/blogs\/[a-zA-Z0-9_-]+/g, '/blogs/:slug')
    .replace(/\/courses\/[a-zA-Z0-9_-]+/g, '/courses/:slug');
};

/**
 * Express middleware to track Prometheus HTTP metrics
 */
export const metricsMiddleware = (req, res, next) => {
  // Skip metrics scraping endpoint itself from being counted to avoid self-referential skew
  if (req.path === '/metrics' || req.originalUrl === '/api/metrics') {
    return next();
  }

  const startSeconds = process.hrtime();
  activeRequestsGauge.inc({ method: req.method });

  res.on('finish', () => {
    activeRequestsGauge.dec({ method: req.method });

    const diff = process.hrtime(startSeconds);
    const durationSeconds = diff[0] + diff[1] / 1e9;
    const route = normalizeRoute(req);
    const statusCode = String(res.statusCode);

    httpRequestCounter.inc({
      method: req.method,
      route,
      status_code: statusCode,
    });

    httpRequestDurationHistogram.observe(
      {
        method: req.method,
        route,
        status_code: statusCode,
      },
      durationSeconds
    );
  });

  next();
};

export default metricsMiddleware;
