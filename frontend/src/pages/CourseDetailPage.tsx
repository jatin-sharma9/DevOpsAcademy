import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, Users, Clock, BookOpen, Play, CheckCircle2, Lock,
  ChevronDown, ArrowLeft, Award, Zap
} from "lucide-react";
import { getCourseBySlug } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { sendEmailNotification } from "@/services/emailService";
import { cn, getLevelBadge } from "@/lib/utils";
import { toast } from "sonner";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const course = getCourseBySlug(slug || "");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set([course?.sections[0]?.id || ""]));

  if (!course) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Course not found</h2>
      <Link to="/courses" className="text-primary hover:underline flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Back to courses</Link>
    </div>
  );

  const isEnrolled = user?.enrolledCourses?.includes(course.slug);
  const isCompleted = user?.completedCourses?.includes(course.slug);
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  const handleEnroll = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    const enrolled = [...(user?.enrolledCourses || [])];
    if (!enrolled.includes(course.slug)) {
      updateUser({ enrolledCourses: [...enrolled, course.slug] });

      // Trigger Email Notification to Admin
      sendEmailNotification("course_enrollment", `🎓 Course Enrollment: ${course.title}`, {
        fullName: user?.username || "Student",
        email: user?.email || "N/A",
        courseName: course.title,
        dateTime: new Date().toLocaleString(),
      });

      toast.success("You're enrolled! Let's start learning.");
      navigate(`/learn/${course.slug}`);
    } else {
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

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className={`bg-gradient-to-br ${course.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Courses
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className={cn("px-2.5 py-0.5 text-[11px] font-semibold rounded-full border capitalize", getLevelBadge(course.level))}>{course.level}</span>
                <span className="text-white/60 text-xs font-mono">{course.category}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">{course.title}</h1>
              <p className="text-white/80 max-w-2xl">{course.shortDescription}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="font-semibold text-white">{course.rating}</span> ({course.totalRatings.toLocaleString()} ratings)</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.totalStudents.toLocaleString()} students</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.durationHours} hours</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{totalLessons} lessons</span>
              </div>
              <p className="text-white/60 text-sm">Created by <span className="text-white font-medium">{course.instructor}</span> · {course.instructorTitle}</p>
              <p className="text-white/50 text-xs">Last updated: {course.updatedAt}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <h2 className="text-xl font-display font-bold mb-5 flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> What You'll Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.whatYouLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />{item}
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-xl font-display font-bold mb-5">Course Curriculum</h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span>{course.sections.length} sections</span>
                <span>•</span>
                <span>{totalLessons} lessons</span>
                <span>•</span>
                <span>{course.durationHours}h total</span>
              </div>
              <div className="space-y-2">
                {course.sections.map((section) => (
                  <div key={section.id} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3 text-sm font-semibold text-left">{section.title}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                        <span>{section.lessons.length} lessons</span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", openSections.has(section.id) && "rotate-180")} />
                      </div>
                    </button>
                    {openSections.has(section.id) && (
                      <div className="divide-y divide-border">
                        {section.lessons.map((lesson) => (
                          <div key={lesson.id} className="lesson-sidebar-item px-4 py-3">
                            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                              lesson.type === "quiz" ? "bg-accent/15 text-accent" :
                              lesson.type === "lab" ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary")}>
                              {lesson.type === "quiz" ? <Zap className="w-3.5 h-3.5" /> :
                               lesson.type === "lab" ? <BookOpen className="w-3.5 h-3.5" /> :
                               <Play className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{lesson.title}</p>
                              <p className="text-xs text-muted-foreground capitalize">{lesson.type} · {lesson.duration} min</p>
                            </div>
                            {lesson.preview && !isEnrolled ? (
                              <span className="text-[10px] font-medium text-primary border border-primary/30 px-1.5 py-0.5 rounded">Preview</span>
                            ) : !isEnrolled && (
                              <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-xl font-display font-bold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />{req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar – Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border border-border bg-card shadow-xl space-y-5">
                <div className="text-4xl mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  {course.icon}
                </div>
                <div className="text-center">
                  {course.price === 0 ? (
                    <div className="text-3xl font-bold text-green-400">FREE</div>
                  ) : (
                    <div className="text-3xl font-bold">₹{course.price.toLocaleString()}</div>
                  )}
                </div>
                {isCompleted ? (
                  <div className="space-y-2">
                    <Link to={`/certificate/${course.slug}`} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500 text-black font-semibold text-sm hover:bg-yellow-400 transition-all">
                      <Award className="w-4 h-4" /> View Certificate
                    </Link>
                    <button onClick={handleEnroll} className="w-full py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                      Review Course
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button onClick={handleEnroll} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:scale-105">
                      <Play className="w-4 h-4" />
                      {isEnrolled ? "Continue Learning" : course.price === 0 ? "Enroll Free" : "Enroll Now"}
                    </button>
                    <Link
                      to={`/learn/${course.slug}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/30 text-primary font-medium text-sm hover:bg-primary/10 transition-colors"
                    >
                      <Play className="w-4 h-4" /> Watch Lesson 1 Tutorial
                    </Link>
                  </div>
                )}
                <div className="space-y-3 pt-1">
                  {[
                    { icon: Clock, label: `${course.durationHours} hours of content` },
                    { icon: BookOpen, label: `${totalLessons} lessons` },
                    { icon: Award, label: "Certificate of completion" },
                    { icon: Zap, label: "Quizzes and assessments" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Icon className="w-4 h-4 shrink-0 text-primary" />{label}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
