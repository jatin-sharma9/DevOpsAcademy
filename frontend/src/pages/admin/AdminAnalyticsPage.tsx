import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const WEEKLY = [
  { day: "Mon", pageviews: 4200, signups: 82, completions: 34 },
  { day: "Tue", pageviews: 5100, signups: 96, completions: 41 },
  { day: "Wed", pageviews: 4800, signups: 74, completions: 38 },
  { day: "Thu", pageviews: 6200, signups: 118, completions: 52 },
  { day: "Fri", pageviews: 7400, signups: 142, completions: 68 },
  { day: "Sat", pageviews: 8200, signups: 156, completions: 71 },
  { day: "Sun", pageviews: 6800, signups: 112, completions: 58 },
];

const FUNNEL = [
  { stage: "Visitors", count: 48200 },
  { stage: "Signups", count: 3840 },
  { stage: "Enrolled", count: 1820 },
  { stage: "Completed", count: 780 },
  { stage: "Certified", count: 620 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-display font-bold">Analytics</h1><p className="text-muted-foreground text-sm">Detailed platform performance metrics</p></div>

      <div className="p-5 rounded-2xl border border-border bg-card">
        <h2 className="font-display font-semibold text-sm mb-5">Weekly Traffic & Engagement</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={WEEKLY}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215,15%,55%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215,15%,55%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(220,18%,9%)", border: "1px solid hsl(220,15%,15%)", borderRadius: "8px", fontSize: "12px" }} />
            <Legend />
            <Line type="monotone" dataKey="pageviews" stroke="hsl(199,100%,50%)" strokeWidth={2} dot={false} name="Page Views" />
            <Line type="monotone" dataKey="signups" stroke="hsl(155,80%,50%)" strokeWidth={2} dot={false} name="Signups" />
            <Line type="monotone" dataKey="completions" stroke="hsl(270,70%,60%)" strokeWidth={2} dot={false} name="Completions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl border border-border bg-card">
          <h2 className="font-display font-semibold text-sm mb-5">Conversion Funnel</h2>
          <div className="space-y-3">
            {FUNNEL.map((item, i) => {
              const pct = Math.round((item.count / FUNNEL[0].count) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{item.stage}</span>
                    <span className="font-medium">{item.count.toLocaleString()} <span className="text-muted-foreground">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full progress-fill rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <h2 className="font-display font-semibold text-sm mb-5">Daily Signups (This Week)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215,15%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215,15%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(220,18%,9%)", border: "1px solid hsl(220,15%,15%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="signups" fill="hsl(199,100%,50%)" radius={[4,4,0,0]} name="Signups" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
