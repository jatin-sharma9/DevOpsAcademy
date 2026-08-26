import React, { useState, useEffect } from "react";
import { GraduationCap, CheckCircle2, Clock, Loader2, Search } from "lucide-react";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await apiService.allEnrollments.getAll();
        if (res.success && Array.isArray(res.data)) {
          setEnrollments(res.data);
        }
      } catch (err) {
        console.error("Error loading enrollments:", err);
        toast.error("Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const filtered = enrollments.filter(e => {
    const s = search.toLowerCase();
    return (
      (e.username || '').toLowerCase().includes(s) ||
      (e.course_title || '').toLowerCase().includes(s) ||
      (e.email || '').toLowerCase().includes(s)
    );
  });

  const completed = enrollments.filter(e => Number(e.progress) === 100).length;
  const active = enrollments.filter(e => Number(e.progress) < 100).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Student Enrollments</h1>
        <p className="text-muted-foreground text-sm">Track real-time course enrollments and student completion metrics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Enrollments", value: enrollments.length, color: "text-foreground" },
          { label: "Active", value: active, color: "text-blue-400" },
          { label: "Completed", value: completed, color: "text-green-400" },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border border-border bg-card text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search enrollments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading enrollments...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="p-3.5 font-medium">Student</th>
                <th className="p-3.5 font-medium">Enrolled Course</th>
                <th className="p-3.5 font-medium">Progress</th>
                <th className="p-3.5 font-medium">Enrollment Date</th>
                <th className="p-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-muted-foreground">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                    No enrollments found
                  </td>
                </tr>
              ) : filtered.map((row) => {
                const progress = Number(row.progress || 0);
                const isCompleted = progress === 100;
                return (
                  <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5">
                      <p className="font-semibold text-foreground">{row.username}</p>
                      <p className="text-[11px] text-muted-foreground">{row.email}</p>
                    </td>
                    <td className="p-3.5 font-medium">{row.course_title}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${progress}%`,
                              background: isCompleted ? 'var(--color-secondary)' : 'var(--color-primary)',
                            }}
                          />
                        </div>
                        <span className="font-mono text-[11px]">{progress}%</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      {row.enrolled_at ? new Date(row.enrolled_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[11px] border ${isCompleted ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {isCompleted ? "Completed" : "Active"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
