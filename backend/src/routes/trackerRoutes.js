import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getTrackerData,
  addGoal,
  toggleGoal,
  deleteGoal,
  logTime,
} from '../controllers/trackerController.js';

const router = Router();

// All tracker routes require JWT authentication
router.use(protect);

// GET  /api/tracker?date=YYYY-MM-DD  → load goals, streak, stats for a given day
router.get('/', getTrackerData);

// POST /api/tracker/goals            → create a new goal
router.post('/goals', addGoal);

// PATCH /api/tracker/goals/:id       → toggle goal completed state
router.patch('/goals/:id', toggleGoal);

// DELETE /api/tracker/goals/:id      → delete a goal
router.delete('/goals/:id', deleteGoal);

// POST /api/tracker/activity         → log learning minutes { minutes: 15 }
router.post('/activity', logTime);

export default router;
