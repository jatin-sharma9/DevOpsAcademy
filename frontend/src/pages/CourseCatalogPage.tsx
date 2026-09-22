import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Loader2, Sparkles } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { CATEGORIES, COURSES } from "@/data/courses";
import { cn } from "@/lib/utils";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";

const LEVELS = ["All", "beginner", "intermediate", "advanced"];
const PRICE_FILTERS = ["All", "Free", "Paid"];

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [price, setPrice] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await apiService.courses.getAll(true); // fetch published courses
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(mapBackendCourseToFrontend);
          setCourses(mapped);
        } else {
          // Backend returned empty data, use static fallback
          setCourses(COURSES as any[]);
        }
      } catch (err) {
        console.error("Error loading courses from API, using local data:", err);
        // Fallback to static course data when backend is unavailable
        setCourses(COURSES as any[]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === "All" || c.category === category;
      const matchLevel = level === "All" || c.level === level;
      const matchPrice = price === "All" || (price === "Free" ? c.price === 0 : c.price > 0);
      return matchSearch && matchCat && matchLevel && matchPrice;
    });
  }, [courses, search, category, level, price]);

  const resetFilters = () => { setSearch(""); setCategory("All"); setLevel("All"); setPrice("All"); };
  const hasFilters = search || category !== "All" || level !== "All" || price !== "All";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold mb-2">Course <span className="gradient-text">Catalog</span></h1>
        <p className="text-muted-foreground">Explore expert-led DevOps courses. Filter by topic, level, and price.</p>
      </div>

      {/* Standard Learning Framework Banner */}
      <div className="mb-8 p-5 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-card to-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/30">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              DevOps Academy Standard Learning Framework
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono font-normal">All 9 Courses</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Every course is built on our standardized 11-pillar model: Theory, ASCII Architecture, CLI Commands, Practical Labs, Outage Runbooks, and Staff Interview Q&A.
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0">
          <span className="px-2.5 py-1 rounded-lg bg-muted/60 border border-border">100% Free</span>
          <span className="px-2.5 py-1 rounded-lg bg-muted/60 border border-border">Verifiable Certificate</span>
        </div>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" placeholder="Search courses, topics..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn("flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors", showFilters ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
        </button>
        {hasFilters && (
          <button onClick={resetFilters} className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl border border-border hover:bg-muted transition-colors">
            Reset
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-5 rounded-2xl border border-border bg-card space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2.5">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={cn("px-3 py-1 text-sm rounded-lg border transition-colors", category === cat ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-muted-foreground/40 text-muted-foreground")}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2.5">Level</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((l) => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={cn("px-3 py-1 text-sm rounded-lg border transition-colors capitalize", level === l ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-muted-foreground/40 text-muted-foreground")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2.5">Price</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_FILTERS.map((p) => (
                  <button key={p} onClick={() => setPrice(p)}
                    className={cn("px-3 py-1 text-sm rounded-lg border transition-colors", price === p ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-muted-foreground/40 text-muted-foreground")}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Tabs (quick) */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={cn("shrink-0 px-4 py-1.5 text-sm font-medium rounded-full border transition-colors", category === cat ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted")}>
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{filtered.length}</span> courses found</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Loading course catalog...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((course, i) => <CourseCard key={course.id} course={course} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No courses found</h3>
          <p className="text-muted-foreground text-sm mb-4">Try adjusting your search or filters.</p>
          <button onClick={resetFilters} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground">Reset Filters</button>
        </div>
      )}
    </div>
  );
}
