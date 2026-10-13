import { query } from '../config/db.js';

export const Category = {
  /**
   * Find all categories ordered by sort_order ascending
   * Includes dynamic course count for each category
   */
  async findAll() {
    const res = await query(`
      SELECT cat.*,
             COUNT(c.id)::int as count
      FROM categories cat
      LEFT JOIN courses c ON (
        LOWER(c.category) = LOWER(cat.name) 
        OR LOWER(c.category) = LOWER(cat.slug)
      )
      GROUP BY cat.id
      ORDER BY cat.sort_order ASC, cat.name ASC
    `);
    return res.rows;
  },

  /**
   * Find single category by ID
   */
  async findById(id) {
    const res = await query('SELECT * FROM categories WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  /**
   * Find single category by Slug
   */
  async findBySlug(slug) {
    const res = await query('SELECT * FROM categories WHERE LOWER(slug) = LOWER($1)', [slug]);
    return res.rows[0] || null;
  },

  /**
   * Create a new category
   */
  async create({ name, slug, description, icon = 'Layers', sort_order = 0 }) {
    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const res = await query(
      `INSERT INTO categories (name, slug, description, icon, sort_order, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [name.trim(), cleanSlug, description ? description.trim() : null, icon, parseInt(sort_order, 10) || 0]
    );
    return res.rows[0];
  },

  /**
   * Update category by ID
   */
  async update(id, { name, slug, description, icon, sort_order }) {
    const current = await this.findById(id);
    if (!current) return null;

    const newName = name !== undefined ? name.trim() : current.name;
    const newSlug = slug !== undefined 
      ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') 
      : current.slug;
    const newDesc = description !== undefined ? description : current.description;
    const newIcon = icon !== undefined ? icon : current.icon;
    const newOrder = sort_order !== undefined ? parseInt(sort_order, 10) : current.sort_order;

    const res = await query(
      `UPDATE categories
       SET name = $1, slug = $2, description = $3, icon = $4, sort_order = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [newName, newSlug, newDesc, newIcon, newOrder, id]
    );
    return res.rows[0];
  },

  /**
   * Delete category by ID
   */
  async delete(id) {
    const res = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] || null;
  }
};
