import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Lightbulb, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressTracker from "./ProgressTracker";

interface MissionHeaderProps {
  missionTitle: string;
  incidentLevel?: string;
  incidentLevelBadgeClass?: string;
  incidentSubtitle?: string;
  pulseDotColor?: string;
  elapsedTime: number;
  hintLevel: number;
  maxHints: number;
  progressPercent: number;
  completedCount: number;
  totalCount: number;
  onOpenHints: () => void;
  onCompleteMission: () => void;
}

export default function MissionHeader({
  missionTitle,
  incidentLevel = "P1 CRITICAL",
  incidentLevelBadgeClass = "bg-red-500/15 text-red-400 border-red-500/30",
  incidentSubtitle,
  pulseDotColor = "bg-red-500",
  elapsedTime,
  hintLevel,
  maxHints,
  progressPercent,
  completedCount,
  totalCount,
  onOpenHints,
  onCompleteMission
}: MissionHeaderProps) {
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="sticky top-16 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Breadcrumbs & Incident Pill */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/missions"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>DevOps Mission Control</span>
          </Link>
          <span className="text-border">/</span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border",
                incidentLevelBadgeClass
              )}
            >
              <span className={cn("w-2 h-2 rounded-full animate-ping", pulseDotColor)} />
              {incidentLevel}
            </span>
            <span className="text-xs font-display font-bold text-foreground">
              {missionTitle}
              {incidentSubtitle && <span className="text-muted-foreground font-normal ml-1">({incidentSubtitle})</span>}
            </span>
          </div>
        </div>

        {/* Right: Telemetry & Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Live Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted/60 border border-border text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-muted-foreground">Elapsed:</span>
            <span className="font-bold text-foreground">{formatTimer(elapsedTime)}</span>
          </div>

          {/* Hint Button */}
          <button
            onClick={onOpenHints}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs font-medium hover:bg-accent/20 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hints ({hintLevel}/{maxHints})</span>
          </button>

          {/* Complete Mission Button */}
          <button
            onClick={onCompleteMission}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer",
              progressPercent === 100
                ? "bg-green-500 hover:bg-green-400 text-black shadow-green-500/20"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
            )}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Complete Mission</span>
          </button>
        </div>
      </div>

      {/* Dynamic Progress Strip */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-border/40">
        <ProgressTracker
          progressPercent={progressPercent}
          completedCount={completedCount}
          totalCount={totalCount}
        />
      </div>
    </section>
  );
}
