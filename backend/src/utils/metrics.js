import promClient from 'prom-client';
import { query } from '../config/db.js';

// Create Prometheus Registry
export const register = new promClient.Registry();

// Set default labels applied to all metrics
register.setDefaultLabels({
  app: 'devops-academy-backend',
  env: process.env.NODE_ENV || 'development',
});

// Collect standard Node.js & runtime system metrics
promClient.collectDefaultMetrics({
  register,
  prefix: 'devops_academy_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2],
});

// ─── HTTP Metrics ────────────────────────────────────────────────────────────

// 1. Total HTTP Requests Counter
export const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed by DevOps Academy backend',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// 2. HTTP Request Duration Histogram
export const httpRequestDurationHistogram = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// 3. Active in-flight requests Gauge
export const activeRequestsGauge = new promClient.Gauge({
  name: 'http_active_requests',
  help: 'Number of currently active in-flight HTTP requests',
  labelNames: ['method'],
  registers: [register],
});

// ─── Database & Business Metrics ─────────────────────────────────────────────

// 4. PostgreSQL Query Duration
export const dbQueryDurationHistogram = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 3],
  registers: [register],
});

// 5. Platform Business Entities Gauge
export const platformEntitiesGauge = new promClient.Gauge({
  name: 'devops_academy_entities_total',
  help: 'Total count of entities registered in DevOps Academy platform',
  labelNames: ['entity'],
  registers: [register],
});

/**
 * Periodically update platform business metrics from PostgreSQL
 */
export const updatePlatformMetrics = async () => {
  try {
    const [usersRes, coursesRes, enrollmentsRes, certsRes, quizzesRes, reviewsRes] = await Promise.all([
      query('SELECT COUNT(*)::int as c FROM users'),
      query('SELECT COUNT(*)::int as c FROM courses'),
      query('SELECT COUNT(*)::int as c FROM enrollments'),
      query('SELECT COUNT(*)::int as c FROM certificates'),
      query('SELECT COUNT(*)::int as c FROM quiz_attempts'),
      query('SELECT COUNT(*)::int as c FROM course_reviews'),
    ]);

    platformEntitiesGauge.set({ entity: 'users' }, usersRes.rows[0]?.c || 0);
    platformEntitiesGauge.set({ entity: 'courses' }, coursesRes.rows[0]?.c || 0);
    platformEntitiesGauge.set({ entity: 'enrollments' }, enrollmentsRes.rows[0]?.c || 0);
    platformEntitiesGauge.set({ entity: 'certificates' }, certsRes.rows[0]?.c || 0);
    platformEntitiesGauge.set({ entity: 'quiz_attempts' }, quizzesRes.rows[0]?.c || 0);
    platformEntitiesGauge.set({ entity: 'reviews' }, reviewsRes.rows[0]?.c || 0);
  } catch (err) {
    // Fail silently in testing if db is disconnected
  }
};

export default {
  register,
  httpRequestCounter,
  httpRequestDurationHistogram,
  activeRequestsGauge,
  dbQueryDurationHistogram,
  platformEntitiesGauge,
  updatePlatformMetrics,
};
