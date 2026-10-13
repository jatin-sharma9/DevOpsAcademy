import React from "react";
import { TerminalEntry } from "./types";

interface CommandHistoryProps {
  history: TerminalEntry[];
  terminalEndRef?: React.RefObject<HTMLDivElement>;
  promptUser?: string;
  className?: string;
}

export default function CommandHistory({
  history,
  terminalEndRef,
  promptUser = "sre@prod-bastion:~$",
  className
}: CommandHistoryProps) {
  return (
    <div className={className || "p-4 flex-1 overflow-y-auto font-mono text-xs space-y-2.5 max-h-[460px]"}>
      {history.map((entry) => (
        <div key={entry.id} className="leading-relaxed">
          {entry.type === "input" ? (
            <div className="flex items-start gap-2 text-foreground font-semibold">
              <span className="text-primary shrink-0">{promptUser}</span>
              <span className="text-cyan-300">{entry.text}</span>
            </div>
          ) : entry.type === "error" ? (
            <div className="text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20 whitespace-pre-wrap font-mono">
              {entry.text}
            </div>
          ) : entry.type === "success" ? (
            <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 whitespace-pre-wrap font-mono">
              {entry.text}
            </div>
          ) : entry.type === "system" ? (
            <div className="text-muted-foreground italic whitespace-pre-wrap">
              {entry.text}
            </div>
          ) : (
            <div className="text-zinc-300 whitespace-pre-wrap font-mono bg-black/40 p-2 rounded-lg">
              {entry.text}
            </div>
          )}
        </div>
      ))}
      {terminalEndRef && <div ref={terminalEndRef} />}
    </div>
  );
}
