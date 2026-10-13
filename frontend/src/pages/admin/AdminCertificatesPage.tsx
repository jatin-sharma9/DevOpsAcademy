import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, ExternalLink, Plus, Search, ShieldCheck, Check, X, Sparkles, Trash2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COURSES } from "@/data/courses";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CertificateRecord {
  id: string;
  dbId?: number;
  student: string;
  course: string;
  courseSlug: string;
  issuedDate: string;
  score: string;
  hash: string;
}

const INITIAL_CERTIFICATES: CertificateRecord[] = [
  { id: "CERT-LINU-891", student: "Priya Sharma", course: "Linux Fundamentals", courseSlug: "linux-fundamentals", issuedDate: "2026-08-24", score: "98%", hash: "DEV-LINU-A891BC" },
  { id: "CERT-DCK-112", student: "Jatin Sharma", course: "Docker & Container Architecture", courseSlug: "docker-mastery", issuedDate: "2026-08-20", score: "100%", hash: "DEV-DOCK-C112FE" },
  { id: "CERT-TFM-442", student: "Rahul Gupta", course: "Terraform & IaC Mastery", courseSlug: "terraform-infrastructure-as-code", issuedDate: "2026-08-18", score: "92%", hash: "DEV-TERR-E442AA" },
  { id: "CERT-K8S-773", student: "Alex Chen", course: "Kubernetes in Action", courseSlug: "kubernetes-in-action", issuedDate: "2026-08-15", score: "95%", hash: "DEV-KUBE-773D41" },
  { id: "CERT-CICD-521", student: "Sarah Jenkins", course: "Jenkins CI/CD Pipelines Masterclass", courseSlug: "jenkins-cicd-pipelines", issuedDate: "2026-08-10", score: "100%", hash: "DEV-CICD-52199B" },
];

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>(INITIAL_CERTIFICATES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    student: "",
    courseSlug: COURSES[0]?.slug || "linux-fundamentals",
    score: "95%",
  });

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.getCertificates();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCertificates(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch certificates from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student.trim()) {
      toast.error("Please enter a student name or email");
      return;
    }

    try {
      const res = await apiService.admin.issueCertificate({
        student: formData.student.trim(),
        courseSlug: formData.courseSlug,
        score: formData.score || "100%",
      });

      if (res && res.success && res.data) {
        setCertificates(prev => [res.data, ...prev]);
        toast.success(`Verified Certificate issued to ${formData.student}!`);
      } else {
        toast.success(`Certificate issued successfully!`);
      }
      await loadCertificates();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to issue certificate");
    }
  };

  const handleRevoke = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to revoke and delete this certificate?")) return;
    try {
      await apiService.admin.deleteCertificate(id);
      toast.success("Certificate revoked successfully.");
      await loadCertificates();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to revoke certificate");
    }
  };

  const filtered = certificates.filter(c =>
    c.student.toLowerCase().includes(search.toLowerCase()) ||
    c.course.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.hash.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Issued Credentials & Certificates</h1>
          <p className="text-muted-foreground text-sm">Issue, verify, and manage cryptographic course completion credentials.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ student: "", courseSlug: COURSES[0]?.slug || "linux-fundamentals", score: "96%" });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Issue Certificate
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by student, course, or certificate ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cert) => (
          <div key={cert.id} className="p-5 rounded-2xl border border-border bg-card space-y-4 hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                  {cert.id}
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-foreground">{cert.student}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{cert.course}</p>
                <p className="text-[10px] font-mono text-muted-foreground/80 mt-1">Hash: {cert.hash}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span>Date: {cert.issuedDate}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-400">Score: {cert.score}</span>
                <Link
                  to={`/certificate/${cert.courseSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="View Verified Certificate"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleRevoke(cert.dbId || cert.id)}
                  className="p-1 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Revoke Certificate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── ISSUE CERTIFICATE MODAL ─── */}
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
                  Issue Verified Course Credential
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleIssue} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Recipient Student Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.student}
                    onChange={e => setFormData({ ...formData, student: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Certified Course Track *</label>
                  <select
                    value={formData.courseSlug}
                    onChange={e => setFormData({ ...formData, courseSlug: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                  >
                    {COURSES.map(c => (
                      <option key={c.slug} value={c.slug}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Assessment Mastery Score</label>
                  <input
                    type="text"
                    value={formData.score}
                    onChange={e => setFormData({ ...formData, score: e.target.value })}
                    placeholder="e.g. 98%"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                    <span>Issue Certificate</span>
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
