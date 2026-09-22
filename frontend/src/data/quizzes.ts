export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseSlug: string;
  title: string;
  timeLimitMinutes: number;
  passingScore: number;
  questions: QuizQuestion[];
}

export const QUIZZES: Quiz[] = [
  {
    id: "quiz_linux_001",
    courseSlug: "linux-fundamentals",
    title: "Linux Fundamentals Assessment",
    timeLimitMinutes: 15,
    passingScore: 70,
    questions: [
      {
        id: "q1",
        question: "Which command displays the current working directory in Linux?",
        options: [
          { id: "a", text: "ls" },
          { id: "b", text: "pwd" },
          { id: "c", text: "cd" },
          { id: "d", text: "dir" },
        ],
        correctAnswer: "b",
        explanation: "`pwd` (Print Working Directory) displays the full path of the current directory.",
      },
      {
        id: "q2",
        question: "What does the permission '755' mean in Linux?",
        options: [
          { id: "a", text: "Owner: rwx, Group: r-x, Others: r-x" },
          { id: "b", text: "Owner: rw-, Group: rw-, Others: r--" },
          { id: "c", text: "Owner: rwx, Group: rwx, Others: rwx" },
          { id: "d", text: "Owner: rw-, Group: r-x, Others: r-x" },
        ],
        correctAnswer: "a",
        explanation: "755 = 7(rwx) for owner, 5(r-x) for group, 5(r-x) for others.",
      },
      {
        id: "q3",
        question: "Which file contains the list of all users on a Linux system?",
        options: [
          { id: "a", text: "/etc/shadow" },
          { id: "b", text: "/etc/group" },
          { id: "c", text: "/etc/passwd" },
          { id: "d", text: "/etc/users" },
        ],
        correctAnswer: "c",
        explanation: "/etc/passwd contains basic user account information on Linux.",
      },
      {
        id: "q4",
        question: "What command would you use to find all .log files under /var?",
        options: [
          { id: "a", text: "locate /var/*.log" },
          { id: "b", text: "find /var -name '*.log'" },
          { id: "c", text: "grep -r .log /var" },
          { id: "d", text: "ls -R /var | grep .log" },
        ],
        correctAnswer: "b",
        explanation: "`find` with `-name` pattern is the correct way to search for files recursively.",
      },
      {
        id: "q5",
        question: "What does 'systemctl enable nginx' do?",
        options: [
          { id: "a", text: "Starts nginx immediately" },
          { id: "b", text: "Installs nginx" },
          { id: "c", text: "Configures nginx to start at boot" },
          { id: "d", text: "Reloads nginx configuration" },
        ],
        correctAnswer: "c",
        explanation: "`enable` creates symlinks so the service starts automatically on system boot.",
      },
      {
        id: "q6",
        question: "Which command shows real-time CPU and memory usage of processes?",
        options: [
          { id: "a", text: "ps aux" },
          { id: "b", text: "top" },
          { id: "c", text: "df -h" },
          { id: "d", text: "free -m" },
        ],
        correctAnswer: "b",
        explanation: "`top` displays real-time dynamic view of running processes and resource usage.",
      },
      {
        id: "q7",
        question: "What is the purpose of the /proc filesystem in Linux?",
        options: [
          { id: "a", text: "Stores program executables" },
          { id: "b", text: "Contains user home directories" },
          { id: "c", text: "Virtual filesystem exposing kernel and process info" },
          { id: "d", text: "Stores system configuration files" },
        ],
        correctAnswer: "c",
        explanation: "/proc is a virtual filesystem that exposes kernel and process information as files.",
      },
      {
        id: "q8",
        question: "How do you make a script executable in Linux?",
        options: [
          { id: "a", text: "chown +x script.sh" },
          { id: "b", text: "chmod +x script.sh" },
          { id: "c", text: "exec script.sh" },
          { id: "d", text: "run script.sh" },
        ],
        correctAnswer: "b",
        explanation: "`chmod +x` adds the execute permission to the file.",
      },
      {
        id: "q9",
        question: "Which cron expression runs a job every day at midnight?",
        options: [
          { id: "a", text: "* * * * *" },
          { id: "b", text: "0 0 * * *" },
          { id: "c", text: "0 * * * *" },
          { id: "d", text: "* 0 * * *" },
        ],
        correctAnswer: "b",
        explanation: "0 0 * * * = minute 0, hour 0, any day, any month, any weekday = midnight daily.",
      },
      {
        id: "q10",
        question: "What does 'grep -r \"error\" /var/log' do?",
        options: [
          { id: "a", text: "Shows file sizes in /var/log" },
          { id: "b", text: "Recursively searches for 'error' in all files under /var/log" },
          { id: "c", text: "Replaces 'error' with blank in log files" },
          { id: "d", text: "Counts occurrences of 'error' in /var/log" },
        ],
        correctAnswer: "b",
        explanation: "`grep -r` (recursive) searches through all files and subdirectories.",
      },
    ],
  },
  {
    id: "quiz_docker_001",
    courseSlug: "docker-mastery",
    title: "Docker & Containers Quiz",
    timeLimitMinutes: 15,
    passingScore: 70,
    questions: [
      {
        id: "dq1",
        question: "What is the difference between a Docker image and a Docker container?",
        options: [
          { id: "a", text: "They are the same thing" },
          { id: "b", text: "An image is a running instance; a container is a template" },
          { id: "c", text: "An image is a read-only template; a container is a running instance" },
          { id: "d", text: "Containers cannot be created from images" },
        ],
        correctAnswer: "c",
        explanation: "Images are immutable templates used to create containers. Containers are running instances of images.",
      },
      {
        id: "dq2",
        question: "Which Dockerfile instruction sets environment variables at runtime?",
        options: [
          { id: "a", text: "ARG" },
          { id: "b", text: "ENV" },
          { id: "c", text: "SET" },
          { id: "d", text: "EXPORT" },
        ],
        correctAnswer: "b",
        explanation: "ENV sets environment variables that persist into the running container. ARG is only available during build.",
      },
      {
        id: "dq3",
        question: "What does 'docker run -d -p 8080:80 nginx' do?",
        options: [
          { id: "a", text: "Runs nginx and maps container port 8080 to host port 80" },
          { id: "b", text: "Runs nginx in detached mode mapping host port 8080 to container port 80" },
          { id: "c", text: "Builds an nginx image" },
          { id: "d", text: "Stops nginx on port 8080" },
        ],
        correctAnswer: "b",
        explanation: "-d is detached (background), -p host:container maps ports. So host:8080 → container:80.",
      },
      {
        id: "dq4",
        question: "What is the purpose of a .dockerignore file?",
        options: [
          { id: "a", text: "Lists containers to ignore when starting" },
          { id: "b", text: "Excludes files from being sent to the Docker build context" },
          { id: "c", text: "Ignores Docker daemon errors" },
          { id: "d", text: "Lists images to never pull" },
        ],
        correctAnswer: "b",
        explanation: ".dockerignore excludes files from the build context, reducing image size and build time.",
      },
      {
        id: "dq5",
        question: "Which Docker network driver allows containers on different hosts to communicate?",
        options: [
          { id: "a", text: "bridge" },
          { id: "b", text: "host" },
          { id: "c", text: "none" },
          { id: "d", text: "overlay" },
        ],
        correctAnswer: "d",
        explanation: "Overlay networks span multiple Docker hosts and are used in Docker Swarm and production clusters.",
      },
      {
        id: "dq6",
        question: "What is the benefit of multi-stage Docker builds?",
        options: [
          { id: "a", text: "Faster container start time" },
          { id: "b", text: "Produces smaller final images by discarding build dependencies" },
          { id: "c", text: "Allows multiple containers from one build" },
          { id: "d", text: "Enables parallel builds" },
        ],
        correctAnswer: "b",
        explanation: "Multi-stage builds copy only needed artifacts to the final stage, excluding compilers and SDKs.",
      },
      {
        id: "dq7",
        question: "How do you view the logs of a running container named 'api'?",
        options: [
          { id: "a", text: "docker inspect api" },
          { id: "b", text: "docker logs api" },
          { id: "c", text: "docker events api" },
          { id: "d", text: "docker status api" },
        ],
        correctAnswer: "b",
        explanation: "`docker logs <container_name>` fetches logs from the container's stdout/stderr.",
      },
      {
        id: "dq8",
        question: "What happens to container data when a container is deleted without a volume?",
        options: [
          { id: "a", text: "Data is backed up automatically" },
          { id: "b", text: "Data persists in the image" },
          { id: "c", text: "Data is permanently lost" },
          { id: "d", text: "Data moves to another container" },
        ],
        correctAnswer: "c",
        explanation: "Without volumes, container data is stored in the container's writable layer and is deleted with the container.",
      },
    ],
  },
  {
    id: "quiz_k8s_001",
    courseSlug: "kubernetes-in-action",
    title: "Kubernetes Mastery Quiz",
    timeLimitMinutes: 20,
    passingScore: 75,
    questions: [
      {
        id: "kq1",
        question: "What is etcd's role in a Kubernetes cluster?",
        options: [
          { id: "a", text: "Container runtime for running pods" },
          { id: "b", text: "Distributed key-value store that holds all cluster state" },
          { id: "c", text: "Load balancer for distributing traffic" },
          { id: "d", text: "Image registry for container images" },
        ],
        correctAnswer: "b",
        explanation: "etcd is the consistent, highly-available key-value store used as K8s' backing store for all cluster data.",
      },
      {
        id: "kq2",
        question: "What is the difference between a Deployment and a StatefulSet?",
        options: [
          { id: "a", text: "Deployments support more replicas" },
          { id: "b", text: "StatefulSets provide stable network identities and persistent storage per pod" },
          { id: "c", text: "StatefulSets are for stateless applications" },
          { id: "d", text: "There is no difference" },
        ],
        correctAnswer: "b",
        explanation: "StatefulSets give pods unique, stable names (pod-0, pod-1) and dedicated PVCs, ideal for databases.",
      },
      {
        id: "kq3",
        question: "What is a Kubernetes Namespace used for?",
        options: [
          { id: "a", text: "Defining network policies" },
          { id: "b", text: "Creating virtual clusters for resource isolation and multi-tenancy" },
          { id: "c", text: "Storing container images" },
          { id: "d", text: "Managing node resources" },
        ],
        correctAnswer: "b",
        explanation: "Namespaces provide scope for names and allow resource quotas and RBAC per team or environment.",
      },
      {
        id: "kq4",
        question: "Which kubectl command shows the rollout history of a deployment?",
        options: [
          { id: "a", text: "kubectl get history deployment/app" },
          { id: "b", text: "kubectl rollout status deployment/app" },
          { id: "c", text: "kubectl rollout history deployment/app" },
          { id: "d", text: "kubectl describe rollout deployment/app" },
        ],
        correctAnswer: "c",
        explanation: "`kubectl rollout history` shows revision history for Deployments.",
      },
      {
        id: "kq5",
        question: "What is the purpose of a Kubernetes Ingress resource?",
        options: [
          { id: "a", text: "Exposes pods directly to the internet" },
          { id: "b", text: "Manages external HTTP/HTTPS routing rules to internal services" },
          { id: "c", text: "Controls pod-to-pod communication" },
          { id: "d", text: "Allocates persistent storage to pods" },
        ],
        correctAnswer: "b",
        explanation: "Ingress provides HTTP/HTTPS routing rules, SSL termination, and load balancing to backend Services.",
      },
      {
        id: "kq6",
        question: "How does Kubernetes implement Service discovery?",
        options: [
          { id: "a", text: "Through external DNS servers only" },
          { id: "b", text: "Via ClusterDNS (CoreDNS) that resolves service names within the cluster" },
          { id: "c", text: "Using IP tables only" },
          { id: "d", text: "Services must be discovered manually" },
        ],
        correctAnswer: "b",
        explanation: "CoreDNS running inside the cluster resolves <service>.<namespace>.svc.cluster.local to ClusterIPs.",
      },
    ],
  },
  {
    id: "quiz_networking_001",
    courseSlug: "networking-for-devops",
    title: "Networking for DevOps & Cloud Assessment",
    timeLimitMinutes: 20,
    passingScore: 70,
    questions: [
      {
        id: "nq1",
        question: "In an AWS VPC subnet with CIDR block 10.0.1.0/28, how many usable IP addresses are available for EC2 instances or container ENIs?",
        options: [
          { id: "a", text: "16" },
          { id: "b", text: "14" },
          { id: "c", text: "11" },
          { id: "d", text: "13" },
        ],
        correctAnswer: "c",
        explanation: "A /28 block has 2^(32-28) = 16 total IP addresses. Standard IPv4 subtracts 2 (network and broadcast), but AWS VPC reserves 5 addresses (.0 network, .1 VPC router, .2 DNS, .3 future use, and .15 broadcast), leaving exactly 11 usable IPs.",
      },
      {
        id: "nq2",
        question: "Why does a Kubernetes pod by default make up to 5 iterative DNS queries when resolving an external address like api.stripe.com?",
        options: [
          { id: "a", text: "Due to ndots:5 configured in pod /etc/resolv.conf, querying local search domains first" },
          { id: "b", text: "CoreDNS requires 5 quorum votes across replica pods before responding" },
          { id: "c", text: "TCP requires 5 packet retries over UDP" },
          { id: "d", text: "Because kube-proxy drops the first 4 UDP packets" },
        ],
        correctAnswer: "a",
        explanation: "Kubernetes defaults pods to `ndots:5`. Any domain with fewer than 5 dots (e.g. `api.stripe.com` has 2 dots) will first append all cluster search domains (`namespace.svc.cluster.local`, `svc.cluster.local`, `cluster.local`, etc.) before querying root.",
      },
      {
        id: "nq3",
        question: "Which Linux command displays active TCP listening ports along with their associated Process Name and PID without resolving hostnames?",
        options: [
          { id: "a", text: "netstat -r" },
          { id: "b", text: "ss -tulnp" },
          { id: "c", text: "ip route show" },
          { id: "d", text: "dig -x 127.0.0.1" },
        ],
        correctAnswer: "b",
        explanation: "`ss -tulnp` stands for: -t (TCP), -u (UDP), -l (Listening), -n (Numeric, no DNS resolution), -p (Show process PID and program name).",
      },
      {
        id: "nq4",
        question: "What is the key functional difference between AWS Security Groups and Network ACLs (NACLs)?",
        options: [
          { id: "a", text: "Security Groups are stateless at subnet level; NACLs are stateful at instance level" },
          { id: "b", text: "Security Groups are stateful at ENI/instance level; NACLs are stateless at subnet level" },
          { id: "c", text: "Security Groups only support outbound rules; NACLs only support inbound rules" },
          { id: "d", text: "There is no functional difference; they are interchangeable" },
        ],
        correctAnswer: "b",
        explanation: "Security Groups are stateful (inbound traffic automatically allows return outbound traffic regardless of rules) and apply to instance/ENI interfaces. NACLs are stateless and apply at the subnet boundary, requiring explicit rules in both directions including ephemeral return ports.",
      },
      {
        id: "nq5",
        question: "What socket state indicates that a local endpoint has closed a TCP connection and is waiting for twice the Maximum Segment Lifetime (2MSL) to ensure delayed packets expire?",
        options: [
          { id: "a", text: "SYN_RECEIVED" },
          { id: "b", text: "CLOSE_WAIT" },
          { id: "c", text: "TIME_WAIT" },
          { id: "d", text: "ESTABLISHED" },
        ],
        correctAnswer: "c",
        explanation: "`TIME_WAIT` is maintained by the side that initiated active close to ensure the remote end received the final ACK and to prevent old duplicate packets from interfering with new connections.",
      },
      {
        id: "nq6",
        question: "How does next-generation Cilium CNI route Kubernetes Service traffic compared to legacy kube-proxy?",
        options: [
          { id: "a", text: "Using eBPF programs attached to kernel socket and tc hooks, bypassing iptables chains" },
          { id: "b", text: "By spawning dedicated sidecar proxies in every pod" },
          { id: "c", text: "By routing all traffic through the API server" },
          { id: "d", text: "By modifying DNS records every 100 milliseconds" },
        ],
        correctAnswer: "a",
        explanation: "Cilium uses eBPF (Extended Berkeley Packet Filter) to process packets directly in the Linux kernel at socket and TC layers with O(1) hash map lookups, bypassing thousands of sequential iptables rules.",
      },
      {
        id: "nq7",
        question: "Which tcpdump flag captures raw packet payloads in both ASCII and Hex format for debugging application protocols?",
        options: [
          { id: "a", text: "-X (or -XX)" },
          { id: "b", text: "-v" },
          { id: "c", text: "-q" },
          { id: "d", text: "-n" },
        ],
        correctAnswer: "a",
        explanation: "`-X` prints data of each packet in both hex and ASCII format (excluding link level header), and `-XX` includes the link level header.",
      },
    ],
  },
  {
    id: "quiz_git_001",
    courseSlug: "git-github-mastery",
    title: "Git & GitHub Mastery Quiz",
    timeLimitMinutes: 15,
    passingScore: 70,
    questions: [
      {
        id: "gq1",
        question: "What is the primary difference between 'git merge' and 'git rebase'?",
        options: [
          { id: "a", text: "Merge is only used for remote branches; rebase is local" },
          { id: "b", text: "Merge preserves history with a merge commit; rebase rewrites commits linearly onto the base branch" },
          { id: "c", text: "Rebase creates a new commit; merge modifies existing commits" },
          { id: "d", text: "Merge loses commit messages while rebase keeps them" },
        ],
        correctAnswer: "b",
        explanation: "Merge creates a join commit preserving original branches, while rebase replays your commits one by one on top of the target branch for a clean, linear history.",
      },
      {
        id: "gq2",
        question: "Which command safely reverts an erroneous pushed commit by creating a new commit with the inverse changes?",
        options: [
          { id: "a", text: "git reset --hard HEAD~1" },
          { id: "b", text: "git revert <commit-hash>" },
          { id: "c", text: "git checkout --force" },
          { id: "d", text: "git cherry-pick -n" },
        ],
        correctAnswer: "b",
        explanation: "`git revert` creates a new commit that undoes the specified commit's changes without rewriting history, making it safe for shared branches.",
      },
      {
        id: "gq3",
        question: "What does 'git cherry-pick <commit-hash>' do?",
        options: [
          { id: "a", text: "Deletes a commit from history" },
          { id: "b", text: "Applies the changes from an existing commit from another branch onto your current branch" },
          { id: "c", text: "Finds bugs using binary search" },
          { id: "d", text: "Squashes all branch commits into one" },
        ],
        correctAnswer: "b",
        explanation: "`git cherry-pick` selects a specific commit from any branch and applies its patch onto the currently checked-out branch.",
      },
      {
        id: "gq4",
        question: "What is the purpose of Git hooks located in `.git/hooks`?",
        options: [
          { id: "a", text: "To store credentials securely" },
          { id: "b", text: "To execute custom scripts before or after Git events like commit, push, and rebase" },
          { id: "c", text: "To compress Git database objects" },
          { id: "d", text: "To mirror repositories to backups" },
        ],
        correctAnswer: "b",
        explanation: "Git hooks are client-side or server-side scripts triggered by events like pre-commit, commit-msg, or pre-push for linting, testing, and validation.",
      }
    ],
  },
  {
    id: "quiz_cicd_001",
    courseSlug: "jenkins-cicd-pipelines",
    title: "Jenkins & CI/CD Pipelines Assessment",
    timeLimitMinutes: 15,
    passingScore: 70,
    questions: [
      {
        id: "cq1",
        question: "What is the key difference between Continuous Delivery and Continuous Deployment?",
        options: [
          { id: "a", text: "Continuous Delivery requires automated testing, Continuous Deployment does not" },
          { id: "b", text: "Continuous Delivery stops before production for manual approval; Continuous Deployment deploys to production automatically" },
          { id: "c", text: "Continuous Deployment is only for Docker containers" },
          { id: "d", text: "Continuous Delivery is used exclusively with Jenkins" },
        ],
        correctAnswer: "b",
        explanation: "Continuous Delivery automates build and test stages up to production-ready artifacts awaiting manual release; Continuous Deployment automatically releases passing changes directly to production without human intervention.",
      },
      {
        id: "cq2",
        question: "In a GitHub Actions workflow YAML file, how do you specify that a job depends on the successful completion of another job?",
        options: [
          { id: "a", text: "depends_on: [build]" },
          { id: "b", text: "needs: build" },
          { id: "c", text: "after: build" },
          { id: "d", text: "require: build" },
        ],
        correctAnswer: "b",
        explanation: "The `needs` keyword defines dependencies between jobs in GitHub Actions, ensuring dependent jobs run sequentially after the specified jobs succeed.",
      },
      {
        id: "cq3",
        question: "In Jenkins Declarative Pipelines, what block defines actions that run conditionally after all stages execute (e.g. always, success, failure)?",
        options: [
          { id: "a", text: "cleanup" },
          { id: "b", text: "post" },
          { id: "c", text: "finally" },
          { id: "d", text: "after" },
        ],
        correctAnswer: "b",
        explanation: "The `post` section in a Declarative Jenkinsfile defines steps that run based on the completion status of the pipeline (always, success, failure, aborted, unstable).",
      }
    ],
  },
  {
    id: "quiz_terraform_001",
    courseSlug: "terraform-infrastructure-as-code",
    title: "Terraform & IaC Assessment",
    timeLimitMinutes: 20,
    passingScore: 70,
    questions: [
      {
        id: "tq1",
        question: "What is the primary function of the `terraform.tfstate` file?",
        options: [
          { id: "a", text: "To store Terraform plugin binaries" },
          { id: "b", text: "To map your real-world cloud resources to your configuration and track metadata" },
          { id: "c", text: "To store encrypted AWS credentials" },
          { id: "d", text: "To generate architecture diagrams" },
        ],
        correctAnswer: "b",
        explanation: "The state file records the mapping between declared configuration resources and real-world provisioned cloud infrastructure, tracking attributes and dependencies.",
      },
      {
        id: "tq2",
        question: "Why should you use an S3 backend with DynamoDB state locking in team environments?",
        options: [
          { id: "a", text: "To make Terraform CLI faster" },
          { id: "b", text: "To prevent concurrent Terraform runs from corrupting the remote state file" },
          { id: "c", text: "To automatically convert HCL to JSON" },
          { id: "d", text: "It is required to run terraform apply" },
        ],
        correctAnswer: "b",
        explanation: "DynamoDB table locking prevents multiple engineers or CI pipelines from modifying the same Terraform state concurrently, avoiding state file corruption and race conditions.",
      },
      {
        id: "tq3",
        question: "What command creates an execution plan and lets you preview changes before applying them?",
        options: [
          { id: "a", text: "terraform init" },
          { id: "b", text: "terraform plan" },
          { id: "c", text: "terraform validate" },
          { id: "d", text: "terraform refresh" },
        ],
        correctAnswer: "b",
        explanation: "`terraform plan` compares the current state with your code and cloud provider APIs, printing a detailed diff (+ create, ~ modify, - destroy).",
      }
    ],
  },
  {
    id: "quiz_ansible_001",
    courseSlug: "ansible-automation",
    title: "Ansible Configuration Management Quiz",
    timeLimitMinutes: 15,
    passingScore: 70,
    questions: [
      {
        id: "aq1",
        question: "What makes Ansible 'agentless' compared to tools like Chef or Puppet?",
        options: [
          { id: "a", text: "Ansible does not support configuration management" },
          { id: "b", text: "Ansible communicates over standard SSH / WinRM without requiring a background daemon installed on managed nodes" },
          { id: "c", text: "Ansible only runs in Docker containers" },
          { id: "d", text: "Ansible requires cloud vendor APIs exclusively" },
        ],
        correctAnswer: "b",
        explanation: "Ansible executes Python modules over SSH (or WinRM for Windows) and cleans up afterwards, eliminating the need to install or maintain agent software on target servers.",
      },
      {
        id: "aq2",
        question: "What does the concept of 'idempotency' mean in Ansible modules?",
        options: [
          { id: "a", text: "Running a playbook multiple times produces the exact same desired end state without unintended side effects" },
          { id: "b", text: "Playbooks execute in parallel across all hosts" },
          { id: "c", text: "Ansible automatically reboots servers when finished" },
          { id: "d", text: "Variables are encrypted with Ansible Vault" },
        ],
        correctAnswer: "a",
        explanation: "An idempotent operation only makes changes if the target state does not match the desired state. If already configured, running it again changes nothing (status: ok).",
      }
    ],
  },
  {
    id: "quiz_aws_001",
    courseSlug: "aws-devops-engineer",
    title: "AWS DevOps Engineer Assessment",
    timeLimitMinutes: 20,
    passingScore: 75,
    questions: [
      {
        id: "aw1",
        question: "Which AWS service is a fully managed container orchestration service compatible with Kubernetes?",
        options: [
          { id: "a", text: "AWS ECS" },
          { id: "b", text: "AWS EKS" },
          { id: "c", text: "AWS Fargate" },
          { id: "d", text: "AWS App Runner" },
        ],
        correctAnswer: "b",
        explanation: "Amazon Elastic Kubernetes Service (EKS) is a certified Kubernetes conformant managed service for running K8s on AWS.",
      },
      {
        id: "aw2",
        question: "What is the purpose of an AWS IAM Instance Profile attached to an EC2 instance?",
        options: [
          { id: "a", text: "To configure instance CPU and RAM allocation" },
          { id: "b", text: "To securely pass temporary IAM role credentials to applications running on the instance without hardcoding keys" },
          { id: "c", text: "To set firewall rules" },
          { id: "d", text: "To speed up instance boot time" },
        ],
        correctAnswer: "b",
        explanation: "An IAM Instance Profile allows EC2 instances to assume an IAM Role and receive automatically rotated temporary credentials via the instance metadata service (IMDS).",
      }
    ],
  }
];

export const getQuizByCourseSlug = (slug: string) =>
  QUIZZES.find((q) => q.courseSlug === slug);
