# Arabic Verb Conjugation Trainer — Claude Code Guidelines

## Project Overview

A React + Vite web app for drilling Modern Standard Arabic verb conjugation patterns (Forms I–X). Students practice one pronoun at a time, typing conjugated forms with immediate feedback. Wrong answers trigger a retype mode, and rounds only end when all 13 pronouns are mastered.

**Status**: ~99% complete, ready for testing & deployment  
**Tech Stack**: React 19 + Vite 8 + plain CSS (no UI libraries)  
**Target**: Vercel deployment, no backend (localStorage only)

---

## 🚫 **DO NOT CHANGE (Without Explicit Request)**

### Core Drill Flow — Preserve Exactly
The retype-before-advance mechanic is intentional pedagogy. Do not simplify or refactor:

1. Student picks Form (I–X) and tense (past/present)
2. 13 pronouns are **shuffled** into queue
3. One pronoun shown at a time
4. **Correct first time** → green feedback, next card, mark as `true` in sessionResults
5. **Wrong** → show correct answer for 1.4 seconds, then **force retype** before advance
6. Mistaken pronouns get **re-added to end of queue** for second pass
7. **No skipping** — round ends only when all 13 are mastered
8. Results screen shows first-time vs needed-help breakdown

**Related files**: `useDrill.js` (lines 32–88), `DrillCard.jsx` (handleSubmit logic)

### Data Structure — Index Alignment is Critical
`conjugations.js` has 13-item arrays for every form. **Do not reorder pronouns or conjugation arrays.**

```js
PRONOUNS[0]  → FORMS[1].past[0], FORMS[1].present[0], etc.
PRONOUNS[12] → FORMS[1].past[12], FORMS[1].present[12], etc.
```

Mistakes in index mapping break the entire app silently.

### Styling Constraints
- **No hardcoded colors** — use CSS variables only (defined in `:root`)
- **RTL text**: Always use `direction: rtl` + `font-family: serif` for Arabic
- **Min font size**: Arabic input must be ≥24px
- **Color palette is fixed** (per INSTRUCTIONS.md) — do not invent new states

### Dependencies — Keep Minimal
- ✅ React, React-DOM, Vite, oxlint only
- ❌ No Material UI, Tailwind, Shadcn, or other component libraries
- ❌ No auxiliary libraries (lodash, uuid, etc.) without asking

---

## 📁 **Key Files & Their Roles**

| File | Purpose | Changes? |
|------|---------|----------|
| `src/data/conjugations.js` | All forms/pronouns, source of truth | ⚠️ Careful: index alignment critical |
| `src/hooks/useDrill.js` | Queue, mistake tracking, state machine | 🚫 Core logic — ask before touching |
| `src/components/DrillCard.jsx` | Arabic input + 1.4s feedback timing | 🚫 Feedback flow is tested pedagogy |
| `src/components/FormSelector.jsx` | Form picker + score display | ✅ Safe to modify |
| `src/components/ResultsScreen.jsx` | Breakdown by pronoun | ✅ Safe to modify |
| `src/components/ProgressPips.jsx` | 13-dot progress indicator | ✅ Safe to modify |
| `src/App.jsx` | Phase router (setup → drill → results) | ⚠️ Be careful with phase transitions |
| `src/App.css` | All styling (CSS variables + RTL) | ✅ Safe, but respect RTL + a11y |
| `src/hooks/useScorePersistence.js` | localStorage schema `drill_scores` | ⚠️ Changing schema breaks user data |

---

## ✅ **Safe to Build/Enhance**

1. **Future features** (listed in INSTRUCTIONS.md line 179–184):
   - Nahw al-Wadih grammar module
   - Masdar production drills
   - Weak verb patterns
   - Teacher dashboard (Badr Academy integration)

2. **Quality improvements**:
   - E2E tests (Playwright, Cypress)
   - CI/CD pipeline (GitHub Actions)
   - Vercel deployment config
   - Updated project README

3. **UI polish** (keeping RTL & CSS-var discipline):
   - Better mobile UX
   - Animation tweaks
   - Accessibility improvements

---

## ❌ **Explicitly Out of Scope (v1)**

Do not implement:
- Transliteration / romanisation
- Audio pronunciation
- Weak verbs (hollow, defective, hamzated)
- Spaced repetition algorithm
- Authentication / user accounts
- Backend API

These are listed as "Future features" for a reason — adding them changes pedagogy.

---

## 🧪 **Testing Approach**

Before claiming a feature works:

1. **Manual drill walkthrough**:
   - Run `npm run dev`
   - Pick a form and complete one full round
   - Verify: correct first time → green, advance
   - Verify: wrong answer → see correct for 1.4s, retype mode, amber input
   - Verify: all 13 pronouns done before results screen

2. **Score persistence**:
   - Complete a drill, refresh page
   - Scores should appear on FormSelector

3. **Mobile**: Test landscape + portrait at 768px width

4. **Dark mode**: Toggle system preference, colors should invert

5. **Linting**: `npm run lint` should pass

---

## 🎯 **Common Tasks**

### Add a new verb form (e.g., Form XI)
1. Add entry to `FORMS` in `conjugations.js` (11 keys: label, pattern, desc, past, present)
2. Conjugation arrays must be exactly 13 items, index-aligned with `PRONOUNS`
3. Test by selecting form in dev and completing a drill

### Fix a conjugation error
1. Find in `conjugations.js`
2. Verify index matches the intended pronoun
3. Test: run drill with that form + pronoun

### Improve FormSelector sorting
1. Currently: shows forms by order in `FORMS` object
2. **Allowed**: Sort by score, recency, or mastery threshold
3. **Don't**: Change data structure or component contract

### Deploy to Vercel
1. Create `vercel.json` if not present
2. Ensure `npm run build` produces `/dist` folder
3. Vercel auto-detects Vite config

---

## 🔗 **Related Docs**

- `INSTRUCTIONS.md` (root) — Full spec, pedagogical rationale
- `App.css` — Color palette, RTL rules, responsive breakpoints
- Conjugation data structure (line 62–90 of INSTRUCTIONS.md)

---

## 📝 **Style & Conventions**

- **No comments** — code is self-documenting (via good naming)
- **Consistent naming**: `handleX`, `setX`, `getX` for event handlers, setState calls, getters
- **Max line length**: ~100 chars (readability)
- **Use CSS variables** for all colors, spacing, shadows (see `:root` in App.css)
- **RTL-aware**: Always add `direction: rtl` + `unicode-bidi: embed` to Arabic text containers

---

## 🤔 **Questions?**

- **Unsure if a change is safe?** Ask before implementing.
- **Want to refactor something?** Confirm it's not core drill logic first.
- **Need to add a dependency?** Ask — this project is deliberately minimal.

**Goal**: Keep the app lightweight, focused, and pedagogically pure. Drill logic is not a moving target.
