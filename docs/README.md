# Multi-Agent Documentation System

This folder contains documentation for the specialized agents that assist with this project.

## Quick Navigation

- **[Agent Matrix](#agent-matrix)** — Quick reference table
- **[How Agents Work Together](#how-agents-work-together)** — Coordination rules
- **[Agent Docs](#agent-docs)** — Individual agent documentation

---

## Agent Matrix

| Agent | Role | Tools | Invocation | Do NOT |
|-------|------|-------|------------|--------|
| **code-review-agent** | Audits JS/React code | Read, Edit, Bash (lint) | `/code-review [file]` | Deploy, test, modify drill logic |
| **production-agent** | Deployment & build | Read, Edit, Bash (npm) | `/production [setup\|deploy]` | Modify code, run tests, audit code |
| **testing-agent** | Tests & regression | Read, Edit, Write, Bash | `/test [unit\|e2e]` | Deploy, audit code, modify docs |
| **doc-steward-agent** | Maintains docs | Read, Edit, Write | `/docs [add\|update]` | Modify code, deploy, test |

---

## How Agents Work Together

### Communication Flow

```
User Request
    ↓
┌───────────────────────────────────────┐
│ Code changed or feature requested     │
└───────────────────────────────────────┘
    ↓
    ├─→ code-review-agent: Audit code
    │   └─→ Reports findings
    │       ↓
    ├─→ testing-agent: Verify tests pass
    │   └─→ Reports coverage
    │       ↓
    ├─→ production-agent: Build & check
    │   └─→ Reports build status
    │       ↓
    └─→ doc-steward-agent: Update docs
        └─→ Reports doc changes
```

### Non-Interference Rules

**Each agent stays in its lane:**

| Agent | Can Read | Can Write | Cannot Touch |
|-------|----------|-----------|-------------|
| code-review | Any file | Code suggestions only | prod config, tests, docs |
| production | Any file | .env, vercel.json, CI/CD | src/ code, tests, docs |
| testing | Any file | Test files, test config | src/ code (without approval), prod, docs |
| doc-steward | Any file | All docs | src/ code, prod, tests |

**If an agent needs to cross boundaries**, it must:
1. Report the boundary violation
2. Wait for user approval
3. Coordinate with the other agent (if applicable)

Example:
```
code-review-agent finds a bug in src/hooks/useDrill.js
  → Reports: "🚫 Core drill logic found. User must approve fix."
  → Waits for user to explicitly approve
  → testing-agent then creates tests to verify the fix
```

---

## Agent Docs

### Code Review Agent
- **Purpose**: Audit JavaScript/React code for bugs, performance, style
- **Docs**: [code-review/README.md](agents/code-review/README.md)
- **Rules**: [code-review/RULES.md](agents/code-review/RULES.md)
- **Examples**: [code-review/EXAMPLES.md](agents/code-review/EXAMPLES.md)
- **Invoke with**: `/code-review src/path/to/file.jsx`

### Production Agent
- **Purpose**: Handle deployment, build config, infrastructure
- **Docs**: [production/README.md](agents/production/README.md)
- **Rules**: [production/RULES.md](agents/production/RULES.md)
- **Examples**: [production/EXAMPLES.md](agents/production/EXAMPLES.md)
- **Invoke with**: `/production setup` or `/production deploy`

### Testing Agent
- **Purpose**: Create tests, verify functionality, catch regressions
- **Docs**: [testing/README.md](agents/testing/README.md)
- **Rules**: [testing/RULES.md](agents/testing/RULES.md)
- **Examples**: [testing/EXAMPLES.md](agents/testing/EXAMPLES.md)
- **Invoke with**: `/test unit` or `/test e2e`

### Documentation Steward Agent
- **Purpose**: Maintain all project documentation
- **Docs**: [doc-steward/README.md](agents/doc-steward/README.md)
- **Rules**: [doc-steward/RULES.md](agents/doc-steward/RULES.md)
- **Examples**: [doc-steward/EXAMPLES.md](agents/doc-steward/EXAMPLES.md)
- **Invoke with**: `/docs update` or `/docs audit`

---

## Project Documentation Reference

**Core Project Docs** (maintain these):
- [`CLAUDE.md`](../CLAUDE.md) — Dev guidelines and don't-touch rules
- [`TECHNICAL.md`](../TECHNICAL.md) — Architecture and data flow
- [`PRODUCTION.md`](../PRODUCTION.md) — Deployment guide
- [`INSTRUCTIONS.md`](../INSTRUCTIONS.md) — Original spec

**Agent Definition Files** (in .claude/):
- `.claude/agents/code-review-agent.md`
- `.claude/agents/production-agent.md`
- `.claude/agents/testing-agent.md`
- `.claude/agents/doc-steward-agent.md`

---

## When to Use Each Agent

### Code Review Agent
```
User: "I modified DrillCard.jsx, can you check it?"
→ /code-review src/components/DrillCard.jsx
```

### Production Agent
```
User: "Set up Vercel deployment"
→ /production setup
```

### Testing Agent
```
User: "Write tests for useDrill hook"
→ /test unit src/hooks/useDrill.js
```

### Documentation Steward
```
User: "Update docs after code changes"
→ /docs update
```

---

## Escalation Flowchart

```
Issue Found
    ↓
Is it code quality?  → YES → code-review-agent
    ↓ NO
Is it testing?  → YES → testing-agent
    ↓ NO
Is it deployment?  → YES → production-agent
    ↓ NO
Is it documentation?  → YES → doc-steward-agent
    ↓ NO
→ Talk to main Claude Code (not an agent)
```

---

## Adding New Agents

If you add a new agent:

1. **Create agent definition**: `.claude/agents/new-agent.md`
2. **Create documentation folder**: `docs/agents/new-agent/`
3. **Create docs**: README.md, RULES.md, EXAMPLES.md
4. **Update this README**: Add to Agent Matrix
5. **Update COORDINATION.md**: Document new interactions
6. **doc-steward-agent organizes**: Files go in right places

---

## Troubleshooting

### Agent is interfering with another's work
→ Check [COORDINATION.md](COORDINATION.md) for non-interference rules
→ Report to user with specific boundary violation

### Agent doesn't have right tools
→ Check agent definition in `.claude/agents/xxx-agent.md`
→ Update tools section if needed

### Documentation is out of sync with code
→ Tell doc-steward-agent: `/docs audit`
→ Then `/docs update`

---

**Last Updated**: 2026-08-24  
**Agents**: 4 specialized, 1 coordinator (doc-steward)  
**Documentation**: 100% coverage intended
