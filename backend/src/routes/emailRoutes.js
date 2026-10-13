import express from 'express';
import { testEmail, getEmailStatus, getEmailLogs } from '../controllers/emailController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / diagnostic test endpoint
router.post('/test', testEmail);
router.get('/status', getEmailStatus);

// Protected admin routes for logs
router.get('/logs', protect, authorize('admin'), getEmailLogs);

export default router;
