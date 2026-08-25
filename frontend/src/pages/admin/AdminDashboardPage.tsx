import React from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Award, TrendingUp, DollarSign, Star, ArrowUp, Eye, Clock } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { COURSES } from "@/data/courses";

const MONTHLY = [
  { month: "Mar", students: 8200, revenue: 184000, completions: 420 },
  { month: "Apr", students: 10400, revenue: 218000, completions: 580 },
  { month: "May", students: 12800, revenue: 267000, completions: 710 },
  { month: "Jun", students: 11200, revenue: 241000, completions: 630 },
  { month: "Jul", students: 14600, revenue: 312000, completions: 820 },
  { month: "Aug", students: 18400, revenue: 398000, completions: 1040 },
];

const CATEGORY_DATA = [
  { name: "Kubernetes", value: 31500, color: "#00C2FF" },
  { name: "AWS", value: 28600, color: "#F59E0B" },
  { name: "Docker", value: 22800, color: "#3B82F6" },
  { name: "Linux", value: 18420, color: "#F97316" },
  { name: "Terraform", value: 16800, color: "#7C3AED" },
  { name: "Others", value: 32000, color: "#10B981" },
];

const RECENT_USERS = [
  { name: "Rahul Gupta", email: "rahul@example.com", role: "student", course: "Kubernetes", joined: "2h ago" },
  { name: "Priya Sharma", email: "priya@example.com", role: "student", course: "AWS DevOps", joined: "4h ago" },
  { name: "Arjun Nair", email: "arjun@example.com", role: "instructor", course: "—", joined: "1d ago" },
  { name: "Sneha Patel", email: "sneha@example.com", role: "student", course: "Docker", joined: "1d ago" },
  { name: "Vikram M.", email: "vikram@example.com", role: "student", course: "Terraform", joined: "2d ago" },
];

const STATS = [
  { label: "Total Students", value: "150,420", change: "+18.4%", icon: Users, color: "text-primary", bg: "bg-primary/10", up: true },
  { label: "Total Revenue", value: "₹48.2L", change: "+27.1%", icon: DollarSign, color: "text-secondary", bg: "bg-secondary/10", up: true },
  { label: "Courses Published", value: "24", change: "+4 new", icon: BookOpen, color: "text-accent", bg: "bg-accent/10", up: true },
  { label: "Certificates Issued", value: "45,210", change: "+12.6%", icon: Award, color: "text-yellow-400", bg: "bg-yellow-400/10", up: true },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Platform overview and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-secondary" : "text-destructive"}`}>
                <ArrowUp className={`w-3 h-3 ${!stat.up && "rotate-180"}`} />{stat.change}
              </span>
            </div>
            <div className="text-2xl font-display font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-sm">Student Growth & Revenue</h2>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199,100%,50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199,100%,50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(155,80%,50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(155,80%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215,15%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215,15%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(220,18%,9%)", border: "1px solid hsl(220,15%,15%)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend />
              <Area type="monotone" dataKey="students" stroke="hsl(199,100%,50%)" strokeWidth={2} fill="url(#colorStudents)" name="Students" />
              <Area type="monotone" dataKey="completions" stroke="hsl(155,80%,50%)" strokeWidth={2} fill="url(#colorRevenue)" name="Completions" />
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Revenue Bar */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card">
          <h2 className="font-display font-semibold text-sm mb-5">Monthly Revenue (₹)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215,15%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215,15%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(220,18%,9%)", border: "1px solid hsl(220,15%,15%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="revenue" fill="hsl(270,70%,60%)" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Courses */}
        <div className="p-5 rounded-2xl border border-border bg-card">
          <h2 className="font-display font-semibold text-sm mb-4">Top Courses</h2>
          <div className="space-y-3">
            {COURSES.sort((a, b) => b.totalStudents - a.totalStudents).slice(0, 5).map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{c.title}</p>
                  <p className="text-[10px] text-muted-foreground">{c.totalStudents.toLocaleString()} students</p>
                </div>
                <div className="flex items-center gap-0.5 text-yellow-400 text-[11px]">
                  <Star className="w-3 h-3 fill-yellow-400" />{c.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="p-5 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-sm">Recent Registrations</h2>
          <button className="text-xs text-primary hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left pb-3 font-medium">User</th>
                <th className="text-left pb-3 font-medium">Role</th>
                <th className="text-left pb-3 font-medium hidden md:table-cell">Enrolled In</th>
                <th className="text-left pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {RECENT_USERS.map((u, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-black shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border capitalize ${u.role === "instructor" ? "bg-accent/10 text-accent border-accent/20" : "bg-primary/10 text-primary border-primary/20"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground hidden md:table-cell">{u.course}</td>
                  <td className="py-3 text-xs text-muted-foreground">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
