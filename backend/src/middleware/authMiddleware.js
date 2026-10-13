import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/userModel.js';

/**
 * Protect middleware: Ensures incoming request has a valid JWT token.
 * Populates req.user with the authenticated user database record.
 */
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const parts = authHeader.trim().split(/\s+/);
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route. No token provided.' 
    });
  }

  try {
    const decoded = verifyToken(token);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ 
        success: false, 
        message: 'User belonging to this token no longer exists' 
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired, please log in again',
        expired: true 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Token is invalid or malformed' 
    });
  }
};

/**
 * Role-based authorization middleware:
 * Ensures the authenticated user has one of the required roles.
 * 
 * @param  {...string} roles - Permitted roles (e.g. 'admin', 'instructor')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required before checking permissions' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }

    next();
  };
};

/**
 * Shorthand middleware for admin-only routes
 */
export const requireAdmin = [protect, authorize('admin')];
