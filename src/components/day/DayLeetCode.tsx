import React, { useState } from 'react';
import { DayProgress, LeetCodeProblem, Difficulty } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Code2, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { LEETCODE_PATTERNS } from '../../data/leetcodePatterns';
import { getTodayDateString } from '../../lib/utils';

interface DayLeetCodeProps {
  dayNumber: number;
  defaultFocus?: string;
  dayProgress: DayProgress;
  onAddProblem: (problem: Omit<LeetCodeProblem, 'id'>) => void;
  onDeleteProblem: (id: string) => void;
}

export const DayLeetCode: React.FC<DayLeetCodeProps> = ({
  dayNumber,
  defaultFocus,
  dayProgress,
  onAddProblem,
  onDeleteProblem,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [number, setNumber] = useState('');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [pattern, setPattern] = useState(LEETCODE_PATTERNS[0]);
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const problems = dayProgress.leetcodeProblems || [];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddProblem({
      number: number.trim(),
      title: title.trim(),
      difficulty,
      pattern,
      url: url.trim() || (number ? `https://leetcode.com/problemset/all/?search=${number}` : undefined),
      notes: notes.trim(),
      dateSolved: getTodayDateString(),
      daySolved: dayNumber,
    });

    // Reset form
    setNumber('');
    setTitle('');
    setUrl('');
    setNotes('');
    setIsAdding(false);
  };

  const difficultyVariant = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy':
        return 'success' as const;
      case 'Medium':
        return 'warning' as const;
      case 'Hard':
        return 'destructive' as const;
    }
  };

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Code2 className="h-4 w-4 text-purple-500" />
                <span>LeetCode Practice</span>
              </CardTitle>
              <Badge variant="purple" className="text-[11px] font-mono">
                {problems.length} Solved Today
              </Badge>
            </div>
            {defaultFocus && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Suggested target: <span className="font-mono text-foreground font-medium">{defaultFocus}</span>
              </p>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs self-start sm:self-auto flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Solved Problem</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        {/* Quick inline Add Form */}
        {isAdding && (
          <form
            onSubmit={handleAdd}
            className="rounded-lg border border-border bg-secondary/30 p-3.5 space-y-3 animate-in fade-in-0 duration-150"
          >
            <div className="font-semibold text-xs text-foreground">Log LeetCode Problem Solved</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="sm:col-span-1">
                <label className="text-[10px] text-muted-foreground block mb-0.5">Number</label>
                <Input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="e.g. 15"
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="text-[10px] text-muted-foreground block mb-0.5">Problem Title *</label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 3Sum"
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Pattern Learned</label>
                <select
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none"
                >
                  {LEETCODE_PATTERNS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Problem URL (optional)</label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Pattern Notes / Complexity (optional)</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. O(N log N) sorting + two pointers"
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Save Problem
              </Button>
            </div>
          </form>
        )}

        {/* List of problems solved today */}
        {problems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground">
            No LeetCode problems recorded for Day {dayNumber} yet. Aim for 1–2 problems to strengthen your algorithm intuition!
          </div>
        ) : (
          <div className="space-y-2">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/20 p-2.5 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Badge variant={difficultyVariant(problem.difficulty)} className="text-[10px] font-mono px-1.5 py-0.2">
                    {problem.difficulty}
                  </Badge>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5 font-medium text-xs text-foreground truncate">
                      {problem.number && <span className="font-mono text-muted-foreground">#{problem.number}</span>}
                      <span className="truncate">{problem.title}</span>
                      {problem.url && (
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-emerald-500 transition-colors"
                          title="Open on LeetCode"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-purple-600 dark:text-purple-400">
                        {problem.pattern}
                      </span>
                      {problem.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate italic">"{problem.notes}"</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteProblem(problem.id)}
                  className="rounded p-1 text-muted-foreground hover:text-red-500 hover:bg-secondary transition-colors cursor-pointer"
                  title="Remove problem"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
