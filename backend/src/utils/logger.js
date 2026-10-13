import winston from 'winston';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');

// Ensure logs directory exists if running with file logging
const logDir = 'logs';
if (!isTest && !fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch (err) {
    // Ignore if directory cannot be created (e.g. read-only container root)
  }
}

// Custom format for console development output
const devConsoleFormat = winston.format.printf(({ level, message, timestamp, requestId, ...meta }) => {
  const reqStr = requestId ? ` [${requestId}]` : '';
  const metaStr = Object.keys(meta).length ? `\n  ${JSON.stringify(meta, null, 2)}` : '';
  return `[${timestamp}] [${level}]${reqStr}: ${message}${metaStr}`;
});

// Transports configuration
const transports = [
  new winston.transports.Console({
    silent: isTest && !process.env.DEBUG_TESTS,
    format: isProduction
      ? winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
          winston.format.json()
        )
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          devConsoleFormat
        ),
  }),
];

// In non-test environments, write to local file logs if directory is writable
if (!isTest && fs.existsSync(logDir)) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 15 * 1024 * 1024, // 15MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
}

export const logger = winston.createLogger({
  level: logLevel,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'devops-academy-api' },
  transports,
});

// Child logger helper to bind request context (requestId, route, user)
export const createRequestLogger = (requestId, extraMeta = {}) => {
  return logger.child({
    requestId,
    ...extraMeta,
  });
};

export default logger;
