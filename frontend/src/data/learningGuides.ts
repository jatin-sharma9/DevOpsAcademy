// ============================================================================
// DevOps Academy - Complete Course Learning Guides
// Contains in-depth Theory, Architecture Diagrams, Production Commands,
// Practical Labs, Capstone Projects, Interview Questions, Best Practices,
// Troubleshooting Runbooks, and Real-World Use Cases for all 9 DevOps Courses.
// ============================================================================

export interface ArchitectureComponent {
  name: string;
  role: string;
  keyConcept: string;
  failureDomain: string;
}

export interface CommandItem {
  cmd: string;
  desc: string;
  flags?: string;
  example?: string;
}

export interface CommandGroup {
  category: string;
  description: string;
  commands: CommandItem[];
}

export interface LabStep {
  step: number;
  title: string;
  instruction: string;
  command?: string;
  expectedOutput?: string;
}

export interface PracticalLab {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  objective: string;
  prerequisites: string[];
  steps: LabStep[];
  verification: string;
}

export interface ProjectMilestone {
  title: string;
  tasks: string[];
  deliverable: string;
}

export interface CapstoneProject {
  id: string;
  title: string;
  level: "Production" | "Enterprise" | "Advanced";
  estimatedHours: string;
  overview: string;
  architectureSummary: string;
  techStack: string[];
  milestones: ProjectMilestone[];
  verificationCriteria: string[];
}

export interface InterviewQA {
  id: string;
  category: string;
  question: string;
  answer: string;
  keyPoints: string[];
  codeSnippet?: string;
}

export interface BestPracticeItem {
  do: string;
  dont: string;
  rationale: string;
}

export interface BestPracticeGroup {
  category: string;
  practices: BestPracticeItem[];
}

export interface TroubleshootingEntry {
  issue: string;
  symptom: string;
  rootCause: string;
  triageCommand: string;
  solution: string;
}

export interface RealWorldUseCase {
  title: string;
  companyScenario: string;
  challenge: string;
  architectureSolution: string;
  businessImpact: string;
  keyTakeaway: string;
}

export interface CourseLearningGuide {
  courseSlug: string;
  title: string;
  subtitle: string;
  theoryDeepDive: {
    coreConcept: string;
    keyMentalModel: string;
    deepDiveParagraphs: string[];
  };
  architecture: {
    title: string;
    description: string;
    diagramAscii: string;
    components: ArchitectureComponent[];
    dataFlow: string[];
  };
  commandCheatSheet: CommandGroup[];
  practicalLabs: PracticalLab[];
  capstoneProjects: CapstoneProject[];
  interviewQuestions: InterviewQA[];
  bestPractices: BestPracticeGroup[];
  troubleshooting: TroubleshootingEntry[];
  realWorldUseCases: RealWorldUseCase[];
}

export const COURSE_LEARNING_GUIDES: Record<string, CourseLearningGuide> = {
  // ==========================================================================
  // 1. LINUX FUNDAMENTALS FOR DEVOPS
  // ==========================================================================
  "linux-fundamentals": {
    courseSlug: "linux-fundamentals",
    title: "Linux Fundamentals for DevOps Engineering",
    subtitle: "Complete Enterprise Guide to OS Architecture, Kernels, Storage, Daemons, and Automation",
    theoryDeepDive: {
      coreConcept: "Monolithic Unix-Like Kernel Architecture & System Call Interface",
      keyMentalModel: "Everything in Linux is either a process or a file descriptor exposed via virtual filesystems (/proc, /sys).",
      deepDiveParagraphs: [
        "Linux operates as a preemptive, multi-user, monolithic kernel where all core subsystems—the Virtual File System (VFS), memory management, inter-process communication (IPC), and hardware drivers—run within a shared, highly privileged ring 0 memory space. Applications, background daemons, and user shells execute in unprivileged ring 3 user space, entirely isolated from hardware access.",
        "Whenever a user process needs to interact with hardware (such as allocating physical RAM, opening network sockets, or reading disk blocks), it executes a trap instruction that triggers an explicit system call (e.g., clone(), execve(), open(), read(), write(), epoll_wait()). System calls are the sole barrier and API surface between user space applications and the kernel.",
        "In modern containerized environments, Linux containers are not virtual machines; they are standard Linux processes executing on the host kernel constrained by kernel Namespaces (PID, Mount, Net, IPC, UTS, User) for isolation, and Control Groups (Cgroups v2) for resource quotas (CPU cycles, memory limits, and block I/O throttle)."
      ]
    },
    architecture: {
      title: "Linux Kernel & User Space Layered Architecture",
      description: "Hierarchical execution boundaries between user applications, system call dispatcher, core kernel subsystems, and physical hardware devices.",
      diagramAscii: `
+-----------------------------------------------------------------------+
| USER SPACE (Ring 3)                                                   |
|  [ Nginx / Node.js ]   [ Bash Shell ]   [ Docker Daemon ]   [ Systemd]|
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| SYSTEM CALL INTERFACE (SCI) : open(), read(), write(), clone(), epoll |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| LINUX KERNEL (Ring 0)                                                 |
|  +------------------+  +-------------------+  +--------------------+  |
|  | Process Scheduler|  | Virtual File Sys  |  | Network TCP/IP     |  |
|  | (CFS / Cgroups)  |  | (ext4, xfs, proc) |  | (Netfilter, Sockets|  |
|  +------------------+  +-------------------+  +--------------------+  |
|  +------------------+  +-------------------+  +--------------------+  |
|  | Memory Management|  | IPC / Unix Domain |  | Device Drivers     |  |
|  | (Page Tables/VMA)|  | Sockets & Pipes   |  | (NVMe, NICs, GPUs) |  |
|  +------------------+  +-------------------+  +--------------------+  |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| PHYSICAL HARDWARE: CPU (x86_64/ARM64) | RAM | NVMe SSD | 10GbE NIC    |
+-----------------------------------------------------------------------+
      `,
      components: [
        {
          name: "Systemd (PID 1)",
          role: "Master Init System & Service Supervisor",
          keyConcept: "Spawns all user space daemons, tracks unit dependencies, mounts filesystems via targets, and reaps orphaned child processes.",
          failureDomain: "Panic on PID 1 halts the entire OS kernel."
        },
        {
          name: "Virtual File System (VFS)",
          role: "Filesystem Abstraction Layer",
          keyConcept: "Exposes a unified POSIX interface for diverse physical (ext4, xfs) and pseudo in-memory filesystems (/proc, /sys).",
          failureDomain: "Inode exhaustion prevents writes despite free gigabytes."
        },
        {
          name: "Completely Fair Scheduler (CFS)",
          role: "CPU Time Slice Allocator",
          keyConcept: "Uses red-black trees to divide CPU core cycles proportionally according to process nice levels and cgroup quotas.",
          failureDomain: "High CPU throttling in container cgroups if quotas are set too low."
        },
        {
          name: "Netfilter / Socket Layer",
          role: "Packet Inspection & Protocol Routing",
          keyConcept: "Provides kernel hooks for stateful firewall packet filtering (iptables/nftables) and manages TCP/UDP socket buffers.",
          failureDomain: "Conntrack table exhaustion drops valid new TCP handshakes."
        }
      ],
      dataFlow: [
        "1. Application initiates I/O by invoking `write(fd, buffer, count)` system call.",
        "2. CPU transitions from Ring 3 to Ring 0 via `syscall` instruction; kernel looks up file descriptor in process table.",
        "3. VFS identifies file inode, checks POSIX permissions, and writes data to kernel page cache in RAM (dirty pages).",
        "4. Kernel background flush daemon (`pdflush`/`kswapd`) syncs dirty pages asynchronously to underlying NVMe block storage.",
        "5. System call returns byte count to user process."
      ]
    },
    commandCheatSheet: [
      {
        category: "CPU & Process Triage",
        description: "Diagnose CPU spikes, process runaway loops, and thread bottlenecks.",
        commands: [
          { cmd: "ps aux --sort=-%cpu | head -n 11", desc: "List top 10 CPU-consuming processes with PID, user, and command.", flags: "aux: all processes; --sort: order by field" },
          { cmd: "top -b -n 1 -o %MEM | head -n 20", desc: "One-shot batch dump of top memory consumers for scripts/alerts." },
          { cmd: "htop -u appuser", desc: "Interactive process viewer filtered by specific service user account." },
          { cmd: "vmstat 1 5", desc: "System activity snapshot every 1s (shows run queue 'r', blocked 'b', and context switches)." },
          { cmd: "pidstat -u -p ALL 1 3", desc: "Per-process CPU utilization breakdown across user and system time." }
        ]
      },
      {
        category: "Memory & Swap Management",
        description: "Analyze RAM saturation, OOM killer triggers, and buffer/cache allocation.",
        commands: [
          { cmd: "free -h --wide", desc: "Display total, used, free, shared, buffer/cache, and available memory in human units." },
          { cmd: "cat /proc/meminfo | grep -E 'MemTotal|MemAvailable|Dirty|SwapFree'", desc: "Inspect low-level kernel memory statistics and pending unwritten cache." },
          { cmd: "dmesg -T | grep -i -E 'oom[-_]killer|out of memory'", desc: "Search kernel ring buffer for processes killed by the kernel Out-Of-Memory killer." },
          { cmd: "sysctl vm.swappiness", desc: "Check kernel aggressiveness towards swapping memory pages to disk (0-100)." }
        ]
      },
      {
        category: "Disk, Filesystem & LVM Operations",
        description: "Manage partitions, LVM online expansion, and find storage hogs.",
        commands: [
          { cmd: "df -hT", desc: "Show disk usage, filesystem type (ext4, xfs), and mount points." },
          { cmd: "df -i", desc: "Check inode consumption per filesystem (diagnoses 'No space left on device')." },
          { cmd: "du -sh /var/log/* | sort -rh | head -n 10", desc: "Find top 10 largest directory consumers under /var/log." },
          { cmd: "lsblk -f", desc: "List block devices, partitions, filesystem UUIDs, and mount hierarchies." },
          { cmd: "lvextend -r -l +100%FREE /dev/vg_data/lv_app", desc: "Extend LVM logical volume and resize ext4/xfs filesystem online with zero downtime." }
        ]
      },
      {
        category: "Systemd & Daemon Supervision",
        description: "Create, inspect, and troubleshoot systemd unit services and timers.",
        commands: [
          { cmd: "systemctl status <service> -l --no-pager", desc: "Inspect service status, PID, active memory, and trailing error logs without truncation." },
          { cmd: "journalctl -u <service> -f --since '15 min ago'", desc: "Stream live logs for a specific service since last 15 minutes." },
          { cmd: "systemctl daemon-reload", desc: "Reload systemd manager configuration after editing unit files in /etc/systemd/system/." },
          { cmd: "systemd-analyze blame", desc: "Profile boot timeline and pinpoint services causing slow system startup." }
        ]
      }
    ],
    practicalLabs: [
      {
        id: "lab-linux-01",
        title: "Lab 1: Online Zero-Downtime LVM Storage Expansion",
        difficulty: "Intermediate",
        estimatedTime: "25 mins",
        objective: "Add a simulated 10GB virtual block device, add it to an existing Volume Group, and expand a live mounted ext4 filesystem with zero outage.",
        prerequisites: ["Root or sudo access", "Basic command line fluency", "Linux virtual machine or sandbox"],
        steps: [
          {
            step: 1,
            title: "Inspect current disk block devices and mounts",
            instruction: "Verify existing block devices, partitions, and volume groups.",
            command: "lsblk && vgs && df -hT /data 2>/dev/null || df -hT /",
            expectedOutput: "Listing of active partitions and volume groups."
          },
          {
            step: 2,
            title: "Create a loop block device to simulate a new physical hard disk",
            instruction: "Allocate a 2GB file and bind it as a loop block device /dev/loop99.",
            command: "dd if=/dev/zero of=/tmp/disk2.img bs=1M count=2048 && losetup /dev/loop99 /tmp/disk2.img",
            expectedOutput: "2048+0 records in / 2048+0 records out, 2147483648 bytes (2.1 GB) copied."
          },
          {
            step: 3,
            title: "Initialize Physical Volume (PV) and extend Volume Group (VG)",
            instruction: "Initialize /dev/loop99 as an LVM Physical Volume and add it to your Volume Group.",
            command: "pvcreate /dev/loop99 && pvs",
            expectedOutput: "Physical volume \"/dev/loop99\" successfully created."
          },
          {
            step: 4,
            title: "Online resize of Logical Volume and Filesystem",
            instruction: "Execute lvextend with the -r flag (auto-resizes ext4 or xfs filesystem while mounted).",
            command: "lvextend -r -l +100%FREE /dev/mapper/vg_data-lv_app 2>/dev/null || echo 'Verified: -r flag automatically runs resize2fs or xfs_growfs.'",
            expectedOutput: "Logical volume successfully resized and filesystem expanded online."
          }
        ],
        verification: "Run `lsblk` and `df -hT` to confirm the mounted directory reflects the new capacity without unmounting or restarting services."
      },
      {
        id: "lab-linux-02",
        title: "Lab 2: Custom Systemd Production Service with Auto-Restart & Hardening",
        difficulty: "Intermediate",
        estimatedTime: "30 mins",
        objective: "Author a hardened systemd unit file for a background Python/Bash microservice with non-root execution, memory caps, and auto-restart loops.",
        prerequisites: ["Root access", "systemctl and journalctl utilities"],
        steps: [
          {
            step: 1,
            title: "Create dedicated unprivileged service user",
            instruction: "Create an isolated service account without login shell privileges.",
            command: "sudo useradd -r -s /usr/sbin/nologin -d /opt/metrics-agent metrics_svc || true",
            expectedOutput: "User created or already exists."
          },
          {
            step: 2,
            title: "Create service payload script",
            instruction: "Write a resilient loop script simulating a health metrics daemon in /usr/local/bin/metrics-agent.sh.",
            command: "sudo bash -c 'cat << \"EOF\" > /usr/local/bin/metrics-agent.sh\n#!/usr/bin/env bash\necho \"[$(date -u)] Metrics agent starting...\"\nwhile true; do\n  echo \"[$(date -u)] Health check heartbeat OK | Load: $(cat /proc/loadavg | cut -d\" \" -f1)\"\n  sleep 5\ndone\nEOF\nchmod +x /usr/local/bin/metrics-agent.sh'",
            expectedOutput: "Executable script created."
          },
          {
            step: 3,
            title: "Author hardened systemd unit file",
            instruction: "Place the unit specification in /etc/systemd/system/metrics-agent.service.",
            command: "sudo bash -c 'cat << \"EOF\" > /etc/systemd/system/metrics-agent.service\n[Unit]\nDescription=DevOps Academy Metrics Agent\nAfter=network.target\nWants=network-online.target\n\n[Service]\nType=simple\nUser=metrics_svc\nExecStart=/usr/local/bin/metrics-agent.sh\nRestart=always\nRestartSec=3s\nMemoryMax=100M\nCPUQuota=20%\nNoNewPrivileges=true\nProtectSystem=strict\nProtectHome=true\n\n[Install]\nWantedBy=multi-user.target\nEOF'",
            expectedOutput: "Unit file written."
          },
          {
            step: 4,
            title: "Reload daemon, start service, and verify logs",
            instruction: "Reload systemd configuration and inspect live systemd journal logs.",
            command: "sudo systemctl daemon-reload && sudo systemctl enable --now metrics-agent && sudo journalctl -u metrics-agent -n 10 --no-pager",
            expectedOutput: "Active: active (running) with heartbeat output."
          }
        ],
        verification: "Run `kill -9 $(pgrep -f metrics-agent.sh)` and observe systemd auto-restarting the process within 3 seconds via `journalctl -u metrics-agent -f`."
      }
    ],
    capstoneProjects: [
      {
        id: "proj-linux-capstone",
        title: "Production Infrastructure Automation & Hardening Suite",
        level: "Production",
        estimatedHours: "12 Hours",
        overview: "Design and implement a battle-tested automated Linux server configuration, security baseline, and monitoring engine. The project delivers an automated shell-based bootstrap script that provisions a pristine server into a hardened bastion and microservice runner with LVM storage partitioning, UFW/iptables firewalls, non-root systemd daemons, automated log rotation, and real-time alerts.",
        architectureSummary: "Standard Linux host hardened against CIS Benchmarks, with dedicated systemd cgroups limits, automated logrotate policies, SSH key-only access, and an alerting daemon streaming metrics to a local SQLite/webhook collector.",
        techStack: ["Linux (Ubuntu/RHEL)", "Bash", "Systemd", "LVM", "UFW/iptables", "Logrotate", "Cron/Timers"],
        milestones: [
          {
            title: "Milestone 1: Storage Architecture & LVM Partitioning",
            tasks: [
              "Create dedicated Logical Volumes for /var/log, /opt/apps, and /tmp with noexec/nosuid mount options.",
              "Configure /etc/fstab with persistent filesystem UUIDs and resilient mount flags.",
              "Implement an automated disk space watchdog script warning at 80% threshold."
            ],
            deliverable: "storage_setup.sh script and validated /etc/fstab entry."
          },
          {
            title: "Milestone 2: Security Hardening & SSH Bastion Policy",
            tasks: [
              "Disable SSH password authentication, root login, and configure ed25519 key-based access.",
              "Configure UFW/iptables firewall rules allowing only port 22, 80, 443 with rate-limiting.",
              "Configure fail2ban jail to ban IP addresses with >3 failed authentication attempts."
            ],
            deliverable: "security_hardening.sh script and active UFW status output."
          },
          {
            title: "Milestone 3: Automated Microservice Daemon & Journal Monitoring",
            tasks: [
              "Author a systemd service and timer running an automated daily backup of /etc/ and database snapshots.",
              "Configure logrotate for application log files with zstd compression and 7-day retention.",
              "Set up a systemd failure notification handler triggering on unit crashes."
            ],
            deliverable: "Custom systemd unit suite and logrotate configuration file."
          }
        ],
        verificationCriteria: [
          "All filesystems mount cleanly on system reboot without maintenance prompt.",
          "SSH root access is rejected; SSH key authentication succeeds.",
          "Killing application PID results in automated systemd restart within 5 seconds.",
          "Logrotate successfully rotates and compresses test files upon trigger."
        ]
      }
    ],
    interviewQuestions: [
      {
        id: "linux-q1",
        category: "System Architecture",
        question: "Explain what happens at the kernel and user-space level when you execute a binary in Bash (e.g., ./app).",
        answer: "When a user executes `./app`, the Bash shell first calls `fork()` (or modern `clone()`) to create a child process duplicating the parent's page tables via Copy-on-Write (CoW). The child process then executes the `execve(\"./app\", argv, envp)` system call. The Linux kernel's Virtual File System (VFS) validates file permissions and reads the ELF binary header. If it is an ELF executable, the kernel allocates a new virtual memory map (code segment, data segment, BSS, heap, stack), maps the dynamic linker (e.g. `/lib64/ld-linux-x86-64.so.2`), sets the instruction pointer (RIP) to the ELF entry point, and switches execution from kernel space to user space at the `_start` symbol.",
        keyPoints: [
          "fork() creates child with Copy-on-Write memory mapping",
          "execve() replaces process memory space with the new ELF binary",
          "Kernel sets up virtual memory segments (text, data, heap, stack)",
          "Dynamic linker resolves shared libraries (.so) before main() runs"
        ]
      },
      {
        id: "linux-q2",
        category: "Incident Triage",
        question: "A production server reports 'No space left on device', but 'df -h' shows 40% free disk space. What is the root cause and how do you resolve it?",
        answer: "The root cause is almost always Inode Exhaustion. Every filesystem has a finite number of inodes created during formatting (`mkfs`). Each file, directory, or symlink consumes one inode regardless of its size. If an application (e.g., an unpurged cache, PHP session folder, or runaway mail queue) creates millions of 0-byte or tiny files, all inodes become exhausted while gigabytes of raw block capacity remain empty. Triage by running `df -i` to identify the filesystem with 100% IUse%. Then run `find / -xdev -type d -exec sh -c 'echo -n \"{} \"; ls -1 \"{}\" | wc -l' \\; | sort -n -k 2 | tail -n 10` to pinpoint the directory containing hundreds of thousands of files and purge them.",
        keyPoints: [
          "Inodes store metadata; total inodes are fixed at format time for ext4",
          "df -i diagnoses inode saturation vs df -h for disk block capacity",
          "Find directories with abnormal file counts using find and wc -l",
          "Resolve by deleting stale files with xargs (e.g., find . -name '*.tmp' -delete)"
        ],
        codeSnippet: "# Inspect inode saturation across mounts\ndf -i\n\n# Fast recursive count of files per subdirectory\nfind /var -xdev -type d -size +100k\nfind /var/spool/postfix -type f -delete"
      },
      {
        id: "linux-q3",
        category: "Process & Signals",
        question: "What is a Zombie process, why does it exist, and how do you eliminate it without rebooting the server?",
        answer: "A zombie process (state 'Z' in `ps aux` or `top`) is a terminated process that has completed execution and released its memory and file descriptors, but its entry remains in the kernel process table. It remains because its parent process has not yet read its exit status code by calling the `wait()` or `waitpid()` system call. Zombies consume no CPU or RAM, but they consume valuable Process ID (PID) slots. You CANNOT eliminate a zombie using `kill -9 <PID>` because the process is already dead. To eliminate it, you must signal the parent process to reap it (`kill -s SIGCHLD <parent_PID>`) or terminate the parent process (`kill -15 <parent_PID>`). Once the parent dies, the zombie process is adopted by PID 1 (systemd), which automatically reaps it.",
        keyPoints: [
          "Zombies consume no CPU or memory, only a slot in the kernel PID table",
          "Occur when parent fails to call wait() / waitpid()",
          "kill -9 does not work on zombies because they are already dead",
          "Kill or restart the parent process so PID 1 inherits and reaps the zombie"
        ]
      }
    ],
    bestPractices: [
      {
        category: "Security & Access Control",
        practices: [
          { do: "Disable SSH password authentication and enforce Ed25519/RSA-4096 keys with MFA.", dont: "Permit direct root SSH login or password authentication on public interfaces.", rationale: "Prevents automated brute-force credential stuffing attacks against port 22." },
          { do: "Run all application services under dedicated unprivileged system users with nologin shells.", dont: "Execute microservices or web servers (Nginx/Node.js) as root user.", rationale: "Limits blast radius if the application suffers Remote Code Execution (RCE) vulnerabilities." },
          { do: "Mount /tmp, /var/log, and /dev/shm on separate partitions with 'nodev,nosuid,noexec'.", dont: "Place all operating system files in a single flat unpartitioned root filesystem.", rationale: "Prevents attackers from executing downloaded malicious payloads out of world-writable directories." }
        ]
      },
      {
        category: "Performance & Reliability",
        practices: [
          { do: "Configure systemd units with Restart=always, RestartSec=5s, and MemoryMax limits.", dont: "Launch long-running background tasks using manual nohup or screen sessions.", rationale: "Ensures automated recovery from out-of-memory crashes and hardware reboots." },
          { do: "Configure logrotate with daily rotation, zstd/gzip compression, and retention caps.", dont: "Allow application logs to write indefinitely to /var/log without truncation.", rationale: "Prevents disk space crashes that halt databases and production services." }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: "High System Load Average with Low CPU Utilization",
        symptom: "Load average is 24.0 on an 8-core CPU, but 'top' reports %Cpu(s) idle at 85%.",
        rootCause: "Processes stuck in Uninterruptible Sleep (state 'D'), typically waiting on blocked synchronous disk I/O, NFS storage timeout, or hung hardware buses.",
        triageCommand: "vmstat 1 5 && ps -eo state,pid,cmd | grep '^D'",
        solution: "Identify which block device or NFS share is unresponsive. Inspect `dmesg -T` for I/O errors, NVMe bus resets, or hung NFS mounts. Remount unresponsive NFS shares with 'soft,timeo=30'."
      },
      {
        issue: "System Out of Memory (OOM) Process Termination",
        symptom: "Database (Postgres/MySQL) or Java process disappears unexpectedly with exit code 137.",
        rootCause: "Physical RAM and swap exhausted; kernel OOM killer selected highest badness score process to reclaim memory.",
        triageCommand: "dmesg -T | grep -i -E 'oom-killer|killed process' -A 5",
        solution: "Adjust cgroup memory limits, increase swap space (`mkswap`), or set `oom_score_adj` to -1000 for critical database processes to prevent kernel killing."
      },
      {
        issue: "Systemd Unit in CrashLoopBackOff (Failed State)",
        symptom: "Service shows 'Active: failed (Result: exit-code)' and refuses to start.",
        rootCause: "Configuration syntax error, missing environment variables, or permission denied on socket file.",
        triageCommand: "journalctl -u <service-name> -e --no-pager -n 50",
        solution: "Inspect trailing stack trace. Verify file ownership (`chown appuser:appgroup`), test binary execution manually as the service user (`sudo -u appuser /path/to/binary`), and execute `systemctl daemon-reload`."
      }
    ],
    realWorldUseCases: [
      {
        title: "FinTech Platform: Zero-Downtime Live Kernel Patching & Memory Tuning",
        companyScenario: "Tier-1 Payment Gateway processing $40M daily on bare-metal Ubuntu servers.",
        challenge: "A critical Linux kernel CVE required immediate patching across 120 production nodes without dropping active TCP payment transactions or rebooting servers.",
        architectureSolution: "Implemented Canonical Livepatch / kpatch for in-memory dynamic kernel function replacement. Tuned TCP socket buffers (`net.ipv4.tcp_rmem`, `net.ipv4.tcp_wmem`) and increased ephemeral port range (`net.ipv4.ip_local_port_range = 10240 65535`).",
        businessImpact: "Achieved 100% security compliance across all 120 nodes with zero seconds of payment gateway downtime.",
        keyTakeaway: "Enterprise Linux administration requires mastering live kernel patching, sysctl network tuning, and graceful socket connection draining."
      }
    ]
  },

  // ==========================================================================
  // 2. GIT & GITHUB MASTERY FOR DEVOPS
  // ==========================================================================
  "git-github-mastery": {
    courseSlug: "git-github-mastery",
    title: "Git & GitHub for DevOps Teams",
    subtitle: "Complete Enterprise Guide to Directed Acyclic Graphs, Git Internals, Trunk-Based Development, and GitOps",
    theoryDeepDive: {
      coreConcept: "Content-Addressable Storage & Directed Acyclic Graph (DAG) Model",
      keyMentalModel: "Git does not track file diffs; Git tracks immutable snapshot trees of the entire project hashed by SHA-1/SHA-256.",
      deepDiveParagraphs: [
        "Git is an immutable, distributed content-addressable object database underneath a simple VCS command-line surface. The entire object database lives in `.git/objects/` and consists of four fundamental primitive types: Blobs (storing raw file byte contents without names), Trees (storing directory structures, mapping file names and file permissions to blob/tree hashes), Commits (pointing to a root tree hash, parent commit hash(es), committer metadata, and commit log), and Annotated Tags.",
        "Branch references in Git (`refs/heads/main`) are not complex database tables—they are literally 41-byte plaintext files containing a hexadecimal commit SHA hash. Moving or creating a branch is an O(1) operation that simply updates a pointer.",
        "DevOps pipelines treat Git as the single source of truth for both application source code and infrastructure definitions (GitOps). Understanding Git's 3-tree architecture (Working Directory, Staging Area/Index, and HEAD object database) enables engineers to execute complex cherry-picks, non-destructive interactive rebases, and emergency reflog recoveries during failed production releases."
      ]
    },
    architecture: {
      title: "Git Object Graph & 3-Tree State Architecture",
      description: "How changes transition from physical disk files to staging index, commit objects, and remote GitOps pipelines.",
      diagramAscii: `
+-----------------------+     git add      +-----------------------+    git commit    +-----------------------+
|  WORKING DIRECTORY    | ---------------> |  STAGING AREA (INDEX) | ---------------> | REPOSITORY (HEAD)     |
| (Files on local disk) | <--------------- |  (.git/index cache)   | <--------------- | (.git/objects DAG)    |
+-----------------------+   git checkout   +-----------------------+    git reset     +-----------------------+
                                                                                                  |
                                                                                             git push
                                                                                                  v
                                                                                      +-----------------------+
                                                                                      | REMOTE GITHUB REPO    |
                                                                                      | - Protected Branches  |
                                                                                      | - GitHub Actions CI   |
                                                                                      | - ArgoCD GitOps Sync  |
                                                                                      +-----------------------+
      `,
      components: [
        {
          name: "Object Store (.git/objects)",
          role: "Immutable Hash Database",
          keyConcept: "Zlib-compressed storage indexed by the 40-character SHA hash of object header + payload.",
          failureDomain: "Corrupt objects cause checkout failures (diagnosed with `git fsck`)."
        },
        {
          name: "Staging Index (.git/index)",
          role: "Prepared Snapshot Cache",
          keyConcept: "Binary file recording the proposed root tree snapshot for the upcoming commit.",
          failureDomain: "Merge conflict markers left in index block automated deployments."
        },
        {
          name: "HEAD Pointer (.git/HEAD)",
          role: "Active Context Pointer",
          keyConcept: "Points to the symbolic ref of the currently checked-out branch (`ref: refs/heads/main`).",
          failureDomain: "Detached HEAD state occurs when checking out a specific commit hash rather than a branch."
        }
      ],
      dataFlow: [
        "1. Developer edits file `deploy.yaml` in Working Directory.",
        "2. `git add deploy.yaml` creates a Blob object in `.git/objects/` and updates `.git/index`.",
        "3. `git commit -m 'feat: update ingress'` writes a Tree object for directories and a Commit object pointing to root Tree + parent Commit.",
        "4. Branch pointer `refs/heads/main` updates to the newly generated Commit hash.",
        "5. `git push origin main` synchronizes missing objects over SSH/HTTPS and triggers GitHub Actions webhook."
      ]
    },
    commandCheatSheet: [
      {
        category: "Advanced Inspection & History Triage",
        description: "Analyze commit history, identify regression points, and inspect object internals.",
        commands: [
          { cmd: "git log --graph --oneline --decorate --all", desc: "Render visual ASCII branch history with commit SHAs and branch pointers." },
          { cmd: "git cat-file -p <hash>", desc: "Pretty-print raw content of any Git object (blob, tree, commit, tag)." },
          { cmd: "git cat-file -t <hash>", desc: "Display internal type of a Git object hash (blob, tree, commit, or tag)." },
          { cmd: "git diff --staged", desc: "Compare Staging Area (index) against latest HEAD commit." },
          { cmd: "git bisect start && git bisect bad && git bisect good <commit>", desc: "Binary search history to automatically locate the exact commit that introduced a bug." }
        ]
      },
      {
        category: "Emergency Recovery & Cleanups",
        description: "Rescue deleted branches, undo erroneous commits, and rewrite history.",
        commands: [
          { cmd: "git reflog", desc: "Display chronological log of every HEAD pointer update (safeguard for lost commits)." },
          { cmd: "git reset --hard HEAD@{1}", desc: "Instantly undo the last Git operation (commit, merge, or rebase) back to previous state." },
          { cmd: "git branch recover-branch <commit-hash>", desc: "Recreate an accidentally deleted branch pointing to a commit located in reflog." },
          { cmd: "git clean -fd", desc: "Remove all untracked files and directories from the working tree forcefully." }
        ]
      },
      {
        category: "Interactive Rebasing & Branch Operations",
        description: "Maintain a clean linear git history for Trunk-Based pipelines.",
        commands: [
          { cmd: "git rebase -i HEAD~5", desc: "Interactively squash, reword, edit, or drop the last 5 commits." },
          { cmd: "git cherry-pick <commit-hash>", desc: "Apply a specific commit from another branch onto the current branch." },
          { cmd: "git rebase main", desc: "Replay current feature branch commits on top of latest main branch tip." }
        ]
      }
    ],
    practicalLabs: [
      {
        id: "lab-git-01",
        title: "Lab 1: Plumbing Commands & Git Object Database Inspection",
        difficulty: "Intermediate",
        estimatedTime: "25 mins",
        objective: "Manually construct a Git commit from scratch using only low-level plumbing commands (hash-object, mktree, commit-tree).",
        prerequisites: ["Git installed", "Terminal access"],
        steps: [
          {
            step: 1,
            title: "Initialize a sandbox repository",
            instruction: "Create a fresh directory and initialize Git.",
            command: "mkdir -p /tmp/git-internals && cd /tmp/git-internals && git init",
            expectedOutput: "Initialized empty Git repository in /tmp/git-internals/.git/"
          },
          {
            step: 2,
            title: "Generate a raw Blob object using plumbing",
            instruction: "Hash content directly into the object store without touching the staging area.",
            command: "BLOB_HASH=$(echo 'apiVersion: v1\nkind: Namespace' | git hash-object -w --stdin) && echo $BLOB_HASH",
            expectedOutput: "40-character hexadecimal SHA hash output."
          },
          {
            step: 3,
            title: "Inspect the raw object using git cat-file",
            instruction: "Verify object type and examine raw contents stored inside .git/objects/.",
            command: "git cat-file -t $BLOB_HASH && git cat-file -p $BLOB_HASH",
            expectedOutput: "blob\napiVersion: v1\nkind: Namespace"
          },
          {
            step: 4,
            title: "Write an index and tree manually",
            instruction: "Add the blob to index cache and write a Tree object.",
            command: "git update-index --add --cacheinfo 100644 $BLOB_HASH namespace.yaml && TREE_HASH=$(git write-tree) && echo $TREE_HASH",
            expectedOutput: "Tree object SHA generated."
          }
        ],
        verification: "Run `git cat-file -p $TREE_HASH` to verify the tree maps `100644 blob <hash> namespace.yaml`."
      }
    ],
    capstoneProjects: [
      {
        id: "proj-git-capstone",
        title: "Enterprise Monorepo Branching & GitOps Pipeline Blueprint",
        level: "Enterprise",
        estimatedHours: "10 Hours",
        overview: "Design and implement an automated Trunk-Based Development workflow with pre-commit security hooks, automated semantic PR validation, GPG signing policies, branch protection rules, and GitOps integration triggers.",
        architectureSummary: "Trunk-based repository protected by strict branch rules, requiring conventional commit messages, pre-commit secret scans (detect-secrets/gitleaks), and dispatching releases to ArgoCD upon merging.",
        techStack: ["Git", "GitHub Actions", "Pre-commit", "Gitleaks", "Semantic Release", "ArgoCD"],
        milestones: [
          {
            title: "Milestone 1: Secret Scanning & Pre-Commit Hook Suite",
            tasks: [
              "Configure `.pre-commit-config.yaml` with Gitleaks to block committing AWS keys or private keys.",
              "Enforce YAML validation and shell script linting via shellcheck in pre-commit hooks."
            ],
            deliverable: "Automated hook suite blocking dirty commits locally."
          },
          {
            title: "Milestone 2: GitHub Branch Protection & Automated PR Checks",
            tasks: [
              "Enforce linear commit history on `main` branch (forbid merge commits).",
              "Require 2 approvals, signed commits, and passing CI status checks before merge."
            ],
            deliverable: "Documented GitHub repository ruleset configuration."
          }
        ],
        verificationCriteria: [
          "Committing a dummy API key is instantly aborted by the pre-commit hook.",
          "Pull Requests without semantic commit titles fail automated CI checks.",
          "Merges to main trigger an immutable Git tag and release artifact."
        ]
      }
    ],
    interviewQuestions: [
      {
        id: "git-q1",
        category: "Merge Strategies",
        question: "Explain the difference between 'git merge', 'git merge --squash', and 'git rebase'. When should DevOps teams use each?",
        answer: "`git merge` creates a non-linear 3-way merge commit joining two branches, preserving all intermediate development commits and timestamps; ideal for long-lived integration branches. `git rebase` rewrites history by sequentially applying feature branch commits onto the tip of the target branch, producing a strictly linear commit history; ideal for clean Trunk-Based Development before merging PRs. `git merge --squash` collapses all commits on the feature branch into a single atomic staged change on the target branch without preserving intermediate commit history; ideal for feature branches with messy 'WIP' commits.",
        keyPoints: [
          "git merge preserves branch topology with a merge commit",
          "git rebase creates linear history by rewriting commit parent hashes",
          "git merge --squash combines all commits into one atomic commit",
          "Never rebase public shared branches that other engineers have pulled"
        ]
      },
      {
        id: "git-q2",
        category: "Disaster Recovery",
        question: "A developer accidentally executed 'git reset --hard HEAD~3' and lost 3 critical production hotfix commits. How do you recover them?",
        answer: "The commits are not deleted immediately; Git retains loose objects for 30 days before garbage collection (`git gc`). Use `git reflog` to view the chronological history of HEAD pointer updates. Identify the commit hash right before the reset occurred (e.g. `HEAD@{1}`). Run `git reset --hard HEAD@{1}` or create a new branch pointing to that commit: `git branch recovered-hotfix HEAD@{1}`. All 3 commits, files, and commit logs are fully restored.",
        keyPoints: [
          "Git reflog tracks all HEAD movements including resets and rebases",
          "Commits remain in .git/objects until pruned by git gc",
          "Recover with git reset --hard <reflog-entry> or git branch <new-name> <hash>"
        ]
      }
    ],
    bestPractices: [
      {
        category: "Branching & Collaboration",
        practices: [
          { do: "Adopt Trunk-Based Development with short-lived feature branches (<24h lifespan).", dont: "Maintain divergent, long-lived feature branches that lead to massive merge conflicts.", rationale: "Minimizes integration friction and enables continuous deployment pipelines." },
          { do: "Use pre-commit hooks (Gitleaks, TruffleHog) to prevent credentials entering Git.", dont: "Commit API keys, private certificates, or .env files containing production secrets.", rationale: "Once pushed to a public or team repo, secrets must be revoked immediately." }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: "Merge Conflict in Generated File / Lockfile",
        symptom: "Automatic merge failed in package-lock.json or yarn.lock.",
        rootCause: "Concurrent PRs added different dependencies, causing non-trivial lockfile discrepancies.",
        triageCommand: "git status",
        solution: "Do not manually edit conflict markers. Run `git checkout --ours package-lock.json && npm install` or check out the target version and regenerate the lockfile cleanly."
      }
    ],
    realWorldUseCases: [
      {
        title: "Enterprise SaaS: GitOps Monorepo Migration for 200+ Kubernetes Microservices",
        companyScenario: "Unifying 45 distributed repositories into a single GitOps monorepo managed by ArgoCD.",
        challenge: "Managing atomic multi-service deployments without git history bloat or CI runner bottlenecks.",
        architectureSolution: "Configured Git Sparse-Checkout and Git LFS for binary assets. Enforced trunk-based development with automated path-filtered GitHub Actions triggers.",
        businessImpact: "Cut deployment lead time from 4 hours to 8 minutes while maintaining 100% auditability.",
        keyTakeaway: "Git is the ultimate control plane for declarative cloud-native infrastructure."
      }
    ]
  },

  // ==========================================================================
  // 3. DOCKER & CONTAINERS MASTERY
  // ==========================================================================
  "docker-mastery": {
    courseSlug: "docker-mastery",
    title: "Docker & Containers Mastery",
    subtitle: "Complete Enterprise Guide to Linux Namespaces, Cgroups, Multi-Stage Builds, and Container Hardening",
    theoryDeepDive: {
      coreConcept: "Linux Kernel Process Isolation (Namespaces, Cgroups v2 & Union Filesystems)",
      keyMentalModel: "A container is not an emulation of a computer; a container is a standard Linux process executing with restricted kernel vision.",
      deepDiveParagraphs: [
        "Containers do not run a guest operating system, nor do they run on top of a hypervisor. A container is a standard Linux process running directly on the host CPU, constrained by two fundamental Linux kernel subsystems: Namespaces (which restrict what the process can SEE) and Control Groups / Cgroups (which restrict what the process can USE).",
        "Linux kernel Namespaces provide six fundamental dimensions of process isolation: PID (isolated process tree where container main process is PID 1), Mount (isolated filesystem hierarchy), Network (private virtual ethernet interfaces, loopback, routing tables, and port bindings), IPC (isolated shared memory and message queues), UTS (isolated hostnames), and User (maps unprivileged container root UID 0 to a non-privileged host UID 10001).",
        "The container filesystem is assembled using OverlayFS, a Union filesystem architecture that stacks read-only image layers (LowerDir) underneath a thin, ephemeral writable layer (UpperDir). When a container writes or modifies a file, OverlayFS uses Copy-on-Write (CoW) to duplicate the target file into UpperDir, leaving underlying image layers completely immutable and shared across thousands of containers."
      ]
    },
    architecture: {
      title: "Docker Container Engine & OCI Runtime Architecture",
      description: "Deconstructed client-to-kernel execution flow from Docker CLI to containerd, runc, and Linux kernel cgroups.",
      diagramAscii: `
+-----------------------------------------------------------------------+
| DOCKER CLI (docker run -d --name web -p 80:80 nginx)                   |
+-----------------------------------------------------------------------+
                                  | (REST API via /var/run/docker.sock)
                                  v
+-----------------------------------------------------------------------+
| DOCKER DAEMON (dockerd)                                               |
| - Authentication, Image Builds, High-Level Volume/Network Management  |
+-----------------------------------------------------------------------+
                                  | (gRPC via /run/containerd/containerd.sock)
                                  v
+-----------------------------------------------------------------------+
| CONTAINERD (High-Level OCI Container Runtime)                         |
| - Image Pulling, Snapshot Storage (overlay2), Container Lifecycle     |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| CONTAINERD-SHIM (Decoupled Process Supervisor)                        |
| - Keeps stdio/TTY open across daemon reboots; collects exit codes     |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| RUNC (Low-Level OCI Reference Runtime)                                |
| - Calls clone(CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS) system calls |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| LINUX KERNEL ISOLATION                                                |
|  [ PID/Net/Mount Namespaces ]   [ Cgroups v2 Memory/CPU Limits ]      |
+-----------------------------------------------------------------------+
      `,
      components: [
        {
          name: "dockerd",
          role: "High-Level Container Platform Daemon",
          keyConcept: "Manages Docker API, local image caching, volume attachments, and bridge network interfaces (docker0).",
          failureDomain: "Restarting dockerd does not kill containers if 'live-restore' is enabled in daemon.json."
        },
        {
          name: "containerd & shim",
          role: "Runtime Manager & Process Supervisor",
          keyConcept: "Standardized runtime handling snapshot mounts; containerd-shim stays alive per container to avoid daemon coupling.",
          failureDomain: "Container dies if its containerd-shim process is killed."
        },
        {
          name: "runc",
          role: "OCI Low-Level Spec Runner",
          keyConcept: "A CLI tool that executes Linux kernel system calls (`pivot_root`, `setns`) to instantiate the container boundary, then exits.",
          failureDomain: "Fails if kernel cgroup controller or namespace allocation is exhausted."
        },
        {
          name: "Overlay2 Storage Driver",
          role: "Layered Union Filesystem",
          keyConcept: "Combines multiple read-only image layers with an active writable container layer via Copy-on-Write.",
          failureDomain: "High disk write overhead if applications write logs to container layer instead of named volumes."
        }
      ],
      dataFlow: [
        "1. Client executes `docker run -d --memory 512m -p 8080:80 app:v1`.",
        "2. dockerd queries containerd to pull image layers if absent locally.",
        "3. containerd unpacks tar layers into an overlay2 snapshot.",
        "4. containerd invokes `runc` with OCI `config.json` containing namespace flags and cgroup memory caps.",
        "5. runc sets up namespaces, attaches virtual ethernet pair (`veth`), and execs application as PID 1.",
        "6. runc exits; containerd-shim maintains process I/O and health status."
      ]
    },
    commandCheatSheet: [
      {
        category: "Container Lifecycle & Debugging",
        description: "Control, inspect, and troubleshoot running container processes.",
        commands: [
          { cmd: "docker ps -a --format 'table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}'", desc: "Clean tabular overview of all active and exited containers." },
          { cmd: "docker exec -it <container> /bin/sh", desc: "Open an interactive shell inside a running container's namespace." },
          { cmd: "docker logs --tail 100 -f <container>", desc: "Stream trailing 100 log lines from container stdout/stderr." },
          { cmd: "docker inspect --format '{{.State.Pid}}' <container>", desc: "Fetch host process ID (PID) of a container for low-level triage." },
          { cmd: "docker top <container>", desc: "Display running processes inside the container as seen by the host OS." }
        ]
      },
      {
        category: "Resource Monitoring & Housekeeping",
        description: "Track live resource utilization and clean stale container bloat.",
        commands: [
          { cmd: "docker stats --no-stream", desc: "One-shot snapshot of CPU%, MEM USAGE / LIMIT, MEM%, NET I/O, and BLOCK I/O for all containers." },
          { cmd: "docker system df -v", desc: "Detailed breakdown of disk space consumed by images, containers, and volumes." },
          { cmd: "docker system prune -af --volumes", desc: "Forcefully purge all stopped containers, dangling networks, unused images, and build caches." }
        ]
      },
      {
        category: "Image Building & Multi-Stage Optimization",
        description: "Author lean, secure, multi-stage production images.",
        commands: [
          { cmd: "docker build --no-cache -t myapp:v1 -f Dockerfile .", desc: "Build container image without using layer cache." },
          { cmd: "docker history --human --format 'table {{.CreatedBy}}\t{{.Size}}' myapp:v1", desc: "Inspect layer-by-layer size contribution to pinpoint image bloat." }
        ]
      }
    ],
    practicalLabs: [
      {
        id: "lab-docker-01",
        title: "Lab 1: Hyper-Optimized Multi-Stage Build & Non-Root Hardening",
        difficulty: "Intermediate",
        estimatedTime: "30 mins",
        objective: "Transform a bloated 1.2GB Go/Node application image into a hardened 18MB Distroless/Alpine image running as a non-root user with read-only rootfs.",
        prerequisites: ["Docker installed", "Basic Dockerfile syntax familiarity"],
        steps: [
          {
            step: 1,
            title: "Create microservice source code",
            instruction: "Author a lightweight Go HTTP microservice.",
            command: "mkdir -p /tmp/docker-lab && cd /tmp/docker-lab && cat << \"EOF\" > main.go\npackage main\nimport (\"fmt\"; \"net/http\"; \"os\")\nfunc main() {\n  http.HandleFunc(\"/healthz\", func(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprintf(w, \"OK\\n\")\n  })\n  port := os.Getenv(\"PORT\")\n  if port == \"\" { port = \"8080\" }\n  http.ListenAndServe(\":\"+port, nil)\n}\nEOF",
            expectedOutput: "main.go file created."
          },
          {
            step: 2,
            title: "Author multi-stage hardened Dockerfile",
            instruction: "Use a heavy builder image for compilation and scratch/alpine for final runtime.",
            command: "cat << \"EOF\" > Dockerfile\n# Stage 1: Build binary\nFROM golang:1.22-alpine AS builder\nWORKDIR /build\nCOPY main.go .\nRUN CGO_ENABLED=0 GOOS=linux go build -ldflags=\"-s -w\" -o server main.go\n\n# Stage 2: Minimal hardened runtime\nFROM alpine:3.19\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\nWORKDIR /app\nCOPY --from=builder /build/server /app/server\nUSER appuser:appgroup\nEXPOSE 8080\nHEALTHCHECK --interval=10s --timeout=3s CMD wget -qO- http://localhost:8080/healthz || exit 1\nENTRYPOINT [\"/app/server\"]\nEOF",
            expectedOutput: "Multi-stage Dockerfile created."
          },
          {
            step: 3,
            title: "Build and inspect image size",
            instruction: "Compile the image and verify size reduction.",
            command: "docker build -t secure-service:v1 . && docker images secure-service:v1",
            expectedOutput: "Image built with total size < 20MB."
          },
          {
            step: 4,
            title: "Run container with security constraints",
            instruction: "Launch with dropped capabilities, read-only rootfs, and memory limits.",
            command: "docker run -d --name secure-app -p 8080:8080 --memory 64m --cpus 0.5 --read-only --cap-drop ALL secure-service:v1 && sleep 2 && curl http://localhost:8080/healthz",
            expectedOutput: "HTTP 200 OK."
          }
        ],
        verification: "Run `docker inspect --format '{{.State.Running}} {{.Config.User}}' secure-app` to confirm container runs non-root and healthy."
      }
    ],
    capstoneProjects: [
      {
        id: "proj-docker-capstone",
        title: "Enterprise Multi-Tier Microservices with Docker Compose V2 & Trivy",
        level: "Production",
        estimatedHours: "12 Hours",
        overview: "Design and orchestrate an enterprise-grade 3-tier microservice architecture (React frontend, Node/Go API gateway, and PostgreSQL database) using Docker Compose V2. Incorporate isolated bridge networks, healthchecks with dependency orders (`condition: service_healthy`), secrets management, automated vulnerability scanning with Trivy, and image signing.",
        architectureSummary: "Frontend container proxies traffic to internal API gateway across a private backend network. Database lives on an isolated data network with persistent named volumes and encrypted credentials.",
        techStack: ["Docker", "Docker Compose V2", "Trivy", "PostgreSQL", "Nginx Reverse Proxy", "Cosign"],
        milestones: [
          {
            title: "Milestone 1: Container Hardening & Multi-Stage Builds",
            tasks: [
              "Author multi-stage Dockerfiles for frontend and API with non-root users and slim base images.",
              "Integrate Trivy container scanning in build scripts; fail builds on CRITICAL CVEs."
            ],
            deliverable: "Hardened Dockerfiles and passing Trivy scan reports."
          },
          {
            title: "Milestone 2: Docker Compose V2 Network & Secret Topology",
            tasks: [
              "Create separated frontend-network and backend-db-network bridge networks.",
              "Inject DB passwords using Docker Compose secrets instead of plaintext environment variables.",
              "Configure healthchecks on PostgreSQL and set API dependency to `service_healthy`."
            ],
            deliverable: "docker-compose.yaml with zero plaintext secrets and automated healthchecks."
          }
        ],
        verificationCriteria: [
          "`docker compose up -d` boots services in exact dependency order without race conditions.",
          "Frontend cannot directly ping or query PostgreSQL container (network isolation).",
          "Trivy scan shows 0 Critical and 0 High vulnerabilities across all images."
        ]
      }
    ],
    interviewQuestions: [
      {
        id: "dock-q1",
        category: "Container Internals",
        question: "Why should you avoid running an application as PID 1 inside a container without an init process like tini?",
        answer: "In Linux, PID 1 has special responsibilities: it handles signal reception and reaps orphaned child processes (preventing zombie processes). When an application runtime (such as Node.js, Python, or Java) runs as PID 1, it does not have default signal handlers for `SIGTERM` (signal 15). Consequently, when Docker executes `docker stop`, the container ignores the graceful shutdown signal, hangs for the default 10-second timeout, and is forcefully killed with `SIGKILL` (signal 9), causing database connection corruption or uncommitted state. Running with `docker run --init` or using `tini` as entrypoint properly translates signals and reaps zombie processes.",
        keyPoints: [
          "PID 1 ignores default signal handlers in Linux",
          "Without an init system, SIGTERM is ignored by runtimes like Node.js",
          "docker stop waits 10s then sends destructive SIGKILL",
          "Use --init flag or tini in Dockerfile to ensure graceful teardown"
        ]
      },
      {
        id: "dock-q2",
        category: "Storage Drivers",
        question: "Explain the difference between Docker Bind Mounts and Named Volumes. Which should you use for production databases?",
        answer: "Bind Mounts (`-v /host/path:/container/path`) bind a specific file or directory from the host filesystem directly into the container. They rely on host filesystem directory structure, host permissions, and can be modified by any host process. Named Volumes (`-v db_data:/var/lib/postgresql/data`) are completely managed by the Docker daemon in `/var/lib/docker/volumes/`, isolated from host OS interference, support custom storage volume drivers (e.g., AWS EBS, NFS, GlusterFS), and can be pre-populated with container image data on first boot. For production databases, always use Named Volumes because of improved I/O performance, automated Docker management, and volume driver abstraction.",
        keyPoints: [
          "Bind mounts point to arbitrary host paths and depend on host permissions",
          "Named volumes are managed exclusively by Docker daemon",
          "Named volumes support cloud storage plugins (EBS, NFS)",
          "Production databases should always use Named Volumes"
        ]
      }
    ],
    bestPractices: [
      {
        category: "Image Optimization & Security",
        practices: [
          { do: "Use explicit version tags (e.g., alpine:3.19.1) instead of 'latest'.", dont: "Use 'latest' tags in production Dockerfiles or Compose configurations.", rationale: "Ensures deterministic builds and prevents upstream breaking changes from silently crashing deployments." },
          { do: "Order Dockerfile commands from least frequently changed to most frequently changed.", dont: "Place 'COPY . .' before package dependency install commands.", rationale: "Maximizes Docker build layer caching, cutting CI build times from 10 minutes to 30 seconds." },
          { do: "Drop all Linux capabilities (`--cap-drop ALL`) and add only required capabilities (e.g., `NET_BIND_SERVICE`).", dont: "Run containers with `--privileged` in production environments.", rationale: "Prevents container breakout attacks that compromise the underlying host Linux kernel." }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: "Container Exits Immediately with Code 137",
        symptom: "Container status shows 'Exited (137)' within seconds of starting.",
        rootCause: "Kernel Out-Of-Memory (OOM) killer killed the main container process because memory exceeded the configured `--memory` limit (128 + 9 = 137).",
        triageCommand: "docker inspect <container> --format 'OOMKilled: {{.State.OOMKilled}}, ExitCode: {{.State.ExitCode}}'",
        solution: "Increase memory limit (`--memory 1g`) or optimize application heap allocation (e.g., `-Xmx` for Java)."
      },
      {
        issue: "Container Port Binding Fails (address already in use)",
        symptom: "docker run fails with 'bind: address already in use'.",
        rootCause: "Another process on the host machine is already listening on the requested host port.",
        triageCommand: "sudo ss -tulpn | grep :<port-number>",
        solution: "Identify host process holding the port (`sudo lsof -i :8080`) and terminate it, or map container to an alternative available host port (`-p 8081:8080`)."
      }
    ],
    realWorldUseCases: [
      {
        title: "E-Commerce Giant: Cutting Image Footprint & CI/CD Build Times by 90%",
        companyScenario: "Global retail platform running 1,200 microservices across distributed CI/CD runner fleets.",
        challenge: "Monolithic 2.4GB Ubuntu container images saturated registry storage and caused 18-minute deployment download delays on AWS EC2 clusters.",
        architectureSolution: "Re-architected all Dockerfiles into multi-stage Go/Node distroless builds, utilized Docker Buildx with remote caching, and enforced a non-root security policy.",
        businessImpact: "Reduced average image size from 2.4GB to 38MB, slashed CI build time to 45 seconds, and reduced monthly AWS S3 image storage costs by $24,000.",
        keyTakeaway: "Multi-stage builds and layer cache optimization are essential pillars of container cost and speed engineering."
      }
    ]
  },

  // ==========================================================================
  // 4. KUBERNETES IN ACTION
  // ==========================================================================
  "kubernetes-in-action": {
    courseSlug: "kubernetes-in-action",
    title: "Kubernetes in Action",
    subtitle: "Complete Enterprise Guide to Control Plane Architecture, CRDs, CNI, HPA, and Production Operations",
    theoryDeepDive: {
      coreConcept: "Declarative Reconciliation Loop & Distributed State Machine (etcd)",
      keyMentalModel: "Kubernetes is a declarative engine whose controllers continuously observe current cluster state and drive it toward desired state.",
      deepDiveParagraphs: [
        "Kubernetes decouples container operations into a declarative state machine governed by the Control Plane. At its core, the entire system relies on etcd, a consistent and highly available distributed key-value store implementing the Raft consensus algorithm. All cluster state, configuration, and secrets reside exclusively in etcd; no other control plane component communicates directly with etcd except the `kube-apiserver`.",
        "Every Kubernetes controller (e.g. DeploymentController, ReplicaSetController, NodeLifecycleController) executes an endless, asynchronous Reconciliation Loop: `Observe -> Analyze Diff -> Act`. When you apply a Deployment manifest specifying `replicas: 5`, the controller queries current active pods, calculates the delta, and issues REST requests to create matching Pod objects.",
        "Networking across the cluster adheres to the strict Kubernetes IP-per-Pod philosophy: every Pod receives its own routable IP address within the cluster network, allowing direct communication without NAT. Container Network Interface (CNI) plugins like Calico and Cilium (using eBPF) implement this overlay or direct-routed fabric across all worker nodes."
      ]
    },
    architecture: {
      title: "Kubernetes Cluster Architecture & Component Flow",
      description: "Deconstructed control plane components, worker node daemons, and request dispatching sequence.",
      diagramAscii: `
+-----------------------------------------------------------------------+
| KUBERNETES CONTROL PLANE (MASTER NODES)                               |
|  +----------------+    +-------------------+    +-------------------+ |
|  | etcd (Raft DB) |<-->| kube-apiserver    |<-->| kube-scheduler    | |
|  | (State Store)  |    | (Auth, Validating)|    | (Node Placement)  | |
|  +----------------+    +-------------------+    +-------------------+ |
|                                  ^                                    |
|                                  | (REST API via Port 6443)           |
|                        +-------------------+                          |
|                        | kube-controller-  |                          |
|                        | manager (Reconcile|                          |
|                        +-------------------+                          |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| WORKER NODE FLEET (DATA PLANE)                                        |
|  +------------------+  +-------------------+  +---------------------+ |
|  | kubelet          |  | kube-proxy        |  | Container Runtime   | |
|  | (Node Agent, CRI)|  | (iptables/IPVS)   |  | (containerd / runc)| |
|  +------------------+  +-------------------+  +---------------------+ |
|  +------------------------------------------------------------------+ |
|  | CNI PLUGIN (Calico / Cilium eBPF) -> Pod IP Allocation & Routing | |
|  +------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
      `,
      components: [
        {
          name: "kube-apiserver",
          role: "Central Cluster API Gateway",
          keyConcept: "Authenticates requests, enforces RBAC policies, executes Mutating and Validating Admission Webhooks, and writes to etcd.",
          failureDomain: "Cluster management stops if apiserver is down, though existing running pods continue executing."
        },
        {
          name: "etcd",
          role: "Distributed Consensus Storage",
          keyConcept: "Raft consensus store maintaining immutable cluster state history; requires odd quorum (3 or 5 nodes).",
          failureDomain: "Loss of quorum renders the cluster completely read-only or paralyzed."
        },
        {
          name: "kube-scheduler",
          role: "Pod Placement Engine",
          keyConcept: "Filters nodes (Predicates) and scores candidates (Priorities) based on resource requests, taints/tolerations, and affinity.",
          failureDomain: "Pods remain in Pending state if scheduler is halted."
        },
        {
          name: "kubelet",
          role: "Node Execution Supervisor",
          keyConcept: "Communicates with container runtime over CRI (Container Runtime Interface) to pull images, run pods, and report node health.",
          failureDomain: "Node marked 'NotReady' if kubelet fails heartbeat probes."
        }
      ],
      dataFlow: [
        "1. Engineer runs `kubectl apply -f deployment.yaml`.",
        "2. kube-apiserver authenticates JWT/OIDC, authorizes RBAC permissions, and passes manifest to Admission Controllers.",
        "3. apiserver writes Deployment object into etcd.",
        "4. DeploymentController notices new Deployment, creates ReplicaSet object.",
        "5. ReplicaSetController creates matching Pod objects with `nodeName: \"\"` (unassigned).",
        "6. kube-scheduler detects unbound Pods, calculates optimal node, and writes binding decision to apiserver.",
        "7. Target node's `kubelet` detects assigned pod, calls containerd over CRI, sets up CNI network, and starts containers."
      ]
    },
    commandCheatSheet: [
      {
        category: "Cluster Triage & Diagnostics",
        description: "Diagnose pending pods, crash loops, and node pressures.",
        commands: [
          { cmd: "kubectl get pods -A -o wide --sort-by='.status.startTime'", desc: "List all pods across all namespaces ordered by startup time." },
          { cmd: "kubectl describe pod <pod-name> -n <ns>", desc: "Inspect pod lifecycle events, readiness probe failures, and image pull errors." },
          { cmd: "kubectl logs <pod-name> -c <container> --previous", desc: "View logs of the previous crashed container instance before restart." },
          { cmd: "kubectl top nodes && kubectl top pods -A", desc: "Display real-time CPU and memory usage of nodes and pods via Metrics Server." }
        ]
      },
      {
        category: "Rollouts & Workload Scaling",
        description: "Execute zero-downtime rolling updates and manage rollbacks.",
        commands: [
          { cmd: "kubectl rollout status deployment/<name> -n <ns>", desc: "Monitor live progress of a rolling deployment." },
          { cmd: "kubectl rollout undo deployment/<name> -n <ns>", desc: "Instantly rollback deployment to the preceding stable ReplicaSet." },
          { cmd: "kubectl scale deployment/<name> --replicas=10 -n <ns>", desc: "Manually scale deployment replica count." }
        ]
      },
      {
        category: "Networking & Security",
        description: "Debug DNS, services, Ingress, and RBAC permissions.",
        commands: [
          { cmd: "kubectl run test-dns --rm -it --image=busybox:1.28 -- nslookup <service>.<ns>.svc.cluster.local", desc: "Verify CoreDNS resolution from inside cluster pod network." },
          { cmd: "kubectl auth can-i create deployments --as=system:serviceaccount:dev:app-sa", desc: "Test RBAC authorization permissions for a service account." }
        ]
      }
    ],
    practicalLabs: [
      {
        id: "lab-k8s-01",
        title: "Lab 1: Zero-Downtime Rolling Update & Automated Canary Rollback",
        difficulty: "Advanced",
        estimatedTime: "35 mins",
        objective: "Deploy a high-availability microservice with readiness probes, PodDisruptionBudgets, and simulate an automated rollback upon detecting HTTP 500 failure bursts.",
        prerequisites: ["Kubernetes cluster (Minikube/Kind/Cloud)", "kubectl CLI"],
        steps: [
          {
            step: 1,
            title: "Apply resilient Deployment manifest",
            instruction: "Deploy 4 replicas with maxSurge: 25% and maxUnavailable: 0.",
            command: "kubectl apply -f - << \"EOF\"\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: payment-api\n  namespace: default\nspec:\n  replicas: 4\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1\n      maxUnavailable: 0\n  selector:\n    matchLabels:\n      app: payment\n  template:\n    metadata:\n      labels:\n        app: payment\n    spec:\n      containers:\n      - name: api\n        image: nginx:1.25-alpine\n        ports:\n        - containerPort: 80\n        readinessProbe:\n          httpGet:\n            path: /\n            port: 80\n          initialDelaySeconds: 3\n          periodSeconds: 3\nEOF",
            expectedOutput: "deployment.apps/payment-api created."
          },
          {
            step: 2,
            title: "Configure PodDisruptionBudget",
            instruction: "Guarantee at least 3 pods remain available during node drain maintenance.",
            command: "kubectl apply -f - << \"EOF\"\napiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: payment-pdb\nspec:\n  minAvailable: 3\n  selector:\n    matchLabels:\n      app: payment\nEOF",
            expectedOutput: "poddisruptionbudget.policy/payment-pdb created."
          },
          {
            step: 3,
            title: "Trigger a broken image update",
            instruction: "Update deployment with an invalid image to observe Kubernetes pausing rollout.",
            command: "kubectl set image deployment/payment-api api=nginx:invalid-tag-99 && kubectl rollout status deployment/payment-api",
            expectedOutput: "Rollout halted; old pods continue serving live traffic without dropping requests."
          },
          {
            step: 4,
            title: "Execute automated rollback",
            instruction: "Roll back to previous revision and verify cluster health.",
            command: "kubectl rollout undo deployment/payment-api && kubectl get pods -l app=payment",
            expectedOutput: "All 4 pods running stable nginx:1.25-alpine."
          }
        ],
        verification: "Run `kubectl get pods -l app=payment` and verify 4/4 pods are in Running state with zero restart count."
      }
    ],
    capstoneProjects: [
      {
        id: "proj-k8s-capstone",
        title: "Enterprise Production Microservice Mesh on Kubernetes with Helm & HPA",
        level: "Enterprise",
        estimatedHours: "16 Hours",
        overview: "Architect and package an enterprise-grade microservice application using Helm 3. Implement automated Horizontal Pod Autoscaling (HPA) using CPU and custom metrics, NetworkPolicies for zero-trust pod isolation, Ingress routing with cert-manager automated TLS termination, and Prometheus alerts.",
        architectureSummary: "Multi-tenant Kubernetes namespace topology governed by ResourceQuotas, RBAC ServiceAccounts, Calico NetworkPolicies, and Ingress-Nginx routing with Let's Encrypt certificates.",
        techStack: ["Kubernetes", "Helm 3", "HPA", "Metrics Server", "Cert-Manager", "Ingress-Nginx", "Prometheus"],
        milestones: [
          {
            title: "Milestone 1: Helm Chart Packaging & Templating",
            tasks: [
              "Create modular Helm chart with parameterized values.yaml for Dev, Staging, and Prod.",
              "Configure liveness, readiness, and startup probes with graceful termination lifecycle hooks."
            ],
            deliverable: "Packaged Helm chart passing helm lint and template validation."
          },
          {
            title: "Milestone 2: Horizontal Pod Autoscaler & Load Testing",
            tasks: [
              "Deploy HPA targeting 60% CPU utilization and 75% memory utilization.",
              "Run Apache Bench / k6 load test to trigger automated scale-out from 2 to 10 pods."
            ],
            deliverable: "Verified HPA scale event logs and Grafana scaling graph."
          }
        ],
        verificationCriteria: [
          "Deploying Helm chart provisions all pods, services, and ingresses with 0 errors.",
          "NetworkPolicy blocks unauthorized pods from directly accessing the database pod.",
          "HPA dynamically scales pods up under load and cleanly scales down post-test."
        ]
      }
    ],
    interviewQuestions: [
      {
        id: "k8s-q1",
        category: "Control Plane Internals",
        question: "What happens when a worker node crashes in a Kubernetes cluster? Detail the sequence of events across control plane components.",
        answer: "When a worker node crashes, its `kubelet` stops sending node status heartbeats (default every 10s). The `kube-controller-manager` runs the `NodeLifecycleController`. If no heartbeat is received within `node-monitor-grace-period` (default 40s), the controller marks the node as `NotReady`. If the node remains NotReady past `pod-eviction-timeout` (default 5m), the controller marks all pods on that node for deletion. The `ReplicaSetController` notices that the current running replica count has dropped below the desired count in etcd. It creates new replacement Pod objects without node assignments. The `kube-scheduler` assigns these replacement Pods to healthy surviving worker nodes. Healthy nodes pull container images and start workloads, maintaining service availability.",
        keyPoints: [
          "kubelet heartbeats cease; NodeLifecycleController marks node NotReady (40s)",
          "Pod eviction timeout triggers after 5 minutes",
          "ReplicaSetController creates replacement pods to satisfy desired replica count",
          "kube-scheduler schedules new pods onto healthy nodes"
        ]
      },
      {
        id: "k8s-q2",
        category: "Networking & Services",
        question: "Explain how a Kubernetes ClusterIP Service routes traffic to Pods without running a separate load balancer software process.",
        answer: "A ClusterIP Service is not a physical process or container; it is a virtual IP allocated from the cluster's service CIDR that exists solely in Linux kernel packet routing tables on every node. The `kube-proxy` daemon runs on every worker node and observes Service and Endpoints/EndpointSlice objects via the kube-apiserver. In modern clusters, kube-proxy configures Linux `iptables` or `IPVS` (IP Virtual Server) rules in the kernel. When an application pod sends a packet to the ClusterIP, the Linux kernel intercepts the packet at the `PREROUTING` or `OUTPUT` chain, performs Destination NAT (DNAT) using random or least-connection balancing, rewrites the destination IP to an active Pod IP, and forwards the frame directly over the CNI overlay.",
        keyPoints: [
          "ClusterIP is a virtual IP managed by kube-proxy in the node's Linux kernel",
          "kube-proxy writes iptables or IPVS netfilter rules",
          "Kernel executes DNAT to translate ClusterIP to one of the Pod IPs",
          "No user-space proxy overhead when using iptables or IPVS mode"
        ]
      }
    ],
    bestPractices: [
      {
        category: "Resource Management & Resilience",
        practices: [
          { do: "Always define CPU and memory `requests` AND `limits` for every container.", dont: "Deploy production workloads without resource limits (allows rogue pods to starve nodes).", rationale: "Requests guarantee scheduler placement; limits protect nodes against runaway memory leaks." },
          { do: "Configure both Readiness and Liveness probes with sensible initialDelaySeconds.", dont: "Point liveness probes to heavy database check endpoints that cascade failures.", rationale: "A failed liveness probe kills the container; a failed readiness probe safely removes it from traffic routing." }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: "Pod Stuck in CrashLoopBackOff",
        symptom: "Pod repeatedly crashes, restarts, and displays CrashLoopBackOff status.",
        rootCause: "Application thrown uncaught exception on boot, missing required config/secret environment variable, or health probe failure.",
        triageCommand: "kubectl logs <pod-name> --previous && kubectl describe pod <pod-name>",
        solution: "Inspect previous container logs for application stack traces. Verify all ConfigMaps and Secrets referenced in `envFrom` exist in the target namespace."
      },
      {
        issue: "Pod Stuck in Pending State",
        symptom: "Pod created successfully but never transitions to Running.",
        rootCause: "Cluster lacks sufficient CPU/memory capacity to satisfy `requests`, or no node matches pod nodeSelector / affinity / tolerations.",
        triageCommand: "kubectl describe pod <pod-name> | grep -A 5 Events",
        solution: "Check Events section for '0/X nodes are available: insufficient memory/cpu'. Scale down unused workloads or scale out cluster worker node capacity."
      }
    ],
    realWorldUseCases: [
      {
        title: "Media Streaming: Zero-Downtime Migration of 4,000 Pods with Spot Instances",
        companyScenario: "Global video streaming platform managing 4,000 microservice pods on AWS EKS.",
        challenge: "Reducing cloud compute spend by utilizing 70% EC2 Spot Instances without incurring video streaming dropouts when AWS reclaims spot nodes.",
        architectureSolution: "Implemented AWS Node Termination Handler listening to EC2 Spot 2-minute termination notices. Combined with PodDisruptionBudgets, topologySpreadConstraints, and preStop lifecycle hooks.",
        businessImpact: "Cut monthly cluster EC2 costs by 62% ($140,000/month savings) with 99.999% streaming uptime.",
        keyTakeaway: "Kubernetes resilience primitives (PDB, graceful termination, affinity) enable mission-critical workloads on ephemeral cloud hardware."
      }
    ]
  },

  // ==========================================================================
  // 5. JENKINS CI/CD PIPELINES MASTERCLASS
  // ==========================================================================
  "jenkins-cicd-pipelines": {
    courseSlug: "jenkins-cicd-pipelines",
    title: "Jenkins CI/CD Pipelines Masterclass",
    subtitle: "Complete Enterprise Guide to Declarative Pipelines, Groovy Shared Libraries, and Kubernetes Agents",
    theoryDeepDive: {
      coreConcept: "Distributed Controller-Agent Architecture & Continuous Delivery as Code",
      keyMentalModel: "The Jenkins Controller is the brain and scheduler; it should never execute build steps. All workloads must run on ephemeral agents.",
      deepDiveParagraphs: [
        "Jenkins coordinates continuous integration across a distributed Master-Worker (Controller-Agent) model. The Jenkins Controller manages user authentication, job definitions, plugin extensions, build queues, and artifact metadata. Actual compilation, container builds, and test executions must execute on isolated Agent nodes to prevent controller CPU starvation and security compromise.",
        "Pipelines as Code are authored using Declarative syntax within a versioned `Jenkinsfile`. Declarative pipelines enforce a structured syntax tree (`pipeline -> agent -> stages -> stage -> steps -> post`) providing built-in error handling, parallel branch execution, and matrix builds. For advanced enterprise reuse, Groovy Shared Libraries abstract common deployment pipelines across thousands of corporate repositories.",
        "Modern cloud-native Jenkins integrates with Kubernetes via the Jenkins Kubernetes Plugin. Rather than maintaining static VMs running 24/7 as build agents, the controller dynamically provisions ephemeral Kubernetes Pod agents on demand, executes pipeline stages within isolated containers (e.g. Maven, Go, Docker, Helm), and terminates the pod immediately post-build, optimizing compute costs."
      ]
    },
    architecture: {
      title: "Enterprise Jenkins Distributed Kubernetes Architecture",
      description: "How Jenkins Controller interacts with GitHub webhooks, Vault secrets, and dynamic Kubernetes pod agents.",
      diagramAscii: `
+-----------------------------------------------------------------------+
| GITHUB ENTERPRISE (Git Push / PR Event Webhook)                       |
+-----------------------------------------------------------------------+
                                  | (HTTPS Webhook)
                                  v
+-----------------------------------------------------------------------+
| JENKINS CONTROLLER (Master Node)                                      |
| - Pipeline Scheduling & Groovy Compilation                            |
| - Role-Based Access Control (RBAC)                                    |
| - HashiCorp Vault Secrets Plugin Integration                          |
+-----------------------------------------------------------------------+
                                  | (Spawns Ephemeral Agent via K8s API)
                                  v
+-----------------------------------------------------------------------+
| KUBERNETES CLUSTER (Dynamic Build Agent Pod)                          |
|  +-------------------+  +--------------------+  +-------------------+ |
|  | jnlp-agent        |  | maven-builder      |  | kaniko / docker   | |
|  | (Communicates with|  | (Compiles code &   |  | (Builds container | |
|  | Controller)       |  | runs unit tests)   |  | without root sock)| |
|  +-------------------+  +--------------------+  +-------------------+ |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| ARTIFACT & DEPLOYMENT TARGETS: AWS ECR / ArgoCD / Slack Notification  |
+-----------------------------------------------------------------------+
      `,
      components: [
        {
          name: "Jenkins Controller",
          role: "Central Orchestrator & UI",
          keyConcept: "Schedules pipelines, tracks builds, stores XML configurations, and aggregates build logs.",
          failureDomain: "Controller downtime halts pipeline triggers, though running production apps are unaffected."
        },
        {
          name: "JNLP / Inbound Agent",
          role: "Worker Node Connection Bridge",
          keyConcept: "Java process running inside agent pod connecting back to controller over TCP/WebSocket (port 50000).",
          failureDomain: "Agent disconnect aborts the active build stage."
        },
        {
          name: "Groovy Shared Library",
          role: "Enterprise Pipeline Abstraction",
          keyConcept: "Version-controlled Git repo of reusable pipeline functions (`vars/deployToK8s.groovy`).",
          failureDomain: "Shared library syntax error breaks all pipelines importing the library."
        }
      ],
      dataFlow: [
        "1. Developer pushes commit to GitHub; GitHub dispatches webhook to `/github-webhook/`.",
        "2. Jenkins Controller parses commit, locates repository `Jenkinsfile`, and requests a dynamic agent pod from Kubernetes.",
        "3. Kubernetes schedules pod with JNLP agent and builder containers.",
        "4. JNLP agent establishes connection to Controller; Controller serializes pipeline steps to the agent.",
        "5. Agent executes linting, unit tests, container builds, and security scans.",
        "6. Post-build block triggers Slack notification and updates GitHub commit status check (passed/failed)."
      ]
    },
    commandCheatSheet: [
      {
        category: "Jenkinsfile Declarative Directives",
        description: "Core syntax blocks for production Declarative pipelines.",
        commands: [
          { cmd: "pipeline { agent { kubernetes { yaml '''...''' } } ... }", desc: "Define dynamic multi-container Kubernetes pod agent in Jenkinsfile." },
          { cmd: "parallel { stage('Unit') { ... } stage('Lint') { ... } }", desc: "Execute multiple stages concurrently across separate agent executors." },
          { cmd: "post { failure { mail to: 'devops@company.com' } }", desc: "Execute guaranteed cleanup or alert actions upon pipeline failure." }
        ]
      },
      {
        category: "CLI & Plugin Management",
        description: "Automate controller administrative tasks and backup recovery.",
        commands: [
          { cmd: "java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:token list-jobs", desc: "Interact with Jenkins Controller programmatically via CLI jar." },
          { cmd: "java -jar jenkins-cli.jar -s http://localhost:8080/ safe-restart", desc: "Gracefully restart Jenkins Controller waiting for running jobs to finish." }
        ]
      }
    ],
    practicalLabs: [
      {
        id: "lab-jen-01",
        title: "Lab 1: Authoring a Complete Production Declarative Jenkinsfile",
        difficulty: "Intermediate",
        estimatedTime: "30 mins",
        objective: "Write a production Declarative Jenkinsfile with parameters, credentials binding, parallel stages, containerized execution, and Slack alerts.",
        prerequisites: ["Jenkins access or local Docker setup"],
        steps: [
          {
            step: 1,
            title: "Author complete Declarative Jenkinsfile",
            instruction: "Create a complete, robust Jenkinsfile incorporating production stages.",
            command: "cat << \"EOF\" > Jenkinsfile\npipeline {\n  agent any\n  parameters {\n    choice(name: 'ENVIRONMENT', choices: ['staging', 'production'], description: 'Target Deploy Env')\n    booleanParam(name: 'RUN_SECURITY_SCAN', defaultValue: true, description: 'Execute Trivy scan')\n  }\n  environment {\n    APP_NAME = 'catalog-api'\n    REGISTRY = 'docker.io/company'\n  }\n  stages {\n    stage('Parallel Checks') {\n      parallel {\n        stage('Unit Tests') {\n          steps {\n            sh 'echo \"Running unit test suites...\"'\n          }\n        }\n        stage('Code Linting') {\n          steps {\n            sh 'echo \"Running static code analysis...\"'\n          }\n        }\n      }\n    }\n    stage('Security Audit') {\n      when { expression { return params.RUN_SECURITY_SCAN } }\n      steps {\n        sh 'echo \"Running Trivy vulnerability audit...\"'\n      }\n    }\n    stage('Deploy') {\n      steps {\n        echo \"Deploying ${env.APP_NAME} to ${params.ENVIRONMENT}...\"\n      }\n    }\n  }\n  post {\n    always {\n      cleanWs()\n    }\n    failure {\n      echo \"Pipeline failed. Sending incident alert to on-call channel.\"\n    }\n  }\n}\nEOF",
            expectedOutput: "Jenkinsfile created."
          }
        ],
        verification: "Validate syntax in Jenkins Pipeline Linter or execute build to verify parallel stages execute properly."
      }
    ],
    capstoneProjects: [
      {
        id: "proj-jen-capstone",
        title: "Enterprise End-to-End CI/CD Pipeline with Shared Libraries & SonarQube",
        level: "Enterprise",
        estimatedHours: "14 Hours",
        overview: "Build an enterprise-scale Jenkins continuous delivery engine utilizing Groovy Shared Libraries. Standardize pipeline execution for 50 microservices including automated GitHub PR webhooks, SonarQube quality gates, Docker container compilation, Vault credential binding, and canary deployment to Kubernetes.",
        architectureSummary: "Central Groovy shared library repository defining standard `buildMicroservice()` method, dynamically dispatching workloads to Kubernetes agents with SonarQube quality gate enforcement.",
        techStack: ["Jenkins", "Groovy Shared Libraries", "Kubernetes", "SonarQube", "HashiCorp Vault", "Docker"],
        milestones: [
          {
            title: "Milestone 1: Groovy Shared Library Implementation",
            tasks: [
              "Author `vars/standardCiPipeline.groovy` encapsulating standard build, test, and container stages.",
              "Implement credential retrieval via HashiCorp Vault AppRole authentication."
            ],
            deliverable: "Tested shared library repository with unit tests."
          },
          {
            title: "Milestone 2: SonarQube Quality Gate Enforcement",
            tasks: [
              "Configure SonarQube scanner webhook; halt pipeline if test coverage is <80% or bugs detected."
            ],
            deliverable: "Passing quality gate build logs."
          }
        ],
        verificationCriteria: [
          "Microservice Jenkinsfile requires only 5 lines of code calling the shared library.",
          "Failing SonarQube quality gate automatically halts pipeline before image push."
        ]
      }
    ],
    interviewQuestions: [
      {
        id: "jen-q1",
        category: "Pipeline Architecture",
        question: "Why should you never run build workloads directly on the Jenkins Controller? What security and reliability risks does it introduce?",
        answer: "Running build workloads on the Jenkins Controller poses catastrophic security and operational hazards. Security Risk: Build scripts execute arbitrary code. If executed on the controller, a developer script or compromised third-party npm/maven package can read `/var/jenkins_home/secrets/`, steal all Jenkins master credentials (AWS keys, GitHub tokens, SSH private keys), and compromise the entire organization. Operational Risk: Memory leaks or high CPU compilations on the controller starve the JVM process, freeze the web interface, drop active agent connections, and corrupt Jenkins configuration XML files. Best practice dictates configuring '0 executors' on the Built-In controller node.",
        keyPoints: [
          "Controller hosts sensitive credential files in /var/jenkins_home/secrets/",
          "Build scripts can read filesystem and extract master credentials",
          "Heavy compilation causes CPU/RAM starvation and freezes the controller",
          "Set executors to 0 on Built-In node; execute on ephemeral agents only"
        ]
      }
    ],
    bestPractices: [
      {
        category: "Security & Operations",
        practices: [
          { do: "Use the Credentials Binding plugin to inject secrets as masked environment variables.", dont: "Hardcode passwords or API keys directly in Jenkinsfiles or script console.", rationale: "Prevents leaking sensitive infrastructure credentials in version control or build logs." },
          { do: "Configure dynamic Kubernetes pod agents for elastic scalability and zero idle costs.", dont: "Maintain static, long-lived VM build servers that accumulate build artifact drift.", rationale: "Ensures a completely clean, pristine build environment for every commit." }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: "Jenkins Agent Disconnects Unexpectedly During Heavy Build",
        symptom: "Build fails with 'java.io.IOException: Unexpected termination of the channel'.",
        rootCause: "Agent pod was terminated by Kubernetes OOM killer due to container memory limit exceeded.",
        triageCommand: "kubectl describe pod <agent-pod-name> -n jenkins",
        solution: "Inspect pod termination reason. Increase container memory limit in the pod template specification (e.g. from 2Gi to 4Gi)."
      }
    ],
    realWorldUseCases: [
      {
        title: "FinTech Migration: Slashing Build Infrastructure Costs with Kubernetes Agents",
        companyScenario: "Online banking platform maintaining 60 static AWS EC2 Jenkins worker instances.",
        challenge: "Workers sat idle 75% of the time, costing $18,000/month in unused EC2 capacity, while peak hours experienced severe queue bottlenecks.",
        architectureSolution: "Migrated to ephemeral Kubernetes pod agents on AWS EKS using Spot Instances, dynamically spawning build pods only when jobs enter queue.",
        businessImpact: "Reduced monthly build compute costs from $18,000 down to $3,200 (82% reduction) while eliminating queue wait times during peak hours.",
        keyTakeaway: "Ephemeral containerized agents convert fixed infrastructure expenses into on-demand cloud savings."
      }
    ]
  },

  // ==========================================================================
  // 6. TERRAFORM: INFRASTRUCTURE AS CODE MASTERCLASS
  // ==========================================================================
  "terraform-infrastructure-as-code": {
    courseSlug: "terraform-infrastructure-as-code",
    title: "Terraform: Infrastructure as Code Masterclass",
    subtitle: "Complete Enterprise Guide to HCL, Remote State Locking, Modular Architecture, and Atlantis CI/CD",
    theoryDeepDive: {
      coreConcept: "Declarative Cloud Graph Theory & State Synchronization",
      keyMentalModel: "Terraform is an engine that calculates the mathematical diff between your HCL code, your state file, and live cloud APIs.",
      deepDiveParagraphs: [
        "Terraform operates on a declarative Infrastructure as Code (IaC) model using HashiCorp Configuration Language (HCL). Rather than writing procedural scripts detailing how to provision resources, engineers declare the desired end-state. The Terraform Core engine compiles code into an in-memory Directed Acyclic Graph (DAG) of resources, infers implicit dependencies (e.g., an EC2 instance depends on a Subnet, which depends on a VPC), and executes independent resources in parallel.",
        "The State File (`terraform.tfstate`) is the critical single source of truth that maps declarative HCL resources to real-world cloud provider metadata (resource IDs, ARNs, public IPs, and computed attributes). Without state, Terraform cannot know which cloud resources it manages versus which resources belong to other teams.",
        "In production enterprise environments, state files must never be stored on local laptops or committed to Git. They must be stored in secure Remote Backends (such as AWS S3 with AES-256 encryption and DynamoDB distributed state locking, or Terraform Cloud/HCP). Remote state locking guarantees that two concurrent CI/CD pipelines cannot modify infrastructure simultaneously, preventing state file corruption."
      ]
    },
    architecture: {
      title: "Terraform Remote Backend & Execution Pipeline Architecture",
      description: "How HCL manifests compile through Core DAG, query remote state with DynamoDB locking, and interact with cloud APIs.",
      diagramAscii: `
+-----------------------------------------------------------------------+
| DEVELOPER WORKSTATION / ATLANTIS PULL REQUEST                         |
| - HCL Code: main.tf, variables.tf, outputs.tf, modules/               |
+-----------------------------------------------------------------------+
                                  |
               +------------------+------------------+
               |                                     |
               v (Acquires State Lock)               v (Reads State File)
+------------------------------------+  +-------------------------------+
| AWS DYNAMODB (State Lock Table)    |  | AWS S3 BUCKET (Encrypted tfstate|
| - Prevents concurrent apply race   |  | - Versioned, AES-256, TLS     |
+------------------------------------+  +-------------------------------+
               |                                     |
               +------------------+------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| TERRAFORM CORE ENGINE (Graph Builder)                                 |
| 1. terraform init    -> Downloads Provider Plugins (AWS, Azure, K8s)  |
| 2. terraform plan    -> Compares Code vs State vs Live Cloud APIs     |
| 3. terraform apply   -> Executes REST API calls in dependency order   |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| TARGET CLOUD PROVIDERS: AWS (VPC, EKS, RDS) | Cloudflare | Datadog     |
+-----------------------------------------------------------------------+
      `,
      components: [
        {
          name: "Terraform Core",
          role: "Graph Construction & Diff Computation Engine",
          keyConcept: "Parses HCL, constructs DAG dependency graph, compares state against real cloud resources, and formulates execution plan.",
          failureDomain: "Malformed HCL syntax or circular resource dependencies halt execution plan."
        },
        {
          name: "Provider Plugins",
          role: "API Translation Bridge",
          keyConcept: "Decoupled Go binaries (e.g. `terraform-provider-aws`) translating HCL resource declarations into cloud REST API calls.",
          failureDomain: "Cloud provider API rate limits (HTTP 429) can cause apply throttling."
        },
        {
          name: "Remote State & DynamoDB Lock",
          role: "Single Source of Truth & Concurrency Guard",
          keyConcept: "Encrypted remote storage tracking provisioned resources; distributed mutex lock prevents race conditions.",
          failureDomain: "Stale lock requires manual `terraform force-unlock <lock-id>` if CI runner dies mid-execution."
        }
      ],
      dataFlow: [
        "1. Engineer runs `terraform plan`.",
        "2. Core acquires lock in DynamoDB table.",
        "3. Core retrieves latest `terraform.tfstate` from S3 bucket.",
        "4. Provider plugins call cloud REST APIs (e.g. AWS `DescribeVpcs`) to refresh state and detect external drift.",
        "5. Core computes delta between live infrastructure, state file, and HCL code, printing proposed changes (+create, ~update, -destroy).",
        "6. Core releases lock."
      ]
    },
    commandCheatSheet: [
      {
        category: "Core Workflow Commands",
        description: "Standard lifecycle commands for provisioning and drift detection.",
        commands: [
          { cmd: "terraform init -backend-config=backend.hcl", desc: "Initialize working directory, download providers, and connect to remote backend." },
          { cmd: "terraform plan -out=tfplan.binary", desc: "Generate and save a deterministic execution plan file." },
          { cmd: "terraform apply tfplan.binary", desc: "Apply the exact previously generated plan file safely." },
          { cmd: "terraform fmt -recursive", desc: "Canonically format all HCL files in current and subdirectories." },
          { cmd: "terraform validate", desc: "Verify syntax and internal resource reference integrity without connecting to cloud APIs." }
        ]
      },
      {
        category: "State Management & Triage",
        description: "Manipulate state safely without modifying cloud resources.",
        commands: [
          { cmd: "terraform state list", desc: "List all resource addresses tracked in the current state file." },
          { cmd: "terraform state show <resource_address>", desc: "Display all recorded attributes and IDs for a specific resource in state." },
          { cmd: "terraform state mv <old_address> <new_address>", desc: "Rename or move a resource in state without triggering destroy/recreate." },
          { cmd: "terraform import <resource_address> <cloud_id>", desc: "Import an existing manually created cloud resource into Terraform state." },
          { cmd: "terraform force-unlock <lock-id>", desc: "Manually release a stuck DynamoDB lock after an aborted pipeline run." }
        ]
      }
    ],
    practicalLabs: [
      {
        id: "lab-tf-01",
        title: "Lab 1: Authoring a Production AWS VPC Module with Remote S3 Backend",
        difficulty: "Intermediate",
        estimatedTime: "30 mins",
        objective: "Build a reusable, modular Terraform module that provisions a multi-AZ VPC with public and private subnets, NAT Gateways, and remote S3 state storage.",
        prerequisites: ["Terraform CLI installed", "AWS credentials configured"],
        steps: [
          {
            step: 1,
            title: "Configure remote backend in backend.tf",
            instruction: "Declare remote S3 backend with DynamoDB locking.",
            command: "cat << \"EOF\" > backend.tf\nterraform {\n  required_version = \">= 1.5.0\"\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\nEOF",
            expectedOutput: "backend.tf created."
          },
          {
            step: 2,
            title: "Author dynamic VPC resource block in main.tf",
            instruction: "Use cidrsubnet function to dynamically calculate multi-AZ subnets.",
            command: "cat << \"EOF\" > main.tf\nvariable \"vpc_cidr\" { default = \"10.0.0.0/16\" }\nvariable \"azs\" { default = [\"us-east-1a\", \"us-east-1b\"] }\n\nresource \"aws_vpc\" \"main\" {\n  cidr_block           = var.vpc_cidr\n  enable_dns_hostnames = true\n  enable_dns_support   = true\n  tags = { Name = \"prod-vpc\", ManagedBy = \"Terraform\" }\n}\n\nresource \"aws_subnet\" \"public\" {\n  count                   = length(var.azs)\n  vpc_id                  = aws_vpc.main.id\n  cidr_block              = cidrsubnet(var.vpc_cidr, 4, count.index)\n  availability_zone       = var.azs[count.index]\n  map_public_ip_on_launch = true\n  tags = { Name = \"public-subnet-${count.index + 1}\" }\n}\nEOF",
            expectedOutput: "main.tf created."
          },
          {
            step: 3,
            title: "Validate and generate execution plan",
            instruction: "Format, validate, and verify proposed resource creation.",
            command: "terraform fmt && terraform validate",
            expectedOutput: "Success! The configuration is valid."
          }
        ],
        verification: "Run `terraform plan` and confirm Terraform plans to create 1 VPC and 2 Subnets with proper CIDR calculations."
      }
    ],
    capstoneProjects: [
      {
        id: "proj-tf-capstone",
        title: "Enterprise Multi-Region Infrastructure Suite with Atlantis Pull-Request Workflows",
        level: "Enterprise",
        estimatedHours: "16 Hours",
        overview: "Design a production-grade multi-environment (Dev, Staging, Prod) AWS cloud foundation using Terraform and Terragrunt. Incorporate OPA (Open Policy Agent) / tfsec policy checks, S3 encrypted remote backends, automated pull-request review with Atlantis, and drift detection cron jobs.",
        architectureSummary: "Terragrunt DRY architecture separating environments by folder hierarchy, sharing standard reusable modules, and executing automated `atlantis plan` and `atlantis apply` via GitHub PR comments.",
        techStack: ["Terraform", "Terragrunt", "Atlantis", "AWS", "OPA / Conftest", "tfsec"],
        milestones: [
          {
            title: "Milestone 1: Reusable Enterprise Modules",
            tasks: [
              "Author standardized modules for VPC, EKS Cluster, and RDS Aurora PostgreSQL.",
              "Enforce encryption at rest, IMDSv2, and tag policies via tfsec static scans."
            ],
            deliverable: "Modular repository passing tfsec security scans."
          },
          {
            title: "Milestone 2: Atlantis Pull Request Automation",
            tasks: [
              "Deploy Atlantis server; configure GitHub webhook to execute automated plan on PR creation.",
              "Require positive peer reviews before permitting `atlantis apply` execution via PR comment."
            ],
            deliverable: "Verified PR demonstrating automated plan and apply cycle."
          }
        ],
        verificationCriteria: [
          "Zero code duplication across Dev, Staging, and Prod configurations (DRY).",
          "tfsec blocks pull requests that attempt to provision unencrypted S3 buckets.",
          "State locks prevent concurrent pull-request applies from clashing."
        ]
      }
    ],
    interviewQuestions: [
      {
        id: "tf-q1",
        category: "State & Architecture",
        question: "A developer manually deleted a production Security Group in the AWS Web Console. What happens during the next 'terraform apply', and how does Terraform reconcile this drift?",
        answer: "When `terraform plan` or `apply` is executed, Terraform first performs a 'Refresh' step: it queries cloud provider APIs for every resource listed in the state file. When it queries the AWS API for the deleted Security Group ID, AWS returns `ResourceNotFound`. Terraform updates its in-memory state to reflect that the resource is missing. It then compares this in-memory refreshed state against the HCL code, which still declares the Security Group. Recognizing the delta, Terraform generates an execution plan with `+ create` to recreate the Security Group in AWS with matching configurations, successfully remediating the out-of-band drift.",
        keyPoints: [
          "Terraform refresh phase queries live cloud APIs to detect out-of-band changes",
          "Missing cloud resources are detected and marked as non-existent in refreshed state",
          "The plan proposes recreation (+ create) to reconcile drift back to declared HCL",
          "Use terraform plan -refresh-only to inspect drift without applying updates"
        ]
      }
    ],
    bestPractices: [
      {
        category: "State Security & Hygiene",
        practices: [
          { do: "Enable S3 bucket versioning and SSE-KMS encryption on remote state storage.", dont: "Commit terraform.tfstate or terraform.tfvars files containing passwords to Git.", rationale: "State files contain plaintext outputs, passwords, and sensitive database connection strings." },
          { do: "Always separate environments (Dev, Staging, Prod) by separate state files and directories.", dont: "Use Terraform Workspaces for managing fundamentally different environments like Dev vs Prod.", rationale: "Workspaces share backend storage and credentials; directory isolation limits blast radius." }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: "DynamoDB State Lock Error (Error acquiring the state lock)",
        symptom: "terraform plan fails with 'ConditionalCheckFailedException: The conditional request failed'.",
        rootCause: "Another developer or CI pipeline is currently running, or a previous pipeline aborted abruptly leaving a stale lock ID.",
        triageCommand: "Check output for 'Lock Info: ID: <lock-string>, Created: <date>'",
        solution: "Confirm no active pipeline is executing. Run `terraform force-unlock <lock-string>` to release the mutex lock safely."
      }
    ],
    realWorldUseCases: [
      {
        title: "Healthcare Tech: Remediating Infrastructure Drift Across 40 AWS Accounts",
        companyScenario: "HIPAA-compliant health tech platform managing 40 AWS cloud accounts.",
        challenge: "Engineers made manual emergency console edits during outages, causing severe infrastructure drift and compliance audit failures.",
        architectureSolution: "Implemented automated hourly `terraform plan -detailed-exitcode` drift detection cron jobs dispatching alerts to Slack, paired with automated remediation pipelines.",
        businessImpact: "Achieved 100% HIPAA compliance audit score and eliminated unauthorized manual cloud console changes entirely.",
        keyTakeaway: "Declarative IaC with continuous drift auditing enforces enterprise governance and security posture."
      }
    ]
  },

  // ==========================================================================
  // 7. ANSIBLE CONFIGURATION MANAGEMENT MASTERCLASS
  // ==========================================================================
  "ansible-automation": {
    courseSlug: "ansible-automation",
    title: "Ansible Configuration Management Masterclass",
    subtitle: "Complete Enterprise Guide to Agentless Automation, Idempotent Playbooks, Roles, and AWX Orchestration",
    theoryDeepDive: {
      coreConcept: "Agentless Architecture, Push-Based Execution & Mathematical Idempotence",
      keyMentalModel: "Ansible executes declarative tasks idempotently: if the desired state is already met, Ansible makes zero modifications.",
      deepDiveParagraphs: [
        "Ansible is an open-source, agentless IT automation engine built on Python. Unlike traditional configuration tools (such as Puppet or Chef) that require proprietary background daemons, persistent agent certificates, and open inbound ports on managed nodes, Ansible requires ZERO software installed on target servers. It communicates purely over standard, battle-tested OpenSSH (for Linux/Unix) or WinRM (for Windows).",
        "The control model is Push-Based: the Control Node parses YAML Playbooks, connects to managed hosts listed in Inventory files, executes a fact-gathering step (`setup` module), compiles standalone Python payload scripts for each task, transfers them to `/tmp` on target nodes via SFTP/SCP, executes the scripts, parses JSON results, and removes the temporary scripts.",
        "The most vital principle in Ansible is Idempotence. An idempotent playbook can be executed 100 times consecutively against a server; on the first run it makes necessary modifications (reporting `changed: true`), while on runs 2 through 100 it verifies that current state matches desired state and takes no action (reporting `ok: true, changed: false`), ensuring stability."
      ]
    },
    architecture: {
      title: "Ansible Agentless Push-Based Execution Architecture",
      description: "How Control Node parses playbooks, inventories, and roles, executing Python modules over OpenSSH.",
      diagramAscii: `
+-----------------------------------------------------------------------+
| ANSIBLE CONTROL NODE (Linux / macOS / AWX)                            |
|  +--------------------+  +-------------------+  +-------------------+ |
|  | Inventory (Dynamic)|  | YAML Playbooks    |  | Ansible Roles     | |
|  | AWS EC2 / Static   |  | Tasks, Handlers   |  | Tasks/Vars/Files  | |
|  +--------------------+  +-------------------+  +-------------------+ |
|  +------------------------------------------------------------------+ |
|  | Ansible Engine: Compiles Python Module Payloads into Memory      | |
|  +------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
                                  |
               +------------------+------------------+
               | (Standard OpenSSH, Port 22)         | (WinRM / OpenSSH)
               v                                     v
+-------------------------------+   +-----------------------------------+
| MANAGED NODE 1 (Web Server)   |   | MANAGED NODE 2 (Database Server)  |
| - Python 3 Runtime Installed  |   | - Python 3 Runtime Installed      |
| - SFTP transfers payload      |   | - SFTP transfers payload          |
| - Executes & returns JSON     |   | - Executes & returns JSON         |
| - Deletes temporary scripts   |   | - Deletes temporary scripts       |
+-------------------------------+   +-----------------------------------+
      `,
      components: [
        {
          name: "Control Node",
          role: "Central Orchestration Machine",
          keyConcept: "Runs `ansible-playbook` CLI; holds SSH private keys, playbooks, templates, and encrypted Ansible Vault files.",
          failureDomain: "Control Node failure stops active playbook execution; target nodes continue running."
        },
        {
          name: "Managed Nodes",
          role: "Target Server Fleet",
          keyConcept: "Standard Linux servers requiring only Python 3 and authorized SSH public key in `authorized_keys`.",
          failureDomain: "SSH key rotation errors or firewall blocks cause unreachable host failures."
        },
        {
          name: "Idempotent Modules",
          role: "Task Execution Units",
          keyConcept: "Specialized Python scripts (e.g. `apt`, `systemd`, `template`, `copy`) ensuring state matches declaration.",
          failureDomain: "Improper use of raw `command` or `shell` modules breaks idempotence."
        }
      ],
      dataFlow: [
        "1. Control node loads inventory and evaluates target host pattern (`webservers`).",
        "2. Control node connects via SSH to all target hosts in parallel (governed by `forks = 5`).",
        "3. Gathering Facts: Control node executes `setup` module to retrieve IP addresses, memory, OS distro, and disk space.",
        "4. For each task, control node injects Jinja2 variables into template, compiles Python script, and SCPs it to target `/tmp`.",
        "5. Target node executes Python module, returns JSON result (`{changed: true, rc: 0}`), and cleans up.",
        "6. If any task reports `changed: true` and notifies a handler, handlers trigger at the end of the play."
      ]
    },
    commandCheatSheet: [
      {
        category: "Ad-Hoc Fleet Management",
        description: "Execute immediate, one-off commands across thousands of servers simultaneously.",
        commands: [
          { cmd: "ansible all -m ping -i inventory.ini", desc: "Test SSH connectivity and Python availability across all inventory hosts." },
          { cmd: "ansible webservers -m setup -a 'filter=ansible_distribution*'", desc: "Gather distribution and OS version facts from webservers." },
          { cmd: "ansible all -m shell -a 'uptime' --become", desc: "Execute command across entire fleet with sudo root privileges." },
          { cmd: "ansible dbservers -m systemd -a 'name=postgresql state=restarted' --become", desc: "Restart a service immediately across database host group." }
        ]
      },
      {
        category: "Playbook Execution & Vault",
        description: "Run, debug, and encrypt production playbooks and variables.",
        commands: [
          { cmd: "ansible-playbook -i inventory.ini deploy.yaml --check", desc: "Dry-run execution mode: report proposed changes without making any modifications." },
          { cmd: "ansible-playbook -i inventory.ini deploy.yaml --step", desc: "Interactive step-by-step confirmation mode for each task." },
          { cmd: "ansible-vault encrypt vars/secrets.yaml", desc: "Encrypt sensitive variable file with AES-256 password protection." },
          { cmd: "ansible-vault edit vars/secrets.yaml", desc: "Edit encrypted secrets in-place without saving plaintext to disk." }
        ]
      }
    ],
    practicalLabs: [
      {
        id: "lab-ans-01",
        title: "Lab 1: Authoring an Idempotent Multi-Tier Nginx Web Stack with Handlers",
        difficulty: "Intermediate",
        estimatedTime: "30 mins",
        objective: "Write an idempotent Ansible playbook that installs Nginx, deploys a Jinja2 template with dynamic server facts, configures UFW firewalls, and triggers service reload handlers only when configuration changes.",
        prerequisites: ["Ansible installed on control node", "SSH access to target node"],
        steps: [
          {
            step: 1,
            title: "Create inventory file",
            instruction: "Define local or remote target host.",
            command: "cat << \"EOF\" > inventory.ini\n[webservers]\nlocalhost ansible_connection=local\nEOF",
            expectedOutput: "inventory.ini written."
          },
          {
            step: 2,
            title: "Author Jinja2 configuration template",
            instruction: "Create an index.html.j2 template referencing system facts.",
            command: "cat << \"EOF\" > index.html.j2\n<!DOCTYPE html>\n<html>\n<body>\n<h1>Managed by Ansible</h1>\n<p>Hostname: {{ ansible_hostname }}</p>\n<p>OS: {{ ansible_distribution }} {{ ansible_distribution_version }}</p>\n<p>IP Address: {{ ansible_default_ipv4.address }}</p>\n</body>\n</html>\nEOF",
            expectedOutput: "index.html.j2 template created."
          },
          {
            step: 3,
            title: "Author idempotent playbook with handlers",
            instruction: "Create site.yaml with package installation, template deployment, and handlers.",
            command: "cat << \"EOF\" > site.yaml\n---\n- name: Deploy Production Web Tier\n  hosts: webservers\n  become: true\n  tasks:\n    - name: Ensure Nginx is installed\n      apt:\n        name: nginx\n        state: present\n        update_cache: yes\n      when: ansible_os_family == 'Debian'\n\n    - name: Deploy dynamic homepage from Jinja2 template\n      template:\n        src: index.html.j2\n        dest: /var/www/html/index.html\n        owner: www-data\n        group: www-data\n        mode: '0644'\n      notify: Reload Nginx\n\n    - name: Ensure Nginx service is enabled and active\n      systemd:\n        name: nginx\n        state: started\n        enabled: yes\n\n  handlers:\n    - name: Reload Nginx\n      systemd:\n        name: nginx\n        state: reloaded\nEOF",
            expectedOutput: "site.yaml playbook created."
          },
          {
            step: 4,
            title: "Execute playbook and verify idempotence",
            instruction: "Run playbook twice. First run shows changed=2; second run must show changed=0.",
            command: "ansible-playbook -i inventory.ini site.yaml --syntax-check",
            expectedOutput: "Syntax OK."
          }
        ],
        verification: "Re-run the playbook and confirm that all tasks report `ok` with `changed=0`, proving strict idempotence."
      }
    ],
    capstoneProjects: [
      {
        id: "proj-ans-capstone",
        title: "Enterprise Fleet Hardening & CIS Security Compliance Suite with AWX",
        level: "Enterprise",
        estimatedHours: "14 Hours",
        overview: "Design and implement a modular Ansible Role suite that audits and hardens a 500-node mixed Linux fleet against Center for Internet Security (CIS) Level 1 benchmarks. Automate execution, role-based access control (RBAC), and scheduled compliance audits using AWX / Red Hat Ansible Automation Platform.",
        architectureSummary: "Enterprise AWX cluster connected to dynamic AWS EC2 inventory plugins, executing parameterized Ansible Roles for SSH hardening, auditd logging, sysctl network tuning, and automated CVE remediation.",
        techStack: ["Ansible", "Ansible Roles", "AWX / AAP", "Jinja2", "Ansible Vault", "CIS Benchmarks"],
        milestones: [
          {
            title: "Milestone 1: Modular CIS Hardening Role",
            tasks: [
              "Create standard role directory structure (`roles/cis_hardening/{tasks,vars,handlers,templates}`).",
              "Enforce kernel parameter hardening in `/etc/sysctl.d/99-cis.conf` via template.",
              "Restrict `/etc/shadow` and `/etc/passwd` file permissions to 0000 and 0644."
            ],
            deliverable: "Idempotent Ansible Role published to local Git repository."
          },
          {
            title: "Milestone 2: Dynamic Cloud Inventory & AWX Job Template",
            tasks: [
              "Configure AWS EC2 dynamic inventory plugin grouping hosts by tags (`env:prod`, `role:api`).",
              "Configure AWX Job Template with Vault credentials to execute weekly automated compliance audits."
            ],
            deliverable: "Automated AWX job run report with zero configuration drift."
          }
        ],
        verificationCriteria: [
          "Role passes `ansible-lint` with zero warnings.",
          "Executing against a fresh Linux node passes 95%+ of automated CIS compliance audit checks.",
          "Subsequent executions report `changed=0`, verifying complete idempotence."
        ]
      }
    ],
    interviewQuestions: [
      {
        id: "ans-q1",
        category: "Execution Mechanics",
        question: "How does Ansible enforce idempotence? Why is using the 'shell' or 'command' module generally considered an anti-pattern?",
        answer: "Ansible enforces idempotence because native modules (such as `copy`, `apt`, `user`, `systemd`) query current system state before executing actions. For example, before creating a user, the `user` module checks `/etc/passwd`. If the user exists with identical UID, group, and shell, it returns `changed: false` and exits without action. In contrast, the `shell` and `command` modules execute raw shell strings that the Ansible engine cannot inspect. By default, Ansible assumes `command` and `shell` always alter system state and reports `changed: true` every run. If you must use `shell`, you must add `creates: /path/to/file` or `changed_when: false` directives to restore idempotence.",
        keyPoints: [
          "Native modules inspect target state before taking action",
          "shell and command bypass state checks and always flag changed: true",
          "Breaks idempotence and triggers downstream handlers unnecessarily",
          "Use creates/removes or changed_when to make shell tasks idempotent"
        ]
      }
    ],
    bestPractices: [
      {
        category: "Playbook Architecture & Hygiene",
        practices: [
          { do: "Structure complex automation into reusable Ansible Roles (`roles/common`, `roles/nginx`).", dont: "Write monolithic 1,500-line playbooks containing all tasks in a single file.", rationale: "Roles encourage modularity, parameterization, automated testing, and team reuse." },
          { do: "Always use Ansible Vault to encrypt production passwords, API tokens, and private keys.", dont: "Commit plaintext credentials into group_vars or inventory files.", rationale: "Maintains zero-trust secrets posture across corporate repositories." }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: "Host Unreachable: SSH Authentication Failed",
        symptom: "Playbook aborts with 'Failed to connect to the host via ssh: Permission denied (publickey)'.",
        rootCause: "SSH private key not specified, wrong user account, or host's `authorized_keys` lacks control node's public key.",
        triageCommand: "ansible <host> -m ping -vvv",
        solution: "Inspect verbose SSH handshake output. Pass explicit SSH key (`--private-key ~/.ssh/id_ed25519`) or specify user (`-u ubuntu`)."
      }
    ],
    realWorldUseCases: [
      {
        title: "Global Telecom: 5-Minute Zero-Day Vulnerability Patching Across 12,000 Servers",
        companyScenario: "Telecom operator managing 12,000 Linux network appliances and billing servers.",
        challenge: "A critical OpenSSL Remote Code Execution zero-day required immediate remediation across the entire global server fleet in under 1 hour.",
        architectureSolution: "Executed an optimized Ansible ad-hoc command tuned with `forks = 200` and pipeline execution: `ansible all -m package -a 'name=openssl state=latest' --become`.",
        businessImpact: "Successfully patched all 12,000 nodes in exactly 4 minutes and 42 seconds with zero operational disruption.",
        keyTakeaway: "Agentless SSH orchestration provides unparalleled rapid response capability for emergency enterprise incident management."
      }
    ]
  },

  // ==========================================================================
  // 8. AWS FOR DEVOPS ENGINEERS MASTERCLASS
  // ==========================================================================
  "aws-devops-engineer": {
    courseSlug: "aws-devops-engineer",
    title: "AWS for DevOps Engineers Masterclass",
    subtitle: "Complete Enterprise Guide to Multi-AZ VPCs, EKS IRSA, Serverless, IAM Least Privilege, and FinOps",
    theoryDeepDive: {
      coreConcept: "Multi-Account Cloud Governance, IAM Boundary Logic & Well-Architected Reliability",
      keyMentalModel: "In AWS, security is the foundation of architecture. Every API call is explicitly denied unless authorized by evaluated IAM policies.",
      deepDiveParagraphs: [
        "AWS cloud architecture for DevOps is centered around the AWS Well-Architected Framework: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. At the foundational identity layer, AWS Identity and Access Management (IAM) evaluates policies with a strict hierarchy: an Explicit Deny always overrides an Explicit Allow, which overrides the default Implicit Deny.",
        "Production enterprise environments mandate a multi-account strategy using AWS Organizations and Control Tower. Workloads are partitioned into isolated accounts (e.g., Identity, Network, Security, Dev, Staging, Prod) governed by Service Control Policies (SCPs) that enforce non-bypassable guardrails (such as forbidding public S3 buckets or disabling CloudTrail).",
        "Modern cloud-native compute on AWS centers on Amazon Elastic Kubernetes Service (EKS) and AWS Lambda. In EKS, the industry standard security pattern is IAM Roles for Service Accounts (IRSA): using an OpenID Connect (OIDC) identity provider, individual Kubernetes Pods assume dedicated AWS IAM roles with short-lived STS tokens, completely eliminating static AWS access keys."
      ]
    },
    architecture: {
      title: "Enterprise Multi-AZ VPC & Cloud-Native Workload Architecture",
      description: "High-availability multi-AZ topology featuring Public, Private App, and Isolated DB subnets with EKS IRSA and RDS Aurora failover.",
      diagramAscii: `
+-----------------------------------------------------------------------+
| AWS REGION (e.g. us-east-1) - MULTI-AZ ENTERPRISE VPC                 |
|  +-----------------------------------------------------------------+  |
|  | PUBLIC SUBNETS (AZ-A / AZ-B)                                    |  |
|  | - Internet Gateway (IGW) route (0.0.0.0/0)                      |  |
|  | - Application Load Balancer (ALB) [SSL/TLS Termination]         |  |
|  | - Managed NAT Gateways (AZ-A / AZ-B Redundancy)                 |  |
|  +-----------------------------------------------------------------+  |
|                                  |
|                                  v
|  +-----------------------------------------------------------------+  |
|  | PRIVATE APPLICATION SUBNETS (AZ-A / AZ-B)                       |  |
|  | - Route to NAT Gateway for outbound internet egress             |  |
|  | - Amazon EKS Worker Node Managed Node Groups                    |  |
|  | - IAM Roles for Service Accounts (IRSA) via OIDC Provider       |  |
|  +-----------------------------------------------------------------+  |
|                                  |
|                                  v
|  +-----------------------------------------------------------------+  |
|  | PRIVATE ISOLATED DATABASE SUBNETS (AZ-A / AZ-B)                 |  |
|  | - Zero internet route (no IGW, no NAT)                          |  |
|  | - Amazon Aurora PostgreSQL Multi-AZ Cluster (Primary + Replica) |  |
|  | - Encrypted at rest via AWS KMS (Customer Managed Key)         |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
      `,
      components: [
        {
          name: "VPC & Subnet Topology",
          role: "Isolated Network Boundary",
          keyConcept: "Partitions workloads into Public (ALB), Private (Compute), and Isolated (Data) subnets across multiple Availability Zones.",
          failureDomain: "AZ outage is mitigated by automated Multi-AZ load balancer health checks and RDS failover."
        },
        {
          name: "IAM Roles for Service Accounts (IRSA)",
          role: "Zero-Static-Credential Workload Identity",
          keyConcept: "EKS pods exchange Kubernetes service account tokens for short-lived AWS STS temporary credentials via OIDC.",
          failureDomain: "OIDC thumbprint mismatch prevents pods from assuming AWS IAM roles."
        },
        {
          name: "Amazon Aurora Multi-AZ",
          role: "High-Availability Relational Database",
          keyConcept: "Replicates storage 6 ways across 3 AZs; provides automated sub-30-second failover to read replica upon primary crash.",
          failureDomain: "Storage layer is distributed across 3 AZs with quorum write architecture."
        }
      ],
      dataFlow: [
        "1. Client sends HTTPS request to Route 53 DNS record pointing to AWS ALB.",
        "2. ALB terminates TLS using ACM certificate, inspects HTTP headers, and forwards to EKS target group pods.",
        "3. Pod in private subnet processes request; needs access to AWS S3 bucket.",
        "4. Pod exchanges service account JWT with AWS STS via IRSA, receiving temporary 1-hour credentials.",
        "5. Pod connects to Amazon Aurora in isolated database subnet over private security group port 5432.",
        "6. Outbound telemetry logs stream through VPC Endpoints (PrivateLink) directly to CloudWatch without traversing public internet."
      ]
    },
    commandCheatSheet: [
      {
        category: "AWS CLI Core Operations",
        description: "Query infrastructure, assume roles, and triage cloud resources.",
        commands: [
          { cmd: "aws sts get-caller-identity", desc: "Verify active authenticated IAM identity (account ID, user/role ARN)." },
          { cmd: "aws sts assume-role --role-arn <role-arn> --role-session-name ci-session", desc: "Obtain temporary short-lived credentials for cross-account deployment." },
          { cmd: "aws ec2 describe-instances --filters 'Name=instance-state-name,Values=running' --query 'Reservations[*].Instances[*].[InstanceId,PrivateIpAddress,Tags[?Key==`Name`].Value|[0]]' --output table", desc: "Tabular overview of running EC2 instances with private IPs and Name tags." },
          { cmd: "aws eks update-kubeconfig --region us-east-1 --name prod-cluster", desc: "Generate local kubeconfig credentials to interact with EKS cluster via kubectl." }
        ]
      },
      {
        category: "Security & FinOps Cost Optimization",
        description: "Identify unattached resources and enforce compliance.",
        commands: [
          { cmd: "aws ec2 describe-volumes --filters Name=status,Values=available --query 'Volumes[*].[VolumeId,Size,CreateTime]' --output table", desc: "Find unattached EBS volumes wasting money." },
          { cmd: "aws s3 ls && aws s3api get-bucket-encryption --bucket <name>", desc: "Verify default AES-256 or KMS encryption is active on S3 bucket." }
        ]
      }
    ],
    practicalLabs: [
      {
        id: "lab-aws-01",
        title: "Lab 1: Configuring IAM Roles for Service Accounts (IRSA) on Amazon EKS",
        difficulty: "Advanced",
        estimatedTime: "35 mins",
        objective: "Configure an IAM OIDC Identity Provider on an EKS cluster, author a fine-grained least-privilege IAM policy, and bind it to a Kubernetes ServiceAccount so a pod can read an S3 bucket with zero static access keys.",
        prerequisites: ["AWS CLI configured", "EKS cluster access", "kubectl CLI"],
        steps: [
          {
            step: 1,
            title: "Create test S3 bucket with KMS encryption",
            instruction: "Create private S3 bucket to test access.",
            command: "BUCKET_NAME=irsa-demo-$(date +%s) && aws s3 mb s3://$BUCKET_NAME && aws s3api put-bucket-encryption --bucket $BUCKET_NAME --server-side-encryption-configuration '{\"Rules\": [{\"ApplyServerSideEncryptionByDefault\": {\"SSEAlgorithm\": \"AES256\"}}]}'",
            expectedOutput: "make_bucket: irsa-demo-xxxx"
          },
          {
            step: 2,
            title: "Author IAM Least-Privilege Policy",
            instruction: "Allow read-only access strictly to the target bucket.",
            command: "cat << EOF > s3-policy.json\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:GetObject\", \"s3:ListBucket\"],\n      \"Resource\": [\"arn:aws:s3:::$BUCKET_NAME\", \"arn:aws:s3:::$BUCKET_NAME/*\"]\n    }\n  ]\n}\nEOF",
            expectedOutput: "s3-policy.json written."
          },
          {
            step: 3,
            title: "Bind Kubernetes ServiceAccount to IAM Role",
            instruction: "Annotate Kubernetes ServiceAccount with IAM Role ARN.",
            command: "kubectl create serviceaccount s3-reader-sa --namespace default 2>/dev/null || true\necho 'ServiceAccount created with eks.amazonaws.com/role-arn annotation.'",
            expectedOutput: "ServiceAccount configured."
          }
        ],
        verification: "Deploy test pod with `serviceAccountName: s3-reader-sa` and run `aws s3 ls s3://$BUCKET_NAME` to confirm successful access."
      }
    ],
    capstoneProjects: [
      {
        id: "proj-aws-capstone",
        title: "Enterprise Multi-Region Serverless & EKS Hybrid Platform on AWS",
        level: "Enterprise",
        estimatedHours: "18 Hours",
        overview: "Architect a resilient multi-tier financial microservices platform on AWS. Build a multi-AZ VPC network, deploy an Amazon EKS cluster with managed node groups and IRSA, configure Amazon Aurora Serverless v2 PostgreSQL, implement event-driven background processing via AWS Lambda and SQS, and establish real-time CloudWatch Container Insights observability.",
        architectureSummary: "Enterprise multi-tier architecture spanning multi-AZ VPC subnets, AWS ALB, EKS, Aurora Serverless, EventBridge, Lambda, KMS, and CloudWatch telemetry.",
        techStack: ["AWS EKS", "AWS Lambda", "Amazon Aurora", "SQS", "EventBridge", "CloudWatch", "AWS KMS", "Terraform"],
        milestones: [
          {
            title: "Milestone 1: VPC Network Topology & Security Boundaries",
            tasks: [
              "Provision multi-AZ VPC with public, private app, and isolated database subnets.",
              "Deploy VPC Endpoints (PrivateLink) for S3, ECR, and CloudWatch to avoid NAT gateway egress charges."
            ],
            deliverable: "Terraform manifests provisioning compliant network topology."
          },
          {
            title: "Milestone 2: Serverless Event Pipeline with Dead Letter Queues",
            tasks: [
              "Deploy AWS SQS FIFO queue with Dead Letter Queue (DLQ) and Lambda event consumer.",
              "Configure CloudWatch Alarms on DLQ depth to trigger PagerDuty alerts upon failed processing."
            ],
            deliverable: "Verified event processing pipeline with automated error handling."
          }
        ],
        verificationCriteria: [
          "Zero resources in private or database subnets have public IP addresses.",
          "EKS pods authenticate to AWS services without static ACCESS_KEY credentials.",
          "Simulated AZ failure causes zero loss of database transactions."
        ]
      }
    ],
    interviewQuestions: [
      {
        id: "aws-q1",
        category: "Cloud Security",
        question: "Explain the IAM policy evaluation logic. What happens if a User has an IAM Policy allowing 's3:*', but an attached Permission Boundary omits 's3:DeleteObject'?",
        answer: "AWS IAM evaluates authorization using a strict decision tree: 1. By default, all requests are implicitly denied. 2. An explicit deny in any applicable policy (SCP, Permission Boundary, IAM Policy, Resource Policy) immediately halts evaluation and denies the request. 3. If no explicit deny exists, there must be an explicit allow in the IAM identity policy. 4. If a Permission Boundary is attached, the action MUST be explicitly allowed in BOTH the identity policy AND the permission boundary (the intersection of permissions). In this scenario, because the Permission Boundary omits `s3:DeleteObject`, the user CANNOT delete objects, because the action is not allowed within their maximum allowable boundary.",
        keyPoints: [
          "Explicit Deny always overrides all allows across all policy types",
          "Permission Boundaries define the maximum allowable boundary",
          "Effective permissions equal the mathematical intersection between IAM policy and boundary",
          "User cannot delete S3 objects because the boundary does not allow it"
        ]
      }
    ],
    bestPractices: [
      {
        category: "Security & Cost Governance",
        practices: [
          { do: "Enforce IMDSv2 (Instance Metadata Service v2 with session tokens) on all EC2 instances.", dont: "Leave IMDSv1 enabled (vulnerable to SSRF credential exfiltration attacks).", rationale: "Prevents attackers exploiting SSRF vulnerabilities from stealing EC2 IAM role credentials." },
          { do: "Use Gateway VPC Endpoints for S3 and DynamoDB (100% free of charge).", dont: "Route high-throughput S3 backups or container image pulls through paid AWS NAT Gateways.", rationale: "Saves thousands of dollars monthly on NAT Gateway data processing fees ($0.045/GB)." }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: "EC2 Instance Cannot Reach Internet via Private Subnet",
        symptom: "curl commands hang indefinitely inside private EC2 instance.",
        rootCause: "Subnet route table lacks a route `0.0.0.0/0` pointing to an active NAT Gateway in a public subnet, or Security Group blocks outbound port 443.",
        triageCommand: "aws ec2 describe-route-tables --filters Name=association.subnet-id,Values=<subnet-id>",
        solution: "Add route `0.0.0.0/0 -> nat-gateway-id` in the private subnet route table, and ensure NAT Gateway resides in a public subnet with IGW route."
      }
    ],
    realWorldUseCases: [
      {
        title: "FinTech Scale: Cutting AWS NAT Gateway Spend by $35,000/Month with VPC Endpoints",
        companyScenario: "Cryptocurrency exchange streaming petabytes of telemetry to AWS S3 and ECR.",
        challenge: "NAT Gateway data processing charges exceeded $42,000 monthly because EKS worker nodes pulled heavy container images across NAT gateways.",
        architectureSolution: "Configured free AWS S3 and DynamoDB Gateway VPC Endpoints, and provisioned Interface Endpoints for ECR, CloudWatch, and STS.",
        businessImpact: "Reduced monthly AWS networking invoice by $35,000 instantly while slashing latency by 60%.",
        keyTakeaway: "VPC Endpoints are essential for both network security and FinOps cost optimization."
      }
    ]
  },

  // ==========================================================================
  // 9. NETWORKING FOR DEVOPS
  // ==========================================================================
  "networking-for-devops": {
    courseSlug: "networking-for-devops",
    title: "Networking for DevOps",
    subtitle: "Complete Enterprise Guide to OSI/TCP Stack, DNS, Subnetting, CNI, Load Balancers, and eBPF",
    theoryDeepDive: {
      coreConcept: "Packet Encapsulation, TCP/IP State Machines & Software-Defined Networking (SDN)",
      keyMentalModel: "Every network issue is either a Layer 4 socket/port problem or a Layer 7 application/protocol problem. Isolate the layer first.",
      deepDiveParagraphs: [
        "Digital communication across distributed cloud and container systems relies on the 4-layer TCP/IP model and 7-layer OSI model. When an application transmits data, the payload undergoes progressive Encapsulation: Application data (L7) is encapsulated into a TCP segment with source/destination ports (L4), encapsulated into an IP packet with source/destination IP addresses (L3), encapsulated into an Ethernet frame with source/destination MAC addresses (L2), and transmitted as raw bits over physical media (L1).",
        "TCP provides reliable, ordered, and error-checked byte stream delivery. Connection establishment mandates a 3-way handshake (`SYN -> SYN-ACK -> ACK`). Connection termination follows a 4-way teardown (`FIN -> ACK -> FIN -> ACK`), leaving the initiating socket in a temporary `TIME_WAIT` state for 2MSL (Maximum Segment Lifetime, typically 60 seconds) to ensure delayed duplicate packets do not corrupt subsequent connections on the same port.",
        "In Kubernetes and cloud environments, physical networking is abstracted by Software-Defined Networking (SDN). Kubernetes CNI plugins (such as Calico using BGP or Cilium using eBPF) bypass traditional Linux iptables packet processing. Cilium attaches eBPF bytecode programs directly to kernel socket and network device hooks (XDP/tc), processing packets at wire speed with microsecond latency."
      ]
    },
    architecture: {
      title: "End-to-End Enterprise Packet Flow: Client to Kubernetes Pod",
      description: "Complete journey of a web request traversing DNS, BGP Anycast CDN, Cloud NAT, ALB, and Kubernetes CNI eBPF routing.",
      diagramAscii: `
+-----------------------------------------------------------------------+
| 1. CLIENT BROWSER                                                     |
| - DNS Query: Recursive -> Root -> TLD -> Authoritative (Route 53)     |
| - Resolves to Anycast CDN Edge IP (Cloudflare / CloudFront)           |
+-----------------------------------------------------------------------+
                                  | (HTTPS Request via TLS 1.3)
                                  v
+-----------------------------------------------------------------------+
| 2. EDGE CDN & REVERSE PROXY                                           |
| - Edge TLS Termination, WAF Rule Evaluation, Static Asset Caching     |
+-----------------------------------------------------------------------+
                                  | (Forward to Origin Cloud VPC)
                                  v
+-----------------------------------------------------------------------+
| 3. AWS APPLICATION LOAD BALANCER (ALB - Layer 7)                      |
| - Evaluates Host and Path Rules (/api/v1/* -> target group)           |
| - Injects X-Forwarded-For, X-Forwarded-Proto, X-Request-ID headers    |
+-----------------------------------------------------------------------+
                                  | (TCP Packet Routed to Worker Node IP)
                                  v
+-----------------------------------------------------------------------+
| 4. KUBERNETES NODE CNI (Cilium eBPF / Calico)                         |
| - Kernel eBPF socket map replaces ClusterIP VIP with target Pod IP    |
| - Direct memory socket delivery into Pod veth interface               |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| 5. APPLICATION POD (Nginx / Node.js)                                  |
| - Accepts TCP socket connection, processes HTTP request, returns 200  |
+-----------------------------------------------------------------------+
      `,
      components: [
        {
          name: "TCP/IP Stack (Layer 4)",
          role: "End-to-End Port-to-Port Transmission",
          keyConcept: "Manages connection states (ESTABLISHED, CLOSE_WAIT, TIME_WAIT), sliding window flow control, and packet retransmissions.",
          failureDomain: "Ephemeral port exhaustion prevents new outgoing connections."
        },
        {
          name: "CoreDNS & Hierarchical Resolution",
          role: "Service Discovery Engine",
          keyConcept: "Resolves internal Kubernetes cluster domains (`svc.cluster.local`); handles recursive upstream lookups.",
          failureDomain: "ndots:5 lookup penalty multiplies DNS query volume 5x for external domains."
        },
        {
          name: "Reverse Proxy (Nginx/Traefik)",
          role: "Layer 7 Ingress Gateway",
          keyConcept: "Terminates TLS, compresses payloads (gzip/brotli), enforces rate limits, and load balances upstream pods.",
          failureDomain: "502 Bad Gateway indicates upstream app pod is dead or rejecting connections."
        },
        {
          name: "Cilium eBPF CNI",
          role: "Kernel-Level Programmable Data Plane",
          keyConcept: "Executes in-kernel packet inspection and routing without iptables connection tracking overhead.",
          failureDomain: "Kernel compatibility issues on older Linux kernels (<5.4)."
        }
      ],
      dataFlow: [
        "1. Client initiates TCP 3-way handshake (`SYN` sent to port 443).",
        "2. Server TCP stack verifies port listener, replies with `SYN-ACK`, client completes with `ACK`.",
        "3. Client and server complete TLS 1.3 cryptographic handshake (1-RTT).",
        "4. Client sends HTTP/2 GET request with headers.",
        "5. Reverse proxy inspects Layer 7 headers and forwards across internal Layer 4 socket to backend application pod.",
        "6. Application processes request, writes response bytes to socket descriptor, and returns through proxy to client."
      ]
    },
    commandCheatSheet: [
      {
        category: "Socket & Port Triage",
        description: "Diagnose port binding, active sockets, and socket state leaks.",
        commands: [
          { cmd: "ss -tulnp", desc: "List all listening TCP (-t) and UDP (-u) sockets with PID and process name." },
          { cmd: "ss -s", desc: "Display summary statistics of total sockets, TCP in TIME_WAIT, and memory buffers." },
          { cmd: "ss -tan state time-wait | wc -l", desc: "Count active sockets stuck in TIME_WAIT state." },
          { cmd: "nc -zv -w 3 10.0.1.25 443", desc: "Test raw TCP socket connectivity to target host and port with 3s timeout." }
        ]
      },
      {
        category: "DNS & Route Tracing",
        description: "Troubleshoot DNS resolution latency and packet routing hops.",
        commands: [
          { cmd: "dig +trace +nodnssec api.github.com", desc: "Trace full hierarchical DNS resolution path from Root (.) down to Authoritative servers." },
          { cmd: "ip route get 8.8.8.8", desc: "Query Linux kernel routing table to determine next-hop gateway and interface for an IP." },
          { cmd: "traceroute -n -T -p 443 api.stripe.com", desc: "Trace network hops using TCP SYN packets on port 443 (bypasses ICMP firewall blocks)." }
        ]
      },
      {
        category: "Packet Inspection & eBPF",
        description: "Deep packet inspection and socket tracing.",
        commands: [
          { cmd: "sudo tcpdump -nn -i any 'tcp port 80 and (tcp[tcpflags] & tcp-syn != 0)'", desc: "Capture only incoming TCP SYN connection requests across all interfaces." },
          { cmd: "sudo tcpdump -nn -i eth0 'tcp and host 10.0.4.12' -w capture.pcap", desc: "Capture raw packet frames to file for Wireshark analysis." }
        ]
      }
    ],
    practicalLabs: [
      {
        id: "lab-net-01",
        title: "Lab 1: Diagnosing 502 Bad Gateway vs Connection Refused & Socket Leaks",
        difficulty: "Intermediate",
        estimatedTime: "30 mins",
        objective: "Simulate Layer 4 Connection Refused errors versus Layer 7 502 Bad Gateway errors, inspect TCP socket state transitions, and resolve TIME_WAIT socket exhaustion.",
        prerequisites: ["Linux terminal", "curl and netcat (nc) installed"],
        steps: [
          {
            step: 1,
            title: "Simulate Layer 4 Connection Refused",
            instruction: "Attempt connection to an unassigned port and observe TCP RST.",
            command: "curl -v --connect-timeout 2 http://127.0.0.1:9999 2>&1 | grep -i -E 'refused|reset'",
            expectedOutput: "Failed to connect to 127.0.0.1 port 9999: Connection refused."
          },
          {
            step: 2,
            title: "Start raw TCP socket listener",
            instruction: "Open a temporary listening socket on port 9999 using netcat.",
            command: "nc -l -p 9999 &\nsleep 1 && ss -tulnp | grep 9999",
            expectedOutput: "LISTEN socket active on port 9999."
          },
          {
            step: 3,
            title: "Connect client and observe ESTABLISHED state",
            instruction: "Connect to the netcat listener and verify socket state transition.",
            command: "echo 'PING' | nc 127.0.0.1 9999 &\nsleep 1 && ss -tan | grep 9999",
            expectedOutput: "Socket transitioned to ESTABLISHED or TIME_WAIT."
          }
        ],
        verification: "Run `ss -tan | grep 9999` to observe the socket state lifecycle."
      }
    ],
    capstoneProjects: [
      {
        id: "proj-net-capstone",
        title: "Zero-Trust Microsegmentation & High-Availability Reverse Proxy Architecture",
        level: "Production",
        estimatedHours: "14 Hours",
        overview: "Design and implement an enterprise zero-trust network topology. Configure Nginx reverse proxy with SSL/TLS termination, HTTP/2 multiplexing, rate-limiting, and automated Let's Encrypt renewal. Implement Calico NetworkPolicies to enforce zero-trust microsegmentation between frontend, API, and database workloads.",
        architectureSummary: "Dual-tier reverse proxy architecture with strict Layer 7 rate limiting, mutual TLS (mTLS) upstream authentication, and Layer 4 packet microsegmentation.",
        techStack: ["Nginx", "OpenSSL", "Calico CNI", "Cert-Manager", "tcpdump", "Wireshark"],
        milestones: [
          {
            title: "Milestone 1: Hardened Reverse Proxy Configuration",
            tasks: [
              "Author nginx.conf with TLS 1.3 only, modern cipher suites, and HSTS headers.",
              "Configure connection rate limiting (10 req/sec per client IP) to mitigate Layer 7 DDoS."
            ],
            deliverable: "nginx.conf achieving A+ rating on SSL Labs."
          },
          {
            title: "Milestone 2: Kubernetes NetworkPolicy Microsegmentation",
            tasks: [
              "Author default-deny-all ingress and egress NetworkPolicy.",
              "Explicitly permit only frontend pods to talk to backend API pods on port 8080."
            ],
            deliverable: "Verified NetworkPolicy manifests blocking unauthorized traffic."
          }
        ],
        verificationCriteria: [
          "SSL Labs scanner awards A+ score with zero insecure ciphers.",
          "Unauthorized pod attempting to curl database is instantly blocked at Layer 4."
        ]
      }
    ],
    interviewQuestions: [
      {
        id: "net-q1",
        category: "Protocol Fundamentals",
        question: "Explain the exact technical difference between an HTTP 502 Bad Gateway and an HTTP 504 Gateway Timeout. At what layer do they occur?",
        answer: "Both are Layer 7 (Application Layer) errors returned by a reverse proxy (like Nginx, Traefik, or AWS ALB) acting as a gateway to upstream application servers. A 502 Bad Gateway occurs when the proxy successfully connected to the upstream backend, but the backend returned an invalid, malformed, or empty HTTP response, or abruptly closed the TCP connection before sending complete headers. A 504 Gateway Timeout occurs when the proxy connected to the upstream backend, but the backend took longer to generate and return a response than the proxy's configured read timeout (`proxy_read_timeout` in Nginx, typically 60s). 502 indicates upstream process crash/misconfiguration; 504 indicates upstream bottleneck or deadlock.",
        keyPoints: [
          "Both are Layer 7 errors generated by the reverse proxy",
          "502 Bad Gateway: Upstream returned invalid response or RST connection abruptly",
          "504 Gateway Timeout: Upstream took longer than proxy_read_timeout to reply",
          "Diagnose 502 via upstream app error logs; diagnose 504 via database query locks"
        ]
      },
      {
        id: "net-q2",
        category: "Kubernetes Networking",
        question: "Why does Kubernetes DNS resolution frequently suffer latency penalties due to 'ndots:5'? How do you optimize it?",
        answer: "By default, Kubernetes configures `/etc/resolv.conf` inside pods with `options ndots:5` and multiple search domains (`<ns>.svc.cluster.local`, `svc.cluster.local`, `cluster.local`). The `ndots:5` rule specifies that if a queried hostname contains fewer than 5 dots (e.g. `api.stripe.com`, which has 2 dots), the DNS resolver MUST first append every search domain before querying the absolute domain! Consequently, a single lookup for `api.stripe.com` generates 4 sequential failing internal queries before finally issuing the query externally. You can optimize this by appending a trailing dot in application connection strings (`api.stripe.com.` tells the resolver it is fully qualified), or by tuning pod `dnsConfig` to set `options: [{ name: 'ndots', value: '2' }]`.",
        keyPoints: [
          "ndots:5 forces resolver to append search domains if dots < 5",
          "External domain lookups suffer 4-5 sequential failing queries",
          "Causes severe query volume overload on CoreDNS pods",
          "Resolve with trailing dot (api.stripe.com.) or tuning pod dnsConfig"
        ]
      }
    ],
    bestPractices: [
      {
        category: "Network Reliability & Sockets",
        practices: [
          { do: "Enable TCP Keepalive and configure connection pooling between microservices.", dont: "Establish a fresh TCP + TLS handshake for every single microservice HTTP request.", rationale: "Handshake latency (3-way TCP + TLS 1.3) adds 30-80ms overhead per call; connection pools reuse established sockets." },
          { do: "Configure sysctl `net.ipv4.tcp_tw_reuse = 1` on high-throughput proxy servers.", dont: "Set `net.ipv4.tcp_tw_recycle = 1` (breaks connections behind NAT gateways).", rationale: "Allows safe reuse of TIME_WAIT sockets for outgoing connections without risking packet corruption." }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: "CoreDNS Latency Spike in Kubernetes",
        symptom: "Microservices experience random 5-second DNS resolution timeouts.",
        rootCause: "Linux kernel netfilter conntrack race condition when resolving UDP DNS queries simultaneously, dropping UDP reply packets.",
        triageCommand: "kubectl logs -n kube-system -l k8s-app=kube-dns",
        solution: "Deploy NodeLocal DNSCache (daemonset caching DNS locally on each node), or switch applications to query DNS over TCP."
      },
      {
        issue: "High TIME_WAIT Socket Starvation",
        symptom: "Proxy returns 'Cannot assign requested address' (EADDRNOTAVAIL).",
        rootCause: "Proxy exhausted its local ephemeral port range (typically ~28,000 ports) due to rapid short-lived connections without pooling.",
        triageCommand: "ss -tan state time-wait | wc -l && cat /proc/sys/net/ipv4/ip_local_port_range",
        solution: "Enable `net.ipv4.tcp_tw_reuse = 1`, expand `ip_local_port_range = 10240 65535`, and enable HTTP keepalive pooling in Nginx upstream blocks."
      }
    ],
    realWorldUseCases: [
      {
        title: "Hyper-Scale FinTech: Eliminating 5-Second DNS Latency Spikes with NodeLocal DNSCache",
        companyScenario: "Payment processor running 6,000 microservice pods handling 40,000 requests/sec.",
        challenge: "0.1% of transactions randomly experienced 5,000ms latency spikes due to UDP packet drops in Linux conntrack during DNS lookups.",
        architectureSolution: "Deployed Kubernetes NodeLocal DNSCache daemonset listening on link-local IP 169.254.20.10, serving DNS requests over persistent TCP connections to CoreDNS.",
        businessImpact: "Eliminated the 5-second latency p99.9 spike completely, reducing 99th percentile API response time to under 12ms.",
        keyTakeaway: "Understanding low-level Linux kernel conntrack and socket queuing is critical for high-concurrency SREs."
      }
    ]
  }
};

export function getCourseLearningGuide(slug: string): CourseLearningGuide | null {
  return COURSE_LEARNING_GUIDES[slug] || null;
}
