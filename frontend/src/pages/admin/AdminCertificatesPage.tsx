import React from "react";
import { Award, ExternalLink, Download, ShieldCheck } from "lucide-react";

const CERTIFICATES = [
  { id: "CERT-K8S-891", student: "Priya Sharma", course: "Linux Fundamentals", issuedDate: "2026-08-24", score: "98%" },
  { id: "CERT-DCK-112", student: "Jatin Sharma", course: "Docker & Container Architecture", issuedDate: "2026-08-20", score: "100%" },
  { id: "CERT-TFM-442", student: "Rahul Gupta", course: "Terraform & IaC Mastery", issuedDate: "2026-08-18", score: "92%" },
];

export default function AdminCertificatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Issued Certificates</h1>
        <p className="text-muted-foreground text-sm">Verify and issue course completion certificates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CERTIFICATES.map((cert) => (
          <div key={cert.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
            <div className="flex justify-between items-start">
              <Award className="w-7 h-7 text-yellow-400" />
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-primary/10 text-primary border border-primary/20">{cert.id}</span>
            </div>
            <div>
              <h3 className="font-display font-semibold text-base">{cert.student}</h3>
              <p className="text-xs text-muted-foreground">{cert.course}</p>
            </div>
            <div className="pt-2 border-t border-border/60 flex justify-between text-xs text-muted-foreground">
              <span>Issued: {cert.issuedDate}</span>
              <span className="font-semibold text-secondary">Score: {cert.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
