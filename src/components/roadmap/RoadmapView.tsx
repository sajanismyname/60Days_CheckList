import React, { useState } from 'react';
import { CURRICULUM_DAYS, WEEKS_INFO } from '../../data/curriculum';
import { DayProgress } from '../../types';
import { Badge } from '../ui/badge';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RoadmapViewProps {
  daysData: Record<number, DayProgress>;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

type FilterOption = 'all' | 'completed' | 'pending';

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  daysData,
  currentDay,
  onSelectDay,
}) => {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');

  const filteredDays = CURRICULUM_DAYS.filter((curr) => {
    const data = daysData[curr.day];
    const isCompleted = data?.completed || (data?.completedTasks?.length || 0) >= curr.defaultTasks.length;

    if (filter === 'completed' && !isCompleted) return false;
    if (filter === 'pending' && isCompleted) return false;
    if (selectedWeek !== 'all' && curr.week !== selectedWeek) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            60-Day Engineering Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Complete curriculum timeline. Track progress, explore upcoming topics, and jump into any day.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
                filter === 'all' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              All (60)
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={cn(
                'rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
                filter === 'completed' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={cn(
                'rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
                filter === 'pending' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Upcoming / Pending
            </button>
          </div>

          {/* Week Filter selector */}
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="h-8 rounded-lg border border-border bg-card px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Weeks</option>
            {WEEKS_INFO.map((w) => (
              <option key={w.week} value={w.week}>
                Week {w.week}: {w.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Week-by-Week Timeline */}
      <div className="space-y-6">
        {WEEKS_INFO.filter((w) => selectedWeek === 'all' || w.week === selectedWeek).map((week) => {
          const weekDays = filteredDays.filter((d) => d.week === week.week);
          if (weekDays.length === 0) return null;

          const completedCount = week.days.filter((d) => daysData[d]?.completed).length;

          return (
            <div key={week.week} className="space-y-3">
              {/* Week header banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Week {week.week}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <h3 className="font-semibold text-sm sm:text-base text-foreground">
                    {week.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{completedCount}/{week.days.length} completed</span>
                  <span>•</span>
                  <span>LC: {week.leetcodeCategory}</span>
                </div>
              </div>

              {/* Days List in this week */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {weekDays.map((curr) => {
                  const dayNum = curr.day;
                  const data = daysData[dayNum];
                  const completedTasks = data?.completedTasks || [];
                  const customTasks = data?.customTasks || [];
                  const totalTasks = curr.defaultTasks.length + customTasks.length;
                  const isCompleted = data?.completed || (totalTasks > 0 && completedTasks.length >= totalTasks);
                  const isCurrent = dayNum === currentDay;

                  // Visual state determination
                  const stateClass = isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
                    : isCurrent
                    ? 'border-amber-500/50 bg-amber-500/5 hover:border-amber-500 shadow-xs'
                    : 'border-border/70 bg-card hover:border-border hover:bg-secondary/30';

                  return (
                    <div
                      key={dayNum}
                      onClick={() => onSelectDay(dayNum)}
                      className={cn(
                        'group rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between',
                        stateClass
                      )}
                    >
                      <div>
                        {/* Top row */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-foreground">
                              Day {dayNum}
                            </span>
                            {isCurrent && (
                              <Badge variant="warning" className="text-[10px] font-mono">
                                Current
                              </Badge>
                            )}
                            {isCompleted && (
                              <Badge variant="success" className="text-[10px] font-mono">
                                Completed
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                            {isCompleted ? (
                              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                                <Check className="h-3.5 w-3.5" /> {completedTasks.length}/{totalTasks} tasks
                              </span>
                            ) : (
                              <span>
                                {completedTasks.length}/{totalTasks} tasks
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-emerald-500 transition-colors">
                          {curr.title}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {curr.description}
                        </p>
                      </div>

                      {/* Footer with topics & arrow */}
                      <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {curr.learningTopics.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded"
                            >
                              {t}
                            </span>
                          ))}
                          {curr.learningTopics.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{curr.learningTopics.length - 2}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                          <span>Details</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
