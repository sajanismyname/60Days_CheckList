import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Map, 
  Code2, 
  CalendarRange, 
  BookOpen, 
  Settings, 
  Flame, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { NavTab, ChallengeStats } from '../../types';
import { cn } from '../../lib/utils';
import { Progress } from '../ui/progress';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  stats: ChallengeStats;
  currentDay: number;
  todayCompleted: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  stats,
  currentDay,
  todayCompleted,
}) => {
  const navItems: { tab: NavTab; label: string; icon: React.ReactNode; badge?: React.ReactNode }[] = [
    {
      tab: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      tab: 'today',
      label: `Today (Day ${currentDay})`,
      icon: <CalendarCheck className="h-4 w-4" />,
      badge: todayCompleted ? (
        <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Today completed" />
      ) : (
        <span className="flex h-2 w-2 rounded-full bg-amber-500" title="Tasks pending" />
      ),
    },
    {
      tab: 'roadmap',
      label: '60-Day Roadmap',
      icon: <Map className="h-4 w-4" />,
      badge: (
        <span className="text-[10px] font-mono font-medium text-muted-foreground">
          {stats.completedDaysCount}/60
        </span>
      ),
    },
    {
      tab: 'leetcode',
      label: 'LeetCode',
      icon: <Code2 className="h-4 w-4" />,
      badge: (
        <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
          {stats.totalLeetCodeSolved}
        </span>
      ),
    },
    {
      tab: 'weekly',
      label: 'Weekly Progress',
      icon: <CalendarRange className="h-4 w-4" />,
    },
    {
      tab: 'notes',
      label: 'Notes Repository',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      tab: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/70 bg-card/40 backdrop-blur justify-between select-none">
      <div className="flex flex-col p-4">
        {/* App Title / Header */}
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground">
                Checklist
              </h1>
              <p className="text-[11px] font-mono text-muted-foreground">
                #60DaysOfLearning
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all text-left cursor-pointer group',
                  isActive
                    ? 'bg-secondary text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-emerald-500' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Progress Card in Sidebar */}
      <div className="p-4 border-t border-border/70 bg-card/60">
        <div className="rounded-lg border border-border/60 bg-background/50 p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-foreground">Challenge</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {stats.progressPercentage}%
            </span>
          </div>
          <Progress value={stats.progressPercentage} className="h-1.5 mb-2.5" />
          
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              {stats.completedDaysCount}/60 days
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-500">
              <Flame className="h-3 w-3 fill-amber-500" />
              {stats.currentStreak}d
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
