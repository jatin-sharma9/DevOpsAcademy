export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorTitle: string;
  publishedAt: string;
  readTimeMinutes: number;
  viewCount: number;
  featured: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog_001",
    slug: "kubernetes-vs-docker-swarm",
    title: "Kubernetes vs Docker Swarm in 2026: Which Should You Choose?",
    excerpt: "A comprehensive comparison of the two most popular container orchestration platforms, with real-world production scenarios and recommendations.",
    content: `## Overview\n\nContainer orchestration has become critical for production deployments. Kubernetes dominates the market with 85%+ adoption, but Docker Swarm remains a simpler alternative for smaller teams.\n\n## Kubernetes Strengths\n\n- Rich ecosystem (Helm, Operators, service mesh)\n- Advanced scheduling and auto-scaling\n- Multi-cloud portability\n- Strong RBAC and security primitives\n\n## Docker Swarm Strengths\n\n- Simpler setup and learning curve\n- Built into Docker Engine (no extra install)\n- Faster to get running for small teams\n\n## Recommendation\n\nFor production workloads at scale: **Kubernetes**. For smaller teams or simple deployments: **Docker Swarm** or even just Docker Compose with a well-structured CI/CD pipeline.`,
    category: "Kubernetes",
    tags: ["Kubernetes", "Docker", "Container Orchestration", "DevOps"],
    author: "Jatin Sharma",
    authorTitle: "Senior DevOps Engineer",
    publishedAt: "2026-08-20",
    readTimeMinutes: 8,
    viewCount: 12840,
    featured: true,
  },
  {
    id: "blog_002",
    slug: "terraform-best-practices-2026",
    title: "10 Terraform Best Practices Every DevOps Engineer Must Know",
    excerpt: "From state management to module design, these proven patterns will level up your infrastructure-as-code game significantly.",
    content: `## 1. Always Use Remote State\n\nNever store state locally. Use S3 + DynamoDB for locking on AWS, or Terraform Cloud.\n\n## 2. Structure Modules Properly\n\nOne module per resource type. Avoid large monolithic modules.\n\n## 3. Use workspaces for Environments\n\nManage dev/staging/prod with Terraform workspaces or separate state files.\n\n## 4. Pin Provider Versions\n\nAlways pin provider versions to avoid breaking changes during init.\n\n## 5. Run Terraform fmt and validate in CI\n\nAdd terraform fmt -check and terraform validate to every pull request pipeline.`,
    category: "Terraform",
    tags: ["Terraform", "IaC", "Best Practices", "AWS"],
    author: "Jatin Sharma",
    authorTitle: "HashiCorp Certified",
    publishedAt: "2026-08-15",
    readTimeMinutes: 6,
    viewCount: 9320,
    featured: true,
  },
  {
    id: "blog_003",
    slug: "cicd-pipeline-design-patterns",
    title: "CI/CD Pipeline Design Patterns for Enterprise Teams",
    excerpt: "Learn how to design scalable, maintainable CI/CD pipelines that handle dozens of microservices and multiple deployment environments.",
    content: `## The Problem with Naive Pipelines\n\nMost teams start with a simple pipeline and then struggle to scale it across dozens of services and environments.\n\n## Patterns That Work\n\n### 1. Canonical Pipeline Template\nCreate a shared pipeline template that all repos inherit from.\n\n### 2. Environment Promotion Gates\nDeploy to dev automatically, staging on merge to main, production with manual approval.\n\n### 3. Artifact-based Deployment\nAlways deploy the exact same artifact (Docker image digest) through all environments.`,
    category: "CI/CD",
    tags: ["CI/CD", "Jenkins", "GitHub Actions", "DevOps"],
    author: "Jatin Sharma",
    authorTitle: "Senior DevOps Engineer",
    publishedAt: "2026-08-10",
    readTimeMinutes: 10,
    viewCount: 7840,
    featured: false,
  },
  {
    id: "blog_004",
    slug: "linux-performance-tuning",
    title: "Linux Performance Tuning: A Practical Guide for DevOps",
    excerpt: "Deep dive into kernel parameters, process management, memory optimization, and network tuning for production Linux servers.",
    content: `## CPU Optimization\n\nUse taskset to pin processes to specific CPUs. Set CPU scheduler with chrt for real-time processes.\n\n## Memory Tuning\n\nAdjust vm.swappiness. Configure transparent hugepages. Monitor with vmstat and /proc/meminfo.\n\n## Network Optimization\n\nTune TCP buffers (net.core.rmem_max, wmem_max). Enable TCP BBR congestion control. Use ethtool for NIC tuning.`,
    category: "Linux",
    tags: ["Linux", "Performance", "Kernel", "System Admin"],
    author: "Jatin Sharma",
    authorTitle: "Senior DevOps Engineer",
    publishedAt: "2026-08-05",
    readTimeMinutes: 12,
    viewCount: 5420,
    featured: false,
  },
  {
    id: "blog_005",
    slug: "aws-cost-optimization-strategies",
    title: "Slash Your AWS Bill: 15 Cost Optimization Strategies That Actually Work",
    excerpt: "Real-world AWS cost reduction strategies used by teams who cut their cloud bills by 40-60% without compromising performance.",
    content: `## Reserved Instances\n\nCommit 1-3 years for baseline workloads. Save 30-60% vs On-demand.\n\n## Spot Instances\n\nUse for non-critical, fault-tolerant workloads. Save 70-90%.\n\n## Right-sizing\n\nUse AWS Compute Optimizer. Most teams run instances 3x too large.\n\n## S3 Lifecycle Policies\n\nMove old objects to Glacier automatically. Massive savings for log archives.`,
    category: "AWS",
    tags: ["AWS", "Cost Optimization", "Cloud", "FinOps"],
    author: "Jatin Sharma",
    authorTitle: "AWS Solutions Architect",
    publishedAt: "2026-07-28",
    readTimeMinutes: 9,
    viewCount: 14200,
    featured: true,
  },
  {
    id: "blog_006",
    slug: "ansible-roles-best-practices",
    title: "Writing Clean Ansible Roles: Structure, Naming, and Testing",
    excerpt: "A practical guide to organizing Ansible roles for maintainability, with real examples from production automation projects.",
    content: `## Role Directory Structure\n\nFollow the standard: tasks/, handlers/, templates/, files/, vars/, defaults/, meta/\n\n## Naming Conventions\n\nUse lowercase with underscores. Be descriptive: nginx_install not nginx.\n\n## Testing with Molecule\n\nWrite Molecule tests for every role. Test on multiple OS distributions.`,
    category: "Ansible",
    tags: ["Ansible", "Automation", "DevOps", "Configuration"],
    author: "Jatin Sharma",
    authorTitle: "Red Hat Certified",
    publishedAt: "2026-07-20",
    readTimeMinutes: 7,
    viewCount: 4180,
    featured: false,
  },
];

export const getBlogBySlug = (slug: string) =>
  BLOG_POSTS.find((p) => p.slug === slug);
