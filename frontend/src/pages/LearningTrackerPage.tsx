import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Flame, Calendar, CheckSquare, Square, Trophy, 
  Award, Clock, ArrowRight, Target, Plus, Zap 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: "t1", title: "Complete Linux File Permissions lab", category: "Linux", completed: true },
  { id: "t2", title: "Write Dockerfile multi-stage build example", category: "Docker", completed: true },
  { id: "t3", title: "Solve 2 Kubernetes OOMKilled interview scenarios", category: "Kubernetes", completed: false },
  { id: "t4", title: "Review Terraform state locking documentation", category: "Terraform", completed: false },
];

export default function LearningTrackerPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCat, setNewTaskCat] = useState("Kubernetes");

  const completedCount = tasks.filter(t => t.completed).length;
  const streakDays = 14;

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCat,
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle("");
    toast.success("Daily learning goal added!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Daily Learning <span className="gradient-text">Tracker</span></h1>
          <p className="text-muted-foreground text-sm">Stay consistent and track your daily DevOps learning goals.</p>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Flame className="w-5 h-5 fill-amber-400 animate-pulse" />
          <div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
            <div className="font-display font-bold text-base">{streakDays} Days Fire Streak</div>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="text-xs text-muted-foreground mb-1">Today's Progress</div>
          <div className="text-2xl font-bold font-display">{completedCount} / {tasks.length} Completed</div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-3">
            <div className="h-full progress-fill rounded-full" style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Weekly Goal</div>
            <div className="text-lg font-bold">85% Consistency</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Learning Time</div>
            <div className="text-lg font-bold">1.5 hrs Today</div>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a new daily learning goal..."
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <select
          value={newTaskCat}
          onChange={e => setNewTaskCat(e.target.value)}
          className="px-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="Linux">Linux</option>
          <option value="Docker">Docker</option>
          <option value="Kubernetes">Kubernetes</option>
          <option value="Terraform">Terraform</option>
          <option value="AWS">AWS</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Goal
        </button>
      </form>

      {/* Tasks List */}
      <div className="space-y-3">
        <h2 className="font-display font-semibold text-base">Today's Tasks</h2>
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={cn(
              "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
              task.completed
                ? "border-secondary/30 bg-secondary/5 text-muted-foreground line-through"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <div className="flex items-center gap-3">
              {task.completed ? (
                <CheckSquare className="w-5 h-5 text-secondary shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <span className="text-sm font-medium">{task.title}</span>
            </div>
            <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-muted border border-border text-muted-foreground">
              {task.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
