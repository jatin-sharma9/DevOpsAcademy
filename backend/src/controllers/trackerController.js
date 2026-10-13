import { TrackerModel } from '../models/trackerModel.js';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Get daily tracker data for user
 * GET /api/tracker?date=YYYY-MM-DD
 */
export const getTrackerData = async (req, res) => {
  try {
    const userId = req.user.id;
    let date = req.query.date;

    if (date && !DATE_REGEX.test(date)) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Expected YYYY-MM-DD.' });
    }

    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }

    const [goals, stats] = await Promise.all([
      TrackerModel.getGoals(userId, date),
      TrackerModel.getStats(userId),
    ]);

    res.json({ success: true, data: { goals, stats, date } });
  } catch (error) {
    console.error('getTrackerData error:', error);
    res.status(500).json({ success: false, message: 'Failed to load tracker data' });
  }
};

/**
 * Add a new daily micro-goal
 * POST /api/tracker/goals
 */
export const addGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, category, targetDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Goal title is required' });
    }

    if (title.trim().length > 255) {
      return res.status(400).json({ success: false, message: 'Goal title cannot exceed 255 characters' });
    }

    if (targetDate && !DATE_REGEX.test(targetDate)) {
      return res.status(400).json({ success: false, message: 'Invalid targetDate format. Expected YYYY-MM-DD.' });
    }

    const goal = await TrackerModel.createGoal(userId, {
      title: title.trim(),
      category: category ? String(category).trim().slice(0, 50) : 'General',
      targetDate,
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    console.error('addGoal error:', error);
    res.status(500).json({ success: false, message: 'Failed to add goal' });
  }
};

/**
 * Toggle goal completion status
 * PATCH /api/tracker/goals/:id
 */
export const toggleGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = parseInt(req.params.id, 10);

    if (isNaN(goalId) || goalId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid goal ID' });
    }

    const goal = await TrackerModel.toggleGoal(userId, goalId);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    const stats = await TrackerModel.getStats(userId);
    res.json({ success: true, data: { goal, stats } });
  } catch (error) {
    console.error('toggleGoal error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle goal' });
  }
};

/**
 * Delete a goal
 * DELETE /api/tracker/goals/:id
 */
export const deleteGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = parseInt(req.params.id, 10);

    if (isNaN(goalId) || goalId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid goal ID' });
    }

    const deleted = await TrackerModel.deleteGoal(userId, goalId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('deleteGoal error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete goal' });
  }
};

/**
 * Log study time
 * POST /api/tracker/activity  { minutes: 30 }
 */
export const logTime = async (req, res) => {
  try {
    const userId = req.user.id;
    const minutes = parseInt(req.body.minutes, 10);

    if (isNaN(minutes) || minutes <= 0 || minutes > 720) {
      return res.status(400).json({
        success: false,
        message: 'Minutes must be an integer between 1 and 720 (max 12 hours per session)',
      });
    }

    const streak = await TrackerModel.recordActivity(userId, minutes, 0);
    const stats = await TrackerModel.getStats(userId);

    res.json({ success: true, data: { streak, stats } });
  } catch (error) {
    console.error('logTime error:', error);
    res.status(500).json({ success: false, message: 'Failed to log study time' });
  }
};
