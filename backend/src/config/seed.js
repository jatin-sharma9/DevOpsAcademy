import bcrypt from 'bcryptjs';
import { query } from './db.js';

export const seed = async () => {
  try {
    console.log('Seeding initial database data...');

    const salt = await bcrypt.genSalt(10);
    
    const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'Jatin_Sharma';
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'jatinsharma932002@gmail.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'J@tinS93';

    // Hash passwords
    const adminPass = await bcrypt.hash(adminPassword, salt);
    const userPass = await bcrypt.hash('user123', salt);

    // Insert or update Admin (Default: Jatin_Sharma)
    const adminRes = await query(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (email) DO UPDATE SET 
        username = EXCLUDED.username, 
        password_hash = EXCLUDED.password_hash, 
        role = EXCLUDED.role
      RETURNING id;
    `, [adminUsername, adminEmail, adminPass]);

    const adminId = adminRes.rows[0]?.id;

    // Insert Sample User
    await query(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES ('jatin', 'jatin@devopsacademy.com', $1, 'user')
      ON CONFLICT (email) DO NOTHING;
    `, [userPass]);

    const coursesData = [
      {
        title: 'Linux Fundamentals for DevOps',
        slug: 'linux-fundamentals',
        short_description: 'Master the Linux command line, file systems, processes, networking, and shell scripting.',
        description: 'A comprehensive Linux course designed for aspiring DevOps engineers. You\'ll go from absolute basics to advanced system administration, shell scripting, and automation.',
        category: 'Linux',
        level: 'beginner',
        price: 0.00,
        is_pro: false,
        is_featured: true,
        is_published: true,
        duration_hours: 16,
        thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=600',
        lessons: [
          {
            title: 'Module 1: Linux Architecture & Kernel Internals',
            slug: 'linux-architecture-kernel',
            description: 'Master kernel internals, user vs kernel space, system calls, and cgroups.',
            content: 'Detailed theory, real-world examples, commands, interview Q&A, and hands-on exercises for Linux Kernel & Architecture.',
            video_url: 'https://www.youtube.com/embed/mzmqwtR8w-Q',
            sort_order: 1,
            duration_minutes: 45
          },
          {
            title: 'Module 2: Filesystem Hierarchy Standard & File Operations',
            slug: 'fhs-and-file-operations',
            description: 'Master FHS directories (/etc, /var, /proc), find, tar, and symlinks.',
            content: 'Comprehensive deep dive into Linux directories, inodes, and file management.',
            video_url: 'https://www.youtube.com/embed/42iQKuQodW4',
            sort_order: 2,
            duration_minutes: 50
          },
          {
            title: 'Module 3: Permissions, Ownership & ACLs',
            slug: 'permissions-ownership-acls',
            description: 'Master chmod, chown, umask, SUID, SGID, sticky bit, and POSIX ACLs.',
            content: 'POSIX permissions model, numeric chmod, security contexts, and access control lists.',
            video_url: 'https://www.youtube.com/embed/eWsCbBfxZ04',
            sort_order: 3,
            duration_minutes: 45
          },
          {
            title: 'Module 4: Process Management & Signals',
            slug: 'process-management-signals',
            description: 'Process states, PID 1, signals (SIGTERM vs SIGKILL), zombie processes, and htop.',
            content: 'Real-world process inspection, ps, top, htop, kill, and background jobs.',
            video_url: 'https://www.youtube.com/embed/5U2_0qD0Z50',
            sort_order: 4,
            duration_minutes: 50
          },
          {
            title: 'Module 5: Systemd & Service Management',
            slug: 'systemd-service-management',
            description: 'Systemd units, targets, custom service files, journalctl logging, and daemons.',
            content: 'Writing custom unit files, systemctl management, and troubleshooting daemon crash loops.',
            video_url: 'https://www.youtube.com/embed/S2pE9bS_U7w',
            sort_order: 5,
            duration_minutes: 55
          },
          {
            title: 'Module 6: Storage, Partitions, Filesystems & LVM',
            slug: 'storage-partitions-lvm',
            description: 'Master lsblk, fdisk, ext4/xfs, /etc/fstab, and Logical Volume Management (LVM).',
            content: 'Online LVM volume expansion, PV/VG/LV management, and disk troubleshooting.',
            video_url: 'https://www.youtube.com/embed/8v_YqD1o4Q8',
            sort_order: 6,
            duration_minutes: 55
          },
          {
            title: 'Module 7: Package Management & Repositories',
            slug: 'package-management-repos',
            description: 'Debian apt/dpkg, RHEL dnf/rpm, GPG keys, and custom repository setup.',
            content: 'Automating software installation, security patching, and dependency management.',
            video_url: 'https://www.youtube.com/embed/jZ_y0C4K9l0',
            sort_order: 7,
            duration_minutes: 40
          },
          {
            title: 'Module 8: User Administration, Sudoers & PAM',
            slug: 'user-admin-sudoers-pam',
            description: 'Manage users, groups, /etc/shadow, visudo, least-privilege, and PAM auth.',
            content: 'User provisioning, service account creation, and security lockdown.',
            video_url: 'https://www.youtube.com/embed/k8EwT_f45j0',
            sort_order: 8,
            duration_minutes: 45
          },
          {
            title: 'Module 9: Bash Shell Scripting & Error Handling',
            slug: 'bash-scripting-error-handling',
            description: 'Write robust production scripts with set -euo pipefail, conditionals, and functions.',
            content: 'Complete bash automation masterclass with error trapping and exit code handling.',
            video_url: 'https://www.youtube.com/embed/tK9Oc6AEnR4',
            sort_order: 9,
            duration_minutes: 60
          },
          {
            title: 'Module 10: Stream Editing & Text Processing (grep, sed, awk)',
            slug: 'text-processing-sed-awk',
            description: 'Advanced log analysis and dynamic stream manipulation using grep, sed, and awk.',
            content: 'Columnar parsing, in-place regex substitutions, and log summary one-liners.',
            video_url: 'https://www.youtube.com/embed/e7BufAVwDiM',
            sort_order: 10,
            duration_minutes: 60
          },
          {
            title: 'Module 11: Linux Networking & Socket Diagnostics',
            slug: 'linux-networking-diagnostics',
            description: 'iproute2, ss socket inspection, routing tables, DNS resolution, and tcpdump.',
            content: 'Troubleshooting network ports, interface routing, and low-level Linux sockets.',
            video_url: 'https://www.youtube.com/embed/hRFgnx1M83M',
            sort_order: 11,
            duration_minutes: 50
          },
          {
            title: 'Module 12: SSH Architecture, Key Authentication & Hardening',
            slug: 'ssh-keys-hardening',
            description: 'Ed25519 cryptography, sshd hardening, port forwarding (-L/-R), and jump hosts.',
            content: 'Securing server access, automated key distribution, and bastion tunneling.',
            video_url: 'https://www.youtube.com/embed/hQWRp-FdTpc',
            sort_order: 12,
            duration_minutes: 45
          },
          {
            title: 'Module 13: System Monitoring & Performance Tuning',
            slug: 'system-monitoring-tuning',
            description: 'CPU load averages, memory swap, disk I/O wait, vmstat, iostat, and OOM killer.',
            content: 'USE method diagnostics, kernel performance monitoring, and bottleneck isolation.',
            video_url: 'https://www.youtube.com/embed/S43v_zB1U08',
            sort_order: 13,
            duration_minutes: 55
          },
          {
            title: 'Module 14: Linux Security, Hardening & Firewalls',
            slug: 'linux-security-firewalls',
            description: 'UFW, iptables packet filtering, SELinux policies, and AppArmor profiles.',
            content: 'Hardening production Linux instances and configuring firewall zones.',
            video_url: 'https://www.youtube.com/embed/f9-iYQ25K-g',
            sort_order: 14,
            duration_minutes: 50
          },
          {
            title: 'Module 15: Cron Jobs, Timers & Automated Backup Engineering',
            slug: 'cron-timers-backups',
            description: 'Crontab scheduling, systemd timers, automated backup scripts, and logrotate.',
            content: 'Disaster recovery automation, database backups, and scheduled maintenance.',
            video_url: 'https://www.youtube.com/embed/QZJ1drMQz1A',
            sort_order: 15,
            duration_minutes: 50
          }
        ]
      },
      {
        title: 'Git & GitHub for DevOps Teams',
        slug: 'git-github-mastery',
        short_description: 'Master version control, branching strategies, pull requests, and CI/CD integration with Git.',
        description: 'Everything from git basics to advanced workflows including GitFlow, trunk-based development, GitHub Actions, and managing large codebases.',
        category: 'Git',
        level: 'beginner',
        price: 0.00,
        is_pro: false,
        is_featured: false,
        is_published: true,
        duration_hours: 8,
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=600',
        lessons: [
          {
            title: 'Git init, add, commit, status',
            slug: 'git-init-add-commit-status',
            description: 'Learn the foundational workflow of Git version control.',
            content: 'In this lesson, you will learn how to initialize a repository, stage files, commit changes, and check status.',
            video_url: 'https://www.youtube.com/embed/wbpKdQyGaaM',
            sort_order: 1,
            duration_minutes: 15
          },
          {
            title: 'Branching & Merging',
            slug: 'branching-merging',
            description: 'Create features safely using Git branches and merge conflicts resolution.',
            content: 'Branches let you isolate changes. You will learn branch creation, switching, merging, and conflict resolution.',
            video_url: 'https://www.youtube.com/embed/42iQKuQodW4',
            sort_order: 2,
            duration_minutes: 20
          },
          {
            title: 'Remote Repositories & Push/Pull',
            slug: 'remote-repos-push-pull',
            description: 'Collaborate with teams by linking local repos to GitHub.',
            content: 'Pushing changes to remote repos. We cover clone, remote add, push, fetch, and pull commands.',
            video_url: 'https://www.youtube.com/embed/HcbUq8Ksp_k',
            sort_order: 3,
            duration_minutes: 18
          },
          {
            title: 'Rebasing & Cherry-picking',
            slug: 'rebasing-cherry-picking',
            description: 'Learn advanced Git rewrite workflows for clean history.',
            content: 'Rebasing rewrites commit logs. Cherry-picking lets you select specific commits. We cover best practices.',
            video_url: 'https://www.youtube.com/embed/eWsCbBfxZ04',
            sort_order: 4,
            duration_minutes: 22
          },
          {
            title: 'GitFlow Strategy',
            slug: 'gitflow-strategy',
            description: 'Organize team releases using branching models.',
            content: 'Branching models establish standard releases. We cover GitFlow (develop, feature, release, hotfix) and trunk-based options.',
            video_url: 'https://www.youtube.com/embed/e7BufAVwDiM',
            sort_order: 5,
            duration_minutes: 25
          },
          {
            title: 'GitHub Actions Basics',
            slug: 'github-actions-basics',
            description: 'Automate build workflows directly on GitHub events.',
            content: 'GitHub Actions is a built-in CI/CD service. We learn about runners, triggers, jobs, and steps syntax.',
            video_url: 'https://www.youtube.com/embed/QZJ1drMQz1A',
            sort_order: 6,
            duration_minutes: 30
          }
        ]
      },
      {
        title: 'Docker & Containers Mastery',
        slug: 'docker-mastery',
        short_description: 'Build, ship, and run containers. Master Dockerfiles, Compose, networking, volumes, and security.',
        description: 'The complete Docker course. From your first container to multi-stage builds, Docker Compose orchestration, container security hardening, and private registries.',
        category: 'Docker',
        level: 'intermediate',
        price: 1999.00,
        is_pro: true,
        is_featured: true,
        is_published: true,
        duration_hours: 16,
        thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=600',
        lessons: [
          {
            title: 'Container Internals, Namespaces, Cgroups & UnionFS',
            slug: 'docker-internals-architecture',
            description: 'Understand Linux kernel primitives (namespaces, cgroups, overlayfs) powering container isolation.',
            content: 'Deep dive into Linux kernel namespaces (PID, NET, MNT, IPC, UTS, USER), Control Groups (cgroups v1/v2), OverlayFS storage drivers, and the container runtime hierarchy (dockerd -> containerd -> runc).',
            video_url: 'https://www.youtube.com/embed/mzmqwtR8w-Q',
            sort_order: 1,
            duration_minutes: 45
          },
          {
            title: 'Container Lifecycle, CLI Commands & Debugging',
            slug: 'docker-lifecycle-cli',
            description: 'Master container execution states, port forwarding, execution hooks, and live interactive debugging.',
            content: 'Master container lifecycle management: create, run, stop, kill, pause, restart, rm. Learn interactive debugging using docker exec, attach, top, stats, diff, and logs -f.',
            video_url: 'https://www.youtube.com/embed/42iQKuQodW4',
            sort_order: 2,
            duration_minutes: 40
          },
          {
            title: 'Production Dockerfile Authoring & Layer Caching',
            slug: 'dockerfile-authoring-cache',
            description: 'Write deterministic, fast, cache-optimized Dockerfiles following enterprise best practices.',
            content: 'Learn instruction mechanics (FROM, RUN, COPY, ADD, CMD vs ENTRYPOINT, ENV vs ARG, WORKDIR), layer caching ordering rules, .dockerignore patterns, and CacheKit build caching.',
            video_url: 'https://www.youtube.com/embed/eWsCbBfxZ04',
            sort_order: 3,
            duration_minutes: 50
          },
          {
            title: 'Multi-Stage Builds, Distroless & Alpine Minimization',
            slug: 'multi-stage-distroless',
            description: 'Shrink container images from gigabytes to megabytes using multi-stage builds and distroless runtimes.',
            content: 'Techniques for building minimal production images: multi-stage compilation for Go/Node/Java/Rust, distroless images from Google, Alpine edge-cases (musl vs glibc), and scratch base images.',
            video_url: 'https://www.youtube.com/embed/tK9Oc6AEnR4',
            sort_order: 4,
            duration_minutes: 45
          },
          {
            title: 'Persistent Storage: Volumes, Bind Mounts & Tmpfs',
            slug: 'storage-volumes-persistence',
            description: 'Manage stateful workloads using named volumes, host bind mounts, NFS drivers, and tmpfs mounts.',
            content: 'Deep dive into container storage drivers, Named Volumes (/var/lib/docker/volumes), Host Bind Mounts, read-only mounts (:ro), tmpfs in-memory mounts, volume backup, restore, and data migration strategies.',
            video_url: 'https://www.youtube.com/embed/hQWRp-FdTpc',
            sort_order: 5,
            duration_minutes: 45
          },
          {
            title: 'Docker Networking: Bridge, Host, Overlay & Macvlan',
            slug: 'docker-networking-deep-dive',
            description: 'Understand bridge drivers, embedded DNS, host mode, overlay networks, and Macvlan routing.',
            content: 'Comprehensive Docker networking: default vs custom bridge networks, embedded DNS resolver (127.0.0.11), host networking, overlay networks across swarm hosts, macvlan for physical subnet assignment, and iptables NAT routing.',
            video_url: 'https://www.youtube.com/embed/hRFgnx1M83M',
            sort_order: 6,
            duration_minutes: 50
          },
          {
            title: 'Multi-Container Stacks with Docker Compose V2',
            slug: 'docker-compose-orchestration',
            description: 'Orchestrate microservices, dependencies, health checks, volumes, and environment overrides with Compose.',
            content: 'Master Docker Compose V2 syntax: service definitions, depends_on with conditions (service_healthy), env_file, custom networks, resource reservations, profiles, compose overrides, and multi-tier stacks (React + Node + Redis + Postgres).',
            video_url: 'https://www.youtube.com/embed/f9-iYQ25K-g',
            sort_order: 7,
            duration_minutes: 55
          },
          {
            title: 'Managing Secrets, Configs & Environment Variables',
            slug: 'secrets-configs-environment',
            description: 'Prevent secret leakage into container layers using build secrets, runtime mounts, and Doppler/Vault.',
            content: 'Security patterns for credentials: build-time secrets with BuildKit (--mount=type=secret), compose secrets, runtime environment files vs env vars, external secret managers (HashiCorp Vault, AWS SSM, Doppler), and protecting CI/CD pipelines.',
            video_url: 'https://www.youtube.com/embed/cQepf9fY6cE',
            sort_order: 8,
            duration_minutes: 40
          },
          {
            title: 'Container Registries: Docker Hub, AWS ECR & GitHub GHCR',
            slug: 'container-registries',
            description: 'Build, tag, authenticate, push, and automate multi-arch container images in enterprise registries.',
            content: 'Registry operations: Docker Hub, AWS Elastic Container Registry (ECR), GitHub Packages (GHCR), Harbor self-hosted registry. Semantic tagging, image immutability, vulnerability scanning on push, and multi-arch builds using docker buildx.',
            video_url: 'https://www.youtube.com/embed/QZJ1drMQz1A',
            sort_order: 9,
            duration_minutes: 45
          },
          {
            title: 'Health Checks, Restart Policies & Logging Drivers',
            slug: 'healthchecks-logging-observability',
            description: 'Build self-healing containers with HEALTHCHECK instructions and centralized logging drivers.',
            content: 'Define HEALTHCHECK in Dockerfile and Compose (interval, timeout, retries, start-period), configure restart policies (unless-stopped, on-failure), configure log drivers (json-file, syslog, fluentd, journald), and log rotation limits (max-size, max-file).',
            video_url: 'https://www.youtube.com/embed/sG_9e2QauXo',
            sort_order: 10,
            duration_minutes: 40
          },
          {
            title: 'Container Hardening: Rootless, Capabilities & Seccomp',
            slug: 'container-security-hardening',
            description: 'Harden containers against escapes with non-root users, Linux capabilities drop, Seccomp, and AppArmor.',
            content: 'Container security posture: non-root USER directive, read-only root filesystems (--read-only), dropping Linux capabilities (--cap-drop=ALL --cap-add=NET_BIND_SERVICE), Seccomp default profiles, AppArmor/SELinux enforcement, and Rootless Docker.',
            video_url: 'https://www.youtube.com/embed/cQepf9fY6cE',
            sort_order: 11,
            duration_minutes: 50
          },
          {
            title: 'Vulnerability Scanning (Trivy), SBOM & Cosign Signing',
            slug: 'vulnerability-scanning-sbom',
            description: 'Implement DevSecOps image scanning with Trivy/Grype, generate SBOMs, and sign images with Cosign.',
            content: 'Integrate security scanning in CI/CD: Trivy vulnerability scans with severity gates (HIGH, CRITICAL), generating Software Bill of Materials (SBOM) using Syft, and cryptographically signing and verifying container images with Sigstore Cosign.',
            video_url: 'https://www.youtube.com/embed/eWsCbBfxZ04',
            sort_order: 12,
            duration_minutes: 45
          },
          {
            title: 'Resource Management: Cgroups v2, CPU/Memory Limits & OOM Killer',
            slug: 'resource-limits-oom',
            description: 'Control CPU quotas, memory limits, swap behavior, and prevent container noisy neighbor outages.',
            content: 'Allocate and constrain system resources: --cpus, --cpu-shares, --memory, --memory-swap, CFS quota scheduler, diagnosing Exit Code 137 (OOMKilled), and kernel cgroups v2 resource metrics.',
            video_url: 'https://www.youtube.com/embed/42iQKuQodW4',
            sort_order: 13,
            duration_minutes: 40
          },
          {
            title: 'Docker Daemon Configuration & Production Maintenance',
            slug: 'daemon-tuning-production',
            description: 'Configure daemon.json, live-restore, prune automation, storage quotas, and daemon telemetry.',
            content: 'Production Docker host tuning: /etc/docker/daemon.json parameters (live-restore, default-ulimits, log-driver, metrics-addr), Docker system maintenance (docker system prune, disk cleanup cron jobs), and Prometheus metrics scraping (:9323/metrics).',
            video_url: 'https://www.youtube.com/embed/mzmqwtR8w-Q',
            sort_order: 14,
            duration_minutes: 45
          },
          {
            title: 'Docker Swarm Orchestration & Migration to Kubernetes',
            slug: 'docker-swarm-to-k8s',
            description: 'Cluster nodes with Docker Swarm and understand the architecture bridge to Kubernetes.',
            content: 'Cluster orchestration with Docker Swarm: swarm init, join tokens, manager vs worker nodes, overlay routing mesh, service scaling, rolling updates, rollbacks, and mapping Docker concepts (compose, services, networks) to Kubernetes (Deployments, Services, Ingress).',
            video_url: 'https://www.youtube.com/embed/f9-iYQ25K-g',
            sort_order: 15,
            duration_minutes: 50
          }
        ]
      },
      {
        title: 'Kubernetes: From Zero to Production',
        slug: 'kubernetes-in-action',
        short_description: 'Master Kubernetes architecture, workloads, networking, storage, RBAC, Helm, and production patterns.',
        description: 'The definitive Kubernetes course. Covers everything from Pod basics to advanced production patterns including HPA, service meshes, GitOps with ArgoCD, and multi-cluster management.',
        category: 'Kubernetes',
        level: 'advanced',
        price: 2999.00,
        is_pro: true,
        is_featured: true,
        is_published: true,
        duration_hours: 24,
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=600',
        lessons: [
          {
            title: 'Control Plane Components',
            slug: 'control-plane-components',
            description: 'Analyze kube-apiserver, etcd, controller-manager, and scheduler.',
            content: 'The control plane governs the cluster. We study component roles, configurations, and communication routes.',
            video_url: 'https://www.youtube.com/embed/mzmqwtR8w-Q',
            sort_order: 1,
            duration_minutes: 20
          },
          {
            title: 'Worker Node Components',
            slug: 'worker-node-components',
            description: 'Understand kubelet, kube-proxy, and container runtimes.',
            content: 'Worker nodes host workloads. We cover pod lifecycle execution, container networking, and cluster proxies.',
            video_url: 'https://www.youtube.com/embed/42iQKuQodW4',
            sort_order: 2,
            duration_minutes: 18
          },
          {
            title: 'kubectl CLI Mastery',
            slug: 'kubectl-cli-mastery',
            description: 'Control your cluster efficiently with command tools.',
            content: 'Kubectl is the key CLI tool. We master quick commands, resource definitions, shell completions, and formatting.',
            video_url: 'https://www.youtube.com/embed/sG_9e2QauXo',
            sort_order: 3,
            duration_minutes: 25
          },
          {
            title: 'Pods and Pod Specs',
            slug: 'pods-and-pod-specs',
            description: 'Master the atomic unit of Kubernetes scheduling.',
            content: 'Pods group co-located container resources. We write pod yaml files, configure probes, and check resource limits.',
            video_url: 'https://www.youtube.com/embed/eWsCbBfxZ04',
            sort_order: 4,
            duration_minutes: 22
          },
          {
            title: 'Deployments & Rolling Updates',
            slug: 'deployments-rolling-updates',
            description: 'Manage stateless replicas and update versions with zero-downtime.',
            content: 'Deployments run stateless controllers. We perform rollouts, check rollback history, and verify health probes.',
            video_url: 'https://www.youtube.com/embed/hRFgnx1M83M',
            sort_order: 5,
            duration_minutes: 28
          },
          {
            title: 'Services: ClusterIP, NodePort, LoadBalancer',
            slug: 'services-clusterip-nodeport-loadbalancer',
            description: 'Establish internal and external routing policies.',
            content: 'Services route traffic dynamically to labels. We examine network options and map client requests.',
            video_url: 'https://www.youtube.com/embed/hQWRp-FdTpc',
            sort_order: 6,
            duration_minutes: 25
          },
          {
            title: 'Ingress Controllers & TLS',
            slug: 'ingress-controllers-tls',
            description: 'Host multiple web services behind a unified reverse proxy.',
            content: 'Ingress is a cluster ingress director. We set up Nginx Ingress, create virtual host rules, and enable TLS certificate configs.',
            video_url: 'https://www.youtube.com/embed/f9-iYQ25K-g',
            sort_order: 7,
            duration_minutes: 30
          },
          {
            title: 'RBAC & Security Contexts',
            slug: 'rbac-security-contexts',
            description: 'Limit API authorizations and define container privilege boundaries.',
            content: 'Role-Based Access Controls keep clusters safe. We define Roles, RoleBindings, service accounts, and security profiles.',
            video_url: 'https://www.youtube.com/embed/tK9Oc6AEnR4',
            sort_order: 8,
            duration_minutes: 30
          },
          {
            title: 'Helm Charts Deep Dive',
            slug: 'helm-charts-deep-dive',
            description: 'Package complex Kubernetes deployments for simple rollouts.',
            content: 'Helm is the package manager. We write charts using Go templates, define values files, and release app versions.',
            video_url: 'https://www.youtube.com/embed/cQepf9fY6cE',
            sort_order: 9,
            duration_minutes: 35
          },
          {
            title: 'GitOps with ArgoCD',
            slug: 'gitops-with-argocd',
            description: 'Synchronize cluster resources with Git definitions automatically.',
            content: 'GitOps makes Git the single source of truth. We deploy ArgoCD, link git repos, and track drift declarations.',
            video_url: 'https://www.youtube.com/embed/QZJ1drMQz1A',
            sort_order: 10,
            duration_minutes: 40
          }
        ]
      },
      {
        title: 'Jenkins CI/CD Pipelines Masterclass',
        slug: 'jenkins-cicd-pipelines',
        short_description: 'Build robust CI/CD pipelines with Jenkins: declarative pipelines, shared libraries, and integrations.',
        description: 'Comprehensive Jenkins course covering declarative and scripted pipelines, agents, Docker integration, Kubernetes agents, security, and advanced patterns.',
        category: 'CI/CD',
        level: 'intermediate',
        price: 1499.00,
        is_pro: true,
        is_featured: false,
        is_published: true,
        duration_hours: 12,
        thumbnail: 'https://images.unsplash.com/photo-1580927751497-22b8f967b9c9?auto=format&fit=crop&q=80&w=600',
        lessons: [
          {
            title: 'Jenkins Architecture & Setup',
            slug: 'jenkins-architecture-setup',
            description: 'Set up Jenkins master controller and worker build agents.',
            content: 'We install Jenkins, configure admin tools, download basic plug-ins, and set up dynamic worker nodes.',
            video_url: 'https://www.youtube.com/embed/mzmqwtR8w-Q',
            sort_order: 1,
            duration_minutes: 20
          },
          {
            title: 'Declarative Pipeline Syntax',
            slug: 'declarative-pipeline-syntax',
            description: 'Declare automated workflows in structured Jenkinsfiles.',
            content: 'Declarative scripts keep build templates readable. We cover stages, steps, variables, and post sections.',
            video_url: 'https://www.youtube.com/embed/42iQKuQodW4',
            sort_order: 2,
            duration_minutes: 25
          },
          {
            title: 'Stages, Steps, and Agents',
            slug: 'stages-steps-agents',
            description: 'Determine which build agents host which pipeline stages.',
            content: 'We map tasks to matching agents, coordinate artifact passing, and handle secret environment variables.',
            video_url: 'https://www.youtube.com/embed/sG_9e2QauXo',
            sort_order: 3,
            duration_minutes: 22
          },
          {
            title: 'Shared Libraries',
            slug: 'shared-libraries',
            description: 'Abstract and reuse common pipeline steps across multiple repositories.',
            content: 'Shared libraries reduce duplicate code. We write Groovy functions, publish them in Git, and load them in projects.',
            video_url: 'https://www.youtube.com/embed/eWsCbBfxZ04',
            sort_order: 4,
            duration_minutes: 30
          },
          {
            title: 'Docker in Jenkins',
            slug: 'docker-in-jenkins',
            description: 'Use containers as clean, isolated pipeline execution runners.',
            content: 'Docker avoids build server dependency conflicts. We run stages inside specified Docker images and publish image tags.',
            video_url: 'https://www.youtube.com/embed/hRFgnx1M83M',
            sort_order: 5,
            duration_minutes: 25
          }
        ]
      },
      {
        title: 'Terraform: Infrastructure as Code',
        slug: 'terraform-infrastructure-as-code',
        short_description: 'Provision cloud infrastructure declaratively. Master HCL, modules, state, workspaces, and Terragrunt.',
        description: 'From terraform init to enterprise-scale modular infrastructure. Covers AWS, Azure, GCP providers, state management, policy as code with Sentinel, and CI/CD integration.',
        category: 'IaC',
        level: 'intermediate',
        price: 2499.00,
        is_pro: true,
        is_featured: true,
        is_published: true,
        duration_hours: 16,
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=600',
        lessons: [
          {
            title: 'HCL Syntax and Providers',
            slug: 'hcl-syntax-providers',
            description: 'Write HashiCorp Configuration Language declarations.',
            content: 'HCL dictates target infrastructure. We write provider configurations, connect credentials, and verify setups.',
            video_url: 'https://www.youtube.com/embed/mzmqwtR8w-Q',
            sort_order: 1,
            duration_minutes: 20
          },
          {
            title: 'Resources, Variables, Outputs',
            slug: 'resources-variables-outputs',
            description: 'Create dynamic infrastructure variables and print attributes.',
            content: 'We map values using input variables, write resource blocks, and retrieve output fields like public IPs.',
            video_url: 'https://www.youtube.com/embed/42iQKuQodW4',
            sort_order: 2,
            duration_minutes: 25
          },
          {
            title: 'State Management',
            slug: 'state-management',
            description: 'Understand how Terraform maps configs to active infrastructure.',
            content: 'Terraform tracks state in local or remote files. We study lock keys, run plan checks, and examine state json files.',
            video_url: 'https://www.youtube.com/embed/sG_9e2QauXo',
            sort_order: 3,
            duration_minutes: 22
          },
          {
            title: 'Creating Reusable Modules',
            slug: 'creating-reusable-modules',
            description: 'Package related resources for standard enterprise templates.',
            content: 'Modules make infrastructure DRY. We define inputs, map target resource properties, and publish variables.',
            video_url: 'https://www.youtube.com/embed/eWsCbBfxZ04',
            sort_order: 4,
            duration_minutes: 30
          },
          {
            title: 'Remote State & Backends',
            slug: 'remote-state-backends',
            description: 'Store state files securely in team storage like S3 with DynamoDB locking.',
            content: 'Remote backends enable teamwork. We configure AWS S3 storage with DynamoDB state locks for concurrency.',
            video_url: 'https://www.youtube.com/embed/hRFgnx1M83M',
            sort_order: 5,
            duration_minutes: 25
          }
        ]
      },
      {
        title: 'Ansible Configuration Management',
        slug: 'ansible-automation',
        short_description: 'Automate infrastructure configuration, application deployment, and orchestration with Ansible.',
        description: 'Complete Ansible course from playbook basics to enterprise-scale automation with roles, Dynamic inventories, and security automation.',
        category: 'Configuration Management',
        level: 'intermediate',
        price: 1999.00,
        is_pro: true,
        is_featured: false,
        is_published: true,
        duration_hours: 14,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
        lessons: [
          {
            title: 'Ansible Architecture & Ad-hoc Commands',
            slug: 'ansible-architecture',
            description: 'Execute instant system tasks over secure SSH connections.',
            content: 'Ansible is agentless. We configuration inventory files, test node links, and execute quick terminal commands.',
            video_url: 'https://www.youtube.com/embed/mzmqwtR8w-Q',
            sort_order: 1,
            duration_minutes: 18
          },
          {
            title: 'Playbooks and YAML Basics',
            slug: 'playbooks-yaml-basics',
            description: 'Declare system tasks in simple YAML files.',
            content: 'Playbooks list tasks sequentially. We use standard modules (apt, systemd, copy) and deploy simple packages.',
            video_url: 'https://www.youtube.com/embed/42iQKuQodW4',
            sort_order: 2,
            duration_minutes: 25
          },
          {
            title: 'Inventory Management',
            slug: 'inventory-management',
            description: 'Organize dynamic server list mappings for target tasks.',
            content: 'Inventories separate hosts by environment. We group machines, set host parameters, and query dynamic clouds.',
            video_url: 'https://www.youtube.com/embed/sG_9e2QauXo',
            sort_order: 3,
            duration_minutes: 20
          },
          {
            title: 'Roles and Galaxy',
            slug: 'roles-galaxy',
            description: 'Organize tasks, templates, and handlers into reusable folders.',
            content: 'Roles partition setups. We create role structures, configure standard template files, and load community modules.',
            video_url: 'https://www.youtube.com/embed/eWsCbBfxZ04',
            sort_order: 4,
            duration_minutes: 28
          },
          {
            title: 'Templates with Jinja2',
            slug: 'templates-jinja2',
            description: 'Inject server properties dynamically into configuration files.',
            content: 'Jinja2 templates compile files using system variables. We write templates and reload services using handler tasks.',
            video_url: 'https://www.youtube.com/embed/hRFgnx1M83M',
            sort_order: 5,
            duration_minutes: 22
          }
        ]
      },
      {
        title: 'AWS for DevOps Engineers',
        slug: 'aws-devops-engineer',
        short_description: 'Master AWS services for DevOps: EC2, EKS, RDS, VPC, IAM, CodePipeline, CloudFormation, and more.',
        description: 'Prepare for the AWS DevOps Engineer Professional certification while building production-grade infrastructure. Covers VPC architecture, EKS, CodePipeline, CloudFormation, and cost optimization.',
        category: 'Cloud',
        level: 'advanced',
        price: 3499.00,
        is_pro: true,
        is_featured: true,
        is_published: true,
        duration_hours: 22,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
        lessons: [
          {
            title: 'VPC Design & Networking',
            slug: 'vpc-design-networking',
            description: 'Construct isolated cloud network topologies with subnet rules.',
            content: 'VPC keeps networks safe. We set up public and private subnets, define routing keys, and configure NAT gateways.',
            video_url: 'https://www.youtube.com/embed/mzmqwtR8w-Q',
            sort_order: 1,
            duration_minutes: 30
          },
          {
            title: 'EC2, Auto Scaling & ALB',
            slug: 'ec2-autoscaling-alb',
            description: 'Create high availability clusters with load balancers.',
            content: 'We set up target groups, write launch configurations, monitor scaling states, and forward web ports.',
            video_url: 'https://www.youtube.com/embed/42iQKuQodW4',
            sort_order: 2,
            duration_minutes: 35
          },
          {
            title: 'IAM Policies & Roles Deep Dive',
            slug: 'iam-policies-roles',
            description: 'Enforce security least privilege across all AWS api requests.',
            content: 'IAM credentials govern permissions. We write JSON security templates, link trust rules, and test API queries.',
            video_url: 'https://www.youtube.com/embed/sG_9e2QauXo',
            sort_order: 3,
            duration_minutes: 28
          },
          {
            title: 'EKS Cluster Setup & Management',
            slug: 'eks-cluster-setup',
            description: 'Host managed Kubernetes clusters using cloud integrations.',
            content: 'EKS abstracts worker controller node orchestration. We provision cluster systems, configure nodes, and link kubectl.',
            video_url: 'https://www.youtube.com/embed/eWsCbBfxZ04',
            sort_order: 4,
            duration_minutes: 40
          },
          {
            title: 'Lambda & Serverless Architecture',
            slug: 'lambda-serverless',
            description: 'Run background event tasks without hosting continuous servers.',
            content: 'Serverless models scale automatically. We write JS code functions, configure API Gateways, and monitor executions.',
            video_url: 'https://www.youtube.com/embed/hRFgnx1M83M',
            sort_order: 5,
            duration_minutes: 35
          },
          {
            title: 'CodePipeline CI/CD',
            slug: 'codepipeline-cicd',
            description: 'Automate build test releases on AWS service pipelines.',
            content: 'AWS pipeline orchestrations. We connect github events, code builds, and deploy tasks to ECS cluster targets.',
            video_url: 'https://www.youtube.com/embed/hQWRp-FdTpc',
            sort_order: 6,
            duration_minutes: 40
          }
        ]
      },
      {
        title: 'Networking for DevOps',
        slug: 'networking-for-devops',
        short_description: 'Master the 20 essential networking pillars for DevOps, Cloud & SRE: OSI, TCP/IP, Subnetting, CIDR, DNS, NAT, Load Balancers, Proxies, Kubernetes CNI, VPCs, and eBPF.',
        description: 'A comprehensive, hands-on networking masterclass specifically engineered for DevOps practitioners, Cloud Architects, and SREs. From low-level packet flow across the OSI and TCP/IP stack to enterprise AWS VPC routing, Kubernetes CNI microsegmentation, SSL/TLS encryption, and reverse proxy architectures. Every module contains deep theory, real-world DevOps production scenarios, Linux troubleshooting commands, interview questions, and hands-on exercises.',
        category: 'Networking',
        level: 'intermediate',
        price: 0.00,
        is_pro: false,
        is_featured: true,
        is_published: true,
        duration_hours: 20,
        thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
        lessons: [
          { title: 'Module 1: OSI Model', slug: 'mod-1-osi-model', description: 'Deep dive into 7-Layer OSI model for DevOps & Cloud architecture.', content: 'Understand Physical to Application layer packet journey, troubleshooting L4 port issues vs L7 502 bad gateways.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 1, duration_minutes: 45 },
          { title: 'Module 2: TCP/IP', slug: 'mod-2-tcp-ip', description: 'TCP 3-way handshake, teardown, socket states and TIME_WAIT tuning.', content: 'Master TCP vs UDP, socket state transitions (LISTEN, ESTABLISHED, TIME_WAIT), and ephemeral port reuse.', video_url: 'https://www.youtube.com/embed/F27PLhn3W04', sort_order: 2, duration_minutes: 50 },
          { title: 'Module 3: IP Addressing', slug: 'mod-3-ip-addressing', description: 'IPv4/IPv6, RFC 1918 private ranges, loopback, and Cloud IMDS.', content: 'Public vs Private IP allocation, loopback 127.0.0.1, and AWS Instance Metadata Service security at 169.254.169.254.', video_url: 'https://www.youtube.com/embed/s_Ntt6eTn94', sort_order: 3, duration_minutes: 40 },
          { title: 'Module 4: Subnetting', slug: 'mod-4-subnetting', description: 'Network bits, host bits, calculating usable IPs, and AWS reserved IPs.', content: 'Subnet sizing calculations (2^(32-prefix) - 2), and why AWS VPC reserves 5 IP addresses per subnet.', video_url: 'https://www.youtube.com/embed/s_Ntt6eTn94', sort_order: 4, duration_minutes: 45 },
          { title: 'Module 5: CIDR', slug: 'mod-5-cidr', description: 'Classless Inter-Domain Routing prefix notation and route summarization.', content: 'Master /16, /20, /24, /28, /32 CIDRs and non-overlapping VPC address planning for multi-account clouds.', video_url: 'https://www.youtube.com/embed/s_Ntt6eTn94', sort_order: 5, duration_minutes: 40 },
          { title: 'Module 6: DNS', slug: 'mod-6-dns', description: 'Hierarchical DNS resolution, record types, TTL, and CoreDNS ndots:5.', content: 'Resolution flow: Root -> TLD -> Authoritative -> Recursive resolver. Records: A, AAAA, CNAME, ALIAS, TXT, SRV.', video_url: 'https://www.youtube.com/embed/27r4Bzur5SU', sort_order: 6, duration_minutes: 50 },
          { title: 'Module 7: DHCP', slug: 'mod-7-dhcp', description: 'DORA process, lease allocation, and Cloud DHCP Option Sets.', content: 'Discover, Offer, Request, Acknowledge cycle, lease renewals, and default gateway/DNS server provisioning.', video_url: 'https://www.youtube.com/embed/s_Ntt6eTn94', sort_order: 7, duration_minutes: 35 },
          { title: 'Module 8: Routing', slug: 'mod-8-routing', description: 'Next-hop decision, default gateway 0.0.0.0/0, and Longest Prefix Match.', content: 'Routing tables, static vs dynamic routing (BGP/OSPF), and Kubernetes CNI Calico/Cilium route propagation.', video_url: 'https://www.youtube.com/embed/s_Ntt6eTn94', sort_order: 8, duration_minutes: 45 },
          { title: 'Module 9: NAT', slug: 'mod-9-nat', description: 'Source NAT (Masquerading), Destination NAT, and AWS NAT Gateways.', content: 'SNAT, DNAT, PAT/Port Forwarding, and private subnet internet egress without inbound vulnerability.', video_url: 'https://www.youtube.com/embed/s_Ntt6eTn94', sort_order: 9, duration_minutes: 45 },
          { title: 'Module 10: Ports and Protocols', slug: 'mod-10-ports-protocols', description: 'Well-known, registered, and ephemeral ports with socket scanning.', content: 'Port ranges (0-1023, 1024-49151, 49152-65535), TCP vs UDP vs ICMP, and ephemeral port starvation troubleshooting.', video_url: 'https://www.youtube.com/embed/s_Ntt6eTn94', sort_order: 10, duration_minutes: 40 },
          { title: 'Module 11: HTTP vs HTTPS', slug: 'mod-11-http-vs-https', description: 'Plaintext HTTP/1.1 vs HTTPS, HTTP/2 multiplexing, and HTTP/3 QUIC.', content: 'Headers, verbs, status code debugging (401, 403, 502, 504), and binary multiplexed streams.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 11, duration_minutes: 45 },
          { title: 'Module 12: SSL/TLS', slug: 'mod-12-ssl-tls', description: 'Asymmetric/symmetric cryptography, TLS 1.3 1-RTT, SNI, and Cert-Manager.', content: 'TLS handshake, CA certificate validation chains, Server Name Indication, and Let\'s Encrypt auto-renewal.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 12, duration_minutes: 50 },
          { title: 'Module 13: Load Balancers', slug: 'mod-13-load-balancers', description: 'Layer 4 (NLB) vs Layer 7 (ALB), balancing algorithms, and health checks.', content: 'Round Robin, Least Connections, IP Hash, sticky sessions, and zero-downtime blue/green deployments.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 13, duration_minutes: 50 },
          { title: 'Module 14: Reverse Proxy', slug: 'mod-14-reverse-proxy', description: 'Nginx, Traefik, SSL offloading, X-Forwarded-For, and rate limiting.', content: 'Forward vs Reverse proxy, header injection, gzip compression, caching, and Kubernetes Ingress architecture.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 14, duration_minutes: 45 },
          { title: 'Module 15: Firewall Basics', slug: 'mod-15-firewall-basics', description: 'Stateless NACLs vs stateful Security Groups, iptables, and WAF.', content: 'Packet filtering, zero-trust security group microsegmentation, UFW, and layer 7 web application firewalls.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 15, duration_minutes: 45 },
          { title: 'Module 16: Kubernetes Networking & CNI', slug: 'mod-16-k8s-cni', description: 'Calico, Cilium eBPF, Flannel, Pod IP allocation, and NetworkPolicies.', content: 'Kubernetes networking model, kube-proxy, IPVS, CNI data planes, and zero-trust microsegmentation.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 16, duration_minutes: 55 },
          { title: 'Module 17: Cloud VPC & Transit Gateway', slug: 'mod-17-cloud-vpc-transit-gateway', description: 'Multi-VPC architecture, VPC Peering, AWS Transit Gateway, and PrivateLink.', content: 'Hub-and-spoke VPC routing, S3 gateway endpoints, route tables, and cross-account isolation.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 17, duration_minutes: 55 },
          { title: 'Module 18: Zero Trust & Service Mesh mTLS', slug: 'mod-18-service-mesh-mtls', description: 'Istio Envoy sidecars, SPIFFE IDs, and strict mutual TLS encryption.', content: 'Zero trust security, cryptographic workload identity, canary routing, and certificate rotation.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 18, duration_minutes: 50 },
          { title: 'Module 19: High Availability & BGP Anycast', slug: 'mod-19-bgp-anycast-cdn', description: 'Border Gateway Protocol, Anycast DNS, CDN edge caching, and DDoS mitigation.', content: 'Global traffic management, BGP routing path metrics, edge SSL termination, and multi-region failover.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 19, duration_minutes: 50 },
          { title: 'Module 20: Network Observability & eBPF', slug: 'mod-20-network-observability-ebpf', description: 'Deep packet inspection with tcpdump, Wireshark, eBPF socket tracing, and MTU PMTUD.', content: 'Diagnosing TCP retransmissions, SYN backlog queues, socket latency profiling, and packet capture analysis.', video_url: 'https://www.youtube.com/embed/IPvYjXCsTg8', sort_order: 20, duration_minutes: 60 }
        ]
      }
    ];

    // Seed Courses
    for (const course of coursesData) {
      const courseRes = await query(`
        INSERT INTO courses (
          title, slug, short_description, description, category,
          level, price, is_pro, is_featured, is_published,
          instructor_id, duration_hours, thumbnail
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          short_description = EXCLUDED.short_description,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          level = EXCLUDED.level,
          price = EXCLUDED.price,
          is_pro = EXCLUDED.is_pro,
          is_featured = EXCLUDED.is_featured,
          is_published = EXCLUDED.is_published,
          instructor_id = COALESCE(courses.instructor_id, EXCLUDED.instructor_id),
          duration_hours = EXCLUDED.duration_hours,
          thumbnail = EXCLUDED.thumbnail
        RETURNING id;
      `, [
        course.title,
        course.slug,
        course.short_description,
        course.description,
        course.category,
        course.level,
        course.price,
        course.is_pro,
        course.is_featured,
        course.is_published,
        adminId || null,
        course.duration_hours,
        course.thumbnail
      ]);

      const courseId = courseRes.rows[0]?.id;

      if (courseId) {
        // Seed Lessons for this course with complete 5-pillar rich content
        for (const lesson of course.lessons) {
          let richContent = lesson.content;
          if (!richContent || !richContent.includes('### 📖 1. Theory')) {
            richContent = `### 📖 1. Theory
${lesson.description || 'Comprehensive module for production DevOps engineering.'}

In enterprise infrastructure engineering, mastering the core internals of ${lesson.title} is critical for building resilient, scalable, and self-healing systems.
- **Core Principles:** Focuses on deterministic state convergence, automated validation, and continuous observability.
- **Architectural Mechanics:** Decouples state from compute, minimizes blast radius through isolation boundaries, and guarantees zero-downtime failover.
- **Operational Lifecycle:** Enforces policy as code, automated continuous deployment pipelines, and proactive telemetry collection across distributed nodes.

### 🏢 2. Real-World DevOps Examples
- **Enterprise High-Scale Deployments:** Production platforms leverage these exact patterns to orchestrate multi-cluster and multi-region infrastructure with 99.99% uptime SLAs.
- **Automated Incident Remediation:** SRE teams wire telemetry and health probes directly to orchestration controllers to detect anomalies and self-heal failed components.
- **Security & Compliance Hardening:** Enforces least-privilege access, immutable configurations, and encrypted communication channels across all microservices.

### 💻 3. Practical Commands
\`\`\`bash
# 1. Verify component status and configuration
echo "=== Checking status for: ${lesson.title} ==="
uname -a

# 2. Inspect active network sockets and service bindings
ss -tulpn 2>/dev/null | head -n 10

# 3. Check live resource metrics and process execution
ps aux --sort=-%cpu | head -n 10

# 4. View system logs and telemetry
journalctl -n 25 --no-pager 2>/dev/null || dmesg | tail -n 25
\`\`\`

### 🎯 4. Interview Questions & Answers
- **Q: Why is ${lesson.title} essential in modern cloud-native architectures?**  
  *A:* It guarantees predictable, reproducible infrastructure state, eliminates configuration drift, and ensures high availability with automated recovery mechanisms.
- **Q: How do you troubleshoot latency bottlenecks or unexpected failures in this layer?**  
  *A:* By isolating the blast radius, checking kernel and daemon logs, profiling system call latency, and verifying socket states and network connectivity between dependent microservices.

### 🛠️ 5. Hands-on Exercises
1. Execute the diagnostic commands above in your local or lab environment.
2. Inspect the operational metrics and identify any anomalies or active bottlenecks.
3. Formulate a recovery runbook and test automated rollback behavior under simulated failure conditions.`;
          }

          await query(`
            INSERT INTO lessons (
              course_id, title, slug, description, content, video_url, sort_order, duration_minutes
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (course_id, slug) DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              content = EXCLUDED.content,
              video_url = EXCLUDED.video_url,
              sort_order = EXCLUDED.sort_order,
              duration_minutes = EXCLUDED.duration_minutes;
          `, [
            courseId,
            lesson.title,
            lesson.slug,
            lesson.description,
            richContent,
            lesson.video_url,
            lesson.sort_order,
            lesson.duration_minutes
          ]);
        }
      }
    }

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed().then(() => process.exit(0));
}
