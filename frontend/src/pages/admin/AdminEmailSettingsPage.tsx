import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mail, Send, CheckCircle2, XCircle, Settings, ShieldCheck, 
  RefreshCw, Server, Bell, Check, AlertCircle 
} from "lucide-react";
import { 
  getEmailSettings, saveEmailSettings, getEmailLogs, 
  sendEmailNotification, EmailSettings, EmailLog 
} from "@/services/emailService";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminEmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettings>(getEmailSettings());
  const [logs, setLogs] = useState<EmailLog[]>(getEmailLogs());
  const [sendingTest, setSendingTest] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "logs">("settings");

  const loadData = async () => {
    try {
      const [settingsRes, logsRes] = await Promise.all([
        apiService.admin.getEmailSettings(),
        apiService.admin.getEmailLogs(),
      ]);

      if (settingsRes?.success && settingsRes?.data) {
        const d = settingsRes.data;
        const mappedSettings: EmailSettings = {
          adminEmail: d.admin_email || "jatinsharma932002@gmail.com",
          smtpHost: d.smtp_host || "smtp.gmail.com",
          smtpPort: d.smtp_port || 587,
          smtpUser: d.smtp_user || "jatinsharma932002@gmail.com",
          notifyOnRegistration: d.notify_on_registration !== false,
          notifyOnEnrollment: d.notify_on_enrollment !== false,
          notifyOnContact: d.notify_on_contact !== false,
          notifyOnSupport: d.notify_on_support !== false,
        };
        setSettings(mappedSettings);
        saveEmailSettings(mappedSettings);
      }

      if (logsRes?.success && Array.isArray(logsRes?.data)) {
        const dbLogs: EmailLog[] = logsRes.data.map((l: any) => ({
          id: `log_${l.id}`,
          type: (l.type || "test_email") as any,
          recipient: l.recipient,
          subject: l.subject,
          payload: l.payload || {},
          status: l.status || "success",
          timestamp: l.created_at || new Date().toISOString(),
          error: l.error,
        }));
        setLogs(dbLogs);
      }
    } catch (err) {
      console.error("Failed to load email settings from DB:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.admin.saveEmailSettings({
        admin_email: settings.adminEmail,
        smtp_host: settings.smtpHost,
        smtp_port: settings.smtpPort,
        smtp_user: settings.smtpUser,
        notify_on_registration: settings.notifyOnRegistration,
        notify_on_enrollment: settings.notifyOnEnrollment,
        notify_on_contact: settings.notifyOnContact,
        notify_on_support: settings.notifyOnSupport,
      });
      saveEmailSettings(settings);
      toast.success("Email notification settings saved to database!");
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    }
  };

  const handleSendTestEmail = async () => {
    setSendingTest(true);
    try {
      const res = await apiService.admin.sendTestEmail(settings.adminEmail, "test");
      setSendingTest(false);
      if (res && res.success) {
        toast.success(`Test email sent successfully to ${settings.adminEmail}`);
      } else {
        toast.error("Failed to send test email");
      }
      await loadData();
    } catch (err: any) {
      setSendingTest(false);
      toast.error(err.response?.data?.message || "Failed to send test email");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Email Notifications</h1>
          <p className="text-muted-foreground text-sm">
            Manage SMTP configurations, notification triggers, and dispatch logs.
          </p>
        </div>

        <button
          onClick={handleSendTestEmail}
          disabled={sendingTest}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {sendingTest ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send Test Email
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("settings")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
            activeTab === "settings"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Settings className="w-4 h-4" /> SMTP & Triggers
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
            activeTab === "logs"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Bell className="w-4 h-4" /> Dispatch Logs ({logs.length})
        </button>
      </div>

      {activeTab === "settings" ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Admin Email Box */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <h2 className="font-display font-semibold text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Admin Target Email Address
            </h2>
            <div className="space-y-1.5 max-w-md">
              <label className="text-xs font-medium text-muted-foreground">Notification Recipient Email</label>
              <input
                type="email"
                required
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-[11px] text-muted-foreground">
                All platform enrollments, user signups, and support forms will be forwarded here.
              </p>
            </div>
          </div>

          {/* Event Triggers */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <h2 className="font-display font-semibold text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" /> Email Trigger Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "notifyOnRegistration", label: "New User Registration", desc: "Notify admin when a new student or instructor registers" },
                { key: "notifyOnEnrollment", label: "Course Enrollment", desc: "Notify admin when a user enrolls in any course" },
                { key: "notifyOnContact", label: "Portfolio Contact Form", desc: "Forward portfolio message submissions" },
                { key: "notifyOnSupport", label: "Support Ticket Creation", desc: "Alert admin when support ticket is opened" },
              ].map((item) => (
                <label key={item.key} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={(settings as any)[item.key]}
                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    className="mt-1 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="text-xs font-semibold">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* SMTP Credentials */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <h2 className="font-display font-semibold text-base flex items-center gap-2">
              <Server className="w-4 h-4 text-secondary" /> SMTP Server Details (.env)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">SMTP Host</label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">SMTP Port</label>
                <input
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Sender User</label>
                <input
                  type="text"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
          >
            Save Settings
          </button>
        </form>
      ) : (
        /* Email Logs Table */
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="p-3.5 font-medium">Status</th>
                <th className="p-3.5 font-medium">Event Type</th>
                <th className="p-3.5 font-medium">Subject & Details</th>
                <th className="p-3.5 font-medium">Recipient</th>
                <th className="p-3.5 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5">
                    {log.status === "success" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium">
                        <XCircle className="w-3 h-3" /> Failed
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 capitalize font-mono text-muted-foreground">
                    {log.type.replace("_", " ")}
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-foreground">{log.subject}</p>
                    <p className="text-[11px] text-muted-foreground">
                      User: {log.payload.fullName || "N/A"} ({log.payload.email || "N/A"})
                      {log.payload.courseName && ` · Course: ${log.payload.courseName}`}
                    </p>
                  </td>
                  <td className="p-3.5 font-mono text-muted-foreground">{log.recipient}</td>
                  <td className="p-3.5 text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
