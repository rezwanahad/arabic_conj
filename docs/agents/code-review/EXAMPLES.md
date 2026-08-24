# Code Review Agent — Examples

## Example 1: Style & Naming Review

**User Request**: `/code-review src/components/FormSelector.jsx`

**Agent Review**:
```markdown
## Code Review: FormSelector.jsx

### Summary
Component structure is sound. Minor naming improvement suggested.

### Findings

**LOW** Style — Line 8
Issue: Variable named `fs` is unclear (could be filesystem)
Current: `const [fs, setFormScores] = useState({})`
Impact: Confusing for future readers
Suggestion: Rename to `scores` or `formScores`

**MEDIUM** Performance — Line 12
Issue: useEffect runs on every render (no dependencies)
Current: `useEffect(() => { setFormScores(getScores()); })`
Impact: Unnecessary re-renders, could be optimized
Suggestion: Add dependency: `[getScores]` or memoize getScores

### Next Steps
1. Rename `fs` to `scores`
2. Add dependency array to useEffect
3. Test that form selector still loads scores on mount
```

---

## Example 2: Bug Detection

**User Request**: `/code-review src/hooks/useDrill.js`

**Agent Review**:
```markdown
## Code Review: useDrill.js

### Summary
Core logic is sound. One potential index bug found.

### Findings

**HIGH** Correctness — Line 42
Issue: Shuffle uses Math.random() - 0.5 (unstable sort)
Current: `.sort(() => Math.random() - 0.5)`
Impact: Shuffle bias (some permutations more likely than others)
Suggestion: Use Fisher-Yates algorithm for true randomness
Code:
```js
const shuffled = Array.from({ length: 13 }, (_, i) => i);
for (let i = 12; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}
```

**MEDIUM** Performance — Line 55
Issue: sessionResults recreated on every submitAnswer call
Current: `const newResults = [...sessionResults];`
Impact: Unnecessary array allocation (minor, 13 items only)
Suggestion: Could use useCallback memo, but not critical

⚠️ **CORE LOGIC**: submitAnswer function is foundational.
Any changes require testing-agent verification.

### Next Steps
1. Replace shuffle with Fisher-Yates
2. Add unit test for shuffle distribution
3. testing-agent: Verify drill flow still works
```

---

## Example 3: Boundary Violation (Handled Correctly)

**User Request**: `/code-review src/hooks/useDrill.js`

**Agent Review** (Correct approach):
```markdown
## Code Review: useDrill.js

### Summary
Review complete. Boundary constraint noted.

### Findings

⚠️ **BOUNDARY CONSTRAINT** — Lines 48-88
Issue: submitAnswer logic (retype mode, queue recycling) is core pedagogy
Current: Complex state machine for forcing retype on mistakes
Impact: This is intentional pedagogical design (not a bug)
Status: ✅ APPROVED - Core logic is sound, no changes suggested

If changes were needed, would require:
1. User explicit approval
2. testing-agent verification
3. doc-steward documentation update

### Recommendation
Core drill logic is well-implemented. No refactoring needed.
```

---

## Example 4: Cannot Add Dependencies

**User Request**: `/code-review src/App.jsx`

**Agent Review** (Boundary observed):
```markdown
## Code Review: App.jsx

### Summary
Code structure is good. Suggestion cannot be implemented.

### Findings

❌ **SUGGESTION REJECTED** — Line 1
Thought: "Add lodash for utility functions"
Reason: Project policy is zero non-React dependencies
Status: ✗ CANNOT IMPLEMENT

Alternative: Implement utility directly in the file or src/utils/
(Examples: shuffle, arraySum, indexFind - all tiny, no external libs)

### Decision
Keep all utilities as inline functions or simple utils/
Do not add node_modules dependencies.
```

---

## Example 5: RTL & Style Compliance

**User Request**: `/code-review src/components/DrillCard.jsx`

**Agent Review**:
```markdown
## Code Review: DrillCard.jsx

### Summary
RTL handling mostly correct. One CSS variable missing.

### Findings

**LOW** Style — Line 55
Issue: Hardcoded color in inline style
Current: `style={{ color: '#0066CC' }}`
Impact: Hardcoded value doesn't respect dark mode
Suggestion: Use CSS variable: `style={{ color: 'var(--primary)' }}`
Or better: Use className="primary-text"

**MEDIUM** RTL — Line 62
Issue: Missing unicode-bidi on input wrapper
Current: `<div dir="rtl">` (only dir, no unicode-bidi)
Impact: Text isolation might fail in edge cases
Suggestion: Add `unicode-bidi: embed` to CSS or style prop
```

---

## Example 6: Index Alignment Audit

**User Request**: `/code-review src/data/conjugations.js`

**Agent Review**:
```markdown
## Code Review: conjugations.js

### Summary
Data integrity verified. All indices aligned.

### Findings

✅ **VERIFIED**: PRONOUNS array length = 13
✅ **VERIFIED**: Each FORMS[n].past array length = 13
✅ **VERIFIED**: Each FORMS[n].present array length = 13
✅ **VERIFIED**: Index alignment spot-check
   - PRONOUNS[0] (هو) matches FORMS[1].past[0] (فَعَلَ)
   - PRONOUNS[12] (نحن) matches FORMS[1].present[12] (نَفْعَلُ)

### Recommendation
Data structure is sound. No changes needed.
```

---

## Example 7: Performance Optimization

**User Request**: `/code-review src/components/ProgressPips.jsx`

**Agent Review**:
```markdown
## Code Review: ProgressPips.jsx

### Summary
Component is optimized. No performance issues.

### Findings

**LOW** Style — Line 20
Issue: Pips recreated on every render (not memoized)
Current: Entire component re-renders if parent re-renders
Impact: Minor (13 divs only, fast to render)
Suggestion: Could use React.memo() if parent re-renders frequently
   `export const ProgressPips = React.memo(function ProgressPips(...)`

Status: ✅ Not critical, but possible optimization

### Next Steps
Optional: Wrap component with React.memo for performance
(Defer unless you notice lag on large screens)
```

---

## Example 8: Correct Drill Logic Report

**User Request**: `/code-review src/hooks/useDrill.js`

**Agent Review** (Best practices):
```markdown
## Code Review: useDrill.js

### Summary
Core logic implementation verified as pedagogically correct.

### Findings

✅ **CORE LOGIC VERIFIED**: Queue cycling
- Shuffle randomizes 0-12 ✅
- Mistakes append to queue end ✅
- No skipping (must complete all 13) ✅
- Results tracked per pronoun ✅

✅ **RETYPE MODE**: Works as designed
- Shows correct answer 1.4s ✅
- Forces student to retype ✅
- Counts as "false" (needed help) ✅

⚠️ **IF CHANGES NEEDED**: Core logic is pedagogical
- Any modification requires user approval
- testing-agent must verify behavior
- doc-steward must update docs

### Recommendation
Core drill logic is sound. No refactoring suggested.
```

---

**These examples show:**
1. ✅ What can be reviewed (style, performance, bugs)
2. ✅ How to report findings clearly
3. ❌ What cannot be touched (drill logic, data structure)
4. ✅ How to escalate boundary issues
