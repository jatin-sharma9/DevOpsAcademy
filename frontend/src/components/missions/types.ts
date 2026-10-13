import React from "react";

export interface MissionObjective {
  id: string;
  title: string;
  description: string;
  commandSnippet: string;
  completed: boolean;
}

export interface TerminalEntry {
  id: string;
  type: "input" | "output" | "system" | "error" | "success";
  text: string;
  timestamp: string;
}

export interface MissionHint {
  level: number;
  title: string;
  content: string;
}

export interface PostMortemItem {
  title: string;
  content: string;
}
