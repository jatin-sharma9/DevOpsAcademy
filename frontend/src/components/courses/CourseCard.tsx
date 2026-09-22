import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Users, Play, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Course } from "@/data/courses";
import { cn, getLevelBadge } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  index?: number;
  enrolled?: boolean;
  progress?: number;
}

export default function CourseCard({ course, index = 0, enrolled = false, progress = 0 }: CourseCardProps) {
  const targetSlug = course.slug || course.id;

  return (
    <Link
      to={`/courses/${targetSlug}`}
      className="block h-full group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl transition-transform"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        className="h-full select-none"
      >
        <div className="h-full bg-card border border-border group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10 rounded-2xl overflow-hidden flex flex-col transition-all duration-300">
          
          {/* Thumbnail Header */}
          <div className={cn("relative h-44 bg-gradient-to-br flex items-center justify-center overflow-hidden", course.color || "from-primary to-accent")}>
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-40 mix-blend-overlay"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}

            {/* Large decorative icon */}
            <div className="text-white/25 text-7xl group-hover:scale-110 group-hover:text-white/35 transition-all duration-300 relative z-10">
              {course.icon}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5 z-20">
              <span className={cn("px-2.5 py-0.5 text-[11px] font-semibold rounded-full border capitalize backdrop-blur-md", getLevelBadge(course.level))}>
                {course.level}
              </span>
              {course.isPro ? (
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border badge-pro backdrop-blur-md">Pro</span>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border badge-free backdrop-blur-md">Free</span>
              )}
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full border border-primary/40 bg-black/60 text-white backdrop-blur-md shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-accent" /> 11 Pillars
              </span>
            </div>

            {/* Play button overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <div className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 transform group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-primary-foreground ml-0.5" />
              </div>
            </div>

            {/* Enrolled badge */}
            {enrolled && (
              <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-semibold backdrop-blur-md z-20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Enrolled
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-mono text-primary font-bold uppercase tracking-wider">{course.category}</p>
                <span className="text-[11px] text-muted-foreground font-medium">{course.totalLessons || 12} lessons</span>
              </div>

              <h3 className="font-display font-bold text-sm sm:text-base leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {course.title}
              </h3>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{course.shortDescription}</p>
            </div>

            {/* Progress bar (if enrolled) */}
            {enrolled && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Progress</span>
                  <span className="text-primary font-bold">{progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="progress-fill h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Stats Bar */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-foreground">{course.rating}</span>
                  <span className="text-[10px]">({course.totalRatings ? course.totalRatings.toLocaleString() : "2.4k"})</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{course.durationHours}h</span>
                </div>

                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{course.totalStudents ? `${(course.totalStudents / 1000).toFixed(1)}k` : "15k"}</span>
                </div>
              </div>

              {/* Instructor + Price / Action Row */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                  by <span className="text-foreground font-medium">{course.instructor}</span>
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                  <span>{course.price === 0 ? "Free Enrollment" : `₹${course.price.toLocaleString()}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
