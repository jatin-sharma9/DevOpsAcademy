import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import enrollmentRoutes from './src/routes/enrollmentRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import trackerRoutes from './src/routes/trackerRoutes.js';
import blogRoutes from './src/routes/blogRoutes.js';
import emailRoutes from './src/routes/emailRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import quizRoutes from './src/routes/quizRoutes.js';
import noteRoutes from './src/routes/noteRoutes.js';

import { apiLimiter, authLimiter, emailLimiter } from './src/middleware/rateLimiter.js';
import { pool, getPoolStats } from './src/config/db.js';
import requestIdMiddleware from './src/middleware/requestId.js';
import httpLogger from './src/middleware/httpLogger.js';
import metricsMiddleware from './src/middleware/metricsMiddleware.js';
import { register, updatePlatformMetrics } from './src/utils/metrics.js';
import { logger } from './src/utils/logger.js';

const app = express();

// Request ID Tracing (must be first)
app.use(requestIdMiddleware);

// Prometheus Metrics Middleware
app.use(metricsMiddleware);

// Structured Request/Response Logging
app.use(httpLogger);

// Security Headers: allow cross-origin resource policy for images/uploads
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5200',
  'http://127.0.0.1:5200',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or matching origins
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev/testing
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static files for uploads with cache control
app.use('/uploads', express.static('uploads', {
  maxAge: '1d',
  etag: true,
}));

// ─── Health & Diagnostic Probes ──────────────────────────────────────────────

// 1. Lightweight Liveness Probe (process is alive and accepting connections)
app.get('/api/health/live', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// 2. Readiness Probe (verifies database connectivity for traffic routing)
app.get('/api/health/ready', async (req, res) => {
  try {
    const startTime = Date.now();
    await pool.query('SELECT 1');
    const latencyMs = Date.now() - startTime;

    res.status(200).json({
      status: 'READY',
      timestamp: new Date().toISOString(),
      database: { status: 'CONNECTED', latencyMs },
    });
  } catch (error) {
    logger.error('Readiness probe failed', { error: error.message, requestId: req.id });
    res.status(503).json({
      status: 'NOT_READY',
      timestamp: new Date().toISOString(),
      database: { status: 'DISCONNECTED', error: error.message },
    });
  }
});

// 3. Comprehensive Health & Diagnostics Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const startTime = Date.now();
    await pool.query('SELECT 1');
    const dbLatencyMs = Date.now() - startTime;
    const mem = process.memoryUsage();

    res.status(200).json({
      status: 'UP',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'UP',
        latencyMs: dbLatencyMs,
        pool: getPoolStats(),
      },
      system: {
        nodeVersion: process.version,
        memoryUsageMb: Math.round(mem.rss / (1024 * 1024)),
        heapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
        heapTotalMb: Math.round(mem.heapTotal / (1024 * 1024)),
      },
      message: 'DevOps Academy Backend API is healthy and connected',
    });
  } catch (error) {
    logger.error('Health check database error:', { error: error.message, requestId: req.id });
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      database: {
        status: 'DOWN',
        error: error.message,
      },
      message: 'DevOps Academy Backend API service degraded: Database unreachable',
    });
  }
});

// Prometheus metrics endpoint
app.get('/api/metrics', async (req, res) => {
  try {
    await updatePlatformMetrics();
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Failed to generate Prometheus metrics', {
      requestId: req.id,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).send('Error generating metrics');
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    name: 'DevOps Academy API',
    version: '1.0.0',
    documentation: '/api-docs',
    metrics: '/api/metrics',
  });
});

// Apply rate limiting
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/email/test', emailLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/lessons', noteRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.method} ${req.originalUrl}' not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'Uploaded file exceeds the maximum 5MB size limit' });
    }
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }

  // Handle custom upload errors
  if (err.message && err.message.includes('Only images')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Structured Error Logging with correlation ID and request context
  logger.error(err.message || 'Unhandled Application Error', {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    statusCode: err.statusCode || 500,
    stack: err.stack,
    user: req.user ? { id: req.user.id, role: req.user.role } : undefined,
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    requestId: req.id,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;
