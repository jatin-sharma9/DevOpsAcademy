import crypto from 'crypto';
import { Enrollment } from '../models/enrollmentModel.js';
import { Course } from '../models/courseModel.js';
import { Lesson } from '../models/lessonModel.js';
import { Certificate } from '../models/certificateModel.js';
import { Notification } from '../models/notificationModel.js';
import { emailService } from '../services/emailService.js';
import { query } from '../config/db.js';

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: 'Course ID is required' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = await Enrollment.enroll(req.user.id, courseId);

    // Send email notification to admin (non-blocking)
    emailService.sendEnrollmentNotification({
      studentName: req.user.username,
      studentEmail: req.user.email,
      courseTitle: course.title
    });

    // Save dashboard notification for admin
    await Notification.create({
      title: 'New Course Enrollment',
      message: `${req.user.username} (${req.user.email}) enrolled in "${course.title}"`,
      type: 'enrollment'
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findByUserId(req.user.id);
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrollments' });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { courseId, progress } = req.body;
    if (!courseId || progress === undefined) {
      return res.status(400).json({ message: 'Course ID and progress are required' });
    }

    const updated = await Enrollment.updateProgress(req.user.id, courseId, progress);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course progress' });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll();
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all enrollments' });
  }
};

/**
 * Mark a lesson as complete and recalculate progress
 */
export const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    if (!courseId || !lessonId) {
      return res.status(400).json({ message: 'Course ID and Lesson ID are required' });
    }

    // Check if enrolled, auto-enroll if not
    const enrollments = await Enrollment.findByUserId(req.user.id);
    const isEnrolled = enrollments.some(e => e.course_id === parseInt(courseId, 10));
    if (!isEnrolled) {
      await Enrollment.enroll(req.user.id, courseId);
    }

    // Mark complete
    await Lesson.markComplete(req.user.id, lessonId);

    // Recalculate progress
    const lessons = await Lesson.findAllByCourseId(courseId);
    const completedLessons = await Lesson.getCompletedLessons(req.user.id, courseId);
    
    const totalLessons = lessons.length;
    const completedCount = completedLessons.length;
    const progress = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    // Update enrollment
    const updatedEnrollment = await Enrollment.updateProgress(req.user.id, courseId, progress);

    // Generate certificate if 100% complete
    let certificate = null;
    if (progress === 100) {
      const existingCert = await Certificate.findByUserAndCourse(req.user.id, courseId);
      if (!existingCert) {
        const hash = crypto.randomBytes(16).toString('hex');
        certificate = await Certificate.create(req.user.id, courseId, hash);
      } else {
        certificate = existingCert;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        enrollment: updatedEnrollment,
        completedCount,
        totalLessons,
        progress,
        certificate
      }
    });
  } catch (error) {
    console.error('Mark lesson complete error:', error);
    res.status(500).json({ message: 'Error marking lesson as complete' });
  }
};

/**
 * Mark a lesson as incomplete and recalculate progress
 */
export const markLessonIncomplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    if (!courseId || !lessonId) {
      return res.status(400).json({ message: 'Course ID and Lesson ID are required' });
    }

    // Check if enrolled, auto-enroll if not
    const enrollments = await Enrollment.findByUserId(req.user.id);
    const isEnrolled = enrollments.some(e => e.course_id === parseInt(courseId, 10));
    if (!isEnrolled) {
      await Enrollment.enroll(req.user.id, courseId);
    }

    // Mark incomplete
    await Lesson.markIncomplete(req.user.id, lessonId);

    // Recalculate progress
    const lessons = await Lesson.findAllByCourseId(courseId);
    const completedLessons = await Lesson.getCompletedLessons(req.user.id, courseId);
    
    const totalLessons = lessons.length;
    const completedCount = completedLessons.length;
    const progress = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    // Update enrollment
    const updatedEnrollment = await Enrollment.updateProgress(req.user.id, courseId, progress);

    res.status(200).json({
      success: true,
      data: {
        enrollment: updatedEnrollment,
        completedCount,
        totalLessons,
        progress
      }
    });
  } catch (error) {
    console.error('Mark lesson incomplete error:', error);
    res.status(500).json({ message: 'Error marking lesson as incomplete' });
  }
};

/**
 * Get completed lessons and progress for a course
 */
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const completedLessons = await Lesson.getCompletedLessons(req.user.id, courseId);
    const lessons = await Lesson.findAllByCourseId(courseId);
    
    // Find enrollment
    const enrollmentRes = await query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.user.id, courseId]
    );
    const enrollment = enrollmentRes.rows[0];

    // Certificate
    const certificate = await Certificate.findByUserAndCourse(req.user.id, courseId);

    res.status(200).json({
      success: true,
      data: {
        isEnrolled: !!enrollment,
        progress: enrollment ? enrollment.progress : 0,
        completedLessons: completedLessons.map(cl => cl.lesson_id),
        totalLessons: lessons.length,
        certificate
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Error fetching progress details' });
  }
};

/**
 * Get user certificate by course
 */
export const getCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const certificate = await Certificate.findByUserAndCourse(req.user.id, courseId);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certificate' });
  }
};

/**
 * Verify a certificate hash
 */
export const verifyCertificate = async (req, res) => {
  try {
    const { hash } = req.params;
    const certificate = await Certificate.findByHash(hash);
    if (!certificate) {
      return res.status(404).json({ message: 'Invalid certificate verification code' });
    }
    res.status(200).json({ success: true, verified: true, data: certificate });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying certificate' });
  }
};
