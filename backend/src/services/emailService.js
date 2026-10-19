import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { query } from '../config/db.js';
import {
  contactFormTemplates,
  enrollmentTemplates,
  welcomeEmailTemplate,
  passwordResetTemplate,
  testEmailTemplate,
} from './emailTemplates.js';

dotenv.config();

/**
 * Configure Nodemailer Transporter
 * Gmail is the default SMTP provider (host: smtp.gmail.com, port: 465, secure: true).
 * Supports environment variables (SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_SERVICE) to override these defaults.
 * Preserves support for other SMTP providers when explicitly configured.
 * Email credentials are never hardcoded and default to empty.
 */
export const getSmtpConfig = () => {
  const serviceEnv = (process.env.SMTP_SERVICE || '').trim().toLowerCase();
  const hostEnv = (process.env.SMTP_HOST || '').trim();
  const portEnv = (process.env.SMTP_PORT || '').trim();
  const secureEnv = (process.env.SMTP_SECURE || '').trim().toLowerCase();

  // Check if a non-Gmail host or service was explicitly configured
  const isExplicitNonGmailHost = Boolean(hostEnv && !hostEnv.toLowerCase().includes('gmail'));
  const isExplicitNonGmailService = Boolean(serviceEnv && serviceEnv !== 'gmail');
  const isExplicitCustom = isExplicitNonGmailHost || isExplicitNonGmailService;

  // Gmail is the default SMTP provider unless explicitly configured otherwise
  const isGmail = !isExplicitCustom;

  // Host: defaults to smtp.gmail.com (overridden by SMTP_HOST if set)
  const host = hostEnv || (isGmail ? 'smtp.gmail.com' : 'localhost');

  // Port: defaults to 465 for Gmail, 587 for standard SMTP STARTTLS (overridden by SMTP_PORT if set)
  let port;
  if (portEnv) {
    port = parseInt(portEnv, 10);
  } else {
    port = isGmail ? 465 : 587;
  }

  // Secure: defaults to true (port 465 / Gmail SSL), false for port 587 STARTTLS (overridden by SMTP_SECURE if set)
  let secure;
  if (secureEnv === 'true') {
    secure = true;
  } else if (secureEnv === 'false') {
    secure = false;
  } else {
    secure = port === 465 || isGmail;
  }

  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const hasCredentials = Boolean(user && pass);

  // Friendly provider name for status reporting and logs
  let provider;
  if (isGmail) {
    provider = 'Gmail';
  } else if (serviceEnv) {
    provider = serviceEnv.charAt(0).toUpperCase() + serviceEnv.slice(1);
  } else {
    provider = host;
  }

  return {
    isGmail,
    provider,
    host,
    port,
    secure,
    user,
    pass,
    hasCredentials,
    service: isGmail ? 'gmail' : (serviceEnv || undefined),
  };
};

// Global transporter singleton & state
let transporterInstance = null;
let isMockTransporter = false;

const initTransporter = () => {
  const config = getSmtpConfig();

  if (!config.hasCredentials) {
    isMockTransporter = true;
    console.warn('⚠️  [EmailService] SMTP credentials not detected in .env. Running in MOCK / Console simulation mode.');

    transporterInstance = {
      sendMail: async (mailOptions) => {
        const messageId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        console.log('\n================== 📧 MOCK EMAIL DISPATCH ==================');
        console.log(`🆔 Message ID : ${messageId}`);
        console.log(`📤 From       : ${mailOptions.from}`);
        console.log(`📥 To         : ${mailOptions.to}`);
        console.log(`📋 Subject    : ${mailOptions.subject}`);
        console.log(`⏰ Timestamp  : ${new Date().toISOString()}`);
        console.log('--- Body Preview ---');
        console.log(mailOptions.text ? mailOptions.text.slice(0, 300) : '(HTML Only Content)');
        console.log('===========================================================\n');
        return { messageId, accepted: [mailOptions.to], rejected: [] };
      },
      verify: async () => true,
    };
    return transporterInstance;
  }

  isMockTransporter = false;

  const transportOptions = config.isGmail
    ? {
        service: 'gmail',
        auth: {
          user: config.user,
          pass: config.pass,
        },
      }
    : {
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.pass,
        },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
      };

  transporterInstance = nodemailer.createTransport(transportOptions);
  console.log(`📧 [EmailService] Configured Nodemailer with ${config.isGmail ? 'Gmail SMTP' : `${config.host}:${config.port}`}`);

  return transporterInstance;
};

// Initialize transporter on load
initTransporter();

/**
 * Log email dispatch in PostgreSQL database
 */
const logEmailToDatabase = async ({ type, recipient, subject, status, error = null, payload = {} }) => {
  try {
    await query(
      `INSERT INTO email_logs (type, recipient, subject, payload, status, error)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        type || 'general',
        recipient,
        subject,
        JSON.stringify(payload),
        status,
        error ? String(error) : null,
      ]
    );
  } catch (err) {
    // Non-fatal logging error
    console.error('Failed to write email log to database:', err.message);
  }
};

export const emailService = {
  /**
   * Re-initialize or reload transporter (useful after updating .env or settings)
   */
  reloadTransporter() {
    return initTransporter();
  },

  /**
   * Verify SMTP transporter connection
   */
  async verifyConnection() {
    const config = getSmtpConfig();
    if (isMockTransporter) {
      return {
        configured: false,
        verified: true,
        isMock: true,
        message: 'Email service running in Mock/Development mode (no credentials provided in .env).',
      };
    }

    try {
      await transporterInstance.verify();
      return {
        configured: true,
        verified: true,
        isMock: false,
        message: `Successfully connected to ${config.isGmail ? 'Gmail SMTP' : config.host}.`,
      };
    } catch (err) {
      console.error('❌ [EmailService] SMTP Connection verification failed:', err.message);
      return {
        configured: true,
        verified: false,
        isMock: false,
        error: err.message,
        message: 'Failed to authenticate with SMTP server. Verify your SMTP_USER and SMTP_PASS (Gmail App Password).',
      };
    }
  },

  /**
   * Get current email service status & configuration overview
   */
  getStatus() {
    const config = getSmtpConfig();
    return {
      configured: config.hasCredentials,
      isMock: isMockTransporter,
      provider: config.provider,
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.user ? config.user.replace(/(.{2})(.*)(@.*)/, '$1***$3') : null,
      adminEmail: process.env.ADMIN_EMAIL || 'jatinsharma932002@gmail.com',
      fromEmail: process.env.EMAIL_FROM || '"DevOps Academy" <noreply@devopsacademy.com>',
    };
  },

  /**
   * Core sendEmail function
   * 
   * @param {Object} options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject line
   * @param {string} [options.text] - Plain text body
   * @param {string} [options.html] - HTML body
   * @param {string} [options.type] - Category/type for logging
   * @param {Object} [options.payload] - Metadata to persist in email_logs
   * @returns {Promise<Object>} Result envelope with success status and messageId
   */
  async sendEmail({ to, subject, text, html, type = 'general', payload = {} }) {
    if (!to) {
      console.error('❌ [EmailService] Recipient "to" address is required.');
      return { success: false, error: 'Recipient email address is required' };
    }

    const fromAddress = process.env.EMAIL_FROM || `"DevOps Academy" <noreply@devopsacademy.com>`;

    try {
      const info = await transporterInstance.sendMail({
        from: fromAddress,
        to,
        subject,
        text,
        html,
      });

      console.log(`✉️  [EmailService] Email sent successfully to ${to} (ID: ${info.messageId})`);

      await logEmailToDatabase({
        type,
        recipient: to,
        subject,
        status: 'success',
        payload: { ...payload, messageId: info.messageId, isMock: isMockTransporter },
      });

      return {
        success: true,
        messageId: info.messageId,
        to,
        subject,
        type,
        isMock: isMockTransporter,
      };
    } catch (error) {
      console.error(`❌ [EmailService] Failed to send email to ${to}:`, error.message);

      await logEmailToDatabase({
        type,
        recipient: to,
        subject,
        status: 'failure',
        error: error.message,
        payload,
      });

      return {
        success: false,
        error: error.message,
        to,
        subject,
      };
    }
  },

  /**
   * 1. Contact Form: Sends admin notification & user receipt confirmation
   */
  async sendContactEmails({ name, email, subject, message }) {
    const adminEmail = process.env.ADMIN_EMAIL || 'jatinsharma932002@gmail.com';

    // 1. Notify Admin
    const adminTpl = contactFormTemplates.adminNotification({ name, email, subject, message });
    const adminResult = await this.sendEmail({
      to: adminEmail,
      subject: adminTpl.subject,
      html: adminTpl.html,
      text: adminTpl.text,
      type: 'contact_admin_notification',
      payload: { name, email, subject },
    });

    // 2. Send Confirmation to User
    const userTpl = contactFormTemplates.userConfirmation({ name, subject, message });
    const userResult = await this.sendEmail({
      to: email,
      subject: userTpl.subject,
      html: userTpl.html,
      text: userTpl.text,
      type: 'contact_user_confirmation',
      payload: { name, subject },
    });

    return { adminResult, userResult };
  },

  // Retain legacy method for backward compatibility
  async sendContactNotification(contactData) {
    return this.sendContactEmails(contactData);
  },

  /**
   * 2. Course Enrollment: Sends congratulations to student & notification to admin
   */
  async sendEnrollmentEmails({ studentName, studentEmail, courseTitle, courseSlug = '' }) {
    const adminEmail = process.env.ADMIN_EMAIL || 'jatinsharma932002@gmail.com';

    // 1. Send confirmation to student
    const studentTpl = enrollmentTemplates.studentWelcome({ studentName, courseTitle, courseSlug });
    const studentResult = await this.sendEmail({
      to: studentEmail,
      subject: studentTpl.subject,
      html: studentTpl.html,
      text: studentTpl.text,
      type: 'enrollment_student',
      payload: { studentName, courseTitle, courseSlug },
    });

    // 2. Send notification to admin
    const adminTpl = enrollmentTemplates.adminNotification({ studentName, studentEmail, courseTitle });
    const adminResult = await this.sendEmail({
      to: adminEmail,
      subject: adminTpl.subject,
      html: adminTpl.html,
      text: adminTpl.text,
      type: 'enrollment_admin',
      payload: { studentName, studentEmail, courseTitle },
    });

    return { studentResult, adminResult };
  },

  // Retain legacy method for backward compatibility
  async sendEnrollmentNotification(enrollmentData) {
    return this.sendEnrollmentEmails(enrollmentData);
  },

  /**
   * 3. Welcome Email: Sent to newly registered users
   */
  async sendWelcomeEmail({ username, email }) {
    const tpl = welcomeEmailTemplate({ username, email });
    return this.sendEmail({
      to: email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      type: 'welcome_registration',
      payload: { username, email },
    });
  },

  /**
   * 4. Password Reset: Sends secure reset link and instructions
   */
  async sendPasswordResetEmail({ email, username = '', resetToken, resetUrl, expiresMinutes = 30 }) {
    const finalUrl = resetUrl || `http://localhost:5200/reset-password?token=${resetToken}`;
    const tpl = passwordResetTemplate({ username, resetUrl: finalUrl, resetToken, expiresMinutes });

    return this.sendEmail({
      to: email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      type: 'password_reset',
      payload: { email, username, expiresMinutes },
    });
  },

  /**
   * 5. Test Email: Sends diagnostic verification email
   */
  async sendTestEmail({ to }) {
    const recipient = to || process.env.ADMIN_EMAIL || 'jatinsharma932002@gmail.com';
    const config = getSmtpConfig();
    const smtpInfo = {
      provider: config.isGmail ? 'Gmail SMTP' : `${config.host}:${config.port}`,
      host: config.host,
      port: config.port,
      secure: config.secure,
      isMock: isMockTransporter,
    };

    const tpl = testEmailTemplate({ to: recipient, smtpInfo });

    return this.sendEmail({
      to: recipient,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      type: 'smtp_test',
      payload: smtpInfo,
    });
  },
};
