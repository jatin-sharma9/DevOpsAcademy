import { TrackerModel } from '../models/trackerModel.js';

// GET /api/tracker?date=YYYY-MM-DD
export const getTrackerData = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.query.date || new Date().toISOString().split('T')[0];

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

// POST /api/tracker/goals
export const addGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, category, targetDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Goal title is required' });
    }

    const goal = await TrackerModel.createGoal(userId, {
      title: title.trim(),
      category: category || 'General',
      targetDate,
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    console.error('addGoal error:', error);
    res.status(500).json({ success: false, message: 'Failed to add goal' });
  }
};

// PATCH /api/tracker/goals/:id
export const toggleGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = parseInt(req.params.id);

    if (isNaN(goalId)) {
      return res.status(400).json({ success: false, message: 'Invalid goal ID' });
    }

    const goal = await TrackerModel.toggleGoal(userId, goalId);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Return the updated goal + fresh stats so frontend can update streak badge
    const stats = await TrackerModel.getStats(userId);
    res.json({ success: true, data: { goal, stats } });
  } catch (error) {
    console.error('toggleGoal error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle goal' });
  }
};

// DELETE /api/tracker/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = parseInt(req.params.id);

    if (isNaN(goalId)) {
      return res.status(400).json({ success: false, message: 'Invalid goal ID' });
    }

    const deleted = await TrackerModel.deleteGoal(userId, goalId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    console.error('deleteGoal error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete goal' });
  }
};

// POST /api/tracker/activity  { minutes: 15 }
export const logTime = async (req, res) => {
  try {
    const userId = req.user.id;
    const minutes = parseInt(req.body.minutes || '0');

    if (isNaN(minutes) || minutes <= 0) {
      return res.status(400).json({ success: false, message: 'minutes must be a positive integer' });
    }

    const streak = await TrackerModel.recordActivity(userId, minutes, 0);
    const stats = await TrackerModel.getStats(userId);

    res.json({ success: true, data: { streak, stats } });
  } catch (error) {
    console.error('logTime error:', error);
    res.status(500).json({ success: false, message: 'Failed to log time' });
  }
};
