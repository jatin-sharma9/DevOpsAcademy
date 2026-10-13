import React, { useState, useEffect, useRef } from "react";
import {
  Flame,
  FileText,
  Radio
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
    title: "Inspect Nginx Ingress Error Logs",
    description: "Check the reverse proxy log buffer to isolate why clients are receiving HTTP 502 Bad Gateway.",
    commandSnippet: "journalctl -u nginx.service -n 20 --no-pager",
    completed: false
  },
  {
    id: "obj-2",
    title: "Audit Listening Ports & Sockets",
    description: "Verify whether the upstream backend API daemon is bound and listening on port 8080.",
    commandSnippet: "ss -tulpn | grep 8080",
    completed: false
  },
  {
    id: "obj-3",
    title: "Diagnose Backend Daemon Status",
    description: "Check the systemd service state of the core application process.",
    commandSnippet: "systemctl status backend-api",
    completed: false
  },
  {
    id: "obj-4",
    title: "Recover & Restart Upstream Service",
    description: "Restart the crashed backend-api unit and confirm process initialization.",
    commandSnippet: "systemctl restart backend-api",
    completed: false
  },
  {
    id: "obj-5",
    title: "Verify Health Check & Ingress SLA",
    description: "Test upstream health directly, reload Nginx proxy, and verify public HTTP 200 OK.",
    commandSnippet: "curl -I http://localhost:8080/healthz",
    completed: false
  }
];

const HINTS: MissionHint[] = [
  {
    level: 1,
    title: "Symptom Isolation (502 Bad Gateway)",
    content: "HTTP 502 means Nginx itself is running, but cannot establish a TCP connection with the upstream application server. Run `journalctl -u nginx.service -n 20 --no-pager` to inspect the exact upstream socket and error code."
  },
  {
    level: 2,
    title: "Socket & Service Inspection",
    content: "The logs show `connect() failed (111: Connection refused) while connecting to upstream 127.0.0.1:8080`. Check if anything is listening on port 8080 with `ss -tulpn | grep 8080`, then investigate why `backend-api` died with `systemctl status backend-api`."
  },
  {
    level: 3,
    title: "Service Remediation & Recovery Runbook",
    content: "Restart the failed application with `systemctl restart backend-api`. Verify it returns HTTP 200 with `curl -I http://localhost:8080/healthz`, then reload the ingress proxy via `systemctl reload nginx` and check `curl -I http://localhost/healthz`."
  }
];

const QUICK_COMMANDS = [
  "journalctl -u nginx.service -n 20",
  "ss -tulpn | grep 8080",
  "systemctl status backend-api",
  "systemctl restart backend-api",
  "curl -I http://localhost:8080/healthz",
  "systemctl reload nginx",
  "curl -I http://localhost/healthz"
];

const POST_MORTEM_ITEMS: PostMortemItem[] = [
  {
    title: "Root Cause",
    content: "Upstream worker crashed when Redis connection pool exhausted. Port 8080 was orphaned."
  },
  {
    title: "Mitigation",
    content: "Service restarted, connection pools drained, and Nginx proxy buffer reloaded."
  }
];

export default function ProductionDownMissionPage() {
  const [objectives, setObjectives] = useState<MissionObjective[]>(INITIAL_OBJECTIVES);
  const [terminalInput, setTerminalInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hintLevel, setHintLevel] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [uptimeRecovered, setUptimeRecovered] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: "init-1",
      type: "system",
      text: "[SYSTEM // BASTION KERNEL 5.15.0-1034-aws // PROD-US-EAST-1A]",
      timestamp: "10:30:00"
    },
    {
      id: "init-2",
      type: "error",
      text: "🚨 P1 ALERT TRIGGERED: Ingress proxy health check failed. Synthetic probe: 502 Bad Gateway. Error budget burn rate: 14.2x.",
      timestamp: "10:30:01"
    },
    {
      id: "init-3",
      type: "system",
      text: 'Type "help" to view diagnostic commands, or click any recommended command below to inspect the cluster.',
      timestamp: "10:30:02"
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
          text: `AVAILABLE SRE INCIDENT COMMANDS:
  journalctl -u nginx.service -n 20   Inspect Nginx reverse proxy logs
  ss -tulpn | grep 8080               Audit listening TCP sockets on port 8080
  systemctl status backend-api        Check application daemon status
  systemctl restart backend-api       Restart crashed backend application
  curl -I http://localhost:8080/healthz Test backend HTTP health endpoint
  systemctl reload nginx              Reload reverse proxy configuration
  curl -I http://localhost/healthz    Verify public ingress health endpoint
  clear                               Clear terminal screen`,
          timestamp: time
        }
      ];
    } else if (lowerCmd.includes("journalctl") && lowerCmd.includes("nginx")) {
      markObjectiveComplete("obj-1");
      responseEntries = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: `Oct 08 10:29:48 ingress-01 nginx[1420]: 2026/10/08 10:29:48 [error] 1420#1420: *41922 connect() failed (111: Connection refused) while connecting to upstream, client: 198.51.100.24, server: api.devopsacademy.io, request: "GET /api/v1/checkout HTTP/1.1", upstream: "http://127.0.0.1:8080/api/v1/checkout", host: "api.devopsacademy.io"`,
          timestamp: time
        },
        {
          id: `out-${Date.now()}-2`,
          type: "error",
          text: `[ROOT CAUSE DETECTED]: Nginx proxy is actively failing to connect to upstream port 8080 (Connection refused).`,
          timestamp: time
        }
      ];
    } else if (
      (lowerCmd.includes("ss") || lowerCmd.includes("netstat")) &&
      lowerCmd.includes("8080")
    ) {
      markObjectiveComplete("obj-2");
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `State    Recv-Q   Send-Q     Local Address:Port     Peer Address:Port    Process
(No sockets listening on port 8080)
[WARN]: Port 8080 is dormant. No process is bound to TCP port 8080.`,
          timestamp: time
        }
      ];
    } else if (
      lowerCmd.includes("systemctl status") &&
      lowerCmd.includes("backend-api")
    ) {
      markObjectiveComplete("obj-3");
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `● backend-api.service - Production Checkout & Payment Gateway API
     Loaded: loaded (/etc/systemd/system/backend-api.service; enabled; vendor preset: enabled)
     Active: failed (Result: exit-code) since Tue 2026-10-08 10:28:12 UTC; 2min ago
    Process: 24018 ExecStart=/usr/local/bin/node /opt/app/server.js (code=exited, status=1/FAILURE)
   Main PID: 24018 (code=exited, status=1/FAILURE)

Oct 08 10:28:12 ingress-01 node[24018]: Error: Unhandled promise rejection: Redis connection pool exhausted
Oct 08 10:28:12 ingress-01 systemd[1]: backend-api.service: Main process exited, code=exited, status=1/FAILURE
Oct 08 10:28:12 ingress-01 systemd[1]: backend-api.service: Failed with result 'exit-code'.`,
          timestamp: time
        }
      ];
    } else if (
      (lowerCmd.includes("systemctl restart") || lowerCmd.includes("systemctl start")) &&
      lowerCmd.includes("backend-api")
    ) {
      markObjectiveComplete("obj-4");
      responseEntries = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: `[  OK  ] Stopped Production Checkout & Payment Gateway API.
[  OK  ] Started Production Checkout & Payment Gateway API.
Binding TCP socket 127.0.0.1:8080... Listening for upstream traffic.`,
          timestamp: time
        },
        {
          id: `out-${Date.now()}-2`,
          type: "success",
          text: `✔ backend-api.service restarted successfully. Worker PID: 31084.`,
          timestamp: time
        }
      ];
    } else if (
      lowerCmd.includes("curl") &&
      lowerCmd.includes("8080")
    ) {
      markObjectiveComplete("obj-5");
      setUptimeRecovered(true);
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "success",
          text: `HTTP/1.1 200 OK
Date: Tue, 08 Oct 2026 10:32:04 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 48
Connection: keep-alive

{"status":"healthy","service":"payment-api","version":"v2.4.1"}`,
          timestamp: time
        }
      ];
    } else if (
      lowerCmd.includes("systemctl reload") &&
      lowerCmd.includes("nginx")
    ) {
      markObjectiveComplete("obj-5");
      setUptimeRecovered(true);
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "success",
          text: `[  OK  ] Reloaded A high performance web server and a reverse proxy server.
Configuration test: /etc/nginx/nginx.conf syntax is ok, test is successful.`,
          timestamp: time
        }
      ];
    } else if (
      lowerCmd.includes("curl") &&
      (lowerCmd.includes("localhost/healthz") || lowerCmd.includes("api.devopsacademy.io"))
    ) {
      markObjectiveComplete("obj-5");
      setUptimeRecovered(true);
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "success",
          text: `HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Date: Tue, 08 Oct 2026 10:32:15 GMT
Content-Type: application/json
Connection: keep-alive
X-Upstream-Response-Time: 0.004

{"status":"OK","gateway":"ingress-nginx-01","upstream_latency":"4ms"}`,
          timestamp: time
        }
      ];
    } else {
      responseEntries = [
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `Executed: "${cmd}". No errors reported. (Hint: Try running "journalctl -u nginx.service -n 20" or "help")`,
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
      toast.warning("Complete all 5 triage objectives to achieve full resolution!");
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
        missionTitle="Production Down: 502 Outage"
        incidentLevel="P1 CRITICAL"
        incidentLevelBadgeClass="bg-red-500/15 text-red-400 border-red-500/30"
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
                <Flame className="w-5 h-5 text-red-500" /> Incident Briefing
              </h2>
              <span className="text-xs font-mono text-muted-foreground">ID: INC-9204</span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              At 10:28 UTC, production ingress proxies began shedding incoming user requests.
              Customers attempting to complete purchases receive continuous <strong>502 Bad Gateway</strong> responses.
              The SRE error budget for the current window is 85% depleted.
            </p>

            {/* Topology / Telemetry Box */}
            <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Ingress Domain:</span>
                <span className="text-foreground font-semibold">api.devopsacademy.io</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Frontline Proxy:</span>
                <span className="text-primary font-semibold">nginx/1.24 (Port 80/443)</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Upstream Service:</span>
                <span className="text-foreground font-semibold">backend-api (Port 8080)</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Cluster Health:</span>
                <span className={cn("font-bold flex items-center gap-1", uptimeRecovered ? "text-green-400" : "text-red-400")}>
                  <Radio className="w-3 h-3 animate-pulse" />
                  {uptimeRecovered ? "TRAFFIC RESTORED (200 OK)" : "DEGRADED (502 ERRORS)"}
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
            promptUser="sre@prod-bastion:~$"
            sessionTitle="sre@prod-bastion-01:~"
            sessionBadge="LIVE SESSION"
            quickCommands={QUICK_COMMANDS}
            terminalEndRef={terminalEndRef}
            terminalInputRef={terminalInputRef}
          />

          {/* Incident Runbook Advice Strip */}
          <div className="p-4 rounded-xl border border-border bg-card/60 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Standard SRE Outage Protocol</p>
                <p className="text-muted-foreground text-[11px]">
                  Triage error logs → Verify socket listeners → Restart dead worker → Validate upstream → Reload ingress.
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
      />

      {/* ─── REUSABLE MISSION DEBRIEF / VICTORY MODAL ─── */}
      <MissionDebriefModal
        isOpen={showVictoryModal}
        missionTitle="Production Down"
        incidentSubtitle="resolved the ingress proxy 502 outage"
        slaBadge="SLA FULLY RESTORED // 0% ERROR RATE"
        xpGained={350}
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
