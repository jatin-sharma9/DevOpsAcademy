import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Terminal,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Shield,
  ArrowRight,
  BookOpen,
  Award,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
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

    const username = form.username.trim();
    const email = form.email.trim();

    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    setLoading(true);
    // Student registration: strictly sets role as 'student' (mapped to 'user' in backend)
    const result = await register({
      username,
      email,
      password: form.password,
      role: "student",
    });
    setLoading(false);

    if (result.success) {
      toast.success("Account created successfully! Welcome to DevOps Academy.");
      if (from && !from.startsWith("/admin")) {
        navigate(from, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else {
      setError(result.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel: Student Benefits & Curriculum Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary/15 via-primary/10 to-accent/15 p-10 xl:p-12 flex-col justify-between relative overflow-hidden border-r border-border/40">
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-accent/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 hero-grid-bg opacity-25 pointer-events-none" />

        {/* Top Brand */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 mb-10 group inline-flex">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="font-display font-bold text-xl">
              DevOps<span className="text-primary">Academy</span>
            </span>
          </Link>

          <h2 className="text-3xl xl:text-4xl font-display font-extrabold leading-tight mb-4">
            Join 150,000+ <span className="gradient-text">DevOps engineers</span> today.
          </h2>
          <p className="text-muted-foreground text-sm xl:text-base leading-relaxed max-w-lg">
            Get instant access to free courses, hands-on terminal missions, progress tracking, and industry-recognized certifications.
          </p>
        </div>

        {/* Center: What You Get List */}
        <div className="relative z-10 my-6 space-y-3 max-w-md">
          {[
            {
              icon: BookOpen,
              title: "Comprehensive Curriculum",
              desc: "From Linux & Git to Docker, Kubernetes, Terraform, and CI/CD pipelines.",
            },
            {
              icon: Terminal,
              title: "Interactive DevOps Missions",
              desc: "Debug production outages, fix crash-looping pods, and inspect pipeline logs.",
            },
            {
              icon: Award,
              title: "Verified Course Certificates",
              desc: "Earn shareable credential IDs to showcase on LinkedIn and your resume.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-card/60 border border-border/40 backdrop-blur-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Platform Stats */}
        <div className="relative z-10 pt-4 border-t border-border/40">
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: "Free Courses", value: "40+" },
              { label: "Completion Rate", value: "87%" },
              { label: "Avg Rating", value: "4.9★" },
              { label: "Certificates", value: "45K+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-3 rounded-xl bg-card/40 border border-border/50 text-center backdrop-blur-sm"
              >
                <div className="text-lg font-bold font-display text-primary">{stat.value}</div>
                <div className="text-[11px] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Student Registration Form */}
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
              <span>Student Registration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Start your DevOps journey today — learn Docker, Kubernetes, CI/CD, and Cloud.
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

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="reg-username">
                Username
              </label>
              <input
                id="reg-username"
                type="text"
                required
                minLength={3}
                autoComplete="username"
                value={form.username}
                onChange={(e) => {
                  setForm((f) => ({ ...f, username: e.target.value }));
                  if (error) setError("");
                }}
                placeholder="Choose a username (e.g. devops_hero)"
                className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="reg-email">
                Email address
              </label>
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: e.target.value }));
                  if (error) setError("");
                }}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="reg-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, password: e.target.value }));
                    if (error) setError("");
                  }}
                  placeholder="Minimum 6 characters"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="reg-confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="reg-confirm-password"
                  type={showConfirmPass ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, confirmPassword: e.target.value }));
                    if (error) setError("");
                  }}
                  placeholder="Confirm your password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showConfirmPass ? "Hide password" : "Show password"}
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              By registering you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </form>

          {/* Link to Sign In */}
          <div className="pt-2 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
