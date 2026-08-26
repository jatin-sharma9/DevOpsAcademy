import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devops_academy_super_secret_jwt_key_2026');
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next();
  };
};
