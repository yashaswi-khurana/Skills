# Real-World Map: Data Structure / Algorithm → Where It Runs in Tech

Read this when writing Stage 1 (real-world story) and Stage 9 (industry use and optimization). Pick the one or two examples that best match the learner's problem and explain the role the algorithm plays, rather than listing everything.

## Contents
1. Data structures
2. Algorithms and techniques
3. "What if we hadn't optimized?" impact examples
4. Domain index (if the learner names an interest area)

---

## 1. Data structures

| Structure | Where it appears | Role |
|---|---|---|
| Array / dynamic array | Image pixels, audio samples, database pages, ML tensors | Contiguous memory gives fast indexing and cache-friendly scans |
| Linked list | LRU cache (with hash map), OS free-memory lists, undo history | Cheap insert/remove at known positions |
| Hash map / set | Caches, deduplication, DNS, database hash joins, session stores, spam filters (with Bloom filters) | O(1) average lookup |
| Stack | Compiler parsing, call stack, browser back, undo/redo, expression evaluation | Last-in-first-out nesting and reversal |
| Queue / deque | Task queues (Kafka, RabbitMQ, SQS), print spoolers, BFS, rate limiters | First-in-first-out fairness and buffering |
| Heap / priority queue | OS schedulers, Dijkstra, event simulation, top-k trending, load balancers | Always know the most urgent item |
| Binary search tree / balanced tree | Database indexes (B-trees/B+ trees), file systems, ordered maps | Ordered data with log-time search and insert |
| Trie / radix tree | Autocomplete, spell check, IP routing tables, DNS resolvers | Prefix lookups independent of dictionary size |
| Graph | Social networks, maps, web links, dependency graphs, recommendation systems, knowledge graphs | Model relationships |
| Union-Find | Network connectivity, image segmentation, Kruskal's MST, clustering | Merge and query groups almost instantly |
| Segment tree / Fenwick tree | Analytics range queries, leaderboards, competitive programming | Range query and update in O(log n) |
| Bloom filter | Databases (skip disk reads), web crawlers, malicious URL checks | Probabilistic "definitely not present" at tiny memory cost |
| Skip list | Redis sorted sets, concurrent ordered maps | Balanced-like performance with simpler concurrency |

## 2. Algorithms and techniques

| Technique | Where it appears | Role |
|---|---|---|
| Binary search | Database index lookups, `git bisect`, version/regression finding, capacity planning, autoscaling thresholds | Find a boundary among millions in about 20 steps |
| Sorting | Database `ORDER BY`, merge joins, ranking, compression, deduplication, preparing data for two pointers | Orders data so later steps get cheap |
| Two pointers | Merging sorted logs, de-duplication, string comparison, memory compaction | Linear scan with no extra memory |
| Sliding window | Rate limiting, moving averages in monitoring, TCP flow control, anomaly detection, streaming analytics | Summaries over "the last N items/seconds" |
| Prefix sums | Dashboards, image integral sums, range analytics | Constant-time range totals after preprocessing |
| BFS | GPS hop-count routing, social "degrees of separation", web crawling, network broadcast, shortest moves in games | Shortest path in unweighted graphs |
| DFS | Maze solving, dependency analysis, cycle detection, garbage collection (mark phase), file-system traversal | Exhaustive exploration |
| Dijkstra / A* | Google Maps, game pathfinding, network routing (OSPF) | Cheapest path with weighted edges |
| Topological sort | Build systems (Make, Bazel), package managers, CI pipelines, spreadsheet recalculation, course scheduling | Ordering tasks with dependencies |
| Dynamic programming | Diff tools (edit distance), spell correction, DNA alignment, video compression, knapsack-style resource allocation, text justification | Reuse solutions of overlapping subproblems |
| Greedy | Huffman coding (compression), CPU schedulers, interval scheduling, network routing heuristics | Fast near-optimal or provably optimal choices |
| Backtracking | Sudoku/N-Queens solvers, regex engines, constraint solvers, configuration validation | Explore choices with early pruning |
| Divide and conquer | Merge sort, FFT (signal processing), MapReduce style big-data jobs | Split, solve in parallel, combine |
| Hashing | Password storage, checksums, deduplication, consistent hashing in distributed systems | Fingerprints and even distribution |
| Consistent hashing | Distributed caches (Memcached), DynamoDB, CDNs | Add/remove servers while moving minimal data |
| Reservoir sampling | Sampling from streams too large for memory | Uniform random sample in one pass |
| Bit manipulation | Permission flags, compression, graphics, embedded systems, Bloom filters | Compact state and fast operations |
| PageRank (graph + iteration) | Web search ranking, recommendations | Importance from link structure |

## 3. "What if we hadn't optimized?" impact examples

Use these to make complexity feel real:

- **Autocomplete over 1 million words.** Scanning every word per keystroke is about 10^6 operations per key. A trie costs about the length of the typed prefix, so roughly 10 operations. That is the difference between visible lag and instant results.
- **Detecting duplicates among 10^5 uploaded files.** Comparing every pair is about 5×10^9 comparisons (minutes to hours). Hashing each file once and checking a set is 10^5 operations (milliseconds).
- **Finding the commit that broke the build among 1,000 commits.** Checking each takes up to 1,000 test runs; `git bisect` needs about 10.
- **Route planning on a road network.** Plain BFS ignores edge weights and gives wrong ETAs; Dijkstra or A* gives correct and fast ones. Choosing the wrong algorithm is a correctness bug, not only a speed issue.
- **Rate limiting 10 million users.** Storing every request timestamp costs memory proportional to traffic; a sliding-window counter or token bucket keeps per-user memory constant.
- **Leaderboard with 10^6 players and frequent updates.** Re-sorting after each update is O(n log n) per update; a balanced tree or sorted set (Redis ZSET) gives O(log n).

When using numbers like these, mark them as approximate order-of-magnitude illustrations, not benchmarks.

## 4. Domain index (use when the learner names an interest)

- **Web / backend:** hash maps (caching), queues (jobs), heaps (scheduling), tries (routing), rate limiting (sliding window / token bucket), consistent hashing.
- **Databases:** B+ trees, hash joins, sorting/merge, Bloom filters, LSM trees, binary search on indexes.
- **Operating systems:** heaps/queues for scheduling, linked lists and bitmaps for memory, graphs for deadlock detection, LRU for page replacement.
- **Networking:** graphs and shortest paths, tries for IP routing, sliding windows for TCP, hashing for load balancing.
- **Machine learning / data:** heaps (top-k), sorting, hashing (feature hashing), graphs (GNNs), DP (Viterbi, sequence models), sampling.
- **Game development:** A*, spatial partitioning (quadtrees, grids), priority queues for events, graph search for AI.
- **Compilers / languages:** stacks, trees (ASTs), graphs (control flow), DP (register allocation heuristics), hash tables (symbol tables).
- **Security:** hashing, Bloom filters, tries (URL/IP blocklists), graphs (attack paths).
- **Finance / trading:** heaps and sorted structures (order books), sliding windows (moving averages), DP (option pricing models), low-latency arrays.
- **Embedded / systems:** bit manipulation, ring buffers, fixed-size arrays, careful space complexity.