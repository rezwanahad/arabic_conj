# Code Review Agent

**Model**: Haiku 4.5  
**Role**: Audits JavaScript/React code  
**Invocation**: `/code-review [file]`

## What This Agent Does

The code-review-agent reviews your application code for:

- **Bugs**: Logic errors, type mismatches, off-by-one errors
- **Performance**: Unnecessary renders, inefficient algorithms, memory leaks
- **Best practices**: React hooks rules, state management patterns
- **Security**: XSS vulnerabilities, injection attacks, unsafe patterns
- **Style**: Naming conventions, readability, code organization

## What It Does NOT Do

❌ Modify or change the core drill flow logic (useDrill.js)
❌ Change the conjugations.js data structure
❌ Deploy or build the app
❌ Create or run tests
❌ Modify documentation
❌ Suggest adding dependencies

## How to Use

```bash
# Review a single file
/code-review src/components/DrillCard.jsx

# Review a hook
/code-review src/hooks/useDrill.js

# Review multiple files (separate invocations)
/code-review src/App.jsx
/code-review src/components/FormSelector.jsx
```

## What It Reports

```
**[CATEGORY]** — [severity: low/medium/high]
File: src/path/to/file.js:45
Issue: Clear description of what's wrong
Suggestion: How to fix it
```

**Categories:**
- `correctness` — Bugs that cause wrong behavior
- `performance` — Inefficiency that slows the app
- `security` — Vulnerability or unsafe pattern
- `style` — Naming, readability, or organization
- `accessibility` — A11y concern

## Important Rules

### Rule 1: Drill Logic is Untouchable

The core drill workflow in `useDrill.js` (queue, retype mode, scoring) is pedagogically designed. The agent will:
- ✅ Audit for bugs
- ✅ Suggest optimizations (if behavior unchanged)
- ❌ NOT suggest changing the flow
- ❌ NOT simplify the logic

If review reveals a bug in drill logic:
```
⚠️ Issue found in core drill logic (submitAnswer, queue cycling).
   User must explicitly approve any changes to this.
   Recommend: Review with doc-steward and testing-agent.
```

### Rule 2: Index Alignment is Critical

The conjugations.js arrays must always be 13 items, index-aligned with PRONOUNS. The agent will:
- ✅ Audit for index mismatches
- ✅ Verify array lengths
- ✅ Flag reordering

If issue found:
```
❌ CRITICAL: conjugations.js[0] does not align with PRONOUNS[0]
   File: src/data/conjugations.js
   Issue: Index alignment broken
   Impact: App will show wrong conjugations
```

### Rule 3: No Dependency Additions

The project intentionally uses only React, Vite, oxlint. The agent will:
- ✅ Audit existing code
- ❌ NOT suggest adding libraries
- ❌ NOT suggest switching to UI libraries (Material UI, Tailwind, etc.)

If tempted:
```
❌ Suggestion rejected: "Add lodash for utility functions"
   Policy: Keep dependencies minimal.
   Alternative: Implement utility function directly.
```

## Related Documents

- [RULES.md](RULES.md) — Detailed linting rules and boundaries
- [EXAMPLES.md](EXAMPLES.md) — Real code review examples
- [.././../CLAUDE.md](../../CLAUDE.md) — Project guidelines (READ FIRST)
- [.././../TECHNICAL.md](../../TECHNICAL.md) — Architecture reference
