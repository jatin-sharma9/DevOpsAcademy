import { query } from '../config/db.js';

export const Blog = {
  async findAll({ publishedOnly = false, category, search, limit = 50, offset = 0 } = {}) {
    let sql = 'SELECT * FROM blogs WHERE 1=1';
    const params = [];

    if (publishedOnly) {
      params.push(true);
      sql += ` AND is_published = $${params.length}`;
    }

    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND category ILIKE $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      sql += ` AND (title ILIKE $${params.length} OR excerpt ILIKE $${params.length} OR content ILIKE $${params.length} OR array_to_string(tags, ' ') ILIKE $${params.length})`;
    }

    sql += ' ORDER BY is_featured DESC, created_at DESC';

    if (limit) {
      params.push(limit);
      sql += ` LIMIT $${params.length}`;
    }

    if (offset) {
      params.push(offset);
      sql += ` OFFSET $${params.length}`;
    }

    const res = await query(sql, params);
    return res.rows;
  },

  async findById(id) {
    const res = await query('SELECT * FROM blogs WHERE id = $1', [id]);
    return res.rows[0];
  },

  async findBySlug(slug) {
    const res = await query('SELECT * FROM blogs WHERE slug = $1', [slug]);
    return res.rows[0];
  },

  async create(blogData) {
    const {
      title,
      slug,
      excerpt,
      content,
      category = 'DevOps',
      tags = [],
      authorId = null,
      authorName = 'Jatin Sharma',
      authorTitle = 'Senior DevOps Engineer',
      coverImage = null,
      readTimeMinutes = 5,
      isFeatured = false,
      isPublished = true,
    } = blogData;

    const res = await query(
      `INSERT INTO blogs (
        title, slug, excerpt, content, category, tags,
        author_id, author_name, author_title, cover_image,
        read_time_minutes, is_featured, is_published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        title, slug, excerpt, content, category, tags,
        authorId, authorName, authorTitle, coverImage,
        readTimeMinutes, isFeatured, isPublished
      ]
    );
    return res.rows[0];
  },

  async update(id, blogData) {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      authorName,
      authorTitle,
      coverImage,
      readTimeMinutes,
      isFeatured,
      isPublished,
    } = blogData;

    const res = await query(
      `UPDATE blogs
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           excerpt = COALESCE($3, excerpt),
           content = COALESCE($4, content),
           category = COALESCE($5, category),
           tags = COALESCE($6, tags),
           author_name = COALESCE($7, author_name),
           author_title = COALESCE($8, author_title),
           cover_image = COALESCE($9, cover_image),
           read_time_minutes = COALESCE($10, read_time_minutes),
           is_featured = COALESCE($11, is_featured),
           is_published = COALESCE($12, is_published),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $13
       RETURNING *`,
      [
        title, slug, excerpt, content, category, tags,
        authorName, authorTitle, coverImage, readTimeMinutes,
        isFeatured, isPublished, id
      ]
    );
    return res.rows[0];
  },

  async delete(id) {
    const res = await query('DELETE FROM blogs WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  },

  async togglePublish(id, isPublished) {
    const res = await query(
      'UPDATE blogs SET is_published = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [isPublished, id]
    );
    return res.rows[0];
  },

  async toggleFeatured(id, isFeatured) {
    const res = await query(
      'UPDATE blogs SET is_featured = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [isFeatured, id]
    );
    return res.rows[0];
  },

  async incrementViews(idOrSlug) {
    const isNum = !isNaN(Number(idOrSlug));
    const sql = isNum
      ? 'UPDATE blogs SET view_count = view_count + 1 WHERE id = $1 RETURNING view_count'
      : 'UPDATE blogs SET view_count = view_count + 1 WHERE slug = $1 RETURNING view_count';
    const res = await query(sql, [idOrSlug]);
    return res.rows[0]?.view_count;
  },

  async count() {
    const res = await query('SELECT COUNT(*) FROM blogs');
    return parseInt(res.rows[0].count, 10);
  }
};
