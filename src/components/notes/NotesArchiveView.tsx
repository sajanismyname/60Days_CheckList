import React, { useState, useMemo } from 'react';
import { CURRICULUM_DAYS } from '../../data/curriculum';
import { DayProgress } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  BookOpen, 
  Search, 
  Lightbulb, 
  Wrench, 
  Bug, 
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NotesArchiveViewProps {
  daysData: Record<number, DayProgress>;
  onSelectDay: (day: number) => void;
}

type NoteCategoryFilter = 'all' | 'takeaways' | 'learned' | 'built' | 'broke';

export const NotesArchiveView: React.FC<NotesArchiveViewProps> = ({
  daysData,
  onSelectDay,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<NoteCategoryFilter>('all');

  const notesList = useMemo(() => {
    const list: {
      day: number;
      title: string;
      week: number;
      takeaway?: string;
      learned?: string;
      built?: string;
      broke?: string;
      notes?: string;
    }[] = [];

    for (const curr of CURRICULUM_DAYS) {
      const data = daysData[curr.day];
      if (
        data &&
        (data.biggestTakeaway?.trim() ||
          data.whatILearned?.trim() ||
          data.whatIBuilt?.trim() ||
          data.whatBroke?.trim() ||
          data.notes?.trim())
      ) {
        list.push({
          day: curr.day,
          title: curr.title,
          week: curr.week,
          takeaway: data.biggestTakeaway?.trim(),
          learned: data.whatILearned?.trim(),
          built: data.whatIBuilt?.trim(),
          broke: data.whatBroke?.trim(),
          notes: data.notes?.trim(),
        });
      }
    }

    return list;
  }, [daysData]);

  const filteredNotes = useMemo(() => {
    return notesList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        `day ${item.day}`.includes(q) ||
        (item.takeaway && item.takeaway.toLowerCase().includes(q)) ||
        (item.learned && item.learned.toLowerCase().includes(q)) ||
        (item.built && item.built.toLowerCase().includes(q)) ||
        (item.broke && item.broke.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (categoryFilter === 'takeaways' && !item.takeaway) return false;
      if (categoryFilter === 'learned' && !item.learned) return false;
      if (categoryFilter === 'built' && !item.built) return false;
      if (categoryFilter === 'broke' && !item.broke) return false;

      return true;
    });
  }, [notesList, searchQuery, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Engineering Notes Repository
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Searchable collection of all your daily takeaways, implementation logs, and debugging solutions.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in notes & solutions..."
              className="h-8 pl-8 text-xs w-56 bg-card"
            />
          </div>

          <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs">
            <button
              onClick={() => setCategoryFilter('all')}
              className={cn(
                'rounded px-2 py-0.5 font-medium transition-colors cursor-pointer',
                categoryFilter === 'all' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground'
              )}
            >
              All
            </button>
            <button
              onClick={() => setCategoryFilter('takeaways')}
              className={cn(
                'rounded px-2 py-0.5 font-medium transition-colors cursor-pointer',
                categoryFilter === 'takeaways' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground'
              )}
            >
              Takeaways
            </button>
            <button
              onClick={() => setCategoryFilter('learned')}
              className={cn(
                'rounded px-2 py-0.5 font-medium transition-colors cursor-pointer',
                categoryFilter === 'learned' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground'
              )}
            >
              Learned
            </button>
            <button
              onClick={() => setCategoryFilter('built')}
              className={cn(
                'rounded px-2 py-0.5 font-medium transition-colors cursor-pointer',
                categoryFilter === 'built' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground'
              )}
            >
              Built
            </button>
            <button
              onClick={() => setCategoryFilter('broke')}
              className={cn(
                'rounded px-2 py-0.5 font-medium transition-colors cursor-pointer',
                categoryFilter === 'broke' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground'
              )}
            >
              Broke & Fixed
            </button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <Card className="border-border/80 p-8 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <h3 className="font-semibold text-sm text-foreground">No notes logged yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {notesList.length === 0
              ? 'As you work through daily challenges, record your takeaways, architectural discoveries, and bug fixes in the Today or Day Details view.'
              : 'No notes match your current search or category filter.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((item) => (
            <Card key={item.day} className="border-border/70 hover:border-border transition-colors shadow-xs">
              <CardHeader className="p-4 sm:p-5 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Day {item.day}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <CardTitle className="text-base font-semibold">
                      {item.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Week {item.week}
                    </Badge>
                  </div>

                  <button
                    onClick={() => onSelectDay(item.day)}
                    className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                  >
                    <span>Open Day</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
                {/* Biggest takeaway */}
                {item.takeaway && (
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">
                      <Lightbulb className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>Biggest Takeaway</span>
                    </div>
                    <p className="text-xs text-foreground font-medium leading-relaxed">
                      "{item.takeaway}"
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* What I learned */}
                  {item.learned && (
                    <div className="rounded-lg border border-border/60 bg-secondary/20 p-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>What I learned</span>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {item.learned}
                      </p>
                    </div>
                  )}

                  {/* What I built */}
                  {item.built && (
                    <div className="rounded-lg border border-border/60 bg-secondary/20 p-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                        <Wrench className="h-3.5 w-3.5" />
                        <span>What I built</span>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {item.built}
                      </p>
                    </div>
                  )}
                </div>

                {/* What broke */}
                {item.broke && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                      <Bug className="h-3.5 w-3.5" />
                      <span>What broke & How I debugged it</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed">
                      {item.broke}
                    </p>
                  </div>
                )}

                {/* Freeform notes */}
                {item.notes && (
                  <div className="rounded-lg border border-border/50 bg-secondary/15 p-2.5">
                    <div className="text-[11px] font-semibold text-muted-foreground mb-0.5">
                      Additional Notes
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {item.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
