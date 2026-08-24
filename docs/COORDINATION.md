# Agent Coordination & Non-Interference Rules

This document defines how the 4 specialized agents work together without stepping on each other.

## The Four Agents

1. **code-review-agent** — Audits code
2. **production-agent** — Deploys and configures
3. **testing-agent** — Tests and verifies
4. **doc-steward-agent** — Maintains documentation

---

## Ownership Matrix

### By File Type

| File Pattern | Owner | Others Can Read? | Can Suggest Changes? |
|--------------|-------|-------------------|----------------------|
| `src/**/*.js`, `src/**/*.jsx` | code-review | ✅ Yes (all) | code-review only |
| `test/**`, `*.test.js`, `*.spec.js` | testing | ✅ Yes (all) | testing only |
| `vercel.json`, `.env*`, `.github/**` | production | ✅ Yes (all) | production only |
| `docs/**`, `*.md` (except CLAUDE.md) | doc-steward | ✅ Yes (all) | doc-steward only |
| `CLAUDE.md`, `TECHNICAL.md`, `PRODUCTION.md` | User + doc-steward | ✅ Yes (all) | User must approve |
| `.gitignore`, `package.json`, `vite.config.js` | Shared | ✅ Yes (all) | Any with user approval |

---

## Interaction Rules by Scenario

### Scenario 1: User Makes Code Changes

```
User edits src/components/DrillCard.jsx
    ↓
code-review-agent: Reviews code
    ├─ Checks for bugs, performance, style
    ├─ Reports findings
    └─ Does NOT modify code without user approval
    ↓
testing-agent: (User asks) Writes/runs tests
    ├─ Creates test cases for changed code
    ├─ Runs tests to verify
    └─ Reports coverage
    ↓
doc-steward-agent: (User asks) Updates docs
    ├─ Updates TECHNICAL.md if architecture changed
    ├─ Updates component docs
    └─ Reports what changed
    ↓
production-agent: (User asks) Rebuilds
    ├─ Runs `npm run build`
    ├─ Verifies no build errors
    └─ Reports size/performance

Result: Code flows through review → test → docs → build
```

### Scenario 2: Deployment Workflow

```
User asks: "Deploy to production"
    ↓
production-agent: Prepares deployment
    ├─ Verifies vercel.json
    ├─ Checks environment variables
    ├─ Runs `npm run build` to verify
    └─ Reports ready-to-deploy
    ↓
User must ensure code is tested:
    ├─ code-review-agent: Code passed review
    ├─ testing-agent: Tests pass
    └─ User: "OK to deploy"
    ↓
production-agent: Deploys
    └─ Reports deployment status

Result: Safe deployment only after review + test
```

### Scenario 3: Test Failure Reveals Bug

```
testing-agent: Runs tests, finds failure
    ├─ Reports which test failed
    ├─ Shows expected vs actual
    └─ Does NOT modify code
    ↓
code-review-agent: (User asks) Reviews for bug
    ├─ Audits related code
    ├─ Identifies root cause
    └─ Suggests fix (does NOT apply)
    ↓
User approves fix
    ↓
code-review-agent: (User asks) Applies suggested changes
    └─ Modifies code to fix bug
    ↓
testing-agent: Retests
    ├─ Runs tests again
    └─ Reports pass/fail
    ↓
doc-steward-agent: (User asks) Updates changelog
    └─ Documents bug fix

Result: Bug flows through detect → diagnose → fix → verify → document
```

### Scenario 4: Documentation Gap

```
User: "The docs don't explain how the queue works"
    ↓
doc-steward-agent: Identifies gap
    ├─ Reviews TECHNICAL.md
    ├─ Sees queue algorithm is under-documented
    └─ Reports gap
    ↓
doc-steward-agent: Writes documentation
    ├─ Reads TECHNICAL.md section
    ├─ Understands from code (reads src/hooks/useDrill.js)
    ├─ Expands queue algorithm section with diagrams
    └─ Adds examples
    ↓
code-review-agent: (If code changed?) NO
    └─ No action needed
    ↓
Result: Docs improved, code unchanged
```

---

## Boundary Violations & How to Handle

### Violation: code-review-agent deploys code

```
❌ NOT ALLOWED: code-review-agent creates vercel.json
   "Production config is production-agent's job"
   
FIX: production-agent creates vercel.json
    code-review-agent reviews it only (as code/config)
```

### Violation: production-agent modifies src/ code

```
❌ NOT ALLOWED: production-agent "optimizes" DrillCard.jsx
   "Code modification is code-review-agent's job"
   
FIX: production-agent identifies perf issue
    code-review-agent reviews and suggests optimization
    User approves
```

### Violation: testing-agent writes documentation

```
❌ NOT ALLOWED: testing-agent creates testing/README.md in docs/
   "Documentation is doc-steward-agent's job"
   
FIX: testing-agent reports findings
    doc-steward-agent writes the doc
```

### Violation: doc-steward-agent runs tests

```
❌ NOT ALLOWED: doc-steward-agent runs `npm test`
   "Testing is testing-agent's job"
   
FIX: doc-steward-agent reports doc issues
    testing-agent verifies those issues with tests
```

---

## Cross-Agent Communication

### When Agents Must Coordinate

**code-review + testing**
- Issue: Code review finds bug
- Process:
  1. code-review-agent: Reports bug
  2. testing-agent: Writes test to catch it
  3. code-review-agent: Suggests fix
  4. testing-agent: Verifies fix passes test

**production + code-review**
- Issue: Build fails
- Process:
  1. production-agent: Reports build error
  2. code-review-agent: Audits code for syntax error
  3. User or code-review: Fixes
  4. production-agent: Retests build

**production + testing**
- Issue: Code passes tests but fails in production
- Process:
  1. production-agent: Reports production error
  2. testing-agent: Writes integration/E2E test for scenario
  3. testing-agent: Verifies test catches the bug
  4. code-review-agent: Reviews fix
  5. production-agent: Redeploys

**Any agent + doc-steward**
- Process: Any agent can report doc gaps
  - Agent: "Docs don't mention X"
  - doc-steward-agent: Reads code, updates docs
  - Agent: Verifies docs are now accurate

---

## Decision Rights & Escalation

### Who Decides What?

| Decision | Owner | Input From | Escalate If |
|----------|-------|-----------|------------|
| Code design | User | code-review | Conflicts with drill spec |
| Bug fix approach | User + code-review | testing | Breaks existing functionality |
| Deployment strategy | User | production | Infrastructure constraints |
| Documentation structure | doc-steward | User | Disagrees with user's preference |
| Test framework choice | testing | User | Conflicts with existing setup |

### Escalation Path

```
Agent disagrees with another agent
    ↓
Both agents report to User
    ↓
User decides
    ↓
Losing agent accepts decision
    ↓
Proceed with user's choice
```

Example:
```
code-review: "This component should be refactored"
testing: "But refactoring breaks our test setup"
    ↓
Both report to user with trade-offs
    ↓
User decides: "Keep existing structure, document it"
    ↓
Both agents accept and proceed
```

---

## Audit Trail

### How to Track Agent Actions

Each agent should report:
1. **What was checked/done**
2. **Findings or status**
3. **Next step** (what happens next)
4. **Escalations** (if boundary violated)

Example Report:
```
**code-review-agent Report**
- File: src/components/DrillCard.jsx
- Status: ✅ Review complete
- Findings: 
  - Line 45: Unnecessary re-render on dependency change
  - Suggest: Add memo() wrapper
- Next: Waiting for user approval to apply
- Escalations: None
```

---

## Prevention: Pre-Invasion Checklist

Before each agent starts work, it should ask:

**code-review-agent**
- ✅ Is this a code file (src/, test/, config)?
- ✅ Am I only reporting findings, not deploying?
- ✅ Am I not running tests or modifying tests?

**production-agent**
- ✅ Is this a deployment/build task?
- ✅ Am I not modifying src/ code?
- ✅ Am I not writing or running tests?

**testing-agent**
- ✅ Is this a test file or test framework setup?
- ✅ Am I not modifying production config?
- ✅ Am I not updating documentation without doc-steward?

**doc-steward-agent**
- ✅ Is this a documentation file?
- ✅ Am I not modifying code or tests?
- ✅ Am I not deploying or building?

---

## Conflict Resolution Flowchart

```
Agent A thinks Agent B is invading
    ↓
Agent A reports: "Boundary violation: [description]"
    ↓
User reviews COORDINATION.md with both agents
    ↓
Is it really a violation?
    ├─ YES → Agent B backs off, follows rules
    ├─ NO → Agent A accepts Agent B's work
    └─ UNCLEAR → User decides
    ↓
Proceed
```

---

## Success Metrics

✅ **Good Coordination When:**
- Each agent stays in its lane
- Agents hand off cleanly (review → test → deploy)
- No duplicate work
- No re-doing each other's work
- Communication is clear

❌ **Bad Coordination When:**
- Agents modify each other's work
- Unclear who owns which file
- Boundaries are regularly violated
- Agents wait indefinitely for each other

---

## Quick Reference: Who Does What

**User makes a code change:**
1. code-review → test → build → docs ✅

**User requests deployment:**
1. production → (verify tests pass?) → deploy ✅

**Test fails:**
1. testing → code-review → fix → test ✅

**Documentation needs update:**
1. doc-steward (reads code to understand) → writes docs ✅

**Deployment fails:**
1. production → reports error
2. code-review → audits code
3. testing → verifies fix
4. production → redeploys ✅

---

**Last Updated**: 2026-08-24  
**Version**: 1.0  
**Agents Coordinated**: 4  
**Conflicts This System Prevents**: Infinite (proper isolation)
