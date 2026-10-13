import http from 'http';
import app from './app.js';
import { auditService } from './src/services/auditService.js';
import { register } from './src/utils/metrics.js';
import { logger } from './src/utils/logger.js';

let server;
const PORT = 5097;
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

async function rawRequest(url, options = {}) {
  const headers = { ...options.headers };
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  return {
    status: res.status,
    ok: res.ok,
    headers: res.headers,
    data,
  };
}

async function runTests() {
  console.log('🧪 Starting Monitoring, Observability & Audit Logging Test Suite...\n');

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));

  try {
    // ─── SUITE 1: Request ID Middleware ──────────────────────────────────────
    console.log('--- TEST SUITE 1: Request ID Middleware ---');
    
    // Test 1: Auto-generate X-Request-Id header if missing
    const res1 = await rawRequest(`http://localhost:${PORT}/api/health`);
    assert(res1.status === 200, 'GET /api/health responds with 200 OK');
    const autoReqId = res1.headers.get('x-request-id');
    assert(!!autoReqId && autoReqId.length > 5, `Server auto-generates X-Request-Id header (${autoReqId})`);

    // Test 2: Preserve client-supplied X-Request-Id header
    const customReqId = 'test-client-correlation-id-9999';
    const res2 = await rawRequest(`http://localhost:${PORT}/api/health`, {
      headers: { 'X-Request-Id': customReqId },
    });
    const echoedReqId = res2.headers.get('x-request-id');
    assert(echoedReqId === customReqId, `Server preserves and echoes incoming X-Request-Id header (${echoedReqId})`);

    // ─── SUITE 2: Prometheus Metrics Endpoint ───────────────────────────────
    console.log('\n--- TEST SUITE 2: Prometheus Metrics Endpoint (/api/metrics) ---');
    const metricsRes = await rawRequest(`${BASE_URL}/metrics`);
    assert(metricsRes.status === 200, 'GET /api/metrics responds with 200 OK');
    const metricsContentType = metricsRes.headers.get('content-type') || '';
    assert(
      metricsContentType.includes('text/plain') || metricsContentType.includes('version=0.0.4'),
      `Content-Type is Prometheus exposition format (${metricsContentType})`
    );

    const metricsBody = typeof metricsRes.data === 'string' ? metricsRes.data : '';
    assert(metricsBody.includes('http_requests_total'), 'Metrics output includes http_requests_total counter');
    assert(metricsBody.includes('http_request_duration_seconds'), 'Metrics output includes http_request_duration_seconds histogram');
    assert(metricsBody.includes('http_active_requests'), 'Metrics output includes http_active_requests gauge');
    assert(metricsBody.includes('devops_academy_entities_total'), 'Metrics output includes devops_academy_entities_total gauge');
    assert(
      metricsBody.includes('devops_academy_process_cpu_user_seconds_total') ||
      metricsBody.includes('process_cpu_user_seconds_total'),
      'Metrics output includes Node.js CPU process metrics'
    );
    assert(
      metricsBody.includes('devops_academy_nodejs_heap_size_used_bytes') ||
      metricsBody.includes('nodejs_heap_size_used_bytes'),
      'Metrics output includes Node.js heap memory metrics'
    );

    // ─── SUITE 3: Structured Error Logging ──────────────────────────────────
    console.log('\n--- TEST SUITE 3: Structured Error Logging & Correlation ---');
    const notFoundRes = await rawRequest(`${BASE_URL}/non-existent-route-for-monitoring-test`);
    assert(notFoundRes.status === 404, 'Non-existent route returns 404 Not Found');
    assert(notFoundRes.data?.success === false, '404 response body has success: false');
    assert(!!notFoundRes.headers.get('x-request-id'), '404 response contains X-Request-Id header');

    // ─── SUITE 4: Audit Logging Service ─────────────────────────────────────
    console.log('\n--- TEST SUITE 4: Audit Logging Service & Storage ---');
    const testAction = `TEST_AUDIT_${Date.now()}`;
    const testLog = await auditService.log({
      username: 'Test_Auditor',
      action: testAction,
      resource: 'test_resource',
      resourceId: 42,
      details: { reason: 'Automated test suite execution' },
    });
    assert(!!testLog && testLog.id > 0, `Direct auditService.log writes log entry (ID: ${testLog?.id})`);
    assert(testLog?.action === testAction, `Audit log matches recorded action (${testAction})`);

    // Verify retrieval filter by action
    const retrievedLogs = await auditService.getAuditLogs({ action: testAction });
    assert(retrievedLogs.length >= 1, `auditService.getAuditLogs filters by action (${retrievedLogs.length} found)`);
    assert(retrievedLogs[0].resource === 'test_resource', 'Retrieved audit log has expected resource');

    // Verify stats
    const auditStats = await auditService.getAuditStats();
    assert(auditStats && typeof auditStats.total === 'number' && auditStats.total > 0, `auditService.getAuditStats returns total count (${auditStats?.total})`);
    assert(Array.isArray(auditStats.byAction), 'Audit stats includes byAction breakdown array');

    // ─── SUITE 5: Admin Audit Log API & RBAC Protection ─────────────────────
    console.log('\n--- TEST SUITE 5: Admin Audit Logs API & RBAC ---');

    // Unauthenticated request should be rejected (401)
    const unauthAuditRes = await rawRequest(`${BASE_URL}/admin/audit-logs`);
    assert(unauthAuditRes.status === 401, 'GET /api/admin/audit-logs without token returns 401 Unauthorized');

    // Admin login
    const adminLoginRes = await rawRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        identifier: 'Jatin_Sharma',
        password: 'J@tinS93',
      },
    });
    const adminToken = adminLoginRes.data?.token;
    assert(!!adminToken, 'Admin login succeeded and returned JWT');

    // Authenticated Admin request (200)
    const adminAuditRes = await rawRequest(`${BASE_URL}/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminAuditRes.status === 200, 'GET /api/admin/audit-logs with admin token returns 200 OK');
    assert(adminAuditRes.data?.success === true, 'Admin audit-logs response has success: true');
    assert(Array.isArray(adminAuditRes.data?.data), 'Admin audit-logs response contains data array');
    assert(adminAuditRes.data?.stats !== undefined, 'Admin audit-logs response contains stats object');

    // ─── SUITE 6: Action-Triggered Audit Logging ────────────────────────────
    console.log('\n--- TEST SUITE 6: Automatic Action Audit Logging ---');

    // Save Email Settings triggers an audit log
    const emailSettingsRes = await rawRequest(`${BASE_URL}/admin/email/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 465,
        smtpSecure: true,
        smtpUser: 'audit-test@gmail.com',
        smtpPass: 'test-pass-1234',
        emailFrom: '"DevOps Academy" <noreply@devopsacademy.com>',
        adminEmail: 'jatinsharma932002@gmail.com',
      },
    });
    assert(emailSettingsRes.status === 200, 'PUT /api/admin/email/settings succeeds');

    // Verify the UPDATE_EMAIL_SETTINGS action was logged in audit_logs
    const updatedAuditLogs = await auditService.getAuditLogs({ action: 'UPDATE_EMAIL_SETTINGS', limit: 1 });
    assert(updatedAuditLogs.length > 0, 'Audit log created automatically for UPDATE_EMAIL_SETTINGS action');
    assert(updatedAuditLogs[0].username === 'Jatin_Sharma', `Audit log recorded correct admin user (${updatedAuditLogs[0]?.username})`);

    // Verify metrics updated with HTTP traffic
    const finalMetricsRes = await rawRequest(`${BASE_URL}/metrics`);
    const finalMetricsText = typeof finalMetricsRes.data === 'string' ? finalMetricsRes.data : '';
    assert(finalMetricsText.includes('http_requests_total{'), 'Metrics registry recorded label values for processed requests');

  } catch (err) {
    console.error('Unexpected test error:', err);
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
