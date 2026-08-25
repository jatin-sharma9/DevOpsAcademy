import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit2, Trash2, Eye, Star, Users } from "lucide-react";
import { COURSES } from "@/data/courses";
import { cn, getLevelBadge } from "@/lib/utils";

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const filtered = COURSES.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Courses</h1>
          <p className="text-muted-foreground text-sm">{COURSES.length} courses on platform</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/30">
            <tr className="text-xs text-muted-foreground">
              <th className="text-left px-4 py-3 font-medium">Course</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Level</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Students</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Rating</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Price</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((course, i) => (
              <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center text-white/40 text-xl shrink-0`}>
                      {course.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={cn("px-2 py-0.5 text-[11px] font-semibold rounded-full border capitalize", getLevelBadge(course.level))}>{course.level}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-1 text-sm"><Users className="w-3.5 h-3.5 text-muted-foreground" />{course.totalStudents.toLocaleString()}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-1 text-sm"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{course.rating}</div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-sm font-medium">
                  {course.price === 0 ? <span className="text-green-400">FREE</span> : `₹${course.price.toLocaleString()}`}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-secondary/10 text-secondary border border-secondary/20">Published</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
