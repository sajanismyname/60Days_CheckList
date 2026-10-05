import React from 'react';
import { CURRICULUM_DAYS } from '../../data/curriculum';
import { DayProgress } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { CheckCircle2, BookOpen, Code2, ArrowRight } from 'lucide-react';

interface RecentActivityProps {
  daysData: Record<number, DayProgress>;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  daysData,
  currentDay,
  onSelectDay,
}) => {
  // Find days that have completed tasks, completed status, or notes
  const activeDays = CURRICULUM_DAYS.filter((curr) => {
    const data = daysData[curr.day];
    return data && (data.completed || data.completedTasks.length > 0 || data.notes || data.biggestTakeaway);
  })
    .sort((a, b) => b.day - a.day)
    .slice(0, 5);

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <CardTitle className="text-base font-semibold">
          Recent Activity & Notes
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Your latest progress milestones and takeaways
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0">
        {activeDays.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
            No activity logged yet. Check off your first task for Day {currentDay} above to start building your streak!
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeDays.map((curr) => {
              const data = daysData[curr.day];
              const isCompleted = data?.completed;
              const completedCount = data?.completedTasks.length || 0;
              const totalTasks = curr.defaultTasks.length + (data?.customTasks?.length || 0);

              return (
                <div
                  key={curr.day}
                  onClick={() => onSelectDay(curr.day)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border/60 bg-secondary/30 p-3 hover:border-border hover:bg-secondary/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-amber-500/50 flex items-center justify-center text-[9px] font-mono text-amber-500">
                          {completedCount}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">
                          Day {curr.day}
                        </span>
                        <span className="text-xs font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
                          {curr.title}
                        </span>
                      </div>

                      {data?.biggestTakeaway ? (
                        <p className="mt-1 text-xs text-muted-foreground italic flex items-center gap-1.5">
                          <BookOpen className="h-3 w-3 text-amber-500 shrink-0" />
                          <span className="truncate max-w-md">"{data.biggestTakeaway}"</span>
                        </p>
                      ) : (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {completedCount}/{totalTasks} tasks finished • Week {curr.week}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center self-end text-xs text-muted-foreground">
                    {data?.leetcodeProblems && data.leetcodeProblems.length > 0 && (
                      <span className="flex items-center gap-1 font-mono text-[11px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">
                        <Code2 className="h-3 w-3" />
                        {data.leetcodeProblems.length} LC
                      </span>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
