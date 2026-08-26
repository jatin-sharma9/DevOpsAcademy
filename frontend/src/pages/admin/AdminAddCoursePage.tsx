import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/apiService";

export default function AdminAddCoursePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [category, setCategory] = useState("Containerization");
  const [level, setLevel] = useState("Intermediate");
  const [price, setPrice] = useState("0");
  const [durationHours, setDurationHours] = useState("12");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Course title is required");
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const courseData = {
      title,
      slug,
      shortDescription: shortDesc,
      description: shortDesc,
      category,
      level: level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
      price: Number(price),
      durationHours: Number(durationHours),
      isPublished: published,
      isPro: Number(price) > 0,
      isFeatured: false,
    };

    setLoading(true);
    try {
      const res = await apiService.courses.create(courseData);
      if (res.success) {
        toast.success(`Course "${title}" created successfully!`);
        navigate("/admin/courses");
      } else {
        toast.error("Failed to create course");
      }
    } catch (err: any) {
      console.error("Create course error:", err);
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/admin/courses")} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold">Add New Course</h1>
          <p className="text-muted-foreground text-sm">Create a new course with details and initial configuration.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <h2 className="font-display font-semibold text-base">Course Basic Info</h2>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Course Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Advanced Kubernetes GitOps & ArgoCD"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Short Description</label>
            <textarea
              rows={3}
              required
              placeholder="Provide a concise summary of what students will achieve..."
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Linux">Linux</option>
                <option value="Git">Git</option>
                <option value="Docker">Docker</option>
                <option value="Kubernetes">Kubernetes</option>
                <option value="CI/CD">CI/CD</option>
                <option value="IaC">IaC</option>
                <option value="Configuration Management">Configuration Management</option>
                <option value="Cloud">Cloud</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-medium text-muted-foreground">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-medium text-muted-foreground">Duration (Hours)</label>
              <input
                type="number"
                required
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-medium text-muted-foreground">Price (₹ 0 for Free)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Publish Control */}
        <div className="p-6 rounded-2xl border border-border bg-card flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Publish Immediately</p>
            <p className="text-xs text-muted-foreground">Make this course visible in public catalog upon saving.</p>
          </div>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Course...
            </>
          ) : (
            "Create Course"
          )}
        </button>
      </form>
    </div>
  );
}
