import crypto from 'crypto';
import { Enrollment } from '../models/enrollmentModel.js';
import { Course } from '../models/courseModel.js';
import { Lesson } from '../models/lessonModel.js';
import { Certificate } from '../models/certificateModel.js';
import { Notification } from '../models/notificationModel.js';
import { emailService } from '../services/emailService.js';

/**
 * Enroll active student in a course
 * POST /api/enrollments
 */
export const enrollCourse = async (req, res) => {
  try {
    const { courseId: rawCourseId } = req.body;
    const courseId = parseInt(rawCourseId, 10);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({ success: false, message: 'Valid numeric Course ID is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const enrollment = await Enrollment.enroll(req.user.id, courseId);

    // Send email notification to admin & welcome email to student (non-blocking)
    emailService.sendEnrollmentEmails({
      studentName: req.user.username,
      studentEmail: req.user.email,
      courseTitle: course.title,
      courseSlug: course.slug,
    });

    // Save dashboard notification for admin
    await Notification.create({
      title: 'New Course Enrollment',
      message: `${req.user.username} (${req.user.email}) enrolled in "${course.title}"`,
      type: 'enrollment',
    });

    res.status(201).json({ success: true, message: 'Successfully enrolled in course', data: enrollment });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ success: false, message: 'Error enrolling in course' });
  }
};

/**
 * Get active student's enrollments
 * GET /api/enrollments/my
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findByUserId(req.user.id);
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    console.error('Get my enrollments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching enrollments' });
  }
};

/**
 * Update course progress (strictly bounded by verified lesson completions)
 * PUT /api/enrollments/progress
 */
export const updateProgress = async (req, res) => {
  try {
    const { courseId: rawCourseId, progress: rawProgress } = req.body;
    const courseId = parseInt(rawCourseId, 10);
    const progress = parseInt(rawProgress, 10);

    if (isNaN(courseId) || isNaN(progress)) {
      return res.status(400).json({ success: false, message: 'Course ID and numeric progress are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const boundedProgress = Math.max(0, Math.min(100, progress));

    // Verify against actual database lesson completions
    const lessons = await Lesson.findAllByCourseId(courseId);
    const completedLessons = await Lesson.getCompletedLessons(req.user.id, courseId);
    const totalLessons = lessons.length;
    const completedCount = completedLessons.length;
    const verifiedProgress = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    // Disallow marking a course complete (or setting 100% progress) without completing all lessons
    if (boundedProgress >= 100 && (totalLessons === 0 || completedCount < totalLessons)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark course as completed without verified lesson completion. Complete all course lessons first.',
        verifiedProgress,
        completedCount,
        totalLessons,
      });
    }

    // Ensure client-reported progress cannot exceed verified lesson progress when lessons exist
    const finalProgress = totalLessons > 0 ? Math.min(boundedProgress, verifiedProgress) : 0;

    const updated = await Enrollment.updateProgress(req.user.id, courseId, finalProgress);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, message: 'Error updating course progress' });
  }
};

/**
 * Get all enrollments across platform (Admin only)
 * GET /api/enrollments
 */
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll();
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    console.error('Get all enrollments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching all enrollments' });
  }
};

/**
 * Mark a lesson as complete and recalculate actual server-side progress
 * POST /api/enrollments/lessons/complete
 */
export const markLessonComplete = async (req, res) => {
  try {
    const { courseId: rawCourseId, lessonId: rawLessonId } = req.body;
    let courseId = parseInt(rawCourseId, 10);
    if (isNaN(courseId)) {
      const course = await Course.findBySlug(rawCourseId);
      if (course) courseId = course.id;
    }

    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: 'Valid Course ID or slug is required' });
    }

    const resolvedLesson = await Lesson.resolveLesson(courseId, rawLessonId);
    if (!resolvedLesson) {
      return res.status(404).json({ success: false, message: `Lesson '${rawLessonId}' not found for course` });
    }

    const lessonId = resolvedLesson.id;

    // Auto-enroll student if not enrolled yet
    const enrollments = await Enrollment.findByUserId(req.user.id);
    const isEnrolled = enrollments.some(e => e.course_id === courseId);
    if (!isEnrolled) {
      await Enrollment.enroll(req.user.id, courseId);
    }

    // Mark completion in database
    await Lesson.markComplete(req.user.id, lessonId);

    // Recalculate true lesson-based progress
    const lessons = await Lesson.findAllByCourseId(courseId);
    const completedLessons = await Lesson.getCompletedLessons(req.user.id, courseId);

    const totalLessons = lessons.length;
    const completedCount = completedLessons.length;
    const progress = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    // Update enrollment status
    const updatedEnrollment = await Enrollment.updateProgress(req.user.id, courseId, progress);

    // Generate cryptographic certificate if 100% complete
    let certificate = null;
    if (progress === 100 && totalLessons > 0) {
      const existingCert = await Certificate.findByUserAndCourse(req.user.id, courseId);
      if (!existingCert) {
        const hash = crypto.randomBytes(16).toString('hex');
        certificate = await Certificate.create(req.user.id, courseId, hash);
      } else {
        certificate = existingCert;
      }
    }

    const completedLessonIds = completedLessons.map(l => l.lesson_id);
    const completedIdentifiers = [];
    completedLessons.forEach(cl => {
      completedIdentifiers.push(String(cl.lesson_id));
      if (cl.slug) completedIdentifiers.push(cl.slug);
      if (cl.sort_order) {
        const pad = String(cl.sort_order).padStart(2, '0');
        completedIdentifiers.push(`linux_mod_${pad}`);
        completedIdentifiers.push(`mod_${pad}`);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        enrollment: updatedEnrollment,
        completedCount,
        totalLessons,
        progress,
        completedLessonIds,
        completedLessons: completedLessonIds,
        completedIdentifiers,
        certificate: certificate || null,
      },
    });
  } catch (error) {
    console.error('Mark lesson complete error:', error);
    res.status(500).json({ success: false, message: 'Error marking lesson as complete' });
  }
};

/**
 * Mark a lesson as incomplete and recalculate progress
 * POST /api/enrollments/lessons/incomplete
 */
export const markLessonIncomplete = async (req, res) => {
  try {
    const { courseId: rawCourseId, lessonId: rawLessonId } = req.body;
    let courseId = parseInt(rawCourseId, 10);
    if (isNaN(courseId)) {
      const course = await Course.findBySlug(rawCourseId);
      if (course) courseId = course.id;
    }

    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: 'Valid Course ID or slug is required' });
    }

    const resolvedLesson = await Lesson.resolveLesson(courseId, rawLessonId);
    if (!resolvedLesson) {
      return res.status(404).json({ success: false, message: `Lesson '${rawLessonId}' not found for course` });
    }

    const lessonId = resolvedLesson.id;

    await Lesson.markIncomplete(req.user.id, lessonId);

    // Recalculate progress
    const lessons = await Lesson.findAllByCourseId(courseId);
    const completedLessons = await Lesson.getCompletedLessons(req.user.id, courseId);

    const totalLessons = lessons.length;
    const completedCount = completedLessons.length;
    const progress = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    const updatedEnrollment = await Enrollment.updateProgress(req.user.id, courseId, progress);

    const completedLessonIds = completedLessons.map(l => l.lesson_id);
    const completedIdentifiers = [];
    completedLessons.forEach(cl => {
      completedIdentifiers.push(String(cl.lesson_id));
      if (cl.slug) completedIdentifiers.push(cl.slug);
      if (cl.sort_order) {
        const pad = String(cl.sort_order).padStart(2, '0');
        completedIdentifiers.push(`linux_mod_${pad}`);
        completedIdentifiers.push(`mod_${pad}`);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        enrollment: updatedEnrollment,
        completedCount,
        totalLessons,
        progress,
        completedLessonIds,
        completedLessons: completedLessonIds,
        completedIdentifiers,
        certificate: null,
      },
    });
  } catch (error) {
    console.error('Mark lesson incomplete error:', error);
    res.status(500).json({ success: false, message: 'Error marking lesson as incomplete' });
  }
};

/**
 * Get detailed course progress for user
 * GET /api/enrollments/courses/:courseId/progress
 */
export const getCourseProgress = async (req, res) => {
  try {
    let courseId = parseInt(req.params.courseId, 10);
    if (isNaN(courseId)) {
      const course = await Course.findBySlug(req.params.courseId);
      if (course) courseId = course.id;
    }

    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID or slug' });
    }

    const lessons = await Lesson.findAllByCourseId(courseId);
    const completedLessons = await Lesson.getCompletedLessons(req.user.id, courseId);

    const totalLessons = lessons.length;
    const completedCount = completedLessons.length;
    const progress = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    const certificate = await Certificate.findByUserAndCourse(req.user.id, courseId);

    const completedLessonIds = completedLessons.map(l => l.lesson_id);
    const completedIdentifiers = [];
    completedLessons.forEach(cl => {
      completedIdentifiers.push(String(cl.lesson_id));
      if (cl.slug) completedIdentifiers.push(cl.slug);
      if (cl.sort_order) {
        const pad = String(cl.sort_order).padStart(2, '0');
        completedIdentifiers.push(`linux_mod_${pad}`);
        completedIdentifiers.push(`mod_${pad}`);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        courseId,
        totalLessons,
        completedCount,
        progress,
        completedLessonIds,
        completedLessons: completedLessonIds,
        completedIdentifiers,
        certificate: certificate || null,
      },
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ success: false, message: 'Error fetching progress details' });
  }
};

/**
 * Get user certificate for a course
 * GET /api/enrollments/courses/:courseId/certificate
 */
export const getCertificate = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId, 10);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const certificate = await Certificate.findByUserAndCourse(req.user.id, courseId);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found. Complete 100% of course lessons first.' });
    }

    res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ success: false, message: 'Error fetching certificate' });
  }
};

/**
 * Public certificate verification
 * GET /api/enrollments/certificates/verify/:hash
 */
export const verifyCertificate = async (req, res) => {
  try {
    const { hash } = req.params;

    // Validate hash format (supports hexadecimal hashes, DEV- prefix hashes, or alphanumeric codes)
    if (!hash || !/^[a-zA-Z0-9_-]{6,64}$/.test(hash.trim())) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid certificate hash format. Expected valid alphanumeric certificate verification code.',
      });
    }

    const certificate = await Certificate.findByHash(hash.trim());
    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'Invalid or unrecognized certificate verification code.',
      });
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: 'Certificate successfully verified.',
      data: {
        certificateHash: certificate.certificate_hash,
        studentName: certificate.username,
        courseTitle: certificate.course_title,
        courseSlug: certificate.course_slug,
        issuedAt: certificate.issued_at,
      },
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ success: false, verified: false, message: 'Error verifying certificate' });
  }
};
