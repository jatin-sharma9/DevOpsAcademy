import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Download, Share2, CheckCircle2, Terminal, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, mapBackendCourseToFrontend } from "@/services/apiService";
import { formatDate } from "@/lib/utils";

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
        // First get the course details by slug
        const courseRes = await apiService.courses.getBySlug(id);
        if (courseRes.success && courseRes.data) {
          const mappedCourse = mapBackendCourseToFrontend(courseRes.data);
          setCourse(mappedCourse);
          
          // Then fetch the certificate using mapped numeric ID
          const certRes = await apiService.enrollments.getCertificate(Number(mappedCourse.id));
          if (certRes.success && certRes.data) {
            setCertificate(certRes.data);
          }
        }
      } catch (err) {
        console.error("Error loading certificate:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificateData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Retrieving your certificate details...</p>
      </div>
    );
  }

  if (!course || !certificate) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Certificate not found</h2>
          <p className="text-muted-foreground text-sm mb-4">Make sure you have completed all lessons in this course.</p>
          <Link to="/dashboard" className="text-primary hover:underline">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const certNumber = certificate.certificate_hash ? certificate.certificate_hash.substring(0, 12).toUpperCase() : "DEV-CERT-UNK";
  const issueDate = formatDate(new Date(certificate.issued_at));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold mb-2">🎉 Congratulations!</h1>
          <p className="text-muted-foreground">Your certificate of completion has been issued.</p>
        </div>

        {/* Certificate */}
        <div className="certificate-border">
          <div className="certificate-inner p-10 md:p-14">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2.5 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-black" />
                </div>
                <span className="text-2xl font-display font-bold">DevOps<span className="text-primary">Academy</span></span>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">Certificate of Completion</p>
              <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto" />
            </div>

            {/* Body */}
            <div className="text-center space-y-5">
              <p className="text-muted-foreground">This is to certify that</p>
              <h2 className="text-4xl font-display font-extrabold gradient-text">{user?.username || "Student"}</h2>
              <p className="text-muted-foreground">has successfully completed the course</p>
              <h3 className="text-2xl font-display font-bold">{course.title}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Demonstrating proficiency in {course.category || 'DevOps'} with {course.durationHours} hours of expert-led curriculum.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 py-4">
                {[
                  { label: "Duration", value: `${course.durationHours}h` },
                  { label: "Level", value: course.level },
                  { label: "Score", value: "100%" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-lg font-bold text-primary capitalize">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Signature row */}
              <div className="flex items-end justify-between pt-8 border-t border-border/40">
                <div className="text-left">
                  <div className="text-sm font-display font-bold italic">{course.instructor}</div>
                  <div className="text-xs text-muted-foreground">{course.instructorTitle}</div>
                  <div className="text-xs text-muted-foreground">Instructor</div>
                </div>
                <div className="text-center">
                  <Award className="w-12 h-12 text-yellow-400 mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Verified Certificate</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{issueDate}</div>
                  <div className="text-xs text-muted-foreground">Date Issued</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">{certNumber}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-medium text-sm hover:bg-muted transition-colors cursor-pointer">
            <Download className="w-4 h-4" /> Print / Save PDF
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-medium text-sm hover:bg-muted transition-colors cursor-pointer">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <a href={`https://linkedin.com`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-medium text-sm hover:bg-muted transition-colors cursor-pointer">
            <ExternalLink className="w-4 h-4" /> Add to LinkedIn
          </a>
        </div>

        {/* Verification */}
        <div className="p-4 rounded-xl bg-muted border border-border flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
          <div>
            <p className="text-sm font-medium">Certificate Verification</p>
            <p className="text-xs text-muted-foreground">Certificate Verification ID: <span className="font-mono text-primary">{certificate.certificate_hash}</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
