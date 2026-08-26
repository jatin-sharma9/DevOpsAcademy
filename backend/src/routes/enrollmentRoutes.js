import express from 'express';
import {
  enrollCourse,
  getMyEnrollments,
  updateProgress,
  getAllEnrollments,
  markLessonComplete,
  markLessonIncomplete,
  getCourseProgress,
  getCertificate,
  verifyCertificate
} from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public certificate verification route
router.get('/certificates/verify/:hash', verifyCertificate);

// Protected routes
router.use(protect);

router.post('/', enrollCourse);
router.get('/my', getMyEnrollments);
router.put('/progress', updateProgress);

// Lesson and course progress tracking routes
router.post('/lessons/complete', markLessonComplete);
router.post('/lessons/incomplete', markLessonIncomplete);
router.get('/courses/:courseId/progress', getCourseProgress);
router.get('/courses/:courseId/certificate', getCertificate);

// Admin only routes
router.get('/', authorize('admin'), getAllEnrollments);

export default router;
