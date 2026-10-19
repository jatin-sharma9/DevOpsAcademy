import { SiLinux, SiGit, SiDocker, SiKubernetes, SiJenkins, SiTerraform, SiAnsible } from "react-icons/si";
import { Cloud, Network } from "lucide-react";
import React from "react";

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: "video" | "text" | "quiz" | "lab";
  preview?: boolean;
  content?: string;
  youtubeUrl?: string;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  isPro: boolean;
  isFeatured: boolean;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  totalLessons: number;
  durationHours: number;
  instructor: string;
  instructorTitle: string;
  thumbnail: string;
  icon: React.ReactNode;
  color: string;
  tags: string[];
  whatYouLearn: string[];
  requirements: string[];
  sections: Section[];
  updatedAt: string;
}

export const COURSES: Course[] = [
  {
    id: "course_linux_001",
    slug: "linux-fundamentals",
    title: "Linux Fundamentals for DevOps",
    shortDescription: "Master the Linux command line, file systems, processes, networking, and shell scripting.",
    description: "A comprehensive Linux course designed for aspiring DevOps engineers. You'll go from absolute basics to advanced system administration, shell scripting, and automation.",
    category: "Linux",
    level: "beginner",
    price: 0,
    isPro: false,
    isFeatured: true,
    rating: 4.8,
    totalRatings: 2840,
    totalStudents: 18420,
    totalLessons: 16,
    durationHours: 18,
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer",
    thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=600",
    icon: React.createElement(SiLinux),
    color: "from-orange-500 to-yellow-500",
    tags: ["Linux", "Bash", "Shell Scripting", "System Admin", "Systemd", "LVM", "Security", "DevOps"],
    whatYouLearn: [
      "Navigate and manage the Linux Filesystem Hierarchy Standard (FHS) effortlessly",
      "Master permissions, POSIX ownership, SUID/SGID, and Access Control Lists (ACLs)",
      "Control processes, handle signals, and debug CPU/memory bottlenecks with top/htop/vmstat",
      "Write production-grade systemd unit services, timers, and inspect journalctl logs",
      "Manage storage with fdisk, mkfs, and Logical Volume Management (LVM) volume expansion",
      "Automate repetitive DevOps infrastructure tasks with Bash scripts, awk, sed, and cron jobs",
      "Troubleshoot sockets with ss/netstat, harden SSH servers, and configure UFW/iptables firewalls",
    ],
    requirements: ["Basic computer knowledge", "No prior Linux experience needed; terminal provided"],
    updatedAt: "2026-09-21",
    sections: [
      {
            id: "sec_linux_01",
            title: "Section 1: Architecture, Filesystem & Permissions (Modules 1-5)",
            lessons: [
                  {
                        id: "linux_mod_01",
                        title: "Module 1: Linux Architecture, Kernel Space vs User Space & System Calls",
                        duration: 50,
                        type: "video",
                        preview: true,
                        youtubeUrl: "https://www.youtube.com/embed/mzmqwtR8w-Q",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Linux is a POSIX-compliant, preemptive multitasking, multi-user monolithic operating system kernel. First developed by Linus Torvalds in 1991, Linux abstracts underlying bare-metal hardware and provides a standardized, secure platform for user-space programs, services, and containers.\n\n#### Architectural Mental Model: Privilege Separation\nModern computer processors (x86_64, ARM64) enforce hardware privilege separation via CPU protection rings. Linux leverages two primary execution rings:\n1. **Ring 0 (Kernel Space):** The most privileged execution domain. The Linux kernel resides here with unrestricted, direct access to physical memory (RAM), CPU control registers, interrupt vectors, and peripheral I/O devices (NVMe drives, NICs, GPUs).\n2. **Ring 3 (User Space):** The unprivileged execution domain. User applications (Nginx, Node.js, Python), standard shells (Bash, Zsh), and background daemons execute here. Code running in Ring 3 cannot directly interact with hardware; any attempt to execute a privileged instruction causes a General Protection Fault (GPF).\n\n#### The System Call Interface (SCI)\nWhen a user-space application requires hardware services—such as opening a file, allocating memory, or transmitting packets over a network socket—it must transition from Ring 3 to Ring 0. This transition occurs exclusively through the **System Call Interface (SCI)**:\n- **Trap Mechanism:** The application issues a software interrupt or specialized CPU instruction (e.g., `syscall` on x86_64 or `svc` on ARM).\n- **Context Switch:** The CPU saves the user process registers on the kernel stack and switches into supervisor mode.\n- **Syscall Dispatcher:** The kernel inspects the register containing the syscall number (stored in the `RAX` register on x86_64), validates memory bounds, and indexes into the kernel's `sys_call_table` array to execute the corresponding C kernel function (e.g., `sys_read()`, `sys_write()`, `sys_clone()`).\n- **Return & Errno:** Upon completion, the kernel writes the return value or negative error code (`errno`) back into the register and switches back to Ring 3.\n\n#### Core Kernel Subsystems\n- **Completely Fair Scheduler (CFS):** Allocates CPU execution time slices to runnable tasks using self-balancing red-black trees based on virtual runtime (`vruntime`) and process nice values.\n- **Virtual File System (VFS):** An abstraction layer that presents a uniform POSIX filesystem interface (`open`, `read`, `write`) across heterogeneous physical filesystems (ext4, XFS, Btrfs) and virtual memory pseudo-filesystems (`/proc`, `/sys`).\n- **Memory Management (MM):** Implements virtual memory with demand paging, multi-level page tables, Translation Lookaside Buffer (TLB) caching, the slab allocator for kernel objects, and swap space eviction.\n- **Linux Namespaces & Control Groups (Cgroups):** The fundamental kernel primitives powering Docker and Kubernetes. Namespaces isolate process visibility (PID, Mount, Net, IPC, UTS, User), while Cgroups restrict and throttle resource utilization (CPU, RAM, I/O bandwidth).\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| USER SPACE (Ring 3 - Unprivileged Execution)                             |\n|  +--------------------+  +-------------------+  +---------------------+  |\n|  | Web App (Node.js)  |  | Database (Postgres|  | Shell (Bash/Zsh)    |  |\n|  +--------------------+  +-------------------+  +---------------------+  |\n|  +--------------------------------------------------------------------+  |\n|  | GNU C Library (glibc): wrappers for open(), read(), write(), clone()|  |\n+--------------------------------------------------------------------------+\n                                    |\n                    [ CPU Trap: 'syscall' instruction ]\n                                    v\n+--------------------------------------------------------------------------+\n| SYSTEM CALL DISPATCHER: sys_call_table[RAX] -> Parameter Validation      |\n+--------------------------------------------------------------------------+\n                                    |\n                                    v\n+--------------------------------------------------------------------------+\n| LINUX KERNEL SPACE (Ring 0 - Supervisor Execution)                       |\n|  +--------------------+  +-------------------+  +---------------------+  |\n|  | Process Scheduler  |  | Memory Management |  | Virtual File System |  |\n|  | (CFS / Cgroups v2) |  | (Pages / MMU / OOM|  | (VFS / ext4 / XFS)  |  |\n|  +--------------------+  +-------------------+  +---------------------+  |\n|  +--------------------+  +-------------------+  +---------------------+  |\n|  | Networking Stack   |  | IPC / Sockets     |  | Device Drivers      |  |\n|  | (Netfilter / TCP)  |  | (Unix domain / shm|  | (NVMe, e1000e, DRM) |  |\n|  +--------------------+  +-------------------+  +---------------------+  |\n+--------------------------------------------------------------------------+\n                                    |\n                                    v\n+--------------------------------------------------------------------------+\n| HARDWARE LAYER: CPU (Cores / MMU) | RAM | NVMe SSDs | 10/40GbE NICs       |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Container Isolation Mechanics\nUnlike Virtual Machines (VMs), which run an entire guest kernel atop a hypervisor, Docker containers are plain Linux processes running directly on the host kernel. When you run `docker run -m 512m --cpus=1.5 nginx`:\n- The container runtime invokes `clone()` with namespace flags (`CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS | CLONE_NEWUTS | CLONE_NEWIPC`).\n- The kernel places the PID into a dedicated Cgroup directory under `/sys/fs/cgroup/memory` and `/sys/fs/cgroup/cpu` to enforce the 512MB RAM ceiling and 1.5 core CPU quota.\n- If the container exceeds 512MB, the kernel's Out-Of-Memory (OOM) killer selectively terminates the container process without impacting the host OS.\n\n#### Enterprise Use Case 2: System Call Profiling Under High Load\nIn a high-throughput microservice architecture, an API gateway may degrade from 2ms to 350ms latency. Using low-level kernel tracing (`strace` or eBPF `bpftrace`), engineers discover the application is issuing synchronous, blocking `write()` system calls for every HTTP request instead of using asynchronous, non-blocking I/O or `epoll_wait()`. Moving to epoll-driven event loops reduces kernel context switching by 92%.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. System & Kernel Identification\n```bash\n# Print kernel release, OS architecture, hostname, and compile timestamp\nuname -a\n# Expected Output:\n# Linux devops-prod-node01 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC Tue Jul  2 12:49:10 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux\n\n# Inspect exact kernel version release\nuname -r\n# Expected Output:\n# 6.8.0-40-generic\n```\n\n#### 2. CPU Architecture & Virtualization Extensions\n```bash\n# Query CPU topology, sockets, cores, threads, and hardware virtualization\nlscpu\n# Expected Output:\n# Architecture:             x86_64\n#   CPU op-mode(s):         32-bit, 64-bit\n#   Address sizes:          39 bits physical, 48 bits virtual\n#   Byte Order:             Little Endian\n# CPU(s):                   8\n#   On-line CPU(s) list:    0-7\n# Vendor ID:                GenuineIntel\n#   Model name:             Intel(R) Xeon(R) Platinum 8370C CPU @ 2.80GHz\n# Virtualization features:  \n#   Virtualization:         VT-x\n#   Hypervisor vendor:      KVM\n```\n\n#### 3. System Call Profiling on a Live Process\n```bash\n# Count time, calls, and errors for system calls executed during command run\nstrace -c ls -la /var/log\n# Expected Output:\n# % time     seconds  usecs/call     calls    errors syscall\n# ------ ----------- ----------- --------- --------- ----------------\n#  32.14    0.000450          15        30           newfstatat\n#  21.43    0.000300          10        30           getdents64\n#  14.29    0.000200           8        25           openat\n#  10.71    0.000150           6        25           close\n#   7.14    0.000100           5        20           mmap\n#   5.36    0.000075           7        10           read\n#   8.93    0.000125           6        20           write\n# ------ ----------- ----------- --------- --------- ----------------\n# 100.00    0.001400                   160           total\n```\n\n#### 4. Kernel Ring Buffer & Hardware Telemetry\n```bash\n# Display kernel error and warning messages with human-readable timestamps\nsudo dmesg -T --level=err,warn | tail -n 5\n# Expected Output:\n# [Wed Oct 14 09:12:04 2026] ACPI BIOS Warning (bug): 32/64X length mismatch in FADT/Gpe0Block: 128/32 (20230628/tbfadt-599)\n# [Wed Oct 14 09:12:05 2026] systemd-gpt-auto-generator[345]: Failed to dissect image: No such file or directory\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: Kernel Panic - Unable to mount root fs\n- **Symptom:** Server reboots and hangs on a black screen displaying:\n  `Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)`\n- **Root Cause:** The bootloader (GRUB) successfully loaded the kernel binary (`vmlinuz`), but failed to load or locate the corresponding Initial RAM Disk (`initramfs` / `initrd`), which contains the storage block device drivers (e.g., NVMe, virtio, LVM) needed to access the root partition.\n- **Triage & Recovery Runbook:**\n  1. In the GRUB boot menu, select \"Advanced options for Ubuntu/RHEL\" and select the previous working kernel version.\n  2. Once booted into the system, verify disk space on `/boot` using `df -h /boot`.\n  3. Regenerate the corrupted initramfs for the latest kernel:\n     `sudo update-initramfs -u -k all` (Debian/Ubuntu) or `sudo dracut -f --regenerate-all` (RHEL/CentOS).\n  4. Update GRUB configuration: `sudo update-grub`.\n\n#### Error 2: Fork Failed: Resource Temporarily Unavailable\n- **Symptom:** Shell commands fail immediately with:\n  `bash: fork: Cannot allocate memory` or `fork: Resource temporarily unavailable`.\n- **Root Cause:** The system has hit the kernel-level maximum PID limit (`/proc/sys/kernel/pid_max`) or the user's maximum thread/process ceiling (`nproc` in `/etc/security/limits.conf`), typically caused by a runaway thread-spawning process or fork-bomb.\n- **Triage & Recovery Runbook:**\n  1. Inspect active PID usage: `cat /proc/sys/kernel/pid_max` (default is often 32768 or 4194304 on 64-bit systems).\n  2. Inspect current process count: `ps -eLf | wc -l`.\n  3. Temporarily increase pid_max if needed: `sudo sysctl -w kernel.pid_max=4194304`.\n  4. Identify the runaway process spawning thousands of threads:\n     `ps -eo pid,nlwp,cmd --sort -nlwp | head -n 10`.\n  5. Terminate the offending process: `kill -15 <PID>`.\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: What is the exact sequence of events when an application calls read(fd, buf, count)?**  \n  *A:* The application populates CPU registers with the syscall number for `read` and arguments (`fd`, target pointer `buf`, and length `count`). It invokes the `syscall` instruction, trapping into Ring 0. The kernel validates that the file descriptor exists in the process's open file table and checks memory permissions for `buf`. The VFS dispatches the call to the underlying filesystem's inode read operation. If data resides in the kernel Page Cache (a cache hit), it is copied directly to user space. If not, the thread is placed in an Uninterruptible Sleep (`D`) state while a DMA request fetches the block from NVMe storage. Once the I/O interrupt fires, the data is loaded into the Page Cache, copied to user space, and the CPU switches back to Ring 3 returning the byte count.\n- **Q: How does a Monolithic kernel differ from a Microkernel in production reliability?**  \n  *A:* In a monolithic kernel (Linux), all core services (VFS, network stack, memory management, device drivers) run in the same single address space in Ring 0. This provides unrivaled speed because subsystems communicate via direct function pointers rather than IPC. However, a bug or memory leak in a third-party kernel driver can crash the entire operating system (Kernel Panic). Microkernels (like seL4 or Minix) run only primitive scheduling and IPC in Ring 0, executing drivers and filesystems as isolated user-space processes. A crashed driver in a microkernel can be restarted without taking down the OS, but microkernels suffer performance overhead due to continuous IPC context switching.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Inspect the low-level Linux kernel architecture, profile system call execution across common binaries, and explore kernel runtime configuration in the virtual `/proc` filesystem.\n\n#### Prerequisites\n- A Linux terminal session (Ubuntu 22.04/24.04, Debian 12, or RHEL 9).\n\n#### Execution Steps\n1. **Audit Kernel Release and Architecture:**\n   ```bash\n   uname -srm\n   hostnamectl | grep -E \"Operating System|Kernel|Architecture\"\n   ```\n   *Verification:* Ensure your kernel release is at least version 5.x or 6.x and architecture is `x86_64` or `aarch64`.\n\n2. **Inspect Hardware Topology and Microarchitecture:**\n   ```bash\n   lscpu | grep -E \"Model name|CPU(s):|Thread|Socket\"\n   ```\n\n3. **Trace System Calls for File I/O:**\n   ```bash\n   # Run strace on mkdir and inspect file creation syscalls\n   strace -e trace=file mkdir -p /tmp/devops-lab-arch\n   ```\n   *Observation:* Observe calls to `openat()`, `statx()`, and `mkdirat()`.\n\n4. **Verify Kernel Runtime Configuration via /proc:**\n   ```bash\n   # Inspect the system maximum open file descriptors ceiling\n   cat /proc/sys/fs/file-max\n   # Inspect kernel swappiness setting\n   cat /proc/sys/vm/swappiness\n   ```\n\n#### Verification Challenge\nExecute the following verification command to test whether your environment is properly configured:\n```bash\ntest -f /proc/version && test -d /sys/fs/cgroup && echo \"VERIFIED: Kernel & Cgroup subsystems online\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **Ring 0 vs Ring 3:** Kernel Space runs in CPU Ring 0 (unrestricted hardware access); User Space runs in CPU Ring 3 (isolated, safe).\n- [x] **System Call Gateway:** The only way a user program can access hardware or kernel structures is through system calls (`open`, `read`, `write`, `clone`).\n- [x] **Monolithic Speed:** Linux is a monolithic kernel; all subsystems share the same kernel address space for maximum performance.\n- [x] **Containers Are Processes:** Containers do NOT run a hypervisor or separate kernel; they are host processes segmented by Namespaces and limited by Cgroups.\n- [x] **Telemetry Tools:** Use `uname -a` for kernel identity, `lscpu` for CPU topology, `strace -c` for system call profiling, and `dmesg -T` for kernel ring buffer logs.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: What CPU protection mechanism prevents a user-space application from overwriting raw kernel memory in RAM?**\n- [ ] A) Bash shell command sanity checks\n- [x] B) Hardware-enforced MMU privilege rings (Ring 3 vs Ring 0)\n- [ ] C) Application source code compilation flags\n- [ ] D) DNS nameserver ACL restrictions\n*Explanation:* Modern CPUs use a Memory Management Unit (MMU) with hardware protection rings. User space runs in unprivileged Ring 3, where direct access to page tables and physical hardware instructions is blocked at the silicon level.\n\n**Quiz Q2: Which Linux kernel subsystem is directly responsible for throttling CPU usage on a Kubernetes container pod?**\n- [ ] A) Virtual File System (VFS)\n- [ ] B) Inotify kernel file watcher\n- [x] C) Control Groups (Cgroups) Completely Fair Scheduler (CFS) quota\n- [ ] D) Systemd journald binary logger\n*Explanation:* Control Groups (Cgroups v1/v2) work with the CFS (Completely Fair Scheduler) to enforce resource limits like `cpu.cfs_quota_us` and `cpu.cfs_period_us`, throttling processes that exceed their allotted compute quota.\n\n**Quiz Q3: What is the function of the 'dmesg' command in production incident triage?**\n- [ ] A) It downloads new kernel patches from the vendor repository\n- [x] B) It displays and filters messages from the kernel ring buffer (e.g., hardware faults, OOM kills, driver panics)\n- [ ] C) It benchmarks the write throughput of NVMe storage drives\n- [ ] D) It opens an interactive SSH terminal connection to a remote bastion\n*Explanation:* `dmesg` dumps the kernel's in-memory circular ring buffer log. It is the premier tool for diagnosing hardware failures, device detection, storage I/O errors, and kernel Out-Of-Memory (OOM) killer events."
                  },
                  {
                        id: "linux_mod_02",
                        title: "Module 2: Filesystem Hierarchy Standard & File Operations",
                        duration: 50,
                        type: "video",
                        preview: true,
                        youtubeUrl: "https://www.youtube.com/embed/42iQKuQodW4",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** The Filesystem Hierarchy Standard (FHS) is an open specification maintained by the Linux Foundation that defines the directory structure and content locations in Unix-like operating systems. By standardizing paths, FHS ensures that system administrators, package managers, and automated DevOps deployment tools can predict where executables, libraries, configuration files, and state data reside.\n\n#### Standard FHS Directory Structure\n- `/` **(Root):** The top-level ancestor directory of the entire filesystem tree. Every file and mounted block device branches from here.\n- `/bin` and `/sbin` (often symlinked to `/usr/bin` and `/usr/sbin`): Essential binaries for single-user maintenance mode and system administrators (`ls`, `cp`, `systemctl`, `ip`).\n- `/etc` **(Editable Text Configurations):** Host-specific, system-wide configuration files (e.g., `/etc/nginx/nginx.conf`, `/etc/fstab`, `/etc/hosts`). Executable binaries must never be placed in `/etc`.\n- `/var` **(Variable Data):** Dynamic, runtime-changing data such as system logs (`/var/log`), container storage images (`/var/lib/docker`), database tables (`/var/lib/postgresql`), and package caches.\n- `/opt` **(Optional Add-ons):** Self-contained, vendor-provided third-party software packages (e.g., `/opt/google/chrome`, `/opt/datadog-agent`).\n- `/tmp` **(Temporary Files):** System-wide transient files. Typically mounted as a `tmpfs` (RAM-backed in-memory filesystem) and emptied automatically on system boot or via systemd-tmpfiles.\n- `/proc` and `/sys` **(Virtual Pseudo-Filesystems):** In-memory kernel data structures exposed as files. `/proc` exposes runtime process telemetry and kernel tunable parameters; `/sys` exposes hardware buses, network devices, and cgroups.\n\n#### Inode Architecture & File Metadata\nIn Linux filesystems (ext4, XFS):\n- An **Inode (Index Node)** is a fixed-size data structure on disk that contains all metadata about a file EXCEPT its filename and its actual content data.\n- **Data stored in an Inode:** File type (regular, directory, symlink, socket, FIFO), file size in bytes, owner UID and group GID, permission bits (rwxrwxrwx), link count (`nlink`), extended attributes/ACLs, access/modification/change timestamps (`atime`, `mtime`, `ctime`), and pointers to data blocks.\n- **Directory Entries (Dentries):** A directory in Linux is simply a special file containing a list of filename-to-inode-number mappings.\n\n#### Hard Links vs. Symbolic (Soft) Links\n- **Hard Link (`ln target link`):** Creates an additional directory entry (dentry) pointing to an existing inode number on the *same* filesystem. Both filenames share identical metadata and data blocks. Deleting one filename decrements the inode's `nlink` counter; the data is only deleted from disk when `nlink` reaches 0 and no running process holds an open file descriptor to it. Hard links cannot span across different partitions or link directories.\n- **Symbolic Link (`ln -s target link`):** A distinct file with its own inode and data block that contains the text path of the target file. If the original target is moved or deleted, the symlink becomes a \"dangling\" or broken pointer. Symlinks can span across different partitions and point to directories.\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| DIRECTORY ENTRY (DENTRY)             INODE TABLE (METADATA)              |\n| +-------------------------+          +---------------------------------+ |\n| | Filename: app.conf      | -------> | Inode #458219                   | |\n| | Inode:    458219        |          | File Type: Regular File         | |\n| +-------------------------+          | Permissions: 0644 (rw-r--r--)   | |\n|                                      | UID: 1000 (appuser) GID: 1000   | |\n| +-------------------------+          | Size: 4096 bytes                | |\n| | Filename: app_hardlink  | -------> | Links (nlink): 2                | |\n| | Inode:    458219        |          | Direct Block Pointers: [Block A]| |\n| +-------------------------+          +---------------------------------+ |\n|                                                       |                  |\n|                                                       v                  |\n| +-------------------------+          +---------------------------------+ |\n| | Filename: app_symlink   |          | DATA STORAGE BLOCKS ON DISK     | |\n| | Inode:    991204        |          | [Block A]: server { listen 80; }| |\n| +-------------------------+          +---------------------------------+ |\n|              |                                        ^                  |\n|              v                                        |                  |\n| [Inode #991204: Pointer string -> \"/etc/app.conf\"]----+                  |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Zero-Downtime Blue/Green Deployment with Atomic Symlinks\nIn production deployment pipelines (Capistrano, Ansible, GitHub Actions), microservices are deployed into versioned release folders:\n```text\n/opt/myapp/\n  ├── releases/\n  │   ├── v1.2.0/ (old version)\n  │   └── v1.3.0/ (newly built version)\n  └── current -> releases/v1.3.0 (atomic symbolic link)\n```\nThe web server (Nginx/systemd) serves traffic from `/opt/myapp/current`. To update without dropping active requests, the deployer creates `releases/v1.3.0` and executes an atomic symlink switch:\n`ln -sfn /opt/myapp/releases/v1.3.0 /opt/myapp/current`\nThe `-n` (`--no-dereference`) flag treats the symlink as a normal file, swapping the target in a single atomic inode pointer swap. If the new release fails smoke tests, instant rollback is achieved by swapping back to `v1.2.0` in sub-millisecond time.\n\n#### Enterprise Use Case 2: Resolving \"Ghost\" Disk Consumption (Unlinked Open Files)\nA production incident occurs where `df -h` alerts that `/var` is 98% full. An engineer runs `rm -f /var/log/app.log`, but `df -h` still reports 98% full. This happens because the application process still holds an open file descriptor (`fd`) to the file. In Linux, deleting a file with `rm` unlinks the filename from the directory entry, but the inode and data blocks remain allocated until all processes close the file descriptor. The engineer runs `lsof +L1` to find the PID holding the unlinked file and restarts or reloads the process (`kill -HUP <PID>`), immediately reclaiming the disk space.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Finding Files by Size, Modification Date & Type\n```bash\n# Find all log files under /var/log larger than 100MB modified in the last 7 days\nfind /var/log -type f -name \"*.log\" -size +100M -mtime -7\n# Expected Output:\n# /var/log/nginx/access.log\n# /var/log/audit/audit.log\n```\n\n#### 2. Atomic Symbolic Link Creation & Updates\n```bash\n# Create directory structure and atomic release symlink\nmkdir -p /opt/app/releases/{v1,v2}\nln -sfn /opt/app/releases/v1 /opt/app/current\nls -la /opt/app/current\n# Expected Output:\n# lrwxrwxrwx 1 root root 20 Oct 14 10:15 /opt/app/current -> /opt/app/releases/v1\n\n# Atomically upgrade to release v2\nln -sfn /opt/app/releases/v2 /opt/app/current\nls -la /opt/app/current\n# Expected Output:\n# lrwxrwxrwx 1 root root 20 Oct 14 10:16 /opt/app/current -> /opt/app/releases/v2\n```\n\n#### 3. Inspecting Inode Numbers and Detailed File Metadata\n```bash\n# Display Inode number, links count, file mode, and modification timestamps\nstat /etc/hosts\n# Expected Output:\n#   File: /etc/hosts\n#   Size: 221             Blocks: 8          IO Block: 4096   regular file\n# Device: 8,1             Inode: 1048582     Links: 1\n# Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)\n# Access: 2026-10-14 09:15:20.123456789 +0000\n# Modify: 2026-10-12 18:30:11.987654321 +0000\n# Change: 2026-10-12 18:30:11.987654321 +0000\n```\n\n#### 4. Identifying Deleted Files Still Holding Disk Space\n```bash\n# Locate open unlinked files consuming storage\nsudo lsof +L1 /var\n# Expected Output:\n# COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NLINK      NODE NAME\n# python3 28410 appuser  3w   REG    8,1 1572864000     0   1049210 /var/log/app.log (deleted)\n```\n\n#### 5. Creating and Extracting High-Compression Tar Archives\n```bash\n# Create a gzip-compressed tar archive with verbose progress and date stamp\ntar -czvf /backup/nginx-configs-$(date +%F).tar.gz -C /etc nginx\n# Expected Output:\n# nginx/\n# nginx/nginx.conf\n# nginx/conf.d/\n# nginx/conf.d/default.conf\n\n# Verify tarball archive contents without extracting\ntar -tvf /backup/nginx-configs-2026-10-14.tar.gz | head -n 3\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: \"No space left on device\" Despite df -h Showing Free Space\n- **Symptom:** Creating files fails with:\n  `touch: cannot touch '/data/test.txt': No space left on device`, yet `df -h` shows 45GB available.\n- **Root Cause:** Inode exhaustion. Every filesystem has a maximum pre-allocated number of inodes configured when formatted. Millions of tiny micro-files (e.g., PHP sessions, email queues, npm caches) consume all inode table slots even if only a few megabytes of disk blocks are used.\n- **Triage & Recovery Runbook:**\n  1. Inspect inode capacity: `df -i /data`. Look at `IUse%` (e.g. 100%).\n  2. Find which directory contains the runaway file proliferation:\n     `find /data -xdev -printf '%h\\n' | sort | uniq -c | sort -k 1 -nr | head -n 10`\n  3. Clean up the offending directory (e.g., stale session cache):\n     `find /data/sessions -type f -mtime +30 -delete`\n  4. Verify recovery: `df -i /data`.\n\n#### Error 2: \"Invalid cross-device link\" When Creating Hard Links\n- **Symptom:** Running `ln /var/data/source.csv /mnt/backup/link.csv` returns:\n  `ln: failed to create hard link: Invalid cross-device link`\n- **Root Cause:** Hard links share the same underlying inode number. Inodes are unique only *within* an individual filesystem boundary (superblock). You cannot create a hard link between different mounted partitions or block devices (e.g. from `/var` to `/mnt`).\n- **Triage & Recovery Runbook:**\n  1. Verify the filesystem mountpoints using `df -T /var/data /mnt/backup`.\n  2. Use a Symbolic Link instead: `ln -s /var/data/source.csv /mnt/backup/link.csv`.\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: What is the fundamental difference between 'mtime' and 'ctime' in Linux?**  \n  *A:* `mtime` (Modification Time) is updated exclusively when the actual file content bytes change (e.g., appending text or writing bytes). `ctime` (Change Time / Inode Change Time) is updated whenever file content changes OR when file metadata changes (e.g., changing file permissions via `chmod`, changing ownership via `chown`, moving the file, or adding hard links). `ctime` cannot be arbitrarily set backward with the `touch` command because it is maintained strictly by the kernel.\n- **Q: How does Linux prevent race conditions when replacing an active binary in production?**  \n  *A:* If you overwrite an active executable in place with `cp new_binary /usr/local/bin/app`, the running process may crash with a bus error (`SIGBUS`) because the kernel demands memory-mapped pages (`mmap`) from an inode whose content layout has shifted mid-execution. The safe production procedure is to install the file using the `install` command (`install -m 755 new_binary /usr/local/bin/app`) or unlink the old binary first (`rm /usr/local/bin/app && cp new_binary /usr/local/bin/app`). Unlinking gives the new file a brand new inode; running processes continue reading the old unlinked inode until they terminate, avoiding corruption.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Practice FHS directory navigation, create an automated blue/green release symlink structure, and diagnose inode consumption.\n\n#### Prerequisites\n- Standard Linux user with sudo privileges.\n\n#### Execution Steps\n1. **Create an Enterprise Release Hierarchy:**\n   ```bash\n   sudo mkdir -p /opt/lab-deploy/releases/{v1.0.0,v1.1.0}\n   echo \"Version 1.0.0 - Production\" | sudo tee /opt/lab-deploy/releases/v1.0.0/version.txt\n   echo \"Version 1.1.0 - Candidate\" | sudo tee /opt/lab-deploy/releases/v1.1.0/version.txt\n   ```\n\n2. **Establish the Atomic Symlink:**\n   ```bash\n   sudo ln -sfn /opt/lab-deploy/releases/v1.0.0 /opt/lab-deploy/current\n   cat /opt/lab-deploy/current/version.txt\n   ```\n   *Verification:* Output should print \"Version 1.0.0 - Production\".\n\n3. **Perform Zero-Downtime Atomic Promotion:**\n   ```bash\n   sudo ln -sfn /opt/lab-deploy/releases/v1.1.0 /opt/lab-deploy/current\n   cat /opt/lab-deploy/current/version.txt\n   ```\n   *Verification:* Output should now print \"Version 1.1.0 - Candidate\".\n\n4. **Audit Inode Utilization:**\n   ```bash\n   df -ih /tmp\n   ```\n\n#### Verification Challenge\nExecute the following verification script:\n```bash\ntest \"$(readlink /opt/lab-deploy/current)\" = \"/opt/lab-deploy/releases/v1.1.0\" && echo \"VERIFIED: Atomic symlink deployment operational\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **FHS Hierarchy:** `/etc` for configs, `/var` for dynamic logs/state, `/usr` for system binaries, `/opt` for third-party tools, `/proc` and `/sys` for virtual kernel telemetry.\n- [x] **Inode Metadata:** Inodes store permissions, ownership, timestamps, and data block pointers—everything EXCEPT the filename.\n- [x] **Hard Link Sharing:** Hard links share the same inode number; deleting one file name leaves the underlying data intact as long as `nlink > 0`.\n- [x] **Soft Link Pointers:** Soft links are separate files storing path strings; they can cross disk partitions, but break if the target moves.\n- [x] **Ghost Storage:** An unlinked file held open by a process continues consuming disk space until that process closes the file descriptor or exits.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: Which directory in the Linux FHS is specifically reserved for system-wide configuration files where binaries must NEVER be stored?**\n- [ ] A) /var/run\n- [ ] B) /opt/bin\n- [x] C) /etc\n- [ ] D) /usr/lib\n*Explanation:* The Filesystem Hierarchy Standard dictates that `/etc` is reserved exclusively for host-specific configuration files. Binary executables belong in `/usr/bin`, `/usr/sbin`, or `/opt`.\n\n**Quiz Q2: If 'df -h' reports 30GB of free disk space on /var, but creating a 1KB file fails with 'No space left on device', what is the root cause?**\n- [ ] A) The RAM page cache is full\n- [x] B) The filesystem has exhausted its allocated Inodes (verified via 'df -i')\n- [ ] C) The system clock skew corrupted directory timestamps\n- [ ] D) The hard drive controller has overheated\n*Explanation:* Every ext4/XFS filesystem has a fixed number of index nodes (inodes). If an application creates millions of small files, 100% of the inodes can be consumed even if abundant raw gigabytes remain free on disk.\n\n**Quiz Q3: Why is 'ln -sfn' preferred over removing and recreating symlinks in production CI/CD deployments?**\n- [ ] A) It compresses the target directory using gzip\n- [ ] B) It automatically restarts the Nginx web server\n- [x] C) It performs an atomic directory pointer swap with zero window for 404 errors\n- [ ] D) It bypasses POSIX file permissions\n*Explanation:* Using `ln -sfn` atomically replaces the existing symbolic link with the new target. This prevents the transient race condition where deleting the old link before creating the new one could cause active web requests to fail with 404 Not Found."
                  },
                  {
                        id: "linux_mod_03",
                        title: "Module 3: Permissions, Ownership, Special Bits (SUID/SGID/Sticky) & POSIX ACLs",
                        duration: 45,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/eWsCbBfxZ04",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Linux file security is anchored on the POSIX Discretionary Access Control (DAC) permission model. Every file, directory, socket, and block device has an explicit owner user (UID), owner group (GID), and permission bitmask that dictates who can read, write, or execute the object.\n\n#### The 12-Bit Permission Model\nEach file mode consists of 12 binary bits organized into four octal groups (each 0 to 7):\n```text\n[ Special Bits (3 bits) ] [ Owner User (3 bits) ] [ Owner Group (3 bits) ] [ Others (3 bits) ]\n```\n1. **Standard Permission Bits (r=4, w=2, x=1):**\n   - **Read (`r`=4):** For files, allows reading content. For directories, allows listing file names with `ls`.\n   - **Write (`w`=2):** For files, allows modifying or truncating content. For directories, allows creating, renaming, or deleting files inside the directory (regardless of who owns the file inside!).\n   - **Execute (`x`=1):** For files, allows executing the file as a compiled binary or script. For directories, allows \"traversal\" (`cd` into the directory or accessing files inside it).\n2. **Numeric Permission Shorthands:**\n   - `755` (`rwxr-xr-x`): Standard for executables, scripts, and directories.\n   - `644` (`rw-r--r--`): Standard for system configurations and text documents.\n   - `600` (`rw-------`): Strict permissions required for sensitive private keys (SSH `id_ed25519`, TLS cert keys).\n\n#### Special Permission Bits\n1. **SUID (Set User ID - Octal 4xxx / `chmod u+s`):** When set on an executable binary, any unprivileged user who executes the file runs it with the effective privileges of the *file owner* rather than the calling user. Classic example: `/usr/bin/passwd` is owned by root with SUID (`-rwsr-xr-x`). It allows standard users to update their password hash inside the root-only `/etc/shadow` file.\n2. **SGID (Set Group ID - Octal 2xxx / `chmod g+s`):**\n   - On binaries: Executes with the privileges of the file's group.\n   - On directories: Crucial for collaboration! Any file or subfolder created inside an SGID directory automatically inherits the group ownership of the parent directory rather than the primary group of the user creating it.\n3. **Sticky Bit (Octal 1xxx / `chmod +t`):** When set on a world-writable directory (like `/tmp` with mode `1777` / `drwxrwxrwt`), any user can create files, but **only the file owner or root** can delete or rename their respective files. This prevents malicious users from deleting other users' temporary files.\n\n#### Umask (User Creation Mask)\nThe `umask` determines the default permissions assigned to newly created files and directories. Default system bases are `666` for files (no execute) and `777` for directories.\n```text\nEffective Directory Permissions = 777 - umask\nEffective File Permissions      = 666 - umask (clearing any execute bits)\n```\n- Standard server umask is `022`: Creates directories with `755` (777-022) and files with `644` (666-022).\n- Hardened server umask is `027`: Creates directories with `750` and files with `640`, preventing unauthorized \"others\" from reading.\n\n#### POSIX Access Control Lists (ACLs)\nStandard DAC only supports one user, one group, and others. When you need fine-grained permissions (e.g., granting user `deployer` read-write access to `/var/www` without adding them to `root` or changing directory group ownership), you use POSIX ACLs with `setfacl` and `getfacl`.\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| 12-BIT OCTAL PERMISSION MASK BREAKDOWN                                   |\n|                                                                          |\n| Octal:       4               7               5               0           |\n| Binary:    [1 0 0]         [1 1 1]         [1 0 1]         [0 0 0]       |\n| Role:    Special Bits     Owner (User)     Group (GID)     Others (World)|\n| Flags:   SUID SGID Sticky    r   w   x       r   -   x       -   -   -   |\n| String:                   -  r   w   s       r   -   x       -   -   -   |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Shared Team Collaboration Directory with SGID\nIn a continuous delivery environment where both the `jenkins` service account and `developers` group deploy artifacts into `/var/www/shared`:\n```bash\n# Create shared group and assign ownership\nsudo groupadd webdevs\nsudo chown -R root:webdevs /var/www/shared\n# Set SGID and group write permissions (2775)\nsudo chmod 2775 /var/www/shared\n```\nNow, whenever Jenkins runs `touch /var/www/shared/index.html`, the file is created with group `webdevs` automatically, allowing developers in that group to modify or replace it without \"Permission Denied\" errors.\n\n#### Enterprise Use Case 2: Multi-Role Cloud Storage with Default ACLs\nAn enterprise application requires that:\n1. User `apprunner` has read-write access.\n2. User `auditor` has read-only access.\n3. Any newly created files inside automatically inherit these permissions.\nEngineers configure default POSIX ACLs:\n```bash\nsetfacl -R -m u:apprunner:rwx,u:auditor:r-x /data/vault\nsetfacl -R -d -m u:apprunner:rwx,u:auditor:r-x /data/vault\n```\nThe `-d` flag sets the **Default ACL**, which propagates these exact rights to every future file created inside the directory.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Managing Standard Ownership & Permissions\n```bash\n# Recursively assign ownership to user 'appuser' and group 'webdev'\nsudo chown -R appuser:webdev /opt/app\n\n# Set directories to 755 and files to 644 cleanly using find\nfind /opt/app -type d -exec chmod 755 {} +\nfind /opt/app -type f -exec chmod 644 {} +\n\n# Verify file mode and ownership\nstat -c \"%a %A %U:%G %n\" /opt/app/server.js\n# Expected Output:\n# 644 -rw-r--r-- appuser:webdev /opt/app/server.js\n```\n\n#### 2. Configuring SGID on Shared Folders\n```bash\n# Set SGID on directory\nsudo chmod 2775 /data/deployments\nls -ld /data/deployments\n# Expected Output:\n# drwxrwsr-x 2 root webdev 4096 Oct 14 11:20 /data/deployments\n```\n\n#### 3. Inspecting and Applying POSIX ACLs\n```bash\n# View active Access Control Lists\ngetfacl /data/vault\n# Expected Output:\n# # file: /data/vault\n# # owner: root\n# # group: root\n# user::rwx\n# user:apprunner:rwx\n# user:auditor:r-x\n# group::r-x\n# mask::rwx\n# other::---\n# default:user::rwx\n# default:user:apprunner:rwx\n# default:user:auditor:r-x\n# default:group::r-x\n# default:mask::rwx\n# default:other::---\n```\n\n#### 4. Finding Vulnerable SUID/SGID Binaries\n```bash\n# Audit all SUID executables owned by root across the system\nfind / -perm -4000 -user root -type f 2>/dev/null | head -n 8\n# Expected Output:\n# /usr/bin/passwd\n# /usr/bin/sudo\n# /usr/bin/newgrp\n# /usr/bin/gpasswd\n# /usr/bin/chfn\n# /usr/bin/mount\n# /usr/bin/umount\n# /usr/bin/su\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: \"UNPROTECTED PRIVATE KEY FILE!\" (SSH Connection Refused)\n- **Symptom:** Connecting to an EC2 instance with an SSH private key fails with:\n  `Permissions 0644 for 'id_rsa' are too open. It is required that your private key files are NOT accessible by others. This private key will be ignored.`\n- **Root Cause:** SSH client security enforcement. If a private key file has group or world read permissions (`644`, `777`), SSH refuses to use it because other local users could potentially steal the credential.\n- **Triage & Recovery Runbook:**\n  ```bash\n  # Restrict permissions to owner read/write or owner read-only\n  chmod 600 ~/.ssh/id_rsa\n  # Or read-only:\n  chmod 400 ~/.ssh/id_rsa\n  ```\n\n#### Error 2: \"Permission denied\" Despite Having 777 on the Target File\n- **Symptom:** A developer runs `cat /var/data/app/config.json` and gets `Permission denied`, even though `ls -l /var/data/app/config.json` shows `-rwxrwxrwx` (777).\n- **Root Cause:** Path Traversal Inadequacy. To access any file in Linux, the executing user must have Execute (`x`) permission on **every parent directory** leading up to that file. If `/var/data` has mode `700` owned by root, non-root users cannot traverse through `/var/data` to reach `/var/data/app/config.json`.\n- **Triage & Recovery Runbook:**\n  1. Inspect permissions on the full directory path using `namei`:\n     `namei -l /var/data/app/config.json`\n  2. Locate the parent directory missing execute permissions (`x`).\n  3. Grant directory traversal: `sudo chmod o+x /var/data`.\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: Why does a user need 'Execute' permission on a directory to read files inside it?**  \n  *A:* In the POSIX standard, directory permissions serve distinct functions:\n  - **Read (`r`):** Grants permission to read the directory's index list of file names (equivalent to running `ls`).\n  - **Execute (`x`):** Grants permission to traverse into the directory (`cd`) and dereference inodes inside it. If you have `r` without `x`, you can see the filenames, but you cannot view their sizes, timestamps, or read their contents with `cat`. Conversely, if you have `x` without `r`, you cannot list the directory, but if you know the exact filename (`/dir/secret.txt`), you can read and open it directly.\n- **Q: How does the Linux kernel evaluate permissions when a user belongs to multiple groups?**  \n  *A:* The kernel checks permissions in strict precedence order:\n  1. **Owner Match:** If the user's UID equals the file's owner UID, the Owner permission bits are evaluated exclusively. Group and Others bits are completely ignored.\n  2. **Group Match:** If the user's primary or supplementary GIDs match the file's GID, the Group permission bits are evaluated exclusively.\n  3. **Others:** If neither UID nor GIDs match, the Others bits are applied.\n  *Gotcha:* If a file has mode `007` (`--- --- rwx`), and user `alice` owns the file, Alice will be DENIED access because the owner bits are `---`, even though the \"others\" bits are `rwx`!\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Configure a secure multi-user collaboration directory using SGID, protect temporary files using the Sticky bit, and implement fine-grained POSIX ACLs.\n\n#### Prerequisites\n- Linux terminal with `sudo` access.\n\n#### Execution Steps\n1. **Create Team Users and Shared Directory:**\n   ```bash\n   sudo useradd -m engineer1 || true\n   sudo useradd -m engineer2 || true\n   sudo groupadd cicd_team || true\n   sudo usermod -aG cicd_team engineer1\n   sudo usermod -aG cicd_team engineer2\n   sudo mkdir -p /opt/cicd-shared\n   ```\n\n2. **Apply SGID and Group Permissions:**\n   ```bash\n   sudo chown root:cicd_team /opt/cicd-shared\n   sudo chmod 2775 /opt/cicd-shared\n   ls -ld /opt/cicd-shared\n   ```\n   *Verification:* Ensure mode displays `drwxrwsr-x`.\n\n3. **Verify Group Inheritance:**\n   ```bash\n   sudo -u engineer1 touch /opt/cicd-shared/build.log\n   ls -l /opt/cicd-shared/build.log\n   ```\n   *Verification:* The file's group ownership must automatically be `cicd_team`.\n\n4. **Apply Default POSIX ACLs for an External Auditor:**\n   ```bash\n   sudo setfacl -m u:engineer2:r-- /opt/cicd-shared/build.log\n   getfacl /opt/cicd-shared/build.log\n   ```\n\n#### Verification Challenge\nRun the following verification script:\n```bash\nstat -c \"%a\" /opt/cicd-shared | grep -q \"^2775$\" && echo \"VERIFIED: SGID collaboration directory configured properly\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **Numeric Octal Mode:** 4 = Read (`r`), 2 = Write (`w`), 1 = Execute (`x`).\n- [x] **SUID (4xxx):** File executes with the permissions of the file owner (e.g. `passwd`).\n- [x] **SGID (2xxx):** On directories, new files automatically inherit parent directory group ownership.\n- [x] **Sticky Bit (1xxx):** On directories like `/tmp`, only file owners or root can delete files.\n- [x] **Directory Traversal:** Execute (`x`) is strictly required on all parent directories to read files inside.\n- [x] **POSIX ACLs:** Use `setfacl` and `getfacl` to grant granular permissions to specific users/groups.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: What happens when the SGID (Set Group ID) bit is applied to a directory in Linux?**\n- [ ] A) All files in the directory are automatically encrypted with AES-256\n- [x] B) Newly created files in that directory automatically inherit the parent directory's group\n- [ ] C) The directory is converted into a RAM disk\n- [ ] D) Only root can access files inside the directory\n*Explanation:* When SGID is set on a directory (`chmod 2775`), any file or subfolder created within inherits the group ownership of the directory rather than the primary group of the creating user.\n\n**Quiz Q2: What permissions must an SSH private key (e.g., id_ed25519) have to be accepted by the SSH client?**\n- [ ] A) 777 (rwxrwxrwx)\n- [ ] B) 644 (rw-r--r--)\n- [x] C) 600 (rw-------) or 400 (r--------)\n- [ ] D) 755 (rwxr-xr-x)\n*Explanation:* OpenSSH enforces strict permission validation on private key files. If group or others have read permissions, SSH rejects the key with 'Permissions are too open'.\n\n**Quiz Q3: What is the resulting permission on a newly created directory if the system umask is 027?**\n- [ ] A) 777\n- [ ] B) 755\n- [x] C) 750 (rwxr-x---)\n- [ ] D) 640\n*Explanation:* Standard default directory base is 777. With umask 027: 777 - 027 = 750 (User: rwx, Group: r-x, Others: ---)."
                  },
                  {
                        id: "linux_mod_04",
                        title: "Module 4: Process Management, Lifecycle, States & Signals",
                        duration: 50,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/5U2_0qD0Z50",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** A process is an instance of a running program in Linux, complete with its own virtual address space, memory segments (code, data, heap, stack), file descriptor table, and security context.\n\n#### The Process Creation Lifecycle\nLinux creates processes using two primary system calls:\n1. `fork()` / `clone()`: Creates an exact duplicate child process of the calling parent. The child receives a unique Process ID (PID), but inherits the parent's environment, memory mappings (via Copy-On-Write), and open file descriptors.\n2. `execve()`: Replaces the current process image with a new executable binary, initializing the new stack, heap, and instruction pointer.\n3. `wait()` / `waitpid()`: The parent process calls `wait()` to collect the exit status and telemetry of its terminated child processes.\n\n#### Process Execution States\nEvery process in Linux is categorized into a specific kernel state:\n- `R` **(Running / Runnable):** Actively executing on a CPU core or queued in the CFS scheduler run-queue waiting for an available core.\n- `S` **(Interruptible Sleep):** Waiting for an event or resource (such as network socket data, timer, or user input). Wakes up immediately when receiving a signal.\n- `D` **(Uninterruptible Sleep):** Waiting on synchronous device hardware I/O (typically disk write flush or NFS RPC). **Crucial Concept:** Processes in `D` state cannot be terminated, not even by `kill -9`.\n- `T` **(Stopped):** Process execution suspended by a job control signal (Ctrl+Z / `SIGTSTP` or `SIGSTOP`).\n- `Z` **(Zombie / Defunct):** The process has finished execution and terminated, but its entry remains in the kernel process table because the parent has not yet called `wait()` to read its exit code.\n\n#### Linux Signals & Inter-Process Communication\nSignals are asynchronous software interrupts delivered by the kernel to a process:\n- `SIGHUP (1)`: Hangup. Historically sent when a modem disconnected. In modern DevOps, daemons (Nginx, Prometheus) interpret SIGHUP as an instruction to reload configuration files with zero downtime.\n- `SIGINT (2)`: Interrupt. Sent by the terminal when pressing `Ctrl+C`. Gracefully requests the process to terminate.\n- `SIGQUIT (3)`: Quit. Sent by `Ctrl+\\`. Terminates process and generates a core dump file for debugging.\n- `SIGKILL (9)`: Unconditional Kill. Handled directly by the kernel. Cannot be caught, blocked, or ignored by the process. Terminates execution instantly without cleanup.\n- `SIGTERM (15)`: Graceful Termination. The default signal sent by `kill <PID>` and Kubernetes when terminating pods. Gives the process time to finish active requests and close database connections.\n- `SIGCHLD (17)`: Child Status Changed. Sent to the parent process when a child process terminates.\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| LINUX PROCESS STATE MACHINE                                              |\n|                                                                          |\n|      [ fork() / clone() ]                                                |\n|               |                                                          |\n|               v                                                          |\n|      +------------------+     CPU Time Slice Expired    +--------------+ |\n|      |                  | <---------------------------- |              | |\n|      | READY / RUNNABLE |                               | RUNNING (R)  | |\n|      |  (In CFS Queue)  | ----------------------------> | (On CPU Core)| |\n|      +------------------+       Scheduled by CFS        +--------------+ |\n|               ^                                                |         |\n|               | Event Occurs / Interrupt                       |         |\n|               +-----------------------+                        |         |\n|                                       |                        |         |\n|           +---------------------------+------------------------+         |\n|           |                           |                        |         |\n|           v                           v                        v         |\n|   +--------------------+     +-------------------+    +----------------+ |\n|   | INTERRUPTIBLE      |     | UNINTERRUPTIBLE   |    | STOPPED (T)    | |\n|   | SLEEP (S)          |     | SLEEP (D - I/O)   |    | (SIGSTOP/CtrlZ)| |\n|   | (Waiting on Sockets|     | (Waiting on NVMe) |    +----------------+ |\n|   +--------------------+     +-------------------+             |         |\n|           |                                                    |         |\n|           +---------------------------+------------------------+         |\n|                                       | Process Calls exit()             |\n|                                       v                                  |\n|                              +-------------------+                       |\n|                              | ZOMBIE / DEFUNCT  |                       |\n|                              | (Z - Dead in RAM) |                       |\n|                              +-------------------+                       |\n|                                       | Parent Calls wait()              |\n|                                       v                                  |\n|                           [ Inode & PID Released ]                       |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Kubernetes Pod Termination Lifecycle\nWhen a Kubernetes pod is deleted (during deployments or autoscaling):\n1. The Kubelet sends `SIGTERM` to the container process.\n2. The application begins graceful shutdown: it stops accepting new HTTP connections, completes ongoing database transactions, and flushes log buffers.\n3. Kubernetes waits for `terminationGracePeriodSeconds` (default: 30s).\n4. If the process has not exited after 30 seconds, Kubernetes issues `SIGKILL`, forcing immediate kernel termination.\nUnderstanding this lifecycle prevents dropped customer transactions and database corruptions during CI/CD rollouts.\n\n#### Enterprise Use Case 2: Zombie Process Accumulation & PID Starvation\nIn containerized environments where microservices spawn child processes without an init system:\nIf the parent process crashes or has a memory leak and never calls `wait()`, the child processes become zombies. While zombies consume negligible CPU and RAM, they tie up slots in the kernel's process table. When the PID count reaches `kernel.pid_max`, the entire server can no longer execute commands, resulting in an outage. DevOps engineers use tools like `tini` or `dumb-init` as container PID 1 to automatically reap orphaned zombie processes.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Detailed Process Hierarchy & Resource Inspection\n```bash\n# List top 10 CPU-consuming processes with PID, parent PID, user, and command\nps -eo pid,ppid,user,stat,%cpu,%mem,comm --sort=-%cpu | head -n 11\n# Expected Output:\n#   PID  PPID USER     STAT %CPU %MEM COMMAND\n#  1284     1 root     S     8.4  2.1 dockerd\n#  3419  1284 appuser  R     5.2  8.4 node\n#  8912     1 postgres S     2.1 14.2 postgres\n#   401     1 root     S     0.8  0.4 systemd-journal\n```\n\n#### 2. Process Tree Visualization\n```bash\n# Display process ancestry tree showing PID 1 hierarchy\npstree -p -u | head -n 15\n# Expected Output:\n# systemd(1)-+-accounts-daemon(845)\n#            |-cron(860)\n#            |-dockerd(1284)-+-containerd(1340)-+-containerd-shim(2891)---node(2912)\n#            |-sshd(920)---sshd(4120)---bash(4150)---pstree(5120)\n```\n\n#### 3. Graceful Signal Dispatching\n```bash\n# Send SIGHUP to Nginx master process to reload configuration without dropping connections\nsudo pkill -HUP nginx\n\n# Gracefully terminate all processes matching 'node'\npkill -15 -u appuser node\n\n# Forcefully kill a stubborn runaway process\nkill -9 4812\n```\n\n#### 4. Managing Foreground and Background Shell Jobs\n```bash\n# Start a long-running backup task in the background\nnohup tar -czf /backup/data.tar.gz /data > /backup/job.log 2>&1 &\n# Expected Output:\n# [1] 28914\n\n# Check active shell jobs\njobs -l\n# Expected Output:\n# [1]+ 28914 Running                 nohup tar -czf /backup/data.tar.gz /data > /backup/job.log 2>&1 &\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: \"kill -9\" Fails to Terminate a Process\n- **Symptom:** A DevOps engineer runs `kill -9 1840`, but the process continues to appear in `ps aux` with state `D`.\n- **Root Cause:** The process is in Uninterruptible Sleep (`D` state). In this state, the process is waiting inside a kernel driver for hardware I/O to complete (e.g., an unresponsive NFS share, a hung SCSI/NVMe controller, or a dead network block device). The Linux kernel intentionally does not deliver signals—even `SIGKILL`—to a process in `D` state to prevent storage corruption.\n- **Triage & Recovery Runbook:**\n  1. Inspect the kernel stack of the process to find what it is waiting for:\n     `cat /proc/1840/stack`\n  2. Check if an NFS share or storage volume is unresponsive: `df -h` or `dmesg -T | grep -i timeout`.\n  3. Recover or unmount the hung storage backend: `umount -f -l /mnt/hung-share`.\n  4. If the hardware controller is locked, the host operating system must be gracefully rebooted.\n\n#### Error 2: Zombie Process Accumulation\n- **Symptom:** `top` reports `142 zombie`, and `ps aux | grep Z` shows processes marked `<defunct>`.\n- **Root Cause:** A parent process forked child worker processes, but failed to register a signal handler for `SIGCHLD` or call `wait()`.\n- **Triage & Recovery Runbook:**\n  1. Find the parent process ID (PPID) of the zombie:\n     `ps -o pid,ppid,stat,cmd | grep '[Zz]'`\n  2. You cannot kill a zombie with `kill -9` because it is already dead.\n  3. Send `SIGCHLD` to the parent to nudge it to reap the child: `kill -17 <PPID>`.\n  4. If the parent does not reap the zombie, restart the parent process. Once the parent dies, the zombies are adopted by PID 1 (`systemd`), which immediately reaps them.\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: What happens when an orphan process is created in Linux?**  \n  *A:* An orphan process occurs when a parent process terminates before its child process finishes. In Linux, orphan processes are not killed; they are immediately adopted by the system init process (PID 1, usually `systemd`, or a subreaper process). PID 1 becomes the child's new parent, periodically calling `wait()` to ensure that when the orphan eventually exits, its exit status is collected and it does not become a persistent zombie.\n- **Q: What is the difference between nice values and process priority?**  \n  *A:* Process priority (`PR`, ranging from 0 to 139) is the actual dynamic scheduling priority used internally by the kernel CFS scheduler (0-99 for real-time tasks, 100-139 for standard user tasks). The `nice` value (ranging from -20 to +19) is a user-configurable lever that influences dynamic priority. A lower nice value (e.g., -20) gives the process a higher share of CPU time (\"less nice\" to other tasks), while a higher nice value (e.g., +19) yields CPU time to other tasks. Only root can assign negative nice values.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Monitor live process lifecycles, manage background jobs with signals, simulate and resolve a zombie process.\n\n#### Prerequisites\n- Linux terminal access.\n\n#### Execution Steps\n1. **Launch and Background a Long-Running Process:**\n   ```bash\n   sleep 300 &\n   JOB_PID=$!\n   echo \"Spawned process PID: $JOB_PID\"\n   ```\n\n2. **Inspect Process State:**\n   ```bash\n   ps -p $JOB_PID -o pid,ppid,stat,cmd\n   ```\n   *Observation:* State will show `S` (Interruptible Sleep).\n\n3. **Suspend and Resume the Process via Signals:**\n   ```bash\n   # Suspend process execution\n   kill -STOP $JOB_PID\n   ps -p $JOB_PID -o stat\n   # Resume execution\n   kill -CONT $JOB_PID\n   ```\n\n4. **Gracefully Terminate the Process:**\n   ```bash\n   kill -15 $JOB_PID\n   wait $JOB_PID 2>/dev/null || true\n   ```\n\n#### Verification Challenge\nVerify no runaway sleep processes remain:\n```bash\npgrep -x sleep >/dev/null && echo \"FAIL: Process still running\" || echo \"VERIFIED: Process lifecycle managed cleanly\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **fork() & execve():** New processes are cloned via `fork()` and populated with binaries via `execve()`.\n- [x] **State D (Uninterruptible Sleep):** Waiting on synchronous disk/NFS I/O; immune to `kill -9`.\n- [x] **State Z (Zombie):** Process terminated, but parent has not collected exit code via `wait()`.\n- [x] **SIGTERM (15) vs SIGKILL (9):** SIGTERM is graceful and catchable; SIGKILL is forced and handled exclusively by the kernel.\n- [x] **SIGHUP (1):** Used by modern DevOps services (Nginx, Prometheus) for zero-downtime config reload.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: Why can a process in the 'D' (Uninterruptible Sleep) state NOT be terminated by 'kill -9'?**\n- [ ] A) The process is running as root\n- [x] B) The process is waiting inside the kernel on synchronous hardware I/O where terminating it could cause filesystem corruption\n- [ ] C) The process has disabled signal reception in user space\n- [ ] D) The PID number is locked by systemd\n*Explanation:* The `D` state indicates the thread is executing within a kernel device driver waiting on hardware I/O. The kernel suppresses all signals to prevent leaving hardware or filesystem buffers in an inconsistent state.\n\n**Quiz Q2: How do you eliminate a Zombie (<defunct>) process from the system?**\n- [ ] A) Run 'kill -9 <ZOMBIE_PID>'\n- [ ] B) Delete the process executable from disk\n- [x] C) Send SIGCHLD to the parent or terminate the parent process so PID 1 adopts and reaps it\n- [ ] D) Run 'systemctl restart kernel'\n*Explanation:* Zombies are already dead and have no allocated memory to receive signals. You must either prompt the parent process to call `wait()` by sending `SIGCHLD`, or kill the parent process so PID 1 adopts and reaps the zombie.\n\n**Quiz Q3: What signal does Kubernetes send to a pod container to request a graceful shutdown before forcefully killing it?**\n- [ ] A) SIGINT (2)\n- [ ] B) SIGHUP (1)\n- [x] C) SIGTERM (15)\n- [ ] D) SIGKILL (9)\n*Explanation:* Kubernetes initiates pod termination by sending `SIGTERM` (15), granting the application time to drain traffic and shut down cleanly before resorting to `SIGKILL` after the grace period expires."
                  },
                  {
                        id: "linux_mod_05",
                        title: "Module 5: Systemd Architecture, Custom Units, Targets & Journald",
                        duration: 55,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/S2pE9bS_U7w",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Systemd is the default init system (PID 1) and service supervisor across major modern Linux distributions (RHEL, Ubuntu, Debian, CentOS, Fedora, Arch). It replaces legacy SysVinit and Upstart, providing parallelized service startup, dependency resolution, cgroup process isolation, socket activation, and centralized binary logging.\n\n#### Systemd Unit Types\nSystemd manages system entities through **Unit Files**:\n- `.service`: Background daemons and microservices (e.g., `nginx.service`, `docker.service`).\n- `.target`: Synchronization points that group multiple units together (similar to legacy runlevels). Example: `multi-user.target` (standard non-graphical server) and `graphical.target`.\n- `.socket`: Encapsulates an IPC or network socket for on-demand socket activation.\n- `.timer`: Schedules recurring tasks with nanosecond precision; modern replacement for cron.\n- `.mount`: Filesystem mount point definitions (managed automatically from `/etc/fstab`).\n- `.path`: Monitors filesystem paths and triggers services upon file changes (based on inotify).\n\n#### Unit File Directory Hierarchy & Precedence\nWhen resolving a unit, systemd searches three primary directories in strict order of precedence:\n1. `/etc/systemd/system/`: **Highest precedence.** Reserved for custom administrator units and drop-in configuration overrides.\n2. `/run/systemd/system/`: **Runtime dynamic units.** Generated at boot time; wiped on reboot.\n3. `/lib/systemd/system/` (or `/usr/lib/systemd/system/`): **Lowest precedence.** System units installed by operating system packages. Upstream package updates will overwrite files here, which is why administrator overrides must always reside in `/etc`.\n\n#### Anatomy of a Production Service Unit File\nA production `.service` unit contains three primary INI-style sections:\n- **`[Unit]`:** Describes the service and defines its position in the startup graph.\n  - `Description=`: Human-readable summary.\n  - `After=network.target network-online.target`: Start only after the network stack is up.\n  - `Wants=`: Weak dependency; attempts to start the specified unit, but failure does not halt this service.\n  - `Requires=`: Strict dependency; if the required unit fails, this service will not start.\n- **`[Service]`:** Execution parameters, security isolation, and restart policies.\n  - `Type=simple` (or `exec`, `forking`, `notify`).\n  - `User=appuser` / `Group=appuser`: Run as an unprivileged service account (security best practice).\n  - `ExecStart=/usr/bin/node /opt/api/server.js`: Full absolute path to executable.\n  - `Restart=always` / `RestartSec=5s`: Automatic crash recovery loop.\n  - `LimitNOFILE=65535`: Overrides the system open file descriptor limit.\n  - `EnvironmentFile=/etc/default/myapp`: Injects environment variables.\n- **`[Install]`:** Directs systemd how to enable the service on boot.\n  - `WantedBy=multi-user.target`: Creates a symlink in `/etc/systemd/system/multi-user.target.wants/` when enabled.\n\n#### Journald Centralized Logging\n`systemd-journald` collects logs from kernel ring buffers, system calls, stdout/stderr of all services, and syslog. Logs are stored in an indexed, cryptographically verifiable binary format under `/var/log/journal/`, allowing rapid querying without grep overhead.\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| SYSTEMD BOOT DEPENDENCY GRAPH & TARGET RESOLUTION                        |\n|                                                                          |\n|                           [ default.target ]                             |\n|                                   |                                      |\n|                                   v                                      |\n|                        [ multi-user.target ]                             |\n|                                   |                                      |\n|          +------------------------+-------------------------+            |\n|          |                        |                         |            |\n|          v                        v                         v            |\n|  [ basic.target ]        [ network.target ]       [ custom-api.service ] |\n|          |                        |                         |            |\n|          v                        v                         |            |\n| [ sysinit.target ]     [ network-online.target ] <----------+ (After=)   |\n|          |                        |                                      |\n|          v                        v                                      |\n| [ local-fs.target ]     [ postgresql.service ] <------------+ (Requires=)|\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Deploying a Resilient Production Microservice\nA backend Go/Node.js API service must run 24/7. Relying on `nohup` or manual screen sessions is unacceptable. Engineers write `/etc/systemd/system/payment-api.service`:\n```ini\n[Unit]\nDescription=Payment Processing Gateway API\nAfter=network-online.target\nWants=network-online.target\n\n[Service]\nType=simple\nUser=paymentapp\nGroup=paymentapp\nWorkingDirectory=/opt/payment-api\nExecStart=/opt/payment-api/bin/server --port=8080\nRestart=always\nRestartSec=3s\nLimitNOFILE=65535\nStandardOutput=journal\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target\n```\nBenefits: Automated boot startup, unprivileged user execution, automatic crash recovery within 3 seconds, resource limit enforcement, and seamless log capture into journald.\n\n#### Enterprise Use Case 2: Zero-Downtime Daemon Overrides with Drop-in Files\nInstead of editing a vendor unit file in `/lib/systemd/system/docker.service` (which gets wiped during `apt upgrade docker-ce`), engineers create a **Drop-in Configuration**:\n```bash\nsudo systemctl edit docker.service\n```\nThis creates `/etc/systemd/system/docker.service.d/override.conf`. You append only your custom flags (e.g. `ExecStart=` followed by the new flag). Systemd merges the override with the vendor file, preserving customizations across package upgrades.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Service Lifecycle Management\n```bash\n# Reload systemd manager configuration after creating or editing units\nsudo systemctl daemon-reload\n\n# Enable service to start at boot and launch it immediately\nsudo systemctl enable --now nginx\n\n# Inspect service state, active memory, and recent error log tail\nsystemctl status nginx\n# Expected Output:\n# ● nginx.service - A high performance web server and a reverse proxy server\n#      Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)\n#      Active: active (running) since Wed 2026-10-14 08:30:12 UTC; 3h 25min ago\n#        Docs: man:nginx(8)\n#     Process: 1042 ExecStartPre=/usr/sbin/nginx -t -q -g daemon on; master_process on; (code=exited, status=0/SUCCESS)\n#     Process: 1045 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=0/SUCCESS)\n#    Main PID: 1046 (nginx)\n#       Tasks: 5 (limit: 9482)\n#      Memory: 12.4M\n#         CPU: 1.250s\n#      CGroup: /system.slice/nginx.service\n#              ├─1046 \"nginx: master process /usr/sbin/nginx -g daemon on; master_process on;\"\n#              ├─1047 \"nginx: worker process\"\n#              └─1048 \"nginx: worker process\"\n```\n\n#### 2. Querying Journald Logs for Specific Units\n```bash\n# Tail live logs for a specific service in real time\njournalctl -u nginx.service -f\n\n# Filter error-level logs since the last 1 hour\njournalctl -u nginx.service --since \"1 hour ago\" -p err --no-pager\n# Expected Output:\n# -- Boot d58a91c841e24765a049171e8093db5e --\n# Oct 14 10:15:22 devops-node nginx[1046]: 2026/10/14 10:15:22 [error] 1047#1047: *1 connect() failed (111: Connection refused) while connecting to upstream\n```\n\n#### 3. Analyzing System Boot Performance\n```bash\n# Profile startup time and pinpoint slowest services\nsystemd-analyze blame | head -n 6\n# Expected Output:\n# 2.841s cloud-init.service\n# 1.210s snapd.service\n# 0.940s docker.service\n# 0.420s dev-nvme0n1p1.device\n# 0.280s systemd-journal-flush.service\n# 0.150s nginx.service\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: \"Job for service failed because the control process exited with error code\"\n- **Symptom:** Running `systemctl start app.service` returns:\n  `Job for app.service failed because the control process exited with error code. See \"systemctl status app.service\" and \"journalctl -xeu app.service\" for details.`\n- **Root Cause:** The application binary crashed during initialization (e.g. missing environment variable, port already in use, bad syntax in configuration file, or wrong permissions on `WorkingDirectory=`).\n- **Triage & Recovery Runbook:**\n  1. Inspect the exact exit code: `systemctl status app.service`.\n  2. Read the trailing stdout/stderr stack trace: `journalctl -u app.service -e --no-pager`.\n  3. Verify port availability: `sudo ss -tulnp | grep :<PORT>`.\n  4. Test running the binary manually under the service user account:\n     `sudo -u appuser /opt/api/server --config=/etc/app.conf`.\n\n#### Error 2: \"Unit file changed on disk\" Warning\n- **Symptom:** Modifying a unit file in `/etc/systemd/system/` results in:\n  `Warning: The unit file, source configuration file or drop-ins of app.service changed on disk. Run 'systemctl daemon-reload' to reload units.`\n- **Root Cause:** Systemd caches unit configurations in memory. Edits on disk are ignored until the systemd manager reloads.\n- **Triage & Recovery Runbook:**\n  ```bash\n  sudo systemctl daemon-reload\n  sudo systemctl restart app.service\n  ```\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: What is the architectural difference between 'systemctl reload' and 'systemctl restart'?**  \n  *A:* `systemctl restart` stops the active process completely (terminating all existing connections) and initiates a fresh process image. `systemctl reload` sends a signal (typically `SIGHUP`) to the master process instructing it to re-read its configuration files while keeping existing worker processes and network sockets open, enabling zero-downtime reconfiguration.\n- **Q: What is the difference between 'Wants=' and 'Requires=' in systemd unit dependencies?**  \n  *A:* Both declare that the specified unit should be started when this service is started. However, `Wants=` is a soft dependency: if the wanted unit fails or cannot be found, systemd will still proceed to start the dependent service. `Requires=` is a strict, hard dependency: if the required unit fails to start or crashes during runtime, systemd will refuse to start or will actively stop the dependent service.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Author a custom production systemd service with automated crash recovery and inspect logs via journalctl.\n\n#### Prerequisites\n- Linux terminal with `sudo` access.\n\n#### Execution Steps\n1. **Create an Application Script:**\n   ```bash\n   sudo mkdir -p /opt/heartbeat\n   cat << 'EOF' | sudo tee /opt/heartbeat/heartbeat.sh\n   #!/bin/bash\n   echo \"Heartbeat service started at $(date)\"\n   while true; do\n     echo \"Heartbeat ping: system alive at $(date)\"\n     sleep 10\n   done\n   EOF\n   sudo chmod +x /opt/heartbeat/heartbeat.sh\n   ```\n\n2. **Author the Systemd Unit Service:**\n   ```bash\n   cat << 'EOF' | sudo tee /etc/systemd/system/heartbeat.service\n   [Unit]\n   Description=DevOps Heartbeat Telemetry Service\n   After=network.target\n\n   [Service]\n   Type=simple\n   ExecStart=/opt/heartbeat/heartbeat.sh\n   Restart=always\n   RestartSec=3s\n\n   [Install]\n   WantedBy=multi-user.target\n   EOF\n   ```\n\n3. **Reload Manager, Enable and Start the Service:**\n   ```bash\n   sudo systemctl daemon-reload\n   sudo systemctl enable --now heartbeat.service\n   ```\n\n4. **Verify Service State and Journal Logs:**\n   ```bash\n   systemctl is-active heartbeat.service\n   sudo journalctl -u heartbeat.service -n 5 --no-pager\n   ```\n\n#### Verification Challenge\nVerify the heartbeat service is running:\n```bash\nsystemctl is-active --quiet heartbeat.service && echo \"VERIFIED: Custom systemd service operational\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **PID 1:** Systemd is the primary init process responsible for supervising all background services.\n- [x] **Unit Precedence:** Administrator units in `/etc/systemd/system/` override package vendor files in `/lib/systemd/system/`.\n- [x] **daemon-reload:** Must be executed whenever any unit file on disk is created or edited.\n- [x] **Dependencies:** Use `After=` for ordering, `Wants=` for weak dependencies, and `Requires=` for hard dependencies.\n- [x] **Journald:** Use `journalctl -u <unit> -f` for live tailing and `journalctl -u <unit> -p err` for errors.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: Which directory takes the highest precedence when systemd loads unit configuration files?**\n- [ ] A) /lib/systemd/system/\n- [ ] B) /run/systemd/system/\n- [x] C) /etc/systemd/system/\n- [ ] D) /usr/lib/systemd/system/\n*Explanation:* `/etc/systemd/system/` is designated for local system administrator custom units and overrides, taking highest precedence over runtime (`/run`) and distribution vendor packages (`/lib`).\n\n**Quiz Q2: What command MUST be run after modifying a systemd unit file on disk before changes take effect?**\n- [ ] A) systemctl reboot\n- [ ] B) systemctl restart kernel\n- [x] C) systemctl daemon-reload\n- [ ] D) update-initramfs -u\n*Explanation:* Systemd caches unit definitions in memory. Editing a file on disk does not update systemd's in-memory dependency graph until `systemctl daemon-reload` is run.\n\n**Quiz Q3: What is the primary operational benefit of 'systemctl reload' over 'systemctl restart' for Nginx?**\n- [ ] A) It clears the kernel page cache\n- [x] B) It applies configuration changes without dropping active TCP client connections\n- [ ] C) It deletes old access log files\n- [ ] D) It upgrades the Nginx binary package\n*Explanation:* `systemctl reload` instructs Nginx to re-read its configuration files and spin up new worker processes while allowing old workers to finish serving in-flight client connections, ensuring zero downtime."
                  }
            ]
      },
      {
            id: "sec_linux_02",
            title: "Section 2: Storage, Administration & Automation (Modules 6-10)",
            lessons: [
                  {
                        id: "linux_mod_06",
                        title: "Module 6: Storage, Partitions, Filesystems & Logical Volume Management (LVM)",
                        duration: 55,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Storage management in Linux is organized as an abstraction stack moving from raw hardware block devices, through partitioning schemes and logical volume managers, up to filesystems and directory mount points.\n\n#### The Linux Storage Abstraction Hierarchy\n1. **Block Devices:** Raw hardware storage units exposed as device special files in `/dev/`:\n   - Traditional SATA/SCSI/Virtual disks: `/dev/sda`, `/dev/sdb`, `/dev/vda` (KVM virtio).\n   - High-performance NVMe SSDs: `/dev/nvme0n1`, `/dev/nvme1n1`.\n2. **Partitioning Schemes:**\n   - **MBR (Master Boot Record):** Legacy scheme limited to 2TB disk size and a maximum of 4 primary partitions.\n   - **GPT (GUID Partition Table):** Modern standard supporting disks up to 9.4 ZB (zettabytes) and up to 128 partitions with redundant backup partition headers. Managed via `gdisk` or `fdisk`.\n3. **Filesystems (ext4 vs. XFS):**\n   - **ext4 (Fourth Extended Filesystem):** Standard, reliable, backwards-compatible default for Debian/Ubuntu. Supports both online growing and offline shrinking. Maximum file size: 16TB; maximum volume size: 1EB.\n   - **XFS:** High-performance, 64-bit journaling filesystem default in RHEL/CentOS/Rocky. Optimized for parallel multithreaded I/O and large files. **Critical Rule:** XFS filesystems can be grown online, but **cannot be shrunk**.\n4. **Logical Volume Management (LVM):**\n   LVM decouples filesystems from physical hardware disks by creating an elastic pooling layer:\n   - **Physical Volume (PV):** A raw disk or partition initialized for LVM (`pvcreate /dev/sdb`).\n   - **Volume Group (VG):** A storage pool constructed from one or more PVs (`vgcreate vg_data /dev/sdb /dev/sdc`). Space in a VG is divided into Physical Extents (PE, default 4MB).\n   - **Logical Volume (LV):** A virtual partition allocated from the VG's pool (`lvcreate -n lv_app -L 100G vg_data`).\n   - **Online Resizing:** LVs can be dynamically expanded in production without unmounting or restarting services.\n\n#### /etc/fstab (Filesystem Table)\nDefines persistent automated filesystem mounts on system boot. Each line contains 6 fields:\n```text\n<file system UUID>  <mount point>  <type>  <options>  <dump>  <pass>\nUUID=3a8b...       /data          ext4    defaults,noatime  0       2\n```\n- `UUID=`: Universally Unique Identifier from `blkid`. Always use UUIDs instead of `/dev/sdb1` because device bus names can shift across reboots.\n- `options`: `defaults` (rw, suid, dev, exec, auto, nouser, async), `noatime` (performance boost: disables recording read access timestamps).\n- `pass`: Filesystem check order by `fsck` (1 for root `/`, 2 for other partitions, 0 to disable).\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| LOGICAL VOLUME MANAGEMENT (LVM) ARCHITECTURE                             |\n|                                                                          |\n| PHYSICAL DISKS:     [ /dev/sdb (100GB) ]      [ /dev/sdc (100GB) ]       |\n|                             |                         |                  |\n|                             v                         v                  |\n| PHYSICAL VOLUMES:   [  PV: /dev/sdb    ]      [  PV: /dev/sdc    ]       |\n|                                                      /                  |\n|                              v                       v                   |\n| VOLUME GROUP:               +-------------------------+                  |\n|                             |    VG: vg_production    | (Total: 200GB)   |\n|                             +-------------------------+                  |\n|                                     /          \\                         |\n|                                    v            v                        |\n| LOGICAL VOLUMES:           [ lv_database ]    [ lv_logs ]                |\n|                            (Allocated: 120GB) (Allocated: 50GB)          |\n|                                    |                  |                  |\n|                                    v                  v                  |\n| FILESYSTEMS:                 [ ext4 / XFS ]     [ ext4 / XFS ]           |\n|                                    |                  |                  |\n|                                    v                  v                  |\n| MOUNT POINTS:                 /var/lib/pgsql        /var/log             |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Zero-Downtime EBS Volume Expansion on AWS\nA production PostgreSQL database volume on AWS EC2 fills up. Downtime is forbidden:\n1. In the AWS console / Terraform, the EBS volume is modified from 100GB to 200GB.\n2. On the live Linux EC2 instance, the partition table is updated: `sudo growpart /dev/nvme1n1 1`.\n3. The LVM Physical Volume is expanded online: `sudo pvresize /dev/nvme1n1p1`.\n4. The Logical Volume and the ext4 filesystem are simultaneously expanded in one atomic command:\n   `sudo lvextend -r -l +100%FREE /dev/vg_data/lv_postgres`\nThe database continues serving customer queries uninterrupted throughout the entire expansion.\n\n#### Enterprise Use Case 2: Emergency Boot Recovery from Broken /etc/fstab\nA junior engineer adds an unformatted external disk entry to `/etc/fstab` with typo `/dev/sdb1 /mnt/data ext4 defaults 0 1`. On the next reboot, systemd fails to mount the disk and drops into Emergency Maintenance Mode with a read-only root shell.\nDevOps engineers recover the system by remounting root as read-write:\n```bash\nmount -o remount,rw /\nnano /etc/fstab   # Comment out the offending line with '#' or add 'nofail'\nexit\n```\n*Best Practice:* Always add `nofail` to non-essential mount options in `/etc/fstab` so boot proceeds even if an external drive is detached.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Disk & Partition Inspection\n```bash\n# List all block devices, partitions, sizes, and mountpoints\nlsblk -f\n# Expected Output:\n# NAME        FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS\n# nvme0n1                                                                            \n# ├─nvme0n1p1 ext4   1.0         d3b14567-89ab-4cde-0123-456789abcdef   42.1G    48% /\n# └─nvme0n1p2 swap   1           98765432-abcd-ef01-2345-6789abcdef01                [SWAP]\n# nvme1n1                                                                            \n# └─nvme1n1p1 LVM2_m LVM2        LVM200-PV-UUID-abcd-1234-5678-ef01                  \n#   └─vg_data-lv_app ext4 1.0    f4e3d2c1-b0a9-8765-4321-fedcba987654   78.4G    18% /data\n```\n\n#### 2. Creating Complete LVM Hierarchy from Scratch\n```bash\n# 1. Initialize physical volume\nsudo pvcreate /dev/sdb\n# Expected Output: Physical volume \"/dev/sdb\" successfully created.\n\n# 2. Create volume group\nsudo vgcreate vg_production /dev/sdb\n# Expected Output: Volume group \"vg_production\" successfully created\n\n# 3. Create logical volume of 40GB\nsudo lvcreate -n lv_services -L 40G vg_production\n# Expected Output: Logical volume \"lv_services\" created.\n\n# 4. Format with ext4\nsudo mkfs.ext4 /dev/vg_production/lv_services\n\n# 5. Mount to target directory\nsudo mkdir -p /srv/services\nsudo mount /dev/vg_production/lv_services /srv/services\n```\n\n#### 3. Online Zero-Downtime Logical Volume & Filesystem Extension\n```bash\n# Extend logical volume by 20GB and automatically resize filesystem (-r)\nsudo lvextend -r -L +20G /dev/vg_production/lv_services\n# Expected Output:\n#   Size of logical volume vg_production/lv_services changed from 40.00 GiB to 60.00 GiB.\n#   Logical volume vg_production/lv_services successfully resized.\n# resize2fs 1.46.5 (30-Dec-2021)\n# Filesystem at /dev/mapper/vg_production-lv_services is mounted on /srv/services; on-line resizing required\n# The filesystem on /dev/mapper/vg_production-lv_services is now 15728640 (4k) blocks long.\n```\n\n#### 4. Checking Disk Capacity and Inode Health\n```bash\n# Human-readable disk space and filesystem types\ndf -hT /srv/services\n# Expected Output:\n# Filesystem                             Type  Size  Used Avail Use% Mounted on\n# /dev/mapper/vg_production-lv_services  ext4   59G  2.1G   54G   4% /srv/services\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: System Boot Hangs in Emergency Mode due to /etc/fstab Typo\n- **Symptom:** Server reboot fails and the console prints:\n  `You are in emergency mode. After logging in, type \"journalctl -xb\" to view system logs. Cannot open access to console, the root account is locked.`\n- **Root Cause:** A filesystem listed in `/etc/fstab` failed to mount because the UUID was typed incorrectly or the network block storage was not attached yet. By default, systemd treats mount failures as fatal boot errors.\n- **Triage & Recovery Runbook:**\n  1. Boot from live rescue CD or pass `init=/bin/bash` in GRUB kernel flags.\n  2. Remount root as writable: `mount -o remount,rw /`.\n  3. Validate fstab mounts without rebooting using: `mount -a`.\n  4. Always add `nofail` to optional disks:\n     `UUID=1234... /mnt/data ext4 defaults,nofail 0 2`\n\n#### Error 2: Attempting to Shrink an XFS Filesystem\n- **Symptom:** Running `lvreduce -L -10G /dev/vg_data/lv_xfs` results in filesystem corruption:\n  `XFS: cannot shrink filesystem`\n- **Root Cause:** By architectural design, the XFS filesystem allocation groups and b-tree indexing can only grow; XFS does not support offline or online shrinking.\n- **Triage & Recovery Runbook:**\n  1. Back up data with `xfsdump` or `tar`.\n  2. Reformat the volume with a smaller size: `mkfs.xfs -f /dev/vg_data/lv_new`.\n  3. Restore the data.\n  *Lesson:* Never use `lvreduce` on XFS filesystems.\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: What is the purpose of the 'noatime' mount option in production database servers?**  \n  *A:* By default, the POSIX standard requires the kernel to write an updated access timestamp (`atime`) to the file's inode every time a file is read. In high-traffic database or web servers handling thousands of reads per second, this turns every read operation into an unnecessary write operation to physical disk blocks. Mounting filesystems with `noatime` (or `relatime`) suppresses read timestamp updates, reducing disk I/O write operations by up to 30%.\n- **Q: Why should UUIDs be used in /etc/fstab instead of device node names like /dev/sdb1?**  \n  *A:* Device node names (`/dev/sda`, `/dev/sdb`) are dynamically assigned by the kernel `udev` subsystem during hardware discovery at boot. If a storage controller driver initializes faster on a subsequent boot, or if a drive is plugged into a different SATA/SAS port or AWS EBS slot, `/dev/sdb` might become `/dev/sda`. This could cause the server to attempt mounting a data drive as root, resulting in boot failure. UUIDs (Universally Unique Identifiers) are embedded directly within the filesystem superblock, ensuring the correct filesystem is mounted regardless of hardware bus ordering.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Simulate a virtual disk using a loopback file, initialize LVM, format with ext4, mount to a target directory, and expand it dynamically.\n\n#### Prerequisites\n- Linux terminal with `sudo` access.\n\n#### Execution Steps\n1. **Create a 1GB Loopback Simulated Disk:**\n   ```bash\n   sudo dd if=/dev/zero of=/opt/virtual_disk.img bs=1M count=1024\n   sudo losetup -f /opt/virtual_disk.img\n   LOOP_DEV=$(losetup -j /opt/virtual_disk.img | cut -d: -f1)\n   echo \"Loop device created: $LOOP_DEV\"\n   ```\n\n2. **Initialize LVM Stack:**\n   ```bash\n   sudo pvcreate \"$LOOP_DEV\"\n   sudo vgcreate vg_lab \"$LOOP_DEV\"\n   sudo lvcreate -n lv_app -L 500M vg_lab\n   sudo mkfs.ext4 /dev/vg_lab/lv_app\n   ```\n\n3. **Mount and Verify Volume:**\n   ```bash\n   sudo mkdir -p /mnt/lab-storage\n   sudo mount /dev/vg_lab/lv_app /mnt/lab-storage\n   df -h /mnt/lab-storage\n   ```\n\n4. **Perform Live Online Volume Extension:**\n   ```bash\n   sudo lvextend -r -l +100%FREE /dev/vg_lab/lv_app\n   df -h /mnt/lab-storage\n   ```\n   *Verification:* The filesystem size will immediately show ~1000MB without unmounting.\n\n#### Verification Challenge\n```bash\nvgs vg_lab >/dev/null 2>&1 && echo \"VERIFIED: LVM volume group successfully created and scaled\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **LVM Stack:** Physical Volumes (PV) -> Volume Groups (VG) -> Logical Volumes (LV) -> Filesystems.\n- [x] **ext4 vs XFS:** ext4 supports growing and shrinking; XFS supports high-performance online growing, but CANNOT be shrunk.\n- [x] **fstab Fields:** `UUID=...` `mount_point` `type` `options` `dump` `pass`.\n- [x] **noatime:** Mount option that disables read timestamp writes to disk inodes, significantly boosting I/O throughput.\n- [x] **lvextend -r:** Extends both the logical volume and the underlying filesystem in a single atomic step.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: Can an XFS filesystem be reduced in size using 'lvreduce'?**\n- [ ] A) Yes, as long as it is unmounted first\n- [x] B) No, XFS architecture does not support filesystem shrinking under any circumstances\n- [ ] C) Yes, using the '-f' force flag\n- [ ] D) Yes, if converted to ext4 first\n*Explanation:* The internal allocation group design of XFS does not support shrinking. Any attempt to reduce an LV holding an XFS filesystem will cause filesystem corruption.\n\n**Quiz Q2: Why is the 'nofail' option recommended for non-essential mounts in /etc/fstab?**\n- [ ] A) It disables user password prompts\n- [ ] B) It automatically repairs filesystem corruptions\n- [x] C) It allows the operating system to continue booting normally even if the disk device is missing or unformatted\n- [ ] D) It enables file compression\n*Explanation:* By default, systemd enters emergency mode if any filesystem in `/etc/fstab` fails to mount. Adding `nofail` tells systemd to log a warning and continue booting normally.\n\n**Quiz Q3: What command inspects the UUIDs of all block storage devices on a Linux system?**\n- [ ] A) fsck -a\n- [x] B) blkid (or lsblk -f)\n- [ ] C) uname -r\n- [ ] D) systemctl list-units\n*Explanation:* `blkid` (Block ID) prints the block device names, filesystem types, and filesystem UUIDs needed for `/etc/fstab`."
                  },
                  {
                        id: "linux_mod_07",
                        title: "Module 7: Package Management, Repositories, GPG & Software Lifecycle (APT / DNF)",
                        duration: 45,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/jZ_y0C4K9l0",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Linux software distribution is managed through cryptographically verified package management ecosystems. Package managers resolve dependency trees, download pre-compiled binaries, verify cryptographic digital signatures, and automate installation and patching.\n\n#### The Two Dominant Linux Packaging Families\n1. **Debian / Ubuntu Family (.deb):**\n   - **Low-level tool:** `dpkg` (installs, inspects, and unpacks single `.deb` archives without resolving dependencies).\n   - **High-level tool:** `apt` / `apt-get` (queries remote repository metadata, downloads package trees, and resolves complex dependency graphs).\n   - **Configuration:** `/etc/apt/sources.list` and modular files in `/etc/apt/sources.list.d/*.sources`.\n2. **Red Hat Enterprise Linux / Rocky / Fedora Family (.rpm):**\n   - **Low-level tool:** `rpm` (Red Hat Package Manager).\n   - **High-level tool:** `dnf` (Dandified YUM, replacing legacy `yum`). Provides faster dependency resolution using SAT solvers.\n   - **Configuration:** `/etc/yum.repos.d/*.repo`.\n\n#### Cryptographic GPG Signature Verification\nLinux repositories enforce software integrity using asymmetric GPG (GNU Privacy Guard) keypairs:\n1. Software vendors (e.g., Docker, HashiCorp, Kubernetes) cryptographically sign their package metadata (`Release.gpg` / `repomd.xml.asc`) using their private key.\n2. The client system imports the vendor's public key into a trusted keyring (`/etc/apt/keyrings/` or `/etc/pki/rpm-gpg/`).\n3. During `apt update` or `dnf check-update`, the package manager verifies the digital signature of the downloaded package index against the public key. If the signature is invalid or tampered with, installation is aborted to prevent Man-In-The-Middle (MITM) attacks.\n\n#### Modern APT Repository Keyring Architecture\nHistorically, Ubuntu/Debian used `apt-key add`, which placed third-party keys into the global `/etc/apt/trusted.gpg` keyring. This was a severe security flaw: a key for a third-party tool could sign and replace critical core OS packages.\n**Modern Standard (Debian 12 / Ubuntu 24.04):**\nThird-party GPG keys are saved into isolated files in `/etc/apt/keyrings/`, and repository definitions explicitly reference that exact keyring via `signed-by=/etc/apt/keyrings/docker.gpg`.\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| DEBIAN / UBUNTU APT PACKAGE RESOLUTION WORKFLOW                          |\n|                                                                          |\n| 1. [ apt update ]                                                        |\n|         | Queries remote repository HTTP/HTTPS servers                   |\n|         v                                                                |\n| 2. [ Download Release & InRelease metadata ]                             |\n|         | Verified against /etc/apt/keyrings/vendor.gpg                  |\n|         v                                                                |\n| 3. [ Build local package index cache: /var/lib/apt/lists/ ]              |\n|                                                                          |\n| 4. [ apt install docker-ce ]                                             |\n|         | Dependency SAT Solver determines required packages:            |\n|         | -> docker-ce-cli, containerd.io, iptables                      |\n|         v                                                                |\n| 5. [ Download .deb archives into /var/cache/apt/archives/ ]              |\n|         v                                                                |\n| 6. [ Invokes dpkg -i: unpacks files, executes preinst/postinst scripts ] |\n|         v                                                                |\n| 7. [ Systemd daemons enabled and started ]                               |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Automated Infrastructure-as-Code Docker Installation\nIn Terraform / cloud-init or Ansible automated provisioning:\n```bash\n# 1. Install prerequisites\nsudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg\n\n# 2. Set up isolated keyring directory\nsudo install -m 0755 -d /etc/apt/keyrings\ncurl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg\nsudo chmod a+r /etc/apt/keyrings/docker.gpg\n\n# 3. Add repository with signed-by parameter\necho   \"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu   $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable\" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null\n\n# 4. Install verified package\nsudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io\n```\n\n#### Enterprise Use Case 2: Automated Security Patching (unattended-upgrades)\nProduction enterprise servers must patch critical Common Vulnerabilities and Exposures (CVEs) automatically without human intervention. Using `unattended-upgrades` on Ubuntu or `dnf-automatic` on RHEL, servers automatically check repositories at 03:00 AM, install security-tagged patches, and trigger automated reboots if `/var/run/reboot-required` is created.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Debian/Ubuntu Package Commands\n```bash\n# Update repository index cache\nsudo apt update\n# Expected Output:\n# Hit:1 http://us-east-1.ec2.archive.ubuntu.com/ubuntu noble InRelease\n# Get:2 http://us-east-1.ec2.archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]\n# Fetched 126 kB in 1s (128 kB/s)\n# Reading package lists... Done\n# 12 packages can be upgraded. Run 'apt list --upgradable' to see them.\n\n# Query which installed package owns a specific binary file\ndpkg -S /usr/bin/curl\n# Expected Output:\n# curl: /usr/bin/curl\n\n# Inspect version policies and repository origins\napt-cache policy docker-ce\n# Expected Output:\n# docker-ce:\n#   Installed: 5:26.1.4-1~ubuntu.24.04~noble\n#   Candidate: 5:26.1.4-1~ubuntu.24.04~noble\n#   Version table:\n#  *** 5:26.1.4-1~ubuntu.24.04~noble 500\n#         500 https://download.docker.com/linux/ubuntu noble/stable amd64 Packages\n#         100 /var/lib/dpkg/status\n```\n\n#### 2. RHEL / Rocky / Fedora Package Commands\n```bash\n# Install package with automatic dependency resolution\nsudo dnf install -y nginx\n\n# Query package owner for a binary on RHEL\nrpm -qf /usr/sbin/nginx\n# Expected Output:\n# nginx-1.24.0-1.el9.x86_64\n\n# Check security errata updates\ndnf updateinfo list security\n```\n\n#### 3. Cleaning Package Caches to Recover Disk Space\n```bash\n# Remove cached .deb packages from /var/cache/apt/archives/\nsudo apt clean\n# Remove unneeded orphan dependency packages\nsudo apt autoremove --purge -y\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: \"Could not get lock /var/lib/dpkg/lock-frontend\"\n- **Symptom:** Running `apt install` or `apt update` fails with:\n  `E: Could not get lock /var/lib/dpkg/lock-frontend - open (11: Resource temporarily unavailable)`\n  `E: Unable to acquire the dpkg frontend lock, is another process using it?`\n- **Root Cause:** Concurrent package manager execution. An automated background process (such as `unattended-upgrades` or `daily-apt`) is currently holding the dpkg lock file.\n- **Triage & Recovery Runbook:**\n  1. Identify which process holds the lock:\n     `sudo lsof /var/lib/dpkg/lock-frontend`\n  2. If an automated update is running, wait 60 seconds for it to finish gracefully.\n  3. If the process is dead or orphaned from a prior crash:\n     `sudo kill -15 <PID>`\n  4. Repair interrupted package installations:\n     `sudo dpkg --configure -a`\n\n#### Error 2: \"The following signatures couldn't be verified because the public key is not available\" (NO_PUBKEY)\n- **Symptom:** `apt update` fails with:\n  `W: GPG error: https://packages.cloud.google.com/apt kubernetes-xenial InRelease: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY B53DC80D13EDEF05`\n- **Root Cause:** The public GPG key for the repository is missing, expired, or has been rotated by the software vendor.\n- **Triage & Recovery Runbook:**\n  1. Download the new GPG key directly from the vendor's HTTPS endpoint.\n  2. Convert and store it in `/etc/apt/keyrings/`:\n     `curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg`\n  3. Update sources list to include `signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg`.\n  4. Run `sudo apt update`.\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: What is the difference between 'apt-get upgrade' and 'apt-get dist-upgrade' (full-upgrade)?**  \n  *A:* `apt-get upgrade` upgrades existing installed packages to newer versions, but will *never* remove an existing package or install a brand new package to satisfy new dependencies. If a package requires adding a new dependency or removing an obsolete conflicting library, `upgrade` leaves it kept back. `apt-get dist-upgrade` (or `apt full-upgrade`) performs intelligent dependency resolution: it will actively install new dependencies or remove obsolete conflicting packages to complete the upgrade.\n- **Q: Why was 'apt-key add' deprecated in modern Linux distributions?**  \n  *A:* `apt-key add` deposited third-party public GPG keys into the universal system keyring (`/etc/apt/trusted.gpg`). When APT verifies packages, any key in the universal keyring is considered trusted for *all* configured repositories. If an attacker compromised an untrusted third-party PPA, they could push a malicious update for `libc6` or `sudo`, and the system would accept it because the key was trusted globally. Modern Linux mandates the `signed-by` directive, ensuring each key is trusted only for its specific repository domain.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Inspect package dependencies, trace binary file origins, and configure an isolated third-party GPG keyring.\n\n#### Prerequisites\n- Linux terminal with `sudo` access.\n\n#### Execution Steps\n1. **Query Package Ownership for Essential Tools:**\n   ```bash\n   which git\n   dpkg -S $(which git) || rpm -qf $(which git)\n   ```\n\n2. **Inspect Package Metadata and Dependencies:**\n   ```bash\n   apt-cache depends git | head -n 8 || dnf deplist git | head -n 8\n   ```\n\n3. **Practice Safe Keyring Creation:**\n   ```bash\n   sudo mkdir -p /etc/apt/keyrings\n   sudo chmod 0755 /etc/apt/keyrings\n   ls -ld /etc/apt/keyrings\n   ```\n\n4. **Verify Package Database Consistency:**\n   ```bash\n   sudo dpkg --audit || rpm -Va\n   ```\n\n#### Verification Challenge\n```bash\ntest -d /etc/apt/keyrings && echo \"VERIFIED: Keyring directory configured according to modern security standards\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **apt vs dpkg:** `apt` resolves and downloads dependencies; `dpkg` operates on local `.deb` files without network access.\n- [x] **apt update vs upgrade:** `update` updates the local repository index cache; `upgrade` downloads and installs newer packages.\n- [x] **GPG Integrity:** Repositories use GPG digital signatures to guarantee that packages have not been tampered with in transit.\n- [x] **signed-by Security:** Always isolate third-party GPG keys in `/etc/apt/keyrings/` using `[signed-by=...]`.\n- [x] **Lock Contention:** If `/var/lib/dpkg/lock-frontend` is locked, another process like unattended-upgrades is running.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: What is the primary function of running 'sudo apt update'?**\n- [ ] A) It installs the latest Linux kernel version\n- [ ] B) It compiles software from source code\n- [x] C) It synchronizes the local index cache of available packages and versions from remote repositories\n- [ ] D) It cleans up temporary files in /tmp\n*Explanation:* `apt update` connects to all configured repositories in `/etc/apt/sources.list`, downloads their latest `Packages` index files, and updates local cache without modifying installed software.\n\n**Quiz Q2: Why is storing third-party GPG keys in /etc/apt/trusted.gpg now deprecated?**\n- [ ] A) It causes high CPU utilization during boot\n- [x] B) It grants the third-party key global authority to authenticate packages from ANY repository, creating a supply chain attack vector\n- [ ] C) GPG encryption has been cracked\n- [ ] D) The file format is incompatible with 64-bit systems\n*Explanation:* Storing keys in the global trusted keyring allowed any third-party repository key to sign and replace core OS packages. Modern APT uses isolated `/etc/apt/keyrings/` with `signed-by`.\n\n**Quiz Q3: What command tells you which installed Debian package owns the file /usr/bin/htop?**\n- [ ] A) apt-cache search /usr/bin/htop\n- [ ] B) which htop\n- [x] C) dpkg -S /usr/bin/htop\n- [ ] D) ls -l /usr/bin/htop\n*Explanation:* `dpkg -S <path>` queries the installed package database to identify which package delivered the file."
                  },
                  {
                        id: "linux_mod_08",
                        title: "Module 8: User Administration, Group Security, Sudoers Hardening & PAM",
                        duration: 45,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/k8EwT_f45j0",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Linux is a multi-user operating system with strong boundary isolation between unprivileged user accounts, administrative superusers (UID 0), and automated service accounts.\n\n#### Core Identity Files\n- `/etc/passwd`: World-readable text file listing all local user accounts. Each line has 7 colon-separated fields:\n  ```text\n  appuser:x:1001:1001:Application Service Account:/home/appuser:/bin/bash\n  [1]     [2][3]  [4]  [5]                         [6]           [7]\n  ```\n  1. Username | 2. Password placeholder (`x` indicates password hash is stored in `/etc/shadow`) | 3. User ID (UID) | 4. Primary Group ID (GID) | 5. GECOS (User description) | 6. Home directory | 7. Default login shell.\n- `/etc/shadow`: Secure file readable **only by root** (mode `0640` or `0000`). Contains salted cryptographic password hashes (e.g., SHA-512 `$6$` or Yescrypt `$y$`), password expiration dates, and account lockout flags.\n- `/etc/group`: Defines groups and lists supplementary members.\n\n#### User Account Types\n- **Root (Superuser):** UID 0. Unrestricted kernel privileges.\n- **System Accounts (UID 1-999):** Dedicated service accounts created for system daemons (e.g., `nginx`, `postgres`, `systemd-resolve`). Created with `useradd -r`, these accounts typically have login shell set to `/usr/sbin/nologin` or `/bin/false` to prevent interactive SSH logins.\n- **Standard Users (UID 1000+):** Human interactive developer or administrator accounts.\n\n#### Sudoers Architecture & visudo\n`sudo` (Superuser Do) allows designated users to run commands with administrative privileges without sharing the root password.\n- Configuration: Controlled by `/etc/sudoers` and files in `/etc/sudoers.d/`.\n- **The visudo Mandate:** `/etc/sudoers` must **ALWAYS** be edited using the `visudo` command. `visudo` creates a lock, opens a temporary file, and performs strict syntax parsing before committing changes. If a syntax error is introduced into `/etc/sudoers` with a standard editor, `sudo` will break across the entire system, locking all administrators out of root access.\n- Sudoers Grammar:\n  ```text\n  # User   Host=(RunAs_User:RunAs_Group)  Tags       Commands\n  deployer ALL=(root)                     NOPASSWD:  /bin/systemctl restart nginx\n  ```\n\n#### Pluggable Authentication Modules (PAM)\nPAM provides a centralized, modular authentication abstraction layer for Linux. Applications like `sshd`, `sudo`, and `login` do not implement authentication logic themselves; they query PAM modules in `/etc/pam.d/` to handle:\n- `auth`: Verifies user identity (password, hardware token, biometric).\n- `account`: Checks account validity (is the account expired or locked?).\n- `password`: Enforces password policies (length, complexity via `pam_pwquality`).\n- `session`: Sets up the user session (mounting home dirs, setting resource limits via `pam_limits`).\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| LINUX AUTHENTICATION FLOW VIA PLUGGABLE AUTHENTICATION MODULES (PAM)     |\n|                                                                          |\n| 1. [ User executes 'sudo systemctl restart nginx' ]                      |\n|         |                                                                |\n|         v                                                                |\n| 2. [ sudo binary checks /etc/pam.d/sudo configuration ]                  |\n|         |                                                                |\n|         v                                                                |\n| 3. PAM Stack Execution:                                                  |\n|    ├── auth      requisite  pam_unix.so (verify password vs /etc/shadow) |\n|    ├── account   required   pam_unix.so (is account active?)            |\n|    ├── session   required   pam_limits.so (set file descriptor limits)  |\n|         |                                                                |\n|         v                                                                |\n| 4. [ sudo binary validates authorization in /etc/sudoers.d/ ]            |\n|         | Checks user, hostname, NOPASSWD tags, and command path         |\n|         v                                                                |\n| 5. [ Command executed as root (UID 0) ]                                  |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Provisioning Least-Privilege CI/CD Runner Service Accounts\nA GitLab/GitHub Actions runner executes build and deployment scripts. Giving the runner full passwordless root access (`ALL=(ALL) NOPASSWD: ALL`) is an enterprise security violation.\nEngineers apply the Principle of Least Privilege:\n1. Create a dedicated system user without login shell:\n   `sudo useradd -r -s /usr/sbin/nologin -d /var/lib/runner runner`\n2. Create a hardened drop-in file: `sudo visudo -f /etc/sudoers.d/runner`\n   ```text\n   # Allow runner to only reload Nginx and restart the API service\n   runner ALL=(root) NOPASSWD: /bin/systemctl reload nginx, /bin/systemctl restart payment-api\n   ```\nIf the runner is compromised via a dependency exploit, the attacker cannot modify `/etc/shadow`, install rootkits, or pivot across the network.\n\n#### Enterprise Use Case 2: Instant Incident Response - Locking Compromised Accounts\nDuring a security breach where an engineer's credentials are leaked, DevOps security engineers execute instant credential invalidation:\n```bash\n# 1. Lock password in /etc/shadow (prepends '!' to password hash)\nsudo passwd -l compromised_dev\n\n# 2. Terminate all active processes and kill active SSH sessions\nsudo pkill -u compromised_dev\n\n# 3. Invalidate SSH authorized_keys\nsudo rm -f /home/compromised_dev/.ssh/authorized_keys\n```\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Creating and Managing User Accounts\n```bash\n# Create a dedicated non-login system account for microservices\nsudo useradd -r -s /usr/sbin/nologin -d /opt/payment-app paymentapp\n\n# Create a human user account with home directory and bash shell\nsudo useradd -m -s /bin/bash devops_lead\n\n# Set user password securely\nsudo passwd devops_lead\n\n# Add user to supplementary administrative group (sudo on Ubuntu, wheel on RHEL)\nsudo usermod -aG sudo devops_lead\n```\n\n#### 2. Auditing User Identity and Groups\n```bash\nid devops_lead\n# Expected Output:\n# uid=1002(devops_lead) gid=1002(devops_lead) groups=1002(devops_lead),27(sudo)\n```\n\n#### 3. Authoring Secure Sudoers Rules with visudo\n```bash\n# Validate sudoers syntax safely\nsudo visudo -cf /etc/sudoers.d/web_team\n# Expected Output:\n# /etc/sudoers.d/web_team: parsed OK\n\n# Verify what sudo permissions the active user has\nsudo -l\n# Expected Output:\n# User devops_lead may run the following commands on devops-node01:\n#     (ALL : ALL) ALL\n#     (root) NOPASSWD: /bin/systemctl restart nginx\n```\n\n#### 4. Account Lockdown and Expiration\n```bash\n# Lock user account\nsudo passwd -l devops_lead\n\n# Check account aging and expiration parameters\nsudo chage -l devops_lead\n# Expected Output:\n# Last password change                                    : Oct 14, 2026\n# Password expires                                        : never\n# Password inactive                                       : never\n# Account expires                                         : never\n# Minimum number of days between password change          : 0\n# Maximum number of days between password change          : 99999\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: \"User is not in the sudoers file. This incident will be reported.\"\n- **Symptom:** Running `sudo` fails with:\n  `devops_user is not in the sudoers file. This incident will be reported.`\n- **Root Cause:** The user account has not been added to the administrative group (`sudo` on Debian/Ubuntu or `wheel` on RHEL), or lacks a rule in `/etc/sudoers`.\n- **Triage & Recovery Runbook:**\n  1. Switch to root: `su -`\n  2. Add the user to the sudo group: `usermod -aG sudo devops_user`.\n  3. Ensure group membership takes effect: the user must log out and log back in (or run `newgrp sudo`).\n\n#### Error 2: \"sudo: parse error in /etc/sudoers.d/custom near line 1\"\n- **Symptom:** Every attempt to run `sudo` prints:\n  `sudo: parse error in /etc/sudoers.d/custom near line 1`\n  `sudo: no valid sudoers sources found, quitting`\n- **Root Cause:** A human edited a sudoers file using standard `nano` or `vim` without syntax validation, leaving a missing comma or typo.\n- **Triage & Recovery Runbook:**\n  1. If root password is known: Run `su -` and repair the file with `visudo -f /etc/sudoers.d/custom`.\n  2. If root password is not set (standard cloud EC2/GCP instances):\n     Use `pkexec visudo -f /etc/sudoers.d/custom` if Polkit is active, or reboot into GRUB Single-User mode (`init=/bin/sh`) to remove the corrupted file.\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: Why does UID 0 define root rather than the username 'root'?**  \n  *A:* The Linux kernel does not understand string usernames; usernames are human-friendly abstractions mapped by the C library via `/etc/passwd`. In the kernel's process credential structure (`struct cred`), user privileges are evaluated strictly by the numerical integer `uid`. If an attacker creates an account named `hacker` with UID `0` in `/etc/passwd`, that account possesses complete root superuser privileges across the operating system.\n- **Q: What is the security purpose of separating /etc/passwd and /etc/shadow?**  \n  *A:* `/etc/passwd` must be world-readable (`0644`) because many normal user-space programs (e.g., `ls -l`, `ps`) need to map numeric UIDs to usernames. If password hashes were stored in `/etc/passwd` (as they were in ancient Unix), any local user could read the file and execute offline dictionary or brute-force cracking attacks (using tools like John the Ripper or Hashcat). `/etc/shadow` was introduced to store password hashes in a file readable only by root (`0640`).\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Create an isolated system service account, configure a least-privilege sudoers rule, and verify account security restrictions.\n\n#### Prerequisites\n- Linux terminal with `sudo` access.\n\n#### Execution Steps\n1. **Create an Unprivileged Service Account:**\n   ```bash\n   sudo useradd -r -s /usr/sbin/nologin -d /opt/microservice svc_api\n   id svc_api\n   ```\n\n2. **Verify That Interactive Login is Blocked:**\n   ```bash\n   sudo su - svc_api || true\n   ```\n   *Observation:* System will reject login with \"This account is currently not available.\"\n\n3. **Grant Least-Privilege Sudo Access via visudo:**\n   ```bash\n   cat << 'EOF' | sudo tee /etc/sudoers.d/svc_api\n   svc_api ALL=(root) NOPASSWD: /bin/systemctl restart nginx\n   EOF\n   sudo chmod 0440 /etc/sudoers.d/svc_api\n   sudo visudo -cf /etc/sudoers.d/svc_api\n   ```\n   *Verification:* Output must print \"parsed OK\".\n\n4. **Audit Sudo Permissions:**\n   ```bash\n   sudo -u svc_api sudo -l\n   ```\n\n#### Verification Challenge\n```bash\nsudo visudo -cf /etc/sudoers.d/svc_api >/dev/null 2>&1 && echo \"VERIFIED: Least-privilege sudoers configuration validated\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **UID 0 = Superuser:** Any account with UID 0 has full kernel root privileges.\n- [x] **/etc/passwd vs /etc/shadow:** `/etc/passwd` maps usernames to UIDs (world-readable); `/etc/shadow` stores hashes (root-only).\n- [x] **visudo is Mandatory:** Never edit `/etc/sudoers` with plain editors; `visudo` validates syntax before saving.\n- [x] **Service Accounts:** Always create with `-r` (system account) and `-s /usr/sbin/nologin` to disable interactive shells.\n- [x] **PAM Modules:** Centralizes `auth`, `account`, `password`, and `session` policy enforcement across all applications.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: Why must administrators ALWAYS use 'visudo' instead of a text editor like nano to edit sudoers files?**\n- [ ] A) visudo encrypts the file with GPG\n- [x] B) visudo locks the file against concurrent edits and checks syntax before saving, preventing system lockouts\n- [ ] C) visudo automatically reboots the server\n- [ ] D) Text editors cannot open files in /etc\n*Explanation:* If a syntax error is saved in `/etc/sudoers`, `sudo` breaks instantly across the system. `visudo` tests the syntax and will not save corrupted configurations.\n\n**Quiz Q2: What is the recommended shell for an automated system service account (e.g., prometheus) that should NOT allow interactive user logins?**\n- [ ] A) /bin/bash\n- [ ] B) /bin/sh\n- [x] C) /usr/sbin/nologin (or /bin/false)\n- [ ] D) /bin/zsh\n*Explanation:* Setting the shell to `/usr/sbin/nologin` or `/bin/false` prevents interactive terminal and SSH logins while still allowing the system to execute daemons under that UID.\n\n**Quiz Q3: Where are cryptographic salted password hashes stored in modern Linux?**\n- [ ] A) /etc/passwd\n- [x] B) /etc/shadow\n- [ ] C) /etc/group\n- [ ] D) /var/log/auth.log\n*Explanation:* `/etc/shadow` stores salted password hashes and is readable strictly by root, protecting passwords from offline dictionary attacks by unprivileged users."
                  },
                  {
                        id: "linux_mod_09",
                        title: "Module 9: Production Bash Shell Scripting, Strict Mode & Error Handling",
                        duration: 60,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/tK9Oc6AEnR4",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Bash (Bourne Again SHell) scripting is the foundational automation language of DevOps engineering. It ties together Linux operating system primitives, manages CI/CD build phases, and provisions cloud infrastructure.\n\n#### The Shebang Line (`#!/usr/bin/env bash`)\nThe first line of an executable script instructs the Linux kernel's `execve()` system call which binary interpreter to spawn:\n- `#!/usr/bin/env bash`: Portable standard. Resolves the `bash` binary from the current environment's `PATH` (works identically across Ubuntu, RHEL, Alpine, and macOS).\n- Avoid hardcoded `#!/bin/bash` if portability across non-standard Unix environments is required.\n\n#### Bash Strict Mode: \"Unofficial Bash Strict Mode\"\nBy default, Bash is dangerously permissive: it continues executing when commands fail, treats undefined variables as empty strings, and masks pipeline errors. Every production DevOps script must start with:\n```bash\nset -euo pipefail\nIFS=$'\\n\\t'\n```\n- `-e` (`errexit`): Immediately exit if any command exits with a non-zero exit status.\n- `-u` (`nounset`): Treat unset/unbound variables as fatal errors rather than silently substituting an empty string. (Prevents catastrophic bugs like `rm -rf /opt/$APP_DIR` when `$APP_DIR` is unset!).\n- `-o pipefail`: If any command in a pipeline (`cmd1 | cmd2 | cmd3`) fails, the entire pipeline returns the exit code of the last failing command, rather than masking it with `cmd3`'s success.\n- `IFS=$'\\n\\t'`: Restricts the Internal Field Separator to newlines and tabs, preventing bugs when iterating over strings with spaces.\n\n#### Variable Scoping & Special Automatic Variables\n- `local var=\"value\"`: Restricts variable visibility to the declaring function. Always use `local` inside functions to avoid polluting global state.\n- Special Automatic Variables:\n  - `$0`: Script filename.\n  - `$1 ... $9`: Positional arguments passed to the script.\n  - `$#`: Total count of arguments provided.\n  - `$@`: All positional arguments as distinct quoted elements (`\"$@\"`).\n  - `$*`: All positional arguments merged into a single IFS-separated string.\n  - `$?`: Exit status of the most recently executed command (`0` = success, `1-255` = failure).\n  - `$$`: Process ID (PID) of the currently running script (useful for creating unique temp files).\n\n#### Error Handling and Signal Trapping\nThe `trap` builtin allows scripts to intercept signals and exit conditions, guaranteeing cleanup:\n```bash\n# Automatically clean up temporary scratch directory on ANY exit or termination\nTEMP_DIR=$(mktemp -d /tmp/deploy.XXXXXX)\ntrap 'rm -rf \"$TEMP_DIR\"; echo \"[CLEANUP] Temp files deleted\"' EXIT\ntrap 'echo \"[ABORT] Interrupted by user\"; exit 130' INT TERM\n```\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| PRODUCTION BASH AUTOMATION PIPELINE ARCHITECTURE                         |\n|                                                                          |\n| 1. [ INITIALIZATION: Shebang + Strict Mode (set -euo pipefail) ]         |\n|         |                                                                |\n|         v                                                                |\n| 2. [ TRAP REGISTRATION: trap cleanup EXIT INT TERM ]                     |\n|         | Guarantees scratch directory deletion even on crash            |\n|         v                                                                |\n| 3. [ PREREQUISITE VALIDATION: check command -v docker, curl, jq ]        |\n|         | Halts early if essential binaries are missing                  |\n|         v                                                                |\n| 4. [ BUSINESS LOGIC: with structured logging (log_info, log_error) ]     |\n|         |                                                                |\n|         +---> [ Task A: Database Backup ] -> (Fails? Exit immediately)   |\n|         |                                                                |\n|         +---> [ Task B: Upload to S3 ]    -> (Passes? Continue)          |\n|         v                                                                |\n| 5. [ CLEAN EXIT: trap executes cleanly -> Return Code 0 ]                |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case: Idempotent Database Backup & S3 Offload Script\n```bash\n#!/usr/bin/env bash\nset -euo pipefail\n\nreadonly SCRIPT_DIR=\"$(cd \"$(dirname \"${BASH_SOURCE[0]}\")\" && pwd)\"\nreadonly BACKUP_DIR=\"/var/backups/postgres\"\nreadonly TIMESTAMP=\"$(date +%Y%m%d_%H%M%S)\"\nreadonly DUMP_FILE=\"${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz\"\n\nlog() {\n  local level=\"$1\"; shift\n  echo \"[$(date '+%Y-%m-%d %H:%M:%S')] [${level}] $*\"\n}\n\ncleanup() {\n  log \"INFO\" \"Executing cleanup handlers...\"\n  # Prune local backups older than 7 days\n  find \"${BACKUP_DIR}\" -name \"*.sql.gz\" -mtime +7 -delete || true\n}\ntrap cleanup EXIT\n\nmain() {\n  log \"INFO\" \"Starting automated database backup...\"\n  mkdir -p \"${BACKUP_DIR}\"\n  \n  # Check if PostgreSQL service is reachable\n  if ! pg_isready -q; then\n    log \"ERROR\" \"PostgreSQL is not responding. Aborting backup.\"\n    exit 1\n  fi\n\n  # Stream pg_dump directly into gzip\n  pg_dump -U postgres -d production_db | gzip > \"${DUMP_FILE}\"\n  log \"INFO\" \"Backup written to ${DUMP_FILE} ($(du -h \"${DUMP_FILE}\" | cut -f1))\"\n  \n  # Offload to S3 bucket\n  if command -v aws >/dev/null 2>&1; then\n    aws s3 cp \"${DUMP_FILE}\" \"s3://corp-backups/postgres/db_${TIMESTAMP}.sql.gz\" --quiet\n    log \"INFO\" \"Successfully archived to AWS S3\"\n  fi\n}\n\nmain \"$@\"\n```\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Testing Variables and Conditions Robustly\n```bash\n# Recommended: Double brackets [[ ... ]] support regex and prevent word-splitting\nTARGET_DIR=\"/opt/data\"\n\nif [[ -d \"$TARGET_DIR\" && -w \"$TARGET_DIR\" ]]; then\n  echo \"Directory exists and is writable\"\nelse\n  echo \"Directory missing or read-only\" >&2\n  exit 1\nfi\n\n# String pattern matching with regex in Bash\nGIT_BRANCH=\"release/2.4.0\"\nif [[ \"$GIT_BRANCH\" =~ ^release/[0-9]+.[0-9]+ ]]; then\n  echo \"Valid release branch format detected\"\nfi\n```\n\n#### 2. Safe Parsing of Command Output via While-Read Loops\n```bash\n# Read lines safely without word-splitting bugs\ndf -h | grep \"^/dev\" | while read -r fs size used avail use_pct mount; do\n  echo \"Device: $fs is at $use_pct mounted on $mount\"\ndone\n# Expected Output:\n# Device: /dev/nvme0n1p1 is at 48% mounted on /\n# Device: /dev/mapper/vg_data-lv_app is at 18% mounted on /data\n```\n\n#### 3. Inspecting Exit Codes and Pipeline Failures\n```bash\n# Without pipefail: returns exit code 0 because 'true' succeeded\nset +o pipefail\nfalse | true\necho \"Exit status: $?\"\n# Output: Exit status: 0 (MISLEADING!)\n\n# With pipefail: returns exit code of failing command in pipeline\nset -o pipefail\nfalse | true\necho \"Exit status: $?\"\n# Output: Exit status: 1 (CORRECT!)\n```\n\n#### 4. Debugging Scripts with Execution Tracing\n```bash\n# Run script in debug trace mode showing every evaluated line\nbash -x /opt/scripts/deploy.sh --env=production\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: Catastrophic \"rm -rf\" Deletion due to Unset Variables\n- **Symptom:** A script executes `rm -rf \"$BUILD_DIR/*\"`. Because `$BUILD_DIR` was unset or misspelled, the command expands to `rm -rf /*`, destroying the root filesystem!\n- **Root Cause:** Running without `set -u`. In standard Bash, uninitialized variables silently expand to an empty string.\n- **Triage & Recovery Runbook:**\n  1. Always declare `set -euo pipefail` at the top of every script.\n  2. Use parameter default fallbacks when a variable might legitimately be empty:\n     `rm -rf \"${BUILD_DIR:?Error: BUILD_DIR is not set}/*\"`\n  3. Validate variable is non-empty before running destructive commands:\n     `[[ -n \"$BUILD_DIR\" ]] || { echo \"Empty BUILD_DIR\"; exit 1; }`\n\n#### Error 2: \"[: missing `]' or Syntax Errors with Single Brackets\n- **Symptom:** `if [ $VAR == \"test\" ]; then` crashes with:\n  `bash: [: =: unary operator expected` when `$VAR` is empty.\n- **Root Cause:** Legacy single brackets `[` are actually an alias for the `test` binary. If `$VAR` is empty, Bash expands the line to `[ == \"test\" ]`, causing a syntax parsing failure.\n- **Triage & Recovery Runbook:**\n  1. Always use modern double brackets `[[ ... ]]`, which are built into the Bash syntax engine and handle empty variables without quoting:\n     `if [[ $VAR == \"test\" ]]; then ...`\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: What is the exact difference between \"$@\" and \"$*\"?**  \n  *A:* When quoted:\n  - `\"$@\"` expands each positional argument into a separate, distinct quoted string (`\"$1\" \"$2\" \"$3\"`). It preserves arguments containing whitespace intact (e.g. `\"file with spaces.txt\"`).\n  - `\"$*\"` concatenates all positional arguments into a single combined string, separated by the first character of `IFS` (`\"$1c$2c$3\"`).\n  *Rule:* In 99% of production automation, you should use `\"$@\"` (such as forwarding arguments in wrappers: `exec /usr/bin/binary \"$@\"`).\n- **Q: How does the Bash 'trap' builtin handle exit cleanup during sudden SIGTERM?**  \n  *A:* When a script registers `trap cleanup EXIT`, the `cleanup` function is invoked whenever the shell terminates, whether through a normal `exit 0`, an error trigger from `set -e`, or a handled signal. However, if the process receives `SIGKILL (9)`, `trap` cannot run because `SIGKILL` is handled unconditionally by the kernel. Therefore, scripts should register traps for `EXIT`, `INT` (Ctrl+C), and `TERM` (Kubernetes shutdown) to release locks, remove temp files, and notify monitoring systems before terminating.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Author a hardened, production-ready Bash monitoring script with strict error handling, signal trapping, and structured logging.\n\n#### Prerequisites\n- Standard Linux terminal.\n\n#### Execution Steps\n1. **Author the Hardened Script:**\n   ```bash\n   cat << 'EOF' > /tmp/system_audit.sh\n   #!/usr/bin/env bash\n   set -euo pipefail\n\n   SCRATCH=$(mktemp -d /tmp/audit.XXXXXX)\n   trap 'rm -rf \"$SCRATCH\"; echo \"[AUDIT] Cleaned up $SCRATCH\"' EXIT\n\n   echo \"=== System Audit Telemetry ===\" > \"$SCRATCH/report.txt\"\n   echo \"Host: $(hostname)\" >> \"$SCRATCH/report.txt\"\n   echo \"Kernel: $(uname -r)\" >> \"$SCRATCH/report.txt\"\n   echo \"Disk Free: $(df -h / | awk 'NR==2 {print $4}')\" >> \"$SCRATCH/report.txt\"\n\n   cat \"$SCRATCH/report.txt\"\n   EOF\n   chmod +x /tmp/system_audit.sh\n   ```\n\n2. **Execute and Validate Clean Execution:**\n   ```bash\n   /tmp/system_audit.sh\n   ```\n   *Observation:* Notice the report prints, and the trap cleanup executes at the end.\n\n3. **Verify Strict Mode Catches Unset Variables:**\n   ```bash\n   bash -c 'set -u; echo \"Value is: $UNDEFINED_TEST\"' || echo \"PASSED: Strict mode caught unset variable\"\n   ```\n\n#### Verification Challenge\n```bash\n/tmp/system_audit.sh | grep -q \"Disk Free:\" && echo \"VERIFIED: Hardened Bash script executed successfully\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **Shebang:** Use `#!/usr/bin/env bash` for maximum OS portability.\n- [x] **Strict Mode:** Always declare `set -euo pipefail` to prevent silent failures and masked pipeline errors.\n- [x] **Use [[ ]]:** Double brackets prevent word-splitting and syntax crashes on empty variables.\n- [x] **Trap for Cleanup:** Register `trap cleanup EXIT` to guarantee temporary files are unlinked on exit or crash.\n- [x] **Forwarding Args:** Use `\"$@\"` (with double quotes) to forward arguments without breaking filenames with spaces.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: What does the '-o pipefail' option do in a Bash script?**\n- [ ] A) It speeds up pipeline throughput using RAM buffers\n- [x] B) It returns the exit code of the last failing command in a pipeline, preventing downstream commands from masking errors\n- [ ] C) It disables all pipes in the script\n- [ ] D) It sends errors to a named FIFO pipe\n*Explanation:* By default, a pipeline returns the exit status of the *last* command (e.g. `failing_cmd | true` returns 0). `-o pipefail` ensures that if any command in the chain fails, the entire pipeline exits with that failure code.\n\n**Quiz Q2: Why is 'set -u' (nounset) critical for scripts that execute 'rm -rf'?**\n- [ ] A) It prompts the user for confirmation before deleting\n- [ ] B) It forces file deletion without asking\n- [x] C) It halts the script immediately if a variable is unset, preventing 'rm -rf $DIR/*' from expanding to 'rm -rf /*'\n- [ ] D) It sends deleted files to a trash folder\n*Explanation:* If `$DIR` is empty or misspelled, `set -u` aborts execution with 'unbound variable', preventing accidental destruction of files.\n\n**Quiz Q3: What is the primary difference between \"$@\" and \"$*\" when passed inside double quotes?**\n- [ ] A) There is no difference\n- [x] B) \"$@\" preserves each argument as an individual quoted string; \"$*\" collapses all arguments into one single string\n- [ ] C) \"$*\" is faster than \"$@\"\n- [ ] D) \"$@\" only works with numbers\n*Explanation:* `\"$@\"` preserves distinct argument boundaries (critical when arguments contain spaces), whereas `\"$*\"` merges all arguments into a single string."
                  },
                  {
                        id: "linux_mod_10",
                        title: "Module 10: Stream Editing & Text Processing (grep, sed, awk) for SRE / DevOps",
                        duration: 60,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/e7BufAVwDiM",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** In the Unix philosophy, text streams are the universal interface between programs. SRE and DevOps engineers rely on three classic GNU text processing utilities—`grep`, `sed`, and `awk`—to analyze multi-gigabyte log streams, inject dynamic configurations in CI/CD, and extract real-time operational metrics.\n\n#### 1. grep (Global Regular Expression Print)\n`grep` searches input streams for lines matching regular expressions and prints matching results:\n- **Core Variants:**\n  - `grep`: Standard POSIX Basic Regular Expressions (BRE).\n  - `grep -E` (or `egrep`): Extended Regular Expressions (ERE) supporting `+`, `?`, `|`, and grouping `()`.\n  - `grep -F` (or `fgrep`): Fixed Strings. Performs ultra-fast literal substring matching without regex compilation overhead.\n- **Critical SRE Flags:**\n  - `-i`: Case-insensitive search.\n  - `-v`: Invert match (prints lines that do *not* match).\n  - `-r` / `-R`: Recursive directory search.\n  - `-l`: Print only matching filenames (not line contents).\n  - `-c`: Count matching lines.\n  - `-C 3`: Print 3 lines of context before and after the match.\n\n#### 2. sed (Stream Editor)\n`sed` is a non-interactive stream editor that parses input line by line, applies pattern transformation rules, and outputs the result:\n- **Anatomy of a sed substitution:** `sed 's/pattern/replacement/flags' file`\n  - `s`: Substitute command.\n  - `g` flag: Global replacement across the entire line (not just the first occurrence).\n  - `d` command: Delete matching lines (e.g., `sed '/^#/d'` deletes comments).\n  - `-i` (`--in-place`): Directly modifies the file on disk instead of printing to stdout. In production, use `-i.bak` to create an automatic backup copy before modifying.\n  - **Custom Delimiters:** When replacing URLs or filesystem paths containing slashes, use alternate delimiters like pipe `|` or hash `#` to avoid \"leaning toothpick syndrome\": `sed 's|/var/www|/srv/app|g'`.\n\n#### 3. awk (Pattern Scanning & Processing Language)\n`awk` (named after creators Aho, Weinberger, and Kernighan) is a full-fledged domain-specific programming language designed for columnar data extraction and reporting:\n- **Execution Model:**\n  ```text\n  awk 'BEGIN { setup } /pattern/ { action } END { summary }'\n  ```\n  - `BEGIN { ... }`: Executes once before any input lines are processed.\n  - `{ ... }`: Executes for every line matching the optional pattern.\n  - `END { ... }`: Executes once after all input lines are consumed.\n- **Built-in Variables:**\n  - `$0`: The entire current line.\n  - `$1, $2, ... $NF`: The 1st, 2nd, and last column in the current line.\n  - `NF`: Number of Fields (columns) in the current line.\n  - `NR`: Current Record Number (line number).\n  - `-F`: Field separator flag (defaults to whitespace; use `-F:` for `/etc/passwd` or `-F','` for CSVs).\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| THE SRE LOG TRIAGE PIPELINE (grep -> awk -> sort -> uniq -> head)        |\n|                                                                          |\n| [/var/log/nginx/access.log (10 Million Lines)]                           |\n|       |                                                                  |\n|       v                                                                  |\n| 1. [ grep 'HTTP/1.1\" 500' ] -> Filters only HTTP 500 Internal Errors     |\n|       |                                                                  |\n|       v                                                                  |\n| 2. [ awk '{print $1}' ]     -> Extracts Field 1 (Client IP Address)      |\n|       |                                                                  |\n|       v                                                                  |\n| 3. [ sort ]                 -> Groups identical IPs together for uniq    |\n|       |                                                                  |\n|       v                                                                  |\n| 4. [ uniq -c ]              -> Counts occurrences per unique IP          |\n|       |                                                                  |\n|       v                                                                  |\n| 5. [ sort -rn ]             -> Sorts numbers in descending order         |\n|       |                                                                  |\n|       v                                                                  |\n| 6. [ head -n 5 ]            -> Top 5 offending DDoS / Broken Client IPs  |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Triage Production DDoS / Outage in 10 Seconds\nAn e-commerce API crashes with HTTP 500 errors. The SRE runs this one-liner:\n```bash\nawk '($9 ~ /500|502|504/) {print $1, $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -n 10\n```\nOutput instantly reveals:\n```text\n  42109 198.51.100.44 /api/v1/checkout\n   1240 203.0.113.12 /api/v1/search\n```\nRoot cause identified in seconds: A single IP (`198.51.100.44`) is hammering `/api/v1/checkout` with 42,000 requests, exhausting database worker threads. The engineer blocks the IP via firewall (`sudo ufw deny from 198.51.100.44`), stabilizing the platform.\n\n#### Enterprise Use Case 2: CI/CD Dynamic Config Templating\nDuring container startup in Kubernetes, database connection URLs must be injected into configuration files before the daemon starts:\n```bash\nsed -i \"s|{{DB_HOST}}|${DATABASE_HOST}|g; s|{{DB_PORT}}|${DATABASE_PORT:-5432}|g\" /etc/app/config.yaml\n```\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Advanced Log Searching with grep\n```bash\n# Search for fatal errors with 2 lines of surrounding context\ngrep -i -C 2 -E \"out of memory|fatal exception\" /var/log/syslog | head -n 12\n# Expected Output:\n# Oct 14 09:12:01 node01 kernel: [ 451.201] postgres invoked oom-killer: gfp_mask=0x1100cca\n# Oct 14 09:12:01 node01 kernel: [ 451.202] Out of memory: Killed process 2814 (postgres)\n# Oct 14 09:12:01 node01 kernel: [ 451.205] Total-vm: 16777216kB, anon-rss: 8388608kB\n\n# Count number of failed SSH login attempts\ngrep -c \"Failed password\" /var/log/auth.log\n# Expected Output:\n# 342\n```\n\n#### 2. In-Place Stream Editing with sed\n```bash\n# Replace port 80 with port 8080 in Nginx configuration with automatic backup\nsudo sed -i.bak 's/listen 80;/listen 8080;/g' /etc/nginx/sites-available/default\n\n# Strip all comment lines (#) and blank lines from a configuration file\ngrep -v '^[[:space:]]*#' /etc/redis/redis.conf | grep -v '^[[:space:]]*$' | head -n 8\n```\n\n#### 3. Columnar Extraction and Arithmetic with awk\n```bash\n# Extract username, UID, and shell from /etc/passwd where UID >= 1000\nawk -F: '($3 >= 1000 && $3 < 65534) {printf \"%-15s UID: %-5d Shell: %s\\n\", $1, $3, $7}' /etc/passwd\n# Expected Output:\n# ubuntu          UID: 1000  Shell: /bin/bash\n# devops_lead     UID: 1001  Shell: /bin/bash\n# apprunner       UID: 1002  Shell: /bin/bash\n\n# Calculate average response time from an access log where Field 10 is latency in ms\nawk '{sum += $10; count++} END {if (count > 0) print \"Average Latency: \" sum/count \" ms\"}' /var/log/api.log\n# Expected Output:\n# Average Latency: 24.8 ms\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: \"sed: -e expression #1, char 9: unknown option to `s'\"\n- **Symptom:** Running `sed \"s/$OLD_PATH/$NEW_PATH/g\" config.txt` crashes with:\n  `sed: -e expression #1, char 9: unknown option to 's'`\n- **Root Cause:** Slashes in variables. When `$OLD_PATH` contains `/usr/local/bin`, `sed` sees `s//usr/local/bin/...`, confusing the slashes in the path with the `sed` delimiter.\n- **Triage & Recovery Runbook:**\n  1. Change the `sed` delimiter to a character not present in the variable, such as pipe `|`, hash `#`, or tilde `~`:\n     `sed \"s|$OLD_PATH|$NEW_PATH|g\" config.txt`\n\n#### Error 2: Accidental File Truncation via Redirection\n- **Symptom:** Running `grep -v \"DEBUG\" app.log > app.log` wipes out `app.log` to 0 bytes!\n- **Root Cause:** The shell sets up the output redirection (`> app.log`) *before* executing the `grep` command, truncating the file to empty immediately.\n- **Triage & Recovery Runbook:**\n  1. Never redirect output into the same file being read.\n  2. Use a temporary file:\n     `grep -v \"DEBUG\" app.log > app.log.tmp && mv app.log.tmp app.log`\n  3. Or use `sponge` from the `moreutils` package:\n     `grep -v \"DEBUG\" app.log | sponge app.log`\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: How does awk differentiate between '$NF' and 'NF'?**  \n  *A:* `NF` is a built-in variable that holds the total number of fields (columns) in the current line (e.g. if a line has 8 columns, `NF` equals `8`). When prefixed with a dollar sign (`$NF`), it evaluates the field *at* that position (e.g. `$8`, which is the value of the last column on that line).\n- **Q: When would you use 'grep -F' over standard 'grep'?**  \n  *A:* `grep -F` (Fixed strings) treats all search patterns as literal strings rather than regular expressions. If you are searching multi-gigabyte log files for literal IP addresses (`192.168.1.1`) or URLs (`https://api.com/v1`), `grep -F` does not have to escape dots or compile a regex state machine. This makes `grep -F` between 2x and 10x faster than standard regex engines on large data streams.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Generate a simulated access log, parse HTTP status code distributions using awk, and perform automated config replacements with sed.\n\n#### Prerequisites\n- Linux terminal access.\n\n#### Execution Steps\n1. **Generate Mock Access Log Data:**\n   ```bash\n   cat << 'EOF' > /tmp/access.log\n   192.168.1.10 - - [14/Oct/2026:10:00:01] \"GET /index.html HTTP/1.1\" 200 1420 12\n   192.168.1.15 - - [14/Oct/2026:10:00:02] \"POST /api/login HTTP/1.1\" 401 230 45\n   192.168.1.10 - - [14/Oct/2026:10:00:03] \"GET /app.js HTTP/1.1\" 200 45200 15\n   10.0.0.50 - - [14/Oct/2026:10:00:04] \"GET /checkout HTTP/1.1\" 500 512 850\n   192.168.1.10 - - [14/Oct/2026:10:00:05] \"GET /style.css HTTP/1.1\" 200 8900 8\n   EOF\n   ```\n\n2. **Calculate Status Code Frequency with awk:**\n   ```bash\n   awk '{print $9}' /tmp/access.log | sort | uniq -c | sort -rn\n   ```\n   *Observation:* Observe exact count of 200, 401, and 500 responses.\n\n3. **In-Place Modification with sed:**\n   ```bash\n   sed -i 's|/api/login|/api/v2/auth|g' /tmp/access.log\n   grep \"api/v2/auth\" /tmp/access.log\n   ```\n   *Verification:* Output confirms replacement was applied directly to disk.\n\n#### Verification Challenge\n```bash\nawk '$9 == \"500\" {print $1}' /tmp/access.log | grep -q \"10.0.0.50\" && echo \"VERIFIED: awk columnar extraction functional\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **grep -E vs -F:** Use `-E` for extended regex (`+`, `|`, `?`); use `-F` for ultra-fast literal string searching.\n- [x] **sed Delimiters:** Use alternate delimiters like `s|old|new|g` when dealing with filesystem paths or URLs.\n- [x] **sed -i:** Modifies files in-place; always test output on stdout or use `-i.bak` first.\n- [x] **awk Fields:** `$1` is column 1, `$NF` is the last column, `NF` is the column count, `NR` is line number.\n- [x] **Safe Redirection:** Never redirect into the same file being read (`cmd file > file` wipes the file!).\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: What does the built-in variable '$NF' represent in an awk script?**\n- [ ] A) The total number of files processed\n- [x] B) The value of the last field (column) of the current line\n- [ ] C) The name of the input file\n- [ ] D) The process ID of awk\n*Explanation:* `NF` holds the number of fields in the current line. `$NF` evaluates the content of the field at index `NF`, effectively returning the last column regardless of line width.\n\n**Quiz Q2: Why will running 'cat config.txt | grep -v \"DEBUG\" > config.txt' corrupt the file?**\n- [ ] A) grep does not support output redirection\n- [x] B) The shell creates and truncates 'config.txt' before grep starts reading it, resulting in an empty file\n- [ ] C) cat locks the file in exclusive mode\n- [ ] D) grep requires sudo permissions\n*Explanation:* The shell redirection operator `>` truncates the destination file before launching the pipeline commands, immediately emptying the file before `cat` or `grep` can read its contents.\n\n**Quiz Q3: Which sed command replaces all occurrences of the path '/var/log' with '/mnt/logs' in-place?**\n- [ ] A) sed 's//var/log//mnt/logs/g' file\n- [x] B) sed -i 's|/var/log|/mnt/logs|g' file\n- [ ] C) sed --replace /var/log /mnt/logs file\n- [ ] D) sed -d '/var/log/' file\n*Explanation:* Using the alternate delimiter `|` avoids syntax errors caused by slashes in the path, and `-i` applies the modification in-place on the file."
                  }
            ]
      },
      {
            id: "sec_linux_03",
            title: "Section 3: Networking, Security, Performance & Cron (Modules 11-15)",
            lessons: [
                  {
                        id: "linux_mod_11",
                        title: "Module 11: Linux Networking Stack, Socket Diagnostics (ss, ip, dig) & TCP/IP",
                        duration: 50,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/hRFgnx1M83M",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** The Linux network subsystem implements an enterprise-grade TCP/IP stack within kernel space (Ring 0). Network applications interact with this stack via POSIX network sockets, managed through modern `iproute2` suite utilities that interface directly with the kernel's Netlink socket interface.\n\n#### The iproute2 Suite vs Legacy net-tools\nLinux networking tools underwent a major architectural migration:\n- **Deprecated (Legacy net-tools):** `ifconfig`, `netstat`, `route`, `arp`. These utilities parse information slowly by reading `/proc/net/*` line-by-line, which induces severe CPU bottlenecks on production servers handling 50,000+ open sockets.\n- **Modern Standard (`iproute2`):** `ip`, `ss`, `bridge`. These utilities communicate directly with the kernel via high-speed Netlink sockets (`AF_NETLINK`), providing instantaneous statistics, microsecond timer tracking, and namespace awareness.\n\n#### The Socket Lifecycle & TCP State Machine\nNetwork communication between two systems traverses explicit states:\n- `LISTEN`: Server process is waiting for incoming connection requests on a bound TCP port.\n- `SYN-SENT` / `SYN-RECV`: Three-way TCP handshake in progress (`SYN` -> `SYN-ACK` -> `ACK`).\n- `ESTABLISHED`: Active, bidirectional data transfer session open.\n- `FIN-WAIT-1` / `FIN-WAIT-2` / `CLOSE-WAIT`: Connection teardown initiated.\n- `TIME-WAIT`: The local endpoint has closed the connection and is waiting (typically 60s, defined by `2 * MSL`) to ensure delayed duplicate packets from the network are discarded and the remote peer received the final ACK.\n\n#### The Linux DNS Resolution Flow\nWhen an application invokes `getaddrinfo(\"api.company.com\")`:\n1. It queries the Name Service Switch configuration in `/etc/nsswitch.conf` (typically configured as `hosts: files dns`).\n2. **Step 1 (Local static):** Checks `/etc/hosts` for static IP-to-hostname mappings.\n3. **Step 2 (Local stub resolver):** Queries the local caching resolver configured in `/etc/resolv.conf` (on modern systemd systems, this points to `127.0.0.53:53`, managed by `systemd-resolved`).\n4. **Step 3 (Upstream DNS):** The resolver forwards recursive queries to configured upstream nameservers (e.g. AWS VPC DNS at `10.0.0.2` or Google DNS `8.8.8.8`).\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| LINUX TCP/IP PACKET PATHWAY & NETLINK SOCKET INTERFACE                   |\n|                                                                          |\n| USER SPACE:        [ Nginx Web Server ]         [ cURL Client ]          |\n|                             |                          |                 |\n|                             v (socket(), bind(), ...)  v                 |\n| SYSTEM CALLS:      [ BSD Socket Interface: AF_INET / AF_INET6 ]          |\n|                                    |                                     |\n|                                    v                                     |\n| KERNEL SPACE:      +---------------------------------------------------+ |\n|                    | TCP / UDP Protocol Engine (State Machine)         | |\n|                    | Socket Buffers: sk_buff (rmem_default, wmem_max)  | |\n|                    +---------------------------------------------------+ |\n|                                    |                                     |\n|                                    v                                     |\n|                    +---------------------------------------------------+ |\n|                    | Netfilter (Conntrack / PREROUTING / iptables)     | |\n|                    +---------------------------------------------------+ |\n|                                    |                                     |\n|                                    v                                     |\n|                    +---------------------------------------------------+ |\n|                    | IP Routing Engine (Kernel Routing Table)          | |\n|                    +---------------------------------------------------+ |\n|                                    |                                     |\n|                                    v                                     |\n| DRIVER / HARDWARE: +---------------------------------------------------+ |\n|                    | Network Interface Card (NIC e1000e / Ring Buffer) | |\n|                    +---------------------------------------------------+ |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Triage \"Address Already in Use\" Port Clashes\nDuring a blue/green deployment or service restart, an application fails to start with:\n`Error: listen EADDRINUSE: address already in use 0.0.0.0:8080`\nDevOps engineers instantly identify the competing process:\n`sudo ss -tulnp | grep :8080`\nOutput identifies the exact PID and process name holding the port:\n`tcp LISTEN 0 511 0.0.0.0:8080 0.0.0.0:* users:((\"node\",pid=14209,fd=18))`\nThe engineer terminates the orphaned zombie process (`sudo kill -15 14209`), enabling the service to bind successfully.\n\n#### Enterprise Use Case 2: Diagnosing DNS Latency in Microservices\nA microservice in a Kubernetes cluster experiences intermittent 5-second delays on HTTP requests. Using `dig +trace api.internal` and `tcpdump -i any port 53`, engineers discover the DNS client is querying both `IPv4 (A)` and `IPv6 (AAAA)` records concurrently. Because the local VPC does not support IPv6, the AAAA lookup times out after exactly 5000ms. Engineers add `options single-request-reopen` to `/etc/resolv.conf`, eliminating the 5-second latency penalty.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Modern Socket Statistics (ss)\n```bash\n# List all active listening TCP and UDP sockets with Process Names and PIDs\nsudo ss -tulnp\n# Expected Output:\n# Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess\n# tcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:((\"sshd\",pid=920,fd=3))\n# tcp   LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:((\"nginx\",pid=1046,fd=6))\n# tcp   LISTEN 0      4096       127.0.0.1:5432       0.0.0.0:*    users:((\"postgres\",pid=1120,fd=7))\n\n# Check connection counts by state (e.g. ESTABLISHED, TIME-WAIT)\nss -s\n# Expected Output:\n# Total: 412\n# TCP:   28 (estab 14, closed 8, orphaned 0, timewait 6)\n```\n\n#### 2. Network Interface and Routing Diagnostics (ip)\n```bash\n# Show all IP addresses on all network interfaces\nip -br addr show\n# Expected Output:\n# lo               UNKNOWN        127.0.0.1/8 ::1/128 \n# eth0             UP             10.0.1.45/24 fe80::4001:aff:fe01:45/64 \n# docker0          DOWN           172.17.0.1/16\n\n# Display kernel routing table and default gateway\nip route show\n# Expected Output:\n# default via 10.0.1.1 dev eth0 proto dhcp src 10.0.1.45 metric 100 \n# 10.0.1.0/24 dev eth0 proto kernel scope link src 10.0.1.45 metric 100 \n# 172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown\n```\n\n#### 3. DNS Diagnostics & Query Tracing (dig)\n```bash\n# Query A-records with concise output\ndig +short devopsacademy.io\n# Expected Output:\n# 104.21.45.18\n# 172.67.180.92\n\n# Trace DNS resolution hierarchy from root nameservers down to authoritative servers\ndig +trace devopsacademy.io | head -n 12\n```\n\n#### 4. Live Packet Capture on Network Interfaces (tcpdump)\n```bash\n# Capture 5 HTTP packets on eth0 with port 80 and print headers without DNS lookups\nsudo tcpdump -i eth0 -nn -c 5 port 80\n# Expected Output:\n# 10:15:02.120340 IP 192.168.1.10.54210 > 10.0.1.45.80: Flags [S], seq 3829104, win 64240, length 0\n# 10:15:02.120410 IP 10.0.1.45.80 > 192.168.1.10.54210: Flags [S.], seq 9182301, ack 3829105, win 65160, length 0\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: \"connect: Connection refused\"\n- **Symptom:** Running `curl http://10.0.1.50:8080` returns:\n  `curl: (7) Failed to connect to 10.0.1.50 port 8080: Connection refused`\n- **Root Cause:** A TCP reset packet (`RST`) was returned by the destination host. This means the destination server is reachable on the network, but **no service is listening** on port 8080, or the service is bound strictly to `127.0.0.1` (localhost) rather than `0.0.0.0` (all interfaces).\n- **Triage & Recovery Runbook:**\n  1. On the destination host, verify if the service is running:\n     `systemctl status myapp`\n  2. Inspect socket bindings:\n     `sudo ss -tulnp | grep :8080`\n  3. If output shows `127.0.0.1:8080`, the service is inaccessible externally. Reconfigure application to listen on `0.0.0.0:8080`.\n\n#### Error 2: \"Temporary failure in name resolution\"\n- **Symptom:** Outbound requests fail with:\n  `curl: (6) Could not resolve host: api.github.com; Temporary failure in name resolution`\n- **Root Cause:** DNS misconfiguration. `/etc/resolv.conf` is missing, empty, pointing to an unresponsive upstream nameserver, or `systemd-resolved` has crashed.\n- **Triage & Recovery Runbook:**\n  1. Inspect `/etc/resolv.conf`: `cat /etc/resolv.conf`.\n  2. Check status of local resolver daemon: `systemctl status systemd-resolved`.\n  3. Test direct resolution against a known public DNS (e.g. 1.1.1.1 or 8.8.8.8):\n     `dig @1.1.1.1 api.github.com`\n  4. If public DNS works, update `/etc/resolv.conf` with valid nameservers (`nameserver 8.8.8.8`).\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: Why does netstat perform poorly on high-traffic servers compared to ss?**  \n  *A:* `netstat` reads socket data from the legacy `/proc/net/tcp` virtual pseudo-file. The kernel must serialize and construct ASCII text strings for every active socket into a buffer. If a server has 100,000 active TCP connections, this causes severe kernel lock contention and CPU spikes. `ss` (Socket Statistics) communicates with the kernel directly using binary Netlink sockets (`NETLINK_INET_DIAG`), bypassing string serialization and reading socket buffers in chunks in milliseconds.\n- **Q: What is the purpose of the TCP TIME-WAIT state and why is it dangerous to set it to 0?**  \n  *A:* When an endpoint actively closes a TCP connection, it enters the `TIME-WAIT` state for `2 * MSL` (Maximum Segment Lifetime, default 60s). This serves two purposes:\n  1. It guarantees that late, delayed duplicate packets from the closed connection traversing the internet are discarded rather than being delivered to a new connection reusing the same source IP/port tuple.\n  2. It ensures the remote peer received the final ACK.\n  If you force `TIME-WAIT` to 0, delayed packets from dead sessions can corrupt data streams on subsequent connections, or new connection attempts may be rejected with unexpected RST packets.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Audit active network sockets, inspect local DNS resolution pathways, and trace TCP handshake connections.\n\n#### Prerequisites\n- Standard Linux terminal.\n\n#### Execution Steps\n1. **Audit Open Sockets and Listening Ports:**\n   ```bash\n   sudo ss -tuln\n   ```\n   *Verification:* Locate open listening ports (typically 22 for SSH, 53 for DNS).\n\n2. **Inspect Kernel Routing Table:**\n   ```bash\n   ip route\n   ```\n   *Observation:* Identify your default gateway IP address.\n\n3. **Diagnose DNS Timing with curl:**\n   ```bash\n   curl -w \"DNS: %{time_namelookup}s | Connect: %{time_connect}s | Total: %{time_total}s\\n\" -o /dev/null -s https://devopsacademy.io\n   ```\n   *Observation:* Observe microsecond latency breakdown.\n\n#### Verification Challenge\n```bash\nip route show default >/dev/null 2>&1 && echo \"VERIFIED: Network interface routing operational\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **ss over netstat:** Always use `ss -tulnp`; netlink binary sockets are orders of magnitude faster than parsing `/proc/net/tcp`.\n- [x] **0.0.0.0 vs 127.0.0.1:** Binding to `127.0.0.1` accepts local connections only; binding to `0.0.0.0` accepts traffic from all network interfaces.\n- [x] **DNS Order:** Controlled by `/etc/nsswitch.conf`: checks `/etc/hosts` first, then upstream DNS nameservers in `/etc/resolv.conf`.\n- [x] **Connection Refused vs Timeout:** \"Connection refused\" = Host reached, but no process listening (RST); \"Timeout\" = Firewall dropped packets (SYN dropped).\n- [x] **dig +trace:** Queries root DNS down to authoritative nameservers to diagnose resolution bottlenecks.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: What does a 'Connection refused' error typically indicate when attempting an HTTP request to a remote server?**\n- [ ] A) The client network cable is disconnected\n- [x] B) The target host was reached, but no process is listening on that port (or it sent a TCP RST)\n- [ ] C) An intermediate firewall dropped the SYN packet silently\n- [ ] D) The DNS record has expired\n*Explanation:* A connection refusal indicates an active TCP RST packet was returned by the target host operating system. This proves network connectivity exists, but no daemon is listening on that port.\n\n**Quiz Q2: Which command lists all listening TCP and UDP sockets with their associated process names and PIDs?**\n- [ ] A) ip addr show\n- [x] B) sudo ss -tulnp\n- [ ] C) dig +short\n- [ ] D) traceroute\n*Explanation:* `ss -tulnp` filters TCP (`-t`), UDP (`-u`), listening (`-l`), numeric addresses (`-n`), and processes/PIDs (`-p`).\n\n**Quiz Q3: What is the risk of using legacy 'netstat' on a production server with 100,000 open connections?**\n- [ ] A) It deletes the /proc filesystem\n- [x] B) It causes high CPU spikes and lock contention by parsing /proc/net/tcp as text\n- [ ] C) It forces a system reboot\n- [ ] D) It scrambles the routing table\n*Explanation:* Legacy netstat parses `/proc/net/tcp` line by line as ASCII text, creating immense kernel serialization overhead under massive connection counts."
                  },
                  {
                        id: "linux_mod_12",
                        title: "Module 12: SSH Architecture, Cryptography, Bastions, Tunnels & Hardening",
                        duration: 45,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/hQWRp-FdTpc",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Secure Shell (SSH) is an encrypted network protocol operating at the Application Layer (default port 22) that provides secure remote command-line execution, administrative access, and encrypted tunneling over untrusted networks.\n\n#### Asymmetric Cryptography & Keypair Mechanics\nSSH authentication relies on public-key cryptography:\n- **Private Key (`id_ed25519`):** Stored strictly on the client workstation with restricted permissions (`0600` or `0400`). Must NEVER be uploaded to remote servers or committed to version control.\n- **Public Key (`id_ed25519.pub`):** Appended to the remote server's `~/.ssh/authorized_keys` file.\n- **Challenge-Response Handshake:** When authenticating:\n  1. The server generates a random cryptographic challenge string and encrypts it with the client's public key.\n  2. The client proves ownership of the private key by decrypting the challenge and signing it without ever exposing the private key over the wire.\n  3. A symmetric session key (AES-256-GCM or ChaCha20-Poly1305) is negotiated using Diffie-Hellman for high-speed encryption of the session.\n\n#### Cryptographic Key Algorithms: Ed25519 vs. RSA\n- **Ed25519 (Recommended Modern Standard):** Built on Twisted Edwards elliptic curves. Highly secure, immune to side-channel timing attacks, generates compact 256-bit keys, and processes handshakes much faster than RSA.\n- **RSA (Legacy):** Requires at least 4096-bit keys to maintain security parity with modern standards. RSA 1024-bit is broken, and 2048-bit is deprecated for long-term security.\n\n#### SSH Port Forwarding & Tunneling\nSSH provides built-in encrypted tunneling capabilities:\n1. **Local Port Forwarding (`ssh -L local_port:remote_ip:remote_port`):** Forwards a port from your client machine to a remote destination through an SSH server. Used to access remote private databases (e.g. AWS RDS in a private VPC).\n2. **Remote Port Forwarding (`ssh -R remote_port:local_ip:local_port`):** Exposes a local service running on your development laptop to a remote public server.\n3. **Dynamic Port Forwarding (`ssh -D 1080`):** Turns the SSH client into a local SOCKS5 proxy, routing browser or application traffic through the remote host.\n\n#### Bastion / Jump Host Architecture\nIn production cloud environments (AWS, GCP, Azure), worker nodes and database servers reside in private subnets with no public IPv4 addresses. Access is mediated through a hardened **Bastion Host** (Jump Box) using `ProxyJump` (`-J`).\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| PRODUCTION CLOUD BASTION (PROXYJUMP) ARCHITECTURE                        |\n|                                                                          |\n| [ DEVELOPER LAPTOP ]                                                     |\n|   Identity: ~/.ssh/id_ed25519                                            |\n|          |                                                               |\n|          | Encrypted SSH Connection (Port 22)                            |\n|          v                                                               |\n| [ PUBLIC INTERNET ]                                                      |\n|          |                                                               |\n|          v                                                               |\n| [ AWS VPC: PUBLIC SUBNET ]                                               |\n|   +--------------------------------------------------------------------+ |\n|   | BASTION JUMP HOST: 54.210.10.20 (Public IP)                        | |\n|   | Encrypted proxy channel: executes 'nc' or OpenSSH ProxyJump        | |\n|   +--------------------------------------------------------------------+ |\n|          |                                                               |\n|          | Internal Private VPC Routing (10.0.x.x)                       |\n|          v                                                               |\n| [ AWS VPC: PRIVATE ISOLATED SUBNET (No Public Internet Access) ]         |\n|   +---------------------------+       +--------------------------------+ |\n|   | K8s Worker Node           |       | PostgreSQL RDS Database        | |\n|   | Private IP: 10.0.2.14     |       | Private IP: 10.0.3.50:5432     | |\n|   +---------------------------+       +--------------------------------+ |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Streamlined Team SSH Config (~/.ssh/config)\nInstead of forcing engineers to remember complex commands like `ssh -i ~/.ssh/corp.pem -J ubuntu@bastion.corp.com ubuntu@10.0.2.14`, engineers configure client profiles in `~/.ssh/config`:\n```text\nHost bastion\n    HostName bastion.corp.com\n    User ec2-user\n    IdentityFile ~/.ssh/id_ed25519\n\nHost prod-k8s-*\n    User ubuntu\n    IdentityFile ~/.ssh/id_ed25519\n    ProxyJump bastion\n    StrictHostKeyChecking accept-new\n    ServerAliveInterval 30\n    ServerAliveCountMax 3\n\nHost prod-db-tunnel\n    HostName 10.0.3.50\n    User ubuntu\n    ProxyJump bastion\n    LocalForward 5433 localhost:5432\n```\nNow, connecting to the private Kubernetes cluster node is as simple as:\n`ssh prod-k8s-01`\n\n#### Enterprise Use Case 2: Server sshd_config Hardening Runbook\nProduction Linux servers must be hardened against brute-force attacks and credential theft. Edit `/etc/ssh/sshd_config.d/99-hardening.conf`:\n```text\n# Disable password authentication; enforce cryptographic keys only\nPasswordAuthentication no\nChallengeResponseAuthentication no\n\n# Disable direct root login\nPermitRootLogin no\n\n# Disable empty passwords\nPermitEmptyPasswords no\n\n# Limit authentication attempts before drop\nMaxAuthTries 3\n\n# Disable legacy and weak ciphers\nKexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512\nCiphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com\nMACs hmac-sha2-512-etm@openssh.com\n```\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Generating High-Security Ed25519 Keypairs\n```bash\n# Generate modern Ed25519 keypair with custom label\nssh-keygen -t ed25519 -a 100 -C \"jatin@devopsacademy.io\" -f ~/.ssh/id_ed25519\n# Expected Output:\n# Generating public/private ed25519 key pair.\n# Enter passphrase (empty for no passphrase): \n# Your identification has been saved in /home/user/.ssh/id_ed25519\n# Your public key has been saved in /home/user/.ssh/id_ed25519.pub\n# The key's randomart image is:\n# +--[ED25519 256]--+\n# | .o.oo.          |\n# | ..+.oo          |\n# |  o.B+ .         |\n# | o.*+o+          |\n# | =+o+oS.         |\n# +----[SHA256]-----+\n```\n\n#### 2. Copying Public Keys to Remote Hosts\n```bash\n# Install public key into remote user's authorized_keys file\nssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@10.0.1.50\n# Expected Output:\n# Number of key(s) added: 1\n# Now try logging into the machine, with:   \"ssh 'ubuntu@10.0.1.50'\"\n```\n\n#### 3. Establishing Local SSH Tunnels (Port Forwarding)\n```bash\n# Forward remote PostgreSQL (5432) to local port 5433 in background\nssh -L 5433:localhost:5432 -N -f ubuntu@bastion.corp.com\n# Test connection locally\npg_isready -h localhost -p 5433\n# Expected Output:\n# localhost:5433 - accepting connections\n```\n\n#### 4. Validating Daemon Syntax Before Reloading\n```bash\n# Test sshd configuration syntax without restarting daemon\nsudo sshd -t\n# If valid: returns exit code 0 with NO output.\n\n# Reload SSH daemon\nsudo systemctl reload sshd\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: \"Host key verification failed\" (Man-In-The-Middle Warning)\n- **Symptom:** Connecting via SSH fails with a massive warning:\n  `@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`\n  `@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @`\n  `IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!`\n  `Host key verification failed.`\n- **Root Cause:** The remote server's SSH public host key stored in your client's `~/.ssh/known_hosts` does not match the key presented by the server. This happens legitimately when a cloud instance has been reprovisioned or re-installed under the same IP address.\n- **Triage & Recovery Runbook:**\n  1. If you know the instance was legitimately recreated, remove the stale host key:\n     `ssh-keygen -R 10.0.1.50`\n  2. Reconnect and verify the server's fingerprint:\n     `ssh ubuntu@10.0.1.50`\n\n#### Error 2: \"Permission denied (publickey)\"\n- **Symptom:** Connecting with `ssh -i key.pem user@host` prints:\n  `user@host: Permission denied (publickey).`\n- **Root Cause:** \n  1. The public key is missing from the remote host's `~/.ssh/authorized_keys`.\n  2. Permissions on the remote server's `~/.ssh` directory or `authorized_keys` file are too permissive. By default, OpenSSH enforces `StrictModes yes`: if `~/.ssh` is writable by group or world (`chmod 777`), SSH refuses to read the authorized_keys file.\n- **Triage & Recovery Runbook:**\n  1. Connect via cloud serial console or alternative admin account.\n  2. Fix permissions on remote host:\n     `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`\n     `chown -R user:user ~/.ssh`\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: Why is Agent Forwarding (ssh -A) considered a security risk, and what is the preferred alternative?**  \n  *A:* SSH Agent Forwarding (`ssh -A`) forwards your local authentication socket to the remote host. If the bastion server is compromised, a root attacker on the bastion can hijack your forwarded socket to authenticate to other internal servers as you. The secure, modern alternative is `ProxyJump` (`-J` / `ProxyCommand`), which creates an end-to-end encrypted TCP stream through the bastion without exposing the SSH agent socket or private credentials to the intermediate jump host.\n- **Q: What is the operational danger of restarting sshd after changing configuration?**  \n  *A:* If you edit `/etc/ssh/sshd_config` with a typo or invalid cipher and run `systemctl restart sshd`, the daemon will fail to start. If your active SSH session disconnects, you will be permanently locked out of the server. Production protocol requires:\n  1. Run `sudo sshd -t` to validate syntax.\n  2. Run `sudo systemctl reload sshd` (reload preserves existing connections).\n  3. Open a *new, separate* terminal window to test logging in before ever closing your active session.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Generate an Ed25519 keypair, configure client profiles in `~/.ssh/config`, and simulate an encrypted local port forward tunnel.\n\n#### Prerequisites\n- Linux terminal access.\n\n#### Execution Steps\n1. **Generate an Ed25519 Keypair:**\n   ```bash\n   ssh-keygen -t ed25519 -N \"\" -f /tmp/lab_id_ed25519\n   ls -l /tmp/lab_id_ed25519*\n   ```\n\n2. **Configure Client SSH Profile:**\n   ```bash\n   mkdir -p ~/.ssh && chmod 700 ~/.ssh\n   cat << 'EOF' >> ~/.ssh/config\n   Host lab-host\n       HostName localhost\n       User root\n       IdentityFile /tmp/lab_id_ed25519\n       Port 22\n   EOF\n   chmod 600 ~/.ssh/config\n   ```\n\n3. **Validate SSH Daemon Configuration:**\n   ```bash\n   sudo sshd -t && echo \"PASSED: sshd configuration syntax valid\"\n   ```\n\n#### Verification Challenge\n```bash\ntest -f /tmp/lab_id_ed25519 && test -f /tmp/lab_id_ed25519.pub && echo \"VERIFIED: Cryptographic Ed25519 keypair operational\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **Ed25519 Standard:** Modern standard; 256-bit elliptic-curve keys provide superior speed and security over 2048-bit RSA.\n- [x] **Strict Permissions:** Private keys must be `0600`; remote `~/.ssh` must be `0700`; remote `authorized_keys` must be `0600`.\n- [x] **Hardening:** Always disable `PasswordAuthentication` and `PermitRootLogin` in production.\n- [x] **ProxyJump over -A:** Use `ProxyJump` for bastion transit instead of dangerous SSH agent forwarding (`-A`).\n- [x] **Safe Validation:** Always run `sudo sshd -t` before reloading the SSH daemon.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: Why is Ed25519 preferred over RSA for new SSH key generation?**\n- [ ] A) Ed25519 keys require no passphrase\n- [x] B) Ed25519 offers faster cryptographic operations, smaller key sizes (256-bit), and resilience against side-channel attacks\n- [ ] C) RSA has been completely cracked by quantum computers\n- [ ] D) Ed25519 works without an SSH client\n*Explanation:* Ed25519 leverages Edwards-curve Digital Signature Algorithm (EdDSA), providing equivalent or superior security to 4096-bit RSA with a tiny 256-bit key length and high resistance to side-channel timing attacks.\n\n**Quiz Q2: What security vulnerability is introduced when using SSH Agent Forwarding (ssh -A) through a shared bastion host?**\n- [ ] A) It disables firewall packet filtering\n- [x] B) Root administrators on the bastion can hijack the forwarded authentication socket to access private servers\n- [ ] C) It changes the remote user password\n- [ ] D) It opens port 80 to the public\n*Explanation:* Agent forwarding opens a Unix domain socket on the remote machine. Anyone with root access on that machine can hijack that socket to authenticate to other servers using your local credentials.\n\n**Quiz Q3: What command tests the syntax of /etc/ssh/sshd_config without restarting the daemon?**\n- [ ] A) sshd --check\n- [x] B) sudo sshd -t\n- [ ] C) systemctl verify sshd\n- [ ] D) ssh-keygen -t\n*Explanation:* `sshd -t` (Test mode) inspects configuration files for syntax errors and exits cleanly without modifying the running daemon."
                  },
                  {
                        id: "linux_mod_13",
                        title: "Module 13: System Performance Monitoring, USE Method & Kernel Tuning (OOM, sysctl)",
                        duration: 55,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/S43v_zB1U08",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Performance engineering and system triage in Linux requires structured methodologies rather than random command guessing. The primary enterprise standard is Brendan Gregg's **USE Method**: for every resource (CPU, Memory, Storage I/O, Network), check **Utilization** (percentage of time busy), **Saturation** (queue length / waiting tasks), and **Errors**.\n\n#### CPU Load Average Under the Hood\nThe three numbers reported by `uptime` (1, 5, and 15-minute load averages) represent the average number of processes in the system run queue:\n- **Active Tasks:** Threads currently running on CPU cores (`R` state) + threads waiting in the CFS run-queue.\n- **Uninterruptible Sleep Tasks:** Threads waiting for disk or NFS I/O (`D` state).\n- **Rule of Thumb:** Compare load average against the total number of CPU cores (`nproc` or `lscpu`):\n  - On an 8-core machine, a Load Average of `8.0` means the CPUs are at 100% capacity with zero queue.\n  - A Load Average of `16.0` means the system is 200% saturated: 8 processes are executing, and an average of 8 other processes are waiting in line for CPU or disk time.\n\n#### Memory Architecture: \"Free RAM is Wasted RAM\"\nLinux uses an aggressive page caching architecture:\n- **Used Memory:** Memory actively consumed by process heaps, stacks, and anonymous memory.\n- **Buff/Cache:** Memory utilized by the kernel Page Cache to store disk blocks and filesystem inodes. Because reading from RAM is 1,000x faster than NVMe SSDs, Linux allocates all unused RAM to cache recently accessed files.\n- **Available Memory:** The metric that actually matters! The amount of memory estimated to be available for starting new applications without swapping, calculated by adding free memory and reclaimable page caches.\n\n#### The Linux Out-Of-Memory (OOM) Killer\nWhen physical RAM and swap space are completely exhausted, the Linux kernel invokes the **OOM Killer** (`mm/oom_kill.c`):\n- The kernel computes an `oom_score` (0 to 1000) for every process based on the percentage of RAM consumed.\n- The process with the highest score is abruptly terminated with a kernel signal to save the operating system from crashing.\n- Administrators can protect critical daemons (like `sshd` or `dockerd`) by setting `oom_score_adj=-1000` in their systemd units.\n\n#### Runtime Kernel Tuning via sysctl\nThe Linux kernel exposes hundreds of runtime parameters under `/proc/sys/`, managed persistently via `/etc/sysctl.conf` and `/etc/sysctl.d/*.conf`:\n- `vm.swappiness` (0-100): Determines how aggressively the kernel evicts anonymous application pages to swap space vs. page cache (recommended: 1-10 for database servers).\n- `fs.file-max`: Maximum open file descriptor allocations system-wide.\n- `net.core.somaxconn`: Maximum TCP listen socket backlog queue (essential for high-traffic Nginx/HAProxy servers).\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| THE USE METHOD PERFORMANCE TRIAGE MAP                                    |\n|                                                                          |\n| RESOURCE   | UTILIZATION (%)           | SATURATION (QUEUE) | ERRORS     |\n| -----------+---------------------------+--------------------+----------- |\n| CPU        | top / mpstat (%usr, %sys) | uptime / vmstat (r)| dmesg (MCE)|\n| MEMORY     | free -h (used vs avail)   | vmstat (si / so)   | OOM Killer |\n| STORAGE    | iostat -xz (%util)        | iostat (aqu-sz, wa)| dmesg (I/O)|\n| NETWORK    | sar -n DEV (rxkB/s, txkB) | tc / ifconfig drop | netstat -s |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Diagnosing High Load Average with 2% CPU Utilization\nA production incident alerts: \"Server Load Average is 24 on a 4-core node!\"\nThe on-call engineer checks `top` and sees: `%Cpu(s): 1.8 us, 0.4 sy, 97.2 wa`.\n- CPU utilization is near zero, but `%wa` (I/O Wait) is 97%!\n- The engineer checks `vmstat 1 5`: the `b` column (blocked processes in `D` state) shows 22 tasks.\n- The engineer runs `iostat -xz 1 3`: NVMe drive `/dev/nvme1n1` shows `%util: 100%` and `await: 450ms`.\n- **Diagnosis:** A rogue backup script is dumping uncompressed raw database tables to disk, saturating the storage controller queue and stalling all application threads in uninterruptible sleep.\n\n#### Enterprise Use Case 2: Tuning Web Servers for 100,000 Concurrent Connections\nAn API gateway under high load drops new TCP connections with `Connection reset by peer`.\nEngineers tune the kernel TCP backlog and file descriptor ceilings via `/etc/sysctl.d/99-highperf.conf`:\n```ini\n# Increase system-wide open file limits\nfs.file-max = 2097152\n\n# Increase TCP listen backlog queue from default 128 to 65535\nnet.core.somaxconn = 65535\nnet.ipv4.tcp_max_syn_backlog = 65535\n\n# Enable TCP BBR congestion control algorithm\nnet.core.default_qdisc = fq\nnet.ipv4.tcp_congestion_control = bbr\n\n# Reduce swap aggression on memory-constrained nodes\nvm.swappiness = 10\n```\nApply with: `sudo sysctl --system`.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Real-Time Memory Telemetry\n```bash\n# Display memory in human units with wide output\nfree -h --wide\n# Expected Output:\n#                total        used        free      shared     buffers       cache   available\n# Mem:            15Gi       4.2Gi       1.8Gi       120Mi       450Mi       8.8Gi        10Gi\n# Swap:          4.0Gi       120Mi       3.8Gi\n```\n\n#### 2. Virtual Memory & Run-Queue Telemetry (vmstat)\n```bash\n# Sample virtual memory statistics every 1s for 3 counts\nvmstat 1 3\n# Expected Output:\n# procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n#  r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n#  2  0 122880 1887436 460800 9227468    0    0    12    45  120  450  8  2 90  0  0\n#  1  0 122880 1887436 460800 9227468    0    0     0     0  890 1240 14  4 82  0  0\n#  0  0 122880 1887436 460800 9227468    0    0     0    12  640  980  6  1 93  0  0\n# Keys to watch:\n# r = Runnable tasks waiting for CPU\n# b = Blocked tasks waiting for I/O\n# si / so = Swap in / Swap out (if > 0, system is actively thrashing swap!)\n# wa = CPU percentage waiting on I/O\n```\n\n#### 3. Storage I/O Device Saturation (iostat)\n```bash\n# Inspect disk utilization and queue depth\niostat -xz 1 2\n# Expected Output:\n# Device            r/s     w/s     rkB/s     wkB/s  rrqm/s  wrqm/s  %rrqm  %wrqm  r_await  w_await aqu-sz  %util\n# nvme0n1         14.00  120.00    450.00   2400.00    0.00    8.00   0.00   6.25     0.45     1.20   0.05   4.80\n```\n\n#### 4. Auditing OOM Killer Events in Kernel Messages\n```bash\n# Search kernel buffer for processes murdered by the OOM killer\nsudo dmesg -T | grep -E -i \"killed process|out of memory\"\n# Expected Output:\n# [Wed Oct 14 06:14:22 2026] Out of memory: Killed process 3841 (node) total-vm:4194304kB, anon-rss:3670016kB\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: System Freezes and Thrashes (Swap Storm)\n- **Symptom:** Server becomes totally unresponsive over SSH. Commands take 30 seconds to type. `vmstat` shows `si` (swap-in) and `so` (swap-out) continuously at thousands of blocks per second.\n- **Root Cause:** Memory exhaustion coupled with aggressive swap usage. Applications demand more RAM than physical capacity; the kernel constantly evicts pages to slow NVMe/SATA swap and reads them back in an endless I/O loop (Thrashing).\n- **Triage & Recovery Runbook:**\n  1. Identify the memory hog: `ps aux --sort=-%mem | head -n 5`.\n  2. Terminate the memory-leaking process: `kill -15 <PID>`.\n  3. Reduce kernel swappiness: `sudo sysctl -w vm.swappiness=1`.\n  4. Once stable, consider provisioning larger RAM instances or setting memory ceilings in container cgroups.\n\n#### Error 2: \"Too many open files\" (EMFILE)\n- **Symptom:** Microservices fail to accept new client connections, printing:\n  `Error: accept: Too many open files`\n- **Root Cause:** The process has exceeded its allocated maximum open file descriptors (`ulimit -n` / `RLIMIT_NOFILE`). Sockets, files, and pipes all consume file descriptors.\n- **Triage & Recovery Runbook:**\n  1. Inspect current system limit for the running process:\n     `cat /proc/<PID>/limits | grep \"Max open files\"`\n  2. Increase the limit in the systemd service unit:\n     `LimitNOFILE=65535`\n  3. Apply globally in `/etc/security/limits.conf`:\n     `* soft nofile 65535`\n     `* hard nofile 65535`\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: What is the difference between 'free' and 'available' memory in free -h?**  \n  *A:* `free` represents raw, untouched memory that has literally zero data inside it. `available` is the actual estimate of how much RAM can be allocated to applications without causing swapping. It includes `free` RAM plus memory currently used by the kernel Page Cache and buffer cache that can be reclaimed instantaneously upon request. Always monitor `available`, not `free`.\n- **Q: How does the kernel OOM killer calculate which process to terminate?**  \n  *A:* The kernel calculates an `oom_score` (0-1000) for every process. The base score is proportional to the percentage of total RAM the process consumes. The kernel adds or subtracts the process's `oom_score_adj` (-1000 to +1000) set by administrators. Processes running as root or with low runtimes have slight deductions. The process with the highest resulting score is sent `SIGKILL`. Setting `oom_score_adj=-1000` completely immunizes critical processes (e.g., `sshd`) from being chosen by the OOM killer.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Audit system resource utilization using the USE method, check kernel sysctl parameters, and simulate memory allocation telemetry.\n\n#### Prerequisites\n- Linux terminal access.\n\n#### Execution Steps\n1. **Audit Memory Utilization vs Available Cache:**\n   ```bash\n   free -h\n   cat /proc/meminfo | grep -E \"MemTotal|MemAvailable|Cached|Dirty\"\n   ```\n\n2. **Run a 5-Second System Activity Snapshot:**\n   ```bash\n   vmstat 1 5\n   ```\n   *Observation:* Verify `si` and `so` columns remain 0.\n\n3. **Inspect Kernel Network Tuning Parameters:**\n   ```bash\n   sysctl net.core.somaxconn\n   sysctl vm.swappiness\n   ```\n\n#### Verification Challenge\n```bash\ntest -f /proc/sys/vm/swappiness && echo \"VERIFIED: Kernel telemetry interfaces operational\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **USE Method:** Always evaluate Utilization, Saturation, and Errors across CPU, Memory, Disk, and Network.\n- [x] **Load Average:** Represents active CPU runnable tasks + tasks waiting on uninterruptible disk I/O (`D` state).\n- [x] **Page Cache:** Free memory is used automatically for page caching; monitor \"available\" memory in `free -h`.\n- [x] **OOM Killer:** Evaluates `oom_score`; kill immunization achieved via `oom_score_adj=-1000`.\n- [x] **File Descriptors:** Override process file descriptor limits using `LimitNOFILE=65535` in systemd units.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: On a Linux server with 4 CPU cores, what does a sustained 1-minute Load Average of 12.0 indicate?**\n- [ ] A) The server is idle\n- [x] B) The system is 300% saturated: 4 processes are executing while an average of 8 processes are queued waiting for CPU or disk I/O\n- [ ] C) 12% of the RAM is in use\n- [ ] D) 12 network packets were dropped\n*Explanation:* On 4 CPU cores, a load of 4.0 represents 100% saturation. A load of 12.0 means the workload demands 3x the available compute capacity, leaving an average of 8 tasks waiting in the run queue.\n\n**Quiz Q2: In 'free -h', which metric accurately reflects the memory available to launch new applications without forcing swapping?**\n- [ ] A) free\n- [ ] B) shared\n- [x] C) available\n- [ ] D) buffers\n*Explanation:* `available` calculates raw free memory plus reclaimable page cache and buffers that the kernel can instantaneously free up for new applications.\n\n**Quiz Q3: What kernel parameter controls how aggressively Linux swaps memory pages out of RAM into swap space?**\n- [ ] A) net.ipv4.ip_forward\n- [ ] B) fs.file-max\n- [x] C) vm.swappiness\n- [ ] D) kernel.pid_max\n*Explanation:* `vm.swappiness` (0-100) dictates kernel bias between reclaiming page cache vs. swapping anonymous application memory."
                  },
                  {
                        id: "linux_mod_14",
                        title: "Module 14: Linux Security, Hardening, Firewalls (UFW / iptables) & MAC (SELinux / AppArmor)",
                        duration: 50,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/f9-iYQ25K-g",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Linux security implements a defense-in-depth model combining network packet filtering (firewalls via Netfilter), Discretionary Access Control (file permissions), and Mandatory Access Control (MAC frameworks like SELinux and AppArmor) to protect systems against zero-day exploits and privilege escalation.\n\n#### Netfilter, iptables & nftables\nThe Linux kernel filters network packets using the **Netfilter** framework hooks:\n1. **The Core Tables:**\n   - `filter`: Default table for packet filtering (ACCEPT, DROP, REJECT).\n   - `nat`: Network Address Translation (port forwarding, MASQUERADE for container egress).\n   - `mangle`: Packet header modification (TTL, QoS marks).\n2. **Standard Chains:**\n   - `INPUT`: Packets destined for local sockets running on this host.\n   - `OUTPUT`: Packets generated locally by applications on this host.\n   - `FORWARD`: Packets traversing this host destined for another host/container (essential for Docker and Kubernetes).\n   - `PREROUTING` / `POSTROUTING`: Network address translation before/after routing decisions.\n3. **Firewall Frontends:**\n   - `UFW` (Uncomplicated Firewall): User-friendly frontend standard on Ubuntu/Debian.\n   - `firewalld`: Zone-based dynamic firewall standard on RHEL/CentOS.\n   - `nftables`: The modern high-performance kernel replacement for legacy iptables syntax.\n\n#### Mandatory Access Control (MAC): SELinux vs. AppArmor\nIn standard POSIX permissions (DAC), the root user has unrestricted power, and file owners can grant permissions to anyone. If an application (like Nginx) running as root is compromised via an exploit, the attacker gains full control of the server.\n**MAC frameworks prevent this by enforcing kernel-level security labels:**\n- **SELinux (Security-Enhanced Linux - RHEL / CentOS / Rocky):**\n  - Labels every file, process, port, and socket with a security context (`user:role:type:level`).\n  - Example: An Nginx process labeled with type `httpd_t` is permitted by the kernel to access only files labeled `httpd_sys_content_t`. Even if an attacker achieves a root shell through Nginx, the kernel blocks them from reading `/etc/shadow` because `httpd_t` has no SELinux rule to read `shadow_t`.\n  - Three Operational Modes:\n    - `Enforcing`: Security policies are strictly enforced and violations are blocked.\n    - `Permissive`: Policies are not enforced, but violations are logged to audit logs (used for debugging).\n    - `Disabled`: SELinux is completely inactive.\n- **AppArmor (Ubuntu / Debian):**\n  - Path-based security profile framework. Less complex than SELinux, using configuration profiles in `/etc/apparmor.d/` to restrict individual binaries to specific filesystem paths.\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| NETFILTER PACKET TRAVERSAL & SELINUX MAC VERIFICATION FLOW               |\n|                                                                          |\n| 1. [ INCOMING NETWORK PACKET FROM NIC ]                                  |\n|         |                                                                |\n|         v                                                                |\n| 2. [ Netfilter PREROUTING Chain (DNAT) ]                                 |\n|         |                                                                |\n|         v                                                                |\n| 3. [ Routing Decision: Destined for local host or forwarding? ]          |\n|         |                                                                |\n|         +---> (Forwarding) ----> [ FORWARD Chain ] ---> [ Out to K8s Pod]|\n|         |                                                                |\n|         v (Local Host)                                                   |\n| 4. [ Netfilter INPUT Chain (UFW / iptables) ]                            |\n|         | Allowed by rule?                                               |\n|         +---> NO  ----> [ DROP / REJECT ]                                |\n|         |                                                                |\n|         v YES                                                            |\n| 5. [ Kernel Socket -> User-Space Application (Nginx) ]                   |\n|         |                                                                |\n|         v Nginx requests read() on /data/web/index.html                  |\n| 6. [ POSIX DAC Permission Check (0644 owner:group) ]                     |\n|         |                                                                |\n|         v Passed DAC?                                                    |\n| 7. [ SELinux MAC Security Check ]                                        |\n|         | Does process type 'httpd_t' have policy for 'httpd_sys_content_t'?|\n|         +---> NO  ----> [ EACCES (Permission Denied) + AVC Audit Log ]   |\n|         |                                                                |\n|         v YES                                                            |\n| 8. [ Kernel reads data block and returns to application ]                |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Hardened Production Firewall Rules with UFW\nOn a public cloud instance hosting an API microservice:\n1. Block all unsolicited inbound traffic by default.\n2. Allow all outbound traffic.\n3. Permit SSH (port 22) restricted strictly to the corporate VPN CIDR.\n4. Open public ports 80 and 443.\n```bash\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow from 198.51.100.0/24 to any port 22 proto tcp\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw enable\n```\n\n#### Enterprise Use Case 2: Resolving SELinux Permission Denials in Production\nA web server on RHEL fails to serve files from a custom storage mount `/data/www/html`, returning `403 Forbidden`, even after the engineer ran `chmod 777`.\n- **Root Cause:** SELinux context mismatch. The files were created with default type `default_t`. Nginx (`httpd_t`) is forbidden from reading `default_t`.\n- **Triage & Fix:**\n  1. Inspect SELinux security context: `ls -Z /data/www/html`.\n  2. Check audit logs for Access Vector Cache (AVC) denials:\n     `sudo ausearch -m avc -ts recent`\n  3. Relabel the directory permanently:\n     `sudo semanage fcontext -a -t httpd_sys_content_t \"/data/www/html(/.*)?\"`\n     `sudo restorecon -Rv /data/www/html`\n  Files are immediately accessible without compromising OS security.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. UFW Firewall Management (Ubuntu/Debian)\n```bash\n# Enable UFW and verify active rules with line numbers\nsudo ufw status numbered\n# Expected Output:\n# Status: active\n#\n#      To                         Action      From\n#      --                         ------      ----\n# [ 1] 22/tcp                     ALLOW IN    198.51.100.0/24\n# [ 2] 80/tcp                     ALLOW IN    Anywhere\n# [ 3] 443/tcp                    ALLOW IN    Anywhere\n```\n\n#### 2. Raw iptables Inspection\n```bash\n# View active filter table rules with packet and byte counters\nsudo iptables -L -v -n\n# Expected Output:\n# Chain INPUT (policy DROP 120 packets, 5760 bytes)\n#  pkts bytes target     prot opt in     out     source               destination         \n#  1420  180K ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           \n#  9820 4500K ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            ctstate RELATED,ESTABLISHED\n#   124  7440 ACCEPT     tcp  --  eth0   *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22\n```\n\n#### 3. SELinux Status and Context Inspection (RHEL)\n```bash\n# Check current SELinux operational mode\ngetenforce\n# Expected Output: Enforcing\n\n# Inspect detailed SELinux status and policy version\nsestatus\n# Expected Output:\n# SELinux status:                 enabled\n# SELinuxfs mount:                /sys/fs/selinux\n# SELinux root directory:         /etc/selinux\n# Loaded policy name:             targeted\n# Current mode:                   enforcing\n# Mode from config file:          enforcing\n\n# View process and file security contexts\nls -Z /var/www/html/index.html\n# Expected Output:\n# system_u:object_r:httpd_sys_content_t:s0 /var/www/html/index.html\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: \"SELinux is preventing nginx from httpd_sys_content_t access\" (AVC Denial)\n- **Symptom:** Web server returns `403 Forbidden`. Nginx error log reports:\n  `stat() \"/var/www/app/index.html\" failed (13: Permission denied)` despite `chmod 755`.\n- **Root Cause:** SELinux policy violation logged by the kernel's Access Vector Cache (AVC).\n- **Triage & Recovery Runbook:**\n  1. Temporarily switch to Permissive mode to test: `sudo setenforce 0`. If the page immediately loads, SELinux is confirmed as the cause.\n  2. Switch back to Enforcing mode: `sudo setenforce 1`.\n  3. Query the audit log using `audit2why`:\n     `sudo ausearch -m avc -ts recent | audit2why`\n  4. Restore the standard policy context:\n     `sudo restorecon -Rv /var/www/app`\n\n#### Error 2: Accidental SSH Lockout After Enabling Firewall\n- **Symptom:** Running `ufw enable` immediately drops the active terminal and refuses all new SSH connections.\n- **Root Cause:** Setting the default incoming policy to DENY before explicitly permitting port 22.\n- **Triage & Recovery Runbook:**\n  1. Always add the SSH rule BEFORE enabling:\n     `sudo ufw allow 22/tcp && sudo ufw enable`\n  2. If locked out on cloud instances, use cloud provider Serial Console or Web Web-based terminal to run:\n     `sudo ufw allow 22/tcp` or `sudo ufw disable`.\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: What is the architectural difference between 'Permissive' mode and 'Disabled' in SELinux?**  \n  *A:* In `Permissive` mode, the SELinux engine is fully loaded in the kernel and continuously evaluates every system call against security policies. It logs every policy violation to the audit log (`/var/log/audit/audit.log`), but allows the operation to proceed without blocking it. In `Disabled` mode, SELinux is completely unloaded from the kernel; no checks occur, and newly created files are written without security context labels. **Crucial warning:** If a system runs in Disabled mode for weeks and is switched back to Enforcing, it will fail to boot because thousands of files will lack labels. The entire filesystem must be relabeled (`touch /.autorelabel && reboot`).\n- **Q: How does Docker container networking interact with iptables?**  \n  *A:* Docker manipulates Netfilter iptables rules directly by inserting custom chains (`DOCKER`, `DOCKER-USER`, `DOCKER-ISOLATION`). When you expose a port with `-p 8080:80`, Docker creates a DNAT (Destination NAT) rule in the `PREROUTING` chain of the `nat` table to forward traffic from host port 8080 to the container IP. **Security warning:** Because Docker injects rules ahead of standard UFW chains, published Docker ports bypass UFW rules by default unless custom rules are added to the `DOCKER-USER` chain.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Inspect active firewall rules, audit Netfilter state, and check system Mandatory Access Control frameworks.\n\n#### Prerequisites\n- Linux terminal with `sudo` access.\n\n#### Execution Steps\n1. **Audit Active Netfilter Filter Chains:**\n   ```bash\n   sudo iptables -L -n | head -n 15\n   ```\n\n2. **Inspect UFW or Firewalld Status:**\n   ```bash\n   sudo ufw status || sudo firewall-cmd --state || echo \"No frontend firewall active\"\n   ```\n\n3. **Check Mandatory Access Control Framework:**\n   ```bash\n   if command -v getenforce >/dev/null 2>&1; then\n     getenforce\n   elif command -v aa-status >/dev/null 2>&1; then\n     sudo aa-status\n   fi\n   ```\n\n#### Verification Challenge\n```bash\nsudo iptables -L INPUT >/dev/null 2>&1 && echo \"VERIFIED: Netfilter packet filtering subsystem accessible\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **Netfilter Chains:** `INPUT` for local host, `OUTPUT` for local traffic out, `FORWARD` for container/routing traffic.\n- [x] **Default Deny:** Always configure default deny on incoming traffic (`ufw default deny incoming`).\n- [x] **SELinux Modes:** Enforcing (blocks & logs), Permissive (logs only), Disabled (inactive).\n- [x] **restorecon:** Restores default SELinux file contexts from policy definitions.\n- [x] **Docker & iptables:** Docker bypasses standard UFW rules by inserting rules directly into the `PREROUTING` NAT chain.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: In iptables / Netfilter, which chain handles packets traversing the host to reach a Docker container or Kubernetes pod?**\n- [ ] A) INPUT\n- [ ] B) OUTPUT\n- [x] C) FORWARD\n- [ ] D) POSTROUTING\n*Explanation:* The `FORWARD` chain handles packets routed through the Linux host to another network destination, which is the foundational mechanism of container bridge networking.\n\n**Quiz Q2: What command temporarily switches SELinux from Enforcing to Permissive mode without requiring a system reboot?**\n- [ ] A) systemctl stop selinux\n- [x] B) sudo setenforce 0\n- [ ] C) ufw disable\n- [ ] D) chmod 777 /sys/fs/selinux\n*Explanation:* `setenforce 0` temporarily switches SELinux to Permissive mode for testing. `setenforce 1` switches back to Enforcing.\n\n**Quiz Q3: If an Nginx server on RHEL returns 403 Forbidden despite having 777 file permissions, what tool diagnoses whether SELinux blocked the read request?**\n- [ ] A) ping\n- [x] B) sudo ausearch -m avc -ts recent (or audit2why)\n- [ ] C) netstat -tulnp\n- [ ] D) uptime\n*Explanation:* When SELinux blocks an operation, the kernel's Access Vector Cache logs an `AVC` denial message to `/var/log/audit/audit.log`, queried using `ausearch -m avc` or analyzed using `audit2why`."
                  },
                  {
                        id: "linux_mod_15",
                        title: "Module 15: Cron Scheduling, Systemd Timers & Automated Backup Engineering",
                        duration: 50,
                        type: "video",
                        youtubeUrl: "https://www.youtube.com/embed/QZJ1drMQz1A",
                        content: "### 📖 1. Theory & Core Concepts\n**Definition:** Scheduled background job execution in Linux automates routine maintenance, telemetry collection, security audits, database backups, and log rotation. Modern Linux provides two primary scheduling frameworks: traditional **Cron** and modern **Systemd Timers**.\n\n#### 1. The Cron Daemon (crond / cron)\nCron is a time-based daemon that executes scheduled commands at specified intervals.\n- **Crontab 5-Field Schedule Syntax:**\n  ```text\n  *    *    *    *    *    command to execute\n  ┬    ┬    ┬    ┬    ┬\n  │    │    │    │    │\n  │    │    │    │    └───── Day of Week (0 - 7, where 0 and 7 are Sunday)\n  │    │    │    └────────── Month of Year (1 - 12)\n  │    │    └─────────────── Day of Month (1 - 31)\n  │    └──────────────────── Hour of Day (0 - 23, in 24-hr format)\n  └───────────────────────── Minute of Hour (0 - 59)\n  ```\n- **Special Operators:**\n  - `*`: Every unit (e.g. `* * * * *` runs every minute).\n  - `,`: Value list (e.g. `0 8,12,18 * * *` runs at 8am, 12pm, 6pm).\n  - `-`: Range (e.g. `0 9-17 * * 1-5` runs hourly during weekday business hours).\n  - `/`: Step values (e.g. `*/15 * * * *` runs every 15 minutes).\n- **Crontab File Hierarchy:**\n  - `crontab -e`: Edits user-specific crontab files stored in `/var/spool/cron/crontabs/`.\n  - `/etc/crontab`: System-wide crontab with an explicit `user` field.\n  - `/etc/cron.{hourly,daily,weekly,monthly}/`: Predefined drop-in directories for executable shell scripts.\n\n#### 2. Systemd Timers (Modern Enterprise Alternative)\nSystemd timers (`.timer` units) supersede cron in modern enterprise architectures.\n- **Paired Architecture:** Every timer unit requires a matching `.service` unit with the same base name (e.g., `backup.timer` triggers `backup.service`).\n- **Major Advantages over Cron:**\n  - **Catch-up on missed runs (`Persistent=true`):** If a server is powered off or rebooted during a scheduled backup, systemd timer executes the missed job immediately upon reboot. Cron simply skips it.\n  - **Unified Logging:** Timer execution logs are captured directly in `journalctl`.\n  - **Dependency Tracking:** Can wait for network availability or filesystem mounts before firing.\n  - **Resource Sandboxing:** Can enforce memory/CPU limits on background jobs via cgroups.\n\n#### 3. Log Rotation with logrotate\nUnchecked log growth is the #1 cause of production disk-full outages. `logrotate` runs daily via cron/systemd, parsing rules in `/etc/logrotate.d/*` to compress, rotate, and purge aged logs.\n\n### 🏢 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| ENTERPRISE SCHEDULED MAINTENANCE & BACKUP PIPELINE ARCHITECTURE          |\n|                                                                          |\n| [ SYSTEMD TIMER: db-backup.timer (OnCalendar=*-*-* 02:00:00) ]           |\n|         |                                                                |\n|         | Fires trigger at 02:00 AM UTC                                  |\n|         v                                                                |\n| [ SYSTEMD SERVICE: db-backup.service ]                                   |\n|         | Executed under unprivileged user 'backupuser'                  |\n|         | Resource limits: MemoryMax=2G, CPUWeight=100                   |\n|         v                                                                |\n| [ EXECUTION SCRIPT: /opt/scripts/backup-database.sh ]                    |\n|         ├── Step 1: Dump database via pg_dump stream to gzip             |\n|         ├── Step 2: Calculate SHA-256 checksum                           |\n|         ├── Step 3: Encrypt with GPG symmetric key                       |\n|         ├── Step 4: Upload to AWS S3 Glacier Vault                       |\n|         └── Step 5: Prune local dumps older than 14 days                 |\n|         |                                                                |\n|         v                                                                |\n| [ TELEMETRY & LOGGING: journalctl -u db-backup.service ]                 |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: Deploying an Idempotent Systemd Timer\nTo replace brittle crontabs for a mission-critical backup:\n1. Define the service in `/etc/systemd/system/db-backup.service`:\n   ```ini\n   [Unit]\n   Description=Nightly PostgreSQL Database Backup\n   After=postgresql.service\n\n   [Service]\n   Type=oneshot\n   User=postgres\n   ExecStart=/opt/scripts/backup-database.sh\n   ```\n2. Define the timer in `/etc/systemd/system/db-backup.timer`:\n   ```ini\n   [Unit]\n   Description=Trigger Nightly PostgreSQL Backup\n   Requires=db-backup.service\n\n   [Timer]\n   OnCalendar=*-*-* 02:00:00\n   RandomizedDelaySec=300\n   Persistent=true\n\n   [Install]\n   WantedBy=timers.target\n   ```\n3. Enable and activate:\n   `sudo systemctl daemon-reload && sudo systemctl enable --now db-backup.timer`\n\n#### Enterprise Use Case 2: Configuring Production Logrotate for Nginx\nTo prevent Nginx access logs from consuming 50GB:\nEdit `/etc/logrotate.d/nginx`:\n```text\n/var/log/nginx/*.log {\n    daily\n    missingok\n    rotate 14\n    compress\n    delaycompress\n    notifempty\n    create 0640 www-data adm\n    sharedscripts\n    postrotate\n        [ -f /var/run/nginx.pid ] && kill -USR1 $(cat /var/run/nginx.pid)\n    endscript\n}\n```\n- `daily`: Rotates every 24 hours.\n- `rotate 14`: Keeps 14 days of history before deleting oldest.\n- `compress`: Gzip compresses rotated logs.\n- `kill -USR1`: Tells Nginx to reopen log file descriptors gracefully without dropping connections.\n\n### 💻 3. Important Commands & Expected Outputs\n\n#### 1. Managing Crontabs\n```bash\n# List scheduled cron jobs for active user\ncrontab -l\n# Expected Output:\n# # m h  dom mon dow   command\n# 0 2 * * * /opt/scripts/db_backup.sh >> /var/log/backup.log 2>&1\n# */15 * * * * /usr/local/bin/healthcheck.sh\n\n# List cron jobs for a specific user as root\nsudo crontab -u postgres -l\n```\n\n#### 2. Inspecting Systemd Timers\n```bash\n# List all active systemd timers across the system\nsystemctl list-timers --all\n# Expected Output:\n# NEXT                        LEFT          LAST                         PASSED       UNIT                         ACTIVATES\n# Wed 2026-10-14 16:00:00 UTC 42min left    Wed 2026-10-14 15:00:01 UTC  17min ago    sysstat-collect.timer        sysstat-collect.service\n# Thu 2026-10-15 00:00:00 UTC 8h left       Wed 2026-10-14 00:00:10 UTC  15h ago      logrotate.timer              logrotate.service\n# Thu 2026-10-15 02:00:00 UTC 10h left      Wed 2026-10-14 02:00:12 UTC  13h ago      db-backup.timer              db-backup.service\n```\n\n#### 3. Testing and Debugging Logrotate\n```bash\n# Run logrotate in debug mode (shows actions without modifying files)\nsudo logrotate -d /etc/logrotate.d/nginx\n# Expected Output:\n# reading config file /etc/logrotate.d/nginx\n# Reading state from file: /var/lib/logrotate/status\n# Allocating hash table for state file, size 64 entries\n# Considering log /var/log/nginx/access.log\n#   log does not need rotating (log has been rotated today)\n```\n\n### 🎯 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: Cron Job Fails Silently with \"Command not found\"\n- **Symptom:** A script runs perfectly when executed in an interactive terminal, but fails or does nothing when executed by cron.\n- **Root Cause:** Stripped PATH environment. Cron executes jobs in an empty, minimal environment with a default `PATH=/usr/bin:/bin`. Custom binaries in `/usr/local/bin`, `/opt/bin`, or pyenv/node paths are not in cron's PATH.\n- **Triage & Recovery Runbook:**\n  1. Always use **absolute paths** for every command inside cron scripts (`/usr/bin/docker`, `/usr/local/bin/aws`).\n  2. Declare explicit PATH at the top of the crontab:\n     `PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`\n  3. Always redirect standard output and standard error:\n     `0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1`\n\n#### Error 2: Disk Fills Up Because Log File Was Deleted with \"rm\" Instead of Truncation\n- **Symptom:** An engineer deletes `/var/log/app.log` using `rm`. `df -h` still reports 100% disk usage.\n- **Root Cause:** The application is still running with an open write file descriptor to the deleted inode.\n- **Triage & Recovery Runbook:**\n  1. Never delete active log files with `rm`.\n  2. Safely truncate the active file in-place without releasing the file descriptor:\n     `sudo truncate -s 0 /var/log/app.log`\n     or:\n     `sudo : > /var/log/app.log`\n  3. Ensure logrotate is configured with `copytruncate` or sends a reload signal to the daemon.\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: Why are Systemd Timers superior to Crontab in production infrastructure?**  \n  *A:* Systemd timers provide:\n  1. **Persistent Execution (`Persistent=true`):** Ensures missed backup jobs run immediately upon system boot if the machine was offline or rebooting at the scheduled time.\n  2. **Unified Observability:** Logs are streamed directly into `journalctl` with full timestamps and exit status, eliminating unmonitored local cron email queues.\n  3. **Execution State Inspection:** `systemctl list-timers` provides an instantaneous view of exact upcoming run schedules and elapsed times.\n  4. **Fine-grained Resource Isolation:** Jobs can be throttled with cgroups (`MemoryMax=`, `CPUQuota=`) so background backup tasks never starve production microservices of compute capacity.\n- **Q: What does the 'copytruncate' directive do in logrotate and what is the trade-off?**  \n  *A:* Standard log rotation renames the active file (`app.log` -> `app.log.1`) and prompts the daemon (via `USR1` signal) to reopen its log file descriptor. If an application (like certain Java or Node.js services) does not support reopening logs on signal, `copytruncate` makes a copy of the active log file and then truncates the original file to 0 bytes in-place using `truncate()`. The trade-off is a tiny race condition: any log messages written by the application in the microsecond between copying and truncating will be lost.\n\n### 🛠️ 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Author a crontab entry, create a custom systemd timer with persistent catch-up, and inspect timer triggers.\n\n#### Prerequisites\n- Linux terminal access with `sudo`.\n\n#### Execution Steps\n1. **Create an Automated Telemetry Script:**\n   ```bash\n   sudo mkdir -p /opt/telemetry\n   cat << 'EOF' | sudo tee /opt/telemetry/record_disk.sh\n   #!/bin/bash\n   echo \"[$(date)] Disk Usage: $(df -h / | awk 'NR==2 {print $5}')\" >> /tmp/disk_monitor.log\n   EOF\n   sudo chmod +x /opt/telemetry/record_disk.sh\n   ```\n\n2. **Create the Systemd Service Unit:**\n   ```bash\n   cat << 'EOF' | sudo tee /etc/systemd/system/disk-monitor.service\n   [Unit]\n   Description=Record Disk Usage Telemetry\n\n   [Service]\n   Type=oneshot\n   ExecStart=/opt/telemetry/record_disk.sh\n   EOF\n   ```\n\n3. **Create the Matching Systemd Timer Unit:**\n   ```bash\n   cat << 'EOF' | sudo tee /etc/systemd/system/disk-monitor.timer\n   [Unit]\n   Description=Run Disk Usage Telemetry Every 10 Minutes\n   Requires=disk-monitor.service\n\n   [Timer]\n   OnBootSec=1min\n   OnUnitActiveSec=10min\n   Persistent=true\n\n   [Install]\n   WantedBy=timers.target\n   EOF\n   ```\n\n4. **Enable and Verify Timer:**\n   ```bash\n   sudo systemctl daemon-reload\n   sudo systemctl enable --now disk-monitor.timer\n   systemctl list-timers disk-monitor.timer\n   ```\n\n#### Verification Challenge\n```bash\nsystemctl is-active --quiet disk-monitor.timer && echo \"VERIFIED: Production systemd timer schedule active\"\n```\n\n### 📝 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **Cron 5 Fields:** Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), Day of Week (0-7).\n- [x] **Redirect Output:** Always append `>> /path/to.log 2>&1` to crontab lines to prevent silent failures.\n- [x] **Systemd Timers:** Offer `Persistent=true`, unified journald logging, and cgroup resource limits.\n- [x] **Safe Log Truncation:** Use `truncate -s 0 file` rather than `rm file` to free disk space from active running processes.\n- [x] **logrotate:** Prevents disk full crashes by compressing and rotating logs with `rotate` and `compress`.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: What does the crontab schedule '*/15 * * * *' specify?**\n- [ ] A) Run once a day at 15:00\n- [x] B) Run every 15 minutes\n- [ ] C) Run on the 15th of every month\n- [ ] D) Run 15 times per second\n*Explanation:* The step operator `*/15` in the first (minute) field directs cron to execute the job every 15 minutes (`:00`, `:15`, `:30`, `:45`).\n\n**Quiz Q2: What major advantage does a Systemd Timer have over a traditional Crontab job?**\n- [ ] A) Systemd timers run without a kernel\n- [x] B) Systemd timers support 'Persistent=true' to execute missed runs after system reboots, and integrate with journald logging\n- [ ] C) Systemd timers require no configuration files\n- [ ] D) Crontab cannot execute shell scripts\n*Explanation:* The `Persistent=true` setting guarantees that if the server was offline when a scheduled job was supposed to fire, the timer will execute the job immediately upon reboot.\n\n**Quiz Q3: What is the safest command to immediately reclaim disk space from a 10GB active log file without restarting the application?**\n- [ ] A) rm -f /var/log/app.log\n- [ ] B) mv /var/log/app.log /tmp/\n- [x] C) truncate -s 0 /var/log/app.log (or : > /var/log/app.log)\n- [ ] D) killall kernel\n*Explanation:* `truncate -s 0` shrinks the file to zero bytes in-place without releasing or changing the active file descriptor held by the running application, immediately freeing disk space."
                  }
            ]
      },
      {
            id: "sec_linux_04",
            title: "Section 4: Enterprise Production Troubleshooting & Disaster Recovery (Module 16)",
            lessons: [
                  {
                        id: "linux_mod_16",
                        title: "Module 16: Enterprise Production Troubleshooting, Incident Triage & Emergency Runbooks",
                        duration: 60,
                        type: "video",
                        preview: true,
                        youtubeUrl: "https://www.youtube.com/embed/mzmqwtR8w-Q",
                        content: "### \ud83d\udcd6 1. Theory & Core Concepts\n**Definition:** Enterprise Production Troubleshooting in Linux DevOps & Site Reliability Engineering (SRE) is the systematic, hypothesis-driven methodology of diagnosing, isolating, mitigating, and documenting hardware, kernel, operating system, and network-level anomalies under active service-level degradation (SLO breach) or catastrophic infrastructure failure.\n\n#### The SRE Incident Triage Framework\nWhen a production outage strikes at 3:00 AM, guessing commands at random leads to catastrophic errors. DevOps engineers follow a rigorous 5-phase incident protocol:\n1. **Detection & Severity Triage (P1 vs P2):** Identify the blast radius and service impact against Service Level Indicators (SLIs) like HTTP 5xx rates, p99 latency, or queue backpressure.\n2. **Containment (Stop the Bleeding):** Implement rapid mitigation before diagnosing root causes\u2014diverting ingress traffic via DNS/load-balancer health checks, restarting unhealthy container pods, rolling back the most recent release commit, or expanding auto-scaling capacity.\n3. **Telemetry & Artifact Collection (The Observer Effect):** Gather live diagnostic telemetry *before* restarting daemons or rebooting nodes. Avoid invasive debuggers that lock threads or generate massive memory dumps that can push a saturated node into a complete crash.\n4. **Root Cause Analysis (RCA):** Isolate the deterministic failure path through the kernel, storage block device, network socket, or user-space daemon layers.\n5. **Remediation & Blameless Post-Mortem:** Execute permanent architectural repairs, update automated runbooks, and codify automated canary verifications to prevent recurrence.\n\n#### Critical Kernel & OS Failure Modes Under the Hood\n1. **Kernel Panics (`panic.c`):**\n   - **Mechanism:** Triggered when the kernel encounters an unrecoverable hardware exception or fatal internal software condition (`BUG()`, `panic()`). The CPU halts execution, the kernel ring buffer logs the stack trace, and the system freezes or reboots if `kernel.panic` sysctl is configured.\n   - **Common Root Causes:** ECC memory bus errors, corrupted kernel page tables, driver null-pointer dereferences, missing storage drivers in `initramfs`, or hardware MCE (Machine Check Exceptions).\n2. **Read-Only Root Filesystem Remount (`errors=remount-ro`):**\n   - **Mechanism:** Filesystems like ext4 and XFS are mounted with `errors=remount-ro` by default in `/etc/fstab`. If an underlying storage controller (NVMe, EBS, SAN) experiences I/O timeouts, metadata corruptions, or bad sectors, the kernel immediately locks the filesystem into read-only mode to prevent catastrophic corruption of remaining inodes.\n   - **Impact:** All write system calls (`write()`, `mkdir()`, `open(O_WRONLY)`) immediately fail with `EROFS` (Read-only file system), causing databases and loggers to crash instantly.\n3. **The Uninterruptible Sleep (`D` State) Disaster:**\n   - **Mechanism:** When a thread transitions into kernel space to execute synchronous device hardware I/O (e.g. disk write flush, NFS RPC request, or NVMe DMA transfer), the scheduler places it in `TASK_UNINTERRUPTIBLE` (`D` state).\n   - **Crucial Rule:** The kernel completely suppresses all POSIX signal delivery to processes in `D` state\u2014even unconditional `kill -9` (`SIGKILL`) is ignored. If the storage device stalls, hundreds of worker processes pile up in `D` state, driving Linux system load average to 100+ while CPU utilization drops to near zero.\n4. **Socket Exhaustion & TCP Queue Dropping:**\n   - **Mechanism:** High-concurrency reverse proxies (Nginx, Envoy) create thousands of outbound connections to upstream microservices. When the ephemeral port range (`net.ipv4.ip_local_port_range`) is exhausted, or the listen backlog queue (`net.core.somaxconn`) overflows, the kernel silently drops SYN packets or issues `TCP RST` packets.\n5. **Out-of-Memory (OOM) Killer Cascades:**\n   - **Mechanism:** When total physical RAM and swap space are exhausted, the kernel invokes `out_of_memory()`. It computes the badness score (`oom_score`) of every process based on resident set size (`anon-rss`) and terminates the highest-scoring process with `SIGKILL`. If an unmonitored Java or Node.js microservice leaks memory, the OOM killer may repeatedly terminate it, causing an infinite crash loop.\n\n### \ud83c\udfe2 2. Architecture & Real-World Use Cases\n```text\n+--------------------------------------------------------------------------+\n| ENTERPRISE PRODUCTION INCIDENT TRIAGE & ROOT CAUSE ISOLATION MATRIX       |\n|                                                                          |\n| 1. [ ALERT TRIGGERED: High Latency / Service Unavailable / 5xx Spikes ]  |\n|         |                                                                |\n|         +---> Check Load Average vs CPU Cores (uptime / lscpu)           |\n|                 |                                                        |\n|                 +---> Load Avg >> Cores AND %CPU is Low:                 |\n|                 |     Storage I/O Bottleneck or 'D' State Processes      |\n|                 |     --> Run: vmstat 1 3 (check 'b' & 'wa' columns)     |\n|                 |     --> Run: iostat -xz 1 2 (check %util, await)       |\n|                 |     --> Run: cat /proc/<PID>/stack (identify wait)     |\n|                 |                                                        |\n|                 +---> Load Avg >> Cores AND %CPU is High (us / sy):      |\n|                 |     Compute Starvation or Runaway Spinlock Loop        |\n|                 |     --> Run: top -b -n 1 -o %CPU                       |\n|                 |     --> Run: perf top (profile hotspot syscalls)       |\n|                 |                                                        |\n|                 +---> Memory Depletion / High Swap Activity:             |\n|                 |     --> Run: free -h --wide (check 'available' RAM)    |\n|                 |     --> Run: dmesg -T | grep -i oom (check OOM kills)  |\n|                 |     --> Run: cat /proc/meminfo | grep Dirty            |\n|                 |                                                        |\n|                 +---> Network / Socket Dropping:                         |\n|                 |     --> Run: ss -s (check timewait & allocated sockets)|\n|                 |     --> Run: netstat -s | grep -i listen (overflows)   |\n|                 |     --> Run: dmesg -T | grep -i \"nf_conntrack: full\"  |\n|                 |                                                        |\n|                 +---> Filesystem / Inode Exhaustion:                     |\n|                       --> Run: df -hT (check block disk capacity)        |\n|                       --> Run: df -i (check inode table exhaustion)      |\n|                       --> Run: lsof +L1 (find deleted open ghost files)  |\n+--------------------------------------------------------------------------+\n```\n\n#### Enterprise Use Case 1: P1 Incident Runbook: Root Filesystem Remounted Read-Only\n- **Scenario:** During peak e-commerce sales, an AWS EC2 instance running PostgreSQL suddenly alerts with database write failures. Logs display: `FATAL: could not open file \"base/16384/2659\": Read-only file system`.\n- **Root Cause:** A transient EBS volume I/O timeout exceeded the kernel storage driver threshold. The ext4 filesystem safety mechanism immediately demoted the mount from `rw` to `ro` to prevent corrupting database table pages.\n- **Triage & Recovery Runbook:**\n  1. Inspect kernel ring buffer: `sudo dmesg -T | grep -E -i \"ext4|journal|error|read-only|abort\"`. Identify the timestamp of the I/O abort.\n  2. Test storage controller responsiveness: `sudo hdparm -I /dev/nvme0n1` or inspect AWS EBS CloudWatch volume burst balance.\n  3. Attempt live remount to restore writes:\n     `sudo mount -o remount,rw /`\n  4. If the remount succeeds without error, immediately check active table integrity:\n     `pg_isready && sudo journalctl -k -f`\n  5. Schedule off-peak maintenance window to run offline filesystem consistency checks (`e2fsck -f /dev/nvme0n1p1`).\n\n#### Enterprise Use Case 2: P1 Incident Runbook: Boot Failure & Kernel Panic Recovery\n- **Scenario:** After an automated kernel security update via Ansible across 200 nodes, several servers fail to boot, presenting the serial console error:\n  `Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)`.\n- **Root Cause:** The `update-initramfs` hook ran out of `/boot` disk space during package installation, leaving a zero-byte truncated Initial RAM Disk (`initrd.img`). The kernel booted, but lacked the storage driver modules needed to initialize the root partition.\n- **Triage & Recovery Runbook:**\n  1. Attach cloud rescue ISO or select \\\"Advanced options for Ubuntu\\\" in the GRUB bootloader menu to boot from the previous stable kernel.\n  2. If system boots into emergency rescue mode, enter root shell.\n  3. Free space in `/boot` by purging aged, unused kernel headers and images:\n     `sudo apt-get purge -y linux-image-5.15.0-88-generic`\n  4. Rebuild the corrupted initramfs for all installed kernels:\n     `sudo update-initramfs -u -k all`\n  5. Synchronize GRUB boot records: `sudo update-grub`.\n  6. Reboot node cleanly: `sudo reboot`.\n\n### \ud83d\udcbb 3. Important Commands & Expected Outputs\n\n#### 1. System Crisis Emergency Snapshot One-Liner\n```bash\n# Capture instant holistic system health telemetry in a single pipeline\necho \"=== CRISIS REPORT: $(hostname) $(date) ===\" && \\\nuptime && free -h --wide && df -h / && df -i / && \\\necho \"--- Top CPU Consumers ---\" && ps -eo pid,ppid,%cpu,%mem,stat,comm --sort=-%cpu | head -n 6 && \\\necho \"--- Uninterruptible 'D' State Processes ---\" && ps -eo pid,stat,time,comm | awk '$2 ~ /D/'\n# Expected Output:\n# === CRISIS REPORT: devops-prod-api01 Mon Oct 19 14:15:00 UTC 2026 ===\n#  14:15:00 up 45 days,  2:10,  2 users,  load average: 3.12, 2.45, 1.80\n#                total        used        free      shared     buffers       cache   available\n# Mem:            31Gi       12Gi       8.2Gi       420Mi       1.1Gi        10Gi        18Gi\n# Swap:          8.0Gi       140Mi       7.8Gi\n# Filesystem      Size  Used Avail Use% Mounted on\n# /dev/nvme0n1p1   98G   44G   50G  47% /\n# Filesystem      Inodes  IUsed   IFree IUse% Mounted on\n# /dev/nvme0n1p1 6553600 482100 6071500    8% /\n# --- Top CPU Consumers ---\n#   PID  PPID %CPU %MEM STAT COMMAND\n#  8492     1 34.2  8.1 S    node\n#  8493     1 32.1  7.9 S    node\n# --- Uninterruptible 'D' State Processes ---\n#   PID STAT     TIME COMMAND\n#  9120 D    00:01:24 rsync\n```\n\n#### 2. Deep Kernel Stack Tracing for Hung 'D' State Tasks\n```bash\n# Inspect the exact kernel function where a stuck process is blocked\nsudo cat /proc/9120/stack\n# Expected Output:\n# [<0>] io_schedule+0x62/0xa0\n# [<0>] wait_on_page_bit_common+0x140/0x2c0\n# [<0>] __filemap_fdatawait_range+0xbb/0x100\n# [<0>] filemap_write_and_wait_range+0x68/0x90\n# [<0>] ext4_sync_file+0x12a/0x3c0\n# [<0>] vfs_fsync_range+0x42/0x80\n# [<0>] do_fsync+0x38/0x70\n# [<0>] __x64_sys_fsync+0x14/0x20\n# [<0>] x64_sys_call+0x17c0/0x2090\n# [<0>] do_syscall_64+0x7b/0x150\n# [<0>] entry_SYSCALL_64_after_hwframe+0x76/0x7e\n# Explanation: Thread is stuck inside ext4_sync_file calling fsync, blocked on storage I/O flush.\n```\n\n#### 3. Diagnosing Socket & Epoll Exhaustion\n```bash\n# Query active socket allocations and TCP state counters\nss -s\n# Expected Output:\n# Total: 1840\n# TCP:   1420 (estab 840, closed 210, orphaned 12, timewait 180)\n#\n# Transport Total     IP        IPv6\n# RAW\t      1         1         0\n# UDP\t      14        10        4\n# TCP\t      1210      980       230\n# INET\t      1225      991       234\n# FRAG\t      0         0         0\n\n# Check kernel network buffer memory consumption\ncat /proc/net/sockstat\n# Expected Output:\n# sockets: used 1840\n# TCP: inuse 840 orphan 12 tw 180 alloc 1024 mem 84\n```\n\n#### 4. Filesystem Superblock Recovery with e2fsck\n```bash\n# Locate redundant backup superblocks on an ext4 partition\nsudo mke2fs -n /dev/sdb1 | grep -A 2 \"Superblock backups\"\n# Expected Output:\n# Superblock backups stored on blocks:\n#   32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632\n\n# Restore corrupted filesystem using alternative superblock 32768\nsudo e2fsck -b 32768 -y /dev/sdb1\n# Expected Output:\n# e2fsck 1.46.5 (30-Dec-2021)\n# /dev/sdb1 was not cleanly unmounted, check forced.\n# Pass 1: Checking inodes, blocks, and sizes\n# Pass 2: Checking directory structure\n# Pass 3: Checking directory connectivity\n# Pass 4: Checking reference counts\n# Pass 5: Checking group summary information\n# /dev/sdb1: 142/6553600 files (0.0% non-contiguous), 89410/26214400 blocks\n```\n\n#### 5. Diagnosing Storage Degradation & Media Faults\n```bash\n# Inspect kernel SCSI/NVMe hardware timeouts and reset events\nsudo dmesg -T --level=err,crit,alert | grep -E -i \"nvme|scsi|ata|io error|blocked\" | tail -n 5\n# Expected Output:\n# [Mon Oct 19 09:20:11 2026] nvme nvme0: I/O 458 QID 4 timeout, completion polled\n# [Mon Oct 19 09:20:15 2026] nvme nvme0: aborting controller command\n# [Mon Oct 19 09:20:18 2026] Buffer I/O error on dev nvme0n1p1, logical block 1048576, lost async page write\n```\n\n### \ud83c\udfaf 4. Common Errors & Incident Troubleshooting\n\n#### Error 1: System Boot Locked in Emergency Mode via /etc/fstab Typo\n- **Symptom:** Server reboot fails and locks console in:\n  `You are in emergency mode. Cannot open access to console, the root account is locked. Press Enter to continue.`\n- **Root Cause:** A newly mounted external volume was entered in `/etc/fstab` with a typo or missing drive. By default, systemd treats any failed fstab mount as a critical boot blocker.\n- **Triage & Recovery Runbook:**\n  1. Boot from live rescue environment or add `systemd.unit=rescue.target` to GRUB kernel parameters.\n  2. Remount root filesystem as read-write:\n     `mount -o remount,rw /`\n  3. Validate fstab syntax: `findmnt --verify`\n  4. Comment out the bad line or append the `nofail` mount option:\n     `UUID=3a8b... /mnt/data ext4 defaults,nofail 0 2`\n  5. Test all mounts safely without rebooting: `mount -a`\n  6. Reboot: `systemctl reboot`.\n\n#### Error 2: \"bash: fork: Cannot allocate memory\" (PID / Thread Starvation)\n- **Symptom:** Every terminal command fails instantly:\n  `bash: fork: Cannot allocate memory` or `fork: Resource temporarily unavailable`, even though `free -h` shows plenty of RAM.\n- **Root Cause:** The system has exhausted the maximum allowed Process IDs (`/proc/sys/kernel/pid_max`) or the user's thread limit (`nproc`), typically caused by a runaway microservice thread leak or container fork bomb.\n- **Triage & Recovery Runbook:**\n  1. Check max PID limit: `cat /proc/sys/kernel/pid_max`\n  2. Inspect total active tasks: `ps -eLf | wc -l`\n  3. Temporarily raise the system-wide PID ceiling:\n     `sudo sysctl -w kernel.pid_max=4194304`\n  4. Identify the runaway process spawning thousands of threads:\n     `ps -eo pid,nlwp,cmd --sort=-nlwp | head -n 10`\n  5. Terminate the offending parent PID: `kill -15 <PID>` (or `kill -9 <PID>` if unresponsive).\n  6. Enforce container process limits in Docker/K8s (`pids-limit` / `pids.max`).\n\n#### Senior DevOps Technical Interview Scenarios\n- **Q: An API server has an I/O wait of 98%, Load Average of 65 on 4 cores, and requests are timing out. How do you triage this without rebooting?**  \n  *A:* First, run `vmstat 1 3` to verify that the `b` (blocked tasks) and `wa` (I/O wait) columns are saturated. Second, run `iostat -xz 1 2` to identify which specific block device (e.g. `/dev/nvme1n1`) has 100% `%util` and high `await` latency. Third, run `iotop -oP` or `pidstat -d 1` to find the exact Process ID generating massive read/write throughput. Fourth, inspect what the process is doing via `lsof -p <PID>` and `cat /proc/<PID>/stack`. If it is a rogue unthrottled backup or ad-hoc query, apply I/O priority throttling (`ionice -c 3 -p <PID>`) or gracefully terminate it (`kill -15 <PID>`) to restore system responsiveness.\n- **Q: What is the danger of running 'fsck' on a live, mounted filesystem?**  \n  *A:* `fsck` assumes it has exclusive, direct access to the raw disk blocks. If a filesystem is mounted read-write, the kernel's Page Cache and filesystem drivers are simultaneously modifying directory b-trees, inode tables, and free block allocation bitmaps. Running `fsck` on a mounted read-write partition will almost certainly cause permanent, unrecoverable data corruption. To safely repair a filesystem, it must either be completely unmounted (`umount /dev/sdb1`), or for the root filesystem, remounted as read-only (`mount -o remount,ro /`) or scheduled to check on next boot (`tune2fs -C 1 /dev/sda1` or booting a rescue live image).\n\n### \ud83d\udee0\ufe0f 5. Step-by-Step Hands-on Lab\n**Lab Objective:** Diagnose a simulated storage leak with unlinked ghost files, inspect kernel stack traces of sleeping processes, and verify system recovery.\n\n#### Prerequisites\n- Linux terminal with `sudo` access.\n\n#### Execution Steps\n1. **Simulate a Production Unlinked File Storage Leak:**\n   ```bash\n   # Create a background process holding an unlinked 200MB file open\n   python3 -c '\n   import time, os\n   f = open(\"/tmp/ghost_storage.bin\", \"wb\")\n   f.write(b\"\\0\" * (200 * 1024 * 1024))\n   f.flush()\n   os.unlink(\"/tmp/ghost_storage.bin\")\n   print(\"Ghost file unlinked from directory entry. PID:\", os.getpid())\n   time.sleep(300)\n   ' &\n   GHOST_PID=$!\n   echo \"Spawned Ghost Process PID: $GHOST_PID\"\n   ```\n\n2. **Verify That Ghost File Consumes Space But Does Not Appear in 'ls':**\n   ```bash\n   ls -lh /tmp/ghost_storage.bin 2>/dev/null || echo \"File not visible via ls!\"\n   df -h /tmp\n   ```\n\n3. **Locate the Open Unlinked File with lsof:**\n   ```bash\n   sudo lsof +L1 /tmp | grep ghost\n   ```\n   *Verification:* Output will display the PID and marked `(deleted)` status.\n\n4. **Inspect the Process's Kernel Stack and Descriptors:**\n   ```bash\n   sudo cat /proc/$GHOST_PID/stack\n   ls -l /proc/$GHOST_PID/fd\n   ```\n\n5. **Reclaim Disk Space Gracefully:**\n   ```bash\n   kill -15 $GHOST_PID\n   wait $GHOST_PID 2>/dev/null || true\n   df -h /tmp\n   ```\n   *Observation:* Disk space is immediately reclaimed upon process termination.\n\n#### Verification Challenge\nExecute the following verification script:\n```bash\n! pgrep -f ghost_storage.bin >/dev/null 2>&1 && echo \"VERIFIED: Leaked ghost storage reclaimed cleanly\"\n```\n\n### \ud83d\udcdd 6. Revision Notes & Topic Quiz\n\n#### High-Yield Revision Checklist\n- [x] **Incident Priority:** Always contain blast radius (traffic shedding, pod failover) before diagnosing root cause.\n- [x] **D State Tasks:** Uninterruptible sleep waiting on hardware/NFS I/O; immune to `kill -9`; inspect via `/proc/<PID>/stack`.\n- [x] **Read-Only Root Remount:** Triggered by storage timeouts and `errors=remount-ro`; recover live via `mount -o remount,rw /`.\n- [x] **Never fsck Mounted RW:** Running `fsck` on a read-write mounted filesystem causes catastrophic data corruption.\n- [x] **Ghost Storage:** Deleted files held open by processes consume disk blocks until closed; identify using `lsof +L1`.\n\n#### Topic Self-Assessment Quiz\n\n**Quiz Q1: Why does a Linux process in the 'D' (Uninterruptible Sleep) state fail to terminate even after running 'kill -9 <PID>'?**\n- [ ] A) The process belongs to an administrative root user\n- [x] B) The thread is executing inside a kernel driver waiting for hardware I/O; the kernel blocks signal delivery to prevent data corruption\n- [ ] C) The system clock skew corrupted signal handlers\n- [ ] D) The PID number is reserved by systemd\n*Explanation:* The `D` state is specifically designed for kernel device drivers performing synchronous hardware operations (disk DMA, NFS locks). The kernel intentionally suppresses all signal handling\u2014including SIGKILL\u2014to ensure hardware registers and filesystem metadata are not left in an inconsistent state.\n\n**Quiz Q2: If 'df -h' reports a mounted ext4 filesystem is 99% full, but running 'du -sh /*' only accounts for 30GB of a 100GB disk, what is the most likely cause?**\n- [ ] A) The Linux kernel Page Cache has saturated physical memory\n- [x] B) Large log or data files were deleted with 'rm', but running processes still hold open file descriptors to those inodes\n- [ ] C) The system clock was adjusted backwards by NTP\n- [ ] D) An unauthorized SSH user created hidden directories\n*Explanation:* In Unix filesystems, unlinking a file with `rm` removes its dentry, but the inode and data blocks are only freed after all processes close their file descriptors. Running `lsof +L1` reveals these deleted yet active files.\n\n**Quiz Q3: What is the safest course of action when an ext4 filesystem reports metadata corruption on a production server?**\n- [ ] A) Run 'fsck -y' immediately while the application is actively writing to the partition\n- [ ] B) Reformat the disk with 'mkfs.ext4 -F'\n- [x] C) Unmount the filesystem (or remount as read-only) before executing 'e2fsck' with backup superblocks if needed\n- [ ] D) Delete the /dev device file\n*Explanation:* Executing `fsck` against an active read-write filesystem guarantees data corruption because the kernel cache and `fsck` will write conflicting changes. The filesystem must always be unmounted or remounted read-only first."
                  }
            ]
      }
]
    },
  {
    id: "course_git_001",
    slug: "git-github-mastery",
    title: "Git & GitHub for DevOps Teams",
    shortDescription: "Master version control, internal Git object architecture, branching strategies, rebase, bisect, reflog, GitOps, and GitHub Actions CI/CD workflows.",
    description: "A complete, hands-on Git & GitHub masterclass for DevOps engineers and SREs. Covers Git's internal graph model, object storage (.git directory), interactive rebasing, emergency reflog recovery, advanced branching (Trunk-Based & GitFlow), secret scanning hooks, Git LFS, monorepo management, and automated GitOps integration.",
    category: "Git",
    level: "beginner",
    price: 0,
    isPro: false,
    isFeatured: false,
    rating: 4.8,
    totalRatings: 1920,
    totalStudents: 14200,
    totalLessons: 10,
    durationHours: 15,
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer",
    thumbnail: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=600",
    icon: React.createElement(SiGit),
    color: "from-red-500 to-orange-500",
    tags: ["Git", "GitHub", "Version Control", "GitFlow", "Trunk-Based", "GitOps", "GitHub Actions", "Git Hooks"],
    whatYouLearn: [
      "Understand Git's internal content-addressable storage (.git object database)",
      "Master the 3-tree architecture (Working Dir, Index/Staging, Repository)",
      "Resolve complex merge conflicts and perform zero-downtime branch updates",
      "Execute interactive rebasing, squashing, cherry-picking, and commit rewording",
      "Recover deleted branches, lost commits, and corrupt refs using git reflog",
      "Automate regression debugging using git bisect binary search",
      "Implement Trunk-Based Development and GitFlow branching strategies",
      "Enforce pre-commit hooks, secret scanning, and GPG commit signing",
      "Manage large binary assets with Git LFS and enterprise monorepos",
      "Build production CI/CD workflows using GitHub Actions and GitOps triggers",
    ],
    requirements: ["Basic command line knowledge"],
    updatedAt: "2026-09-21",
    sections: [
      {
        id: "sec_git_01",
        title: "Section 1: Core Fundamentals & Mechanics (Modules 1-4)",
        lessons: [
          {
            id: "git_mod_01",
            title: "Module 1: Git Architecture, Content-Addressable Storage & Object Storage",
            duration: 45,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/P6jD966JZlk",
            content: `### 📖 1. Theory
Git is a distributed, content-addressable version control system built on a Directed Acyclic Graph (DAG) of immutable objects:
- **Object Store (\`.git/objects/\`):** 
  - **Blob:** Stores file payload content without filename or metadata.
  - **Tree:** Represents a directory structure mapping file names, permissions, and blob/tree SHA hashes.
  - **Commit:** Points to a top-level Tree, parent commit SHA(s), author/committer timestamps, and commit log message.
  - **Annotated Tag:** Points to a specific commit object with tagger identity, cryptographic signature, and message.
- **Content Hashing:** Every object is compressed via zlib and identified by its SHA-1 or SHA-256 hash derived from header plus content.
- **Reference Management (\`.git/refs/\`):** Pointers to commit hashes (e.g. \`refs/heads/main\`, \`refs/tags/v1.0.0\`, \`HEAD\` pointer).

### 🏢 2. Real-World DevOps Examples
- **Auditing Infrastructure Code Integrity:** Understanding how Git SHA hashes guarantee that immutable Terraform files deployed via CI/CD have not been tampered with or corrupted in transit.
- **Optimizing Large Repositories:** Analyzing why storing binary builds directly in Git causes repository bloat due to loose blob creation, justifying the implementation of artifact registries.

### 💻 3. Practical Commands
\`\`\`bash
# Inspect the raw type and content of any Git object hash
git cat-file -t <hash>
git cat-file -p <hash>

# View internal structure of the current repository
ls -la .git/
cat .git/HEAD

# Compress loose objects and consolidate into packfiles
git gc --prune=now
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does Git differ from traditional VCS like SVN?**  
  *A:* SVN is centralized and tracks file delta differences over time. Git is distributed (every developer has a full repository clone) and captures immutable snapshot trees of the entire repository at each commit.
- **Q: What happens internally when you create a new commit?**  
  *A:* Git creates Blobs for modified files, creates a Tree object representing the root directory index, creates a Commit object pointing to that root Tree and parent Commit, and updates the active branch ref pointer in \`.git/refs/heads/\`.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Inspect raw Git objects using plumbing commands.
2. **Steps:**
   - Initialize a bare directory: \`mkdir git-internals && cd git-internals && git init\`
   - Create a file: \`echo "devops-academy" > app.txt\`
   - Hash the file blob: \`git hash-object app.txt\`
   - Stage and commit, then inspect the resulting commit tree with \`git cat-file -p HEAD\`.`,
          },
          {
            id: "git_mod_02",
            title: "Module 2: The 3 Trees Architecture & Staging Area Mastery",
            duration: 45,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/P6jD966JZlk",
            content: `### 📖 1. Theory
Git manages file state across three distinct component trees:
1. **Working Directory:** Local filesystem files actively being edited.
2. **Index / Staging Area (\`.git/index\`):** Binary file tracking proposed changes staged for the next commit.
3. **Repository (HEAD):** Permanent, committed object database stored in \`.git/\`.

- **File States:** *Untracked* $\rightarrow$ *Staged* $\rightarrow$ *Committed* $\rightarrow$ *Modified*.
- **Partial Staging:** Staging specific chunks or lines of a file rather than entire files using interactive patch mode.

### 🏢 2. Real-World DevOps Examples
- **Atomic Commits in CI/CD:** Staging bug fixes separately from feature updates to ensure independent cherry-picking and rollback safety in automated production deployment pipelines.

### 💻 3. Practical Commands
\`\`\`bash
# Interactively stage specific code chunks (hunks)
git add -p microservice.py

# Unstage a file while keeping local changes intact in Working Directory
git restore --staged config.yaml

# Compare Working Directory with Staging Area
git diff

# Compare Staging Area with latest HEAD commit
git diff --staged
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the purpose of the Staging Area (Index)?**  
  *A:* The Index acts as a cache/buffer layer between working files and repository history, allowing engineers to curate atomic, granular commits instead of dumping unvetted filesystem changes into history.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Perform partial file staging with patch mode.
2. **Steps:**
   - Edit two separate functions in \`server.js\`.
   - Run \`git add -p server.js\` and accept hunk 1 (\`y\`) while staging hunk 2 (\`n\`).
   - Verify staged state with \`git diff --staged\`.`,
          },
          {
            id: "git_mod_03",
            title: "Module 3: Branching Mechanics, Merging Strategies & Conflict Resolution",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/P6jD966JZlk",
            content: `### 📖 1. Theory
Branches in Git are lightweight, 41-byte pointer files containing a SHA-1 hash targeting a specific commit node in the DAG:
- **Fast-Forward Merge:** Moves the branch pointer forward when no divergent commits exist on target branch.
- **3-Way Merge:** Combines two divergent branches using their common ancestor commit, creating a dedicated merge commit with two parent pointers.
- **Merge Conflicts:** Occurs when two branches modify the exact same lines in a file, forcing manual reconciliation before completing the commit.

### 🏢 2. Real-World DevOps Examples
- **Zero-Downtime Pipeline Protection:** Protecting \`main\` and \`production\` branches via GitHub repository rulesets requiring 2 peer approvals, status check pass (unit tests + linter), and linear history enforcement.

### 💻 3. Practical Commands
\`\`\`bash
# Create and switch to feature branch
git checkout -b feature/auth-api

# Perform explicit non-fast-forward merge to preserve branch history graph
git merge --no-ff feature/auth-api

# Abort a conflicting merge and restore working tree state
git merge --abort

# List all branches merged into main
git branch --merged main
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the difference between \`git merge\` and \`git merge --no-ff\`?**  
  *A:* Standard \`git merge\` performs a fast-forward merge if possible without creating a merge commit. \`--no-ff\` explicitly forces the creation of a dedicated merge commit node, preserving feature branch lifecycle context in history.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Resolve a complex 3-way merge conflict.
2. **Steps:**
   - Create conflicting edits in \`Dockerfile\` on \`main\` and \`feature/nginx\`.
   - Trigger merge: \`git merge feature/nginx\`.
   - Open \`Dockerfile\`, resolve conflict markers (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`), run \`git add Dockerfile\` and complete commit.`,
          },
          {
            id: "git_mod_04",
            title: "Module 4: Remote Repository Collaboration, Protocol Security & GPG Signing",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/P6jD966JZlk",
            content: `### 📖 1. Theory
Remote repositories manage synchronized branches across distributed teams:
- **Protocols:** SSH (\`git@github.com:org/repo.git\`), HTTPS with Personal Access Tokens (PAT), Smart HTTP.
- **Fetch vs Pull:** \`git fetch\` downloads remote objects and updates \`origin/main\` without altering working files. \`git pull\` executes \`git fetch\` followed by \`git merge origin/main\`.
- **GPG Signing:** Cryptographically signing commits with GPG keys to verify committer identity and prevent identity spoofing on GitHub/GitLab.

### 🏢 2. Real-World DevOps Examples
- **Securing Enterprise Supply Chains:** Enforcing signed commits across all production Kubernetes manifests to prevent untrusted code injection into deployment pipelines.

### 💻 3. Practical Commands
\`\`\`bash
# Configure GPG commit signing globally
git config --global user.signingkey <GPG_KEY_ID>
git config --global commit.gpgsign true

# Fetch remote objects and prune deleted remote branches
git fetch origin --prune

# Push new local branch and establish upstream tracking
git push -u origin feature/k8s-manifests
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is \`git fetch\` preferred over \`git pull\` in production automation?**  
  *A:* \`git fetch\` is safe and non-destructive; it allows automated scripts to inspect remote refs and compare diffs before safely applying changes, avoiding unexpected automatic merge conflicts in CI runners.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Setup GPG signed commits and test verification.
2. **Steps:**
   - Generate GPG key: \`gpg --full-generate-key\`
   - Add public key to GitHub profile.
   - Commit with \`git commit -S -m "feat: secure deploy"\` and verify signature tag with \`git log --show-signature\`.`,
          },
        ],
      },
      {
        id: "sec_git_02",
        title: "Section 2: Advanced History Manipulation & Debugging (Modules 5-7)",
        lessons: [
          {
            id: "git_mod_05",
            title: "Module 5: Git Rebase vs Git Merge & Interactive History Cleaning",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/P6jD966JZlk",
            content: `### 📖 1. Theory
Git Rebase re-applies commits from one branch onto the tip of another base commit:
- **Linear History:** Eliminates unnecessary merge noise by linearizing commit history.
- **Interactive Rebase (\`git rebase -i\`):** Reorder, squash (combine), reword, edit, or drop historic commits prior to submitting pull requests.
- **Golden Rule of Rebasing:** Never rebase public branches (like \`main\` or \`production\`) that have already been pushed and shared with other developers.

### 🏢 2. Real-World DevOps Examples
- **Preparing Clean PRs:** Squashing 15 WIP ("work in progress", "fixed typo") commits into a single structured commit message before merging into production.

### 💻 3. Practical Commands
\`\`\`bash
# Rebase feature branch onto latest main branch
git checkout feature/api && git rebase main

# Interactively clean up the last 4 commits
git rebase -i HEAD~4

# Force push rebased feature branch safely (prevents overwriting remote peer work)
git push --force-with-lease origin feature/api
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the difference between \`git push --force\` and \`git push --force-with-lease\`?**  
  *A:* \`--force\` unconditionally overwrites the remote branch. \`--force-with-lease\` checks if the remote reference has been updated by someone else since your last fetch, aborting if un-fetched remote commits exist.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Squash 3 WIP commits into 1 clean commit using interactive rebase.
2. **Steps:**
   - Make 3 small commits on \`feature/login\`.
   - Run \`git rebase -i HEAD~3\`, set the second and third commits to \`squash\` (\`s\`), save, update commit message, and verify with \`git log --oneline\`.`,
          },
          {
            id: "git_mod_06",
            title: "Module 6: Cherry-Picking, Stashing & Emergency Recovery with Reflog",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/P6jD966JZlk",
            content: `### 📖 1. Theory
Advanced recovery tools ensure zero data loss during complex code operations:
- **Cherry-Picking:** Applying specific commit changesets from one branch directly onto another without merging the full branch history.
- **Git Stash:** Temporarily shelving modified/staged uncommitted work to work on hotfixes, stored in a stack (\`refs/stash\`).
- **Git Reflog (\`Reference Log\`):** Record of every local HEAD ref update. Captures rebased, deleted, or reset commits for 90 days before garbage collection.

### 🏢 2. Real-World DevOps Examples
- **Emergency Hotfix Patching:** Cherry-picking a critical security fix commit from \`main\` directly into a legacy \`v1.4-release\` branch without merging un-released main features.

### 💻 3. Practical Commands
\`\`\`bash
# Stash untracked and modified files with descriptive message
git stash push -u -m "WIP: database migration work"

# List and pop latest stash
git stash list && git stash pop

# Cherry-pick a specific commit hash onto active branch
git cherry-pick <commit-sha>

# View full reference log and recover a hard-reset commit
git reflog
git reset --hard HEAD@{2}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do you recover a branch that was accidentally deleted using \`git branch -D\`?**  
  *A:* Run \`git reflog\` to locate the last commit hash of the deleted branch before deletion, then recreate the branch pointer pointing to that hash: \`git checkout -b recovered-branch <commit-sha>\`.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Recover a deleted branch and lost commit via \`git reflog\`.
2. **Steps:**
   - Create branch \`temp-fix\`, make a commit, delete branch (\`git branch -D temp-fix\`).
   - Run \`git reflog\`, find SHA, run \`git checkout -b temp-fix <SHA>\`, and verify file restoration.`,
          },
          {
            id: "git_mod_07",
            title: "Module 7: Git Bisect, Blame & Advanced History Search",
            duration: 40,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/P6jD966JZlk",
            content: `### 📖 1. Theory
Debugging toolsets for isolating regression bugs in large software codebases:
- **Git Bisect:** Binary search engine that walks through commit history between a known "good" commit and a "bad" commit to pinpoint the exact breaking change in $O(\log N)$ steps.
- **Automated Bisect:** Executing an automated test script at each bisect iteration step (\`git bisect run <test-script.sh>\`).
- **Git Blame & Pickaxe:** Tracking line-by-line author revisions and searching commit history for code string additions/deletions (\`git log -S\`).

### 🏢 2. Real-World DevOps Examples
- **Automating Bug Bisection in CI/CD:** Pinpointing which microservice commit introduced a 20ms memory leak over a 500-commit release window using \`git bisect run pytest tests/test_performance.py\`.

### 💻 3. Practical Commands
\`\`\`bash
# Start binary search bisect session
git bisect start
git bisect bad HEAD
git bisect good v1.2.0

# Run automated bash script test during bisect
git bisect run npm test

# End bisect and return to original branch
git bisect reset

# Search history for commits that added or removed string "AWS_SECRET_KEY"
git log -S "AWS_SECRET_KEY" --oneline
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does \`git bisect\` optimize bug hunting compared to manual inspection?**  
  *A:* Manual sequential inspection takes $N$ steps. \`git bisect\` uses binary search algorithm requiring only $\log_2(N)$ steps (e.g. finding a bug in 1,024 commits takes only 10 steps).

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Use \`git bisect\` to automatically find a breaking commit.
2. **Steps:**
   - Set up test repo with 10 commits where commit 6 breaks a script.
   - Run \`git bisect start HEAD v1.0\`, mark commits good/bad, isolate culprit commit hash.`,
          },
        ],
      },
      {
        id: "sec_git_03",
        title: "Section 3: Enterprise Workflows, GitOps & Automation (Modules 8-10)",
        lessons: [
          {
            id: "git_mod_08",
            title: "Module 8: Git Branching Strategies: GitFlow, Trunk-Based & Feature Flags",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/P6jD966JZlk",
            content: `### 📖 1. Theory
Branching strategies determine team collaboration models and release velocity:
- **GitFlow:** Strict model with \`main\`, \`develop\`, \`feature/*\`, \`release/*\`, and \`hotfix/*\` branches. Ideal for scheduled, monolithic release cycles.
- **Trunk-Based Development (TBD):** All developers merge small, short-lived feature branches directly into a shared \`main\` branch daily. Requires robust automated CI test suites and feature flags.
- **Feature Flags / Toggles:** Decoupling code deployment from feature release by wrapping new code in dynamic runtime conditional toggles.

### 🏢 2. Real-World DevOps Examples
- **Migrating from GitFlow to Trunk-Based:** Transitioning a cloud-native engineering team from bi-weekly release cycles to 50 daily automated production deployments using short-lived branches (< 24 hrs) and launch dark launch flags.

### 💻 3. Practical Commands
\`\`\`bash
# Compare commit divergence between main and feature branch
git log --left-right --graph --oneline main...feature/payment

# Delete merged local feature branches
git branch --merged | grep -v "\*" | grep -v "main" | xargs -n 1 git branch -d
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why do modern DevOps teams prefer Trunk-Based Development over GitFlow?**  
  *A:* Trunk-Based Development eliminates long-lived branches, reducing "merge hell" conflicts, increasing CI testing frequency, and enabling continuous integration and continuous deployment (CI/CD).

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Implement Trunk-Based Development workflow with short-lived branch.
2. **Steps:**
   - Branch off main: \`git checkout -b feature/tbd-quickfix\`
   - Commit small change, run local unit tests, push and merge via GitHub PR within 30 minutes.`,
          },
          {
            id: "git_mod_09",
            title: "Module 9: Git Hooks & Client / Server Secret Scanning Automation",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/P6jD966JZlk",
            content: `### 📖 1. Theory
Git hooks are executable scripts in \`.git/hooks/\` triggered before or after Git lifecycle events:
- **Client-Side Hooks:**
  - \`pre-commit\`: Runs linters, static code analyzers, and secret scanners (gitleaks, truFFlehog) before commit creation.
  - \`commit-msg\`: Enforces Conventional Commit syntax (\`feat:\`, \`fix:\`, \`docs:\`).
  - \`pre-push\`: Runs unit test suites before allowing remote pushes.
- **Server-Side Hooks:** \`pre-receive\`, \`update\`, \`post-receive\` (enforce branch protection policies on central servers).

### 🏢 2. Real-World DevOps Examples
- **Preventing Cloud Secret Leaks:** Setting up a global pre-commit hook using \`gitleaks\` to block developers from accidentally committing AWS access keys or SSH private keys into GitHub repositories.

### 💻 3. Practical Commands
\`\`\`bash
# Create an executable pre-commit secret scanning hook
cat << 'EOF' > .git/hooks/pre-commit
#!/bin/sh
if grep -E -q '(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}' "$@"; then
    echo "[ERROR] Detected AWS Access Key in staged files! Aborting commit."
    exit 1
fi
EOF
chmod +x .git/hooks/pre-commit
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Are client-side Git hooks secure for enforcing compliance?**  
  *A:* No, client-side hooks can be bypassed using \`git commit --no-verify\`. Compliance policies must be enforced server-side or via automated GitHub Actions CI status checks.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Build a custom commit-msg hook enforcing Conventional Commits.
2. **Steps:**
   - Create \`.git/hooks/commit-msg\` checking regex \`^(feat|fix|docs|refactor|test|chore): .+\`.
   - Test non-compliant commit (\`git commit -m "changed code"\` -> FAIL) and compliant commit (\`git commit -m "fix: resolve memory leak"\` -> PASS).`,
          },
          {
            id: "git_mod_10",
            title: "Module 10: Git LFS, Monorepos & GitOps Infrastructure Integration",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/P6jD966JZlk",
            content: `### 📖 1. Theory
Scaling Git for enterprise enterprise workloads and Infrastructure as Code:
- **Git Large File Storage (LFS):** Replaces large binary files (machine learning models, videos, zip archives) with pointer files in Git, storing actual binary payloads on dedicated LFS servers.
- **Monorepo Architecture:** Storing multiple services/packages in a single repository, managed via Sparse Checkout and Git Submodules/Subtrees.
- **GitOps Core Principles:** Declarative infrastructure definitions stored in Git as the Single Source of Truth, automated drift synchronization via controllers (ArgoCD / Flux).

### 🏢 2. Real-World DevOps Examples
- **Enterprise GitOps Pipeline:** Using Git PR workflows to manage production Kubernetes deployments. Merging a PR updating \`values.yaml\` automatically triggers ArgoCD to apply changes to the EKS cluster without manual \`kubectl\` commands.

### 💻 3. Practical Commands
\`\`\`bash
# Track binary zip files with Git LFS
git lfs install
git lfs track "*.zip"
git add .gitattributes

# Perform Sparse Checkout to download only specific subdirectory in large monorepo
git clone --filter=blob:none --sparse https://github.com/org/monorepo.git
cd monorepo
git sparse-checkout set services/payment-api
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is GitOps and how does Git act as the Single Source of Truth?**  
  *A:* GitOps is an operational framework where the target infrastructure state is declaratively defined in Git. Automated controllers continually poll Git and apply changes, ensuring production state matches Git history.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Configure Git LFS and sparse checkout in a project.
2. **Steps:**
   - Initialize LFS: \`git lfs track "*.iso"\`.
   - Create test file \`image.iso\`, commit and verify that \`git show\` displays LFS pointer text metadata instead of binary blob data.`,
          },
        ],
      },
    ],
  },
  {
    id: "course_docker_001",
    slug: "docker-mastery",
    title: "Docker & Containers Mastery",
    shortDescription: "Master Docker, container internals, Dockerfiles, Compose, security hardening, multi-stage builds, and enterprise projects.",
    description: "The complete, hands-on Docker masterclass engineered for DevOps engineers, Cloud Architects, and SREs. From low-level Linux kernel namespaces and cgroups to hyper-optimized multi-stage builds, production Docker Compose microservices, Trivy/Cosign security scanning, non-root hardening, and Docker Swarm orchestration. Every module contains deep theory, real-world DevOps production projects, Linux troubleshooting commands, interview questions, and hands-on practical labs.",
    category: "Docker",
    level: "intermediate",
    price: 1999,
    isPro: true,
    isFeatured: true,
    rating: 4.9,
    totalRatings: 3240,
    totalStudents: 22800,
    totalLessons: 15,
    durationHours: 18,
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer",
    thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=600",
    icon: React.createElement(SiDocker),
    color: "from-blue-500 to-cyan-500",
    tags: ["Docker", "Containers", "Docker Compose", "Multi-stage Builds", "Security", "DevOps", "Registry", "Networking", "Trivy", "Cosign"],
    whatYouLearn: [
      "Master Linux container internals: Namespaces, Cgroups v2, OverlayFS, containerd, and runc",
      "Write hyper-optimized multi-stage Dockerfiles reducing image sizes from 1.2GB down to under 15MB",
      "Architect complex multi-container systems using Docker Compose V2 with healthchecks and isolated networks",
      "Master Docker bridge, host, and overlay networking with container-to-container DNS resolution",
      "Manage persistent storage with Named Volumes, Bind Mounts, and permissions best practices",
      "Harden container security: non-root users, capability dropping, read-only filesystems, and seccomp profiles",
      "Scan images for CVE vulnerabilities with Trivy and sign image artifacts cryptographically using Cosign",
      "Configure resource constraints (--memory, --cpus), daemon tuning, and automated system maintenance",
      "Deploy scalable microservice stacks using Docker Swarm with rolling updates and routing mesh",
      "Translate Docker Compose environments into production-grade Kubernetes Deployments and Services",
    ],
    requirements: ["Basic Linux command line knowledge", "Fundamental understanding of software applications"],
    updatedAt: "2026-09-21",
    sections: [
      {
        id: "sec_docker_01",
        title: "Section 1: Container Core, Dockerfiles & Storage (Modules 1-5)",
        lessons: [
          {
            id: "dock_mod_01",
            title: "Module 1: Container Internals, OCI & Docker Architecture",
            duration: 45,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/gAkwW2tuIqE",
            content: `### 📖 1. Theory
A container is a standard unit of software packaging code and dependencies so an application runs reliably across compute environments. Containers are NOT lightweight virtual machines:
- **VMs vs Containers:**
  - *Virtual Machines:* Virtualize hardware via a Hypervisor (Type 1 or 2). Each VM runs a full guest OS with its own kernel, taking minutes to boot and consuming gigabytes of RAM.
  - *Containers:* Share the host Linux kernel and isolate processes using native kernel primitives, booting in milliseconds with negligible overhead.
- **Linux Kernel Isolation Primitives:**
  - **Namespaces (Isolation):** \`PID\` (process trees), \`NET\` (virtual NICs, ports, routing tables), \`MNT\` (filesystem mount points), \`IPC\` (inter-process communication), \`UTS\` (hostnames), \`USER\` (UID/GID mappings).
  - **Control Groups / Cgroups v2 (Resource Limits):** Meter and constrain hardware resources (CPU quotas, RAM limits, Block I/O).
  - **OverlayFS (Union Filesystem):** Copy-on-Write (CoW) layered storage joining read-only image layers (\`LowerDir\`) with a thin writable container layer (\`UpperDir\`).
- **Container Engine Architecture:** Docker CLI $\\rightarrow$ Docker Daemon (\`dockerd\`) $\\rightarrow$ \`containerd\` (high-level runtime) $\\rightarrow$ \`runc\` (OCI low-level spec runtime) $\\rightarrow$ Linux Kernel.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Environment Parity Across CI/CD and Cloud:** Eliminating "it works on my machine" bugs by shipping identical, immutable container images across macOS developer laptops, GitHub Actions runner nodes, and AWS ECS/EKS production clusters.
- **High-Density Microservices:** Hosting 60 isolated containerized microservices on a single 16-core Linux host node with sub-second startup times and dynamic memory allocation.

### 💻 3. Practical Commands
\`\`\`bash
# Inspect Docker Engine client version, daemon details, and storage driver
docker version
docker info

# Extract host PID of a running container and inspect its isolated kernel namespaces
CONTAINER_PID=$(docker inspect --format '{{.State.Pid}}' web_app)
sudo lsns -p $CONTAINER_PID

# Real-time resource usage streaming for all active host containers
docker stats

# Inspect low-level cgroups memory limits for a container
cat /sys/fs/cgroup/docker/<container_id>/memory.max 2>/dev/null || cat /sys/fs/cgroup/memory/docker/<container_id>/memory.limit_in_bytes
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the Open Container Initiative (OCI) and what role does \`runc\` play?**  
  *A:* The OCI specifies open industry standards for container runtime formats and image specifications. \`runc\` is the reference implementation of the OCI runtime spec; it directly calls Linux kernel system calls (\`clone()\`, \`unshare()\`, \`pivot_root()\`) to create namespaces and cgroups.
- **Q: How does OverlayFS implement Copy-on-Write (CoW) when a container modifies a file?**  
  *A:* OverlayFS treats container image layers as strictly read-only (\`LowerDir\`). When a running container writes to or edits a file, OverlayFS copies the file up to the container's temporary writable layer (\`UpperDir\`) before executing the write operation, leaving underlying image layers unmodified.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Inspect live Linux kernel process isolation and cgroup limits on host systems.
2. **Steps:**
   - Execute \`docker info\` and record your host storage driver (e.g. \`overlay2\`) and Cgroup version (\`v1\` or \`v2\`).
   - Launch an isolated Alpine container: \`docker run -d --name test-iso alpine sleep 3600\`
   - Fetch the container PID on the host: \`docker inspect --format '{{.State.Pid}}' test-iso\`
   - Run \`ps aux | grep sleep\` on the host to verify the container process appears as a standard process on host OS.
   - Clean up: \`docker rm -f test-iso\``,
          },
          {
            id: "dock_mod_02",
            title: "Module 2: Container Lifecycle, CLI Mechanics & Process Control",
            duration: 50,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/3c-iBn73dDE",
            content: `### 📖 1. Theory
Understanding the 5 lifecycle states of a container (Created, Running, Paused, Stopped, Exited):
- **Core CLI Operations:**
  - \`docker run\`: Combines \`docker create\` + \`docker start\` + \`docker attach/detach\`.
  - \`docker exec\`: Launches a secondary process inside an existing container's namespaces (ideal for debugging).
  - \`docker stop\` vs \`docker kill\`: \`stop\` sends \`SIGTERM\` (signal 15) allowing a grace period (default 10s) for process cleanup; \`kill\` sends immediate \`SIGKILL\` (signal 9).
  - \`docker logs\`: Streams \`stdout\` and \`stderr\` output captured by the configured Docker logging driver.

#### PID 1 & Zombie Process Reaping
In Linux, process ID 1 is responsible for reaping orphan child processes and handling signal propagation. If an application process running as PID 1 inside a container does not register signal handlers (e.g. Node.js or Python without an init process), it will ignore \`SIGTERM\` signals, delaying shutdowns. Use \`--init\` or \`tini\` to handle process reaping.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Graceful Shutdown of Microservices:** Ensuring API web servers handle \`SIGTERM\` signals to finish processing active HTTP transactions, close database connection pools, and release Redis locks before stopping.
- **Production Incident Debugging:** Using \`docker logs --tail 100 --timestamps <container_id>\` and \`docker exec -it <container_id> sh\` to diagnose production memory leaks or hung database connection pools without restarting the container.

### 💻 3. Practical Commands
\`\`\`bash
# Run background detached Nginx container with port mapping and automatic restart
docker run -d --name my-web -p 8080:80 --restart unless-stopped nginx:alpine

# Execute interactive shell inside running container with custom environment
docker exec -it -e DEBUG=true my-web sh

# Inspect container IP address and environment variables via JSON filter
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my-web

# Follow live container logs with timestamps and line limit
docker logs -f --tail 50 --timestamps my-web

# Run container with init process (tini) for signal handling and zombie reaping
docker run -d --init --name node-app my-node-image

# Stop and remove all host containers in one command
docker stop $(docker ps -q) && docker rm $(docker ps -aq)
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why does a container exit immediately after executing \`docker run -d ubuntu\`?**  
  *A:* A container runs only as long as its primary entry process (PID 1) remains active. The default command for Ubuntu is \`/bin/bash\`. Without an interactive TTY attached (\`-it\`), bash finishes execution immediately and exits with code 0.
- **Q: What is the fundamental difference between \`docker exec\` and \`docker attach\`?**  
  *A:* \`docker attach\` connects your terminal to the primary PID 1 process inside the container; pressing \`Ctrl+C\` transmits \`SIGINT\` to PID 1, stopping the container. \`docker exec\` spawns an independent secondary process inside the container's namespaces without affecting PID 1.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Deploy a background service, inspect logs, execute commands inside its namespace, and test graceful signal handling.
2. **Steps:**
   - Launch a Redis container detached: \`docker run -d --name redis-cache -p 6379:6379 redis:alpine\`
   - Connect using \`docker exec\`: \`docker exec -it redis-cache redis-cli ping\` (verify \`PONG\`).
   - Monitor real-time logs: \`docker logs -f redis-cache\`
   - Stop gracefully: \`docker stop redis-cache\` and verify exit status in \`docker ps -a\`.`,
          },
          {
            id: "dock_mod_03",
            title: "Module 3: Dockerfile Authoring, BuildKit & Layer Optimization",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/WmcdMiyqfS0",
            content: `### 📖 1. Theory
A Dockerfile is an automated script containing instructions to build immutable container images:
- **Essential Directives:**
  - \`FROM\`: Base image declaration (always pin specific tags, e.g. \`node:20-alpine\`, avoid mutable \`:latest\`).
  - \`WORKDIR\`: Sets working directory for subsequent instructions.
  - \`COPY\` vs \`ADD\`: \`COPY\` copies local files; \`ADD\` can unpack local tarballs and fetch URLs (prefer \`COPY\` for security).
  - \`RUN\`: Executes build commands to install dependencies, generating a new read-only image layer.
  - \`ENV\` vs \`ARG\`: \`ARG\` is available ONLY during build time; \`ENV\` persists in runtime container environments.
  - \`CMD\` vs \`ENTRYPOINT\`: \`ENTRYPOINT\` sets the default binary executable; \`CMD\` provides default arguments easily overridden via CLI.

#### BuildKit Engine & Caching Rules
- **Layer Caching:** Docker caches each layer based on instruction strings and file checksums. Order Dockerfile instructions from least-frequently changed (package installs) to most-frequently changed (source code).
- **BuildKit Features:** Enable \`DOCKER_BUILDKIT=1\` for parallel build execution, Secret mounts (\`--mount=type=secret\`), and Cache mounts (\`--mount=type=cache,target=/root/.npm\`).

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Optimizing CI/CD Build Times:** Restructuring Dockerfiles to copy \`package.json\` / \`go.mod\` and execute dependency installation BEFORE copying source code. This reuses cached dependency layers on every code commit, dropping CI build times from 7 minutes to 5 seconds.
- **.dockerignore Optimization:** Filtering \`.git\`, \`node_modules\`, \`dist\`, \`.env\`, and log files out of the build context to accelerate file transfers to the Docker daemon.

### 💻 3. Practical Commands
\`\`\`dockerfile
# Production-grade Node.js Dockerfile using BuildKit cache mounts
# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS base
WORKDIR /app

# Leverage layer caching: copy dependency manifests first
COPY package*.json ./

# Install production dependencies using BuildKit package cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production

# Copy application source code
COPY . .

# Expose port metadata and set unprivileged non-root user
EXPOSE 3000
USER node

ENTRYPOINT ["node"]
CMD ["server.js"]
\`\`\`

\`\`\`bash
# Enable BuildKit and build image with build arguments and custom tag
DOCKER_BUILDKIT=1 docker build -t my-app:1.2.0 --build-arg NODE_ENV=production .

# Inspect image layer history and size contribution of each instruction
docker history my-app:1.2.0
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the functional difference between \`CMD\` and \`ENTRYPOINT\`?**  
  *A:* \`ENTRYPOINT\` specifies the fixed binary executable that always runs when the container starts (e.g. \`ENTRYPOINT ["nginx"]\`). \`CMD\` provides default parameters (e.g. \`CMD ["-g", "daemon off;"]\`). Passing arguments in \`docker run my-image -c /test.conf\` overrides \`CMD\`, but appends to \`ENTRYPOINT\`.
- **Q: Why should commands inside \`RUN\` directives be chained with \`&&\`?**  
  *A:* Every \`RUN\` instruction generates a new immutable filesystem layer. Chaining commands (e.g. \`apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*\`) ensures temporary installer caches are removed in the SAME layer, preventing permanent image bloat.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Write an optimized Dockerfile and \`.dockerignore\` file, verify layer caching, and inspect layer history.
2. **Steps:**
   - Create a \`.dockerignore\` file excluding \`.git\`, \`node_modules\`, and \`*.log\`.
   - Write a Dockerfile placing dependency installation before source code copying.
   - Build the image twice using \`docker build -t test-opt:v1 .\` and observe \`CACHED\` output on the second run.
   - Run \`docker history test-opt:v1\` to analyze layer sizes.`,
          },
          {
            id: "dock_mod_04",
            title: "Module 4: Multi-Stage Builds, Distroless & Static Binaries",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/5U2_0qD0Z50",
            content: `### 📖 1. Theory
Multi-stage builds separate the compilation/build environment from the final runtime production environment within a single Dockerfile:
- **The Problem:** Compiling Go, Rust, Java, or TypeScript requires SDKs, compilers (\`gcc\`, \`g++\`), and build tools (1GB+ in size) that are completely unnecessary and introduce security vulnerabilities in production runtime containers.
- **The Multi-Stage Solution:**
  - **Stage 1 (\`FROM ... AS builder\`):** Heavy SDK base image compiles binaries or bundles assets.
  - **Stage 2 (\`FROM alpine\` or \`gcr.io/distroless\`):** Minimal runtime base image copies ONLY the compiled output from \`--from=builder\`.
- **Distroless Base Images:** Maintained by Google, distroless images contain only the application and runtime dependencies—NO package managers (\`apt\`, \`apk\`), NO shells (\`bash\`, \`sh\`), drastically minimizing CVE attack surface.
- **Scratch Image:** Docker's empty 0-byte base image used for statically compiled Go/Rust binaries.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Shrinking a Golang Microservice from 1.2GB to 14MB:** Compiling static binaries with \`golang:1.22-alpine\` and copying the output into a \`scratch\` or \`distroless/static-debian12\` runtime image.
- **React Frontend Nginx Production Stage:** Compiling React TypeScript source code in Node.js stage, then copying static HTML/JS bundles into a lightweight Nginx Alpine container stage.

### 💻 3. Practical Commands
\`\`\`dockerfile
# Multi-Stage Go Dockerfile targeting Distroless
# --- Stage 1: Build Environment ---
FROM golang:1.22-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /bin/api .

# --- Stage 2: Minimal Distroless Runtime ---
FROM gcr.io/distroless/static-debian12
WORKDIR /app
COPY --from=builder /bin/api /app/api
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/app/api"]
\`\`\`

\`\`\`bash
# Build multi-stage image targeting specific stage for local debugging
docker build --target builder -t my-api:debug .
docker build -t my-api:prod .

# Compare size difference between build and runtime images
docker images | grep my-api
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is a \`scratch\` base image in Docker?**  
  *A:* \`scratch\` is Docker's reserved empty, zero-byte base image. It contains no OS files, shell binaries, or libraries. It is used to execute statically compiled binaries (like Go or Rust binaries) with zero image bloat.
- **Q: What security advantages do Distroless images offer?**  
  *A:* If an attacker exploits a Remote Code Execution (RCE) vulnerability in an application running on distroless, they cannot open an interactive shell, run \`curl\`/\`wget\` to download malicious tools, or execute package managers because standard system utilities do not exist on disk.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Build a multi-stage Dockerfile for a web app and compare final image sizes.
2. **Steps:**
   - Author a 2-stage Dockerfile using a heavy builder stage and a lightweight runtime stage.
   - Build the image: \`docker build -t multi-app:v1 .\`
   - Run \`docker images\` to verify that the final image size is under 20MB.`,
          },
          {
            id: "dock_mod_05",
            title: "Module 5: Storage Architecture: Named Volumes, Bind Mounts & Backup Automation",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
By default, all files created inside a container are stored in its ephemeral writable layer and lost when the container is deleted. Docker provides three persistent storage mechanisms:
- **1. Named Volumes (\`-v my_vol:/var/lib/mysql\`):**
  - Managed exclusively by Docker daemon in host storage (\`/var/lib/docker/volumes/\`).
  - High performance, decoupled from host directory structures, isolated from host OS file permission conflicts; recommended for database storage (PostgreSQL, MySQL, Redis).
- **2. Bind Mounts (\`-v /host/path:/container/path\`):**
  - Mounts an exact host directory or file directly into the container filesystem.
  - Dependent on host OS directory paths and UID permissions; ideal for local development source code hot-reloading.
- **3. tmpfs Mounts (\`--tmpfs /tmp\`):**
  - Stored strictly in host RAM memory; never written to host disk; ideal for sensitive security keys, tokens, and ephemeral caches.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Database Version Upgrades Without Data Loss:** Upgrading PostgreSQL from version 15 to 16 by stopping the old container (\`docker stop pg15\`), removing it (\`docker rm pg15\`), and launching PostgreSQL 16 (\`docker run -v pg_data:/var/lib/postgresql/data postgres:16\`) attaching the existing named volume.
- **Project: Automated Volume Backup Pipeline:** Running an automated ephemeral Alpine container that mounts named volumes and creates gzipped backup archives stored on remote host storage.

### 💻 3. Practical Commands
\`\`\`bash
# Create and inspect Docker named volume details
docker volume create pg_data
docker volume inspect pg_data

# Launch PostgreSQL container attached to persistent named volume
docker run -d --name postgres-db \
  -e POSTGRES_PASSWORD=secret \
  -v pg_data:/var/lib/postgresql/data \
  postgres:16-alpine

# Run local development container with read-only bind mount
docker run -d -p 3000:3000 -v $(pwd):/app:ro my-dev-app

# Execute volume backup into a compressed tarball archive
docker run --rm -v pg_data:/volume -v $(pwd):/backup alpine \
  tar -czf /backup/pg_data_backup_$(date +%Y%m%d).tar.gz -C /volume .
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What happens if you bind-mount an empty host directory over a non-empty container directory?**  
  *A:* The empty host directory will obscure/hide the existing container directory files for the lifetime of the mount. Conversely, if you mount a newly created Named Volume over a non-empty container directory, Docker automatically copies the container's pre-existing files into the volume.
- **Q: Why should production databases prefer Named Volumes over Bind Mounts?**  
  *A:* Named Volumes are managed natively by Docker CLI, avoid host OS file permission and SELinux context conflicts, support cloud network storage drivers (AWS EBS, NFS), and decouple data from specific host directory structures.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Create a named volume, persist data across container recreations, and perform an automated volume backup.
2. **Steps:**
   - Create volume: \`docker volume create db_store\`
   - Run a container: \`docker run -d --name db-test -v db_store:/data alpine sh -c "echo 'Hello World' > /data/test.txt; sleep 3600"\`
   - Remove container: \`docker rm -f db-test\`
   - Launch a new container attaching \`db_store\` and verify \`cat /data/test.txt\` returns \`Hello World\`.
   - Backup volume to host directory using the \`tar\` backup container command.`,
          },
        ],
      },
      {
        id: "sec_docker_02",
        title: "Section 2: Networking, Compose & Multi-Container Systems (Modules 6-10)",
        lessons: [
          {
            id: "dock_mod_06",
            title: "Module 6: Software-Defined Container Networking & DNS Discovery",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/F27PLhn3W04",
            content: `### 📖 1. Theory
Docker manages container networking using Linux virtual bridges, \`veth\` pairs, and \`iptables\` packet translation:
- **Network Drivers:**
  - **bridge (Default):** Virtual Linux bridge (\`docker0\`). Custom user-defined bridge networks enable automatic internal DNS resolution by container name.
  - **host:** Disables network isolation; container shares host NIC namespace directly (highest performance, potential port collisions).
  - **none:** Disables all external networking (loopback interface only).
  - **overlay:** Multi-host networking across Docker Swarm clusters.
  - **macvlan:** Assigns a routable MAC address directly to container interfaces.
- **Port Forwarding Mechanics (\`-p 8080:80\`):** Docker injects \`iptables\` NAT rules into the \`PREROUTING\` chain to forward incoming packets on host port 8080 to container IP port 80.
- **Embedded DNS Resolver:** Listens at \`127.0.0.11\` inside containers attached to custom bridge networks to resolve container names to private IPs.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Microservice Network Isolation:** Creating isolated custom bridge networks (\`frontend-net\`, \`backend-net\`). Backend API connects to PostgreSQL database over \`backend-net\`, while public internet traffic reaches only Nginx Ingress on \`frontend-net\`.
- **Debugging DNS Resolution:** Using \`docker exec -it web-app nslookup database-service\` to troubleshoot inter-container network connectivity.

### 💻 3. Practical Commands
\`\`\`bash
# Create custom user-defined bridge network
docker network create --driver bridge app-net

# Launch database and API containers attached to custom network
docker run -d --name db --network app-net redis:alpine
docker run -d --name web --network app-net -p 8080:80 my-web-app

# Test DNS hostname resolution between containers
docker exec -it web ping -c 2 db

# Inspect network subnet, gateway, and connected container IPs
docker network inspect app-net

# Inspect Docker NAT rules in Linux iptables
sudo iptables -t nat -L DOCKER -n -v
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why does container name DNS resolution work on custom bridge networks but NOT on the default \`bridge\` network?**  
  *A:* The default bridge network (\`docker0\`) disables embedded DNS resolution for backward compatibility and requires legacy \`--link\` flags. Custom user-defined bridge networks automatically enable Docker's embedded DNS server (\`127.0.0.11\`).
- **Q: What security benefits does isolating database containers on internal networks provide?**  
  *A:* Attaching a database container to an internal bridge network without publishing ports (\`-p\`) completely blocks incoming public internet connections, while allowing authorized API containers on the same bridge network to communicate securely.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Build a 2-tier network setup separating frontend and database containers.
2. **Steps:**
   - Create network: \`docker network create isolated-net\`
   - Run Redis: \`docker run -d --name redis-service --network isolated-net redis:alpine\`
   - Run Alpine client on same network: \`docker run --rm --network isolated-net nicolaka/netshoot nc -zv redis-service 6379\`
   - Verify successful connection output.`,
          },
          {
            id: "dock_mod_07",
            title: "Module 7: Docker Compose Orchestration & Production Stacks",
            duration: 60,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/HG6yLvBCPwk",
            content: `### 📖 1. Theory
Docker Compose is a declarative tool for defining and orchestrating multi-container applications via a single \`docker-compose.yml\` configuration file:
- **Core Structural Elements:**
  - \`services\`: Application containers (frontend, api, worker, redis, postgres).
  - \`networks\`: Custom network boundaries created automatically for the project stack.
  - \`volumes\`: Named persistent storage mounted across services.
- **Advanced Control Directives:**
  - \`depends_on\` with \`condition: service_healthy\`: Prevents API containers from starting until database containers finish initialization and pass health checks.
  - \`healthcheck\`: Defines periodic container status probes (\`test: ["CMD", "curl", "-f", "http://localhost:8080/health"]\`).
  - \`restart\`: Auto-restart rules (\`unless-stopped\`, \`always\`).

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Production-Grade Microservices Stack:** Authoring a production Compose stack running React Frontend, Node.js API, PostgreSQL Database, Redis Cache, and Nginx Reverse Proxy with automated SSL termination and health probes.
- **CI/CD Integration Testing:** Executing \`docker compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from test-runner\` in GitHub Actions to run end-to-end integration tests.

### 💻 3. Practical Commands
\`\`\`yaml
# Production docker-compose.yml
version: '3.8'

services:
  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app_db
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - backend-net

  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      database:
        condition: service_healthy
    networks:
      - backend-net

networks:
  backend-net:

volumes:
  db_data:
\`\`\`

\`\`\`bash
# Start multi-container application stack in detached mode and rebuild images
docker compose up -d --build

# Inspect status and health of all managed stack services
docker compose ps

# View unified live log streams with service color prefixes
docker compose logs -f api

# Tear down all containers, networks, and persistent volumes
docker compose down -v
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why does standard \`depends_on\` fail to prevent container startup race conditions?**  
  *A:* By default, \`depends_on\` only waits for dependent containers to enter the "Running" state, NOT for application services inside (like PostgreSQL) to complete initialization and accept socket connections. Using \`condition: service_healthy\` with a valid \`healthcheck\` is required.
- **Q: What is the difference between legacy \`docker-compose\` (V1) and modern \`docker compose\` (V2)?**  
  *A:* Compose V1 was a standalone Python script (\`docker-compose\`). Compose V2 is written in Go and integrated directly into the Docker CLI (\`docker compose\`), delivering faster execution, parallel BuildKit builds, and unified command flags.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Author a multi-service \`docker-compose.yml\` with healthchecks and launch the stack.
2. **Steps:**
   - Author a Compose file containing a web app and Redis cache with a healthcheck.
   - Launch: \`docker compose up -d\`
   - Check health status: \`docker compose ps\` and verify status displays \`(healthy)\`.
   - Tear down stack: \`docker compose down\`.`,
          },
          {
            id: "dock_mod_08",
            title: "Module 8: Secrets, Configs & 12-Factor Environment Management",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/k8EwT_f45j0",
            content: `### 📖 1. Theory
Adhering to the 12-Factor App methodology requires strict decoupling of code from configuration and secrets:
- **Environment Variables:** Suitable for non-sensitive settings (\`PORT\`, \`LOG_LEVEL\`, \`NODE_ENV\`).
- **Environment Files (\`.env\` / \`--env-file\`):** Local key-value configuration files.
- **Docker Secrets:** Secure mechanism for passing sensitive credentials, SSL keys, and API tokens as in-memory files mounted at \`/run/secrets/<secret_name>\` (prevents leaking secrets in \`docker inspect\` or process lists).
- **BuildKit Secret Mounts:** Safely passing build-time credentials (e.g. npm tokens, SSH keys) using \`RUN --mount=type=secret\`.
- **Anti-Pattern:** NEVER hardcode API keys, database passwords, or certificates in Dockerfile \`ENV\` or \`RUN\` directives.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Zero-Leak CI/CD Image Builds:** Building enterprise container images requiring private NPM registry tokens using BuildKit \`--mount=type=secret\`, ensuring tokens are never recorded in image layer history.
- **12-Factor Microservice Configuration:** Loading distinct \`.env.staging\` and \`.env.production\` files dynamically into container environments without altering container images.

### 💻 3. Practical Commands
\`\`\`dockerfile
# Secure BuildKit secret mount during build stage
# syntax=docker/dockerfile:1.4
FROM node:20-alpine
WORKDIR /app

# Mount NPM token temporarily without saving it in image layers
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN=$(cat /run/secrets/npm_token) npm ci
\`\`\`

\`\`\`bash
# Build image using BuildKit secret mount from host file
DOCKER_BUILDKIT=1 docker build --secret id=npm_token,src=./.npmrc -t secure-api .

# Run container loading environment variables from file
docker run -d --name api --env-file .env.production -p 8080:8080 secure-api

# Verify environment variables inside running container
docker exec api printenv | grep LOG_LEVEL
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is passing passwords via CLI environment flags (\`-e PASSWORD=secret\`) considered insecure?**  
  *A:* CLI environment variables are stored in unencrypted format, visible in \`docker inspect\` output, accessible via \`/proc/[pid]/environ\` on the host, and frequently logged in CI/CD build logs. Mounting secrets as in-memory files (\`/run/secrets/\`) eliminates these risks.
- **Q: How does BuildKit \`--mount=type=secret\` protect build-time credentials?**  
  *A:* It mounts a temporary in-memory secret file from the host only for the execution of a specific \`RUN\` instruction. The file is never written to the image filesystem and does not appear in image history.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Refactor an application to consume credentials via Docker Secrets and BuildKit mounts.
2. **Steps:**
   - Create a local file: \`echo "super-secret-db-pass" > db_pass.txt\`
   - Build an image mounting the secret: \`DOCKER_BUILDKIT=1 docker build --secret id=db_pass,src=./db_pass.txt -t sec-test .\`
   - Run \`docker history sec-test\` to confirm the secret value does not exist in any image layer.`,
          },
          {
            id: "dock_mod_09",
            title: "Module 9: Private Registries, Image Tagging & CI/CD Push/Pull",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/jZ_y0C4K9l0",
            content: `### 📖 1. Theory
Container Registries store, manage, and distribute OCI container images across development and production environments:
- **Image Identifier Syntax:** \`<registry-domain>/<namespace>/<repository>:<tag>\` (e.g. \`ghcr.io/org/backend-api:v1.4.2\`).
- **Major Registry Platforms:**
  - **Docker Hub:** Standard cloud registry.
  - **AWS ECR (Elastic Container Registry):** Deeply integrated with AWS IAM roles and ECS/EKS.
  - **GHCR (GitHub Container Registry):** Native integration with GitHub Actions.
  - **Harbor:** Enterprise self-hosted open-source registry featuring vulnerability scanning and RBAC.
- **Tagging Best Practices:** Use Semantic Versioning (\`v1.2.3\`) and Git commit SHAs (\`sha-7f3a9b1\`). Avoid depending on mutable \`:latest\` tags in production environments.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: GitHub Actions Automated Build & Push Pipeline:** Configuring a GitHub Actions workflow that automatically builds multi-stage Docker images on every \`git push\`, scans them for CVEs, tags them with the Git commit SHA, and pushes artifacts to GHCR.
- **AWS ECR Immutable Tag Enforcement:** Enabling "Tag Immutability" in AWS ECR repositories to block developers or CI tools from overwriting existing release tags.

### 💻 3. Practical Commands
\`\`\`bash
# Authenticate CLI to GitHub Container Registry using token
echo $GHCR_PAT | docker login ghcr.io -u USERNAME --password-stdin

# Authenticate Docker CLI to AWS ECR in us-east-1
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Tag local image with registry domain and release tag
docker tag my-api:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-api:v1.2.0

# Push tagged image artifact to remote registry
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-api:v1.2.0

# Run local private Docker registry on port 5000
docker run -d -p 5000:5000 --name local-registry registry:2
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why should you avoid using the \`:latest\` image tag in production deployments?**  
  *A:* \`:latest\` is mutable and provides no version tracking. Kubernetes nodes with \`imagePullPolicy: IfNotPresent\` will skip pulling newer images if a \`:latest\` image exists locally. Rollbacks become impossible because previous \`:latest\` revisions are overwritten.
- **Q: What is a Docker Image Digest (\`@sha256:...\`)?**  
  *A:* An image digest is an immutable SHA256 cryptographic hash of the image manifest. Referencing an image by digest (e.g. \`nginx@sha256:7f3a9b...\`) guarantees bit-for-bit identical image deployments across all cluster nodes.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Deploy a local private registry, tag images, push, and verify retrieval.
2. **Steps:**
   - Launch local registry: \`docker run -d -p 5000:5000 --name registry-srv registry:2\`
   - Tag an image: \`docker tag alpine:latest localhost:5000/my-alpine:v1\`
   - Push to local registry: \`docker push localhost:5000/my-alpine:v1\`
   - Remove local copy: \`docker rmi localhost:5000/my-alpine:v1 alpine:latest\`
   - Pull back from local registry: \`docker pull localhost:5000/my-alpine:v1\`.`,
          },
          {
            id: "dock_mod_10",
            title: "Module 10: Health Checks, Self-Healing & Centralized Logging",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/S2pE9bS_U7w",
            content: `### 📖 1. Theory
Ensuring high system availability through proactive health probes and log aggregation:
- **Restart Policies:**
  - \`no\`: Never restart on exit.
  - \`on-failure[:max-retries]\`: Restart only if process terminates with non-zero exit code.
  - \`unless-stopped\`: Always restart unless explicitly stopped by administrator.
  - \`always\`: Always restart, including after host system reboots.
- **HEALTHCHECK Directive:** Periodically probes container internal state:
  - Statuses: \`starting\`, \`healthy\`, \`unhealthy\`.
  - Parameters: \`--interval=15s\`, \`--timeout=3s\`, \`--start-period=10s\`, \`--retries=3\`.
- **Logging Drivers:**
  - Default: \`json-file\` (writes JSON log files to host disk).
  - Production Drivers: \`syslog\`, \`journald\`, \`awslogs\` (CloudWatch), \`loki\`.
  - Log rotation configuration to prevent host disk space exhaustion.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Self-Healing Web Application Stack:** Configuring healthcheck probes on Node.js microservices. If event loop deadlocks occur, orchestrators mark the container \`unhealthy\` and trigger auto-restart routines.
- **Global Log Rotation Policy:** Setting \`max-size: 50m\` and \`max-file: 3\` in \`/etc/docker/daemon.json\` to prevent debug log files from consuming 100% of host root disk storage.

### 💻 3. Practical Commands
\`\`\`json
// /etc/docker/daemon.json - Global Log Rotation Setup
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
\`\`\`

\`\`\`dockerfile
# Healthcheck instruction inside Dockerfile
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
\`\`\`

\`\`\`bash
# Inspect detailed container health status and probe logs
docker inspect --format='{{json .State.Health}}' my-web | jq .

# Stream live log output limited to last 50 lines
docker logs -f --tail 50 my-web
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What happens when a container's HEALTHCHECK fails repeatedly in standalone Docker vs Docker Swarm?**  
  *A:* In standalone Docker, the engine updates the container status to \`unhealthy\`, but does NOT automatically restart it by default. In Docker Swarm or Kubernetes, orchestrators use this status to automatically terminate and replace the unhealthy container.
- **Q: Where does Docker store container log files by default on Linux systems?**  
  *A:* Under \`/var/lib/docker/containers/<container_id>/<container_id>-json.log\`.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Configure a Dockerfile \`HEALTHCHECK\`, verify transition from \`starting\` to \`healthy\`, and inspect JSON health logs.
2. **Steps:**
   - Launch an Nginx container with a custom healthcheck: \`docker run -d --name check-app --health-cmd="curl -f http://localhost/ || exit 1" --health-interval=5s nginx:alpine\`
   - Watch health status transition in \`docker ps\` from \`(health: starting)\` to \`(healthy)\`.
   - Inspect health log details using \`docker inspect\`.`,
          },
        ],
      },
      {
        id: "sec_docker_03",
        title: "Section 3: Container Security, Optimization & Enterprise Ops (Modules 11-15)",
        lessons: [
          {
            id: "dock_mod_11",
            title: "Module 11: Container Security Hardening & Non-Root Execution",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/f9-iYQ25K-g",
            content: `### 📖 1. Theory
Enforcing defense-in-depth container security to prevent container breakout and host OS compromise:
- **1. Non-Root User Execution:**
  - By default, container processes execute as \`root\` (UID 0). If a kernel vulnerability is exploited, the attacker inherits root access on the host.
  - Fix: Create and switch to an unprivileged user (\`USER 10001\`).
- **2. Linux Capabilities (Principle of Least Privilege):**
  - Drop default Linux kernel capabilities (\`--cap-drop=ALL\`) and re-add only mandatory capabilities (\`--cap-add=NET_BIND_SERVICE\`).
- **3. Read-Only Root Filesystem:**
  - Run containers with \`--read-only\` to block attackers from writing malicious binaries to disk.
- **4. No New Privileges & Seccomp:**
  - Enforce \`--security-opt=no-new-privileges:true\` to prevent SUID escalation.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Hardening Microservices Against RCE Exploits:** Implementing non-root user execution, dropped capabilities, read-only root filesystems, and in-memory \`tmpfs\` mounts for all production application containers.
- **Docker Socket Security:** Restricting access to \`/var/run/docker.sock\` to prevent unauthorized containers from gaining host root access.

### 💻 3. Practical Commands
\`\`\`dockerfile
# Hardened Non-Root Dockerfile Pattern
FROM node:20-alpine
WORKDIR /app

# Create dedicated non-root group and user with explicit UID
RUN addgroup -g 10001 appgroup && \
    adduser -u 10001 -G appgroup -s /bin/sh -D appuser

COPY --chown=appuser:appgroup . .
USER appuser

EXPOSE 3000
ENTRYPOINT ["node", "server.js"]
\`\`\`

\`\`\`bash
# Run container with maximum security hardening flags
docker run -d --name secure-app \
  --read-only \
  --tmpfs /tmp \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  --security-opt=no-new-privileges:true \
  -p 8080:3000 \
  my-hardened-app

# Verify execution user UID inside container
docker exec secure-app id
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is running containers as the root user dangerous even inside isolated namespaces?**  
  *A:* Root inside a container (UID 0) maps directly to root (UID 0) on the host kernel unless User Namespaces are enabled. If an attacker exploits a kernel flaw (e.g. Dirty COW) or accesses a mounted Docker socket, they gain instant root control over the host machine.
- **Q: What security risk does mounting \`/var/run/docker.sock\` inside a container introduce?**  
  *A:* The Docker daemon runs with root privileges. Mounting \`docker.sock\` gives the container full control over the Docker API, allowing it to spawn privileged containers that mount the host root filesystem (\`/\`), leading to complete host takeover.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Hardened container execution exercise with read-only root filesystems and dropped capabilities.
2. **Steps:**
   - Launch container with read-only flag: \`docker run --rm -it --read-only --tmpfs /tmp alpine sh\`
   - Inside container shell, attempt \`touch /test.txt\` and verify output returns \`Read-only file system\`.
   - Test creating a file in \`/tmp/test.txt\` and verify \`tmpfs\` allows temporary in-memory writes.`,
          },
          {
            id: "dock_mod_12",
            title: "Module 12: Vulnerability Scanning, SBOM & Image Provenance (Trivy, Cosign)",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/IPvYjXCsTg8",
            content: `### 📖 1. Theory
Automating container security scanning, Software Bill of Materials (SBOM) tracking, and image signing:
- **Vulnerability Scanners (Trivy, Grype, Docker Scout):**
  - Scans OS package repositories (Alpine, Debian, RedHat) and application language dependencies (npm, pip, maven, go) for known CVEs.
- **Software Bill of Materials (SBOM):**
  - Generated via tools like **Syft** (SPDX / CycloneDX format), creating an inventory manifest of every software component inside an image.
- **Image Signing & Verification (Cosign / Sigstore):**
  - Signs container images cryptographically using PKI key pairs or keyless OIDC authentication to verify image provenance and prevent tampering.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: CI/CD Security Quality Gate:** Configuring GitHub Actions to execute Trivy scans on built images. If any **CRITICAL** or **HIGH** severity CVE with an available fix is discovered, the CI pipeline halts automatically.
- **Kubernetes Admission Control Policy:** Enforcing a Kyverno policy in Kubernetes that rejects deploying any container image lacking a valid cryptographic signature from the company's Cosign public key.

### 💻 3. Practical Commands
\`\`\`bash
# Scan local Docker image for CVE vulnerabilities using Trivy
trivy image --severity HIGH,CRITICAL my-app:1.2.0

# Generate Software Bill of Materials (SBOM) in SPDX format using Syft
syft my-app:1.2.0 -o spdx-json > sbom.json

# Generate Cosign key pair for cryptographic signing
cosign generate-key-pair

# Cryptographically sign container image pushed to registry
cosign sign --key cosign.key ghcr.io/org/my-app:1.2.0

# Verify image signature before deploying to cluster
cosign verify --key cosign.pub ghcr.io/org/my-app:1.2.0
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do you remediate vulnerabilities identified by Trivy in a base image?**  
  *A:* 1) Upgrade base image tags to the latest security patch release (e.g. \`node:20.10-alpine\` $\\rightarrow$ \`node:20.15-alpine\`); 2) Switch to minimal base images like Distroless or Chainguard; 3) Update vulnerable application dependencies in package lockfiles.
- **Q: What is the primary purpose of image signing in supply chain security?**  
  *A:* Image signing guarantees that the container image deployed in production was authored by an authorized CI/CD pipeline and has not been altered or injected with malware prior to deployment.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Scan images for vulnerabilities using Trivy and generate an SBOM with Syft.
2. **Steps:**
   - Execute Trivy scan via Docker: \`docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image python:3.9-slim\`
   - Analyze returned CVE severities and identified package fix versions.`,
          },
          {
            id: "dock_mod_13",
            title: "Module 13: Resource Constraints, Cgroups v2 & Performance Tuning",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/S43v_zB1U08",
            content: `### 📖 1. Theory
Preventing "noisy neighbor" resource starvation and Out-Of-Memory (OOM) host crashes using Linux Control Groups (Cgroups v2):
- **Memory Limits:**
  - \`--memory\` (\`-m\`): Maximum RAM limit (e.g. \`512m\`, \`2g\`).
  - \`--memory-swap\`: Total RAM + Swap cap (set equal to \`--memory\` to disable swap memory).
  - **Linux OOM Killer:** If a container exceeds its allocated RAM limit, the Linux kernel invokes the OOM Killer, terminating PID 1 with exit code **137** (128 + 9 SIGKILL).
- **CPU Quotas & Shares:**
  - \`--cpus\`: Hard CPU execution limit (e.g. \`--cpus="1.5"\` permits 150% CPU capacity).
  - \`--cpu-shares\`: Proportional relative weight used during CPU contention (default 1024).
- **JVM Container Awareness:** Modern JVMs (\`-XX:+UseContainerSupport\`) automatically inspect Cgroup memory limits instead of total physical host RAM.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Preventing Host Node Crashes from Memory Leaks:** Setting explicit memory limits (\`--memory=1g --memory-swap=1g\`) on all containers. If a microservice leaks memory, only the faulty container is terminated, safeguarding host stability.
- **High-Concurrency Node.js CPU Tuning:** Capping background worker containers to specific CPU cores (\`--cpuset-cpus="0,1"\`) to isolate CPU intensive batch processing.

### 💻 3. Practical Commands
\`\`\`bash
# Run container capped at 512MB RAM and 1.5 CPU cores
docker run -d --name throttled-api \
  --memory=512m \
  --memory-swap=512m \
  --cpus="1.5" \
  --restart on-failure:3 \
  -p 8080:8080 my-api:1.0.0

# Stress test CPU and memory limits inside a container
docker run --rm -it progrium/stress --cpu 2 --vm 1 --vm-bytes 256M --timeout 15s

# Inspect container exit status to verify OOM Kill event
docker inspect throttled-api --format='{{.State.OOMKilled}} (ExitCode: {{.State.ExitCode}})'
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What does Exit Code 137 signify in Docker?**  
  *A:* Exit Code 137 indicates the container process received \`SIGKILL (Signal 9)\` ($128 + 9 = 137$). This is typically triggered by the Linux kernel Out-Of-Memory (OOM) Killer when a container violates memory limits.
- **Q: How does \`--cpu-shares\` differ from \`--cpus\`?**  
  *A:* \`--cpus\` imposes a hard execution time limit per CFS period regardless of system load. \`--cpu-shares\` is a soft proportional weight evaluated only when multiple containers actively compete for CPU cycles.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Trigger an OOM kill event by exceeding container memory limits and inspect the exit code.
2. **Steps:**
   - Launch a memory-capped container: \`docker run --name oom-test -m 30m alpine sh -c "python3 -c 'a = \"A\" * 100000000' 2>/dev/null || sleep 5"\`
   - Inspect container status: \`docker inspect oom-test --format='OOMKilled={{.State.OOMKilled}}, ExitCode={{.State.ExitCode}}'\`
   - Confirm \`OOMKilled=true\` and \`ExitCode=137\`.`,
          },
          {
            id: "dock_mod_14",
            title: "Module 14: Docker Daemon Operations, Storage Drivers & System Pruning",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/QZJ1drMQz1A",
            content: `### 📖 1. Theory
Operating and tuning the Docker Engine daemon (\`dockerd\`) on production Linux hosts:
- **Daemon Configuration:** Configured via \`/etc/docker/daemon.json\`.
- **Key Production Directives:**
  - \`live-restore\`: Keeps containers running even when the Docker daemon is restarted or upgraded.
  - \`default-ulimits\`: Configures global file descriptor (\`nofile\`) and process limits.
  - \`storage-driver\`: \`overlay2\` over \`xfs\` (with \`ftype=1\`) or \`ext4\` filesystems.
  - \`metrics-addr\`: Exposes Prometheus engine metrics on \`127.0.0.1:9323/metrics\`.
- **Garbage Collection & Pruning:** Dangling images (\`<none>:<none>\`), exited containers, and unused build caches consume disk space over time.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Zero-Downtime Docker Engine Maintenance:** Enabling \`"live-restore": true\` allows SREs to patch and restart the \`dockerd\` systemd service during host OS maintenance without terminating running customer web containers.
- **Automated Disk Cleanup Pipeline:** Executing a weekly system prune cron job (\`docker system prune -af --volumes --filter "until=168h"\`) to prevent build cache buildup.

### 💻 3. Practical Commands
\`\`\`json
// Production /etc/docker/daemon.json
{
  "live-restore": true,
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  },
  "metrics-addr": "127.0.0.1:9323",
  "experimental": true
}
\`\`\`

\`\`\`bash
# Reload Docker daemon configuration without dropping active containers
sudo systemctl reload docker

# Analyze host Docker disk space consumption breakdown
docker system df -v

# Prune unreferenced images and build caches older than 72 hours
docker system prune -af --filter "until=72h"

# Export container filesystem as a compressed tarball
docker export my-container > container.tar
cat container.tar | docker import - my-restored-image:v1
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the primary benefit of enabling \`live-restore\` in Docker's \`daemon.json\`?**  
  *A:* By default, restarting the Docker daemon stops all running containers. \`live-restore: true\` allows \`containerd\` to keep executing containers independently during Docker daemon upgrades or restarts, guaranteeing zero application downtime.
- **Q: What is a Dangling Image and how do you prune it?**  
  *A:* A dangling image is an unreferenced layer (displayed as \`<none>:<none>\`) created when a new image is built with an existing tag. Prune dangling images using \`docker image prune\`.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Inspect Docker disk space utilization and execute system cleanup routines.
2. **Steps:**
   - Check disk space breakdown: \`docker system df\`
   - Clean dangling resources: \`docker image prune -f\`
   - Verify reclaimed disk space summary.`,
          },
          {
            id: "dock_mod_15",
            title: "Module 15: Docker Swarm Orchestration & Migration to Kubernetes",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/IPvYjXCsTg8",
            content: `### 📖 1. Theory
Scaling from single-node Docker hosts to multi-node container orchestration:
- **Docker Swarm Architecture:**
  - **Manager Nodes:** Maintain cluster state using Raft consensus, schedule container tasks, and expose API endpoints.
  - **Worker Nodes:** Execute container tasks assigned by manager nodes.
  - **Routing Mesh:** Built-in Layer 4 ingress load balancer routing incoming requests on published ports to healthy tasks on any cluster node.
- **Docker Swarm vs Kubernetes Comparison:**
  - *Swarm:* Built into Docker CLI, simple setup (\`docker swarm init\`), ideal for small-to-medium deployment stacks.
  - *Kubernetes (K8s):* De facto industry standard, rich ecosystem (Helm, CRDs, Operators, GitOps), advanced autoscaling, service meshes.
- **Translating Concepts:**
  - Docker Compose Service $\\rightarrow$ Kubernetes Deployment + Service.
  - Named Volume $\\rightarrow$ PersistentVolumeClaim (PVC).
  - Docker Secret $\\rightarrow$ Kubernetes Secret.

### 🏢 2. Real-World DevOps Project & Use Cases
- **Project: Migrating Compose Stacks to Kubernetes:** Converting a multi-container \`docker-compose.yml\` stack into production Kubernetes manifests using **Kompose** (\`kompose convert\`) for deployment to AWS EKS.
- **Zero-Downtime Swarm Rolling Updates:** Executing rolling image updates across a 10-replica service stack with automatic rollback on failure.

### 💻 3. Practical Commands
\`\`\`bash
# Initialize a Docker Swarm manager node
docker swarm init --advertise-addr 192.168.1.10

# Deploy a multi-replica service across the cluster
docker service create --name web-cluster --replicas 5 -p 8080:80 nginx:alpine

# Scale service replicas dynamically
docker service scale web-cluster=10

# Perform zero-downtime rolling image update
docker service update --image nginx:1.25-alpine --update-parallelism 2 --update-delay 10s web-cluster

# Convert Docker Compose file into Kubernetes manifest files using Kompose
kompose convert -f docker-compose.yml -o k8s-manifests/
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does the Docker Swarm Ingress Routing Mesh function?**  
  *A:* The Swarm routing mesh enables every node in the cluster to accept connections on published service ports, even if that specific node is not currently running an instance of the task. IPVS kernel routing forwards traffic to active tasks on other nodes transparently.
- **Q: When should a DevOps team choose Kubernetes over Docker Swarm?**  
  *A:* Choose Kubernetes when requiring automated Horizontal Pod Autoscaling (HPA), advanced traffic routing (Canary deployments via Istio/Argo Rollouts), custom CRDs, fine-grained RBAC, or large-scale multi-cloud cluster management.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Initialize a single-node Swarm, deploy a replicated service, and execute a rolling update.
2. **Steps:**
   - Initialize swarm: \`docker swarm init\`
   - Create 3-replica service: \`docker service create --name echo-srv --replicas 3 -p 9090:80 nginx:alpine\`
   - Verify running tasks: \`docker service ps echo-srv\`
   - Execute rolling update: \`docker service update --image nginx:1.25-alpine echo-srv\`
   - Clean up: \`docker service rm echo-srv && docker swarm leave --force\`.`,
          },
        ],
      },
    ],
  },
  {
    id: "course_k8s_001",
    slug: "kubernetes-in-action",
    title: "Kubernetes: From Zero to Production",
    shortDescription: "Master the 20 essential pillars of Kubernetes: Control Plane Architecture, Pods, Deployments, Services, Ingress, PV/PVC, StatefulSets, RBAC, HPA, Helm, GitOps, Istio, and Production Ops.",
    description: "The definitive, hands-on Kubernetes masterclass engineered for DevOps practitioners, Cloud Architects, and SREs. From low-level control plane internals and pod scheduling to enterprise multi-cluster GitOps with ArgoCD, Zero-Trust Istio Service Mesh, Helm 3 chart authoring, Prometheus/Grafana observability, and CKA/CKAD exam prep. Every module contains deep theory, real-world production scenarios, kubectl commands, YAML manifests, interview Q&As, and hands-on practical labs.",
    category: "Kubernetes",
    level: "advanced",
    price: 2999,
    isPro: true,
    isFeatured: true,
    rating: 4.9,
    totalRatings: 4120,
    totalStudents: 31500,
    totalLessons: 20,
    durationHours: 30,
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer (CKA & CKAD Certified)",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=600",
    icon: React.createElement(SiKubernetes),
    color: "from-blue-600 to-indigo-600",
    tags: ["Kubernetes", "K8s", "Helm", "RBAC", "ArgoCD", "Istio", "CKA", "CKAD", "Prometheus", "StatefulSets"],
    whatYouLearn: [
      "Master Kubernetes Control Plane & Worker Node internals: etcd Raft, API Server, Scheduler, Kubelet, and CNI",
      "Deploy and manage core workloads: Pods, Deployments, ReplicaSets, StatefulSets, DaemonSets, and CronJobs",
      "Architect software-defined networking: ClusterIP, NodePort, LoadBalancer Services, Ingress Controllers, and Gateway API",
      "Configure persistent storage: StorageClasses, PersistentVolumes (PV), Claims (PVC), dynamic CSI drivers, and Volume Snapshots",
      "Harden Kubernetes security: RBAC Roles/Bindings, ServiceAccounts, NetworkPolicies, Pod Security Standards (PSS), and Kyverno",
      "Implement multi-dimensional autoscaling: Horizontal Pod Autoscaler (HPA v2), KEDA event-driven scaling, and AWS Karpenter",
      "Package enterprise applications using Helm 3 chart authoring, templating functions, dependencies, and releases",
      "Automate Continuous Delivery with GitOps: ArgoCD, FluxCD, automated sync, self-healing, and drift detection",
      "Deploy Zero-Trust Service Mesh architectures with Istio: mTLS encryption, Traffic Splitting, Envoy proxies, and VirtualServices",
      "Achieve Production Operations & CKA/CKAD Certification: etcd snapshot backups, Velero disaster recovery, and Prometheus monitoring",
    ],
    requirements: ["Basic Linux command line knowledge", "Fundamental Docker and containerization understanding"],
    updatedAt: "2026-09-21",
    sections: [
      {
        id: "sec_k8s_01",
        title: "Section 1: Beginner - Kubernetes Fundamentals & Architecture (Modules 1-5)",
        lessons: [
          {
            id: "k8s_mod_01",
            title: "Module 1: Container Orchestration & Kubernetes Architecture",
            duration: 45,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/X48VuDVv0do",
            content: `### 📖 1. Theory
Kubernetes (K8s) is an open-source container orchestration engine that automates application deployment, scaling, and management across cluster nodes:
- **Control Plane Architecture (Master Nodes):**
  - **\`kube-apiserver\`:** The central management hub and sole entry point for API requests; handles Authentication, Authorization (RBAC), and Admission Control.
  - **\`etcd\`:** Consistent, highly available distributed key-value store maintaining total cluster state (backed by the Raft consensus algorithm).
  - **\`kube-scheduler\`:** Assigns unassigned Pods to healthy worker nodes based on resource availability, affinity rules, and taints/tolerations.
  - **\`kube-controller-manager\`:** Runs core controllers (NodeController, DeploymentController, ServiceAccountController) enforcing desired state reconciliation.
- **Worker Node Components:**
  - **\`kubelet\`:** Primary node agent ensuring assigned Pod containers are running and healthy.
  - **\`kube-proxy\`:** Manages network routing rules (\`iptables\` / \`IPVS\` / eBPF) on each node to load balance traffic across Pod endpoints.
  - **Container Runtime:** \`containerd\` / \`Cilium\` executing OCI container specs.

### 🏢 2. Real-World DevOps Examples
- **High Availability Control Plane Setup:** Deploying a multi-master control plane (3 master nodes in separate Availability Zones) to guarantee 99.99% uptime for \`kube-apiserver\` and \`etcd\` quorum.
- **Automated Self-Healing:** If a physical worker node experiences hardware failure, \`kube-controller-manager\` detects node unreachability after 5 minutes and automatically reschedules lost Pods onto healthy nodes.

### 💻 3. Practical Commands
\`\`\`bash
# Inspect cluster control plane component health and API endpoint
kubectl cluster-info

# List all cluster nodes with internal/external IPs and OS details
kubectl get nodes -o wide

# Inspect all control plane system pods running in kube-system namespace
kubectl get pods -n kube-system

# Display detailed metrics and events for a specific master node
kubectl describe node master-01
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the role of \`etcd\` in Kubernetes and why is an odd number of nodes required for High Availability?**  
  *A:* \`etcd\` is the single source of truth storing all cluster state and metadata. It uses the Raft consensus protocol, which requires a strict majority quorum $Q = \lfloor N/2 \rfloor + 1$. An odd number of nodes (3, 5, or 7) avoids split-brain ties and allows a 3-node cluster to tolerate 1 node failure without losing quorum.
- **Q: What steps occur when you execute \`kubectl apply -f deployment.yaml\`?**  
  *A:* 1) \`kubectl\` validates YAML and sends HTTP POST to \`kube-apiserver\`; 2) \`kube-apiserver\` authenticates, authorizes (RBAC), applies admission controllers, and writes desired spec to \`etcd\`; 3) \`DeploymentController\` detects change and creates a ReplicaSet; 4) \`ReplicaSetController\` creates Pod specs; 5) \`kube-scheduler\` assigns Pods to nodes; 6) \`kubelet\` on assigned nodes pulls images and launches containers via \`containerd\`.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Inspect Kubernetes control plane static Pod manifests and component endpoints.
2. **Steps:**
   - Execute \`kubectl cluster-info\` to retrieve the API server URL.
   - Query all control plane pods: \`kubectl get pods -n kube-system -l tier=control-plane\`
   - Inspect static pod manifests on master node under \`/etc/kubernetes/manifests/\` (\`kube-apiserver.yaml\`, \`etcd.yaml\`).`,
          },
          {
            id: "k8s_mod_02",
            title: "Module 2: Pod Internals, Multi-Container Patterns & Lifecycle",
            duration: 50,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/rK690x3eZtY",
            content: `### 📖 1. Theory
A Pod is the smallest deployable atomic object in Kubernetes, wrapping one or more co-located containers that share network, storage, and IPC namespaces:
- **Shared Pod Namespaces:**
  - *Network Namespace:* Containers inside the same Pod share the exact same IP address and port space (\`localhost\` communication).
  - *Storage Volumes:* Containers can share mounted \`emptyDir\` or persistent storage volumes.
- **Multi-Container Pod Patterns:**
  - **Sidecar Pattern:** Enhances main container capabilities (e.g. Envoy proxy, logging sidecar, vault agent).
  - **Ambassador Pattern:** Proxies connection traffic (e.g. local database proxy connection).
  - **Adapter Pattern:** Standardizes output (e.g. converting heterogeneous application metrics to Prometheus format).
- **Pod Lifecycle Phases:** \`Pending\` $\\rightarrow$ \`Running\` $\\rightarrow$ \`Succeeded\` / \`Failed\` / \`Unknown\`.
- **Container Types:** Init Containers (execute sequentially before app containers start) vs Native Sidecars (\`restartPolicy: Always\` inside \`initContainers\` block).

### 🏢 2. Real-World DevOps Examples
- **Database Dependency Gate:** Using an Init Container running \`nc -z postgres-db 5432\` to pause application container startup until the PostgreSQL database finishes booting and accepts TCP connections.
- **Log Streaming Sidecar:** Running a Fluentbit sidecar container alongside a legacy web server inside the same Pod, reading access logs from a shared \`emptyDir\` volume and streaming them to Loki.

### 💻 3. Practical Commands
\`\`\`yaml
# Multi-Container Pod with Init Container (pod.yaml)
apiVersion: v1
kind: Pod
metadata:
  name: web-app-pod
  labels:
    app: web
spec:
  initContainers:
  - name: check-db
    image: busybox:1.36
    command: ['sh', '-c', 'until nc -z postgres-svc 5432; do echo waiting for db; sleep 2; done;']
  containers:
  - name: web-app
    image: nginx:alpine
    ports:
    - containerPort: 80
\`\`\`

\`\`\`bash
# Create pod imperatively and attach interactive terminal
kubectl run debug-pod --image=nicolaka/netshoot -it --rm -- bash

# Inspect detailed container status and init container progress
kubectl describe pod web-app-pod

# Stream logs from a specific container inside a multi-container pod
kubectl logs -f web-app-pod -c check-db
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why does Kubernetes group containers into Pods rather than running containers individually?**  
  *A:* Pods allow multiple tightly coupled containers to share an identical network namespace (\`localhost\`), storage volumes, and process lifecycle boundaries without forcing developers to merge distinct application processes into a single container image.
- **Q: What is the execution behavior difference between Init Containers and standard App Containers?**  
  *A:* Init Containers execute sequentially to completion ONE BY ONE before any app containers start. If an Init Container fails, Kubernetes restarts the Pod until the Init Container completes successfully (unless \`restartPolicy: Never\`). App containers run concurrently in parallel.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Deploy a multi-container Pod featuring an Init Container readiness gate.
2. **Steps:**
   - Save the multi-container YAML manifest above to \`init-pod.yaml\`.
   - Apply manifest: \`kubectl apply -f init-pod.yaml\`
   - Check Pod status: \`kubectl get pod web-app-pod\` (observe status \`Init:0/1\`).
   - Create a temporary PostgreSQL service or delete the pod to observe completion.`,
          },
          {
            id: "k8s_mod_03",
            title: "Module 3: Deployments, ReplicaSets & Rolling Update Strategies",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/qg_z1Y5s9Y4",
            content: `### 📖 1. Theory
Deployments provide declarative updates for Pods and ReplicaSets, managing application scaling, rolling updates, and automated rollbacks:
- **Deployment Hierarchy:** \`Deployment\` $\\rightarrow$ manages $\\rightarrow$ \`ReplicaSet\` $\\rightarrow$ manages $\\rightarrow$ \`Pods\`.
- **Deployment Rollout Strategies:**
  - **RollingUpdate (Default):** Gradually replaces old Pods with new ones without downtime. Controlled by:
    - \`maxSurge\`: Maximum count or percentage of Pods that can be created ABOVE desired replica count (e.g. \`25%\`).
    - \`maxUnavailable\`: Maximum count or percentage of Pods that can be unavailable during rollout (e.g. \`25%\`).
  - **Recreate:** Terminates ALL existing Pods simultaneously before launching new revision (causes temporary downtime; used for non-concurrent database migrations).
- **Revision History:** Every spec modification creates a new tagged ReplicaSet revision stored for instant rollbacks.

### 🏢 2. Real-World DevOps Examples
- **Zero-Downtime Release Pipeline:** Deploying v2.0 of an API microservice with 20 replicas using \`maxSurge: 25%\` and \`maxUnavailable: 0\`. Kubernetes launches 5 new v2 Pods before terminating any v1 Pods, ensuring zero dropped user requests.
- **Instant Emergency Rollback:** Rolling back a buggy deployment (\`v2.1.0\`) that introduced 500 errors to the last known stable revision (\`v2.0.0\`) in 3 seconds via \`kubectl rollout undo\`.

### 💻 3. Practical Commands
\`\`\`bash
# Create Deployment imperatively with 3 replicas
kubectl create deployment api-server --image=nginx:1.24-alpine --replicas=3

# Scale Deployment replicas dynamically
kubectl scale deployment api-server --replicas=5

# Update image tag triggering a live RollingUpdate
kubectl set image deployment/api-server nginx=nginx:1.25-alpine

# Monitor live rollout status in real-time
kubectl rollout status deployment/api-server

# View historical rollout revision numbers
kubectl rollout history deployment/api-server

# Rollback immediately to previous stable revision
kubectl rollout undo deployment/api-server
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do \`maxSurge\` and \`maxUnavailable\` prevent outages during Deployment rollouts?**  
  *A:* \`maxSurge: 0\` with \`maxUnavailable: 1\` ensures the deployment never exceeds its target replica count, but drops 1 pod during updates. Setting \`maxUnavailable: 0\` guarantees zero capacity loss by creating new surge Pods first before deleting old ones.
- **Q: Why should you never edit ReplicaSets directly when using Deployments?**  
  *A:* The Deployment controller actively enforces desired state. If you modify a ReplicaSet manually, the Deployment controller will immediately overwrite your changes to match the parent Deployment manifest spec.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Perform a zero-downtime Deployment update, monitor rollout status, and execute an emergency rollback.
2. **Steps:**
   - Create deployment: \`kubectl create deployment web-app --image=nginx:1.23 --replicas=4\`
   - Update image to an invalid tag to break rollout: \`kubectl set image deployment/web-app nginx=nginx:invalid-tag\`
   - Monitor rollout hang: \`kubectl rollout status deployment/web-app\`
   - Abort and undo rollout: \`kubectl rollout undo deployment/web-app\`
   - Confirm all 4 pods return to \`Running\` state.`,
          },
          {
            id: "k8s_mod_04",
            title: "Module 4: Services & Internal Cluster Networking",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/T4Z7visMM4E",
            content: `### 📖 1. Theory
A Service is an abstract Kubernetes resource defining a logical set of Pods and a policy to access them via a stable virtual IP (ClusterIP) or DNS name:
- **Service Types:**
  - **ClusterIP (Default):** Exposes service on an internal cluster IP address; accessible ONLY from inside the cluster.
  - **NodePort:** Exposes service on every worker node's IP at a static high port (\`30000-32767\`).
  - **LoadBalancer:** Provisions an external cloud load balancer (AWS NLB/ALB, GCP CLB) automatically pointing to NodePorts.
  - **ExternalName:** Maps service to an external DNS CNAME record (e.g. \`database.rds.amazonaws.com\`).
- **Service Discovery & EndpointSlices:** Services select Pods matching \`spec.selector\` labels and automatically maintain \`EndpointSlices\` detailing target Pod IP addresses and ports.
- **\`kube-proxy\` Networking Modes:** \`iptables\` mode (random packet distribution via PREROUTING), \`IPVS\` mode (hash table routing for 10,000+ services), eBPF mode (Cilium direct socket routing).

### 🏢 2. Real-World DevOps Examples
- **Stable Internal Microservice Discovery:** Backend services connect to payment microservice via internal DNS \`http://payment-svc.prod.svc.cluster.local:8080\`, immune to backend Pod IP terminations and restarts.
- **Connecting to External Cloud Databases:** Creating an \`ExternalName\` Service allowing Kubernetes pods to reference \`rds-db.production.svc.cluster.local\` without hardcoding external AWS endpoints in application code.

### 💻 3. Practical Commands
\`\`\`yaml
# ClusterIP Service Manifest (service.yaml)
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
\`\`\`

\`\`\`bash
# Create NodePort service imperatively
kubectl expose deployment api-server --type=NodePort --port=80 --target-port=8080 --name=api-nodeport

# Inspect auto-generated EndpointSlices tracking active Pod IPs
kubectl get endpointslices -l kubernetes.io/service-name=backend-service

# Port-forward local workstation port directly to a ClusterIP service for testing
kubectl port-forward svc/backend-service 8080:80
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does a ClusterIP Service route traffic to backend Pods without a physical network interface?**  
  *A:* ClusterIPs are virtual IPs. \`kube-proxy\` programs the Linux kernel using \`iptables\` PREROUTING rules or \`IPVS\` kernel hash tables to rewrite virtual ClusterIP destination headers to real Pod IPs (Destination NAT).
- **Q: What is the difference between \`port\` and \`targetPort\` in a Service spec?**  
  *A:* \`port\` is the external port exposed by the Service itself inside the cluster. \`targetPort\` is the actual container port listening inside the backend Pod where traffic is forwarded.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Expose a web deployment using ClusterIP and NodePort Services and inspect active EndpointSlices.
2. **Steps:**
   - Create deployment: \`kubectl create deployment web-demo --image=nginx:alpine --replicas=3\`
   - Expose as ClusterIP: \`kubectl expose deployment web-demo --port=80 --target-port=80\`
   - Inspect active backend Pod IPs tracked in endpoints: \`kubectl get endpoints web-demo\`
   - Test connectivity via temporary pod: \`kubectl run test-curl --rm -it --image=curlimages/curl -- curl -s http://web-demo\`.`,
          },
          {
            id: "k8s_mod_05",
            title: "Module 5: Ingress Controllers & Modern Gateway API",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/40VZuXEW7fM",
            content: `### 📖 1. Theory
Ingress manages external HTTP and HTTPS access to cluster services, providing Layer 7 path and host-based routing, SSL/TLS termination, and name-based virtual hosting:
- **Ingress Controller Architecture:** An Ingress resource is merely a rule definition; it requires an Ingress Controller (e.g. Ingress-Nginx, Envoy, Traefik) running in the cluster to process rules and configure reverse proxies dynamically.
- **Ingress Features:**
  - *Host-Based Routing:* \`app.company.com\` $\\rightarrow$ Service A; \`api.company.com\` $\\rightarrow$ Service B.
  - *Path-Based Routing:* \`company.com/web\` $\\rightarrow$ Service A; \`company.com/api\` $\\rightarrow$ Service B.
  - *TLS Termination:* Offloading heavy SSL decryption at the ingress boundary using secret tls keys.
- **Next-Gen Kubernetes Gateway API:** Replaces legacy Ingress with expressive, role-oriented CRDs: \`GatewayClass\` (infrastructure provider), \`Gateway\` (network listener point), and \`HTTPRoute\` (routing rules managed by app developers).

### 🏢 2. Real-World DevOps Examples
- **Single Cloud Load Balancer Cost Savings:** Routing 30 microservices behind a single AWS Application Load Balancer via Ingress-Nginx instead of provisioning 30 expensive individual \`Type: LoadBalancer\` cloud services.
- **Automated SSL Certificate Provisioning:** Integrating Ingress resources with \`cert-manager\` using annotation \`cert-manager.io/cluster-issuer: letsencrypt-prod\` for automatic TLS certificate creation.

### 💻 3. Practical Commands
\`\`\`yaml
# Host & Path-Based Ingress Manifest (ingress.yaml)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.company.com
    secretName: api-tls-cert
  rules:
  - host: api.company.com
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: api-v1-svc
            port:
              number: 80
\`\`\`

\`\`\`bash
# List all ingress rules across all namespaces
kubectl get ingress -A

# Inspect detailed Ingress controller configuration and backend targets
kubectl describe ingress main-ingress
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why was the new Kubernetes Gateway API created to replace the legacy Ingress API?**  
  *A:* Legacy Ingress forced infrastructure admins and app developers to edit the single same monolithic Ingress resource, leading to collision errors and vendor-specific annotation clutter. Gateway API decouples roles into \`GatewayClass\` (Infrastructure Owner), \`Gateway\` (Cluster Admin), and \`HTTPRoute\` (Application Developer).
- **Q: What happens if you deploy an Ingress YAML resource in a cluster without an active Ingress Controller?**  
  *A:* The Ingress resource will be saved in \`etcd\`, but nothing will happen. The \`ADDRESS\` field will remain blank because no controller is executing to process rules or provision reverse proxies.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Deploy a path-based Ingress rule and test route execution.
2. **Steps:**
   - Apply an Ingress resource defining \`/api\` and \`/web\` backend path routing.
   - Inspect status: \`kubectl get ingress\`
   - Test route execution using \`curl -H "Host: api.company.com" http://<INGRESS_IP>/v1\`.`,
          },
        ],
      },
      {
        id: "sec_k8s_02",
        title: "Section 2: Intermediate - Storage, Security & Configuration (Modules 6-10)",
        lessons: [
          {
            id: "k8s_mod_06",
            title: "Module 6: Persistent Storage: PV, PVC, StorageClasses & CSI",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/0czw12uLw4g",
            content: `### 📖 1. Theory
Managing persistent data storage in Kubernetes using decoupled volume abstractions:
- **Core Storage Abstractions:**
  - **PersistentVolume (PV):** A piece of storage in the cluster provisioned by an administrator or dynamically provisioned using StorageClasses.
  - **PersistentVolumeClaim (PVC):** A request for storage by a user/Pod specifying size, access modes, and StorageClass.
  - **StorageClass:** Defines storage provisioners (e.g. AWS EBS CSI \`ebs.csi.aws.com\`, GCP PD, Rook-Ceph) and volume parameters (SSD vs HDD, IOPS).
- **Access Modes:**
  - \`ReadWriteOnce (RWO)\`: Volume mounted as read-write by a single node.
  - \`ReadOnlyMany (ROX)\`: Volume mounted as read-only by many nodes.
  - \`ReadWriteMany (RWX)\`: Volume mounted as read-write by many nodes (requires NFS/EFS/Ceph).
  - \`ReadWriteOncePod (RWOP)\`: Volume mounted as read-write by a single Pod.
- **Reclaim Policies:** \`Delete\` (deletes underlying storage asset upon PVC deletion) vs \`Retain\` (preserves manual storage volume for manual recovery).

### 🏢 2. Real-World DevOps Examples
- **Dynamic AWS EBS Provisioning:** A developer applies a 100Gi PVC with \`storageClassName: ebs-gp3\`. The AWS EBS CSI driver automatically calls AWS APIs to create a \`gp3\` EBS volume and binds it to the PV without admin intervention.
- **High-Performance Shared Storage:** Provisioning an AWS EFS CSI driver with \`ReadWriteMany\` access mode allowing 20 web scraper pods across different nodes to write output files to a shared file system.

### 💻 3. Practical Commands
\`\`\`yaml
# PersistentVolumeClaim Manifest (pvc.yaml)
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ebs-gp3
  resources:
    requests:
      storage: 20Gi
\`\`\`

\`\`\`bash
# List all StorageClasses and check default provisioner
kubectl get sc

# Inspect status and binding of PVs and PVCs
kubectl get pv,pvc -A

# Describe PVC to troubleshoot binding errors (e.g. insufficient quota, pending CSI driver)
kubectl describe pvc postgres-pvc
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the dynamic volume provisioning flow when a Pod requests a PVC?**  
  *A:* 1) User applies PVC; 2) \`StorageClass\` controller detects PVC and triggers Container Storage Interface (CSI) driver; 3) CSI driver calls cloud API to create physical disk; 4) CSI driver creates PV object in K8s and binds it to PVC; 5) K8s attaches and mounts volume to worker node upon Pod scheduling.
- **Q: What is the difference between \`ReclaimPolicy: Retain\` and \`ReclaimPolicy: Delete\`?**  
  *A:* \`Delete\` automatically wipes the underlying cloud storage disk when the PVC is deleted. \`Retain\` preserves the storage asset in the cloud provider even if the PVC is deleted, allowing SREs to recover critical database files manually.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Create a PVC using a local StorageClass, attach it to a database Pod, and verify data persistence.
2. **Steps:**
   - Apply PVC manifest requesting 5Gi storage.
   - Deploy PostgreSQL pod referencing \`claimName: postgres-pvc\`.
   - Write data to database, delete the Pod, and verify data persists on the new Pod.`,
          },
          {
            id: "k8s_mod_07",
            title: "Module 7: StatefulSets & Managing Distributed Databases",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/2v-Nhh9qH4A",
            content: `### 📖 1. Theory
StatefulSets manage stateful applications requiring unique network identities, ordered deployments, and dedicated persistent storage:
- **Core StatefulSet Features:**
  - **Stable Ordinal Indexing:** Pod names are assigned sticky integer indexes (\`kafka-0\`, \`kafka-1\`, \`kafka-2\`).
  - **Stable Network Identity:** Paired with a **Headless Service** (\`clusterIP: None\`) providing predictable DNS records (\`kafka-0.kafka-hs.prod.svc.cluster.local\`).
  - **Dedicated Volume Provisioning:** Uses \`volumeClaimTemplates\` to generate a unique PVC for *every single Pod instance* (\`data-kafka-0\`, \`data-kafka-1\`).
  - **Ordered Pod Management:** Deploys, updates, and scales Pods sequentially from $0 \\rightarrow N-1$ (or parallel via \`podManagementPolicy: Parallel\`).

### 🏢 2. Real-World DevOps Examples
- **Running a Production MongoDB Replica Set:** Deploying a 3-node MongoDB cluster using StatefulSets. Node \`mongo-0\` initializes as Primary, while \`mongo-1\` and \`mongo-2\` join as Secondaries using sticky headless DNS addresses.
- **Elasticsearch Cluster Scaling:** Scaling Elasticsearch node capacity up from 3 to 5 replicas. StatefulSet creates \`es-3\` and \`es-4\` with independent PV storage automatically attached.

### 💻 3. Practical Commands
\`\`\`yaml
# Headless Service & StatefulSet Snippet (statefulset.yaml)
apiVersion: v1
kind: Service
metadata:
  name: redis-headless
spec:
  clusterIP: None
  selector:
    app: redis-cluster
  ports:
  - port: 6379
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-cluster
spec:
  serviceName: redis-headless
  replicas: 3
  selector:
    matchLabels:
      app: redis-cluster
  template:
    metadata:
      labels:
        app: redis-cluster
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
  volumeClaimTemplates:
  - metadata:
      name: redis-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
\`\`\`

\`\`\`bash
# List all active StatefulSets and check ordinal replica readiness
kubectl get statefulset

# Perform DNS resolution query for individual StatefulSet Pod index
kubectl run -it --rm debug --image=tutum/dnsutils -- nslookup redis-cluster-0.redis-headless
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why do StatefulSets require a Headless Service (\`clusterIP: None\`)?**  
  *A:* Standard Services load balance traffic randomly across Pods via ClusterIP. Stateful applications (like database master/replicas) require direct network access to specific Pod instances. A Headless Service bypasses load balancing and creates direct DNS A records for each ordinal Pod name.
- **Q: What happens to PVCs when a StatefulSet is deleted or scaled down?**  
  *A:* Scaling down or deleting a StatefulSet does NOT delete the PVCs associated with the Pods. This prevents catastrophic data loss; SREs must delete PVCs manually if storage reclamation is desired.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Deploy a 3-replica Redis StatefulSet with a Headless Service and test ordinal DNS lookups.
2. **Steps:**
   - Apply the \`statefulset.yaml\` manifest above.
   - Watch sequential Pod creation: \`kubectl get pods -w\` (observe \`redis-cluster-0\`, then \`1\`, then \`2\`).
   - Query Pod DNS records using \`nslookup redis-cluster-0.redis-headless\`.`,
          },
          {
            id: "k8s_mod_08",
            title: "Module 8: ConfigMaps, Secrets & 12-Factor Configuration",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/7X8m3gS-h0k",
            content: `### 📖 1. Theory
Decoupling application configuration and sensitive credentials from container images following 12-Factor App design principles:
- **ConfigMaps:** Stores non-confidential configuration data as key-value pairs or entire configuration files (e.g. \`nginx.conf\`, \`application.properties\`).
- **Secrets:** Stores sensitive data (passwords, TLS certs, API keys, \`dockerconfigjson\` registry tokens):
  - Secret Types: \`Opaque\` (generic), \`kubernetes.io/tls\` (SSL certs), \`kubernetes.io/dockerconfigjson\` (private registry auth).
  - Data values in manifest YAML are \`base64\` encoded (NOT encrypted by default unless KMS Encryption at Rest is configured in \`etcd\`).
- **Consumption Mechanisms:**
  - *Environment Variables:* Injected at container startup (does NOT auto-update on ConfigMap edit).
  - *Volume Mounts:* Mounted as files inside container directories (auto-updates dynamically without container restart).

### 🏢 2. Real-World DevOps Examples
- **Dynamic Nginx Config Injection:** Mounting a custom \`nginx.conf\` file via ConfigMap volume into \`/etc/nginx/conf.d/\`. Updating the ConfigMap updates the file inside running Pods automatically.
- **External Secrets Operator (ESO) Integration:** Automatically syncing production secrets from AWS Secrets Manager or HashiCorp Vault directly into Kubernetes Secrets.

### 💻 3. Practical Commands
\`\`\`bash
# Create ConfigMap from literal values
kubectl create configmap app-config --from-literal=LOG_LEVEL=debug --from-literal=DB_HOST=postgres-svc

# Create Secret from local file
kubectl create secret generic db-credentials --from-file=./password.txt

# Decode a base64 encoded secret string from CLI
kubectl get secret db-credentials -o jsonpath='{.data.password\.txt}' | base64 --decode

# Inject environment variables from ConfigMap in Pod spec
# envFrom: [ { configMapRef: { name: app-config } } ]
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Are Kubernetes Secrets secure out-of-the-box?**  
  *A:* No. By default, Secret data values in YAML files and \`etcd\` are merely \`base64\` encoded strings that can be decoded instantly. Secure production clusters require enabling KMS Encryption at Rest in \`kube-apiserver\` and locking down RBAC permissions.
- **Q: How do updates to ConfigMaps reflect inside running Pods?**  
  *A:* ConfigMaps consumed as Mounted Volumes automatically update files inside containers after a short delay (kubelet cache sync period). ConfigMaps consumed as Environment Variables do NOT update dynamically and require a Pod restart.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Create a ConfigMap and Secret, mount them into a Pod via volume and env variables, and verify updates.
2. **Steps:**
   - Create ConfigMap: \`kubectl create configmap web-cfg --from-literal=APP_COLOR=blue\`
   - Deploy Pod consuming \`APP_COLOR\` as an environment variable.
   - Verify environment variable: \`kubectl exec web-pod -- env | grep APP_COLOR\`.`,
          },
          {
            id: "k8s_mod_09",
            title: "Module 9: Role-Based Access Control (RBAC) & Service Accounts",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/5a2xWnJk1t8",
            content: `### 📖 1. Theory
Role-Based Access Control (RBAC) regulates user and workload access to Kubernetes API resources based on roles and permissions:
- **Authentication Subjects:**
  - **User Accounts:** Humans/systems authenticated via external IdPs (OIDC, X.509 certs, AWS IAM).
  - **ServiceAccounts:** Identities managed natively in Kubernetes for in-cluster Pod process authentication.
- **RBAC API Primitives:**
  - **Role:** Defines permissions (Verbs: \`get\`, \`list\`, \`watch\`, \`create\`, \`update\`, \`delete\`) on API resources within a *single namespace*.
  - **ClusterRole:** Defines permissions across *all namespaces* or cluster-scoped resources (Nodes, PVs).
  - **RoleBinding:** Grants a Role or ClusterRole permissions to a subject within a *specific namespace*.
  - **ClusterRoleBinding:** Grants a ClusterRole permissions across the *entire cluster*.

### 🏢 2. Real-World DevOps Examples
- **Scoped CI/CD Service Account:** Creating a ServiceAccount for GitHub Actions scoped via \`RoleBinding\` to allow deployments ONLY inside the \`staging\` namespace, preventing pipeline scripts from modifying \`production\`.
- **Developer Read-Only Cluster Role:** Creating a \`ClusterRole\` granting developers \`get\`, \`list\`, and \`watch\` access to Pods and logs across all namespaces while blocking exec and delete operations.

### 💻 3. Practical Commands
\`\`\`yaml
# Namespace-Scoped Role & Binding Manifest (rbac.yaml)
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: dev
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
  namespace: dev
subjects:
- kind: ServiceAccount
  name: dev-sa
  namespace: dev
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

\`\`\`bash
# Test API permissions for a specific user or ServiceAccount using auth can-i
kubectl auth can-i create deployments --namespace=dev --as=system:serviceaccount:dev:dev-sa

# Audit all ClusterRoleBindings granting cluster-admin privileges
kubectl get clusterrolebindings -o json | jq '.items[] | select(.roleRef.name=="cluster-admin")'
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the difference between a \`Role\` and a \`ClusterRole\` in Kubernetes RBAC?**  
  *A:* A \`Role\` is namespace-scoped; its permissions apply only within the specific namespace where it is defined. A \`ClusterRole\` is cluster-scoped; it can define permissions for cluster-wide resources (Nodes, PVs, Namespaces) or be bound across all namespaces.
- **Q: How do you verify if a ServiceAccount has permission to perform a specific action?**  
  *A:* Execute \`kubectl auth can-i <verb> <resource> --as=system:serviceaccount:<namespace>:<serviceaccount-name>\`.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Create a ServiceAccount, restrict its permissions with a Role, and test with \`kubectl auth can-i\`.
2. **Steps:**
   - Create ServiceAccount: \`kubectl create serviceaccount test-sa -n default\`
   - Apply the \`pod-reader\` Role and RoleBinding YAML above.
   - Run \`kubectl auth can-i get pods --as=system:serviceaccount:default:test-sa\` (verify \`yes\`).
   - Run \`kubectl auth can-i delete pods --as=system:serviceaccount:default:test-sa\` (verify \`no\`).`,
          },
          {
            id: "k8s_mod_10",
            title: "Module 10: Pod Security Standards, Admission Controllers & Security Contexts",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
Enforcing hardened security controls on Pod workloads and API server admission pipelines:
- **Security Contexts:** Defines privilege and access control settings for Pods and Containers:
  - \`runAsNonRoot: true\`: Enforces unprivileged non-root UID execution.
  - \`readOnlyRootFilesystem: true\`: Prevents writing binaries to disk.
  - \`capabilities.drop: ["ALL"]\`: Drops unnecessary Linux kernel capabilities.
  - \`allowPrivilegeEscalation: false\`: Prevents SUID binary privilege escalation.
- **Pod Security Standards (PSS):** Built-in namespace admission standards:
  - **Privileged:** Unrestricted access (used by system CNI/monitoring agents).
  - **Baseline:** Minimally restrictive policy preventing known privilege escalations.
  - **Restricted:** Heavily hardened policy enforcing non-root and capability dropping.
- **Admission Webhooks:** Mutating Admission Webhooks (modify specs, e.g. inject sidecars) vs Validating Admission Webhooks (accept/reject specs based on policies like Kyverno or OPA Gatekeeper).

### 🏢 2. Real-World DevOps Examples
- **Enforcing Namespace Security Labels:** Enforcing \`pod-security.kubernetes.io/enforce: restricted\` on the \`production\` namespace to automatically reject any Pod spec running as root or missing security contexts.
- **Kyverno Policy Gate:** Deploying a Kyverno ValidatingWebhook Policy that blocks developers from deploying container images tagged with \`:latest\`.

### 💻 3. Practical Commands
\`\`\`yaml
# Hardened Pod Security Context Manifest (pod-security.yaml)
apiVersion: v1
kind: Pod
metadata:
  name: secure-app
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    fsGroup: 2000
  containers:
  - name: app
    image: nginx:alpine
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
\`\`\`

\`\`\`bash
# Enforce Restricted Pod Security Standard on a namespace via label
kubectl label --overwrite namespace production pod-security.kubernetes.io/enforce=restricted

# Inspect active admission controller webhooks in cluster
kubectl get mutatingwebhookconfigurations,validatingwebhookconfigurations
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is running containers with \`readOnlyRootFilesystem: true\` a recommended security best practice?**  
  *A:* If an attacker achieves Remote Code Execution (RCE) inside a container, a read-only root filesystem prevents them from downloading malicious scripts, writing exploit payloads to \`/tmp\` or \`/usr/bin\`, or modifying application binaries on disk.
- **Q: What is the sequence of processing during API admission control?**  
  *A:* Request $\\rightarrow$ Authentication $\\rightarrow$ Authorization (RBAC) $\\rightarrow$ Mutating Admission Controllers $\\rightarrow$ Schema Validation $\\rightarrow$ Validating Admission Controllers $\\rightarrow$ Persistence in \`etcd\`.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Enable the \`Restricted\` Pod Security Standard on a test namespace and observe enforcement behavior.
2. **Steps:**
   - Create namespace: \`kubectl create ns sec-test\`
   - Label namespace: \`kubectl label ns sec-test pod-security.kubernetes.io/enforce=restricted\`
   - Attempt to deploy a root container: \`kubectl run root-pod --image=nginx -n sec-test\`
   - Observe admission control rejection error.`,
          },
        ],
      },
      {
        id: "sec_k8s_03",
        title: "Section 3: Advanced - Production Operations & Auto-Scaling (Modules 11-15)",
        lessons: [
          {
            id: "k8s_mod_11",
            title: "Module 11: Application Resource Management, Quality of Service (QoS) & OOM",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/S43v_zB1U08",
            content: `### 📖 1. Theory
Configuring compute resource requests and limits to guarantee application performance and node stability:
- **Resource Requests vs Limits:**
  - **Requests:** Minimum compute resources (\`cpu\` in millicores, \`memory\` in MiB) guaranteed by the scheduler to place the Pod on a node.
  - **Limits:** Maximum upper boundary of compute resources a container is permitted to consume.
- **Quality of Service (QoS) Classes:** Assigned automatically by Kubernetes based on resource specs:
  - **Guaranteed:** Every container in the Pod has identical \`requests\` equal to \`limits\` for both CPU and Memory (highest eviction protection).
  - **Burstable:** At least one container has a request set, but limits exceed requests (moderate protection).
  - **BestEffort:** No requests or limits specified (first to be evicted when node memory is depleted).
- **Out-Of-Memory (OOMKilled):** If a container exceeds its Memory Limit, the Linux kernel terminates PID 1 with Exit Code **137**.

### 🏢 2. Real-World DevOps Examples
- **Guaranteed Database Pods:** Configuring PostgreSQL database Pods with \`Guaranteed\` QoS (\`requests == limits\` for CPU & RAM) so \`kubelet\` never evicts the database during node memory pressure spikes.
- **Node Resource Starvation Fix:** Preventing unconstrained microservices from consuming 100% of node memory and crashing node system daemons (\`kubelet\`, \`containerd\`).

### 💻 3. Practical Commands
\`\`\`yaml
# Guaranteed QoS Class Resource Block (pod-resources.yaml)
resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
\`\`\`

\`\`\`bash
# Real-time resource usage monitoring for nodes and pods
kubectl top nodes
kubectl top pods -A --sort-by=memory

# Inspect assigned QoS Class of a deployed Pod
kubectl get pod web-pod -o jsonpath='{.status.qosClass}'

# Identify Pods terminated due to OOMKilled events
kubectl get pods -A -o json | jq '.items[] | select(.status.containerStatuses[]?.state.terminated?.reason=="OOMKilled") | .metadata.name'
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does Kubernetes determine Pod eviction order during node memory pressure?**  
  *A:* \`kubelet\` evicts Pods in reverse order of their QoS class: 1) \`BestEffort\` Pods are evicted first; 2) \`Burstable\` Pods exceeding their requests are evicted second; 3) \`Guaranteed\` Pods are evicted last only if node system processes require memory.
- **Q: What happens if a Pod container exceeds its CPU limit vs its Memory limit?**  
  *A:* CPU is a compressible resource; exceeding CPU limits causes kernel throttling (slow execution) but does NOT kill the Pod. Memory is an incompressible resource; exceeding Memory limits triggers the Linux OOM Killer, terminating the container with Exit Code 137.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Deploy Pods with different QoS classes, inspect their assigned status, and observe OOM behavior.
2. **Steps:**
   - Apply a Pod spec requesting 20Mi memory with a limit of 30Mi.
   - Run a python script inside allocating 100Mi memory.
   - Observe \`kubectl get pod\` status change to \`OOMKilled\` (Exit Code 137).`,
          },
          {
            id: "k8s_mod_12",
            title: "Module 12: Cluster Auto-Scaling: HPA, VPA, KEDA & Karpenter",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
Multi-dimensional autoscaling for workloads and underlying cloud cluster node pools:
- **Horizontal Pod Autoscaler (HPA v2):** Adjusts deployment replica counts dynamically based on CPU/Memory utilization or custom Prometheus metrics.
  - Formula: $\text{TargetReplicas} = \lceil \text{CurrentReplicas} \times \frac{\text{CurrentMetricValue}}{\text{TargetMetricValue}} \rceil$
- **Vertical Pod Autoscaler (VPA):** Automatically tunes CPU/Memory resource requests based on historic usage patterns.
- **KEDA (Kubernetes Event-driven Autoscaling):** Advanced event-driven autoscaling for queue consumers (RabbitMQ, Kafka, AWS SQS) scaling down to 0.
- **Node Autoscaling (AWS Karpenter vs Cluster Autoscaler):**
  - *Cluster Autoscaler:* Adjusts cloud Auto Scaling Groups (ASGs) when Pods enter \`Pending\` state due to resource deficits.
  - *Karpenter:* High-performance, just-in-time node provisioner that directly provisions optimal EC2 instances based on pending Pod specs without fixed node groups.

### 🏢 2. Real-World DevOps Examples
- **Black Friday Flash Sale Scaling:** Configuring HPA to automatically scale an e-commerce API deployment from 10 to 150 Pods as CPU load hits 70%, while Karpenter provisions 5 spot EC2 instances in 40 seconds.
- **Event Queue Scaled to Zero with KEDA:** Scaling a background image processing worker deployment from 0 to 50 Pods when AWS SQS queue depth exceeds 1,000 messages, and scaling back to 0 when queue is empty.

### 💻 3. Practical Commands
\`\`\`yaml
# HPA v2 Manifest (hpa.yaml)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 3
  maxReplicas: 30
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
\`\`\`

\`\`\`bash
# Create HPA imperatively
kubectl autoscale deployment api-deployment --cpu-percent=70 --min=2 --max=10

# Monitor HPA targets and current replica scaling in real-time
kubectl get hpa api-hpa -w
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why should HPA and VPA generally NOT be configured together on the same resource metric (e.g. CPU)?**  
  *A:* If both HPA and VPA scale based on the same metric, an increase in load causes HPA to add more Pods while VPA simultaneously increases resource requests for existing Pods, creating an unstable feedback loop and resource conflicts.
- **Q: What is the primary operational advantage of AWS Karpenter over traditional Cluster Autoscaler?**  
  *A:* Cluster Autoscaler is constrained by static ASG node group definitions. Karpenter evaluates pending Pod specs in real-time and directly provisions custom, right-sized EC2 instances (mixing spot, ARM/x86, instance types) in seconds without ASGs.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Configure HPA on a deployment, simulate high CPU load, and observe replica scaling.
2. **Steps:**
   - Deploy web app and apply HPA targeting 50% CPU.
   - Run load generator container: \`kubectl run -i --tty load-gen --image=busybox -- sh -c "while true; do wget -q -O- http://web-app; done"\`
   - Monitor scaling: \`kubectl get hpa -w\` (observe replica scaling from 1 to 5).`,
          },
          {
            id: "k8s_mod_13",
            title: "Module 13: Scheduling Mechanics, Taints, Tolerations, Node Affinity & Topology Spread",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
Mastering how \`kube-scheduler\` selects optimal worker nodes for Pod execution:
- **Scheduling Pipeline:**
  1. *Filtering (Predicates):* Excludes nodes lacking resources or violating constraints.
  2. *Scoring (Priorities):* Ranks remaining nodes to find the best host match.
- **Node Selection Primitives:**
  - **\`nodeSelector\`:** Simple key-value matching for host node labels.
  - **Node Affinity:** Advanced rules supporting Hard (\`requiredDuringSchedulingIgnoredDuringExecution\`) and Soft (\`preferredDuringSchedulingIgnoredDuringExecution\`) matching.
- **Taints and Tolerations:**
  - *Taints (Applied to Nodes):* Repels Pods that do not possess explicit tolerations. Effects: \`NoSchedule\`, \`PreferNoSchedule\`, \`NoExecute\` (evicts non-tolerated running pods).
  - *Tolerations (Applied to Pods):* Permits Pods to schedule onto tainted nodes.
- **Topology Spread Constraints:** Evenly distributes Pods across failure domains (Availability Zones, Racks, Regions) to ensure high availability.

### 🏢 2. Real-World DevOps Examples
- **Dedicated GPU Worker Node Pools:** Tainting expensive GPU nodes with \`gpu=true:NoSchedule\`. Only AI model training Pods possessing matching tolerations can schedule onto GPU instances.
- **Multi-AZ High Availability:** Applying \`topologySpreadConstraints\` with \`maxSkew: 1\` across \`topology.kubernetes.io/zone\` to guarantee web Pods are evenly split across 3 Availability Zones.

### 💻 3. Practical Commands
\`\`\`yaml
# Pod with Toleration, Node Affinity & Topology Spread (scheduling.yaml)
spec:
  tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "analytics"
    effect: "NoSchedule"
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: instance-type
            operator: In
            values: ["c6i.2xlarge"]
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: web
\`\`\`

\`\`\`bash
# Taint a worker node to repel general workloads
kubectl taint nodes node-02 dedicated=analytics:NoSchedule

# Remove taint from a worker node
kubectl taint nodes node-02 dedicated=analytics:NoSchedule-

# Label node for nodeSelector matching
kubectl label nodes node-01 disktype=ssd
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do Taints/Tolerations differ from Node Affinity?**  
  *A:* Node Affinity attracts Pods to a specific set of nodes. Taints allow a node to repel Pods unless the Pod explicitly tolerates the node's taint.
- **Q: What is the impact of the \`NoExecute\` taint effect compared to \`NoSchedule\`?**  
  *A:* \`NoSchedule\` affects only new Pod scheduling decisions. \`NoExecute\` affects both new scheduling AND immediately evicts existing running Pods on the node that lack matching tolerations.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Taint a node, verify Pod scheduling rejection, apply toleration, and achieve placement.
2. **Steps:**
   - Apply taint: \`kubectl taint nodes <node-name> key=value:NoSchedule\`
   - Deploy standard pod and observe status in \`kubectl get pods\` (\`Pending\` state).
   - Add matching toleration to Pod spec and re-apply; verify status changes to \`Running\`.`,
          },
          {
            id: "k8s_mod_14",
            title: "Module 14: Batch Processing, Jobs & CronJobs",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
Orchestrating batch processing, non-continuous workloads, and scheduled tasks:
- **Job Controller:** Manages Pods designed to run to completion (exit code 0):
  - \`completions\`: Number of successful Pod completions required before the Job is finished.
  - \`parallelism\`: Number of Pods running concurrently.
  - \`backoffLimit\`: Number of retries before marking the Job as failed (default 6).
  - \`activeDeadlineSeconds\`: Maximum duration a Job can run before termination.
- **CronJob Controller:** Manages time-based scheduled Jobs (standard cron syntax: \`* * * * *\`):
  - \`concurrencyPolicy\`:
    - \`Allow\` (default): Permits concurrent job executions.
    - \`Forbid\`: Skips new execution if previous job instance is still running.
    - \`Replace\`: Cancels running job instance and starts a new one.
  - \`startingDeadlineSeconds\`: Deadline window for starting missed job schedules.

### 🏢 2. Real-World DevOps Examples
- **Nightly Database Backup CronJob:** Running a CronJob every night at midnight (\`0 0 * * *\`) executing \`pg_dump\`, compressing database backups, and uploading tarballs to AWS S3.
- **Parallel Queue Worker Jobs:** Running a Kubernetes Job with \`completions: 100\` and \`parallelism: 10\` to process 100 data migration batches in parallel across worker nodes.

### 💻 3. Practical Commands
\`\`\`yaml
# Scheduled Database Backup CronJob (cronjob.yaml)
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-db-backup
spec:
  schedule: "0 0 * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 5
  jobTemplate:
    spec:
      backoffLimit: 2
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: backup-tool
            image: postgres:16-alpine
            command: ["/bin/sh", "-c", "pg_dump -h db-svc -U postgres > /tmp/backup.sql"]
\`\`\`

\`\`\`bash
# Create one-off Job manually from an existing CronJob
kubectl create job --from=cronjob/nightly-db-backup manual-backup-run

# List all batch jobs and check execution completion counters
kubectl get jobs,cronjobs
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the difference between \`restartPolicy: Never\` and \`OnFailure\` in a Job spec?**  
  *A:* \`OnFailure\` restarts the failed container inside the SAME Pod on the node. \`Never\` creates a brand NEW Pod instance on potentially a different node upon failure until \`backoffLimit\` is exhausted.
- **Q: Why should \`concurrencyPolicy: Forbid\` be configured for database maintenance CronJobs?**  
  *A:* If a database backup task takes longer than the scheduled interval, \`Forbid\` prevents a second concurrent backup job from launching, avoiding CPU/disk I/O contention and database locking.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Author a CronJob running every 2 minutes, create a manual Job trigger, and verify completion.
2. **Steps:**
   - Apply CronJob manifest: \`schedule: "*/2 * * * *"\`
   - Monitor job creation: \`kubectl get jobs -w\`
   - Create manual trigger: \`kubectl create job --from=cronjob/<name> test-manual-run\`.`,
          },
          {
            id: "k8s_mod_15",
            title: "Module 15: Helm 3 Package Management & Chart Authoring",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
Helm 3 is the package manager for Kubernetes, automating application deployment through reusable templates called Helm Charts:
- **Helm 3 Architecture:** Tiller-less architecture storing release state directly inside Kubernetes Secrets within the target namespace.
- **Chart Directory Structure:**
  - \`Chart.yaml\`: Metadata (chart name, version, appVersion).
  - \`values.yaml\`: Default configuration values.
  - \`templates/\`: Go-templated Kubernetes manifests (\`deployment.yaml\`, \`service.yaml\`, \`_helpers.tpl\`).
  - \`charts/\`: Dependent sub-charts.
- **Go Templating Syntax:** \`{{ .Values.replicaCount }}\`, control structures (\`if/else\`, \`range\`), template functions (\`toYaml\`, \`indent\`, \`include\`).

### 🏢 2. Real-World DevOps Examples
- **Multi-Environment Deployment Strategy:** Maintaining a single Helm chart for a microservice and deploying to Dev, Staging, and Production by passing distinct value overrides (\`helm upgrade --install -f values-prod.yaml\`).
- **Deploying Enterprise Third-Party Stacks:** Installing production monitoring stacks in one command via official charts: \`helm install prometheus prometheus-community/kube-prometheus-stack\`.

### 💻 3. Practical Commands
\`\`\`bash
# Create a new boilerplate Helm chart directory structure
helm create my-chart

# Lint chart templates for syntax errors
helm lint ./my-chart

# Render templates locally without deploying to test output
helm template my-release ./my-chart --values values-staging.yaml

# Install or upgrade a Helm release atomically
helm upgrade --install my-app ./my-chart --namespace prod --create-namespace

# Rollback release immediately to previous revision
helm rollback my-app 1 --namespace prod
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does Helm 3 differ fundamentally from Helm 2?**  
  *A:* Helm 2 used a centralized in-cluster server component called **Tiller** running with full cluster-admin privileges, creating severe security vulnerabilities. Helm 3 eliminated Tiller entirely; it operates client-side and uses Kubernetes RBAC natively, storing release state in Secrets.
- **Q: What is the difference between \`helm template\` and \`helm install --dry-run\`?**  
  *A:* \`helm template\` renders Go templates locally on your workstation without contacting the Kubernetes API server. \`helm install --dry-run\` sends rendered manifests to the API server for server-side validation against cluster RBAC and OpenAPI schemas without persisting objects.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Create a custom Helm chart, parameterize replica counts and image tags, and deploy releases.
2. **Steps:**
   - Execute \`helm create demo-chart\`
   - Modify \`values.yaml\` setting \`replicaCount: 3\` and \`image.tag: alpine\`
   - Dry-run render: \`helm template demo ./demo-chart\`
   - Install release: \`helm install demo ./demo-chart\` and check \`helm list\`.`,
          },
        ],
      },
      {
        id: "sec_k8s_04",
        title: "Section 4: Production Mastery - GitOps, Service Mesh & Enterprise Ops (Modules 16-20)",
        lessons: [
          {
            id: "k8s_mod_16",
            title: "Module 16: GitOps Continuous Delivery with ArgoCD & FluxCD",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
GitOps is an operational framework that uses Git repositories as the single source of truth for declarative infrastructure and application code:
- **Core GitOps Principles:**
  1. Entire system specified declaratively.
  2. Desired state versioned in Git.
  3. Approved changes automatically applied to cluster.
  4. Software agents continuously reconcile cluster state to prevent configuration drift.
- **Pull-Based GitOps Architecture (ArgoCD / FluxCD):**
  - Continuous reconciliation loop running inside the cluster pulls manifests from Git and applies them locally.
  - Eliminates the need to store cluster admin credentials or open inbound SSH/K8s ports in external CI/CD pipelines (Jenkins, GitHub Actions).

### 🏢 2. Real-World DevOps Examples
- **Automated Cluster Self-Healing:** An engineer manually deletes a production Service via CLI. Within 5 seconds, ArgoCD detects out-of-sync drift and automatically re-applies the Git manifest, restoring the Service.
- **Multi-Cluster Deployment via App-of-Apps:** Using ArgoCD's "App-of-Apps" pattern to manage 20 EKS clusters across 5 AWS regions from a single Git repository.

### 💻 3. Practical Commands
\`\`\`yaml
# ArgoCD Application CRD Manifest (argocd-app.yaml)
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: production-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/k8s-manifests.git
    targetRevision: HEAD
    path: apps/production
  destination:
    server: https://kubernetes.default.svc
    namespace: prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
\`\`\`

\`\`\`bash
# Create ArgoCD application via CLI
argocd app create prod-web \
  --repo https://github.com/org/k8s-manifests.git \
  --path apps/web \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace prod

# Trigger immediate manual sync and watch status
argocd app sync prod-web
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is Pull-based GitOps (ArgoCD) superior to Push-based CI/CD pipelines (e.g. Jenkins/GitHub Actions) for Kubernetes?**  
  *A:* Push-based pipelines require storing cluster-admin credentials in external CI systems and exposing API endpoints. Pull-based agents run inside the cluster, requiring no external access, and continuously reconcile cluster state to undo unauthorized manual changes automatically.
- **Q: What is Configuration Drift and how does ArgoCD handle it?**  
  *A:* Configuration Drift occurs when cluster live state deviates from Git specs (e.g. manual CLI edits). ArgoCD marks the application as \`OutOfSync\` and, if \`selfHeal: true\` is set, automatically overwrites live cluster objects to match Git.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Install ArgoCD, apply an Application CRD, and observe automated Git synchronization.
2. **Steps:**
   - Install ArgoCD manifest in \`argocd\` namespace.
   - Apply the \`argocd-app.yaml\` manifest above pointing to a public Git repository.
   - Modify replica count in Git, push, and observe ArgoCD automatic sync in cluster.`,
          },
          {
            id: "k8s_mod_17",
            title: "Module 17: Zero Trust Service Mesh with Istio & Envoy Proxies",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
Zero Trust networking inside Kubernetes microservices using Istio Service Mesh:
- **Istio Architecture:**
  - **Control Plane (\`istiod\`):** Manages configuration, translates rules into Envoy specs, and issues short-lived X.509 certificates (SPIFFE IDs).
  - **Data Plane (Envoy Sidecars):** High-performance C++ proxies injected alongside app containers intercepting all TCP traffic.
- **Core Capabilities:**
  - **Mutual TLS (mTLS):** Automatic transparent end-to-end encryption in transit between microservices.
  - **Traffic Management:** Canary traffic splits (\`VirtualService\`), connection pooling (\`DestinationRule\`), fault injection, and circuit breaking.
  - **Observability:** Distributed tracing headers (\`x-request-id\`, \`x-b3-traceid\`) and Kiali service topology graphs.

### 🏢 2. Real-World DevOps Examples
- **STRICT mTLS Compliance:** Enforcing \`mode: STRICT\` mTLS cluster-wide to satisfy PCI-DSS and SOC2 data-in-transit encryption requirements without modifying application source code.
- **Canary Release Traffic Shifting:** Routing 99% of live traffic to \`v1.0\` and 1% of header-matching requests (\`x-beta-user: true\`) to \`v2.0\` using an Istio \`VirtualService\`.

### 💻 3. Practical Commands
\`\`\`yaml
# Istio VirtualService Canary Traffic Split (virtualservice.yaml)
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: payment-vs
spec:
  hosts:
  - payment-service
  http:
  - route:
    - destination:
        host: payment-service
        subset: v1
      weight: 90
    - destination:
        host: payment-service
        subset: v2
      weight: 10
\`\`\`

\`\`\`bash
# Enable automatic Istio sidecar injection on namespace
kubectl label namespace prod istio-injection=enabled

# Check mTLS authentication status across all workloads
istioctl authn tls-check

# Inspect Envoy proxy endpoints and cluster configs for a pod
istioctl proxy-config endpoints <pod-name>.prod
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What performance overhead does Istio Envoy sidecar proxy injection add?**  
  *A:* Sidecar proxies add ~1-3ms network latency per hop due to context switching between Envoy user space and Linux kernel socket space, along with memory usage (~50MB per Pod). Modern Istio Ambient Mesh eliminates sidecars using zero-sidecar ztunnel node proxies.
- **Q: What is a SPIFFE ID in Istio?**  
  *A:* SPIFFE (Secure Production Identity Framework for Everyone) provides a standardized cryptographic URI (e.g. \`spiffe://cluster.local/ns/prod/sa/payment-api\`) embedded in X.509 SAN certificates to verify workload identity during mTLS handshakes.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Enable sidecar injection, apply a VirtualService traffic route, and verify Envoy stats.
2. **Steps:**
   - Label namespace: \`kubectl label ns default istio-injection=enabled\`
   - Deploy Pod and verify 2/2 containers running (\`app\` + \`istio-proxy\`).
   - Query Envoy admin interface stats: \`kubectl exec <pod> -c istio-proxy -- curl localhost:15000/stats\`.`,
          },
          {
            id: "k8s_mod_18",
            title: "Module 18: Cluster Observability: Prometheus, Grafana, Loki & OpenTelemetry",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
Implementing the 4 Golden Signals of Observability (Latency, Traffic, Errors, Saturation) in Kubernetes:
- **Prometheus Stack Architecture:**
  - **Prometheus Server:** Pulls (scrapes) metrics endpoints via HTTP on periodic intervals; stores time-series data in TSDB.
  - **ServiceMonitor / PodMonitor CRDs:** Declarative Prometheus Operator resources specifying custom metric scraping targets.
  - **Alertmanager:** Deduplicates, groups, and routes alerts to PagerDuty/Slack.
- **Grafana & Loki:** Visualizes metrics and aggregates logs using label indexing (logQL).
- **OpenTelemetry (OTel):** Unified standard for collecting traces, metrics, and logs with OTel Collectors.

### 🏢 2. Real-World DevOps Examples
- **Automated PagerDuty Incident Triggering:** Setting Alertmanager rules to trigger high-priority PagerDuty alerts when API 5xx error rate exceeds 2% over 5 minutes (\`rate(http_requests_total{status=~"5.."}[5m])\`).
- **Distributed Request Tracing:** Tracing a single user checkout request across 8 microservices using OpenTelemetry context propagation (\`traceparent\` header).

### 💻 3. Practical Commands
\`\`\`yaml
# Prometheus ServiceMonitor CRD Manifest (servicemonitor.yaml)
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: api-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: api-server
  endpoints:
  - port: metrics
    interval: 15s
    path: /metrics
\`\`\`

\`\`\`bash
# PromQL: Calculate average CPU usage rate per pod over 5m window
# sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (pod)

# PromQL: Calculate 99th percentile HTTP request latency
# histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why does Prometheus use a Pull-based metric collection model instead of Push?**  
  *A:* Pull models allow central monitoring servers to detect target down/unreachable states easily, prevent target overload by controlling scrape rates, and eliminate the need for targets to hold hardcoded monitoring server endpoints.
- **Q: What is a ServiceMonitor CRD in the Prometheus Operator ecosystem?**  
  *A:* A \`ServiceMonitor\` is a Custom Resource defining how Prometheus should discover and scrape metrics from a set of Kubernetes Services based on label selectors.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Deploy Prometheus Operator, apply a ServiceMonitor, and query PromQL metrics.
2. **Steps:**
   - Install kube-prometheus-stack chart via Helm.
   - Apply \`servicemonitor.yaml\` targeting an application metrics endpoint.
   - Access Prometheus UI and run PromQL query: \`container_memory_working_set_bytes\`.`,
          },
          {
            id: "k8s_mod_19",
            title: "Module 19: Disaster Recovery, etcd Backups, Velero & Multi-Cluster Management",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
Guaranteeing cluster business continuity, disaster recovery, and multi-region operations:
- **\`etcd\` Backup & Restoration:**
  - \`etcd\` holds the entire cluster state. Taking periodic snapshots using \`etcdctl snapshot save\` is mandatory before upgrading control planes.
- **Velero Cluster Backup & Disaster Recovery:**
  - Backs up Kubernetes API objects AND PersistentVolume disk snapshots to cloud object storage (S3/GCS).
  - Restores full clusters to new cloud regions during outages.
- **Multi-Cluster Architecture Patterns:**
  - Centralized Control Plane (Rancher, RedHat ACM, Anthos).
  - Cluster API (CAPI) for declarative cluster lifecycle provisioning using Kubernetes manifests.

### 🏢 2. Real-World DevOps Examples
- **Control Plane Upgrade Disaster Recovery:** Taking an \`etcd\` snapshot prior to upgrading EKS from 1.28 to 1.29. If control plane corruption occurs, restoring the etcd snapshot reverts cluster state cleanly.
- **Cross-Region DR Failover with Velero:** Automatically scheduling daily Velero backups of production namespaces to an AWS S3 bucket in \`us-west-2\`, enabling sub-1-hour full cluster restoration if \`us-east-1\` experiences a regional blackout.

### 💻 3. Practical Commands
\`\`\`bash
# Take live etcd snapshot backup on master node
ETCDCTL_API=3 etcdctl snapshot save /tmp/etcd-backup-$(date +%Y%m%d).db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key

# Verify etcd snapshot integrity
ETCDCTL_API=3 etcdctl snapshot status /tmp/etcd-backup-20260921.db -w table

# Create complete cluster namespace backup using Velero
velero backup create prod-full-backup --include-namespaces prod --snapshot-volumes
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How many master node failures can a 3-node vs 5-node etcd cluster tolerate?**  
  *A:* A 3-node etcd cluster requires quorum of 2 ($\lfloor 3/2 \rfloor + 1 = 2$), so it tolerates **1 failure**. A 5-node cluster requires quorum of 3, so it tolerates **2 failures**.
- **Q: How does Velero perform backup and restoration of Kubernetes persistent storage?**  
  *A:* Velero queries the Kubernetes API server to export resource manifests as JSON/YAML files and invokes cloud provider CSI volume snapshot APIs (AWS EBS snapshots, GCP disk snapshots) to snapshot persistent disks attached to PVCs.

### 🛠️ 5. Hands-on Exercise & Lab
1. **Goal:** Perform an \`etcdctl\` snapshot save, verify status, and simulate restoration steps.
2. **Steps:**
   - Execute \`etcdctl snapshot save /tmp/backup.db\` with valid PKI cert paths.
   - Run \`etcdctl snapshot status /tmp/backup.db -w table\` and verify total key and revision numbers.`,
          },
          {
            id: "k8s_mod_20",
            title: "Module 20: CKA & CKAD Exam Mastery, Production Hardening & Best Practices",
            duration: 60,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
Comprehensive preparation for CNCF Certified Kubernetes Administrator (CKA) & Application Developer (CKAD) exams, combined with production cluster hardening best practices:
- **Imperative \`kubectl\` Speed Tricks:**
  - Generate YAML templates instantly without writing from scratch:
    \`kubectl run web --image=nginx --dry-run=client -o yaml > pod.yaml\`
    \`kubectl create deployment api --image=node --dry-run=client -o yaml > deploy.yaml\`
  - Speed aliases: \`alias k=kubectl\`, \`export do="--dry-run=client -o yaml"\`.
- **Production Hardening Checklist:**
  - 1) Lock down API Server (disable anonymous auth, enable encryption at rest); 2) Enforce RBAC least-privilege; 3) Enable Pod Security Standards (\`Restricted\`); 4) Implement NetworkPolicies blocking cross-namespace traffic; 5) Keep worker node OS kernels patched.

### 🏢 2. Real-World DevOps Examples
- **Passing the CKA Exam under 2 Hours:** Using imperative command flags (\`--dry-run=client -o yaml\`) to solve 17 performance tasks (troubleshooting nodes, fixing broken control planes, configuring ingress, etcd backup) efficiently.
- **Enterprise Cluster Hardening Audit:** Performing a CIS Kubernetes Benchmark scan using \`kube-bench\` and resolving high-risk security findings.

### 💻 3. Practical Commands
\`\`\`bash
# Imperative speed generation tricks for CKA/CKAD exams
alias k=kubectl
export do="--dry-run=client -o yaml"

# Generate Deployment with Service imperatively in 5 seconds
k create deployment web-api --image=nginx:alpine $do > deploy.yaml
k expose deployment web-api --port=80 --target-port=80 $do > svc.yaml

# Run CIS Kubernetes Benchmark security audit scan
docker run --rm -v /etc/kubernetes:/etc/kubernetes:ro -v /var/lib/etcd:/var/lib/etcd:ro aquasec/kube-bench:latest run --targets master
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the systematic troubleshooting methodology for a Pod stuck in \`CrashLoopBackOff\`?**  
  *A:* 1) Check events via \`kubectl describe pod <name>\` (look for OOMKilled, probe failures, or volume mount issues); 2) View application logs with \`kubectl logs <name> --previous\` to inspect errors prior to restart; 3) Verify ConfigMaps/Secrets are mounted correctly; 4) Check container entrypoint commands and arguments.
- **Q: How do you troubleshoot a worker node in \`NotReady\` state?**  
  *A:* 1) Run \`kubectl describe node <node-name>\` and check \`Conditions\` (MemoryPressure, DiskPressure, PIDPressure); 2) SSH into worker node and check \`systemctl status kubelet\` and \`systemctl status containerd\`; 3) Inspect kubelet logs via \`journalctl -u kubelet -n 100\`; 4) Verify disk space on \`/var/lib/docker\` or \`/var/lib/containerd\`.

### 🛠️ 5. Practical Hands-on Lab & Project
1. **Goal:** Timed production troubleshooting challenge resolving broken deployments, bad networking selectors, and failing probes.
2. **Steps:**
   - Deploy a broken stack (misconfigured selector labels and failing liveness probe).
   - Use \`kubectl describe\`, \`kubectl logs\`, and \`kubectl get ep\` to diagnose root causes.
   - Fix YAML specs and verify all Pods enter \`Running\` and \`Healthy\` states within 10 minutes.`,
          },
        ],
      },
    ],
  },
  {
    id: "course_jenkins_001",
    slug: "jenkins-cicd-pipelines",
    title: "Jenkins CI/CD Pipelines Masterclass",
    shortDescription: "Build robust CI/CD pipelines with Jenkins: declarative pipelines, Groovy shared libraries, Kubernetes pod agents, Docker integration, Vault, and enterprise security.",
    description: "Master enterprise continuous integration and continuous deployment with Jenkins. Learn Controller-Agent architecture, Declarative and Scripted pipeline directives, Kubernetes dynamic build agents, Groovy shared libraries, automated GitHub webhook triggers, static security scanning, HashiCorp Vault integration, and end-to-end zero-downtime deployment pipelines.",
    category: "CI/CD",
    level: "intermediate",
    price: 0,
    isPro: false,
    isFeatured: true,
    rating: 4.8,
    totalRatings: 1680,
    totalStudents: 11200,
    totalLessons: 10,
    durationHours: 16,
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=600",
    icon: React.createElement(SiJenkins),
    color: "from-red-600 to-pink-600",
    tags: ["Jenkins", "CI/CD", "Pipelines", "Kubernetes Agents", "Shared Libraries", "Groovy", "Vault", "DevOps"],
    whatYouLearn: [
      "Architect resilient Jenkins Controller-Agent distributed build systems",
      "Write production Declarative Jenkinsfiles with parameters, matrix, and parallel stages",
      "Provision dynamic ephemeral build agents on Kubernetes using the Jenkins Kubernetes Plugin",
      "Develop reusable enterprise pipeline components with Groovy Shared Libraries",
      "Integrate automated GitHub PR webhooks, status checks, and multibranch pipelines",
      "Inject secrets securely using Jenkins Credentials Binding and HashiCorp Vault API",
      "Automate static security analysis (SonarQube, Trivy container scanning, Snyk)",
      "Harden Jenkins controllers with RBAC, Role Strategy plugin, and HTTPS reverse proxies",
      "Monitor build node performance using Prometheus metrics and Grafana dashboards",
      "Build a complete production CI/CD pipeline deploying to Kubernetes with Slack notifications",
    ],
    requirements: ["Basic Git knowledge", "Docker fundamentals", "Linux command line"],
    updatedAt: "2026-09-21",
    sections: [
      {
        id: "sec_jen_01",
        title: "Section 1: Architecture & Declarative Pipelines (Modules 1-3)",
        lessons: [
          {
            id: "jen_mod_01",
            title: "Module 1: Jenkins Controller-Agent Architecture & Distributed Builds",
            duration: 45,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/7KCS7054f7A",
            content: `### 📖 1. Theory
Jenkins operates on a Master-Slave (Controller-Agent) distributed architecture:
- **Jenkins Controller:** Manages the UI, schedules pipeline jobs, dispatches builds to agents, stores configuration XMLs, and aggregates build logs.
- **Jenkins Agent (Node):** Executes actual build workloads, unit tests, and container compilations. Communicates via SSH or inbound JNLP/WebSocket agents.
- **Executor Threads:** Configured concurrency slots on agent nodes governing parallel execution capacity.

### 🏢 2. Real-World DevOps Examples
- **Offloading Heavy Workloads:** Running heavy C++/Java compilations on dedicated high-CPU AWS EC2 spot agent nodes while keeping the primary Jenkins controller lightweight and highly responsive.

### 💻 3. Practical Commands
\`\`\`bash
# Run Jenkins Controller using Docker container with persistent volume
docker run -d --name jenkins-controller \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts-jdk17

# Retrieve initial admin unlock password
docker exec jenkins-controller cat /var/jenkins_home/secrets/initialAdminPassword
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is running build steps directly on the Jenkins Controller considered a security risk?**  
  *A:* Running builds on the controller exposes controller filesystem secrets, configuration XML files, and AWS credentials to malicious or buggy user scripts. Best practice dictates zero executors on the controller node.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Connect a Linux worker node to Jenkins via SSH Agent.
2. **Steps:**
   - Create SSH keypair, register private key in Jenkins Credentials Manager.
   - Configure Node in *Manage Jenkins -> Nodes -> New Node*, set remote root directory \`/home/jenkins/agent\` and verify successful SSH launch.`,
          },
          {
            id: "jen_mod_02",
            title: "Module 2: Declarative vs Scripted Pipeline Syntax & Environment Directives",
            duration: 50,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/7KCS7054f7A",
            content: `### 📖 1. Theory
Jenkins Pipelines define continuous integration workflows as code via \`Jenkinsfile\`:
- **Declarative Pipeline:** Strict, structured syntax block (\`pipeline { ... }\`) providing pre-built error checking, agent blocks, environment variables, and post-execution hooks.
- **Scripted Pipeline:** Imperative Groovy syntax (\`node { ... }\`) allowing arbitrary programmatic execution flow, loops, and custom exception handling.
- **Directives:** \`agent\`, \`environment\`, \`parameters\`, \`options\`, \`stages\`, \`stage\`, \`steps\`, \`post\`.

### 🏢 2. Real-World DevOps Examples
- **Standardizing Application Pipelines:** Enforcing a uniform \`Jenkinsfile\` across 40 microservices to ensure every commit undergoes automated linting, unit testing, image building, and vulnerability auditing.

### 💻 3. Practical Commands
\`\`\`groovy
// Example Declarative Jenkinsfile
pipeline {
    agent any
    options {
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '30'))
        ansiColor('xterm')
    }
    environment {
        APP_NAME = 'payment-service'
        REGISTRY = 'docker.io/myorg'
    }
    stages {
        stage('Build & Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the key advantage of Declarative Pipelines over Scripted Pipelines?**  
  *A:* Declarative syntax is easier to read, enforce, and validate; it enforces structured pipeline definitions while offering built-in syntax checking before stage execution begins.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Write a parameterized Declarative Jenkinsfile with conditional execution.
2. **Steps:**
   - Add choice parameters (\`ENVIRONMENT\`: \`dev\`, \`staging\`, \`prod\`).
   - Use \`when { expression { return params.ENVIRONMENT == 'prod' } }\` to gate deployment steps.`,
          },
          {
            id: "jen_mod_03",
            title: "Module 3: Stages, Parallel Execution, Matrix Builds & Post Actions",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/7KCS7054f7A",
            content: `### 📖 1. Theory
Optimizing pipeline execution speed through parallelism and matrix configurations:
- **Parallel Stages:** Executing independent stages concurrently across multiple agent nodes to minimize total feedback loop time.
- **Matrix Builds:** Running identical pipeline test suites across multiple OS, Java/Node runtime versions, or browser environments simultaneously.
- **Post-Execution Conditions:** \`always\`, \`success\`, \`failure\`, \`unstable\`, \`changed\`, \`aborted\`.

### 🏢 2. Real-World DevOps Examples
- **Accelerating Test Execution:** Splitting a 45-minute integration test suite into 4 parallel branches executing concurrently on separate worker agents, reducing total feedback time to 12 minutes.

### 💻 3. Practical Commands
\`\`\`groovy
stage('Parallel Test Suite') {
    parallel {
        stage('Unit Tests') {
            steps { sh 'npm run test:unit' }
        }
        stage('Integration Tests') {
            steps { sh 'npm run test:integration' }
        }
        stage('Security Scan') {
            steps { sh 'trivy fs .' }
        }
    }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do you handle pipeline notifications when a build fails?**  
  *A:* Use the \`post { failure { ... } }\` block to invoke Slack webhooks, email notifications, or PagerDuty alerts, attaching commit details and build log excerpts.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Create a multi-environment matrix build pipeline.
2. **Steps:**
   - Configure matrix testing across Node 18 and Node 20.
   - Run parallel tests and configure post success Slack alert trigger.`,
          },
        ],
      },
      {
        id: "sec_jen_02",
        title: "Section 2: Integrations, Agents & Reusable Libraries (Modules 4-6)",
        lessons: [
          {
            id: "jen_mod_04",
            title: "Module 4: Containerized Builds: Kubernetes Pod Agents & Docker-in-Docker",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/7KCS7054f7A",
            content: `### 📖 1. Theory
Dynamic, cloud-native containerized execution environments:
- **Kubernetes Pod Agents:** Spawning ephemeral Pods on demand in a Kubernetes cluster for the duration of a build stage, eliminating static server maintenance.
- **Container Isolation:** Multiple containers within the same pod sharing workspace files via shared volume mounts (\`/home/jenkins/agent\`).
- **Docker in Docker (DinD) vs Kaniko:** DinD requires privileged containers; rootless builders like Kaniko or BuildKit compile container images securely inside unprivileged Kubernetes Pods.

### 🏢 2. Real-World DevOps Examples
- **Scaling Elastic Jenkins Clusters:** Setting up the Jenkins Kubernetes plugin to auto-scale from 0 to 200 ephemeral build pods during peak morning developer code pushes, auto-terminating pods upon completion to reduce AWS cloud compute costs by 60%.

### 💻 3. Practical Commands
\`\`\`groovy
agent {
    kubernetes {
        yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: jenkins-build
spec:
  containers:
  - name: maven
    image: maven:3.9-eclipse-temurin-17
    command: ['cat']
    tty: true
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ['cat']
    tty: true
'''
    }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is Kaniko preferred over Docker-in-Docker (DinD) for building container images in Kubernetes Jenkins agents?**  
  *A:* Kaniko builds container images inside a container without requiring root access or privileged mode (\`securityContext.privileged: true\`), preventing container escape security risks on shared Kubernetes nodes.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Deploy dynamic Kubernetes Jenkins slave pods.
2. **Steps:**
   - Configure Kubernetes Cloud plugin in Jenkins settings.
   - Run a multi-container pod pipeline with \`maven\` and \`docker\` CLI containers.`,
          },
          {
            id: "jen_mod_05",
            title: "Module 5: Reusable Pipeline Libraries: Groovy Shared Libraries",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/7KCS7054f7A",
            content: `### 📖 1. Theory
Jenkins Shared Libraries DRY up pipeline logic across large enterprise organizations:
- **Directory Structure:**
  - \`src/\`: Standard Groovy class files (\`com/devops/Utils.groovy\`).
  - \`vars/\`: Global custom steps exposed directly to Jenkinsfiles (\`buildApp.groovy\`, \`deployK8s.groovy\`).
  - \`resources/\`: Non-code assets (JSON schemas, SQL scripts, YAML templates).
- **Global Invocations:** Loading shared libraries globally or dynamically via \`@Library('my-shared-library') _\`.

### 🏢 2. Real-World DevOps Examples
- **Enforcing Enterprise Compliance:** Encapsulating deployment logic into a single shared step \`standardPipeline()\`. If security compliance requires adding a Snyk security scan step, updating the central library updates pipeline rules across all 100 microservices simultaneously.

### 💻 3. Practical Commands
\`\`\`groovy
// vars/standardPipeline.groovy
def call(Map config) {
    pipeline {
        agent any
        stages {
            stage('Build') {
                steps {
                    sh "echo Building \${config.appName}"
                }
            }
            stage('Notify') {
                steps {
                    slackSend channel: '#deployments', message: "Built \${config.appName}"
                }
            }
        }
    }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Where are Shared Libraries stored and how are they versioned?**  
  *A:* Shared Libraries are stored in a dedicated Git repository. They are versioned using Git branches or tags (e.g. \`@Library('my-lib@v2.1.0') _\`), allowing safe testing of library updates before rolling out organization-wide.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Create and consume a custom Groovy Shared Library.
2. **Steps:**
   - Build a Git repo with \`vars/notifySlack.groovy\`.
   - Configure Library in Jenkins, import in a Jenkinsfile, and execute custom step.`,
          },
          {
            id: "jen_mod_06",
            title: "Module 6: Secrets Management: Vault, Credentials Binding & Secret Scanning",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/7KCS7054f7A",
            content: `### 📖 1. Theory
Securing credentials and sensitive API tokens within build pipelines:
- **Jenkins Credentials Store:** Encrypted storage for Secret text, Username/Password, SSH Keys, and Secret Files scoped globally or per folder.
- **Credentials Binding Plugin:** Masking secrets automatically in build console logs (\`withCredentials([string(credentialsId: 'AWS_SECRET', variable: 'SECRET')])\`).
- **HashiCorp Vault Integration:** Dynamically requesting ephemeral short-lived tokens and cloud IAM credentials directly from Vault via AppRole authentication.

### 🏢 2. Real-World DevOps Examples
- **Zero-Hardcoded Credentials Policy:** Replacing long-lived AWS IAM secret keys in Jenkins with HashiCorp Vault dynamic AWS secrets that generate temporary 15-minute IAM credentials per build step.

### 💻 3. Practical Commands
\`\`\`groovy
stage('Deploy to Cloud') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        }
    }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What happens if a script prints a bound Jenkins credential variable using \`echo $SECRET\`?**  
  *A:* The Jenkins Credentials Binding plugin intercepts output stream writes and replaces known secret strings with \`****\` in the console log. However, base64 encoding or string manipulation can leak secrets, making static code reviews critical.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Bind credentials safely and scan console log output for secret exposure.
2. **Steps:**
   - Add a Secret Text credential in Jenkins.
   - Run pipeline printing bound variable and verify log masking (\`****\`).`,
          },
        ],
      },
      {
        id: "sec_jen_03",
        title: "Section 3: Enterprise CI/CD, Security & Telemetry (Modules 7-10)",
        lessons: [
          {
            id: "jen_mod_07",
            title: "Module 7: GitHub Webhooks, Automated PR Triggers & Multibranch Pipelines",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/7KCS7054f7A",
            content: `### 📖 1. Theory
Automating build triggers across Git events:
- **GitHub Webhooks:** Push events sent from GitHub to \`https://jenkins.company.com/github-webhook/\` initiating instant builds.
- **Multibranch Pipelines:** Automatically discovering, creating pipeline jobs for, and testing new Git branches and Pull Requests containing a \`Jenkinsfile\`.
- **GitHub Status Checks:** Posting pass/fail build statuses back to GitHub Pull Request UI to block unverified code merges.

### 🏢 2. Real-World DevOps Examples
- **Pull Request Quality Gates:** Configuring Multibranch Pipeline to trigger automated unit testing, SonarQube code coverage analysis, and container vulnerability scans on every submitted Pull Request, blocking merge if coverage drops below 80%.

### 💻 3. Practical Commands
\`\`\`bash
# Configure webhook payload URL in GitHub Repository Settings
Payload URL: https://jenkins.domain.com/github-webhook/
Content type: application/json
Events: Just the push event & Pull request events
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is a Multibranch Pipeline and why is it essential for modern Git workflows?**  
  *A:* A Multibranch Pipeline automatically scans a Git repository, detects branches containing a \`Jenkinsfile\`, and provisions isolated jobs for each branch, automatically cleaning up jobs when branches are deleted.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Setup a GitHub webhook and Multibranch Pipeline.
2. **Steps:**
   - Create Multibranch Pipeline targeting GitHub repository.
   - Push a new branch \`feature/demo\` and verify automatic pipeline creation and build trigger.`,
          },
          {
            id: "jen_mod_08",
            title: "Module 8: Security Hardening, RBAC & Audit Logging",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/7KCS7054f7A",
            content: `### 📖 1. Theory
Securing enterprise Jenkins installations against unauthorized access:
- **Authentication:** Integrating LDAP, Active Directory, SAML 2.0, or GitHub OAuth via plugins.
- **Authorization:** Matrix-based security and Role Strategy Plugin (enforcing granular permissions: Read, Build, Cancel, Configure per folder/job).
- **Security Hardening:** Enforcing HTTPS/TLS via NGINX reverse proxy, disabling CSP (Content Security Policy) unsafe inline scripts, enabling CSRF Protection (Crumb Issuer).

### 🏢 2. Real-World DevOps Examples
- **Enforcing Least Privilege RBAC:** Setting up Role Strategy plugin to allow Junior Developers to trigger builds in \`Development/*\` folder while restricting \`Production/*\` deployment permissions exclusively to Senior DevOps Engineers.

### 💻 3. Practical Commands
\`\`\`bash
# Sample NGINX Reverse Proxy configuration snippet for Jenkins HTTPS termination
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is a Jenkins Crumb and why is CSRF protection necessary?**  
  *A:* A Crumb is a unique security token issued by Jenkins to prevent Cross-Site Request Forgery (CSRF) attacks, ensuring that API requests sent to Jenkins originate from authenticated user sessions.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Configure Role-Based Access Control (RBAC) with Role Strategy Plugin.
2. **Steps:**
   - Install Role Strategy Plugin.
   - Define \`Developer\` role (read/build on \`dev-*\`) and \`Admin\` role (full control). Assign test users and verify permission boundaries.`,
          },
          {
            id: "jen_mod_09",
            title: "Module 9: Monitoring, Blue Ocean, Prometheus Telemetry & Performance Tuning",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/7KCS7054f7A",
            content: `### 📖 1. Theory
Observability and performance optimization for heavy Jenkins operations:
- **Jenkins Metrics Plugin:** Exposing Prometheus-compatible metrics (\`/prometheus\`) detailing queue wait times, active executors, heap memory, and build durations.
- **JVM Heap Tuning:** Fine-tuning Java garbage collection (\`-XX:+UseG1GC\`, \`-Xms4g -Xmx8g\`) for large controller nodes.
- **Log Pruning:** Configuring \`buildDiscarder\` to prune old build artifacts and console logs to prevent disk space exhaustion.

### 🏢 2. Real-World DevOps Examples
- **Alerting on Build Queue Stagnation:** Setting up Prometheus and Grafana alerts when \`jenkins_executor_in_use_value\` hits 100% for over 15 minutes, automatically triggering autoscaling rules to add extra AWS worker nodes.

### 💻 3. Practical Commands
\`\`\`bash
# Scrape Jenkins metrics endpoint via curl
curl -u "admin:api-token" http://localhost:8080/prometheus/

# Inspect controller disk usage of build jobs
du -sh /var/jenkins_home/jobs/* | sort -rh | head -n 10
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do you resolve Jenkins performance degradation caused by high disk space usage in \`/var/jenkins_home\`?**  
  *A:* Configure global log rotators (\`buildDiscarder\`), store build artifacts externally in AWS S3 or Nexus/Artifactory instead of Jenkins controller disk, and clean workspace directories post-build.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Export Jenkins metrics to Prometheus and view Grafana dashboard.
2. **Steps:**
   - Install Prometheus plugin.
   - Scrape endpoint, import Grafana Dashboard ID 9964, and monitor active executor load.`,
          },
          {
            id: "jen_mod_10",
            title: "Module 10: End-to-End Enterprise CI/CD Pipeline Project",
            duration: 60,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/7KCS7054f7A",
            content: `### 📖 1. Theory
Designing an enterprise-grade production continuous delivery assembly line:
- **Pipeline Architecture:**
  1. **Checkout & Lint:** Fetch source code, validate YAML & lint code.
  2. **Security & Audit:** Static application security testing (SAST) + Trivy container scanning.
  3. **Build & Package:** Kaniko rootless image compilation.
  4. **Staging Deployment:** Helm upgrade to Kubernetes \`staging\` namespace.
  5. **Integration Tests:** Automated post-deploy smoke testing.
  6. **Manual Gate:** Interactive approval prompt for production release.
  7. **Production Deployment:** Zero-downtime rolling update to \`production\` namespace + Slack notification.

### 🏢 2. Real-World DevOps Examples
- **Production Kubernetes Delivery Pipeline:** Orchestrating automated canary releases where Jenkins deploys new container versions, monitors Prometheus error rates for 5 minutes, and automatically rolls back if HTTP 500 errors spike.

### 💻 3. Practical Commands
\`\`\`groovy
stage('Production Approval') {
    steps {
        timeout(time: 15, unit: 'MINUTES') {
            input message: 'Approve deployment to Production EKS Cluster?', ok: 'Deploy Now'
        }
    }
}
stage('Deploy to K8s') {
    steps {
        sh 'helm upgrade --install payment-api ./chart --set image.tag=\${BUILD_NUMBER} -n prod'
    }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do you implement a blue/green or canary deployment in Jenkins?**  
  *A:* Use Jenkins to deploy the new container release alongside the old release, update Kubernetes Service selectors or NGINX ingress traffic weights (e.g. 10% traffic to canary), run automated smoke tests, and shift 100% traffic upon success.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Build an end-to-end production CI/CD pipeline in Jenkins.
2. **Steps:**
   - Implement pipeline code featuring linting, container building, staging deployment, interactive approval gate, production Helm release, and Slack completion alerts.`,
          },
        ],
      },
    ],
  },
  {
    id: "course_terraform_001",
    slug: "terraform-infrastructure-as-code",
    title: "Terraform: Infrastructure as Code Masterclass",
    shortDescription: "Provision multi-cloud infrastructure declaratively. Master HCL, state management, S3 backends, reusable modules, Terragrunt, OPA policy as code, and automated Atlantis CI/CD pipelines.",
    description: "From terraform init to enterprise modular cloud infrastructure. Master HashiCorp Configuration Language (HCL), immutable state backends with S3 and DynamoDB state locking, AWS and Kubernetes providers, Terragrunt DRY architecture, Policy-as-Code with OPA/Sentinel, drift remediation, and automated pull-request infrastructure delivery pipelines.",
    category: "IaC",
    level: "intermediate",
    price: 0,
    isPro: false,
    isFeatured: true,
    rating: 4.9,
    totalRatings: 2120,
    totalStudents: 16800,
    totalLessons: 12,
    durationHours: 18,
    instructor: "Jatin Sharma",
    instructorTitle: "HashiCorp Certified Terraform Associate",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    icon: React.createElement(SiTerraform),
    color: "from-purple-600 to-violet-600",
    tags: ["Terraform", "IaC", "AWS", "Terragrunt", "OPA", "State Management", "Atlantis", "Cloud"],
    whatYouLearn: [
      "Master HCL syntax, resource dependencies, DAG graph building, and core lifecycle phases",
      "Configure remote state storage with AWS S3 and DynamoDB distributed state locking",
      "Structure multi-environment infrastructure using Workspaces vs Directory-based layouts",
      "Build production-grade reusable Terraform modules published to private registries",
      "Orchestrate complex cloud resources using for_each, count, dynamic blocks, and locals",
      "Eliminate boilerplate code using Terragrunt DRY architecture and remote state inheritance",
      "Enforce compliance and governance using Policy as Code (OPA Rego & HashiCorp Sentinel)",
      "Detect and remediate infrastructure drift using terraform refresh and state import",
      "Automate security vulnerability scanning using tfsec, checkov, and trivy",
      "Deploy production AWS VPCs, EKS clusters, and RDS databases via Atlantis GitHub PR workflows",
    ],
    requirements: ["Basic cloud provider knowledge", "Linux command line"],
    updatedAt: "2026-09-21",
    sections: [
      {
        id: "sec_tf_01",
        title: "Section 1: HCL Core & State Management (Modules 1-4)",
        lessons: [
          {
            id: "tf_mod_01",
            title: "Module 1: Terraform Architecture, HCL Syntax & Execution DAG Graph",
            duration: 45,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Terraform is an open-source Infrastructure as Code (IaC) tool that provisions cloud infrastructure declaratively using HashiCorp Configuration Language (HCL):
- **Core Architecture:**
  - **Terraform CLI Core:** Parses HCL code, builds an in-memory Directed Acyclic Graph (DAG) of resources, computes diffs, and orchestrates resource execution.
  - **Providers:** Plugins (e.g. AWS, Azure, GCP, Kubernetes) translating HCL resources into REST API calls.
- **Execution Lifecycle:**
  1. \`terraform init\`: Downloads provider plugins and initializes remote backend.
  2. \`terraform plan\`: Compares active code against current state file and cloud provider APIs, creating a proposed execution plan.
  3. \`terraform apply\`: Executes API commands to reach desired state, updating local/remote state file.
  4. \`terraform destroy\`: Safely tears down resources in reverse dependency order.

### 🏢 2. Real-World DevOps Examples
- **Preventing Out-of-Order Resource Creation:** Understanding how Terraform automatically infers implicit dependencies (e.g., creating AWS VPC before Subnets, and Subnets before EC2 instances) to construct an optimal parallel execution graph.

### 💻 3. Practical Commands
\`\`\`bash
# Initialize working directory and download providers
terraform init

# Generate an execution plan file
terraform plan -out=tfplan.binary

# Apply saved execution plan without manual prompt
terraform apply tfplan.binary

# Render visual representation of resource dependency graph
terraform graph | dot -Tpng > graph.png
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the purpose of \`terraform.tfstate\`?**  
  *A:* The state file records metadata mapping high-level HCL code resources to real-world cloud provider resource IDs (e.g. AWS Instance ID \`i-0abc123\`), tracking metadata, performance caches, and dependencies.
- **Q: How does Terraform determine dependency order when creating resources?**  
  *A:* Terraform builds a DAG graph. Implicit dependencies are detected when a resource references an attribute of another resource (e.g. \`vpc_id = aws_vpc.main.id\`). Explicit dependencies are set via \`depends_on\`.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Deploy a basic local Docker container using Terraform.
2. **Steps:**
   - Create \`main.tf\` with \`kreuzwerker/docker\` provider.
   - Run \`terraform init\`, \`terraform plan\`, and \`terraform apply\` to launch an NGINX container.`,
          },
          {
            id: "tf_mod_02",
            title: "Module 2: Resources, Data Sources, Variables, Locals & Outputs",
            duration: 50,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Fundamental building blocks of HCL configuration files:
- **Resources (\`resource\`):** Managed infrastructure components declared in code.
- **Data Sources (\`data\`):** Read-only queries fetching existing external infrastructure metadata (e.g. latest Ubuntu AMI ID, current AWS VPC).
- **Input Variables (\`variable\`):** Parameterizing configurations with type constraints (\`string\`, \`number\`, \`list\`, \`map\`, \`object\`) and validation blocks.
- **Local Values (\`locals\`):** Assigning names to reusable expressions to reduce code duplication.
- **Output Values (\`output\`):** Exposing attribute values to CLI output or parent/child modules.

### 🏢 2. Real-World DevOps Examples
- **Dynamic AMI Lookup:** Using AWS Data Sources to fetch the latest hardened Amazon Linux 2023 AMI ID automatically during deployment instead of hardcoding static region-specific AMI strings.

### 💻 3. Practical Commands
\`\`\`hcl
# Example variable with custom validation rule
variable "instance_count" {
  type        = number
  default     = 2
  description = "Number of EC2 instances to launch"
  validation {
    condition     = var.instance_count > 0 && var.instance_count <= 10
    error_message = "Instance count must be between 1 and 10."
  }
}

# Data source fetching latest AWS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the difference between \`locals\` and \`variable\` in Terraform?**  
  *A:* \`variable\` defines input parameters configurable by module callers or CLI \`.tfvars\` files. \`locals\` are internal constants calculated within the module itself, inaccessible to external callers.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Build an AWS EC2 instance configuration with dynamic AMI lookup and validated input variables.
2. **Steps:**
   - Define \`variables.tf\`, \`main.tf\`, \`outputs.tf\`.
   - Validate input parameters using \`terraform validate\` and deploy.`,
          },
          {
            id: "tf_mod_03",
            title: "Module 3: State Management, Remote Backends & State Locking",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Enterprise state storage, collaboration safety, and state operations:
- **Remote Backends:** Storing \`terraform.tfstate\` centrally in cloud object stores (AWS S3, Azure Blob, HashiCorp Consul/Cloud) instead of local disk.
- **State Locking:** Preventing concurrent \`terraform apply\` runs from corrupting state by placing a lock file in DynamoDB or Consul during operations.
- **State Manipulation CLI:**
  - \`terraform state list\`: List all tracked resources in state file.
  - \`terraform state show <resource>\`: View detailed state attributes.
  - \`terraform state mv\`: Rename or refactor resources without destroying real cloud assets.
  - \`terraform state rm\`: Remove resource from state tracking without deleting cloud asset.

### 🏢 2. Real-World DevOps Examples
- **Multi-Developer State Concurrency:** Setting up S3 remote backend with DynamoDB locking. If Developer A runs \`terraform apply\`, DynamoDB writes a lock ID entry. When Developer B attempts simultaneous apply, Terraform aborts with a state lock error.

### 💻 3. Practical Commands
\`\`\`hcl
# S3 Remote Backend Configuration with DynamoDB State Locking
terraform {
  backend "s3" {
    bucket         = "company-tf-state-prod"
    key            = "network/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
  }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why should you never check \`terraform.tfstate\` files into Git repositories?**  
  *A:* State files contain plain-text sensitive data (database passwords, private keys, API tokens) and cause severe merge conflict corruptions when edited concurrently by multiple engineers.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Configure S3 backend with DynamoDB lock table and migrate state.
2. **Steps:**
   - Create S3 bucket and DynamoDB table. Add backend block, run \`terraform init -migrate-state\` and verify remote upload.`,
          },
          {
            id: "tf_mod_04",
            title: "Module 4: Workspaces vs Directory-Based Multi-Environment Architecture",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Structuring Terraform configurations across multiple environments (\`dev\`, \`staging\`, \`prod\`):
- **Terraform Workspaces:** Storing multiple state files within the exact same configuration directory using workspace keys (\`terraform.workspace\` variable).
- **Directory-Based Separation:** Creating separate isolated folder structures (\`environments/dev\`, \`environments/prod\`) with dedicated state files and \`terraform.tfvars\` files.
- **Best Practice Comparison:** Directory-based isolation is strongly preferred for production environments to avoid accidental cross-environment destruction bugs.

### 🏢 2. Real-World DevOps Examples
- **Structuring Cloud Environments:** Implementing directory-based isolation where \`prod/\` uses strict RBAC and separate AWS credentials, ensuring a bug in \`dev/\` code can never impact production cloud resources.

### 💻 3. Practical Commands
\`\`\`bash
# Workspace CLI Operations
terraform workspace list
terraform workspace new staging
terraform workspace select staging

# Referencing active workspace in HCL code
resource "aws_s3_bucket" "data" {
  bucket = "company-data-\${terraform.workspace}"
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the main drawback of using Terraform Workspaces for production vs staging isolation?**  
  *A:* Workspaces share the exact same code files and credentials. A single flawed \`terraform destroy\` command or code error executed in the wrong workspace context can destroy production infrastructure.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Setup workspace-based dynamic naming for AWS resources.
2. **Steps:**
   - Create workspaces \`dev\` and \`prod\`. Deploy resources using \`terraform.workspace\` interpolation and verify isolated state key paths.`,
          },
        ],
      },
      {
        id: "sec_tf_02",
        title: "Section 2: Reusable Modules & Providers (Modules 5-8)",
        lessons: [
          {
            id: "tf_mod_05",
            title: "Module 5: Reusable Module Design & Module Registry Architecture",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Building modular, DRY (Don't Repeat Yourself) infrastructure definitions:
- **Module Structure:**
  - Standard Root Module $\rightarrow$ Child Modules (\`./modules/vpc\`, \`git::https://github.com/org/terraform-aws-vpc.git?ref=v2.0.0\`).
- **Module Design Best Practices:**
  - Encapsulate logical boundaries (e.g. VPC + Subnets + Route Tables).
  - Explicitly define input variables, sensible default values, and rich output descriptions.
  - Never hardcode provider credentials inside child modules.

### 🏢 2. Real-World DevOps Examples
- **Standardizing Enterprise VPCs:** Publishing an internal \`terraform-aws-vpc\` module used across 30 engineering teams, enforcing mandatory VPC flow logs, NAT gateway redundancy, and subnet tagging conventions.

### 💻 3. Practical Commands
\`\`\`hcl
# Invoking a versioned Git child module
module "vpc" {
  source = "git::https://github.com/myorg/terraform-modules.git//vpc?ref=v1.4.0"

  vpc_cidr             = "10.0.0.0/16"
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.10.0/24", "10.0.20.0/24"]
  environment          = "production"
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the difference between a Root Module and a Child Module?**  
  *A:* The Root Module is the main directory where \`terraform apply\` is executed. A Child Module is a subfolder or remote Git repository invoked by the root module via a \`module\` block.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Create a custom reusable AWS Security Group module.
2. **Steps:**
   - Create \`modules/security-group/\` directory with \`main.tf\`, \`variables.tf\`, \`outputs.tf\`.
   - Call child module from root \`main.tf\` and test deployment.`,
          },
          {
            id: "tf_mod_06",
            title: "Module 6: AWS & Kubernetes Multi-Provider Orchestration",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Coordinating multiple cloud and infrastructure providers in a single deployment:
- **Multiple Provider Instances:** Using provider aliases (\`alias = "us-west"\`) to deploy resources across multiple cloud regions or accounts simultaneously.
- **Provider Dependencies:** Passing authentication tokens from AWS EKS data sources directly into Kubernetes and Helm providers to provision cluster add-ons within the same Terraform execution.

### 🏢 2. Real-World DevOps Examples
- **Bootstrapping Kubernetes Infrastructure:** Provisioning an Amazon EKS cluster with the AWS provider, and immediately configuring Kubernetes Core DNS, NGINX Ingress, and Cert-Manager using Kubernetes and Helm Terraform providers.

### 💻 3. Practical Commands
\`\`\`hcl
# Configure Kubernetes provider using EKS cluster outputs
provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
  }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do you handle multi-region deployments in Terraform?**  
  *A:* Define multiple provider blocks using the \`alias\` attribute (e.g. \`provider "aws" { alias = "us_west" region = "us-west-2" }\`), and reference the alias in resources via \`provider = aws.us_west\`.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Provision multi-region S3 bucket replication using AWS provider aliases.
2. **Steps:**
   - Define \`aws.us_east\` and \`aws.eu_west\` providers.
   - Configure S3 cross-region replication policy and deploy.`,
          },
          {
            id: "tf_mod_07",
            title: "Module 7: Dynamic Expressions, Loops & Meta-Arguments",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Advanced HCL programming features for dynamic resource generation:
- **Meta-Arguments:**
  - \`count\`: Creates $N$ instances based on a integer count.
  - \`for_each\`: Iterates over maps or sets of strings to create resources keyed by unique identifiers (strongly preferred over \`count\` for non-homogenous resources).
- **Dynamic Blocks (\`dynamic "ingress"\`):** Constructing repeated nested configuration blocks inside resources dynamically based on list/map variables.
- **Built-in Functions:** \`lookup()\`, \`flatten()\`, \`merge()\`, \`templatefile()\`, \`zipmap()\`.

### 🏢 2. Real-World DevOps Examples
- **Dynamic Security Group Rules:** Using \`dynamic "ingress"\` to construct complex firewall rules from a list of port configuration objects without hardcoding 20 repetitive \`ingress\` blocks.

### 💻 3. Practical Commands
\`\`\`hcl
# Example dynamic ingress block
resource "aws_security_group" "web" {
  name = "web-sg"

  dynamic "ingress" {
    for_each = var.service_ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is \`for_each\` preferred over \`count\` when creating resources like IAM Users or Subnets?**  
  *A:* \`count\` identifies resources by array index (\`[0]\`, \`[1]\`). Removing item 0 causes Terraform to reindex and destroy/recreate all subsequent resources. \`for_each\` identifies resources by stable map keys, preventing collateral resource destruction.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Generate dynamic subnets using \`for_each\` and \`cidrsubnet()\` function.
2. **Steps:**
   - Write HCL code taking a map of AZs and CIDRs. Deploy subnets and inspect state.`,
          },
          {
            id: "tf_mod_08",
            title: "Module 8: DRY Infrastructure Architecture with Terragrunt",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Terragrunt is a thin wrapper for Terraform that enforces DRY (Don't Repeat Yourself) configurations:
- **Terragrunt Core Solves:**
  - Eliminates duplicate backend configuration blocks across environments.
  - Eliminates duplicate provider configuration definitions.
  - Passes outputs between isolated state files seamlessly using \`dependency\` blocks.
- **File Structure:** \`terragrunt.hcl\` hierarchy (\`root.hcl\` $\rightarrow$ \`env.hcl\` $\rightarrow$ \`terragrunt.hcl\`).

### 🏢 2. Real-World DevOps Examples
- **Managing Multi-Account Infrastructure:** Using Terragrunt to manage 50 AWS accounts. Updating the remote S3 state backend configuration in one parent \`terragrunt.hcl\` automatically applies to all 50 accounts.

### 💻 3. Practical Commands
\`\`\`hcl
# Sample terragrunt.hcl invoking a remote module and passing dependency outputs
include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "git::https://github.com/myorg/modules.git//app?ref=v1.0.0"
}

dependency "vpc" {
  config_path = "../vpc"
}

inputs = {
  vpc_id    = dependency.vpc.outputs.vpc_id
  subnet_id = dependency.vpc.outputs.private_subnets[0]
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What problem does Terragrunt solve over native vanilla Terraform?**  
  *A:* Terragrunt eliminates backend/provider code duplication across environment folders and resolves cross-state dependencies without relying on brittle \`terraform_remote_state\` data sources.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Refactor a multi-environment Terraform setup into Terragrunt.
2. **Steps:**
   - Create \`root.hcl\` with S3 backend inheritance. Deploy \`dev\` and \`prod\` environments using \`terragrunt run-all apply\`.`,
          },
        ],
      },
      {
        id: "sec_tf_03",
        title: "Section 3: Enterprise Policy, Governance & Automation (Modules 9-12)",
        lessons: [
          {
            id: "tf_mod_09",
            title: "Module 9: Policy as Code: Open Policy Agent (OPA) & Sentinel",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Enforcing security policy and cost compliance checks prior to infrastructure deployment:
- **Policy as Code (PaC):** Writing programmatic policies evaluating JSON execution plans generated by \`terraform plan -out=tfplan.json\`.
- **Open Policy Agent (OPA & Rego):** Open-source policy engine evaluating resource compliance (e.g. blocking unencrypted S3 buckets or public 0.0.0.0/0 SSH security groups).
- **HashiCorp Sentinel:** Embedded policy framework enforcing fine-grained governance in Terraform Cloud / HCP.

### 🏢 2. Real-World DevOps Examples
- **Enforcing Cloud Financial Guardrails:** Writing an OPA Rego policy in CI/CD that evaluates \`terraform plan\` JSON and automatically blocks any pull request attempting to launch EC2 instances larger than \`t3.xlarge\` without architecture board sign-off.

### 💻 3. Practical Commands
\`\`\`rego
# Sample OPA Rego policy blocking unencrypted S3 buckets
package terraform.security

deny[msg] {
    resource := tfplan.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.server_side_encryption_configuration
    msg := sprintf("S3 Bucket '%s' must have server-side encryption enabled!", [resource.address])
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is Policy as Code evaluated during \`terraform plan\` instead of post-apply?**  
  *A:* Pre-apply plan evaluation prevents non-compliant, unencrypted, or expensive resources from being provisioned in the first place, avoiding security breaches and unnecessary cloud costs.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Write an OPA policy restricting AWS EC2 instance types.
2. **Steps:**
   - Export plan JSON: \`terraform plan -out=tfplan && terraform show -json tfplan > plan.json\`.
   - Run \`opa eval --data policy.rego --input plan.json "data.terraform.security.deny"\` and verify validation output.`,
          },
          {
            id: "tf_mod_10",
            title: "Module 10: Drift Detection, State Refresh & Remediation Workflows",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Managing infrastructure drift when out-of-band manual changes occur:
- **Infrastructure Drift:** Discrepancy between real-world cloud resource configuration (e.g. manual AWS console edits) and code stored in Git.
- **Drift Detection:** Running scheduled \`terraform plan -detailed-exitcode\` jobs to detect unauthorized modifications.
- **Remediation Options:**
  - **Revert Cloud Drift:** Running \`terraform apply\` to overwrite manual console changes and restore Git desired state.
  - **Import Cloud Drift:** Using \`terraform import\` or HCL \`import {}\` blocks to adopt existing unmanaged resources into Terraform state.

### 🏢 2. Real-World DevOps Examples
- **Automated Nightly Drift Alerts:** Running a nightly scheduled GitHub Action executing \`terraform plan -detailed-exitcode\`. If an engineer manually altered a security group rule via AWS Console, the pipeline triggers an alert in Slack.

### 💻 3. Practical Commands
\`\`\`hcl
# Declarative import block (Terraform 1.5+)
import {
  to = aws_s3_bucket.legacy_data
  id = "legacy-company-data-bucket-2024"
}
\`\`\`

\`\`\`bash
# CLI command to import unmanaged resource into state
terraform import aws_instance.web i-0123456789abcdef0

# Run plan checking for exit code 2 (indicating drift)
terraform plan -detailed-exitcode
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does \`terraform import\` work and what are its limitations?**  
  *A:* \`terraform import\` reads an existing cloud resource and writes its attributes into the \`terraform.tfstate\` file. Prior to Terraform 1.5, it did not automatically generate HCL code files, requiring manual HCL code creation to match imported state.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Detect and remediate manual cloud resource drift.
2. **Steps:**
   - Deploy S3 bucket. Manually add a tag via AWS CLI/Console. Run \`terraform plan\` to observe drift detection, then run \`terraform apply\` to enforce Git desired state.`,
          },
          {
            id: "tf_mod_11",
            title: "Module 11: Terraform Cloud, HCP Terraform & Private Registries",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Managed SaaS platforms for enterprise HashiCorp Terraform collaboration:
- **HCP Terraform (formerly Terraform Cloud):** Cloud-hosted SaaS providing remote plan/apply execution engines, state locking, VCS integration, team RBAC, and cost estimation.
- **Private Module & Provider Registry:** Sharing internal, organization-vetted Terraform modules securely across enterprise teams.
- **Run Triggers & Notifications:** Chaining infrastructure deployments (e.g. triggering application stack runs automatically upon completion of VPC network workspace runs).

### 🏢 2. Real-World DevOps Examples
- **Automated Cost Estimation:** Integrating HCP Terraform into GitHub Pull Requests. Before merging code, HCP Terraform calculates estimated monthly cloud cost changes (e.g. "+$145.00/mo") directly on the PR discussion page.

### 💻 3. Practical Commands
\`\`\`hcl
# Configure HCP Terraform cloud backend block
terraform {
  cloud {
    organization = "my-devops-org"
    workspaces {
      name = "production-k8s-cluster"
    }
  }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the difference between Speculative Plans and Run Execution in HCP Terraform?**  
  *A:* Speculative plans are triggered automatically on GitHub Pull Requests to dry-run diffs without locking state. Run Execution occurs after PR merges to main, applying real cloud modifications.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Connect a GitHub repo to HCP Terraform workspace.
2. **Steps:**
   - Setup free HCP Terraform account, connect GitHub repo, set environment variables (AWS keys), trigger PR speculative plan and merge apply.`,
          },
          {
            id: "tf_mod_12",
            title: "Module 12: Automated CI/CD Pipelines with Atlantis & Static Scanners",
            duration: 60,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/SLB_c_ayRMo",
            content: `### 📖 1. Theory
Orchestrating GitOps-driven Infrastructure as Code automation:
- **Atlantis Infrastructure GitOps:** Self-hosted webhook bot that executes \`terraform plan\` and \`terraform apply\` directly inside Pull Request comment threads (\`atlantis plan\`, \`atlantis apply\`).
- **Static Security Scanning:**
  - **tfsec / checkov:** Scanning HCL code for security misconfigurations (open SSH ports, plain-text secrets, missing access logs) prior to commit.
  - **tflint:** Linter catching provider-specific syntax errors and deprecated arguments.

### 🏢 2. Real-World DevOps Examples
- **Enterprise Pull Request GitOps:** Engineers update HCL files in a PR. Atlantis automatically comments with the output of \`terraform plan\`. A Senior Lead reviews the plan and comments \`atlantis apply\` on the PR to trigger production cloud deployment.

### 💻 3. Practical Commands
\`\`\`bash
# Run Checkov security scan across Terraform codebase
checkov -d . --framework terraform

# Run tfsec static security audit
tfsec .

# Run tflint provider linter
tflint --init && tflint
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is Atlantis and why is it popular for Terraform GitOps workflows?**  
  *A:* Atlantis is an open-source tool that automates Terraform via GitHub/GitLab PR comments. It ensures state locking during PR reviews, enforces peer approvals before applying changes, and maintains an immutable audit trail directly in Git PR comments.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Build a GitHub Actions CI workflow with \`tflint\`, \`tfsec\`, and automated \`terraform plan\` PR comments.
2. **Steps:**
   - Create \`.github/workflows/terraform.yml\`.
   - Test workflow on a pull request containing unencrypted S3 resource to verify automated security block.`,
          },
        ],
      },
    ],
  },
  {
    id: "course_ansible_001",
    slug: "ansible-automation",
    title: "Ansible Configuration Management Masterclass",
    shortDescription: "Automate server configuration, application deployments, cloud provisioning, security hardening, and orchestration at scale with agentless Ansible and AWX/AAP.",
    description: "Master enterprise configuration management and IT automation with Ansible. Learn agentless SSH push architecture, declarative YAML playbooks, static and dynamic inventory plugins, Jinja2 dynamic configuration rendering, reusable Ansible Roles, encrypted Ansible Vault secrets, CIS security benchmark hardening, and enterprise AWX automation execution platforms.",
    category: "Configuration Management",
    level: "intermediate",
    price: 0,
    isPro: false,
    isFeatured: false,
    rating: 4.8,
    totalRatings: 1440,
    totalStudents: 9800,
    totalLessons: 10,
    durationHours: 15,
    instructor: "Jatin Sharma",
    instructorTitle: "Red Hat Certified Specialist in Ansible Automation",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
    icon: React.createElement(SiAnsible),
    color: "from-red-700 to-red-500",
    tags: ["Ansible", "Automation", "Configuration Management", "Jinja2", "Ansible Vault", "AWX", "Linux", "Security Hardening"],
    whatYouLearn: [
      "Understand Ansible's agentless SSH architecture, Control Node setup, and execution engine",
      "Execute ad-hoc commands for rapid fleet management, system auditing, and troubleshooting",
      "Write declarative, idempotent YAML playbooks using core modules (yum/apt, copy, template, service)",
      "Manage multi-cloud infrastructure using static INI/YAML and dynamic AWS EC2 inventory plugins",
      "Structure modular, scalable automation code using Ansible Roles and Ansible Galaxy",
      "Render dynamic configuration files using Jinja2 templates, filters, and conditional loops",
      "Secure sensitive API keys, passwords, and SSH keys using encrypted Ansible Vault",
      "Harden Linux servers to meet CIS Security Benchmarks using automated compliance playbooks",
      "Provision AWS infrastructure and deploy Kubernetes manifests via Ansible modules",
      "Orchestrate enterprise workflows, RBAC, and REST API job templates using AWX / Red Hat AAP",
    ],
    requirements: ["Linux fundamentals", "Basic YAML knowledge", "SSH key authentication"],
    updatedAt: "2026-09-21",
    sections: [
      {
        id: "sec_ans_01",
        title: "Section 1: Architecture & Playbook Design (Modules 1-3)",
        lessons: [
          {
            id: "ans_mod_01",
            title: "Module 1: Ansible Agentless Architecture & Ad-Hoc Command Fleet Management",
            duration: 45,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/goclfp6a2IQ",
            content: `### 📖 1. Theory
Ansible is an open-source, agentless IT automation engine built on Python and OpenSSH:
- **Agentless Architecture:** Requires no background daemons, agents, or database services on target managed nodes. Communicates purely via standard SSH (Linux/Unix) or WinRM (Windows).
- **Control Node:** Machine running Ansible CLI tools (\`ansible\`, \`ansible-playbook\`).
- **Managed Nodes:** Target servers managed by the Control Node.
- **Ad-Hoc Commands:** Executing single, one-off automation tasks across thousands of servers simultaneously without writing permanent playbooks.

### 🏢 2. Real-World DevOps Examples
- **Emergency Zero-Day Security Patching:** Running an ad-hoc command to instantly update OpenSSL across a fleet of 500 production web servers in under 30 seconds: \`ansible webservers -m yum -a "name=openssl state=latest"\`.

### 💻 3. Practical Commands
\`\`\`bash
# Test connectivity to all inventory target hosts
ansible all -m ping -i inventory.ini

# Gather system hardware facts (IPs, RAM, disk space, OS kernel)
ansible webservers -m setup

# Reboot a target group of servers safely with delay
ansible database -m reboot -a "reboot_timeout=300" --become
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is Ansible called "agentless" and what advantage does this provide over Chef/Puppet?**  
  *A:* Ansible requires no client agents pre-installed on target nodes; it executes lightweight Python modules over standard SSH and deletes them post-execution. This reduces CPU/RAM overhead and eliminates client agent bootstrapping maintenance.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Configure Ansible SSH key authentication and run ad-hoc commands.
2. **Steps:**
   - Generate SSH keypair on Control Node. Copy public key to managed nodes (\`ssh-copy-id\`).
   - Create \`inventory.ini\` and execute \`ansible all -m command -a "uptime"\`.`,
          },
          {
            id: "ans_mod_02",
            title: "Module 2: Playbook Syntax, Declarative Tasks & Idempotency",
            duration: 50,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/goclfp6a2IQ",
            content: `### 📖 1. Theory
Ansible Playbooks are declarative YAML files defining automation workflows:
- **Idempotency:** Core principle ensuring that running a playbook multiple times produces the exact same system state without unintended side effects. If a target service is already running or package installed, Ansible reports \`ok\` instead of \`changed\`.
- **Playbook Structure:**
  - \`hosts\`: Target group in inventory.
  - \`become\`: Privilege escalation (\`sudo\`).
  - \`vars\`: Playbook-scoped variables.
  - \`tasks\`: Ordered list of module execution steps.
  - \`handlers\`: Conditional tasks triggered only when notified by changes in main tasks.

### 🏢 2. Real-World DevOps Examples
- **Standardizing Server Provisioning:** Running an NGINX installation playbook. On first run, Ansible installs packages, writes configs, and starts NGINX (\`changed=3\`). On second run, Ansible verifies everything matches desired state and takes zero actions (\`ok=3, changed=0\`).

### 💻 3. Practical Commands
\`\`\`yaml
---
- name: Install and Configure NGINX Web Server
  hosts: webservers
  become: true
  tasks:
    - name: Install NGINX package
      ansible.builtin.package:
        name: nginx
        state: present

    - name: Ensure NGINX service is running and enabled at boot
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is Idempotency in Ansible and why is it critical?**  
  *A:* Idempotency guarantees that an operation can be applied repeatedly without changing the result beyond the initial application, preventing service disruption during re-runs of automation pipelines.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Write an idempotent playbook configuring a Node.js web server.
2. **Steps:**
   - Write \`deploy-node.yml\` installing Node.js, setting up app directory, and enabling systemd service. Run twice to verify zero changed tasks on second pass.`,
          },
          {
            id: "ans_mod_03",
            title: "Module 3: Inventory Management: Static Inventories & Dynamic Cloud Plugins",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/goclfp6a2IQ",
            content: `### 📖 1. Theory
Inventories define target servers managed by Ansible:
- **Static Inventory:** INI or YAML files mapping hostnames, IP addresses, groups, and child sub-groups (\`[webservers]\`, \`[databases]\`, \`[datacenter:children]\`).
- **Inventory Variables:** Defining \`ansible_host\`, \`ansible_user\`, \`ansible_ssh_private_key_file\`.
- **Dynamic Inventory Plugins:** Querying cloud APIs (AWS EC2, GCP, Azure, VMware) dynamically at runtime to discover target instances based on cloud tags (\`environment=production\`, \`role=web\`).

### 🏢 2. Real-World DevOps Examples
- **Autoscaling Group Automation:** Using the \`aws_ec2\` dynamic inventory plugin to automatically discover and run configuration playbooks on newly launched EC2 instances in an AWS Auto Scaling Group without maintaining static IP lists.

### 💻 3. Practical Commands
\`\`\`yaml
# aws_ec2.yml - AWS Dynamic Inventory Plugin Configuration
plugin: amazon.aws.aws_ec2
regions:
  - us-east-1
filters:
  tag:Environment: production
  instance-state-name: [running]
keyed_groups:
  - key: tags.Role
    prefix: role
\`\`\`

\`\`\`bash
# List all dynamically discovered hosts from AWS
ansible-inventory -i aws_ec2.yml --graph
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why are Dynamic Inventories preferred over Static Inventories in Cloud/DevOps environments?**  
  *A:* Cloud instances are ephemeral and auto-scaled; static IP inventories quickly become stale. Dynamic inventories query cloud APIs in real-time to discover current active nodes automatically.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Configure an AWS dynamic inventory plugin using tag filters.
2. **Steps:**
   - Configure \`aws_ec2.yml\` plugin, authenticate via AWS credentials, and verify host grouping via \`ansible-inventory --graph\`.`,
          },
        ],
      },
      {
        id: "sec_ans_02",
        title: "Section 2: Modular Automation & Templating (Modules 4-6)",
        lessons: [
          {
            id: "ans_mod_04",
            title: "Module 4: Ansible Roles, Directory Structure & Ansible Galaxy Publishing",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/goclfp6a2IQ",
            content: `### 📖 1. Theory
Ansible Roles organize playbooks into reusable, modular directory hierarchies:
- **Role Directory Layout:**
  - \`tasks/main.yml\`: Primary task execution list.
  - \`handlers/main.yml\`: Event handlers (service restarts).
  - \`templates/main.j2\`: Jinja2 configuration templates.
  - \`vars/main.yml\`: High-priority internal variables.
  - \`defaults/main.yml\`: Low-priority default variables (easily overridden by callers).
  - \`meta/main.yml\`: Metadata and role dependencies.
- **Ansible Galaxy:** Public repository for sharing and downloading community roles (\`ansible-galaxy install geerlingguy.docker\`).

### 🏢 2. Real-World DevOps Examples
- **Standardizing Enterprise Roles:** Creating an enterprise \`role_hardened_bastion\` deployed across all corporate cloud jump hosts to enforce SSH key enforcement, fail2ban rules, and automatic security update schedules.

### 💻 3. Practical Commands
\`\`\`bash
# Initialize a standard Ansible Role directory structure
ansible-galaxy role init roles/common_base

# Install external roles defined in requirements.yml
ansible-galaxy install -r requirements.yml
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the Variable Precedence hierarchy in Ansible?**  
  *A:* Ansible evaluates variables in 22 precedence levels. Extra vars (\`-e var=value\`) have the highest priority; role \`defaults/main.yml\` has the lowest priority, making defaults ideal for overrides.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Build a custom Ansible Role for PostgreSQL database installation.
2. **Steps:**
   - Create \`roles/postgres\` with \`tasks\`, \`handlers\`, \`templates\`, and \`defaults\`. Invoke role from root \`site.yml\`.`,
          },
          {
            id: "ans_mod_05",
            title: "Module 5: Dynamic Templating with Jinja2, Filters & Conditional Loops",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/goclfp6a2IQ",
            content: `### 📖 1. Theory
Rendering dynamic configuration files using Python Jinja2 templating syntax:
- **Jinja2 Syntax:**
  - Variables: \`{{ http_port }}\`
  - Control Logic: \`{% if enable_ssl %} ... {% endif %}\`
  - Loops: \`{% for host in groups['webservers'] %} {{ host }} {% endfor %}\`
- **Filters:** Transforming variable data dynamically (\`{{ list_var | unique }}\`, \`{{ password | password_hash('sha512') }}\`, \`{{ json_str | from_json }}\`).
- **Conditionals & Error Handling:** \`when\` statements, \`failed_when\`, \`changed_when\`, and \`block/rescue/always\` exception handling.

### 🏢 2. Real-World DevOps Examples
- **Dynamic Load Balancer Configuration:** Using a Jinja2 template (\`nginx.conf.j2\`) to dynamically iterate over the \`webservers\` inventory group and generate upstream backend server pool IP entries automatically.

### 💻 3. Practical Commands
\`\`\`jinja2
# Sample NGINX upstream template (nginx.conf.j2)
upstream backend_nodes {
{% for host in groups['webservers'] %}
    server {{ hostvars[host]['ansible_default_ipv4']['address'] }}:8080 max_fails=3 fail_timeout=10s;
{% endfor %}
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does \`block / rescue / always\` work in Ansible playbooks?**  
  *A:* \`block\` groups tasks together. If any task within the block fails, execution jumps to the \`rescue\` block for error handling/rollback. The \`always\` block executes regardless of success or failure (similar to try/catch/finally).

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Deploy dynamic NGINX reverse proxy config using Jinja2 loops.
2. **Steps:**
   - Create \`nginx.conf.j2\` with upstream loop. Render template via \`template\` module and verify rendered output on target.`,
          },
          {
            id: "ans_mod_06",
            title: "Module 6: Vault Secrets Encryption, Key Rotation & Vault Password Files",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/goclfp6a2IQ",
            content: `### 📖 1. Theory
Encrypting sensitive passwords, SSH private keys, and API tokens in Git repos:
- **Ansible Vault:** Built-in AES-256 encryption engine for protecting variable files (\`group_vars/all/vault.yml\`) or individual encrypted string inline blocks (\`!vault |\`).
- **Vault Operations:**
  - \`ansible-vault create\`: Create new encrypted file.
  - \`ansible-vault view / edit\`: Inspect/edit encrypted file.
  - \`ansible-vault rekey\`: Rotate encryption master password.

### 🏢 2. Real-World DevOps Examples
- **Securing GitOps Pipelines:** Storing encrypted production database passwords in Git repositories safely using Ansible Vault, passing \`--vault-password-file\` from secure CI runner secrets during deployment.

### 💻 3. Practical Commands
\`\`\`bash
# Encrypt an existing sensitive variable file
ansible-vault encrypt group_vars/production/vault.yml

# Run playbook reading vault password from file
ansible-playbook site.yml --vault-password-file ~/.ansible_vault_pass

# Encrypt a single password string for inline placement
ansible-vault encrypt_string 'MySuperSecretDBPass123!' --name 'db_password'
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do you handle Ansible Vault passwords in automated non-interactive CI/CD pipelines?**  
  *A:* Store the vault password in a CI environment secret, write it to a temporary file during build initialization, and pass \`--vault-password-file\` to \`ansible-playbook\`, scrubbing the file post-execution.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Encrypt database passwords with Ansible Vault and execute playbook.
2. **Steps:**
   - Encrypt \`vault.yml\`. Reference encrypted \`db_password\` variable in a template step and verify decrypted deployment on target.`,
          },
        ],
      },
      {
        id: "sec_ans_03",
        title: "Section 3: Cloud & Enterprise Orchestration (Modules 7-10)",
        lessons: [
          {
            id: "ans_mod_07",
            title: "Module 7: OS Security Hardening Playbooks & CIS Compliance Auditing",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/goclfp6a2IQ",
            content: `### 📖 1. Theory
Automating enterprise security compliance benchmarks across Linux fleets:
- **CIS Benchmarks:** Center for Internet Security guidelines for securing operating systems (RHEL, Ubuntu, Debian).
- **Hardening Control Scope:**
  - Disabling root SSH login (\`PermitRootLogin no\`) and password authentication.
  - Enforcing UFW / iptables firewall rules.
  - Configuring kernel runtime security parameters via \`sysctl\` (disabling ICMP redirects, enabling SYN cookies).
  - Configuring automated security updates (\`unattended-upgrades\`).

### 🏢 2. Real-World DevOps Examples
- **Automated SOC2 Compliance:** Running an automated nightly compliance audit playbook across 200 cloud servers. If any server deviates from CIS benchmarks, Ansible automatically remediates security flags and sends an audit report to Slack.

### 💻 3. Practical Commands
\`\`\`yaml
# Kernel security hardening task example
- name: Enable TCP SYN Cookies defense against SYN flood attacks
  ansible.posix.sysctl:
    name: net.ipv4.tcp_syncookies
    value: '1'
    state: present
    reload: true
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do you perform security audits with Ansible without altering target server states?**  
  *A:* Execute \`ansible-playbook --check --diff site.yml\`. Dry-run check mode scans target nodes and reports discrepancies without applying modifications.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Write an SSH server security hardening playbook.
2. **Steps:**
   - Create playbook disabling password auth, restricting SSH ports, enforcing protocol version 2, and testing dry-run mode (\`--check\`).`,
          },
          {
            id: "ans_mod_08",
            title: "Module 8: AWS Infrastructure Provisioning & Kubernetes Automation",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/goclfp6a2IQ",
            content: `### 📖 1. Theory
Using Ansible collections to orchestrate cloud resources and Kubernetes clusters:
- **Cloud Collections (\`amazon.aws\`):** Provisioning EC2 instances, S3 buckets, VPCs, Security Groups, and IAM roles directly from Ansible playbooks.
- **Kubernetes Collection (\`kubernetes.core\`):** Applying Kubernetes manifests, managing Helm releases, and interacting with K8s API servers declaratively via Ansible tasks.

### 🏢 2. Real-World DevOps Examples
- **Provisioning Hybrid Stacks:** Running a unified Ansible playbook that provisions AWS EC2 instances, bootstraps a Kubernetes control plane via Kubeadm, and deploys NGINX Helm charts in a single end-to-end execution.

### 💻 3. Practical Commands
\`\`\`yaml
# Provisioning an S3 bucket via Ansible amazon.aws collection
- name: Create secure AWS S3 bucket for audit logs
  amazon.aws.s3_bucket:
    name: my-company-audit-logs-2024
    state: present
    encryption: "AES256"
    versioning: true
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does Ansible compare to Terraform for cloud infrastructure provisioning?**  
  *A:* Terraform excels at declarative cloud state management and provisioning (IaC). Ansible excels at configuration management and OS-level software installation. Best practice uses Terraform for infrastructure setup and Ansible for node configuration.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Deploy a Kubernetes pod manifest using \`kubernetes.core.k8s\` module.
2. **Steps:**
   - Install \`kubernetes\` Python library on Control Node. Write playbook applying a Deployment manifest and verify deployment on cluster.`,
          },
          {
            id: "ans_mod_09",
            title: "Module 9: Asynchronous Tasks, Poll Intervals & Fire-and-Forget Handlers",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/goclfp6a2IQ",
            content: `### 📖 1. Theory
Managing long-running execution tasks and background execution loops:
- **Asynchronous Execution (\`async\` & \`poll\`):**
  - \`async: 3600\`: Maximum allowed task execution time in seconds.
  - \`poll: 0\`: Fire-and-forget mode; Ansible immediately moves to the next task without waiting for completion.
  - \`poll: 15\`: Ansible polls the target host every 15 seconds to check task status.
- **Async Status Checker:** Querying long-running job status via \`async_status\` module.

### 🏢 2. Real-World DevOps Examples
- **Database Backup Automation:** Triggering a 4-hour database dump task using \`async: 14400, poll: 0\`, allowing the playbook to perform other maintenance steps while monitoring backup job progress periodically.

### 💻 3. Practical Commands
\`\`\`yaml
- name: Execute long-running database migration in background
  ansible.builtin.command: /opt/scripts/migrate-db.sh
  async: 1800
  poll: 0
  register: db_job

- name: Perform interim tasks while migration runs
  ansible.builtin.debug:
    msg: "Database migration running asynchronously..."

- name: Wait for database migration completion
  ansible.builtin.async_status:
    jid: "{{ db_job.ansible_job_id }}"
  register: job_result
  until: job_result.finished
  retries: 30
  delay: 10
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the effect of setting \`poll: 0\` on an \`async\` task in Ansible?**  
  *A:* Setting \`poll: 0\` runs the task asynchronously in "fire-and-forget" mode. Ansible launches the process on the target server and immediately advances to subsequent playbook tasks without blocking execution.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Launch an asynchronous background task with polling validation.
2. **Steps:**
   - Write a playbook triggering a 30-second sleep script using \`async: 100, poll: 0\`, polling job status via \`async_status\` until completion.`,
          },
          {
            id: "ans_mod_10",
            title: "Module 10: Enterprise AWX & Red Hat Ansible Automation Platform (AAP)",
            duration: 60,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/goclfp6a2IQ",
            content: `### 📖 1. Theory
Enterprise web UI, REST API, and RBAC control plane for Ansible:
- **AWX / AAP Core Capabilities:**
  - **Job Templates:** Encapsulating playbooks, credentials, inventory, and extra vars into repeatable push-button execution templates.
  - **Role-Based Access Control (RBAC):** Granting push-button execution access to non-sysadmin developers without exposing raw SSH credentials.
  - **Workflow Job Templates:** Chaining multiple job templates into complex DAG execution workflows with conditional success/failure branches.
  - **REST API & Webhooks:** Triggering AWX playbook runs automatically from GitHub PR webhooks or ServiceNow ITSM tickets.

### 🏢 2. Real-World DevOps Examples
- **Self-Service Developer Portals:** Setting up an AWX push-button Job Template allowing QA testers to trigger on-demand staging database resets without needing SSH access or terminal CLI commands.

### 💻 3. Practical Commands
\`\`\`bash
# Trigger an AWX Job Template via REST API curl request
curl -f -k -H "Content-Type: application/json" \
  -H "Authorization: Bearer <AWX_TOKEN>" \
  -X POST https://awx.company.com/api/v2/job_templates/42/launch/
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is AWX and how does it extend standalone Ansible CLI?**  
  *A:* AWX is the open-source web UI and REST API control platform for Ansible. It adds centralized credential storage, web UI execution, RBAC, inventory syncs, workflow visualizers, and audit logging.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Trigger an AWX Job Template via REST API script.
2. **Steps:**
   - Set up API token, inspect job template payload schema, execute launch request via curl/Python and monitor execution status.`,
          },
        ],
      },
    ],
  },
  {
    id: "course_aws_001",
    slug: "aws-devops-engineer",
    title: "AWS for DevOps Engineers Masterclass",
    shortDescription: "Master production AWS infrastructure for DevOps & SREs: IAM least-privilege, VPC Transit Gateway, EKS IRSA, RDS HA, Serverless Lambda, CodePipeline, CloudFormation/CDK, CloudWatch telemetry, FinOps, and AWS Certified DevOps Engineer Professional exam prep.",
    description: "Prepare for the AWS Certified DevOps Engineer Professional exam while building production-grade enterprise cloud infrastructure. Learn multi-AZ VPC architecture, IAM ABAC security boundaries, Amazon EKS with IAM Roles for Service Accounts (IRSA), serverless event-driven microservices, cloud-native CodePipeline CI/CD, AWS CDK, FinOps cost optimization, and multi-account AWS Control Tower governance.",
    category: "Cloud",
    level: "advanced",
    price: 0,
    isPro: false,
    isFeatured: true,
    rating: 4.9,
    totalRatings: 3840,
    totalStudents: 28600,
    totalLessons: 15,
    durationHours: 25,
    instructor: "Jatin Sharma",
    instructorTitle: "AWS Certified Solutions Architect & DevOps Engineer Professional",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    icon: React.createElement(Cloud, { size: 24 }),
    color: "from-amber-500 to-orange-600",
    tags: ["AWS", "Cloud", "EKS", "Lambda", "VPC", "CodePipeline", "IAM", "CDK", "CloudWatch", "FinOps", "DevOps"],
    whatYouLearn: [
      "Master IAM least-privilege policies, Permission Boundaries, STS AssumeRole, and ABAC",
      "Architect multi-AZ VPC networks with public/private subnets, NAT Gateways, and Transit Gateway",
      "Manage KMS customer master keys, Secrets Manager rotation, and SSM Parameter Store",
      "Deploy self-healing compute fleets using EC2 Auto Scaling Groups and Application Load Balancers",
      "Architect resilient data layers with S3 Cross-Region Replication and RDS Multi-AZ failover",
      "Build serverless event-driven architectures with AWS Lambda, API Gateway, SQS, and EventBridge",
      "Deploy enterprise Amazon EKS Kubernetes clusters with IAM Roles for Service Accounts (IRSA)",
      "Automate cloud-native continuous delivery using CodePipeline, CodeBuild, and CodeDeploy",
      "Provision programmatic cloud infrastructure using AWS CloudFormation and AWS CDK",
      "Implement AWS Organizations multi-account governance with Service Control Policies (SCPs) and FinOps",
    ],
    requirements: ["Linux command line basics", "Networking fundamentals", "Basic cloud provider awareness"],
    updatedAt: "2026-09-21",
    sections: [
      {
        id: "sec_aws_01",
        title: "Section 1: Identity, Security & Networking Foundations (Modules 1-4)",
        lessons: [
          {
            id: "aws_mod_01",
            title: "Module 1: IAM Deep Dive: Roles, ABAC, Permission Boundaries & STS AssumeRole",
            duration: 50,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
AWS Identity and Access Management (IAM) controls access to AWS compute and storage resources:
- **IAM Policy Evaluation Logic:** Explicit Deny $\rightarrow$ Explicit Allow $\rightarrow$ Implicit Deny.
- **Components:**
  - **Users & Groups:** Human/service credentials.
  - **Roles:** Ephemeral credentials assumed by trusted entities (EC2, Lambda, EKS Pods, external accounts).
  - **Permission Boundaries:** Advanced policy setting maximum allowable permissions for IAM entities.
  - **Attribute-Based Access Control (ABAC):** Authorization model granting permissions based on tag attributes (\`env=prod\`, \`team=payments\`).
  - **AWS STS (Security Token Service):** Issuing short-lived temporary security credentials via \`AssumeRole\`.

### 🏢 2. Real-World DevOps Examples
- **Eliminating Static Access Keys:** Enforcing IAM Roles and STS AssumeRole for all CI/CD runners (GitHub Actions OIDC), eliminating hardcoded \`AWS_ACCESS_KEY_ID\` strings across corporate Git repositories.

### 💻 3. Practical Commands
\`\`\`bash
# Assume a cross-account IAM role using AWS STS
aws sts assume-role \
  --role-arn "arn:aws:iam::123456789012:role/ProductionDeployer" \
  --role-session-name "GitHubCI-Session"

# View active caller identity context
aws sts get-caller-identity
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is an IAM Permission Boundary and how does it prevent privilege escalation?**  
  *A:* A Permission Boundary is a management policy that sets the maximum permissions an IAM user or role can possess, preventing developers from creating new IAM admin roles that exceed their boundary limits.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Configure cross-account IAM role assumption via AWS STS.
2. **Steps:**
   - Create Trust Policy on Target Role permitting Origin Account ID.
   - Execute \`aws sts assume-role\` from origin CLI and verify temporary credential activation.`,
          },
          {
            id: "aws_mod_02",
            title: "Module 2: Enterprise VPC Architecture: Multi-AZ Subnets & Transit Gateway",
            duration: 55,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Virtual Private Cloud (VPC) provides isolated virtual networking for AWS resources:
- **Subnet Design:** Public Subnets (Internet Gateway route), Private App Subnets (NAT Gateway route), Private Isolated DB Subnets (Zero internet egress routes).
- **NAT Gateway:** Managed network address translation allowing private instances to initiate outbound internet traffic while blocking inbound internet connections.
- **Inter-VPC Connectivity:**
  - **VPC Peering:** Direct, non-transitive network routing between two VPCs.
  - **AWS Transit Gateway (TGW):** Centralized hub-and-spoke router connecting hundreds of VPCs, on-premise VPNs, and Direct Connect links.

### 🏢 2. Real-World DevOps Examples
- **Enterprise Multi-VPC Topology:** Architecting a hub-and-spoke network with Transit Gateway connecting separate \`Dev\`, \`Staging\`, and \`Prod\` VPCs to a central \`Shared-Services\` VPC hosting Jenkins and SonarQube runners.

### 💻 3. Practical Commands
\`\`\`bash
# Query VPC subnet route tables and internet egress routes
aws ec2 describe-route-tables --filter "Name=vpc-id,Values=vpc-0abc12345"

# Create an AWS Transit Gateway attachment
aws ec2 create-transit-gateway-vpc-attachment \
  --transit-gateway-id tgw-0123456789 \
  --vpc-id vpc-0abc12345 \
  --subnet-ids subnet-aaa111 subnet-bbb222
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the key difference between VPC Peering and AWS Transit Gateway?**  
  *A:* VPC Peering is non-transitive (peering VPC A $\leftrightarrow$ B and B $\leftrightarrow$ C does not connect A $\leftrightarrow$ C). Transit Gateway is a centralized transitive router allowing any attached VPC to communicate with any other attached VPC based on route tables.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Deploy a multi-AZ VPC with Public and Private Subnets across 2 AZs.
2. **Steps:**
   - Allocate CIDR \`10.0.0.0/16\`. Create IGW, NAT Gateway, Route Tables, and verify private subnet egress internet connectivity.`,
          },
          {
            id: "aws_mod_03",
            title: "Module 3: KMS Key Management, Secrets Manager & SSM Parameter Store",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Data encryption and secure parameters management:
- **AWS Key Management Service (KMS):** Managed cryptographic key service handling envelope encryption via Customer Managed Keys (CMKs).
- **AWS Systems Manager (SSM) Parameter Store:** Hierarchical storage for configuration data and secrets (\`String\`, \`StringList\`, \`SecureString\` encrypted via KMS).
- **AWS Secrets Manager:** Specialized secret storage providing automated key rotation (RDS passwords, API tokens) via integrated Lambda functions.

### 🏢 2. Real-World DevOps Examples
- **Zero-Downtime DB Password Rotation:** Configuring AWS Secrets Manager to rotate PostgreSQL database passwords automatically every 30 days, updating RDS master secrets and triggering Lambda to update microservice connection pools seamlessly.

### 💻 3. Practical Commands
\`\`\`bash
# Store an encrypted database secret in SSM Parameter Store
aws ssm put-parameter \
  --name "/production/database/password" \
  --value "SuperSecretDBPass2024!" \
  --type "SecureString" \
  --key-id "alias/aws/ssm"

# Retrieve and decrypt secure parameter
aws ssm get-parameter --name "/production/database/password" --with-decryption
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the main operational difference between SSM Parameter Store and AWS Secrets Manager?**  
  *A:* SSM Parameter Store is a low-cost hierarchical key-value store. Secrets Manager natively supports automated password rotation using Lambda, cross-account secret sharing, and fine-grained secret lifecycle management at higher cost.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Secure application secrets using SSM Parameter Store and KMS encryption.
2. **Steps:**
   - Create custom KMS key. Write encrypted parameter, configure IAM policy allowing read-only decryption, and verify CLI fetch.`,
          },
          {
            id: "aws_mod_04",
            title: "Module 4: Network Security: Security Groups, Network ACLs & AWS WAF",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Defense-in-depth network security controls:
- **Security Groups (SG):** Stateful virtual firewalls operating at the EC2 instance/ENI level. Evaluates ALLOW rules only. Automatically allows return traffic.
- **Network ACLs (NACL):** Stateless firewalls operating at the Subnet boundary. Evaluates ALLOW and DENY rules sequentially by rule number. Requires explicit outbound return rules.
- **AWS WAF (Web Application Firewall):** Layer 7 application inspection blocking SQL Injection, Cross-Site Scripting (XSS), and rate limiting bad actors on ALB or CloudFront.

### 🏢 2. Real-World DevOps Examples
- **Mitigating HTTP Flood DDoS Attacks:** Configuring AWS WAF Rate-Based Rules on an Application Load Balancer to automatically block any IP address making more than 1,000 HTTP requests in a 5-minute window.

### 💻 3. Practical Commands
\`\`\`bash
# Associate a WAF WebACL with an Application Load Balancer
aws wafv2 associate-web-acl \
  --web-acl-arn "arn:aws:wafv2:us-east-1:123456789012:regional/webacl/ProductionWAF/abc-123" \
  --resource-arn "arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/prod-alb/123456"
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What happens if a stateless Network ACL allows inbound TCP port 80 traffic but blocks outbound TCP ephemeral ports 1024-65535?**  
  *A:* Web server requests will arrive at the server, but the server will fail to respond back to clients because return traffic is blocked by the stateless NACL. (Security Groups handle this statefully).

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Configure stateful Security Group tiering between ALB, App Instances, and RDS Database.
2. **Steps:**
   - Restrict App SG to allow traffic ONLY from ALB SG ID. Restrict DB SG to allow traffic ONLY from App SG ID. Verify network isolation.`,
          },
        ],
      },
      {
        id: "sec_aws_02",
        title: "Section 2: Compute, Storage & Databases (Modules 5-8)",
        lessons: [
          {
            id: "aws_mod_05",
            title: "Module 5: High Availability Compute: EC2, Auto Scaling Groups & ALB",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Designing self-healing, scale-out compute fleets:
- **Application Load Balancer (ALB):** Layer 7 load balancer routing traffic based on HTTP headers, path rules (\`/api/*\`), and host headers. Performs health checks on target groups.
- **Auto Scaling Groups (ASG):** Automatically launches or terminates EC2 instances across multiple AZs based on CPU utilization, custom CloudWatch metrics, or target tracking policies.
- **Launch Templates:** Defining EC2 instance parameters (AMI, instance type, user data scripts, security groups, IAM instance profile).

### 🏢 2. Real-World DevOps Examples
- **Zero-Downtime EC2 Rolling Deployments:** Updating ASG Launch Templates with a new application AMI, triggering an Instance Refresh rollout that terminates old instances 1-by-1 only after new instances pass ALB health checks.

### 💻 3. Practical Commands
\`\`\`bash
# Trigger an Auto Scaling Group Instance Refresh for zero-downtime AMI rollout
aws autoscaling start-instance-refresh \
  --auto-scaling-group-name prod-web-asg \
  --preferences '{"MinHealthyPercentage": 50, "InstanceWarmup": 300}'
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does ALB Target Group Health Checking work during an ASG scale-out event?**  
  *A:* Newly launched EC2 instances remain in \`Initial\` state until they pass consecutive successful HTTP health checks (e.g. 3 checks returning 200 OK), at which point ALB marks them \`Healthy\` and routes live traffic.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Deploy an Auto Scaling Group behind an Application Load Balancer.
2. **Steps:**
   - Write UserData bootstrapping NGINX. Configure Launch Template, ASG with target tracking policy (CPU > 60%), and test failover by terminating an instance.`,
          },
          {
            id: "aws_mod_06",
            title: "Module 6: S3 Lifecycle Management, Cross-Region Replication & CloudFront CDN",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Global object storage and low-latency content distribution:
- **S3 Storage Classes:** Standard $\rightarrow$ Intelligent-Tiering $\rightarrow$ Standard-IA $\rightarrow$ Glacier Instant Retrieval $\rightarrow$ Glacier Deep Archive.
- **S3 Lifecycle Rules:** Transitioning or expiring objects automatically based on age to reduce cloud storage costs.
- **Cross-Region Replication (CRR):** Asynchronously replicating S3 objects to another AWS region for disaster recovery.
- **Amazon CloudFront:** Global Content Delivery Network (CDN) caching static assets (HTML, images, video) at 400+ Edge Locations globally.

### 🏢 2. Real-World DevOps Examples
- **Optimizing Cloud Storage Costs:** Configuring S3 Lifecycle policies to move application logs from S3 Standard to Glacier Deep Archive after 90 days, reducing storage costs from $0.023/GB to $0.00099/GB (95% cost reduction).

### 💻 3. Practical Commands
\`\`\`bash
# Create CloudFront Cache Invalidations to purge stale edge assets
aws cloudfront create-invalidation \
  --distribution-id E1A2B3C4D5E6F7 \
  --paths "/*"
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do you secure an S3 origin bucket so static website content is accessible ONLY via CloudFront?**  
  *A:* Use Origin Access Control (OAC). Block public internet access on the S3 bucket and attach a S3 Bucket Policy allowing access exclusively to the CloudFront Service Principal.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Deploy a secure static website on S3 with CloudFront CDN OAC.
2. **Steps:**
   - Create private S3 bucket, deploy CloudFront distribution with OAC, attach bucket policy, and verify global edge delivery.`,
          },
          {
            id: "aws_mod_07",
            title: "Module 7: RDS PostgreSQL Multi-AZ High Availability & DynamoDB Global Tables",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Managed relational and NoSQL database architectures:
- **RDS Multi-AZ Deployment:** Synchronous physical block-level replication to a standby instance in a secondary Availability Zone. Automatic DNS failover takes 60-120 seconds.
- **RDS Read Replicas:** Asynchronous read-only instances for offloading heavy analytical queries.
- **Amazon DynamoDB:** Fully managed, serverless NoSQL database providing single-digit millisecond performance. Global Tables support active-active multi-region replication.

### 🏢 2. Real-World DevOps Examples
- **Automated Database Disaster Recovery:** Architecting an enterprise RDS PostgreSQL Multi-AZ setup with automated cross-region snapshot copy to \`us-west-2\` for compliance disaster recovery.

### 💻 3. Practical Commands
\`\`\`bash
# Fail over an RDS Multi-AZ DB Instance manually for testing
aws rds reboot-db-instance \
  --db-instance-identifier prod-postgres-db \
  --force-failover
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the key functional difference between RDS Multi-AZ and RDS Read Replicas?**  
  *A:* Multi-AZ is designed for High Availability and Disaster Recovery (synchronous replication, standby cannot be queried). Read Replicas are designed for Read Scaling (asynchronous replication, endpoints can be directly queried).

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Deploy RDS PostgreSQL Multi-AZ instance and execute force failover test.
2. **Steps:**
   - Create RDS Multi-AZ database, connect via psql client, execute \`aws rds reboot-db-instance --force-failover\` and monitor application reconnect time.`,
          },
          {
            id: "aws_mod_08",
            title: "Module 8: Serverless Architectures: Lambda, API Gateway & EventBridge",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Event-driven serverless application design:
- **AWS Lambda:** Ephemeral compute service running code in response to events without provisioning servers. Configured via memory, timeout (max 15 mins), and execution roles.
- **Amazon API Gateway:** Managed HTTP/REST/WebSocket proxy exposing Lambda functions to external public web traffic. Handles rate limiting, API keys, and CORS.
- **Amazon EventBridge & SQS:** Serverless event bus and message queues decoupling microservices asynchronously.

### 🏢 2. Real-World DevOps Examples
- **Automated Image Thumbnail Processing:** User uploads an image to S3 $\rightarrow$ S3 triggers an EventBridge event $\rightarrow$ EventBridge invokes a Python Lambda function to resize the image $\rightarrow$ Lambda writes thumbnail to S3 and publishes SQS message.

### 💻 3. Practical Commands
\`\`\`bash
# Tail real-time CloudWatch logs for a Lambda function execution
aws logs tail /aws/lambda/image-resizer-function --follow
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What causes Lambda Cold Starts and how can you mitigate them?**  
  *A:* Cold starts occur when a new container environment must be initialized for an incoming request. Mitigate using Provisioned Concurrency, keeping deployment package sizes minimal, or choosing fast runtime environments (Go/NodeJS vs Java).

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Build a serverless REST API using API Gateway, Lambda, and DynamoDB.
2. **Steps:**
   - Create DynamoDB table. Write Python Lambda function inserting items. Configure API Gateway HTTP endpoint and test via POST curl.`,
          },
        ],
      },
      {
        id: "sec_aws_03",
        title: "Section 3: Containers, Kubernetes & DevOps Automation (Modules 9-12)",
        lessons: [
          {
            id: "aws_mod_09",
            title: "Module 9: Amazon EKS Architecture, Managed Node Groups & IRSA Security",
            duration: 60,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Enterprise managed Kubernetes clusters on AWS:
- **EKS Architecture:** AWS manages the control plane (API Servers, etcd) across 3 AZs. Worker nodes run in customer VPC via Managed Node Groups or Fargate.
- **IAM Roles for Service Accounts (IRSA):** Mapping AWS IAM Roles directly to individual Kubernetes ServiceAccounts using OpenID Connect (OIDC) identity federation, eliminating node-level EC2 IAM policies.

### 🏢 2. Real-World DevOps Examples
- **Enforcing Least-Privilege Pod Security:** Using IRSA so that an S3 backup pod in Kubernetes has access ONLY to its designated S3 bucket, while preventing neighboring payment pods on the same node from accessing AWS S3 resources.

### 💻 3. Practical Commands
\`\`\`bash
# Associate OIDC Provider with EKS cluster for IRSA support
eksctl utils associate-iam-oidc-provider --cluster prod-eks-cluster --approve

# Create IRSA mapping an IAM Role to a K8s ServiceAccount
eksctl create iamserviceaccount \
  --cluster prod-eks-cluster \
  --namespace default \
  --name s3-reader-sa \
  --attach-policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess \
  --approve
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is IRSA and why is it superior to assigning IAM roles to EC2 worker nodes?**  
  *A:* Assigning IAM roles to EC2 worker nodes grants every pod running on that node full access to those cloud permissions. IRSA uses OIDC tokens to scope IAM permissions Granularly to individual Pod ServiceAccounts.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Deploy an EKS cluster and configure IRSA for Pod S3 access.
2. **Steps:**
   - Provision EKS cluster via eksctl/Terraform. Associate OIDC provider, deploy pod using \`s3-reader-sa\` and verify \`aws s3 ls\` execution.`,
          },
          {
            id: "aws_mod_10",
            title: "Module 10: Cloud-Native CI/CD: AWS CodePipeline, CodeBuild & CodeDeploy",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
AWS-native fully managed continuous integration and continuous delivery service suite:
- **AWS CodePipeline:** Orchestrating multi-stage build, test, and deployment workflows.
- **AWS CodeBuild:** Fully managed build service compiling source code, running tests, and producing container images via \`buildspec.yml\`.
- **AWS CodeDeploy:** Automating application deployments to EC2, Lambda, or EKS via \`appspec.yml\`, supporting Canary and Blue/Green strategies.

### 🏢 2. Real-World DevOps Examples
- **Automated EKS Continuous Deployment:** GitHub commit pushes code $\rightarrow$ CodePipeline triggers CodeBuild to build container image and push to ECR $\rightarrow$ CodeBuild updates Kubernetes deployment manifests using \`kubectl set image\`.

### 💻 3. Practical Commands
\`\`\`yaml
# Sample buildspec.yml for AWS CodeBuild
version: 0.2
phases:
  pre_build:
    commands:
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_URI
  build:
    commands:
      - docker build -t $ECR_URI:latest .
  post_build:
    commands:
      - docker push $ECR_URI:latest
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the purpose of \`buildspec.yml\` and \`appspec.yml\` in AWS CI/CD pipelines?**  
  *A:* \`buildspec.yml\` defines build environment commands executed by CodeBuild (compiling, testing, containerizing). \`appspec.yml\` defines deployment hooks and lifecycle scripts executed by CodeDeploy during updates.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Build an end-to-end CodePipeline deploying a container to AWS ECR and EKS.
2. **Steps:**
   - Create ECR repository. Configure CodePipeline, CodeBuild with \`buildspec.yml\`, push GitHub commit and verify deployment.`,
          },
          {
            id: "aws_mod_11",
            title: "Module 11: Declarative Automation: AWS CloudFormation & AWS CDK",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Infrastructure as Code engines native to the AWS ecosystem:
- **AWS CloudFormation:** Native YAML/JSON template engine creating stacks of managed AWS resources with change sets and drift detection.
- **AWS Cloud Development Kit (CDK):** Open-source software development framework defining cloud infrastructure using familiar programming languages (TypeScript, Python, Java, C#). Synthesizes imperatively written code into CloudFormation templates.

### 🏢 2. Real-World DevOps Examples
- **Programmatic CDK Infrastructure:** Writing a TypeScript CDK app that defines a complete serverless application stack (API Gateway + Lambda + DynamoDB) in 50 lines of code, using L2 constructs with built-in security defaults.

### 💻 3. Practical Commands
\`\`\`typescript
// Sample AWS CDK TypeScript Construct
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class SecureBucketStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'AuditLogBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
  }
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the difference between AWS CDK Construct levels (L1, L2, L3)?**  
  *A:* L1 constructs are 1-to-1 direct mappings of raw CloudFormation resources (\`CfnBucket\`). L2 constructs are intent-based AWS-curated helpers with security defaults (\`Bucket\`). L3 constructs are full architectural patterns (\`ApplicationLoadBalancedFargateService\`).

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Deploy an S3 bucket and CloudFront distribution using AWS CDK TypeScript.
2. **Steps:**
   - Initialize CDK app (\`cdk init app --language typescript\`). Write stack, execute \`cdk diff\` and \`cdk deploy\`.`,
          },
          {
            id: "aws_mod_12",
            title: "Module 12: Full-Stack Observability: CloudWatch, Container Insights & X-Ray",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Centralized logging, metrics collection, and distributed tracing across AWS workloads:
- **Amazon CloudWatch:**
  - **Logs:** Aggregating log streams using the CloudWatch Unified Agent or Fluent Bit.
  - **Metrics & Alarms:** Metric alarms triggering SNS notifications or Auto Scaling actions.
  - **Container Insights:** Out-of-the-box telemetry for EKS and ECS cluster performance (CPU, memory, disk, network).
- **AWS X-Ray:** Distributed tracing tool visualising microservice call graphs and latency bottlenecks.

### 🏢 2. Real-World DevOps Examples
- **Debugging High Latency Microservices:** Using AWS X-Ray service maps to identify that a 3-second API request latency was caused by an unindexed DynamoDB query bottleneck in downstream payment worker microservices.

### 💻 3. Practical Commands
\`\`\`bash
# Filter CloudWatch log events matching HTTP 500 status codes
aws logs filter-log-events \
  --log-group-name "/aws/eks/prod-cluster/api-server" \
  --filter-pattern "ERROR 500"
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does AWS X-Ray trace requests across decoupled distributed microservices?**  
  *A:* X-Ray injects a unique HTTP header (\`X-Amzn-Trace-Id\`) into incoming requests, propagating this trace header across downstream API calls, database queries, and SQS messages to assemble a end-to-end trace graph.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Configure CloudWatch Alarms with SNS email alerts for high CPU utilization.
2. **Steps:**
   - Create SNS topic, subscribe email, write CloudWatch Alarm rule (> 80% CPU for 5 mins), trigger artificial load and verify email alert payload.`,
          },
        ],
      },
      {
        id: "sec_aws_04",
        title: "Section 4: Enterprise Operations, FinOps & Certification Prep (Modules 13-15)",
        lessons: [
          {
            id: "aws_mod_13",
            title: "Module 13: Enterprise Multi-Account Governance: Organizations & Control Tower",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Governing multi-account enterprise AWS landing zones:
- **AWS Organizations:** Centralized management for consolidating multiple AWS accounts into Organizational Units (OUs).
- **Service Control Policies (SCPs):** Guardrail policies setting maximum permissions across all IAM roles and root users within an OU/account.
- **AWS Control Tower:** Automated landing zone setup enforcing mandatory guardrails, centralized logging (Log Archive account), and Security Tooling accounts.

### 🏢 2. Real-World DevOps Examples
- **Blocking Unapproved AWS Regions:** Attaching an SCP at the root AWS Organization level that blocks any engineer from launching resources outside \`us-east-1\` and \`eu-west-1\`, ensuring strict data sovereignty compliance.

### 💻 3. Practical Commands
\`\`\`json
// Sample Service Control Policy (SCP) blocking root user actions
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyRootUserActions",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "aws:PrincipalArn": "arn:aws:iam::*:root"
        }
      }
    }
  ]
}
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is an SCP and how does it differ from standard IAM Policies?**  
  *A:* SCPs are organizational guardrails applied at the AWS account or OU level; they specify the maximum allowable permissions for an account. An SCP override CANNOT be bypassed by an IAM admin within that account.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Create and attach a Service Control Policy blocking unencrypted bucket creation.
2. **Steps:**
   - Write SCP JSON in AWS Organizations master account, attach to \`Development\` OU, attempt non-compliant creation in child account and verify access denied.`,
          },
          {
            id: "aws_mod_14",
            title: "Module 14: Cloud Financial Management (FinOps): Savings Plans & Cost Optimization",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Implementing FinOps practices to optimize AWS cloud spend:
- **Commitment Discounts:**
  - **Reserved Instances (RIs):** Up to 72% discount for committing to specific EC2 instance types for 1 or 3 years.
  - **AWS Savings Plans:** Flexible discount model committing to an hourly spend ($/hr) across EC2, Fargate, and Lambda.
- **Cost Allocation Tags:** Tagging resources (\`cost-center=1042\`, \`owner=analytics\`) to track granular departmental billing.
- **AWS Budgets & Cost Anomaly Detection:** Real-time ML detection alerting on unexpected billing spikes.

### 🏢 2. Real-World DevOps Examples
- **Slashing AWS Compute Costs by 70%:** Transitioning non-production Kubernetes node pools to Spot Instances with Karpenter autoscaling, and purchasing Compute Savings Plans for baseline production node capacity.

### 💻 3. Practical Commands
\`\`\`bash
# Query AWS Cost Explorer API for monthly spend grouped by Service
aws ce get-cost-and-usage \
  --time-period Start=2024-08-01,End=2024-09-01 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=DIMENSION,Key=SERVICE
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do Compute Savings Plans differ from EC2 Instance Savings Plans?**  
  *A:* Compute Savings Plans automatically apply discounts across ANY EC2 instance family, region, OS, or tenancy, as well as Fargate and Lambda. EC2 Instance Savings Plans offer higher discounts but are locked to a specific instance family in a specific region.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Configure AWS Budgets with cost alert thresholds and cost allocation tags.
2. **Steps:**
   - Enable user-defined cost tags. Create AWS Budget alerting via email/SNS when forecasted monthly spend exceeds $500.`,
          },
          {
            id: "aws_mod_15",
            title: "Module 15: AWS DevOps Engineer Professional Exam Prep & Security Audit",
            duration: 60,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/a9__D53WsUs",
            content: `### 📖 1. Theory
Mastering the AWS Certified DevOps Engineer - Professional (DOP-C02) exam domains:
- **Exam Domains:**
  1. SDLC Automation (22%)
  2. Configuration Management & Infrastructure as Code (19%)
  3. Resilient Cloud Solutions (15%)
  4. Monitoring & Logging (15%)
  5. Incident & Event Response (14%)
  6. Security & Compliance (15%)
- **Production Audit Checklist:** Reviewing IAM policies, KMS encryption, VPC Flow Logs, CloudTrail log integrity, and backup retention rules.

### 🏢 2. Real-World DevOps Examples
- **Automated Security Incident Response:** Triggering a CloudWatch Alarm on unauthorized Security Group modifications $\rightarrow$ EventBridge invokes Lambda $\rightarrow$ Lambda revokes the bad SG rule, isolates the EC2 instance, and posts an alert to PagerDuty.

### 💻 3. Practical Commands
\`\`\`bash
# Enable AWS CloudTrail log file validation to detect tampered audit logs
aws cloudtrail update-trail \
  --name production-audit-trail \
  --enable-log-file-validation
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How do you design an automated disaster recovery failover architecture for a multi-region web application on AWS?**  
  *A:* Use Amazon Route 53 Application Recovery Controller (ARC) for DNS health checking, deploy active-active compute across two regions, use DynamoDB Global Tables or RDS Cross-Region Read Replicas, and automate regional DNS failover.

### 🛠️ 5. Practical Lab & Project
1. **Goal:** Build an automated event-driven incident remediation pipeline.
2. **Steps:**
   - Create CloudTrail audit trail, configure EventBridge rule matching unauthorized security group changes, and write Lambda function to automatically revert illegal ingress rules.`,
          },
        ],
      },
    ],
  },
  {
    id: "course_networking_001",
    slug: "networking-for-devops",
    title: "Networking for DevOps",
    shortDescription: "Master the 15 essential networking pillars for DevOps, Cloud & SRE: OSI, TCP/IP, Subnetting, CIDR, DNS, NAT, Load Balancers, Proxies, and Firewalls.",
    description: "A comprehensive, hands-on networking masterclass specifically engineered for DevOps practitioners, Cloud Architects, and SREs. From low-level packet flow across the OSI and TCP/IP stack to enterprise AWS VPC routing, Kubernetes CNI microsegmentation, SSL/TLS encryption, and reverse proxy architectures. Every module contains deep theory, real-world DevOps production scenarios, Linux troubleshooting commands, interview questions, and practical networking labs.",
    category: "Networking",
    level: "intermediate",
    price: 0,
    isPro: false,
    isFeatured: true,
    rating: 4.9,
    totalRatings: 3120,
    totalStudents: 18450,
    totalLessons: 15,
    durationHours: 20,
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600",
    icon: React.createElement(Network),
    color: "from-cyan-500 to-blue-600",
    tags: ["Networking", "Linux", "TCP/IP", "DNS", "Subnetting", "CIDR", "Kubernetes CNI", "VPC", "Service Mesh", "eBPF", "Load Balancers", "SSL/TLS", "Firewalls"],
    whatYouLearn: [
      "Master the 7-Layer OSI & 4-Layer TCP/IP models from a DevOps perspective",
      "Calculate Subnets and CIDR blocks with confidence for cloud VPCs",
      "Troubleshoot low-level Linux sockets, DNS resolution, and routing bottlenecks",
      "Configure NAT gateways, port forwarding, and stateful/stateless firewalls",
      "Deploy and tune Layer 4 (NLB) & Layer 7 (ALB) Load Balancers and Reverse Proxies",
      "Master Kubernetes CNI plugins (Calico, Cilium eBPF, Flannel) and NetworkPolicies",
      "Architect Multi-VPC Cloud Networks with AWS Transit Gateway, Peering, and PrivateLink",
      "Enforce Zero Trust microsegmentation with Service Mesh (Istio Envoy) and mTLS",
      "Manage SSL/TLS certificate chains, Anycast BGP routing, and CDN edge caching",
      "Perform deep packet inspection and network observability with tcpdump and eBPF",
    ],
    requirements: ["Basic Linux command line knowledge", "Fundamental understanding of distributed systems"],
    updatedAt: "2026-09-21",
    sections: [
      {
        id: "sec_net_01",
        title: "Section 1: Core Networking Foundations (Modules 1-5)",
        lessons: [
          {
            id: "net_mod_01",
            title: "Module 1: OSI & TCP/IP Packet Architecture",
            duration: 45,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/IPvYjXCsTg8",
            content: `### 📖 1. Theory
The Open Systems Interconnection (OSI) 7-layer model and TCP/IP 4-layer model govern all digital communication:
- **Layer 7 (Application):** Protocols like HTTP, HTTPS, DNS, gRPC, SSH, FTP.
- **Layer 6 (Presentation):** SSL/TLS encryption, data format serialization (JSON, Protobuf, gzip).
- **Layer 5 (Session):** Session establishment, authentication, RPC context tracking.
- **Layer 4 (Transport):** TCP (connection-oriented, reliable) and UDP (connectionless, low-latency) port-to-port multiplexing.
- **Layer 3 (Network):** IP logical addressing (IPv4/IPv6), ICMP, routers, packet routing path selection.
- **Layer 2 (Data Link):** MAC hardware addressing, Ethernet frames, ARP resolution, network switches, Linux \`veth\` pairs.
- **Layer 1 (Physical):** Physical media, fiber optics, wireless signals, physical Network Interface Cards (NICs).

#### TCP Connection Lifecycle & Handshakes
- **3-Way Handshake (Establishment):**
  1. Client sends \`SYN\` (Synchronize sequence number).
  2. Server responds with \`SYN-ACK\` (Synchronize + Acknowledge).
  3. Client sends \`ACK\` (Acknowledge) $\\rightarrow$ Socket transitions to \`ESTABLISHED\`.
- **4-Way Teardown (Termination):**
  1. Active closer sends \`FIN\` $\\rightarrow$ Receiver acknowledges with \`ACK\` (\`CLOSE_WAIT\` state on receiver).
  2. Passive closer calls \`close()\` and sends \`FIN\` $\\rightarrow$ Active closer responds with \`ACK\` and enters \`TIME_WAIT\` state (2MSL = 60s) before final socket closure.

### 🏢 2. Real-World DevOps Examples
- **Connection Refused vs 502 Bad Gateway:** A "Connection Refused" error occurs at **Layer 4** (TCP RST frame returned because no process is listening on the target port). A "502 Bad Gateway" occurs at **Layer 7** (reverse proxy connected to upstream, but received an invalid or unparseable HTTP response).
- **ALB vs NLB Selection:** AWS Application Load Balancer (ALB) operates at **Layer 7** (inspecting HTTP paths, host headers, and cookies), whereas AWS Network Load Balancer (NLB) operates at **Layer 4** (delivering millions of TCP/UDP packets per second with sub-millisecond latency).

### 💻 3. Practical Commands
\`\`\`bash
# Inspect Layer 2 MAC addresses and ARP cache
ip link show
ip neigh show

# Trace packet routing path at Layer 3
ip route get 8.8.8.8
traceroute -n -T -p 443 api.stripe.com

# Monitor Layer 4 active sockets, listening ports, and socket states
ss -tulnp
ss -s
ss -tan state time-wait

# Inspect verbose Layer 7 HTTP request/response headers
curl -Iv https://devopsacademy.io
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: At which OSI layer does a Kubernetes Ingress Controller operate vs a ClusterIP Service?**  
  *A:* An Ingress Controller operates at **Layer 7** (HTTP/HTTPS host and path routing via Nginx/Envoy). A ClusterIP Service operates at **Layer 4** (TCP/UDP packet load balancing executed via \`iptables\` or \`IPVS\` kernel rules).
- **Q: What causes a \`CLOSE_WAIT\` socket leak in production?**  
  *A:* \`CLOSE_WAIT\` occurs when the remote client sent a \`FIN\` frame and the OS acknowledged it, but the local application process failed to call \`close()\` on the socket descriptor due to a resource leakage bug or hung thread pool.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Track socket state transitions during connection setup and teardown.
2. **Steps:**
   - Open Terminal 1 and start a netcat TCP listener: \`nc -l -p 9000\`
   - Open Terminal 2 and check initial socket status: \`ss -tulpn | grep 9000\`
   - Connect from Terminal 2: \`nc 127.0.0.1 9000\`
   - Verify the state transitions from \`LISTEN\` to \`ESTABLISHED\` in both terminals.
   - Kill the client with \`Ctrl+C\` and observe the \`TIME_WAIT\` socket state.`,
          },
          {
            id: "net_mod_02",
            title: "Module 2: IPv4, IPv6 & Subnetting Engineering",
            duration: 50,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/F27PLhn3W04",
            content: `### 📖 1. Theory
IP addressing assigns unique logical identifiers to network interfaces across local networks and the global internet:
- **IPv4 (32-bit):** Expressed as 4 octets in dotted-decimal format (e.g. \`192.168.1.100\`), providing $\\approx 4.3 \\times 10^9$ unique addresses.
- **IPv6 (128-bit):** Expressed as 8 groups of 4 hexadecimal digits (e.g. \`2001:0db8:85a3::8a2e:0370:7334\`), providing $3.4 \\times 10^{38}$ addresses.

#### RFC 1918 Private IP Space
- **10.0.0.0/8:** \`10.0.0.0 - 10.255.255.255\` (16,777,216 addresses) $\\rightarrow$ Enterprise Cloud VPC root networks.
- **172.16.0.0/12:** \`172.16.0.0 - 172.31.255.255\` (1,048,576 addresses) $\\rightarrow$ Docker default bridge networks (\`172.17.0.0/16\`).
- **192.168.0.0/16:** \`192.168.0.0 - 192.168.255.255\` (65,536 addresses) $\\rightarrow$ Small office and home local networks.

#### Reserved & Special Addresses
- **127.0.0.1:** Loopback interface (\`localhost\`).
- **0.0.0.0:** Unspecified address / bind to all available network interfaces.
- **169.254.169.254:** Link-local IP used by AWS/GCP/Azure for Instance Metadata Service (IMDS).

### 🏢 2. Real-World DevOps Examples
- **EKS VPC-CNI IP Exhaustion:** In AWS EKS, every pod receives a native private IP address from the worker node's VPC subnet. If worker node subnets are provisioned with small address pools, nodes cannot launch new pods due to IP address exhaustion.
- **IMDSv2 Security Hardening:** Pods querying \`http://169.254.169.254/latest/meta-data/\` extract temporary IAM credentials. Restricting hop limits to 1 and enforcing IMDSv2 token-based headers prevents SSRF exploits from inside containerized apps.

### 💻 3. Practical Commands
\`\`\`bash
# List all assigned IPv4 and IPv6 addresses on all host interfaces
ip -4 addr show
ip -6 addr show

# Securely fetch AWS Instance Metadata using IMDSv2 session token
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 60")
curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/local-ipv4

# Assign a temporary virtual IP to loopback interface for isolated testing
sudo ip addr add 10.99.0.5/24 dev lo
ping -c 2 10.99.0.5
sudo ip addr del 10.99.0.5/24 dev lo
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why cannot RFC 1918 private IP addresses be routed across the public internet?**  
  *A:* Public internet routers drop packets containing RFC 1918 destination addresses by default to prevent routing table collisions; private IP devices must use Source Network Address Translation (NAT) to access external internet resources.
- **Q: What is the purpose of the 169.254.169.254 IP address in cloud environments?**  
  *A:* It is a link-local address providing instance metadata (instance ID, AMI, IP address, IAM credentials). It is accessible only from inside the virtual machine or container host without traversing external routers.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Create and verify a secondary IP address alias on a Linux interface.
2. **Steps:**
   - Check existing interface names: \`ip link show\`
   - Add alias: \`sudo ip addr add 172.28.0.100/24 dev lo\`
   - Confirm assignment: \`ip addr show dev lo\`
   - Test binding: \`python3 -m http.server 8080 --bind 172.28.0.100\`
   - From another terminal, query \`curl http://172.28.0.100:8080\` and clean up with \`sudo ip addr del 172.28.0.100/24 dev lo\`.`,
          },
          {
            id: "net_mod_03",
            title: "Module 3: CIDR, Route Calculation & VPC Subnet Planning",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/s_Ntt6eTn94",
            content: `### 📖 1. Theory
Classless Inter-Domain Routing (CIDR) replaces legacy classful networks with variable-length subnet masks:
- **Prefix Notation:** Specified as \`/n\` where $n$ is the count of leading network bits out of 32 total bits.
- **Formula for Usable Hosts:**
  $$\\text{Total IP Addresses} = 2^{(32 - n)}$$
  $$\\text{Standard Usable Hosts} = 2^{(32 - n)} - 2$$ *(excluding network and broadcast addresses)*

#### AWS VPC Subnet Reserved IPs
AWS reserves **5 IP addresses** per subnet automatically:
1. \`.0\` $\\rightarrow$ Network address.
2. \`.1\` $\\rightarrow$ VPC Router gateway.
3. \`.2\` $\\rightarrow$ AWS DNS Resolver (AmazonProvidedDNS).
4. \`.3\` $\\rightarrow$ Reserved for future internal AWS expansion.
5. \`.255\` $\\rightarrow$ Subnet broadcast address.

#### CIDR Reference Matrix
| CIDR Prefix | Total IPs | Usable IPs (AWS) | Primary Use Case |
| :--- | :--- | :--- | :--- |
| \`/32\` | 1 | 1 | Single Host / Bastion Security Group Rule |
| \`/28\` | 16 | 11 | Small Database Subnet |
| \`/24\` | 256 | 251 | Standard Microservice Application Subnet |
| \`/20\` | 4,096 | 4,091 | Large Kubernetes Pod Subnet |
| \`/16\` | 65,536 | 65,531 | Enterprise Root VPC CIDR Block |

### 🏢 2. Real-World DevOps Examples
- **Multi-AZ 3-Tier Enterprise VPC Architecture:** Designing a \`10.100.0.0/16\` VPC partitioned across 3 Availability Zones into:
  - 3 Public Subnets (\`/24\` $\\rightarrow$ 251 usable IPs each for ALBs and NAT Gateways).
  - 3 Private App Subnets (\`/20\` $\\rightarrow$ 4,091 usable IPs each for EKS worker nodes).
  - 3 Isolated Database Subnets (\`/24\` $\\rightarrow$ 251 usable IPs each for RDS clusters).
- **Preventing Overlapping CIDRs:** Ensuring VPC A (\`10.1.0.0/16\`) and VPC B (\`10.2.0.0/16\`) do not overlap, enabling cross-account VPC Peering and AWS Transit Gateway interconnectivity.

### 💻 3. Practical Commands
\`\`\`bash
# Calculate subnets and usable host range using ipcalc
ipcalc 10.0.1.0/24

# Programmatically list all host IP addresses in a CIDR block via Python
python3 -c "import ipaddress; net = ipaddress.ip_network('10.0.1.0/28'); print('Total:', net.num_addresses); print('Hosts:', [str(ip) for ip in net.hosts()])"

# Evaluate CIDR subnet slicing in Terraform console style
python3 -c "import ipaddress; net = ipaddress.ip_network('10.0.0.0/16'); subnets = list(net.subnets(new_prefix=24)); print('Subnet 0:', subnets[0]); print('Subnet 1:', subnets[1])"
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How many usable IP addresses are available in an AWS VPC subnet with CIDR block \`10.0.5.0/28\`?**  
  *A:* Total addresses $= 2^{(32-28)} = 16$. AWS reserves 5 IP addresses per subnet, leaving exactly **11 usable host IP addresses**.
- **Q: What is CIDR Supernetting (Route Aggregation)?**  
  *A:* Supernetting combines multiple contiguous smaller CIDR prefixes (e.g. \`10.0.0.0/24\` and \`10.0.1.0/24\`) into a single summarized route (\`10.0.0.0/23\`), drastically reducing memory consumption in router forwarding tables.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Programmatically calculate and validate subnets for a production cloud VPC.
2. **Steps:**
   - Execute the following Python script to calculate subnet partitions:
   \`\`\`python
   import ipaddress
   vpc = ipaddress.ip_network('10.50.0.0/16')
   subnets = list(vpc.subnets(new_prefix=24))
   print(f"Public Subnet 1: {subnets[0]}")
   print(f"Private Subnet 1: {subnets[1]}")
   print(f"Database Subnet 1: {subnets[2]}")
   \`\`\`
   - Verify that no IP ranges overlap and calculate the total host capacity for each subnet.`,
          },
          {
            id: "net_mod_04",
            title: "Module 4: Enterprise DNS Architecture & CoreDNS in Kubernetes",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/27r4Bzur5SU",
            content: `### 📖 1. Theory
The Domain Name System (DNS) translates human-readable hostnames into IP addresses across a distributed hierarchy:
- **DNS Resolution Tree:** Root Nameservers (\`.\`) $\\rightarrow$ Top-Level Domain (TLD) Nameservers (\`.com\`, \`.io\`) $\\rightarrow$ Authoritative Nameservers (AWS Route 53, Cloudflare) $\\rightarrow$ Recursive Resolvers (ISP, \`8.8.8.8\`, CoreDNS).

#### Core Record Types
- **A:** Maps hostname to IPv4 address (\`api.example.com -> 1.2.3.4\`).
- **AAAA:** Maps hostname to IPv6 address.
- **CNAME:** Alias mapping one domain name to another canonical hostname (\`www.example.com -> example.com\`).
- **ALIAS / ANAME:** Zone apex root alias (\`example.com -> my-alb-12345.amazonaws.com\`).
- **TXT:** Text metadata used for domain ownership validation, SPF, DKIM, and SSL validation.
- **SRV:** Service locator specifying port, priority, and target host for microservice discovery.

### 🏢 2. Real-World DevOps Examples
- **Kubernetes \`ndots:5\` Latency Bottleneck:** By default, Kubernetes pods set \`ndots:5\` in \`/etc/resolv.conf\`. Resolving an external domain like \`api.stripe.com\` triggers up to 5 sequential iterative searches (\`api.stripe.com.default.svc.cluster.local\`, etc.) before querying root servers, causing severe CoreDNS CPU and network latency spikes.
- **Split-Horizon Route 53 DNS:** Configuring internal private hosted zones (\`internal.company.net\`) accessible only inside private VPCs while exposing public endpoints (\`company.com\`) to the public internet.

### 💻 3. Practical Commands
\`\`\`bash
# Trace full hierarchical DNS resolution from root servers
dig +trace +nodnssec devopsacademy.io

# Query specific recursive resolver and record type with short output
dig @8.8.8.8 api.github.com A +short

# Query SRV records for service discovery details
dig _http._tcp.mongodb.internal.net SRV

# Inspect local DNS resolver configuration and search domains
cat /etc/resolv.conf
resolvectl status
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why cannot a standard CNAME record be created at the domain apex (\`example.com\`)?**  
  *A:* RFC 1034 requires that if a CNAME record exists at a node, no other record types (such as SOA or NS) can exist at that node. Cloud providers bypass this using proprietary **ALIAS** or **ANAME** records at the apex level.
- **Q: How do you resolve the Kubernetes \`ndots:5\` performance issue for external API clients?**  
  *A:* Append a trailing dot to the domain name in application code (\`api.stripe.com.\`), or customize the Pod's \`dnsConfig\` block setting \`options: name: ndots value: "2"\`.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Inspect DNS resolution paths and benchmark response latency across different resolvers.
2. **Steps:**
   - Execute a detailed trace query: \`dig +trace google.com\`
   - Identify the Root, TLD, and Authoritative nameservers involved in the response.
   - Compare resolution speeds between public resolvers:
     \`dig @1.1.1.1 devopsacademy.io | grep "Query time"\`
     \`dig @8.8.8.8 devopsacademy.io | grep "Query time"\``,
          },
          {
            id: "net_mod_05",
            title: "Module 5: Dynamic Host Configuration (DHCP) & Network Bootstrapping",
            duration: 40,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/s_Ntt6eTn94",
            content: `### 📖 1. Theory
Dynamic Host Configuration Protocol (DHCP) automates IP address assignment, default gateway configuration, subnet mask provisioning, and DNS server discovery:
- **The 4-Step DORA Exchange:**
  1. **Discover:** Client broadcasts a Layer 2 \`DHCPDISCOVER\` frame (\`255.255.255.255\`) looking for available DHCP servers.
  2. **Offer:** DHCP Server reserves an available IP and returns a unicast/broadcast \`DHCPOFFER\` packet containing IP, Subnet Mask, Gateway, and Lease Time.
  3. **Request:** Client broadcasts a \`DHCPREQUEST\` confirming acceptance of the offered IP lease.
  4. **Acknowledge:** DHCP Server sends a \`DHCPACK\` packet committing the IP lease to host database.

#### Key DHCP Parameters
- **Lease Duration:** Time window during which the client holds the assigned IP address before needing renewal (typically attempts renewal at 50% of lease time).
- **DHCP Option Sets:** Extra parameters passed to hosts (Option 3 = Default Gateway, Option 6 = DNS Servers, Option 42 = NTP Time Servers).

### 🏢 2. Real-World DevOps Examples
- **AWS VPC DHCP Option Sets:** Customizing VPC DHCP options so all launching EC2 instances automatically register with active Active Directory domain servers and internal NTP cluster endpoints.
- **PXE Booting Bare-Metal Clusters:** Utilizing DHCP Option 66 (TFTP Server) and Option 67 (Bootfile Name) to automatically boot and install Linux OS on bare-metal servers in edge data centers.

### 💻 3. Practical Commands
\`\`\`bash
# Release and renew active DHCP IP lease on Linux hosts
sudo dhclient -r
sudo dhclient -v

# Inspect active DHCP lease status and parameters
cat /var/lib/dhcp/dhclient.leases 2>/dev/null || journalctl -u systemd-networkd | grep -i dhcp

# Monitor network interface lease status with resolvectl
resolvectl status
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: How does a client without an IP address transmit data during the initial DHCP Discover phase?**  
  *A:* The client broadcasts a Layer 2 Ethernet frame with source IP \`0.0.0.0\` and destination IP \`255.255.255.255\`, identifying itself via its unique physical MAC address.
- **Q: What is a DHCP Relay Agent and why is it required in enterprise networks?**  
  *A:* DHCP Discover broadcasts are dropped by Layer 3 routers. A DHCP Relay Agent intercepts local broadcast messages and forwards them as unicast packets to a centralized DHCP server located in a different subnet.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Capture and observe DHCP lease renewal traffic on a Linux interface.
2. **Steps:**
   - Start background packet capture on DHCP ports: \`sudo tcpdump -i any -n -v "port 67 or port 68" -c 10\`
   - In a separate terminal, trigger lease renewal: \`sudo dhclient -v -r && sudo dhclient -v\`
   - Verify the captured packets for \`DHCPDISCOVER\`, \`DHCPOFFER\`, \`DHCPREQUEST\`, and \`DHCPACK\` packet flags.`,
          },
        ],
      },
      {
        id: "sec_net_02",
        title: "Section 2: Traffic Routing, Security & Load Balancing (Modules 6-10)",
        lessons: [
          {
            id: "net_mod_06",
            title: "Module 6: Linux Routing, Gateway Architecture & BGP",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/s_Ntt6eTn94",
            content: `### 📖 1. Theory
Routing is the process of deciding the physical or virtual path traversed by IP packets across interconnected networks:
- **Longest Prefix Match (LPM):** Routers evaluate destination IP addresses against their routing table and select the entry with the most specific (longest) CIDR prefix length.
- **Default Gateway (\`0.0.0.0/0\`):** The default catch-all rule used when no specific subnet entry matches a target IP.
- **Static vs Dynamic Routing:**
  - *Static Routing:* Manually defined destination routes (e.g. AWS VPC Route Tables).
  - *Dynamic Routing:* Protocols like **BGP (Border Gateway Protocol)** automatically advertise reachability and select optimal network paths based on Autonomous System (AS) metrics.

### 🏢 2. Real-World DevOps Examples
- **Enabling Linux IP Forwarding:** Turning Linux EC2 instances into custom VPN gateways, NAT instances, or overlay routers by setting \`net.ipv4.ip_forward = 1\`.
- **Calico BGP Peering in Kubernetes:** Deploying Calico CNI in BGP mode to advertise Pod CIDRs directly to physical Top-of-Rack (ToR) data center switches, eliminating encapsulation overhead for high-speed bare-metal clusters.

### 💻 3. Practical Commands
\`\`\`bash
# Display active Linux kernel routing table
ip route show

# Determine exact route decision for a specific destination IP address
ip route get 1.1.1.1
ip route get 10.0.2.15

# Enable persistent Linux kernel IP forwarding
sudo sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf

# Inspect policy-based routing rules
ip rule show
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What action does a router perform when receiving a packet with TTL (Time To Live) = 1?**  
  *A:* The router decrements the TTL to 0, drops the packet, and transmits an ICMP \`Time Exceeded\` packet back to the original sender (this mechanism is utilized by \`traceroute\`).
- **Q: Given routes \`10.0.0.0/16\` and \`10.0.1.0/24\` in a routing table, which route handles a packet bound for \`10.0.1.50\`?**  
  *A:* \`10.0.1.0/24\` handles the packet because of the Longest Prefix Match rule (\`/24\` has 24 matching network bits vs 16 matching bits in \`/16\`).

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Trace packet hops and inspect kernel routing decisions.
2. **Steps:**
   - Query routing decisions for public and internal targets:
     \`ip route get 8.8.8.8\`
     \`ip route get 127.0.0.1\`
   - Run ICMP traceroute to analyze hop decrements: \`traceroute -I 1.1.1.1\`
   - Observe intermediate IP hops and TTL expiration responses.`,
          },
          {
            id: "net_mod_07",
            title: "Module 7: Network Address Translation (NAT) & Port Forwarding",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/s_Ntt6eTn94",
            content: `### 📖 1. Theory
Network Address Translation (NAT) modifies source or destination IP addresses and ports in IP packet headers as they pass through a router:
- **SNAT (Source NAT / Masquerade):** Replaces private source IP addresses with the router's public IP address for outbound traffic heading to the internet.
- **DNAT (Destination NAT / Port Forwarding):** Replaces incoming public destination IP addresses and ports to redirect traffic to private backend application servers.
- **PAT (Port Address Translation / NAT Overload):** Maps thousands of internal private sockets to a single public IP address using unique ephemeral source ports.
- **Connection Tracking (\`conntrack\`):** Kernel table tracking state for active NAT sessions.

### 🏢 2. Real-World DevOps Examples
- **AWS NAT Gateways:** Enables EC2 instances in private subnets to download OS security patches and container images from external registries without exposing them to incoming internet attacks.
- **Docker Network Masquerading:** Docker injects \`iptables -t nat -A POSTROUTING -s 172.17.0.0/16 -j MASQUERADE\` to allow containers outbound internet access through host NIC.

### 💻 3. Practical Commands
\`\`\`bash
# List all active NAT rules in iptables with packet counters
sudo iptables -t nat -L -n -v

# Enable outbound NAT masquerading on interface eth0
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Forward external port 8080 to internal server IP 10.0.1.20 port 80 (DNAT)
sudo iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 10.0.1.20:80

# Inspect active Linux connection tracking table state
sudo conntrack -L 2>/dev/null || cat /proc/net/nf_conntrack
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the key difference between an AWS NAT Gateway and an AWS Internet Gateway (IGW)?**  
  *A:* An Internet Gateway provides bidirectional 1:1 NAT mapping for public instances. A NAT Gateway provides unidirectional outbound internet access for private subnets while blocking inbound connection attempts.
- **Q: What happens when the Linux \`nf_conntrack\` table becomes full under high traffic load?**  
  *A:* The Linux kernel drops new incoming and outgoing TCP connection attempts with kernel log error messages like \`nf_conntrack: table full, dropping packet\`. Fix by increasing \`net.netfilter.nf_conntrack_max\`.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Inspect Docker or host NAT masquerading rules in \`iptables\`.
2. **Steps:**
   - Display active NAT table rules: \`sudo iptables -t nat -S\`
   - Identify \`PREROUTING\` and \`POSTROUTING\` chains.
   - Inspect active tracked network connections: \`cat /proc/net/nf_conntrack | head -n 10\``,
          },
          {
            id: "net_mod_08",
            title: "Module 8: Ports, Protocols & Transport Layer Security (TCP vs UDP)",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/s_Ntt6eTn94",
            content: `### 📖 1. Theory
Ports are 16-bit numeric identifiers (ranging from 0 to 65535) used by Transport layer protocols (TCP and UDP) to route traffic to application processes:
- **Port Spectrum Ranges:**
  - **Well-Known Ports (0 - 1023):** System privileged (e.g. \`22\` SSH, \`53\` DNS, \`80\` HTTP, \`443\` HTTPS).
  - **Registered Ports (1024 - 49151):** Application services (e.g. \`3306\` MySQL, \`5432\` PostgreSQL, \`6379\` Redis, \`8080\` App, \`9090\` Prometheus, \`6443\` K8s API).
  - **Ephemeral Ports (49152 - 65535):** Temporary outbound client ports.

#### TCP vs UDP Architecture Comparison
- **TCP (Transmission Control Protocol):** Connection-oriented, guaranteed ordered packet delivery, retransmission of lost frames, flow control via windowing.
- **UDP (User Datagram Protocol):** Connectionless, lightweight, low-latency datagram delivery without handshakes or retransmissions.

### 🏢 2. Real-World DevOps Examples
- **Ephemeral Port Exhaustion:** Microservices creating frequent short-lived HTTP connections without connection pooling exhaust local client ephemeral ports, failing with \`Cannot assign requested address\`.
- **Protocol Selection:** Using UDP for high-throughput metrics collection (StatsD), DNS queries, and HTTP/3 QUIC vs TCP for transactional databases and API gateways.

### 💻 3. Practical Commands
\`\`\`bash
# Test TCP port connectivity to a remote host with netcat
nc -zv -w 3 database.internal.net 5432

# Identify which process is listening on port 8080
sudo lsof -i :8080 || sudo ss -tulpn | grep :8080

# Scan active open ports on localhost using nmap
nmap -sT -p 22,80,443,5432,6379 127.0.0.1

# Tune host local ephemeral port range
sudo sysctl -w net.ipv4.ip_local_port_range="1024 65535"
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why do databases use TCP while DNS and media streaming often use UDP?**  
  *A:* Databases require strict data integrity, zero packet loss, and ordered delivery guaranteed by TCP. DNS and streaming prioritize low latency, where single dropped packets are negligible compared to retransmission overhead.
- **Q: How do you identify which Linux process is hogging port 443?**  
  *A:* Execute \`sudo ss -tulpn | grep :443\` or \`sudo lsof -i :443\` to extract process name, PID, and listening file descriptor.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Test TCP reachability and monitor listening sockets across processes.
2. **Steps:**
   - Start a temporary HTTP server: \`python3 -m http.server 9999 &\`
   - Locate its process details: \`sudo ss -tulpn | grep 9999\`
   - Verify connection with netcat: \`nc -zv 127.0.0.1 9999\`
   - Terminate the background Python process and verify port release.`,
          },
          {
            id: "net_mod_09",
            title: "Module 9: SSL/TLS Encryption, PKI & Cert-Manager",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/IPvYjXCsTg8",
            content: `### 📖 1. Theory
Transport Layer Security (TLS) provides confidentiality, data integrity, and server identity authentication across untrusted networks:
- **Hybrid Cryptography Framework:**
  - **Asymmetric Encryption (RSA / ECC):** Used during the initial TLS handshake to verify server identity and securely exchange symmetric keys.
  - **Symmetric Encryption (AES-GCM / ChaCha20):** Used for fast bulk encryption of ongoing session payloads.
- **TLS 1.2 vs TLS 1.3:** TLS 1.3 reduces the handshake latency from 2 Round-Trip Times (2-RTT) down to a single Round-Trip Time (1-RTT) and eliminates insecure cipher suites.
- **Certificate Authority (CA) Chain:** Root CA $\\rightarrow$ Intermediate CA $\\rightarrow$ Leaf / Server x509 Certificate.
- **Server Name Indication (SNI):** TLS extension allowing the client to specify the target domain in the initial \`ClientHello\` packet, enabling virtual hosting of multiple HTTPS domains on a single IP address.

### 🏢 2. Real-World DevOps Examples
- **Kubernetes Cert-Manager Automation:** Automating zero-touch SSL certificate provisioning and renewal using Let's Encrypt ACME challenges (HTTP-01 or DNS-01) for Kubernetes Ingress endpoints.
- **Mutual TLS (mTLS):** Enforcing cryptographic Zero Trust identity verification between internal microservices in a service mesh (Istio/Linkerd).

### 💻 3. Practical Commands
\`\`\`bash
# Inspect remote SSL certificate chain, SAN domains, and SNI handshake
openssl s_client -connect api.github.com:443 -servername api.github.com -showcerts

# Check local SSL certificate expiration date without errors
openssl x509 -enddate -noout -in /etc/ssl/certs/ssl-cert-snakeoil.pem 2>/dev/null

# Generate a 2048-bit private key and self-signed certificate for local testing
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -subj "/CN=localhost"
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What happens when an SSL certificate expires in production and how do you prevent outages?**  
  *A:* Browsers and API clients terminate connections returning \`SSL_ERROR_EXPIRED_CERTIFICATE\`. Prevent outages by implementing automated renewals via \`cert-manager\` / AWS ACM and setting up Prometheus \`ssl_exporter\` alerts 30 days before expiration.
- **Q: What is Server Name Indication (SNI) and why is it essential for modern ingress controllers?**  
  *A:* SNI passes the destination hostname in unencrypted format during the initial \`ClientHello\` packet, allowing reverse proxies to select and present the correct SSL certificate before establishing the TLS connection.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Inspect SSL certificate expiration dates and validate server SNI configurations.
2. **Steps:**
   - Inspect certificate expiration for a public endpoint:
     \`openssl s_client -connect google.com:443 -servername google.com 2>/dev/null | openssl x509 -noout -dates\`
   - Generate a local test RSA key and self-signed certificate:
     \`openssl req -x509 -nodes -days 30 -newkey rsa:2048 -keyout test.key -out test.crt -subj "/CN=api.local"\`
   - Verify generated certificate details: \`openssl x509 -in test.crt -text -noout | grep Subject:\``,
          },
          {
            id: "net_mod_10",
            title: "Module 10: Load Balancing Algorithms, Reverse Proxies & Ingress Controllers",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/IPvYjXCsTg8",
            content: `### 📖 1. Theory
Load Balancers and Reverse Proxies sit between clients and backend application servers to distribute incoming traffic, offload heavy cryptographic workloads, and guarantee system availability:
- **Layer 4 Load Balancing (NLB / IPVS):** Operates on TCP/UDP socket headers without decrypting application data. Ultra-high throughput (millions of RPS) with sub-millisecond latency.
- **Layer 7 Load Balancing (ALB / Nginx / Envoy):** Operates on HTTP/HTTPS application data. Performs HTTP host/path routing, cookie inspection, header injection, and SSL termination.

#### Common Load Balancing Algorithms
- **Round Robin:** Sequential request distribution across available healthy backends.
- **Least Connections:** Routes new requests to the backend server with fewest active connections.
- **IP Hash / Consistent Hashing:** Maps client IP address to a consistent backend for session affinity.
- **Weighted Round Robin:** Allocates higher traffic proportions to larger backend instances.

### 🏢 2. Real-World DevOps Examples
- **Kubernetes Nginx Ingress Controller:** Intercepting incoming cluster HTTP requests and routing them to internal ClusterIP Services based on domain name and URI paths.
- **Preserving Client IPs (\`X-Forwarded-For\`):** Configuring reverse proxies to append client IPs in \`X-Forwarded-For\` and \`X-Forwarded-Proto\` headers so backend microservices can log real client IPs instead of the proxy's IP.

### 💻 3. Practical Commands
\`\`\`bash
# Validate Nginx configuration syntax and reload without dropping traffic
sudo nginx -t
sudo nginx -s reload

# Test load balancer round-robin distribution with a curl loop
for i in {1..5}; do curl -s http://localhost/api/hostname; echo ""; done

# Test HTTP header preservation through a proxy
curl -H "X-Forwarded-For: 203.0.113.195" -I http://localhost/healthz
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: When should you choose a Layer 4 Load Balancer over a Layer 7 Load Balancer?**  
  *A:* Choose Layer 4 (NLB) for non-HTTP protocols (gRPC streaming, WebSockets, MQTT), or when extreme packet throughput and sub-millisecond latency are required at lower operational cost.
- **Q: Why is the \`X-Forwarded-For\` header critical when operating behind a Reverse Proxy?**  
  *A:* The reverse proxy initiates a new TCP connection to backend servers, replacing the client IP with its own internal IP. \`X-Forwarded-For\` preserves original client public IPs for security logging and rate-limiting.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Configure and test an Nginx reverse proxy upstream load balancing block.
2. **Steps:**
   - Author a test Nginx upstream block:
     \`\`\`nginx
     upstream backend_cluster {
         least_conn;
         server 127.0.0.1:8081 max_fails=3 fail_timeout=10s;
         server 127.0.0.1:8082 max_fails=3 fail_timeout=10s;
     }
     \`\`\`
   - Verify syntax with \`nginx -t\` and test round-robin proxying.`,
          },
        ],
      },
      {
        id: "sec_net_03",
        title: "Section 3: Advanced Cloud, Kubernetes & Observability (Modules 11-15)",
        lessons: [
          {
            id: "net_mod_11",
            title: "Module 11: Firewalls, Security Groups, NACLs & WAF",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/IPvYjXCsTg8",
            content: `### 📖 1. Theory
Firewalls act as network security boundaries, monitoring and filtering incoming and outgoing traffic based on configured security rules:
- **Stateful vs Stateless Firewalls:**
  - **Stateful (AWS Security Groups, Linux \`conntrack\`):** Tracks connection state automatically. If inbound traffic is allowed on port 443, return outbound traffic is automatically permitted regardless of outbound rules.
  - **Stateless (AWS Network ACLs):** Evaluates every packet in isolation. Requires explicit rules for both Inbound traffic AND Outbound return traffic (including ephemeral ports \`1024-65535\`).
- **Layer 7 Web Application Firewall (WAF):** Inspects HTTP payloads to protect web apps from OWASP Top 10 vulnerabilities (SQL Injection, Cross-Site Scripting, bot scraping, volumetric rate limiting).

### 🏢 2. Real-World DevOps Examples
- **Zero Trust Cloud Security Groups:** Locking down private PostgreSQL RDS databases so they accept inbound connections on port 5432 exclusively from the specific Security Group ID of Kubernetes worker nodes.
- **Stateless NACL Ephemeral Port Misconfiguration:** Blocking ephemeral outbound ports (\`1024-65535\`) in stateless NACLs breaks external client HTTP responses even if inbound port 80 is allowed.

### 💻 3. Practical Commands
\`\`\`bash
# Check UFW firewall status and rule numbers on Ubuntu/Debian
sudo ufw status verbose

# Configure UFW default deny policy with SSH rate limiting
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw limit 22/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Display active iptables firewall rules with packet counters
sudo iptables -L -v -n --line-numbers
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the main functional difference between AWS Security Groups and AWS Network ACLs?**  
  *A:* Security Groups operate at the virtual interface (ENI) level and are **stateful**. Network ACLs operate at the subnet boundary level and are **stateless**.
- **Q: Why must stateless firewalls have explicit outbound rules for return traffic?**  
  *A:* Stateless firewalls do not remember connection states; they evaluate outbound response packets independently from inbound request packets.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Construct and inspect Linux firewall rules using \`ufw\` and \`iptables\`.
2. **Steps:**
   - Display active \`iptables\` filter rules: \`sudo iptables -L INPUT -v -n\`
   - Test adding a temporary drop rule for ICMP ping: \`sudo iptables -A INPUT -p icmp -j DROP\`
   - Verify ping fails: \`ping -c 2 127.0.0.1\`
   - Remove the rule: \`sudo iptables -D INPUT -p icmp -j DROP\``,
          },
          {
            id: "net_mod_12",
            title: "Module 12: Kubernetes CNI Networking & Pod Connectivity",
            duration: 60,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/IPvYjXCsTg8",
            content: `### 📖 1. Theory
Kubernetes networking adheres to fundamental primitives governed by the Container Network Interface (CNI) specification:
- **Fundamental Kubernetes Networking Rules:**
  1. Every Pod gets its own unique, routable IP address in the cluster.
  2. Pods on any node can communicate with pods on all other nodes without NAT.
  3. Node agents (\`kubelet\`) can communicate with all pods on that node.

#### CNI Plugin Architecture
- **Flannel:** Simple, lightweight overlay network using VXLAN encapsulation.
- **Calico:** High-performance Layer 3 routing via BGP without encapsulation overhead, plus rich NetworkPolicy security enforcement.
- **Cilium:** Next-generation eBPF-powered data plane replacing \`kube-proxy\` \`iptables\` bottlenecks with high-speed socket filtering and Hubble observability.

#### Kubernetes Service Types & \`kube-proxy\`
- **ClusterIP:** Virtual internal IP translated via \`iptables\` PREROUTING or \`IPVS\` kernel hash tables.
- **NodePort:** Exposes service on every node's IP at a static high port (\`30000-32767\`).
- **LoadBalancer:** Provisions external cloud provider load balancers (AWS NLB/ALB).

### 🏢 2. Real-World DevOps Examples
- **Eliminating \`kube-proxy\` iptables Bottlenecks:** In clusters with 5,000+ services, sequentially scanning \`iptables\` rules introduces severe CPU latency. Migrating to Cilium eBPF provides $O(1)$ socket-level routing table lookups.
- **Pod Microsegmentation with NetworkPolicies:** Restricting frontend pods so they can only send TCP traffic to backend API pods on port 8080 while dropping all direct database connection attempts.

### 💻 3. Practical Commands
\`\`\`bash
# Inspect CNI system pods and node status
kubectl get pods -n kube-system -o wide
kubectl get cninodes -o wide 2>/dev/null

# Launch an interactive network diagnostic pod (netshoot)
kubectl run netshoot --rm -it --image=nicolaka/netshoot -- /bin/bash

# View IPVS load balancing rules generated by kube-proxy
sudo ipvsadm -ln 2>/dev/null || sudo iptables-save | grep KUBE-SERVICES
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What is the key difference between Overlay networking (VXLAN) and Direct Layer 3 routing (BGP)?**  
  *A:* Overlay networking encapsulates Ethernet frames inside outer UDP headers (VXLAN), introducing CPU overhead and reducing MTU. Direct L3 routing (Calico BGP) advertises Pod CIDRs directly to physical routers without packet encapsulation.
- **Q: How does a Kubernetes ClusterIP Service route traffic to backend pods without a physical network interface?**  
  *A:* ClusterIPs are virtual IPs. \`kube-proxy\` programs the Linux kernel using \`iptables\` PREROUTING chains or \`IPVS\` rules to perform Destination NAT (DNAT), rewriting the virtual ClusterIP to a real healthy Pod IP.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Deploy and test Kubernetes NetworkPolicies to enforce zero-trust pod isolation.
2. **Steps:**
   - Review a NetworkPolicy manifest:
     \`\`\`yaml
     apiVersion: networking.k8s.io/v1
     kind: NetworkPolicy
     metadata:
       name: db-allow-api
     spec:
       podSelector:
         matchLabels:
           role: db
       ingress:
       - from:
         - podSelector:
             matchLabels:
               role: api
         ports:
         - protocol: TCP
           port: 5432
     \`\`\`
   - Verify policy concepts and validate ingress rule logic using \`kubectl\`.`,
          },
          {
            id: "net_mod_13",
            title: "Module 13: Cloud VPC Architecture, Peering & Transit Gateway",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/IPvYjXCsTg8",
            content: `### 📖 1. Theory
Virtual Private Cloud (VPC) provides isolated, software-defined networking within public cloud environments:
- **Subnet Topology Design:**
  - **Public Subnets:** Associated with route tables containing a \`0.0.0.0/0 -> Internet Gateway (IGW)\` route.
  - **Private Subnets:** Associated with route tables routing internet traffic through a NAT Gateway for outbound egress only.
  - **Isolated / DB Subnets:** No internet routing; accessible exclusively from private application subnets.

#### Inter-VPC Connectivity
- **VPC Peering:** Non-transitive 1-to-1 connection between two VPCs (CIDR blocks must not overlap).
- **AWS Transit Gateway (TGW):** Centralized hub-and-spoke virtual router connecting hundreds of VPCs, on-premise data centers, and VPNs with custom route tables.
- **VPC Endpoints & PrivateLink:** Access AWS services (S3, ECR, DynamoDB) securely via private ENIs without traversing the public internet.

### 🏢 2. Real-World DevOps Examples
- **Enterprise Multi-Account VPC Topology:** Connecting Production (\`10.10.0.0/16\`), Staging (\`10.20.0.0/16\`), and Shared-Services (\`10.30.0.0/16\`) VPCs to AWS Transit Gateway with isolated route tables preventing Staging from reaching Production.
- **NAT Gateway Cost Reduction via Gateway Endpoints:** Eliminating thousands of dollars in NAT Gateway data processing fees by routing Docker image pulls (ECR) and S3 object transfers through free VPC Gateway Endpoints.

### 💻 3. Practical Commands
\`\`\`bash
# Test VPC MTU and path ping without packet fragmentation
ping -M do -s 1472 10.0.2.15

# Verify private AWS VPC DNS resolution from instance
nslookup s3.us-east-1.amazonaws.com

# Trace kernel routing table decision for inter-VPC target IP
ip route get 10.20.1.50
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: Why is VPC Peering non-transitive?**  
  *A:* If VPC A is peered with VPC B, and VPC B is peered with VPC C, traffic from VPC A cannot reach VPC C through VPC B. Transitive routing across multiple VPCs requires AWS Transit Gateway or software overlay routers.
- **Q: What is the primary security advantage of AWS PrivateLink / VPC Interface Endpoints?**  
  *A:* PrivateLink exposes cloud services directly as private Elastic Network Interfaces (ENIs) inside your private subnet. Traffic never traverses the public internet, satisfying compliance requirements (SOC2, HIPAA, PCI-DSS).

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Design CIDR blocks and route tables for a multi-account cloud VPC layout.
2. **Steps:**
   - Allocate non-overlapping CIDR blocks:
     - Production VPC: \`10.100.0.0/16\`
     - Staging VPC: \`10.200.0.0/16\`
     - Shared Services VPC: \`10.50.0.0/16\`
   - Define Transit Gateway routing rules ensuring Shared Services can reach both Prod and Staging, while Prod and Staging remain strictly isolated.`,
          },
          {
            id: "net_mod_14",
            title: "Module 14: Zero Trust Service Mesh, mTLS & Envoy Sidecars",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/IPvYjXCsTg8",
            content: `### 📖 1. Theory
Zero Trust Architecture operates on the strict principle: *"Never trust, always verify"*. Inside microservice clusters, internal network traffic is treated with the same skepticism as untrusted public internet traffic:
- **Mutual TLS (mTLS):**
  - Standard TLS: Client verifies Server identity.
  - mTLS: Both Client AND Server present cryptographically signed x509 certificates to authenticate each other and encrypt all data-in-transit.
- **Service Mesh Architecture (Istio / Linkerd / Consul):**
  - **Control Plane (istiod):** Generates SPIFFE IDs, issues short-lived X.509 certificates to workloads, and distributes traffic routing policies.
  - **Data Plane (Envoy Proxies):** Sidecar containers injected into application pods intercepting all ingress and egress TCP traffic.

#### Key Service Mesh Capabilities
- Canary traffic splitting (e.g. 99% \`v1\` vs 1% \`v2\`), distributed tracing header propagation (\`x-request-id\`), circuit breaking, and fault injection testing.

### 🏢 2. Real-World DevOps Examples
- **Automated Zero-Downtime Canary Deployments:** Shifting traffic dynamically between microservice versions using Istio \`VirtualService\` and \`DestinationRule\` manifests without restarting pods.
- **Cluster-Wide Compliance Encryption:** Enforcing \`STRICT\` mTLS across 200+ Kubernetes services without modifying backend application source code.

### 💻 3. Practical Commands
\`\`\`bash
# Check global Istio mTLS authentication policy mode
kubectl get peerauthentication -A

# Inspect Envoy sidecar proxy certificates and configuration state
istioctl proxy-config secret <pod-name> 2>/dev/null
istioctl authn tls-check <pod-name> 2>/dev/null

# Monitor live Envoy proxy metrics and connection pool stats
curl -s http://localhost:15000/stats | grep "ssl.handshake"
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What performance overhead does a sidecar proxy architecture introduce?**  
  *A:* Sidecars add ~1-3ms latency per hop due to context switching between Envoy user space and Linux socket kernel space, plus memory overhead (~50MB per pod). Ambient Mesh / eBPF architectures eliminate sidecars to reduce overhead.
- **Q: What is a SPIFFE ID?**  
  *A:* SPIFFE (Secure Production Identity Framework for Everyone) provides a standardized URI format (e.g. \`spiffe://cluster.local/ns/prod/sa/payment-api\`) embedded in X.509 SAN certificates to verify workload identities across multi-cloud environments.

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Inspect Envoy proxy configurations and verify mTLS certificate SAN details.
2. **Steps:**
   - Analyze an Istio \`PeerAuthentication\` manifest:
     \`\`\`yaml
     apiVersion: security.istio.io/v1beta1
     kind: PeerAuthentication
     metadata:
       name: default
       namespace: prod
     spec:
       mtls:
         mode: STRICT
     \`\`\`
   - Verify how \`STRICT\` mode rejects unencrypted plaintext HTTP traffic.`,
          },
          {
            id: "net_mod_15",
            title: "Module 15: Network Observability, Packet Inspection & eBPF Deep Diagnostics",
            duration: 60,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/IPvYjXCsTg8",
            content: `### 📖 1. Theory
Deep network observability combines packet capture analysis, kernel-level eBPF tracing, and structured telemetry:
- **5-Layer Network Troubleshooting Framework:**
  1. **Physical / Interface:** \`ip link\`, carrier drops, RX/TX error counters, CRC checksum errors.
  2. **IP / Routing:** \`ip route\`, Path MTU Discovery (PMTUD), packet fragmentation, ICMP black holes.
  3. **Transport / Sockets:** \`ss -s\`, TCP retransmissions, SYN backlog queue overflows, socket buffer limits.
  4. **Application / DNS:** \`dig\`, HTTP status codes, TLS handshake failures, response latency histograms.

#### Extended Berkeley Packet Filter (eBPF)
eBPF executes sandboxed bytecode inside the Linux kernel without modifying kernel source code or loading external kernel modules. It hooks directly into tracepoints, kprobes, and socket buffers for zero-overhead networking telemetry (BCC tools, Cilium Hubble, Pixie).

### 🏢 2. Real-World DevOps Examples
- **Diagnosing Intermittent 504 Gateway Timeouts:** Using \`tracepath\` and \`tcpdump\` to discover that a network firewall was silently dropping jumbo frames due to an MTU mismatch (1500 vs 9000 bytes) across a VPC peering link.
- **eBPF Socket Latency Profiling:** Running \`tcplife\` or \`tcpconnect\` from BCC tools to profile microservice connection duration and detect hidden DNS resolution latency in production.

### 💻 3. Practical Commands
\`\`\`bash
# Capture full HTTP and TLS packets to a pcap file for Wireshark inspection
sudo tcpdump -i any -s 0 -nn -w /tmp/capture.pcap "tcp port 80 or tcp port 443"

# Monitor TCP retransmissions in real-time using eBPF BCC tools
sudo tcpretrans -T 2>/dev/null || netstat -s | grep -i retrans

# Inspect interface packet drop and error counters
ip -s link show eth0
netstat -i

# Perform Path MTU Discovery to identify ICMP black holes
tracepath -n 8.8.8.8
\`\`\`

### 🎯 4. Top Interview Questions & Answers
- **Q: What causes TCP Retransmissions and how do you diagnose them?**  
  *A:* TCP retransmissions occur when the sender does not receive an ACK within the Retransmission Timeout (RTO) period, caused by packet loss, congested switch buffers, or faulty NICs. Diagnose using \`tcpretrans\`, \`ss -ti\`, or inspecting \`/proc/net/snmp\`.
- **Q: What is an MTU Black Hole and how does Path MTU Discovery (PMTUD) resolve it?**  
  *A:* If a router has a smaller MTU than the packet size and the "Don't Fragment" (DF) bit is set, it drops the packet and sends an ICMP "Fragmentation Needed" packet back. If a firewall blocks ICMP, the client never learns to reduce packet size, resulting in a connection hang (MTU Black Hole).

### 🛠️ 5. Practical Networking Lab
1. **Goal:** Capture live network packet traces with \`tcpdump\` and analyze packet flags.
2. **Steps:**
   - Start packet capture: \`sudo tcpdump -i any -nn -c 10 "tcp port 443"\`
   - In a separate terminal, initiate a request: \`curl -Iv https://devopsacademy.io\`
   - Inspect captured frames for TCP handshake flags (\`[S]\`, \`[S.]\`, \`[.]\`, \`[P.]\`, \`[F.]\`).`,
          },
        ],
      },
    ],
  },
];

export const CATEGORIES = [
  "All",
  "Linux",
  "Git",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "IaC",
  "Configuration Management",
  "Cloud",
  "Networking",
];

export const getCourseBySlug = (slug: string) =>
  COURSES.find((c) => c.slug === slug);
