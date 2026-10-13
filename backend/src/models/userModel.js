import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';

export const User = {
  /**
   * Find user by email (case-insensitive and trimmed)
   */
  async findByEmail(email) {
    if (!email || typeof email !== 'string') return null;
    const res = await query('SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))', [email]);
    return res.rows[0];
  },

  /**
   * Find user by username (case-insensitive and trimmed)
   */
  async findByUsername(username) {
    if (!username || typeof username !== 'string') return null;
    const res = await query('SELECT * FROM users WHERE LOWER(TRIM(username)) = LOWER(TRIM($1))', [username]);
    return res.rows[0];
  },

  /**
   * Find user by identifier (either username or email, case-insensitive)
   * Also supports known username aliases for admin account.
   */
  async findByIdentifier(identifier) {
    if (!identifier || typeof identifier !== 'string') return null;
    const clean = identifier.trim();

    // Direct match against username or email
    const res = await query(
      `SELECT * FROM users 
       WHERE LOWER(TRIM(username)) = LOWER($1) 
          OR LOWER(TRIM(email)) = LOWER($1)`,
      [clean]
    );
    if (res.rows[0]) return res.rows[0];

    // Alias fallback: handle Jatin.Sharma93 <-> Jatin_Sharma
    const normalized = clean.replace(/[._\-\s]/g, '').toLowerCase();
    if (normalized === 'jatinsharma' || normalized === 'jatinsharma93') {
      const aliasRes = await query(
        `SELECT * FROM users 
         WHERE LOWER(TRIM(username)) IN ('jatin_sharma', 'jatin.sharma93') 
            OR LOWER(TRIM(email)) = 'jatinsharma932002@gmail.com'
         ORDER BY (CASE WHEN role = 'admin' THEN 0 ELSE 1 END), id ASC 
         LIMIT 1`
      );
      if (aliasRes.rows[0]) return aliasRes.rows[0];
    }

    return null;
  },

  /**
   * Find user by primary key ID (excludes password_hash from return)
   */
  async findById(id) {
    if (!id) return null;
    const res = await query('SELECT id, username, email, role, created_at FROM users WHERE id = $1', [id]);
    return res.rows[0];
  },

  /**
   * Create a new user with hashed password
   */
  async create({ username, email, password, role = 'user' }) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const res = await query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, created_at`,
      [username.trim(), email.trim().toLowerCase(), passwordHash, role]
    );
    return res.rows[0];
  },

  /**
   * Validate password against stored hash, with fallback support for configured default admin passwords.
   */
  async validatePassword(password, passwordHash, user = null) {
    if (!password || typeof password !== 'string' || !passwordHash) {
      return false;
    }

    const match = await bcrypt.compare(password, passwordHash);
    if (match) return true;

    // For admin users, support configured default admin password or dev fallback passwords in non-production environments
    if (user && user.role === 'admin') {
      const isDevOrTest = process.env.NODE_ENV !== 'production';
      const allowedAdminPasswords = [
        process.env.DEFAULT_ADMIN_PASSWORD,
        ...(isDevOrTest ? ['J@tinS93', 'Admin@123', 'admin123', 'Admin123'] : []),
      ].filter(Boolean);

      if (allowedAdminPasswords.includes(password)) {
        return true;
      }
    }

    return false;
  },

  /**
   * Ensure default admin account exists in database.
   * If an admin account exists with a legacy username (e.g. Jatin.Sharma93), update it to Jatin_Sharma.
   * If no admin account exists, create one with username 'Jatin_Sharma'.
   */
  async ensureDefaultAdmin() {
    try {
      const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || 'Jatin_Sharma';
      const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'jatinsharma932002@gmail.com';
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'J@tinS93';

      // 1. Check if user with target username already exists
      const existingByUsername = await query(
        'SELECT * FROM users WHERE LOWER(TRIM(username)) = LOWER($1)',
        [defaultUsername]
      );

      if (existingByUsername.rows.length > 0) {
        const user = existingByUsername.rows[0];
        if (user.role !== 'admin') {
          await query('UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['admin', user.id]);
          console.log(`[Admin Setup] Granted admin role to existing user: ${user.username}`);
        } else {
          console.log(`[Admin Setup] Default admin account '${defaultUsername}' verified.`);
        }
        return user;
      }

      // 2. Check if a user with default email exists (e.g., from earlier seed with Jatin.Sharma93)
      const existingByEmail = await query(
        'SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER($1)',
        [defaultEmail]
      );

      if (existingByEmail.rows.length > 0) {
        const user = existingByEmail.rows[0];
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(defaultPassword, salt);
        const updated = await query(
          `UPDATE users 
           SET username = $1, role = 'admin', password_hash = $2, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $3 
           RETURNING id, username, email, role, created_at`,
          [defaultUsername, passwordHash, user.id]
        );
        console.log(`[Admin Setup] Updated existing admin user (ID ${user.id}) username to '${defaultUsername}'.`);
        return updated.rows[0];
      }

      // 3. Create default admin from scratch
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);
      const created = await query(
        `INSERT INTO users (username, email, password_hash, role)
         VALUES ($1, $2, $3, 'admin')
         RETURNING id, username, email, role, created_at`,
        [defaultUsername, defaultEmail, passwordHash]
      );
      console.log(`[Admin Setup] Created default admin account '${defaultUsername}' (${defaultEmail}).`);
      return created.rows[0];
    } catch (error) {
      console.error('[Admin Setup] Failed to ensure default admin account:', error.message);
      return null;
    }
  },

  /**
   * Find all users
   */
  async findAll() {
    const res = await query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    return res.rows;
  },

  /**
   * Update a user's role
   */
  async updateRole(id, role) {
    const res = await query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, email, role',
      [role, id]
    );
    return res.rows[0];
  },

  /**
   * Update user profile credentials
   */
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
        [username.trim(), email.trim().toLowerCase(), passwordHash, id]
      );
    } else {
      res = await query(
        `UPDATE users
         SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, username, email, role, created_at`,
        [username.trim(), email.trim().toLowerCase(), id]
      );
    }
    return res.rows[0];
  },

  /**
   * Delete a user by ID (prevents deleting the default admin)
   */
  async delete(id) {
    const target = await this.findById(id);
    if (!target) return null;

    const defaultAdminUsername = (process.env.DEFAULT_ADMIN_USERNAME || 'Jatin_Sharma').toLowerCase();
    if (target.username.toLowerCase() === defaultAdminUsername) {
      throw new Error('Cannot delete default admin account');
    }

    const res = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }
};
