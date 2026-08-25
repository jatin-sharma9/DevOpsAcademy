import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, BookOpen, Award, Edit2, Save, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { COURSES } from "@/data/courses";
import { formatDate, getRoleBadge } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [username, setUsername] = useState(user?.username || "");

  const enrolledCourses = COURSES.filter(c => user?.enrolledCourses?.includes(c.slug));
  const roleBadge = getRoleBadge(user?.role || "student");

  const handleSave = () => {
    updateUser({ bio, username });
    toast.success("Profile updated!");
    setEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <h1 className="text-2xl font-display font-bold">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl border border-border bg-card space-y-5">
          {/* Avatar */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-black mx-auto mb-3">
              {user?.username?.charAt(0)?.toUpperCase()}
            </div>
            <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border", roleBadge.class)}>
              {roleBadge.label}
            </span>
          </div>

          {/* Info */}
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={() => setEditing(false)} className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border text-xs">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><User className="w-4 h-4 shrink-0" />{user?.username}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4 shrink-0" />{user?.email}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4 shrink-0" />Joined {user?.joinedAt ? formatDate(user.joinedAt) : "—"}</div>
              </div>
              {user?.bio && <p className="text-xs text-muted-foreground leading-relaxed">{user.bio}</p>}
              <button onClick={() => setEditing(true)} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </>
          )}
        </motion.div>

        {/* Stats + Courses */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Enrolled", value: user?.enrolledCourses?.length || 0, icon: BookOpen, color: "text-primary" },
              { label: "Completed", value: user?.completedCourses?.length || 0, icon: Award, color: "text-secondary" },
              { label: "Certificates", value: user?.certificates?.length || 0, icon: Award, color: "text-yellow-400" },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-xl border border-border bg-card text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Enrolled Courses */}
          <div className="p-5 rounded-2xl border border-border bg-card">
            <h2 className="font-display font-semibold text-sm mb-4">Enrolled Courses</h2>
            {enrolledCourses.length > 0 ? (
              <div className="space-y-3">
                {enrolledCourses.map(course => (
                  <Link key={course.id} to={`/courses/${course.slug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group">
                    <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white/30 text-xl shrink-0", course.color)}>{course.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{course.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{course.level} · {course.durationHours}h</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No courses enrolled yet.</p>
                <Link to="/courses" className="text-primary text-sm hover:underline">Browse courses</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
