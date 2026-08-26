import { query } from '../config/db.js';
import { Notification } from '../models/notificationModel.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userCountRes = await query('SELECT COUNT(*) FROM users');
    const courseCountRes = await query('SELECT COUNT(*) FROM courses');
    const enrollmentCountRes = await query('SELECT COUNT(*) FROM enrollments');
    const messageCountRes = await query("SELECT COUNT(*) FROM contact_messages WHERE status = 'unread'");
    const notificationCountRes = await query('SELECT COUNT(*) FROM notifications WHERE is_read = FALSE');

    const recentUsersRes = await query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );

    const recentEnrollmentsRes = await query(
      `SELECT e.id, u.username, c.title as course_title, e.progress, e.enrolled_at
       FROM enrollments e
       JOIN users u ON e.user_id = u.id
       JOIN courses c ON e.course_id = c.id
       ORDER BY e.enrolled_at DESC LIMIT 5`
    );

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: parseInt(userCountRes.rows[0].count, 10),
        totalCourses: parseInt(courseCountRes.rows[0].count, 10),
        totalEnrollments: parseInt(enrollmentCountRes.rows[0].count, 10),
        unreadMessages: parseInt(messageCountRes.rows[0].count, 10),
        unreadNotifications: parseInt(notificationCountRes.rows[0].count, 10)
      },
      recentUsers: recentUsersRes.rows,
      recentEnrollments: recentEnrollmentsRes.rows,
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching admin dashboard statistics' });
  }
};

/**
 * Get all notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const { unread } = req.query;
    let notifications;
    if (unread === 'true') {
      notifications = await Notification.findUnread();
    } else {
      notifications = await Notification.findAll();
    }
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.markAsRead(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Error updating notification status' });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead();
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Error updating notifications status' });
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};
