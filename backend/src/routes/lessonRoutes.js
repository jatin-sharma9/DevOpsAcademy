import express from 'express';
import { getLessons, getLessonBySlug, createLesson, updateLesson, deleteLesson } from '../controllers/lessonController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// mergeParams is required to access courseId from parent route
const router = express.Router({ mergeParams: true });

router.get('/', getLessons);
router.get('/:slug', getLessonBySlug);

router.post('/', protect, authorize('instructor', 'admin'), createLesson);
router.put('/:id', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/:id', protect, authorize('admin'), deleteLesson);

export default router;
