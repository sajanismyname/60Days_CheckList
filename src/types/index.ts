export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface LeetCodeProblem {
  id: string;
  number: string;
  title: string;
  difficulty: Difficulty;
  pattern: string;
  url?: string;
  notes?: string;
  dateSolved: string;
  daySolved?: number;
}

export interface DayProgress {
  day: number;
  completedTasks: string[];
  customTasks?: string[];
  notes: string;
  whatILearned: string;
  whatIBuilt: string;
  whatBroke: string;
  biggestTakeaway: string;
  leetcodeCount: number;
  leetcodeProblems: LeetCodeProblem[];
  xPosted: boolean;
  xPostUrl?: string;
  completed: boolean;
  lastUpdated?: string;
}

export interface DayCurriculum {
  day: number;
  week: number;
  weekTheme: string;
  title: string;
  description: string;
  learningTopics: string[];
  defaultTasks: string[];
  leetcodeFocus?: string;
}

export interface WeekInfo {
  week: number;
  title: string;
  days: number[];
  leetcodeCategory: string;
  description: string;
}

export interface ChallengeSettings {
  startDate: string;
  theme: 'light' | 'dark' | 'system';
  autoNavigateToToday: boolean;
}

export interface ChallengeData {
  version: number;
  settings: ChallengeSettings;
  days: Record<number, DayProgress>;
  allLeetCode: LeetCodeProblem[];
  lastExported?: string;
}

export type HeatmapStatus = 'not_started' | 'started' | 'partially_completed' | 'completed';

export interface ChallengeStats {
  currentDay: number;
  totalDays: number;
  completedDaysCount: number;
  progressPercentage: number;
  currentStreak: number;
  longestStreak: number;
  totalLeetCodeSolved: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  totalTasksCompleted: number;
  totalTopicsLearned: number;
  totalXPosts: number;
}

export type NavTab = 
  | 'dashboard' 
  | 'today' 
  | 'roadmap' 
  | 'leetcode' 
  | 'weekly' 
  | 'notes' 
  | 'settings';
