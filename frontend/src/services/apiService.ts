import axios from 'axios';
import React from 'react';
import { SiLinux, SiGit, SiDocker, SiKubernetes, SiJenkins, SiTerraform, SiAnsible } from 'react-icons/si';
import { Cloud, HelpCircle } from 'lucide-react';
import { COURSES } from '@/data/courses';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('da-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle unauthenticated or expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const hadToken = !!localStorage.getItem('da-token');
      // Clear storage if token was invalid or expired
      localStorage.removeItem('da-user');
      localStorage.removeItem('da-token');
      if (hadToken && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper interfaces
export interface CourseData {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  is_pro: boolean;
  is_featured: boolean;
  is_published: boolean;
  youtube_video_url?: string;
  instructor_id?: number;
  thumbnail?: string;
  duration_hours: number;
  created_at?: string;
  lessons?: LessonData[];
}

export interface LessonData {
  id: number;
  course_id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  video_url?: string;
  sort_order: number;
  duration_minutes: number;
}

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LessonNoteData {
  id: number;
  user_id: number;
  lesson_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  lesson_title?: string;
  lesson_slug?: string;
  course_id?: number;
  course_title?: string;
  course_slug?: string;
}

export interface QuizAttemptData {
  id: number;
  user_id: number;
  quiz_id: string;
  course_id?: number | null;
  score: number;
  passed: boolean;
  total_questions: number;
  correct_count: number;
  answers?: Record<string, any>;
  percentage?: number;
  created_at: string;
  course_title?: string;
  course_slug?: string;
  course_category?: string;
}

export interface QuizStatsData {
  quizId: string;
  totalAttempts: number;
  uniqueUsers: number;
  passCount: number;
  passRate: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  recentAttempts: Array<{
    id: number;
    score: number;
    passed: boolean;
    correct_count: number;
    total_questions: number;
    created_at: string;
    username: string;
  }>;
}

export interface CourseReviewData {
  id: number;
  user_id: number;
  course_id: number;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  username: string;
  user_role?: string;
  course_title?: string;
  course_slug?: string;
}

export interface ReviewStatsData {
  totalReviews: number;
  averageRating: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
    [key: string]: number;
  };
}

// Typed API Requests
export const apiService = {
  // --- AUTHENTICATION ---
  auth: {
    async login(data: { email?: string; username?: string; password?: string }) {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    async register(data: { username: string; email: string; password: string; role?: string }) {
      const res = await api.post('/auth/register', data);
      return res.data;
    },
    async getMe() {
      const res = await api.get('/auth/me');
      return res.data;
    },
    async updateProfile(data: { username: string; email: string; password?: string }) {
      const res = await api.put('/auth/profile', data);
      return res.data;
    },
  },

  // --- COURSES ---
  courses: {
    async getAll(publishedOnly = false) {
      const url = publishedOnly ? '/courses?published=true' : '/courses';
      const res = await api.get(url);
      return res.data;
    },
    async getBySlug(slug: string) {
      const res = await api.get(`/courses/${slug}`);
      return res.data;
    },
    async create(data: Partial<CourseData>) {
      const res = await api.post('/courses', data);
      return res.data;
    },
    async update(id: number, data: Partial<CourseData>) {
      const res = await api.put(`/courses/${id}`, data);
      return res.data;
    },
    async delete(id: number) {
      const res = await api.delete(`/courses/${id}`);
      return res.data;
    },
    async togglePublish(id: number, isPublished: boolean) {
      const res = await api.put(`/courses/${id}/publish`, { isPublished });
      return res.data;
    },
    async uploadThumbnail(id: number, file: File) {
      const formData = new FormData();
      formData.append('thumbnail', file);
      const res = await api.post(`/courses/${id}/thumbnail`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
  },

  // --- LESSONS ---
  lessons: {
    async getByCourseId(courseId: number) {
      const res = await api.get(`/courses/${courseId}/lessons`);
      return res.data;
    },
    async create(courseId: number, data: Partial<LessonData>) {
      const res = await api.post(`/courses/${courseId}/lessons`, data);
      return res.data;
    },
    async update(courseId: number, id: number, data: Partial<LessonData>) {
      const res = await api.put(`/courses/${courseId}/lessons/${id}`, data);
      return res.data;
    },
    async delete(courseId: number, id: number) {
      const res = await api.delete(`/courses/${courseId}/lessons/${id}`);
      return res.data;
    },
  },

  // --- ENROLLMENTS & TRACKING ---
  enrollments: {
    async enroll(courseId: number) {
      const res = await api.post('/enrollments', { courseId });
      return res.data;
    },
    async getMyEnrollments() {
      const res = await api.get('/enrollments/my');
      return res.data;
    },
    async getCourseProgress(courseId: number | string) {
      const res = await api.get(`/enrollments/courses/${courseId}/progress`);
      return res.data;
    },
    async markComplete(courseId: number | string, lessonId: number | string) {
      const res = await api.post('/enrollments/lessons/complete', { courseId, lessonId });
      return res.data;
    },
    async markIncomplete(courseId: number | string, lessonId: number | string) {
      const res = await api.post('/enrollments/lessons/incomplete', { courseId, lessonId });
      return res.data;
    },
    async getCertificate(courseId: number) {
      const res = await api.get(`/enrollments/courses/${courseId}/certificate`);
      return res.data;
    },
    async verifyCertificate(hash: string) {
      const res = await api.get(`/enrollments/certificates/verify/${hash}`);
      return res.data;
    },
  },

  // --- CONTACT FORM ---
  contact: {
    async submit(data: ContactData) {
      const res = await api.post('/contact', data);
      return res.data;
    },
  },

  // --- BLOGS ---
  blogs: {
    async getAll(publishedOnly = false, category?: string, search?: string) {
      const params = new URLSearchParams();
      if (publishedOnly) params.append('published', 'true');
      if (category && category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      const url = `/blogs${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await api.get(url);
      return res.data;
    },
    async getBySlug(slug: string) {
      const res = await api.get(`/blogs/${slug}`);
      return res.data;
    },
    async create(data: any) {
      const res = await api.post('/blogs', data);
      return res.data;
    },
    async update(id: number | string, data: any) {
      const res = await api.put(`/blogs/${id}`, data);
      return res.data;
    },
    async delete(id: number | string) {
      const res = await api.delete(`/blogs/${id}`);
      return res.data;
    },
    async togglePublish(id: number | string, isPublished: boolean) {
      const res = await api.put(`/blogs/${id}/publish`, { isPublished });
      return res.data;
    },
    async toggleFeatured(id: number | string, isFeatured: boolean) {
      const res = await api.put(`/blogs/${id}/featured`, { isFeatured });
      return res.data;
    },
  },

  // --- ADMIN PORTAL ---
  admin: {
    async getStats() {
      const res = await api.get('/admin/stats');
      return res.data;
    },
    async getContactMessages() {
      const res = await api.get('/contact');
      return res.data;
    },
    async updateMessageStatus(id: number, status: 'unread' | 'read' | 'archived') {
      const res = await api.put(`/contact/${id}/status`, { status });
      return res.data;
    },
    async deleteMessage(id: number) {
      const res = await api.delete(`/contact/${id}`);
      return res.data;
    },
    async getNotifications(unreadOnly = false) {
      const url = unreadOnly ? '/admin/notifications?unread=true' : '/admin/notifications';
      const res = await api.get(url);
      return res.data;
    },
    async markAllNotificationsRead() {
      const res = await api.put('/admin/notifications/read');
      return res.data;
    },
    async markNotificationRead(id: number) {
      const res = await api.put(`/admin/notifications/${id}/read`);
      return res.data;
    },
    async deleteNotification(id: number) {
      const res = await api.delete(`/admin/notifications/${id}`);
      return res.data;
    },
    async getAnalytics() {
      const res = await api.get('/admin/analytics');
      return res.data;
    },
    async getCertificates() {
      const res = await api.get('/admin/certificates');
      return res.data;
    },
    async issueCertificate(data: { student: string; courseSlug: string; score?: string }) {
      const res = await api.post('/admin/certificates', data);
      return res.data;
    },
    async deleteCertificate(id: string | number) {
      const res = await api.delete(`/admin/certificates/${id}`);
      return res.data;
    },
    async getEmailSettings() {
      const res = await api.get('/admin/email/settings');
      return res.data;
    },
    async saveEmailSettings(data: any) {
      const res = await api.put('/admin/email/settings', data);
      return res.data;
    },
    async sendTestEmail(to?: string, type?: string) {
      const res = await api.post('/admin/email/test', { to, type });
      return res.data;
    },
    async getEmailLogs() {
      const res = await api.get('/admin/email/logs');
      return res.data;
    },
  },

  // --- CATEGORIES ---
  categories: {
    async getAll() {
      const res = await api.get('/categories');
      return res.data;
    },
    async getBySlug(slug: string) {
      const res = await api.get(`/categories/${slug}`);
      return res.data;
    },
    async create(data: { name: string; slug?: string; description?: string; icon?: string; sort_order?: number }) {
      const res = await api.post('/categories', data);
      return res.data;
    },
    async update(id: number | string, data: { name?: string; slug?: string; description?: string; icon?: string; sort_order?: number }) {
      const res = await api.put(`/categories/${id}`, data);
      return res.data;
    },
    async delete(id: number | string) {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    },
  },

  // --- ADMIN USERS ---
  users: {
    async getAll() {
      const res = await api.get('/users');
      return res.data;
    },
    async delete(id: number) {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    },
    async updateRole(id: number, role: string) {
      const res = await api.put(`/users/${id}/role`, { role });
      return res.data;
    },
  },

  // --- ALL ENROLLMENTS (ADMIN) ---
  allEnrollments: {
    async getAll() {
      const res = await api.get('/enrollments');
      return res.data;
    },
  },

  // --- DAILY LEARNING TRACKER ---
  tracker: {
    /**
     * Load goals + stats for a specific date (defaults to today).
     * Returns { success, data: { goals, stats, date } }
     */
    async getTrackerData(date?: string) {
      const url = date ? `/tracker?date=${date}` : '/tracker';
      const res = await api.get(url);
      return res.data;
    },

    /**
     * Create a new learning goal in PostgreSQL.
     */
    async addGoal(data: { title: string; category: string; targetDate?: string }) {
      const res = await api.post('/tracker/goals', data);
      return res.data;
    },

    /**
     * Toggle a goal's completion status. Returns updated goal + fresh stats.
     */
    async toggleGoal(id: number) {
      const res = await api.patch(`/tracker/goals/${id}`);
      return res.data;
    },

    /**
     * Permanently delete a goal.
     */
    async deleteGoal(id: number) {
      const res = await api.delete(`/tracker/goals/${id}`);
      return res.data;
    },

    /**
     * Log learning minutes. Triggers streak recalculation.
     */
    async logTime(minutes: number) {
      const res = await api.post('/tracker/activity', { minutes });
      return res.data;
    },
  },

  // --- QUIZZES ---
  quizzes: {
    async submitAttempt(data: {
      quizId: string;
      courseId?: number;
      score: number;
      passed?: boolean;
      totalQuestions?: number;
      correctCount?: number;
      answers?: Record<string, any>;
      percentage?: number;
    }) {
      const res = await api.post('/quizzes/attempts', data);
      return res.data;
    },
    async getMyAttempts(quizId?: string, courseId?: number) {
      const params = new URLSearchParams();
      if (quizId) params.append('quizId', quizId);
      if (courseId) params.append('courseId', String(courseId));
      const res = await api.get(`/quizzes/my-attempts${params.toString() ? `?${params.toString()}` : ''}`);
      return res.data;
    },
    async getStats(quizId: string) {
      const res = await api.get(`/quizzes/${quizId}/stats`);
      return res.data;
    },
  },

  // --- LESSON NOTES ---
  notes: {
    async getLessonNotes(lessonId: number) {
      const res = await api.get(`/lessons/${lessonId}/notes`);
      return res.data;
    },
    async saveLessonNotes(lessonId: number, content: string) {
      const res = await api.put(`/lessons/${lessonId}/notes`, { content });
      return res.data;
    },
    async deleteLessonNotes(lessonId: number) {
      const res = await api.delete(`/lessons/${lessonId}/notes`);
      return res.data;
    },
    async getMyNotes(courseId?: number) {
      const url = courseId ? `/lessons/notes/my?courseId=${courseId}` : '/lessons/notes/my';
      const res = await api.get(url);
      return res.data;
    },
  },

  // --- COURSE REVIEWS ---
  reviews: {
    async getCourseReviews(courseId: number | string, approvedOnly = true) {
      const res = await api.get(`/courses/${courseId}/reviews?approvedOnly=${approvedOnly}`);
      return res.data;
    },
    async submitReview(courseId: number | string, data: { rating: number; reviewText?: string }) {
      const res = await api.post(`/courses/${courseId}/reviews`, data);
      return res.data;
    },
    async moderateReview(id: number, isApproved: boolean) {
      const res = await api.put(`/admin/reviews/${id}/moderate`, { isApproved });
      return res.data;
    },
    async getAllAdmin(isApproved?: boolean) {
      const url = isApproved !== undefined ? `/admin/reviews?isApproved=${isApproved}` : '/admin/reviews';
      const res = await api.get(url);
      return res.data;
    },
    async deleteAdmin(id: number) {
      const res = await api.delete(`/admin/reviews/${id}`);
      return res.data;
    },
  },
};

const getCategoryIcon = (category: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('linux')) return React.createElement(SiLinux);
  if (cat.includes('git')) return React.createElement(SiGit);
  if (cat.includes('docker')) return React.createElement(SiDocker);
  if (cat.includes('kubernetes') || cat.includes('k8s')) return React.createElement(SiKubernetes);
  if (cat.includes('jenkins') || cat.includes('ci')) return React.createElement(SiJenkins);
  if (cat.includes('terraform') || cat.includes('iac')) return React.createElement(SiTerraform);
  if (cat.includes('ansible')) return React.createElement(SiAnsible);
  if (cat.includes('cloud') || cat.includes('aws')) return React.createElement(Cloud);
  return React.createElement(HelpCircle);
};

const getCategoryColor = (category: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('linux')) return "from-orange-500 to-yellow-500";
  if (cat.includes('git')) return "from-red-500 to-orange-500";
  if (cat.includes('docker')) return "from-blue-500 to-cyan-500";
  if (cat.includes('kubernetes') || cat.includes('k8s')) return "from-blue-600 to-indigo-600";
  if (cat.includes('jenkins') || cat.includes('ci')) return "from-red-600 to-pink-600";
  if (cat.includes('terraform') || cat.includes('iac')) return "from-purple-600 to-violet-600";
  if (cat.includes('ansible')) return "from-red-700 to-red-500";
  if (cat.includes('cloud') || cat.includes('aws')) return "from-amber-500 to-orange-600";
  return "from-slate-600 to-slate-800";
};

export const mapBackendCourseToFrontend = (course: any): any => {
  if (!course) return null;
  const staticCourse = COURSES.find(
    c => c.slug === course.slug || c.id === String(course.id) || c.id === course.slug
  );

  let sections = staticCourse?.sections || [];
  if (
    course.lessons &&
    course.lessons.length > 0 &&
    (!staticCourse?.sections || staticCourse.sections.length === 0)
  ) {
    sections = [
      {
        id: `sec_${course.id}_1`,
        title: "Syllabus Chapters",
        lessons: course.lessons.map((lesson: any) => ({
          id: String(lesson.id),
          title: lesson.title,
          duration: Number(lesson.duration_minutes || 15),
          type: lesson.video_url ? "video" : "text",
          preview: true,
          youtubeUrl: lesson.video_url || '',
          content: lesson.content || ''
        }))
      }
    ];
  }

  return {
    id: String(course.id),
    slug: course.slug,
    title: course.title || staticCourse?.title || '',
    shortDescription: course.short_description || staticCourse?.shortDescription || '',
    description: course.description || staticCourse?.description || '',
    category: course.category || staticCourse?.category || '',
    level: course.level || staticCourse?.level || 'beginner',
    price: Number(course.price !== undefined ? course.price : (staticCourse?.price || 0)),
    isPro: course.is_pro !== undefined ? !!course.is_pro : (staticCourse?.isPro || false),
    isFeatured: course.is_featured !== undefined ? !!course.is_featured : (staticCourse?.isFeatured || false),
    isPublished: course.is_published !== undefined ? !!course.is_published : true,
    rating: staticCourse?.rating || 4.9,
    totalRatings: staticCourse?.totalRatings || 1420,
    totalStudents: staticCourse?.totalStudents || 8900,
    totalLessons: (sections.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0)) || staticCourse?.totalLessons || (course.lessons ? course.lessons.length : 0),
    durationHours: Number(course.duration_hours || staticCourse?.durationHours || 16),
    instructor: staticCourse?.instructor || "Jatin Sharma",
    instructorTitle: staticCourse?.instructorTitle || "Senior DevOps Engineer",
    thumbnail: course.thumbnail || staticCourse?.thumbnail || '',
    icon: staticCourse?.icon || getCategoryIcon(course.category),
    color: staticCourse?.color || getCategoryColor(course.category),
    tags: staticCourse?.tags || [course.category || 'DevOps'].filter(Boolean),
    whatYouLearn: staticCourse?.whatYouLearn || [
      "Master the core fundamentals of this technology",
      "Implement production-ready solutions and architectures",
      "Configure automated pipelines and workflows",
      "Follow industry-standard best practices"
    ],
    requirements: staticCourse?.requirements || ["Basic computer knowledge", "Access to a terminal and internet"],
    updatedAt: course.updated_at ? course.updated_at.split('T')[0] : (staticCourse?.updatedAt || '2026-09-22'),
    sections
  };
};
