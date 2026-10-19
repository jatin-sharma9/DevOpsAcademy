import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Terminal,
  Shield,
  ShieldCheck,
  Lock,
  Server,
  Activity,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const { login, logout, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Determine redirect target from state if present
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/admin";

  // If already authenticated, redirect to appropriate destination
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "admin") {
        navigate(from, { replace: true });
      } else {
        // Logged-in non-admins are directed to student dashboard
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setError("Please enter your administrator username or email.");
      return;
    }

    if (!password) {
      setError("Please enter your administrator password.");
      return;
    }

    setLoading(true);
    const ok = await login(trimmedId, password);
    setLoading(false);

    if (ok) {
      const stored = localStorage.getItem("da-user");
      let currentUser: { role?: string } | null = null;
      if (stored) {
        try {
          currentUser = JSON.parse(stored);
        } catch {
          currentUser = null;
        }
      }

      if (currentUser?.role === "admin") {
        toast.success("Welcome back to the Admin Portal.");
        navigate(from, { replace: true });
      } else {
        // Enforce strict access control: non-admins cannot access the Admin Portal
        logout();
        setError("Access denied. Administrator privileges are required to access this portal.");
      }
    } else {
      setError("Invalid administrator credentials. Please check your username/email and password.");
    }
  };

  const handleQuickAdmin = () => {
    setIdentifier("Jatin_Sharma");
    setPassword("J@tinS93");
    setError("");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Left Panel: DevOps Academy Administrative Overview */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary/15 via-background to-accent/15 p-10 xl:p-12 flex-col justify-between relative overflow-hidden border-r border-border/40">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 hero-grid-bg opacity-25 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5 text-black" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                DevOps<span className="text-primary">Academy</span>
              </span>
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-xs font-medium text-red-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Restricted Administration</span>
            </div>
          </div>

          <h2 className="text-3xl xl:text-4xl font-display font-extrabold leading-tight mb-3">
            Platform Infrastructure & <span className="gradient-text">Operations Center</span>
          </h2>
          <p className="text-muted-foreground text-sm xl:text-base leading-relaxed max-w-lg">
            Authorized administrative access to manage curriculum pipelines, verify student credentials, monitor cluster health, and oversee platform analytics.
          </p>
        </div>

        {/* Center: System Status & Security Showcase */}
        <div className="relative z-10 my-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl p-5 space-y-3.5"
          >
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>Admin Operations Guard</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                RBAC ENFORCED
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/50 border border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-foreground font-sans font-semibold text-xs">Cluster & API Service</div>
                    <div className="text-[11px] text-muted-foreground">PostgreSQL 15 • Express Core • Port 5000</div>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ONLINE
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/50 border border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-foreground font-sans font-semibold text-xs">Access Control Policy</div>
                    <div className="text-[11px] text-muted-foreground">Role-based JWT Verification (Admin Only)</div>
                  </div>
                </div>
                <span className="text-[11px] text-primary font-semibold">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/50 border border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-foreground font-sans font-semibold text-xs">Audit & Telemetry</div>
                    <div className="text-[11px] text-muted-foreground">Prometheus Exporter • Structured Audit Logs</div>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">LOGGING</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Metrics Grid */}
        <div className="relative z-10 pt-4 border-t border-border/40">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-card/40 border border-border/50 text-center backdrop-blur-sm">
              <div className="text-base xl:text-lg font-bold font-display text-primary">Role-Based</div>
              <div className="text-[11px] text-muted-foreground">Protected Routes</div>
            </div>
            <div className="p-3 rounded-xl bg-card/40 border border-border/50 text-center backdrop-blur-sm">
              <div className="text-base xl:text-lg font-bold font-display text-emerald-400">Zero Public</div>
              <div className="text-[11px] text-muted-foreground">Admin Registration</div>
            </div>
            <div className="p-3 rounded-xl bg-card/40 border border-border/50 text-center backdrop-blur-sm">
              <div className="text-base xl:text-lg font-bold font-display text-cyan-400">HMAC-SHA256</div>
              <div className="text-[11px] text-muted-foreground">Signed JWT Tokens</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Clean Admin Portal Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm space-y-6"
        >
          {/* Back to Site Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to DevOps Academy</span>
          </Link>

          {/* Admin Portal Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/25 text-xs font-semibold text-red-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              Admin Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in with your verified administrator credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* Validation & Login Error Alert */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Username or Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-identifier"
                className="text-sm font-medium text-foreground"
              >
                Username or Email
              </label>
              <input
                id="admin-identifier"
                type="text"
                required
                autoComplete="username"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your admin username or email"
                className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your admin password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In to Admin Portal Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Admin Helper */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-primary" />
              <span>Admin Demo Preset:</span>
            </span>
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="text-primary hover:underline font-medium"
            >
              Fill Credentials
            </button>
          </div>

          {/* Navigation to Student Sign In */}
          <div className="pt-4 border-t border-border text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Are you a student looking for course learning access?
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Go to Student Sign In &rarr;
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
