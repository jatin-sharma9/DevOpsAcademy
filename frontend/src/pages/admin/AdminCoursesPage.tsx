import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Eye, Star, Users, Loader2, Layers } from "lucide-react";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { cn, getLevelBadge } from "@/lib/utils";
import { toast } from "sonner";

import { COURSES } from "@/data/courses";

export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>(COURSES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await apiService.courses.getAll(false); // get all including drafts
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map(mapBackendCourseToFrontend);
        setCourses(mapped);
      } else {
        setCourses(COURSES);
      }
    } catch (err) {
      console.error("Error loading courses:", err);
      setCourses(COURSES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this course and all its lessons?")) return;
    try {
      const res = await apiService.courses.delete(id);
      if (res.success) {
        toast.success("Course deleted successfully!");
        fetchCourses();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete course");
    }
  };

  const togglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const res = await apiService.courses.togglePublish(id, !currentStatus);
      if (res.success) {
        toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
        fetchCourses();
      }
    } catch (err) {
      console.error("Publish toggle error:", err);
      toast.error("Failed to update publish status");
    }
  };

  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Courses</h1>
          <p className="text-muted-foreground text-sm">{courses.length} courses on platform</p>
        </div>
        <Link to="/admin/courses/add" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> New Course
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading courses list...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">Course</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Level</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Students</th>
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
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary text-xl shrink-0">
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
                  <td className="px-4 py-3 hidden lg:table-cell text-sm font-medium">
                    {course.price === 0 ? <span className="text-green-400">FREE</span> : `₹${course.price.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(Number(course.id), course.isPublished)} 
                      className={cn("px-2 py-0.5 text-[11px] font-medium rounded-full border cursor-pointer transition-colors", 
                        course.isPublished 
                          ? "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20" 
                          : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                      )}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/admin/lessons?courseId=${course.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-all"
                        title="Manage Course Curriculum Lessons"
                      >
                        <Layers className="w-3.5 h-3.5" /> Lessons
                      </Link>
                      <Link to={`/courses/${course.slug}`} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View Course Page"><Eye className="w-3.5 h-3.5" /></Link>
                      <button onClick={() => handleDelete(Number(course.id))} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete Course"><Trash2 className="w-3.5 h-3.5 cursor-pointer" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
