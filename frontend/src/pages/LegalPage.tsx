import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ShieldCheck, FileText, HelpCircle, Users, ArrowLeft, Terminal, CheckCircle2 } from "lucide-react";

export default function LegalPage() {
  const location = useLocation();
  const path = location.pathname;

  const isPrivacy = path.includes("privacy");
  const isTerms = path.includes("terms");
  const isCommunity = path.includes("community");
  const isHelp = path.includes("help");

  const title = isPrivacy ? "Privacy Policy" :
    isTerms ? "Terms of Service" :
    isCommunity ? "Community Guidelines & Mentorship" :
    "Help Center & Support";

  const description = isPrivacy ? "How DevOps Academy secures, collects, and protects your personal learning data." :
    isTerms ? "Platform terms, subscription conditions, and credential verification policies." :
    isCommunity ? "Code of conduct, peer reviews, and interactive student community standards." :
    "Frequently asked questions, troubleshooting guides, and technical lab documentation.";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="space-y-3 pb-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            {isPrivacy ? <ShieldCheck className="w-4 h-4" /> :
             isTerms ? <FileText className="w-4 h-4" /> :
             isCommunity ? <Users className="w-4 h-4" /> :
             <HelpCircle className="w-4 h-4" />}
          </div>
          <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            {isPrivacy ? "Data & Security" : isTerms ? "Legal Agreement" : isCommunity ? "Social Hub" : "Knowledge Base"}
          </span>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <p className="text-xs font-mono text-muted-foreground">Last updated: September 2026</p>
      </div>

      <div className="prose prose-invert max-w-none text-muted-foreground text-sm space-y-6 leading-relaxed">
        {isPrivacy && (
          <>
            <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
            <p>We collect essential account details including username, email address, course progress markers, quiz attempts, and learning streak statistics to deliver a personalized curriculum experience.</p>

            <h2 className="text-lg font-bold text-foreground">2. Use of Diagnostic Data</h2>
            <p>Interactive lab verification commands and quiz completion records are stored securely in our PostgreSQL infrastructure to generate authentic, verifiable completion credentials.</p>

            <h2 className="text-lg font-bold text-foreground">3. Data Ownership & Retention</h2>
            <p>You retain full rights to your user account and notes. You may request account deletion and credential data export at any time by contacting support.</p>
          </>
        )}

        {isTerms && (
          <>
            <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing DevOps Academy courses, assessments, and lab harnesses, you agree to comply with our platform usage standards and intellectual property guidelines.</p>

            <h2 className="text-lg font-bold text-foreground">2. Verified Certificates</h2>
            <p>Certificates issued by DevOps Academy are backed by unique SHA cryptographic hashes verified via our public API endpoint. Altering credential hashes constitutes a violation of platform terms.</p>

            <h2 className="text-lg font-bold text-foreground">3. Enterprise & Self-Paced Access</h2>
            <p>All enrolled tracks provide lifetime curriculum access including future version updates (e.g. Kubernetes 1.30+ and Terraform 1.9+ upgrades).</p>
          </>
        )}

        {isCommunity && (
          <>
            <h2 className="text-lg font-bold text-foreground">1. Code of Conduct</h2>
            <p>DevOps Academy is a welcoming, professional learning environment. We encourage peer debugging, architecture critiques, and respectful discussions.</p>

            <h2 className="text-lg font-bold text-foreground">2. Study Groups & Mentorship</h2>
            <p>Join our Discord & Telegram communities to collaborate on capstone projects, share production runbooks, and participate in weekly live office hours with senior staff engineers.</p>

            <div className="p-5 rounded-2xl border border-primary/30 bg-primary/10 flex items-center justify-between gap-4 not-prose">
              <div>
                <h4 className="font-bold text-foreground text-sm">Join the DevOps Academy Community</h4>
                <p className="text-xs text-muted-foreground">Connect with 12,000+ active engineers, mentors, and hiring managers.</p>
              </div>
              <Link to="/courses" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
                Explore Tracks
              </Link>
            </div>
          </>
        )}

        {isHelp && (
          <>
            <h2 className="text-lg font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="space-y-4 not-prose">
              {[
                { q: "How do I claim my course certificate?", a: "Complete 100% of the course modules in the lesson studio, and click 'Claim Certificate' from the top celebration modal or the course certificate page." },
                { q: "Are the labs executed on my machine or the cloud?", a: "Our 5-Pillar Standard Curriculum provides reproducible commands, terminal verification scripts, and Docker/Kubernetes manifests ready to run on any workstation." },
                { q: "Can I take course quizzes multiple times?", a: "Yes, you can retake quizzes at any time to improve your score and unlock the Quiz Ace badge." }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-border bg-card space-y-1.5">
                  <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {faq.q}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
