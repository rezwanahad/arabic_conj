# Agent CLI Commands

Quick reference for invoking each agent from the command line in Claude Code.

## How to Invoke Agents

All agents are invoked using slash commands (`/`) in Claude Code chat.

### Check Active Agents

```bash
/list-agents
```

**Output**:
```
This session: arabic-conj-cb [session-id]
(The name other sessions use to message it)

Other Claude sessions (1):
  [offline] · Dispatch background conversation · Remote Control
```

### Basic Syntax

```bash
/agent-name [command] [arguments]
```

**Examples**:
```bash
/code-review src/components/DrillCard.jsx
/test unit src/hooks/useDrill.js
/production deploy
/docs update
/ui polish
```

### How Agents Work

1. **Type command** → Agent launches
2. **Agent works** → Reports findings/changes
3. **You approve** → Changes are applied (or not)
4. **Next step** → Agent tells you what's next

---

## How Agents Communicate

Agents work together without interfering:

```
Your workflow:
  ↓
1. /code-review [file]        → Find bugs, suggest fixes
  ↓ (you approve changes)
2. /test unit [file]          → Write/run tests
  ↓ (tests pass)
3. /ui polish                 → Make it look great
  ↓ (visually improved)
4. /docs update               → Keep docs in sync
  ↓ (docs updated)
5. /production deploy         → Ship to production
```

**Each agent:**
- ✅ Does its job only
- ✅ Stays in its lane
- ❌ Doesn't interfere with others
- ✅ Hands off cleanly

---

## Code Review Agent

Reviews code for bugs, performance, style issues.

### Commands
```bash
/code-review src/components/DrillCard.jsx
/code-review src/hooks/useDrill.js
/code-review src/App.jsx
/code-review src/components/FormSelector.jsx
/code-review src/components/ProgressPips.jsx
/code-review src/components/ResultsScreen.jsx
/code-review src/data/conjugations.js
```

### What It Does
- ✅ Finds bugs and logic errors
- ✅ Reports performance issues
- ✅ Suggests style improvements
- ✅ Flags security problems
- ❌ Does NOT deploy
- ❌ Does NOT run tests
- ❌ Does NOT modify drill logic

### Example
```bash
/code-review src/hooks/useDrill.js
→ Agent audits the file and reports findings
```

---

## Production Agent

Handles deployment, build config, infrastructure setup.

### Commands
```bash
/production setup
/production deploy
/production check
/production config
```

### Command Details

| Command | What It Does |
|---------|------------|
| `setup` | Creates vercel.json, GitHub Actions, environment vars |
| `deploy` | Deploys current build to Vercel production |
| `check` | Verifies build succeeds locally (npm run build) |
| `config` | Reviews/updates build configuration |

### What It Does
- ✅ Creates deployment config (vercel.json)
- ✅ Builds and tests build locally
- ✅ Deploys to Vercel
- ✅ Manages environment variables
- ✅ Sets up CI/CD pipelines
- ❌ Does NOT modify code
- ❌ Does NOT run tests
- ❌ Does NOT review code

### Example
```bash
/production check
→ Runs npm run build to verify no errors

/production deploy
→ Pushes to Vercel production
```

---

## Testing Agent

Creates tests, runs them, verifies functionality.

### Commands
```bash
/test setup
/test unit src/hooks/useDrill.js
/test unit src/components/DrillCard.jsx
/test e2e
/test regression
/test coverage
```

### Command Details

| Command | What It Does |
|---------|------------|
| `setup` | Initialize test framework (Vitest, Playwright) |
| `unit [file]` | Write & run unit tests for specific file |
| `e2e` | Run end-to-end drill workflow tests |
| `regression` | Verify changes don't break existing features |
| `coverage` | Report test coverage percentage |

### What It Does
- ✅ Creates test files (.test.js, .spec.js)
- ✅ Runs unit tests
- ✅ Runs E2E tests
- ✅ Reports coverage gaps
- ✅ Detects regressions
- ❌ Does NOT deploy
- ❌ Does NOT review code style
- ❌ Does NOT modify documentation

### Example
```bash
/test unit src/hooks/useDrill.js
→ Writes tests for useDrill hook and runs them

/test e2e
→ Tests complete drill workflow end-to-end

/test coverage
→ Reports what code is untested
```

---

## Doc Steward Agent

Maintains and organizes all documentation.

### Commands
```bash
/docs update
/docs audit
/docs add [topic]
/docs organize
/docs link
```

### Command Details

| Command | What It Does |
|---------|------------|
| `update` | Syncs docs with recent code changes |
| `audit` | Checks for broken links, outdated info |
| `add [topic]` | Creates new documentation file |
| `organize` | Reorganizes docs/ folder structure |
| `link` | Fixes broken cross-references |

### What It Does
- ✅ Creates/updates all documentation files
- ✅ Keeps docs in sync with code
- ✅ Fixes broken links
- ✅ Organizes docs/ folder
- ✅ Cross-links related docs
- ❌ Does NOT modify code
- ❌ Does NOT deploy
- ❌ Does NOT run tests

### Example
```bash
/docs update
→ Updates TECHNICAL.md, PRODUCTION.md after code changes

/docs audit
→ Checks all links work, docs are current

/docs add testing-guide
→ Creates new testing guide documentation
```

---

## UI Agent

Improves UI/UX design, styling, and visual polish.

### Commands
```bash
/ui improve
/ui polish
/ui mobile
/ui accessibility
/ui style
```

### Command Details

| Command | What It Does |
|---------|------------|
| `improve` | General UX improvements, better layouts |
| `polish` | Visual refinement, micro-interactions, animations |
| `mobile` | Fix mobile responsiveness issues |
| `accessibility` | WCAG compliance, keyboard navigation, contrast |
| `style` | Update colors, spacing, typography |

### What It Does
- ✅ Modifies App.css styling
- ✅ Improves layouts and UX
- ✅ Enhances mobile responsiveness
- ✅ Adds animations and transitions
- ✅ Improves accessibility
- ✅ Refactors component JSX for better UX
- ❌ Does NOT modify drill logic
- ❌ Does NOT deploy
- ❌ Does NOT run tests
- ❌ Does NOT add dependencies

### Example
```bash
/ui polish
→ Agent adds micro-interactions, refines styling, improves overall polish

/ui mobile
→ Agent optimizes layout for mobile screens

/ui accessibility
→ Agent improves WCAG compliance and keyboard navigation
```

---

## Most Common Workflow

After you make code changes:

```bash
# 1. Review your code
/code-review src/components/DrillCard.jsx

# 2. Test it works
/test unit src/components/DrillCard.jsx

# 3. Update docs
/docs update

# 4. Check build
/production check

# 5. Deploy
/production deploy
```

---

## Quick Copy-Paste Commands

### Polish & Deploy (Full Workflow)
```bash
# 1. Make it look great
/ui polish

# 2. Fix mobile
/ui mobile

# 3. Review code
/code-review src/components/DrillCard.jsx

# 4. Test it
/test unit src/components/DrillCard.jsx

# 5. Update docs
/docs update

# 6. Deploy
/production deploy
```

### Full Review Before Deploy
```bash
/code-review src/components/DrillCard.jsx
/test unit src/components/DrillCard.jsx
/docs update
/production check
/production deploy
```

### Just Test Code
```bash
/test unit src/hooks/useDrill.js
```

### Just Check Docs
```bash
/docs audit
```

### Just Deploy
```bash
/production deploy
```

### Just Review Code
```bash
/code-review src/App.jsx
```

---

## Command Syntax

All commands follow this pattern:

```bash
/agent-name [command] [optional-arguments]
```

Examples:
```bash
/code-review src/path/file.jsx          # agent-name + file
/test unit src/hooks/useDrill.js        # agent-name + command + file
/production deploy                      # agent-name + command
/docs update                            # agent-name + command
```

---

## If Agent Doesn't Respond

Make sure:
1. Command is spelled correctly (e.g., `/code-review` not `/codereview`)
2. File path exists (e.g., `src/components/DrillCard.jsx` not `src/DrillCard.jsx`)
3. You're using the exact command from this guide

---

## File Paths for Reference

All files available to review:

```
src/
├── components/
│   ├── DrillCard.jsx
│   ├── FeedbackDisplay.jsx
│   ├── FormSelector.jsx
│   ├── PatternDisplay.jsx
│   ├── ProgressPips.jsx
│   └── ResultsScreen.jsx
├── hooks/
│   ├── useDrill.js
│   └── useScorePersistence.js
├── data/
│   └── conjugations.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## Related Documentation

- Full agent system: `docs/README.md`
- How agents coordinate: `docs/COORDINATION.md`
- Code review rules: `docs/agents/code-review/RULES.md`
- Production guide: `PRODUCTION.md`
- Technical architecture: `TECHNICAL.md`
- Project guidelines: `CLAUDE.md`

---

## Quick Reference Table

| I Want To... | Command |
|---|---|
| Make app look great | `/ui polish` |
| Fix mobile layout | `/ui mobile` |
| Improve accessibility | `/ui accessibility` |
| Review code | `/code-review src/path/file.jsx` |
| Test code | `/test unit src/path/file.js` |
| Update docs | `/docs update` |
| Deploy | `/production deploy` |
| Check build | `/production check` |

---

**Last Updated**: 2026-08-24  
**Active Agents**: 5 (code-review, production, testing, doc-steward, ui)  
**Most Used Commands**: `/ui polish`, `/code-review`, `/test unit`, `/production deploy`
