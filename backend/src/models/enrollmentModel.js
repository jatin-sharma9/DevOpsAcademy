import { query } from '../config/db.js';

export const Enrollment = {
  async enroll(userId, courseId) {
    const res = await query(
      `INSERT INTO enrollments (user_id, course_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, course_id) DO UPDATE SET progress = enrollments.progress
       RETURNING *`,
      [userId, courseId]
    );
    return res.rows[0];
  },

  async findByUserId(userId) {
    const res = await query(
      `SELECT e.*, c.title, c.slug, c.category, c.level, c.duration_hours
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = $1
       ORDER BY e.enrolled_at DESC`,
      [userId]
    );
    return res.rows;
  },

  async updateProgress(userId, courseId, progress) {
    const completed = progress >= 100;
    const completedAt = completed ? new Date() : null;
    const res = await query(
      `UPDATE enrollments
       SET progress = $1, completed = $2, completed_at = COALESCE(completed_at, $3)
       WHERE user_id = $4 AND course_id = $5
       RETURNING *`,
      [progress, completed, completedAt, userId, courseId]
    );
    return res.rows[0];
  },

  async findAll() {
    const res = await query(
      `SELECT e.*, u.username, u.email, c.title as course_title
       FROM enrollments e
       JOIN users u ON e.user_id = u.id
       JOIN courses c ON e.course_id = c.id
       ORDER BY e.enrolled_at DESC`
    );
    return res.rows;
  }
};
