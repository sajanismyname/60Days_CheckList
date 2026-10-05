import React, { useState, useEffect } from 'react';
import { NavTab } from './types';
import { useChallenge } from './hooks/useChallenge';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { SearchModal } from './components/layout/SearchModal';
import { StatsOverview } from './components/dashboard/StatsOverview';
import { TodayCard } from './components/dashboard/TodayCard';
import { Heatmap } from './components/dashboard/Heatmap';
import { WeeklyMiniProgress } from './components/dashboard/WeeklyMiniProgress';
import { RecentActivity } from './components/dashboard/RecentActivity';
import { DayView } from './components/day/DayView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { LeetCodeView } from './components/leetcode/LeetCodeView';
import { WeeklyView } from './components/weekly/WeeklyView';
import { NotesArchiveView } from './components/notes/NotesArchiveView';
import { SettingsView } from './components/settings/SettingsView';
import { XPostModal } from './components/day/XPostModal';
import { getCurriculumDay } from './data/curriculum';
import { getSampleChallengeData } from './data/sampleData';
import { getDefaultDayProgress } from './lib/storage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [xPostModalDay, setXPostModalDay] = useState<number | null>(null);

  const { theme, setTheme } = useTheme();

  const {
    data,
    selectedDay,
    setSelectedDay,
    currentCalculatedDay,
    stats,
    updateDayProgress,
    toggleTask,
    addCustomTask,
    removeCustomTask,
    addLeetCodeProblem,
    deleteLeetCodeProblem,
    updateChallengeSettings,
    exportData,
    importData,
    resetChallenge,
    markDayComplete,
  } = useChallenge();

  // Global keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setCurrentTab('today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTodayFromHeader = () => {
    setSelectedDay(currentCalculatedDay);
    setCurrentTab('today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadSampleDemo = () => {
    const sample = getSampleChallengeData();
    importData(sample);
    setSelectedDay(17);
    setCurrentTab('dashboard');
  };

  const todayCurriculum = getCurriculumDay(currentCalculatedDay);
  const todayProgress = data.days[currentCalculatedDay] || getDefaultDayProgress(currentCalculatedDay);

  const selectedDayProgress = data.days[selectedDay] || getDefaultDayProgress(selectedDay);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Top Header */}
      <Header
        currentDay={currentCalculatedDay}
        currentStreak={stats.currentStreak}
        completedDaysCount={stats.completedDaysCount}
        theme={theme}
        onThemeChange={setTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectToday={handleSelectTodayFromHeader}
      />

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          stats={stats}
          currentDay={currentCalculatedDay}
          todayCompleted={Boolean(todayProgress.completed)}
        />

        {/* Primary Content View Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-10 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
          {/* DASHBOARD TAB */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Stats Banner & Metrics Cards */}
              <StatsOverview stats={stats} currentDay={currentCalculatedDay} />

              {/* Today's Active Focus Section */}
              <TodayCard
                dayCurriculum={todayCurriculum}
                dayProgress={todayProgress}
                onToggleTask={toggleTask}
                onAddCustomTask={addCustomTask}
                onRemoveCustomTask={removeCustomTask}
                onNavigateToDayDetail={handleSelectDay}
                onOpenXTemplate={(day) => setXPostModalDay(day)}
              />

              {/* 60-Day Contribution Heatmap */}
              <Heatmap
                daysData={data.days}
                currentDay={currentCalculatedDay}
                onSelectDay={handleSelectDay}
              />

              {/* Bottom 2-Column: Weekly Progress Mini + Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklyMiniProgress
                  daysData={data.days}
                  currentDay={currentCalculatedDay}
                  onSelectDay={handleSelectDay}
                  onNavigateToWeekly={() => setCurrentTab('weekly')}
                />

                <RecentActivity
                  daysData={data.days}
                  currentDay={currentCalculatedDay}
                  onSelectDay={handleSelectDay}
                />
              </div>
            </div>
          )}

          {/* TODAY / DAY DETAIL TAB */}
          {currentTab === 'today' && (
            <div className="animate-in fade-in-50 duration-200">
              <DayView
                dayNumber={selectedDay}
                currentCalculatedDay={currentCalculatedDay}
                dayProgress={selectedDayProgress}
                onSelectDay={(day) => setSelectedDay(day)}
                onUpdateDay={updateDayProgress}
                onToggleTask={toggleTask}
                onAddCustomTask={addCustomTask}
                onRemoveCustomTask={removeCustomTask}
                onAddLeetCodeProblem={addLeetCodeProblem}
                onDeleteLeetCodeProblem={deleteLeetCodeProblem}
                onMarkDayComplete={markDayComplete}
              />
            </div>
          )}

          {/* 60-DAY ROADMAP TAB */}
          {currentTab === 'roadmap' && (
            <div className="animate-in fade-in-50 duration-200">
              <RoadmapView
                daysData={data.days}
                currentDay={currentCalculatedDay}
                onSelectDay={handleSelectDay}
              />
            </div>
          )}

          {/* LEETCODE TRACK TAB */}
          {currentTab === 'leetcode' && (
            <div className="animate-in fade-in-50 duration-200">
              <LeetCodeView
                allProblems={data.allLeetCode}
                stats={stats}
                currentDay={currentCalculatedDay}
                onAddProblem={addLeetCodeProblem}
                onDeleteProblem={deleteLeetCodeProblem}
              />
            </div>
          )}

          {/* WEEKLY PROGRESS TAB */}
          {currentTab === 'weekly' && (
            <div className="animate-in fade-in-50 duration-200">
              <WeeklyView
                daysData={data.days}
                currentDay={currentCalculatedDay}
                onSelectDay={handleSelectDay}
              />
            </div>
          )}

          {/* NOTES ARCHIVE TAB */}
          {currentTab === 'notes' && (
            <div className="animate-in fade-in-50 duration-200">
              <NotesArchiveView
                daysData={data.days}
                onSelectDay={handleSelectDay}
              />
            </div>
          )}

          {/* SETTINGS TAB */}
          {currentTab === 'settings' && (
            <div className="animate-in fade-in-50 duration-200">
              <SettingsView
                settings={data.settings}
                stats={stats}
                theme={theme}
                onThemeChange={setTheme}
                onUpdateSettings={updateChallengeSettings}
                onExport={exportData}
                onImport={(newData) => {
                  const success = importData(newData);
                  if (success) {
                    setSelectedDay(currentCalculatedDay);
                  }
                  return success;
                }}
                onReset={resetChallenge}
                onLoadSampleDemo={handleLoadSampleDemo}
              />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation & Menu Sheet */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        stats={stats}
        currentDay={currentCalculatedDay}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        daysData={data.days}
        onSelectDay={handleSelectDay}
      />

      {/* Quick X Post Modal from Today Card */}
      {xPostModalDay !== null && (
        <XPostModal
          isOpen={true}
          onClose={() => setXPostModalDay(null)}
          dayCurriculum={getCurriculumDay(xPostModalDay)}
          dayProgress={data.days[xPostModalDay] || getDefaultDayProgress(xPostModalDay)}
          onUpdateDay={(updates) => updateDayProgress(xPostModalDay, updates)}
        />
      )}
    </div>
  );
};

export default App;
