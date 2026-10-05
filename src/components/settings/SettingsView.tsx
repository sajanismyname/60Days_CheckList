import React, { useState, useRef } from 'react';
import { 
  ChallengeSettings, 
  ChallengeData, 
  ChallengeStats 
} from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog } from '../ui/dialog';
import { Theme } from '../../hooks/useTheme';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Calendar, 
  Moon, 
  Sun, 
  Laptop, 
  AlertTriangle, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  FileJson 
} from 'lucide-react';
import { validateImportedData } from '../../lib/storage';

interface SettingsViewProps {
  settings: ChallengeSettings;
  stats: ChallengeStats;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onUpdateSettings: (settings: Partial<ChallengeSettings>) => void;
  onExport: () => void;
  onImport: (data: ChallengeData) => boolean;
  onReset: () => void;
  onLoadSampleDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  stats,
  theme,
  onThemeChange,
  onUpdateSettings,
  onExport,
  onImport,
  onReset,
  onLoadSampleDemo,
}) => {
  const [startDateInput, setStartDateInput] = useState(settings.startDate);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<ChallengeData | null>(null);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importError, setImportError] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDateInput(e.target.value);
    onUpdateSettings({ startDate: e.target.value });
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2000);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!validateImportedData(parsed)) {
          setImportError('Invalid backup file. Missing required challenge structure.');
          return;
        }

        setPendingImportData(parsed as ChallengeData);
        setIsImportDialogOpen(true);
      } catch (err) {
        setImportError('Failed to parse JSON file. Please ensure it is a valid Checklist backup.');
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  const confirmImport = () => {
    if (pendingImportData) {
      onImport(pendingImportData);
      setIsImportDialogOpen(false);
      setPendingImportData(null);
    }
  };

  const confirmReset = () => {
    onReset();
    setIsResetDialogOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Settings & Challenge Configuration
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage your challenge start date, dark mode preferences, and local data backups.
        </p>
      </div>

      {/* Challenge Start Date Configuration */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span>Challenge Start Date</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Automatically calculates your current challenge day. For example, if start date is set to your launch date, that date becomes Day 1, the next day is Day 2, and so on.
          </p>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 max-w-xs">
              <Input
                type="date"
                value={startDateInput}
                onChange={handleDateChange}
                className="text-xs font-mono bg-secondary/30"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Current calculated day: <strong className="text-foreground font-mono">Day {stats.currentDay} / 60</strong>
            </div>
            {saveSuccessMsg && (
              <span className="text-xs text-emerald-500 flex items-center gap-1 font-medium animate-in fade-in-0">
                <Check className="h-3.5 w-3.5" /> Start date saved!
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appearance / Theme */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Appearance & Theme</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Select your preferred visual style. Persisted automatically in browser storage.
          </p>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0">
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <button
              onClick={() => onThemeChange('light')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 font-semibold shadow-xs'
                  : 'border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sun className="h-5 w-5 mb-1.5" />
              <span>Light</span>
            </button>

            <button
              onClick={() => onThemeChange('dark')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold shadow-xs'
                  : 'border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Moon className="h-5 w-5 mb-1.5" />
              <span>Dark</span>
            </button>

            <button
              onClick={() => onThemeChange('system')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                theme === 'system'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Laptop className="h-5 w-5 mb-1.5" />
              <span>System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Export / Import Data */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <span>Data Portability & Backup</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Your 60-day challenge progress is stored locally in your browser. Export backups regularly so your progress is never trapped or lost.
          </p>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Export */}
            <Button
              onClick={onExport}
              className="text-xs flex items-center gap-2"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Progress (JSON)</span>
            </Button>

            {/* Import */}
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs flex items-center gap-2"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Import Progress (JSON)</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelected}
              className="hidden"
            />

            {/* Optional Sample Data Demo Loader */}
            <Button
              variant="secondary"
              onClick={onLoadSampleDemo}
              className="text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground"
              title="Loads realistic sample data for Week 1 & 2 to preview features"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Load Sample Demo Data</span>
            </Button>
          </div>

          {importError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
              {importError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Challenge Section */}
      <Card className="border-red-500/20 bg-red-500/5 shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <CardTitle className="text-base font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Danger Zone • Reset Challenge</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Clear all logged checklist tasks, daily notes, and LeetCode problem history. This action cannot be undone unless you have exported a JSON backup.
          </p>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsResetDialogOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Challenge Progress</span>
          </Button>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        title="Reset Entire Challenge?"
        description="Are you sure you want to reset your 60-day challenge progress?"
      >
        <div className="space-y-4 pt-1">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            <strong>Warning:</strong> This will erase all checked tasks, notes, LeetCode logs, and your current streak ({stats.currentStreak} days). We recommend exporting a JSON backup first.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmReset}
              className="text-xs"
            >
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Import Confirmation Dialog */}
      <Dialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        title="Confirm Overwrite from Backup"
        description="A backup file was loaded. Importing will replace your current challenge state."
      >
        <div className="space-y-4 pt-1">
          <div className="rounded-lg border border-border bg-secondary/30 p-3 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <FileJson className="h-4 w-4 text-emerald-500" />
              <span>{importFileName}</span>
            </div>
            {pendingImportData && (
              <div className="text-muted-foreground text-[11px]">
                Contains: {Object.values(pendingImportData.days || {}).filter((d) => d.completed).length} completed days, {pendingImportData.allLeetCode?.length || 0} LeetCode problems.
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={confirmImport}
              className="text-xs"
            >
              Confirm & Overwrite
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
