import { query } from '../config/db.js';

export const Review = {
  /**
   * Find reviews for a course with ratings summary and author metadata
   * 
   * @param {number} courseId 
   * @param {Object} [options]
   * @param {boolean} [options.approvedOnly=true]
   * @param {number} [options.limit=20]
   * @param {number} [options.offset=0]
   * @returns {Promise<Object>} { reviews, stats }
   */
  async findByCourse(courseId, { approvedOnly = true, limit = 20, offset = 0 } = {}) {
    let sql = `
      SELECT cr.id,
             cr.user_id,
             cr.course_id,
             cr.rating,
             cr.review_text,
             cr.is_approved,
             cr.created_at,
             cr.updated_at,
             u.username,
             u.role as user_role
      FROM course_reviews cr
      JOIN users u ON cr.user_id = u.id
      WHERE cr.course_id = $1
    `;
    const params = [courseId];

    if (approvedOnly) {
      sql += ` AND cr.is_approved = TRUE`;
    }

    sql += ` ORDER BY cr.created_at DESC`;

    if (limit) {
      params.push(Math.min(100, Math.max(1, parseInt(limit, 10))));
      sql += ` LIMIT $${params.length}`;
    }

    if (offset) {
      params.push(Math.max(0, parseInt(offset, 10)));
      sql += ` OFFSET $${params.length}`;
    }

    const reviewsRes = await query(sql, params);

    // Calculate aggregated statistics
    const statsRes = await query(
      `SELECT
        COUNT(*)::int as total_reviews,
        ROUND(COALESCE(AVG(rating), 0), 1)::float as average_rating,
        COUNT(*) FILTER (WHERE rating = 5)::int as star_5,
        COUNT(*) FILTER (WHERE rating = 4)::int as star_4,
        COUNT(*) FILTER (WHERE rating = 3)::int as star_3,
        COUNT(*) FILTER (WHERE rating = 2)::int as star_2,
        COUNT(*) FILTER (WHERE rating = 1)::int as star_1
      FROM course_reviews
      WHERE course_id = $1 ${approvedOnly ? 'AND is_approved = TRUE' : ''}`,
      [courseId]
    );

    const s = statsRes.rows[0] || {};

    return {
      reviews: reviewsRes.rows,
      stats: {
        totalReviews: s.total_reviews || 0,
        averageRating: s.average_rating || 0,
        distribution: {
          5: s.star_5 || 0,
          4: s.star_4 || 0,
          3: s.star_3 || 0,
          2: s.star_2 || 0,
          1: s.star_1 || 0,
        }
      }
    };
  },

  /**
   * Upsert a user review for a course
   * 
   * @param {number} userId 
   * @param {number} courseId 
   * @param {Object} reviewData
   * @param {number} reviewData.rating (1-5)
   * @param {string} [reviewData.reviewText]
   * @param {boolean} [reviewData.isApproved=true]
   * @returns {Promise<Object>}
   */
  async upsert(userId, courseId, { rating, reviewText = '', isApproved = true }) {
    const cleanRating = Math.max(1, Math.min(5, parseInt(rating, 10)));
    const cleanText = (reviewText || '').trim();

    const res = await query(
      `INSERT INTO course_reviews (user_id, course_id, rating, review_text, is_approved)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, course_id)
       DO UPDATE SET
         rating = EXCLUDED.rating,
         review_text = EXCLUDED.review_text,
         is_approved = EXCLUDED.is_approved,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, courseId, cleanRating, cleanText, isApproved]
    );

    return this.findById(res.rows[0].id);
  },

  /**
   * Find a single review by ID
   * 
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const res = await query(
      `SELECT cr.*,
              u.username,
              u.email,
              c.title as course_title,
              c.slug as course_slug
       FROM course_reviews cr
       JOIN users u ON cr.user_id = u.id
       JOIN courses c ON cr.course_id = c.id
       WHERE cr.id = $1`,
      [id]
    );
    return res.rows[0] || null;
  },

  /**
   * Update moderation approval status of a review
   * 
   * @param {number} id 
   * @param {boolean} isApproved 
   * @returns {Promise<Object|null>}
   */
  async moderate(id, isApproved) {
    const res = await query(
      `UPDATE course_reviews
       SET is_approved = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [Boolean(isApproved), id]
    );
    if (!res.rows[0]) return null;
    return this.findById(id);
  },

  /**
   * Delete a review by ID
   * 
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  async delete(id) {
    const res = await query(
      `DELETE FROM course_reviews WHERE id = $1 RETURNING id`,
      [id]
    );
    return res.rows[0] || null;
  },

  /**
   * Admin: Find all reviews across platform with filters
   * 
   * @param {Object} [options]
   * @param {boolean} [options.isApproved]
   * @param {number} [options.limit=50]
   * @param {number} [options.offset=0]
   * @returns {Promise<Array>}
   */
  async findAllAdmin({ isApproved, limit = 50, offset = 0 } = {}) {
    let sql = `
      SELECT cr.*,
             u.username,
             u.email,
             c.title as course_title,
             c.slug as course_slug
      FROM course_reviews cr
      JOIN users u ON cr.user_id = u.id
      JOIN courses c ON cr.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (isApproved !== undefined && isApproved !== null) {
      params.push(Boolean(isApproved));
      sql += ` AND cr.is_approved = $${params.length}`;
    }

    sql += ` ORDER BY cr.created_at DESC`;

    if (limit) {
      params.push(Math.min(100, Math.max(1, parseInt(limit, 10))));
      sql += ` LIMIT $${params.length}`;
    }

    if (offset) {
      params.push(Math.max(0, parseInt(offset, 10)));
      sql += ` OFFSET $${params.length}`;
    }

    const res = await query(sql, params);
    return res.rows;
  }
};
