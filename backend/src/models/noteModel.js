import { query } from '../config/db.js';

export const Note = {
  /**
   * Find a note by user ID and lesson ID
   * 
   * @param {number} userId 
   * @param {number} lessonId 
   * @returns {Promise<Object|null>}
   */
  async findByUserAndLesson(userId, lessonId) {
    const res = await query(
      `SELECT ln.*,
              l.title as lesson_title,
              l.slug as lesson_slug,
              l.course_id,
              c.title as course_title,
              c.slug as course_slug
       FROM lesson_notes ln
       JOIN lessons l ON ln.lesson_id = l.id
       JOIN courses c ON l.course_id = c.id
       WHERE ln.user_id = $1 AND ln.lesson_id = $2`,
      [userId, lessonId]
    );
    return res.rows[0] || null;
  },

  /**
   * Upsert a note for a student and lesson
   * 
   * @param {number} userId 
   * @param {number} lessonId 
   * @param {string} content 
   * @returns {Promise<Object>}
   */
  async upsert(userId, lessonId, content) {
    const res = await query(
      `INSERT INTO lesson_notes (user_id, lesson_id, content)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET
         content = EXCLUDED.content,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, lessonId, content]
    );

    // Re-fetch with lesson metadata
    return this.findByUserAndLesson(userId, lessonId);
  },

  /**
   * Delete a note by user ID and lesson ID
   * 
   * @param {number} userId 
   * @param {number} lessonId 
   * @returns {Promise<Object|null>}
   */
  async delete(userId, lessonId) {
    const res = await query(
      `DELETE FROM lesson_notes
       WHERE user_id = $1 AND lesson_id = $2
       RETURNING id, user_id, lesson_id`,
      [userId, lessonId]
    );
    return res.rows[0] || null;
  },

  /**
   * Find all notes created by a user across all courses
   * 
   * @param {number} userId 
   * @param {number} [courseId] 
   * @returns {Promise<Array>}
   */
  async findAllByUserId(userId, courseId = null) {
    let sql = `
      SELECT ln.*,
             l.title as lesson_title,
             l.slug as lesson_slug,
             l.course_id,
             c.title as course_title,
             c.slug as course_slug
      FROM lesson_notes ln
      JOIN lessons l ON ln.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      WHERE ln.user_id = $1
    `;
    const params = [userId];

    if (courseId) {
      params.push(parseInt(courseId, 10));
      sql += ` AND l.course_id = $${params.length}`;
    }

    sql += ` ORDER BY ln.updated_at DESC`;

    const res = await query(sql, params);
    return res.rows;
  }
};
