import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Map, 
  Code2, 
  Menu, 
  X, 
  CalendarRange, 
  BookOpen, 
  Settings, 
  CheckCircle2, 
  Flame,
  Search
} from 'lucide-react';
import { NavTab, ChallengeStats } from '../../types';
import { cn } from '../../lib/utils';
import { Progress } from '../ui/progress';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  stats: ChallengeStats;
  currentDay: number;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  stats,
  currentDay,
  onOpenSearch,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const primaryTabs: { tab: NavTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: 'Home', icon: <LayoutDashboard className="h-5 w-5" /> },
    { tab: 'today', label: `Day ${currentDay}`, icon: <CalendarCheck className="h-5 w-5" /> },
    { tab: 'roadmap', label: 'Roadmap', icon: <Map className="h-5 w-5" /> },
    { tab: 'leetcode', label: 'LeetCode', icon: <Code2 className="h-5 w-5" /> },
  ];

  const drawerTabs: { tab: NavTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { tab: 'weekly', label: 'Weekly Progress', icon: <CalendarRange className="h-4 w-4" />, desc: '8-week curriculum breakdown' },
    { tab: 'notes', label: 'Notes Repository', icon: <BookOpen className="h-4 w-4" />, desc: 'All daily learnings, bugs & takeaways' },
    { tab: 'settings', label: 'Settings & Backup', icon: <Settings className="h-4 w-4" />, desc: 'Export, import & challenge start date' },
  ];

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur px-2 py-1 safe-area-pb"
      >
        <div className="flex items-center justify-around">
          {primaryTabs.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleSelect(item.tab)}
                className={cn(
                  'flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'text-emerald-500 font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.icon}
                <span className="mt-0.5">{item.label}</span>
              </button>
            );
          })}

          {/* More trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors cursor-pointer',
              ['weekly', 'notes', 'settings'].includes(currentTab)
                ? 'text-emerald-500 font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="mt-0.5">More</span>
          </button>
        </div>
      </nav>

      {/* Drawer Overlay & Sheet */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative z-50 rounded-t-2xl border-t border-border bg-card p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="mx-auto -mt-2 mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
            
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
              <div>
                <h3 className="font-semibold text-sm text-foreground">Menu & Views</h3>
                <p className="text-xs text-muted-foreground">#60DaysOfLearning Challenge</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5 mb-4">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenSearch();
                }}
                className="flex w-full items-center gap-3 rounded-lg border border-border/70 bg-secondary/40 p-2.5 text-left text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <Search className="h-4 w-4 text-emerald-500" />
                <div>
                  <div className="font-semibold">Quick Search</div>
                  <div className="text-[11px] text-muted-foreground">Search curriculum topics & notes</div>
                </div>
              </button>

              {drawerTabs.map((item) => {
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleSelect(item.tab)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg p-2.5 text-left text-xs font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-secondary text-foreground font-semibold'
                        : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className={cn('p-1 rounded-md bg-secondary', isActive ? 'text-emerald-500' : '')}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">{item.label}</div>
                      <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Stats overview in drawer */}
            <div className="rounded-lg border border-border/70 bg-background/50 p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-foreground">Progress</span>
                <span className="font-mono text-emerald-500 font-bold">{stats.progressPercentage}%</span>
              </div>
              <Progress value={stats.progressPercentage} className="h-1.5 mb-2" />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {stats.completedDaysCount}/60 days
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Flame className="h-3 w-3 fill-amber-500" />
                  {stats.currentStreak} day streak
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
