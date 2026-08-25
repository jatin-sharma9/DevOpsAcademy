import React from "react";
import { GraduationCap, Search, CheckCircle2, Clock } from "lucide-react";

const ENROLLMENTS = [
  { id: "e1", student: "Rahul Gupta", email: "rahul@example.com", course: "Kubernetes in Action", date: "2026-08-25", progress: 65, status: "Active" },
  { id: "e2", student: "Priya Sharma", email: "priya@example.com", course: "Linux Fundamentals", date: "2026-08-24", progress: 100, status: "Completed" },
  { id: "e3", student: "Aman Verma", email: "aman@example.com", course: "Terraform & IaC Mastery", date: "2026-08-23", progress: 30, status: "Active" },
  { id: "e4", student: "Vikram Singh", email: "vikram@example.com", course: "Docker & Container Architecture", date: "2026-08-22", progress: 85, status: "Active" },
];

export default function AdminEnrollmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Student Enrollments</h1>
        <p className="text-muted-foreground text-sm">Track real-time course enrollments and student completion metrics.</p>
      </div>

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
            {ENROLLMENTS.map((row) => (
              <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-3.5">
                  <p className="font-semibold text-foreground">{row.student}</p>
                  <p className="text-[11px] text-muted-foreground">{row.email}</p>
                </td>
                <td className="p-3.5 font-medium">{row.course}</td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full progress-fill rounded-full" style={{ width: `${row.progress}%` }} />
                    </div>
                    <span className="font-mono text-[11px]">{row.progress}%</span>
                  </div>
                </td>
                <td className="p-3.5 text-muted-foreground">{row.date}</td>
                <td className="p-3.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium ${row.status === "Completed" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>
                    {row.status === "Completed" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
