import React, { useState, useEffect, useRef } from "react";
import {
  RefreshCw,
  Server,
  Radio,
  FileCode,
  ShieldAlert,
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
    title: "Check Pod Status",
    description: "Query cluster workloads to observe failing pod lifecycle and restart counts.",
    commandSnippet: "kubectl get pods",
    completed: false
  },
  {
    id: "obj-2",
    title: "Describe the Pod",
    description: "Audit kubelet scheduler events and termination exit codes in the pod spec.",
    commandSnippet: "kubectl describe pod payment-processor",
    completed: false
  },
  {
    id: "obj-3",
    title: "Inspect Container Logs",
    description: "Fetch container stdout and stderr to view application-level crash exceptions.",
    commandSnippet: "kubectl logs payment-processor",
    completed: false
  },
  {
    id: "obj-4",
    title: "Identify the Root Cause",
    description: "Inspect cluster events and manifest specs to isolate missing environment secrets.",
    commandSnippet: "kubectl get events --sort-by=.metadata.creationTimestamp",
    completed: false
  },
  {
    id: "obj-5",
    title: "Fix the Configuration",
    description: "Apply patched Kubernetes deployment manifest with correct DATABASE_URL secret binding.",
    commandSnippet: "kubectl apply -f deployment-fix.yaml",
    completed: false
  },
  {
    id: "obj-6",
    title: "Verify the Pod is Running",
    description: "Confirm all deployment replicas transition to 1/1 Running with healthy liveness probes.",
    commandSnippet: "kubectl get pods",
    completed: false
  }
];

const HINTS: MissionHint[] = [
  {
    level: 1,
    title: "Diagnosing CrashLoopBackOff",
    content: "Run `kubectl get pods` to identify the failing pod name, then execute `kubectl describe pod payment-processor` to review container Exit Code and recent kubelet events."
  },
  {
    level: 2,
    title: "Investigating Container Stderr",
    content: "The pod terminates with Exit Code 1. Run `kubectl logs payment-processor` to inspect stdout/stderr. Notice the fatal error: `Environment variable DATABASE_URL is missing or empty!`"
  },
  {
    level: 3,
    title: "Manifest Remediation & Rolling Update",
    content: "Run `kubectl get events` to verify configuration references. Apply the corrected deployment manifest containing the proper `payment-db-secret` key mapping via `kubectl apply -f deployment-fix.yaml`, then verify with `kubectl get pods`."
  }
];

const QUICK_COMMANDS = [
  "kubectl get pods",
  "kubectl describe pod payment-processor",
  "kubectl logs payment-processor",
  "kubectl get events",
  "kubectl apply -f deployment-fix.yaml",
  "cat deployment.yaml"
];

const POST_MORTEM_ITEMS: PostMortemItem[] = [
  {
    title: "Root Cause",
    content: "The Deployment manifest referenced secret key `DB_URI` instead of `DATABASE_URL`. The microservice threw an unhandled null exception during boot and exited with code 1."
  },
  {
    title: "Mitigation",
    content: "Updated Deployment environment block with correct `secretKeyRef` mapping and re-applied manifest via `kubectl apply -f`."
  },
  {
    title: "Prevention",
    content: "Enforced Kubeval/Kyverno admission controllers to validate required secret bindings prior to deployment rollout."
  }
];

export default function KubernetesCrashLoopMissionPage() {
  const [objectives, setObjectives] = useState<MissionObjective[]>(INITIAL_OBJECTIVES);
  const [terminalInput, setTerminalInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hintLevel, setHintLevel] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [isConfigFixed, setIsConfigFixed] = useState(false);
  const [isPodRecovered, setIsPodRecovered] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: "init-1",
      type: "system",
      text: "[CLUSTER: k8s-prod-us-east-1 // KUBECTL CLIENT v1.30.2 // CONTEXT: prod-cluster]",
      timestamp: "11:15:00"
    },
    {
      id: "init-2",
      type: "error",
      text: "🚨 CLUSTER EVENT: Deployment 'payment-processor' has 0/2 available replicas. Pods stuck in CrashLoopBackOff.",
      timestamp: "11:15:01"
    },
    {
      id: "init-3",
      type: "system",
      text: 'Type "help" or click any recommended kubectl command below to inspect cluster resources and recover the workload.',
      timestamp: "11:15:02"
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
          text: `AVAILABLE KUBERNETES INCIDENT COMMANDS:
  kubectl get pods                          Query pods in current namespace
  kubectl describe pod [name]               Inspect pod specifications & events
  kubectl logs [name]                       Fetch container stdout and stderr
  kubectl get events                        Inspect recent cluster warning events
  cat deployment.yaml                       View deployment manifest
  kubectl apply -f deployment-fix.yaml      Apply configuration fix manifest
  clear                                     Clear terminal screen`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.startsWith("kubectl get pod") || lowerCmd === "kubectl get po") {
      if (isConfigFixed) {
        markObjectiveComplete("obj-6");
        setIsPodRecovered(true);
        responseEntries = [
          {
            id: `out-${Date.now()}-1`,
            type: "output",
            text: `NAME                                   READY   STATUS    RESTARTS   AGE
payment-processor-6c84f67cb4-m2w9p     1/1     Running   0          34s
payment-processor-6c84f67cb4-q8v1x     1/1     Running   0          31s
redis-master-0                         1/1     Running   0          4d`,
            timestamp: time
          },
          {
            id: `out-${Date.now()}-2`,
            type: "success",
            text: `✔ Deployment payment-processor is 2/2 READY. Zero restarts reported. Health checks passing HTTP 200.`,
            timestamp: time
          }
        ];
      } else {
        markObjectiveComplete("obj-1");
        responseEntries = [
          {
            id: `out-${Date.now()}-1`,
            type: "output",
            text: `NAME                                   READY   STATUS             RESTARTS      AGE
payment-processor-789d97bf9b-k8x7m     0/1     CrashLoopBackOff   6 (48s ago)   14m
payment-processor-789d97bf9b-j4q2z     0/1     CrashLoopBackOff   6 (32s ago)   14m
redis-master-0                         1/1     Running            0             4d`,
            timestamp: time
          },
          {
            id: `out-${Date.now()}-2`,
            type: "error",
            text: `[ALERT]: 2 pods in CrashLoopBackOff! Exit codes: 1. Containers continuously terminating.`,
            timestamp: time
          }
        ];
      }
    } else if (lowerCmd.startsWith("kubectl describe pod")) {
      markObjectiveComplete("obj-2");
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `Name:             payment-processor-789d97bf9b-k8x7m
Namespace:        production
Priority:         0
Node:             node-worker-02/10.240.0.14
Start Time:       Tue, 08 Oct 2026 11:01:12 UTC
Labels:           app=payment-processor
                  pod-template-hash=789d97bf9b
Status:           Running
Controlled By:    ReplicaSet/payment-processor-789d97bf9b
Containers:
  payment-processor:
    Container ID:   containerd://e32f041b8a21
    Image:          registry.k8s.io/payment-processor:v2.1
    Image ID:       registry.k8s.io/payment-processor@sha256:7c92a
    Port:           8080/TCP
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
      Started:      Tue, 08 Oct 2026 11:14:10 UTC
      Finished:     Tue, 08 Oct 2026 11:14:11 UTC
    Ready:          False
    Restart Count:  6
    Environment:
      DATABASE_URL:  <set to the key 'DB_URI' in secret 'payment-db-secret'>
Events:
  Type     Reason     Age                   From               Message
  ----     ------     ----                  ----               -------
  Normal   Scheduled  14m                   default-scheduler  Successfully assigned production/payment-processor-... to node-worker-02
  Normal   Pulled     14m                   kubelet            Container image "registry.k8s.io/payment-processor:v2.1" already present on machine
  Normal   Created    14m                   kubelet            Created container payment-processor
  Normal   Started    14m                   kubelet            Started container payment-processor
  Warning  BackOff    2m (x32 over 14m)     kubelet            Back-off restarting failed container payment-processor in pod payment-processor-...`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.startsWith("kubectl logs") || lowerCmd.startsWith("kubectl log")) {
      markObjectiveComplete("obj-3");
      responseEntries = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: `[2026-10-08 11:14:10.892] [INFO] [init] Booting Payment Gateway Service v2.1...
[2026-10-08 11:14:10.904] [INFO] [config] Loading environment variables from process.env...
[2026-10-08 11:14:10.912] [FATAL] [config] Failed to initialize payment gateway client!
Error: Environment variable DATABASE_URL is missing or empty!
    at validateConfig (/app/dist/config.js:42:15)
    at initializeServer (/app/dist/server.js:18:24)
    at Module._compile (node:internal/modules/cjs/loader:1358:14)
[FATAL] Required parameter DATABASE_URL cannot be undefined. Process exiting with code 1.`,
          timestamp: time
        },
        {
          id: `out-${Date.now()}-2`,
          type: "error",
          text: `[ROOT CAUSE IDENTIFIED]: Application expects 'DATABASE_URL', but secret binding references non-existent key 'DB_URI'.`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.startsWith("kubectl get event") || lowerCmd.startsWith("kubectl get events")) {
      markObjectiveComplete("obj-4");
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `LAST SEEN   TYPE      REASON      OBJECT                                            MESSAGE
45s         Warning   BackOff     pod/payment-processor-789d97bf9b-k8x7m            Back-off restarting failed container
32s         Warning   BackOff     pod/payment-processor-789d97bf9b-j4q2z            Back-off restarting failed container
2m          Warning   FailedSync  pod/payment-processor-789d97bf9b-k8x7m            Error syncing pod: container exited with code 1
5m          Normal    Scaling     deployment/payment-processor                      Scaled up replica set payment-processor-789d97bf9b to 2`,
          timestamp: time
        }
      ];
    } else if (lowerCmd === "cat deployment.yaml" || lowerCmd === "cat deployment-fix.yaml") {
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-processor
  namespace: production
spec:
  replicas: 2
  selector:
    matchLabels:
      app: payment-processor
  template:
    metadata:
      labels:
        app: payment-processor
    spec:
      containers:
      - name: payment-processor
        image: registry.k8s.io/payment-processor:v2.1
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: payment-db-secret
              key: ${isConfigFixed ? "DATABASE_URL" : "DB_URI  # <-- BUG: Key in secret is DATABASE_URL"}`,
          timestamp: time
        }
      ];
    } else if (
      lowerCmd.includes("kubectl apply") ||
      lowerCmd.includes("apply -f") ||
      lowerCmd === "fix-deployment"
    ) {
      markObjectiveComplete("obj-5");
      setIsConfigFixed(true);
      responseEntries = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: `deployment.apps/payment-processor configured
secret/payment-db-secret unchanged
[ROLLOUT]: Triggering rolling replacement...
Terminating: payment-processor-789d97bf9b-k8x7m
Creating:    payment-processor-6c84f67cb4-m2w9p
Creating:    payment-processor-6c84f67cb4-q8v1x`,
          timestamp: time
        },
        {
          id: `out-${Date.now()}-2`,
          type: "success",
          text: `✔ Secret mapping updated: DATABASE_URL -> payment-db-secret[DATABASE_URL].
Next step: Verify pods with "kubectl get pods"`,
          timestamp: time
        }
      ];
    } else {
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `Executed: "${cmd}". (Hint: Try "kubectl get pods", "kubectl describe pod payment-processor", "kubectl logs payment-processor", or "help")`,
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
        missionTitle="Kubernetes CrashLoop"
        incidentLevel="CRASHLOOP DETECTED"
        incidentLevelBadgeClass="bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
        pulseDotColor="bg-yellow-400"
        incidentSubtitle="exit code 1 / missing secret mapping"
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
                <RefreshCw className="w-5 h-5 text-yellow-400" /> Incident Briefing
              </h2>
              <span className="text-xs font-mono text-muted-foreground">ID: K8S-4019</span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The <strong>payment-processor</strong> microservice pods in the production namespace are failing to boot.
              Kubelet continuously restarts the containers with back-off delay, resulting in <strong>CrashLoopBackOff</strong> and degraded user transactions.
            </p>

            {/* Topology / Workload Metadata Box */}
            <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Workload:</span>
                <span className="text-foreground font-semibold">Deployment/payment-processor</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Namespace:</span>
                <span className="text-yellow-400 font-semibold">production</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Cluster Context:</span>
                <span className="text-foreground font-semibold">k8s-prod-us-east-1</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Pod Health:</span>
                <span className={cn("font-bold flex items-center gap-1", isPodRecovered ? "text-green-400" : "text-yellow-400")}>
                  <Radio className="w-3 h-3 animate-pulse" />
                  {isPodRecovered ? "2/2 REPLICAS RUNNING (HEALTHY)" : "0/2 REPLICAS CRASHLOOPING"}
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
            title="Kubernetes Triage Objectives"
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
            promptUser="sre@k8s-control:~$"
            sessionTitle="sre@k8s-control-plane:~/manifests"
            sessionBadge="KUBECTL SHELL"
            quickCommands={QUICK_COMMANDS}
            terminalEndRef={terminalEndRef}
            terminalInputRef={terminalInputRef}
          />

          {/* Kubernetes Runbook Advice Strip */}
          <div className="p-4 rounded-xl border border-border bg-card/60 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">K8s Runbook: CrashLoopBackOff Troubleshooting</p>
                <p className="text-muted-foreground text-[11px]">
                  Check status (`get pods`) → Examine exit code & events (`describe pod`) → Inspect stderr (`logs`) → Fix manifest & apply.
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
        title="Kubernetes CrashLoop Hints & Guidance"
        subtitle="Troubleshooting pod restarts and secret references"
      />

      {/* ─── REUSABLE MISSION DEBRIEF / VICTORY MODAL ─── */}
      <MissionDebriefModal
        isOpen={showVictoryModal}
        missionTitle="Kubernetes CrashLoop"
        incidentSubtitle="repaired deployment secret mapping and restored 2/2 running pods"
        slaBadge="POD WORKLOAD RESTORED // 100% HEALTHY"
        xpGained={250}
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
