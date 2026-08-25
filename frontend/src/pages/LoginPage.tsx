import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password. Try: admin@devops.academy / admin123");
    }
  };

  const quickLogin = async (role: "admin" | "instructor" | "student") => {
    const creds = {
      admin: { email: "admin@devops.academy", password: "admin123" },
      instructor: { email: "instructor@devops.academy", password: "instructor123" },
      student: { email: "student@devops.academy", password: "student123" },
    }[role];
    setLoading(true);
    const ok = await login(creds.email, creds.password);
    setLoading(false);
    if (ok) { toast.success(`Logged in as ${role}`); navigate(role === "admin" || role === "instructor" ? "/admin" : "/dashboard"); }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-30" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="font-display font-bold text-xl">DevOps<span className="text-primary">Academy</span></span>
          </Link>
          <h2 className="text-4xl font-display font-bold leading-tight mb-4">
            Your DevOps career starts <span className="gradient-text">here.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Access 120+ courses, hands-on labs, and earn certificates recognized by top tech companies.
          </p>
        </div>
        <div className="relative space-y-3">
          {["150,000+ students enrolled", "4.9★ average rating", "Industry-recognized certificates"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-7">
          <div>
            <h1 className="text-2xl font-display font-bold">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Welcome back, let's continue learning.</p>
          </div>

          {/* Quick Demo Login */}
          <div className="p-4 rounded-xl bg-muted/60 border border-border space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">⚡ Quick Admin & User Login:</p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={async () => {
                  setLoading(true);
                  const ok = await login("jatinsharma932002@gmail.com", "J@tinS93");
                  setLoading(false);
                  if (ok) { toast.success("Logged in as Default Admin"); navigate("/admin"); }
                }}
                className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-medium hover:bg-red-500/20 transition-colors"
              >
                👑 Default Admin (Jatin.Sharma93)
              </button>
              <button
                onClick={() => quickLogin("instructor")}
                className="px-2.5 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20 font-medium hover:bg-accent/20 transition-colors"
              >
                🎓 Instructor
              </button>
              <button
                onClick={() => quickLogin("student")}
                className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium hover:bg-primary/20 transition-colors"
              >
                🧑‍🎓 Student
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="px-3 bg-background text-xs text-muted-foreground">or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="email">Email address</label>
              <input
                id="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  id="password" type={showPass ? "text" : "password"} autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-70">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
