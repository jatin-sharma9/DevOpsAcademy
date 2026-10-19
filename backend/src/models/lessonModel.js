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
    const {
      courseId,
      title,
      slug,
      description,
      content,
      videoUrl,
      video_url,
      sortOrder,
      sort_order,
      durationMinutes,
      duration_minutes,
    } = lessonData;

    const generatedSlug = (slug || title || 'lesson')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const finalVideoUrl = videoUrl !== undefined ? videoUrl : (video_url || null);
    const finalSortOrder = sortOrder !== undefined ? sortOrder : (sort_order !== undefined ? sort_order : 0);
    const finalDurationMinutes = durationMinutes !== undefined ? durationMinutes : (duration_minutes !== undefined ? duration_minutes : 0);
    const finalDescription = description || '';

    const res = await query(
      `INSERT INTO lessons (course_id, title, slug, description, content, video_url, sort_order, duration_minutes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [courseId, title, generatedSlug, finalDescription, content || '', finalVideoUrl, finalSortOrder, finalDurationMinutes]
    );
    return res.rows[0];
  },

  async update(id, lessonData) {
    const {
      title,
      slug,
      description,
      content,
      videoUrl,
      video_url,
      sortOrder,
      sort_order,
      durationMinutes,
      duration_minutes,
    } = lessonData;

    const finalVideoUrl = videoUrl !== undefined ? videoUrl : (video_url !== undefined ? video_url : null);
    const finalSortOrder = sortOrder !== undefined ? sortOrder : (sort_order !== undefined ? sort_order : null);
    const finalDurationMinutes = durationMinutes !== undefined ? durationMinutes : (duration_minutes !== undefined ? duration_minutes : null);

    const res = await query(
      `UPDATE lessons
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           description = COALESCE($3, description),
           content = COALESCE($4, content),
           video_url = COALESCE($5, video_url),
           sort_order = COALESCE($6, sort_order),
           duration_minutes = COALESCE($7, duration_minutes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        title || null,
        slug || null,
        description !== undefined ? description : null,
        content !== undefined ? content : null,
        finalVideoUrl,
        finalSortOrder,
        finalDurationMinutes,
        id
      ]
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
      `SELECT lc.lesson_id, lc.completed_at, l.sort_order, l.slug
       FROM lesson_completions lc
       JOIN lessons l ON lc.lesson_id = l.id
       WHERE lc.user_id = $1 AND l.course_id = $2
       ORDER BY l.sort_order ASC`,
      [userId, courseId]
    );
    return res.rows;
  },

  async resolveLesson(courseId, identifier) {
    if (identifier === undefined || identifier === null) return null;

    // Check if numeric or pure digits string
    const num = parseInt(identifier, 10);
    if (!isNaN(num) && (typeof identifier === 'number' || /^\d+$/.test(String(identifier).trim()))) {
      const byId = await this.findById(num);
      if (byId && (!courseId || byId.course_id === Number(courseId))) {
        return byId;
      }
    }

    // Try lookup by slug or module order
    if (courseId) {
      const cleanSlug = String(identifier).trim();
      const bySlug = await this.findBySlug(courseId, cleanSlug);
      if (bySlug) return bySlug;

      // Try format like "linux_mod_01" -> order 1
      const modMatch = cleanSlug.match(/(?:^|_)mod(?:ule)?_?0*(\d+)/i);
      if (modMatch) {
        const orderNum = parseInt(modMatch[1], 10);
        const res = await query(
          'SELECT * FROM lessons WHERE course_id = $1 AND sort_order = $2',
          [courseId, orderNum]
        );
        if (res.rows[0]) return res.rows[0];
      }
    }

    return null;
  }
};
