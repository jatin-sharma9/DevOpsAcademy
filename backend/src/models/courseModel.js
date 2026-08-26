import { query } from '../config/db.js';

export const Course = {
  async findAll() {
    const res = await query('SELECT * FROM courses ORDER BY created_at DESC');
    return res.rows;
  },

  async findBySlug(slug) {
    const res = await query('SELECT * FROM courses WHERE slug = $1', [slug]);
    return res.rows[0];
  },

  async findById(id) {
    const res = await query('SELECT * FROM courses WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create(courseData) {
    const {
      title,
      slug,
      shortDescription,
      description,
      category,
      level,
      price,
      isPro,
      isFeatured,
      isPublished,
      youtubeVideoUrl,
      instructorId,
      thumbnail,
      durationHours
    } = courseData;

    const res = await query(
      `INSERT INTO courses (
        title, slug, short_description, description, category,
        level, price, is_pro, is_featured, is_published,
        youtube_video_url, instructor_id, thumbnail, duration_hours
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        title,
        slug,
        shortDescription,
        description,
        category,
        level || 'beginner',
        price || 0,
        isPro || false,
        isFeatured || false,
        isPublished || false,
        youtubeVideoUrl || null,
        instructorId,
        thumbnail || null,
        durationHours || 0
      ]
    );
    return res.rows[0];
  },

  async update(id, courseData) {
    const {
      title,
      slug,
      shortDescription,
      description,
      category,
      level,
      price,
      isPro,
      isFeatured,
      isPublished,
      youtubeVideoUrl,
      durationHours,
      thumbnail
    } = courseData;

    const res = await query(
      `UPDATE courses
       SET title = $1,
           slug = COALESCE($2, slug),
           short_description = $3,
           description = $4,
           category = $5,
           level = $6,
           price = $7,
           is_pro = $8,
           is_featured = $9,
           is_published = $10,
           youtube_video_url = $11,
           duration_hours = $12,
           thumbnail = COALESCE($13, thumbnail),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $14
       RETURNING *`,
      [
        title,
        slug,
        shortDescription,
        description,
        category,
        level,
        price,
        isPro,
        isFeatured,
        isPublished,
        youtubeVideoUrl,
        durationHours,
        thumbnail,
        id
      ]
    );
    return res.rows[0];
  },

  async updatePublishStatus(id, isPublished) {
    const res = await query(
      `UPDATE courses
       SET is_published = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [isPublished, id]
    );
    return res.rows[0];
  },

  async updateThumbnail(id, thumbnail) {
    const res = await query(
      `UPDATE courses
       SET thumbnail = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [thumbnail, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    const res = await query('DELETE FROM courses WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }
};
