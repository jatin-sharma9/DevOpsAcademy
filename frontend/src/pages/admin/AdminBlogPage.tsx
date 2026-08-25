import React, { useState } from "react";
import { Plus, Edit2, Trash2, Eye, Calendar, Clock } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";
import { formatDate, truncate } from "@/lib/utils";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold">Blog Posts</h1><p className="text-muted-foreground text-sm">{BLOG_POSTS.length} articles</p></div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/30">
            <tr className="text-xs text-muted-foreground">
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Views</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {BLOG_POSTS.map((post) => (
              <tr key={post.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3"><p className="font-medium text-sm line-clamp-1 max-w-xs">{post.title}</p><p className="text-xs text-muted-foreground">{post.readTimeMinutes} min read</p></td>
                <td className="px-4 py-3 hidden md:table-cell"><span className="px-2 py-0.5 text-[11px] rounded-full bg-primary/10 text-primary border border-primary/20">{post.category}</span></td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{post.viewCount.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{formatDate(post.publishedAt)}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-secondary/10 text-secondary border border-secondary/20">Published</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
