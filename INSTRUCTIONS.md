# Arabic Verb Conjugation Trainer — Claude Code Instructions

## Project overview

A React + Vite web app that drills Arabic verb conjugation patterns (Forms I–X) using active recall. One pronoun at a time, the student types the conjugated form, gets immediate feedback, and wrong answers are recycled until every form is typed correctly from memory.

---

## Tech stack

- **React + Vite** — frontend framework and build tool
- **Plain CSS variables** — no UI library, keep it lightweight
- **localStorage** — persist drill scores between sessions (no backend)
- **Vercel** — deployment target

---

## Project structure

```
arabic-verb-trainer/
├── public/
├── src/
│   ├── data/
│   │   └── conjugations.js       # all forms × tenses × pronouns — source of truth
│   ├── components/
│   │   ├── FormSelector.jsx      # pick Form I–X and past/present
│   │   ├── DrillCard.jsx         # single pronoun card with Arabic input
│   │   ├── FeedbackDisplay.jsx   # correct / wrong / retype states
│   │   ├── ProgressPips.jsx      # dot indicators showing progress through 13 pronouns
│   │   └── ResultsScreen.jsx     # end-of-round breakdown
│   ├── hooks/
│   │   └── useDrill.js           # all drill state: queue, mistakeMap, sessionResults, spaced repetition
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── INSTRUCTIONS.md
├── package.json
└── vite.config.js
```

---

## Core drill logic (must preserve exactly)

This is the heart of the app — do not simplify or change the flow without being asked:

1. Student picks a verb form (I–X) and tense (past / present)
2. 13 pronouns are shuffled into a queue
3. One pronoun is shown at a time — student types the full conjugated form in Arabic
4. **Correct first time** → green feedback, move to next card, mark as mastered
5. **Wrong** → show correct answer for 1.4 seconds, then force student to retype it correctly before moving on (retype mode)
6. Any pronoun that was wrong first time gets added back to the end of the queue for a second pass
7. Round only ends when every pronoun has been typed correctly — no skipping
8. Results screen shows first-time correct vs needed help, with full breakdown

---

## Data structure (conjugations.js)

```js
export const PRONOUNS = [
  { ar: 'هو', en: 'he' },
  { ar: 'هي', en: 'she' },
  { ar: 'هما (م)', en: 'they two (m)' },
  { ar: 'هما (ف)', en: 'they two (f)' },
  { ar: 'هم', en: 'they (m)' },
  { ar: 'هن', en: 'they (f)' },
  { ar: 'أنتَ', en: 'you (m)' },
  { ar: 'أنتِ', en: 'you (f)' },
  { ar: 'أنتما', en: 'you two' },
  { ar: 'أنتم', en: 'you (pl m)' },
  { ar: 'أنتن', en: 'you (pl f)' },
  { ar: 'أنا', en: 'I' },
  { ar: 'نحن', en: 'we' },
];

export const FORMS = {
  1: {
    label: 'Form I',
    pattern: { past: 'فَعَلَ', present: 'يَفْعَلُ' },
    desc: 'Base pattern — most common verbs',
    past: ['فَعَلَ','فَعَلَت','فَعَلَا','فَعَلَتَا','فَعَلُوا','فَعَلْنَ','فَعَلْتَ','فَعَلْتِ','فَعَلْتُمَا','فَعَلْتُم','فَعَلْتُنَّ','فَعَلْتُ','فَعَلْنَا'],
    present: ['يَفْعَلُ','تَفْعَلُ','يَفْعَلَانِ','تَفْعَلَانِ','يَفْعَلُونَ','يَفْعَلْنَ','تَفْعَلُ','تَفْعَلِينَ','تَفْعَلَانِ','تَفْعَلُونَ','تَفْعَلْنَ','أَفْعَلُ','نَفْعَلُ'],
  },
  2: { ... }, // same shape for all forms up to X
};
```

Every form follows the same shape. Arrays are always 13 items, index-aligned with PRONOUNS.

---

## useDrill hook — responsibilities

```js
// State it manages:
// queue          — shuffled array of pronoun indices still to drill
// cardIndex      — current position in queue
// mistakeMap     — { pronounIndex: mistakeCount } for this round
// sessionResults — array of 13: null | true | false (first-time result per pronoun)
// retypeMode     — boolean: are we in forced-retype state after a wrong answer?
// phase          — 'setup' | 'drill' | 'results'

// Key functions to expose:
// startDrill()
// submitAnswer(inputValue)
// nextCard()
// endDrill()
```

---

## UI requirements

- Arabic input must be `dir="rtl"` with large font (min 24px) — students are typing Arabic
- Enter key submits answer or advances to next card (same as clicking the button)
- Input auto-focuses on every new card
- Wrong answer: input goes red, correct answer displays for 1.4 seconds, then input resets to an orange/amber "retype" state
- Progress pips: 13 dots — filled teal when mastered, filled purple when wrong but completed, current card slightly enlarged
- No Arabic keyboard is provided in the UI — students use their device keyboard or system Arabic input

---

## localStorage schema

```js
// Key: 'drill_scores'
// Value: JSON object
{
  "1_past":    { correct: 11, total: 13, lastDrilled: "2026-06-27" },
  "1_present": { correct: 13, total: 13, lastDrilled: "2026-06-26" },
  "2_past":    { correct: 7,  total: 13, lastDrilled: "2026-06-25" },
  // etc.
}
```

Use this to sort forms on the setup screen — forms not drilled recently or with low scores surface first.

---

## Styling notes

- Use CSS variables throughout — no hardcoded hex values in components
- RTL text always uses `font-family: serif` or a system Arabic font — never a Latin web font
- Colour palette:
  - Correct state: green tones (`#E1F5EE` bg, `#085041` text, `#1D9E75` border)
  - Wrong state: red tones (`#FCEBEB` bg, `#791F1F` text, `#E24B4A` border)
  - Retype state: amber tones (`#FAEEDA` bg, `#633806` text, `#BA7517` border)
  - Primary accent (active form, current pip): purple (`#534AB7`)
  - Mastered pip: teal (`#1D9E75`)

---

## What to build first (in order)

1. Scaffold project: `npm create vite@latest arabic-verb-trainer -- --template react`
2. Create `src/data/conjugations.js` with all 9 forms × 2 tenses
3. Build `useDrill.js` hook with full queue + mistake recycling logic
4. Build `DrillCard.jsx` — the input + feedback component
5. Build `ProgressPips.jsx`
6. Wire together in `App.jsx` with setup → drill → results phases
7. Add localStorage persistence for scores
8. Style pass — mobile friendly, Arabic input comfortable on small screens
9. Deploy to Vercel

---

## What NOT to do

- Do not add transliteration (romanisation) — students already know the alphabet
- Do not add audio in v1
- Do not add weak verbs (hollow, defective, hamzated) in v1 — sound verbs only
- Do not use a component library (Material UI, Shadcn etc) — keep dependencies minimal
- Do not change the drill flow logic without explicit instruction — the retype-before-advance mechanic is intentional

---

## Future features (do not build yet, just be aware)

- Nahw al-Wadih grammar exercise module (same app, separate route)
- Masdar production drills (Form → verbal noun)
- Weak verb patterns
- Student progress dashboard for Badr Academy teacher view
