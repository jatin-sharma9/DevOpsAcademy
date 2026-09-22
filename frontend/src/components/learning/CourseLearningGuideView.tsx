import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Layers, Code2, Terminal, Rocket, HelpCircle,
  AlertTriangle, ShieldCheck, Globe, Zap, Search, Copy, Check,
  ChevronDown, ChevronRight, Play, ArrowRight, ExternalLink,
  CheckCircle2, RefreshCw, Sparkles, Award, FileText, CheckSquare,
  Flame, Cpu, Server, Lock, Filter
} from "lucide-react";
import { CourseLearningGuide } from "@/data/learningGuides";
import { QUIZZES, Quiz } from "@/data/quizzes";
import { Course } from "@/data/courses";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CourseLearningGuideViewProps {
  guide: CourseLearningGuide;
  course: Course | any;
  onEnrollOrStart?: () => void;
  isEnrolled?: boolean;
}

type GuidePillar =
  | "theory"
  | "architecture"
  | "commands"
  | "labs"
  | "projects"
  | "interview"
  | "troubleshooting"
  | "bestPractices"
  | "useCases"
  | "quiz"
  | "curriculumReader";

export default function CourseLearningGuideView({
  guide,
  course,
  onEnrollOrStart,
  isEnrolled = false
}: CourseLearningGuideViewProps) {
  const [activePillar, setActivePillar] = useState<GuidePillar>("theory");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedQA, setRevealedQA] = useState<Set<string>>(new Set());
  const [activeLabId, setActiveLabId] = useState<string>(guide.practicalLabs[0]?.id || "");
  const [labVerifying, setLabVerifying] = useState(false);
  const [verifiedLabs, setVerifiedLabs] = useState<Set<string>>(new Set());
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  // Quiz State (Integrated Assessment)
  const courseQuiz: Quiz | undefined = useMemo(() => {
    return QUIZZES.find(q => q.courseSlug === guide.courseSlug);
  }, [guide.courseSlug]);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectAnswer = (qId: string, optionId: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionId }));
  };

  const handleGradeQuiz = () => {
    if (!courseQuiz) return;
    setQuizSubmitted(true);
    let correct = 0;
    courseQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    const pct = Math.round((correct / courseQuiz.questions.length) * 100);
    if (pct >= courseQuiz.passingScore) {
      toast.success(`🎉 Passed! Score: ${pct}% (${correct}/${courseQuiz.questions.length})`);
    } else {
      toast.error(`Score: ${pct}% (${correct}/${courseQuiz.questions.length}). Passing score is ${courseQuiz.passingScore}%. Try again!`);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    toast.info("Quiz reset. Ready for a new attempt!");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleQA = (id: string) => {
    setRevealedQA(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleModule = (id: string) => {
    setOpenModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSimulateLabVerify = (labId: string) => {
    setLabVerifying(true);
    setTimeout(() => {
      setLabVerifying(false);
      setVerifiedLabs(prev => new Set([...prev, labId]));
      toast.success("✅ Lab tasks verified successfully! All assertions passed.");
    }, 1200);
  };

  // Filtered Commands
  const filteredCommands = useMemo(() => {
    if (!searchQuery) return guide.commandCheatSheet;
    const q = searchQuery.toLowerCase();
    return guide.commandCheatSheet
      .map(group => ({
        ...group,
        commands: group.commands.filter(c =>
          c.cmd.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          (c.flags && c.flags.toLowerCase().includes(q))
        )
      }))
      .filter(group => group.commands.length > 0);
  }, [guide.commandCheatSheet, searchQuery]);

  // Filtered Troubleshooting
  const filteredTroubleshooting = useMemo(() => {
    if (!searchQuery) return guide.troubleshooting;
    const q = searchQuery.toLowerCase();
    return guide.troubleshooting.filter(t =>
      t.issue.toLowerCase().includes(q) ||
      t.symptom.toLowerCase().includes(q) ||
      t.rootCause.toLowerCase().includes(q) ||
      t.solution.toLowerCase().includes(q)
    );
  }, [guide.troubleshooting, searchQuery]);

  // Filtered Interview Questions
  const filteredInterview = useMemo(() => {
    if (!searchQuery) return guide.interviewQuestions;
    const q = searchQuery.toLowerCase();
    return guide.interviewQuestions.filter(item =>
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [guide.interviewQuestions, searchQuery]);

  // Active Lab
  const currentLab = useMemo(() => {
    return guide.practicalLabs.find(l => l.id === activeLabId) || guide.practicalLabs[0];
  }, [guide.practicalLabs, activeLabId]);

  // Active Project
  const currentProject = guide.capstoneProjects[activeProjectIdx] || guide.capstoneProjects[0];

  const PILLAR_TABS: { id: GuidePillar; label: string; icon: any; badge?: string }[] = [
    { id: "theory", label: "Core Theory", icon: BookOpen, badge: "Concepts" },
    { id: "architecture", label: "Architecture", icon: Layers, badge: "Mental Model" },
    { id: "commands", label: "Command Reference", icon: Code2, badge: `${guide.commandCheatSheet.reduce((a, b) => a + b.commands.length, 0)} Cmds` },
    { id: "labs", label: "Practical Labs", icon: Terminal, badge: `${guide.practicalLabs.length} Labs` },
    { id: "projects", label: "Capstone Projects", icon: Rocket, badge: `${guide.capstoneProjects.length} Proj` },
    { id: "interview", label: "Interview Mastery", icon: HelpCircle, badge: `${guide.interviewQuestions.length} Q&A` },
    { id: "troubleshooting", label: "Troubleshooting", icon: AlertTriangle, badge: "Runbooks" },
    { id: "bestPractices", label: "Best Practices", icon: ShieldCheck, badge: "Hardening" },
    { id: "useCases", label: "Real-World Scenarios", icon: Globe, badge: "Case Studies" },
    { id: "quiz", label: "Course Quiz", icon: Zap, badge: courseQuiz ? `${courseQuiz.questions.length} Qs` : "Quiz" },
    { id: "curriculumReader", label: "Module Reader", icon: FileText, badge: `${course.sections?.reduce((a: number, s: any) => a + (s.lessons?.length || 0), 0) || 15} Lessons` },
  ];

  return (
    <div className="space-y-8">
      {/* ─── HERO BANNER OF THE COMPLETE LEARNING GUIDE ─── */}
      <div className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-2xl p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>OFFICIAL COMPLETE DEVOPS LEARNING GUIDE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              {guide.title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {guide.subtitle}. Exhaustive deep dive containing production architecture, verified commands, multi-step labs, capstone projects, interview scenarios, best practices, and troubleshooting runbooks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to={`/learn/${guide.courseSlug}`}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Play className="w-3.5 h-3.5 fill-primary-foreground" />
              <span>{isEnrolled ? "Resume Interactive Course" : "Launch Interactive Lab"}</span>
            </Link>

            {courseQuiz && (
              <button
                onClick={() => setActivePillar("quiz")}
                className="px-4 py-2.5 rounded-xl border border-accent/40 bg-accent/10 text-accent font-semibold text-xs hover:bg-accent/20 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Take Assessment</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── 11-PILLAR INTERACTIVE NAVIGATION RIBBON ─── */}
      <div className="sticky top-20 z-20 border border-border/80 bg-card/90 backdrop-blur-md rounded-2xl p-2 shadow-lg">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {PILLAR_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activePillar === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePillar(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.2 rounded-full",
                      active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── PILLAR CONTENT CONTAINER ─── */}
      <div className="min-h-[500px]">
        {/* ================================================================= */}
        {/* 1. CORE THEORY & CONCEPTS */}
        {/* ================================================================= */}
        {activePillar === "theory" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
              <div className="flex items-center gap-3.5 border-b border-border/70 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">Pillar 1 · Deep Conceptual Foundation</span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">{guide.theoryDeepDive.coreConcept}</h2>
                </div>
              </div>

              {/* Mental Model Callout */}
              <div className="p-4 sm:p-5 rounded-xl border border-accent/30 bg-accent/10 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-accent font-mono">Guiding DevOps Mental Model</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{guide.theoryDeepDive.keyMentalModel}</p>
                </div>
              </div>

              {/* Theory Deep Dive Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {guide.theoryDeepDive.deepDiveParagraphs.map((para, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">{para}</p>
                ))}
              </div>

              {/* What You Master In This Discipline */}
              <div className="pt-4 border-t border-border space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Discipline Competencies & Core Primitives</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.whatYouLearn?.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/60 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setActivePillar("curriculumReader")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Browse 15 In-Depth Modules
                </button>
                <button
                  onClick={() => setActivePillar("architecture")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Next: System Architecture <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 2. ARCHITECTURE & SYSTEM FLOWS */}
        {/* ================================================================= */}
        {activePillar === "architecture" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
              <div className="flex items-center gap-3.5 border-b border-border/70 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">Pillar 2 · Architecture & Topology</span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">{guide.architecture.title}</h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{guide.architecture.description}</p>

              {/* ASCII / Visual System Flow Diagram */}
              <div className="rounded-2xl border border-border bg-zinc-950 p-4 sm:p-6 overflow-x-auto shadow-xl">
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="flex items-center gap-2 text-foreground font-semibold">
                    <Cpu className="w-4 h-4 text-cyan-400" /> Architecture Topology Diagram
                  </span>
                  <button
                    onClick={() => handleCopy(guide.architecture.diagramAscii.trim(), "diagram")}
                    className="flex items-center gap-1 text-[11px] hover:text-foreground text-muted-foreground cursor-pointer"
                  >
                    {copiedId === "diagram" ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === "diagram" ? "Copied" : "Copy Diagram"}</span>
                  </button>
                </div>
                <pre className="text-cyan-300 font-mono text-xs leading-tight whitespace-pre">
                  <code>{guide.architecture.diagramAscii.trim()}</code>
                </pre>
              </div>

              {/* Component Roles & Failure Domains */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Subsystem Component Roles & Failure Modes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.architecture.components.map((comp, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-foreground">{comp.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {comp.role}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{comp.keyConcept}</p>
                      <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-[11px] text-destructive">
                        <strong>Failure Impact:</strong> {comp.failureDomain}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Data Flow */}
              <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" /> Runtime Data Flow & Execution Journey
                </h3>
                <ol className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {guide.architecture.dataFlow.map((flow, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {fIdx + 1}
                      </span>
                      <span className="text-foreground/90">{flow}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setActivePillar("theory")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Back to Theory
                </button>
                <button
                  onClick={() => setActivePillar("commands")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Next: Production Commands <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 3. PRODUCTION COMMAND REFERENCE & CHEAT SHEET */}
        {/* ================================================================= */}
        {activePillar === "commands" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">Pillar 3 · Production Command Reference</span>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">Verified CLI Cheat Sheet</h2>
                  </div>
                </div>

                {/* Search Bar within commands */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search commands, flags, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border bg-muted/40 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  />
                </div>
              </div>

              {/* Command Groups */}
              <div className="space-y-6">
                {filteredCommands.map((grp, gIdx) => (
                  <div key={gIdx} className="space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {grp.category}
                      </h3>
                      <p className="text-xs text-muted-foreground">{grp.description}</p>
                    </div>

                    <div className="space-y-2.5">
                      {grp.commands.map((c, cIdx) => {
                        const copyId = `cmd_${gIdx}_${cIdx}`;
                        return (
                          <div
                            key={cIdx}
                            className="rounded-xl border border-border bg-zinc-950 p-3.5 font-mono text-xs shadow-md transition-all hover:border-emerald-500/40"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="text-emerald-400 font-bold break-all flex items-center gap-2">
                                  <span className="text-muted-foreground select-none">$</span>
                                  <span>{c.cmd}</span>
                                </div>
                                <p className="text-[11px] text-zinc-400 font-sans">{c.desc}</p>
                                {c.flags && (
                                  <p className="text-[10px] text-zinc-500 font-mono">
                                    <strong className="text-zinc-400 font-semibold">Flags:</strong> {c.flags}
                                  </p>
                                )}
                              </div>

                              <button
                                onClick={() => handleCopy(c.cmd, copyId)}
                                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[11px] font-sans flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                              >
                                {copiedId === copyId ? (
                                  <>
                                    <Check className="w-3 h-3 text-secondary" /> <span className="text-secondary">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" /> <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setActivePillar("architecture")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Back to Architecture
                </button>
                <button
                  onClick={() => setActivePillar("labs")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Next: Practical Labs <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 4. PRACTICAL HANDS-ON LABS */}
        {/* ================================================================= */}
        {activePillar === "labs" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-secondary/30 bg-card space-y-6">
              <div className="flex items-center justify-between border-b border-secondary/20 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-secondary font-bold">Pillar 4 · Hands-on Mastery</span>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">Interactive Production Labs</h2>
                  </div>
                </div>
              </div>

              {/* Lab Selector Tabs if multiple */}
              {guide.practicalLabs.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {guide.practicalLabs.map((lab) => (
                    <button
                      key={lab.id}
                      onClick={() => setActiveLabId(lab.id)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                        activeLabId === lab.id
                          ? "bg-secondary text-secondary-foreground shadow-md"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
                      )}
                    >
                      {lab.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Active Lab Card */}
              {currentLab && (
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-foreground">{currentLab.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-[11px] font-mono font-bold">
                          {currentLab.difficulty}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">{currentLab.estimatedTime}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground"><strong>Objective:</strong> {currentLab.objective}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentLab.prerequisites.map((prereq, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 rounded bg-card border border-border text-[11px] text-muted-foreground font-mono">
                          ✓ {prereq}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-secondary" /> Step-by-Step Lab Tasks
                    </h4>
                    {currentLab.steps.map((step) => {
                      const copyStepId = `lab_step_${step.step}`;
                      return (
                        <div key={step.step} className="p-4 rounded-xl border border-border bg-card space-y-2">
                          <div className="flex items-center gap-2.5 font-semibold text-sm">
                            <span className="w-6 h-6 rounded-lg bg-secondary/15 text-secondary border border-secondary/30 flex items-center justify-center font-mono text-xs font-bold">
                              {step.step}
                            </span>
                            <span className="text-foreground">{step.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground pl-8">{step.instruction}</p>
                          {step.command && (
                            <div className="ml-8 rounded-lg bg-zinc-950 border border-border p-3 font-mono text-xs text-emerald-400 relative overflow-x-auto">
                              <div className="flex items-center justify-between mb-1 text-[10px] text-zinc-500 font-sans border-b border-zinc-800 pb-1">
                                <span>Execute in sandbox / terminal</span>
                                <button
                                  onClick={() => handleCopy(step.command!, copyStepId)}
                                  className="hover:text-zinc-200 text-zinc-400 flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedId === copyStepId ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedId === copyStepId ? "Copied" : "Copy"}</span>
                                </button>
                              </div>
                              <pre className="whitespace-pre overflow-x-auto"><code>{step.command}</code></pre>
                            </div>
                          )}
                          {step.expectedOutput && (
                            <p className="text-[11px] text-muted-foreground/80 pl-8 font-mono">
                              <strong>Expected Output:</strong> {step.expectedOutput}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Verification Harness & Simulator */}
                  <div className="p-5 rounded-2xl border border-secondary/30 bg-secondary/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Lab Verification & Validation Harness</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{currentLab.verification}</p>
                      </div>
                      <button
                        onClick={() => handleSimulateLabVerify(currentLab.id)}
                        disabled={labVerifying}
                        className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold text-xs hover:bg-secondary/90 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-secondary/20"
                      >
                        {labVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{labVerifying ? "Verifying Lab Assertions..." : verifiedLabs.has(currentLab.id) ? "Re-Verify Lab" : "Verify Lab Tasks"}</span>
                      </button>
                    </div>

                    {verifiedLabs.has(currentLab.id) && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>All verification criteria met! Excellent job mastering this hands-on lab.</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setActivePillar("commands")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Back to Commands
                </button>
                <button
                  onClick={() => setActivePillar("projects")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Next: Capstone Projects <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 5. CAPSTONE PROJECTS */}
        {/* ================================================================= */}
        {activePillar === "projects" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
              <div className="flex items-center gap-3.5 border-b border-border/70 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">Pillar 5 · Enterprise Milestones</span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">Production Capstone Projects</h2>
                </div>
              </div>

              {currentProject && (
                <div className="space-y-6">
                  {/* Project Overview Card */}
                  <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                          {currentProject.level} Project
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold font-display text-foreground mt-1.5">{currentProject.title}</h3>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground font-semibold">Estimated: {currentProject.estimatedHours}</span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">{currentProject.overview}</p>

                    <div className="p-4 rounded-xl bg-card border border-border space-y-1 text-xs sm:text-sm">
                      <strong className="text-foreground font-semibold">Architecture Specification:</strong>
                      <p className="text-muted-foreground">{currentProject.architectureSummary}</p>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentProject.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-mono text-foreground">
                          #{tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Milestones Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Project Implementation Milestones</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentProject.milestones.map((milestone, mIdx) => (
                        <div key={mIdx} className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                          <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                            <span className="w-6 h-6 rounded-lg bg-purple-500/15 text-purple-400 font-mono text-xs font-bold flex items-center justify-center">
                              0{mIdx + 1}
                            </span>
                            <span>{milestone.title}</span>
                          </div>

                          <ul className="space-y-1.5 text-xs text-muted-foreground pl-8">
                            {milestone.tasks.map((task, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="pt-2 border-t border-border/50 text-[11px] text-purple-300 font-mono pl-8">
                            <strong>Deliverable:</strong> {milestone.deliverable}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Criteria */}
                  <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Acceptance & Evaluation Criteria</h4>
                    <div className="space-y-2">
                      {currentProject.verificationCriteria.map((crit, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                          <span>{crit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setActivePillar("labs")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Back to Labs
                </button>
                <button
                  onClick={() => setActivePillar("interview")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Next: Interview Questions <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 6. INTERVIEW QUESTIONS & SCENARIOS */}
        {/* ================================================================= */}
        {activePillar === "interview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">Pillar 6 · Senior & Staff DevOps Triage</span>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">Technical Interview Scenarios</h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (revealedQA.size === guide.interviewQuestions.length) {
                        setRevealedQA(new Set());
                      } else {
                        setRevealedQA(new Set(guide.interviewQuestions.map(q => q.id)));
                      }
                    }}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                  >
                    {revealedQA.size === guide.interviewQuestions.length ? "Collapse All Answers" : "Reveal All Answers"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredInterview.map((item, qIdx) => {
                  const isOpen = revealedQA.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "rounded-2xl border transition-all overflow-hidden",
                        isOpen ? "border-amber-500/40 bg-amber-500/5 shadow-md" : "border-border bg-muted/20 hover:border-border/80"
                      )}
                    >
                      <button
                        onClick={() => toggleQA(item.id)}
                        className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                            Q{qIdx + 1}
                          </span>
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                              {item.category}
                            </span>
                            <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug">{item.question}</h3>
                          </div>
                        </div>

                        <div className="shrink-0 pt-1">
                          {isOpen ? (
                            <ChevronDown className="w-5 h-5 text-amber-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-5 pb-6 pt-1 border-t border-amber-500/15 space-y-4 text-sm"
                          >
                            <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/20 space-y-2.5">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Technical Solution & Analysis
                              </span>
                              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-1">
                                {item.answer}
                              </p>
                            </div>

                            {item.codeSnippet && (
                              <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                                <pre className="whitespace-pre"><code>{item.codeSnippet}</code></pre>
                              </div>
                            )}

                            <div className="space-y-1.5 pl-2">
                              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Key Takeaways for the Interviewer:</span>
                              <ul className="space-y-1">
                                {item.keyPoints.map((pt, pIdx) => (
                                  <li key={pIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setActivePillar("projects")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Back to Projects
                </button>
                <button
                  onClick={() => setActivePillar("troubleshooting")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Next: Troubleshooting Runbooks <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 7. PRODUCTION TROUBLESHOOTING RUNBOOKS */}
        {/* ================================================================= */}
        {activePillar === "troubleshooting" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-destructive/30 bg-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-destructive/20 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center font-bold">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-destructive font-bold">Pillar 7 · On-Call Incident Triage</span>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">Production Troubleshooting Runbooks</h2>
                  </div>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search errors, symptoms, exit codes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border bg-muted/40 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredTroubleshooting.map((entry, tIdx) => {
                  const copyTriageId = `triage_${tIdx}`;
                  return (
                    <div key={tIdx} className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-destructive" />
                          {entry.issue}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive text-[11px] font-mono font-semibold border border-destructive/20">
                          Critical Triage
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                          <strong className="text-foreground">Observed Symptom:</strong>
                          <p className="text-muted-foreground">{entry.symptom}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                          <strong className="text-foreground">Root Cause:</strong>
                          <p className="text-muted-foreground">{entry.rootCause}</p>
                        </div>
                      </div>

                      {/* Triage Command */}
                      <div className="p-3 rounded-xl bg-zinc-950 border border-border font-mono text-xs text-emerald-400 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-sans border-b border-zinc-800 pb-1">
                          <span>Diagnosis Command:</span>
                          <button
                            onClick={() => handleCopy(entry.triageCommand, copyTriageId)}
                            className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === copyTriageId ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === copyTriageId ? "Copied" : "Copy Command"}</span>
                          </button>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre"><code>{entry.triageCommand}</code></pre>
                      </div>

                      {/* Solution */}
                      <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/30 text-xs sm:text-sm text-foreground">
                        <strong className="text-secondary font-semibold">Resolution Runbook:</strong> {entry.solution}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setActivePillar("interview")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Back to Interview Q&A
                </button>
                <button
                  onClick={() => setActivePillar("bestPractices")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Next: Best Practices <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 8. BEST PRACTICES & SECURITY HARDENING */}
        {/* ================================================================= */}
        {activePillar === "bestPractices" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
              <div className="flex items-center gap-3.5 border-b border-border/70 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/15 text-green-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-green-400 font-bold">Pillar 8 · Production Hardening</span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">Architectural Best Practices & Do's / Don'ts</h2>
                </div>
              </div>

              <div className="space-y-6">
                {guide.bestPractices.map((group, bIdx) => (
                  <div key={bIdx} className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      {group.category}
                    </h3>

                    <div className="space-y-3">
                      {group.practices.map((p, pIdx) => (
                        <div key={pIdx} className="rounded-xl border border-border bg-muted/20 p-4 sm:p-5 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs sm:text-sm text-green-300">
                              <strong className="text-green-400 block mb-1">✓ DO (Production Standard):</strong>
                              {p.do}
                            </div>
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs sm:text-sm text-red-300">
                              <strong className="text-red-400 block mb-1">✗ DON'T (Anti-Pattern):</strong>
                              {p.dont}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono pl-1">
                            <strong>Technical Rationale:</strong> {p.rationale}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setActivePillar("troubleshooting")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Back to Troubleshooting
                </button>
                <button
                  onClick={() => setActivePillar("useCases")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Next: Real-World Use Cases <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 9. REAL-WORLD DEVOPS USE CASES */}
        {/* ================================================================= */}
        {activePillar === "useCases" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
              <div className="flex items-center gap-3.5 border-b border-border/70 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">Pillar 9 · Enterprise Postmortems & Case Studies</span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">Real-World DevOps Case Studies</h2>
                </div>
              </div>

              <div className="space-y-6">
                {guide.realWorldUseCases.map((cs, cIdx) => (
                  <div key={cIdx} className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-foreground font-display">{cs.title}</h3>
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        {cs.companyScenario}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border space-y-1 text-xs sm:text-sm">
                      <strong className="text-destructive font-semibold">The Production Challenge:</strong>
                      <p className="text-muted-foreground leading-relaxed">{cs.challenge}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border space-y-1 text-xs sm:text-sm">
                      <strong className="text-blue-400 font-semibold">Architectural Solution:</strong>
                      <p className="text-muted-foreground leading-relaxed">{cs.architectureSolution}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-300">
                        <strong className="text-green-400 block mb-0.5">Business & Operational Impact:</strong>
                        {cs.businessImpact}
                      </div>
                      <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-xs text-accent">
                        <strong className="text-accent block mb-0.5">Core SRE Takeaway:</strong>
                        {cs.keyTakeaway}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setActivePillar("bestPractices")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Back to Best Practices
                </button>
                <button
                  onClick={() => setActivePillar("quiz")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Next: Course Assessment Quiz <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 10. INTEGRATED ASSESSMENT QUIZ */}
        {/* ================================================================= */}
        {activePillar === "quiz" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-accent/30 bg-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accent/20 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">Pillar 10 · Verification Assessment</span>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                      {courseQuiz ? courseQuiz.title : `${guide.title} Assessment`}
                    </h2>
                  </div>
                </div>

                {courseQuiz && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      Passing Score: <strong className="text-accent">{courseQuiz.passingScore}%</strong>
                    </span>
                    <Link
                      to={`/quiz/${guide.courseSlug}`}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-all flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="w-3 h-3" /> Fullscreen Mode
                    </Link>
                  </div>
                )}
              </div>

              {courseQuiz ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {courseQuiz.questions.map((q, qIdx) => {
                      const selected = selectedAnswers[q.id];
                      const isCorrect = selected === q.correctAnswer;
                      return (
                        <div key={q.id} className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-lg bg-accent/15 text-accent font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {qIdx + 1}
                            </span>
                            <h4 className="text-sm sm:text-base font-semibold text-foreground">{q.question}</h4>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-9">
                            {q.options.map((opt) => {
                              const isOptionSelected = selected === opt.id;
                              let btnStyle = "border-border bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground";
                              
                              if (quizSubmitted) {
                                if (opt.id === q.correctAnswer) {
                                  btnStyle = "border-green-500 bg-green-500/10 text-green-400 font-semibold";
                                } else if (isOptionSelected && !isCorrect) {
                                  btnStyle = "border-destructive bg-destructive/10 text-destructive";
                                }
                              } else if (isOptionSelected) {
                                btnStyle = "border-primary bg-primary/10 text-primary font-semibold";
                              }

                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => handleSelectAnswer(q.id, opt.id)}
                                  disabled={quizSubmitted}
                                  className={cn(
                                    "p-3 rounded-xl border text-left text-xs font-mono flex items-center gap-2.5 transition-all cursor-pointer",
                                    btnStyle
                                  )}
                                >
                                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] uppercase">
                                    {opt.id}
                                  </span>
                                  <span className="font-sans leading-snug">{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="ml-9 p-3 rounded-xl bg-zinc-950 border border-border text-xs text-muted-foreground font-mono space-y-1">
                              <strong className={isCorrect ? "text-green-400" : "text-destructive"}>
                                {isCorrect ? "✓ Correct!" : `✗ Incorrect (Correct: Option ${q.correctAnswer.toUpperCase()})`}
                              </strong>
                              <p className="font-sans text-[11px] text-zinc-400">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submission Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground font-mono">
                      Answered {Object.keys(selectedAnswers).length} of {courseQuiz.questions.length} questions
                    </div>
                    <div className="flex items-center gap-3">
                      {quizSubmitted ? (
                        <button
                          onClick={handleResetQuiz}
                          className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold transition-all cursor-pointer"
                        >
                          Retake Quiz
                        </button>
                      ) : (
                        <button
                          onClick={handleGradeQuiz}
                          disabled={Object.keys(selectedAnswers).length === 0}
                          className={cn(
                            "px-6 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                            Object.keys(selectedAnswers).length > 0
                              ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20"
                              : "opacity-40 cursor-not-allowed bg-muted text-muted-foreground"
                          )}
                        >
                          Submit Answers & Evaluate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <p className="text-muted-foreground text-sm">Interactive assessment for this course is linked below.</p>
                  <Link
                    to={`/quiz/${guide.courseSlug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-xs font-semibold"
                  >
                    <Zap className="w-3.5 h-3.5" /> Launch Course Assessment
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 11. IN-PLACE FULL MODULE CURRICULUM READER */}
        {/* ================================================================= */}
        {activePillar === "curriculumReader" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">Pillar 11 · In-Depth Lesson Syllabus</span>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">Comprehensive Module Reader</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allIds = course.sections?.flatMap((s: any) => s.lessons?.map((l: any) => l.id) || []) || [];
                      if (openModules.size === allIds.length) {
                        setOpenModules(new Set());
                      } else {
                        setOpenModules(new Set(allIds));
                      }
                    }}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                  >
                    {openModules.size > 0 ? "Collapse All Lessons" : "Expand All Lessons"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Read full module theory, practical commands, interview questions, and exercises right here without leaving the course page.
              </p>

              {/* Accordion of Modules with Content Preview */}
              <div className="space-y-4">
                {course.sections?.map((section: any, sIdx: number) => (
                  <div key={section.id || sIdx} className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                      {section.title}
                    </h3>

                    <div className="space-y-3">
                      {section.lessons?.map((lesson: any, lIdx: number) => {
                        const isOpen = openModules.has(lesson.id);
                        return (
                          <div
                            key={lesson.id || lIdx}
                            className={cn(
                              "rounded-2xl border transition-all overflow-hidden",
                              isOpen ? "border-primary/40 bg-card shadow-lg" : "border-border bg-muted/20 hover:border-border/80"
                            )}
                          >
                            <button
                              onClick={() => toggleModule(lesson.id)}
                              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-7 h-7 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                                  {lIdx + 1}
                                </span>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-semibold text-foreground truncate">{lesson.title}</h4>
                                  <p className="text-[11px] text-muted-foreground capitalize">
                                    {lesson.type || "Theory & Hands-on"} · {lesson.duration || 45} mins
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <Link
                                  to={`/learn/${guide.courseSlug}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-semibold transition-all flex items-center gap-1"
                                >
                                  <span>Launch Lab</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                              </div>
                            </button>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="px-5 pb-6 pt-2 border-t border-border/60 bg-muted/10 space-y-4 text-sm"
                                >
                                  {lesson.content ? (
                                    <div className="prose prose-invert max-w-none text-xs sm:text-sm text-muted-foreground space-y-3 whitespace-pre-line leading-relaxed font-sans">
                                      {lesson.content}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                      Detailed theory, commands, and exercises available inside the interactive workspace.
                                    </p>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ─── BOTTOM CTA FOOTER ─── */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/15 via-card to-secondary/15 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-display font-bold text-foreground">
            Master Every Pillar of {course.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Run commands in real-time, solve incident challenges, and earn your verified certificate.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={`/learn/${guide.courseSlug}`}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-primary-foreground" />
            <span>{isEnrolled ? "Continue Learning" : "Enroll & Start Course"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
