# Pattern Playbook

Read this when you need to teach a specific technique, or help the learner recognize which pattern a problem is hiding.

## Contents
1. How to decompose any big problem
2. Pattern cards (trigger, idea, template, pitfalls)
3. Complexity cheat sheet from constraints
4. The universal problem-solving loop

---

## 1. How to decompose any big problem

Use these moves in order until the problem feels small:

1. **Rewrite the problem in your own words** and in the simplest possible input (n = 0, 1, 2).
2. **Brute-force it by hand** on a tiny example and notice what your brain does. That is usually the algorithm.
3. **Ask the 5 decomposition questions:**
   - What is the smallest version of this problem?
   - Does solving a smaller version help solve the bigger one? (recursion / DP / divide and conquer)
   - Can I process the input in order, keeping a summary of what I've seen? (greedy / sliding window / prefix state)
   - Can I preprocess to make queries cheap? (sorting, hashing, prefix sums, indexing)
   - Can I change the question to an easier equivalent one? (binary search on answer, complement counting, reverse thinking)
4. **Write sub-problems as questions**, and solve each as its own tiny function.
5. **Integrate**, then optimize only the bottleneck.

---

## 2. Pattern cards

### Hash map / set
- **Trigger:** "seen before?", count frequencies, find complement, group by key, detect duplicates.
- **Idea:** trade memory for O(1) average lookup, replacing an inner loop.
- **Template:** loop once; before inserting current item, check whether what you need is already stored.
- **Pitfalls:** unhashable keys (lists in Python), order assumptions, hash collisions in adversarial contest inputs, forgetting to handle the same element twice.
- **Real world:** caches, deduplication in data pipelines, DNS lookups, database hash joins.

### Two pointers
- **Trigger:** sorted array, pair/triplet sums, palindromes, partitioning, merging sorted lists.
- **Idea:** two indices move toward each other or in the same direction, and each move discards candidates safely.
- **Key question:** "Why is it safe to discard this element when I move the pointer?" If you cannot answer, the technique does not apply.
- **Pitfalls:** unsorted input, infinite loops from not moving a pointer, skipping duplicates incorrectly.
- **Real world:** merging sorted log streams, de-duplicating sorted records, memory compaction.

### Sliding window
- **Trigger:** contiguous subarray/substring, "longest/shortest/at most k", running counts.
- **Idea:** maintain a window `[left, right]` and its summary; expand right, shrink left while the invariant is violated.
- **Template:** `for right in range(n): add(right); while invalid: remove(left); left += 1; update answer`.
- **Pitfalls:** negative numbers break "shrink when sum too big" logic, updating the answer at the wrong moment, window state not fully undone on removal.
- **Real world:** rate limiters, moving averages in monitoring, TCP flow windows, network packet analysis.

### Prefix sums / difference arrays
- **Trigger:** many range-sum queries, "subarray sum equals k", range updates.
- **Idea:** precompute cumulative sums so any range = `prefix[r+1] - prefix[l]`.
- **Pitfalls:** off-by-one in prefix indexing, forgetting the empty prefix (0) in the hash map version.
- **Real world:** analytics dashboards, image processing (integral images), spreadsheet aggregates.

### Binary search (and on the answer)
- **Trigger:** sorted data, or a monotonic yes/no condition ("can we do it with capacity X?").
- **Idea:** halve the search space each step; define precisely what `mid` means and which side you discard.
- **Pitfalls:** infinite loops from `mid` rounding, `lo <= hi` vs `lo < hi` confusion, overflow in `(lo+hi)/2` in C++/Java (use `lo + (hi-lo)/2`), unclear whether you want first/last occurrence.
- **Real world:** database index lookups, git bisect, version rollbacks, capacity planning.

### Stack / monotonic stack
- **Trigger:** matching brackets, undo, next greater/smaller element, evaluate expressions, histogram areas.
- **Idea:** the stack holds unresolved items; a new item resolves the ones on top that it answers.
- **Pitfalls:** empty-stack pops, forgetting leftovers at the end, storing values when you need indices.
- **Real world:** compiler parsers, browser back button, text editors' undo, stock span calculations.

### Queue / BFS
- **Trigger:** shortest path in unweighted graph/grid, minimum steps, level-order traversal.
- **Idea:** explore in rings of increasing distance; the first time you reach a node is the shortest.
- **Pitfalls:** marking visited when popping instead of when pushing (causes duplicates and TLE), grid bounds, multi-source start.
- **Real world:** GPS routing hops, social "degrees of separation", web crawlers, network broadcast.

### DFS / backtracking
- **Trigger:** enumerate all combinations/permutations/paths, constraint puzzles (N-Queens, Sudoku), connected components.
- **Idea:** choose, explore, un-choose. Prune early when a partial choice cannot lead to a valid answer.
- **Pitfalls:** forgetting to undo the choice, appending a reference instead of a copy of the path, missing pruning, recursion depth.
- **Real world:** constraint solvers, route planning, game AI, dependency resolution, regex engines.

### Dynamic programming
- **Trigger:** "minimum / maximum / number of ways", choices at each step, overlapping subproblems, brute-force recursion that repeats calls.
- **Idea steps:** (1) define the state in words, (2) write the recurrence, (3) set base cases, (4) fix the evaluation order, (5) optimize space if possible.
- **Teach the progression:** brute-force recursion → memoization → tabulation → space optimization.
- **Pitfalls:** state that does not capture enough information, wrong base cases, wrong iteration order, using greedy when DP is needed.
- **Real world:** diff tools (edit distance), spell check, route/cost optimization, resource allocation, sequence alignment in bioinformatics.

### Greedy
- **Trigger:** interval scheduling, coin change with canonical coins, "always pick the best local option".
- **Idea:** a locally optimal choice leads to a global optimum. Always ask for the **exchange argument or proof**, because greedy that "works on examples" often fails.
- **Pitfalls:** assuming greedy works without proof; sorting by the wrong key.
- **Real world:** CPU schedulers, Huffman compression, network routing heuristics.

### Heap / priority queue
- **Trigger:** top-k, k-th largest, merge k sorted lists, running median, repeatedly pick the min/max.
- **Idea:** O(log n) insert and extract-min, so the best candidate is always accessible.
- **Pitfalls:** Python's `heapq` is a min-heap (negate for max-heap), tie-breaking with tuples, stale entries in lazy deletion.
- **Real world:** task schedulers, Dijkstra, leaderboard systems, load balancers.

### Union-Find (DSU)
- **Trigger:** dynamic connectivity, grouping, cycle detection in undirected graphs, Kruskal's MST.
- **Idea:** each set has a representative; `find` with path compression and `union` by rank give near O(1).
- **Real world:** network connectivity, image segmentation, friend-group detection, clustering.

### Trie
- **Trigger:** prefix search, autocomplete, dictionary matching, word-search puzzles.
- **Idea:** share common prefixes in a tree so lookup costs O(length of word), not O(number of words).
- **Real world:** search suggestions, spell checkers, IP routing tables (radix trees), T9 keyboards.

### Topological sort
- **Trigger:** tasks with dependencies, course prerequisites, build order.
- **Idea:** repeatedly take nodes with no remaining incoming edges (Kahn's) or reverse DFS finishing order. If you cannot take all nodes, there is a cycle.
- **Real world:** build systems (make, Bazel), package managers, spreadsheet recalculation, CI pipelines.

### Bit manipulation
- **Trigger:** "without extra space" tricks, subsets of small sets (n ≤ 20), parity, single number among duplicates.
- **Pitfalls:** operator precedence, signed shift behavior, language differences in integer width.
- **Real world:** permissions flags, compression, hashing, graphics, embedded systems.

---

## 3. Complexity cheat sheet from constraints

Assume roughly 10^8 simple operations per second in a compiled language (10^7 for Python, as a rough guide).

| Max n | Acceptable complexity | Typical techniques |
|---|---|---|
| ≤ 10 | O(n!) | Permutations, brute force |
| ≤ 20 | O(2^n), O(2^n · n) | Bitmask, backtracking |
| ≤ 100 | O(n^4) | Nested DP |
| ≤ 500 | O(n^3) | Floyd-Warshall, interval DP |
| ≤ 5,000 | O(n^2) | 2D DP, pair checks |
| ≤ 10^5 | O(n log n) | Sorting, heap, binary search, segment tree |
| ≤ 10^6 | O(n) or O(n log n) | Hash map, two pointers, sliding window |
| ≤ 10^9+ | O(log n) or O(1) | Binary search, math formula |

Use this table in Stage 3 so the learner learns to *read the constraints* as a hint toward the solution.

---

## 4. The universal problem-solving loop

1. **Understand**: restate, inputs/outputs, constraints, examples.
2. **Explore**: solve by hand, find the pattern, try small cases.
3. **Plan**: choose approach, state the invariant, estimate complexity.
4. **Execute**: write clean code in small functions.
5. **Verify**: dry run, edge cases, a brute-force comparison on small random inputs when possible.
6. **Reflect**: which pattern was it, what signal revealed it, what would I do differently?

Step 6 is what turns one solved problem into skill.