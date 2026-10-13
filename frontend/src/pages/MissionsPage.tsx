import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Flame,
  Layers,
  RefreshCw,
  GitPullRequest,
  Zap,
  Clock,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  X,
  Search,
  Sparkles,
  Rocket,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  CircleDot
} from "lucide-react";
import { toast } from "sonner";
import { cn, getLevelBadge } from "@/lib/utils";

interface Mission {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xp: number;
  skills: string[];
  description: string;
  incidentType: string;
  estimatedTime: string;
  statusBadge: {
    label: string;
    pulseColor: string;
    badgeClass: string;
  };
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  borderGlow: string;
  objectives: string[];
  initialCommand: string;
  environment: string;
}

const MISSIONS: Mission[] = [
  {
    id: "mission-prod-down",
    title: "Production Down",
    difficulty: "advanced",
    xp: 350,
    skills: ["Linux", "Nginx", "Incident Response", "Systemd", "Networking", "SRE Runbooks"],
    description: "Primary ingress cluster is throwing 502 Bad Gateway under production peak traffic. Trace socket exhaustion, diagnose systemd crash loops, and restore zero-downtime traffic routing.",
    incidentType: "P1 Major Outage",
    estimatedTime: "25 mins",
    statusBadge: {
      label: "P1 CRITICAL OUTAGE",
      pulseColor: "bg-red-500",
      badgeClass: "bg-red-500/15 text-red-400 border-red-500/30"
    },
    icon: Flame,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10 border-red-500/30",
    borderGlow: "group-hover:border-red-500/50 group-hover:shadow-red-500/10",
    objectives: [
      "Inspect Nginx reverse proxy error logs and upstream pool connectivity",
      "Diagnose socket exhaustion and kernel file descriptor limits (`ulimit`, `sysctl`)",
      "Restart stalled upstream application daemon and verify HTTP 200 health check"
    ],
    initialCommand: "journalctl -u nginx.service -n 50 --no-pager",
    environment: "Ubuntu 22.04 LTS / Systemd / Nginx / Reverse Proxy"
  },
  {
    id: "mission-broken-docker",
    title: "Broken Docker Build",
    difficulty: "beginner",
    xp: 150,
    skills: ["Docker", "Dockerfile", "Layer Caching", "Multi-Stage", "Alpine Linux", "BuildKit"],
    description: "Production container build fails abruptly during dependency compilation on Alpine base image. Debug broken package hashes, fix build-time dependencies, and optimize multi-stage layers.",
    incidentType: "Container Build Failure",
    estimatedTime: "15 mins",
    statusBadge: {
      label: "BUILD BLOCKED",
      pulseColor: "bg-cyan-400",
      badgeClass: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
    },
    icon: Layers,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/30",
    borderGlow: "group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/10",
    objectives: [
      "Inspect failing Docker build layer and identify missing build dependencies",
      "Reorder Dockerfile instructions to leverage Docker layer caching effectively",
      "Implement multi-stage build pattern to isolate compile tools from the minimal runtime image"
    ],
    initialCommand: "docker build --progress=plain --no-cache -t app:debug .",
    environment: "Docker BuildKit v24.0 / Multi-Stage Engine / Alpine Linux"
  },
  {
    id: "mission-k8s-crashloop",
    title: "Kubernetes CrashLoop",
    difficulty: "intermediate",
    xp: 250,
    skills: ["Kubernetes", "kubectl", "CrashLoopBackOff", "Liveness Probes", "OOMKilled", "ConfigMaps"],
    description: "Critical payment microservice pods are repeatedly crashing with exit code 137. Inspect pod events, diagnose OOMKilled memory leaks, and patch incorrect liveness probe timeouts.",
    incidentType: "Pod CrashLoop & Outage",
    estimatedTime: "20 mins",
    statusBadge: {
      label: "CRASHLOOP DETECTED",
      pulseColor: "bg-yellow-400",
      badgeClass: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
    },
    icon: RefreshCw,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/10 border-yellow-500/30",
    borderGlow: "group-hover:border-yellow-500/50 group-hover:shadow-yellow-500/10",
    objectives: [
      "Execute `kubectl describe pod` to analyze exit codes and termination reason",
      "Adjust container memory requests & limits to accommodate runtime startup memory burst",
      "Fix misconfigured HTTP liveness probe initialDelaySeconds and timeout threshold"
    ],
    initialCommand: "kubectl get pods -l app=payment-service -o wide",
    environment: "Kubernetes v1.30 / Minikube / containerd runtime"
  },
  {
    id: "mission-failed-cicd",
    title: "Failed CI/CD Pipeline",
    difficulty: "intermediate",
    xp: 200,
    skills: ["GitHub Actions", "CI/CD", "YAML Syntax", "Secrets", "Integration Tests", "Artifacts"],
    description: "Automated delivery workflow halted on pull request validation. Unravel YAML indentation errors, fix missing secret injection in test containers, and repair artifact caching.",
    incidentType: "Release Pipeline Blocked",
    estimatedTime: "20 mins",
    statusBadge: {
      label: "PIPELINE FAILED",
      pulseColor: "bg-purple-400",
      badgeClass: "bg-purple-500/15 text-purple-400 border-purple-500/30"
    },
    icon: GitPullRequest,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10 border-purple-500/30",
    borderGlow: "group-hover:border-purple-500/50 group-hover:shadow-purple-500/10",
    objectives: [
      "Validate workflow YAML schema and fix indented conditional blocks",
      "Ensure encrypted environment secrets are properly exposed to the test runner container",
      "Resolve concurrency deadlocks and restore smooth automated test execution"
    ],
    initialCommand: "gh run view --log-failed",
    environment: "GitHub Actions Runner / Ubuntu-Latest / YAML Workflow"
  }
];

export default function MissionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const filteredMissions = MISSIONS.filter((mission) => {
    const matchesSearch =
      mission.title.toLowerCase().includes(search.toLowerCase()) ||
      mission.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      mission.description.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "All" || mission.difficulty === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  const handleStartMission = (mission: Mission) => {
    if (mission.id === "mission-prod-down") {
      navigate("/missions/production-down");
      return;
    }
    if (mission.id === "mission-broken-docker") {
      navigate("/missions/docker-build");
      return;
    }
    if (mission.id === "mission-k8s-crashloop") {
      navigate("/missions/kubernetes-crashloop");
      return;
    }
    if (mission.id === "mission-failed-cicd") {
      navigate("/missions/failed-cicd");
      return;
    }
    setSelectedMission(mission);
    toast.info(`Opening dispatch briefing for "${mission.title}"...`);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    toast.success("Command copied to clipboard!");
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleLaunchTerminal = (mission: Mission) => {
    if (mission.id === "mission-prod-down") {
      navigate("/missions/production-down");
      return;
    }
    if (mission.id === "mission-broken-docker") {
      navigate("/missions/docker-build");
      return;
    }
    if (mission.id === "mission-k8s-crashloop") {
      navigate("/missions/kubernetes-crashloop");
      return;
    }
    if (mission.id === "mission-failed-cicd") {
      navigate("/missions/failed-cicd");
      return;
    }
    setActiveSession(mission.id);
    toast.success(`🚀 War Room Activated: Initializing sandbox for "${mission.title}"!`);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* ─── HERO / COMMAND HEADER ─── */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-card/80 via-background to-background py-14 sm:py-20">
        <div className="absolute inset-0 hero-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
            {/* Live Beacon Status */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-medium shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span>SIMULATION WAR ROOM ONLINE</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-foreground/80">4 ACTIVE DRILLS</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight"
            >
              DevOps <span className="gradient-text">Mission Control</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl"
            >
              Step into the boots of an on-call SRE. Investigate real-world production incidents,
              diagnose root causes, patch broken infrastructure, and earn engineering XP in hands-on crisis drills.
            </motion.p>

            {/* Mission Telemetry Ribbon */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl text-left"
            >
              <div className="p-3 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Active Incidents</p>
                <p className="text-lg font-bold font-display text-foreground flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  4 Drills
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Available XP</p>
                <p className="text-lg font-bold font-display text-amber-400 flex items-center gap-1 mt-0.5">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  950 XP
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Target SLA</p>
                <p className="text-lg font-bold font-display text-green-400 flex items-center gap-1 mt-0.5">
                  <Shield className="w-4 h-4 text-green-400" />
                  99.99%
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Environment</p>
                <p className="text-lg font-bold font-display text-primary flex items-center gap-1 mt-0.5">
                  <Terminal className="w-4 h-4" />
                  Live Sandbox
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FILTERS & SEARCH BAR ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter missions by skill, title, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Difficulty Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mr-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Difficulty:</span>
            </div>
            {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficultyFilter(lvl)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer border",
                  difficultyFilter === lvl
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* ─── MISSION CARDS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMissions.map((mission, idx) => {
            const Icon = mission.icon;
            const isSessionActive = activeSession === mission.id;

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="h-full"
              >
                <div
                  className={cn(
                    "group relative h-full rounded-2xl border border-border bg-card/90 p-6 flex flex-col justify-between transition-all duration-300 card-hover overflow-hidden",
                    mission.borderGlow
                  )}
                >
                  {/* Subtle ambient gradient in card corner */}
                  <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="space-y-5 relative z-10">
                    {/* Top Meta Bar: Status Badge, Difficulty, XP */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {/* Incident Status Pill */}
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-semibold rounded-full border shadow-xs",
                            mission.statusBadge.badgeClass
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full animate-ping",
                              mission.statusBadge.pulseColor
                            )}
                          />
                          {mission.statusBadge.label}
                        </span>

                        {/* Difficulty Badge */}
                        <span
                          className={cn(
                            "px-2.5 py-0.5 text-[11px] font-semibold rounded-full border capitalize",
                            getLevelBadge(mission.difficulty)
                          )}
                        >
                          {mission.difficulty}
                        </span>
                      </div>

                      {/* XP Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold shadow-xs">
                        <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{mission.xp} XP</span>
                      </div>
                    </div>

                    {/* Mission Header: Icon & Title */}
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105",
                          mission.iconBg
                        )}
                      >
                        <Icon className={cn("w-6 h-6", mission.iconColor)} />
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                            {mission.title}
                          </h2>
                          {isSessionActive && (
                            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-mono font-medium flex items-center gap-1">
                              <Radio className="w-3 h-3 animate-pulse" /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                          <span>{mission.incidentType}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {mission.estimatedTime}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Mission Brief Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {mission.description}
                    </p>

                    {/* Skills Section */}
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-primary" /> Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {mission.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-muted/60 border border-border text-foreground/90 group-hover:border-primary/20 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Action Button */}
                  <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between gap-4 relative z-10">
                    <span className="text-xs font-mono text-muted-foreground hidden sm:inline-block truncate max-w-[200px]">
                      {mission.environment.split("/")[0]}
                    </span>

                    <button
                      onClick={() => handleStartMission(mission)}
                      className={cn(
                        "w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md",
                        isSessionActive
                          ? "bg-green-600 hover:bg-green-500 text-white shadow-green-600/20"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25 hover:shadow-lg hover:shadow-primary/30"
                      )}
                    >
                      {isSessionActive ? (
                        <>
                          <Radio className="w-4 h-4 animate-pulse" />
                          <span>Resume Mission</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4" />
                          <span>Start Mission</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredMissions.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl border border-border bg-card">
            <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-display font-semibold text-foreground">No missions match your filter</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Try adjusting your search keyword or clearing the difficulty filter to find active missions.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setDifficultyFilter("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ─── MISSION BRIEFING MODAL ─── */}
      <AnimatePresence>
        {selectedMission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-border pb-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border",
                        selectedMission.statusBadge.badgeClass
                      )}
                    >
                      {selectedMission.statusBadge.label}
                    </span>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 text-[10px] font-semibold rounded-full border capitalize",
                        getLevelBadge(selectedMission.difficulty)
                      )}
                    >
                      {selectedMission.difficulty}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-400" /> {selectedMission.xp} XP
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-foreground">
                    {selectedMission.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    Environment: {selectedMission.environment}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedMission(null)}
                  className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scenario Incident Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-400" /> Incident Briefing
                </h4>
                <div className="p-4 rounded-xl bg-muted/40 border border-border/80 text-sm text-foreground/90 leading-relaxed">
                  {selectedMission.description}
                </div>
              </div>

              {/* Mission Objectives Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Triage Objectives
                </h4>
                <div className="space-y-2">
                  {selectedMission.objectives.map((obj, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card/60 text-xs sm:text-sm text-foreground/90"
                    >
                      <CircleDot className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic Command Hint */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-primary" /> First Triage Command
                  </h4>
                  <button
                    onClick={() => handleCopyCommand(selectedMission.initialCommand)}
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-mono transition-colors cursor-pointer"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Command
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-black/70 border border-border/80 font-mono text-xs sm:text-sm text-emerald-400 flex items-center justify-between overflow-x-auto">
                  <code>$ {selectedMission.initialCommand}</code>
                </div>
              </div>

              {/* Skills Involved */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Skills Validated
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMission.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-mono rounded-lg bg-primary/10 border border-primary/20 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedMission(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Close Briefing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleLaunchTerminal(selectedMission);
                    setSelectedMission(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20 cursor-pointer flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Launch Incident Sandbox</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
