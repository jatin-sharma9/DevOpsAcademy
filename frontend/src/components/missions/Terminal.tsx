import React from "react";
import { Terminal as TerminalIcon, Trash2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TerminalEntry } from "./types";
import CommandHistory from "./CommandHistory";

interface TerminalProps {
  history: TerminalEntry[];
  terminalInput: string;
  onInputChange: (val: string) => void;
  onExecuteCommand: (cmd: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearHistory: () => void;
  promptUser?: string;
  sessionTitle?: string;
  sessionBadge?: string;
  quickCommands?: string[];
  terminalEndRef?: React.RefObject<HTMLDivElement>;
  terminalInputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
}

export default function Terminal({
  history,
  terminalInput,
  onInputChange,
  onExecuteCommand,
  onKeyDown,
  onClearHistory,
  promptUser = "sre@prod-bastion:~$",
  sessionTitle = "sre@prod-bastion-01:~",
  sessionBadge = "LIVE SESSION",
  quickCommands = [],
  terminalEndRef,
  terminalInputRef,
  className
}: TerminalProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-[#0d1117] flex-1 flex flex-col overflow-hidden shadow-2xl min-h-[520px]",
        className
      )}
    >
      {/* Terminal Window Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-xs text-muted-foreground flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-primary" />
            {sessionTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClearHistory}
            title="Clear terminal buffer"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono">
            {sessionBadge}
          </span>
        </div>
      </div>

      {/* Terminal Output Stream (using reusable CommandHistory) */}
      <CommandHistory
        history={history}
        terminalEndRef={terminalEndRef}
        promptUser={promptUser}
      />

      {/* Quick Command Suggestions Palette */}
      {quickCommands.length > 0 && (
        <div className="p-2.5 bg-[#161b22]/70 border-t border-border/60 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          <span className="text-muted-foreground shrink-0 px-1">Quick:</span>
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => onExecuteCommand(cmd)}
              className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-colors shrink-0 cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      )}

      {/* Terminal Input Bar */}
      <div className="p-3 bg-[#161b22] border-t border-border/80 flex items-center gap-2">
        <span className="font-mono text-xs text-primary font-bold shrink-0">
          {promptUser}
        </span>
        <input
          ref={terminalInputRef}
          type="text"
          value={terminalInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type command here (e.g. systemctl status backend-api)..."
          className="w-full bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          autoFocus
        />
        <button
          type="button"
          onClick={() => onExecuteCommand(terminalInput)}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-semibold hover:bg-primary/90 transition-all shrink-0 cursor-pointer flex items-center gap-1"
        >
          <span>Run</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
