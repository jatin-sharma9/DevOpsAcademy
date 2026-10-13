import express from 'express';
import {
  getDashboardStats,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getAllCertificates,
  issueCertificate,
  deleteCertificate,
  getAnalyticsData,
  getEmailSettings,
  saveEmailSettings,
  getAuditLogs,
} from '../controllers/adminController.js';
import { testEmail, getEmailStatus, getEmailLogs } from '../controllers/emailController.js';
import { moderateReview, getAllReviewsAdmin, deleteReviewAdmin } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require auth and admin roles for all routes below
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalyticsData);
router.get('/audit-logs', getAuditLogs);

// Certificate management endpoints
router.get('/certificates', getAllCertificates);
router.post('/certificates', issueCertificate);
router.delete('/certificates/:id', deleteCertificate);

// Review moderation endpoints
router.get('/reviews', getAllReviewsAdmin);
router.put('/reviews/:id/moderate', moderateReview);
router.delete('/reviews/:id', deleteReviewAdmin);

// Notification endpoints
router.get('/notifications', getNotifications);
router.put('/notifications/read', markAllNotificationsRead);
router.put('/notifications/:id/read', markNotificationRead);
router.delete('/notifications/:id', deleteNotification);

// Email management endpoints
router.post('/email/test', testEmail);
router.get('/email/status', getEmailStatus);
router.get('/email/logs', getEmailLogs);
router.get('/email/settings', getEmailSettings);
router.put('/email/settings', saveEmailSettings);

export default router;
