import http from 'http';
import app from './app.js';

let server;
const PORT = 5098;
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
  console.log('🧪 Starting Phase 2 Backend APIs & Category System Tests...\n');

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));

  try {
    // 0. Login as Admin
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        identifier: process.env.TEST_ADMIN_IDENTIFIER,
        password: process.env.TEST_ADMIN_PASSWORD,
      },
    });
    const adminToken = loginRes.data?.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };
    assert(!!adminToken, 'Admin login successfully retrieved JWT token');

    // 1. Categories Public GET
    console.log('\n--- TEST SUITE 1: Categories API ---');
    const catListRes = await request('/categories');
    assert(catListRes.status === 200, 'GET /api/categories returns 200 OK');
    assert(catListRes.data.success === true, 'Categories response success: true');
    assert(Array.isArray(catListRes.data.data) && catListRes.data.data.length >= 8, `Found ${catListRes.data.data.length} categories in database`);

    // Create Category (Admin)
    const newCatRes = await request('/categories', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        name: 'Service Mesh & Istio',
        slug: 'service-mesh',
        description: 'Advanced traffic routing, mutual TLS, and envoy sidecar proxies.',
        sort_order: 9,
      },
    });
    assert(newCatRes.status === 201, 'POST /api/categories returns 201 Created');
    assert(newCatRes.data.data.slug === 'service-mesh', 'Created category slug is service-mesh');
    const createdCatId = newCatRes.data.data.id;

    // Update Category
    const updateCatRes = await request(`/categories/${createdCatId}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: {
        name: 'Service Mesh & Envoy',
        description: 'Updated description for service mesh curriculum.',
      },
    });
    assert(updateCatRes.status === 200, 'PUT /api/categories/:id returns 200 OK');
    assert(updateCatRes.data.data.name === 'Service Mesh & Envoy', 'Updated category name correctly');

    // Delete Category
    const delCatRes = await request(`/categories/${createdCatId}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    assert(delCatRes.status === 200, 'DELETE /api/categories/:id returns 200 OK');

    // 2. Admin Certificates API
    console.log('\n--- TEST SUITE 2: Admin Certificates API ---');
    const certListRes = await request('/admin/certificates', { headers: adminHeaders });
    assert(certListRes.status === 200, 'GET /api/admin/certificates returns 200 OK');
    assert(certListRes.data.success === true, 'Certificates response success: true');

    // Issue certificate
    const issueCertRes = await request('/admin/certificates', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        student: 'Jatin_Sharma',
        courseSlug: 'kubernetes-in-action',
        score: '98%',
      },
    });
    assert(issueCertRes.status === 201, 'POST /api/admin/certificates returns 201 Created');
    assert(issueCertRes.data.data.hash.startsWith('DEV-'), 'Generated certificate has cryptographic DEV- prefix');
    const createdCertId = issueCertRes.data.data.dbId;

    // Delete certificate
    const delCertRes = await request(`/admin/certificates/${createdCertId}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    assert(delCertRes.status === 200, 'DELETE /api/admin/certificates/:id returns 200 OK');

    // 3. Admin Analytics API
    console.log('\n--- TEST SUITE 3: Admin Analytics API ---');
    const analyticsRes = await request('/admin/analytics', { headers: adminHeaders });
    assert(analyticsRes.status === 200, 'GET /api/admin/analytics returns 200 OK');
    assert(Array.isArray(analyticsRes.data?.data?.weekly), 'Analytics contains weekly metrics array');
    assert(Array.isArray(analyticsRes.data?.data?.funnel), 'Analytics contains conversion funnel array');

    // 4. Admin Email Settings API
    console.log('\n--- TEST SUITE 4: Admin Email Settings API ---');
    const emailSettingsRes = await request('/admin/email/settings', { headers: adminHeaders });
    assert(emailSettingsRes.status === 200, 'GET /api/admin/email/settings returns 200 OK');
    assert(emailSettingsRes.data.data.admin_email === 'jatinsharma932002@gmail.com', 'Email settings admin email matches');

    const saveSettingsRes = await request('/admin/email/settings', {
      method: 'PUT',
      headers: adminHeaders,
      body: {
        notify_on_support: true,
        notify_on_registration: true,
      },
    });
    assert(saveSettingsRes.status === 200, 'PUT /api/admin/email/settings returns 200 OK');
    assert(saveSettingsRes.data.success === true, 'Saved email settings successfully');

  } catch (error) {
    console.error('Test execution failed:', error);
    failed++;
  } finally {
    server.close();
  }

  console.log('\n========================================');
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
