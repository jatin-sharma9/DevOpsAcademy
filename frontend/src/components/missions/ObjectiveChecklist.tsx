import React from "react";
import { CheckCircle2, Check, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { MissionObjective } from "./types";

interface ObjectiveChecklistProps {
  objectives: MissionObjective[];
  completedCount: number;
  onToggleObjective: (id: string) => void;
  onRunCommand: (command: string) => void;
  title?: string;
  className?: string;
}

export default function ObjectiveChecklist({
  objectives,
  completedCount,
  onToggleObjective,
  onRunCommand,
  title = "Triage Objectives",
  className
}: ObjectiveChecklistProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" /> {title}
        </h3>
        <span className="text-xs font-mono font-bold text-primary">
          {completedCount}/{objectives.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {objectives.map((obj, idx) => (
          <div
            key={obj.id}
            className={cn(
              "p-3.5 rounded-xl border transition-all text-xs space-y-2",
              obj.completed
                ? "bg-green-500/5 border-green-500/30 text-foreground"
                : "bg-background/60 border-border/70 hover:border-border"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => onToggleObjective(obj.id)}
                  aria-label={`Toggle objective: ${obj.title}`}
                  className={cn(
                    "w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer",
                    obj.completed
                      ? "bg-green-500 border-green-500 text-black"
                      : "border-muted-foreground/40 hover:border-primary"
                  )}
                >
                  {obj.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <div>
                  <p className={cn("font-semibold", obj.completed && "line-through text-muted-foreground")}>
                    {idx + 1}. {obj.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {obj.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick-run Command Action */}
            <div className="flex items-center justify-between bg-black/50 px-2.5 py-1.5 rounded-lg border border-border/60">
              <code className="font-mono text-[11px] text-emerald-400 truncate max-w-[240px]">
                $ {obj.commandSnippet}
              </code>
              <button
                type="button"
                onClick={() => onRunCommand(obj.commandSnippet)}
                className="text-[10px] font-mono font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Play className="w-3 h-3 fill-primary" /> Run
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
