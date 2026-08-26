import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Award, Play, BarChart3, ArrowRight, Trophy, Zap, CheckCircle2, Target, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { cn } from "@/lib/utils";

const ACTIVITY = [
  { action: "Completed lesson", course: "Linux Fundamentals", time: "2h ago", icon: CheckCircle2, color: "text-secondary" },
  { action: "Passed quiz", course: "Docker Mastery", time: "1d ago", icon: Zap, color: "text-accent" },
  { action: "Enrolled in", course: "Kubernetes in Action", time: "2d ago", icon: BookOpen, color: "text-primary" },
];

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, enrollmentsRes] = await Promise.all([
          apiService.courses.getAll(true),
          apiService.enrollments.getMyEnrollments()
        ]);
        if (coursesRes.success && Array.isArray(coursesRes.data)) {
          setCourses(coursesRes.data.map(mapBackendCourseToFrontend));
        }
        if (enrollmentsRes.success && Array.isArray(enrollmentsRes.data)) {
          setEnrollments(enrollmentsRes.data);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Loading student dashboard...</p>
      </div>
    );
  }

  const enrolledCourses = enrollments.map(e => {
    const c = courses.find(co => Number(co.id) === Number(e.course_id));
    return c ? { ...c, progress: e.progress } : null;
  }).filter(Boolean) as any[];

  const completedCourses = enrolledCourses.filter(c => c.progress >= 100);
  const inProgress = enrolledCourses.filter(c => c.progress < 100);

  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((acc, curr) => acc + curr.progress, 0) / enrolledCourses.length)
    : 0;

  const recommendedCourses = courses.filter(c => !enrollments.some(e => Number(e.course_id) === Number(c.id))).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Welcome back, <span className="gradient-text">{user?.username}</span> 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Continue your DevOps mastery journey.</p>
        </div>
        <Link to="/courses" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all cursor-pointer">
          <BookOpen className="w-4 h-4" /> Browse Courses
        </Link>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Enrolled Courses", value: enrolledCourses.length, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
          { label: "Completed", value: completedCourses.length, icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10" },
          { label: "Certificates", value: completedCourses.length, icon: Award, color: "text-secondary", bg: "bg-secondary/10" },
          { label: "Overall Progress", value: `${totalProgress}%`, icon: Target, color: "text-accent", bg: "bg-accent/10" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl border border-border bg-card">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
              <stat.icon className={cn("w-4.5 h-4.5", stat.color)} />
            </div>
            <div className="text-2xl font-bold font-display">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display font-semibold text-lg">Continue Learning</h2>
          {inProgress.length > 0 ? (
            <div className="space-y-3">
              {inProgress.map((course, i) => {
                const prog = course.progress || 0;
                return (
                  <motion.div key={course.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 text-white/35 text-2xl", course.color)}>
                        {course.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{course.title}</h3>
                        <p className="text-xs text-muted-foreground">{course.instructor} · {course.durationHours}h</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                            <span>{prog}% complete</span>
                            <span>{course.totalLessons} lessons</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="progress-fill h-full rounded-full" style={{ width: `${prog}%` }} />
                          </div>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/learn/${course.slug}`)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors cursor-pointer">
                        <Play className="w-3 h-3" /> Resume
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed border-border text-center space-y-3">
              <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">No courses in progress yet.</p>
              <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                Browse all courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Completed Courses */}
          {completedCourses.length > 0 && (
            <>
              <h2 className="font-display font-semibold text-lg mt-6">Completed Courses</h2>
              <div className="space-y-3">
                {completedCourses.map((course) => (
                  <div key={course.id} className="p-4 rounded-2xl border border-secondary/20 bg-secondary/5 flex items-center gap-4 animate-fadeIn">
                    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 text-white/35 text-xl", course.color)}>
                      {course.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{course.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-secondary mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </div>
                    </div>
                    <Link to={`/certificate/${course.slug}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 text-xs font-medium hover:bg-yellow-400/20 transition-colors cursor-pointer">
                      <Award className="w-3 h-3" /> Certificate
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Recent Activity */}
          <div className="p-5 rounded-2xl border border-border bg-card">
            <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Recent Activity</h3>
            <div className="space-y-3">
              {ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                  </div>
                  <div>
                    <p className="text-xs"><span className="text-muted-foreground">{item.action}</span> <span className="font-medium">{item.course}</span></p>
                    <p className="text-[10px] text-muted-foreground/60">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          {completedCourses.length > 0 && (
            <div className="p-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/5">
              <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2 text-yellow-400">
                <Trophy className="w-4 h-4" /> My Certificates
              </h3>
              <div className="space-y-2">
                {completedCourses.map((c) => (
                  <Link key={c.slug} to={`/certificate/${c.slug}`}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-yellow-400/10 transition-colors">
                    <Award className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span className="text-xs font-medium truncate">{c.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recommended */}
          <div className="p-5 rounded-2xl border border-border bg-card">
            <h3 className="font-display font-semibold text-sm mb-4">Recommended</h3>
            {recommendedCourses.map((course) => (
              <Link key={course.id} to={`/courses/${course.slug}`}
                className="flex items-center gap-3 py-2.5 hover:opacity-80 transition-opacity group">
                <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white/35 text-lg shrink-0", course.color)}>
                  {course.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{course.title}</p>
                  <p className="text-[10px] text-muted-foreground">{course.durationHours}h · {course.level}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
