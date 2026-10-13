import http from 'http';
import app from './app.js';

let server;
const PORT = 5099;
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

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data, headers: res.headers };
}

async function runPhase4E2ETests() {
  console.log('🧪 Starting Phase 4: Production Deployment & E2E Readiness Tests...\n');

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));

  try {
    const timestamp = Date.now();
    const student1User = `student1_${timestamp}`;
    const student1Email = `student1_${timestamp}@example.com`;
    const student2User = `student2_${timestamp}`;
    const student2Email = `student2_${timestamp}@example.com`;
    const password = 'Password123!Secure';

    // =========================================================================
    // SECTION 1: AUTHENTICATED STUDENT LIFECYCLE
    // =========================================================================
    console.log('\n--- 1. Authenticated Student User Lifecycle ---');

    // 1.1 Registration
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: { username: student1User, email: student1Email, password },
    });
    assert(regRes.status === 201, `Student 1 registered (HTTP 201)`);
    assert(!!regRes.data.token, 'Student 1 received JWT token on registration');
    const student1Token = regRes.data.token;
    const student1Headers = { Authorization: `Bearer ${student1Token}` };

    // 1.2 Login
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: { identifier: student1Email, password },
    });
    assert(loginRes.status === 200, 'Student 1 login succeeded (HTTP 200)');
    assert(loginRes.data.user.email === student1Email, 'Login returned correct student profile');

    // 1.3 Course Browsing
    const coursesRes = await request('/courses');
    assert(coursesRes.status === 200, 'Courses listed successfully (HTTP 200)');
    assert(Array.isArray(coursesRes.data.data) && coursesRes.data.data.length > 0, `Found ${coursesRes.data.data.length} courses`);
    const course = coursesRes.data.data[0];
    const courseId = course.id;
    const courseSlug = course.slug;

    // 1.4 Course Enrollment
    const enrollRes = await request('/enrollments', {
      method: 'POST',
      headers: student1Headers,
      body: { courseId },
    });
    assert(enrollRes.status === 201 || enrollRes.status === 200, `Student 1 enrolled in course ${courseSlug}`);

    // 1.5 Course Lessons Access
    const lessonsRes = await request(`/courses/${courseId}/lessons`, { headers: student1Headers });
    assert(lessonsRes.status === 200, 'Course lessons retrieved (HTTP 200)');
    const lessons = lessonsRes.data.data;
    assert(Array.isArray(lessons) && lessons.length > 0, `Course has ${lessons.length} lessons`);
    const lessonId = lessons[0].id;

    // 1.6 Mark All Lessons Completion (Achieve 100% Track Mastery)
    for (const l of lessons) {
      await request('/enrollments/lessons/complete', {
        method: 'POST',
        headers: student1Headers,
        body: { courseId, lessonId: l.id },
      });
    }
    const progressRes = await request(`/enrollments/courses/${courseId}/progress`, { headers: student1Headers });
    assert(progressRes.status === 200, 'Course progress retrieved (HTTP 200)');
    assert(progressRes.data.data?.progress === 100, 'Student achieved 100% course completion');

    // 1.7 Lesson Notes (Create, Read, Update, Delete)
    const noteContent = `Comprehensive notes for lesson ${lessonId} created at ${new Date().toISOString()}`;
    const saveNoteRes = await request(`/lessons/${lessonId}/notes`, {
      method: 'PUT',
      headers: student1Headers,
      body: { content: noteContent },
    });
    assert(saveNoteRes.status === 200, 'Lesson note created/updated (HTTP 200)');

    const getNoteRes = await request(`/lessons/${lessonId}/notes`, { headers: student1Headers });
    assert(getNoteRes.status === 200, 'Lesson note fetched (HTTP 200)');
    assert(getNoteRes.data.data?.content === noteContent, 'Lesson note content matches persisted data');

    // 1.8 Quiz Submission
    const quizId = `${courseSlug}-fundamentals-quiz`;
    const quizPayload = {
      quizId,
      courseId,
      score: 95,
      percentage: 95.0,
      passed: true,
      totalQuestions: 10,
      correctCount: 9,
      answers: { q1: 'a', q2: 'b', q3: 'c', q4: 'd', q5: 'a', q6: 'b', q7: 'c', q8: 'd', q9: 'a', q10: 'b' },
    };
    const submitQuizRes = await request('/quizzes/attempts', {
      method: 'POST',
      headers: student1Headers,
      body: quizPayload,
    });
    assert(submitQuizRes.status === 201, 'Quiz attempt submitted to PostgreSQL (HTTP 201)');
    assert(submitQuizRes.data.data.score === 95, 'Quiz attempt score saved correctly');

    // 1.9 Quiz Attempt History
    const historyRes = await request(`/quizzes/my-attempts?quizId=${quizId}`, { headers: student1Headers });
    assert(historyRes.status === 200, 'Student quiz history retrieved (HTTP 200)');
    assert(Array.isArray(historyRes.data.data) && historyRes.data.data.length >= 1, 'Quiz attempt found in history');
    assert(historyRes.data.data[0].score === 95, 'Quiz history reflects 95% score');

    // 1.10 Course Review (Submission & Update)
    const reviewPayload = {
      rating: 5,
      reviewText: 'Outstanding course with production-grade architecture and hands-on labs!',
    };
    const submitReviewRes = await request(`/courses/${courseId}/reviews`, {
      method: 'POST',
      headers: student1Headers,
      body: reviewPayload,
    });
    assert(submitReviewRes.status === 201 || submitReviewRes.status === 200, 'Course review submitted (HTTP 200/201)');

    const getReviewsRes = await request(`/courses/${courseId}/reviews`);
    assert(getReviewsRes.status === 200, 'Course reviews retrieved (HTTP 200)');
    assert(getReviewsRes.data.stats.totalReviews >= 1, 'Review stats aggregate recorded review');
    assert(getReviewsRes.data.stats.averageRating >= 4.0, 'Review stats calculate correct average');

    // Update the review
    const updateReviewRes = await request(`/courses/${courseId}/reviews`, {
      method: 'POST',
      headers: student1Headers,
      body: { rating: 5, reviewText: 'Updated review: highly recommended for all DevOps engineers!' },
    });
    assert(updateReviewRes.status === 201 || updateReviewRes.status === 200, 'Course review updated successfully (HTTP 200/201)');

    // 1.11 Certificate Generation / Verification
    const certGenRes = await request(`/enrollments/courses/${courseId}/certificate`, {
      headers: student1Headers,
    });
    assert(certGenRes.status === 200 || certGenRes.status === 201, 'Certificate generated/retrieved for completed student');
    const certHash = certGenRes.data?.data?.certificate_hash || certGenRes.data?.data?.hash;
    if (certHash) {
      const certVerifyRes = await request(`/enrollments/certificates/verify/${certHash}`);
      assert(certVerifyRes.status === 200, `Certificate hash ${certHash} cryptographically verified`);
    }

    // =========================================================================
    // SECTION 2: GUEST / UNAUTHENTICATED & RBAC BOUNDARIES
    // =========================================================================
    console.log('\n--- 2. Guest User & Authorization Boundaries ---');

    // 2.1 Public APIs allow guest access
    const guestCourses = await request('/courses');
    assert(guestCourses.status === 200, 'Guest can browse courses');

    const guestReviews = await request(`/courses/${courseId}/reviews`);
    assert(guestReviews.status === 200, 'Guest can view public reviews and rating breakdown');

    // 2.2 Protected APIs reject unauthenticated guests
    const guestNotes = await request(`/lessons/${lessonId}/notes`);
    assert(guestNotes.status === 401, 'Guest accessing /notes returns 401 Unauthorized');

    const guestQuiz = await request('/quizzes/attempts', { method: 'POST', body: quizPayload });
    assert(guestQuiz.status === 401, 'Guest submitting quiz attempt returns 401 Unauthorized');

    const guestReview = await request(`/courses/${courseId}/reviews`, { method: 'POST', body: reviewPayload });
    assert(guestReview.status === 401, 'Guest submitting review returns 401 Unauthorized');

    // =========================================================================
    // SECTION 3: USER ISOLATION VERIFICATION
    // =========================================================================
    console.log('\n--- 3. User Data Isolation Verification ---');

    // Register Student 2
    const reg2Res = await request('/auth/register', {
      method: 'POST',
      body: { username: student2User, email: student2Email, password },
    });
    const student2Token = reg2Res.data.token;
    const student2Headers = { Authorization: `Bearer ${student2Token}` };

    // Student 2 accesses lesson notes for lessonId: must NOT receive Student 1's note
    const student2Notes = await request(`/lessons/${lessonId}/notes`, { headers: student2Headers });
    assert(student2Notes.status === 200, 'Student 2 requests notes (HTTP 200)');
    assert(student2Notes.data.data === null || student2Notes.data.data?.content !== noteContent, 'Student 2 does NOT see Student 1 private note');

    // Student 2 attempts to review course without being enrolled: must receive 403 Forbidden
    const unenrolledReview = await request(`/courses/${courseId}/reviews`, {
      method: 'POST',
      headers: student2Headers,
      body: reviewPayload,
    });
    assert(unenrolledReview.status === 403, 'Unenrolled Student 2 submitting review returns 403 Forbidden');

    // Student 2 checks my-attempts: must NOT see Student 1's quiz attempt
    const student2QuizHistory = await request(`/quizzes/my-attempts?quizId=${quizId}`, { headers: student2Headers });
    assert(student2QuizHistory.status === 200, 'Student 2 checks quiz history (HTTP 200)');
    const s2Attempts = student2QuizHistory.data.data || [];
    assert(s2Attempts.length === 0, 'Student 2 does NOT see Student 1 quiz attempt (complete isolation)');

    // =========================================================================
    // SECTION 4: ADMIN LIFECYCLE & PRIVILEGE ENFORCEMENT
    // =========================================================================
    console.log('\n--- 4. Admin Lifecycle & Role-Based Access Control (RBAC) ---');

    // 4.1 Admin Login
    const adminLoginRes = await request('/auth/login', {
      method: 'POST',
      body: { identifier: 'Jatin_Sharma', password: 'J@tinS93' },
    });
    assert(adminLoginRes.status === 200, 'Admin login succeeded (HTTP 200)');
    const adminToken = adminLoginRes.data?.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };
    assert(adminLoginRes.data?.user?.role === 'admin', 'Admin user role is "admin"');

    // 4.2 Admin Dashboard Stats
    const statsRes = await request('/admin/stats', { headers: adminHeaders });
    assert(statsRes.status === 200, 'Admin accessed /api/admin/stats (HTTP 200)');
    assert(typeof statsRes.data?.stats?.totalUsers === 'number', 'Admin stats contains totalUsers metric');

    // 4.3 User Management
    const usersRes = await request('/users', { headers: adminHeaders });
    assert(usersRes.status === 200, 'Admin accessed /api/users (HTTP 200)');
    assert(Array.isArray(usersRes.data.data), 'Admin received users list array');

    // 4.4 Analytics
    const analyticsRes = await request('/admin/analytics', { headers: adminHeaders });
    assert(analyticsRes.status === 200, 'Admin accessed /api/admin/analytics (HTTP 200)');

    // 4.5 Email Settings
    const emailSettingsRes = await request('/admin/email/settings', { headers: adminHeaders });
    assert(emailSettingsRes.status === 200, 'Admin accessed /api/admin/email/settings (HTTP 200)');

    // 4.6 Audit Logs
    const auditLogsRes = await request('/admin/audit-logs', { headers: adminHeaders });
    assert(auditLogsRes.status === 200, 'Admin accessed /api/admin/audit-logs (HTTP 200)');

    // 4.7 RBAC: Verify normal student CANNOT access admin endpoints
    const studentStats = await request('/admin/stats', { headers: student1Headers });
    assert(studentStats.status === 403, 'Student accessing /api/admin/stats returns 403 Forbidden');

    const studentUsers = await request('/users', { headers: student1Headers });
    assert(studentUsers.status === 403, 'Student accessing /api/users returns 403 Forbidden');

    const studentAudit = await request('/admin/audit-logs', { headers: student1Headers });
    assert(studentAudit.status === 403, 'Student accessing /api/admin/audit-logs returns 403 Forbidden');

    // =========================================================================
    // SECTION 5: PROMETHEUS METRICS SPECIFICATION
    // =========================================================================
    console.log('\n--- 5. Prometheus Observability Metrics Verification ---');

    const metricsRes = await request('/metrics');
    assert(metricsRes.status === 200, 'GET /api/metrics responds with HTTP 200 OK');
    const metricsText = typeof metricsRes.data === 'string' ? metricsRes.data : '';

    assert(metricsText.includes('http_requests_total'), 'Metrics includes http_requests_total counter');
    assert(metricsText.includes('http_request_duration_seconds'), 'Metrics includes request duration histogram');
    assert(metricsText.includes('devops_academy_entities_total'), 'Metrics includes platform entities total gauge');
    assert(metricsText.includes('devops_academy_process_cpu_user_seconds_total'), 'Metrics includes process CPU time metrics');
    assert(metricsText.includes('devops_academy_nodejs_heap_size_total_bytes'), 'Metrics includes Node.js heap memory metrics');

  } catch (error) {
    console.error('Test execution failed with error:', error);
    failed++;
  } finally {
    server.close();
  }

  console.log('\n==================================================');
  console.log(`📊 Phase 4 E2E Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('==================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runPhase4E2ETests();
