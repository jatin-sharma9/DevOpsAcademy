import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Terminal, LayoutDashboard, BookOpen, Users, FileText,
  BarChart3, Settings, LogOut, Menu, X, ChevronLeft, Bell, Mail,
  PlusCircle, FolderTree, GraduationCap, Award, MessageSquare
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Add Course", href: "/admin/courses/add", icon: PlusCircle },
  { label: "Manage Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Blog Management", href: "/admin/blog", icon: FileText },
  { label: "Contact Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Email Notifications", href: "/admin/email", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "1", title: "New User Registered", message: "User 'alex_dev' just registered on the platform.", time: "5m ago", read: false },
    { id: "2", title: "Course Review", message: "New 5-star review submitted for Kubernetes course.", time: "1h ago", read: false },
    { id: "3", title: "System Alert", message: "Database backup completed successfully.", time: "4h ago", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => { logout(); navigate("/"); };

  const Sidebar = ({ mobile = false }) => (
    <div className={cn("flex flex-col h-full bg-card border-r border-border", mobile ? "w-64" : collapsed ? "w-16" : "w-60", "transition-all duration-300")}>
      {/* Logo */}
      <div className={cn("h-16 flex items-center border-b border-border px-4", collapsed && !mobile ? "justify-center" : "gap-3")}>
        <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shrink-0">
          <Terminal className="w-4 h-4 text-black" />
        </div>
        {(!collapsed || mobile) && <span className="font-display font-bold text-sm">Admin Panel</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              onClick={() => mobile && setMobileOpen(false)}
              className={cn("sidebar-link", active ? "active" : "", collapsed && !mobile ? "justify-center px-2" : "")}
              title={collapsed && !mobile ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {(!collapsed || mobile) && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-2 border-t border-border space-y-0.5">
        <Link to="/" className={cn("sidebar-link", collapsed && !mobile ? "justify-center px-2" : "")} title={collapsed && !mobile ? "Back to Site" : undefined}>
          <ChevronLeft className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>Back to Site</span>}
        </Link>
        <button onClick={handleLogout} className={cn("sidebar-link w-full text-destructive hover:bg-destructive/10", collapsed && !mobile ? "justify-center px-2" : "")} title={collapsed && !mobile ? "Logout" : undefined}>
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 h-full"><Sidebar mobile /></div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-card/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => { setCollapsed(!collapsed); setMobileOpen(true); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="font-display font-semibold text-sm">
              {ADMIN_NAV.find(n => location.pathname === n.href)?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-50">
                    <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-primary" />
                        <h3 className="font-display font-semibold text-xs">Admin Notifications</h3>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                          className="text-[10px] text-primary hover:underline font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-border/50">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))}
                          className={cn("p-2.5 text-left cursor-pointer transition-colors flex gap-2 items-start", n.read ? "bg-card hover:bg-muted/40" : "bg-primary/5 hover:bg-primary/10")}
                        >
                          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", n.read ? "bg-transparent" : "bg-primary")} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-semibold truncate">{n.title}</p>
                              <span className="text-[9px] text-muted-foreground">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-black">
                {user?.username?.charAt(0)?.toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium">{user?.username}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
