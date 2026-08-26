import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';

export const User = {
  async findByEmail(email) {
    const res = await query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  },

  async findByUsername(username) {
    const res = await query('SELECT * FROM users WHERE username = $1', [username]);
    return res.rows[0];
  },

  async findById(id) {
    const res = await query('SELECT id, username, email, role, created_at FROM users WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ username, email, password, role = 'user' }) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const res = await query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, created_at`,
      [username, email, passwordHash, role]
    );
    return res.rows[0];
  },

  async validatePassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  },

  async findAll() {
    const res = await query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    return res.rows;
  },

  async updateRole(id, role) {
    const res = await query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, email, role',
      [role, id]
    );
    return res.rows[0];
  },

  async updateProfile(id, { username, email, password }) {
    let res;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      res = await query(
        `UPDATE users
         SET username = $1, email = $2, password_hash = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING id, username, email, role, created_at`,
        [username, email, passwordHash, id]
      );
    } else {
      res = await query(
        `UPDATE users
         SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, username, email, role, created_at`,
        [username, email, id]
      );
    }
    return res.rows[0];
  },

  async delete(id) {
    const res = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }
};
