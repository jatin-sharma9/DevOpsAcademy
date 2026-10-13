import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiService } from "@/services/apiService";

export type UserRole = "admin" | "instructor" | "student" | "user";

export interface User {
  id: number | string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  joinedAt?: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<AuthResult>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem("da-token");
      const storedUser = localStorage.getItem("da-user");

      if (token && storedUser) {
        try {
          // Verify with backend to get latest user info
          const data = await apiService.auth.getMe();
          if (data.success && data.user) {
            const mappedUser: User = {
              ...data.user,
              role: data.user.role === "user" ? "student" : data.user.role
            };
            setUser(mappedUser);
            localStorage.setItem("da-user", JSON.stringify(mappedUser));
          } else {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Failed to restore session from server:", error);
          // Fall back to localStorage if offline, or log out if explicitly unauthenticated
          setUser(JSON.parse(storedUser));
        }
      }
      setIsLoading(false);
    };

    fetchSession();
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const payload: { email?: string; username?: string; password?: string } = { password };
      if (emailOrUsername.includes("@")) {
        payload.email = emailOrUsername;
      } else {
        payload.username = emailOrUsername;
      }

      const data = await apiService.auth.login(payload);
      if (data.success && data.token && data.user) {
        const mappedUser: User = {
          ...data.user,
          role: data.user.role === "user" ? "student" : data.user.role
        };
        setUser(mappedUser);
        localStorage.setItem("da-token", data.token);
        localStorage.setItem("da-user", JSON.stringify(mappedUser));
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Login API error:", error);
    }
    setIsLoading(false);
    return false;
  };

  const register = async (data: RegisterData): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      // Backend expects role 'user' instead of 'student'
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role === "student" ? "user" : data.role
      };

      const resData = await apiService.auth.register(payload);
      if (resData.success && resData.token && resData.user) {
        const mappedUser: User = {
          ...resData.user,
          role: resData.user.role === "user" ? "student" : resData.user.role
        };
        setUser(mappedUser);
        localStorage.setItem("da-token", resData.token);
        localStorage.setItem("da-user", JSON.stringify(mappedUser));
        setIsLoading(false);
        return { success: true, message: resData.message, user: mappedUser };
      }
      setIsLoading(false);
      return { success: false, message: resData.message || "Registration failed" };
    } catch (error: any) {
      console.error("Registration API error:", error);
      const safeMessage =
        error?.response?.data?.message ||
        (error?.message === "Network Error"
          ? "Unable to connect to the backend server. Please verify the server is running."
          : "Registration failed. Please try again.");
      setIsLoading(false);
      return { success: false, message: safeMessage };
    }
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
