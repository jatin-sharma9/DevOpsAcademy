import React from "react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  progressPercent: number;
  completedCount: number;
  totalCount: number;
  label?: string;
  showTaskCount?: boolean;
  className?: string;
  barWidthClassName?: string;
}

export default function ProgressTracker({
  progressPercent,
  completedCount,
  totalCount,
  label = "Resolution Progress:",
  showTaskCount = true,
  className,
  barWidthClassName = "w-48 sm:w-72"
}: ProgressTrackerProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-primary">{progressPercent}%</span>
        {showTaskCount && (
          <span className="text-muted-foreground hidden sm:inline">
            ({completedCount} of {totalCount} tasks verified)
          </span>
        )}
      </div>

      <div className={cn("h-2 rounded-full bg-muted overflow-hidden", barWidthClassName)}>
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
