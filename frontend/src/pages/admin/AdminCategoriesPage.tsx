import React, { useState, useEffect } from "react";
import { FolderTree, Plus, Edit2, Trash2, X, Check, Search, BookOpen, Layers, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CategoryItem {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "1", name: "Operating Systems & Shell", slug: "os-shell", description: "Linux command line, bash scripting, kernel debugging, and system administration.", count: 4 },
  { id: "2", name: "Version Control", slug: "version-control", description: "Git branching strategies, monorepo management, and code review automation.", count: 3 },
  { id: "3", name: "Containerization", slug: "containerization", description: "Docker daemon, multi-stage builds, rootless containers, and image optimization.", count: 6 },
  { id: "4", name: "Orchestration & Kubernetes", slug: "orchestration", description: "K8s cluster architecture, Helm, ingress controllers, operators, and stateful workloads.", count: 8 },
  { id: "5", name: "Infrastructure as Code", slug: "iac", description: "Terraform HCL, state management, provider configuration, and Terragrunt workflows.", count: 5 },
  { id: "6", name: "CI/CD Automation", slug: "cicd", description: "GitHub Actions, Jenkins pipelines, automated testing gates, and canary releases.", count: 5 },
  { id: "7", name: "Cloud & AWS", slug: "aws", description: "VPC networking, IAM policies, EKS clusters, ECS services, and cost optimization.", count: 6 },
  { id: "8", name: "Observability & SRE", slug: "sre", description: "Prometheus metrics, Grafana dashboards, OpenTelemetry, and incident management.", count: 4 },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    count: 0,
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await apiService.categories.getAll();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCategories(res.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          count: c.count || 0,
        })));
      }
    } catch (err) {
      console.error("Failed to load categories from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "", count: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      count: cat.count,
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: !editingCategory ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : prev.slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      if (editingCategory) {
        await apiService.categories.update(editingCategory.id, {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        });
        toast.success(`Category "${formData.name}" updated!`);
      } else {
        await apiService.categories.create({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        });
        toast.success(`New category "${formData.name}" created!`);
      }
      await loadCategories();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleDelete = async (id: string | number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await apiService.categories.delete(id);
      toast.success(`Category "${name}" deleted.`);
      await loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Category Management</h1>
          <p className="text-muted-foreground text-sm">Organize courses into structured learning domains and certification tracks.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cat => (
          <div key={cat.id} className="p-5 rounded-2xl border border-border bg-card space-y-3 hover:border-primary/40 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-primary/10 text-primary border border-primary/20">
                  {cat.slug}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {cat.count} Tracks
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-foreground">{cat.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{cat.description}</p>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-1.5">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Edit Category"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                title="Delete Category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── ADD/EDIT CATEGORY MODAL ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base font-display text-foreground">
                  {editingCategory ? "Edit Learning Category" : "Add New Category"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="e.g. Infrastructure as Code"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. iac"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief summary of skills and topics in this domain..."
                    className="w-full p-3 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
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
