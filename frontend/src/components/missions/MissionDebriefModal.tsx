import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, CheckCircle2 } from "lucide-react";
import { PostMortemItem } from "./types";

interface MissionDebriefModalProps {
  isOpen: boolean;
  missionTitle: string;
  incidentSubtitle?: string;
  slaBadge?: string;
  xpGained: number;
  elapsedTimeFormatted: string;
  completedCount: number;
  totalCount: number;
  postMortemItems?: PostMortemItem[];
  onClose: () => void;
  returnToUrl?: string;
}

export default function MissionDebriefModal({
  isOpen,
  missionTitle,
  incidentSubtitle,
  slaBadge = "SLA FULLY RESTORED // 0% ERROR RATE",
  xpGained,
  elapsedTimeFormatted,
  completedCount,
  totalCount,
  postMortemItems = [],
  onClose,
  returnToUrl = "/missions"
}: MissionDebriefModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 25 }}
            className="relative w-full max-w-lg rounded-3xl border border-primary/30 bg-card p-6 sm:p-8 shadow-2xl space-y-6 text-center"
          >
            {/* Trophy & Badge */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-primary/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-400/10">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-green-500/15 text-green-400 border border-green-500/30 inline-block">
                {slaBadge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
                Mission Accomplished!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                You successfully mitigated the <strong>{missionTitle}</strong> crisis
                {incidentSubtitle ? ` and ${incidentSubtitle}` : ""}.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-background/80 border border-border">
              <div>
                <p className="text-[10px] font-mono uppercase text-muted-foreground">XP Gained</p>
                <p className="text-base font-bold text-amber-400 font-mono mt-0.5 flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{xpGained} XP
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase text-muted-foreground">MTTR</p>
                <p className="text-base font-bold text-foreground font-mono mt-0.5">
                  {elapsedTimeFormatted}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase text-muted-foreground">Objectives</p>
                <p className="text-base font-bold text-green-400 font-mono mt-0.5">
                  {completedCount}/{totalCount} Met
                </p>
              </div>
            </div>

            {/* Post-Mortem Key Takeaways */}
            {postMortemItems.length > 0 && (
              <div className="text-left p-3.5 rounded-xl bg-muted/40 border border-border space-y-1 text-xs">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Incident Post-Mortem Summary:
                </p>
                {postMortemItems.map((item, idx) => (
                  <p key={idx} className="text-muted-foreground text-[11px] leading-relaxed">
                    • <strong>{item.title}:</strong> {item.content}
                  </p>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to={returnToUrl}
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm transition-all shadow-md shadow-primary/25 text-center"
              >
                Return to Mission Control
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 rounded-xl border border-border hover:bg-muted text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Keep Exploring Terminal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
