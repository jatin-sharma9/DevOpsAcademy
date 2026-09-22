import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Layers, Code2, Terminal, Rocket, HelpCircle,
  AlertTriangle, ShieldCheck, Globe, Zap, Search, Copy, Check,
  ChevronDown, ChevronRight, Play, ArrowRight, ExternalLink,
  CheckCircle2, RefreshCw, Sparkles, Award, FileText, CheckSquare,
  Flame, Cpu, Server, Lock, Filter, Shield, Compass, Star
} from "lucide-react";
import { Course } from "@/data/courses";
import { CourseLearningGuide, getCourseLearningGuide } from "@/data/learningGuides";
import CourseLearningGuideView from "./CourseLearningGuideView";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface StandardCourseLearningTemplateProps {
  course: Course | any;
  isEnrolled?: boolean;
  onEnrollOrStart?: () => void;
  className?: string;
}

export default function StandardCourseLearningTemplate({
  course,
  isEnrolled = false,
  onEnrollOrStart,
  className = ""
}: StandardCourseLearningTemplateProps) {
  const guide = useMemo(() => {
    return getCourseLearningGuide(course?.slug || course?.id || "");
  }, [course]);

  const [copiedAllCommands, setCopiedAllCommands] = useState(false);

  // Total lessons, duration, and labs count
  const totalLessons = course.sections?.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0) || course.totalLessons || 0;
  const totalLabs = guide?.practicalLabs?.length || 2;
  const totalProjects = guide?.capstoneProjects?.length || 1;
  const totalQuestions = guide?.interviewQuestions?.length || 5;

  const handleCopyAllCommands = () => {
    if (!guide) return;
    const allCmdsText = guide.commandCheatSheet
      .map((cat: any) => `### ${cat.category}\n` + cat.commands.map((c: any) => `# ${c.desc}\n${c.cmd}\n`).join("\n"))
      .join("\n\n");

    navigator.clipboard.writeText(allCmdsText);
    setCopiedAllCommands(true);
    toast.success("All production commands copied as Markdown!");
    setTimeout(() => setCopiedAllCommands(false), 2500);
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* ─── STANDARD LEARNING FRAMEWORK BANNER ─── */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>DevOps Academy Standard Learning Framework · Verified 2026</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
              {course.title} Standard Learning Guide
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every course at DevOps Academy is engineered with our comprehensive 11-pillar learning framework: bridging deep theoretical models, ASCII system architectures, categorized CLI cheat sheets, practical terminal labs, outage runbooks, and staff interview Q&A.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-mono text-foreground flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" /> {totalLessons} Modules
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-mono text-foreground flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-secondary" /> {totalLabs} Hands-on Labs
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-mono text-foreground flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-accent" /> {totalProjects} Capstone Project
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-mono text-foreground flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-green-400" /> {totalQuestions} Staff Interview Q&As
              </span>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={onEnrollOrStart}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-primary-foreground" />
              <span>{isEnrolled ? "Launch Learning Studio" : "Enroll & Start Learning"}</span>
            </button>

            {guide && (
              <button
                onClick={handleCopyAllCommands}
                className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedAllCommands ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                <span>{copiedAllCommands ? "Commands Copied!" : "Export CLI Cheat Sheet"}</span>
              </button>
            )}

            <Link
              to={`/quiz/${course.slug}`}
              className="px-4 py-2.5 rounded-xl border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-center"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Course Assessment Quiz</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 11-PILLAR INTERACTIVE GUIDE VIEW ─── */}
      {guide ? (
        <CourseLearningGuideView
          guide={guide}
          course={course}
          isEnrolled={isEnrolled}
          onEnrollOrStart={onEnrollOrStart}
        />
      ) : (
        <div className="p-12 rounded-3xl border border-border bg-card text-center space-y-4">
          <Sparkles className="w-10 h-10 text-primary mx-auto animate-pulse" />
          <h3 className="text-xl font-bold font-display">Standard Learning Template Ready</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            All modules for {course.title} are equipped with the 5-pillar study curriculum. Launch the Learning Studio to explore the theory, commands, and labs.
          </p>
          <button
            onClick={onEnrollOrStart}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-primary-foreground" /> Open Course Curriculum
          </button>
        </div>
      )}
    </div>
  );
}
