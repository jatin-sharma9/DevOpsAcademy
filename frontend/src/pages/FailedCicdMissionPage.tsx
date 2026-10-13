import React, { useState, useEffect, useRef } from "react";
import {
  GitPullRequest,
  Workflow,
  Radio,
  FileCode,
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
    title: "Inspect the Failed Pipeline",
    description: "Review repository status and latest commits to locate the failing CI workflow execution.",
    commandSnippet: "git status",
    completed: false
  },
  {
    id: "obj-2",
    title: "Read the CI Logs",
    description: "View the workflow run history and examine the schema validation error in the CI runner.",
    commandSnippet: "git log -n 2",
    completed: false
  },
  {
    id: "obj-3",
    title: "Identify the YAML/Configuration Problem",
    description: "Audit .github/workflows/ci.yml to isolate the invalid YAML mapping indentation error.",
    commandSnippet: "cat .github/workflows/ci.yml",
    completed: false
  },
  {
    id: "obj-4",
    title: "Fix the Pipeline",
    description: "Correct the workflow YAML structure so 'run:' is a step-level property, not nested under env.",
    commandSnippet: "patch-workflow",
    completed: false
  },
  {
    id: "obj-5",
    title: "Run the Pipeline Again",
    description: "Stage, commit, and push the workflow fix to trigger GitHub Actions runner.",
    commandSnippet: "git add . && git commit -m 'fix: yaml indentation' && git push",
    completed: false
  },
  {
    id: "obj-6",
    title: "Verify Successful Deployment",
    description: "Watch pipeline stages complete (Build, Test, Security, Deploy) with 100% pass rate.",
    commandSnippet: "git status",
    completed: false
  }
];

const HINTS: MissionHint[] = [
  {
    level: 1,
    title: "Examine Git History & Workflow Manifest",
    content: "Run `git log -n 2` to review recent changes, then inspect the workflow file using `cat .github/workflows/ci.yml`."
  },
  {
    level: 2,
    title: "Identify YAML Syntax & Indentation Error",
    content: "In `.github/workflows/ci.yml`, look at the `deploy` job. Under the `Push to Container Registry` step, notice that `run:` is indented inside the `env:` block! GitHub Actions parser expects `run` at the step root."
  },
  {
    level: 3,
    title: "Apply Patch & Push to Trigger CI",
    content: "Run `patch-workflow` (or `sed`) to fix the indentation. Then execute `git diff` to verify the fix, followed by `git add .`, `git commit -m 'fix(ci): un-nest run key from env mapping'`, and `git push`!"
  }
];

const QUICK_COMMANDS = [
  "git status",
  "git log",
  "cat .github/workflows/ci.yml",
  "git diff",
  "patch-workflow",
  "git add .",
  "git commit -m 'fix: correct step indentation in ci.yml'",
  "git push"
];

const POST_MORTEM_ITEMS: PostMortemItem[] = [
  {
    title: "Root Cause",
    content: "A developer inadvertently indented the `run:` directive under the `env:` block in `.github/workflows/ci.yml`. GitHub Actions rejected the workflow schema before running any jobs."
  },
  {
    title: "Mitigation",
    content: "Fixed step schema indentation so `run` is properly scoped as a step instruction rather than an environment dictionary key."
  },
  {
    title: "Prevention",
    content: "Installed pre-commit `actionlint` and YAML schema validation hooks to prevent malformed workflow manifests from ever being pushed to main."
  }
];

export default function FailedCicdMissionPage() {
  const [objectives, setObjectives] = useState<MissionObjective[]>(INITIAL_OBJECTIVES);
  const [terminalInput, setTerminalInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hintLevel, setHintLevel] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [isYamlFixed, setIsYamlFixed] = useState(false);
  const [isStaged, setIsStaged] = useState(false);
  const [isCommitted, setIsCommitted] = useState(false);
  const [isPushed, setIsPushed] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: "init-1",
      type: "system",
      text: "[GITHUB WORKFLOW RUNNER // REPO: devops-academy/payment-core // BRANCH: main]",
      timestamp: "11:32:00"
    },
    {
      id: "init-2",
      type: "error",
      text: "🚨 WORKFLOW ERROR: '.github/workflows/ci.yml' failed validation: Invalid workflow file: mapping values are not allowed here at line 34.",
      timestamp: "11:32:01"
    },
    {
      id: "init-3",
      type: "system",
      text: 'Type "help" or click any recommended git command below to inspect the repository and resolve the pipeline.',
      timestamp: "11:32:02"
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
          text: `AVAILABLE CI/CD INCIDENT COMMANDS:
  git status                      Check working tree and staged changes
  git log                         View recent commit history
  cat .github/workflows/ci.yml    Display workflow YAML configuration
  git diff                        Inspect uncommitted differences
  patch-workflow                  Apply indentation fix to ci.yml
  git add .                       Stage changes for commit
  git commit -m [msg]             Commit staged changes
  git push                        Push branch to remote origin and trigger CI
  clear                           Clear terminal screen`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.startsWith("git status")) {
      markObjectiveComplete("obj-1");
      if (isPushed) {
        markObjectiveComplete("obj-6");
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "success",
            text: `On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean

✔ CI Pipeline Run #412 PASSED:
  [✔] build-artifacts (1m 12s)
  [✔] test-integration (45s)
  [✔] container-security-scan (28s)
  [✔] deploy-production-k8s (32s)
  Production deployment verified HTTP 200 OK!`,
            timestamp: time
          }
        ];
      } else if (isCommitted) {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean`,
            timestamp: time
          }
        ];
      } else if (isStaged) {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   .github/workflows/ci.yml`,
            timestamp: time
          }
        ];
      } else if (isYamlFixed) {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
	modified:   .github/workflows/ci.yml

no changes added to commit (use "git add" to track)`,
            timestamp: time
          }
        ];
      } else {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean

[CI STATUS]: Workflow run #411 on commit 8d1f02b FAILED at step parse: YAML syntax error in .github/workflows/ci.yml.`,
            timestamp: time
          }
        ];
      }
    } else if (lowerCmd.startsWith("git log")) {
      markObjectiveComplete("obj-2");
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `commit 8d1f02b6a91724c94f (HEAD -> main, origin/main)
Author: Junior DevOps Engineer <dev@devopsacademy.io>
Date:   Tue Oct 8 11:28:14 2026 +0000

    ci: add container registry push step for production releases
    [CI FAILED]: GitHub Actions Runner syntax parser error on line 34

commit 3a9482ec10998f489a
Author: Senior SRE <lead@devopsacademy.io>
Date:   Mon Oct 7 18:42:01 2026 +0000

    chore: bump base dependencies and node engine to 18`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.includes("cat .github/workflows/ci.yml") || lowerCmd.includes("view ci.yml")) {
      markObjectiveComplete("obj-3");
      if (isYamlFixed) {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `name: Production Delivery Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install Dependencies
        run: npm ci

      - name: Run Test Suite
        run: npm test

      - name: Push to Container Registry
        env:
          REGISTRY_TOKEN: \${{ secrets.DOCKER_TOKEN }}
        run: |
          echo "Logging into container registry..."
          docker push \${{ secrets.REGISTRY }}/app:\${{ github.sha }}

      - name: Deploy to Kubernetes
        run: kubectl rollout restart deployment/payment-api`,
            timestamp: time
          }
        ];
      } else {
        responseEntries = [
          {
            id: `out-${Date.now()}-1`,
            type: "output",
            text: `name: Production Delivery Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install Dependencies
        run: npm ci

      - name: Run Test Suite
        run: npm test

      - name: Push to Container Registry
        env:
          REGISTRY_TOKEN: \${{ secrets.DOCKER_TOKEN }}
          run: |  # <-- ERROR: 'run:' is indented underneath 'env:' dictionary!
            echo "Logging into container registry..."
            docker push \${{ secrets.REGISTRY }}/app:\${{ github.sha }}

      - name: Deploy to Kubernetes
        run: kubectl rollout restart deployment/payment-api`,
            timestamp: time
          },
          {
            id: `out-${Date.now()}-2`,
            type: "error",
            text: `[SYNTAX ERROR AT LINE 34]: 'run' is nested under 'env' mapping. In GitHub Actions, 'run' must align with 'name' and 'env'.`,
            timestamp: time
          }
        ];
      }
    } else if (lowerCmd.startsWith("git diff")) {
      if (isYamlFixed) {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
index a8b21e..c94d01 100644
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@ -31,5 +31,5 @@ jobs:
       - name: Push to Container Registry
         env:
           REGISTRY_TOKEN: \${{ secrets.DOCKER_TOKEN }}
-          run: |
+        run: |
           echo "Logging into container registry..."`,
            timestamp: time
          }
        ];
      } else {
        responseEntries = [
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `(No local modifications detected. Run "patch-workflow" to repair the YAML indentation.)`,
            timestamp: time
          }
        ];
      }
    } else if (
      lowerCmd === "patch-workflow" ||
      lowerCmd === "fix workflow" ||
      lowerCmd === "fix pipeline" ||
      lowerCmd.includes("sed -i")
    ) {
      markObjectiveComplete("obj-4");
      setIsYamlFixed(true);
      responseEntries = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: `Repairing .github/workflows/ci.yml...
-           run: |
+         run: |
YAML schema validated: 0 syntax errors.`,
          timestamp: time
        },
        {
          id: `out-${Date.now()}-2`,
          type: "success",
          text: `✔ YAML indentation repaired! Step 'run' is now properly aligned.
Next step: Stage and commit the fix with 'git add .' and 'git commit'.`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.startsWith("git add")) {
      setIsStaged(true);
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `Staged changes for .github/workflows/ci.yml.
Run 'git commit -m "fix(ci): correct step indentation"' to commit.`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.startsWith("git commit")) {
      setIsCommitted(true);
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `[main 9d4a812] fix(ci): correct step indentation in ci.yml
 1 file changed, 1 insertion(+), 1 deletion(-)
Run 'git push' to trigger the CI/CD pipeline runner.`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.startsWith("git push")) {
      markObjectiveComplete("obj-5");
      markObjectiveComplete("obj-6");
      setIsPushed(true);
      responseEntries = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: `Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Writing objects: 100% (4/4), 482 bytes | 482.00 KiB/s, done.
Total 4 (delta 2), reused 0 (delta 0)
To github.com:devops-academy/payment-core.git
   8d1f02b..9d4a812  main -> main

[RUNNER]: Triggering GitHub Actions Workflow 'Production Delivery Pipeline'...`,
          timestamp: time
        },
        {
          id: `out-${Date.now()}-2`,
          type: "success",
          text: `✔ Workflow Run #412: SUCCESSFUL
  [✔] Checkout Code (4s)
  [✔] Setup Node.js (8s)
  [✔] Install Dependencies (24s)
  [✔] Run Test Suite (38s)
  [✔] Push to Container Registry (18s)
  [✔] Deploy to Kubernetes (14s)

🎉 Production delivery successfully restored with 100% pass rate!`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.includes("git add") && lowerCmd.includes("commit") && lowerCmd.includes("push")) {
      // Compound command support: git add . && git commit ... && git push
      markObjectiveComplete("obj-4");
      markObjectiveComplete("obj-5");
      markObjectiveComplete("obj-6");
      setIsYamlFixed(true);
      setIsStaged(true);
      setIsCommitted(true);
      setIsPushed(true);
      responseEntries = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: `[main 9d4a812] fix(ci): correct step indentation in ci.yml
 1 file changed, 1 insertion(+), 1 deletion(-)
Pushing to remote origin/main...`,
          timestamp: time
        },
        {
          id: `out-${Date.now()}-2`,
          type: "success",
          text: `✔ Workflow Run #412: SUCCESSFUL! All 6 CI stages completed green. Deployment live.`,
          timestamp: time
        }
      ];
    } else {
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `Executed: "${cmd}". (Hint: Try running "git status", "cat .github/workflows/ci.yml", or "help")`,
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
        missionTitle="Failed CI/CD Pipeline"
        incidentLevel="PIPELINE FAILED"
        incidentLevelBadgeClass="bg-purple-500/15 text-purple-400 border-purple-500/30"
        pulseDotColor="bg-purple-400"
        incidentSubtitle="YAML syntax indentation error in deployment job"
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
                <Workflow className="w-5 h-5 text-purple-400" /> Incident Briefing
              </h2>
              <span className="text-xs font-mono text-muted-foreground">ID: CICD-5109</span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The automated production delivery pipeline halted abruptly on the latest merge commit.
              A YAML formatting error prevents the GitHub Actions runner from parsing the workflow file, blocking all releases.
            </p>

            {/* Topology / Workflow Metadata Box */}
            <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Repository:</span>
                <span className="text-foreground font-semibold">devops-academy/payment-core</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Branch:</span>
                <span className="text-purple-400 font-semibold">main</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Workflow File:</span>
                <span className="text-foreground font-semibold">.github/workflows/ci.yml</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Pipeline Status:</span>
                <span className={cn("font-bold flex items-center gap-1", isPushed ? "text-green-400" : "text-purple-400")}>
                  <Radio className="w-3 h-3 animate-pulse" />
                  {isPushed ? "ALL JOBS GREEN (DEPLOYED)" : "SCHEMA PARSER REJECTED (FAILED)"}
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
            title="CI/CD Triage Objectives"
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
            promptUser="devops@ci-runner:~/payment-core$"
            sessionTitle="devops@ci-runner:~/payment-core (main)"
            sessionBadge="GIT TERMINAL"
            quickCommands={QUICK_COMMANDS}
            terminalEndRef={terminalEndRef}
            terminalInputRef={terminalInputRef}
          />

          {/* CI/CD Runbook Advice Strip */}
          <div className="p-4 rounded-xl border border-border bg-card/60 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">GitHub Actions Rule: Step Hierarchy</p>
                <p className="text-muted-foreground text-[11px]">
                  Every step key (`name`, `uses`, `run`, `env`) must share identical indentation level inside `steps:`.
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
        title="CI/CD Pipeline Hints & Guidance"
        subtitle="Troubleshooting GitHub Actions YAML schema errors"
      />

      {/* ─── REUSABLE MISSION DEBRIEF / VICTORY MODAL ─── */}
      <MissionDebriefModal
        isOpen={showVictoryModal}
        missionTitle="Failed CI/CD Pipeline"
        incidentSubtitle="corrected YAML step indentation and unblocked production release"
        slaBadge="RELEASE PIPELINE PASSING // 100% RELIABLE"
        xpGained={200}
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
