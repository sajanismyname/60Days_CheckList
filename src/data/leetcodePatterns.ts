import { Difficulty } from '../types';

export interface PredefinedLeetCodeProblem {
  number: string;
  title: string;
  difficulty: Difficulty;
  pattern: string;
  url: string;
  week: number;
}

export const LEETCODE_PATTERNS = [
  'Arrays + Hash Maps',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked Lists',
  'Trees',
  'Graphs',
  'Heap / Priority Queue',
  'Intervals',
  'Greedy',
  'Backtracking',
  'Dynamic Programming',
  'Trie',
  'Bit Manipulation',
];

export const CURATED_LEETCODE_PROBLEMS: PredefinedLeetCodeProblem[] = [
  // Week 1: Arrays + Hash Maps
  { number: '1', title: 'Two Sum', difficulty: 'Easy', pattern: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/two-sum/', week: 1 },
  { number: '217', title: 'Contains Duplicate', difficulty: 'Easy', pattern: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/contains-duplicate/', week: 1 },
  { number: '242', title: 'Valid Anagram', difficulty: 'Easy', pattern: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/valid-anagram/', week: 1 },
  { number: '49', title: 'Group Anagrams', difficulty: 'Medium', pattern: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/group-anagrams/', week: 1 },
  { number: '347', title: 'Top K Frequent Elements', difficulty: 'Medium', pattern: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/top-k-frequent-elements/', week: 1 },
  { number: '238', title: 'Product of Array Except Self', difficulty: 'Medium', pattern: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/product-of-array-except-self/', week: 1 },
  { number: '128', title: 'Longest Consecutive Sequence', difficulty: 'Medium', pattern: 'Arrays + Hash Maps', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', week: 1 },

  // Week 2: Two Pointers + Sliding Window
  { number: '125', title: 'Valid Palindrome', difficulty: 'Easy', pattern: 'Two Pointers', url: 'https://leetcode.com/problems/valid-palindrome/', week: 2 },
  { number: '167', title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', pattern: 'Two Pointers', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', week: 2 },
  { number: '15', title: '3Sum', difficulty: 'Medium', pattern: 'Two Pointers', url: 'https://leetcode.com/problems/3sum/', week: 2 },
  { number: '11', title: 'Container With Most Water', difficulty: 'Medium', pattern: 'Two Pointers', url: 'https://leetcode.com/problems/container-with-most-water/', week: 2 },
  { number: '42', title: 'Trapping Rain Water', difficulty: 'Hard', pattern: 'Two Pointers', url: 'https://leetcode.com/problems/trapping-rain-water/', week: 2 },
  { number: '121', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', pattern: 'Sliding Window', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', week: 2 },
  { number: '3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', pattern: 'Sliding Window', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', week: 2 },
  { number: '424', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', pattern: 'Sliding Window', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', week: 2 },

  // Week 3: Stack + Queue + Binary Search
  { number: '20', title: 'Valid Parentheses', difficulty: 'Easy', pattern: 'Stack', url: 'https://leetcode.com/problems/valid-parentheses/', week: 3 },
  { number: '155', title: 'Min Stack', difficulty: 'Medium', pattern: 'Stack', url: 'https://leetcode.com/problems/min-stack/', week: 3 },
  { number: '150', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', pattern: 'Stack', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', week: 3 },
  { number: '739', title: 'Daily Temperatures', difficulty: 'Medium', pattern: 'Stack', url: 'https://leetcode.com/problems/daily-temperatures/', week: 3 },
  { number: '704', title: 'Binary Search', difficulty: 'Easy', pattern: 'Binary Search', url: 'https://leetcode.com/problems/binary-search/', week: 3 },
  { number: '74', title: 'Search a 2D Matrix', difficulty: 'Medium', pattern: 'Binary Search', url: 'https://leetcode.com/problems/search-a-2d-matrix/', week: 3 },
  { number: '875', title: 'Koko Eating Bananas', difficulty: 'Medium', pattern: 'Binary Search', url: 'https://leetcode.com/problems/koko-eating-bananas/', week: 3 },
  { number: '153', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', pattern: 'Binary Search', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', week: 3 },

  // Week 4: Linked Lists
  { number: '206', title: 'Reverse Linked List', difficulty: 'Easy', pattern: 'Linked Lists', url: 'https://leetcode.com/problems/reverse-linked-list/', week: 4 },
  { number: '21', title: 'Merge Two Sorted Lists', difficulty: 'Easy', pattern: 'Linked Lists', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', week: 4 },
  { number: '143', title: 'Reorder List', difficulty: 'Medium', pattern: 'Linked Lists', url: 'https://leetcode.com/problems/reorder-list/', week: 4 },
  { number: '19', title: 'Remove Nth Node From End of List', difficulty: 'Medium', pattern: 'Linked Lists', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', week: 4 },
  { number: '138', title: 'Copy List with Random Pointer', difficulty: 'Medium', pattern: 'Linked Lists', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/', week: 4 },
  { number: '2', title: 'Add Two Numbers', difficulty: 'Medium', pattern: 'Linked Lists', url: 'https://leetcode.com/problems/add-two-numbers/', week: 4 },
  { number: '141', title: 'Linked List Cycle', difficulty: 'Easy', pattern: 'Linked Lists', url: 'https://leetcode.com/problems/linked-list-cycle/', week: 4 },
  { number: '146', title: 'LRU Cache', difficulty: 'Medium', pattern: 'Linked Lists', url: 'https://leetcode.com/problems/lru-cache/', week: 4 },

  // Week 5: Trees
  { number: '226', title: 'Invert Binary Tree', difficulty: 'Easy', pattern: 'Trees', url: 'https://leetcode.com/problems/invert-binary-tree/', week: 5 },
  { number: '104', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', pattern: 'Trees', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', week: 5 },
  { number: '543', title: 'Diameter of Binary Tree', difficulty: 'Easy', pattern: 'Trees', url: 'https://leetcode.com/problems/diameter-of-binary-tree/', week: 5 },
  { number: '110', title: 'Balanced Binary Tree', difficulty: 'Easy', pattern: 'Trees', url: 'https://leetcode.com/problems/balanced-binary-tree/', week: 5 },
  { number: '100', title: 'Same Tree', difficulty: 'Easy', pattern: 'Trees', url: 'https://leetcode.com/problems/same-tree/', week: 5 },
  { number: '235', title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', pattern: 'Trees', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', week: 5 },
  { number: '102', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', pattern: 'Trees', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', week: 5 },
  { number: '98', title: 'Validate Binary Search Tree', difficulty: 'Medium', pattern: 'Trees', url: 'https://leetcode.com/problems/validate-binary-search-tree/', week: 5 },

  // Week 6: Graphs
  { number: '200', title: 'Number of Islands', difficulty: 'Medium', pattern: 'Graphs', url: 'https://leetcode.com/problems/number-of-islands/', week: 6 },
  { number: '133', title: 'Clone Graph', difficulty: 'Medium', pattern: 'Graphs', url: 'https://leetcode.com/problems/clone-graph/', week: 6 },
  { number: '695', title: 'Max Area of Island', difficulty: 'Medium', pattern: 'Graphs', url: 'https://leetcode.com/problems/max-area-of-island/', week: 6 },
  { number: '417', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', pattern: 'Graphs', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', week: 6 },
  { number: '994', title: 'Rotting Oranges', difficulty: 'Medium', pattern: 'Graphs', url: 'https://leetcode.com/problems/rotting-oranges/', week: 6 },
  { number: '207', title: 'Course Schedule', difficulty: 'Medium', pattern: 'Graphs', url: 'https://leetcode.com/problems/course-schedule/', week: 6 },
  { number: '210', title: 'Course Schedule II', difficulty: 'Medium', pattern: 'Graphs', url: 'https://leetcode.com/problems/course-schedule-ii/', week: 6 },

  // Week 7: Heap + Intervals + Greedy
  { number: '703', title: 'Kth Largest Element in a Stream', difficulty: 'Easy', pattern: 'Heap / Priority Queue', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', week: 7 },
  { number: '1046', title: 'Last Stone Weight', difficulty: 'Easy', pattern: 'Heap / Priority Queue', url: 'https://leetcode.com/problems/last-stone-weight/', week: 7 },
  { number: '215', title: 'Kth Largest Element in an Array', difficulty: 'Medium', pattern: 'Heap / Priority Queue', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', week: 7 },
  { number: '621', title: 'Task Scheduler', difficulty: 'Medium', pattern: 'Heap / Priority Queue', url: 'https://leetcode.com/problems/task-scheduler/', week: 7 },
  { number: '57', title: 'Insert Interval', difficulty: 'Medium', pattern: 'Intervals', url: 'https://leetcode.com/problems/insert-interval/', week: 7 },
  { number: '56', title: 'Merge Intervals', difficulty: 'Medium', pattern: 'Intervals', url: 'https://leetcode.com/problems/merge-intervals/', week: 7 },
  { number: '435', title: 'Non-overlapping Intervals', difficulty: 'Medium', pattern: 'Intervals', url: 'https://leetcode.com/problems/non-overlapping-intervals/', week: 7 },
  { number: '55', title: 'Jump Game', difficulty: 'Medium', pattern: 'Greedy', url: 'https://leetcode.com/problems/jump-game/', week: 7 },

  // Week 8: Mixed Review
  { number: '124', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', pattern: 'Trees', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', week: 8 },
  { number: '297', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', pattern: 'Trees', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', week: 8 },
  { number: '139', title: 'Word Break', difficulty: 'Medium', pattern: 'Dynamic Programming', url: 'https://leetcode.com/problems/word-break/', week: 8 },
  { number: '322', title: 'Coin Change', difficulty: 'Medium', pattern: 'Dynamic Programming', url: 'https://leetcode.com/problems/coin-change/', week: 8 },
  { number: '5', title: 'Longest Palindromic Substring', difficulty: 'Medium', pattern: 'Dynamic Programming', url: 'https://leetcode.com/problems/longest-palindromic-substring/', week: 8 },
];
