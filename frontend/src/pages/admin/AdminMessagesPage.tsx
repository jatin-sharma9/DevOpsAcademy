import React, { useState, useEffect } from "react";
import { Mail, Calendar, Trash2, Loader2 } from "lucide-react";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await apiService.admin.getContactMessages();
      if (res.success && Array.isArray(res.data)) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error("Error loading messages:", err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await apiService.admin.deleteMessage(id);
      if (res.success) {
        toast.success("Message deleted successfully!");
        fetchMessages();
      }
    } catch (err) {
      console.error("Delete message error:", err);
      toast.error("Failed to delete message");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Contact Messages</h1>
        <p className="text-muted-foreground text-sm">Portfolio contact form submissions and consulting inquiries.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading messages...</p>
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="p-5 rounded-2xl border border-border bg-card space-y-3 relative group">
              <button 
                onClick={() => handleDelete(Number(msg.id))}
                className="absolute top-5 right-5 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-base">{msg.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">({msg.email})</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mr-8">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-semibold text-primary">{msg.subject}</p>
              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">{msg.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
          <Mail className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No messages found</p>
        </div>
      )}
    </div>
  );
}
