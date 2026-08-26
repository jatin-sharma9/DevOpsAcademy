import express from 'express';
import {
  getDashboardStats,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require auth and admin roles for all routes below
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);

// Notification endpoints
router.get('/notifications', getNotifications);
router.put('/notifications/read', markAllNotificationsRead);
router.put('/notifications/:id/read', markNotificationRead);
router.delete('/notifications/:id', deleteNotification);

export default router;
