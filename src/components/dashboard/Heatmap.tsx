import React, { useState } from 'react';
import { CURRICULUM_DAYS } from '../../data/curriculum';
import { DayProgress, HeatmapStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import { Check, Flame, Twitter } from 'lucide-react';

interface HeatmapProps {
  daysData: Record<number, DayProgress>;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

export const Heatmap: React.FC<HeatmapProps> = ({
  daysData,
  currentDay,
  onSelectDay,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const getDayStatus = (dayNum: number): HeatmapStatus => {
    const data = daysData[dayNum];
    if (!data) return 'not_started';
    if (data.completed) return 'completed';
    const completedCount = data.completedTasks?.length || 0;
    if (completedCount === 0) return 'not_started';
    const curriculum = CURRICULUM_DAYS.find((d) => d.day === dayNum);
    const totalTasks = (curriculum?.defaultTasks.length || 5) + (data.customTasks?.length || 0);
    if (completedCount >= totalTasks) return 'completed';
    if (completedCount >= Math.ceil(totalTasks / 2)) return 'partially_completed';
    return 'started';
  };

  const getStatusColor = (status: HeatmapStatus, isCurrent: boolean) => {
    let base = '';
    switch (status) {
      case 'completed':
        base = 'bg-emerald-500 hover:bg-emerald-600 text-white';
        break;
      case 'partially_completed':
        base = 'bg-emerald-500/50 hover:bg-emerald-500/70 text-foreground';
        break;
      case 'started':
        base = 'bg-emerald-500/20 hover:bg-emerald-500/35 text-foreground';
        break;
      case 'not_started':
      default:
        base = 'bg-secondary hover:bg-secondary/80 text-muted-foreground';
        break;
    }

    if (isCurrent) {
      base += ' ring-2 ring-emerald-500 ring-offset-2 ring-offset-background font-bold';
    }

    return base;
  };

  const hoveredCurriculum = hoveredDay ? CURRICULUM_DAYS.find((d) => d.day === hoveredDay) : null;
  const hoveredData = hoveredDay ? daysData[hoveredDay] : null;
  const hoveredCompletedTasks = hoveredData?.completedTasks?.length || 0;
  const hoveredTotalTasks = (hoveredCurriculum?.defaultTasks.length || 5) + (hoveredData?.customTasks?.length || 0);

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">
              60-Day Contribution Heatmap
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visual activity across all 60 challenge milestones. Click any square to view day details.
            </p>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>Less</span>
            <div className="h-3 w-3 rounded-xs bg-secondary" title="Not started" />
            <div className="h-3 w-3 rounded-xs bg-emerald-500/20" title="Started" />
            <div className="h-3 w-3 rounded-xs bg-emerald-500/50" title="Partially completed" />
            <div className="h-3 w-3 rounded-xs bg-emerald-500" title="Completed" />
            <span>More</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0">
        {/* The 60 Squares Grid */}
        <div className="relative">
          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-1.5 sm:gap-2">
            {CURRICULUM_DAYS.map((curr) => {
              const dayNum = curr.day;
              const status = getDayStatus(dayNum);
              const isCurrent = dayNum === currentDay;

              return (
                <button
                  key={dayNum}
                  onClick={() => onSelectDay(dayNum)}
                  onMouseEnter={() => setHoveredDay(dayNum)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={cn(
                    'relative aspect-square rounded-md flex items-center justify-center text-xs transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none',
                    getStatusColor(status, isCurrent)
                  )}
                  aria-label={`Day ${dayNum}: ${curr.title}. Status: ${status}`}
                >
                  <span className="font-mono text-[11px] font-medium">
                    {dayNum}
                  </span>
                  {status === 'completed' && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-600 text-[8px] text-white">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Hover Info Panel */}
          {hoveredDay && hoveredCurriculum && (
            <div className="mt-4 rounded-lg border border-border/80 bg-secondary/40 p-3 text-xs animate-in fade-in-0 duration-150">
              <div className="flex items-center justify-between font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    Day {hoveredDay}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>{hoveredCurriculum.title}</span>
                </div>
                <span className="text-[10px] uppercase font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-background border border-border">
                  Week {hoveredCurriculum.week}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-foreground font-mono">{hoveredCompletedTasks}/{hoveredTotalTasks}</span> tasks completed
                </span>

                <span className="flex items-center gap-1 font-mono">
                  <span>💻</span>
                  <span className="text-foreground">{hoveredData?.leetcodeProblems?.length || 0}</span> LeetCode
                </span>

                <span className="flex items-center gap-1">
                  <Twitter className="h-3.5 w-3.5 text-blue-400" />
                  {hoveredData?.xPosted ? (
                    <span className="text-emerald-500 font-medium">X posted ✓</span>
                  ) : (
                    <span>Not posted</span>
                  )}
                </span>

                {hoveredDay === currentDay && (
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <Flame className="h-3 w-3 fill-amber-500" /> Today's target
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
