import React from 'react';
import { DayProgress } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { BookOpen, Wrench, Bug, Lightbulb } from 'lucide-react';

interface DailyNotesProps {
  dayProgress: DayProgress;
  onUpdateDay: (updates: Partial<DayProgress>) => void;
}

export const DailyNotes: React.FC<DailyNotesProps> = ({
  dayProgress,
  onUpdateDay,
}) => {
  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-emerald-500" />
          <span>Daily Notes & Reflections</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Document your engineering discoveries, implementations, and debugging insights. Auto-persisted to local storage.
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
        {/* Biggest Takeaway (Short single-line or punchy box) */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1.5">
            <Lightbulb className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>Biggest Takeaway</span>
          </label>
          <Input
            value={dayProgress.biggestTakeaway || ''}
            onChange={(e) => onUpdateDay({ biggestTakeaway: e.target.value })}
            placeholder="One core mental model or aha-moment from today..."
            className="bg-background text-xs border-amber-500/30 focus-visible:ring-amber-500 font-medium"
          />
        </div>

        {/* Grid of What I Learned and What I Built */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What I learned */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <BookOpen className="h-3.5 w-3.5 text-blue-500" />
              <span>What I learned</span>
            </label>
            <Textarea
              value={dayProgress.whatILearned || ''}
              onChange={(e) => onUpdateDay({ whatILearned: e.target.value })}
              placeholder="Concepts, internal mechanics, protocol nuances, edge cases..."
              className="h-32 text-xs leading-relaxed bg-secondary/20"
            />
          </div>

          {/* What I built */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Wrench className="h-3.5 w-3.5 text-emerald-500" />
              <span>What I built</span>
            </label>
            <Textarea
              value={dayProgress.whatIBuilt || ''}
              onChange={(e) => onUpdateDay({ whatIBuilt: e.target.value })}
              placeholder="Code prototypes, benchmarks, scripts, sample apps, schemas..."
              className="h-32 text-xs leading-relaxed bg-secondary/20"
            />
          </div>
        </div>

        {/* What broke (Debugging Notes) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Bug className="h-3.5 w-3.5 text-red-500" />
            <span>What broke (Debugging Notes)</span>
          </label>
          <Textarea
            value={dayProgress.whatBroke || ''}
            onChange={(e) => onUpdateDay({ whatBroke: e.target.value })}
            placeholder="Errors encountered, stack trace investigations, unexpected gotchas, and how you fixed them..."
            className="h-24 text-xs leading-relaxed bg-secondary/20 font-mono"
          />
        </div>

        {/* General Additional Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Additional Free-form Notes & References
          </label>
          <Textarea
            value={dayProgress.notes || ''}
            onChange={(e) => onUpdateDay({ notes: e.target.value })}
            placeholder="Articles read, documentation bookmarks, commands run..."
            className="h-20 text-xs leading-relaxed bg-secondary/20"
          />
        </div>
      </CardContent>
    </Card>
  );
};
