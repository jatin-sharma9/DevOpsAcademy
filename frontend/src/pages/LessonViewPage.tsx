import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Play, Zap, Terminal, ArrowRight, ArrowLeft,
  AlertCircle, ExternalLink, Loader2, BookOpen, FileText,
  Code2, Share2, Award, ChevronLeft, ChevronRight, Menu, X, Save,
  Trophy, Sparkles, RotateCcw, Trash2, Cloud, CloudOff
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { COURSES } from "@/data/courses";
import { lmsStore } from "@/services/lmsStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import StandardLearningTemplate from "@/components/learning/StandardLearningTemplate";

export default function LessonViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonQueryId = searchParams.get("lesson");
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"curriculum" | "notes">("curriculum");
  const [lessonNote, setLessonNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteDeleting, setNoteDeleting] = useState(false);
  const [noteLastSaved, setNoteLastSaved] = useState<string | null>(null);
  const [hasRemoteNote, setHasRemoteNote] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const fetchCourseData = async () => {
    if (!slug) return;
    try {
      setLoading(true);

      // 1. Try to load from static COURSES first for instant availability
      const staticCourse = COURSES.find(c => c.slug === slug);
      let resolvedCourse = staticCourse;

      // 2. Try fetching backend course
      try {
        const courseRes = await apiService.courses.getBySlug(slug);
        if (courseRes.success && courseRes.data) {
          resolvedCourse = mapBackendCourseToFrontend(courseRes.data);
        }
      } catch {
        // Backend offline, keep static course
      }

      if (resolvedCourse) {
        setCourse(resolvedCourse);
        
        // Auto enroll in local store
        lmsStore.enroll(resolvedCourse.id, resolvedCourse.slug);

        // Get local completed lessons
        const progressData = lmsStore.getCourseProgress(resolvedCourse.slug);
        const localCompleted = new Set<string>(progressData?.completedLessons || []);
        
        // Try backend progress sync
        try {
          const beProgress = await apiService.enrollments.getCourseProgress(Number(resolvedCourse.id));
          if (beProgress.success && beProgress.data?.completedLessons) {
            beProgress.data.completedLessons.forEach((id: number) => localCompleted.add(String(id)));
          }
        } catch {
          // Keep local store progress
        }

        setCompletedLessons(localCompleted);

        // Determine active lesson
        const allLessons = resolvedCourse.sections.flatMap((s: any) => s.lessons);
        if (allLessons.length > 0) {
          const queryMatch = lessonQueryId ? allLessons.find((l: any) => String(l.id) === String(lessonQueryId)) : null;
          const lastAccessed = progressData?.lastAccessedLessonId;
          const foundLast = allLessons.find((l: any) => String(l.id) === String(lastAccessed));
          const firstUncompleted = allLessons.find((l: any) => !localCompleted.has(String(l.id)));
          const targetLesson = queryMatch || foundLast || firstUncompleted || allLessons[0];
          setActiveLesson(targetLesson);
          setLessonNote(lmsStore.getNote(String(targetLesson.id)));
          if (!lessonQueryId) {
            setSearchParams({ lesson: targetLesson.id }, { replace: true });
          }
        }
      }
    } catch (err) {
      console.error("Error loading course progress:", err);
      toast.error("Failed to load course lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [slug]);

  // Synchronize active lesson when searchParams query changes without re-fetching entire course
  useEffect(() => {
    if (course && lessonQueryId) {
      const allLessons = course.sections.flatMap((s: any) => s.lessons);
      const matched = allLessons.find((l: any) => String(l.id) === String(lessonQueryId));
      if (matched && matched.id !== activeLesson?.id) {
        setActiveLesson(matched);
        setVideoError(false);
      }
    }
  }, [lessonQueryId, course]);

  // Fetch note from PostgreSQL API when active lesson changes (fallback to lmsStore)
  useEffect(() => {
    let isCancelled = false;
    if (!activeLesson) return;

    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    const fetchLessonNote = async () => {
      const lessonNumericId = Number(activeLesson.id);
      const isNumeric = !isNaN(lessonNumericId);

      if (user && isNumeric) {
        setNoteLoading(true);
        try {
          const res = await apiService.notes.getLessonNotes(lessonNumericId);
          if (!isCancelled) {
            if (res.success && res.data) {
              setLessonNote(res.data.content || "");
              setNoteLastSaved(res.data.updated_at || res.data.created_at || null);
              setHasRemoteNote(true);
              lmsStore.saveNote(String(activeLesson.id), res.data.content || "");
              return;
            } else {
              // No remote note found, check local draft
              const localDraft = lmsStore.getNote(String(activeLesson.id)) || "";
              setLessonNote(localDraft);
              setHasRemoteNote(false);
              setNoteLastSaved(null);
              return;
            }
          }
        } catch (err) {
          console.error("Failed to load cloud lesson note:", err);
        } finally {
          if (!isCancelled) setNoteLoading(false);
        }
      }

      if (!isCancelled) {
        setLessonNote(lmsStore.getNote(String(activeLesson.id)) || "");
        setHasRemoteNote(false);
        setNoteLastSaved(null);
        setNoteLoading(false);
      }
    };

    fetchLessonNote();

    return () => {
      isCancelled = true;
    };
  }, [activeLesson?.id, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 min-h-[70vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Initializing interactive lesson workspace...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold font-display">Course Not Found</h2>
          <p className="text-muted-foreground text-sm">We couldn't locate the requested course curriculum.</p>
          <Link to="/courses" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const allLessons = course.sections.flatMap((s: any) => s.lessons);
  const totalLessons = allLessons.length;
  const completedCount = completedLessons.size;
  const progress = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;
  const currentIdx = activeLesson ? allLessons.findIndex((l: any) => String(l.id) === String(activeLesson.id)) : -1;
  const isDone = activeLesson ? completedLessons.has(String(activeLesson.id)) : false;
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx >= 0 && currentIdx < allLessons.length - 1;

  const handleMarkComplete = async () => {
    if (!activeLesson || !course) return;
    const lessonId = String(activeLesson.id);

    // 1. Save locally
    const enrollment = lmsStore.completeLesson(course.slug, lessonId, totalLessons);
    const updatedCompleted = new Set(enrollment.completedLessons.map(String));
    setCompletedLessons(updatedCompleted);
    toast.success("Lesson marked as completed!");

    // 2. Sync to backend if available
    try {
      if (course.id && !isNaN(Number(course.id))) {
        await apiService.enrollments.markComplete(Number(course.id), Number(lessonId));
      }
    } catch {
      // Offline fallback already updated local storage
    }

    // Check if entire track finished or advance to next lesson
    if (updatedCompleted.size >= totalLessons) {
      setShowCompletionModal(true);
      toast.success("🎉 Outstanding! You have mastered 100% of this course!");
    } else if (hasNext) {
      const nextLesson = allLessons[currentIdx + 1];
      setActiveLesson(nextLesson);
      setSearchParams({ lesson: nextLesson.id }, { replace: true });
      setVideoError(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!activeLesson || !course) return;
    const lessonId = String(activeLesson.id);

    const { completed, enrollment } = lmsStore.toggleLesson(course.slug, lessonId, totalLessons);
    const updatedCompleted = new Set(enrollment.completedLessons.map(String));
    setCompletedLessons(updatedCompleted);

    if (completed) {
      toast.success("Lesson marked as completed!");
      try {
        if (course.id && !isNaN(Number(course.id))) {
          await apiService.enrollments.markComplete(Number(course.id), Number(lessonId));
        }
      } catch {}
      if (updatedCompleted.size >= totalLessons) {
        setShowCompletionModal(true);
      }
    } else {
      toast.info("Lesson marked as incomplete");
      try {
        if (course.id && !isNaN(Number(course.id))) {
          await apiService.enrollments.markIncomplete(Number(course.id), Number(lessonId));
        }
      } catch {}
    }
  };

  const handleSaveNote = async () => {
    if (!activeLesson) return;
    const lessonNumericId = Number(activeLesson.id);
    const isNumeric = !isNaN(lessonNumericId);

    // Save locally first for offline safety
    lmsStore.saveNote(String(activeLesson.id), lessonNote);

    if (user && isNumeric) {
      setNoteSaving(true);
      try {
        const res = await apiService.notes.saveLessonNotes(lessonNumericId, lessonNote);
        if (res.success) {
          toast.success("Note saved to your cloud profile!");
          setNoteLastSaved(new Date().toISOString());
          setHasRemoteNote(true);
        } else {
          toast.error(res.message || "Failed to sync note to cloud.");
        }
      } catch (err: any) {
        console.error("Error saving note:", err);
        toast.error(err.response?.data?.message || "Failed to save note to cloud. Kept in local storage.");
      } finally {
        setNoteSaving(false);
      }
    } else {
      toast.success("Note saved locally! (Sign in to sync across devices)");
    }
  };

  const handleDeleteNote = async () => {
    if (!activeLesson) return;
    const lessonNumericId = Number(activeLesson.id);
    const isNumeric = !isNaN(lessonNumericId);

    if (user && isNumeric && hasRemoteNote) {
      setNoteDeleting(true);
      try {
        const res = await apiService.notes.deleteLessonNotes(lessonNumericId);
        if (res.success) {
          setLessonNote("");
          setHasRemoteNote(false);
          setNoteLastSaved(null);
          lmsStore.saveNote(String(activeLesson.id), "");
          toast.success("Lesson note deleted from cloud.");
        } else {
          toast.error(res.message || "Failed to delete cloud note.");
        }
      } catch (err: any) {
        console.error("Error deleting note:", err);
        toast.error(err.response?.data?.message || "Failed to delete note from cloud.");
      } finally {
        setNoteDeleting(false);
      }
    } else {
      lmsStore.saveNote(String(activeLesson.id), "");
      setLessonNote("");
      setHasRemoteNote(false);
      setNoteLastSaved(null);
      toast.success("Local note cleared.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Sidebar - Curriculum Navigator */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 sm:w-96 border-r border-border bg-card flex flex-col transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <Link to={`/courses/${course.slug}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-3.5 h-3.5" /> Course Overview
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="font-display font-bold text-sm text-foreground line-clamp-1">{course.title}</h2>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 mb-1">
              <span>{completedCount}/{totalLessons} lessons completed</span>
              <span className="font-mono font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="progress-fill h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {progress >= 100 && (
            <Link
              to={`/certificate/${course.slug}`}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 transition-all shadow-md shadow-yellow-400/20"
            >
              <Award className="w-4 h-4" /> Claim Certificate
            </Link>
          )}
        </div>

        {/* Section & Lessons list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {course.sections.map((section: any, sIdx: number) => (
            <div key={section.id || sIdx} className="space-y-1">
              <p className="px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </p>
              {section.lessons.map((lesson: any, lIdx: number) => {
                const done = completedLessons.has(String(lesson.id));
                const active = activeLesson?.id === lesson.id;
                return (
                  <button
                    key={lesson.id || lIdx}
                    onClick={() => {
                      setActiveLesson(lesson);
                      setSearchParams({ lesson: lesson.id }, { replace: true });
                      setVideoError(false);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-all cursor-pointer",
                      active
                        ? "bg-primary/10 border border-primary/30 text-primary font-semibold"
                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                        done
                          ? "border-secondary bg-secondary text-black"
                          : active
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-mono">{lIdx + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs truncate", active && "text-foreground font-semibold")}>{lesson.title}</p>
                      <p className="text-[10px] text-muted-foreground/80 capitalize">{lesson.type || "video"} · {lesson.duration || 15}m</p>
                    </div>
                    {lesson.type === "quiz" && <Zap className="w-3.5 h-3.5 text-accent shrink-0" />}
                    {lesson.type === "lab" && <Terminal className="w-3.5 h-3.5 text-secondary shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="h-14 border-b border-border px-4 sm:px-6 flex items-center justify-between bg-card/50 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate hidden sm:block">{course.title}</p>
              <h2 className="text-sm font-bold truncate text-foreground">{activeLesson?.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (hasPrev) {
                  const prevLesson = allLessons[currentIdx - 1];
                  setActiveLesson(prevLesson);
                  setSearchParams({ lesson: prevLesson.id }, { replace: true });
                }
              }}
              disabled={!hasPrev}
              className={cn(
                "p-2 rounded-xl border border-border text-xs font-medium flex items-center gap-1 transition-all",
                hasPrev ? "hover:bg-muted text-foreground cursor-pointer" : "opacity-40 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Prev</span>
            </button>

            <button
              onClick={handleMarkComplete}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                isDone
                  ? "bg-secondary/20 text-secondary border border-secondary/30"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
              )}
            >
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
              {isDone ? "Completed" : "Complete & Next"}
            </button>

            <button
              onClick={() => {
                if (hasNext) {
                  const nextLesson = allLessons[currentIdx + 1];
                  setActiveLesson(nextLesson);
                  setSearchParams({ lesson: nextLesson.id }, { replace: true });
                }
              }}
              disabled={!hasNext}
              className={cn(
                "p-2 rounded-xl border border-border text-xs font-medium flex items-center gap-1 transition-all",
                hasNext ? "hover:bg-muted text-foreground cursor-pointer" : "opacity-40 cursor-not-allowed"
              )}
            >
              <span className="hidden sm:inline">Next</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lesson Viewport Scroll Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {/* Video Player Display */}
          {activeLesson?.youtubeUrl ? (
            <div className="relative w-full aspect-video max-h-[500px] bg-black shadow-2xl flex items-center justify-center">
              {videoError ? (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                  <p className="text-sm font-semibold">Video Unavailable in Embedded Frame</p>
                  <a
                    href={activeLesson.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5"
                  >
                    Open on YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <iframe
                  src={`${activeLesson.youtubeUrl.replace("watch?v=", "embed/").replace("&", "?")}${activeLesson.youtubeUrl.includes("?") ? "&" : "?"}rel=0&modestbranding=1`}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => setVideoError(true)}
                  className="w-full h-full border-0"
                />
              )}
            </div>
          ) : (
            <div className={cn("h-64 sm:h-80 bg-gradient-to-br flex items-center justify-center relative p-6", course.color || "from-primary to-accent")}>
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative text-center space-y-3 max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center mx-auto">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
                <h3 className="text-lg font-display font-bold text-white">{activeLesson?.title}</h3>
                <p className="text-xs text-white/70 capitalize">{activeLesson?.type || "Lesson"} · {activeLesson?.duration || 15} minutes</p>
              </div>
            </div>
          )}

          {/* Tab Navigation & Content Container */}
          <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
            {/* Top Level Tabs */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                {[
                  { id: "curriculum", label: "Standard 5-Pillar Curriculum", icon: BookOpen },
                  { id: "notes", label: "My Notebook", icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/quiz/${course.slug}`}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/15 text-accent border border-accent/30 text-xs font-semibold hover:bg-accent/25 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" /> Take Quiz
                </Link>
                <Link
                  to="/interview-prep"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted transition-all"
                >
                  <Terminal className="w-3.5 h-3.5 text-secondary" /> Interview Prep
                </Link>
              </div>
            </div>

            {/* Tab 1: 5-Pillar Standard Learning Template */}
            {activeTab === "curriculum" && activeLesson && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">{activeLesson.title}</h1>
                  <p className="text-xs text-muted-foreground mt-1">Course: {course.title} · Instructor: {course.instructor}</p>
                </div>

                <StandardLearningTemplate
                  lesson={activeLesson}
                  course={course}
                  onComplete={handleMarkComplete}
                  isCompleted={isDone}
                />
              </motion.div>
            )}

            {/* Tab 2: My Notebook */}
            {activeTab === "notes" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">Personal Notes for: {activeLesson?.title}</h3>
                      {user ? (
                        hasRemoteNote ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-400 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded-full">
                            <Cloud className="w-3 h-3" /> Cloud Synced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            <Cloud className="w-3 h-3" /> PostgreSQL Connected
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full">
                          <CloudOff className="w-3 h-3" /> Local Browser Only
                        </span>
                      )}
                    </div>
                    {noteLastSaved && (
                      <p className="text-[11px] text-muted-foreground">
                        Last saved: {new Date(noteLastSaved).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {(lessonNote || hasRemoteNote) && (
                      <button
                        onClick={handleDeleteNote}
                        disabled={noteDeleting || noteLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-semibold hover:bg-destructive/10 transition-all cursor-pointer disabled:opacity-50"
                        title="Delete this note"
                      >
                        {noteDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      onClick={handleSaveNote}
                      disabled={noteSaving || noteLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 shadow-sm shadow-primary/20"
                    >
                      {noteSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>{noteSaving ? "Saving..." : "Save Notes"}</span>
                    </button>
                  </div>
                </div>

                {!user && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 text-xs text-amber-300">
                    <p>💡 You are browsing as guest. Notes are saved locally in this browser.</p>
                    <Link to="/login" className="underline font-semibold hover:text-amber-200 shrink-0">
                      Sign In to Sync to Cloud
                    </Link>
                  </div>
                )}

                {noteLoading ? (
                  <div className="w-full h-48 rounded-2xl border border-border bg-card/50 flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>Loading your lesson notes from PostgreSQL...</span>
                  </div>
                ) : (
                  <textarea
                    value={lessonNote}
                    onChange={(e) => setLessonNote(e.target.value)}
                    placeholder="Type your notes, key takeaways, code snippets, or reminders here... (press Save Notes to persist to PostgreSQL)"
                    rows={10}
                    className="w-full p-4 rounded-2xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed font-mono"
                  />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ─── COURSE COMPLETION CELEBRATION MODAL ─── */}
      <AnimatePresence>
        {showCompletionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-primary/30 bg-card p-6 sm:p-8 shadow-2xl overflow-hidden text-center space-y-6"
            >
              {/* Decorative top gradient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 blur-3xl pointer-events-none rounded-full" />

              <button
                onClick={() => setShowCompletionModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400/20 to-primary/20 border border-yellow-400/40 text-yellow-400 flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25">
                  <Sparkles className="w-3.5 h-3.5" /> 100% Track Mastery
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
                  Congratulations!
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  You have successfully completed all <strong className="text-foreground">{totalLessons} lessons</strong> of{" "}
                  <strong className="text-foreground">{course.title}</strong>.
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5 pt-2">
                <Link
                  to={`/certificate/${course.slug}`}
                  onClick={() => setShowCompletionModal(false)}
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-yellow-400/20 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" /> Claim Verified Certificate
                </Link>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to={`/quiz/${course.slug}`}
                    onClick={() => setShowCompletionModal(false)}
                    className="py-2.5 px-4 rounded-xl border border-accent/30 bg-accent/10 text-accent font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-accent/20 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" /> Take Quiz
                  </Link>

                  <button
                    onClick={() => setShowCompletionModal(false)}
                    className="py-2.5 px-4 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-xs flex items-center justify-center transition-all cursor-pointer"
                  >
                    Review Curriculum
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
