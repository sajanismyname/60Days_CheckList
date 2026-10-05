# Checklist — #60DaysOfLearning Challenge Tracker

A personal, developer-focused 60-day software engineering challenge web application designed with a Linear/GitHub/Notion aesthetic. Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui patterns.

---

## ⚡ Features

- **Personal & Serverless**: Zero backend, zero database, zero external APIs required. Fully persisted in browser `localStorage`.
- **Dashboard Overview**:
  - Live progression counter (`Day X / 60`, overall completion percentage)
  - Current & longest streak tracking (at least 1 task completed per day counts toward streak)
  - Topic mastery & LeetCode difficulty counters
  - Interactive **GitHub-style 60-Day Contribution Heatmap** with 4 visual status states & hover inspection
- **Daily Focus & Tasks**:
  - Individually checkable tasks with progress indicators
  - Custom task addition and removal per day
  - Confetti celebration upon completing all daily tasks
  - Daily reflections & notes:
    - *What I learned*
    - *What I built*
    - *What broke (Debugging notes)*
    - *Biggest takeaway*
- **LeetCode Track**:
  - Categorized weekly algorithm tracks (Arrays & Hash Maps, Two Pointers, Trees, Graphs, etc.)
  - Manual problem logging (number, title, difficulty, pattern, URL, notes)
  - Curated NeetCode/Blind-75 aligned practice set with 1-click quick add
  - Difficulty distribution metrics (Easy, Medium, Hard)
- **60-Day Complete Roadmap**:
  - Complete 60-day curriculum grouped across 8 weeks + final capstone
  - Filters by completion status (All, Completed, Upcoming) and week
- **Weekly Progress Dashboard**:
  - 8-week breakdown showing completion percentages, core topics, LeetCode counts, and X posts
- **Engineering Notes Repository**:
  - Global searchable archive of all your learnings, bug fixes, code snippets, and takeaways across all 60 days
- **X (Twitter) Sharing**:
  - Automated pre-filled daily post template generator
  - One-click copy and Twitter intent launcher
  - Post URL and status tracking
- **Global Search**:
  - Fast modal triggered via `Cmd+K` or `Ctrl+K`
  - Searches day numbers, curriculum titles, topics, tasks, and notes
- **Dark Mode & Theming**:
  - Light mode, dark mode, and system preference with persistent theme state
- **Data Portability**:
  - Full JSON backup export (`checklist-60days-backup-*.json`)
  - JSON import with validation and confirmation prompt to prevent accidental overwrites
  - Safe reset option with confirmation modal
  - Configurable challenge start date calculating Day 1, Day 2, etc.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript (Strict Mode)
- **Bundler**: Vite
- **Styling**: Tailwind CSS with shadcn CSS variables
- **Icons**: Lucide React
- **Animations / Celebrations**: Canvas Confetti

---

## 🚀 Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Preview production build locally:
```bash
npm run preview
```

---

## ☁️ Deploying to Vercel

This project is ready to deploy directly to Vercel as a standard Vite React application:

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com/new), select **Add New Project** and import this repository.
3. Vercel will automatically detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. SPA rewrites are already configured in `vercel.json`.

---

## 📚 60-Day Curriculum Structure

- **Week 1**: Debugging + Foundations (Days 1–7) • *LeetCode: Arrays + Hash Maps*
- **Week 2**: Backend Architecture + Webhooks (Days 8–14) • *LeetCode: Two Pointers + Sliding Window*
- **Week 3**: PostgreSQL Deep Dive (Days 15–21) • *LeetCode: Stack + Binary Search*
- **Week 4**: Testing + Rate Limiting (Days 22–28) • *LeetCode: Linked Lists*
- **Week 5**: Networking + Caching (Days 29–35) • *LeetCode: Trees*
- **Week 6**: Realtime + Background Jobs (Days 36–42) • *LeetCode: Graphs*
- **Week 7**: Docker + CI/CD (Days 43–49) • *LeetCode: Heap + Intervals + Greedy*
- **Week 8**: System Design + MCP (Days 50–56) • *LeetCode: Mixed Review*
- **Final 4 Days**: Design, Implement, Test, Deploy & Final Retrospective (Days 57–60)
