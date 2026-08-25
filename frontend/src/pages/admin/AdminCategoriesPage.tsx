import React from "react";
import { FolderTree, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "1", name: "Operating Systems & Shell", slug: "os-shell", count: 4 },
  { id: "2", name: "Version Control", slug: "version-control", count: 3 },
  { id: "3", name: "Containerization", slug: "containerization", count: 6 },
  { id: "4", name: "Orchestration", slug: "orchestration", count: 5 },
  { id: "5", name: "Infrastructure as Code", slug: "iac", count: 4 },
  { id: "6", name: "CI/CD Pipelines", slug: "cicd", count: 5 },
];

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Category Management</h1>
          <p className="text-muted-foreground text-sm">Organize courses into structured learning domains.</p>
        </div>
        <button
          onClick={() => toast.info("Create Category modal triggered")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="p-5 rounded-2xl border border-border bg-card flex items-center justify-between">
            <div className="space-y-1">
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-primary/10 text-primary border border-primary/20">{cat.slug}</span>
              <h3 className="font-display font-semibold text-base">{cat.name}</h3>
              <p className="text-xs text-muted-foreground">{cat.count} Associated Courses</p>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
