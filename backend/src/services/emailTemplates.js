/**
 * DevOps Academy Email Templates
 * Responsive, modern, clean HTML & plain-text templates for Nodemailer
 */

const BRAND_NAME = 'DevOps Academy';
const BRAND_COLOR = '#6366f1'; // Indigo
const ACCENT_COLOR = '#10b981'; // Emerald
const DARK_BG = '#0f172a'; // Slate-900

/**
 * Base email layout wrapper with modern typography and responsive styling
 */
const baseLayout = ({ title, preheader = '', content, footerNote = '' }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #334155;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, ${DARK_BG} 0%, #1e1b4b 100%);
      padding: 32px 30px;
      text-align: center;
      border-bottom: 2px solid ${BRAND_COLOR};
    }
    .logo {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .logo span {
      color: #818cf8;
    }
    .header-badge {
      display: inline-block;
      margin-top: 8px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: rgba(99, 102, 241, 0.25);
      color: #c7d2fe;
      padding: 4px 12px;
      border-radius: 9999px;
    }
    .body {
      padding: 36px 32px;
      font-size: 15px;
      line-height: 1.6;
    }
    h1, h2, h3 {
      color: #0f172a;
      margin-top: 0;
      font-weight: 700;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
    }
    .info-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid ${BRAND_COLOR};
      border-radius: 8px;
      padding: 16px 20px;
      margin: 20px 0;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px 30px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <span style="display:none;font-size:1px;color:#f8fafc;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="http://localhost:5200" class="logo">DevOps<span>Academy</span></a>
        <div><span class="header-badge">Master Cloud & DevOps</span></div>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p style="margin: 0 0 8px 0;">DevOps Academy • Expert-led DevOps, Kubernetes, CI/CD & Cloud Engineering</p>
        ${footerNote ? `<p style="margin: 0 0 8px 0; color: #94a3b8;">${footerNote}</p>` : ''}
        <p style="margin: 0;">© ${new Date().getFullYear()} DevOps Academy. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};

/**
 * 1. Contact Form Templates
 */
export const contactFormTemplates = {
  // To Admin
  adminNotification({ name, email, subject, message }) {
    const title = `New Contact Form Inquiry: ${subject}`;
    const html = baseLayout({
      title,
      preheader: `New message from ${name} (${email})`,
      content: `
        <h2 style="color: #1e293b; font-size: 20px;">📬 New Contact Inquiry Received</h2>
        <p>A visitor has submitted a new inquiry via the DevOps Academy contact portal.</p>
        
        <div class="info-card">
          <p style="margin: 4px 0;"><strong>Sender Name:</strong> ${name}</p>
          <p style="margin: 4px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #6366f1;">${email}</a></p>
          <p style="margin: 4px 0;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 4px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <h3 style="font-size: 15px; margin-top: 24px; color: #475569;">Message Content:</h3>
        <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 10px 0; white-space: pre-wrap; font-family: monospace; font-size: 13px; color: #1e293b;">${message}</div>

        <div style="text-align: center; margin-top: 25px;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="btn">Reply Directly via Email</a>
        </div>
      `,
      footerNote: 'This is an internal administrator alert from the DevOps Academy portal.'
    });

    const text = `
New Contact Inquiry Received:
Name: ${name}
Email: ${email}
Subject: ${subject}
Date: ${new Date().toLocaleString()}

Message:
${message}
    `.trim();

    return { subject: `[Inquiry] ${subject}`, html, text };
  },

  // Confirmation To User
  userConfirmation({ name, subject, message }) {
    const title = `We've received your message - DevOps Academy`;
    const html = baseLayout({
      title,
      preheader: `Hi ${name}, thank you for contacting DevOps Academy.`,
      content: `
        <h2 style="color: #1e293b; font-size: 20px;">Thank You for Reaching Out! 👋</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>We've received your inquiry regarding "<strong>${subject}</strong>". Our DevOps mentoring and support team typically reviews inquiries and replies within <strong>24 to 48 hours</strong>.</p>
        
        <div class="info-card">
          <p style="margin: 4px 0;"><strong>Summary of your message:</strong></p>
          <p style="margin: 8px 0; font-style: italic; color: #475569;">"${message.length > 200 ? message.slice(0, 200) + '...' : message}"</p>
        </div>

        <p>In the meantime, feel free to explore our free hands-on guides, learning paths, and interactive quizzes.</p>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="http://localhost:5200/courses" class="btn">Browse Course Catalog</a>
        </div>
      `,
      footerNote: 'You received this confirmation because you submitted an inquiry on DevOps Academy.'
    });

    const text = `
Hi ${name},

Thank you for contacting DevOps Academy!
We received your inquiry regarding "${subject}". Our team will get back to you within 24 to 48 hours.

Best regards,
The DevOps Academy Team
http://localhost:5200
    `.trim();

    return { subject: `We received your message: ${subject}`, html, text };
  }
};

/**
 * 2. Course Enrollment Templates
 */
export const enrollmentTemplates = {
  // To Student
  studentWelcome({ studentName, courseTitle, courseSlug = '' }) {
    const courseUrl = courseSlug ? `http://localhost:5200/courses/${courseSlug}` : 'http://localhost:5200/dashboard';
    const title = `Welcome to ${courseTitle} - DevOps Academy`;

    const html = baseLayout({
      title,
      preheader: `You're in! Start learning ${courseTitle} now.`,
      content: `
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px;">🚀</span>
          <h2 style="font-size: 22px; color: #0f172a; margin-top: 10px;">Enrollment Confirmed!</h2>
          <p style="color: #64748b; margin-top: 4px;">You are now enrolled in <strong>${courseTitle}</strong></p>
        </div>

        <p>Hi <strong>${studentName}</strong>,</p>
        <p>Congratulations on taking the next step in your cloud and DevOps journey. You now have full lifetime access to this course, interactive lab guides, and verification certificates.</p>

        <div class="info-card" style="border-left-color: ${ACCENT_COLOR};">
          <h4 style="margin: 0 0 8px 0; color: #065f46;">What to expect:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #334155;">
            <li>Step-by-step production-grade modules</li>
            <li>Hands-on terminal exercises & Docker/K8s blueprints</li>
            <li>Progress tracking and verifiable completion certificate</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${courseUrl}" class="btn" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);">Start Learning Now →</a>
        </div>

        <p style="font-size: 13px; color: #64748b;">Need help or have questions? Check your <a href="http://localhost:5200/dashboard" style="color: #6366f1;">Student Dashboard</a> or contact our instructor team anytime.</p>
      `,
      footerNote: 'You received this email because you enrolled in a DevOps Academy course.'
    });

    const text = `
Enrollment Confirmed!

Hi ${studentName},
You are now enrolled in ${courseTitle}!

Access your course and lessons here:
${courseUrl}

Happy learning!
DevOps Academy Team
    `.trim();

    return { subject: `🎉 Enrollment Confirmed: ${courseTitle}`, html, text };
  },

  // To Admin
  adminNotification({ studentName, studentEmail, courseTitle }) {
    const title = `New Course Enrollment: ${courseTitle}`;
    const html = baseLayout({
      title,
      preheader: `${studentName} enrolled in ${courseTitle}`,
      content: `
        <h2 style="color: #0f172a; font-size: 20px;">🎓 New Student Enrollment</h2>
        <p>A new student has enrolled in a course on DevOps Academy.</p>

        <div class="info-card" style="border-left-color: #10b981;">
          <p style="margin: 4px 0;"><strong>Student Name:</strong> ${studentName}</p>
          <p style="margin: 4px 0;"><strong>Student Email:</strong> <a href="mailto:${studentEmail}" style="color: #6366f1;">${studentEmail}</a></p>
          <p style="margin: 4px 0;"><strong>Course:</strong> <span style="color: #6366f1; font-weight: bold;">${courseTitle}</span></p>
          <p style="margin: 4px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="text-align: center; margin-top: 25px;">
          <a href="http://localhost:5200/admin" class="btn">View Admin Analytics</a>
        </div>
      `,
      footerNote: 'This is an internal administrator notification.'
    });

    const text = `
New Student Enrollment:
Student: ${studentName} (${studentEmail})
Course: ${courseTitle}
Date: ${new Date().toLocaleString()}
    `.trim();

    return { subject: `[Enrollment] ${studentName} enrolled in ${courseTitle}`, html, text };
  }
};

/**
 * 3. Welcome Email Template (New Account Registration)
 */
export const welcomeEmailTemplate = ({ username, email }) => {
  const title = `Welcome to DevOps Academy, ${username}!`;
  const html = baseLayout({
    title,
    preheader: `Welcome ${username}! Your journey to mastering Cloud & DevOps starts today.`,
    content: `
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px;">⚡</span>
        <h2 style="font-size: 22px; color: #0f172a; margin-top: 10px;">Welcome to DevOps Academy!</h2>
        <p style="color: #64748b; margin-top: 4px;">We're thrilled to have you in our engineering community.</p>
      </div>

      <p>Hi <strong>${username}</strong>,</p>
      <p>Your account (<code>${email}</code>) has been successfully created. You now have access to industry-grade DevOps tracks, hands-on lab guides, daily learning trackers, and certificates.</p>

      <div class="info-card">
        <h4 style="margin: 0 0 10px 0; color: #1e293b;">🚀 What you can do right now:</h4>
        <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Browse Hands-On Courses:</strong> Linux, Git, Docker, Kubernetes, Jenkins, Terraform, AWS.</li>
          <li><strong>Track Your Daily Habit:</strong> Use the Daily Tracker to log reading, labs, and streak goals.</li>
          <li><strong>Test Your Knowledge:</strong> Practice with real-world DevOps quizzes and interview prep.</li>
        </ol>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:5200/dashboard" class="btn">Go to Student Dashboard →</a>
      </div>

      <p style="font-size: 13px; color: #64748b;">If you have any questions or feedback, simply reply to this email or visit our Help Center.</p>
    `,
    footerNote: 'You received this welcome email because an account was registered with your address.'
  });

  const text = `
Welcome to DevOps Academy, ${username}!

Your account has been successfully created with email: ${email}.

Explore courses, build pipelines, and track your daily learning habit:
http://localhost:5200/dashboard

Best regards,
The DevOps Academy Team
  `.trim();

  return { subject: `🚀 Welcome to DevOps Academy, ${username}!`, html, text };
};

/**
 * 4. Password Reset Email Template
 */
export const passwordResetTemplate = ({ username, resetUrl, resetToken, expiresMinutes = 30 }) => {
  const title = `Reset Your Password - DevOps Academy`;
  const html = baseLayout({
    title,
    preheader: `Password reset request for your DevOps Academy account.`,
    content: `
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px;">🔒</span>
        <h2 style="font-size: 22px; color: #0f172a; margin-top: 10px;">Password Reset Request</h2>
        <p style="color: #64748b; margin-top: 4px;">Follow the link below to set a new password.</p>
      </div>

      <p>Hi <strong>${username || 'there'}</strong>,</p>
      <p>We received a request to reset the password associated with your DevOps Academy account. Click the button below to choose a new password:</p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetUrl}" class="btn" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);">Reset My Password</a>
      </div>

      <div class="info-card" style="border-left-color: #ef4444; background-color: #fef2f2;">
        <p style="margin: 0; font-size: 13px; color: #991b1b;">
          <strong>Security Notice:</strong> This link will expire in <strong>${expiresMinutes} minutes</strong>. If you did not request this password reset, please ignore this email or contact support. Your password will remain unchanged.
        </p>
      </div>

      <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
        Button not working? Copy and paste this URL into your browser:<br>
        <a href="${resetUrl}" style="color: #6366f1; word-break: break-all;">${resetUrl}</a>
      </p>
    `,
    footerNote: 'This security message was automatically sent by DevOps Academy authentication service.'
  });

  const text = `
Password Reset Request

Hi ${username || 'there'},

We received a request to reset your password. Use the following link to choose a new password:
${resetUrl}

This link is valid for ${expiresMinutes} minutes. If you did not request this, please ignore this email.

DevOps Academy Security Team
  `.trim();

  return { subject: `🔐 Reset Your DevOps Academy Password`, html, text };
};

/**
 * 5. Test Email Template (For verification & diagnosing SMTP)
 */
export const testEmailTemplate = ({ to, smtpInfo }) => {
  const title = `Nodemailer SMTP Test - DevOps Academy`;
  const html = baseLayout({
    title,
    preheader: `SMTP verification test email from DevOps Academy backend.`,
    content: `
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px;">✉️</span>
        <h2 style="font-size: 22px; color: #0f172a; margin-top: 10px;">Email System Test Successful!</h2>
        <p style="color: #10b981; font-weight: 600; margin-top: 4px;">Nodemailer is configured and operating normally.</p>
      </div>

      <p>This is a verification email triggered from the DevOps Academy test endpoint to confirm SMTP delivery.</p>

      <div class="info-card">
        <h4 style="margin: 0 0 10px 0; color: #1e293b;">⚙️ SMTP Dispatch Diagnostics:</h4>
        <p style="margin: 4px 0;"><strong>Recipient:</strong> ${to}</p>
        <p style="margin: 4px 0;"><strong>Provider:</strong> ${smtpInfo.provider || 'Gmail SMTP'}</p>
        <p style="margin: 4px 0;"><strong>Host:</strong> <code>${smtpInfo.host}</code></p>
        <p style="margin: 4px 0;"><strong>Port:</strong> <code>${smtpInfo.port}</code></p>
        <p style="margin: 4px 0;"><strong>Secure (SSL/TLS):</strong> <code>${smtpInfo.secure}</code></p>
        <p style="margin: 4px 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p style="margin: 4px 0;"><strong>Mode:</strong> ${smtpInfo.isMock ? '<span style="color: #f59e0b; font-weight: bold;">MOCK (Console Simulation)</span>' : '<span style="color: #10b981; font-weight: bold;">LIVE SMTP</span>'}</p>
      </div>

      <p style="font-size: 13px; color: #64748b;">If you received this in your inbox, your Nodemailer Gmail SMTP integration is 100% operational!</p>
    `,
    footerNote: 'DevOps Academy Automated SMTP Verification Test'
  });

  const text = `
Nodemailer SMTP Test Successful!
Recipient: ${to}
Timestamp: ${new Date().toISOString()}
Provider: ${smtpInfo.provider || 'Gmail SMTP'}
Host: ${smtpInfo.host}:${smtpInfo.port}
Secure: ${smtpInfo.secure}
Mode: ${smtpInfo.isMock ? 'MOCK' : 'LIVE'}
  `.trim();

  return { subject: `🧪 [Test] DevOps Academy Nodemailer SMTP Verification`, html, text };
};
