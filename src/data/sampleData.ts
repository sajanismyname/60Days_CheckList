import { ChallengeData, DayProgress, LeetCodeProblem } from '../types';
import { CURRICULUM_DAYS } from './curriculum';
import { getDefaultDayProgress } from '../lib/storage';
import { getTodayDateString } from '../lib/utils';

export function getSampleChallengeData(): ChallengeData {
  // Let's set start date 16 days ago so today is Day 17!
  const now = new Date();
  now.setDate(now.getDate() - 16);
  const sYear = now.getFullYear();
  const sMonth = String(now.getMonth() + 1).padStart(2, '0');
  const sDay = String(now.getDate()).padStart(2, '0');
  const sampleStartDate = `${sYear}-${sMonth}-${sDay}`;

  const days: Record<number, DayProgress> = {};
  const allLeetCode: LeetCodeProblem[] = [];

  // Initialize all 60 days
  for (let i = 1; i <= 60; i++) {
    days[i] = getDefaultDayProgress(i);
  }

  // Pre-fill Days 1 to 16 as completed with realistic engineering notes and LeetCode
  const sampleNotes = [
    {
      day: 1,
      learned: 'Configured launch.json in VS Code. Understood node --inspect-brk and source maps.',
      built: 'Set up reproducible bug isolation sandbox project with Vitest.',
      takeaway: 'Never guess where a bug lives—isolate the boundary first.',
      lc: { number: '1', title: 'Two Sum', diff: 'Easy' as const, pat: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/two-sum/' },
    },
    {
      day: 2,
      learned: 'Inspected memory heap snapshots. Found circular object reference holding 40MB.',
      built: 'Wrote script to analyze memory spikes in long-running Node worker.',
      takeaway: 'Step-through debugging reveals state invalidation that console.log blinds you to.',
      lc: { number: '242', title: 'Valid Anagram', diff: 'Easy' as const, pat: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/valid-anagram/' },
    },
    {
      day: 3,
      learned: 'SQL statement execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.',
      built: 'Complex analytical query computing 95th percentile user latency.',
      takeaway: 'HAVING filters aggregated groups; WHERE filters raw rows before grouping.',
      lc: { number: '49', title: 'Group Anagrams', diff: 'Medium' as const, pat: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/group-anagrams/' },
    },
    {
      day: 4,
      learned: 'Row multiplication during 1-to-many joins. Left join NULL handling and COALESCE.',
      built: 'Multi-table join query generating monthly invoicing summaries.',
      takeaway: 'Be vigilant with outer joins inflating aggregate counts.',
      lc: { number: '347', title: 'Top K Frequent Elements', diff: 'Medium' as const, pat: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
    },
    {
      day: 5,
      learned: 'Discriminated unions with type guards and `assertNever` exhaustive pattern.',
      built: 'Type-safe payment processing state machine with strict transitions.',
      takeaway: 'Make invalid domain states unrepresentable using TypeScript unions.',
      lc: { number: '238', title: 'Product of Array Except Self', diff: 'Medium' as const, pat: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
    },
    {
      day: 6,
      learned: 'Generic constraints `T extends Record<string, unknown>`, template literal types, and `infer`.',
      built: 'Type-safe event bus with payload validation inference.',
      takeaway: 'Generics should simplify consumer code, not introduce labyrinthine syntax.',
      lc: { number: '128', title: 'Longest Consecutive Sequence', diff: 'Medium' as const, pat: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
    },
    {
      day: 7,
      learned: 'Node.js event loop tick phases (timers, pending, poll, check). Out-of-order API responses.',
      built: 'Debounced search input with AbortController request cancellation.',
      takeaway: 'Async network responses never guarantee order of arrival without request tokens.',
      lc: { number: '125', title: 'Valid Palindrome', diff: 'Easy' as const, pat: 'Two Pointers', url: 'https://leetcode.com/problems/valid-palindrome/' },
    },
    {
      day: 8,
      learned: 'HTTP/1.1 vs HTTP/2 head-of-line blocking, TCP keep-alive sockets, 308 permanent redirect.',
      built: 'Node.js proxy measuring socket reuse across consecutive requests.',
      takeaway: 'Connection establishment is expensive; always enable connection pooling.',
      lc: { number: '167', title: 'Two Sum II', diff: 'Medium' as const, pat: 'Two Pointers', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
    },
    {
      day: 9,
      learned: 'Cursor-based pagination vs offset pagination. Offset skip scans get exponentially slower.',
      built: 'REST API endpoint with keyset pagination using timestamp + id tuple.',
      takeaway: 'Avoid OFFSET at scale; use indexed cursor comparisons.',
      lc: { number: '15', title: '3Sum', diff: 'Medium' as const, pat: 'Two Pointers', url: 'https://leetcode.com/problems/3sum/' },
    },
    {
      day: 10,
      learned: 'Controller-Service-Repository pattern. Decoupling HTTP transport from core business logic.',
      built: 'Clean architecture backend scaffold with dependency injection.',
      takeaway: 'Keep controllers paper-thin; put business rules in isolated services.',
      lc: { number: '11', title: 'Container With Most Water', diff: 'Medium' as const, pat: 'Two Pointers', url: 'https://leetcode.com/problems/container-with-most-water/' },
    },
    {
      day: 11,
      learned: 'Zod schema parsing at API perimeter. Distinguishing operational vs fatal errors.',
      built: 'Global async error-handling middleware with structured RFC 7807 problem details.',
      takeaway: 'Validate early at the gateway; never let untrusted shapes reach deep services.',
      lc: { number: '121', title: 'Best Time to Buy and Sell Stock', diff: 'Easy' as const, pat: 'Sliding Window', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    },
    {
      day: 12,
      learned: 'JWT access token rotation with refresh tokens in httpOnly cookies. CSRF Double-Submit.',
      built: 'Auth system with RBAC middleware checking scoped permissions.',
      takeaway: 'Never store sensitive tokens in browser localStorage in high-security apps.',
      lc: { number: '3', title: 'Longest Substring Without Repeating Characters', diff: 'Medium' as const, pat: 'Sliding Window', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    },
    {
      day: 13,
      learned: 'Inbound webhook HMAC SHA-256 signature verification against raw buffers.',
      built: 'Webhook ingestion endpoint responding with 200 OK before kicking off background job.',
      takeaway: 'Acknowledge webhooks in <200ms, do all heavy lifting asynchronously.',
      lc: { number: '424', title: 'Longest Repeating Character Replacement', diff: 'Medium' as const, pat: 'Sliding Window', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
    },
    {
      day: 14,
      learned: 'Idempotency keys using Redis/PostgreSQL unique constraints to prevent double charges.',
      built: 'Idempotent webhook handler with distributed lock and replay protection.',
      takeaway: 'Assume webhooks will be delivered at least twice; design for idempotency.',
      lc: { number: '20', title: 'Valid Parentheses', diff: 'Easy' as const, pat: 'Stack', url: 'https://leetcode.com/problems/valid-parentheses/' },
    },
    {
      day: 15,
      learned: '1NF, 2NF, 3NF normalization. Transitive dependencies and deletion anomalies.',
      built: 'Normalized relational schema for an e-commerce order management system.',
      takeaway: 'Normalize for transactional writes; denormalize only with hard benchmark proof.',
      lc: { number: '155', title: 'Min Stack', diff: 'Medium' as const, pat: 'Stack', url: 'https://leetcode.com/problems/min-stack/' },
    },
    {
      day: 16,
      learned: 'PostgreSQL ON DELETE CASCADE vs RESTRICT, CHECK constraints, and exclusion constraints.',
      built: 'Database migration with check constraints enforcing positive balance amounts.',
      takeaway: 'Database constraints are your last, unbreakable line of data integrity defense.',
      lc: { number: '739', title: 'Daily Temperatures', diff: 'Medium' as const, pat: 'Stack', url: 'https://leetcode.com/problems/daily-temperatures/' },
    },
  ];

  for (const item of sampleNotes) {
    const curr = CURRICULUM_DAYS.find((d) => d.day === item.day);
    const defaultTasks = curr ? curr.defaultTasks : [];

    const problemId = `lc_sample_${item.day}`;
    const lcProblem: LeetCodeProblem = {
      id: problemId,
      number: item.lc.number,
      title: item.lc.title,
      difficulty: item.lc.diff,
      pattern: item.lc.pat,
      url: item.lc.url,
      notes: 'Curriculum practice problem',
      dateSolved: sampleStartDate,
      daySolved: item.day,
    };

    allLeetCode.push(lcProblem);

    days[item.day] = {
      day: item.day,
      completedTasks: [...defaultTasks],
      customTasks: ['Code review', 'Push commit to GitHub'],
      notes: 'Reviewed documentation and verified benchmarks.',
      whatILearned: item.learned,
      whatIBuilt: item.built,
      whatBroke: 'Faced async timeout error when running queries in parallel.',
      biggestTakeaway: item.takeaway,
      leetcodeCount: 1,
      leetcodeProblems: [lcProblem],
      xPosted: true,
      xPostUrl: `https://x.com/developer/status/178000000000000${item.day}`,
      completed: true,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Day 17: Today (partial progress matching prompt!)
  const day17Curr = CURRICULUM_DAYS.find((d) => d.day === 17);
  if (day17Curr) {
    // 4 out of 6 tasks completed as in the prompt example!
    const day17Tasks = day17Curr.defaultTasks;
    days[17] = {
      day: 17,
      completedTasks: day17Tasks.slice(0, 4),
      customTasks: ['Inspect indexes in ChatFlow'],
      notes: 'Testing B-tree index depth on users table with 500k rows.',
      whatILearned: 'PostgreSQL skips B-tree indexes if sequential scan is cheaper on low cardinality columns.',
      whatIBuilt: 'Benchmark script generating 500,000 synthetic records to measure query times.',
      whatBroke: 'Index was not being used until ANALYZE was executed to refresh table statistics.',
      biggestTakeaway: 'An index is useless if the query planner has stale statistics—always run ANALYZE.',
      leetcodeCount: 1,
      leetcodeProblems: [
        {
          id: 'lc_sample_17',
          number: '704',
          title: 'Binary Search',
          difficulty: 'Easy',
          pattern: 'Binary Search',
          url: 'https://leetcode.com/problems/binary-search/',
          notes: 'Classic binary search implementation in O(log N)',
          dateSolved: getTodayDateString(),
          daySolved: 17,
        },
      ],
      xPosted: false,
      xPostUrl: '',
      completed: false,
      lastUpdated: new Date().toISOString(),
    };

    allLeetCode.push(days[17].leetcodeProblems[0]);
  }

  return {
    version: 1,
    settings: {
      startDate: sampleStartDate,
      theme: 'system',
      autoNavigateToToday: true,
    },
    days,
    allLeetCode,
  };
}
