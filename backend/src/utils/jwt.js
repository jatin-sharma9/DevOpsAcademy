import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'devops_academy_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT token for a user.
 * Accepts either a user object or a user id.
 * 
 * @param {Object|number|string} user - User object or user id
 * @param {string} [expiresIn] - Optional custom expiry
 * @returns {string} Signed JWT token
 */
export const generateToken = (user, expiresIn = JWT_EXPIRES_IN) => {
  let payload;

  if (typeof user === 'object' && user !== null) {
    payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'user',
    };
  } else {
    payload = { id: user };
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
};

/**
 * Verify and decode a JWT token.
 * 
 * @param {string} token - JWT token string
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  if (!token) {
    throw new Error('No token provided');
  }
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Decode a token without signature verification (useful for inspecting claims).
 * 
 * @param {string} token 
 * @returns {Object|null}
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
