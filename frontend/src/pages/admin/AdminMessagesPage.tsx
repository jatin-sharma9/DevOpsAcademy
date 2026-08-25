import React from "react";
import { MessageSquare, Mail, Calendar, Trash2 } from "lucide-react";

const MESSAGES = [
  { id: "m1", name: "Vikram Malhotra", email: "vikram@cloudscale.io", subject: "DevOps Consulting Inquiry", message: "Hi Jatin, we are looking for a Senior DevOps Architect to assist with our EKS migration.", date: "2026-08-25 09:30" },
  { id: "m2", name: "Anita Roy", email: "anita@techstart.com", subject: "Corporate DevOps Training", message: "Hello, we would like to enroll 15 engineers in your Kubernetes GitOps course.", date: "2026-08-24 14:15" },
];

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Contact Messages</h1>
        <p className="text-muted-foreground text-sm">Portfolio contact form submissions and consulting inquiries.</p>
      </div>

      <div className="space-y-4">
        {MESSAGES.map((msg) => (
          <div key={msg.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-base">{msg.name}</span>
                <span className="text-xs text-muted-foreground font-mono">({msg.email})</span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {msg.date}
              </span>
            </div>
            <p className="text-sm font-semibold text-primary">{msg.subject}</p>
            <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
