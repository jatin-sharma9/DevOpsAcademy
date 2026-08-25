import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DA-${year}-${rand}`;
}

export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

export function getRoleBadge(role: string) {
  switch (role) {
    case "admin":
      return { label: "Admin", class: "bg-red-500/15 text-red-400 border-red-500/30" };
    case "instructor":
      return { label: "Instructor", class: "bg-accent/15 text-accent border-accent/30" };
    default:
      return { label: "Student", class: "bg-primary/15 text-primary border-primary/30" };
  }
}

export function getLevelBadge(level: string) {
  switch (level) {
    case "beginner":
      return "badge-beginner";
    case "intermediate":
      return "badge-intermediate";
    case "advanced":
      return "badge-advanced";
    default:
      return "badge-beginner";
  }
}
