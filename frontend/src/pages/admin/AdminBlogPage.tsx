import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Trash2, Edit2, Eye, Calendar, Clock, Star,
  CheckCircle2, RefreshCw, X, Check, FileText, Tag, Image,
  ExternalLink, Sparkles, Loader2, BookOpen, AlertCircle
} from "lucide-react";
import { BLOG_POSTS, BlogPost } from "@/data/blog";
import { apiService } from "@/services/apiService";
import { formatDate, truncate, cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = ["All", "Kubernetes", "Terraform", "CI/CD", "Linux", "Docker", "AWS", "Ansible", "Security", "DevOps"];

const STARTER_BLOG_TEMPLATE = `## Executive Summary
A concise, high-level summary of the architectural pattern, operational benefits, and enterprise implementation guide.

## Key Challenges Solved
- **Scalability Bottlenecks**: How this approach eliminates infrastructure drift and enhances horizontal auto-scaling.
- **Security & Compliance**: Hardening secrets management, RBAC enforcement, and zero-trust perimeter network rules.

## Production Implementation Guide

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: enterprise-app
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: enterprise-app
  template:
    metadata:
      labels:
        app: enterprise-app
    spec:
      containers:
      - name: web
        image: devops-academy/service:v2.4
        ports:
        - containerPort: 8080
\`\`\`

## Best Practices & Anti-Patterns
1. **Always use immutable tags**: Avoid \`:latest\` tags in production release manifests.
2. **Implement automated canary rollouts**: Reduce blast radius using metric-driven health checks.
3. **Monitor latency SLAs**: Alert on p99 latency spikes and error budgets.

## Conclusion & Next Steps
By following these patterns, engineering teams achieve predictable deployments, 99.99% uptime SLAs, and seamless disaster recovery readiness.
`;

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: STARTER_BLOG_TEMPLATE,
    category: "DevOps",
    tags: "Kubernetes, DevOps, Best Practices",
    author: "Jatin Sharma",
    authorTitle: "Senior DevOps Engineer",
    readTimeMinutes: 6,
    coverImage: "",
    featured: false,
    isPublished: true,
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await apiService.blogs.getAll(false);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((b: any) => ({
          id: b.id,
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt || '',
          content: b.content || '',
          category: b.category || 'DevOps',
          tags: Array.isArray(b.tags) ? b.tags : typeof b.tags === 'string' ? b.tags.split(',') : [],
          author: b.author_name || 'Jatin Sharma',
          authorTitle: b.author_title || 'Senior DevOps Engineer',
          publishedAt: b.created_at || new Date().toISOString(),
          readTimeMinutes: b.read_time_minutes || 5,
          viewCount: b.view_count || 0,
          featured: !!b.is_featured,
          isPublished: b.is_published !== undefined ? !!b.is_published : true,
        }));
        setPosts(mapped);
      } else {
        setPosts(BLOG_POSTS.map(p => ({ ...p, isPublished: true })));
      }
    } catch {
      // Backend offline: keep local posts
      setPosts(BLOG_POSTS.map(p => ({ ...p, isPublished: true })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: STARTER_BLOG_TEMPLATE,
      category: "DevOps",
      tags: "Kubernetes, CI/CD, Production",
      author: "Jatin Sharma",
      authorTitle: "Senior DevOps Engineer",
      readTimeMinutes: 6,
      coverImage: "",
      featured: false,
      isPublished: true,
    });
    setActiveEditorTab("write");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content || STARTER_BLOG_TEMPLATE,
      category: post.category || "DevOps",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
      author: post.author || "Jatin Sharma",
      authorTitle: post.authorTitle || "Senior DevOps Engineer",
      readTimeMinutes: post.readTimeMinutes || 5,
      coverImage: post.coverImage || "",
      featured: !!post.featured,
      isPublished: post.isPublished !== undefined ? !!post.isPublished : true,
    });
    setActiveEditorTab("write");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: !editingPost ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : prev.slug,
    }));
  };

  const handleContentChange = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const estTime = Math.max(1, Math.ceil(words / 180));
    setFormData(prev => ({
      ...prev,
      content,
      readTimeMinutes: estTime,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    try {
      setSaving(true);
      const tagArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);

      if (editingPost) {
        // Update
        if (typeof editingPost.id === "number") {
          try {
            await apiService.blogs.update(editingPost.id, {
              title: formData.title,
              slug: formData.slug,
              excerpt: formData.excerpt,
              content: formData.content,
              category: formData.category,
              tags: tagArray,
              authorName: formData.author,
              authorTitle: formData.authorTitle,
              readTimeMinutes: formData.readTimeMinutes,
              isFeatured: formData.featured,
              isPublished: formData.isPublished,
            });
          } catch {}
        }

        setPosts(prev => prev.map(p => p.id === editingPost.id ? {
          ...p,
          title: formData.title,
          slug: formData.slug || p.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          tags: tagArray,
          author: formData.author,
          authorTitle: formData.authorTitle,
          readTimeMinutes: formData.readTimeMinutes,
          featured: formData.featured,
          isPublished: formData.isPublished,
        } : p));

        toast.success(`Article "${formData.title}" updated!`);
      } else {
        // Create
        const newId = `blog_${Date.now()}`;
        try {
          const res = await apiService.blogs.create({
            title: formData.title,
            slug: formData.slug || `blog-${Date.now()}`,
            excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
            content: formData.content,
            category: formData.category,
            tags: tagArray,
            authorName: formData.author,
            authorTitle: formData.authorTitle,
            readTimeMinutes: formData.readTimeMinutes,
            isFeatured: formData.featured,
            isPublished: formData.isPublished,
          });
          if (res.success && res.data) {
            // Success backend
          }
        } catch {}

        const newPost = {
          id: newId,
          slug: formData.slug || `blog-${Date.now()}`,
          title: formData.title,
          excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
          content: formData.content,
          category: formData.category,
          tags: tagArray,
          author: formData.author,
          authorTitle: formData.authorTitle,
          publishedAt: new Date().toISOString(),
          readTimeMinutes: formData.readTimeMinutes,
          viewCount: 0,
          featured: formData.featured,
          isPublished: formData.isPublished,
        };

        setPosts(prev => [newPost, ...prev]);
        toast.success(`New article "${formData.title}" published!`);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Save blog error:", err);
      toast.error("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete article "${title}"? This cannot be undone.`)) return;

    try {
      setDeletingId(id);
      if (typeof id === "number") {
        try {
          await apiService.blogs.delete(id);
        } catch {}
      }
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success(`Article "${title}" deleted.`);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete article");
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublishStatus = async (post: any) => {
    const nextStatus = !post.isPublished;
    try {
      if (typeof post.id === "number") {
        await apiService.blogs.togglePublish(post.id, nextStatus);
      }
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isPublished: nextStatus } : p));
      toast.success(`Article ${nextStatus ? "Published" : "Moved to Drafts"}`);
    } catch {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isPublished: nextStatus } : p));
      toast.success(`Article ${nextStatus ? "Published" : "Moved to Drafts"}`);
    }
  };

  const toggleFeaturedStatus = async (post: any) => {
    const nextStatus = !post.featured;
    try {
      if (typeof post.id === "number") {
        await apiService.blogs.toggleFeatured(post.id, nextStatus);
      }
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, featured: nextStatus } : p));
      toast.success(`Article ${nextStatus ? "marked as Featured ⭐" : "unmarked as Featured"}`);
    } catch {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, featured: nextStatus } : p));
      toast.success(`Article ${nextStatus ? "marked as Featured ⭐" : "unmarked as Featured"}`);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchCat = categoryFilter === "All" || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchSearch = !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase())));
      return matchCat && matchSearch;
    });
  }, [posts, categoryFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground text-sm">
            Publish, edit, and manage technical DevOps articles, case studies, and tutorials
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBlogs}
            className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            title="Refresh Articles"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles by title, tags, or slug..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-xl border font-medium transition-colors cursor-pointer",
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading articles database...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 rounded-3xl border border-border bg-card text-center space-y-4">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="font-bold text-base">No articles found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No articles match your search criteria. Create your first post now.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" /> Create Article
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Article Title</th>
                  <th className="py-3 px-4 hidden md:table-cell">Category</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Views</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFeaturedStatus(post)}
                            title={post.featured ? "Featured (Click to unset)" : "Set as Featured"}
                            className={cn(
                              "p-1 rounded-md transition-colors cursor-pointer",
                              post.featured ? "text-yellow-400 hover:bg-yellow-400/10" : "text-muted-foreground/40 hover:text-yellow-400"
                            )}
                          >
                            <Star className={cn("w-3.5 h-3.5", post.featured && "fill-yellow-400")} />
                          </button>
                          <p className="font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                            {post.title}
                          </p>
                        </div>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-2 pl-6">
                          <span>{post.readTimeMinutes} min read</span>
                          <span>·</span>
                          <span>by {post.author}</span>
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                        {post.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden lg:table-cell font-mono text-muted-foreground">
                      {post.viewCount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell text-muted-foreground">
                      {formatDate(post.publishedAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => togglePublishStatus(post)}
                        className={cn(
                          "px-2.5 py-0.5 text-[10px] font-semibold rounded-full border cursor-pointer transition-colors",
                          post.isPublished !== false
                            ? "bg-secondary/15 text-secondary border-secondary/30 hover:bg-secondary/25"
                            : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                        )}
                      >
                        {post.isPublished !== false ? "Published" : "Draft"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                          title="View Live Article"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletingId === post.id}
                          className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          title="Delete Article"
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
            <span>Showing {filteredPosts.length} of {posts.length} articles</span>
            <span>Active Filter: {categoryFilter}</span>
          </div>
        </div>
      )}

      {/* ─── CREATE / EDIT MODAL ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl overflow-y-auto flex flex-col space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold font-display text-foreground">
                    {editingPost ? "Edit Technical Article" : "Compose New Article"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {editingPost ? `Modifying: ${editingPost.title}` : "Write and publish a new engineering tutorial"}
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
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => handleTitleChange(e.target.value)}
                      placeholder="e.g. Production GitOps with ArgoCD & Kubernetes"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. production-gitops-argocd"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                    >
                      {CATEGORIES.filter(c => c !== "All").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      placeholder="e.g. Jatin Sharma"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  {/* Read Time */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Est. Read Time (mins)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.readTimeMinutes}
                      onChange={e => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Article Summary / Excerpt *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Short description shown on blog cards and social search snippets..."
                    className="w-full p-3 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g. Kubernetes, GitOps, CI/CD, Production"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Markdown Editor & Live Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-border pb-2">
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
                        Live Article Preview
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleContentChange(STARTER_BLOG_TEMPLATE)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Insert Starter Template
                    </button>
                  </div>

                  {activeEditorTab === "write" ? (
                    <textarea
                      rows={12}
                      value={formData.content}
                      onChange={e => handleContentChange(e.target.value)}
                      placeholder="Write full markdown article here..."
                      className="w-full p-3.5 rounded-2xl border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                    />
                  ) : (
                    <div className="p-5 rounded-2xl border border-border bg-card max-h-96 overflow-y-auto prose prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
                      {formData.content.split("\n\n").map((para, i) => {
                        if (para.startsWith("## ")) return <h2 key={i} className="text-lg font-bold text-foreground mt-4 mb-2">{para.slice(3)}</h2>;
                        if (para.startsWith("### ")) return <h3 key={i} className="text-base font-semibold text-foreground mt-3 mb-1">{para.slice(4)}</h3>;
                        if (para.startsWith("```")) {
                          return <pre key={i} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">{para.replace(/```[a-z]*/g, "")}</pre>;
                        }
                        if (para.startsWith("- ")) {
                          const items = para.split("\n").filter(l => l.startsWith("- "));
                          return <ul key={i} className="space-y-1 list-disc pl-4">{items.map((item, j) => <li key={j}>{item.slice(2)}</li>)}</ul>;
                        }
                        return <p key={i}>{para}</p>;
                      })}
                    </div>
                  )}
                </div>

                {/* Flags */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                    />
                    <span>Feature on Homepage / Top Banner ⭐</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                    />
                    <span>Publish Immediately</span>
                  </label>
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
                    <span>{editingPost ? "Save Changes" : "Publish Article"}</span>
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
