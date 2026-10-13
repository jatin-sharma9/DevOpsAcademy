import http from 'http';
import app from './app.js';
import { Course } from './src/models/courseModel.js';
import { Lesson } from './src/models/lessonModel.js';
import { query } from './src/config/db.js';

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

async function runMissingApisTests() {
  console.log('🧪 Starting Phase 2: Missing APIs Verification Suite...\n');

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));

  try {
    // 0. Admin & Student Login
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: { identifier: 'Jatin_Sharma', password: 'J@tinS93' },
    });
    const adminToken = loginRes.data?.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };
    assert(!!adminToken, 'Admin authentication verified');

    const studentLoginRes = await request('/auth/login', {
      method: 'POST',
      body: { identifier: 'jatin', password: 'user123' },
    });
    const studentToken = studentLoginRes.data?.token;
    const studentUser = studentLoginRes.data?.user;
    const studentHeaders = { Authorization: `Bearer ${studentToken}` };
    assert(!!studentToken, 'Student authentication verified');

    // Retrieve sample course & lesson
    const courses = await Course.findAll();
    assert(courses.length > 0, `Found courses in database (total: ${courses.length})`);
    const testCourse = courses[0];

    const lessons = await Lesson.findAllByCourseId(testCourse.id);
    let testLesson = lessons[0];
    if (!testLesson) {
      testLesson = await Lesson.create({
        courseId: testCourse.id,
        title: 'CI/CD Pipeline Fundamentals',
        content: 'Overview of continuous integration runners and build agents.',
      });
    }
    assert(!!testLesson, `Found lesson for testing (Lesson ID: ${testLesson.id})`);

    // =========================================================================
    console.log('\n--- TEST SUITE 1: Quiz Attempts API ---');
    // =========================================================================

    // 1.1 Unauthenticated attempt submission
    const unauthQuizRes = await request('/quizzes/attempts', {
      method: 'POST',
      body: { quizId: 'k8s-pod-networking', score: 80 },
    });
    assert(unauthQuizRes.status === 401, 'POST /api/quizzes/attempts without token returns 401 Unauthorized');

    // 1.2 Invalid score & percentage validation
    const invalidScoreRes = await request('/quizzes/attempts', {
      method: 'POST',
      headers: adminHeaders,
      body: { quizId: 'k8s-pod-networking', score: 120 },
    });
    assert(invalidScoreRes.status === 400, 'POST /api/quizzes/attempts with score > 100 returns 400 Bad Request');
    assert(invalidScoreRes.data?.success === false, 'Invalid score response has success: false');

    const invalidPercentageRes = await request('/quizzes/attempts', {
      method: 'POST',
      headers: adminHeaders,
      body: { quizId: 'k8s-pod-networking', score: 80, percentage: 150 },
    });
    assert(invalidPercentageRes.status === 400, 'POST /api/quizzes/attempts with percentage > 100 returns 400');

    // 1.3 Record passing quiz attempt with answers and percentage
    const quizAttemptRes = await request('/quizzes/attempts', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        quizId: 'k8s-pod-networking',
        courseId: testCourse.id,
        score: 90,
        totalQuestions: 10,
        correctCount: 9,
        percentage: 90.0,
        answers: {
          q1: 'Calico BGP routing',
          q2: 'CoreDNS service resolution',
          q3: 'Kube-proxy iptables mode'
        }
      },
    });
    assert(quizAttemptRes.status === 201, 'POST /api/quizzes/attempts returns 201 Created');
    assert(quizAttemptRes.data?.success === true, 'Quiz attempt response success: true');
    assert(quizAttemptRes.data?.data?.quiz_id === 'k8s-pod-networking', 'Stored quiz_id matches');
    assert(quizAttemptRes.data?.data?.score === 90, 'Stored score is 90');
    assert(quizAttemptRes.data?.data?.passed === true, 'Passed flag auto-set to true for score >= 70');
    assert(typeof quizAttemptRes.data?.data?.answers === 'object', 'Quiz attempt stored answers object');
    assert(quizAttemptRes.data?.data?.answers?.q1 === 'Calico BGP routing', 'Stored answer key q1 verified');
    assert(quizAttemptRes.data?.data?.percentage === 90, 'Stored percentage matches 90');
    assert(!!quizAttemptRes.data?.data?.created_at, 'Quiz attempt timestamp created_at recorded');

    // 1.4 Record second failing attempt for stats testing
    await request('/quizzes/attempts', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        quizId: 'k8s-pod-networking',
        courseId: testCourse.id,
        score: 50,
        totalQuestions: 10,
        correctCount: 5,
      },
    });

    // 1.5 Get current user's attempts
    const myAttemptsRes = await request('/quizzes/my-attempts?quizId=k8s-pod-networking', {
      headers: adminHeaders,
    });
    assert(myAttemptsRes.status === 200, 'GET /api/quizzes/my-attempts returns 200 OK');
    assert(myAttemptsRes.data?.success === true, 'My attempts response success: true');
    assert(Array.isArray(myAttemptsRes.data?.data) && myAttemptsRes.data.data.length >= 2, `Retrieved ${myAttemptsRes.data?.data?.length} user attempts`);
    assert(!!myAttemptsRes.data.data[0].course_title, 'Joined course_title is present');

    // 1.6 Get aggregate quiz stats
    const statsRes = await request('/quizzes/k8s-pod-networking/stats');
    assert(statsRes.status === 200, 'GET /api/quizzes/:quizId/stats returns 200 OK');
    assert(statsRes.data?.success === true, 'Stats response success: true');
    assert(statsRes.data?.data?.totalAttempts >= 2, `Total attempts recorded: ${statsRes.data?.data?.totalAttempts}`);
    assert(typeof statsRes.data?.data?.averageScore === 'number', `Average score calculated: ${statsRes.data?.data?.averageScore}`);
    assert(typeof statsRes.data?.data?.passRate === 'number', `Pass rate calculated: ${statsRes.data?.data?.passRate}%`);
    assert(Array.isArray(statsRes.data?.data?.recentAttempts), 'Recent attempts array returned');

    // =========================================================================
    console.log('\n--- TEST SUITE 2: Lesson Notes API ---');
    // =========================================================================

    // 2.1 Unauthenticated notes access
    const unauthNoteRes = await request(`/lessons/${testLesson.id}/notes`);
    assert(unauthNoteRes.status === 401, 'GET /api/lessons/:lessonId/notes without token returns 401');

    // 2.2 Upsert note (create initial note)
    const saveNoteRes = await request(`/lessons/${testLesson.id}/notes`, {
      method: 'PUT',
      headers: adminHeaders,
      body: {
        content: '# Kubernetes CNI\nFlannel uses VXLAN overlay; Calico uses BGP routing.',
      },
    });
    assert(saveNoteRes.status === 200, 'PUT /api/lessons/:lessonId/notes returns 200 OK');
    assert(saveNoteRes.data?.success === true, 'Save note response success: true');
    assert(saveNoteRes.data?.data?.content.includes('Flannel uses VXLAN'), 'Note content saved accurately');
    assert(saveNoteRes.data?.data?.lesson_id === testLesson.id, 'Associated lesson_id matches');

    // 2.3 Retrieve note
    const getNoteRes = await request(`/lessons/${testLesson.id}/notes`, {
      headers: adminHeaders,
    });
    assert(getNoteRes.status === 200, 'GET /api/lessons/:lessonId/notes returns 200 OK');
    assert(getNoteRes.data?.data?.content.includes('Calico uses BGP'), 'Retrieved note content matches saved text');
    assert(!!getNoteRes.data?.data?.lesson_title, 'Joined lesson_title is returned');

    // 2.4 Update note (upsert overwrite)
    const updateNoteRes = await request(`/lessons/${testLesson.id}/notes`, {
      method: 'PUT',
      headers: adminHeaders,
      body: {
        content: '# Kubernetes CNI (Updated)\nCilium provides eBPF data-plane performance.',
      },
    });
    assert(updateNoteRes.status === 200, 'PUT /api/lessons/:lessonId/notes update returns 200 OK');
    assert(updateNoteRes.data?.data?.content.includes('Cilium provides eBPF'), 'Note updated successfully via upsert');

    // 2.5 Delete note
    const delNoteRes = await request(`/lessons/${testLesson.id}/notes`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    assert(delNoteRes.status === 200, 'DELETE /api/lessons/:lessonId/notes returns 200 OK');
    assert(delNoteRes.data?.success === true, 'Delete note response success: true');

    // Verify deletion
    const verifyDelNoteRes = await request(`/lessons/${testLesson.id}/notes`, {
      headers: adminHeaders,
    });
    assert(verifyDelNoteRes.data?.data === null, 'Subsequent GET returns data: null after deletion');

    // 2.6 User Isolation: Verify Student and Admin notes are strictly segregated
    // Student creates their note
    const studentNoteRes = await request(`/lessons/${testLesson.id}/notes`, {
      method: 'PUT',
      headers: studentHeaders,
      body: { content: '# Student Secret Notes\nPrivate study annotations.' },
    });
    assert(studentNoteRes.status === 200, 'Student PUT /api/lessons/:lessonId/notes returns 200 OK');

    // Admin attempts to view note for this lesson (must return null, cannot see student note)
    const adminCheckStudentNoteRes = await request(`/lessons/${testLesson.id}/notes`, {
      headers: adminHeaders,
    });
    assert(adminCheckStudentNoteRes.data?.data === null, 'Admin GET /api/lessons/:lessonId/notes cannot access student private notes');

    // Student can view their note
    const studentViewRes = await request(`/lessons/${testLesson.id}/notes`, {
      headers: studentHeaders,
    });
    assert(studentViewRes.data?.data?.content.includes('Student Secret Notes'), 'Student successfully views their own note');

    // Student cleans up their note
    await request(`/lessons/${testLesson.id}/notes`, {
      method: 'DELETE',
      headers: studentHeaders,
    });

    // =========================================================================
    console.log('\n--- TEST SUITE 3: Course Reviews API ---');
    // =========================================================================

    // 3.1 Validation: Invalid rating (< 1 or > 5)
    const invalidRatingRes = await request(`/courses/${testCourse.id}/reviews`, {
      method: 'POST',
      headers: adminHeaders,
      body: { rating: 6, reviewText: 'Too high' },
    });
    assert(invalidRatingRes.status === 400, 'POST /api/courses/:courseId/reviews with rating > 5 returns 400');
    assert(invalidRatingRes.data?.success === false, 'Invalid rating has success: false');

    // 3.2 Submit course review (using course ID)
    const createReviewRes = await request(`/courses/${testCourse.id}/reviews`, {
      method: 'POST',
      headers: adminHeaders,
      body: {
        rating: 5,
        reviewText: 'Exceptional hands-on curriculum! The Kubernetes troubleshooting labs were practical.',
      },
    });
    assert(createReviewRes.status === 201, 'POST /api/courses/:courseId/reviews returns 201 Created');
    assert(createReviewRes.data?.success === true, 'Create review response success: true');
    assert(createReviewRes.data?.data?.rating === 5, 'Stored review rating is 5');
    assert(createReviewRes.data?.data?.username === 'Jatin_Sharma', 'Review author username resolved');
    const createdReviewId = createReviewRes.data?.data?.id;

    // 3.3 Public fetch course reviews (also supports slug!)
    const getReviewsRes = await request(`/courses/${testCourse.slug}/reviews`);
    assert(getReviewsRes.status === 200, `GET /api/courses/${testCourse.slug}/reviews returns 200 OK`);
    assert(getReviewsRes.data?.success === true, 'Course reviews response success: true');
    assert(Array.isArray(getReviewsRes.data?.data), 'Reviews returned in data array');
    assert(getReviewsRes.data?.stats?.totalReviews >= 1, `Stats totalReviews: ${getReviewsRes.data?.stats?.totalReviews}`);
    assert(getReviewsRes.data?.stats?.averageRating >= 4.0, `Stats averageRating: ${getReviewsRes.data?.stats?.averageRating}`);
    assert(typeof getReviewsRes.data?.stats?.distribution === 'object', 'Rating distribution breakdown returned');

    // 3.4 Admin Review Moderation: Hide review (isApproved = false)
    const hideReviewRes = await request(`/admin/reviews/${createdReviewId}/moderate`, {
      method: 'PUT',
      headers: adminHeaders,
      body: { isApproved: false },
    });
    assert(hideReviewRes.status === 200, 'PUT /api/admin/reviews/:id/moderate returns 200 OK');
    assert(hideReviewRes.data?.data?.is_approved === false, 'Review is_approved set to false');

    // Verify review hidden from public listing
    const publicAfterHideRes = await request(`/courses/${testCourse.id}/reviews`);
    const foundHidden = publicAfterHideRes.data?.data?.some((r) => r.id === createdReviewId);
    assert(foundHidden === false, 'Moderated (unapproved) review is excluded from public course reviews');

    // 3.5 Admin Review Moderation: Re-approve review (isApproved = true)
    const approveReviewRes = await request(`/admin/reviews/${createdReviewId}/moderate`, {
      method: 'PUT',
      headers: adminHeaders,
      body: { isApproved: true },
    });
    assert(approveReviewRes.status === 200, 'PUT /api/admin/reviews/:id/moderate re-approve returns 200 OK');
    assert(approveReviewRes.data?.data?.is_approved === true, 'Review is_approved restored to true');

    // 3.6 Admin: List all platform reviews
    const adminReviewsListRes = await request('/admin/reviews', { headers: adminHeaders });
    assert(adminReviewsListRes.status === 200, 'GET /api/admin/reviews returns 200 OK');
    assert(Array.isArray(adminReviewsListRes.data?.data), 'Admin reviews array returned');

    // 3.7 Admin: Delete test review
    const delReviewRes = await request(`/admin/reviews/${createdReviewId}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    assert(delReviewRes.status === 200, 'DELETE /api/admin/reviews/:id returns 200 OK');
    assert(delReviewRes.data?.success === true, 'Review deleted successfully');

    // 3.8 Enrollment Enforcement: Unenrolled student cannot submit review
    if (studentUser?.id) {
      await query('DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentUser.id, testCourse.id]);
    }
    const unenrolledReviewRes = await request(`/courses/${testCourse.id}/reviews`, {
      method: 'POST',
      headers: studentHeaders,
      body: { rating: 5, reviewText: 'Unenrolled review attempt' },
    });
    assert(unenrolledReviewRes.status === 403, 'Unenrolled user review submission returns 403 Forbidden');
    assert(unenrolledReviewRes.data?.success === false, 'Unenrolled review response has success: false');

    // 3.9 Enroll student in testCourse
    const enrollRes = await request('/enrollments', {
      method: 'POST',
      headers: studentHeaders,
      body: { courseId: testCourse.id },
    });
    assert(enrollRes.status === 201 || enrollRes.status === 200, 'Student successfully enrolled in test course');

    // 3.10 Enrolled student submits review
    const enrolledReviewRes = await request(`/courses/${testCourse.id}/reviews`, {
      method: 'POST',
      headers: studentHeaders,
      body: { rating: 4, reviewText: 'Great course for beginners!' },
    });
    assert(enrolledReviewRes.status === 201, 'Enrolled student review submission returns 201 Created');
    assert(enrolledReviewRes.data?.success === true, 'Enrolled review response success: true');
    const studentReviewId = enrolledReviewRes.data?.data?.id;
    assert(!!studentReviewId, 'Student review ID received');

    // 3.11 Prevent duplicate reviews: Submitting again updates existing review
    const updateExistingReviewRes = await request(`/courses/${testCourse.id}/reviews`, {
      method: 'POST',
      headers: studentHeaders,
      body: { rating: 5, reviewText: 'Updated: Actually it is an exceptional 5-star course!' },
    });
    assert(updateExistingReviewRes.status === 201, 'Updating existing review returns 201 Created');
    assert(updateExistingReviewRes.data?.data?.id === studentReviewId, 'Review ID remained the same (updated, not duplicated)');
    assert(updateExistingReviewRes.data?.data?.rating === 5, 'Updated review rating is now 5');
    assert(updateExistingReviewRes.data?.data?.review_text.includes('exceptional 5-star'), 'Updated review text stored');

    // 3.12 Clean up student review & enrollment
    if (studentReviewId) {
      await request(`/admin/reviews/${studentReviewId}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
    }
    if (studentUser?.id) {
      await query('DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentUser.id, testCourse.id]);
    }

  } catch (error) {
    console.error('Missing APIs test suite failed:', error);
    failed++;
  } finally {
    server.close();
  }

  console.log('\n========================================');
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runMissingApisTests();
