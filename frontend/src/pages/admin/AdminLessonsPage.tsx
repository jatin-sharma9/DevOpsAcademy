import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Trash2, Edit2, Eye, Video, Terminal, Zap,
  BookOpen, Layers, Clock, ExternalLink, Filter, X, Check,
  Sparkles, RefreshCw, FileCode, CheckCircle2, AlertCircle, Loader2, Copy
} from "lucide-react";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { COURSES } from "@/data/courses";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import StandardLearningTemplate from "@/components/learning/StandardLearningTemplate";

const FIVE_PILLAR_STARTER_TEMPLATE = `### 💡 1. Theory & Core Concepts
- **Definition & Purpose**: Deep-dive explanation of the architectural component, its role in the DevOps lifecycle, and how it solves distributed systems challenges.
- **Mental Model**: Visual representation and conceptual foundation.
- **Key Terminology**:
  - **Component A**: Core processing unit.
  - **Component B**: State and persistence layer.

### 🏗️ 2. Real-World Architecture & Use Cases
\`\`\`
+-----------------------+      HTTPS       +-------------------------+
| Client / API Gateway  | --------------> | Ingress / Service Mesh  |
+-----------------------+                  +-------------------------+
                                                       |
                                            +----------v-----------+
                                            | Pod / Container Unit |
                                            +----------------------+
\`\`\`
- **Production Architecture**: High-availability clustering, failover strategies, and zero-downtime rolling updates.
- **Anti-Patterns**: What to avoid in production deployments.

### 💻 3. Practical Commands & Production Snippets
\`\`\`bash
# 1. Inspect cluster state and deployment health
kubectl get pods -A -o wide

# 2. Check real-time resource utilization
kubectl top nodes --use-protocol-buffers

# 3. Stream live diagnostic logs
kubectl logs -f -l app=production-service --tail=50
\`\`\`

### 🎯 4. Interview & Scenario Troubleshooting Q&A
- **Q: What happens when a container enters CrashLoopBackOff state and how do you triage it?**
  - **A:** CrashLoopBackOff indicates the container continuously terminates post-startup. Inspect exit codes via \`kubectl describe pod\`, verify liveness/readiness probes, and check application runtime logs for missing environment configurations or failed database connections.
- **Q: How do you implement automated rolling rollbacks during a canary failure?**
  - **A:** Using automated metric thresholds via Prometheus alerting rules coupled with Argo Rollbacks or Flagger to automatically abort canary weight increases.

### 🚀 5. Hands-on Production Lab Challenge
1. **Step 1**: Initialize configuration manifest in your working workspace.
2. **Step 2**: Apply deployment and service routing rules.
3. **Step 3**: Validate pod replication and test endpoint resiliency under simulated network jitter.
`;

export interface LessonItem {
  id: string | number;
  courseId: string | number;
  courseSlug: string;
  courseTitle: string;
  title: string;
  slug: string;
  section: string;
  duration: number;
  type: "video" | "lab" | "quiz" | "theory";
  youtubeUrl?: string;
  content: string;
  sortOrder: number;
}

export default function AdminLessonsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCourseId = searchParams.get("courseId") || "all";

  const [courses, setCourses] = useState<any[]>(COURSES);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>(initialCourseId);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    courseId: string | number;
    title: string;
    slug: string;
    section: string;
    duration: number;
    type: "video" | "lab" | "quiz" | "theory";
    youtubeUrl: string;
    content: string;
    sortOrder: number;
  }>({
    courseId: COURSES[0]?.id || "course_linux_001",
    title: "",
    slug: "",
    section: "Module 1: Architecture & Foundations",
    duration: 15,
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: FIVE_PILLAR_STARTER_TEMPLATE,
    sortOrder: 1,
  });

  // Load Courses and flatten initial lessons
  const loadData = async () => {
    try {
      setLoading(true);
      let loadedCourses = COURSES;

      try {
        const res = await apiService.courses.getAll(false);
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          loadedCourses = res.data.map(mapBackendCourseToFrontend);
        }
      } catch {
        // Backend offline, keep static courses
      }

      setCourses(loadedCourses);

      // Collect lessons from courses
      const allExtractedLessons: LessonItem[] = [];
      loadedCourses.forEach(c => {
        let order = 1;
        if (Array.isArray(c.sections)) {
          c.sections.forEach((sec: any) => {
            if (Array.isArray(sec.lessons)) {
              sec.lessons.forEach((l: any) => {
                allExtractedLessons.push({
                  id: l.id,
                  courseId: c.id,
                  courseSlug: c.slug,
                  courseTitle: c.title,
                  title: l.title,
                  slug: l.slug || String(l.id),
                  section: sec.title || "Module Curriculum",
                  duration: l.duration || 15,
                  type: l.type || "video",
                  youtubeUrl: l.youtubeUrl || "",
                  content: l.content || FIVE_PILLAR_STARTER_TEMPLATE,
                  sortOrder: l.sort_order || order++,
                });
              });
            }
          });
        }
      });

      setLessons(allExtractedLessons);
    } catch (err) {
      console.error("Failed to load lessons data:", err);
      toast.error("Failed to load course lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update selected course filter if URL changes
  useEffect(() => {
    const cid = searchParams.get("courseId");
    if (cid) {
      setSelectedCourseFilter(cid);
    }
  }, [searchParams]);

  // Handle open Create modal
  const handleOpenCreate = () => {
    setEditingLesson(null);
    const defaultCourse = selectedCourseFilter !== "all"
      ? courses.find(c => String(c.id) === String(selectedCourseFilter) || c.slug === selectedCourseFilter) || courses[0]
      : courses[0];

    setFormData({
      courseId: defaultCourse?.id || courses[0]?.id || 1,
      title: "",
      slug: "",
      section: "Module 1: Architecture & Foundations",
      duration: 15,
      type: "video",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      content: FIVE_PILLAR_STARTER_TEMPLATE,
      sortOrder: lessons.filter(l => String(l.courseId) === String(defaultCourse?.id)).length + 1,
    });
    setActiveEditorTab("write");
    setIsModalOpen(true);
  };

  // Handle open Edit modal
  const handleOpenEdit = (lesson: LessonItem) => {
    setEditingLesson(lesson);
    setFormData({
      courseId: lesson.courseId,
      title: lesson.title,
      slug: lesson.slug,
      section: lesson.section,
      duration: lesson.duration,
      type: lesson.type,
      youtubeUrl: lesson.youtubeUrl || "",
      content: lesson.content || FIVE_PILLAR_STARTER_TEMPLATE,
      sortOrder: lesson.sortOrder,
    });
    setActiveEditorTab("write");
    setIsModalOpen(true);
  };

  // Auto-generate slug when title changes in creation mode
  const handleTitleChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: !editingLesson ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : prev.slug,
    }));
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }

    try {
      setSaving(true);
      const targetCourse = courses.find(c => String(c.id) === String(formData.courseId) || c.slug === formData.courseId) || courses[0];

      if (editingLesson) {
        // Try backend update if numeric ID
        if (typeof targetCourse.id === "number" && typeof editingLesson.id === "number") {
          try {
            await apiService.lessons.update(Number(targetCourse.id), Number(editingLesson.id), {
              title: formData.title,
              slug: formData.slug,
              duration_minutes: formData.duration,
              content: formData.content,
              video_url: formData.youtubeUrl,
              sort_order: formData.sortOrder,
            });
          } catch {
            // Local fallback
          }
        }

        // Update in state
        setLessons(prev => prev.map(l => l.id === editingLesson.id ? {
          ...l,
          courseId: targetCourse.id,
          courseSlug: targetCourse.slug,
          courseTitle: targetCourse.title,
          title: formData.title,
          slug: formData.slug || String(l.id),
          section: formData.section,
          duration: Number(formData.duration),
          type: formData.type,
          youtubeUrl: formData.youtubeUrl,
          content: formData.content,
          sortOrder: Number(formData.sortOrder),
        } : l));

        toast.success(`Lesson "${formData.title}" updated successfully!`);
      } else {
        // Create new lesson
        const newId = `lesson_${Date.now()}`;
        if (typeof targetCourse.id === "number") {
          try {
            const res = await apiService.lessons.create(Number(targetCourse.id), {
              title: formData.title,
              slug: formData.slug || `lesson-${Date.now()}`,
              duration_minutes: formData.duration,
              content: formData.content,
              video_url: formData.youtubeUrl,
              sort_order: formData.sortOrder,
            });
            if (res.success && res.data?.id) {
              // use backend created id
            }
          } catch {
            // Local fallback
          }
        }

        const newLessonItem: LessonItem = {
          id: newId,
          courseId: targetCourse.id,
          courseSlug: targetCourse.slug,
          courseTitle: targetCourse.title,
          title: formData.title,
          slug: formData.slug || `lesson-${Date.now()}`,
          section: formData.section,
          duration: Number(formData.duration),
          type: formData.type,
          youtubeUrl: formData.youtubeUrl,
          content: formData.content,
          sortOrder: Number(formData.sortOrder),
        };

        setLessons(prev => [newLessonItem, ...prev]);
        toast.success(`New lesson "${formData.title}" created!`);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save lesson:", err);
      toast.error("Failed to save lesson");
    } finally {
      setSaving(false);
    }
  };

  // Delete Lesson
  const handleDelete = async (id: string | number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete lesson "${title}"? This cannot be undone.`)) return;

    try {
      setDeletingId(id);
      const lesson = lessons.find(l => l.id === id);
      if (lesson && typeof lesson.courseId === "number" && typeof id === "number") {
        try {
          await apiService.lessons.delete(Number(lesson.courseId), Number(id));
        } catch {
          // Local fallback
        }
      }

      setLessons(prev => prev.filter(l => l.id !== id));
      toast.success(`Lesson "${title}" deleted successfully.`);
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      toast.error("Failed to delete lesson");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered Lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const matchCourse = selectedCourseFilter === "all" ||
        String(l.courseId) === String(selectedCourseFilter) ||
        l.courseSlug === selectedCourseFilter;
      const matchType = typeFilter === "all" || l.type === typeFilter;
      const matchSearch = !searchQuery.trim() ||
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.section.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCourse && matchType && matchSearch;
    });
  }, [lessons, selectedCourseFilter, typeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Lesson Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage interactive curriculum modules, 5-pillar markdown content, and lab checkpoints
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            title="Refresh Lessons"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Lesson
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons by title, slug, or module..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Course Filter */}
        <div className="relative">
          <select
            value={selectedCourseFilter}
            onChange={e => {
              setSelectedCourseFilter(e.target.value);
              setSearchParams(e.target.value === "all" ? {} : { courseId: e.target.value });
            }}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer capitalize"
          >
            <option value="all">All Courses ({courses.length} Tracks)</option>
            {courses.map(c => (
              <option key={c.id || c.slug} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer capitalize"
          >
            <option value="all">All Lesson Types</option>
            <option value="video">Video & Theory</option>
            <option value="lab">Interactive Lab</option>
            <option value="quiz">Knowledge Check Quiz</option>
            <option value="theory">Architecture & Concept</option>
          </select>
        </div>
      </div>

      {/* Lessons Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading curriculum lessons...</p>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="p-12 rounded-3xl border border-border bg-card text-center space-y-4">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="font-bold text-base">No lessons found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No lessons match your current filters. Try changing your search query or create a new lesson.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" /> Create Lesson Now
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Lesson Title</th>
                  <th className="py-3 px-4 hidden md:table-cell">Course & Module</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Type</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Duration</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3.5 px-4 font-mono text-muted-foreground font-semibold">
                      #{lesson.sortOrder}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                          {lesson.type === "lab" ? <Terminal className="w-3.5 h-3.5" /> :
                           lesson.type === "quiz" ? <Zap className="w-3.5 h-3.5" /> :
                           <Video className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                            {lesson.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono truncate">
                            slug: {lesson.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <p className="font-medium text-foreground truncate max-w-[200px]">{lesson.courseTitle}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{lesson.section}</p>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize",
                        lesson.type === "lab" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        lesson.type === "quiz" ? "bg-accent/10 text-accent border-accent/20" :
                        "bg-primary/10 text-primary border-primary/20"
                      )}>
                        {lesson.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden lg:table-cell text-muted-foreground font-mono">
                      {lesson.duration} mins
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/learn/${lesson.courseSlug}?lesson=${lesson.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                          title="Preview in Student Studio"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleOpenEdit(lesson)}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="Edit Lesson"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(lesson.id, lesson.title)}
                          disabled={deletingId === lesson.id}
                          className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {filteredLessons.length} of {lessons.length} total lessons</span>
            <span>Course Track: {selectedCourseFilter === "all" ? "All Tracks" : selectedCourseFilter}</span>
          </div>
        </div>
      )}

      {/* ─── CREATE / EDIT LESSON MODAL ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl overflow-y-auto flex flex-col space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold font-display text-foreground">
                    {editingLesson ? "Edit Lesson Module" : "Create New Lesson"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {editingLesson ? `Modifying: ${editingLesson.title}` : "Add an interactive module to course curriculum"}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-5 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Target Course Track *
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                      required
                    >
                      {courses.map(c => (
                        <option key={c.id || c.slug} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Section / Module Name */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Module / Section Group *
                    </label>
                    <input
                      type="text"
                      value={formData.section}
                      onChange={e => setFormData({ ...formData, section: e.target.value })}
                      placeholder="e.g. Module 1: Architecture & Foundations"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lesson Title */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => handleTitleChange(e.target.value)}
                      placeholder="e.g. Kubernetes Pod Lifecycle & Architecture"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      URL Slug / Identifier *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. k8s-pod-lifecycle"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Lesson Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                    >
                      <option value="video">Video & Theory</option>
                      <option value="lab">Interactive Lab</option>
                      <option value="quiz">Knowledge Check Quiz</option>
                      <option value="theory">Architecture & Concept</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Estimated Duration (mins)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Sort Order Position
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.sortOrder}
                      onChange={e => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Embedded Video URL (YouTube / Loom)
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Content Editor with 5-Pillar Template Tool & Live Preview */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                    <div className="flex items-center gap-1 border border-border rounded-xl p-0.5 bg-muted/30">
                      <button
                        type="button"
                        onClick={() => setActiveEditorTab("write")}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          activeEditorTab === "write" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Markdown Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveEditorTab("preview")}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          activeEditorTab === "preview" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Live 5-Pillar Preview
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, content: FIVE_PILLAR_STARTER_TEMPLATE })}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Insert 5-Pillar Template
                    </button>
                  </div>

                  {activeEditorTab === "write" ? (
                    <textarea
                      rows={12}
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write markdown content adhering to the 5 standard pillars..."
                      className="w-full p-3.5 rounded-2xl border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                    />
                  ) : (
                    <div className="p-4 rounded-2xl border border-border bg-card max-h-96 overflow-y-auto">
                      <StandardLearningTemplate
                        lesson={{
                          id: formData.slug || "preview",
                          title: formData.title || "Lesson Preview",
                          content: formData.content,
                          duration: formData.duration,
                          type: formData.type,
                          youtubeUrl: formData.youtubeUrl,
                        }}
                        course={{
                          id: formData.courseId,
                          title: courses.find(c => String(c.id) === String(formData.courseId))?.title || "DevOps Track",
                          slug: courses.find(c => String(c.id) === String(formData.courseId))?.slug || "devops-track",
                        }}
                        isCompleted={false}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{editingLesson ? "Save Changes" : "Create Lesson"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
