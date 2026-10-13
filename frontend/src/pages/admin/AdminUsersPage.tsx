import React, { useState, useEffect } from "react";
import { Search, UserPlus, Trash2, Shield, GraduationCap, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";

const ROLE_ICONS = { admin: Shield, instructor: GraduationCap, student: User, user: User };
const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/10 text-red-400 border-red-500/20",
  instructor: "bg-accent/10 text-accent border-accent/20",
  student: "bg-primary/10 text-primary border-primary/20",
  user: "bg-primary/10 text-primary border-primary/20",
};

const DEMO_USERS = [
  { id: 1, username: "Jatin_Sharma", email: "jatinsharma932002@gmail.com", role: "admin", created_at: "2026-08-01T00:00:00Z" },
  { id: 2, username: "alex_devops", email: "alex@example.com", role: "instructor", created_at: "2026-08-10T00:00:00Z" },
  { id: 3, username: "sarah_cloud", email: "sarah@cloudnative.io", role: "user", created_at: "2026-08-15T00:00:00Z" },
  { id: 4, username: "rahul_k8s", email: "rahul@infosys.com", role: "user", created_at: "2026-08-20T00:00:00Z" },
  { id: 5, username: "priya_sre", email: "priya@flipkart.com", role: "user", created_at: "2026-08-25T00:00:00Z" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>(DEMO_USERS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingRole, setUpdatingRole] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiService.users.getAll();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setUsers(res.data);
      } else {
        setUsers(DEMO_USERS);
      }
    } catch (err) {
      console.error("Error loading users:", err);
      setUsers(DEMO_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: number, username: string) => {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      await apiService.users.delete(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    setUpdatingRole(id);
    try {
      await apiService.users.updateRole(id, newRole);
      toast.success("User role updated");
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingRole(null);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCount = (role: string) => users.filter(u => u.role === role).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Users</h1>
          <p className="text-muted-foreground text-sm">{users.length} registered users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 w-56"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "student", "user", "instructor", "admin"].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg border transition-colors capitalize",
                roleFilter === role
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, color: "text-foreground" },
          { label: "Students", value: roleCount("student") + roleCount("user"), color: "text-primary" },
          { label: "Instructors", value: roleCount("instructor"), color: "text-accent" },
          { label: "Admins", value: roleCount("admin"), color: "text-red-400" },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border border-border bg-card text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading users...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Joined</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-muted-foreground text-sm">
                    No users found
                  </td>
                </tr>
              ) : filtered.map((u) => {
                const role = u.role || 'user';
                const RoleIcon = ROLE_ICONS[role as keyof typeof ROLE_ICONS] || User;
                return (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-black shrink-0">
                          {(u.username || u.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{u.username}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={role}
                        onChange={e => handleRoleChange(Number(u.id), e.target.value)}
                        disabled={updatingRole === Number(u.id)}
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full border capitalize bg-transparent cursor-pointer",
                          ROLE_COLORS[role] || ROLE_COLORS.user
                        )}
                      >
                        {["student", "user", "instructor", "admin"].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDelete(Number(u.id), u.username)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
