import { query } from '../config/db.js';

export const ContactMessage = {
  async create({ name, email, subject, message }) {
    const res = await query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, subject, message]
    );
    return res.rows[0];
  },

  async findAll() {
    const res = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return res.rows;
  },

  async updateStatus(id, status) {
    const res = await query(
      'UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    const res = await query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }
};
