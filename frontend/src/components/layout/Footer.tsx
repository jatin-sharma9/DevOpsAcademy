import React from "react";
import { Link } from "react-router-dom";
import { Terminal, Github, Linkedin, Twitter, Youtube, Mail } from "lucide-react";

const FOOTER_LINKS = {
  "Learning": [
    { label: "All Courses", href: "/courses" },
    { label: "Learning Paths", href: "/courses?tab=paths" },
    { label: "Free Courses", href: "/courses?filter=free" },
    { label: "Certifications", href: "/courses?tab=certs" },
  ],
  "Platform": [
    { label: "Blog", href: "/blog" },
    { label: "Search", href: "/search" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Community", href: "/community" },
  ],
  "Support": [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const TOOLS = ["Linux", "Git", "Docker", "Kubernetes", "Jenkins", "Terraform", "Ansible", "AWS"];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Terminal className="w-4.5 h-4.5 text-black" />
              </div>
              <span className="font-display font-bold text-lg">DevOps<span className="text-primary">Academy</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-5">
              The professional DevOps learning platform. Master the tools and practices that power modern software delivery.
            </p>
            {/* Tool Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {TOOLS.map((tool) => (
                <span key={tool} className="px-2 py-0.5 text-[11px] font-mono bg-muted border border-border rounded text-muted-foreground">{tool}</span>
              ))}
            </div>
            {/* Social */}
            <div className="flex items-center gap-2">
              {[
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                { icon: Mail, href: "mailto:hello@devops.academy", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DevOps Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Built with</span>
            <span className="text-red-400">♥</span>
            <span>for DevOps engineers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
