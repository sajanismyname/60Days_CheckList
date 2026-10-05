import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ChallengeData, 
  DayProgress, 
  LeetCodeProblem, 
  ChallengeSettings, 
  ChallengeStats 
} from '../types';
import { 
  loadChallengeData, 
  saveChallengeData, 
  computeStats, 
  getDefaultChallengeData, 
  exportProgressToJson,
  getDefaultDayProgress
} from '../lib/storage';
import { calculateDayFromStartDate } from '../lib/utils';
import { getCurriculumDay } from '../data/curriculum';
import confetti from 'canvas-confetti';

export function useChallenge() {
  const [data, setData] = useState<ChallengeData>(() => loadChallengeData());
  
  // Calculate today's day number from settings start date
  const currentCalculatedDay = useMemo(() => {
    return calculateDayFromStartDate(data.settings.startDate);
  }, [data.settings.startDate]);

  // Selected day for viewing / editing in the Day detail view
  const [selectedDay, setSelectedDay] = useState<number>(() => currentCalculatedDay);

  // Sync selected day if startDate changes and user was on the old calculated day
  useEffect(() => {
    saveChallengeData(data);
  }, [data]);

  const stats: ChallengeStats = useMemo(() => {
    return computeStats(data);
  }, [data]);

  const updateDayProgress = useCallback((day: number, updates: Partial<DayProgress>) => {
    setData((prev) => {
      const currentDayData = prev.days[day] || getDefaultDayProgress(day);
      const updatedDay: DayProgress = {
        ...currentDayData,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };

      // Check if all default tasks are now completed
      const curriculum = getCurriculumDay(day);
      const allTasks = [...curriculum.defaultTasks, ...(updatedDay.customTasks || [])];
      const areAllTasksDone = allTasks.length > 0 && allTasks.every((t) => updatedDay.completedTasks.includes(t));

      // Auto update completed flag if tasks are done, unless explicitly toggled
      if (updates.completed === undefined) {
        if (areAllTasksDone && !updatedDay.completed) {
          updatedDay.completed = true;
          // Trigger joyful confetti
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.75 },
              colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
            });
          } catch {
            // Ignore if confetti fails
          }
        }
      }

      return {
        ...prev,
        days: {
          ...prev.days,
          [day]: updatedDay,
        },
      };
    });
  }, []);

  const toggleTask = useCallback((day: number, task: string) => {
    setData((prev) => {
      const currentDayData = prev.days[day] || getDefaultDayProgress(day);
      const completedTasks = currentDayData.completedTasks || [];
      const isAlreadyCompleted = completedTasks.includes(task);

      const nextCompleted = isAlreadyCompleted
        ? completedTasks.filter((t) => t !== task)
        : [...completedTasks, task];

      const curriculum = getCurriculumDay(day);
      const totalTasksList = [...curriculum.defaultTasks, ...(currentDayData.customTasks || [])];
      const allDoneNow = totalTasksList.length > 0 && totalTasksList.every((t) => nextCompleted.includes(t));

      if (allDoneNow && !isAlreadyCompleted) {
        try {
          confetti({
            particleCount: 70,
            spread: 55,
            origin: { y: 0.7 },
            colors: ['#10b981', '#06b6d4', '#6366f1'],
          });
        } catch {
          // ignore
        }
      }

      const updatedDay: DayProgress = {
        ...currentDayData,
        completedTasks: nextCompleted,
        completed: allDoneNow,
        lastUpdated: new Date().toISOString(),
      };

      return {
        ...prev,
        days: {
          ...prev.days,
          [day]: updatedDay,
        },
      };
    });
  }, []);

  const addCustomTask = useCallback((day: number, taskText: string) => {
    const trimmed = taskText.trim();
    if (!trimmed) return;

    setData((prev) => {
      const currentDayData = prev.days[day] || getDefaultDayProgress(day);
      const customTasks = currentDayData.customTasks || [];
      if (customTasks.includes(trimmed)) return prev;

      return {
        ...prev,
        days: {
          ...prev.days,
          [day]: {
            ...currentDayData,
            customTasks: [...customTasks, trimmed],
            lastUpdated: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const removeCustomTask = useCallback((day: number, taskText: string) => {
    setData((prev) => {
      const currentDayData = prev.days[day] || getDefaultDayProgress(day);
      const customTasks = (currentDayData.customTasks || []).filter((t) => t !== taskText);
      const completedTasks = (currentDayData.completedTasks || []).filter((t) => t !== taskText);

      return {
        ...prev,
        days: {
          ...prev.days,
          [day]: {
            ...currentDayData,
            customTasks,
            completedTasks,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const addLeetCodeProblem = useCallback((problemData: Omit<LeetCodeProblem, 'id'>) => {
    const id = `lc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newProblem: LeetCodeProblem = {
      ...problemData,
      id,
    };

    setData((prev) => {
      // Add to allLeetCode list
      const updatedAll = [newProblem, ...prev.allLeetCode];

      // Also if daySolved is specified, add to that day's leetcode list and increment count
      let updatedDays = prev.days;
      if (problemData.daySolved) {
        const dayNum = problemData.daySolved;
        const currentDayData = prev.days[dayNum] || getDefaultDayProgress(dayNum);
        const dayProblems = [...(currentDayData.leetcodeProblems || []), newProblem];

        updatedDays = {
          ...prev.days,
          [dayNum]: {
            ...currentDayData,
            leetcodeProblems: dayProblems,
            leetcodeCount: dayProblems.length,
            lastUpdated: new Date().toISOString(),
          },
        };
      }

      return {
        ...prev,
        allLeetCode: updatedAll,
        days: updatedDays,
      };
    });
  }, []);

  const deleteLeetCodeProblem = useCallback((id: string) => {
    setData((prev) => {
      const updatedAll = prev.allLeetCode.filter((p) => p.id !== id);
      const updatedDays: Record<number, DayProgress> = {};

      for (let i = 1; i <= 60; i++) {
        const dayData = prev.days[i];
        if (dayData && dayData.leetcodeProblems?.some((p) => p.id === id)) {
          const filtered = dayData.leetcodeProblems.filter((p) => p.id !== id);
          updatedDays[i] = {
            ...dayData,
            leetcodeProblems: filtered,
            leetcodeCount: filtered.length,
          };
        } else if (dayData) {
          updatedDays[i] = dayData;
        }
      }

      return {
        ...prev,
        allLeetCode: updatedAll,
        days: updatedDays,
      };
    });
  }, []);

  const updateChallengeSettings = useCallback((newSettings: Partial<ChallengeSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }));
  }, []);

  const exportData = useCallback(() => {
    exportProgressToJson(data);
  }, [data]);

  const importData = useCallback((newData: ChallengeData): boolean => {
    try {
      saveChallengeData(newData);
      setData(newData);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }, []);

  const resetChallenge = useCallback(() => {
    const fresh = getDefaultChallengeData();
    saveChallengeData(fresh);
    setData(fresh);
    setSelectedDay(1);
  }, []);

  const markDayComplete = useCallback((day: number, completed: boolean) => {
    updateDayProgress(day, { completed });
    if (completed) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, [updateDayProgress]);

  return {
    data,
    selectedDay,
    setSelectedDay,
    currentCalculatedDay,
    stats,
    updateDayProgress,
    toggleTask,
    addCustomTask,
    removeCustomTask,
    addLeetCodeProblem,
    deleteLeetCodeProblem,
    updateChallengeSettings,
    exportData,
    importData,
    resetChallenge,
    markDayComplete,
  };
}
