import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Play, Zap, Terminal, ArrowRight, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LessonViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const fetchLessonData = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const courseRes = await apiService.courses.getBySlug(slug);
      if (courseRes.success && courseRes.data) {
        const mapped = mapBackendCourseToFrontend(courseRes.data);
        setCourse(mapped);
        
        // Load lessons
        const progressRes = await apiService.enrollments.getCourseProgress(Number(mapped.id));
        if (progressRes.success && progressRes.data) {
          const completedIds = new Set<number>(progressRes.data.completedLessons || []);
          setCompletedLessons(completedIds);
          
          // Determine initial active lesson (first uncompleted or first lesson)
          const allL = mapped.sections.flatMap((s: any) => s.lessons);
          if (allL.length > 0) {
            const firstUncompleted = allL.find((l: any) => !completedIds.has(Number(l.id)));
            setActiveLesson(firstUncompleted || allL[0]);
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
    fetchLessonData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Loading course environment...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Course not found</h2>
          <Link to="/courses" className="text-primary hover:underline">Back to courses</Link>
        </div>
      </div>
    );
  }

  const allLessons = course.sections.flatMap((s: any) => s.lessons);
  const totalLessons = allLessons.length;
  const completedCount = completedLessons.size;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    try {
      const lessonId = Number(activeLesson.id);
      const res = await apiService.enrollments.markComplete(Number(course.id), lessonId);
      
      if (res.success) {
        setCompletedLessons(prev => new Set([...prev, lessonId]));
        toast.success("Lesson completed!");
        
        // Find next lesson
        const currentIdx = allLessons.findIndex((l: any) => Number(l.id) === lessonId);
        if (currentIdx < allLessons.length - 1) {
          setActiveLesson(allLessons[currentIdx + 1]);
          setVideoError(false);
        } else {
          toast.success("🎉 Course completed! Certificate earned.");
          navigate(`/certificate/${course.slug}`);
        }
      }
    } catch (err) {
      console.error("Mark lesson complete error:", err);
      toast.error("Failed to mark lesson complete");
    }
  };

  const isDone = activeLesson ? completedLessons.has(Number(activeLesson.id)) : false;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-80 xl:w-96 flex-col border-r border-border bg-card overflow-hidden shrink-0">
        {/* Course Info */}
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold text-sm line-clamp-2 mb-3">{course.title}</h2>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>{completedCount}/{totalLessons} lessons</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="progress-fill h-full rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Lessons List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {course.sections.map((section: any) => (
            <div key={section.id}>
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{section.title}</p>
              {section.lessons.map((lesson: any) => {
                const done = completedLessons.has(Number(lesson.id));
                const active = activeLesson?.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLesson(lesson);
                      setVideoError(false);
                    }}
                    className={cn("lesson-sidebar-item w-full text-left cursor-pointer", active && "active")}
                  >
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      done ? "border-secondary bg-secondary" : active ? "border-primary" : "border-border")}>
                      {done && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs font-medium truncate", active ? "text-primary font-bold" : "")}>{lesson.title}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{lesson.type} · {lesson.duration}m</p>
                    </div>
                    {lesson.type === "quiz" && <Zap className="w-3 h-3 text-accent shrink-0" />}
                    {lesson.type === "lab" && <Terminal className="w-3 h-3 text-secondary shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video / Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          {activeLesson?.youtubeUrl ? (
            <div className="relative w-full aspect-video bg-black shadow-2xl">
              {videoError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card border border-border p-6 text-center space-y-3">
                  <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base">Video Unavailable for Embedding</h3>
                    <p className="text-muted-foreground text-xs max-w-md mt-1">
                      This YouTube video cannot be rendered in an iframe due to provider restrictions.
                    </p>
                  </div>
                  <a
                    href={activeLesson.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5"
                  >
                    Watch Directly on YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <iframe
                  src={`${activeLesson.youtubeUrl.replace("watch?v=", "embed/")}?autoplay=1&rel=0`}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onError={() => {
                    console.error(`[Video Load Error] Invalid or un-embeddable YouTube URL for lesson: "${activeLesson.title}" (${activeLesson.youtubeUrl})`);
                    setVideoError(true);
                  }}
                  className="w-full h-full border-0"
                />
              )}
            </div>
          ) : (
            <div className={`relative h-64 md:h-80 bg-gradient-to-br ${course.color || 'from-primary to-accent'} flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 mx-auto cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-white fill-white" />
                </div>
                <p className="text-white font-medium">{activeLesson?.title}</p>
                <p className="text-white/60 text-sm capitalize">{activeLesson?.type} · {activeLesson?.duration} minutes</p>
              </div>
            </div>
          )}

          {/* Lesson Content */}
          <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1 uppercase tracking-wider">{course.title}</p>
                <h1 className="text-2xl font-display font-bold">{activeLesson?.title}</h1>
              </div>
              <button
                onClick={handleMarkComplete}
                disabled={isDone}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ml-4 cursor-pointer",
                  isDone ? "bg-secondary/20 text-secondary cursor-default" : "bg-primary text-primary-foreground hover:bg-primary/90")}
              >
                {isDone ? <><CheckCircle2 className="w-4 h-4" /> Completed</> : <>Mark Complete <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>

            {/* Lesson Body */}
            <div className="prose prose-invert max-w-none">
              {activeLesson?.type === "quiz" ? (
                <div className="p-6 rounded-2xl border border-accent/30 bg-accent/5 text-center">
                  <Zap className="w-10 h-10 text-accent mx-auto mb-3" />
                  <h3 className="font-display font-bold text-lg mb-2">Ready for the Quiz?</h3>
                  <p className="text-muted-foreground text-sm mb-4">Test your knowledge with scenario-based questions.</p>
                  <Link to={`/quiz/${course.slug}`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-all cursor-pointer">
                    Start Quiz <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : activeLesson?.type === "lab" ? (
                <div className="p-6 rounded-2xl border border-secondary/30 bg-secondary/5">
                  <div className="flex items-center gap-3 mb-4"><Terminal className="w-6 h-6 text-secondary" /><h3 className="font-display font-bold">Hands-on Lab</h3></div>
                  <div className="font-mono text-sm text-secondary/90 bg-black/30 rounded-xl p-4 space-y-1.5">
                    <p><span className="text-muted-foreground">$</span> # Lab: {activeLesson.title}</p>
                    <p><span className="text-muted-foreground">$</span> # Follow the step-by-step instructions below</p>
                    <p><span className="text-muted-foreground">$</span> echo "Starting lab environment..."</p>
                    <p className="text-green-400">Lab environment ready ✓</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>{activeLesson?.content || `In this lesson, you'll learn about ${activeLesson?.title}. Follow along with the video above and take notes on key concepts. After completing this lesson, you'll have a solid understanding of the topic and be ready to apply it in real-world scenarios.`}</p>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="font-medium text-foreground text-sm mb-2">💡 Key Takeaways</p>
                    <ul className="space-y-1.5 text-sm">
                      <li>• Understand the core concepts covered in this lesson</li>
                      <li>• Practice the commands and techniques shown</li>
                      <li>• Review the additional resources provided below</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
