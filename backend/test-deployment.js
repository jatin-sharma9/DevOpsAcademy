import http from 'http';
import app from './app.js';
import { getMigrationStatus } from './src/config/migrate.js';
import { validateEnv } from './src/config/validateEnv.js';
import { getPoolStats } from './src/config/db.js';

let server;
const PORT = 5096;
const BASE_URL = `http://localhost:${PORT}/api`;

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('🧪 Starting CI/CD & Deployment Readiness Test Suite...\n');

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));

  try {
    // ─── SUITE 1: Healthcheck Probes (Liveness & Readiness) ─────────────────
    console.log('--- TEST SUITE 1: Container Health Probes ---');

    // 1.1 Liveness Probe
    const liveRes = await request('/health/live');
    assert(liveRes.status === 200, 'GET /api/health/live responds with 200 OK');
    assert(liveRes.data?.status === 'UP', 'Liveness probe status is UP');
    assert(typeof liveRes.data?.uptime === 'number', 'Liveness probe returns uptime seconds');

    // 1.2 Readiness Probe
    const readyRes = await request('/health/ready');
    assert(readyRes.status === 200, 'GET /api/health/ready responds with 200 OK');
    assert(readyRes.data?.status === 'READY', 'Readiness probe status is READY');
    assert(readyRes.data?.database?.status === 'CONNECTED', 'Readiness probe confirms database CONNECTED');
    assert(typeof readyRes.data?.database?.latencyMs === 'number', `Readiness probe reports database latency (${readyRes.data?.database?.latencyMs}ms)`);

    // 1.3 Detailed Diagnostic Health Check
    const healthRes = await request('/health');
    assert(healthRes.status === 200, 'GET /api/health responds with 200 OK');
    assert(healthRes.data?.status === 'UP', 'Comprehensive healthcheck status is UP');
    assert(healthRes.data?.database?.pool !== undefined, 'Healthcheck includes database pool stats');
    assert(typeof healthRes.data?.database?.pool?.totalCount === 'number', `Pool stats reports totalCount (${healthRes.data?.database?.pool?.totalCount})`);
    assert(typeof healthRes.data?.system?.heapUsedMb === 'number', `System stats reports heapUsedMb (${healthRes.data?.system?.heapUsedMb} MB)`);

    // ─── SUITE 2: PostgreSQL Migration Automation ───────────────────────────
    console.log('\n--- TEST SUITE 2: PostgreSQL Migration Automation ---');
    const migrations = await getMigrationStatus();
    assert(Array.isArray(migrations) && migrations.length >= 4, `schema_migrations table has tracked ${migrations?.length} migration batches`);
    
    const versions = migrations.map(m => m.version);
    assert(versions.includes('001_core_platform_schema'), 'Found 001_core_platform_schema in migration history');
    assert(versions.includes('002_email_dispatch_and_settings'), 'Found 002_email_dispatch_and_settings in migration history');
    assert(versions.includes('003_phase2_missing_apis'), 'Found 003_phase2_missing_apis in migration history');
    assert(versions.includes('004_observability_audit_logs'), 'Found 004_observability_audit_logs in migration history');

    // ─── SUITE 3: Production Environment Validation ─────────────────────────
    console.log('\n--- TEST SUITE 3: Production Environment Validation ---');
    
    // Normal development check should pass
    const devValidation = validateEnv({ strict: false, noThrow: true });
    assert(devValidation.isValid === true, 'validateEnv passes development configuration check');

    // Insecure password detection in strict mode
    const origPassword = process.env.DB_PASSWORD;
    process.env.DB_PASSWORD = 'postgres';
    const strictValidation = validateEnv({ strict: true, noThrow: true });
    assert(strictValidation.isValid === false, 'validateEnv strict mode rejects insecure DB_PASSWORD (postgres)');
    assert(strictValidation.errors.some(e => e.includes('insecure default')), 'Identifies insecure password error message');
    process.env.DB_PASSWORD = origPassword;

    // ─── SUITE 4: Pool Stats Helper ─────────────────────────────────────────
    console.log('\n--- TEST SUITE 4: Pool Stats Diagnostic Helper ---');
    const poolStats = getPoolStats();
    assert(typeof poolStats.totalCount === 'number', 'getPoolStats returns numeric totalCount');
    assert(typeof poolStats.idleCount === 'number', 'getPoolStats returns numeric idleCount');
    assert(typeof poolStats.waitingCount === 'number', 'getPoolStats returns numeric waitingCount');

  } catch (err) {
    console.error('Unexpected test failure:', err);
    failed++;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    console.log('\n==================================================');
    console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log('==================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
