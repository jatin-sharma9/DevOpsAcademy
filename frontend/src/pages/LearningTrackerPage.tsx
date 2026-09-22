import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, CheckSquare, Square, Trophy, Clock,
  Plus, Trash2, Zap, LogIn, RefreshCw, AlertCircle,
  BookOpen, Terminal, CheckCircle2, ArrowRight, ExternalLink,
  ChevronDown, ChevronRight, Play, Sparkles, Award, Search,
  SlidersHorizontal, Filter, Layers, ShieldCheck, Compass, Check, Target
} from "lucide-react";
import { cn, getLevelBadge } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { COURSES, Course } from "@/data/courses";
import { lmsStore, EnrollmentState } from "@/services/lmsStore";

interface Goal {
  id: number;
  user_id?: number;
  title: string;
  category: string;
  completed: boolean;
  target_date?: string;
  completed_at?: string | null;
  created_at?: string;
}

interface TrackerStats {
  today: { completedCount: number; totalCount: number; minutesLogged: number };
  weekly: { consistencyPercent: number; activeDays: number };
  streak: { currentStreak: number; longestStreak: number; totalDaysActive: number };
}

const CATEGORIES = ["All", "Linux", "Docker", "Kubernetes", "CI/CD", "IaC", "Configuration Management", "Cloud", "Networking"];

const CATEGORY_COLORS: Record<string, string> = {
  Linux: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Docker: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Kubernetes: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "CI/CD": "bg-red-500/10 text-red-400 border-red-500/20",
  IaC: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Configuration Management": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cloud: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Networking: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  General: "bg-muted text-muted-foreground border-border",
};

function formatMinutes(mins: number) {
  if (mins === 0) return "0 min";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function LearningTrackerPage() {
  const { user, isAuthenticated } = useAuth();

  const [coursesList, setCoursesList] = useState<Course[]>(COURSES);
  const [enrollments, setEnrollments] = useState<EnrollmentState[]>([]);
  const [openCourses, setOpenCourses] = useState<Set<string>>(new Set(["linux-fundamentals", "docker-mastery"]));
  const [activeTab, setActiveTab] = useState<"matrix" | "goals" | "stats">("matrix");
  
  // Filtering & Search
  const [statusFilter, setStatusFilter] = useState<"all" | "in-progress" | "completed" | "not-started">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Daily goals state
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCat, setNewTaskCat] = useState("Kubernetes");
  const [logMinOpen, setLogMinOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState<TrackerStats>({
    today: { completedCount: 0, totalCount: 0, minutesLogged: 0 },
    weekly: { consistencyPercent: 85, activeDays: 6 },
    streak: { currentStreak: 3, longestStreak: 7, totalDaysActive: 12 },
  });

  // ─── Synchronize Store & Backend Data ──────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Load local enrollments
      const localEnrollments = lmsStore.getEnrollments();
      setEnrollments(localEnrollments);

      // 2. Load local streak
      const localStreak = lmsStore.getStreak();
      setStats(prev => ({
        ...prev,
        streak: {
          currentStreak: localStreak.currentStreak || 3,
          longestStreak: localStreak.longestStreak || 7,
          totalDaysActive: (localStreak.longestStreak || 7) + 5
        }
      }));

      // 3. If authenticated, try backend sync
      if (isAuthenticated) {
        try {
          const [trackerRes, enrollmentsRes] = await Promise.all([
            apiService.tracker.getTrackerData(),
            apiService.enrollments.getMyEnrollments()
          ]);

          if (trackerRes.success && trackerRes.data) {
            setGoals(trackerRes.data.goals || []);
            if (trackerRes.data.stats) {
              setStats(trackerRes.data.stats);
            }
          }

          if (enrollmentsRes.success && Array.isArray(enrollmentsRes.data) && enrollmentsRes.data.length > 0) {
            const mapped = enrollmentsRes.data.map((e: any) => ({
              courseId: e.course_id,
              courseSlug: e.slug || "",
              enrolledAt: e.enrolled_at,
              progress: e.progress || 0,
              completedLessons: e.completed_lessons || []
            }));
            
            // Merge with local store
            setEnrollments(prev => {
              const combined = [...prev];
              mapped.forEach((be: any) => {
                const idx = combined.findIndex(ce => ce.courseSlug === be.courseSlug);
                if (idx >= 0) {
                  combined[idx] = { ...combined[idx], ...be };
                } else {
                  combined.push(be);
                }
              });
              return combined;
            });
          }
        } catch (err) {
          console.error("Backend tracker sync error:", err);
        }
      } else {
        // Starter goals for guest
        setGoals([
          { id: 101, title: "Master Linux File Hierarchy & Inodes (Module 2)", category: "Linux", completed: true },
          { id: 102, title: "Configure Docker Multi-Stage Build for Go microservice", category: "Docker", completed: false },
          { id: 103, title: "Execute Kubernetes Rolling Update & Rollback Lab", category: "Kubernetes", completed: false },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Module Toggle Handler ────────────────────────────────────────────────
  const handleToggleModule = async (courseSlug: string, lessonId: string, totalLessons: number) => {
    // 1. Update in LMS Store (client side persistence)
    const result = lmsStore.toggleLesson(courseSlug, lessonId, totalLessons);
    
    // 2. Update local state
    setEnrollments(lmsStore.getEnrollments());

    if (result.completed) {
      toast.success(`Module completed! Progress: ${result.enrollment.progress}% 🔥`);
      if (result.enrollment.progress >= 100) {
        toast.success(`🎉 Congratulations! You have completed all modules in ${courseSlug}! Certificate unlocked.`);
      }
    } else {
      toast.info(`Module marked as incomplete.`);
    }

    // 3. Sync to backend if authenticated
    if (isAuthenticated) {
      const course = COURSES.find(c => c.slug === courseSlug);
      if (course) {
        try {
          if (result.completed) {
            await apiService.enrollments.markComplete(Number(course.id) || 1, Number(lessonId) || 1);
          } else {
            await apiService.enrollments.markIncomplete(Number(course.id) || 1, Number(lessonId) || 1);
          }
        } catch {
          // graceful fallback already in local store
        }
      }
    }
  };

  // ─── Course Accordion Toggle ──────────────────────────────────────────────
  const toggleCourseAccordion = (slug: string) => {
    setOpenCourses(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const expandAllCourses = () => {
    if (openCourses.size === coursesList.length) {
      setOpenCourses(new Set());
    } else {
      setOpenCourses(new Set(coursesList.map(c => c.slug)));
    }
  };

  // ─── Add Goal from Module Quick Trigger ────────────────────────────────────
  const handleAddModuleAsGoal = async (lessonTitle: string, category: string) => {
    const title = `Complete: ${lessonTitle}`;
    if (isAuthenticated) {
      try {
        const res = await apiService.tracker.addGoal({ title, category });
        if (res.success) {
          setGoals(prev => [res.data, ...prev]);
          toast.success("Added to today's focus goals! 🎯");
        }
      } catch {
        toast.error("Failed to add goal");
      }
    } else {
      setGoals(prev => [{ id: Date.now(), title, category, completed: false }, ...prev]);
      toast.success("Added to today's focus goals! 🎯");
    }
  };

  // ─── Add Custom Goal ──────────────────────────────────────────────────────
  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (isAuthenticated) {
      try {
        const res = await apiService.tracker.addGoal({
          title: newTaskTitle.trim(),
          category: newTaskCat,
        });
        if (res.success) {
          setGoals(prev => [res.data, ...prev]);
          setNewTaskTitle("");
          toast.success("Goal saved 🎯");
        }
      } catch {
        toast.error("Failed to add goal");
      }
    } else {
      setGoals(prev => [{ id: Date.now(), title: newTaskTitle.trim(), category: newTaskCat, completed: false }, ...prev]);
      setNewTaskTitle("");
      toast.success("Goal saved 🎯");
    }
  };

  // ─── Toggle Goal ──────────────────────────────────────────────────────────
  const toggleGoal = async (goalId: number) => {
    if (isAuthenticated) {
      try {
        const res = await apiService.tracker.toggleGoal(goalId);
        if (res.success) {
          setGoals(prev => prev.map(g => g.id === goalId ? res.data.goal : g));
          if (res.data.stats) setStats(res.data.stats);
          if (res.data.goal.completed) toast.success("Goal completed! 🔥 Streak updated");
        }
      } catch {
        toast.error("Failed to toggle goal");
      }
    } else {
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g));
      toast.success("Goal toggled!");
    }
  };

  // ─── Delete Goal ──────────────────────────────────────────────────────────
  const deleteGoal = async (goalId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      try {
        const res = await apiService.tracker.deleteGoal(goalId);
        if (res.success) {
          setGoals(prev => prev.filter(g => g.id !== goalId));
          toast.info("Goal removed");
        }
      } catch {
        toast.error("Failed to delete goal");
      }
    } else {
      setGoals(prev => prev.filter(g => g.id !== goalId));
      toast.info("Goal removed");
    }
  };

  // ─── Log Time ─────────────────────────────────────────────────────────────
  const logTime = async (minutes: number) => {
    if (isAuthenticated) {
      try {
        const res = await apiService.tracker.logTime(minutes);
        if (res.success) {
          setStats(res.data.stats);
          toast.success(`+${minutes}m logged! Keep going 💪`);
        }
      } catch {
        toast.error("Failed to log time");
      }
    } else {
      setStats(s => ({
        ...s,
        today: { ...s.today, minutesLogged: s.today.minutesLogged + minutes }
      }));
      toast.success(`+${minutes}m logged! Keep going 💪`);
    }
    setLogMinOpen(false);
  };

  // ─── Aggregate Course Metrics ─────────────────────────────────────────────
  const totalPlatformModules = useMemo(() => {
    return coursesList.reduce((acc, c) => acc + (c.sections?.reduce((sAcc, s) => sAcc + (s.lessons?.length || 0), 0) || c.totalLessons || 0), 0);
  }, [coursesList]);

  const totalCompletedModules = useMemo(() => {
    return enrollments.reduce((acc, e) => acc + (e.completedLessons?.length || 0), 0);
  }, [enrollments]);

  const overallMasteryPct = totalPlatformModules > 0
    ? Math.min(100, Math.round((totalCompletedModules / totalPlatformModules) * 100))
    : 0;

  const completedCoursesCount = enrollments.filter(e => e.progress >= 100).length;
  const inProgressCoursesCount = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;

  // ─── Filtered Course List ─────────────────────────────────────────────────
  const filteredCourses = useMemo(() => {
    return coursesList.filter(course => {
      const enrollment = enrollments.find(e => e.courseSlug === course.slug);
      const progress = enrollment?.progress || 0;

      // Status filter
      if (statusFilter === "in-progress" && (progress === 0 || progress >= 100)) return false;
      if (statusFilter === "completed" && progress < 100) return false;
      if (statusFilter === "not-started" && progress > 0) return false;

      // Category filter
      if (categoryFilter !== "All" && course.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesCat = course.category.toLowerCase().includes(q);
        const matchesLesson = course.sections?.some(s => s.lessons.some(l => l.title.toLowerCase().includes(q)));
        if (!matchesTitle && !matchesCat && !matchesLesson) return false;
      }

      return true;
    });
  }, [coursesList, enrollments, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* ─── TOP MASTERY BANNER ─── */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>DevOps Academy Course Progress & Curriculum Tracker</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-bold text-foreground">
              Mastery Tracker & <span className="gradient-text">Curriculum Progress</span>
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Track your exact completion across all 9 DevOps tracks, 122 interactive modules, terminal labs, and verified credentials. Check off completed lessons to synchronize your learning streak.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Streak Badge */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-sm">
              <Flame className="w-6 h-6 fill-amber-400 animate-pulse" />
              <div>
                <div className="text-[10px] uppercase font-mono text-muted-foreground font-semibold">Learning Streak</div>
                <div className="font-display font-bold text-base leading-tight">
                  {stats.streak.currentStreak} Days Active 🔥
                </div>
              </div>
            </div>

            {/* Refresh */}
            <button
              onClick={loadData}
              disabled={loading}
              className="p-3 rounded-2xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              title="Refresh tracker"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin text-primary")} />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-6 border-t border-border/60 space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> Overall DevOps Curriculum Mastery:
            </span>
            <span className="font-mono font-bold text-primary text-sm sm:text-base">
              {totalCompletedModules} / {totalPlatformModules} Modules ({overallMasteryPct}%)
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallMasteryPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* ─── GLOBAL KPI CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Modules Completed */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Modules Finished</div>
            <div className="text-xl sm:text-2xl font-bold font-display text-foreground">{totalCompletedModules} <span className="text-xs font-normal text-muted-foreground">/ {totalPlatformModules}</span></div>
          </div>
        </div>

        {/* Tracks In Progress */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 border border-secondary/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Active Tracks</div>
            <div className="text-xl sm:text-2xl font-bold font-display text-foreground">{inProgressCoursesCount} <span className="text-xs font-normal text-muted-foreground">In Progress</span></div>
          </div>
        </div>

        {/* Certificates Earned */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0 border border-yellow-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Credentials Earned</div>
            <div className="text-xl sm:text-2xl font-bold font-display text-yellow-400">{completedCoursesCount} <span className="text-xs font-normal text-muted-foreground">/ 9 Tracks</span></div>
          </div>
        </div>

        {/* Study Time Logged */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0 border border-accent/20">
              <Clock className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground font-medium">Study Time Today</div>
              <div className="text-xl sm:text-2xl font-bold font-display text-foreground truncate">{formatMinutes(stats.today.minutesLogged)}</div>
            </div>
          </div>

          {/* Quick Log Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setLogMinOpen(v => !v)}
              className="p-2 rounded-xl bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 transition-all cursor-pointer"
              title="Log focused study time"
            >
              <Zap className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {logMinOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 4 }}
                  className="absolute right-0 top-11 z-50 flex flex-col gap-1 p-2 rounded-xl border border-border bg-card shadow-xl min-w-[110px]"
                >
                  <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground px-2 py-1">Quick Log</span>
                  {[15, 30, 45, 60].map(m => (
                    <button
                      key={m}
                      onClick={() => logTime(m)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-left flex items-center justify-between"
                    >
                      <span>+{m} mins</span>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── VIEW MODE TABS ─── */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-1">
        {[
          { id: "matrix", label: "Course & Module Checklist", icon: BookOpen, count: coursesList.length },
          { id: "goals", label: "Today's Focus & Micro-Goals", icon: Target, count: goals.length },
          { id: "stats", label: "Streak & Weekly Velocity", icon: Flame },
        ].map((tab: any) => {
          const Icon = tab.icon || BookOpen;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer",
                isActive
                  ? "border-primary text-primary bg-primary/5 rounded-t-xl shadow-sm"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-mono", isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: COURSE & MODULE PROGRESS MATRIX                                */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          {/* Controls: Search & Status Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search across all 122 modules & courses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              {[
                { id: "all", label: "All Tracks" },
                { id: "in-progress", label: "In Progress" },
                { id: "completed", label: "Completed" },
                { id: "not-started", label: "Not Started" },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                    statusFilter === f.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f.label}
                </button>
              ))}

              <button
                onClick={expandAllCourses}
                className="ml-2 text-xs font-semibold text-primary hover:underline px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 whitespace-nowrap"
              >
                {openCourses.size === coursesList.length ? "Collapse All" : "Expand All"}
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full border transition-all whitespace-nowrap cursor-pointer",
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Course Cards List */}
          {filteredCourses.length === 0 ? (
            <div className="p-12 rounded-3xl border border-border bg-card text-center space-y-3">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto" />
              <h3 className="font-bold text-base">No tracks match your filter</h3>
              <p className="text-xs text-muted-foreground">Try clearing your search query or selecting "All Tracks".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course, cIdx) => {
                const enrollment = enrollments.find(e => e.courseSlug === course.slug);
                const completedSet = new Set(enrollment?.completedLessons || []);
                const courseLessons = course.sections?.flatMap((s: any) => s.lessons || []) || [];
                const totalCourseLessons = courseLessons.length || course.totalLessons || 10;
                const completedCount = completedSet.size;
                const progressPct = totalCourseLessons > 0 ? Math.min(100, Math.round((completedCount / totalCourseLessons) * 100)) : 0;
                const isComplete = progressPct === 100;
                const isOpen = openCourses.has(course.slug);

                return (
                  <div
                    key={course.slug || cIdx}
                    className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm transition-all hover:border-primary/40"
                  >
                    {/* Course Summary Header Row */}
                    <div
                      onClick={() => toggleCourseAccordion(course.slug)}
                      className="p-5 sm:p-6 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 cursor-pointer"
                    >
                      {/* Left: Icon & Info */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl border shadow-inner",
                          isComplete
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : progressPct > 0
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-muted text-muted-foreground border-border"
                        )}>
                          {isComplete ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : course.icon || <BookOpen className="w-6 h-6" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={cn("px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full border", CATEGORY_COLORS[course.category] || CATEGORY_COLORS.General)}>
                              {course.category}
                            </span>
                            <span className={cn("px-2 py-0.5 text-[10px] font-semibold rounded-full border capitalize", getLevelBadge(course.level))}>
                              {course.level}
                            </span>
                            <span className="text-xs text-muted-foreground">· {course.durationHours || 14}h Track</span>
                          </div>

                          <h3 className="font-display font-bold text-base sm:text-lg text-foreground truncate">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      {/* Middle: Progress Bar */}
                      <div className="w-full lg:w-64 space-y-1.5 shrink-0">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{completedCount}/{totalCourseLessons} Modules Done</span>
                          <span className={cn("font-mono font-bold", isComplete ? "text-green-400" : "text-primary")}>
                            {progressPct}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all duration-500", isComplete ? "bg-green-400" : "progress-fill")}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end shrink-0" onClick={e => e.stopPropagation()}>
                        {(() => {
                          const nextUncompleted = courseLessons.find((l: any) => !completedSet.has(String(l.id))) || courseLessons[0];
                          const targetLearnUrl = nextUncompleted ? `/learn/${course.slug}?lesson=${nextUncompleted.id}` : `/learn/${course.slug}`;
                          return isComplete ? (
                            <Link
                              to={`/certificate/${course.slug}`}
                              className="px-3.5 py-2 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 font-bold text-xs flex items-center gap-1.5 hover:bg-yellow-500/25 transition-all shadow-sm"
                            >
                              <Award className="w-3.5 h-3.5" /> Certificate
                            </Link>
                          ) : (
                            <Link
                              to={targetLearnUrl}
                              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-sm"
                            >
                              <Play className="w-3.5 h-3.5 fill-primary-foreground" />
                              {progressPct > 0 ? "Resume" : "Start Track"}
                            </Link>
                          );
                        })()}

                        <button
                          onClick={() => toggleCourseAccordion(course.slug)}
                          className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="Toggle module checklist"
                        >
                          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Module Breakdown Checklist */}
                    {isOpen && (
                      <div className="border-t border-border/70 p-5 sm:p-6 bg-card/40 space-y-6">
                        <div className="flex items-center justify-between pb-2 border-b border-border/50 text-xs">
                          <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                            Curriculum & Interactive Module Check-Off
                          </span>
                          <span className="text-muted-foreground">
                            Click checkbox to mark done · Updates streak & progress
                          </span>
                        </div>

                        {/* Sections List */}
                        <div className="space-y-4">
                          {course.sections?.map((section, sIdx) => (
                            <div key={section.id || sIdx} className="space-y-2">
                              <h4 className="text-xs font-bold text-foreground/90 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {section.title}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {section.lessons?.map((lesson, lIdx) => {
                                  const isDone = completedSet.has(String(lesson.id));
                                  return (
                                    <div
                                      key={lesson.id || lIdx}
                                      className={cn(
                                        "p-3 rounded-xl border transition-all flex items-start justify-between gap-3 group",
                                        isDone
                                          ? "border-green-500/30 bg-green-500/5 text-muted-foreground"
                                          : "border-border bg-card/80 hover:border-primary/40"
                                      )}
                                    >
                                      {/* Checkbox + Title */}
                                      <button
                                        onClick={() => handleToggleModule(course.slug, String(lesson.id), totalCourseLessons)}
                                        className="flex items-start gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
                                      >
                                        <div className="mt-0.5 shrink-0">
                                          {isDone ? (
                                            <CheckSquare className="w-4 h-4 text-green-400" />
                                          ) : (
                                            <Square className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                          )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <p className={cn(
                                            "text-xs font-semibold text-foreground leading-snug line-clamp-1",
                                            isDone && "line-through text-muted-foreground"
                                          )}>
                                            {lesson.title}
                                          </p>
                                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                            <span className="capitalize">{lesson.type || "Theory & Lab"}</span>
                                            <span>•</span>
                                            <span>{lesson.duration || 45}m</span>
                                          </div>
                                        </div>
                                      </button>

                                      {/* Quick Action Links */}
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          onClick={() => handleAddModuleAsGoal(lesson.title, course.category)}
                                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-[10px]"
                                          title="Add to Today's Focus Goals"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>

                                        <Link
                                          to={`/learn/${course.slug}?lesson=${lesson.id}`}
                                          className="p-1 rounded hover:bg-primary/10 text-primary transition-colors text-[10px]"
                                          title="Open in Studio"
                                        >
                                          <Play className="w-3 h-3 fill-primary" />
                                        </Link>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: TODAY'S FOCUS & DAILY GOALS                                    */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "goals" && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Add Goal Form */}
          <form onSubmit={addGoal} className="flex gap-2 flex-wrap sm:flex-nowrap p-4 rounded-2xl border border-border bg-card shadow-sm">
            <input
              id="tracker-new-goal-input"
              type="text"
              placeholder="Add a custom daily learning milestone (e.g. Master EKS IRSA Security)..."
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-0"
            />
            <select
              id="tracker-category-select"
              value={newTaskCat}
              onChange={e => setNewTaskCat(e.target.value)}
              className="px-3 py-2.5 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {CATEGORIES.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Goal
            </button>
          </form>

          {/* Goals List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base">Active Daily Goals ({goals.length})</h3>
              <span className="text-xs text-muted-foreground">{goals.filter(g => g.completed).length}/{goals.length} completed</span>
            </div>

            {goals.length === 0 ? (
              <div className="p-8 rounded-2xl border border-border bg-card text-center space-y-2">
                <Target className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="text-sm font-semibold">No active goals yet</p>
                <p className="text-xs text-muted-foreground">Add one above or click '+' on any course module from the checklist!</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {goals.map(goal => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => toggleGoal(goal.id)}
                    className={cn(
                      "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all group",
                      goal.completed
                        ? "border-green-500/30 bg-green-500/5 text-muted-foreground"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {goal.completed ? (
                        <CheckSquare className="w-5 h-5 text-green-400 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                      <span className={cn(
                        "text-sm font-medium truncate",
                        goal.completed && "line-through text-muted-foreground"
                      )}>
                        {goal.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "px-2.5 py-0.5 text-[10px] font-mono rounded-full border",
                        CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.General
                      )}>
                        {goal.category}
                      </span>

                      <button
                        onClick={e => deleteGoal(goal.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: STREAK & LEARNING VELOCITY ANALYTICS                           */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Streak Overview Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Flame className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">Daily Streak Analytics</h3>
                <p className="text-xs text-muted-foreground">Consistency is key to mastering enterprise DevOps</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border text-center">
                <div className="text-xs text-muted-foreground">Current Streak</div>
                <div className="text-3xl font-bold font-display text-amber-400 mt-1">{stats.streak.currentStreak} Days 🔥</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border text-center">
                <div className="text-xs text-muted-foreground">Longest Record</div>
                <div className="text-3xl font-bold font-display text-foreground mt-1">{stats.streak.longestStreak} Days 🏆</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5 text-xs text-muted-foreground">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Streak Protection
              </div>
              <p>
                Complete at least 1 module or log 15 minutes of study every 24 hours to keep your flame active.
              </p>
            </div>
          </div>

          {/* Weekly Consistency & Time Logging */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">Study Time & Consistency</h3>
                <p className="text-xs text-muted-foreground">Track focused terminal lab hours</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Weekly Target Consistency:</span>
                <span className="font-mono font-bold text-primary">{stats.weekly.consistencyPercent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${stats.weekly.consistencyPercent}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground">{stats.weekly.activeDays} of 7 days active this rolling week.</p>
            </div>

            {/* Quick Log Presets */}
            <div className="pt-2 border-t border-border space-y-2">
              <span className="text-xs font-semibold text-foreground">Quick Log Study Session Today:</span>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map(m => (
                  <button
                    key={m}
                    onClick={() => logTime(m)}
                    className="py-2.5 rounded-xl border border-border hover:border-primary/40 bg-muted/20 hover:bg-primary/10 text-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    +{m}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
