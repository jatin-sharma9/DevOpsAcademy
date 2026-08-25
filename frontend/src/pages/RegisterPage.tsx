import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal, Eye, EyeOff, Loader2, AlertCircle, User, GraduationCap, Shield } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "student" as UserRole, label: "Student", icon: User, desc: "Learn DevOps at your own pace" },
  { id: "instructor" as UserRole, label: "Instructor", icon: GraduationCap, desc: "Create and manage courses" },
  { id: "admin" as UserRole, label: "Admin", icon: Shield, desc: "Full platform management" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "student" as UserRole });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const ok = await register(form);
    setLoading(false);
    if (ok) {
      toast.success("Account created! Welcome to DevOps Academy.");
      navigate(form.role === "admin" || form.role === "instructor" ? "/admin" : "/dashboard");
    } else {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary/15 via-primary/10 to-accent/15 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-30" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="font-display font-bold text-xl">DevOps<span className="text-primary">Academy</span></span>
          </Link>
          <h2 className="text-4xl font-display font-bold leading-tight mb-4">
            Join 150,000+ <span className="gradient-text">DevOps engineers</span> today.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Get unlimited access to free courses, hands-on labs, and a community of DevOps professionals.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-3">
          {[
            { label: "Free Courses", value: "40+" },
            { label: "Completion Rate", value: "87%" },
            { label: "Avg Rating", value: "4.9★" },
            { label: "Certificates", value: "45K+" },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-xl bg-card/50 border border-border/50 text-center">
              <div className="text-xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-2xl font-display font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Start your DevOps journey today — it's free.</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">I want to join as a...</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: role.id }))}
                  className={cn(
                    "p-3 rounded-xl border text-center transition-all",
                    form.role === role.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-muted-foreground/40 hover:bg-muted"
                  )}
                >
                  <role.icon className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-medium">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Username</label>
              <input
                type="text" required minLength={3}
                value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="devops_ninja"
                className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email address</label>
              <input
                type="email" required
                value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} required minLength={6}
                  value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-70">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create Free Account"}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              By registering you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
