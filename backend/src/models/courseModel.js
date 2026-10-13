import { query } from '../config/db.js';
export const Course = {
  async findAll({ isPublished = null, category = null, level = null, search = null } = {}) {
    let sql = 'SELECT * FROM courses WHERE 1=1';
    const params = [];

    if (isPublished !== null && isPublished !== undefined) {
      params.push(isPublished === true || isPublished === 'true');
      sql += ` AND is_published = $${params.length}`;
    }

    if (category) {
      params.push(category);
      sql += ` AND LOWER(category) = LOWER($${params.length})`;
    }

    if (level) {
      params.push(level);
      sql += ` AND level = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.trim()}%`);
      sql += ` AND (title ILIKE $${params.length} OR short_description ILIKE $${params.length})`;
    }

    sql += ' ORDER BY is_featured DESC, created_at DESC';
    const res = await query(sql, params);
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
      short_description,
      description,
      category,
      level,
      price,
      isPro,
      is_pro,
      isFeatured,
      is_featured,
      isPublished,
      is_published,
      youtubeVideoUrl,
      youtube_video_url,
      instructorId,
      instructor_id,
      thumbnail,
      durationHours,
      duration_hours,
    } = courseData;

    const finalShortDesc = shortDescription !== undefined ? shortDescription : (short_description || null);
    const finalIsPro = isPro !== undefined ? isPro : (is_pro !== undefined ? is_pro : false);
    const finalIsFeatured = isFeatured !== undefined ? isFeatured : (is_featured !== undefined ? is_featured : false);
    const finalIsPublished = isPublished !== undefined ? isPublished : (is_published !== undefined ? is_published : false);
    const finalYoutubeUrl = youtubeVideoUrl !== undefined ? youtubeVideoUrl : (youtube_video_url || null);
    const finalDurationHours = durationHours !== undefined ? durationHours : (duration_hours !== undefined ? duration_hours : 0);
    const finalInstructorId = instructorId !== undefined ? instructorId : (instructor_id || null);

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
        finalShortDesc,
        description,
        category,
        level || 'beginner',
        price || 0,
        finalIsPro,
        finalIsFeatured,
        finalIsPublished,
        finalYoutubeUrl,
        finalInstructorId,
        thumbnail || null,
        finalDurationHours
      ]
    );
    return res.rows[0];
  },

  async update(id, courseData) {
    const {
      title,
      slug,
      shortDescription,
      short_description,
      description,
      category,
      level,
      price,
      isPro,
      is_pro,
      isFeatured,
      is_featured,
      isPublished,
      is_published,
      youtubeVideoUrl,
      youtube_video_url,
      durationHours,
      duration_hours,
      thumbnail
    } = courseData;

    const finalShortDesc = shortDescription !== undefined ? shortDescription : (short_description !== undefined ? short_description : null);
    const finalIsPro = isPro !== undefined ? isPro : (is_pro !== undefined ? is_pro : null);
    const finalIsFeatured = isFeatured !== undefined ? isFeatured : (is_featured !== undefined ? is_featured : null);
    const finalIsPublished = isPublished !== undefined ? isPublished : (is_published !== undefined ? is_published : null);
    const finalYoutubeUrl = youtubeVideoUrl !== undefined ? youtubeVideoUrl : (youtube_video_url !== undefined ? youtube_video_url : null);
    const finalDurationHours = durationHours !== undefined ? durationHours : (duration_hours !== undefined ? duration_hours : null);

    const res = await query(
      `UPDATE courses
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           short_description = COALESCE($3, short_description),
           description = COALESCE($4, description),
           category = COALESCE($5, category),
           level = COALESCE($6, level),
           price = COALESCE($7, price),
           is_pro = COALESCE($8, is_pro),
           is_featured = COALESCE($9, is_featured),
           is_published = COALESCE($10, is_published),
           youtube_video_url = COALESCE($11, youtube_video_url),
           duration_hours = COALESCE($12, duration_hours),
           thumbnail = COALESCE($13, thumbnail),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $14
       RETURNING *`,
      [
        title || null,
        slug || null,
        finalShortDesc,
        description !== undefined ? description : null,
        category || null,
        level || null,
        price !== undefined ? price : null,
        finalIsPro,
        finalIsFeatured,
        finalIsPublished,
        finalYoutubeUrl,
        finalDurationHours,
        thumbnail || null,
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
