import axios from 'axios';
import React from 'react';
import { SiLinux, SiGit, SiDocker, SiKubernetes, SiJenkins, SiTerraform, SiAnsible } from 'react-icons/si';
import { Cloud, HelpCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

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
      // Clear storage and redirect if token expired
      localStorage.removeItem('da-user');
      localStorage.removeItem('da-token');
      if (window.location.pathname !== '/login') {
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

// Typed API Requests
export const apiService = {
  // --- AUTHENTICATION ---
  auth: {
    async login(data: { email?: string; username?: string; password?: string }) {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    async register(data: { username: string; email: string; password: string }) {
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
    async getCourseProgress(courseId: number) {
      const res = await api.get(`/enrollments/courses/${courseId}/progress`);
      return res.data;
    },
    async markComplete(courseId: number, lessonId: number) {
      const res = await api.post('/enrollments/lessons/complete', { courseId, lessonId });
      return res.data;
    },
    async markIncomplete(courseId: number, lessonId: number) {
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
  return {
    id: String(course.id),
    slug: course.slug,
    title: course.title,
    shortDescription: course.short_description || '',
    description: course.description || '',
    category: course.category || '',
    level: course.level || 'beginner',
    price: Number(course.price || 0),
    isPro: !!course.is_pro,
    isFeatured: !!course.is_featured,
    isPublished: !!course.is_published,
    rating: 4.8,
    totalRatings: 120,
    totalStudents: 1420,
    totalLessons: course.lessons ? course.lessons.length : 0,
    durationHours: Number(course.duration_hours || 0),
    instructor: "Jatin Sharma",
    instructorTitle: "Senior DevOps Engineer",
    thumbnail: course.thumbnail || '',
    icon: getCategoryIcon(course.category),
    color: getCategoryColor(course.category),
    tags: [course.category || 'DevOps'].filter(Boolean),
    whatYouLearn: [
      "Master the core fundamentals of this technology",
      "Implement production-ready solutions and architectures",
      "Configure automated pipelines and workflows",
      "Follow industry-standard best practices"
    ],
    requirements: ["Basic computer knowledge", "Access to a terminal and internet"],
    updatedAt: course.updated_at ? course.updated_at.split('T')[0] : '2026-08-25',
    sections: course.lessons ? [
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
    ] : []
  };
};
