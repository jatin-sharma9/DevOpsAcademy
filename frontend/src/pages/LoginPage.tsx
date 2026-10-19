import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Terminal,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Zap,
  Star,
  GraduationCap,
  KeyRound,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Target path requested before redirect (if any)
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // If already logged in, redirect to student dashboard (or requested student page)
      // Never auto-bounce users to the Admin Portal from the student login page
      if (from && !from.startsWith("/admin")) {
        navigate(from, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setError("Please enter your username or email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const ok = await login(trimmedId, password);
    setLoading(false);

    if (ok) {
      toast.success("Welcome back!");
      // Normal student sign-in always redirects to student dashboard or requested student page
      if (from && !from.startsWith("/admin")) {
        navigate(from, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else {
      setError("Invalid username/email or password. Please try again.");
    }
  };

  const handleQuickStudent = () => {
    setIdentifier("jatin");
    setPassword("user123");
    setError("");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel: CI/CD Pipeline Simulator & DevOps Academy Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/15 via-background to-accent/15 p-10 xl:p-12 flex-col justify-between relative overflow-hidden border-r border-border/40">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-accent/25 rounded-full blur-3xl pointer-events-none" />
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
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>v2.4 Cloud Labs Live</span>
            </div>
          </div>

          <h2 className="text-3xl xl:text-4xl font-display font-extrabold leading-tight mb-3">
            Your DevOps career starts <span className="gradient-text">here.</span>
          </h2>
          <p className="text-muted-foreground text-sm xl:text-base leading-relaxed max-w-lg">
            Master real-world infrastructure automation, cloud-native deployments, and earn certifications recognized by global tech enterprises.
          </p>
        </div>

        {/* Center: Interactive CI/CD Pipeline Simulator */}
        <div className="relative z-10 my-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl p-5 relative overflow-hidden"
          >
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:opacity-80 transition-opacity" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:opacity-80 transition-opacity" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:opacity-80 transition-opacity" />
                <span className="ml-2 text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  pipeline-prod-deploy.yml
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                RUNNING (1.4s)
              </div>
            </div>

            {/* Pipeline Stage Steps */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/40 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-foreground font-semibold">build:docker-image</span>
                    <span className="text-muted-foreground ml-2 hidden sm:inline text-[11px]">k8s-api:v2.4.0 (128MB)</span>
                  </div>
                </div>
                <span className="text-muted-foreground text-[11px]">0.8s</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/40 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-foreground font-semibold">security:trivy-scan</span>
                    <span className="text-emerald-400 ml-2 text-[11px]">0 Vulnerabilities</span>
                  </div>
                </div>
                <span className="text-emerald-400 text-[11px] font-semibold">PASSED</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/40 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-foreground font-semibold">deploy:k8s-cluster</span>
                    <span className="text-muted-foreground ml-2 hidden sm:inline text-[11px]">3/3 Pods Healthy</span>
                  </div>
                </div>
                <span className="text-purple-400 text-[11px] font-semibold">ROLLOUT OK</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/40 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-foreground font-semibold">healthcheck:probe</span>
                    <span className="text-muted-foreground ml-2 text-[11px]">Latency: 14ms</span>
                  </div>
                </div>
                <span className="text-primary text-[11px] font-semibold">200 OK</span>
              </div>
            </div>

            {/* Pipeline Status Progress Footer */}
            <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Continuous Delivery Pipeline: <strong className="text-emerald-400">100% Verified</strong></span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">AWS EKS ap-south-1</span>
            </div>
          </motion.div>

          {/* Floating Tech Badges */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground font-medium mr-1">Hands-on Stack:</span>
            {["Docker", "Kubernetes", "Terraform", "CI/CD", "AWS", "Prometheus"].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs rounded-lg bg-card/70 border border-border/60 text-foreground font-medium shadow-sm hover:border-primary/50 hover:text-primary transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="relative z-10 pt-4 border-t border-border/40">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-card/40 border border-border/50 backdrop-blur-sm">
              <div className="text-lg xl:text-xl font-bold font-display text-primary">150,000+</div>
              <div className="text-xs text-muted-foreground">Students Enrolled</div>
            </div>
            <div className="p-3 rounded-xl bg-card/40 border border-border/50 backdrop-blur-sm">
              <div className="text-lg xl:text-xl font-bold font-display text-amber-400 flex items-center gap-1">
                4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
              </div>
              <div className="text-xs text-muted-foreground">Top-Rated Platform</div>
            </div>
            <div className="p-3 rounded-xl bg-card/40 border border-border/50 backdrop-blur-sm">
              <div className="text-lg xl:text-xl font-bold font-display text-emerald-400">94%</div>
              <div className="text-xs text-muted-foreground">Career Placement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Student Sign In Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm space-y-6"
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/25 text-xs font-semibold text-primary">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Sign In</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue courses, take quizzes, and track your DevOps progress.
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="login-identifier">
                Username or Email
              </label>
              <input
                id="login-identifier"
                type="text"
                required
                autoComplete="username"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your username or email"
                className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground" htmlFor="login-password">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-primary" />
              <span>Demo Student:</span>
            </span>
            <button
              type="button"
              onClick={handleQuickStudent}
              className="text-primary hover:underline font-medium"
            >
              Fill Credentials (jatin)
            </button>
          </div>

          {/* Navigation to Register */}
          <div className="pt-2 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account yet?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Get Started
              </Link>
            </p>
          </div>

          {/* Admin Portal Gateway Link */}
          <div className="pt-4 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground">
              Platform administrator or instructor?
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mt-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Sign In to Admin Portal &rarr;</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
