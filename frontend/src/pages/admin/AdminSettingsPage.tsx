import React, { useState } from "react";
import { Settings, Shield, Bell, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("DevOps Academy");
  const [supportEmail, setSupportEmail] = useState("jatinsharma932002@gmail.com");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Platform settings updated!");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Platform Settings</h1>
        <p className="text-muted-foreground text-sm">Configure system preferences, security, and site metadata.</p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-border bg-card space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Platform Title</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Support & Admin Email</label>
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </form>
    </div>
  );
}
