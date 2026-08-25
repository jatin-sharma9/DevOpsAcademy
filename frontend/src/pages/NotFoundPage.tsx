import React from "react";
import { Link } from "react-router-dom";
import { Terminal, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl font-bold font-mono">
          404
        </div>
        <h1 className="text-3xl font-display font-bold">Page Not Found</h1>
        <p className="text-muted-foreground text-sm">
          The page or resource you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link
            to="/courses"
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
