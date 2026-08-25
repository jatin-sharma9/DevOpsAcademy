import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Users, Lock, Play } from "lucide-react";
import { Course } from "@/data/courses";
import { cn, getLevelBadge } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  index?: number;
  enrolled?: boolean;
  progress?: number;
}

export default function CourseCard({ course, index = 0, enrolled = false, progress = 0 }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-hover group"
    >
      <Link to={`/courses/${course.slug}`} className="block h-full">
        <div className="h-full bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          {/* Thumbnail */}
          <div className={cn("relative h-44 bg-gradient-to-br flex items-center justify-center", course.color)}>
            <div className="text-white/20 text-7xl">{course.icon}</div>
            <div className="absolute inset-0 bg-black/20" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              <span className={cn("px-2 py-0.5 text-[11px] font-semibold rounded-full border capitalize", getLevelBadge(course.level))}>
                {course.level}
              </span>
              {course.isPro ? (
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border badge-pro">Pro</span>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full border badge-free">Free</span>
              )}
            </div>

            {/* Play button on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>

            {/* Enrolled badge */}
            {enrolled && (
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-semibold">
                Enrolled
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col gap-3">
            <div>
              <p className="text-[11px] font-mono text-primary mb-1 uppercase tracking-wider">{course.category}</p>
              <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{course.shortDescription}</p>
            </div>

            {/* Progress bar (if enrolled) */}
            {enrolled && (
              <div>
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span className="text-primary font-medium">{progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="progress-fill h-full rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-foreground">{course.rating}</span>
                <span>({course.totalRatings.toLocaleString()})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {course.totalStudents.toLocaleString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.durationHours}h
              </span>
            </div>

            {/* Instructor + Price */}
            <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                by <span className="text-foreground font-medium">{course.instructor}</span>
              </p>
              <div className="text-right">
                {course.price === 0 ? (
                  <span className="text-sm font-bold text-green-400">FREE</span>
                ) : (
                  <span className="text-sm font-bold">₹{course.price.toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
