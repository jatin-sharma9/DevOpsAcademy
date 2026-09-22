import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock, Eye, ArrowRight, Tag, Loader2 } from "lucide-react";
import { BLOG_POSTS, BlogPost } from "@/data/blog";
import { apiService } from "@/services/apiService";
import { formatDate, truncate } from "@/lib/utils";

const CATEGORIES = ["All", "Kubernetes", "Terraform", "CI/CD", "Linux", "Docker", "AWS", "Ansible", "DevOps"];

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const res = await apiService.blogs.getAll(true);
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
          }));
          setPosts(mapped);
        }
      } catch {
        // Fallback to static posts
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  const featured = posts.filter(p => p.featured);
  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase())));
    const matchCat = category === "All" || p.category.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold mb-3">DevOps <span className="gradient-text">Blog</span></h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Expert articles, tutorials, and best practices from the DevOps community.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 text-sm bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50" />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${category === cat ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Post */}
      {!search && category === "All" && featured[0] && (
        <div className="mb-12">
          <Link to={`/blog/${featured[0].slug}`}>
            <motion.div whileHover={{ scale: 1.01 }} className="p-8 rounded-3xl border border-border bg-gradient-to-br from-card via-primary/5 to-card hover:border-primary/30 transition-all group">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/15 text-primary border border-primary/25">{featured[0].category}</span>
                  <span className="text-xs text-muted-foreground">Featured</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 group-hover:text-primary transition-colors">{featured[0].title}</h2>
                <p className="text-muted-foreground mb-5 max-w-2xl">{featured[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{featured[0].author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured[0].readTimeMinutes} min read</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{featured[0].viewCount.toLocaleString()}</span>
                  <span>{formatDate(featured[0].publishedAt)}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link to={`/blog/${post.slug}`} className="block h-full">
              <div className="h-full p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group card-hover flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-primary/10 text-primary border border-primary/20">{post.category}</span>
                  {post.featured && <span className="text-[10px] text-yellow-400 font-medium">⭐ Featured</span>}
                </div>
                <h3 className="font-display font-bold text-sm leading-snug mb-2 group-hover:text-primary transition-colors flex-1">{post.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{truncate(post.excerpt, 120)}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {Array.isArray(post.tags) && post.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] font-mono rounded bg-muted text-muted-foreground"><Tag className="w-2.5 h-2.5 inline mr-0.5" />{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border mt-auto">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTimeMinutes} min</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.viewCount.toLocaleString()}</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No articles found. Try different keywords.</p>
        </div>
      )}
    </div>
  );
}
