import React, { useState, useEffect, useRef } from "react";
import {
  Layers,
  FileCode,
  Radio,
  Box,
  CheckCircle2,
  Terminal as TerminalIcon
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  MissionHeader,
  ObjectiveChecklist,
  Terminal,
  HintSystem,
  MissionDebriefModal,
  MissionObjective,
  TerminalEntry,
  MissionHint,
  PostMortemItem
} from "@/components/missions";

const INITIAL_OBJECTIVES: MissionObjective[] = [
  {
    id: "obj-1",
    title: "Inspect the Dockerfile",
    description: "Read the container manifest and identify base image and build instructions.",
    commandSnippet: "cat Dockerfile",
    completed: false
  },
  {
    id: "obj-2",
    title: "Identify the Build Error",
    description: "Trigger the container build to capture the exact compilation failure in stderr.",
    commandSnippet: "docker build -t app:v1 .",
    completed: false
  },
  {
    id: "obj-3",
    title: "Check the Failing Dependency",
    description: "Audit package.json to isolate native modules requiring compilation toolchains.",
    commandSnippet: "cat package.json",
    completed: false
  },
  {
    id: "obj-4",
    title: "Fix the Dockerfile",
    description: "Install required build tools (python3, make, g++) into Alpine base layer before compilation.",
    commandSnippet: "patch-dockerfile",
    completed: false
  },
  {
    id: "obj-5",
    title: "Rebuild the Image",
    description: "Re-run docker build to compile native layers and produce tagged image artifact.",
    commandSnippet: "docker build -t app:v1 .",
    completed: false
  },
  {
    id: "obj-6",
    title: "Verify the Final Image",
    description: "Inspect generated image size, test launch container, and verify process logs.",
    commandSnippet: "docker images",
    completed: false
  }
];

const HINTS: MissionHint[] = [
  {
    level: 1,
    title: "Isolate Failing Docker Build Step",
    content: "Inspect the Dockerfile with `cat Dockerfile` and run `docker build -t app:v1 .` to observe which build layer fails. Notice how the build terminates at Step [4/4] `RUN npm ci`."
  },
  {
    level: 2,
    title: "Alpine Minimalist Packaging & node-gyp",
    content: "The compiler stderr reports `gyp ERR! find Python: Python is not installed or not in your PATH`. Inspect `cat package.json`: the `bcrypt` library requires native C++ compilation, but the `node:18-alpine` base image lacks python3, make, and g++."
  },
  {
    level: 3,
    title: "Patch Dockerfile & Validate Container",
    content: "Execute `patch-dockerfile` to inject `RUN apk add --no-cache python3 make g++` into the Dockerfile. Rebuild with `docker build -t app:v1 .`, inspect artifacts with `docker images`, and test runtime with `docker ps` and `docker logs`!"
  }
];

const QUICK_COMMANDS = [
  "cat Dockerfile",
  "docker build -t app:v1 .",
  "cat package.json",
  "patch-dockerfile",
  "docker images",
  "docker ps",
  "docker logs"
];

const POST_MORTEM_ITEMS: PostMortemItem[] = [
  {
    title: "Root Cause",
    content: "Alpine Linux minimal base image omits standard C/C++ toolchains (`python3`, `make`, `g++`). The native `bcrypt` package failed node-gyp build."
  },
  {
    title: "Mitigation",
    content: "Installed compile packages via Alpine APK package manager (`apk add --no-cache python3 make g++`) prior to dependency installation."
  },
  {
    title: "Optimization",
    content: "Leveraged multi-stage build caching to keep final production image footprint compact (142MB)."
  }
];

export default function DockerBuildMissionPage() {
  const [objectives, setObjectives] = useState<MissionObjective[]>(INITIAL_OBJECTIVES);
  const [terminalInput, setTerminalInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hintLevel, setHintLevel] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [isDockerfileFixed, setIsDockerfileFixed] = useState(false);
  const [isImageBuilt, setIsImageBuilt] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: "init-1",
      type: "system",
      text: "[SYSTEM // DOCKER DAEMON v24.0.7-ce // HOST: buildbox-node-04 // LINUX x86_64]",
      timestamp: "10:42:00"
    },
    {
      id: "init-2",
      type: "error",
      text: "🚨 BUILD FAILURE: CI release job aborted. 'docker build' returned exit code 1 on Alpine layer [4/4].",
      timestamp: "10:42:01"
    },
    {
      id: "init-3",
      type: "system",
      text: 'Type "help" to view diagnostic commands, or click any quick command below to inspect the Dockerfile.',
      timestamp: "10:42:02"
    }
  ]);

  // Elapsed incident clock
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerActive]);

  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const completedCount = objectives.filter((o) => o.completed).length;
  const progressPercent = Math.round((completedCount / objectives.length) * 100);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const markObjectiveComplete = (id: string) => {
    setObjectives((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, completed: true } : obj))
    );
  };

  const handleToggleObjective = (id: string) => {
    setObjectives((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, completed: !obj.completed } : obj))
    );
  };

  const handleExecuteCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    const newEntry: TerminalEntry = {
      id: `input-${Date.now()}`,
      type: "input",
      text: cmd,
      timestamp: time
    };

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const lowerCmd = cmd.toLowerCase();
    let responseEntries: TerminalEntry[] = [];

    if (lowerCmd === "clear") {
      setHistory([]);
      setTerminalInput("");
      return;
    } else if (lowerCmd === "help") {
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "system",
          text: `AVAILABLE DOCKER INCIDENT COMMANDS:
  cat Dockerfile               Inspect current Dockerfile build instructions
  docker build -t app:v1 .     Execute Docker image build
  cat package.json             Inspect Node.js dependencies
  patch-dockerfile             Apply fix to add python3, make, and g++ to Alpine layer
  docker images                List local Docker images
  docker ps                    List active running containers
  docker logs [container]      View container runtime logs
  clear                        Clear terminal screen`,
          timestamp: time
        }
      ];
    } else if (lowerCmd === "cat dockerfile" || lowerCmd === "view dockerfile") {
      markObjectiveComplete("obj-1");
      if (isDockerfileFixed) {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `# Syntax=docker/dockerfile:1
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# [FIX APPLIED]: Install build dependencies for native node-gyp module compilation
RUN apk add --no-cache python3 make g++ && npm ci --only=production

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
            timestamp: time
          }
        ];
      } else {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `# Syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install application dependencies
RUN npm ci --only=production

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
            timestamp: time
          }
        ];
      }
    } else if (lowerCmd === "cat package.json") {
      markObjectiveComplete("obj-3");
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `{
  "name": "payment-api",
  "version": "1.4.0",
  "description": "Production Payment Gateway API",
  "main": "server.js",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "express": "^4.19.2",
    "pg": "^8.11.5",
    "redis": "^4.6.13"
  },
  "scripts": {
    "start": "node server.js"
  }
}
[INFO]: Notice 'bcrypt' dependency: requires native C/C++ compilation via node-gyp during install.`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.startsWith("docker build")) {
      if (isDockerfileFixed) {
        markObjectiveComplete("obj-5");
        setIsImageBuilt(true);
        responseEntries = [
          {
            id: `out-${Date.now()}-1`,
            type: "output",
            text: `[+] Building 5.8s (8/8) FINISHED
 => [internal] load build definition from Dockerfile                     0.1s
 => [1/5] FROM docker.io/library/node:18-alpine                          0.8s
 => [2/5] WORKDIR /app                                                   0.1s
 => [3/5] COPY package*.json ./                                          0.2s
 => [4/5] RUN apk add --no-cache python3 make g++ && npm ci              3.4s
 => => fetch https://dl-cdn.alpinelinux.org/alpine/v3.18/main            0.5s
 => => OK: 7.4 MiB in 28 packages                                        0.4s
 => => added 84 packages, audited 85 packages in 2.2s                    1.8s
 => [5/5] COPY . .                                                       0.3s
 => exporting to image                                                   0.9s
 => => exporting layers                                                  0.7s
 => => naming to docker.io/library/app:v1                                0.2s`,
            timestamp: time
          },
          {
            id: `out-${Date.now()}-2`,
            type: "success",
            text: `✔ Successfully built image 3b8c4d7e91a2
✔ Successfully tagged app:v1`,
            timestamp: time
          }
        ];
      } else {
        markObjectiveComplete("obj-2");
        responseEntries = [
          {
            id: `out-${Date.now()}-1`,
            type: "output",
            text: `[+] Building 3.9s (6/8)
 => [internal] load build definition from Dockerfile                     0.1s
 => [1/4] FROM docker.io/library/node:18-alpine                          1.1s
 => [2/4] WORKDIR /app                                                   0.1s
 => [3/4] COPY package*.json ./                                          0.2s
 => ERROR [4/4] RUN npm ci --only=production                             2.4s
------
 > [4/4] RUN npm ci --only=production:
npm warn deprecated inflight@1.0.6: This module is not supported.
gyp ERR! find Python
gyp ERR! find Python Python is not installed or not in your PATH.
gyp ERR! find Python set the PYTHON env variable to Python executable.
gyp ERR! stack Error: Could not find any Python installation to use
gyp ERR! System Linux 5.15.0-alpine
gyp ERR! command "/usr/local/bin/node" "node-gyp" "rebuild"
gyp ERR! cwd /app/node_modules/bcrypt
gyp ERR! not ok
npm error code 1
npm error path /app/node_modules/bcrypt
------`,
            timestamp: time
          },
          {
            id: `out-${Date.now()}-2`,
            type: "error",
            text: `ERROR: failed to solve: process "/bin/sh -c npm ci --only=production" did not complete successfully: exit code 1
[ROOT CAUSE]: Alpine Linux lacks python3, make, and g++ required by node-gyp to build 'bcrypt'.`,
            timestamp: time
          }
        ];
      }
    } else if (
      lowerCmd === "patch-dockerfile" ||
      lowerCmd === "fix dockerfile" ||
      lowerCmd.includes("sed") ||
      lowerCmd.includes("apk add")
    ) {
      markObjectiveComplete("obj-4");
      setIsDockerfileFixed(true);
      responseEntries = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: `Applying patch to Dockerfile...
- RUN npm ci --only=production
+ RUN apk add --no-cache python3 make g++ && npm ci --only=production`,
          timestamp: time
        },
        {
          id: `out-${Date.now()}-2`,
          type: "success",
          text: `✔ Dockerfile patched successfully! Build tools added to Alpine layer.
Next step: Rebuild with "docker build -t app:v1 ."`,
          timestamp: time
        }
      ];
    } else if (lowerCmd === "docker images" || lowerCmd === "docker image ls") {
      if (isImageBuilt) {
        markObjectiveComplete("obj-6");
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
app          v1        3b8c4d7e91a2   18 seconds ago   142MB
node         18-alpine 6a813958e99b   2 weeks ago      174MB`,
            timestamp: time
          }
        ];
      } else {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
node         18-alpine 6a813958e99b   2 weeks ago   174MB
(Image 'app:v1' has not been successfully built yet)`,
            timestamp: time
          }
        ];
      }
    } else if (lowerCmd.startsWith("docker ps")) {
      markObjectiveComplete("obj-6");
      if (isImageBuilt) {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `CONTAINER ID   IMAGE    COMMAND                  CREATED         STATUS         PORTS                    NAMES
f91d04b6a8e8   app:v1   "docker-entrypoint.s…"   12 seconds ago  Up 11 seconds  0.0.0.0:3000->3000/tcp   payment-test`,
            timestamp: time
          }
        ];
      } else {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
(No active containers running)`,
            timestamp: time
          }
        ];
      }
    } else if (lowerCmd.startsWith("docker logs")) {
      markObjectiveComplete("obj-6");
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "success",
          text: `[2026-10-08 10:44:12] INFO: payment-api v1.4.0 boot sequence started.
[2026-10-08 10:44:12] INFO: Native bcrypt compiled cipher engine loaded successfully.
[2026-10-08 10:44:13] INFO: Server listening on 0.0.0.0:3000 [production mode]
[2026-10-08 10:44:13] HEALTHCHECK: Endpoint /healthz returning HTTP 200 OK.`,
          timestamp: time
        }
      ];
    } else {
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `Executed: "${cmd}". (Hint: Try running "cat Dockerfile", "docker build -t app:v1 .", or "help")`,
          timestamp: time
        }
      ];
    }

    setHistory((prev) => [...prev, newEntry, ...responseEntries]);
    setTerminalInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleExecuteCommand(terminalInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setTerminalInput(commandHistory[nextIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setTerminalInput("");
      } else {
        setHistoryIndex(nextIndex);
        setTerminalInput(commandHistory[nextIndex]);
      }
    }
  };

  const handleCompleteMission = () => {
    if (progressPercent < 100) {
      toast.warning("Complete all 6 triage objectives to achieve full resolution!");
    }
    setIsTimerActive(false);
    setShowVictoryModal(true);
  };

  const triggerNextHint = () => {
    if (hintLevel < HINTS.length) {
      setHintLevel((prev) => prev + 1);
      toast.info(`Hint ${hintLevel + 1} unlocked!`);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      {/* ─── REUSABLE MISSION HEADER & PROGRESS TRACKER ─── */}
      <MissionHeader
        missionTitle="Broken Docker Build"
        incidentLevel="BUILD BLOCKED"
        incidentLevelBadgeClass="bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
        pulseDotColor="bg-cyan-400"
        incidentSubtitle="node-gyp compilation failure"
        elapsedTime={elapsedTime}
        hintLevel={hintLevel}
        maxHints={HINTS.length}
        progressPercent={progressPercent}
        completedCount={completedCount}
        totalCount={objectives.length}
        onOpenHints={() => {
          setShowHintModal(true);
          if (hintLevel === 0) setHintLevel(1);
        }}
        onCompleteMission={handleCompleteMission}
      />

      {/* ─── MAIN INCIDENT WORKSPACE (2-COLUMN RESPONSIVE LAYOUT) ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Incident Briefing & Interactive Objectives (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Incident Overview Card */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                <Box className="w-5 h-5 text-cyan-400" /> Incident Briefing
              </h2>
              <span className="text-xs font-mono text-muted-foreground">ID: DOCKER-812</span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              A production deployment is blocked because the Docker container build step failed abruptly during CI.
              The base image was recently migrated to <strong>Alpine Linux</strong> to reduce image size, but the build now terminates with compiler errors.
            </p>

            {/* Topology / Build Metadata Box */}
            <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Target Image:</span>
                <span className="text-foreground font-semibold">payment-api:v1.4.0</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Base Image:</span>
                <span className="text-cyan-400 font-semibold">node:18-alpine</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Build Engine:</span>
                <span className="text-foreground font-semibold">Docker BuildKit 24.0</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Pipeline Status:</span>
                <span className={cn("font-bold flex items-center gap-1", isImageBuilt ? "text-green-400" : "text-cyan-400")}>
                  <Radio className="w-3 h-3 animate-pulse" />
                  {isImageBuilt ? "IMAGE ARTIFACT VERIFIED (PASS)" : "BUILD BLOCKED (EXIT CODE 1)"}
                </span>
              </div>
            </div>
          </div>

          {/* REUSABLE OBJECTIVE CHECKLIST */}
          <ObjectiveChecklist
            objectives={objectives}
            completedCount={completedCount}
            onToggleObjective={handleToggleObjective}
            onRunCommand={handleExecuteCommand}
            title="Docker Build Objectives"
          />
        </div>

        {/* RIGHT COLUMN: Terminal Command Workspace (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* REUSABLE TERMINAL & COMMAND HISTORY */}
          <Terminal
            history={history}
            terminalInput={terminalInput}
            onInputChange={setTerminalInput}
            onExecuteCommand={handleExecuteCommand}
            onKeyDown={handleKeyDown}
            onClearHistory={() => setHistory([])}
            promptUser="devops@buildbox:~/app$"
            sessionTitle="devops@buildbox-node-04:~/payment-service"
            sessionBadge="DOCKER RUNNER"
            quickCommands={QUICK_COMMANDS}
            terminalEndRef={terminalEndRef}
            terminalInputRef={terminalInputRef}
          />

          {/* Docker Runbook Advice Strip */}
          <div className="p-4 rounded-xl border border-border bg-card/60 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Docker Best Practice: Alpine Native Dependencies</p>
                <p className="text-muted-foreground text-[11px]">
                  Minimal base images like Alpine require build tools (`python3`, `make`, `g++`) to build native npm binaries.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowHintModal(true);
                setHintLevel(HINTS.length);
              }}
              className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              View Full Runbook
            </button>
          </div>
        </div>
      </main>

      {/* ─── REUSABLE HINTS SYSTEM ─── */}
      <HintSystem
        isOpen={showHintModal}
        hints={HINTS}
        hintLevel={hintLevel}
        onClose={() => setShowHintModal(false)}
        onUnlockNextHint={triggerNextHint}
        title="Docker Build Hints & Guidance"
        subtitle="Troubleshooting Alpine Linux native build failures"
      />

      {/* ─── REUSABLE MISSION DEBRIEF / VICTORY MODAL ─── */}
      <MissionDebriefModal
        isOpen={showVictoryModal}
        missionTitle="Broken Docker Build"
        incidentSubtitle="repaired Alpine multi-stage Dockerfile and verified production image"
        slaBadge="BUILD PIPELINE RESTORED // 100% PASS RATE"
        xpGained={150}
        elapsedTimeFormatted={formatTimer(elapsedTime)}
        completedCount={completedCount}
        totalCount={objectives.length}
        postMortemItems={POST_MORTEM_ITEMS}
        onClose={() => setShowVictoryModal(false)}
        returnToUrl="/missions"
      />
    </div>
  );
}
