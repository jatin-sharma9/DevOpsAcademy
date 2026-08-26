import { query } from '../config/db.js';

export const Certificate = {
  async create(userId, courseId, certificateHash) {
    const res = await query(
      `INSERT INTO certificates (user_id, course_id, certificate_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, course_id) DO UPDATE SET certificate_hash = certificates.certificate_hash
       RETURNING *`,
      [userId, courseId, certificateHash]
    );
    return res.rows[0];
  },

  async findByUserAndCourse(userId, courseId) {
    const res = await query(
      `SELECT cert.*, u.username, u.email, c.title as course_title
       FROM certificates cert
       JOIN users u ON cert.user_id = u.id
       JOIN courses c ON cert.course_id = c.id
       WHERE cert.user_id = $1 AND cert.course_id = $2`,
      [userId, courseId]
    );
    return res.rows[0];
  },

  async findByHash(hash) {
    const res = await query(
      `SELECT cert.*, u.username, u.email, c.title as course_title, c.slug as course_slug
       FROM certificates cert
       JOIN users u ON cert.user_id = u.id
       JOIN courses c ON cert.course_id = c.id
       WHERE cert.certificate_hash = $1`,
      [hash]
    );
    return res.rows[0];
  },

  async findByUserId(userId) {
    const res = await query(
      `SELECT cert.*, c.title as course_title, c.slug as course_slug, c.category as course_category
       FROM certificates cert
       JOIN courses c ON cert.course_id = c.id
       WHERE cert.user_id = $1
       ORDER BY cert.issued_at DESC`,
      [userId]
    );
    return res.rows;
  },

  async findAll() {
    const res = await query(
      `SELECT cert.*, u.username, u.email, c.title as course_title
       FROM certificates cert
       JOIN users u ON cert.user_id = u.id
       JOIN courses c ON cert.course_id = c.id
       ORDER BY cert.issued_at DESC`
    );
    return res.rows;
  }
};
