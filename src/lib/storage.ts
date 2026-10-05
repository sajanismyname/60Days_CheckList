import { 
  ChallengeData, 
  DayProgress, 
  ChallengeStats, 
  LeetCodeProblem, 
  HeatmapStatus 
} from '../types';
import { CURRICULUM_DAYS } from '../data/curriculum';
import { calculateDayFromStartDate, getTodayDateString } from './utils';

const STORAGE_KEY = 'checklist_60days_data_v1';
const CURRENT_VERSION = 1;

export function getDefaultDayProgress(day: number): DayProgress {
  return {
    day,
    completedTasks: [],
    customTasks: [],
    notes: '',
    whatILearned: '',
    whatIBuilt: '',
    whatBroke: '',
    biggestTakeaway: '',
    leetcodeCount: 0,
    leetcodeProblems: [],
    xPosted: false,
    xPostUrl: '',
    completed: false,
  };
}

export function getDefaultChallengeData(): ChallengeData {
  const today = getTodayDateString();
  const defaultDays: Record<number, DayProgress> = {};

  for (let i = 1; i <= 60; i++) {
    defaultDays[i] = getDefaultDayProgress(i);
  }

  return {
    version: CURRENT_VERSION,
    settings: {
      startDate: today,
      theme: 'system',
      autoNavigateToToday: true,
    },
    days: defaultDays,
    allLeetCode: [],
  };
}

export function loadChallengeData(): ChallengeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultChallengeData();
      saveChallengeData(initial);
      return initial;
    }

    const parsed = JSON.parse(raw) as Partial<ChallengeData>;
    if (!parsed || typeof parsed !== 'object') {
      return getDefaultChallengeData();
    }

    const base = getDefaultChallengeData();

    const mergedSettings = {
      ...base.settings,
      ...(parsed.settings || {}),
    };

    const mergedDays: Record<number, DayProgress> = {};
    for (let i = 1; i <= 60; i++) {
      const existing = parsed.days?.[i];
      if (existing) {
        mergedDays[i] = {
          ...getDefaultDayProgress(i),
          ...existing,
          completedTasks: Array.isArray(existing.completedTasks) ? existing.completedTasks : [],
          customTasks: Array.isArray(existing.customTasks) ? existing.customTasks : [],
          leetcodeProblems: Array.isArray(existing.leetcodeProblems) ? existing.leetcodeProblems : [],
        };
      } else {
        mergedDays[i] = getDefaultDayProgress(i);
      }
    }

    const mergedLeetCode: LeetCodeProblem[] = Array.isArray(parsed.allLeetCode)
      ? parsed.allLeetCode
      : [];

    return {
      version: CURRENT_VERSION,
      settings: mergedSettings,
      days: mergedDays,
      allLeetCode: mergedLeetCode,
      lastExported: parsed.lastExported,
    };
  } catch (error) {
    console.error('Failed to load challenge data from localStorage, falling back to default:', error);
    return getDefaultChallengeData();
  }
}

export function saveChallengeData(data: ChallengeData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to persist challenge data to localStorage:', error);
  }
}

/**
 * Calculates current streak and longest streak.
 * A day counts toward the streak if at least one task was completed.
 */
export function calculateStreaks(days: Record<number, DayProgress>, currentDay: number): { currentStreak: number; longestStreak: number } {
  let longest = 0;
  let currentRunning = 0;

  // Track contiguous active days across the challenge up to day 60
  for (let d = 1; d <= 60; d++) {
    const dayData = days[d];
    const isDayActive = dayData && (dayData.completedTasks.length > 0 || dayData.completed);

    if (isDayActive) {
      currentRunning++;
      if (currentRunning > longest) {
        longest = currentRunning;
      }
    } else {
      currentRunning = 0;
    }
  }

  // Calculate current streak counting backwards from currentDay
  let activeCurrentStreak = 0;
  // If current day has activity, count backward from currentDay
  // If current day has no activity yet (user just woke up), check if yesterday was active
  const todayActive = days[currentDay]?.completedTasks?.length > 0 || days[currentDay]?.completed;
  const startCheckDay = todayActive ? currentDay : currentDay - 1;

  for (let d = startCheckDay; d >= 1; d--) {
    const dayData = days[d];
    const isDayActive = dayData && (dayData.completedTasks.length > 0 || dayData.completed);
    if (isDayActive) {
      activeCurrentStreak++;
    } else {
      break;
    }
  }

  return {
    currentStreak: activeCurrentStreak,
    longestStreak: Math.max(longest, activeCurrentStreak),
  };
}

export function computeStats(data: ChallengeData): ChallengeStats {
  const currentCalculatedDay = calculateDayFromStartDate(data.settings.startDate);
  const totalDays = 60;
  let completedDaysCount = 0;
  let totalTasksCompleted = 0;
  let totalXPosts = 0;

  for (let i = 1; i <= 60; i++) {
    const day = data.days[i];
    if (day) {
      if (day.completed) {
        completedDaysCount++;
      }
      totalTasksCompleted += day.completedTasks?.length || 0;
      if (day.xPosted) {
        totalXPosts++;
      }
    }
  }

  const { currentStreak, longestStreak } = calculateStreaks(data.days, currentCalculatedDay);

  // LeetCode calculations from allLeetCode
  const allProblems = data.allLeetCode || [];
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;

  for (const prob of allProblems) {
    if (prob.difficulty === 'Easy') easyCount++;
    else if (prob.difficulty === 'Medium') mediumCount++;
    else if (prob.difficulty === 'Hard') hardCount++;
  }

  const totalTopicsLearned = CURRICULUM_DAYS.reduce((acc, curr) => {
    const dayData = data.days[curr.day];
    if (dayData && (dayData.completed || dayData.completedTasks.length > 0)) {
      return acc + curr.learningTopics.length;
    }
    return acc;
  }, 0);

  const progressPercentage = Math.round((completedDaysCount / totalDays) * 100);

  return {
    currentDay: currentCalculatedDay,
    totalDays,
    completedDaysCount,
    progressPercentage,
    currentStreak,
    longestStreak,
    totalLeetCodeSolved: allProblems.length,
    easyCount,
    mediumCount,
    hardCount,
    totalTasksCompleted,
    totalTopicsLearned,
    totalXPosts,
  };
}

export function getHeatmapStatus(dayProgress?: DayProgress, defaultTaskCount = 5): HeatmapStatus {
  if (!dayProgress) return 'not_started';
  if (dayProgress.completed) return 'completed';
  const count = dayProgress.completedTasks?.length || 0;
  if (count === 0) return 'not_started';
  if (count >= defaultTaskCount) return 'completed';
  if (count >= Math.ceil(defaultTaskCount / 2)) return 'partially_completed';
  return 'started';
}

export function exportProgressToJson(data: ChallengeData): void {
  const exportPayload: ChallengeData = {
    ...data,
    lastExported: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `checklist-60days-backup-${getTodayDateString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateImportedData(parsed: unknown): parsed is ChallengeData {
  if (!parsed || typeof parsed !== 'object') return false;
  const p = parsed as Record<string, unknown>;
  if (!p.settings || typeof p.settings !== 'object') return false;
  if (!p.days || typeof p.days !== 'object') return false;
  return true;
}
