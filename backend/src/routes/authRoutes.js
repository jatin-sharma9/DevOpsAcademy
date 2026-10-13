import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  verifyTokenHandler,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/verify', protect, verifyTokenHandler);
router.put('/profile', protect, updateProfile);

// Password Reset endpoints
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
