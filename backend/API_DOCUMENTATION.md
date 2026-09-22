# DevOps Academy Backend API Documentation

Welcome to the **DevOps Academy Backend REST API Specification**. This document outlines all available endpoints, required authentication headers, request payloads, response schemas, and the specific PostgreSQL database tables queried and updated by each endpoint.

---

## 📑 Table of Contents

1. [Architecture & Global Standards](#-architecture--global-standards)
2. [Authentication & Profile API (`/api/auth`)](#-1-authentication--profile-api-apiauth)
3. [Courses API (`/api/courses`)](#-2-courses-api-apicourses)
4. [Lessons & Modules API (`/api/courses/:courseId/lessons`)](#-3-lessons--modules-api-apicoursescourseidlessons)
5. [Enrollments & Progress API (`/api/enrollments`)](#-4-enrollments--progress-api-apienrollments)
6. [Daily Learning Tracker API (`/api/tracker`)](#-5-daily-learning-tracker-api-apitracker)
7. [Contact & Feedback API (`/api/contact`)](#-6-contact--feedback-api-apicontact)
8. [Admin Analytics & Alerts API (`/api/admin`)](#-7-admin-analytics--alerts-api-apiadmin)
9. [User Administration API (`/api/users`)](#-8-user-administration-api-apiusers)

---

## 🏗️ Architecture & Global Standards

- **Base URL:** `http://localhost:5000/api`
- **Content-Type:** `application/json` (except multipart file uploads)
- **Authentication:** JSON Web Tokens (JWT) passed via standard HTTP Authorization header:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- **Standard Success Response Envelope:**
  ```json
  {
    "success": true,
    "data": {},
    "message": "Operation completed successfully"
  }
  ```
- **Standard Error Response Envelope:**
  ```json
  {
    "success": false,
    "message": "Descriptive error message",
    "error": "Internal details (development mode only)"
  }
  ```

---

## 🔐 1. Authentication & Profile API (`/api/auth`)

### 1.1 Register User Account
Creates a new student or instructor profile with password hashing (bcrypt).

- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Database Tables:** `users`

#### Request Example:
```json
POST /api/auth/register
Content-Type: application/json

{
  "username": "alex_devops",
  "email": "alex.devops@example.com",
  "password": "SecurePassword123!"
}
```

#### Response Example (201 Created):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "username": "alex_devops",
    "email": "alex.devops@example.com",
    "role": "user",
    "created_at": "2026-09-22T09:15:00.000Z"
  }
}
```

---

### 1.2 User Login
Authenticates an existing user and returns a signed JWT.

- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Database Tables:** `users`

#### Request Example:
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "alex.devops@example.com",
  "password": "SecurePassword123!"
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "username": "alex_devops",
    "email": "alex.devops@example.com",
    "role": "user"
  }
}
```

---

### 1.3 Get Current User Session
Fetches the active authenticated user profile.

- **Endpoint:** `GET /api/auth/me`
- **Access:** Private (`protect`)
- **Database Tables:** `users`

#### Request Example:
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "user": {
    "id": 4,
    "username": "alex_devops",
    "email": "alex.devops@example.com",
    "role": "user",
    "created_at": "2026-09-22T09:15:00.000Z"
  }
}
```

---

### 1.4 Update User Profile
Updates account credentials, email, or username.

- **Endpoint:** `PUT /api/auth/profile`
- **Access:** Private (`protect`)
- **Database Tables:** `users`

#### Request Example:
```json
PUT /api/auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "username": "alex_cloud_ninja",
  "email": "alex.ninja@example.com",
  "password": "NewSuperPassword2026!"
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "user": {
    "id": 4,
    "username": "alex_cloud_ninja",
    "email": "alex.ninja@example.com",
    "role": "user"
  }
}
```

---

## 📚 2. Courses API (`/api/courses`)

### 2.1 List All Courses
Retrieves published DevOps courses with instructor details.

- **Endpoint:** `GET /api/courses`
- **Query Parameters:** `published=true` (optional)
- **Access:** Public
- **Database Tables:** `courses`, `users`

#### Response Example (200 OK):
```json
{
  "success": true,
  "count": 9,
  "data": [
    {
      "id": 1,
      "title": "Linux Fundamentals for DevOps",
      "slug": "linux-fundamentals",
      "short_description": "Master the Linux command line, file systems, and automation.",
      "category": "Linux",
      "level": "beginner",
      "price": "0.00",
      "is_pro": false,
      "is_published": true,
      "duration_hours": 16,
      "thumbnail": "https://images.unsplash.com/photo-1629654297299-c8506221ca97",
      "created_at": "2026-09-21T10:00:00.000Z"
    }
  ]
}
```

---

### 2.2 Get Course Details by Slug
Fetches complete course syllabus and curriculum lessons.

- **Endpoint:** `GET /api/courses/:slug`
- **Access:** Public
- **Database Tables:** `courses`, `lessons`, `users`

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 4,
    "title": "Kubernetes: From Zero to Production",
    "slug": "kubernetes-in-action",
    "category": "Kubernetes",
    "level": "intermediate",
    "price": "0.00",
    "duration_hours": 24,
    "lessons": [
      {
        "id": 31,
        "title": "Module 1: Kubernetes Architecture & Control Plane Internals",
        "slug": "k8s-architecture-control-plane",
        "duration_minutes": 50,
        "sort_order": 1,
        "video_url": "https://www.youtube.com/embed/X48VuDVv0do"
      }
    ]
  }
}
```

---

### 2.3 Create Course
Creates a new course track in the platform.

- **Endpoint:** `POST /api/courses`
- **Access:** Private (`protect`, `authorize('instructor', 'admin')`)
- **Database Tables:** `courses`

#### Request Example:
```json
POST /api/courses
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Observability with Prometheus, Grafana & OpenTelemetry",
  "slug": "prometheus-grafana-opentelemetry",
  "short_description": "Production metrics collection, PromQL, distributed tracing & alerting.",
  "category": "Monitoring",
  "level": "intermediate",
  "price": 0.00,
  "duration_hours": 18
}
```

#### Response Example (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 10,
    "title": "Observability with Prometheus, Grafana & OpenTelemetry",
    "slug": "prometheus-grafana-opentelemetry",
    "is_published": false,
    "created_at": "2026-09-22T10:00:00.000Z"
  }
}
```

---

## 📖 3. Lessons & Modules API (`/api/courses/:courseId/lessons`)

### 3.1 List Lessons for a Course
- **Endpoint:** `GET /api/courses/:courseId/lessons`
- **Access:** Public
- **Database Tables:** `lessons`

#### Response Example (200 OK):
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": 1,
      "course_id": 1,
      "title": "Module 1: Linux Architecture & Kernel Internals",
      "slug": "linux-architecture-kernel",
      "duration_minutes": 45,
      "sort_order": 1
    }
  ]
}
```

---

### 3.2 Add Lesson to Course
- **Endpoint:** `POST /api/courses/:courseId/lessons`
- **Access:** Private (`protect`, `authorize('instructor', 'admin')`)
- **Database Tables:** `lessons`

#### Request Example:
```json
POST /api/courses/1/lessons
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Module 16: Advanced eBPF & Kernel Profiling",
  "slug": "advanced-ebpf-kernel-profiling",
  "description": "Kernel tracepoints, kprobes, and bpftrace scripts.",
  "content": "### 📖 1. Theory\neBPF allows running sandboxed programs in the Linux kernel...",
  "video_url": "https://www.youtube.com/embed/sample",
  "duration_minutes": 60,
  "sort_order": 16
}
```

---

## 🎓 4. Enrollments & Progress API (`/api/enrollments`)

### 4.1 Enroll in a Course
- **Endpoint:** `POST /api/enrollments`
- **Access:** Private (`protect`)
- **Database Tables:** `enrollments`, `notifications`

#### Request Example:
```json
POST /api/enrollments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "courseId": 4
}
```

#### Response Example (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 12,
    "user_id": 4,
    "course_id": 4,
    "progress": 0,
    "completed": false,
    "enrolled_at": "2026-09-22T10:30:00.000Z"
  }
}
```

---

### 4.2 Mark Lesson Completed
Checks off a lesson, recalculates course completion percentage, and checks for certificate issuance.

- **Endpoint:** `POST /api/enrollments/lessons/complete`
- **Access:** Private (`protect`)
- **Database Tables:** `lesson_completions`, `enrollments`, `lessons`, `certificates`

#### Request Example:
```json
POST /api/enrollments/lessons/complete
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "courseId": 4,
  "lessonId": 31
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "completed": true,
  "progress": 5,
  "message": "Lesson marked as complete"
}
```

---

### 4.3 Verify Public Certificate
- **Endpoint:** `GET /api/enrollments/certificates/verify/:hash`
- **Access:** Public
- **Database Tables:** `certificates`, `users`, `courses`

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "certificate_hash": "a8f9c4e2b1d7f0e3...",
    "student_name": "Alex DevOps",
    "course_title": "Kubernetes: From Zero to Production",
    "issued_at": "2026-09-22T11:00:00.000Z",
    "verified": true
  }
}
```

---

## 📈 5. Daily Learning Tracker API (`/api/tracker`)

### 5.1 Get Tracker Dashboard Data
Fetches today's micro-goals, active streak metrics, and weekly velocity graph.

- **Endpoint:** `GET /api/tracker`
- **Query Parameters:** `date=YYYY-MM-DD` (optional, defaults to current date)
- **Access:** Private (`protect`)
- **Database Tables:** `learning_goals`, `user_streaks`, `daily_learning_activity`

#### Request Example:
```http
GET /api/tracker?date=2026-09-22
Authorization: Bearer <jwt_token>
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "date": "2026-09-22",
    "goals": [
      {
        "id": 101,
        "user_id": 4,
        "title": "Complete Kubernetes Pods & Deployments lab",
        "category": "Kubernetes",
        "completed": true,
        "target_date": "2026-09-22",
        "completed_at": "2026-09-22T10:45:00.000Z"
      }
    ],
    "stats": {
      "today": {
        "completedCount": 1,
        "totalCount": 1,
        "minutesLogged": 45
      },
      "weekly": {
        "consistencyPercent": 100,
        "activeDays": 5
      },
      "streak": {
        "currentStreak": 5,
        "longestStreak": 14,
        "totalDaysActive": 28
      }
    }
  }
}
```

---

### 5.2 Add Daily Micro-Goal
- **Endpoint:** `POST /api/tracker/goals`
- **Access:** Private (`protect`)
- **Database Tables:** `learning_goals`

#### Request Example:
```json
POST /api/tracker/goals
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Configure Prometheus alertmanager webhook",
  "category": "Monitoring",
  "targetDate": "2026-09-22"
}
```

---

### 5.3 Log Study Time
Logs study minutes, increments daily activity, and recalculates streak continuity.

- **Endpoint:** `POST /api/tracker/activity`
- **Access:** Private (`protect`)
- **Database Tables:** `daily_learning_activity`, `user_streaks`

#### Request Example:
```json
POST /api/tracker/activity
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "minutes": 30
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "minutes_spent": 75,
    "activity_date": "2026-09-22",
    "streak": {
      "currentStreak": 5,
      "longestStreak": 14
    }
  }
}
```

---

## ✉️ 6. Contact & Feedback API (`/api/contact`)

### 6.1 Submit Contact Inquiry
- **Endpoint:** `POST /api/contact`
- **Access:** Public
- **Database Tables:** `contact_messages`, `notifications`

#### Request Example:
```json
POST /api/contact
Content-Type: application/json

{
  "name": "Sarah Jenkins",
  "email": "sarah.j@enterprise.com",
  "subject": "Corporate DevOps Training Inquiry",
  "message": "We would like to onboard 40 engineers to the Kubernetes and Terraform masterclasses."
}
```

#### Response Example (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 15,
    "name": "Sarah Jenkins",
    "status": "unread",
    "created_at": "2026-09-22T11:20:00.000Z"
  },
  "message": "Message received! We will contact you soon."
}
```

---

## 🛡️ 7. Admin Analytics & Alerts API (`/api/admin`)

### 7.1 Get Dashboard Platform KPIs
- **Endpoint:** `GET /api/admin/stats`
- **Access:** Private (`protect`, `authorize('admin')`)
- **Database Tables:** `users`, `courses`, `enrollments`, `certificates`

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "totalUsers": 1420,
    "totalCourses": 9,
    "totalEnrollments": 4890,
    "totalCertificates": 340,
    "activeToday": 85
  }
}
```

---

### 7.2 Get Admin Notifications
- **Endpoint:** `GET /api/admin/notifications`
- **Query Parameters:** `unread=true` (optional)
- **Access:** Private (`protect`, `authorize('admin')`)
- **Database Tables:** `notifications`

#### Response Example (200 OK):
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 8,
      "title": "New Course Enrollment",
      "message": "alex_devops enrolled in Kubernetes: From Zero to Production",
      "type": "enrollment",
      "is_read": false,
      "created_at": "2026-09-22T10:30:00.000Z"
    }
  ]
}
```

---

## 👥 8. User Administration API (`/api/users`)

### 8.1 List All Users
- **Endpoint:** `GET /api/users`
- **Access:** Private (`protect`, `authorize('admin')`)
- **Database Tables:** `users`

### 8.2 Change User Role
- **Endpoint:** `PUT /api/users/:id/role`
- **Access:** Private (`protect`, `authorize('admin')`)
- **Database Tables:** `users`

#### Request Example:
```json
PUT /api/users/4/role
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "role": "instructor"
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 4,
    "username": "alex_devops",
    "role": "instructor"
  },
  "message": "User role updated successfully"
}
```

---

## 🗄️ Database Tables Summary Matrix

| Table Name | Primary Purpose | Primary Endpoints Touching Table |
| :--- | :--- | :--- |
| **`users`** | Account credentials, emails, and roles | `/api/auth/*`, `/api/users/*` |
| **`courses`** | Course metadata, pricing, and instructors | `/api/courses/*`, `/api/admin/stats` |
| **`lessons`** | Modules, theory, commands, and video URLs | `/api/courses/:courseId/lessons/*` |
| **`enrollments`** | Student course registrations & progress | `/api/enrollments/*`, `/api/admin/stats` |
| **`lesson_completions`** | Individual module checkoffs per student | `/api/enrollments/lessons/*` |
| **`certificates`** | Cryptographic graduation credential hashes | `/api/enrollments/certificates/*` |
| **`learning_goals`** | Daily tracker tasks and micro-goals | `/api/tracker/goals/*` |
| **`user_streaks`** | Consecutive study days and streak records | `/api/tracker/*` |
| **`daily_learning_activity`** | Daily study minutes logged per student | `/api/tracker/activity` |
| **`contact_messages`** | User contact inquiries & messages | `/api/contact/*` |
| **`notifications`** | Admin broadcast and system alerts | `/api/admin/notifications/*` |
