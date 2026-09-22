import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, DollarSign, Bell, ArrowUp, Star, Loader2 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { apiService } from "@/services/apiService";

const MONTHLY = [
  { month: "Mar", students: 820, completions: 42 },
  { month: "Apr", students: 1040, completions: 58 },
  { month: "May", students: 1280, completions: 71 },
  { month: "Jun", students: 1120, completions: 63 },
  { month: "Jul", students: 1460, completions: 82 },
  { month: "Aug", students: 1840, completions: 104 },
];

const CATEGORY_DATA = [
  { name: "Kubernetes", value: 315, color: "#00C2FF" },
  { name: "AWS", value: 286, color: "#F59E0B" },
  { name: "Docker", value: 228, color: "#3B82F6" },
  { name: "Linux", value: 184, color: "#F97316" },
  { name: "Terraform", value: 168, color: "#7C3AED" },
];

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiService.admin.getStats();
        if (res.success) {
          setStatsData(res);
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Loading admin dashboard statistics...</p>
      </div>
    );
  }

  const stats = statsData?.stats || {
    totalUsers: 1420,
    totalCourses: 8,
    totalEnrollments: 3840,
    unreadMessages: 2,
    unreadNotifications: 3
  };

  const STATS_CARDS = [
    { label: "Total Students", value: stats.totalUsers.toLocaleString(), change: "+12% this month", icon: Users, color: "text-primary", bg: "bg-primary/10", up: true },
    { label: "Total Enrollments", value: stats.totalEnrollments.toLocaleString(), change: "+24% new", icon: DollarSign, color: "text-secondary", bg: "bg-secondary/10", up: true },
    { label: "Active Courses", value: stats.totalCourses, change: "8 Published", icon: BookOpen, color: "text-accent", bg: "bg-accent/10", up: true },
    { label: "System Alerts", value: stats.unreadNotifications, change: `${stats.unreadMessages} messages`, icon: Bell, color: "text-yellow-400", bg: "bg-yellow-400/10", up: false },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Platform overview and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CARDS.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
              <span className="text-xs text-muted-foreground">{stat.change}</span>
            </div>
            <div className="text-2xl font-display font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Growth Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-sm">Student Growth & completions</h2>
            <span className="text-xs text-muted-foreground">Historical Trend</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199,100%,50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199,100%,50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(155,80%,50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(155,80%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215,15%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215,15%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(220,18%,9%)", border: "1px solid hsl(220,15%,15%)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend />
              <Area type="monotone" dataKey="students" stroke="hsl(199,100%,50%)" strokeWidth={2} fill="url(#colorStudents)" name="Registrations" />
              <Area type="monotone" dataKey="completions" stroke="hsl(155,80%,50%)" strokeWidth={2} fill="url(#colorCompletions)" name="Completions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="p-5 rounded-2xl border border-border bg-card">
          <h2 className="font-display font-semibold text-sm mb-5">Enrollment by Category</h2>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={CATEGORY_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65}>
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(220,18%,9%)", border: "1px solid hsl(220,15%,15%)", borderRadius: "8px", fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {CATEGORY_DATA.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-sm">Recent Registrations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left pb-3 font-medium">User</th>
                  <th className="text-left pb-3 font-medium">Role</th>
                  <th className="text-left pb-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {statsData?.recentUsers?.map((u: any, i: number) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-black shrink-0">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{u.username}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border capitalize ${u.role === "admin" ? "bg-red-500/10 text-red-400 border-red-500/20" : u.role === "instructor" ? "bg-accent/10 text-accent border-accent/20" : "bg-primary/10 text-primary border-primary/20"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="p-5 rounded-2xl border border-border bg-card">
          <h2 className="font-display font-semibold text-sm mb-4">Recent Enrollments</h2>
          <div className="space-y-3">
            {statsData?.recentEnrollments?.map((e: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{e.course_title}</p>
                  <p className="text-[10px] text-muted-foreground">User: {e.username}</p>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  {e.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
