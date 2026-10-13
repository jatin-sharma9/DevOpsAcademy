import express from 'express';
import {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  uploadThumbnail
} from '../controllers/courseController.js';
import { getCourseReviews, createCourseReview } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import lessonRoutes from './lessonRoutes.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

// Mount lesson routes under /api/courses/:courseId/lessons
router.use('/:courseId/lessons', lessonRoutes);

// Course reviews endpoints
router.get('/:courseId/reviews', getCourseReviews);
router.post('/:courseId/reviews', protect, createCourseReview);

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);

router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

// Publish course endpoint
router.put('/:id/publish', protect, authorize('instructor', 'admin'), publishCourse);

// Upload thumbnail endpoint
router.post('/:id/thumbnail', protect, authorize('instructor', 'admin'), upload.single('thumbnail'), uploadThumbnail);

export default router;
