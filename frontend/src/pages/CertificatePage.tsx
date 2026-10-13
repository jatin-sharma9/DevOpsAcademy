import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Download, Share2, CheckCircle2, Terminal, ExternalLink, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { COURSES } from "@/data/courses";
import { lmsStore } from "@/services/lmsStore";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificateData = async () => {
      if (!id) return;
      try {
        setLoading(true);

        // 1. Get static course as base
        const staticCourse = COURSES.find(c => c.slug === id || String(c.id) === id);
        let resolvedCourse = staticCourse;

        // 2. Try fetching from backend API
        try {
          const courseRes = await apiService.courses.getBySlug(id);
          if (courseRes.success && courseRes.data) {
            resolvedCourse = mapBackendCourseToFrontend(courseRes.data);
          }
        } catch {
          // Backend offline, keep static course
        }

        if (resolvedCourse) {
          setCourse(resolvedCourse);

          // Try fetching verified certificate from backend
          if (resolvedCourse.id) {
            try {
              const certRes = await apiService.enrollments.getCertificate(Number(resolvedCourse.id));
              if (certRes.success && certRes.data) {
                setCertificate(certRes.data);
                lmsStore.unlockBadge('certified_pro');
                return;
              }
            } catch {
              // Not yet issued or backend unavailable
            }
          }
        }

        // Check if `id` is a verified certificate verification code/hash
        try {
          const verifyRes = await apiService.enrollments.verifyCertificate(id);
          if (verifyRes.success && verifyRes.data && verifyRes.verified) {
            setCertificate({
              certificate_hash: verifyRes.data.certificateHash,
              username: verifyRes.data.studentName,
              course_title: verifyRes.data.courseTitle,
              issued_at: verifyRes.data.issuedAt,
            });
            if (!resolvedCourse && verifyRes.data.courseSlug) {
              const staticCourse = COURSES.find(c => c.slug === verifyRes.data.courseSlug);
              setCourse(staticCourse || {
                title: verifyRes.data.courseTitle,
                slug: verifyRes.data.courseSlug,
                category: "DevOps",
                level: "Professional",
                durationHours: 12,
              });
            }
            return;
          }
        } catch {
          // Unverified or invalid hash
        }

        // Do not generate synthetic certificate
        setCertificate(null);
      } catch (err) {
        console.error("Error loading certificate:", err);
        setCertificate(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificateData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Validating certificate credentials...</p>
      </div>
    );
  }

  if (!course || !certificate) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-md">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-block">
              CERTIFICATE UNAVAILABLE // UNVERIFIED
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              Verified Certificate Not Available
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              No authenticated certificate credential was found for this course or verification ID.
              Certificates are only issued after completing 100% of required course lessons and passing assessments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {course?.slug ? (
              <Link
                to={`/learn/${course.slug}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
              >
                <Terminal className="w-3.5 h-3.5" /> Continue Course Lessons
              </Link>
            ) : null}
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
            </Link>
            <Link
              to="/courses"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const certNumber = certificate.certificate_hash || certificate.certificateHash || "DEV-CERT-8902";
  const issueDate = formatDate(new Date(certificate.issued_at || certificate.issuedAt || Date.now()));
  const recipientName = certificate.username || certificate.studentName || user?.username || "DevOps Specialist";
  const courseTitle = certificate.course_title || certificate.courseTitle || course?.title || "DevOps Course";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Certificate link copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Official DevOps Academy Credential
          </span>
          <h1 className="text-3xl font-display font-bold">🎉 Congratulations, {recipientName}!</h1>
          <p className="text-muted-foreground text-sm">Your professional certificate of completion is verified and ready to share.</p>
        </div>

        {/* Certificate Card */}
        <div className="certificate-border shadow-2xl">
          <div className="certificate-inner p-8 sm:p-14 bg-gradient-to-b from-card via-card to-background">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2.5 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Terminal className="w-5 h-5 text-black" />
                </div>
                <span className="text-2xl font-display font-extrabold text-foreground">
                  DevOps<span className="text-primary">Academy</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-semibold mb-2">
                Certificate of Technical Competency
              </p>
              <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto" />
            </div>

            {/* Body */}
            <div className="text-center space-y-5">
              <p className="text-muted-foreground text-sm">This is to certify that</p>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold gradient-text">
                {recipientName}
              </h2>
              <p className="text-muted-foreground text-sm">has successfully mastered and completed all modules of</p>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{courseTitle}</h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Demonstrating practical, hands-on engineering proficiency in {course.category || "DevOps Engineering"} across {course.duration_hours || course.durationHours || 12} hours of rigorous curriculum and real-world labs.
              </p>

              {/* Stats pill */}
              <div className="flex items-center justify-center gap-8 py-4">
                {[
                  { label: "Curriculum", value: `${course.durationHours || 12} Hours` },
                  { label: "Difficulty", value: course.level || "Beginner" },
                  { label: "Status", value: "Verified ✓" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-base sm:text-lg font-bold text-primary capitalize">{stat.value}</div>
                    <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Signature row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between pt-8 border-t border-border/60 gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-base font-display font-bold italic text-foreground">{course.instructor || "Jatin Sharma"}</div>
                  <div className="text-xs text-muted-foreground">{course.instructorTitle || "Lead DevOps Architect"}</div>
                  <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mt-0.5">Instructor & Verifier</div>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center mx-auto mb-1 text-yellow-400 shadow-md">
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="text-[11px] font-semibold text-yellow-400">Authenticated Credential</div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-sm font-semibold text-foreground">{issueDate}</div>
                  <div className="text-xs text-muted-foreground">Issue Date</div>
                  <div className="text-[11px] font-mono text-primary font-bold mt-1">{certNumber}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download / Print PDF
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card font-medium text-xs hover:bg-muted transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-primary" /> Copy Shareable Link
          </button>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card font-medium text-xs hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" /> Share to LinkedIn
          </a>
        </div>

        {/* Verification badge banner */}
        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Cryptographically Signed Credential</p>
              <p className="text-[11px] text-muted-foreground font-mono">Verification ID: {certificate.certificate_hash}</p>
            </div>
          </div>
          <Link to="/dashboard" className="text-xs text-primary hover:underline font-medium">
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
