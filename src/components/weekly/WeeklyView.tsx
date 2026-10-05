import React from 'react';
import { WEEKS_INFO, CURRICULUM_DAYS } from '../../data/curriculum';
import { DayProgress } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  CheckCircle2, 
  Layers, 
  Code2, 
  Share2 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface WeeklyViewProps {
  daysData: Record<number, DayProgress>;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  daysData,
  currentDay,
  onSelectDay,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Weekly Progress Breakdown
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Curriculum milestone analysis across 8 structured engineering domains and the final capstone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WEEKS_INFO.map((week) => {
          const totalDays = week.days.length;
          const completedDays = week.days.filter((d) => daysData[d]?.completed).length;
          const progressPercent = Math.round((completedDays / totalDays) * 100);

          // Gather unique topics for this week
          const weekCurriculum = CURRICULUM_DAYS.filter((d) => week.days.includes(d.day));
          const allTopics = Array.from(
            new Set(weekCurriculum.flatMap((d) => d.learningTopics))
          ).slice(0, 8);

          // Total LeetCode solved in this week
          const leetcodeCount = week.days.reduce((acc, d) => {
            return acc + (daysData[d]?.leetcodeProblems?.length || 0);
          }, 0);

          // Total X posts in this week
          const xPostCount = week.days.reduce((acc, d) => {
            return acc + (daysData[d]?.xPosted ? 1 : 0);
          }, 0);

          const isCurrentWeek = week.days.includes(currentDay);

          return (
            <Card
              key={week.week}
              className={cn(
                'border transition-all flex flex-col justify-between shadow-xs',
                isCurrentWeek
                  ? 'border-emerald-500/50 bg-card shadow-sm'
                  : 'border-border/70 bg-card hover:border-border'
              )}
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Week {week.week}
                    </span>
                    {isCurrentWeek && (
                      <Badge variant="warning" className="text-[10px] font-mono">
                        Active Week
                      </Badge>
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {completedDays} / {totalDays} days complete
                  </span>
                </div>

                <CardTitle className="text-base sm:text-lg font-semibold mt-1">
                  {week.title}
                </CardTitle>

                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  {week.description}
                </p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Week Completion</span>
                    <span className="font-mono font-semibold text-foreground">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2 bg-secondary" indicatorClassName="bg-emerald-500" />
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                  <div className="rounded-lg bg-secondary/30 p-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                      <Code2 className="h-3.5 w-3.5 text-purple-500" />
                      <span>LeetCode Practice</span>
                    </div>
                    <div className="font-mono font-bold text-sm text-foreground">
                      {leetcodeCount} solved
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate" title={week.leetcodeCategory}>
                      Focus: {week.leetcodeCategory}
                    </div>
                  </div>

                  <div className="rounded-lg bg-secondary/30 p-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                      <Share2 className="h-3.5 w-3.5 text-blue-400" />
                      <span>X Posts</span>
                    </div>
                    <div className="font-mono font-bold text-sm text-foreground">
                      {xPostCount} / {totalDays}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Shared publicly
                    </div>
                  </div>
                </div>

                {/* Topics list */}
                <div>
                  <div className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
                    <Layers className="h-3 w-3 text-emerald-500" />
                    <span>Core Learning Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {allTopics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-foreground/80 font-medium border border-border/40"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Days interactive buttons */}
                <div className="pt-2 border-t border-border/50">
                  <div className="text-[11px] font-medium text-muted-foreground mb-1.5">
                    Days in this week:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {week.days.map((dayNum) => {
                      const dayCurriculum = CURRICULUM_DAYS.find((d) => d.day === dayNum);
                      const isDayDone = daysData[dayNum]?.completed;
                      const isCurrent = dayNum === currentDay;

                      return (
                        <button
                          key={dayNum}
                          onClick={() => onSelectDay(dayNum)}
                          className={cn(
                            'group flex items-center gap-1 rounded-md px-2 py-1 text-xs font-mono transition-all cursor-pointer border',
                            isDayDone
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                              : isCurrent
                              ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                              : 'border-border/60 bg-secondary/40 text-foreground hover:bg-secondary'
                          )}
                          title={`Day ${dayNum}: ${dayCurriculum?.title}`}
                        >
                          <span>Day {dayNum}</span>
                          {isDayDone && <CheckCircle2 className="h-3 w-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
