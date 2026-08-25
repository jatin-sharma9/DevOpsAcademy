import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, BookOpen, Layers, Check, ArrowLeft, Image, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AdminAddCoursePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [category, setCategory] = useState("Containerization");
  const [level, setLevel] = useState("Intermediate");
  const [price, setPrice] = useState("0");
  const [durationHours, setDurationHours] = useState("12");
  const [objectives, setObjectives] = useState<string[]>(["Master core concepts", "Deploy hands-on labs"]);
  const [newObj, setNewObj] = useState("");
  const [published, setPublished] = useState(true);

  const handleAddObjective = () => {
    if (!newObj.trim()) return;
    setObjectives([...objectives, newObj.trim()]);
    setNewObj("");
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Course title is required"); return; }
    toast.success(`Course "${title}" created successfully!`);
    navigate("/admin/courses");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/admin/courses")} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold">Add New Course</h1>
          <p className="text-muted-foreground text-sm">Create a new course with modules, objectives, and thumbnail.</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="OS & Shell">OS & Shell</option>
                <option value="Version Control">Version Control</option>
                <option value="Containerization">Containerization</option>
                <option value="Orchestration">Orchestration</option>
                <option value="Infrastructure as Code">Infrastructure as Code</option>
                <option value="CI/CD Pipelines">CI/CD Pipelines</option>
              </select>
            </div>

            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
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

        {/* Learning Objectives */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <h2 className="font-display font-semibold text-base">Learning Objectives</h2>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add objective (e.g. Build multi-stage Docker builds)"
              value={newObj}
              onChange={(e) => setNewObj(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="button"
              onClick={handleAddObjective}
              className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 font-semibold text-xs hover:bg-primary/20 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="space-y-2">
            {objectives.map((obj, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 text-xs">
                <span className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-secondary" /> {obj}
                </span>
                <button type="button" onClick={() => handleRemoveObjective(index)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
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
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}
