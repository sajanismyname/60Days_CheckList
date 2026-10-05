import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Share2, 
  Calendar, 
  Layers, 
  Plus, 
  X, 
  Check, 
  Flame
} from 'lucide-react';
import { DayProgress, LeetCodeProblem } from '../../types';
import { getCurriculumDay } from '../../data/curriculum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { DailyNotes } from './DailyNotes';
import { DayLeetCode } from './DayLeetCode';
import { XPostModal } from './XPostModal';
import { cn } from '../../lib/utils';

interface DayViewProps {
  dayNumber: number;
  currentCalculatedDay: number;
  dayProgress: DayProgress;
  onSelectDay: (day: number) => void;
  onUpdateDay: (day: number, updates: Partial<DayProgress>) => void;
  onToggleTask: (day: number, task: string) => void;
  onAddCustomTask: (day: number, task: string) => void;
  onRemoveCustomTask: (day: number, task: string) => void;
  onAddLeetCodeProblem: (problem: Omit<LeetCodeProblem, 'id'>) => void;
  onDeleteLeetCodeProblem: (id: string) => void;
  onMarkDayComplete: (day: number, completed: boolean) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  dayNumber,
  currentCalculatedDay,
  dayProgress,
  onSelectDay,
  onUpdateDay,
  onToggleTask,
  onAddCustomTask,
  onRemoveCustomTask,
  onAddLeetCodeProblem,
  onDeleteLeetCodeProblem,
  onMarkDayComplete,
}) => {
  const [isXModalOpen, setIsXModalOpen] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAddingCustomTask, setIsAddingCustomTask] = useState(false);

  const curriculum = getCurriculumDay(dayNumber);
  const completedTasks = dayProgress.completedTasks || [];
  const customTasks = dayProgress.customTasks || [];
  const allTasks = [...curriculum.defaultTasks, ...customTasks];
  const completedCount = completedTasks.length;
  const totalCount = allTasks.length;
  const isComplete = dayProgress.completed;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskInput.trim()) {
      onAddCustomTask(dayNumber, newTaskInput.trim());
      setNewTaskInput('');
      setIsAddingCustomTask(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Jump Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={dayNumber <= 1}
            onClick={() => onSelectDay(dayNumber - 1)}
            className="h-8 text-xs flex items-center gap-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Prev Day</span>
          </Button>

          {/* Day Selector dropdown */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-muted-foreground">Day</span>
            <select
              value={dayNumber}
              onChange={(e) => onSelectDay(Number(e.target.value))}
              aria-label="Select Challenge Day"
              className="h-8 rounded-md border border-input bg-secondary px-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {Array.from({ length: 60 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Day {d} {d === currentCalculatedDay ? '(Today)' : ''}
                </option>
              ))}
            </select>
            <span className="text-muted-foreground">of 60</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={dayNumber >= 60}
            onClick={() => onSelectDay(dayNumber + 1)}
            className="h-8 text-xs flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next Day</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {dayNumber !== currentCalculatedDay && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSelectDay(currentCalculatedDay)}
              className="h-8 text-xs flex items-center gap-1.5"
            >
              <Calendar className="h-3 w-3 text-emerald-500" />
              <span>Jump to Today (Day {currentCalculatedDay})</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsXModalOpen(true)}
            className="h-8 text-xs flex items-center gap-1.5 text-foreground hover:border-blue-400"
          >
            <Share2 className="h-3.5 w-3.5 text-blue-400" />
            <span>X Post</span>
            {dayProgress.xPosted && <span className="text-emerald-500 text-[10px]">✓</span>}
          </Button>
        </div>
      </div>

      {/* Main Day Header Card */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="p-5 sm:p-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Day {curriculum.day} / 60
                </span>
                <Badge variant="outline" className="text-[11px] font-mono">
                  Week {curriculum.week}: {curriculum.weekTheme}
                </Badge>
                {dayNumber === currentCalculatedDay && (
                  <Badge variant="warning" className="text-[10px] flex items-center gap-1">
                    <Flame className="h-3 w-3 fill-amber-500" /> Active Today
                  </Badge>
                )}
              </div>

              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {curriculum.title}
              </CardTitle>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {curriculum.description}
              </p>
            </div>

            {/* Complete Day Toggle Button */}
            <div className="flex items-center gap-3">
              <Button
                variant={isComplete ? 'default' : 'outline'}
                onClick={() => onMarkDayComplete(dayNumber, !isComplete)}
                className={cn(
                  'h-10 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all',
                  isComplete
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'border-border hover:border-emerald-500/50 hover:text-emerald-600'
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isComplete ? 'Day Complete ✓' : 'Mark Day Complete'}</span>
              </Button>
            </div>
          </div>

          {/* Learning Topics Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/60">
            <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
              <Layers className="h-3 w-3" /> Topics:
            </span>
            {curriculum.learningTopics.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-xs font-medium text-foreground/90 border border-border/50"
              >
                #{topic}
              </span>
            ))}
          </div>

          {/* Task Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>
                Today's Tasks: <strong className="text-foreground">{completedCount} of {totalCount} completed</strong>
              </span>
              <span className="font-mono font-bold text-foreground">{progressPercent}%</span>
            </div>
            <Progress
              value={progressPercent}
              className="h-2 bg-secondary"
              indicatorClassName={isComplete ? 'bg-emerald-500' : 'bg-emerald-500/80'}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Today's Checklist Section */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Today's Action Items & Tasks
            </CardTitle>
            <span className="text-xs text-muted-foreground font-mono">
              {completedCount}/{totalCount} Done
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0 space-y-2">
          {allTasks.map((task) => {
            const isTaskDone = completedTasks.includes(task);
            const isCustom = customTasks.includes(task);

            return (
              <div
                key={task}
                onClick={() => onToggleTask(dayNumber, task)}
                className={cn(
                  'group flex items-start justify-between rounded-lg p-3 transition-all cursor-pointer border select-none',
                  isTaskDone
                    ? 'border-emerald-500/20 bg-emerald-500/5 text-muted-foreground'
                    : 'border-border/60 bg-secondary/20 hover:border-border hover:bg-secondary/50 text-foreground'
                )}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={cn(
                      'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-all',
                      isTaskDone
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'border border-muted-foreground/40 group-hover:border-emerald-500'
                    )}
                  >
                    {isTaskDone && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-medium leading-relaxed',
                      isTaskDone && 'line-through text-muted-foreground/80'
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
                      onRemoveCustomTask(dayNumber, task);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-red-500 transition-all cursor-pointer"
                    title="Remove custom task"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add custom task */}
          <div className="pt-2">
            {isAddingCustomTask ? (
              <form onSubmit={handleAddTask} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Add custom task (e.g. read docs, benchmark EXPLAIN)..."
                  autoFocus
                  className="flex-1 h-8 rounded-md border border-input bg-transparent px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <Button type="submit" size="sm" className="h-8 text-xs">
                  Add Task
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingCustomTask(false)}
                  className="h-8 text-xs text-muted-foreground"
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingCustomTask(true)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-500" />
                <span>Add custom task to Day {dayNumber}</span>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* LeetCode Section for this day */}
      <DayLeetCode
        dayNumber={dayNumber}
        defaultFocus={curriculum.leetcodeFocus}
        dayProgress={dayProgress}
        onAddProblem={onAddLeetCodeProblem}
        onDeleteProblem={onDeleteLeetCodeProblem}
      />

      {/* Daily Notes: What I learned, built, broke, biggest takeaway */}
      <DailyNotes
        dayProgress={dayProgress}
        onUpdateDay={(updates) => onUpdateDay(dayNumber, updates)}
      />

      {/* X Post Modal */}
      <XPostModal
        isOpen={isXModalOpen}
        onClose={() => setIsXModalOpen(false)}
        dayCurriculum={curriculum}
        dayProgress={dayProgress}
        onUpdateDay={(updates) => onUpdateDay(dayNumber, updates)}
      />
    </div>
  );
};
