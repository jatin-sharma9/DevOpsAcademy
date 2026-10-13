import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Eye, Calendar, Tag, Share2, Loader2 } from "lucide-react";
import { getBlogBySlug, BLOG_POSTS } from "@/data/blog";
import { apiService } from "@/services/apiService";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        // 1. Try static fallback first
        const staticPost = getBlogBySlug(slug);
        if (staticPost) setPost(staticPost);

        // 2. Fetch from backend API
        try {
          const res = await apiService.blogs.getBySlug(slug);
          if (res.success && res.data) {
            const b = res.data;
            setPost({
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
              viewCount: (b.view_count || 0) + 1,
              featured: !!b.is_featured,
            });
          }
        } catch {
          // Backend offline, keep static post
        }
      } catch (err) {
        console.error("Error loading blog post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const related = BLOG_POSTS.filter(p => p.slug !== slug && p.category === post?.category).slice(0, 3);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Loading technical article...</p>
      </div>
    );
  }

  if (!post) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center"><h2 className="text-xl font-bold mb-2">Post not found</h2><Link to="/blog" className="text-primary">Back to blog</Link></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Article */}
        <article className="lg:col-span-3 space-y-8">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{post.category}</span>
              {post.featured && <span className="text-xs text-yellow-400 font-medium">⭐ Featured</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight">{post.title}</h1>
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-black">{post.author.charAt(0)}</div>
                <div>
                  <p className="font-medium text-foreground text-xs">{post.author}</p>
                  <p className="text-[10px]">{post.authorTitle}</p>
                </div>
              </div>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTimeMinutes} min read</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.viewCount.toLocaleString()} views</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
            {(post.content || '').split('\n\n').map((para: string, i: number) => {
              if (para.startsWith('## ')) return <h2 key={i} className="text-xl font-display font-bold text-foreground mt-6 mb-3">{para.slice(3)}</h2>;
              if (para.startsWith('### ')) return <h3 key={i} className="text-lg font-display font-semibold text-foreground mt-5 mb-2">{para.slice(4)}</h3>;
              if (para.startsWith('- ')) {
                const items = para.split('\n').filter((l: string) => l.startsWith('- '));
                return <ul key={i} className="space-y-1.5 list-none">{items.map((item: string, j: number) => <li key={j} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />{item.slice(2)}</li>)}</ul>;
              }
              return <p key={i}>{para}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-5 border-t border-border">
            {Array.isArray(post.tags) && post.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-muted border border-border text-muted-foreground">
                <Tag className="w-3 h-3" />{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="p-4 rounded-2xl border border-border bg-card space-y-4 sticky top-24">
            <h3 className="font-display font-semibold text-sm">Related Articles</h3>
            {related.length > 0 ? related.map(r => (
              <Link key={r.slug} to={`/blog/${r.slug}`} className="block group">
                <div className="p-3 rounded-xl hover:bg-muted transition-colors">
                  <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2 mb-1">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{r.readTimeMinutes} min</p>
                </div>
              </Link>
            )) : <p className="text-xs text-muted-foreground">No related articles</p>}

            <div className="pt-3 border-t border-border">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Article link copied to clipboard!");
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Article
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
