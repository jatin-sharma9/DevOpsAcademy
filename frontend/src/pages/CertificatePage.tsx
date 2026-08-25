import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Download, Share2, CheckCircle2, Terminal, ExternalLink } from "lucide-react";
import { getCourseBySlug } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { generateCertificateNumber, formatDate } from "@/lib/utils";

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const course = getCourseBySlug(id || "");
  const certNumber = generateCertificateNumber();
  const issueDate = formatDate(new Date());

  if (!course) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center"><h2 className="text-xl font-bold mb-2">Certificate not found</h2><Link to="/dashboard" className="text-primary">Back to dashboard</Link></div>
    </div>
  );

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
              <h2 className="text-4xl font-display font-extrabold gradient-text">{user?.username || "Student Name"}</h2>
              <p className="text-muted-foreground">has successfully completed the course</p>
              <h3 className="text-2xl font-display font-bold">{course.title}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Demonstrating proficiency in {course.tags.join(", ")} with {course.durationHours} hours of expert-led curriculum.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 py-4">
                {[
                  { label: "Duration", value: `${course.durationHours}h` },
                  { label: "Level", value: course.level },
                  { label: "Score", value: "85%" },
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
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-medium text-sm hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-medium text-sm hover:bg-muted transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-medium text-sm hover:bg-muted transition-colors">
            <ExternalLink className="w-4 h-4" /> Add to LinkedIn
          </a>
        </div>

        {/* Verification */}
        <div className="p-4 rounded-xl bg-muted border border-border flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
          <div>
            <p className="text-sm font-medium">Certificate Verification</p>
            <p className="text-xs text-muted-foreground">Certificate ID: <span className="font-mono text-primary">{certNumber}</span> · Verify at devops.academy/verify</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
