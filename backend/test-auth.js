import http from 'http';
import app from './app.js';
import { User } from './src/models/userModel.js';
import { verifyToken } from './src/utils/jwt.js';
import { closePool } from './src/config/db.js';

let server;
const PORT = 5099;
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

async function runTests() {
  console.log('🧪 Starting DevOps Academy Authentication & Admin Portal Tests...\n');

  // Start temporary server
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
    // Ensure default admin account exists
    console.log('--- TEST SUITE 1: Default Admin Account Verification ---');
    const adminUser = await User.ensureDefaultAdmin();
    assert(adminUser !== null, 'Default admin account exists in database');
    assert(adminUser.username === 'Jatin_Sharma', `Admin username is 'Jatin_Sharma' (actual: ${adminUser?.username})`);
    assert(adminUser.role === 'admin', `Admin role is 'admin' (actual: ${adminUser?.role})`);

    console.log('\n--- TEST SUITE 2: Admin Login Flow ---');
    // Test 2.1: Login with username 'Jatin_Sharma' and password 'J@tinS93'
    const loginUserRes = await request('/auth/login', {
      method: 'POST',
      body: { username: 'Jatin_Sharma', password: 'J@tinS93' },
    });
    assert(loginUserRes.status === 200, `Admin login by username returns 200 (actual: ${loginUserRes.status})`);
    assert(loginUserRes.data?.success === true, 'Admin login response has success = true');
    assert(typeof loginUserRes.data?.token === 'string', 'Admin login returns a valid JWT token string');
    assert(loginUserRes.data?.user?.username === 'Jatin_Sharma', 'Admin login returns user object with username Jatin_Sharma');
    assert(loginUserRes.data?.user?.role === 'admin', 'Admin login returns user object with role admin');
    assert(loginUserRes.data?.user?.password_hash === undefined, 'Sensitive password_hash is omitted from response');

    const adminToken = loginUserRes.data?.token;

    // Test 2.2: Login with email
    const loginEmailRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'jatinsharma932002@gmail.com', password: 'J@tinS93' },
    });
    assert(loginEmailRes.status === 200, 'Admin login by email returns 200');
    assert(loginEmailRes.data?.user?.username === 'Jatin_Sharma', 'Admin login by email resolves to Jatin_Sharma');

    // Test 2.3: Login with case-insensitive username 'jatin_sharma'
    const loginCaseRes = await request('/auth/login', {
      method: 'POST',
      body: { identifier: 'jatin_sharma', password: 'J@tinS93' },
    });
    assert(loginCaseRes.status === 200, 'Case-insensitive username login returns 200');

    // Test 2.4: Login with alternate allowed admin password 'Admin@123'
    const loginAltPassRes = await request('/auth/login', {
      method: 'POST',
      body: { username: 'Jatin_Sharma', password: 'Admin@123' },
    });
    assert(loginAltPassRes.status === 200, 'Admin login with Admin@123 returns 200');

    console.log('\n--- TEST SUITE 3: Invalid Credentials Handling ---');
    // Test 3.1: Wrong password
    const wrongPassRes = await request('/auth/login', {
      method: 'POST',
      body: { username: 'Jatin_Sharma', password: 'WrongPassword999!' },
    });
    assert(wrongPassRes.status === 401, `Wrong password returns 401 (actual: ${wrongPassRes.status})`);
    assert(wrongPassRes.data?.success === false, 'Wrong password has success = false');
    assert(wrongPassRes.data?.message === 'Invalid credentials', `Proper error message returned: '${wrongPassRes.data?.message}'`);

    // Test 3.2: Non-existent username
    const wrongUserRes = await request('/auth/login', {
      method: 'POST',
      body: { username: 'non_existent_user_99999', password: 'AnyPassword123' },
    });
    assert(wrongUserRes.status === 401, `Non-existent user returns 401 (actual: ${wrongUserRes.status})`);
    assert(wrongUserRes.data?.message === 'Invalid credentials', 'Non-existent user returns proper error message');

    // Test 3.3: Missing password
    const missingPassRes = await request('/auth/login', {
      method: 'POST',
      body: { username: 'Jatin_Sharma' },
    });
    assert(missingPassRes.status === 400, `Missing password returns 400 (actual: ${missingPassRes.status})`);

    // Test 3.4: Missing identifier
    const missingIdRes = await request('/auth/login', {
      method: 'POST',
      body: { password: 'SomePassword' },
    });
    assert(missingIdRes.status === 400, `Missing username/email returns 400 (actual: ${missingIdRes.status})`);

    console.log('\n--- TEST SUITE 4: JWT Token Generation & Validation ---');
    // Test 4.1: Decode and verify generated token
    const decoded = verifyToken(adminToken);
    assert(decoded.id === adminUser.id, `Token payload contains correct user id (${decoded.id})`);
    assert(decoded.username === 'Jatin_Sharma', `Token payload contains correct username (${decoded.username})`);
    assert(decoded.role === 'admin', `Token payload contains role 'admin' (${decoded.role})`);

    // Test 4.2: Protected /auth/me route with valid token
    const meRes = await request('/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(meRes.status === 200, `GET /api/auth/me returns 200 with valid token`);
    assert(meRes.data?.user?.username === 'Jatin_Sharma', 'GET /api/auth/me returns admin user data');

    // Test 4.3: Token verification endpoint /auth/verify
    const verifyRes = await request('/auth/verify', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(verifyRes.status === 200, `GET /api/auth/verify returns 200`);
    assert(verifyRes.data?.valid === true, 'GET /api/auth/verify reports valid = true');

    // Test 4.4: Invalid / forged token
    const invalidTokenRes = await request('/auth/me', {
      headers: { Authorization: 'Bearer forged.invalid.token' },
    });
    assert(invalidTokenRes.status === 401, `Forged token returns 401 (actual: ${invalidTokenRes.status})`);
    assert(invalidTokenRes.data?.message.includes('invalid'), 'Forged token returns invalid token message');

    // Test 4.5: Missing Authorization header
    const noTokenRes = await request('/auth/me');
    assert(noTokenRes.status === 401, `Missing token returns 401 (actual: ${noTokenRes.status})`);

    console.log('\n--- TEST SUITE 5: Role-Based Access Control (RBAC) ---');
    // Test 5.1: Admin accessing /api/admin/stats
    const adminStatsRes = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminStatsRes.status === 200, `Admin accessing /api/admin/stats returns 200 (actual: ${adminStatsRes.status})`);
    assert(adminStatsRes.data?.stats !== undefined, 'Admin stats endpoint returns stats payload');

    // Test 5.2: Admin accessing /api/users
    const adminUsersRes = await request('/users', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminUsersRes.status === 200, `Admin accessing /api/users returns 200 (actual: ${adminUsersRes.status})`);
    assert(Array.isArray(adminUsersRes.data?.data), 'Admin users endpoint returns array of users');

    // Test 5.3: Student login
    const studentLogin = await request('/auth/login', {
      method: 'POST',
      body: { username: 'jatin', password: 'user123' },
    });
    assert(studentLogin.status === 200, 'Student login returns 200');
    const studentToken = studentLogin.data?.token;
    assert(studentLogin.data?.user?.role === 'user', 'Student user has role = user');

    // Test 5.4: Student accessing /api/admin/stats (FORBIDDEN)
    const studentStatsRes = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(studentStatsRes.status === 403, `Student accessing /api/admin/stats returns 403 Forbidden (actual: ${studentStatsRes.status})`);
    assert(studentStatsRes.data?.success === false, 'Student access forbidden has success = false');

    // Test 5.5: Student accessing /api/users (FORBIDDEN)
    const studentUsersRes = await request('/users', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(studentUsersRes.status === 403, `Student accessing /api/users returns 403 Forbidden (actual: ${studentUsersRes.status})`);

    // Test 5.6: Unauthenticated access to /api/admin/stats
    const unauthStatsRes = await request('/admin/stats');
    assert(unauthStatsRes.status === 401, `Unauthenticated access to /api/admin/stats returns 401 (actual: ${unauthStatsRes.status})`);

    console.log('\n--- TEST SUITE 6: Registration & Role Provisioning Security ---');
    const testTimestamp = Date.now();

    // Test 6.1: Public self-registration with role 'admin' MUST be rejected with 403 Forbidden
    const adminRegisterRes = await request('/auth/register', {
      method: 'POST',
      body: {
        username: `admin_hack_${testTimestamp}`,
        email: `admin_hack_${testTimestamp}@example.com`,
        password: 'Password123!',
        role: 'admin',
      },
    });
    assert(adminRegisterRes.status === 403, `Public admin registration returns 403 Forbidden (actual: ${adminRegisterRes.status})`);
    assert(adminRegisterRes.data?.success === false, 'Public admin registration has success = false');
    assert(adminRegisterRes.data?.message?.includes('Administrator accounts cannot be registered publicly'), 'Helpful and secure admin policy message returned');

    // Test 6.2: Existing admin email re-registration MUST return 400 with duplicate email message
    const duplicateAdminEmailRes = await request('/auth/register', {
      method: 'POST',
      body: {
        username: `new_user_${testTimestamp}`,
        email: 'jatinsharma932002@gmail.com',
        password: 'Password123!',
      },
    });
    assert(duplicateAdminEmailRes.status === 400, `Duplicate admin email registration returns 400 (actual: ${duplicateAdminEmailRes.status})`);
    assert(duplicateAdminEmailRes.data?.message === 'Email is already registered', 'Proper duplicate email message returned');

    // Test 6.3: Existing admin username re-registration MUST return 400 with duplicate username message
    const duplicateAdminUsernameRes = await request('/auth/register', {
      method: 'POST',
      body: {
        username: 'Jatin_Sharma',
        email: `unique_${testTimestamp}@example.com`,
        password: 'Password123!',
      },
    });
    assert(duplicateAdminUsernameRes.status === 400, `Duplicate admin username registration returns 400 (actual: ${duplicateAdminUsernameRes.status})`);
    assert(duplicateAdminUsernameRes.data?.message === 'Username is already taken', 'Proper duplicate username message returned');

    // Test 6.4: Valid student registration succeeds with role 'user'
    const studentRegRes = await request('/auth/register', {
      method: 'POST',
      body: {
        username: `student_suite_${testTimestamp}`,
        email: `student_suite_${testTimestamp}@example.com`,
        password: 'Password123!',
        role: 'student',
      },
    });
    assert(studentRegRes.status === 201, `Student registration returns 201 Created (actual: ${studentRegRes.status})`);
    assert(studentRegRes.data?.user?.role === 'user', `Student registered with role 'user' (actual: ${studentRegRes.data?.user?.role})`);
    assert(typeof studentRegRes.data?.token === 'string', 'Student registration returns JWT token');

    // Test 6.5: Valid instructor registration succeeds with role 'instructor'
    const instructorRegRes = await request('/auth/register', {
      method: 'POST',
      body: {
        username: `instructor_suite_${testTimestamp}`,
        email: `instructor_suite_${testTimestamp}@example.com`,
        password: 'Password123!',
        role: 'instructor',
      },
    });
    assert(instructorRegRes.status === 201, `Instructor registration returns 201 Created (actual: ${instructorRegRes.status})`);
    assert(instructorRegRes.data?.user?.role === 'instructor', `Instructor registered with role 'instructor' (actual: ${instructorRegRes.data?.user?.role})`);

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
    if (server) {
      server.close();
    }
    await closePool();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
