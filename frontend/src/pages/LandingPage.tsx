import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Play, Terminal, CheckCircle2, Star, Users, BookOpen,
  Trophy, Zap, Shield, Code, BarChart3, Clock, Award
} from "lucide-react";
import {
  SiLinux, SiDocker, SiKubernetes, SiTerraform, SiAnsible,
  SiJenkins, SiGit
} from "react-icons/si";
import { motion as m } from "framer-motion";
import CourseCard from "@/components/courses/CourseCard";
import { COURSES } from "@/data/courses";

const TOOLS = [
  { icon: SiLinux, name: "Linux", color: "text-orange-400" },
  { icon: SiGit, name: "Git", color: "text-red-400" },
  { icon: SiDocker, name: "Docker", color: "text-blue-400" },
  { icon: SiKubernetes, name: "Kubernetes", color: "text-blue-500" },
  { icon: SiJenkins, name: "Jenkins", color: "text-red-500" },
  { icon: SiTerraform, name: "Terraform", color: "text-purple-400" },
  { icon: SiAnsible, name: "Ansible", color: "text-red-600" },
  { icon: Code, name: "AWS", color: "text-amber-400" },
];

const FEATURES = [
  { icon: BookOpen, title: "Structured Learning Paths", desc: "Follow curated, role-based paths from beginner to expert.", color: "text-primary" },
  { icon: Terminal, title: "Hands-on Labs", desc: "Interactive terminal labs with real DevOps scenarios.", color: "text-secondary" },
  { icon: BarChart3, title: "Progress Tracking", desc: "Detailed analytics to monitor your learning journey.", color: "text-accent" },
  { icon: Trophy, title: "Certificates", desc: "Industry-recognized certificates on course completion.", color: "text-yellow-400" },
  { icon: Zap, title: "Quizzes & Assessments", desc: "Test your knowledge with scenario-based questions.", color: "text-orange-400" },
  { icon: Shield, title: "Role-Based Access", desc: "Separate dashboards for students, instructors, and admins.", color: "text-green-400" },
];

const STATS = [
  { label: "Students Enrolled", value: "150,000+", icon: Users },
  { label: "Expert Courses", value: "120+", icon: BookOpen },
  { label: "Hours of Content", value: "500+", icon: Clock },
  { label: "Certificates Issued", value: "45,000+", icon: Award },
];

const TESTIMONIALS = [
  {
    name: "Rahul Gupta", role: "DevOps Engineer @ Infosys", rating: 5, avatar: "RG", color: "from-primary to-accent",
    text: "DevOps Academy completely transformed my career. I went from a developer to a certified DevOps engineer in 6 months. The Kubernetes and Terraform courses are exceptional.",
  },
  {
    name: "Priya Sharma", role: "SRE @ Flipkart", rating: 5, avatar: "PS", color: "from-secondary to-primary",
    text: "The hands-on labs are the best I've seen. I could practice real Kubernetes deployments without needing my own cluster. Landed my SRE role 2 weeks after completing the course!",
  },
  {
    name: "Arjun Nair", role: "Cloud Architect @ TCS", rating: 5, avatar: "AN", color: "from-accent to-secondary",
    text: "The AWS DevOps course is incredibly comprehensive. The instructor explains complex concepts in simple terms with real-world examples. Worth every rupee.",
  },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const featuredCourses = COURSES.filter((c) => c.isFeatured).slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 hero-grid-bg opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Professional DevOps Training Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-extrabold leading-tight tracking-tight">
              Master DevOps <br />
              <span className="gradient-text">End-to-End</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              From Linux basics to Kubernetes production deployments. Learn with structured paths, hands-on labs, and earn industry-recognized certificates.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              {["Free Courses", "Expert Instructors", "Real-world Projects"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> {item}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:scale-105 animate-pulse-glow">
                Start Learning Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-all">
                <Play className="w-4 h-4 text-primary" /> Browse Courses
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {["RG", "PS", "AN", "SK", "MT"].map((av) => (
                  <div key={av} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center text-[10px] font-bold text-black">
                    {av}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                  <span className="text-sm font-semibold ml-1">4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">Trusted by 150,000+ learners</p>
              </div>
            </div>
          </motion.div>

          {/* Right – Terminal Card */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden glow-primary animate-float">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/80 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="mx-auto text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" /> academy@devops:~
                </span>
              </div>
              <div className="p-5 font-mono text-sm text-blue-300 bg-[hsl(220_18%_5%)] space-y-2 min-h-[280px]">
                <p><span className="text-secondary">$</span> kubectl get nodes</p>
                <p className="text-green-400 text-xs pl-2">NAME          STATUS   ROLES   AGE<br/>
                  master-node   Ready    master  14d<br/>
                  worker-01     Ready    worker  14d<br/>
                  worker-02     Ready    worker  14d</p>
                <p><span className="text-secondary">$</span> terraform apply -auto-approve</p>
                <p className="text-xs text-muted-foreground pl-2">aws_vpc.main: Creating...<br/>
                  aws_subnet.public: Creating...<br/>
                  <span className="text-green-400">Apply complete! Resources: 8 added</span></p>
                <p><span className="text-secondary">$</span> docker build -t my-app:v2.1 .</p>
                <p className="text-xs pl-2">
                  <span className="text-muted-foreground">Step 1/4: FROM node:18-alpine<br/>
                  Step 2/4: COPY package*.json ./<br/>
                  Step 3/4: RUN npm install<br/></span>
                  <span className="text-green-400">Successfully built a8f2c1d9e0b3</span>
                </p>
                <p className="animate-pulse">_</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="space-y-1">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-3xl font-display font-extrabold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOOLS STRIP ─── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8">
            Master industry-standard DevOps tools
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {TOOLS.map((tool, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className={`text-4xl ${tool.color} group-hover:scale-110 transition-transform`}>
                  <tool.icon />
                </div>
                <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED COURSES ─── */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Featured <span className="gradient-text">Courses</span></h2>
              <p className="text-muted-foreground text-sm">Hand-picked by our instructors for the fastest path to employment.</p>
            </div>
            <Link to="/courses" className="hidden sm:flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">View all courses <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A complete learning ecosystem designed for DevOps professionals at every stage.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all group hover:shadow-lg hover:shadow-primary/5">
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3">What Our <span className="gradient-text">Students Say</span></h2>
            <p className="text-muted-foreground">Real reviews from engineers who transformed their careers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, si) => <Star key={si} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-black`}>{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-primary" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold">
              Ready to Become a <span className="gradient-text">DevOps Engineer?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join 150,000+ engineers learning on DevOps Academy. Start for free — no credit card required.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:scale-105">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary/10 transition-all">
                Browse Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
