/**
 * LMS Local Store & State Manager
 * Provides client-side persistence and graceful fallback for:
 * - Course enrollments
 * - Lesson completions & progress percentage
 * - Learning streak tracking
 * - Quiz scores & history
 * - Certificate generation & verification
 * - User notes & achievements
 */

export interface EnrollmentState {
  courseId: string | number;
  courseSlug: string;
  enrolledAt: string;
  progress: number;
  completedLessons: string[];
  lastAccessedLessonId?: string;
  lastAccessedAt?: string;
  certificateIssued?: boolean;
}

export interface QuizAttempt {
  quizId: string;
  courseSlug: string;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctCount: number;
  date: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'progress' | 'quiz' | 'streak' | 'mastery';
}

const STORAGE_KEYS = {
  ENROLLMENTS: 'devops_academy_enrollments',
  QUIZ_ATTEMPTS: 'devops_academy_quiz_attempts',
  STREAK: 'devops_academy_streak',
  NOTES: 'devops_academy_lesson_notes',
  BADGES: 'devops_academy_unlocked_badges',
};

// Default starter badges
export const ALL_BADGES: Badge[] = [
  { id: 'first_step', title: 'First Steps', description: 'Enrolled in your first DevOps course', icon: '🚀', category: 'progress' },
  { id: 'linux_scout', title: 'Shell Cadet', description: 'Completed 5 Linux command line lessons', icon: '🐧', category: 'progress' },
  { id: 'container_cadet', title: 'Docker Captain', description: 'Mastered container fundamentals', icon: '🐳', category: 'progress' },
  { id: 'k8s_navigator', title: 'K8s Pilot', description: 'Explored Kubernetes cluster architecture', icon: '☸️', category: 'mastery' },
  { id: 'quiz_whiz', title: 'Quiz Ace', description: 'Scored 100% on any assessment', icon: '🎯', category: 'quiz' },
  { id: 'streak_3', title: 'Consistency Champion', description: 'Maintained a 3-day learning streak', icon: '🔥', category: 'streak' },
  { id: 'certified_pro', title: 'Certified DevOps Hero', description: 'Earned your first verified certificate', icon: '🏆', category: 'mastery' },
];

export const lmsStore = {
  // --- ENROLLMENTS ---
  getEnrollments(): EnrollmentState[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
      if (!data) {
        // Provide starter active enrollment for Linux & Docker so dashboard is never empty
        const defaultEnrollments: EnrollmentState[] = [
          {
            courseId: 'course_linux_001',
            courseSlug: 'linux-fundamentals',
            enrolledAt: new Date(Date.now() - 3 * 86400000).toISOString(),
            progress: 13,
            completedLessons: ['linux_mod_01', 'linux_mod_02'],
            lastAccessedLessonId: 'linux_mod_03',
            lastAccessedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            courseId: 'course_docker_001',
            courseSlug: 'docker-mastery',
            enrolledAt: new Date(Date.now() - 6 * 86400000).toISOString(),
            progress: 7,
            completedLessons: ['dock_mod_01'],
            lastAccessedLessonId: 'dock_mod_02',
            lastAccessedAt: new Date(Date.now() - 86400000).toISOString(),
          }
        ];
        localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(defaultEnrollments));
        return defaultEnrollments;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  isEnrolled(courseSlug: string): boolean {
    const enrollments = this.getEnrollments();
    return enrollments.some(e => e.courseSlug === courseSlug);
  },

  enroll(courseId: string | number, courseSlug: string): EnrollmentState {
    const enrollments = this.getEnrollments();
    const existing = enrollments.find(e => e.courseSlug === courseSlug);
    if (existing) return existing;

    const newEnrollment: EnrollmentState = {
      courseId,
      courseSlug,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedLessons: [],
      lastAccessedAt: new Date().toISOString(),
    };

    enrollments.push(newEnrollment);
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
    this.unlockBadge('first_step');
    this.recordActivity();
    return newEnrollment;
  },

  getCourseProgress(courseSlug: string): EnrollmentState | null {
    const enrollments = this.getEnrollments();
    return enrollments.find(e => e.courseSlug === courseSlug) || null;
  },

  completeLesson(courseSlug: string, lessonId: string, totalLessonsInCourse: number): EnrollmentState {
    const enrollments = this.getEnrollments();
    let enrollment = enrollments.find(e => e.courseSlug === courseSlug);

    if (!enrollment) {
      enrollment = {
        courseId: courseSlug,
        courseSlug,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completedLessons: [],
      };
      enrollments.push(enrollment);
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    enrollment.progress = totalLessonsInCourse > 0 
      ? Math.min(100, Math.round((enrollment.completedLessons.length / totalLessonsInCourse) * 100))
      : 0;

    enrollment.lastAccessedLessonId = lessonId;
    enrollment.lastAccessedAt = new Date().toISOString();

    if (enrollment.progress >= 100) {
      enrollment.certificateIssued = true;
      this.unlockBadge('certified_pro');
    }

    if (courseSlug === 'linux-fundamentals' && enrollment.completedLessons.length >= 5) {
      this.unlockBadge('linux_scout');
    }
    if (courseSlug === 'docker-mastery' && enrollment.completedLessons.length >= 3) {
      this.unlockBadge('container_cadet');
    }

    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
    this.recordActivity();
    return enrollment;
  },

  toggleLesson(courseSlug: string, lessonId: string, totalLessonsInCourse: number): { completed: boolean; enrollment: EnrollmentState } {
    const enrollments = this.getEnrollments();
    let enrollment = enrollments.find(e => e.courseSlug === courseSlug);

    if (!enrollment) {
      enrollment = {
        courseId: courseSlug,
        courseSlug,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completedLessons: [],
      };
      enrollments.push(enrollment);
    }

    const index = enrollment.completedLessons.indexOf(lessonId);
    let completed = false;

    if (index >= 0) {
      // Remove lesson
      enrollment.completedLessons.splice(index, 1);
      completed = false;
    } else {
      // Add lesson
      enrollment.completedLessons.push(lessonId);
      completed = true;
    }

    enrollment.progress = totalLessonsInCourse > 0 
      ? Math.min(100, Math.round((enrollment.completedLessons.length / totalLessonsInCourse) * 100))
      : 0;

    enrollment.lastAccessedLessonId = lessonId;
    enrollment.lastAccessedAt = new Date().toISOString();
    enrollment.certificateIssued = enrollment.progress >= 100;

    if (completed) {
      if (enrollment.progress >= 100) {
        this.unlockBadge('certified_pro');
      }
      if (courseSlug === 'linux-fundamentals' && enrollment.completedLessons.length >= 5) {
        this.unlockBadge('linux_scout');
      }
      if (courseSlug === 'docker-mastery' && enrollment.completedLessons.length >= 3) {
        this.unlockBadge('container_cadet');
      }
      this.recordActivity();
    }

    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
    return { completed, enrollment };
  },

  // --- STREAK TRACKING ---
  getStreak(): { currentStreak: number; longestStreak: number; lastActiveDate: string } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (!data) {
        return { currentStreak: 3, longestStreak: 7, lastActiveDate: new Date().toISOString().split('T')[0] };
      }
      return JSON.parse(data);
    } catch {
      return { currentStreak: 3, longestStreak: 7, lastActiveDate: new Date().toISOString().split('T')[0] };
    }
  },

  recordActivity(): void {
    const today = new Date().toISOString().split('T')[0];
    const streak = this.getStreak();

    if (streak.lastActiveDate === today) {
      return; // Already recorded today
    }

    const lastDate = new Date(streak.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      streak.currentStreak += 1;
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
    } else if (diffDays > 1) {
      streak.currentStreak = 1;
    }

    streak.lastActiveDate = today;
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));

    if (streak.currentStreak >= 3) {
      this.unlockBadge('streak_3');
    }
  },

  // --- QUIZ SCORES & ATTEMPTS ---
  saveQuizAttempt(attempt: QuizAttempt): void {
    try {
      const attempts = this.getQuizAttempts();
      attempts.unshift(attempt);
      localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(attempts.slice(0, 30)));
      
      if (attempt.score === 100) {
        this.unlockBadge('quiz_whiz');
      }
      this.recordActivity();
    } catch (e) {
      console.error(e);
    }
  },

  getQuizAttempts(): QuizAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // --- BADGES ---
  getUnlockedBadges(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BADGES);
      return data ? JSON.parse(data) : ['first_step'];
    } catch {
      return ['first_step'];
    }
  },

  unlockBadge(badgeId: string): void {
    const unlocked = this.getUnlockedBadges();
    if (!unlocked.includes(badgeId)) {
      unlocked.push(badgeId);
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(unlocked));
    }
  },

  // --- LESSON NOTES ---
  saveNote(lessonId: string, content: string): void {
    try {
      const notes = this.getNotes();
      notes[lessonId] = content;
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  },

  getNotes(): Record<string, string> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getNote(lessonId: string): string {
    return this.getNotes()[lessonId] || '';
  }
};
