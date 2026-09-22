import { query, pool } from '../config/db.js';

// Starter goals seeded for new users on first visit
const STARTER_GOALS = [
  { title: 'Complete Linux File Permissions lab', category: 'Linux' },
  { title: 'Write Dockerfile multi-stage build example', category: 'Docker' },
  { title: 'Calculate AWS VPC CIDR subnets & route tables', category: 'Networking' },
  { title: 'Solve 2 Kubernetes OOMKilled interview scenarios', category: 'Kubernetes' },
  { title: 'Review Terraform state locking documentation', category: 'Terraform' },
];

export const TrackerModel = {
  // ─── GOALS ────────────────────────────────────────────────────────────────

  /**
   * Returns all goals for userId on targetDate.
   * If the user has never had any goals, seeds starter goals for today.
   */
  async getGoals(userId, targetDate) {
    const dateStr = targetDate || new Date().toISOString().split('T')[0];

    // Check if user has goals for this date
    const existing = await query(
      'SELECT * FROM learning_goals WHERE user_id = $1 AND target_date = $2 ORDER BY created_at ASC',
      [userId, dateStr]
    );

    if (existing.rows.length > 0) return existing.rows;

    // Check if user has any historical goals at all
    const anyGoals = await query(
      'SELECT id FROM learning_goals WHERE user_id = $1 LIMIT 1',
      [userId]
    );

    // Seed starter goals only on first ever visit
    if (anyGoals.rows.length === 0) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const g of STARTER_GOALS) {
          await client.query(
            `INSERT INTO learning_goals (user_id, title, category, target_date)
             VALUES ($1, $2, $3, $4)`,
            [userId, g.title, g.category, dateStr]
          );
        }
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }

      const seeded = await query(
        'SELECT * FROM learning_goals WHERE user_id = $1 AND target_date = $2 ORDER BY created_at ASC',
        [userId, dateStr]
      );
      return seeded.rows;
    }

    // User has history but no goals yet for this specific date — return empty
    return [];
  },

  async createGoal(userId, { title, category, targetDate }) {
    const dateStr = targetDate || new Date().toISOString().split('T')[0];
    const res = await query(
      `INSERT INTO learning_goals (user_id, title, category, target_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, title, category || 'General', dateStr]
    );
    return res.rows[0];
  },

  async toggleGoal(userId, goalId) {
    // Fetch current state
    const current = await query(
      'SELECT * FROM learning_goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );
    if (!current.rows[0]) return null;

    const nowCompleted = !current.rows[0].completed;
    const completedAt = nowCompleted ? new Date().toISOString() : null;

    const res = await query(
      `UPDATE learning_goals
       SET completed = $1, completed_at = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [nowCompleted, completedAt, goalId, userId]
    );

    // Record activity and recalculate streak if a goal was just completed
    if (nowCompleted) {
      await TrackerModel.recordActivity(userId, 0, 1);
    }

    return res.rows[0];
  },

  async deleteGoal(userId, goalId) {
    const res = await query(
      'DELETE FROM learning_goals WHERE id = $1 AND user_id = $2 RETURNING id',
      [goalId, userId]
    );
    return res.rows[0];
  },

  // ─── STREAKS ───────────────────────────────────────────────────────────────

  /**
   * Get the streak record for a user; initialise it if missing.
   */
  async getStreak(userId) {
    let res = await query(
      'SELECT * FROM user_streaks WHERE user_id = $1',
      [userId]
    );

    if (res.rows.length === 0) {
      res = await query(
        `INSERT INTO user_streaks (user_id, current_streak, longest_streak, total_days_active)
         VALUES ($1, 0, 0, 0)
         RETURNING *`,
        [userId]
      );
    }

    return res.rows[0];
  },

  // ─── DAILY ACTIVITY ────────────────────────────────────────────────────────

  /**
   * Upsert today's activity row (add minutes, increment goals_completed).
   * Then recalculate the streak.
   */
  async recordActivity(userId, minutes = 0, goalsCompletedDelta = 0) {
    const today = new Date().toISOString().split('T')[0];

    // Upsert daily activity row
    await query(
      `INSERT INTO daily_learning_activity (user_id, activity_date, minutes_spent, goals_completed)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, activity_date)
       DO UPDATE SET
         minutes_spent = daily_learning_activity.minutes_spent + $3,
         goals_completed = daily_learning_activity.goals_completed + $4,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, today, minutes, goalsCompletedDelta]
    );

    // Recalculate streak
    const streakRow = await TrackerModel.getStreak(userId);
    const lastDate = streakRow.last_activity_date
      ? new Date(streakRow.last_activity_date).toISOString().split('T')[0]
      : null;

    if (lastDate === today) {
      // Already counted today
      return streakRow;
    }

    let newCurrent = 1;
    if (lastDate) {
      const last = new Date(lastDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr - last) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        newCurrent = (streakRow.current_streak || 0) + 1;
      }
      // diffDays > 1 → streak broken, reset to 1
    }

    const newLongest = Math.max(newCurrent, streakRow.longest_streak || 0);
    const newTotal = (streakRow.total_days_active || 0) + 1;

    const updated = await query(
      `UPDATE user_streaks
       SET current_streak = $1,
           longest_streak = $2,
           last_activity_date = $3,
           total_days_active = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $5
       RETURNING *`,
      [newCurrent, newLongest, today, newTotal, userId]
    );

    return updated.rows[0];
  },

  // ─── STATS ─────────────────────────────────────────────────────────────────

  /**
   * Aggregate stats for the tracker page:
   *   - today: completed / total goals, minutes logged
   *   - weekly: consistency % (days active in last 7 days)
   *   - streak: current + longest
   */
  async getStats(userId) {
    const today = new Date().toISOString().split('T')[0];

    // Today's goals counts
    const todayGoals = await query(
      `SELECT
         COUNT(*) FILTER (WHERE completed = TRUE) AS completed_count,
         COUNT(*) AS total_count
       FROM learning_goals
       WHERE user_id = $1 AND target_date = $2`,
      [userId, today]
    );

    // Today's minutes
    const todayActivity = await query(
      `SELECT COALESCE(minutes_spent, 0) AS minutes_spent
       FROM daily_learning_activity
       WHERE user_id = $1 AND activity_date = $2`,
      [userId, today]
    );

    // Weekly consistency (last 7 days including today)
    const weekActivity = await query(
      `SELECT COUNT(DISTINCT activity_date) AS active_days
       FROM daily_learning_activity
       WHERE user_id = $1
         AND activity_date >= CURRENT_DATE - INTERVAL '6 days'
         AND activity_date <= CURRENT_DATE`,
      [userId]
    );

    // Streak
    const streak = await TrackerModel.getStreak(userId);

    const completedCount = parseInt(todayGoals.rows[0]?.completed_count || '0');
    const totalCount = parseInt(todayGoals.rows[0]?.total_count || '0');
    const minutesToday = parseInt(todayActivity.rows[0]?.minutes_spent || '0');
    const activeDaysThisWeek = parseInt(weekActivity.rows[0]?.active_days || '0');
    const weeklyConsistency = Math.round((activeDaysThisWeek / 7) * 100);

    return {
      today: {
        completedCount,
        totalCount,
        minutesLogged: minutesToday,
      },
      weekly: {
        consistencyPercent: weeklyConsistency,
        activeDays: activeDaysThisWeek,
      },
      streak: {
        currentStreak: streak.current_streak || 0,
        longestStreak: streak.longest_streak || 0,
        totalDaysActive: streak.total_days_active || 0,
        lastActivityDate: streak.last_activity_date,
      },
    };
  },
};
