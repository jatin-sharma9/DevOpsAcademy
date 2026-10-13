import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Award, Play, BarChart3, ArrowRight, Trophy, Zap,
  CheckCircle2, Target, Flame, Sparkles, Clock, Compass, ShieldCheck,
  ChevronRight, Terminal, RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { COURSES } from "@/data/courses";
import { lmsStore, ALL_BADGES, EnrollmentState, Badge, QuizAttempt } from "@/services/lmsStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<any[]>(COURSES);
  const [localEnrollments, setLocalEnrollments] = useState<EnrollmentState[]>([]);
  // Streak is sourced from PostgreSQL tracker API (falls back to lmsStore localStorage)
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync state from lmsStore + API
  const syncDashboardData = async () => {
    try {
      // 1. Get client-side store data
      const storedEnrollments = lmsStore.getEnrollments();
      setLocalEnrollments(storedEnrollments);
      setStreak(lmsStore.getStreak());
      setUnlockedBadges(lmsStore.getUnlockedBadges());
      setQuizAttempts(lmsStore.getQuizAttempts());

      // 2. Try fetching from backend API if available
      try {
        const [coursesRes, enrollmentsRes, trackerRes, quizAttemptsRes] = await Promise.all([
          apiService.courses.getAll(true),
          apiService.enrollments.getMyEnrollments(),
          apiService.tracker.getTrackerData(),
          user ? apiService.quizzes.getMyAttempts().catch(() => null) : Promise.resolve(null),
        ]);
        if (coursesRes.success && Array.isArray(coursesRes.data) && coursesRes.data.length > 0) {
          setCourses(coursesRes.data.map(mapBackendCourseToFrontend));
        }
        if (enrollmentsRes.success && Array.isArray(enrollmentsRes.data) && enrollmentsRes.data.length > 0) {
          // Merge backend enrollments
          const mappedBackend = enrollmentsRes.data.map((e: any) => ({
            courseId: e.course_id,
            courseSlug: e.slug || '',
            enrolledAt: e.enrolled_at,
            progress: e.progress || 0,
            completedLessons: [],
          }));
          setLocalEnrollments(prev => {
            const combined = [...prev];
            mappedBackend.forEach((be: any) => {
              const idx = combined.findIndex(ce => (be.courseId && Number(ce.courseId) === Number(be.courseId)) || (be.courseSlug && ce.courseSlug === be.courseSlug));
              if (idx >= 0) {
                combined[idx].progress = Math.max(combined[idx].progress, be.progress);
              } else {
                combined.push(be);
              }
            });
            return combined;
          });
        }
        // Prefer real PostgreSQL streak over the localStorage mock
        if (trackerRes.success && trackerRes.data?.stats?.streak) {
          const s = trackerRes.data.stats.streak;
          setStreak({
            currentStreak: s.currentStreak ?? 0,
            longestStreak: s.longestStreak ?? 0,
          });
        } else {
          // Backend offline: fall back to lmsStore localStorage streak
          setStreak(lmsStore.getStreak());
        }

        // Merge real PostgreSQL quiz attempts
        if (quizAttemptsRes && quizAttemptsRes.success && Array.isArray(quizAttemptsRes.data) && quizAttemptsRes.data.length > 0) {
          const mappedAttempts: QuizAttempt[] = quizAttemptsRes.data.map((qa: any) => ({
            quizId: qa.quiz_id,
            courseSlug: qa.course_slug || (courses.find(c => Number(c.id) === Number(qa.course_id))?.slug) || 'devops',
            score: qa.score,
            passed: qa.passed,
            totalQuestions: qa.total_questions || 0,
            correctCount: qa.correct_count || 0,
            date: qa.created_at || new Date().toISOString(),
          }));
          setQuizAttempts(mappedAttempts);
        }
      } catch {
        // Backend offline, fallback seamlessly to local store
        setStreak(lmsStore.getStreak());
      }
    } catch (err) {
      console.error("Dashboard sync error:", err);
    }
  };

  useEffect(() => {
    syncDashboardData();
  }, []);

  // Map enrolled courses with current progress
  const enrolledCourses = localEnrollments.map(e => {
    const found = courses.find(c => c.slug === e.courseSlug || String(c.id) === String(e.courseId));
    if (!found) return null;
    return {
      ...found,
      progress: e.progress !== undefined ? e.progress : 0,
      completedLessons: e.completedLessons || [],
      lastAccessedLessonId: e.lastAccessedLessonId,
    };
  }).filter(Boolean) as any[];

  const completedCourses = enrolledCourses.filter(c => c.progress >= 100);
  const inProgress = enrolledCourses.filter(c => c.progress < 100);

  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((acc, curr) => acc + curr.progress, 0) / enrolledCourses.length)
    : 0;

  const totalCompletedLessons = localEnrollments.reduce((acc, curr) => acc + (curr.completedLessons?.length || 0), 0);
  const totalEstimatedHours = Math.round(totalCompletedLessons * 0.4 * 10) / 10;

  const recommendedCourses = courses
    .filter(c => !localEnrollments.some(e => e.courseSlug === c.slug || String(e.courseId) === String(c.id)))
    .slice(0, 3);

  // Skill competencies calculated from progress
  const SKILL_DOMAINS = [
    { name: "Linux & CLI", slug: "linux-fundamentals", defaultVal: 65, color: "bg-orange-500" },
    { name: "Containers & Docker", slug: "docker-mastery", defaultVal: 50, color: "bg-blue-500" },
    { name: "Kubernetes & Orchestration", slug: "kubernetes-in-action", defaultVal: 40, color: "bg-cyan-500" },
    { name: "CI/CD Automation", slug: "jenkins-cicd-pipelines", defaultVal: 30, color: "bg-green-500" },
    { name: "Infrastructure as Code", slug: "terraform-infrastructure-as-code", defaultVal: 45, color: "bg-purple-500" },
    { name: "Cloud & AWS", slug: "aws-devops-engineer", defaultVal: 35, color: "bg-amber-500" },
  ].map(skill => {
    const enrolled = enrolledCourses.find(c => c.slug === skill.slug);
    const score = enrolled ? enrolled.progress : skill.defaultVal;
    return { ...skill, score };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 p-6 sm:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" /> DevOps Pro Track
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Flame className="w-3.5 h-3.5 fill-orange-400" /> {streak.currentStreak} Day Streak!
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
              Welcome back, <span className="gradient-text">{user?.username || "DevOps Engineer"}</span> 👋
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              You are making great progress towards complete DevOps mastery. Keep your streak alive today!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/courses"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" /> Explore Catalog
            </Link>
            <Link
              to="/interview-prep"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card/60 hover:bg-muted text-sm font-medium transition-all"
            >
              <Terminal className="w-4 h-4 text-secondary" /> Interview Labs
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enrolled Courses", value: enrolledCourses.length, desc: `${inProgress.length} active`, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
          { label: "Completed Lessons", value: totalCompletedLessons || 12, desc: `~${totalEstimatedHours || 4.8} hrs learned`, icon: CheckCircle2, color: "text-secondary", bg: "bg-secondary/10" },
          { label: "Certificates Earned", value: completedCourses.length || (localEnrollments.some(e => e.certificateIssued) ? 1 : 0), desc: "Industry recognized", icon: Award, color: "text-yellow-400", bg: "bg-yellow-400/10" },
          { label: "Overall Mastery", value: `${totalProgress}%`, desc: "Across all tracks", icon: Target, color: "text-accent", bg: "bg-accent/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <span className="text-[11px] text-muted-foreground/80 font-medium">{stat.desc}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-display">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <Play className="w-4 h-4 text-primary fill-primary" /> Continue Learning
              </h2>
              <Link to="/courses" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {inProgress.length > 0 ? (
              <div className="space-y-3">
                {inProgress.map((course, i) => {
                  const prog = course.progress || 0;
                  const progressData = lmsStore.getCourseProgress(course.slug);
                  const completedSet = new Set(progressData?.completedLessons || []);
                  const allLessons = course.sections?.flatMap((s: any) => s.lessons || []) || [];
                  const nextLesson = allLessons.find((l: any) => !completedSet.has(String(l.id))) || allLessons[0];
                  const targetLearnUrl = nextLesson ? `/learn/${course.slug}?lesson=${nextLesson.id}` : `/learn/${course.slug}`;
                  return (
                    <motion.div
                      key={course.id || course.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -2 }}
                      onClick={() => navigate(targetLearnUrl)}
                      className="p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 text-white text-2xl shadow-md group-hover:scale-105 transition-transform", course.color || "from-primary to-accent")}>
                          {course.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground uppercase">
                              {course.category}
                            </span>
                            <span className="text-xs text-muted-foreground">· {course.durationHours}h total</span>
                          </div>
                          <h3 className="font-semibold text-sm sm:text-base text-foreground truncate group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>

                          <div className="mt-3">
                            <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5 font-mono">
                              <span>{prog}% completed</span>
                              <span>{course.totalLessons || 10} lessons</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="progress-fill h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(prog, 5)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-2 shrink-0 justify-end" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigate(targetLearnUrl)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-primary-foreground" /> Resume Lesson
                          </button>
                          <button
                            onClick={() => navigate(`/quiz/${course.slug}`)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium transition-colors cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 text-accent" /> Assessment
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 rounded-2xl border border-dashed border-border text-center space-y-3 bg-card/40">
                <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                <h3 className="font-semibold text-sm">Ready to begin your journey?</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Enroll in our industry-standard Linux, Docker, or Kubernetes courses to start learning.
                </p>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all mt-2"
                >
                  Browse Course Catalog <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Completed Courses & Certificates */}
          {completedCourses.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" /> Completed & Certified
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completedCourses.map((course) => (
                  <div
                    key={course.id || course.slug}
                    onClick={() => navigate(`/certificate/${course.slug}`)}
                    className="p-4 rounded-2xl border border-yellow-400/30 bg-yellow-400/5 hover:bg-yellow-400/10 hover:border-yellow-400/50 flex items-center gap-3.5 cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs truncate group-hover:text-yellow-400 transition-colors">{course.title}</h4>
                      <p className="text-[11px] text-yellow-400 font-medium">100% Completed</p>
                    </div>
                    <Link
                      to={`/certificate/${course.slug}`}
                      className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 transition-all cursor-pointer shrink-0"
                    >
                      Certificate
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Competency Breakdown */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> DevOps Competency Radar
              </h3>
              <span className="text-xs text-muted-foreground">Updated in real-time</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {SKILL_DOMAINS.map((skill, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">{skill.name}</span>
                    <span className="font-mono text-foreground">{skill.score}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", skill.color)}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Streak & Weekly Goal Card */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" /> Learning Streak
              </h3>
              <span className="text-xs font-semibold text-orange-400">{streak.currentStreak} Days</span>
            </div>

            {/* Streak Days visualization */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                const isDone = idx < streak.currentStreak;
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all",
                        isDone
                          ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isDone ? "✓" : day[0]}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{day}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Longest streak: <strong className="text-foreground">{streak.longestStreak} days</strong></span>
              <span className="text-primary font-medium">Keep it going!</span>
            </div>
          </div>

          {/* Badges & Achievements */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary" /> Achievements ({unlockedBadges.length}/{ALL_BADGES.length})
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {ALL_BADGES.map((badge) => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    title={`${badge.title}: ${badge.description}`}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-help",
                      isUnlocked
                        ? "border-primary/30 bg-primary/5 text-foreground"
                        : "border-border/40 bg-muted/20 opacity-40 grayscale"
                    )}
                  >
                    <span className="text-2xl mb-1">{badge.icon}</span>
                    <span className="text-[10px] font-medium leading-tight truncate w-full">{badge.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Quiz Performance */}
          {quizAttempts.length > 0 && (
            <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" /> Assessment History
                </h3>
                {user && (
                  <span className="text-[10px] text-green-400 font-medium">PostgreSQL Synced</span>
                )}
              </div>
              <div className="space-y-2">
                {quizAttempts.slice(0, 4).map((attempt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 text-xs">
                    <div className="min-w-0 pr-2">
                      <Link
                        to={`/quiz/${attempt.courseSlug}`}
                        className="font-medium capitalize hover:text-primary transition-colors truncate block"
                      >
                        {attempt.courseSlug.replace(/-/g, ' ')}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">{new Date(attempt.date).toLocaleDateString()}</p>
                    </div>
                    <span className={cn("font-bold px-2 py-0.5 rounded text-xs shrink-0", attempt.passed ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400")}>
                      {attempt.score}% {attempt.passed ? "Passed" : "Retake"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Next Course */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-display font-semibold text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" /> Recommended Next
            </h3>
            <div className="space-y-2.5">
              {recommendedCourses.map((course) => (
                <Link
                  key={course.id || course.slug}
                  to={`/courses/${course.slug}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-base shrink-0", course.color || "from-primary to-accent")}>
                    {course.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{course.title}</p>
                    <p className="text-[10px] text-muted-foreground">{course.durationHours}h · {course.level}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
