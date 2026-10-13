import { Router } from 'express';
import {
  getLessonNotes,
  saveLessonNotes,
  deleteLessonNotes,
  getMyNotes,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All note endpoints require student authentication
router.use(protect);

// GET /api/lessons/notes/my - Get all notes for active student
router.get('/notes/my', getMyNotes);

// GET /api/lessons/:lessonId/notes - Get student's note for a specific lesson
router.get('/:lessonId/notes', getLessonNotes);

// PUT /api/lessons/:lessonId/notes - Upsert student's note for a lesson
router.put('/:lessonId/notes', saveLessonNotes);

// DELETE /api/lessons/:lessonId/notes - Delete student's note for a lesson
router.delete('/:lessonId/notes', deleteLessonNotes);

export default router;
