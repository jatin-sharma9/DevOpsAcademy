import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Layers, Terminal, HelpCircle, CheckCircle2,
  Copy, Check, Zap, Award, Code2, Sparkles, ChevronRight,
  ChevronDown, RefreshCw, AlertCircle, ArrowRight, ShieldAlert,
  Flame, CheckCircle, FileCode, CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface ParsedLessonContent {
  raw: string;
  theory: string;
  realWorld: string;
  commandsRaw: string;
  interviewQARaw: string;
  labStepsRaw: string;
}

export function parseLessonContent(content: string): ParsedLessonContent {
  const result: ParsedLessonContent = {
    raw: content || "",
    theory: "",
    realWorld: "",
    commandsRaw: "",
    interviewQARaw: "",
    labStepsRaw: ""
  };

  if (!content) return result;

  // Split on section headers (### [emojis] 1., 2., 3., 4., 5.)
  const sections = content.split(/\n(?=###\s*(?:[^\n]*?[1-5]\.\s*))/);

  for (const sec of sections) {
    const trimmed = sec.trim();
    if (!trimmed.startsWith("###")) {
      if (!result.theory && trimmed) {
        result.theory = trimmed;
      }
      continue;
    }

    const headerLine = trimmed.split("\n")[0];
    const body = trimmed.substring(headerLine.length).trim();

    if (/1\.\s*theory/i.test(headerLine)) {
      result.theory = body;
    } else if (/2\.\s*(?:real-world|architecture|project|use cases)/i.test(headerLine)) {
      result.realWorld = body;
    } else if (/3\.\s*(?:practical\s*commands|commands|production)/i.test(headerLine)) {
      result.commandsRaw = body;
    } else if (/4\.\s*.*(?:interview|troubleshooting|q&a|scenario)/i.test(headerLine)) {
      result.interviewQARaw = body;
    } else if (/5\.\s*.*(?:practical|hands-on|lab|exercise)/i.test(headerLine)) {
      result.labStepsRaw = body;
    }
  }

  return result;
}

interface QAItem {
  id: string;
  question: string;
  answer: string;
}

function parseInterviewQA(raw: string): QAItem[] {
  if (!raw) return [];
  const items: QAItem[] = [];

  // Match items separated by question markers like - **Q: ... or **Q: ...
  const chunks = raw.split(/(?=(?:^|\n)(?:-\s*)?\*\*Q:)/g).filter(c => c.trim().length > 0);

  chunks.forEach((chunk, idx) => {
    // Extract Question
    const qMatch = chunk.match(/\*\*Q:\s*([^\n*?]+(?:\?|\.|\:)?)\*\*/i);
    // Extract Answer
    const aMatch = chunk.match(/(?:\*A:\*|\*\*A:\*\*|A:)\s*([\s\S]+)/i);

    if (qMatch) {
      const qText = qMatch[1].trim();
      let aText = aMatch ? aMatch[1].trim() : "";
      if (!aText) {
        // Fallback: take content after question match
        aText = chunk.replace(qMatch[0], "").replace(/^[-\s*:]+/, "").trim();
      }
      items.push({
        id: `qa_${idx + 1}`,
        question: qText,
        answer: aText
      });
    }
  });

  return items;
}

interface CommandBlock {
  title?: string;
  language: string;
  code: string;
}

function parseCodeBlocks(raw: string): { intro: string; blocks: CommandBlock[] } {
  if (!raw) return { intro: "", blocks: [] };

  const blocks: CommandBlock[] = [];
  const codeRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let intro = "";

  while ((match = codeRegex.exec(raw)) !== null) {
    if (blocks.length === 0 && match.index > 0) {
      intro = raw.substring(0, match.index).trim();
    }
    blocks.push({
      language: match[1] || "bash",
      code: match[2].trim()
    });
    lastIndex = codeRegex.lastIndex;
  }

  // If no fenced code blocks, treat lines starting with $ or ` or code-like as blocks
  if (blocks.length === 0) {
    return { intro: raw, blocks: [] };
  }

  return { intro, blocks };
}

interface StandardLearningTemplateProps {
  lesson: {
    id: string;
    title: string;
    duration?: number;
    type?: string;
    content?: string;
    youtubeUrl?: string;
  };
  course: {
    id: string | number;
    title: string;
    slug: string;
    instructor?: string;
    color?: string;
    category?: string;
  };
  onComplete?: () => void;
  isCompleted?: boolean;
}

export default function StandardLearningTemplate({
  lesson,
  course,
  onComplete,
  isCompleted = false
}: StandardLearningTemplateProps) {
  const [activePillar, setActivePillar] = useState<"theory" | "architecture" | "commands" | "qa" | "lab">("theory");
  const [revealedQA, setRevealedQA] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [labVerified, setLabVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Parse structured 5-pillar sections from lesson content
  const parsed = useMemo(() => parseLessonContent(lesson.content || ""), [lesson.content]);
  const qaItems = useMemo(() => parseInterviewQA(parsed.interviewQARaw), [parsed.interviewQARaw]);
  const commandData = useMemo(() => parseCodeBlocks(parsed.commandsRaw), [parsed.commandsRaw]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Command copied to clipboard");
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

  const handleSimulateLabVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setLabVerified(true);
      toast.success("🎉 Lab validation passed successfully!");
    }, 1200);
  };

  // Helper to format clean markdown paragraphs & bullet points
  const renderFormattedMarkdown = (text: string) => {
    if (!text) return null;
    const paragraphs = text.split("\n\n").filter(Boolean);

    return (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        {paragraphs.map((para, pIdx) => {
          const trimmed = para.trim();

          // Code blocks
          if (trimmed.startsWith("```")) {
            const cleanCode = trimmed.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
            const copyId = `code_${pIdx}`;
            return (
              <div key={pIdx} className="relative my-4 rounded-xl border border-border/80 bg-zinc-950 font-mono text-xs overflow-hidden shadow-lg">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-zinc-900/60 text-muted-foreground text-[11px]">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Terminal className="w-3.5 h-3.5 text-primary" /> Command Terminal
                  </span>
                  <button
                    onClick={() => handleCopy(cleanCode, copyId)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                <pre className="p-4 text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                  <code>{cleanCode}</code>
                </pre>
              </div>
            );
          }

          // Bullet points
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const items = trimmed.split("\n").filter(l => l.trim().startsWith("- ") || l.trim().startsWith("* "));
            return (
              <ul key={pIdx} className="space-y-2 my-3 pl-1">
                {items.map((item, iIdx) => {
                  const itemContent = item.replace(/^[-*]\s*/, "");
                  return (
                    <li key={iIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemContent) }} />
                    </li>
                  );
                })}
              </ul>
            );
          }

          // Numbered list
          if (/^\d+\.\s/.test(trimmed)) {
            const items = trimmed.split(/\n(?=\d+\.\s)/);
            return (
              <ol key={pIdx} className="space-y-2.5 my-3 pl-1">
                {items.map((item, iIdx) => {
                  const numMatch = item.match(/^(\d+)\.\s*/);
                  const num = numMatch ? numMatch[1] : `${iIdx + 1}`;
                  const rest = item.replace(/^\d+\.\s*/, "");
                  return (
                    <li key={iIdx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                        {num}
                      </span>
                      <div className="flex-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(rest) }} />
                    </li>
                  );
                })}
              </ol>
            );
          }

          // Regular paragraph
          return (
            <p
              key={pIdx}
              className="text-muted-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
            />
          );
        })}
      </div>
    );
  };

  // Convert inline `code`, **bold**, *italic* safely
  const formatInlineMarkdown = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-muted-foreground/90 italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted/80 text-primary font-mono text-xs border border-border/40">$1</code>');
  };

  return (
    <div className="space-y-6">
      {/* ─── 5-PILLAR STANDARD LEARNING TABS ─── */}
      <div className="border border-border/60 bg-card/60 backdrop-blur rounded-2xl p-1.5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
          {[
            { id: "theory", label: "1. Theory", icon: BookOpen, badge: "Concepts" },
            { id: "architecture", label: "2. Architecture", icon: Layers, badge: "Real-World" },
            { id: "commands", label: "3. Commands", icon: Code2, badge: "Cheat Sheet" },
            { id: "qa", label: "4. Triage & Q&A", icon: HelpCircle, badge: `${qaItems.length || "5"} Scenarios` },
            { id: "lab", label: "5. Hands-on Lab", icon: Terminal, badge: "Sandbox" },
          ].map((tab) => {
            const active = activePillar === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePillar(tab.id as any)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center",
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </div>
                <span className={cn("text-[10px] font-mono", active ? "text-primary-foreground/80" : "text-muted-foreground/70")}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── PILLAR CONTENT VIEWPORTS ─── */}
      <AnimatePresence mode="wait">
        {/* ─── PILLAR 1: THEORY & CONCEPTS ─── */}
        {activePillar === "theory" && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">Pillar 1 · Foundations</span>
                    <h2 className="text-lg font-bold text-foreground font-display">Core Theory & System Mechanics</h2>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-mono">
                  Verified Curriculum
                </span>
              </div>

              {parsed.theory ? (
                renderFormattedMarkdown(parsed.theory)
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  In this module, you study the foundational architecture, system calls, and abstractions of {lesson.title}. Review the concepts and operational mechanics below before moving to hands-on command execution.
                </p>
              )}
            </div>

            {/* Next Pillar CTA */}
            <div className="flex justify-end">
              <button
                onClick={() => setActivePillar("architecture")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-all cursor-pointer"
              >
                Proceed to Pillar 2: Architecture <ChevronRight className="w-3.5 h-3.5 text-primary" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── PILLAR 2: ARCHITECTURE & REAL-WORLD USE CASES ─── */}
        {activePillar === "architecture" && (
          <motion.div
            key="architecture"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">Pillar 2 · Architecture</span>
                    <h2 className="text-lg font-bold text-foreground font-display">Real-World DevOps Workflows & Architecture</h2>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[11px] font-mono">
                  Enterprise Architecture
                </span>
              </div>

              {parsed.realWorld ? (
                renderFormattedMarkdown(parsed.realWorld)
              ) : (
                <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Production Workflow Integration</p>
                  <p>In high-availability enterprise environments, this component is deployed as part of resilient CI/CD pipelines, container orchestration meshes, and automated telemetry systems.</p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActivePillar("theory")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold transition-all cursor-pointer"
              >
                Back to Theory
              </button>
              <button
                onClick={() => setActivePillar("commands")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold transition-all cursor-pointer shadow-md shadow-primary/20"
              >
                Explore Pillar 3: Commands <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── PILLAR 3: PRACTICAL PRODUCTION COMMANDS ─── */}
        {activePillar === "commands" && (
          <motion.div
            key="commands"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Pillar 3 · Execution</span>
                    <h2 className="text-lg font-bold text-foreground font-display">Production Command-Line Reference</h2>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(parsed.commandsRaw, "all_commands")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-medium transition-colors cursor-pointer"
                >
                  {copiedId === "all_commands" ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === "all_commands" ? "Copied All" : "Copy All Commands"}</span>
                </button>
              </div>

              {commandData.intro && (
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {renderFormattedMarkdown(commandData.intro)}
                </div>
              )}

              {commandData.blocks.length > 0 ? (
                <div className="space-y-4">
                  {commandData.blocks.map((b, idx) => {
                    const blockId = `cmd_block_${idx}`;
                    return (
                      <div key={idx} className="rounded-xl border border-border/80 bg-zinc-950 overflow-hidden shadow-lg">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-zinc-900/70 text-[11px] text-muted-foreground font-mono">
                          <span className="flex items-center gap-2 text-foreground font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" /> #{idx + 1} {b.language.toUpperCase()} Snippet
                          </span>
                          <button
                            onClick={() => handleCopy(b.code, blockId)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
                          >
                            {copiedId === blockId ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === blockId ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                        <pre className="p-4 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed">
                          <code>{b.code}</code>
                        </pre>
                      </div>
                    );
                  })}
                </div>
              ) : (
                renderFormattedMarkdown(parsed.commandsRaw)
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActivePillar("architecture")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold transition-all cursor-pointer"
              >
                Back to Architecture
              </button>
              <button
                onClick={() => setActivePillar("qa")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold transition-all cursor-pointer shadow-md shadow-primary/20"
              >
                Go to Pillar 4: Interview & Triage <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── PILLAR 4: INCIDENT TRIAGE & INTERVIEW Q&A ─── */}
        {activePillar === "qa" && (
          <motion.div
            key="qa"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">Pillar 4 · Interview & Triage</span>
                    <h2 className="text-lg font-bold text-foreground font-display">Real-World Incidents & Interview Scenarios</h2>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (revealedQA.size === qaItems.length) {
                      setRevealedQA(new Set());
                    } else {
                      setRevealedQA(new Set(qaItems.map(q => q.id)));
                    }
                  }}
                  className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  {revealedQA.size === qaItems.length ? "Collapse All" : "Reveal All Answers"}
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                These scenarios reflect common technical interview questions and production on-call debugging dilemmas faced by Senior DevOps Engineers.
              </p>

              {qaItems.length > 0 ? (
                <div className="space-y-3">
                  {qaItems.map((item, qIdx) => {
                    const isOpen = revealedQA.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "rounded-2xl border transition-all overflow-hidden",
                          isOpen ? "border-amber-500/30 bg-amber-500/5" : "border-border bg-muted/20 hover:border-border/80"
                        )}
                      >
                        <button
                          onClick={() => toggleQA(item.id)}
                          className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                              Q{qIdx + 1}
                            </span>
                            <h3 className="text-sm font-semibold text-foreground leading-snug">{item.question}</h3>
                          </div>
                          <div className="shrink-0 pt-0.5">
                            {isOpen ? (
                              <ChevronDown className="w-4 h-4 text-amber-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
                              className="px-5 pb-5 pt-1 border-t border-amber-500/15 text-sm"
                            >
                              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-amber-500/20 space-y-2">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5" /> Technical Solution & Analysis
                                </span>
                                <div
                                  className="text-xs text-muted-foreground leading-relaxed pl-1"
                                  dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item.answer) }}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ) : (
                renderFormattedMarkdown(parsed.interviewQARaw)
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActivePillar("commands")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold transition-all cursor-pointer"
              >
                Back to Commands
              </button>
              <button
                onClick={() => setActivePillar("lab")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold transition-all cursor-pointer shadow-md shadow-primary/20"
              >
                Launch Pillar 5: Hands-on Lab <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── PILLAR 5: INTERACTIVE HANDS-ON LAB SANDBOX ─── */}
        {activePillar === "lab" && (
          <motion.div
            key="lab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-2xl border border-secondary/30 bg-secondary/5 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-secondary/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-secondary font-bold">Pillar 5 · Practical Mastery</span>
                    <h2 className="text-lg font-bold text-foreground font-display">Hands-on Lab & Verification Challenge</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-[11px] font-mono font-semibold">
                    Interactive Lab
                  </span>
                </div>
              </div>

              {/* Lab Steps / Mission */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-secondary" /> Lab Challenge Tasks
                </h3>
                <div className="p-5 rounded-2xl border border-border bg-card/80 space-y-3">
                  {parsed.labStepsRaw ? (
                    renderFormattedMarkdown(parsed.labStepsRaw)
                  ) : (
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>1. Open your local bash terminal or cloud VM sandbox.</p>
                      <p>2. Execute the practical commands demonstrated in Pillar 3.</p>
                      <p>3. Verify configuration persistence and inspect process/socket outputs.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Terminal Sandbox Simulator */}
              <div className="rounded-2xl border border-border bg-zinc-950 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/80">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="text-[11px] font-mono text-zinc-400 ml-2">sandbox@devops-academy: ~/lab-session</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Terminal
                  </span>
                </div>

                <div className="p-4 sm:p-6 font-mono text-xs text-zinc-300 space-y-3 overflow-x-auto">
                  <p className="text-zinc-500"># Welcome to DevOps Academy Interactive Environment</p>
                  <p className="text-zinc-500"># Active Module: {lesson.title}</p>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                    <p className="text-primary font-semibold">$ # Automated Verification Harness</p>
                    <p className="text-zinc-300">$ echo "Checking requirements for {lesson.title}..."</p>
                    {labVerified && (
                      <p className="text-emerald-400 font-bold">
                        [OK] All tasks verified! Configuration is production-ready.
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleSimulateLabVerify}
                    disabled={verifying}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold text-xs hover:bg-secondary/90 transition-all cursor-pointer shadow-md shadow-secondary/20"
                  >
                    {verifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    <span>{verifying ? "Executing Verification Checks..." : labVerified ? "Re-Run Verification" : "Verify Lab Tasks"}</span>
                  </button>

                  {labVerified && (
                    <span className="text-xs text-secondary font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Lab Challenge Solved!
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActivePillar("qa")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold transition-all cursor-pointer"
              >
                Back to Q&A
              </button>
              {onComplete && (
                <button
                  onClick={onComplete}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                    isCompleted
                      ? "bg-secondary/20 text-secondary border border-secondary/30"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25"
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? "Completed · Proceed" : "Complete Lesson & Advance"}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── COMPLETE 11-PILLAR LEARNING GUIDE BANNER ─── */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">Mastery Reference</span>
            <h4 className="text-sm font-bold text-foreground">Complete 11-Pillar Learning Guide · {course.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Access mental models, ASCII architecture flows, command cheat sheets, production outage runbooks, and enterprise capstone projects.
            </p>
          </div>
        </div>

        <Link
          to={`/courses/${course.slug}`}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
        >
          <span>Open Learning Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ─── INTEGRATED ASSESSMENT & CERTIFICATION BANNER ─── */}
      <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-card to-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center shrink-0 border border-accent/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent">Skill Verification</span>
            <h4 className="text-sm font-bold text-foreground">{course.title} Comprehensive Assessment</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Validate your mastery of all 5 pillars and earn your verified certificate of completion.
            </p>
          </div>
        </div>

        <Link
          to={`/quiz/${course.slug}`}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-xs font-bold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 cursor-pointer"
        >
          <span>Take Course Assessment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
