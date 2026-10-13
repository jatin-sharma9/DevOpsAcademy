import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Layout
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import CourseCatalogPage from "@/pages/CourseCatalogPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import LessonViewPage from "@/pages/LessonViewPage";
import StudentDashboardPage from "@/pages/StudentDashboardPage";
import QuizPage from "@/pages/QuizPage";
import CertificatePage from "@/pages/CertificatePage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import SearchPage from "@/pages/SearchPage";
import ProfilePage from "@/pages/ProfilePage";
import PortfolioPage from "@/pages/PortfolioPage";
import InterviewPrepPage from "@/pages/InterviewPrepPage";
import LearningTrackerPage from "@/pages/LearningTrackerPage";
import NetworkingPage from "@/pages/NetworkingPage";
import ContactPage from "@/pages/ContactPage";
import MissionsPage from "@/pages/MissionsPage";
import ProductionDownMissionPage from "@/pages/ProductionDownMissionPage";
import DockerBuildMissionPage from "@/pages/DockerBuildMissionPage";
import KubernetesCrashLoopMissionPage from "@/pages/KubernetesCrashLoopMissionPage";
import FailedCicdMissionPage from "@/pages/FailedCicdMissionPage";
import LegalPage from "@/pages/LegalPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminCoursesPage from "@/pages/admin/AdminCoursesPage";
import AdminAddCoursePage from "@/pages/admin/AdminAddCoursePage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminEnrollmentsPage from "@/pages/admin/AdminEnrollmentsPage";
import AdminCertificatesPage from "@/pages/admin/AdminCertificatesPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminLessonsPage from "@/pages/admin/AdminLessonsPage";
import AdminBlogPage from "@/pages/admin/AdminBlogPage";
import AdminMessagesPage from "@/pages/admin/AdminMessagesPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import AdminEmailSettingsPage from "@/pages/admin/AdminEmailSettingsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm font-mono">Loading...</p>
      </div>
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/networking" element={<Navigate to="/courses/networking-for-devops" replace />} />
        <Route path="/interview-prep" element={<InterviewPrepPage />} />
        <Route path="/tracker" element={<LearningTrackerPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/missions/production-down" element={<ProductionDownMissionPage />} />
        <Route path="/missions/docker-build" element={<DockerBuildMissionPage />} />
        <Route path="/missions/kubernetes-crashloop" element={<KubernetesCrashLoopMissionPage />} />
        <Route path="/missions/failed-cicd" element={<FailedCicdMissionPage />} />
        <Route path="/courses" element={<CourseCatalogPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/certificate/:id" element={<CertificatePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<LegalPage />} />
        <Route path="/privacy" element={<LegalPage />} />
        <Route path="/terms" element={<LegalPage />} />
        <Route path="/community" element={<LegalPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/learn/:slug" element={<ProtectedRoute><LessonViewPage /></ProtectedRoute>} />
        <Route path="/quiz/:slug" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="courses/add" element={<AdminAddCoursePage />} />
        <Route path="lessons" element={<AdminLessonsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="enrollments" element={<AdminEnrollmentsPage />} />
        <Route path="certificates" element={<AdminCertificatesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="blog" element={<AdminBlogPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="email" element={<AdminEmailSettingsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
