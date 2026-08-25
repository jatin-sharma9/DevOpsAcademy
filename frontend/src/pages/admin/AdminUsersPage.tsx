import React, { useState } from "react";
import { Search, UserPlus, Edit2, Trash2, Shield, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_USERS = [
  { id: 1, name: "Rahul Gupta", email: "rahul@example.com", role: "student", courses: 3, joined: "Aug 20, 2026", status: "active" },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", role: "student", courses: 5, joined: "Aug 18, 2026", status: "active" },
  { id: 3, name: "Jatin Sharma", email: "instructor@devops.academy", role: "instructor", courses: 8, joined: "Jan 01, 2026", status: "active" },
  { id: 4, name: "Admin User", email: "admin@devops.academy", role: "admin", courses: 0, joined: "Jan 01, 2026", status: "active" },
  { id: 5, name: "Arjun Nair", email: "arjun@example.com", role: "student", courses: 2, joined: "Aug 15, 2026", status: "active" },
  { id: 6, name: "Sneha Patel", email: "sneha@example.com", role: "student", courses: 1, joined: "Aug 10, 2026", status: "inactive" },
];

const ROLE_ICONS = { admin: Shield, instructor: GraduationCap, student: User };
const ROLE_COLORS = {
  admin: "bg-red-500/10 text-red-400 border-red-500/20",
  instructor: "bg-accent/10 text-accent border-accent/20",
  student: "bg-primary/10 text-primary border-primary/20",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = MOCK_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Users</h1>
          <p className="text-muted-foreground text-sm">{MOCK_USERS.length} registered users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
          <UserPlus className="w-4 h-4" /> Invite User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 w-56" />
        </div>
        <div className="flex gap-1.5">
          {["all", "student", "instructor", "admin"].map(role => (
            <button key={role} onClick={() => setRoleFilter(role)}
              className={cn("px-3 py-1.5 text-sm rounded-lg border transition-colors capitalize", roleFilter === role ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted")}>
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: MOCK_USERS.length, color: "text-primary" },
          { label: "Instructors", value: MOCK_USERS.filter(u => u.role === "instructor").length, color: "text-accent" },
          { label: "Admins", value: MOCK_USERS.filter(u => u.role === "admin").length, color: "text-red-400" },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border border-border bg-card text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/30">
            <tr className="text-xs text-muted-foreground">
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Courses</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Joined</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const RoleIcon = ROLE_ICONS[u.role as keyof typeof ROLE_ICONS];
              return (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-black shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full border capitalize", ROLE_COLORS[u.role as keyof typeof ROLE_COLORS])}>
                      <RoleIcon className="w-3 h-3" />{u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{u.courses}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{u.joined}</td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-0.5 text-[11px] font-medium rounded-full border", u.status === "active" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-muted text-muted-foreground border-border")}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
