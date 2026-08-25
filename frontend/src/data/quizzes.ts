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
];

export const getQuizByCourseSlug = (slug: string) =>
  QUIZZES.find((q) => q.courseSlug === slug);
