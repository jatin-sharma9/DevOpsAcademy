# 🚀 DevOps Academy - Cloud & Platform Engineering LMS

A modern, production-grade DevOps Learning Management System built with a React/TypeScript frontend (Vite, TailwindCSS, Radix UI), a robust Node.js/Express backend API, and a PostgreSQL relational database.

---

## 📋 Features

- **Interactive Learning**: Curated courses covering Linux, Docker, Kubernetes, CI/CD, Terraform, Prometheus, and AWS.
- **Lesson Notes**: Private, user-isolated notes with autosave per lesson.
- **Interactive Quizzes**: Multiple-choice quizzes with instant grading, explanations, and attempt history tracking.
- **Course Reviews**: Star ratings and feedback with verified-enrollment enforcement and moderation.
- **Automated Certification**: Cryptographic certificate generation and verification upon 100% course completion.
- **Admin Dashboard**: Real-time platform analytics, user role administration, course management, audit logs, and email dispatch tracking.
- **Cloud-Ready Observability**: Prometheus `/api/metrics` scraping, healthcheck probes (`/api/health`, `/api/health/live`, `/api/health/ready`), and structured Winston logging.

---

## 🛠️ Tech Stack

| Tier | Technology | Description |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS | Single Page Application with client-side routing |
| **Backend** | Node.js 20, Express, Helmet, CORS, Morgan | REST API with JWT authentication & security hardening |
| **Database** | PostgreSQL 15 | Relational database with automated migrations |
| **Containers** | Docker, Docker Compose, Nginx | Multi-stage Alpine images, non-root execution |
| **Monitoring** | Prometheus, prom-client | Request metrics, pool metrics, event loop latency |
| **CI/CD** | GitHub Actions | Automated lint, migration, test matrix, build & image verify |

---

## 🚀 Quick Start (Local Docker Compose)

The easiest way to run the entire DevOps Academy platform is using Docker Compose:

### Prerequisites
- Docker Engine 24+ & Docker Compose v2+
- Git

### Run Stack

```bash
# 1. Clone repository
git clone https://github.com/jatin-sharma9/DevOpsAcademy.git
cd DevOpsAcademy

# 2. Copy environment template
cp .env.example .env

# 3. Start PostgreSQL, Backend, and Frontend containers
docker compose up -d --build

# 4. View status of all services
docker compose ps
```

### Access Platform
- **Frontend Web Application**: [http://localhost:5200](http://localhost:5200)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Diagnostic Probe**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Prometheus Metrics**: [http://localhost:5000/api/metrics](http://localhost:5000/api/metrics)

---

## 🔒 Production Docker Deployment

For production deployments with resource limits, one-off schema migration containers, and optional Prometheus/Grafana monitoring:

```bash
# 1. Create production environment file with secure secrets
cp .env.example .env.production
# Ensure JWT_SECRET is >= 32 characters and DB_PASSWORD is strong

# 2. Strict environment check
cd backend && npm run env:validate:strict && cd ..

# 3. Launch production stack
docker compose -f docker-compose.prod.yml --env-file .env.production up -d

# 4. (Optional) Launch with Prometheus & Grafana
docker compose -f docker-compose.prod.yml --env-file .env.production --profile monitoring up -d
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed cloud deployment guides, architecture diagrams, and AWS ECS/EKS deployment steps.

---

## 🧪 Testing & Verification

### Run Backend Tests (8 Test Suites)
```bash
cd backend
npm install
npm run test:all
```
Test suites include:
- `test:auth`: JWT registration, login, profile, password reset
- `test:email`: Transactional email dispatcher and audit logs
- `test:phase2`: Core lessons, enrollments, daily tracker, admin endpoints
- `test:fixes`: Critical fixes, streak calculations, review upserts
- `test:missing-apis`: Categories, quiz attempts, lesson notes, course reviews
- `test:monitoring`: Prometheus metrics exposition, health probes, audit logs
- `test:deployment`: Environment validator, Docker health probes
- `test:e2e`: Complete student & admin lifecycle, RBAC, user isolation

### Run Frontend Typecheck & Build
```bash
cd frontend
npm install
npm run typecheck
npm run build
```

### Validate Docker Compose Configurations
```bash
docker compose config
docker compose -f docker-compose.prod.yml config
```

---

## 📖 Documentation Links

- **API Documentation**: [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)
- **Production & Docker Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Prometheus & Observability**: [MONITORING.md](MONITORING.md)

---

## 📄 License
This project is open-source under the MIT License.
