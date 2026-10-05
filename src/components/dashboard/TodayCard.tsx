import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  X, 
  Share2, 
  BookOpen, 
  Code2, 
  Check 
} from 'lucide-react';
import { DayCurriculum, DayProgress } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface TodayCardProps {
  dayCurriculum: DayCurriculum;
  dayProgress: DayProgress;
  onToggleTask: (day: number, task: string) => void;
  onAddCustomTask: (day: number, task: string) => void;
  onRemoveCustomTask: (day: number, task: string) => void;
  onNavigateToDayDetail: (day: number) => void;
  onOpenXTemplate: (day: number) => void;
}

export const TodayCard: React.FC<TodayCardProps> = ({
  dayCurriculum,
  dayProgress,
  onToggleTask,
  onAddCustomTask,
  onRemoveCustomTask,
  onNavigateToDayDetail,
  onOpenXTemplate,
}) => {
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const completedTasks = dayProgress.completedTasks || [];
  const customTasks = dayProgress.customTasks || [];
  const allTasks = [...dayCurriculum.defaultTasks, ...customTasks];

  const completedCount = completedTasks.length;
  const totalCount = allTasks.length;
  const isDayFullyComplete = totalCount > 0 && completedCount >= totalCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskInput.trim()) {
      onAddCustomTask(dayCurriculum.day, newTaskInput.trim());
      setNewTaskInput('');
      setIsAddingTask(false);
    }
  };

  return (
    <Card className="border-border/80 bg-card shadow-sm transition-all">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Today's Focus • Day {dayCurriculum.day}
              </span>
              <Badge variant="outline" className="text-[10px] uppercase font-mono">
                Week {dayCurriculum.week}: {dayCurriculum.weekTheme}
              </Badge>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
              {dayCurriculum.title}
            </CardTitle>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {dayCurriculum.description}
            </p>
          </div>

          {/* Completion Status Pill */}
          <div className="flex items-center gap-2 self-start">
            {isDayFullyComplete ? (
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-in fade-in-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Day Complete ✓</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground border border-border">
                <span className="font-mono font-semibold text-foreground">{completedCount} / {totalCount}</span> tasks completed
              </div>
            )}
          </div>
        </div>

        {/* Learning Topics Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dayCurriculum.learningTopics.map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-foreground/80 border border-border/50"
            >
              #{topic}
            </span>
          ))}
        </div>

        {/* Task Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Daily Checklist Progress</span>
            <span className="font-mono font-semibold text-foreground">{progressPercent}%</span>
          </div>
          <Progress 
            value={progressPercent} 
            className="h-2 bg-secondary" 
            indicatorClassName={isDayFullyComplete ? 'bg-emerald-500' : 'bg-emerald-500/80'} 
          />
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {/* Checklist */}
        <div className="space-y-1.5 mt-2">
          {allTasks.map((task) => {
            const isCompleted = completedTasks.includes(task);
            const isCustom = customTasks.includes(task);

            return (
              <div
                key={task}
                onClick={() => onToggleTask(dayCurriculum.day, task)}
                className={cn(
                  'group flex items-start justify-between rounded-lg p-2.5 transition-all cursor-pointer border select-none',
                  isCompleted
                    ? 'border-emerald-500/20 bg-emerald-500/5 text-muted-foreground'
                    : 'border-border/60 bg-secondary/30 hover:border-border hover:bg-secondary/60 text-foreground'
                )}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={cn(
                      'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-all',
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'border border-muted-foreground/40 group-hover:border-emerald-500'
                    )}
                  >
                    {isCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-medium leading-relaxed',
                      isCompleted && 'line-through text-muted-foreground/80'
                    )}
                  >
                    {task}
                  </span>
                </div>

                {isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCustomTask(dayCurriculum.day, task);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-secondary transition-all cursor-pointer"
                    title="Remove custom task"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add custom task inline form */}
        <div className="mt-3">
          {isAddingTask ? (
            <form onSubmit={handleAddNewTask} className="flex items-center gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Add custom task (e.g. read docs, write PR)..."
                autoFocus
                className="flex-1 h-8 rounded-md border border-input bg-transparent px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Button type="submit" size="sm" className="h-8 text-xs">
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingTask(false)}
                className="h-8 text-xs text-muted-foreground"
              >
                Cancel
              </Button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingTask(true)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-500" />
              <span>Add custom task to today</span>
            </button>
          )}
        </div>

        {/* Quick Action Footer */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenXTemplate(dayCurriculum.day)}
              className="text-xs flex items-center gap-1.5 border-border hover:border-blue-400/50"
            >
              <Share2 className="h-3.5 w-3.5 text-blue-400" />
              <span>Share on X</span>
              {dayProgress.xPosted && <span className="text-emerald-500 text-[10px]">✓</span>}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateToDayDetail(dayCurriculum.day)}
              className="text-xs flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-500" />
              <span>Daily Notes</span>
              {(dayProgress.whatILearned || dayProgress.biggestTakeaway) && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateToDayDetail(dayCurriculum.day)}
              className="text-xs flex items-center gap-1.5"
            >
              <Code2 className="h-3.5 w-3.5 text-purple-500" />
              <span>LeetCode ({dayProgress.leetcodeProblems?.length || 0})</span>
            </Button>
          </div>

          <Button
            size="sm"
            onClick={() => onNavigateToDayDetail(dayCurriculum.day)}
            className="text-xs flex items-center gap-1.5"
          >
            <span>Open Day Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
