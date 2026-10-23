# Debugging Guide for DSA Code

Read this when the user pastes code that fails. Match the symptom to likely causes, then run the diagnostic questions.

## Contents
1. Symptom → likely cause
2. Common bug signatures with analogies
3. Diagnostic questions to ask the code
4. Pro debugging habits
5. Language-specific traps

---

## 1. Symptom → likely cause

| Symptom | Most likely causes |
|---|---|
| Wrong answer on sample | Misread problem, wrong operator (`<` vs `<=`), wrong initial value |
| Passes samples, fails hidden tests | Edge case missed (empty, single, duplicates, negatives), overflow, off-by-one |
| Time Limit Exceeded (TLE) | Hidden O(n²) (e.g. `in` on a list inside a loop, string concatenation in a loop, slicing copies), missing memoization, BFS marking visited too late |
| Memory Limit Exceeded | Storing all states instead of rolling arrays, recursion with huge call stack, copying lists at every recursion step |
| Runtime error / index out of range | Loop bound off by one, empty input, accessing `i+1` or `i-1` at the ends |
| Stack overflow / RecursionError | Missing or unreachable base case, recursion depth too large (convert to iteration or raise limit carefully) |
| Infinite loop | Pointer not advanced in some branch, binary search `mid` rounding, wrong loop condition |
| Output differs by ordering | Relying on set/dict ordering, unstable sort, not matching required output order |
| Works once, fails on second call | Mutable default argument, global state not reset, shared list reused |
| Answer too large or negative | Integer overflow (C++/Java), missing modulo, wrong type (int vs long) |

## 2. Common bug signatures (with analogies)

**Off-by-one**: the fence-post problem. 10 fence sections need 11 posts. Ask: is the range inclusive or exclusive on each end? Is the count `n` or `n+1`?

**Missing base case**: a staircase with no ground floor. The recursion keeps asking "what's below me?" forever.

**Mutating while iterating**: removing books from a shelf while counting them from left to right; you skip some and miscount others. Iterate over a copy, or build a new list.

**Shared reference instead of copy**: handing out the same notebook to everyone. In backtracking, `result.append(path)` stores the same list that you keep modifying; use `path[:]` or `list(path)`.

**Stale state / not resetting**: reusing a whiteboard without erasing it. Counters, visited sets, and DP tables must be reset between test cases or calls.

**Wrong data structure**: searching a phone book by scanning every page. A `list` membership check is O(n); a `set` is O(1).

**Greedy that is not actually optimal**: always taking the nearest exit on a highway and missing the faster route. Look for a counterexample before trusting a greedy.

**Visited marking too late (BFS)**: two people both booking the same seat because the "reserved" sign goes up only after they sit down. Mark visited when you enqueue.

**Overflow**: an odometer rolling over. `(lo + hi)` can exceed the integer max; use `lo + (hi - lo) / 2`. Apply modulo at each step, not only at the end.

**Comparing floats with `==`**: measuring with a ruler that has fuzzy ends. Use a tolerance, or rework the problem in integers.

**Loop invariant broken**: a rule the code promised to keep (e.g. "window has no duplicates") that one branch violates. Find the branch that does not restore it.

## 3. Diagnostic questions to ask the code

1. What is the **smallest input** that fails? (Shrink it until removing anything makes it pass.)
2. What does each variable hold **at the start of each iteration**? Is that what I believe?
3. What is the **invariant**, and where could it break?
4. What happens at the **first and last** iteration?
5. What happens on **empty / one element / all same**?
6. Is any **condition** using the wrong comparison, or checked at the wrong time?
7. Is the **complexity** what I think? (Count nested loops, and hidden loops inside library calls like `in`, `index`, `slice`, `sorted`, `str +`.)
8. Am I **modifying** something that I am also **reading**?

## 4. Pro debugging habits to teach

- **Write the brute force first**, even if slow, then compare it against the optimized solution on thousands of small random inputs. The first mismatch gives you a tiny failing case for free (this is called stress testing).
- **Print state per iteration** in a compact table for the smallest failing input, then delete the prints.
- **Use assertions** for invariants (`assert left <= right`) so a bug fails loudly at the source rather than silently downstream.
- **Binary-search the bug**: add a check halfway through the code to see whether the state is already wrong there.
- **Rubber-duck**: explain each line aloud; the mismatch between what you say and what the code does is the bug.
- **Change one thing at a time**, and know what you expect before you rerun.
- **Read the error message fully**, bottom first (the line number and type usually point at the culprit).

## 5. Language-specific traps

**Python**
- `list.insert(0, x)`, `x in list`, `list.pop(0)` are O(n); use `deque` or `set`.
- String `+=` in loops is O(n²) in the worst case; use `''.join`.
- Slicing copies: `arr[1:]` in recursion makes O(n²) total.
- Mutable default arguments (`def f(a, memo={})`) persist between calls.
- `[[0]*m]*n` creates n references to the same row; use `[[0]*m for _ in range(n)]`.
- Recursion limit defaults to about 1000.
- Integer division: `//` floors toward negative infinity, which differs from C++ for negatives.

**C++**
- `int` overflow at about 2.1×10^9; use `long long`.
- Uninitialized variables and out-of-bounds `vector` access are undefined behavior, not always a crash.
- `map[key]` inserts a default value when the key is absent.
- Slow I/O: use `ios::sync_with_stdio(false); cin.tie(nullptr);` in contests.
- Comparator for `sort` must be a strict weak ordering (`<`, not `<=`).

**Java**
- `==` on `Integer`/`String` compares references; use `.equals`.
- `int` overflow as in C++; `Math.floorMod` for negative modulo.
- `Arrays.asList` on a primitive array does not do what you expect.
- Removing from a list while using a for-each loop throws `ConcurrentModificationException`.