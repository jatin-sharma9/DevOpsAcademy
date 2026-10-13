import { emailService } from '../services/emailService.js';
import { query } from '../config/db.js';

/**
 * Test email sending endpoint
 * POST /api/email/test
 */
export const testEmail = async (req, res) => {
  try {
    const { to, type = 'test' } = req.body;
    const recipient = to || process.env.ADMIN_EMAIL || 'jatinsharma932002@gmail.com';

    let result;

    switch (type) {
      case 'welcome':
        result = await emailService.sendWelcomeEmail({
          username: 'DevOps Engineer',
          email: recipient,
        });
        break;

      case 'contact':
        result = await emailService.sendContactEmails({
          name: 'Jatin Sharma',
          email: recipient,
          subject: 'DevOps Mentorship Inquiry',
          message: 'Hello, I would like to inquire about the Kubernetes certification and hands-on labs.',
        });
        break;

      case 'enrollment':
        result = await emailService.sendEnrollmentEmails({
          studentName: 'Jatin Sharma',
          studentEmail: recipient,
          courseTitle: 'Kubernetes Mastery: Zero to Production Hero',
          courseSlug: 'kubernetes-mastery',
        });
        break;

      case 'reset':
        result = await emailService.sendPasswordResetEmail({
          email: recipient,
          username: 'Jatin_Sharma',
          resetToken: 'sample_secure_reset_token_xyz123',
          resetUrl: 'http://localhost:5200/reset-password?token=sample_secure_reset_token_xyz123',
          expiresMinutes: 30,
        });
        break;

      case 'test':
      default:
        result = await emailService.sendTestEmail({ to: recipient });
        break;
    }

    if (!result || result.success === false) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result?.error || 'Unknown email delivery error',
      });
    }

    res.status(200).json({
      success: true,
      message: `Test email (${type}) processed successfully`,
      data: result,
      status: emailService.getStatus(),
    });
  } catch (error) {
    console.error('Error in testEmail endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending test email',
      error: error.message,
    });
  }
};

/**
 * Get email system and SMTP connection status
 * GET /api/email/status
 */
export const getEmailStatus = async (req, res) => {
  try {
    const status = emailService.getStatus();
    const verification = await emailService.verifyConnection();

    res.status(200).json({
      success: true,
      status,
      connection: verification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve email status',
      error: error.message,
    });
  }
};

/**
 * Get recent email logs from database
 * GET /api/email/logs
 */
export const getEmailLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '20', 10);
    const result = await query(
      'SELECT id, type, recipient, subject, status, error, payload, created_at FROM email_logs ORDER BY created_at DESC LIMIT $1',
      [limit]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve email logs',
      error: error.message,
    });
  }
};
