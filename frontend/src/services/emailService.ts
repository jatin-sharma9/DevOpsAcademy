export interface EmailLog {
  id: string;
  type: "user_registration" | "course_enrollment" | "contact_form" | "support_ticket" | "test_email";
  recipient: string;
  subject: string;
  payload: Record<string, any>;
  status: "success" | "failure";
  timestamp: string;
  error?: string;
}

export interface EmailSettings {
  adminEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  notifyOnRegistration: boolean;
  notifyOnEnrollment: boolean;
  notifyOnContact: boolean;
  notifyOnSupport: boolean;
}

const SETTINGS_KEY = "da-email-settings";
const LOGS_KEY = "da-email-logs";

const DEFAULT_SETTINGS: EmailSettings = {
  adminEmail: "jatinsharma932002@gmail.com",
  smtpHost: "smtp.gmail.com",
  smtpPort: 465,
  smtpUser: "jatinsharma932002@gmail.com",
  notifyOnRegistration: true,
  notifyOnEnrollment: true,
  notifyOnContact: true,
  notifyOnSupport: true,
};

const INITIAL_LOGS: EmailLog[] = [
  {
    id: "log_1001",
    type: "user_registration",
    recipient: "jatinsharma932002@gmail.com",
    subject: "🔔 New User Registered: Rahul Gupta",
    payload: { fullName: "Rahul Gupta", email: "rahul@example.com", dateTime: "2026-08-25 10:15:00" },
    status: "success",
    timestamp: "2026-08-25T10:15:00.000Z",
  },
  {
    id: "log_1002",
    type: "course_enrollment",
    recipient: "jatinsharma932002@gmail.com",
    subject: "🎓 New Course Enrollment: Kubernetes in Action",
    payload: { fullName: "Priya Sharma", email: "priya@example.com", courseName: "Kubernetes in Action", dateTime: "2026-08-25 10:45:00" },
    status: "success",
    timestamp: "2026-08-25T10:45:00.000Z",
  },
];

export function getEmailSettings(): EmailSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveEmailSettings(settings: EmailSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getEmailLogs(): EmailLog[] {
  try {
    const saved = localStorage.getItem(LOGS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  } catch {
    return INITIAL_LOGS;
  }
}

export function logEmailEvent(
  type: EmailLog["type"],
  subject: string,
  payload: Record<string, any>,
  status: "success" | "failure",
  error?: string
): EmailLog {
  const settings = getEmailSettings();
  const logs = getEmailLogs();

  const newLog: EmailLog = {
    id: `log_${Date.now()}`,
    type,
    recipient: settings.adminEmail,
    subject,
    payload: {
      ...payload,
      dateTime: payload.dateTime || new Date().toLocaleString(),
    },
    status,
    timestamp: new Date().toISOString(),
    error,
  };

  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(LOGS_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

export async function sendEmailNotification(
  type: EmailLog["type"],
  subject: string,
  payload: Record<string, any>
): Promise<boolean> {
  const settings = getEmailSettings();

  // Check event toggles
  if (type === "user_registration" && !settings.notifyOnRegistration) return true;
  if (type === "course_enrollment" && !settings.notifyOnEnrollment) return true;
  if (type === "contact_form" && !settings.notifyOnContact) return true;
  if (type === "support_ticket" && !settings.notifyOnSupport) return true;

  try {
    // Simulate SMTP dispatch over relay
    await new Promise((r) => setTimeout(r, 600));

    logEmailEvent(type, subject, payload, "success");
    return true;
  } catch (err: any) {
    logEmailEvent(type, subject, payload, "failure", err?.message || "SMTP connection failed");
    return false;
  }
}
