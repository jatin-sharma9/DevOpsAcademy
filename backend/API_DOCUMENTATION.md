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
10. [Email & Notification API (`/api/email`)](#-10-email--notification-api-apiemail)
11. [Quiz Attempts API (`/api/quizzes`)](#-11-quiz-attempts-api-apiquizzes)
12. [Lesson Notes API (`/api/lessons`)](#-12-lesson-notes-api-apilessons)
13. [Course Reviews API (`/api/courses/:courseId/reviews`)](#-13-course-reviews-api-apicoursescourseidreviews)
14. [Monitoring & Observability API (`/api/metrics`, `/api/admin/audit-logs`)](#-14-monitoring--observability-api)

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

## 📧 10. Email & Notification API (`/api/email`)

Provides diagnostic endpoints, status checks, and testing capabilities for the Nodemailer Gmail SMTP integration.

### 10.1 Get Email System Status
Returns the active SMTP provider, host, port, security mode, and verification status.

- **Endpoint:** `GET /api/email/status`
- **Access:** Public / Diagnostic
- **Database Tables:** None

#### Response Example (200 OK):
```json
{
  "success": true,
  "status": {
    "configured": true,
    "isMock": false,
    "provider": "Gmail",
    "host": "smtp.gmail.com",
    "port": 465,
    "secure": true,
    "user": "ja***@gmail.com",
    "adminEmail": "jatinsharma932002@gmail.com",
    "fromEmail": "\"DevOps Academy\" <noreply@devopsacademy.com>"
  },
  "connection": {
    "configured": true,
    "verified": true,
    "isMock": false,
    "message": "Successfully connected to Gmail SMTP."
  }
}
```

---

### 10.2 Dispatch Test Email
Triggers a diagnostic email using any of the 4 core platform templates or standard verification test.

- **Endpoint:** `POST /api/email/test`
- **Access:** Public / Diagnostic
- **Database Tables:** `email_logs`

#### Request Payload:
```json
{
  "to": "developer@example.com",
  "type": "welcome"
}
```
*Supported `type` values:*
- `test`: General SMTP verification diagnostic email.
- `welcome`: Welcome onboarding email template for new students.
- `contact`: Contact inquiry notification to admin + user receipt confirmation.
- `enrollment`: Course enrollment welcome to student + admin notification.
- `reset`: Password reset link and security notice template.

#### Response Example (200 OK):
```json
{
  "success": true,
  "message": "Test email (welcome) processed successfully",
  "data": {
    "success": true,
    "messageId": "<c288924f-a2e6-a388-75c6-b51909a85ecb@gmail.com>",
    "to": "developer@example.com",
    "subject": "🚀 Welcome to DevOps Academy, DevOps Engineer!",
    "type": "welcome_registration",
    "isMock": false
  }
}
```

---

### 10.3 Get Email Logs (Admin)
Retrieves recent email dispatch history recorded in PostgreSQL.

- **Endpoint:** `GET /api/email/logs?limit=20`
- **Access:** Private (`protect`, `authorize('admin')`)
- **Database Tables:** `email_logs`

---

## 🧩 11. Quiz Attempts API (`/api/quizzes`)

### 11.1 Record Quiz Attempt
Submits a student's score, questions answered, pass/fail status, percentage, and timestamps for an interactive quiz. Auto-derives `passed = true` if `score >= 70` (or uses provided `passed` flag). Computes percentage if omitted.

- **Endpoint:** `/api/quizzes/attempts`
- **HTTP Method:** `POST`
- **Authentication:** Required (`Bearer <jwt_token>`)
- **Database Tables:** `quiz_attempts`, `courses`

#### Request Body:
| Field | Type | Required | Description |
|---|---|---|---|
| `quizId` | String | Yes | Unique identifier of the quiz (e.g. `'k8s-pod-networking'`) |
| `score` | Integer | Yes | Attained score from `0` to `100` |
| `courseId` | Integer | No | Associated course ID |
| `totalQuestions` | Integer | No | Total questions count in quiz |
| `correctCount` | Integer | No | Number of correctly answered questions |
| `answers` | Object | No | Key-value record of student answers (e.g. `{"q1": "Calico BGP"}`) |
| `percentage` | Number | No | Explicit percentage score (`0.0` to `100.0`) |
| `passed` | Boolean | No | Explicit pass/fail flag (defaults to `score >= 70`) |

#### Example Request:
```http
POST /api/quizzes/attempts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "quizId": "k8s-pod-networking",
  "courseId": 1,
  "score": 90,
  "totalQuestions": 10,
  "correctCount": 9,
  "percentage": 90.0,
  "answers": {
    "q1": "Calico BGP routing",
    "q2": "CoreDNS service resolution"
  }
}
```

#### Response (201 Created):
```json
{
  "success": true,
  "message": "Quiz attempt recorded successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "quiz_id": "k8s-pod-networking",
    "course_id": 1,
    "score": 90,
    "passed": true,
    "total_questions": 10,
    "correct_count": 9,
    "answers": {
      "q1": "Calico BGP routing",
      "q2": "CoreDNS service resolution"
    },
    "percentage": 90,
    "created_at": "2026-09-30T10:00:00.000Z",
    "updated_at": "2026-09-30T10:00:00.000Z"
  }
}
```

#### Error Responses:
- **400 Bad Request:** Missing `quizId`, invalid score (`score < 0` or `score > 100`), invalid percentage (`percentage > 100`), or non-object answers.
  ```json
  {
    "success": false,
    "message": "Score must be an integer between 0 and 100"
  }
  ```
- **401 Unauthorized:** Missing or expired JWT token.
  ```json
  {
    "success": false,
    "message": "Not authorized, token missing or invalid"
  }
  ```
- **404 Not Found:** Referenced `courseId` does not exist.
  ```json
  {
    "success": false,
    "message": "Course with ID 999 not found"
  }
  ```

---

### 11.2 Get Current User's Quiz Attempts
Retrieves the authenticated student's historical quiz attempts joined with course title and slug.

- **Endpoint:** `/api/quizzes/my-attempts`
- **HTTP Method:** `GET`
- **Authentication:** Required (`Bearer <jwt_token>`)
- **Database Tables:** `quiz_attempts`, `courses`
- **Query Parameters:**
  - `quizId` (optional string): Filter attempts by quiz ID
  - `courseId` (optional integer): Filter attempts by course ID
  - `limit` (optional integer, default 50, max 100): Result page size
  - `offset` (optional integer, default 0): Result pagination offset

#### Example Request:
```http
GET /api/quizzes/my-attempts?quizId=k8s-pod-networking
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "quiz_id": "k8s-pod-networking",
      "course_id": 1,
      "score": 90,
      "passed": true,
      "total_questions": 10,
      "correct_count": 9,
      "answers": { "q1": "Calico BGP routing" },
      "percentage": 90,
      "created_at": "2026-09-30T10:00:00.000Z",
      "course_title": "Kubernetes: From Zero to Production",
      "course_slug": "kubernetes-zero-to-production",
      "course_category": "Orchestration"
    }
  ]
}
```

#### Error Responses:
- **401 Unauthorized:** Missing or invalid JWT authorization header.
  ```json
  {
    "success": false,
    "message": "Not authorized, token missing or invalid"
  }
  ```

---

### 11.3 Get Quiz Aggregate Statistics
Calculates total attempts, pass rate, average score, score boundaries, and recent attempts for a specific quiz.

- **Endpoint:** `/api/quizzes/:quizId/stats`
- **HTTP Method:** `GET`
- **Authentication:** Public (No authentication required)
- **Database Tables:** `quiz_attempts`, `users`

#### Example Request:
```http
GET /api/quizzes/k8s-pod-networking/stats
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "quizId": "k8s-pod-networking",
    "totalAttempts": 14,
    "uniqueUsers": 11,
    "passCount": 12,
    "passRate": 85.7,
    "averageScore": 79.4,
    "highestScore": 100,
    "lowestScore": 45,
    "recentAttempts": [
      {
        "id": 5,
        "score": 90,
        "passed": true,
        "correct_count": 9,
        "total_questions": 10,
        "created_at": "2026-09-30T10:00:00.000Z",
        "username": "Jatin_Sharma"
      }
    ]
  }
}
```

#### Error Responses:
- **400 Bad Request:** Missing `:quizId` path parameter.
- **500 Internal Server Error:** Database query error.

---

## 📝 12. Lesson Notes API (`/api/lessons`)

### 12.1 Get Student's Lesson Note
Fetches the active student's private markdown notes for a specific lesson. Users can only access their own notes.

- **Endpoint:** `/api/lessons/:lessonId/notes`
- **HTTP Method:** `GET`
- **Authentication:** Required (`Bearer <jwt_token>`)
- **Database Tables:** `lesson_notes`, `lessons`, `courses`

#### Example Request:
```http
GET /api/lessons/42/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 7,
    "user_id": 1,
    "lesson_id": 42,
    "content": "# CNI Architecture\nFlannel uses VXLAN overlay; Calico uses BGP.",
    "created_at": "2026-09-30T09:30:00.000Z",
    "updated_at": "2026-09-30T09:45:00.000Z",
    "lesson_title": "Kubernetes CNI Architecture",
    "lesson_slug": "k8s-cni-architecture",
    "course_id": 1,
    "course_title": "Kubernetes: From Zero to Production",
    "course_slug": "kubernetes-zero-to-production"
  },
  "message": "Note retrieved successfully"
}
```

*(Note: Returns `"data": null` if no note has been created yet for this lesson).*

#### Error Responses:
- **400 Bad Request:** Invalid lesson ID parameter.
- **401 Unauthorized:** Missing or expired JWT.
- **404 Not Found:** Lesson does not exist.

---

### 12.2 Save / Upsert Lesson Note
Creates or overwrites the authenticated student's private notes for a lesson. Automatically maintains strict user isolation.

- **Endpoint:** `/api/lessons/:lessonId/notes`
- **HTTP Method:** `PUT`
- **Authentication:** Required (`Bearer <jwt_token>`)
- **Database Tables:** `lesson_notes`

#### Request Body:
| Field | Type | Required | Description |
|---|---|---|---|
| `content` | String | Yes | Markdown or plain-text study notes |

#### Example Request:
```http
PUT /api/lessons/42/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "content": "# CNI Architecture (Updated)\nCilium provides eBPF data-plane performance."
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Lesson note saved successfully",
  "data": {
    "id": 7,
    "user_id": 1,
    "lesson_id": 42,
    "content": "# CNI Architecture (Updated)\nCilium provides eBPF data-plane performance.",
    "created_at": "2026-09-30T09:30:00.000Z",
    "updated_at": "2026-09-30T10:05:00.000Z",
    "lesson_title": "Kubernetes CNI Architecture"
  }
}
```

#### Error Responses:
- **400 Bad Request:** Missing `content` field or invalid lesson ID.
- **401 Unauthorized:** Missing or invalid JWT.
- **404 Not Found:** Lesson does not exist.

---

### 12.3 Delete Lesson Note
Permanently removes the authenticated student's note for the specified lesson. Users can only delete their own notes.

- **Endpoint:** `/api/lessons/:lessonId/notes`
- **HTTP Method:** `DELETE`
- **Authentication:** Required (`Bearer <jwt_token>`)
- **Database Tables:** `lesson_notes`

#### Example Request:
```http
DELETE /api/lessons/42/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Lesson note deleted successfully",
  "data": {
    "id": 7,
    "user_id": 1,
    "lesson_id": 42
  }
}
```

#### Error Responses:
- **400 Bad Request:** Invalid lesson ID.
- **401 Unauthorized:** Missing or invalid JWT.
- **404 Not Found:** No note found for this student and lesson.

---

## ⭐ 13. Course Reviews API (`/api/courses/:courseId/reviews` & `/api/admin/reviews`)

### 13.1 Get Course Reviews & Aggregate Ratings
Retrieves student reviews and aggregate rating breakdown for a course (supports numeric ID or course slug). Unapproved/moderated reviews are automatically filtered out from public view.

- **Endpoint:** `/api/courses/:courseId/reviews`
- **HTTP Method:** `GET`
- **Authentication:** Public (No authentication required)
- **Database Tables:** `course_reviews`, `users`, `courses`
- **Query Parameters:**
  - `approvedOnly` (optional boolean, default `true`): Exclude moderated reviews
  - `limit` (optional integer, default 20)
  - `offset` (optional integer, default 0)

#### Example Request:
```http
GET /api/courses/networking-for-devops/reviews
```

#### Response (200 OK):
```json
{
  "success": true,
  "courseId": 9,
  "courseTitle": "Networking for DevOps",
  "count": 1,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "course_id": 9,
      "rating": 5,
      "review_text": "Exceptional hands-on curriculum! The Kubernetes troubleshooting labs were practical.",
      "is_approved": true,
      "created_at": "2026-09-30T10:00:00.000Z",
      "updated_at": "2026-09-30T10:00:00.000Z",
      "username": "Jatin_Sharma",
      "user_role": "admin"
    }
  ],
  "stats": {
    "totalReviews": 1,
    "averageRating": 5,
    "distribution": {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 1
    }
  }
}
```

#### Error Responses:
- **404 Not Found:** Course does not exist.

---

### 13.2 Submit or Update Course Review
Submits a course review. **Only enrolled students** (or instructors/administrators) can submit reviews. Prevents duplicate reviews: if the student has already submitted a review for this course, this endpoint updates their existing review.

- **Endpoint:** `/api/courses/:courseId/reviews`
- **HTTP Method:** `POST`
- **Authentication:** Required (`Bearer <jwt_token>`)
- **Database Tables:** `course_reviews`, `enrollments`, `courses`

#### Request Body:
| Field | Type | Required | Description |
|---|---|---|---|
| `rating` | Integer | Yes | Rating integer from `1` to `5` stars |
| `reviewText` | String | No | Review text (max 2000 characters) |

#### Example Request:
```http
POST /api/courses/9/reviews
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "rating": 5,
  "reviewText": "Exceptional hands-on curriculum! Highly recommended."
}
```

#### Response (201 Created):
```json
{
  "success": true,
  "message": "Course review submitted successfully",
  "data": {
    "id": 1,
    "user_id": 2,
    "course_id": 9,
    "rating": 5,
    "review_text": "Exceptional hands-on curriculum! Highly recommended.",
    "is_approved": true,
    "created_at": "2026-09-30T10:00:00.000Z",
    "updated_at": "2026-09-30T10:00:00.000Z",
    "username": "jatin",
    "course_title": "Networking for DevOps",
    "course_slug": "networking-for-devops"
  }
}
```

#### Error Responses:
- **400 Bad Request:** Missing `rating`, rating not between 1 and 5, or review text exceeds 2000 chars.
  ```json
  {
    "success": false,
    "message": "Rating must be an integer between 1 and 5"
  }
  ```
- **401 Unauthorized:** Missing or invalid token.
- **403 Forbidden:** Student is not enrolled in the course.
  ```json
  {
    "success": false,
    "message": "Only enrolled students can submit reviews for this course"
  }
  ```
- **404 Not Found:** Course does not exist.

---

### 13.3 Moderate Review (Admin)
Approves or hides a review from public visibility. Emits an immutable audit log entry.

- **Endpoint:** `/api/admin/reviews/:id/moderate`
- **HTTP Method:** `PUT`
- **Authentication:** Required (`Bearer <jwt_token>` with role `admin`)
- **Database Tables:** `course_reviews`, `audit_logs`

#### Request Body:
| Field | Type | Required | Description |
|---|---|---|---|
| `isApproved` | Boolean | Yes | `true` to approve and display, `false` to hide |

#### Example Request:
```http
PUT /api/admin/reviews/1/moderate
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "isApproved": false
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Review hidden/moderated successfully",
  "data": {
    "id": 1,
    "user_id": 2,
    "course_id": 9,
    "rating": 5,
    "review_text": "Flagged content",
    "is_approved": false,
    "created_at": "2026-09-30T10:00:00.000Z",
    "updated_at": "2026-09-30T10:15:00.000Z",
    "username": "jatin",
    "course_title": "Networking for DevOps"
  }
}
```

#### Error Responses:
- **400 Bad Request:** Missing `isApproved` boolean or invalid review ID.
- **401 Unauthorized:** Unauthenticated.
- **403 Forbidden:** Authenticated user is not an administrator.
- **404 Not Found:** Review with specified ID not found.

---

### 13.4 List Platform Reviews (Admin)
Retrieves all course reviews platform-wide with moderation filters and user details.

- **Endpoint:** `/api/admin/reviews`
- **HTTP Method:** `GET`
- **Authentication:** Required (`admin` role)
- **Database Tables:** `course_reviews`, `users`, `courses`

---

### 13.5 Delete Review (Admin)
Permanently deletes a flagged or inappropriate course review from the database.

- **Endpoint:** `/api/admin/reviews/:id`
- **HTTP Method:** `DELETE`
- **Authentication:** Required (`admin` role)
- **Database Tables:** `course_reviews`, `audit_logs`

---

## 📊 14. Monitoring & Observability API

### 14.1 Prometheus Metrics Endpoint
Exposes live system performance counters, histograms, gauges, and business entities in standard Prometheus text format (`version=0.0.4`).

- **Endpoint:** `GET /api/metrics`
- **Access:** Public (or scraped by Prometheus internal network)
- **Response Format:** `text/plain; version=0.0.4; charset=utf-8`
- **Key Metrics Included:**
  - `http_requests_total{method, route, status_code}`: Request counter
  - `http_request_duration_seconds_bucket{le, method, route, status_code}`: Request latency histogram
  - `http_active_requests{method}`: Gauge of currently executing requests
  - `devops_academy_entities_total{entity}`: Platform count of users, courses, enrollments, certificates, quizzes, reviews
  - `process_cpu_user_seconds_total`, `nodejs_heap_size_used_bytes`, `nodejs_eventloop_lag_seconds`: Runtime health

### 14.2 Get Administrative Audit Logs
Retrieves the immutable audit trail of administrative modifications (role changes, certificate issuances/revocations, category CRUD, review moderation, settings updates).

- **Endpoint:** `GET /api/admin/audit-logs`
- **Access:** Private (`protect`, `authorize('admin')`)
- **Database Tables:** `audit_logs`
- **Query Parameters:**
  - `action` (optional string): Filter by action name (e.g. `UPDATE_EMAIL_SETTINGS`, `ISSUE_CERTIFICATE`, `DELETE_USER`)
  - `resource` (optional string): Filter by resource type (e.g. `certificate`, `category`, `user`, `review`)
  - `userId` (optional integer): Filter by administrator ID
  - `limit` (optional integer, default 50, max 100): Page size
  - `offset` (optional integer, default 0): Record offset

#### Response Example (200 OK):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 16,
      "user_id": 1,
      "username": "Jatin_Sharma",
      "action": "UPDATE_EMAIL_SETTINGS",
      "resource": "email_settings",
      "resource_id": null,
      "details": {
        "smtpHost": "smtp.gmail.com",
        "smtpPort": 465,
        "smtpSecure": true
      },
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0 ...",
      "created_at": "2026-09-28T14:48:44.000Z"
    }
  ],
  "stats": {
    "total": 16,
    "totalAuditLogs": 16,
    "byAction": [
      { "action": "UPDATE_EMAIL_SETTINGS", "count": 6 },
      { "action": "ISSUE_CERTIFICATE", "count": 5 },
      { "action": "CREATE_CATEGORY", "count": 2 }
    ],
    "recentActions": [...]
  }
}
```

### 14.3 Health & Container Diagnostic Probes

#### Liveness Probe
Validates the Node.js event loop is responsive. Used by Kubernetes/Docker liveness probes.
- **Endpoint:** `GET /api/health/live`
- **Access:** Public
- **Response Example (200 OK):**
  ```json
  { "status": "UP", "timestamp": "2026-09-28T10:15:00.000Z", "uptime": 3600 }
  ```

#### Readiness Probe
Validates the database connection pool is active and queries succeed (`SELECT 1`) before routing user traffic.
- **Endpoint:** `GET /api/health/ready`
- **Access:** Public
- **Response Example (200 OK / 503 Service Unavailable):**
  ```json
  { "status": "READY", "timestamp": "2026-09-28T10:15:00.000Z", "database": { "status": "CONNECTED", "latencyMs": 4 } }
  ```

#### Comprehensive Health & Diagnostics
Detailed health inspection for operations dashboards and infrastructure monitors.
- **Endpoint:** `GET /api/health`
- **Access:** Public
- **Response Example (200 OK):**
  ```json
  {
    "status": "UP",
    "uptime": 3600,
    "timestamp": "2026-09-28T10:15:00.000Z",
    "environment": "production",
    "database": {
      "status": "UP",
      "latencyMs": 3,
      "pool": { "totalCount": 5, "idleCount": 5, "waitingCount": 0 }
    },
    "system": {
      "nodeVersion": "v20.18.0",
      "memoryUsageMb": 58,
      "heapUsedMb": 24,
      "heapTotalMb": 38
    },
    "message": "DevOps Academy Backend API is healthy and connected"
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
| **`quiz_attempts`** | Student quiz submissions, scores, and pass metrics | `/api/quizzes/attempts`, `/api/quizzes/my-attempts`, `/api/quizzes/:quizId/stats` |
| **`lesson_notes`** | Student private markdown notes per lesson | `/api/lessons/:lessonId/notes` |
| **`course_reviews`** | Course star ratings, feedback, and moderation | `/api/courses/:courseId/reviews`, `/api/admin/reviews/*` |
| **`learning_goals`** | Daily tracker tasks and micro-goals | `/api/tracker/goals/*` |
| **`user_streaks`** | Consecutive study days and streak records | `/api/tracker/*` |
| **`daily_learning_activity`** | Daily study minutes logged per student | `/api/tracker/activity` |
| **`contact_messages`** | User contact inquiries & messages | `/api/contact/*` |
| **`notifications`** | Admin broadcast and system alerts | `/api/admin/notifications/*` |
| **`audit_logs`** | Complete audit trail of administrative modifications | `/api/admin/audit-logs`, `/api/admin/*`, `/api/users/*` |

---

## 🖥️ 15. Frontend Integration Architecture & Component Mappings (Phase 3)

The DevOps Academy frontend incorporates a centralized API service layer (`frontend/src/services/apiService.ts`) with Axios interceptors managing JWT transmission, token refreshing, and unified error handling.

### 15.1 API Service Layer & Endpoint Mapping

| Feature | Backend Endpoint | HTTP Method | Auth Required | Frontend Service Method | Primary Components Using Endpoint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Lesson Notes** | `/api/lessons/:lessonId/notes` | `GET` | ✅ Bearer JWT | `apiService.notes.getLessonNotes(lessonId)` | `LessonViewPage.tsx` ("My Notebook" Tab) |
| **Lesson Notes** | `/api/lessons/:lessonId/notes` | `PUT` | ✅ Bearer JWT | `apiService.notes.saveLessonNotes(lessonId, content)` | `LessonViewPage.tsx` (Save Notes Button) |
| **Lesson Notes** | `/api/lessons/:lessonId/notes` | `DELETE` | ✅ Bearer JWT | `apiService.notes.deleteLessonNotes(lessonId)` | `LessonViewPage.tsx` (Delete Note Action) |
| **Quiz Attempts** | `/api/quizzes/attempts` | `POST` | ✅ Bearer JWT | `apiService.quizzes.submitAttempt(payload)` | `QuizPage.tsx` (`handleFinishQuiz`) |
| **Quiz Attempts** | `/api/quizzes/my-attempts` | `GET` | ✅ Bearer JWT | `apiService.quizzes.getMyAttempts(quizId?)` | `QuizPage.tsx` (Intro Phase History), `StudentDashboardPage.tsx` (Assessment History Card) |
| **Course Reviews**| `/api/courses/:courseId/reviews` | `GET` | ❌ Public | `apiService.reviews.getCourseReviews(courseIdOrSlug)`| `CourseDetailPage.tsx` ("Student Reviews" Tab & Stats) |
| **Course Reviews**| `/api/courses/:courseId/reviews` | `POST` | ✅ Bearer JWT | `apiService.reviews.submitReview(courseIdOrSlug, data)`| `CourseDetailPage.tsx` (Interactive Review Form) |

### 15.2 Authentication & Security Enforcement

- **JWT Storage:** Tokens are retained securely in browser `localStorage.getItem("da-token")` and attached automatically to all outgoing requests using an Axios request interceptor (`Authorization: Bearer <token>`).
- **User Isolation:** All note endpoints (`GET/PUT/DELETE /api/lessons/:lessonId/notes`) and quiz attempt endpoints (`GET /api/quizzes/my-attempts`) use the authenticated `req.user.id` extracted from the verified JWT payload. No student can read, modify, or delete another student's private notes or quiz submissions.
- **Course Review Gate:** `POST /api/courses/:courseId/reviews` enforces database enrollment validation. Students attempting to review an unenrolled course receive HTTP `403 Forbidden` (`Only enrolled students can review this course`), handled cleanly in the UI with enrollment prompts.
- **Graceful Unauthenticated Degradation:** Unauthenticated visitors (guests) have transparent fallback access via `lmsStore` client-side storage, with non-intrusive UI banners encouraging account creation or login to sync results to PostgreSQL.

