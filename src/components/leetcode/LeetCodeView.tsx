import React, { useState, useMemo } from 'react';
import { LeetCodeProblem, Difficulty, ChallengeStats } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  ExternalLink, 
  Trash2, 
  Search, 
  Flame, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { LEETCODE_PATTERNS, CURATED_LEETCODE_PROBLEMS } from '../../data/leetcodePatterns';
import { getTodayDateString, formatDate } from '../../lib/utils';
import { Dialog } from '../ui/dialog';

interface LeetCodeViewProps {
  allProblems: LeetCodeProblem[];
  stats: ChallengeStats;
  currentDay: number;
  onAddProblem: (problem: Omit<LeetCodeProblem, 'id'>) => void;
  onDeleteProblem: (id: string) => void;
}

export const LeetCodeView: React.FC<LeetCodeViewProps> = ({
  allProblems,
  stats,
  currentDay,
  onAddProblem,
  onDeleteProblem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | Difficulty>('All');
  const [selectedPattern, setSelectedPattern] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [number, setNumber] = useState('');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [pattern, setPattern] = useState<string>(LEETCODE_PATTERNS[0]);
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [daySolved, setDaySolved] = useState<number>(currentDay);

  // Unique patterns learned from user solved problems
  const patternsLearned = useMemo(() => {
    const set = new Set<string>();
    allProblems.forEach((p) => {
      if (p.pattern) set.add(p.pattern);
    });
    return Array.from(set);
  }, [allProblems]);

  const filteredProblems = useMemo(() => {
    return allProblems.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.number.includes(searchQuery) ||
        p.pattern.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
      const matchesPat = selectedPattern === 'All' || p.pattern === selectedPattern;

      return matchesSearch && matchesDiff && matchesPat;
    });
  }, [allProblems, searchQuery, selectedDifficulty, selectedPattern]);

  const handleFormSubmit = (e: React.FormEvent) => {
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
      daySolved: daySolved || currentDay,
    });

    // Reset
    setNumber('');
    setTitle('');
    setUrl('');
    setNotes('');
    setIsModalOpen(false);
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

  const handleAddCurated = (curated: typeof CURATED_LEETCODE_PROBLEMS[0]) => {
    const alreadyExists = allProblems.some((p) => p.number === curated.number || p.title.toLowerCase() === curated.title.toLowerCase());
    if (alreadyExists) return;

    onAddProblem({
      number: curated.number,
      title: curated.title,
      difficulty: curated.difficulty,
      pattern: curated.pattern,
      url: curated.url,
      notes: `Week ${curated.week} curriculum practice`,
      dateSolved: getTodayDateString(),
      daySolved: currentDay,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            LeetCode Engineering Track
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track algorithmic patterns, difficulty distributions, and daily problem solving.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto text-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add Problem</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Solved */}
        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-medium text-muted-foreground">Total Solved</span>
            <div className="mt-1 text-2xl font-bold font-mono text-foreground">
              {stats.totalLeetCodeSolved}
            </div>
          </CardContent>
        </Card>

        {/* Easy */}
        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Easy</span>
            <div className="mt-1 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {stats.easyCount}
            </div>
          </CardContent>
        </Card>

        {/* Medium */}
        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">Medium</span>
            <div className="mt-1 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {stats.mediumCount}
            </div>
          </CardContent>
        </Card>

        {/* Hard */}
        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-medium text-red-600 dark:text-red-400">Hard</span>
            <div className="mt-1 text-2xl font-bold font-mono text-red-600 dark:text-red-400">
              {stats.hardCount}
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-medium text-muted-foreground">Streak</span>
            <div className="mt-1 text-2xl font-bold font-mono text-amber-500 flex items-center gap-1">
              <Flame className="h-4 w-4 fill-amber-500" />
              <span>{stats.currentStreak}d</span>
            </div>
          </CardContent>
        </Card>

        {/* Patterns Learned */}
        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-medium text-muted-foreground">Patterns</span>
            <div className="mt-1 text-2xl font-bold font-mono text-purple-500">
              {patternsLearned.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Curated Recommendations for Current Week */}
      <Card className="border-border/70 shadow-xs bg-secondary/15">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <CardTitle className="text-sm font-semibold">
              Curated Practice Catalog (NeetCode 75 / Blind 75 Aligned)
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Quick-add curated problems aligned with the 60-day challenge curriculum.
          </p>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CURATED_LEETCODE_PROBLEMS.slice(0, 10).map((curated) => {
              const isSolved = allProblems.some((p) => p.number === curated.number || p.title.toLowerCase() === curated.title.toLowerCase());

              return (
                <div
                  key={curated.number}
                  className="min-w-[210px] shrink-0 rounded-lg border border-border/70 bg-card p-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-muted-foreground">#{curated.number}</span>
                      <Badge variant={difficultyVariant(curated.difficulty)} className="text-[9px] px-1 py-0 font-mono">
                        {curated.difficulty}
                      </Badge>
                    </div>
                    <div className="font-semibold text-xs text-foreground truncate" title={curated.title}>
                      {curated.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {curated.pattern}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between">
                    <a
                      href={curated.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Problem</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>

                    {isSolved ? (
                      <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="h-3 w-3" /> Solved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddCurated(curated)}
                        className="text-[10px] bg-secondary hover:bg-secondary/80 text-foreground px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        + Mark Solved
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filter and Problem List Section */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold">
              All Solved Problems ({filteredProblems.length})
            </CardTitle>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter problems..."
                  className="h-8 pl-8 text-xs w-44 bg-background"
                />
              </div>

              {/* Difficulty filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as 'All' | Difficulty)}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              {/* Pattern filter */}
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none max-w-[150px]"
              >
                <option value="All">All Patterns</option>
                {LEETCODE_PATTERNS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0">
          {filteredProblems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
              {allProblems.length === 0 ? (
                <>
                  No LeetCode problems recorded yet. Click "Add Problem" above or pick one from the curated list!
                </>
              ) : (
                <>No problems match your current search and filter settings.</>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/20 p-3 hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Badge variant={difficultyVariant(prob.difficulty)} className="font-mono text-[10px] shrink-0">
                      {prob.difficulty}
                    </Badge>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2 font-medium text-xs text-foreground">
                        {prob.number && (
                          <span className="font-mono text-muted-foreground">#{prob.number}</span>
                        )}
                        <span className="truncate font-semibold">{prob.title}</span>
                        {prob.url && (
                          <a
                            href={prob.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-emerald-500 transition-colors"
                            title="Open link"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="font-mono text-purple-600 dark:text-purple-400">
                          {prob.pattern}
                        </span>
                        {prob.daySolved && (
                          <span>Day {prob.daySolved}</span>
                        )}
                        <span>{formatDate(prob.dateSolved)}</span>
                        {prob.notes && (
                          <span className="italic truncate max-w-xs">
                            "{prob.notes}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteProblem(prob.id)}
                    className="p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-secondary transition-colors cursor-pointer shrink-0 ml-2"
                    title="Delete record"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Problem Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add LeetCode Problem"
        description="Record a problem you have solved as part of the 60-day challenge."
      >
        <form onSubmit={handleFormSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                Number
              </label>
              <Input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="e.g. 1"
                className="h-8 text-xs bg-background"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                Problem Title *
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Two Sum"
                className="h-8 text-xs bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                Difficulty
              </label>
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
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                Pattern
              </label>
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                Associate With Challenge Day
              </label>
              <select
                value={daySolved}
                onChange={(e) => setDaySolved(Number(e.target.value))}
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none"
              >
                {Array.from({ length: 60 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Day {d} {d === currentDay ? '(Today)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                Problem URL (optional)
              </label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                className="h-8 text-xs bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">
              Pattern Notes / Time & Space Complexity (optional)
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Hash map complement lookup in O(N) time"
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="text-xs">
              Save Problem
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
