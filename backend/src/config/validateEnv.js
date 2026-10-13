/**
 * Environment Variable Validator
 * Validates critical environment variables at startup and warns about misconfigurations.
 * Ensures strict production security standards before accepting connections.
 */
import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_DEV_JWT = 'devops_academy_super_secret_jwt_key_2026';
const INSECURE_PASSWORDS = ['postgres', 'password', '123456', 'admin', 'root'];

export const validateEnv = (options = {}) => {
  const isProd = (process.env.NODE_ENV === 'production') || options.strict;
  const isTest = process.env.NODE_ENV === 'test';
  const warnings = [];
  const errors = [];

  // 1. Port Validation
  const port = parseInt(process.env.PORT || '5000', 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    errors.push(`Invalid PORT: '${process.env.PORT}'. Must be an integer between 1 and 65535.`);
  }

  // 2. JWT Secret Security Validation
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    if (isProd) {
      errors.push('JWT_SECRET is missing. Production deployment requires a secure, high-entropy JWT_SECRET.');
    } else {
      warnings.push('JWT_SECRET not set in .env. Falling back to default development key.');
    }
  } else {
    if (isProd && jwtSecret === DEFAULT_DEV_JWT) {
      errors.push('JWT_SECRET is set to the default development template key. Production requires a unique secret (min 32 chars).');
    } else if (jwtSecret.length < 16) {
      warnings.push('JWT_SECRET is shorter than 16 characters. Consider using a 256-bit secret.');
    }
  }

  // 3. Database Connection Validation
  const hasDbUrl = !!process.env.DATABASE_URL;
  const hasDbHost = !!process.env.DB_HOST;

  if (!hasDbUrl && !hasDbHost) {
    if (isProd) {
      errors.push('Production database configuration missing: provide DATABASE_URL or DB_HOST, DB_NAME, DB_USER, DB_PASSWORD.');
    } else {
      warnings.push('Neither DATABASE_URL nor DB_HOST defined. Defaulting DB_HOST to localhost.');
    }
  }

  if (isProd && !hasDbUrl) {
    const dbPassword = process.env.DB_PASSWORD || '';
    if (!dbPassword || INSECURE_PASSWORDS.includes(dbPassword.toLowerCase())) {
      errors.push('Production DB_PASSWORD is using an insecure default or empty value. Set a strong password.');
    }
  }

  // 4. CORS / Client URL
  if (isProd && !process.env.CLIENT_URL) {
    warnings.push('CLIENT_URL not set in production. Browser requests with strict CORS origins may be blocked.');
  }

  // 5. SMTP / Email Notifications
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    if (!isTest) {
      warnings.push('SMTP credentials not configured. Email notifications running in MOCK (console) mode.');
    }
  }

  // Diagnostics formatting
  if (!isTest || options.verbose) {
    if (warnings.length > 0) {
      console.log('\n📋 [Configuration Check - Warnings]');
      warnings.forEach(w => console.warn(`  ⚠️  ${w}`));
    }

    if (errors.length > 0) {
      console.error('\n❌ [Fatal Environment Configuration Errors]');
      errors.forEach(e => console.error(`  ⛔ ${e}`));
      console.log('');
    }
  }

  if (errors.length > 0 && isProd && !options.noThrow) {
    throw new Error(`Production environment validation failed with ${errors.length} fatal error(s):\n - ${errors.join('\n - ')}`);
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

// Standalone CLI runner: node src/config/validateEnv.js [--strict]
if (process.argv[1] && process.argv[1].endsWith('validateEnv.js')) {
  const isStrict = process.argv.includes('--strict') || process.env.NODE_ENV === 'production';
  console.log(`🔍 Validating DevOps Academy environment configuration (${isStrict ? 'STRICT / PRODUCTION' : 'DEVELOPMENT'})...`);
  
  try {
    const result = validateEnv({ strict: isStrict, verbose: true, noThrow: true });
    if (result.isValid) {
      console.log('\n✅ Environment validation PASSED. All required variables and security constraints satisfied.\n');
      process.exit(0);
    } else {
      console.error(`\n❌ Environment validation FAILED with ${result.errors.length} error(s).\n`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`\n❌ Validation Exception: ${err.message}\n`);
    process.exit(1);
  }
}

export default validateEnv;
