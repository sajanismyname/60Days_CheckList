import React from 'react';
import { WEEKS_INFO } from '../../data/curriculum';
import { DayProgress } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { ArrowRight } from 'lucide-react';

interface WeeklyMiniProgressProps {
  daysData: Record<number, DayProgress>;
  currentDay: number;
  onSelectDay: (day: number) => void;
  onNavigateToWeekly: () => void;
}

export const WeeklyMiniProgress: React.FC<WeeklyMiniProgressProps> = ({
  daysData,
  currentDay,
  onSelectDay,
  onNavigateToWeekly,
}) => {
  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Weekly Curriculum Progress
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              8 weeks structured roadmaps + final capstone
            </p>
          </div>
          <button
            onClick={onNavigateToWeekly}
            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WEEKS_INFO.map((week) => {
            const totalDaysInWeek = week.days.length;
            const completedDaysInWeek = week.days.filter((d) => daysData[d]?.completed).length;
            const percent = Math.round((completedDaysInWeek / totalDaysInWeek) * 100);
            const isCurrentWeek = week.days.includes(currentDay);

            return (
              <div
                key={week.week}
                className={`rounded-lg border p-3 transition-all ${
                  isCurrentWeek
                    ? 'border-emerald-500/40 bg-emerald-500/5 shadow-xs'
                    : 'border-border/60 bg-secondary/20 hover:border-border hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <span>Week {week.week}</span>
                    {isCurrentWeek && (
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground font-medium">
                    {completedDaysInWeek}/{totalDaysInWeek} days
                  </span>
                </div>

                <div className="text-xs font-medium text-foreground truncate mb-2">
                  {week.title}
                </div>

                <Progress value={percent} className="h-1.5 mb-2 bg-secondary" />

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="truncate max-w-[130px]" title={week.leetcodeCategory}>
                    LC: {week.leetcodeCategory}
                  </span>
                  <div className="flex gap-1">
                    {week.days.map((d) => (
                      <button
                        key={d}
                        onClick={() => onSelectDay(d)}
                        className={`h-4 w-4 rounded-xs text-[9px] font-mono flex items-center justify-center cursor-pointer transition-colors ${
                          daysData[d]?.completed
                            ? 'bg-emerald-500 text-white'
                            : d === currentDay
                            ? 'bg-amber-500 text-white font-bold'
                            : 'bg-muted text-muted-foreground hover:bg-muted-foreground/30'
                        }`}
                        title={`Day ${d}: ${daysData[d]?.completed ? 'Completed' : 'Pending'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
