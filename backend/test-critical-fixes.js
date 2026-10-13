import http from 'http';
import app from './app.js';
import { User } from './src/models/userModel.js';
import { Course } from './src/models/courseModel.js';
import { Lesson } from './src/models/lessonModel.js';

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

async function runCriticalFixesTests() {
  console.log('🧪 Starting Critical Backend Fixes Verification Suite...\n');

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));

  try {
    // 0. Admin Login
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: { identifier: 'Jatin_Sharma', password: 'J@tinS93' },
    });
    const adminToken = loginRes.data?.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };
    assert(!!adminToken, 'Admin authentication verified for test setup');

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 1: Deep Health & Readiness Probe ---');
    // -------------------------------------------------------------
    const healthRes = await request('/health');
    assert(healthRes.status === 200, 'GET /api/health returns 200 OK');
    assert(healthRes.data?.status === 'UP', 'Health status is UP');
    assert(healthRes.data?.database?.status === 'UP', 'PostgreSQL database status is UP');
    assert(typeof healthRes.data?.database?.latencyMs === 'number', `Database latency measured (${healthRes.data?.database?.latencyMs} ms)`);
    assert(typeof healthRes.data?.system?.memoryUsageMb === 'number', 'System memory diagnostics reported');

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 2: Course Partial Update Integrity ---');
    // -------------------------------------------------------------
    const allCourses = await Course.findAll();
    assert(allCourses.length > 0, `Courses available for testing (found ${allCourses.length})`);
    const targetCourse = allCourses[0];
    const originalTitle = targetCourse.title;
    const originalCategory = targetCourse.category;
    const originalDesc = targetCourse.description;

    // Perform partial update with ONLY price and is_pro (omitting title, category, description)
    const partialUpdateRes = await request(`/courses/${targetCourse.id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: {
        price: 89.95,
        isPro: true,
      },
    });

    assert(partialUpdateRes.status === 200, 'PUT /api/courses/:id partial update returns 200 OK');
    assert(partialUpdateRes.data?.success === true, 'Course partial update success = true');
    assert(partialUpdateRes.data?.data?.title === originalTitle, 'Original title was preserved without data wipeout');
    assert(partialUpdateRes.data?.data?.category === originalCategory, 'Original category was preserved without NOT NULL crash');
    assert(partialUpdateRes.data?.data?.description === originalDesc, 'Original description was preserved');
    assert(Number(partialUpdateRes.data?.data?.price) === 89.95, 'Updated price reflected correctly');

    // Restore course price
    await Course.update(targetCourse.id, { price: targetCourse.price, is_pro: targetCourse.is_pro });

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 3: Lesson Partial Update & Slug Generation ---');
    // -------------------------------------------------------------
    // Test 3.1: Create lesson without explicit slug (auto-slug generation)
    const createLessonRes = await request(`/courses/${targetCourse.id}/lessons`, {
      method: 'POST',
      headers: adminHeaders,
      body: {
        title: 'Linux Kernel cgroups and namespaces Deep Dive',
        content: '# Kernel Namespaces\nExploring PID, NET, and MNT namespaces.',
        duration_minutes: 35,
      },
    });

    assert(createLessonRes.status === 201, 'POST /api/courses/:id/lessons without slug returns 201 Created');
    assert(createLessonRes.data?.data?.slug === 'linux-kernel-cgroups-and-namespaces-deep-dive', 'Slug was automatically generated from title');
    const createdLessonId = createLessonRes.data?.data?.id;

    // Test 3.2: Partial update on lesson (only update duration_minutes)
    const partialLessonRes = await request(`/courses/${targetCourse.id}/lessons/${createdLessonId}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: {
        duration_minutes: 50,
      },
    });

    assert(partialLessonRes.status === 200, 'PUT /api/courses/:id/lessons/:id returns 200 OK');
    assert(partialLessonRes.data?.data?.slug === 'linux-kernel-cgroups-and-namespaces-deep-dive', 'Lesson slug preserved during partial update');
    assert(partialLessonRes.data?.data?.duration_minutes === 50, 'Lesson duration updated to 50');
    assert(partialLessonRes.data?.data?.content.includes('Kernel Namespaces'), 'Lesson content preserved without NULL wipeout');

    // Clean up created lesson
    await Lesson.delete(createdLessonId);

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 4: Certificate Verification Fix for Admin Hashes ---');
    // -------------------------------------------------------------
    // Issue a certificate with DEV- prefix
    const issueCertRes = await request('/admin/certificates', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        student: 'Jatin_Sharma',
        courseSlug: targetCourse.slug,
        score: '99%',
      },
    });

    assert(issueCertRes.status === 201, 'POST /api/admin/certificates returns 201');
    const certHash = issueCertRes.data?.data?.hash;
    const certDbId = issueCertRes.data?.data?.dbId;
    assert(certHash.startsWith('DEV-'), `Certificate generated with DEV- prefix (${certHash})`);

    // Public verification of DEV- hash
    const verifyRes = await request(`/enrollments/certificates/verify/${certHash}`);
    assert(verifyRes.status === 200, `GET /api/enrollments/certificates/verify/${certHash} returns 200 OK`);
    assert(verifyRes.data?.verified === true, 'Certificate verified = true');
    assert(verifyRes.data?.success === true, 'Certificate verification success = true');
    assert(verifyRes.data?.data?.certificateHash === certHash, 'Verified certificate hash matches issued hash');
    assert(verifyRes.data?.data?.studentName === 'Jatin_Sharma', 'Verified certificate recipient is Jatin_Sharma');

    // Clean up certificate
    if (certDbId) {
      await request(`/admin/certificates/${certDbId}`, { method: 'DELETE', headers: adminHeaders });
    }

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 5: Contact Error Response Standardization ---');
    // -------------------------------------------------------------
    const invalidContactRes = await request('/contact', {
      method: 'POST',
      body: { email: 'incomplete@example.com' }, // missing name, subject, message
    });

    assert(invalidContactRes.status === 400, 'POST /api/contact with missing fields returns 400');
    assert(invalidContactRes.data?.success === false, 'Contact error response has success: false');
    assert(typeof invalidContactRes.data?.message === 'string', 'Contact error has descriptive message');

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 6: Production Admin Password Security Check ---');
    // -------------------------------------------------------------
    const oldEnv = process.env.NODE_ENV;
    try {
      // In production, hardcoded admin passwords should NOT be accepted
      process.env.NODE_ENV = 'production';
      const prodCheck = await User.validatePassword('Admin@123', '$2a$10$nonmatchinghashdummy123456789012345678901234567890', { role: 'admin' });
      assert(prodCheck === false, 'Hardcoded default password bypass is blocked in production mode');

      // In development / test, it should work
      process.env.NODE_ENV = 'development';
      const devCheck = await User.validatePassword('Admin@123', '$2a$10$nonmatchinghashdummy123456789012345678901234567890', { role: 'admin' });
      assert(devCheck === true, 'Alternate admin password allowed for development/testing convenience');
    } finally {
      process.env.NODE_ENV = oldEnv;
    }

    // -------------------------------------------------------------
    console.log('\n--- TEST SUITE 7: Course Progress Integrity Check ---');
    // -------------------------------------------------------------
    const timestamp = Date.now();
    const studentUser = `integrity_${timestamp}`;
    const studentEmail = `integrity_${timestamp}@example.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: { username: studentUser, email: studentEmail, password: 'Password123!Secure' },
    });
    assert(regRes.status === 201, 'Student registered for progress integrity testing');
    const studentToken = regRes.data?.token;
    const studentHeaders = { Authorization: `Bearer ${studentToken}` };

    // Find a course that has at least 1 lesson
    let integrityCourse = null;
    let integrityLessons = [];
    for (const c of allCourses) {
      const lessons = await Lesson.findAllByCourseId(c.id);
      if (lessons.length > 0) {
        integrityCourse = c;
        integrityLessons = lessons;
        break;
      }
    }
    assert(!!integrityCourse, `Found course with lessons for testing (Course ID: ${integrityCourse?.id}, lessons: ${integrityLessons.length})`);

    // Enroll student in the course
    const enrollRes = await request('/enrollments', {
      method: 'POST',
      headers: studentHeaders,
      body: { courseId: integrityCourse.id },
    });
    assert(enrollRes.status === 201 || enrollRes.status === 200, `Student enrolled in ${integrityCourse.slug}`);

    // Test 7.1: Block unauthorized 100% progress submission without lesson completions
    const fraudRes = await request('/enrollments/progress', {
      method: 'PUT',
      headers: studentHeaders,
      body: { courseId: integrityCourse.id, progress: 100 },
    });
    assert(fraudRes.status === 400, 'PUT /api/enrollments/progress rejects progress: 100 without verified lessons (HTTP 400)');
    assert(fraudRes.data?.success === false, 'Fraudulent progress response has success: false');
    assert(fraudRes.data?.message?.includes('verified lesson completion'), 'Response explains verified lesson completion is required');

    // Test 7.2: Verify client cannot arbitrarily inflate progress (capped to verified progress)
    const inflateRes = await request('/enrollments/progress', {
      method: 'PUT',
      headers: studentHeaders,
      body: { courseId: integrityCourse.id, progress: 75 },
    });
    assert(inflateRes.status === 200, 'PUT /api/enrollments/progress responds 200 for sub-100 values');
    assert(inflateRes.data?.data?.progress === 0, 'Progress capped to 0% because 0 lessons have been verified');

    // Test 7.3: Verify unearned certificate is not available
    const prematureCertRes = await request(`/enrollments/courses/${integrityCourse.id}/certificate`, {
      headers: studentHeaders,
    });
    assert(prematureCertRes.status === 404 || prematureCertRes.data?.data === null, 'No verified certificate returned for uncompleted course');

    // Test 7.4: Legitimate lesson completion flow via POST /api/enrollments/lessons/complete
    const firstLesson = integrityLessons[0];
    const legitimateCompleteRes = await request('/enrollments/lessons/complete', {
      method: 'POST',
      headers: studentHeaders,
      body: { courseId: integrityCourse.id, lessonId: firstLesson.id },
    });
    assert(legitimateCompleteRes.status === 200, 'Legitimate POST /api/enrollments/lessons/complete succeeds');
    assert(legitimateCompleteRes.data?.data?.completedCount === 1, 'Completed count accurately incremented in database');
    const expectedProgress = Math.min(100, Math.round((1 / integrityLessons.length) * 100));
    assert(legitimateCompleteRes.data?.data?.progress === expectedProgress, `Progress accurately updated to verified ${expectedProgress}%`);

    // Clean up student lesson completion
    await Lesson.markIncomplete(regRes.data?.user?.id, firstLesson.id);


  } catch (error) {
    console.error('Critical fixes test error:', error);
    failed++;
  } finally {
    server.close();
  }

  console.log('\n========================================');
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runCriticalFixesTests();
