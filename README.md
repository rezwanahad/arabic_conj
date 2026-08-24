# Arabic Verb Conjugation Trainer

A modern web app for drilling Modern Standard Arabic (MSA) verb conjugation patterns using active recall. Students practice one pronoun at a time, type conjugated forms, and get immediate feedback with intelligent recycling of missed answers.

**Live Demo**: [Coming soon - Vercel deployment]  
**Repository**: https://github.com/rezwanahad/arabic_conj

---

## Features

### Core Drill System
- **Active Recall Learning** — Type conjugations from memory, not multiple choice
- **Intelligent Recycling** — Missed answers get added back to the queue for another pass
- **Immediate Feedback** — Visual feedback (green/red/amber) plus correct answer display
- **13 Pronouns × 10 Forms × 2 Tenses** — 260 conjugation drills total
- **Progress Tracking** — Visual progress pips showing first-time vs. needed-help
- **Score Persistence** — Scores saved to browser localStorage across sessions

### User Experience
- **Arabic-First Design** — RTL text, serif fonts, large input (24px+)
- **Dark Mode Support** — Full light/dark theme with CSS variables
- **Mobile Responsive** — Works on phone, tablet, desktop
- **No Keyboard Required** — Students use their device's system Arabic input
- **Smooth Animations** — Visual feedback for correct/wrong/retype states

---

## Tech Stack

- **React 19** — UI framework
- **Vite 8** — Build tool (lightning fast)
- **Plain CSS** — No UI libraries (minimal dependencies)
- **localStorage** — Client-side persistence (no backend)
- **Vercel** — Deployment target

**Zero dependencies** beyond React and Vite.

---

## Quick Start

### Development

```bash
# Install dependencies
cd arabic-verb-trainer
npm install

# Run dev server
npm run dev
# Open http://localhost:5173
```

### Build & Preview

```bash
# Build for production
npm run build

# Test production build locally
npm run preview
```

### Linting

```bash
npm run lint
```

---

## How It Works

### The Drill Flow

1. **Setup** — Student picks a verb form (I–X) and tense (past/present)
2. **Shuffle** — 13 pronouns are randomized into a queue
3. **Drill** — One pronoun shown at a time
   - Student types the conjugated form in Arabic
   - **Correct first time** → green feedback, move to next
   - **Wrong** → see correct answer for 1.4s, forced retype mode (amber input)
   - **Retype correct** → marked as "needed help", move to next
4. **Recycle** — Mistakes are added to end of queue for second pass
5. **Results** — When all 13 are correct, show breakdown (first-time vs. help-needed)

### No Skipping Rule
Round only ends when every pronoun has been typed correctly. Forces mastery.

---

## Project Structure

```
arabic-conj/
├── .claude/
│   ├── CLAUDE.md              # Development guidelines
│   ├── agents/                # 5 specialized agents
│   │   ├── code-review-agent.md
│   │   ├── production-agent.md
│   │   ├── testing-agent.md
│   │   ├── doc-steward-agent.md
│   │   └── ui-agent.md
│   └── settings.local.json
├── docs/
│   ├── README.md              # Agent system overview
│   ├── COORDINATION.md        # How agents work together
│   └── agents/                # Full documentation for each agent
├── arabic-verb-trainer/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks (useDrill, useScorePersistence)
│   │   ├── data/              # Conjugations.js (all forms × tenses × pronouns)
│   │   ├── App.jsx
│   │   └── App.css            # Complete styling + dark mode + RTL
│   ├── public/                # Assets
│   ├── package.json
│   └── vite.config.js
├── CLAUDE.md                  # Project constraints & guidelines
├── TECHNICAL.md               # Architecture & data flow
├── PRODUCTION.md              # Deployment guide
├── AGENTS-CLI.md              # Agent commands
├── INSTRUCTIONS.md            # Original project spec
└── README.md                  # This file
```

---

## Multi-Agent System

This project uses **5 specialized AI agents** to assist with development:

| Agent | Purpose | Command |
|-------|---------|---------|
| **code-review-agent** | Audits code for bugs, performance, style | `/code-review src/file.jsx` |
| **production-agent** | Deployment, build config, infrastructure | `/production deploy` |
| **testing-agent** | Creates tests, verifies functionality | `/test unit src/hooks/useDrill.js` |
| **doc-steward-agent** | Maintains documentation | `/docs update` |
| **ui-agent** | UI/UX design, styling, polish | `/ui polish` |

See [AGENTS-CLI.md](AGENTS-CLI.md) for full command reference.

---

## Data Structure

### Conjugations (conjugations.js)

```js
PRONOUNS = [
  { ar: 'هو', en: 'he' },          // 0
  { ar: 'هي', en: 'she' },          // 1
  // ... 11 more
]

FORMS = {
  1: {
    label: 'Form I',
    pattern: { past: 'فَعَلَ', present: 'يَفْعَلُ' },
    past: ['فَعَلَ', 'فَعَلَت', ...],    // 13 items, index-aligned with PRONOUNS
    present: ['يَفْعَلُ', 'تَفْعَلُ', ...], // 13 items
  },
  // ... Forms 2–10
}
```

**Critical invariant:** Every form has exactly 13 conjugations, one per pronoun, index-aligned.

### localStorage Schema

```js
// Key: 'drill_scores'
{
  "1_past":    { correct: 11, total: 13, lastDrilled: "2026-08-24" },
  "1_present": { correct: 13, total: 13, lastDrilled: "2026-08-24" },
  // ... one entry per form × tense
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useDrill.js` | Core drill state machine (queue, mistakes, scoring) |
| `src/components/DrillCard.jsx` | Main input + feedback component |
| `src/components/ProgressPips.jsx` | 13-dot progress indicator |
| `src/data/conjugations.js` | All conjugation data (source of truth) |
| `src/App.css` | Complete styling + RTL + dark mode |
| `CLAUDE.md` | Don't-touch rules (drill logic, data structure) |
| `TECHNICAL.md` | Architecture, data flow, algorithms |

---

## Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd arabic-verb-trainer
vercel --prod

# 3. Result: https://your-app.vercel.app
```

See [PRODUCTION.md](PRODUCTION.md) for full deployment guide.

---

## Development Guidelines

### Must Preserve
- ✅ Core drill flow (queue, retype mode, no skipping)
- ✅ Index alignment in conjugations.js
- ✅ CSS variable system (no hardcoded colors)
- ✅ RTL support for Arabic text
- ✅ Dark mode support
- ✅ localStorage scoring

### Don't Add
- ❌ UI libraries (Material UI, Tailwind, Shadcn)
- ❌ External dependencies (beyond React)
- ❌ Weak verbs in v1 (hollow, defective, hamzated)
- ❌ Transliteration/romanization
- ❌ Audio in v1
- ❌ Backend (localStorage only)

See [CLAUDE.md](CLAUDE.md) for full guidelines.

---

## Future Features (v2+)

- Nahw al-Wadih grammar exercises (separate module)
- Masdar (verbal noun) production drills
- Weak verb patterns
- Teacher dashboard for Badr Academy
- Spaced repetition algorithm
- Student progress analytics

---

## Learning Resources

- **[TECHNICAL.md](TECHNICAL.md)** — How everything works (architecture, state, algorithms)
- **[CLAUDE.md](CLAUDE.md)** — Development rules and project constraints
- **[PRODUCTION.md](PRODUCTION.md)** — How to deploy and manage the app
- **[AGENTS-CLI.md](AGENTS-CLI.md)** — How to use the agent system
- **[docs/README.md](docs/README.md)** — Multi-agent system overview

---

## Contributing

1. Read [CLAUDE.md](CLAUDE.md) — Project constraints
2. Read [TECHNICAL.md](TECHNICAL.md) — Architecture
3. Make changes
4. Run: `npm run lint` → `npm run build`
5. Commit: `git commit -m "feat: description"`
6. Push: `git push`

---

## License

Private project (not open source).

---

## Questions?

- **How does the drill work?** → [TECHNICAL.md - Core Algorithms](TECHNICAL.md#core-algorithms)
- **How do I deploy?** → [PRODUCTION.md](PRODUCTION.md)
- **What can I change?** → [CLAUDE.md](CLAUDE.md)
- **How do I use agents?** → [AGENTS-CLI.md](AGENTS-CLI.md)

---

**Built with focus, minimal dependencies, and pedagogical precision.** 🎯
