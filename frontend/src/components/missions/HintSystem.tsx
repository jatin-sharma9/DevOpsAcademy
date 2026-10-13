import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import { MissionHint } from "./types";

interface HintSystemProps {
  isOpen: boolean;
  hints: MissionHint[];
  hintLevel: number;
  onClose: () => void;
  onUnlockNextHint: () => void;
  title?: string;
  subtitle?: string;
}

export default function HintSystem({
  isOpen,
  hints,
  hintLevel,
  onClose,
  onUnlockNextHint,
  title = "SRE Incident Hints & Guidance",
  subtitle = "Graduated runbook triage assistance"
}: HintSystemProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close hints modal"
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hints Accordion / Cards */}
            <div className="space-y-3">
              {hints.slice(0, Math.max(1, hintLevel)).map((hint) => (
                <div
                  key={hint.level}
                  className="p-4 rounded-xl border border-border bg-background/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-accent">
                      LEVEL {hint.level} // {hint.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-accent/10 text-accent font-mono">
                      UNLOCKED
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {hint.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Unlock Next Hint Button */}
            {hintLevel < hints.length && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onUnlockNextHint}
                  className="w-full py-2.5 rounded-xl border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Unlock Level {hintLevel + 1} Hint</span>
                </button>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer"
              >
                Return to Terminal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
