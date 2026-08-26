import { query } from '../config/db.js';

export const Lesson = {
  async findAllByCourseId(courseId) {
    const res = await query(
      'SELECT * FROM lessons WHERE course_id = $1 ORDER BY sort_order ASC, created_at ASC',
      [courseId]
    );
    return res.rows;
  },

  async findById(id) {
    const res = await query('SELECT * FROM lessons WHERE id = $1', [id]);
    return res.rows[0];
  },

  async findBySlug(courseId, slug) {
    const res = await query('SELECT * FROM lessons WHERE course_id = $1 AND slug = $2', [courseId, slug]);
    return res.rows[0];
  },

  async create(lessonData) {
    const { courseId, title, slug, description, content, videoUrl, sortOrder, durationMinutes } = lessonData;
    const res = await query(
      `INSERT INTO lessons (course_id, title, slug, description, content, video_url, sort_order, duration_minutes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [courseId, title, slug, description, content, videoUrl, sortOrder || 0, durationMinutes || 0]
    );
    return res.rows[0];
  },

  async update(id, lessonData) {
    const { title, slug, description, content, videoUrl, sortOrder, durationMinutes } = lessonData;
    const res = await query(
      `UPDATE lessons
       SET title = $1, slug = $2, description = $3, content = $4, video_url = $5, sort_order = $6, duration_minutes = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, slug, description, content, videoUrl, sortOrder, durationMinutes, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    const res = await query('DELETE FROM lessons WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  },

  // Completion methods
  async markComplete(userId, lessonId) {
    const res = await query(
      `INSERT INTO lesson_completions (user_id, lesson_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, lesson_id) DO NOTHING
       RETURNING *`,
      [userId, lessonId]
    );
    return res.rows[0];
  },

  async markIncomplete(userId, lessonId) {
    const res = await query(
      `DELETE FROM lesson_completions
       WHERE user_id = $1 AND lesson_id = $2
       RETURNING *`,
      [userId, lessonId]
    );
    return res.rows[0];
  },

  async getCompletedLessons(userId, courseId) {
    const res = await query(
      `SELECT lc.lesson_id, lc.completed_at
       FROM lesson_completions lc
       JOIN lessons l ON lc.lesson_id = l.id
       WHERE lc.user_id = $1 AND l.course_id = $2`,
      [userId, courseId]
    );
    return res.rows;
  }
};
