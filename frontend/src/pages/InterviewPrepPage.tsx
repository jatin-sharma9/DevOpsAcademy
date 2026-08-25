import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  HelpCircle, ChevronDown, CheckCircle2, Shield, 
  Terminal, Sparkles, AlertCircle, Copy, Check 
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Kubernetes", "Docker", "Terraform", "Linux & Systems", "Scenario-Based"];

const QUESTIONS = [
  {
    id: "q1",
    category: "Kubernetes",
    question: "How do you troubleshoot a Pod stuck in ImagePullBackOff or ErrImagePull?",
    difficulty: "Intermediate",
    answer: "1. Run `kubectl describe pod <pod-name>` to check the Events section for exact error messages.\n2. Verify the image name, tag, and private registry URL in the Deployment spec.\n3. Check image pull secrets: ensure `imagePullSecrets` is defined and secret exists in the same namespace.\n4. Test manually pulling the image on the worker node using `docker pull` or `crictl pull` to isolate registry/network access issues.",
    command: "kubectl describe pod <pod-name> -n <namespace>"
  },
  {
    id: "q2",
    category: "Scenario-Based",
    question: "A Kubernetes deployment is hitting OOMKilled (Out of Memory). How do you resolve and optimize memory limits?",
    difficulty: "Advanced",
    answer: "1. Identify the container killed via `kubectl describe pod` (State: Terminated, Reason: OOMKilled).\n2. Review current memory requests and limits in the spec vs metrics server (`kubectl top pod`).\n3. Check heap dumps or application memory leaks using profilers.\n4. Adjust limits appropriately: set requests equal to expected baseline memory and limits to allow peak spikes without crashing adjacent pods.",
    command: "kubectl top pod -n <namespace> --sort-by=memory"
  },
  {
    id: "q3",
    category: "Terraform",
    question: "How do you recover from state lock errors or state drift in Terraform?",
    difficulty: "Intermediate",
    answer: "1. **State Lock**: If a process died, unlock state forcibly using `terraform force-unlock <LOCK-ID>` after verifying no active apply is running.\n2. **State Drift**: Run `terraform plan` to detect differences between actual infrastructure and state file.\n3. Use `terraform refresh` (or `plan -refresh-only`) to update state with real-world state, or `terraform import` to bring unmanaged resources into state.",
    command: "terraform force-unlock <LOCK-ID>"
  },
  {
    id: "q4",
    category: "Docker",
    question: "What is the difference between CMD and ENTRYPOINT in Dockerfile, and how do they work together?",
    difficulty: "Beginner",
    answer: "• **ENTRYPOINT**: Sets the primary command/binary that will always execute when the container starts.\n• **CMD**: Provides default arguments to ENTRYPOINT, or acts as default command if ENTRYPOINT is omitted.\n• **Best Practice**: Use `ENTRYPOINT [\"exec-binary\"]` and `CMD [\"default-flag\"]` so users can override flags during `docker run` without replacing the binary.",
    command: "ENTRYPOINT [\"python\", \"app.py\"]\nCMD [\"--port\", \"8080\"]"
  },
  {
    id: "q5",
    category: "Linux & Systems",
    question: "How do you identify high load on a Linux server and isolate whether it's CPU, Memory, or I/O bottleneck?",
    difficulty: "Intermediate",
    answer: "1. Run `uptime` or `top` to check 1, 5, 15 min load averages against core count.\n2. **CPU**: Check `%us` and `%sy` in `top`/`htop`. High CPU utilization points to heavy computation.\n3. **I/O Wait**: Check `%wa` in `top` or run `iostat -xz 1`. High `%wa` means disk bottleneck.\n4. **Memory/Swap**: Run `free -m` and check `vmstat 1` for `si`/`so` (swap in/out) activity.",
    command: "top -b -n 1 | head -n 20"
  }
];

export default function InterviewPrepPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["q1"]));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = QUESTIONS.filter(q => selectedCategory === "All" || q.category === selectedCategory);

  const toggleQuestion = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyCommand = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" /> DevOps Interview Mastery
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold">
          Scenario-Based <span className="gradient-text">Interview Guide</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Curated real-world questions, architecture troubleshooting scenarios, and command cheatsheets.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-1.5 text-sm rounded-full border transition-all font-medium",
              selectedCategory === cat
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion Questions */}
      <div className="space-y-4">
        {filtered.map((item, index) => {
          const isOpen = openIds.has(item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-border bg-card overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleQuestion(item.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-primary/10 text-primary border border-primary/20">
                      {item.category}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-medium rounded-full border capitalize",
                      item.difficulty === "Advanced" ? "badge-advanced" : "badge-intermediate"
                    )}>
                      {item.difficulty}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-base sm:text-lg leading-snug">
                    {item.question}
                  </h3>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform shrink-0 mt-1", isOpen && "rotate-180")} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-border/50 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <div className="whitespace-pre-line space-y-2">
                    {item.answer}
                  </div>

                  {item.command && (
                    <div className="relative p-3 rounded-xl bg-black/40 border border-border font-mono text-xs text-secondary flex items-center justify-between">
                      <code>{item.command}</code>
                      <button
                        onClick={() => copyCommand(item.id, item.command)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors ml-2"
                        title="Copy command"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
