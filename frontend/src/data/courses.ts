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
    totalLessons: 15,
    durationHours: 16,
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
            title: "Module 1: Linux Architecture & Kernel Internals",
            duration: 45,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/mzmqwtR8w-Q",
            content: `### 📖 1. Theory
Linux is a Unix-like, monolithic open-source operating system. Its architecture is divided into clear hierarchical layers:
- **Hardware Layer:** CPU, RAM, Block Devices, NICs.
- **Linux Kernel:** The core program residing in kernel space with privileged access to hardware. Manages CPU scheduling, virtual memory, device drivers, and system calls.
- **System Call Interface (SCI):** The gateway through which user applications request kernel services (e.g. \`open()\`, \`read()\`, \`write()\`, \`fork()\`, \`execve()\`, \`socket()\`).
- **User Space & Shell:** Where user applications, daemons (systemd, sshd), and command-line shells (Bash, Zsh) run with unprivileged access.

### 🏢 2. Real-World DevOps Examples
- **Container Isolation:** Docker containers do NOT run a separate kernel; they share the host Linux kernel using Kernel Namespaces (PID, Mount, Net, IPC, UTS, User) and Cgroups (CPU/RAM resource capping).
- **System Call Bottlenecks:** When a microservice under high traffic experiences slow I/O, DevOps engineers trace system calls using \`strace -c\` to determine time spent in kernel space vs user space.

### 💻 3. Practical Commands
\`\`\`bash
# Check Linux kernel release, architecture, and hostname
uname -a
uname -r

# View detailed CPU info and core architecture
lscpu

# Inspect kernel ring buffer messages for hardware/boot logs
dmesg | grep -i error

# View active system architecture and OS release details
cat /etc/os-release
hostnamectl
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What is the difference between User Space and Kernel Space?**  
  *A:* Kernel space is the privileged memory area where the core operating system and device drivers run with full hardware access. User space is the unprivileged memory region where applications, shells, and containers execute. Applications interact with kernel space exclusively via system calls.
- **Q: How does a monolithic kernel differ from a microkernel?**  
  *A:* In a monolithic kernel (like Linux), all core OS services (VFS, IPC, memory management, drivers) execute within a single address space for maximum performance. Microkernels keep only bare minimums in kernel space and run services as separate user space servers.

### 🛠️ 5. Hands-on Exercises
1. Run \`uname -r\` and \`lscpu\` to identify your kernel version and CPU topology.
2. Trace an \`ls -la\` execution system calls using \`strace -c ls -la\` and identify which system calls were triggered most.`
          },
          {
            id: "linux_mod_02",
            title: "Module 2: Filesystem Hierarchy Standard & File Operations",
            duration: 50,
            type: "video",
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/42iQKuQodW4",
            content: `### 📖 1. Theory
The Linux Filesystem Hierarchy Standard (FHS) defines the directory structure and content locations:
- \`/\`: Root directory containing all files and mounted filesystems.
- \`/bin\` & \`/usr/bin\`: Essential user command binaries (ls, cp, grep).
- \`/etc\`: System-wide configuration files (nginx.conf, fstab, passwd).
- \`/var\`: Variable data (logs in \`/var/log\`, mail, package caches, container volumes).
- \`/proc\` & \`/sys\`: Virtual in-memory pseudofilesystems exposing kernel and hardware states.
- \`/opt\`: Third-party vendor software installations.
- \`/tmp\`: Temporary files cleared on reboot.

### 🏢 2. Real-World DevOps Examples
- **Disk Full Incident (/var/log):** High-traffic production servers frequently fill up \`/var\` due to unrotated application logs. DevOps engineers use \`du -sh /var/log/* | sort -rh | head -n 10\` to find space hogs.
- **Deploying Container Binaries:** Custom Go/Rust microservice binaries are placed in \`/opt\` or \`/usr/local/bin\` to comply with standard enterprise deployment conventions.

### 💻 3. Practical Commands
\`\`\`bash
# Find files larger than 100MB modified in the last 7 days
find /var/log -type f -size +100M -mtime -7

# Create nested directories with verbose output
mkdir -p -v /opt/devops/deployments/{prod,staging,dev}

# Create a compressed tarball archive of configs
tar -czvf /backup/etc-configs-$(date +%F).tar.gz /etc/nginx /etc/systemd

# Extract tarball to specific destination directory
tar -xzvf /backup/etc-configs-2026-09-21.tar.gz -C /tmp/restore/
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What is the difference between hard links and soft (symbolic) links?**  
  *A:* A hard link points directly to the underlying inode on the filesystem and shares the same file data blocks; deleting the original filename does not lose the data. A symbolic link (symlink) is a special pointer file containing the file path of another file; if the target is deleted, the symlink breaks.
- **Q: What is the purpose of the \`/proc\` virtual filesystem?**  
  *A:* \`/proc\` is generated dynamically in RAM by the Linux kernel. It exposes real-time runtime kernel data, process states (\`/proc/[PID]\`), memory usage (\`/proc/meminfo\`), and CPU statistics (\`/proc/cpuinfo\`).

### 🛠️ 5. Hands-on Exercises
1. Create a directory tree \`/tmp/lab/releases/{v1,v2,v3}\` and create a symlink \`/tmp/lab/current\` pointing to \`v1\`.
2. Update the symlink atomically using \`ln -sfn /tmp/lab/v2 /tmp/lab/current\` and verify with \`ls -l /tmp/lab\`.'`
          },
          {
            id: "linux_mod_03",
            title: "Module 3: Permissions, Ownership & ACLs",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/eWsCbBfxZ04",
            content: `### 📖 1. Theory
Linux file security is built on standard POSIX Discretionary Access Control (DAC):
- **User Types:** Owner User (u), Group (g), Others (o).
- **Permission Bits:** Read (\`r\`=4), Write (\`w\`=2), Execute (\`x\`=1).
  - \`755\` = \`rwxr-xr-x\` (Standard for executable scripts and directories).
  - \`644\` = \`rw-r--r--\` (Standard for configuration files).
  - \`600\` = \`rw-------\` (Required for private keys like \`id_rsa\`).
- **Special Bits:**
  - **SUID (4xxx):** Executes with file owner's permissions (e.g. \`/usr/bin/passwd\`).
  - **SGID (2xxx):** Files created in directory inherit the parent group.
  - **Sticky Bit (1xxx):** Only the file owner can delete files in the directory (e.g. \`/tmp\`).
- **POSIX ACLs:** Extended fine-grained permissions using \`setfacl\` and \`getfacl\`.

### 🏢 2. Real-World DevOps Examples
- **SSH Key Permissions Error:** Running \`ssh -i key.pem user@host\` fails with \`UNPROTECTED PRIVATE KEY FILE! Permissions 0644 for key.pem are too open\` unless \`chmod 400 key.pem\` or \`chmod 600 key.pem\` is applied.
- **Shared CI/CD Deployment Directory:** Setting SGID on \`/var/www/shared\` (\`chmod 2775\`) ensures all files created by the \`gitlab-runner\` or \`jenkins\` service account inherit the \`developers\` group automatically.

### 💻 3. Practical Commands
\`\`\`bash
# Change permissions recursively on directories only
find /var/www/html -type d -exec chmod 755 {} +

# Change permissions on files only
find /var/www/html -type f -exec chmod 644 {} +

# Set SGID and sticky bit on directory
chmod 3775 /data/shared

# Grant specific read/write access to user 'appuser' via ACL
setfacl -m u:appuser:rwx /opt/data
getfacl /opt/data
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What is umask and how does it determine default file permissions?**  
  *A:* \`umask\` (User Mask) specifies the permission bits subtracted from default permissions (666 for files, 777 for directories). A umask of \`022\` creates files with \`644\` (666-022) and directories with \`755\` (777-022).
- **Q: Why does \`/tmp\` have a sticky bit (\`chmod +t\`)?**  
  *A:* \`/tmp\` is world-writable (777). Without the sticky bit (\`t\`), any user could delete or overwrite files created by other users. With the sticky bit, only the file creator or root can delete their respective files.

### 🛠️ 5. Hands-on Exercises
1. Create a file \`/tmp/secure.key\` and restrict it to \`chmod 600\`. Verify permissions with \`stat -c "%a %n" /tmp/secure.key\`.
2. Configure an ACL on a directory giving a specific non-root user read/write access without modifying the group ownership.`
          },
          {
            id: "linux_mod_04",
            title: "Module 4: Process Management & Signals",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/5U2_0qD0Z50",
            content: `### 📖 1. Theory
Every program executed in Linux runs as a process with a unique Process ID (PID):
- **Process States:** Running (R), Sleeping/Waiting (S), Uninterruptible Sleep/Disk I/O (D), Stopped (T), Zombie (Z).
- **Parent & Child Processes:** Process PID 1 (systemd) is the ancestor of all user-space processes.
- **Signals:** Inter-process communication events:
  - \`SIGHUP (1)\`: Hang up / reload configuration gracefully.
  - \`SIGINT (2)\`: Terminal interrupt (Ctrl+C).
  - \`SIGQUIT (3)\`: Quit and generate core dump.
  - \`SIGTERM (15)\`: Graceful termination signal (default for kill and Kubernetes pod stops).
  - \`SIGKILL (9)\`: Immediate unconditional kernel termination (cannot be caught or ignored).

### 🏢 2. Real-World DevOps Examples
- **Graceful Pod Shutdown in Kubernetes:** Kubernetes sends \`SIGTERM\` to a container, waits \`terminationGracePeriodSeconds\` (default 30s) for connections to drain, and sends \`SIGKILL\` if the process does not exit.
- **Zombie Process Leaks:** If a parent process forks child workers but fails to call \`wait()\` when children exit, zombie processes accumulate in the process table.

### 💻 3. Practical Commands
\`\`\`bash
# List top 10 memory-consuming processes
ps aux --sort=-%mem | head -n 11

# Interactive real-time resource monitor
htop

# Send graceful reload signal to Nginx master process
pkill -HUP nginx

# Gracefully terminate all processes matching 'node'
pkill -15 node

# Send SIGKILL to stubborn runaway process
kill -9 <PID>

# Run long script in background immune to hangups
nohup ./deploy.sh > deploy.log 2>&1 &
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What is a Zombie process and how do you remove it?**  
  *A:* A zombie process is a dead process that has finished execution, but its exit code remains in the process table because the parent has not read it via \`wait()\`. Zombies consume zero CPU/RAM, but tie up PID slots. You cannot \`kill -9\` a zombie because it is already dead; you must kill the parent process or restart the service so PID 1 adopts and reaps it.
- **Q: What is the difference between SIGTERM and SIGKILL?**  
  *A:* \`SIGTERM (15)\` allows the application to catch the signal, flush database connections, save state, and shut down cleanly. \`SIGKILL (9)\` is handled directly by the kernel and terminates the process instantly without cleanup.

### 🛠️ 5. Hands-on Exercises
1. Launch a sleep loop in the background: \`sleep 300 &\`.
2. Inspect its process details using \`ps -fp $(pgrep sleep)\` and terminate it gracefully with \`kill -15 $(pgrep sleep)\`.`
          },
          {
            id: "linux_mod_05",
            title: "Module 5: Systemd & Service Management",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/S2pE9bS_U7w",
            content: `### 📖 1. Theory
Systemd is the modern init system and service manager for Linux (PID 1):
- **Unit Types:** \`.service\` (daemons), \`.target\` (grouping states/runlevels), \`.timer\` (cron replacement), \`.socket\` (socket activation), \`.mount\` (filesystem mount points).
- **Unit File Locations:**
  - \`/lib/systemd/system/\`: System-installed package units.
  - \`/etc/systemd/system/\`: Administrator custom units and overrides (takes precedence).
- **Journald:** Centralized binary logging system integrated with systemd.

### 🏢 2. Real-World DevOps Examples
- **Deploying a Microservice Daemon:** Creating an enterprise-grade \`/etc/systemd/system/api.service\` unit file with \`Restart=always\`, \`RestartSec=5s\`, \`User=appuser\`, and \`EnvironmentFile=/etc/api.env\`.
- **Debugging Crash Loops:** Using \`journalctl -u api.service -f -n 50\` to inspect live production stack traces.

### 💻 3. Practical Commands
\`\`\`bash
# Reload systemd manager after modifying unit files
systemctl daemon-reload

# Enable service to start on boot and start immediately
systemctl enable --now nginx

# Check status, memory footprint, and recent logs of a service
systemctl status docker

# Tail live logs for a specific service since last 30 minutes
journalctl -u nginx.service -f --since "30 min ago"

# View system boot performance and slow-starting units
systemd-analyze blame
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What is the difference between \`systemctl reload\` and \`systemctl restart\`?**  
  *A:* \`reload\` requests the running service to re-read its configuration files without dropping active user connections (e.g. Nginx zero-downtime config refresh). \`restart\` shuts down the process completely and starts a fresh instance, terminating existing connections.
- **Q: What is the purpose of \`systemctl daemon-reload\`?**  
  *A:* It reloads the entire systemd configuration manager state from disk. When you create or edit any unit file in \`/etc/systemd/system/\`, systemd will not recognize the modifications until \`daemon-reload\` is run.

### 🛠️ 5. Hands-on Exercises
1. Write a custom unit file \`/etc/systemd/system/heartbeat.service\` running a simple bash loop that logs timestamps.
2. Run \`systemctl daemon-reload\`, start the service, and verify logs using \`journalctl -u heartbeat -n 20\`.`
          },
        ],
      },
      {
        id: "sec_linux_02",
        title: "Section 2: Storage, Administration & Automation (Modules 6-10)",
        lessons: [
          {
            id: "linux_mod_06",
            title: "Module 6: Storage, Partitions, Filesystems & LVM",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/8v_YqD1o4Q8",
            content: `### 📖 1. Theory
Storage in Linux is managed through block devices, partitions, filesystems, and Logical Volume Management (LVM):
- **Block Devices:** \`/dev/sda\`, \`/dev/nvme0n1\`, \`/dev/vda\`.
- **Filesystems:** \`ext4\` (robust, standard), \`xfs\` (high-performance enterprise default in RHEL), \`btrfs\`, \`ZFS\`.
- **LVM Architecture:**
  - **Physical Volumes (PV):** Raw block devices or partitions (\`pvcreate\`).
  - **Volume Groups (VG):** Pool of storage combined from PVs (\`vgcreate\`).
  - **Logical Volumes (LV):** Virtual partitions allocated from VGs (\`lvcreate\`), easily resized on the fly.
- \`/etc/fstab\`: Filesystem table for automated mounting on system boot.

### 🏢 2. Real-World DevOps Examples
- **Zero-Downtime Disk Expansion on AWS EBS:** When an attached AWS EBS volume is expanded from 100GB to 200GB, DevOps engineers resize the LVM physical volume, volume group, and filesystem online using \`pvresize\`, \`lvextend -r -l +100%FREE /dev/vg_data/lv_app\` with zero outage.
- **Fixing Boot Failure Caused by Bad fstab:** An incorrect UUID in \`/etc/fstab\` drops the server into Emergency Maintenance mode on boot; engineers use \`mount -o remount,rw /\` to repair it.

### 💻 3. Practical Commands
\`\`\`bash
# Display disk hierarchy, partition sizes, and mountpoints
lsblk -f

# Check filesystem disk space and inode availability
df -h
df -i

# Create Physical Volume, Volume Group, and Logical Volume
pvcreate /dev/sdb
vgcreate vg_data /dev/sdb
lvcreate -n lv_database -L 50G vg_data

# Format with ext4 and mount
mkfs.ext4 /dev/vg_data/lv_database
mount /dev/vg_data/lv_database /data

# Resize Logical Volume and filesystem simultaneously
lvextend -r -L +20G /dev/vg_data/lv_database
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What happens when a disk runs out of Inodes while having plenty of free GBs?**  
  *A:* Inodes store file metadata (permissions, ownership, block locations). If a filesystem creates millions of tiny files (like session files or cache), all inodes can be consumed even if storage capacity is free. The filesystem will return "No space left on device". Verify with \`df -i\`.
- **Q: Why should you use UUIDs instead of device names (\`/dev/sdb1\`) in \`/etc/fstab\`?**  
  *A:* Device names like \`/dev/sdb\` can shift between reboots or controller reassignments. UUIDs (Universally Unique Identifiers) uniquely identify the specific filesystem partition regardless of hardware bus order.

### 🛠️ 5. Hands-on Exercises
1. Run \`lsblk\` and \`df -hT\` to identify your active filesystems and partition types.
2. View your system's mount options and active UUIDs by inspecting \`/etc/fstab\` and running \`blkid\`.'`
          },
          {
            id: "linux_mod_07",
            title: "Module 7: Package Management & Repositories",
            duration: 40,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/jZ_y0C4K9l0",
            content: `### 📖 1. Theory
Linux distributions package software binaries, metadata, and dependencies:
- **Debian / Ubuntu Family:**
  - Low-level: \`dpkg\` (.deb files).
  - High-level: \`apt\` / \`apt-get\` (resolves dependencies from remote repositories in \`/etc/apt/sources.list\`).
- **RHEL / Rocky / Fedora Family:**
  - Low-level: \`rpm\` (.rpm files).
  - High-level: \`dnf\` / \`yum\` (configured via \`/etc/yum.repos.d/*.repo\`).
- **GPG Signing:** Repositories cryptographically sign packages to ensure integrity and authenticity.

### 🏢 2. Real-World DevOps Examples
- **Automated Docker CE Installation Script:** In Infrastructure-as-Code (Terraform / Ansible), DevOps scripts add the official Docker GPG keyring to \`/etc/apt/keyrings/docker.gpg\` and update sources before installing \`docker-ce\`.
- **Security Patching Automation:** Using unattended-upgrades on Ubuntu or dnf-automatic on CentOS to patch critical CVEs automatically across production fleets.

### 💻 3. Practical Commands
\`\`\`bash
# Ubuntu/Debian: Update repo lists and upgrade security packages
sudo apt update && sudo apt upgrade -y

# Search for packages
apt search postgresql

# RHEL/CentOS: Install package and dependencies
sudo dnf install -y nginx

# Query which package owns a specific binary on disk
dpkg -S /usr/bin/curl      # Debian/Ubuntu
rpm -qf /usr/bin/curl      # RHEL/CentOS

# Check package dependencies and installed version
apt-cache policy docker-ce
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What is the difference between \`apt update\` and \`apt upgrade\`?**  
  *A:* \`apt update\` refreshes the local package index cache from remote repository servers without installing or upgrading anything. \`apt upgrade\` actually downloads and installs the newer versions of installed packages based on the refreshed index.
- **Q: What is a PPA or custom repository in Linux?**  
  *A:* A Personal Package Archive (PPA) or third-party repository provides software builds not included in the official distribution repositories or newer versions maintained by software vendors (e.g. HashiCorp, Docker, NodeSource).

### 🛠️ 5. Hands-on Exercises
1. Check if \`htop\` is installed, and inspect its repository metadata with \`apt-cache policy htop\` (or \`dnf info htop\`).
2. Download a \`.deb\` or \`.rpm\` package manually and inspect its contents without installing.'`
          },
          {
            id: "linux_mod_08",
            title: "Module 8: User Administration, Sudoers & PAM",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/k8EwT_f45j0",
            content: `### 📖 1. Theory
Linux is a multi-user OS with strict isolation between administrative and unprivileged accounts:
- **Core Files:**
  - \`/etc/passwd\`: User accounts (Username, UID, GID, Home Dir, Login Shell).
  - \`/etc/shadow\`: Secure hashed passwords and password expiration policies (readable only by root).
  - \`/etc/group\`: Group memberships and GIDs.
- **Sudo (Superuser Do):** Allows authorized users to execute commands as root controlled by \`/etc/sudoers\`.
- **PAM (Pluggable Authentication Modules):** Modular framework managing authentication, account, password, and session rules in \`/etc/pam.d/\`.

### 🏢 2. Real-World DevOps Examples
- **Creating Service Accounts for CI/CD:** Creating dedicated non-login system accounts for deployment runners (e.g. \`useradd -r -s /usr/sbin/nologin -d /var/lib/runner runner\`).
- **Least-Privilege Sudoers:** Granting developers permission to restart only specific services without full root access by adding rules in \`/etc/sudoers.d/developers\` (edited securely with \`visudo\`).

### 💻 3. Practical Commands
\`\`\`bash
# Create a system user without interactive shell
useradd -r -s /bin/false -d /opt/app appuser

# Add existing user to sudo/wheel group
usermod -aG sudo developer

# Lock a user account immediately (incident response)
passwd -l compromised_user

# Safely edit sudoers configuration file
sudo visudo -f /etc/sudoers.d/web_team

# Grant specific passwordless restart permission in sudoers
# webteam ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: Why must you ALWAYS edit sudoers using \`visudo\` instead of a plain text editor?**  
  *A:* \`visudo\` locks the sudoers file against concurrent edits and validates syntax before saving. If a syntax error is saved with a standard editor, \`sudo\` will break entirely, locking all administrators out of root privileges.
- **Q: What is the significance of UID 0?**  
  *A:* UID 0 defines the root superuser account with unrestricted kernel privileges. Any account with UID 0 in \`/etc/passwd\` has complete system authority regardless of its username.

### 🛠️ 5. Hands-on Exercises
1. Create a group \`devops_team\` and a user \`devops_intern\`.
2. Add the user to the group and create a file in \`/etc/sudoers.d/intern\` giving them permission to execute \`/usr/bin/docker ps\` without a password.`
          },
          {
            id: "linux_mod_09",
            title: "Module 9: Bash Shell Scripting & Error Handling",
            duration: 60,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/tK9Oc6AEnR4",
            content: `### 📖 1. Theory
Bash (Bourne Again SHell) scripting is the core glue of DevOps automation:
- **Shebang (\`#!/usr/bin/env bash\`):** Tells the kernel which interpreter to execute.
- **Variables & Arguments:** \`$0\` (script name), \`$1..\$9\` (arguments), \`$@\` (all arguments), \`$#\` (arg count), \`$$\` (script PID), \`$?\` (exit code of last command: 0=success, non-zero=error).
- **Strict Mode (\`set -euo pipefail\`):**
  - \`-e\`: Exit immediately if any command fails.
  - \`-u\`: Treat unset variables as an error.
  - \`-o pipefail\`: Return the exit code of the last failing command in a pipeline.
- **Control Structures:** \`if/elif/else\`, \`case\`, \`for\`, \`while\`, functions, and local variables.

### 🏢 2. Real-World DevOps Examples
- **Automated Health Check & Slack Alerts:** A cron script that probes microservice endpoints using \`curl\`, detects non-200 responses, and posts webhook alerts to a Slack channel.
- **Database Backup & Pruning:** Automated shell script that executes \`pg_dump\`, gzip compresses the archive, uploads to S3 with \`aws s3 cp\`, and deletes backups older than 30 days.

### 💻 3. Practical Commands
\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

# Variable declaration and command substitution
BACKUP_DIR="/var/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
TARGET="/opt/app/data"

echo "=== Starting Backup at \${TIMESTAMP} ==="

if [[ ! -d "\${TARGET}" ]]; then
    echo "Error: Target directory \${TARGET} does not exist!" >&2
    exit 1
fi

mkdir -p "\${BACKUP_DIR}"
tar -czf "\${BACKUP_DIR}/backup_\${TIMESTAMP}.tar.gz" "\${TARGET}"

echo "Backup created successfully: \${BACKUP_DIR}/backup_\${TIMESTAMP}.tar.gz"
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: Why should every production Bash script include \`set -euo pipefail\`?**  
  *A:* By default, Bash continues executing even when a command fails or an undefined variable is accessed (which could lead to catastrophic commands like \`rm -rf $DIR/*\` if \`$DIR\` is empty). \`set -euo pipefail\` halts execution immediately on any failure or unset variable.
- **Q: What is the difference between \`$*\` and \`$@\`?**  
  *A:* When unquoted, both behave identically. When enclosed in double quotes: \`"$*"\` expands all arguments into a single continuous string separated by IFS (e.g. \`"arg1 arg2 arg3"\`), whereas \`"$@"\` expands each argument into separate distinct quoted strings (\`"arg1" "arg2" "arg3"\`).

### 🛠️ 5. Hands-on Exercises
1. Write a script \`service_monitor.sh\` that takes a service name as an argument (\`$1\`), checks if it is active using \`systemctl is-active\`, and restarts it if down.
2. Incorporate \`set -euo pipefail\` and proper exit codes (0 for healthy, 1 for recovered, 2 for failed).`
          },
          {
            id: "linux_mod_10",
            title: "Module 10: Stream Editing & Text Processing (grep, sed, awk)",
            duration: 60,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/e7BufAVwDiM",
            content: `### 📖 1. Theory
Text streams are the universal interface in Linux. Mastering text processing tools is essential for log analysis and configuration templating:
- **grep (Global Regular Expression Print):** Fast pattern searching across files.
- **sed (Stream Editor):** Non-interactive text stream transformation, search, and in-place replacement.
- **awk:** A complete domain-specific programming language designed for structured columnar data processing and reporting.
- **Utilities:** \`cut\`, \`sort\`, \`uniq\`, \`tr\`, \`xargs\`, \`wc\`.

### 🏢 2. Real-World DevOps Examples
- **Nginx Access Log Troubleshooting:** Finding the top 10 IP addresses causing HTTP 500 errors in real-time using an awk/sort/uniq one-liner.
- **Dynamic Config Injection in CI/CD:** Modifying database host endpoints in configuration files on the fly during container startup using \`sed -i "s/{{DB_HOST}}/\$DATABASE_HOST/g" app.conf\`.

### 💻 3. Practical Commands
\`\`\`bash
# Find top 10 IP addresses requesting your server from Nginx log
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -n 10

# Count HTTP response status codes (e.g. 200, 404, 500)
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -nr

# Replace port 80 with port 8080 in-place inside config
sed -i 's/listen 80;/listen 8080;/g' /etc/nginx/nginx.conf

# Extract only username and shell from /etc/passwd
awk -F: '{print $1 " -> " $7}' /etc/passwd

# Delete all empty lines and comments from a config file
grep -v '^[[:space:]]*#' /etc/redis/redis.conf | grep -v '^[[:space:]]*$'
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: How does \`awk\` handle column parsing by default?**  
  *A:* \`awk\` automatically splits each line into whitespace-delimited fields (\`$1\`, \`$2\`, etc.). \`$0\` represents the entire unmodified line, \`NR\` is the current line number, and \`NF\` is the total number of fields in the line. Custom delimiters are specified using \`-F\` (e.g. \`awk -F: '{print $1}'\`).
- **Q: What is the purpose of \`xargs\`?**  
  *A:* \`xargs\` converts standard input (stdin) into command-line arguments for another utility. For example, \`find . -name "*.log" | xargs rm -f\` passes all matching filenames to \`rm\` in efficient batches.

### 🛠️ 5. Hands-on Exercises
1. Parse \`/var/log/syslog\` or \`/var/log/messages\` using \`awk\` to group log entries by process daemon name.
2. Write a \`sed\` one-liner to sanitize a database dump file by replacing sensitive API keys with dummy placeholders.`
          },
        ],
      },
      {
        id: "sec_linux_03",
        title: "Section 3: Networking, Security, Performance & Cron (Modules 11-15)",
        lessons: [
          {
            id: "linux_mod_11",
            title: "Module 11: Linux Networking & Socket Diagnostics",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/hRFgnx1M83M",
            content: `### 📖 1. Theory
Linux provides modern networking stacks under the \`iproute2\` suite:
- **Layer 2/3 Interfaces:** \`ip link\` (NIC state), \`ip addr\` (IP assignments), \`ip route\` (kernel routing table).
- **Socket Inspection:** \`ss\` (Socket Statistics) replaces deprecated \`netstat\`. Displays TCP/UDP listening sockets, established connections, and socket buffer queues.
- **DNS Resolution Flow:** \`/etc/hosts\` -> \`systemd-resolved\` -> \`/etc/resolv.conf\` -> upstream DNS nameservers.
- **Packet Sniffing:** \`tcpdump\` captures raw packets from interfaces for protocol debugging.

### 🏢 2. Real-World DevOps Examples
- **Diagnosing "Port Already in Use":** When starting an application returns \`Error: bind: address already in use :8080\`, DevOps engineers run \`ss -tulnp | grep :8080\` or \`lsof -i :8080\` to identify the offending PID.
- **Kubernetes Pod Network Verification:** Inspecting virtual ethernet pairs (\`veth*\`) and container bridge routing inside Kubernetes worker nodes.

### 💻 3. Practical Commands
\`\`\`bash
# List all active listening TCP and UDP sockets with Process Names and PIDs
sudo ss -tulnp

# View IP routing table and default gateway
ip route show

# Perform detailed HTTP header trace and timing diagnostics
curl -Iv https://devopsacademy.io

# DNS query with complete trace
dig +trace devopsacademy.io

# Capture 10 HTTP packets on eth0 interface
sudo tcpdump -i eth0 -nn -c 10 port 80
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What is the difference between \`ss\` and \`netstat\`?**  
  *A:* \`netstat\` reads socket information slowly from \`/proc/net/tcp\`, creating high overhead on heavily loaded production servers with tens of thousands of sockets. \`ss\` directly queries kernel netlink sockets, making it orders of magnitude faster and capable of displaying TCP connection state timers.
- **Q: How does Linux resolve a domain name when an application calls \`getaddrinfo()\`?**  
  *A:* It checks \`/etc/nsswitch.conf\` (which specifies the lookup order, typically \`hosts: files dns\`). It first checks static mapping in \`/etc/hosts\`, then queries the configured DNS servers in \`/etc/resolv.conf\` or the local caching stub resolver (127.0.0.53).

### 🛠️ 5. Hands-on Exercises
1. Run \`ss -tulnp\` to list all open listening ports on your machine and determine which daemon owns port 22 or 80.
2. Use \`curl -w "@curl-format.txt" -o /dev/null -s https://google.com\` to break down DNS lookup time, TCP connect time, and TLS handshake time.`
          },
          {
            id: "linux_mod_12",
            title: "Module 12: SSH Architecture, Key Authentication & Hardening",
            duration: 45,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/hQWRp-FdTpc",
            content: `### 📖 1. Theory
Secure Shell (SSH) provides encrypted communication over insecure networks:
- **Asymmetric Key Cryptography:** Public Key placed in \`~/.ssh/authorized_keys\` on server; Private Key stored securely on client (\`~/.ssh/id_ed25519\`).
- **Algorithms:** Modern standards favor \`Ed25519\` (elliptic-curve, faster and more secure) over legacy RSA 2048/4096.
- **SSH Config Client:** Custom profiles in \`~/.ssh/config\` for proxy jumps, custom ports, and identity files.
- **Port Forwarding / Tunneling:**
  - Local Forwarding (\`-L\`): Access remote internal databases locally.
  - Remote Forwarding (\`-R\`): Expose local services to remote servers.
  - Dynamic Forwarding (\`-D\`): SOCKS5 proxy.

### 🏢 2. Real-World DevOps Examples
- **Bastion / Jump Host Setup:** Accessing private Kubernetes clusters in AWS VPC without exposing worker nodes to the public internet using \`ssh -J bastion.company.com private-k8s-node\`.
- **Hardening Server sshd_config:** Disabling password authentication, enforcing key-only logins, and disabling root login (\`PermitRootLogin no\`, \`PasswordAuthentication no\`).

### 💻 3. Practical Commands
\`\`\`bash
# Generate high-security Ed25519 key pair with comment
ssh-keygen -t ed25519 -C "jatin@devopsacademy.io"

# Copy public key to remote server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server.domain.com

# SSH Tunnel: Forward remote PostgreSQL (5432) to local port 5432
ssh -L 5432:localhost:5432 -N -f user@database-server

# Example ~/.ssh/config profile
# Host prod-db
#     HostName 10.0.1.50
#     User ubuntu
#     IdentityFile ~/.ssh/prod.pem
#     ProxyJump bastion.company.com
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: Why is Ed25519 preferred over RSA for SSH keys?**  
  *A:* Ed25519 uses Twisted Edwards elliptic curves, providing equivalent or higher security with a much shorter key length (256-bit vs 4096-bit RSA), faster key generation, immunity to side-channel attacks, and smaller signature size.
- **Q: What does SSH ProxyJump do?**  
  *A:* \`ProxyJump\` allows an SSH client to establish a transparent connection to a target server residing in a private subnet through an intermediate bastion server without needing to store private keys on the intermediate server.

### 🛠️ 5. Hands-on Exercises
1. Generate an Ed25519 SSH key pair.
2. Create a clean \`~/.ssh/config\` file with an alias, custom user, and identity file mapping.`
          },
          {
            id: "linux_mod_13",
            title: "Module 13: System Monitoring & Performance Tuning",
            duration: 55,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/S43v_zB1U08",
            content: `### 📖 1. Theory
Performance troubleshooting in Linux requires understanding the USE (Utilization, Saturation, Errors) method:
- **CPU Load Average:** 1, 5, and 15-minute metrics representing the average number of processes in runnable or uninterruptible sleep (D) state.
- **Memory & Swap:** Virtual memory management, page caching, dirty pages, and the Linux Out-Of-Memory (OOM) Killer.
- **Disk I/O:** IOPS, throughput, queue depth, and disk wait percentage (\`%iowait\`).
- **Core Toolset:** \`uptime\`, \`vmstat\`, \`iostat\`, \`free -h\`, \`sar\` (System Activity Reporter), \`dmesg\`.

### 🏢 2. Real-World DevOps Examples
- **Debugging High Load with 0% CPU:** When \`uptime\` shows a load average of 20 on a 4-core machine but CPU utilization is only 5%, the issue is disk I/O bottlenecks causing processes to stall in uninterruptible sleep (\`D\` state). Verified using \`vmstat 1\` under the \`b\` (blocked) and \`wa\` (iowait) columns.
- **OOM-Killer Post-Mortem:** When a Java or Node.js container randomly crashes, DevOps engineers check \`dmesg -T | grep -i oom\` to verify if the kernel invoked the Out-Of-Memory killer to protect system stability.

### 💻 3. Practical Commands
\`\`\`bash
# Real-time memory inspection in human-readable format
free -h

# Sample virtual memory and CPU stats every 1 second for 5 counts
vmstat 1 5

# Extended disk I/O statistics (inspect %util, await, r/s, w/s)
iostat -xz 1 5

# Inspect OOM killer events in kernel messages
sudo dmesg -T | grep -E -i "killed process|out of memory"

# Track CPU utilization per core in real-time
mpstat -P ALL 1
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What does a Load Average of 4.0 mean on a machine with 2 CPU cores?**  
  *A:* It means the system is 200% saturated. Over the measured time period, 2 cores were actively executing processes while an average of 2 other runnable processes were waiting in queue for CPU time or disk I/O.
- **Q: How does Linux use "free" RAM for caching?**  
  *A:* Linux follows the principle "free RAM is wasted RAM". Unallocated memory is automatically utilized for page caches and buffer caches to speed up disk reads. When applications request more memory, the kernel instantly frees up cached pages without performance loss.

### 🛠️ 5. Hands-on Exercises
1. Run \`free -h\` and calculate your actual available memory vs buff/cache.
2. Run \`vmstat 1 10\` and observe the \`r\` (runnable), \`b\` (blocked), and \`wa\` (iowait) columns.`
          },
          {
            id: "linux_mod_14",
            title: "Module 14: Linux Security, Hardening & Firewalls",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/f9-iYQ25K-g",
            content: `### 📖 1. Theory
Defense-in-depth on Linux requires network filtering, mandatory access control, and OS hardening:
- **Netfilter / Firewalls:**
  - \`iptables\` / \`nftables\`: Kernel packet filtering tables (Filter, NAT, Mangle) and chains (INPUT, OUTPUT, FORWARD).
  - \`UFW\` (Uncomplicated Firewall): User-friendly frontend for managing firewall rules on Ubuntu/Debian.
  - \`firewalld\`: Zone-based dynamic firewall daemon on RHEL/CentOS.
- **Mandatory Access Control (MAC):**
  - **SELinux (Security-Enhanced Linux):** Enforces labeling contexts on files, processes, and ports (Enforcing, Permissive, Disabled).
  - **AppArmor:** Path-based application confinement profiles on Ubuntu/Debian.

### 🏢 2. Real-World DevOps Examples
- **Securing Kubernetes Nodes:** Blocking all inbound traffic on public interfaces while allowing only necessary ports (22 for SSH via VPN, 6443 for K8s API, 10250 for Kubelet).
- **SELinux Denials in Production:** When Nginx fails to read \`/data/www\` despite having \`chmod 777\`, the SELinux security context is mismatched. Fixed using \`chcon -R -t httpd_sys_content_t /data/www\`.

### 💻 3. Practical Commands
\`\`\`bash
# Ubuntu UFW: Set default deny incoming policy and allow SSH/HTTPS
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose

# Inspect active iptables rules with packet counters
sudo iptables -L -v -n

# Check current SELinux status and audit log
getenforce
sestatus
sudo ausearch -m avc -ts recent

# Restore default SELinux context on a directory
restorecon -Rv /var/www/html
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What is the difference between DAC (Discretionary Access Control) and MAC (Mandatory Access Control)?**  
  *A:* In DAC (standard Linux permissions), file owners can grant permissions to any user. In MAC (SELinux/AppArmor), the operating system kernel enforces security policies on all processes and files regardless of root or user permissions, preventing compromised root processes from accessing unauthorized resources.
- **Q: What is the purpose of the \`iptables\` FORWARD chain?**  
  *A:* The \`FORWARD\` chain handles packets routed through the Linux host to another destination (essential for Docker container bridge networking, VPNs, and Kubernetes pod-to-pod routing).

### 🛠️ 5. Hands-on Exercises
1. Enable UFW, allow port 22 and port 80, and verify with \`sudo ufw status numbered\`.
2. Inspect your system's current MAC framework using \`getenforce\` or \`aa-status\`.'`
          },
          {
            id: "linux_mod_15",
            title: "Module 15: Cron Jobs, Timers & Automated Backup Engineering",
            duration: 50,
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/QZJ1drMQz1A",
            content: `### 📖 1. Theory
Scheduled tasks in Linux automate recurring maintenance, backups, and metrics collection:
- **Cron Architecture:**
  - \`crontab -e\`: User-specific scheduled cron entries.
  - 5-Field Syntax: \`Minute (0-59) Hour (0-23) DayOfMonth (1-31) Month (1-12) DayOfWeek (0-7)\`.
  - Global directories: \`/etc/cron.daily\`, \`/etc/cron.hourly\`, \`/etc/crontab\`.
- **Systemd Timers:** Modern alternative to cron with dependency tracking, missed run catchup (\`Persistent=true\`), and precise journald logging.
- **Logrotate:** Prevents disk full outages by compressing, rotating, and pruning log files in \`/etc/logrotate.d/\`.

### 🏢 2. Real-World DevOps Examples
- **Automated MySQL/Postgres Database Backups:** Running a nightly backup job at 2:00 AM UTC with \`0 2 * * * /opt/scripts/db_backup.sh >> /var/log/db_backup.log 2>&1\`.
- **Systemd Timer for Microservice Maintenance:** Deploying \`cleanup.timer\` to trigger \`cleanup.service\` every Sunday at midnight with automatic retries on failure.

### 💻 3. Practical Commands
\`\`\`bash
# List scheduled cron jobs for current user and specific user
crontab -l
sudo crontab -u appuser -l

# Example Crontab Schedule Examples:
# */15 * * * *       -> Run every 15 minutes
# 0 0 * * 0          -> Run every Sunday at midnight
# 30 2 1 * *         -> Run 1st of every month at 2:30 AM

# View all active systemd timer units and next scheduled trigger
systemctl list-timers --all

# Test logrotate configuration manually in debug mode
sudo logrotate -d /etc/logrotate.d/nginx
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: What advantages do Systemd Timers have over traditional Crontabs?**  
  *A:* Systemd Timers provide unified logging via \`journalctl\`, execution state tracking in \`systemctl list-timers\`, dependency management (e.g. wait for network/storage to be available), and the \`Persistent=true\` option to run missed jobs if the system was powered off.
- **Q: Why should you always redirect stdout and stderr (\`>> /path/to.log 2>&1\`) in cron jobs?**  
  *A:* Unredirected output in cron triggers the local MTA (mail transfer agent) to send local mail to the user. On cloud servers without local mail configured, unhandled output can fill up mail queues or silently fail without log traces.

### 🛠️ 5. Hands-on Exercises
1. Create a cron entry that logs disk space to \`/tmp/disk_audit.log\` every 5 minutes: \`*/5 * * * * df -h >> /tmp/disk_audit.log 2>&1\`.
2. Inspect active systemd timers using \`systemctl list-timers\` and locate the \`logrotate.timer\` schedule.`
          },
        ],
      },
    ],
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
