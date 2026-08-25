import { SiLinux, SiGit, SiDocker, SiKubernetes, SiJenkins, SiTerraform, SiAnsible } from "react-icons/si";
import { Cloud } from "lucide-react";
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
    totalLessons: 42,
    durationHours: 12,
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer",
    thumbnail: "",
    icon: React.createElement(SiLinux),
    color: "from-orange-500 to-yellow-500",
    tags: ["Linux", "Bash", "Shell Scripting", "System Admin"],
    whatYouLearn: [
      "Navigate the Linux filesystem confidently",
      "Write powerful Bash shell scripts",
      "Manage users, groups, and file permissions",
      "Monitor and control system processes",
      "Configure networking and SSH",
      "Use systemd for service management",
      "Set up cron jobs and automation",
    ],
    requirements: ["Basic computer knowledge", "No prior Linux experience needed"],
    updatedAt: "2026-08-01",
    sections: [
      {
        id: "sec_linux_01",
        title: "Linux Basics & File System",
        lessons: [
          { 
            id: "l1", 
            title: "Linux Fundamentals - Complete Beginner Tutorial", 
            duration: 12, 
            type: "video", 
            preview: true, 
            youtubeUrl: "https://www.youtube.com/embed/mzmqwtR8w-Q",
            content: "Welcome to Linux Fundamentals. In this comprehensive beginner lesson, you will learn the core Linux concepts, command-line interfaces, directory structures, and fundamental operations required for modern DevOps environments." 
          },
          { 
            id: "l2", 
            title: "Navigating the File System (ls, cd, pwd)", 
            duration: 18, 
            type: "video", 
            preview: true,
            youtubeUrl: "https://www.youtube.com/embed/42iQKuQodW4",
            content: "Learn how to navigate the Linux directory tree using pwd, ls, cd, and relative/absolute paths."
          },
          { 
            id: "l3", 
            title: "File Operations: create, copy, move, delete", 
            duration: 22, 
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/sG_9e2QauXo",
            content: "Master essential file management commands including touch, mkdir, cp, mv, and rm."
          },
          { 
            id: "l4", 
            title: "Understanding File Permissions (chmod, chown)", 
            duration: 20, 
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/eWsCbBfxZ04",
            content: "Understand Linux user/group permissions, numeric chmod modes (755, 644), and ownership changes with chown."
          },
          { id: "l5", title: "Quiz: Linux Basics", duration: 10, type: "quiz" },
        ],
      },
      {
        id: "sec_linux_02",
        title: "Shell Scripting",
        lessons: [
          { 
            id: "l6", 
            title: "Variables, Data Types, and Input", 
            duration: 25, 
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/tK9Oc6AEnR4",
            content: "Write your first Bash scripts using environment variables, user input read, and command substitution."
          },
          { 
            id: "l7", 
            title: "Conditionals and Loops", 
            duration: 30, 
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/cQepf9fY6cE",
            content: "Master control structures in Bash: if-else statements, for loops, while loops, and test operators."
          },
          { 
            id: "l8", 
            title: "Functions and Script Organization", 
            duration: 22, 
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/e7BufAVwDiM",
            content: "Build modular scripts with custom Bash functions, scope management, and clean parameter passing."
          },
          { 
            id: "l9", 
            title: "Cron Jobs & Scheduling", 
            duration: 18, 
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/QZJ1drMQz1A",
            content: "Schedule automated maintenance tasks, backups, and scripts using crontab and systemd timers."
          },
          { id: "l10", title: "Lab: Write a Backup Script", duration: 30, type: "lab" },
        ],
      },
      {
        id: "sec_linux_03",
        title: "Networking & Security",
        lessons: [
          { 
            id: "l11", 
            title: "Network Configuration & Tools", 
            duration: 20, 
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/hRFgnx1M83M",
            content: "Inspect network interfaces, open ports, and routing using ip, netstat, ss, curl, and ping."
          },
          { 
            id: "l12", 
            title: "SSH Key Authentication", 
            duration: 15, 
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/hQWRp-FdTpc",
            content: "Generate SSH key pairs (ssh-keygen), configure authorized_keys, and securely access remote Linux servers."
          },
          { 
            id: "l13", 
            title: "Firewalls with iptables/ufw", 
            duration: 18, 
            type: "video",
            youtubeUrl: "https://www.youtube.com/embed/f9-iYQ25K-g",
            content: "Secure Linux servers by setting up Uncomplicated Firewall (UFW) and iptables rules."
          },
          { id: "l14", title: "Final Assessment", duration: 20, type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "course_git_001",
    slug: "git-github-mastery",
    title: "Git & GitHub for DevOps Teams",
    shortDescription: "Master version control, branching strategies, pull requests, and CI/CD integration with Git.",
    description: "Everything from git basics to advanced workflows including GitFlow, trunk-based development, GitHub Actions, and managing large monorepos.",
    category: "Git",
    level: "beginner",
    price: 0,
    isPro: false,
    isFeatured: false,
    rating: 4.7,
    totalRatings: 1920,
    totalStudents: 14200,
    totalLessons: 32,
    durationHours: 8,
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer",
    thumbnail: "",
    icon: React.createElement(SiGit),
    color: "from-red-500 to-orange-500",
    tags: ["Git", "GitHub", "Version Control", "GitFlow"],
    whatYouLearn: [
      "Understand Git's internal data model",
      "Master branching and merging strategies",
      "Use pull requests and code reviews effectively",
      "Implement GitFlow and trunk-based development",
      "Automate workflows with GitHub Actions",
      "Manage monorepos and large codebases",
    ],
    requirements: ["Basic command line knowledge"],
    updatedAt: "2026-07-15",
    sections: [
      {
        id: "sec_git_01",
        title: "Git Fundamentals",
        lessons: [
          { id: "g1", title: "Git init, add, commit, status", duration: 15, type: "video", preview: true },
          { id: "g2", title: "Branching & Merging", duration: 20, type: "video" },
          { id: "g3", title: "Remote Repositories & Push/Pull", duration: 18, type: "video" },
          { id: "g4", title: "Quiz: Git Basics", duration: 10, type: "quiz" },
        ],
      },
      {
        id: "sec_git_02",
        title: "Advanced Git Workflows",
        lessons: [
          { id: "g5", title: "Rebasing & Cherry-picking", duration: 22, type: "video" },
          { id: "g6", title: "GitFlow Strategy", duration: 25, type: "video" },
          { id: "g7", title: "GitHub Actions Basics", duration: 30, type: "video" },
          { id: "g8", title: "Lab: CI Pipeline with GitHub Actions", duration: 45, type: "lab" },
        ],
      },
    ],
  },
  {
    id: "course_docker_001",
    slug: "docker-mastery",
    title: "Docker & Containers Mastery",
    shortDescription: "Build, ship, and run containers. Master Dockerfiles, Compose, networking, volumes, and security.",
    description: "The complete Docker course. From your first container to multi-stage builds, Docker Compose orchestration, container security hardening, and private registries.",
    category: "Docker",
    level: "intermediate",
    price: 1999,
    isPro: true,
    isFeatured: true,
    rating: 4.9,
    totalRatings: 3240,
    totalStudents: 22800,
    totalLessons: 54,
    durationHours: 16,
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer",
    thumbnail: "",
    icon: React.createElement(SiDocker),
    color: "from-blue-500 to-cyan-500",
    tags: ["Docker", "Containers", "Docker Compose", "DevOps"],
    whatYouLearn: [
      "Understand Docker architecture and container internals",
      "Write optimized multi-stage Dockerfiles",
      "Use Docker Compose for multi-service apps",
      "Manage volumes, networks, and secrets",
      "Secure containers with non-root users and scanning",
      "Publish and manage private container registries",
    ],
    requirements: ["Basic Linux command line", "Familiarity with any programming language"],
    updatedAt: "2026-08-10",
    sections: [
      {
        id: "sec_docker_01",
        title: "Docker Core Concepts",
        lessons: [
          { id: "d1", title: "Docker Architecture: Client, Daemon, Registry", duration: 15, type: "video", preview: true },
          { id: "d2", title: "Running Your First Container", duration: 20, type: "video", preview: true },
          { id: "d3", title: "Images vs Containers", duration: 18, type: "video" },
          { id: "d4", title: "Writing Dockerfiles", duration: 30, type: "video" },
          { id: "d5", title: "Quiz: Docker Fundamentals", duration: 10, type: "quiz" },
        ],
      },
      {
        id: "sec_docker_02",
        title: "Docker Networking & Storage",
        lessons: [
          { id: "d6", title: "Docker Networks: bridge, host, overlay", duration: 25, type: "video" },
          { id: "d7", title: "Volumes and Bind Mounts", duration: 20, type: "video" },
          { id: "d8", title: "Docker Compose Deep Dive", duration: 35, type: "video" },
          { id: "d9", title: "Lab: Deploy a Full Stack App", duration: 60, type: "lab" },
        ],
      },
      {
        id: "sec_docker_03",
        title: "Advanced Docker",
        lessons: [
          { id: "d10", title: "Multi-stage Builds", duration: 22, type: "video" },
          { id: "d11", title: "Container Security Best Practices", duration: 28, type: "video" },
          { id: "d12", title: "Private Registry Setup", duration: 20, type: "video" },
          { id: "d13", title: "Final Assessment", duration: 25, type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "course_k8s_001",
    slug: "kubernetes-in-action",
    title: "Kubernetes: From Zero to Production",
    shortDescription: "Master Kubernetes architecture, workloads, networking, storage, RBAC, Helm, and production patterns.",
    description: "The definitive Kubernetes course. Covers everything from Pod basics to advanced production patterns including HPA, service meshes, GitOps with ArgoCD, and multi-cluster management.",
    category: "Kubernetes",
    level: "advanced",
    price: 2999,
    isPro: true,
    isFeatured: true,
    rating: 4.9,
    totalRatings: 4120,
    totalStudents: 31500,
    totalLessons: 72,
    durationHours: 24,
    instructor: "Jatin Sharma",
    instructorTitle: "CKAD & CKA Certified",
    thumbnail: "",
    icon: React.createElement(SiKubernetes),
    color: "from-blue-600 to-indigo-600",
    tags: ["Kubernetes", "K8s", "Helm", "RBAC", "ArgoCD"],
    whatYouLearn: [
      "Kubernetes architecture: control plane, etcd, kubelet",
      "Deployments, StatefulSets, DaemonSets, Jobs",
      "Services, Ingress, NetworkPolicies",
      "RBAC, Secrets, ConfigMaps",
      "Helm chart authoring and deployment",
      "HPA, VPA, and cluster autoscaling",
      "GitOps with ArgoCD",
    ],
    requirements: ["Docker knowledge", "Basic Linux skills", "Familiarity with microservices"],
    updatedAt: "2026-08-12",
    sections: [
      {
        id: "sec_k8s_01",
        title: "Kubernetes Architecture",
        lessons: [
          { id: "k1", title: "Control Plane Components", duration: 20, type: "video", preview: true },
          { id: "k2", title: "Worker Node Components", duration: 18, type: "video", preview: true },
          { id: "k3", title: "kubectl CLI Mastery", duration: 25, type: "video" },
          { id: "k4", title: "Pods and Pod Specs", duration: 22, type: "video" },
          { id: "k5", title: "Quiz: K8s Architecture", duration: 12, type: "quiz" },
        ],
      },
      {
        id: "sec_k8s_02",
        title: "Workloads & Networking",
        lessons: [
          { id: "k6", title: "Deployments & Rolling Updates", duration: 28, type: "video" },
          { id: "k7", title: "Services: ClusterIP, NodePort, LoadBalancer", duration: 25, type: "video" },
          { id: "k8", title: "Ingress Controllers & TLS", duration: 30, type: "video" },
          { id: "k9", title: "Lab: Deploy Microservices App", duration: 60, type: "lab" },
        ],
      },
      {
        id: "sec_k8s_03",
        title: "Production Patterns",
        lessons: [
          { id: "k10", title: "RBAC & Security Contexts", duration: 30, type: "video" },
          { id: "k11", title: "Helm Charts Deep Dive", duration: 35, type: "video" },
          { id: "k12", title: "GitOps with ArgoCD", duration: 40, type: "video" },
          { id: "k13", title: "Final CKA-style Assessment", duration: 30, type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "course_jenkins_001",
    slug: "jenkins-cicd-pipelines",
    title: "Jenkins CI/CD Pipelines Masterclass",
    shortDescription: "Build robust CI/CD pipelines with Jenkins: declarative pipelines, shared libraries, Blue Ocean, and integrations.",
    description: "Comprehensive Jenkins course covering declarative and scripted pipelines, agents, Docker integration, Kubernetes agents, security, and advanced patterns.",
    category: "CI/CD",
    level: "intermediate",
    price: 1499,
    isPro: true,
    isFeatured: false,
    rating: 4.6,
    totalRatings: 1680,
    totalStudents: 11200,
    totalLessons: 38,
    durationHours: 12,
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer",
    thumbnail: "",
    icon: React.createElement(SiJenkins),
    color: "from-red-600 to-pink-600",
    tags: ["Jenkins", "CI/CD", "Pipelines", "DevOps"],
    whatYouLearn: [
      "Install and configure Jenkins",
      "Write declarative Jenkinsfiles",
      "Create shared libraries for reuse",
      "Run builds on Docker and Kubernetes agents",
      "Integrate with GitHub, Docker Hub, and Slack",
    ],
    requirements: ["Basic Git knowledge", "Docker fundamentals"],
    updatedAt: "2026-07-20",
    sections: [
      {
        id: "sec_jen_01",
        title: "Jenkins Fundamentals",
        lessons: [
          { id: "j1", title: "Jenkins Architecture & Setup", duration: 20, type: "video", preview: true },
          { id: "j2", title: "Declarative Pipeline Syntax", duration: 25, type: "video" },
          { id: "j3", title: "Stages, Steps, and Agents", duration: 22, type: "video" },
          { id: "j4", title: "Quiz: Jenkins Basics", duration: 10, type: "quiz" },
        ],
      },
      {
        id: "sec_jen_02",
        title: "Advanced Pipelines",
        lessons: [
          { id: "j5", title: "Shared Libraries", duration: 30, type: "video" },
          { id: "j6", title: "Docker in Jenkins", duration: 25, type: "video" },
          { id: "j7", title: "Lab: End-to-End Pipeline", duration: 60, type: "lab" },
        ],
      },
    ],
  },
  {
    id: "course_terraform_001",
    slug: "terraform-infrastructure-as-code",
    title: "Terraform: Infrastructure as Code",
    shortDescription: "Provision cloud infrastructure declaratively. Master HCL, modules, state, workspaces, and Terragrunt.",
    description: "From terraform init to enterprise-scale modular infrastructure. Covers AWS, Azure, GCP providers, state management, policy as code with Sentinel, and CI/CD integration.",
    category: "IaC",
    level: "intermediate",
    price: 2499,
    isPro: true,
    isFeatured: true,
    rating: 4.8,
    totalRatings: 2120,
    totalStudents: 16800,
    totalLessons: 48,
    durationHours: 16,
    instructor: "Jatin Sharma",
    instructorTitle: "HashiCorp Terraform Associate",
    thumbnail: "",
    icon: React.createElement(SiTerraform),
    color: "from-purple-600 to-violet-600",
    tags: ["Terraform", "IaC", "AWS", "Cloud"],
    whatYouLearn: [
      "Write HCL configurations for any cloud provider",
      "Create reusable Terraform modules",
      "Manage remote state with S3 and DynamoDB",
      "Use workspaces for multi-environment management",
      "Implement policy as code with Sentinel",
      "Integrate Terraform in CI/CD pipelines",
    ],
    requirements: ["Basic cloud provider knowledge", "Linux command line"],
    updatedAt: "2026-08-05",
    sections: [
      {
        id: "sec_tf_01",
        title: "Terraform Core",
        lessons: [
          { id: "t1", title: "HCL Syntax and Providers", duration: 20, type: "video", preview: true },
          { id: "t2", title: "Resources, Variables, Outputs", duration: 25, type: "video" },
          { id: "t3", title: "State Management", duration: 22, type: "video" },
          { id: "t4", title: "Quiz: Terraform Fundamentals", duration: 12, type: "quiz" },
        ],
      },
      {
        id: "sec_tf_02",
        title: "Modules & Advanced Patterns",
        lessons: [
          { id: "t5", title: "Creating Reusable Modules", duration: 30, type: "video" },
          { id: "t6", title: "Remote State & Backends", duration: 25, type: "video" },
          { id: "t7", title: "Lab: Multi-tier AWS Infrastructure", duration: 90, type: "lab" },
          { id: "t8", title: "Final Assessment", duration: 20, type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "course_ansible_001",
    slug: "ansible-automation",
    title: "Ansible Configuration Management",
    shortDescription: "Automate infrastructure configuration, application deployment, and orchestration with Ansible.",
    description: "Complete Ansible course from playbook basics to enterprise-scale automation with roles, Ansible Tower, dynamic inventories, and security automation.",
    category: "Configuration Management",
    level: "intermediate",
    price: 1999,
    isPro: true,
    isFeatured: false,
    rating: 4.7,
    totalRatings: 1440,
    totalStudents: 9800,
    totalLessons: 40,
    durationHours: 14,
    instructor: "Jatin Sharma",
    instructorTitle: "Red Hat Certified Specialist",
    thumbnail: "",
    icon: React.createElement(SiAnsible),
    color: "from-red-700 to-red-500",
    tags: ["Ansible", "Automation", "Configuration Management"],
    whatYouLearn: [
      "Write YAML playbooks for automation",
      "Organize tasks into reusable roles",
      "Manage dynamic inventories",
      "Automate application deployments",
      "Harden servers with security playbooks",
    ],
    requirements: ["Linux fundamentals", "Basic YAML knowledge"],
    updatedAt: "2026-07-28",
    sections: [
      {
        id: "sec_ans_01",
        title: "Ansible Fundamentals",
        lessons: [
          { id: "a1", title: "Ansible Architecture & Ad-hoc Commands", duration: 18, type: "video", preview: true },
          { id: "a2", title: "Playbooks and YAML Basics", duration: 25, type: "video" },
          { id: "a3", title: "Inventory Management", duration: 20, type: "video" },
          { id: "a4", title: "Quiz: Ansible Basics", duration: 10, type: "quiz" },
        ],
      },
      {
        id: "sec_ans_02",
        title: "Advanced Automation",
        lessons: [
          { id: "a5", title: "Roles and Galaxy", duration: 28, type: "video" },
          { id: "a6", title: "Templates with Jinja2", duration: 22, type: "video" },
          { id: "a7", title: "Lab: Deploy LAMP Stack", duration: 60, type: "lab" },
          { id: "a8", title: "Final Assessment", duration: 15, type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "course_aws_001",
    slug: "aws-devops-engineer",
    title: "AWS for DevOps Engineers",
    shortDescription: "Master AWS services for DevOps: EC2, EKS, RDS, VPC, IAM, CodePipeline, CloudFormation, and more.",
    description: "Prepare for the AWS DevOps Engineer Professional certification while building production-grade infrastructure. Covers VPC architecture, EKS, CodePipeline, CloudFormation, and cost optimization.",
    category: "Cloud",
    level: "advanced",
    price: 3499,
    isPro: true,
    isFeatured: true,
    rating: 4.9,
    totalRatings: 3840,
    totalStudents: 28600,
    totalLessons: 68,
    durationHours: 22,
    instructor: "Jatin Sharma",
    instructorTitle: "AWS Solutions Architect Professional",
    thumbnail: "",
    icon: React.createElement(Cloud, { size: 24 }),
    color: "from-amber-500 to-orange-600",
    tags: ["AWS", "Cloud", "EKS", "Lambda", "DevOps"],
    whatYouLearn: [
      "Design multi-AZ, highly available architectures",
      "Configure VPC, subnets, security groups",
      "Deploy containerized apps on EKS",
      "Build CI/CD with CodePipeline and CodeBuild",
      "Implement IAM least-privilege security",
      "Optimize AWS costs with Reserved Instances",
    ],
    requirements: ["Linux basics", "Networking fundamentals", "Any cloud provider experience"],
    updatedAt: "2026-08-15",
    sections: [
      {
        id: "sec_aws_01",
        title: "AWS Core Services",
        lessons: [
          { id: "aw1", title: "VPC Design & Networking", duration: 30, type: "video", preview: true },
          { id: "aw2", title: "EC2, Auto Scaling & ALB", duration: 35, type: "video" },
          { id: "aw3", title: "IAM Policies & Roles Deep Dive", duration: 28, type: "video" },
          { id: "aw4", title: "Quiz: AWS Core", duration: 15, type: "quiz" },
        ],
      },
      {
        id: "sec_aws_02",
        title: "Container & Serverless",
        lessons: [
          { id: "aw5", title: "EKS Cluster Setup & Management", duration: 40, type: "video" },
          { id: "aw6", title: "Lambda & Serverless Architecture", duration: 35, type: "video" },
          { id: "aw7", title: "CodePipeline CI/CD", duration: 40, type: "video" },
          { id: "aw8", title: "Lab: Production EKS Deployment", duration: 90, type: "lab" },
          { id: "aw9", title: "AWS DevOps Assessment", duration: 30, type: "quiz" },
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
];

export const getCourseBySlug = (slug: string) =>
  COURSES.find((c) => c.slug === slug);
