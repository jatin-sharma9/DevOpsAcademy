import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Users, Clock, BookOpen, Play, CheckCircle2, Lock,
  ChevronDown, ChevronUp, ArrowLeft, ArrowRight, Award, Zap, Loader2,
  Share2, Bookmark, Check, Copy, ExternalLink, ShieldCheck,
  Layers, Terminal, HelpCircle, MessageSquare, Monitor, FileText, Sparkles,
  CheckCircle, Globe, Flame, Calendar, Cpu, Compass
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn, getLevelBadge } from "@/lib/utils";
import { toast } from "sonner";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { COURSES, Course } from "@/data/courses";
import { lmsStore } from "@/services/lmsStore";
import CourseCard from "@/components/courses/CourseCard";
import StandardCourseLearningTemplate from "@/components/learning/StandardCourseLearningTemplate";
import CourseLearningGuideView from "@/components/learning/CourseLearningGuideView";
import { getCourseLearningGuide } from "@/data/learningGuides";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | any | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentDetails, setEnrollmentDetails] = useState<{
    isEnrolled: boolean;
    progress: number;
  } | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"guide" | "curriculum" | "overview" | "labs" | "reviews" | "faq">("guide");
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Load Course and Enrollment Status
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDetails = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        // Try local static dataset first for instantaneous load, then sync backend
        const staticCourse = COURSES.find(c => c.slug === slug || c.id === slug);
        if (staticCourse) {
          setCourse(staticCourse);
          if (staticCourse.sections && staticCourse.sections.length > 0) {
            // Open first section by default
            setOpenSections(new Set([staticCourse.sections[0].id]));
          }
        }

        const res = await apiService.courses.getBySlug(slug);
        if (res.success && res.data) {
          const mapped = mapBackendCourseToFrontend(res.data);
          setCourse(mapped);
          
          if (mapped.sections && mapped.sections.length > 0 && !staticCourse) {
            setOpenSections(new Set([mapped.sections[0].id]));
          }

          // If authenticated, get course progress/enrollment status
          if (isAuthenticated) {
            try {
              const progressRes = await apiService.enrollments.getCourseProgress(res.data.id);
              if (progressRes.success && progressRes.data) {
                setEnrollmentDetails({
                  isEnrolled: progressRes.data.isEnrolled,
                  progress: progressRes.data.progress
                });
              }
            } catch (err) {
              console.error("Error fetching enrollment progress:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error loading course from API, using fallback:", err);
        const staticCourse = COURSES.find(c => c.slug === slug || c.id === slug);
        if (staticCourse) {
          setCourse(staticCourse);
          if (staticCourse.sections && staticCourse.sections.length > 0) {
            setOpenSections(new Set([staticCourse.sections[0].id]));
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [slug, isAuthenticated]);

  if (loading && !course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-mono">Loading course curriculum & overview...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center text-2xl font-bold">
          !
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display">Course Not Found</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-md">
            The course "{slug}" does not exist or may have been moved.
          </p>
        </div>
        <Link to="/courses" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Explore All Courses
        </Link>
      </div>
    );
  }

  const localProg = lmsStore.getCourseProgress(course.slug || slug || "");
  const isEnrolled = enrollmentDetails?.isEnrolled || !!localProg || false;
  const progressPercent = localProg?.progress || enrollmentDetails?.progress || 0;
  const isCompleted = isEnrolled && progressPercent === 100;
  
  const totalLessons = course.sections?.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0) || course.totalLessons || 0;
  const totalSections = course.sections?.length || 1;
  const totalQuizzes = course.sections?.reduce((acc: number, s: any) => acc + (s.lessons?.filter((l: any) => l.type === "quiz").length || 0), 0) || 1;
  const totalLabs = course.sections?.reduce((acc: number, s: any) => acc + (s.lessons?.filter((l: any) => l.type === "lab").length || 0), 0) || 1;
  const durationDisplay = course.durationHours ? `${course.durationHours} Hours` : "14 Hours";

  // Learning Guide for comprehensive 11 pillars
  const guide = getCourseLearningGuide(course.slug || slug || "");

  // First video lesson for quick preview
  const firstVideoLesson = course.sections?.flatMap((s: any) => s.lessons || []).find((l: any) => l.youtubeUrl || l.preview);

  const handleEnrollOrContinue = async () => {
    try {
      lmsStore.enroll(course.id, course.slug);
      if (isAuthenticated) {
        try {
          await apiService.enrollments.enroll(Number(course.id));
        } catch {
          // offline local fallback
        }
      }
      
      const allLessons = course.sections?.flatMap((s: any) => s.lessons || []) || [];
      const progressData = lmsStore.getCourseProgress(course.slug);
      const completedSet = new Set(progressData?.completedLessons || []);
      const nextLesson = allLessons.find((l: any) => !completedSet.has(String(l.id))) || allLessons[0];
      const targetUrl = nextLesson ? `/learn/${course.slug}?lesson=${nextLesson.id}` : `/learn/${course.slug}`;

      toast.success(isEnrolled ? "Resuming course!" : `Successfully enrolled in ${course.title}!`);
      navigate(targetUrl);
    } catch (error: any) {
      console.error("Enroll error:", error);
      navigate(`/learn/${course.slug}`);
    }
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllSections = () => {
    if (openSections.size === (course.sections?.length || 0)) {
      setOpenSections(new Set());
    } else {
      setOpenSections(new Set(course.sections.map((s: any) => s.id)));
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("Course URL copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Related courses (excluding current)
  const relatedCourses = COURSES.filter(c => c.slug !== course.slug).slice(0, 3);

  // Dynamic FAQs based on course
  const courseFaqs = [
    {
      q: `What are the prerequisites for ${course.title}?`,
      a: course.requirements?.length > 0 
        ? `You will need: ${course.requirements.join(", ")}. No prior paid software is required; everything used is open-source or includes a free tier.`
        : "Basic computer familiarity and a web browser. All tools used in this course are free and open source."
    },
    {
      q: "Is there a certificate provided upon completion?",
      a: "Yes! Once you complete all module lessons, labs, and the assessment quiz with a passing score, you will receive a verifiable digital Certificate of Completion with a unique verification hash."
    },
    {
      q: "How do the hands-on labs and terminal exercises work?",
      a: "Each module includes practical hands-on exercises and terminal commands. You can follow along on your local machine, cloud VM, or within our interactive classroom terminal workspace."
    },
    {
      q: "How long will I have access to the course content?",
      a: "You have unlimited lifetime access to the curriculum, including future updates, notes, and quiz revisions at no additional cost."
    },
    {
      q: "Can this course help me prepare for DevOps job interviews?",
      a: "Absolutely! The curriculum includes dedicated real-world production scenarios, architecture diagrams, interview questions, and troubleshooting commands frequently asked by top tech recruiters."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 lg:pb-20">
      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/40">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Course Video Preview · {course.title}</span>
                </div>
                <button
                  onClick={() => setPreviewVideoUrl(null)}
                  className="px-3 py-1 text-xs rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
                >
                  Close ✕
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={previewVideoUrl}
                  title="Course Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Breadcrumbs Bar */}
      <div className="border-b border-border/50 bg-card/40 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-foreground transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-primary font-medium">{course.category}</span>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[180px] sm:max-w-sm">{course.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-medium transition-colors"
              title="Share Course"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner with Course Overview & Duration Badges */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${course.color || "from-primary/20 via-card to-background"} border-b border-border/60`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        
        {/* Decorative ambient grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            
            {/* Left Content (2 cols) */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={cn("px-3 py-1 text-xs font-semibold rounded-full border capitalize", getLevelBadge(course.level))}>
                  {course.level} Level
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white border border-white/15">
                  {course.category} Track
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary-foreground border border-primary/30 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {durationDisplay} Duration
                </span>
                {course.price === 0 && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                    100% Free Access
                  </span>
                )}
                {isCompleted && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight tracking-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl">
                {course.shortDescription || course.description}
              </p>

              {/* Prominent Quick Stats & Duration Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>Duration</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">{durationDisplay}</div>
                  <div className="text-[11px] text-white/50">Self-Paced</div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span>Curriculum</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">{totalLessons} Modules</div>
                  <div className="text-[11px] text-white/50">{totalSections} Core Sections</div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>Rating</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">{course.rating || 4.9} / 5.0</div>
                  <div className="text-[11px] text-white/50">{(course.totalRatings || 2800).toLocaleString()} reviews</div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
                    <Award className="w-3.5 h-3.5 text-green-400" />
                    <span>Certificate</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">Included</div>
                  <div className="text-[11px] text-white/50">Verifiable Credential</div>
                </div>
              </div>

              {/* Hero Action Buttons: Enroll & Video Preview */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={handleEnrollOrContinue}
                  className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-primary-foreground group-hover:scale-110 transition-transform" />
                  {isEnrolled ? (isCompleted ? "Review Course" : `Continue Learning (${progressPercent}%)`) : "Enroll in Course — Start Free"}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("guide");
                    const el = document.getElementById("course-tabs-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 text-white font-semibold text-sm border border-primary/40 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                  <span>Complete Learning Guide</span>
                </button>

                {firstVideoLesson?.youtubeUrl && (
                  <button
                    onClick={() => setPreviewVideoUrl(firstVideoLesson.youtubeUrl)}
                    className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-primary fill-primary" />
                    <span>Watch Preview</span>
                  </button>
                )}
              </div>

              {/* Instructor snippet */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 text-xs sm:text-sm text-white/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/30 border border-primary/50 text-white font-bold flex items-center justify-center text-xs">
                    {course.instructor?.charAt(0) || "J"}
                  </div>
                  <div>
                    <span className="text-white font-semibold">{course.instructor || "Jatin Sharma"}</span>
                    <span className="text-white/60 text-xs ml-2">({course.instructorTitle || "Senior DevOps Engineer"})</span>
                  </div>
                </div>
                <div className="hidden sm:block text-white/30">•</div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{(course.totalStudents || 15000).toLocaleString()} learners enrolled</span>
                </div>
                <div className="hidden sm:block text-white/30">•</div>
                <div className="flex items-center gap-1.5 text-white/60">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span>Verified Curriculum (2026 Edition)</span>
                </div>
              </div>
            </div>

            {/* Quick Hero Floating Preview Card (Desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-md p-6 text-white space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">Course Enrollment</span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-green-500/20 text-green-300 font-semibold border border-green-500/30">
                    {course.price === 0 ? "100% FREE" : `₹${course.price.toLocaleString()}`}
                  </span>
                </div>

                {firstVideoLesson?.youtubeUrl ? (
                  <button
                    onClick={() => setPreviewVideoUrl(firstVideoLesson.youtubeUrl)}
                    className="w-full relative group aspect-video rounded-xl overflow-hidden border border-white/20 bg-muted/20 flex items-center justify-center cursor-pointer"
                  >
                    <img 
                      src={course.thumbnail || "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=600"} 
                      alt={course.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                    <div className="relative w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-primary-foreground" />
                    </div>
                    <span className="absolute bottom-2 left-2 text-[11px] font-medium bg-black/80 px-2.5 py-1 rounded text-white/90">
                      Preview Course Video
                    </span>
                  </button>
                ) : (
                  <div className="aspect-video rounded-xl border border-white/10 bg-primary/10 flex items-center justify-center text-primary">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}

                {/* Main Action Button */}
                <div className="space-y-2">
                  <button
                    onClick={handleEnrollOrContinue}
                    className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Play className="w-4 h-4 group-hover:translate-x-0.5 transition-transform fill-primary-foreground" />
                    {isEnrolled ? (isCompleted ? "Review Completed Course" : "Continue Learning Now") : "Enroll in Course Now"}
                  </button>
                  <p className="text-center text-[11px] text-white/60">
                    Instant full access · Includes all {totalLessons} modules & labs
                  </p>
                </div>

                {/* Key Course Specs */}
                <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs text-white/80">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-white/60"><Clock className="w-3.5 h-3.5 text-accent" /> Total Duration:</span>
                    <span className="font-semibold text-white">{durationDisplay}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-white/60"><BookOpen className="w-3.5 h-3.5 text-primary" /> Total Modules:</span>
                    <span className="font-semibold text-white">{totalLessons} Modules</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-white/60"><Terminal className="w-3.5 h-3.5 text-secondary" /> Hands-on Labs:</span>
                    <span className="font-semibold text-white">Included</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-white/60"><Award className="w-3.5 h-3.5 text-green-400" /> Certificate:</span>
                    <span className="font-semibold text-white">Yes, upon completion</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Nav Tabs */}
            <div id="course-tabs-section" className="flex border-b border-border overflow-x-auto scrollbar-hide gap-2">
              {[
                { id: "guide", label: "Standard Learning Template", icon: Sparkles, badge: "11 Pillars" },
                { id: "curriculum", label: "Modules & Curriculum", icon: BookOpen, count: totalLessons },
                { id: "overview", label: "Course Overview", icon: Compass },
                { id: "labs", label: "Hands-on Labs", icon: Terminal, count: totalLabs },
                { id: "reviews", label: "Student Reviews", icon: Star },
                { id: "faq", label: "FAQs", icon: HelpCircle },
              ].map((tab: any) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer",
                      isActive
                        ? "border-primary text-primary bg-primary/5 rounded-t-lg shadow-sm"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", tab.id === "guide" && "text-accent animate-pulse")} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-sm">
                        {tab.badge}
                      </span>
                    )}
                    {tab.count !== undefined && (
                      <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-mono", isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB 0: STANDARD LEARNING TEMPLATE & GUIDE */}
            {activeTab === "guide" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <StandardCourseLearningTemplate
                  course={course}
                  isEnrolled={isEnrolled}
                  onEnrollOrStart={handleEnrollOrContinue}
                />
              </motion.div>
            )}

            {/* TAB 1: MODULES & CURRICULUM */}
            {activeTab === "curriculum" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Curriculum Header & Duration Bar */}
                <div className="p-5 rounded-2xl border border-border bg-card/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-display font-bold">Course Modules & Breakdown</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {totalSections} sections · {totalLessons} modules · {durationDisplay} total comprehensive learning
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <button
                      onClick={toggleAllSections}
                      className="text-xs font-semibold text-primary hover:underline px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      {openSections.size === (course.sections?.length || 0) ? "Collapse All Sections" : "Expand All Sections"}
                    </button>
                  </div>
                </div>

                {/* Accordion List of Sections & Modules */}
                <div className="space-y-4">
                  {course.sections?.map((section: any, sIdx: number) => {
                    const isOpen = openSections.has(section.id);
                    const sectionLessons = section.lessons || [];
                    const sectionDuration = sectionLessons.reduce((a: number, l: any) => a + (l.duration || 0), 0);

                    return (
                      <div key={section.id || sIdx} className="border border-border rounded-xl bg-card overflow-hidden shadow-sm transition-all hover:border-border/80">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 bg-muted/30 hover:bg-muted/50 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="w-8 h-8 rounded-xl bg-primary/15 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-primary/20">
                              0{sIdx + 1}
                            </span>
                            <div>
                              <h3 className="text-sm sm:text-base font-semibold text-foreground">{section.title}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                                <span>{sectionLessons.length} Modules</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {sectionDuration > 0 ? `${sectionDuration} mins` : "In-depth"}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <span className="text-xs hidden sm:inline-block font-medium">
                              {isOpen ? "Hide" : "Show"}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="divide-y divide-border/60 bg-card/60">
                            {sectionLessons.map((lesson: any, lIdx: number) => {
                              const isExp = expandedLessonId === (lesson.id || String(lIdx));
                              return (
                                <div key={lesson.id || lIdx} className="divide-y divide-border/30">
                                  <div
                                    className="flex items-center justify-between p-4 sm:px-6 hover:bg-muted/20 transition-colors gap-3 cursor-pointer"
                                    onClick={() => setExpandedLessonId(isExp ? null : (lesson.id || String(lIdx)))}
                                  >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                      <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-mono font-bold",
                                        lesson.type === "quiz" ? "bg-accent/15 text-accent border border-accent/20" :
                                        lesson.type === "lab" ? "bg-secondary/15 text-secondary border border-secondary/20" :
                                        "bg-primary/15 text-primary border border-primary/20"
                                      )}>
                                        {lIdx + 1}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">{lesson.title}</p>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                          <span className="capitalize font-medium text-foreground/80">{lesson.type || "Theory & Hands-on"}</span>
                                          <span>•</span>
                                          <span className="flex items-center gap-1 font-mono">
                                            <Clock className="w-3 h-3 text-accent" /> {lesson.duration || 45} min
                                          </span>
                                          {lesson.youtubeUrl && (
                                            <>
                                              <span>•</span>
                                              <span className="text-primary flex items-center gap-1 font-mono text-[11px]">
                                                <Play className="w-3 h-3" /> Video Included
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={() => setExpandedLessonId(isExp ? null : (lesson.id || String(lIdx)))}
                                        className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
                                        title="Expand Module Details"
                                      >
                                        <FileText className="w-3 h-3" />
                                        <span className="hidden sm:inline">{isExp ? "Collapse" : "Read Content"}</span>
                                        <ChevronDown className={cn("w-3 h-3 transition-transform", isExp && "rotate-180")} />
                                      </button>
                                      {lesson.youtubeUrl && (
                                        <button
                                          onClick={() => setPreviewVideoUrl(lesson.youtubeUrl)}
                                          className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                          <Play className="w-3 h-3 fill-primary" /> <span className="hidden sm:inline">Preview</span>
                                        </button>
                                      )}
                                      <Link
                                        to={`/learn/${course.slug}?lesson=${lesson.id}`}
                                        className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-semibold flex items-center gap-1 transition-all"
                                        title="Start Module"
                                      >
                                        <span>Start</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </Link>
                                    </div>
                                  </div>

                                  {isExp && (
                                    <div className="p-5 sm:p-6 bg-muted/15 space-y-4 border-t border-border/40 text-xs sm:text-sm">
                                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/40">
                                        <span className="font-semibold text-foreground flex items-center gap-2">
                                          <BookOpen className="w-4 h-4 text-primary" /> Module Study Material & Curriculum Notes
                                        </span>
                                        <button
                                          onClick={() => setActiveTab("guide")}
                                          className="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                          <Sparkles className="w-3.5 h-3.5" /> View Full 11-Pillar Guide
                                        </button>
                                      </div>
                                      <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-line leading-relaxed text-xs sm:text-sm bg-card/70 p-4 rounded-xl border border-border/60 max-h-96 overflow-y-auto font-mono">
                                        {lesson.content || lesson.description || "Detailed multi-phase theory, architecture internals, production command references, and hands-on lab exercises are configured for this module."}
                                      </div>
                                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                        <div className="text-xs text-muted-foreground">
                                          Estimated completion: <span className="font-semibold text-foreground font-mono">{lesson.duration || 45} minutes</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Link
                                            to={`/learn/${course.slug}?lesson=${lesson.id}`}
                                            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-sm"
                                          >
                                            <Play className="w-3.5 h-3.5 fill-primary-foreground" />
                                            Launch in Learning Studio
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom CTA to start */}
                <div className="p-6 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-background flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-bold text-lg text-foreground">Ready to start mastering {course.title}?</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Enroll now for instant access to all {totalLessons} modules, interactive labs, and certificate.
                    </p>
                  </div>
                  <button
                    onClick={handleEnrollOrContinue}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shrink-0 shadow-md hover:shadow-primary/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-primary-foreground" />
                    {isEnrolled ? "Continue Learning" : "Enroll Now — 100% Free"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: COURSE OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                {/* Course Overview Summary */}
                <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold">Course Overview</h3>
                      <p className="text-xs text-muted-foreground">Comprehensive training designed for modern DevOps and Cloud engineers</p>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed space-y-3 pt-2">
                    <p>{course.description || course.shortDescription}</p>
                    <p>
                      This course is structured with a hands-on, enterprise-ready approach. Every module bridges core foundational theory with real-world DevOps production scenarios, live troubleshooting patterns, and standard infrastructure best practices.
                    </p>
                  </div>

                  {/* Overview Stats Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
                    <div className="p-3 rounded-xl bg-muted/40 text-center">
                      <div className="text-xs text-muted-foreground font-medium">Estimated Duration</div>
                      <div className="text-base font-bold text-foreground mt-0.5">{durationDisplay}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 text-center">
                      <div className="text-xs text-muted-foreground font-medium">Total Curriculum</div>
                      <div className="text-base font-bold text-foreground mt-0.5">{totalLessons} Modules</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 text-center">
                      <div className="text-xs text-muted-foreground font-medium">Difficulty Level</div>
                      <div className="text-base font-bold capitalize text-foreground mt-0.5">{course.level}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 text-center">
                      <div className="text-xs text-muted-foreground font-medium">Credential</div>
                      <div className="text-base font-bold text-green-400 mt-0.5">Certificate</div>
                    </div>
                  </div>
                </div>

                {/* What you'll learn */}
                <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card">
                  <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary" /> What You Will Learn & Master
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {course.whatYouLearn?.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground p-3 rounded-xl bg-muted/20 border border-border/50">
                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-foreground leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags & Technologies Covered */}
                <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Technologies & Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags?.map((tag: string) => (
                      <span key={tag} className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs font-mono text-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prerequisites & Requirements */}
                <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-4">
                  <h3 className="text-lg font-display font-bold">Prerequisites & Requirements</h3>
                  <ul className="space-y-2.5">
                    {course.requirements?.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Audience */}
                <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-3">
                  <h3 className="text-lg font-display font-bold">Who Should Take This Course?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm text-foreground">DevOps & SRE Aspirants</h4>
                      <p className="text-xs text-muted-foreground mt-1">Engineers transitioning from developer or sysadmin roles into DevOps.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm text-foreground">Cloud & Platform Engineers</h4>
                      <p className="text-xs text-muted-foreground mt-1">Practitioners wanting to build robust CI/CD, container, and infrastructure workflows.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm text-foreground">Tech Interview Candidates</h4>
                      <p className="text-xs text-muted-foreground mt-1">Engineers preparing for technical rounds with realistic scenario questions.</p>
                    </div>
                  </div>
                </div>

                {/* Enroll CTA Banner */}
                <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-base">Ready to get started?</h4>
                    <p className="text-xs text-muted-foreground">Enroll today with instant access to the entire {durationDisplay} curriculum.</p>
                  </div>
                  <button
                    onClick={handleEnrollOrContinue}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shrink-0 cursor-pointer"
                  >
                    {isEnrolled ? "Continue Course" : "Enroll Now Free"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 3: HANDS-ON LABS */}
            {activeTab === "labs" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Interactive Hands-on Labs & Terminal Exercises</h3>
                      <p className="text-xs text-muted-foreground">Real terminal walkthroughs and live configuration tasks</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In this track, theory is paired with practical execution. You'll work directly with production command lines, configuration manifests, and live debugging workflows.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Lab Environment</span>
                      <p className="text-sm font-semibold text-foreground">Local & Cloud Ready</p>
                      <p className="text-xs text-muted-foreground">Run commands in our built-in notebook or your native shell terminal.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1">
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider">Production Scenarios</span>
                      <p className="text-sm font-semibold text-foreground">Zero Downtime & Scaling</p>
                      <p className="text-xs text-muted-foreground">Solve realistic outage and configuration puzzles found in enterprise environments.</p>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={handleEnrollOrContinue}
                      className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Terminal className="w-4 h-4" /> Open Interactive Lab Workspace
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: REVIEWS */}
            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Rating Overview */}
                <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div className="text-center sm:border-r sm:border-border sm:pr-6">
                    <div className="text-5xl font-display font-bold text-primary">{course.rating || 4.9}</div>
                    <div className="flex justify-center items-center gap-1 my-2 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Course Rating · {(course.totalRatings || 2800).toLocaleString()} Reviews</p>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    {[
                      { stars: 5, pct: 92 },
                      { stars: 4, pct: 6 },
                      { stars: 3, pct: 2 },
                      { stars: 2, pct: 0 },
                      { stars: 1, pct: 0 },
                    ].map((row) => (
                      <div key={row.stars} className="flex items-center gap-3 text-xs">
                        <span className="w-12 font-medium">{row.stars} stars</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-muted-foreground font-mono">{row.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {[
                    {
                      name: "Rahul Verma",
                      role: "DevOps Engineer at Swiggy",
                      rating: 5,
                      date: "2 weeks ago",
                      comment: "One of the best structured courses on DevOps. The hands-on examples and command line explanations made complex production topics crystal clear!"
                    },
                    {
                      name: "Priya Sundaram",
                      role: "Cloud Architect at Infosys",
                      rating: 5,
                      date: "1 month ago",
                      comment: "Extremely well articulated. The real-world production incident examples helped me crack my Senior DevOps interview questions."
                    },
                    {
                      name: "Amit Patel",
                      role: "Site Reliability Engineer",
                      rating: 5,
                      date: "Last month",
                      comment: "Clean explanations, instant quiz feedback, and the downloadable certificate is a great resume booster. 10/10 recommendation!"
                    }
                  ].map((rev, i) => (
                    <div key={i} className="p-5 rounded-xl border border-border bg-card space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{rev.name}</div>
                            <div className="text-xs text-muted-foreground">{rev.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          {[...Array(rev.rating)].map((_, s) => (
                            <Star key={s} className="w-3.5 h-3.5 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{rev.comment}</p>
                      <div className="text-[11px] text-muted-foreground/60">{rev.date}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 5: FAQ */}
            {activeTab === "faq" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                {courseFaqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm hover:bg-muted/40 transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0 ml-2", isOpen && "rotate-180")} />
                      </button>
                      {isOpen && (
                        <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/10">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}

          </div>

          {/* Sticky Enrollment Sidebar (1 col) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              {/* Main Sidebar Card */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-xl space-y-6">
                
                {/* Tech Icon Header */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center text-primary text-3xl border border-border shadow-inner shrink-0">
                    {course.icon || <BookOpen className="w-7 h-7" />}
                  </div>
                  <div>
                    <div className="text-xs uppercase font-mono text-muted-foreground tracking-wider">{course.category} Track</div>
                    <div className="font-display font-bold text-lg leading-tight line-clamp-1">{course.title}</div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Tuition & Access</div>
                    <div className="text-2xl font-display font-bold text-green-400">
                      {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString()}`}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-green-500/15 text-green-400 text-xs font-semibold">
                    100% Free Access
                  </span>
                </div>

                {/* Prominent Enroll & Continue Actions */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleEnrollOrContinue}
                    className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <Play className="w-4 h-4 fill-primary-foreground group-hover:translate-x-0.5 transition-transform" />
                    {isEnrolled ? (isCompleted ? "Review Completed Course" : `Continue Course (${progressPercent}%)`) : "Enroll in Course — Free"}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("guide");
                      const el = document.getElementById("course-tabs-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full py-2.5 rounded-xl border border-primary/40 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-foreground font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    Open 11-Pillar Learning Guide
                  </button>

                  <Link
                    to={`/quiz/${course.slug}`}
                    className="w-full py-2.5 rounded-xl border border-border hover:bg-muted text-foreground font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-accent" />
                    Take Assessment Quiz
                  </Link>

                  {isCompleted && (
                    <Link
                      to={`/certificate/${course.slug}`}
                      className="w-full py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-yellow-500/30 transition-colors"
                    >
                      <Award className="w-4 h-4" />
                      View Certificate of Completion
                    </Link>
                  )}
                </div>

                {/* Course Features Checklist & Duration */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">This Course Includes:</p>
                  {[
                    { icon: Sparkles, label: "Complete 11-Pillar Learning Guide & Runbooks" },
                    { icon: Clock, label: `${durationDisplay} on-demand video & lessons` },
                    { icon: BookOpen, label: `${totalLessons} comprehensive modules` },
                    { icon: Terminal, label: "Hands-on terminal lab exercises" },
                    { icon: Zap, label: "Interactive module quizzes" },
                    { icon: Award, label: "Verifiable Certificate of Completion" },
                    { icon: ShieldCheck, label: "Full lifetime access & future updates" },
                  ].map(({ icon: Icon, label }, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Icon className="w-4 h-4 shrink-0 text-primary" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Instructor mini bio */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
                      {course.instructor?.charAt(0) || "J"}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">Instructor: {course.instructor || "Jatin Sharma"}</div>
                      <div className="text-[11px] text-muted-foreground">{course.instructorTitle || "Senior DevOps Engineer"}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Next Recommended Courses */}
        <div className="mt-16 pt-10 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold">Explore More DevOps Tracks</h2>
              <p className="text-sm text-muted-foreground">Continue building your end-to-end DevOps stack mastery</p>
            </div>
            <Link to="/courses" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View all courses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCourses.map((c, i) => (
              <CourseCard key={c.id} course={c} index={i} />
            ))}
          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Enrollment Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-3 px-4 flex items-center justify-between shadow-2xl">
        <div className="min-w-0 pr-3">
          <div className="text-xs font-semibold text-foreground truncate">{course.title}</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3 h-3 text-accent" />
            <span>{durationDisplay}</span>
            <span>•</span>
            <span>{totalLessons} Modules</span>
          </div>
        </div>
        <button
          onClick={handleEnrollOrContinue}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shrink-0 shadow-md hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-primary-foreground" />
          {isEnrolled ? "Continue" : "Enroll Free"}
        </button>
      </div>
    </div>
  );
}
