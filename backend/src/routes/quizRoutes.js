import { Router } from 'express';
import { recordAttempt, getMyAttempts, getQuizStats } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/quizzes/attempts - Record a student quiz attempt (auth required)
router.post('/attempts', protect, recordAttempt);

// GET /api/quizzes/my-attempts - Get current user's quiz attempts (auth required)
router.get('/my-attempts', protect, getMyAttempts);

// GET /api/quizzes/:quizId/stats - Get aggregate pass rate and score stats
router.get('/:quizId/stats', getQuizStats);

export default router;
