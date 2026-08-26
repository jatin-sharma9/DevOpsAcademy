import { query } from '../config/db.js';

export const Notification = {
  async create({ title, message, type = 'other' }) {
    const res = await query(
      `INSERT INTO notifications (title, message, type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, message, type]
    );
    return res.rows[0];
  },

  async findAll() {
    const res = await query('SELECT * FROM notifications ORDER BY created_at DESC');
    return res.rows;
  },

  async findUnread() {
    const res = await query('SELECT * FROM notifications WHERE is_read = FALSE ORDER BY created_at DESC');
    return res.rows;
  },

  async markAsRead(id) {
    const res = await query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    return res.rows[0];
  },

  async markAllAsRead() {
    const res = await query(
      'UPDATE notifications SET is_read = TRUE WHERE is_read = FALSE RETURNING *'
    );
    return res.rows;
  },

  async delete(id) {
    const res = await query('DELETE FROM notifications WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }
};
