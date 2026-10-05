import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Calendar, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { CURRICULUM_DAYS } from '../../data/curriculum';
import { DayProgress } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysData: Record<number, DayProgress>;
  onSelectDay: (day: number) => void;
}

interface SearchResultItem {
  day: number;
  title: string;
  weekTheme: string;
  matchedIn: 'day' | 'title' | 'topic' | 'task' | 'notes';
  matchSnippet: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  daysData,
  onSelectDay,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results: SearchResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: SearchResultItem[] = [];

    // Search through all 60 curriculum days and user notes
    for (const curr of CURRICULUM_DAYS) {
      const dayNum = curr.day;
      const progress = daysData[dayNum];

      // Match by Day Number (e.g. "17" or "day 17")
      if (q === `${dayNum}` || q === `day ${dayNum}` || q === `day${dayNum}`) {
        matches.push({
          day: dayNum,
          title: curr.title,
          weekTheme: curr.weekTheme,
          matchedIn: 'day',
          matchSnippet: `Day ${dayNum}: ${curr.title}`,
        });
        continue;
      }

      // Match by Title
      if (curr.title.toLowerCase().includes(q)) {
        matches.push({
          day: dayNum,
          title: curr.title,
          weekTheme: curr.weekTheme,
          matchedIn: 'title',
          matchSnippet: curr.title,
        });
        continue;
      }

      // Match by Topic
      const matchedTopic = curr.learningTopics.find((t) => t.toLowerCase().includes(q));
      if (matchedTopic) {
        matches.push({
          day: dayNum,
          title: curr.title,
          weekTheme: curr.weekTheme,
          matchedIn: 'topic',
          matchSnippet: `Topic: ${matchedTopic}`,
        });
        continue;
      }

      // Match by Description
      if (curr.description.toLowerCase().includes(q)) {
        matches.push({
          day: dayNum,
          title: curr.title,
          weekTheme: curr.weekTheme,
          matchedIn: 'task',
          matchSnippet: curr.description,
        });
        continue;
      }

      // Match by Default or Custom Tasks
      const allTasks = [...curr.defaultTasks, ...(progress?.customTasks || [])];
      const matchedTask = allTasks.find((t) => t.toLowerCase().includes(q));
      if (matchedTask) {
        matches.push({
          day: dayNum,
          title: curr.title,
          weekTheme: curr.weekTheme,
          matchedIn: 'task',
          matchSnippet: `Task: ${matchedTask}`,
        });
        continue;
      }

      // Match by User Notes (whatILearned, whatIBuilt, whatBroke, biggestTakeaway, notes)
      if (progress) {
        const noteFields: { label: string; text?: string }[] = [
          { label: 'Learned', text: progress.whatILearned },
          { label: 'Built', text: progress.whatIBuilt },
          { label: 'Broke', text: progress.whatBroke },
          { label: 'Takeaway', text: progress.biggestTakeaway },
          { label: 'Notes', text: progress.notes },
        ];

        for (const item of noteFields) {
          if (item.text && item.text.toLowerCase().includes(q)) {
            matches.push({
              day: dayNum,
              title: curr.title,
              weekTheme: curr.weekTheme,
              matchedIn: 'notes',
              matchSnippet: `${item.label}: "${item.text.slice(0, 75)}${item.text.length > 75 ? '...' : ''}"`,
            });
            break;
          }
        }
      }
    }

    return matches;
  }, [query, daysData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div 
        role="dialog" 
        aria-modal="true" 
        className="relative z-50 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all animate-in fade-in-0 zoom-in-95"
      >
        {/* Search Input bar */}
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Day #, topic (e.g. cache, index, redis), or your notes..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Quick Search</p>
              <p>Type keywords like <span className="font-mono text-emerald-500">"cache"</span>, <span className="font-mono text-emerald-500">"docker"</span>, <span className="font-mono text-emerald-500">"index"</span>, or <span className="font-mono text-emerald-500">"17"</span> to find curriculum and notes.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching curriculum or notes found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Results ({results.length})
              </div>
              {results.map((item) => (
                <button
                  key={`${item.day}-${item.matchedIn}`}
                  onClick={() => {
                    onSelectDay(item.day);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-lg p-2.5 text-left text-xs transition-colors hover:bg-secondary/70 group cursor-pointer"
                >
                  <div className="flex items-start gap-3 overflow-hidden">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                      {item.day}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground truncate group-hover:text-emerald-500 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate border border-border px-1.5 py-0.2 rounded">
                          {item.weekTheme}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
                        {item.matchedIn === 'notes' && <BookOpen className="h-3 w-3 text-amber-500" />}
                        {item.matchedIn === 'topic' && <Layers className="h-3 w-3 text-blue-500" />}
                        {item.matchedIn === 'day' && <Calendar className="h-3 w-3 text-emerald-500" />}
                        <span>{item.matchSnippet}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
