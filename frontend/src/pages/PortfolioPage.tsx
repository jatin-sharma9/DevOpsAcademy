import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Terminal, Shield, Award, BookOpen, Code, Github, Linkedin, 
  Mail, ExternalLink, Download, CheckCircle2, Star, ArrowRight, 
  Briefcase, GraduationCap, Cpu, Layers, Flame, FileText
} from "lucide-react";
import { 
  SiLinux, SiDocker, SiKubernetes, SiTerraform, SiAnsible, 
  SiJenkins, SiGit, SiPython, SiGo, SiPrometheus, SiGrafana 
} from "react-icons/si";
import { sendEmailNotification } from "@/services/emailService";
import { toast } from "sonner";

const SKILLS = [
  { name: "Kubernetes & EKS", level: 95, category: "Orchestration", icon: SiKubernetes, color: "text-blue-500" },
  { name: "Docker & Containers", level: 98, category: "Containerization", icon: SiDocker, color: "text-blue-400" },
  { name: "Terraform & IaC", level: 92, category: "Infrastructure", icon: SiTerraform, color: "text-purple-400" },
  { name: "AWS Cloud Architecture", level: 90, category: "Cloud Provider", icon: Cpu, color: "text-amber-400" },
  { name: "Jenkins & GitHub Actions", level: 94, category: "CI/CD Pipelines", icon: SiJenkins, color: "text-red-500" },
  { name: "Linux Administration & Bash", level: 96, category: "OS & Scripting", icon: SiLinux, color: "text-orange-400" },
  { name: "Ansible Configuration", level: 88, category: "Automation", icon: SiAnsible, color: "text-red-600" },
  { name: "Prometheus & Grafana", level: 85, category: "Observability", icon: SiPrometheus, color: "text-orange-500" },
];

const EXPERIENCE = [
  {
    role: "Senior Lead DevOps Engineer",
    company: "CloudScale Technologies",
    period: "2024 - Present",
    desc: "Architected multi-region Kubernetes infrastructure handling 10M+ daily active requests. Reduced cloud spend by 42% through Spot instances & KEDA autoscaling.",
    tags: ["EKS", "Terraform", "ArgoCD", "Helm", "Datadog"]
  },
  {
    role: "DevOps & SRE Specialist",
    company: "DataNode Global",
    period: "2022 - 2024",
    desc: "Built zero-downtime CI/CD pipelines for 45+ microservices. Reduced release deployment time from 3 hours to under 8 minutes.",
    tags: ["Jenkins", "GitLab CI", "Docker", "AWS Lambda", "Python"]
  },
  {
    role: "Cloud Infrastructure Engineer",
    company: "TechMatrix Systems",
    period: "2020 - 2022",
    desc: "Managed high-availability Linux infrastructure across AWS and on-prem data centers with 99.99% SLA uptime.",
    tags: ["Linux", "Ansible", "Nginx", "PostgreSQL", "Bash"]
  }
];

const CERTIFICATIONS = [
  { title: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF / Linux Foundation", date: "2024", badge: "CKA-89210" },
  { title: "AWS Certified DevOps Engineer - Professional", issuer: "Amazon Web Services", date: "2023", badge: "AWS-DOP-771" },
  { title: "HashiCorp Certified: Terraform Associate", issuer: "HashiCorp", date: "2023", badge: "TA-99312" },
  { title: "Red Hat Certified System Administrator (RHCSA)", issuer: "Red Hat", date: "2022", badge: "RH-44102" },
];

const FEATURED_PROJECTS = [
  {
    title: "Production Kubernetes GitOps Engine",
    desc: "Self-healing EKS infrastructure automated with Terraform and GitOps (ArgoCD), featuring automated Canary deployments.",
    tags: ["Kubernetes", "ArgoCD", "Terraform", "AWS"],
    stars: 142,
    forks: 38,
    link: "https://github.com"
  },
  {
    title: "Multi-Cloud Security & Compliance Scanner",
    desc: "Automated auditing engine scanning AWS, GCP, and Azure for CIS Benchmark violations with real-time Slack alerts.",
    tags: ["Python", "AWS Security Hub", "Docker", "Lambda"],
    stars: 98,
    forks: 24,
    link: "https://github.com"
  },
  {
    title: "Zero-Trust Infrastructure Blueprint",
    desc: "Complete Terraform module library enforcing zero-trust network access, HashiCorp Vault integration, and Tailscale Mesh VPN.",
    tags: ["Terraform", "Vault", "Linux", "WireGuard"],
    stars: 210,
    forks: 65,
    link: "https://github.com"
  }
];

export default function PortfolioPage() {
  const [formData, setFormData] = React.useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = React.useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await sendEmailNotification("contact_form", `📩 Contact Inquiry: ${formData.subject}`, {
      fullName: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      dateTime: new Date().toLocaleString(),
    });
    setSubmitting(false);
    toast.success("Thank you! Your message has been sent to Jatin Sharma.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="space-y-24 py-10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }} 
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Senior DevOps & Cloud Architect
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-none">
              Hi, I'm <span className="gradient-text">Jatin Sharma</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Specializing in cloud-native infrastructure, Kubernetes orchestration, GitOps workflows, and enterprise automation. I help engineering teams ship secure software faster.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#contact" 
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Get In Touch
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" /> GitHub Profile
              </a>
              <a 
                href="#" 
                className="px-6 py-3 rounded-xl border border-primary/30 text-primary font-semibold text-sm hover:bg-primary/10 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Resume
              </a>
            </div>

            <div className="pt-6 border-t border-border/60 flex items-center gap-6 text-sm text-muted-foreground">
              <div><strong className="text-foreground text-base">6+ Years</strong> Experience</div>
              <div><strong className="text-foreground text-base">100+</strong> Deployments</div>
              <div><strong className="text-foreground text-base">4x</strong> Certified</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            className="lg:col-span-5"
          >
            <div className="p-6 rounded-3xl border border-border bg-card/80 backdrop-blur shadow-2xl relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-3xl font-extrabold text-black mb-6 shadow-lg">
                JS
              </div>
              <h3 className="font-display text-xl font-bold">Jatin Sharma</h3>
              <p className="text-xs font-mono text-primary mt-0.5">DevOps Engineer & Educator</p>
              
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border/50">
                  <span className="text-xs text-muted-foreground">Primary Stack</span>
                  <span className="font-mono text-xs font-semibold">AWS + K8s + Terraform</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border/50">
                  <span className="text-xs text-muted-foreground">Location</span>
                  <span className="text-xs font-medium">India (Remote Available)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border/50">
                  <span className="text-xs text-muted-foreground">Availability</span>
                  <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" /> Open for Ops Consulting
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-3">Technical <span className="gradient-text">Competencies</span></h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">Production-proven expertise in modern DevOps tooling & platform engineering.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SKILLS.map((skill, i) => (
            <motion.div 
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <skill.icon className={`text-2xl ${skill.color}`} />
                <span className="text-xs font-mono font-semibold text-primary">{skill.level}%</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{skill.name}</p>
                <p className="text-[11px] text-muted-foreground">{skill.category}</p>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full progress-fill rounded-full" style={{ width: `${skill.level}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-10">
          <Briefcase className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-display font-bold">Work Experience</h2>
        </div>

        <div className="space-y-6 border-l-2 border-border pl-6 ml-3">
          {EXPERIENCE.map((exp, i) => (
            <motion.div 
              key={exp.role} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative space-y-2"
            >
              <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background" />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display font-bold text-lg">{exp.role}</h3>
                <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-muted text-muted-foreground">{exp.period}</span>
              </div>
              <p className="text-xs font-semibold text-primary">{exp.company}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{exp.desc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {exp.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 text-[10px] font-mono rounded bg-muted/80 text-muted-foreground border border-border">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <Award className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-display font-bold">Verified Certifications</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CERTIFICATIONS.map(c => (
            <div key={c.title} className="p-5 rounded-2xl border border-border bg-card hover:border-yellow-400/40 transition-all space-y-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <div>
                <h4 className="font-semibold text-sm line-clamp-2">{c.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{c.issuer}</p>
              </div>
              <div className="pt-2 border-t border-border/60 flex justify-between text-[11px] font-mono text-muted-foreground">
                <span>ID: {c.badge}</span>
                <span>{c.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Code className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-display font-bold">Open Source Projects</h2>
          </div>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            View GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_PROJECTS.map(p => (
            <div key={p.title} className="p-6 rounded-2xl border border-border bg-card hover:border-secondary/40 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-secondary">Public Repo</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{p.stars}</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{p.forks}</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-base">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(t => <span key={t} className="px-2 py-0.5 text-[10px] font-mono rounded bg-muted text-muted-foreground">{t}</span>)}
                </div>
                <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                  Source Code <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl border border-border bg-card space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-display font-bold">Let's Build Something <span className="gradient-text">Scalable</span></h2>
            <p className="text-muted-foreground text-sm">Have an infrastructure project or consulting inquiry? Send a message.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4 max-w-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <textarea
              placeholder="Tell me about your infrastructure or DevOps project..."
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Message"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
