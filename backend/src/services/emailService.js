import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  // If SMTP configurations are not fully set, we will return a mock transporter
  const hasSmtpConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!hasSmtpConfig) {
    console.warn('⚠️ SMTP settings not fully configured in .env. Email Service is running in MOCK mode (logging to console).');
    return {
      sendMail: async (mailOptions) => {
        console.log('\n--- 📧 MOCK EMAIL SENT ---');
        console.log(`From: ${mailOptions.from}`);
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log('Body (Text):', mailOptions.text);
        console.log('Body (HTML):', mailOptions.html);
        console.log('--------------------------\n');
        return { messageId: 'mock-id-' + Date.now() };
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();
const adminEmail = process.env.ADMIN_EMAIL || 'jatinsharma932002@gmail.com';
const fromEmail = process.env.EMAIL_FROM || 'noreply@devopsacademy.com';

export const emailService = {
  /**
   * Send a general email
   */
  async sendEmail({ to, subject, text, html }) {
    try {
      const info = await transporter.sendMail({
        from: `DevOps Academy <${fromEmail}>`,
        to,
        subject,
        text,
        html,
      });
      console.log(`✉️ Email sent successfully: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      // Don't throw to avoid breaking the main request thread
      return null;
    }
  },

  /**
   * Send new contact message notification to Admin
   */
  async sendContactNotification(contactData) {
    const { name, email, subject, message } = contactData;
    const emailSubject = `[DevOps Academy] New Contact Message: ${subject}`;
    const text = `You have received a new contact message from ${name} (${email}):\n\nSubject: ${subject}\n\nMessage:\n${message}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border-left: 4px solid #6366f1; margin: 15px 0;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">This is an automated notification from DevOps Academy backend.</p>
      </div>
    `;

    return this.sendEmail({ to: adminEmail, subject: emailSubject, text, html });
  },

  /**
   * Send new enrollment notification to Admin
   */
  async sendEnrollmentNotification(enrollmentData) {
    const { studentName, studentEmail, courseTitle } = enrollmentData;
    const emailSubject = `[DevOps Academy] New Student Enrollment: ${courseTitle}`;
    const text = `New Enrollment Notification:\n\nStudent Name: ${studentName}\nEmail: ${studentEmail}\nEnrolled Course: ${courseTitle}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #10b981; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">🎉 New Course Enrollment!</h2>
        <p>A student has just enrolled in a course on DevOps Academy.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f9fafb;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Student Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${studentName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Email Address:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${studentEmail}">${studentEmail}</a></td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Course Title:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6366f1; font-weight: bold;">${courseTitle}</td>
          </tr>
        </table>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">This is an automated notification from DevOps Academy backend.</p>
      </div>
    `;

    return this.sendEmail({ to: adminEmail, subject: emailSubject, text, html });
  }
};
