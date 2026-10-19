import app from './app.js';
import { emailService } from './src/services/emailService.js';
import { query } from './src/config/db.js';

let server;
const PORT = 5098;
const BASE_URL = `http://localhost:${PORT}/api`;

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runEmailTests() {
  console.log('🧪 Starting DevOps Academy Nodemailer & Email System Tests...\n');

  // Start test server instance
  await new Promise((resolve) => {
    server = app.listen(PORT, resolve);
  });

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

  try {
    // -------------------------------------------------------------
    console.log('--- TEST SUITE 1: SMTP Default Configuration & Environment Overrides ---');
    // -------------------------------------------------------------
    const savedEnv = {
      SMTP_SERVICE: process.env.SMTP_SERVICE,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_SECURE: process.env.SMTP_SECURE,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
    };

    // 1.1 Verify default configuration with all SMTP env vars unset
    delete process.env.SMTP_SERVICE;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_SECURE;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    const defaultConfig = emailService.getStatus();
    assert(defaultConfig !== null, 'Email service status object exists without env vars');
    assert(defaultConfig.provider === 'Gmail', `Default provider is Gmail (actual: ${defaultConfig.provider})`);
    assert(defaultConfig.host === 'smtp.gmail.com', `Default SMTP host is smtp.gmail.com (actual: ${defaultConfig.host})`);
    assert(defaultConfig.port === 465, `Default SMTP port is 465 (actual: ${defaultConfig.port})`);
    assert(defaultConfig.secure === true, `Default SMTP secure is true (actual: ${defaultConfig.secure})`);
    assert(defaultConfig.configured === false, 'Credentials are not hardcoded (configured: false)');
    assert(defaultConfig.isMock === true, 'Runs safely in mock mode without credentials');

    // 1.2 Verify custom SMTP provider override (e.g., SendGrid)
    process.env.SMTP_HOST = 'smtp.sendgrid.net';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_SECURE = 'false';

    const customHostConfig = emailService.getStatus();
    assert(customHostConfig.host === 'smtp.sendgrid.net', `Custom host override works (actual: ${customHostConfig.host})`);
    assert(customHostConfig.port === 587, `Custom port override works (actual: ${customHostConfig.port})`);
    assert(customHostConfig.secure === false, `Custom secure override works (actual: ${customHostConfig.secure})`);
    assert(customHostConfig.provider === 'smtp.sendgrid.net', `Custom provider identified (actual: ${customHostConfig.provider})`);

    // 1.3 Verify custom service override (e.g., Mailgun)
    delete process.env.SMTP_HOST;
    process.env.SMTP_SERVICE = 'mailgun';
    const customServiceConfig = emailService.getStatus();
    assert(customServiceConfig.provider === 'Mailgun', `Custom service provider identified (actual: ${customServiceConfig.provider})`);

    // Restore original env vars
    for (const [k, v] of Object.entries(savedEnv)) {
      if (v !== undefined) {
        process.env[k] = v;
      } else {
        delete process.env[k];
      }
    }

    const connection = await emailService.verifyConnection();
    assert(connection.verified === true, 'Transporter connection verification returns valid status');

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 2: Email API Status Endpoint ---');
    // -------------------------------------------------------------
    const statusApiRes = await request('/email/status');
    assert(statusApiRes.status === 200, 'GET /api/email/status returns 200 OK');
    assert(statusApiRes.data?.success === true, 'Response contains success: true');
    assert(statusApiRes.data?.status?.provider === 'Gmail', `API provider identified as Gmail (actual: ${statusApiRes.data?.status?.provider})`);
    assert(statusApiRes.data?.status?.host === 'smtp.gmail.com', `API SMTP host is smtp.gmail.com (actual: ${statusApiRes.data?.status?.host})`);
    assert(statusApiRes.data?.status?.port === 465, `API SMTP port is 465 (actual: ${statusApiRes.data?.status?.port})`);
    assert(statusApiRes.data?.status?.secure === true, `API SMTP secure is true (actual: ${statusApiRes.data?.status?.secure})`);

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 3: Test Email Dispatch Endpoint ---');
    // -------------------------------------------------------------
    // 3.1 Standard Test Email
    const testEmailRes = await request('/email/test', {
      method: 'POST',
      body: { to: 'student@example.com', type: 'test' },
    });
    assert(testEmailRes.status === 200, `POST /api/email/test returns 200 (actual: ${testEmailRes.status})`);
    assert(testEmailRes.data?.success === true, 'Test email API response success: true');
    assert(Boolean(testEmailRes.data?.data?.messageId), `Generated message ID: ${testEmailRes.data?.data?.messageId}`);

    // 3.2 Welcome Email
    const welcomeEmailRes = await request('/email/test', {
      method: 'POST',
      body: { to: 'newstudent@example.com', type: 'welcome' },
    });
    assert(welcomeEmailRes.status === 200, 'Welcome email dispatch returns 200');
    assert(welcomeEmailRes.data?.data?.type === 'welcome_registration', 'Logged type is welcome_registration');

    // 3.3 Contact Form Email
    const contactEmailRes = await request('/email/test', {
      method: 'POST',
      body: { to: 'inquiry@example.com', type: 'contact' },
    });
    assert(contactEmailRes.status === 200, 'Contact email dispatch returns 200');
    assert(contactEmailRes.data?.data?.adminResult?.success === true, 'Contact notification sent to admin');
    assert(contactEmailRes.data?.data?.userResult?.success === true, 'Contact receipt confirmation sent to user');

    // 3.4 Course Enrollment Email
    const enrollmentEmailRes = await request('/email/test', {
      method: 'POST',
      body: { to: 'learner@example.com', type: 'enrollment' },
    });
    assert(enrollmentEmailRes.status === 200, 'Enrollment email dispatch returns 200');
    assert(enrollmentEmailRes.data?.data?.studentResult?.success === true, 'Enrollment confirmation sent to student');
    assert(enrollmentEmailRes.data?.data?.adminResult?.success === true, 'Enrollment alert sent to admin');

    // 3.5 Password Reset Email
    const resetEmailRes = await request('/email/test', {
      method: 'POST',
      body: { to: 'forgotuser@example.com', type: 'reset' },
    });
    assert(resetEmailRes.status === 200, 'Password reset email dispatch returns 200');
    assert(resetEmailRes.data?.data?.type === 'password_reset', 'Logged type is password_reset');

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 4: Forgot Password Flow Integration ---');
    // -------------------------------------------------------------
    const forgotRes = await request('/auth/forgot-password', {
      method: 'POST',
      body: { email: 'jatinsharma932002@gmail.com' },
    });
    assert(forgotRes.status === 200, 'POST /api/auth/forgot-password returns 200');
    assert(forgotRes.data?.success === true, 'Forgot password response success: true');

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 5: PostgreSQL Email Logs Verification ---');
    // -------------------------------------------------------------
    const logsRes = await query('SELECT id, type, recipient, subject, status FROM email_logs ORDER BY created_at DESC LIMIT 5');
    assert(logsRes.rows.length >= 5, `Database email_logs has recorded dispatches (found ${logsRes.rows.length})`);
    const types = logsRes.rows.map(r => r.type);
    console.log('  📊 Recent database email logs:', logsRes.rows.map(r => `${r.type} -> ${r.recipient} (${r.status})`));
    assert(types.includes('password_reset'), 'Found password_reset in email_logs table');

    console.log(`\n========================================`);
    console.log(`Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  } finally {
    server.close();
  }
}

runEmailTests();
