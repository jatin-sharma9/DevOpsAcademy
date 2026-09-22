import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, BookOpen, FileText } from "lucide-react";
import { COURSES } from "@/data/courses";
import { BLOG_POSTS } from "@/data/blog";
import CourseCard from "@/components/courses/CourseCard";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { Loader2 } from "lucide-react";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [tab, setTab] = useState<"courses" | "blog">("courses");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await apiService.courses.getAll(true);
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCourses(res.data.map(mapBackendCourseToFrontend));
        } else {
          setCourses(COURSES);
        }
      } catch (err) {
        console.error("Error loading search courses, falling back to static:", err);
        setCourses(COURSES);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const matchedCourses = courses.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.tags.some((t: string) => t.toLowerCase().includes(query.toLowerCase())) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedPosts = BLOG_POSTS.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const total = matchedCourses.length + matchedPosts.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <Search className="w-4 h-4" />
          <span>Search results for <span className="font-semibold text-foreground">"{query}"</span></span>
        </div>
        <h1 className="text-2xl font-display font-bold">{loading ? "Searching..." : `${total} results found`}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit mb-8">
        {([["courses", BookOpen, loading ? 0 : matchedCourses.length], ["blog", FileText, matchedPosts.length]] as const).map(([id, Icon, count]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === id ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Icon className="w-3.5 h-3.5" />{id} ({count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Searching courses...</p>
        </div>
      ) : tab === "courses" ? (
        matchedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {matchedCourses.map((course, i) => <CourseCard key={course.id} course={course} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No courses match your search.</p>
            <Link to="/courses" className="text-primary hover:underline text-sm mt-2 block">Browse all courses</Link>
          </div>
        )
      ) : (
        matchedPosts.length > 0 ? (
          <div className="space-y-4">
            {matchedPosts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <div className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[11px] rounded-full bg-primary/10 text-primary border border-primary/20">{post.category}</span>
                  </div>
                  <h3 className="font-display font-semibold mb-1 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No blog posts match your search.</p>
          </div>
        )
      )}
    </div>
  );
}
