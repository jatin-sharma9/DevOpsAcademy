import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, Search, Sun, Moon, Menu, X, Bell, ChevronDown,
  BookOpen, LayoutDashboard, LogOut, User, Settings, Shield,
  GraduationCap, Trophy
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Courses", href: "/courses" },
  { label: "Interview Prep", href: "/interview-prep" },
  { label: "Tracker", href: "/tracker" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "1", title: "New Course Available", message: "Kubernetes from Zero to Production is now live!", time: "10m ago", read: false, type: "course" },
    { id: "2", title: "Lab Completed", message: "You successfully completed Docker Multi-Stage Builds lab.", time: "1h ago", read: false, type: "achievement" },
    { id: "3", title: "Certificate Earned", message: "Your Linux Fundamentals Certificate is ready to download.", time: "1d ago", read: true, type: "cert" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  const roleIcon = user?.role === "admin" ? <Shield className="w-3 h-3" /> :
    user?.role === "instructor" ? <GraduationCap className="w-3 h-3" /> :
    <User className="w-3 h-3" />;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Terminal className="w-4.5 h-4.5 text-black" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            DevOps<span className="text-primary">Academy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname.startsWith(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setProfileOpen(false);
                  }}
                  className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-3.5 border-b border-border flex items-center justify-between bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-primary" />
                          <h3 className="font-display font-semibold text-sm">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/20 text-primary">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={cn(
                                "p-3 text-left transition-colors cursor-pointer flex gap-3 items-start",
                                n.read ? "bg-card hover:bg-muted/40" : "bg-primary/5 hover:bg-primary/10"
                              )}
                            >
                              <div className={cn(
                                "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                n.read ? "bg-transparent" : "bg-primary"
                              )} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-semibold truncate">{n.title}</p>
                                  <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-xs text-muted-foreground">
                            No notifications available
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-black">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[80px] truncate">{user.username}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", profileOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="font-medium text-sm">{user.username}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                        <span className={cn("inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold border",
                          user.role === "admin" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                          user.role === "instructor" ? "bg-accent/10 text-accent border-accent/20" :
                          "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {roleIcon} {user.role}
                        </span>
                      </div>
                      <div className="p-1.5">
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Dashboard
                        </Link>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                          <User className="w-4 h-4 text-muted-foreground" /> Profile
                        </Link>
                        {(user.role === "admin" || user.role === "instructor") && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                            <Shield className="w-4 h-4 text-muted-foreground" /> Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="p-1.5 border-t border-border">
                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="px-4 py-1.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="p-4 space-y-2 bg-card">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </form>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdowns */}
      {(profileOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setProfileOpen(false);
            setNotifOpen(false);
          }}
        />
      )}
    </header>
  );
}
