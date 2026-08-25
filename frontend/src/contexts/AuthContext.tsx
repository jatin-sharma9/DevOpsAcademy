import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sendEmailNotification } from "@/services/emailService";

export type UserRole = "admin" | "instructor" | "student";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  enrolledCourses?: string[];
  completedCourses?: string[];
  certificates?: string[];
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users database for demo
const MOCK_USERS: Record<string, User & { password: string }> = {
  "jatinsharma932002@gmail.com": {
    id: "usr_admin_default",
    username: "Jatin.Sharma93",
    email: "jatinsharma932002@gmail.com",
    password: "J@tinS93",
    role: "admin",
    avatar: "",
    bio: "Chief Platform Administrator & Lead DevOps Architect.",
    joinedAt: "2026-08-25",
  },
  "jatin.sharma93": {
    id: "usr_admin_default",
    username: "Jatin.Sharma93",
    email: "jatinsharma932002@gmail.com",
    password: "J@tinS93",
    role: "admin",
    avatar: "",
    bio: "Chief Platform Administrator & Lead DevOps Architect.",
    joinedAt: "2026-08-25",
  },
  "instructor@devops.academy": {
    id: "usr_inst_001",
    username: "jatin_sharma",
    email: "instructor@devops.academy",
    password: "instructor123",
    role: "instructor",
    avatar: "",
    bio: "Senior DevOps Engineer & Cloud Architect. AWS Certified.",
    joinedAt: "2024-02-15",
  },
  "student@devops.academy": {
    id: "usr_student_001",
    username: "devops_learner",
    email: "student@devops.academy",
    password: "student123",
    role: "student",
    avatar: "",
    bio: "Aspiring DevOps Engineer. Learning Kubernetes & Terraform.",
    enrolledCourses: ["linux-fundamentals", "docker-mastery", "kubernetes-in-action"],
    completedCourses: ["linux-fundamentals"],
    certificates: ["linux-fundamentals"],
    joinedAt: "2024-03-01",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("da-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("da-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 800));

    const key = identifier.toLowerCase();
    const mockUser = MOCK_USERS[key] || Object.values(MOCK_USERS).find(u => u.username.toLowerCase() === key);
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userData } = mockUser;
      setUser(userData);
      localStorage.setItem("da-user", JSON.stringify(userData));
      localStorage.setItem("da-token", `mock-jwt-${userData.id}`);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: data.username,
      email: data.email,
      role: data.role || "student",
      enrolledCourses: [],
      completedCourses: [],
      certificates: [],
      joinedAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem("da-user", JSON.stringify(newUser));
    localStorage.setItem("da-token", `mock-jwt-${newUser.id}`);

    // Trigger Admin Notification
    sendEmailNotification("user_registration", `🔔 New User Registered: ${newUser.username}`, {
      fullName: newUser.username,
      email: newUser.email,
      role: newUser.role,
      dateTime: new Date().toLocaleString(),
    });

    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("da-user");
    localStorage.removeItem("da-token");
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("da-user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
