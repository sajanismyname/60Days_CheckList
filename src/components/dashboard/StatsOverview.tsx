import React from 'react';
import { Flame, CheckCircle2, Brain, Code2, Trophy } from 'lucide-react';
import { ChallengeStats } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

interface StatsOverviewProps {
  stats: ChallengeStats;
  currentDay: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, currentDay }) => {
  return (
    <div className="space-y-4">
      {/* Top Banner Card */}
      <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-emerald-500/5 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  #60DaysOfLearning
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Challenge in Progress
                </span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Day {currentDay} <span className="text-muted-foreground font-normal text-lg sm:text-xl">/ 60</span>
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                Keep the momentum going. Software engineering mastery is built one daily commitment at a time.
              </p>
            </div>

            {/* Overall Percentage badge */}
            <div className="flex items-baseline md:flex-col md:items-end justify-between border-t md:border-t-0 border-border/60 pt-3 md:pt-0">
              <span className="text-xs text-muted-foreground">Overall Completion</span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {stats.progressPercentage}%
              </div>
            </div>
          </div>

          {/* Large Progress Bar */}
          <div className="mt-4">
            <Progress value={stats.progressPercentage} className="h-2.5 bg-secondary" indicatorClassName="bg-emerald-500" />
            <div className="mt-1.5 flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>Day 1</span>
              <span>{stats.completedDaysCount} of 60 days complete</span>
              <span>Day 60</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Stat Cards matching user prompt specifications */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak */}
        <Card className="border-border/70 hover:border-amber-500/40 transition-all shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Current Streak</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Flame className="h-4 w-4 fill-amber-500" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-foreground">
                {stats.currentStreak}
              </span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
              <Trophy className="h-3 w-3 text-amber-500" />
              Best: {stats.longestStreak} days
            </p>
          </CardContent>
        </Card>

        {/* Days Completed */}
        <Card className="border-border/70 hover:border-emerald-500/40 transition-all shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Days Completed</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-foreground">
                {stats.completedDaysCount}
              </span>
              <span className="text-xs text-muted-foreground">/ 60</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {60 - stats.completedDaysCount} days remaining
            </p>
          </CardContent>
        </Card>

        {/* Topics Learned */}
        <Card className="border-border/70 hover:border-blue-500/40 transition-all shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Topics Mastered</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Brain className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-foreground">
                {stats.totalTopicsLearned}
              </span>
              <span className="text-xs text-muted-foreground">topics</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Across systems & architecture
            </p>
          </CardContent>
        </Card>

        {/* LeetCode Solved */}
        <Card className="border-border/70 hover:border-purple-500/40 transition-all shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">LeetCode Solved</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <Code2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-foreground">
                {stats.totalLeetCodeSolved}
              </span>
              <span className="text-xs text-muted-foreground">problems</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="text-emerald-500 font-medium">{stats.easyCount}E</span>
              <span>•</span>
              <span className="text-amber-500 font-medium">{stats.mediumCount}M</span>
              <span>•</span>
              <span className="text-red-500 font-medium">{stats.hardCount}H</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
