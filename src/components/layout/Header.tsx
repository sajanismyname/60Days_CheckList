import React from 'react';
import { Flame, Search, Sun, Moon, Laptop, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Theme } from '../../hooks/useTheme';
import { formatDate, getTodayDateString } from '../../lib/utils';

interface HeaderProps {
  currentDay: number;
  currentStreak: number;
  completedDaysCount: number;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onOpenSearch: () => void;
  onSelectToday: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  currentStreak,
  completedDaysCount,
  theme,
  onThemeChange,
  onOpenSearch,
  onSelectToday,
}) => {
  const nextTheme: Record<Theme, Theme> = {
    light: 'dark',
    dark: 'system',
    system: 'light',
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    return <Laptop className="h-4 w-4" />;
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm sm:text-base tracking-tight text-foreground">
            Checklist
          </span>
          <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground border-l border-border pl-2.5 ml-0.5">
            #60DaysOfLearning
          </span>
        </div>

        <button
          onClick={onSelectToday}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-all cursor-pointer"
          title="Jump to today's active day"
        >
          <Calendar className="h-3 w-3 text-emerald-500" />
          <span>Day {currentDay} / 60</span>
          <span className="hidden md:inline text-muted-foreground text-[10px]">
            ({formatDate(getTodayDateString())})
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-lg border border-border/70 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground hover:border-border hover:bg-secondary transition-all cursor-pointer"
          aria-label="Search curriculum and notes"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search curriculum & notes...</span>
          <kbd className="hidden sm:inline-flex h-4 items-center rounded border border-border bg-background px-1 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Streak Counter Badge */}
        <div 
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 select-none"
          title={`${currentStreak} day learning streak! (${completedDaysCount} days fully completed)`}
        >
          <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>{currentStreak}d</span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onThemeChange(nextTheme[theme])}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={`Current theme: ${theme}. Click to switch.`}
          title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
        >
          {getThemeIcon()}
        </Button>
      </div>
    </header>
  );
};
