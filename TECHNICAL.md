# Technical Documentation — Arabic Verb Conjugation Trainer

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Component Hierarchy & Data Flow](#component-hierarchy--data-flow)
3. [State Management](#state-management)
4. [Data Structures](#data-structures)
5. [Core Algorithms](#core-algorithms)
6. [Styling System](#styling-system)
7. [localStorage Schema](#localstorage-schema)
8. [Component Details](#component-details)
9. [Hook Details](#hook-details)
10. [Initialization & Lifecycle](#initialization--lifecycle)

---

## Architecture Overview

### High-Level Flow
```
App (Router via phase state)
├── FormSelector (phase: 'setup') → selects form & tense → calls startDrill()
├── DrillCard (phase: 'drill') → shows pronoun → student types → submitAnswer()
│   ├── ProgressPips (shows 13-dot progress, current highlighted)
│   ├── PatternDisplay (shows verb form pattern reference)
│   └── FeedbackDisplay (shows correct/wrong/retype states)
└── ResultsScreen (phase: 'results') → shows first-time vs help breakdown
```

### State Management Pattern
- **useDrill()** — Manages entire drill lifecycle (queue, mistakes, results)
- **useScorePersistence()** — Reads/writes localStorage
- **App.jsx** — Routes between phases, wires hooks to components
- **FormSelector** — Local state for form/tense selection
- **DrillCard** — Local state for input value & feedback display timing

### No Redux/Context Needed
Drill state is simple enough for a single hook + local React state. App.jsx is the only "connector."

---

## Component Hierarchy & Data Flow

```
App.jsx
├─ useDrill() hook
│  └─ Returns: { phase, currentForm, currentTense, queue, cardIndex, 
│               retypeMode, mistakeMap, sessionResults, ... methods }
│
├─ useScorePersistence() hook
│  └─ Returns: { getScores(), saveScore() }
│
└─ Conditional Rendering by phase:
   │
   ├─ phase === 'setup'
   │  └─ FormSelector
   │     ├─ Reads: useScorePersistence().getScores()
   │     ├─ Local state: selectedForm, selectedTense
   │     ├─ Calls: drill.startDrill(formNum, tense) on button click
   │     └─ Renders: 10 form cards (I–X) with score badges
   │
   ├─ phase === 'drill'
   │  ├─ DrillCard (main input component)
   │  │  ├─ Props: pronoun, correctAnswer, retypeMode, onSubmit, formNum, tense, pronounIndex
   │  │  ├─ Local state: inputValue, feedbackState, showCorrectAnswer
   │  │  ├─ Sub-components:
   │  │  │  ├─ PatternDisplay (ref display, non-interactive)
   │  │  │  ├─ Form input (dir="rtl", auto-focuses)
   │  │  │  └─ FeedbackDisplay (shows state: correct/wrong/retype)
   │  │  └─ Calls: onSubmit(inputValue) when form submitted
   │  │
   │  ├─ ProgressPips (13-dot indicator)
   │  │  ├─ Props: sessionResults [array of null|true|false], currentPronounIndex
   │  │  └─ Shows: filled dots for mastered/helped, hollow for pending, current enlarged
   │  │
   │  └─ Back button → resets to 'setup'
   │
   └─ phase === 'results'
      └─ ResultsScreen
         ├─ Props: sessionResults, mistakeMap, onNewDrill callback
         ├─ Shows: summary (first-time correct / needed help / total)
         └─ Shows: breakdown by pronoun + mistakes per pronoun
         └─ Calls: onNewDrill() → resets to 'setup'
```

### Props Contract

**DrillCard** (the main interaction component)
```js
DrillCard({
  pronoun: { ar: 'هو', en: 'he' },          // Current pronoun object
  correctAnswer: 'فَعَلَ',                    // Expected input value
  retypeMode: boolean,                       // User in retype state?
  onSubmit: (inputValue) => void,            // Called on correct answer
  formNum: 1,                                // Current form (I–X)
  tense: 'past',                             // 'past' | 'present'
  pronounIndex: 0                            // 0–12, for tracking mistakes
})
```

**ProgressPips**
```js
ProgressPips({
  sessionResults: [null, true, false, ...], // 13 items: first-time results
  currentPronounIndex: 5                     // Highlight this pip
})
```

**ResultsScreen**
```js
ResultsScreen({
  sessionResults: [true, false, true, ...],  // 13 items: results per pronoun
  mistakeMap: { 0: 2, 3: 1, ... },          // Mistake count per pronoun index
  onNewDrill: () => void                     // Reset to FormSelector
})
```

---

## State Management

### useDrill() Hook — Complete State Machine

**State Variables** (all managed internally):
```js
const [phase, setPhase] = useState('setup');              // 'setup' | 'drill' | 'results'
const [currentForm, setCurrentForm] = useState(null);     // 1–10
const [currentTense, setCurrentTense] = useState(null);   // 'past' | 'present'
const [queue, setQueue] = useState([]);                   // [0,3,7,2,...] shuffled pronoun indices
const [cardIndex, setCardIndex] = useState(0);            // Current position in queue (0–26 max)
const [retypeMode, setRetypeMode] = useState(false);      // Forced retype state?
const [mistakeMap, setMistakeMap] = useState({});         // { 0: 2, 3: 1, ... } mistakes per pronoun
const [sessionResults, setSessionResults] = useState(Array(13).fill(null)); // null | true | false per pronoun
```

**State Transitions**
```
'setup' 
  ├─ [click form] → startDrill() → shuffle queue → 'drill'
  
'drill'
  ├─ [correct first time] → mark sessionResults[i] = true → next card
  ├─ [wrong first time] → mark retypeMode = true → add pronoun to end of queue
  ├─ [wrong in retype] → stay in retype (don't advance)
  ├─ [correct in retype] → mark sessionResults[i] = false → next card
  └─ [all 13 pronounced correct] → 'results'

'results'
  └─ [click "New Drill"] → reset state → 'setup'
```

**Key Methods Exposed**
```js
startDrill(formNum, tense)
  // Initializes: currentForm, currentTense, queue (shuffled 0–12)
  // Sets: cardIndex=0, retypeMode=false, mistakeMap={}, sessionResults=[null×13]
  // Transitions: phase='drill'

submitAnswer(inputValue)
  // Compare inputValue vs getCurrentAnswer()
  // If correct: mark sessionResults, advance cardIndex (or end if done)
  // If wrong:   if !retypeMode, set retypeMode=true, add to queue end
  //             if retypeMode, stay in place (student must retype)

getCurrentPronounIndex() → 0–12
  // Returns queue[cardIndex], i.e., which pronoun to drill now

getCurrentAnswer() → 'فَعَلَ'
  // Returns FORMS[currentForm][currentTense][pronounIndex]

getCurrentPronoun() → { ar: 'هو', en: 'he' }
  // Returns PRONOUNS[getCurrentPronounIndex()]
```

### useScorePersistence() Hook

**State Variables**: None (reads from localStorage)

**Methods**
```js
getScores() 
  // Returns entire drill_scores object from localStorage
  // Returns {} if not found or parse fails

getScore(formNum, tense) 
  // Returns scores[`${formNum}_${tense}`] or null
  
saveScore(formNum, tense, correctCount)
  // Writes to localStorage:
  // scores[`${formNum}_${tense}`] = { 
  //   correct: correctCount,
  //   total: 13,
  //   lastDrilled: "2026-08-24"
  // }
```

**Side Effect in App.jsx**
```js
useEffect(() => {
  if (drill.phase === 'results') {
    const firstTimeCorrect = drill.sessionResults.filter(r => r === true).length;
    saveScore(drill.currentForm, drill.currentTense, firstTimeCorrect);
  }
}, [drill.phase, drill.currentForm, drill.currentTense, drill.sessionResults, saveScore]);
```
Automatically saves scores when drill ends.

---

## Data Structures

### conjugations.js

**PRONOUNS Array** (ordered 0–12, immutable)
```js
export const PRONOUNS = [
  { ar: 'هو', en: 'he' },                    // 0
  { ar: 'هي', en: 'she' },                   // 1
  { ar: 'هما (م)', en: 'they two (m)' },    // 2
  { ar: 'هما (ف)', en: 'they two (f)' },    // 3
  { ar: 'هم', en: 'they (m)' },              // 4
  { ar: 'هن', en: 'they (f)' },              // 5
  { ar: 'أنتَ', en: 'you (m)' },             // 6
  { ar: 'أنتِ', en: 'you (f)' },             // 7
  { ar: 'أنتما', en: 'you two' },            // 8
  { ar: 'أنتم', en: 'you (pl m)' },         // 9
  { ar: 'أنتن', en: 'you (pl f)' },         // 10
  { ar: 'أنا', en: 'I' },                    // 11
  { ar: 'نحن', en: 'we' },                   // 12
];
```

**FORMS Object** (10 keys, 1–10)
```js
export const FORMS = {
  1: {
    label: 'Form I',
    pattern: { past: 'فَعَلَ', present: 'يَفْعَلُ' },
    desc: 'Base pattern — most common verbs',
    past: ['فَعَلَ', 'فَعَلَت', ..., 'فَعَلْنَا'],      // 13 items
    present: ['يَفْعَلُ', 'تَفْعَلُ', ..., 'نَفْعَلُ'], // 13 items
  },
  2: { ... },
  // ... up to 10
};
```

**Critical Invariant**
```
FORMS[n].past[i] and FORMS[n].present[i] 
  are conjugations for PRONOUNS[i]

Example:
  PRONOUNS[0].ar = 'هو' (he)
  FORMS[1].past[0] = 'فَعَلَ' (he did)
  FORMS[1].present[0] = 'يَفْعَلُ' (he does)
```

### Queue Structure

**Initial** (after shuffle in startDrill)
```js
queue = [3, 7, 1, 9, 0, 11, 5, 2, 8, 4, 6, 12, 10]  // Random permutation of 0–12
cardIndex = 0

// Accessing current pronoun:
currentPronounIndex = queue[cardIndex]  // e.g., 3 → PRONOUNS[3] = 'هما (ف)'
```

**After Wrong Answer (retype mode)**
```js
// Pronoun 3 was wrong
queue = [3, 7, 1, 9, 0, 11, 5, 2, 8, 4, 6, 12, 10, 3]  // 3 appended
cardIndex stays 0 (don't advance)
retypeMode = true
```

**After Correct in Retype**
```js
queue = [7, 1, 9, 0, 11, 5, 2, 8, 4, 6, 12, 10, 3]  // Original position 3 now at end
cardIndex = 1  // Move to next
retypeMode = false
```

**Why This Works**
- Mistakes naturally move to second pass (end of queue)
- No skipping: students must complete all 13
- Queue grows max to 26 items (13 originals + 13 mistakes max)

---

## Core Algorithms

### 1. Shuffle (startDrill)
```js
const shuffled = Array.from({ length: 13 }, (_, i) => i)
  .sort(() => Math.random() - 0.5);
// Randomizes 0–12 into queue, e.g., [3, 7, 1, ...]
```

### 2. Submit Answer (submitAnswer)
```
INPUT: inputValue (what student typed)

1. Get expected = FORMS[currentForm][currentTense][queue[cardIndex]]
2. Compare: inputValue.trim() === expected ?

IF CORRECT:
  a. If first time seeing this pronoun (sessionResults[i] == null):
     - Set sessionResults[i] = retypeMode ? false : true
  b. Clear retypeMode = false
  c. Advance cardIndex += 1
  d. Check if all 13 done: if all sessionResults[i] != null, phase='results'

IF WRONG:
  a. If not in retypeMode:
     - Set retypeMode = true
     - Append this pronoun to queue end
     - Increment mistakeMap[pronounIndex]
  b. If already in retypeMode:
     - Stay in place (student must retype)
```

### 3. Check Round Complete
```js
if (sessionResults.every(r => r !== null)) {
  phase = 'results';
}
```
All 13 pronouns must have a result (true or false, not null).

---

## Styling System

### CSS Variables (App.css `:root`)

**State Colors** (used in feedback)
```css
--correct-bg: #D4EDDA;       /* Light green background */
--correct-text: #155724;     /* Dark green text */
--correct-border: #28A745;   /* Green border */

--wrong-bg: #F8D7DA;         /* Light red background */
--wrong-text: #721C24;       /* Dark red text */
--wrong-border: #F5C6CB;     /* Red border */

--retype-bg: #FFF3CD;        /* Light amber background */
--retype-text: #856404;      /* Dark amber text */
--retype-border: #FFEEBA;    /* Amber border */
```

**UI Colors**
```css
--primary: #0066CC;          /* Active form, current pip */
--primary-hover: #0052A3;    /* Hover state */
--mastered: #0066CC;         /* Pip color when correct first time */

--bg: #FFFFFF;               /* Page background */
--text: #333333;             /* Primary text */
--text-light: #666666;       /* Secondary text */
--border: #E8E8E8;           /* Default borders */
--bg-light: #F5F5F5;         /* Light background (cards) */
```

**Dark Mode Override** (@media prefers-color-scheme: dark)
```css
--bg: #1F1F1F;
--text: #FFFFFF;
--primary: #3B82F6;
--correct-bg: #064E3B;
--correct-text: #D1FAE5;
/* etc. */
```

### RTL Implementation

**Always Use Together**
```css
direction: rtl;              /* Text flow direction */
unicode-bidi: embed;         /* Isolate RTL text */
text-align: right;           /* Align to right edge */
font-family: serif;          /* Arab fonts prefer serif */
```

**Applied To**
- `.drill-input` — Arabic input field
- `.pattern-pronoun`, `.pattern-answer` — References
- `.pip-label` — Pronoun labels in progress dots
- `.feedback` — Feedback messages
- Any element showing Arabic text

### Responsive Design

**Mobile Breakpoint** (@media max-width: 768px)
- Single-column layout for form grid
- Reduced padding (1rem instead of 2rem)
- Smaller fonts (1.2rem input, 1.8rem Arabic)
- Smaller pips (14px instead of 18px)
- Flex wrap for pattern display

---

## localStorage Schema

**Key**: `'drill_scores'`

**Value** (JSON object):
```js
{
  "1_past":    { correct: 11, total: 13, lastDrilled: "2026-06-27" },
  "1_present": { correct: 13, total: 13, lastDrilled: "2026-06-26" },
  "2_past":    { correct: 7,  total: 13, lastDrilled: "2026-06-25" },
  "2_present": { correct: 10, total: 13, lastDrilled: "2026-06-26" },
  // ... up to "10_present"
}
```

**Shape Per Form-Tense**
```js
{
  correct: Number,          // How many first-time correct (0–13)
  total: 13,                // Always 13 (fixed for now)
  lastDrilled: "YYYY-MM-DD" // ISO date string
}
```

**Persistence Flow**
1. User completes drill → phase='results'
2. App.jsx useEffect fires
3. Calls saveScore(formNum, tense, firstTimeCorrect)
4. Writes to localStorage (overwrites previous)
5. On next visit, FormSelector reads getScores() and displays badges

**Sorting Logic** (in FormSelector)
Currently: alphabetical by form number (1–10). Could be enhanced to sort by:
- `lastDrilled` (recent first)
- `correct` score (low scores first for practice)
- Combination of both

---

## Component Details

### DrillCard.jsx

**Key Logic**
1. useRef for input auto-focus on mount/pronoun change
2. Local state: inputValue, feedbackState, showCorrectAnswer
3. useEffect clears state on pronoun/retypeMode change, refocuses input

**Feedback Timing**
```js
if (isCorrect) {
  setFeedbackState('correct');
  setTimeout(() => onSubmit(inputValue), 1500);  // Wait 1.5s
} else {
  setFeedbackState('wrong');
  setShowCorrectAnswer(true);
  setTimeout(() => {
    setFeedbackState('retype');
    setShowCorrectAnswer(false);
    setInputValue('');  // Clear for retry
  }, 1400);  // Wait 1.4s then switch to retype
}
```

**Input Handling**
- `dir="rtl"` for Arabic text
- `onSubmit` e.preventDefault() to stop form reload
- Disabled during feedback display (feedbackState !== null)

### FormSelector.jsx

**Local State**
```js
const [selectedForm, setSelectedForm] = useState(1);     // Form currently selected
const [selectedTense, setSelectedTense] = useState('past'); // 'past' or 'present'
const [formScores, setFormScores] = useState({});        // Cache of scores
```

**Score Display Logic**
```js
getFormScore(formNum) {
  const pastScore = formScores[`${formNum}_past`];
  const presentScore = formScores[`${formNum}_present`];
  
  if (pastScore && presentScore) {
    const avg = Math.round((pastScore.correct + presentScore.correct) / 2);
    return `${avg}/13`;
  } else if (pastScore) {
    return `${pastScore.correct}/13`;
  } else if (presentScore) {
    return `${presentScore.correct}/13`;
  }
  return null;  // No score yet
}
```
Shows average of both tenses if both drilled, otherwise single tense.

### ProgressPips.jsx

**13 Dots with States**
```js
sessionResults.map((result, idx) => {
  const isCurrent = idx === currentPronounIndex;
  
  if (result === true) {
    // First-time correct → filled teal
    className = 'pip pip-mastered';
  } else if (result === false) {
    // Needed help → filled gray
    className = 'pip pip-needed-help';
  } else {
    // Not yet done → hollow
    className = 'pip';
  }
  
  if (isCurrent) {
    className += ' pip-current';  // Enlarged + pulsing shadow
  }
})
```

**Hover Label**
```js
// Hovering a pip shows its Arabic pronoun
<span className="pip-label">{PRONOUNS[idx].ar}</span>
```

### ResultsScreen.jsx

**Summary Cards**
```js
firstTimeCorrect = sessionResults.filter(r => r === true).length;
neededHelp = sessionResults.filter(r => r === false).length;
total = 13;

// Shows three stat cards:
// [firstTimeCorrect] First Time Correct
// [neededHelp]      Needed Help
// [13]              Total
```

**Breakdown by Pronoun**
```js
resultsByPronoun.map(({ ar, en, result, mistakes }) => (
  <div className="breakdown-item">
    <span className="ar">{ar}</span> ({en})
    {result === true ? '✓ First time' : `Tried ${mistakes + 1}×`}
  </div>
))
```

---

## Hook Details

### useDrill() — Complete Reference

**Selector Pattern** (useCallback getters)
```js
getCurrentPronounIndex()  // queue[cardIndex]
getCurrentAnswer()        // FORMS[form][tense][pronounIndex]
getCurrentPronoun()       // PRONOUNS[pronounIndex]
```
These are useCallback to prevent re-renders, but they recompute if queue/cardIndex change.

**startDrill(formNum, tense)**
```
Set currentForm, currentTense
Shuffle 0–12 into queue
Reset cardIndex=0, retypeMode=false, mistakeMap={}, sessionResults=[null×13]
Set phase='drill'
```

**submitAnswer(inputValue)**
```
Get expected answer
If correct:
  - Mark result in sessionResults (true if not retypeMode, false if was retypeMode)
  - Clear retypeMode
  - Advance cardIndex
  - Check if done (all 13 have results)
Else:
  - If not retypeMode: set retypeMode=true, append to queue
  - Else: stay in place
```

**Dependency Array** (useDrill has many useCallback deps)
```js
[queue, cardIndex, currentForm, currentTense, sessionResults, retypeMode]
```
If any of these change, new handler refs are created. Keeps logic reactive.

### useScorePersistence() — Complete Reference

**getScores()**
```
Try to read localStorage['drill_scores']
Parse JSON
Return parsed object, or {} if missing/error
```

**getScore(formNum, tense)**
```
Get all scores
Look up key = `${formNum}_${tense}`
Return score object or null
```

**saveScore(formNum, tense, correctCount)**
```
Get all current scores
Update or create: scores[key] = { correct, total: 13, lastDrilled: today }
Write back to localStorage
Catch errors silently (fail gracefully)
```

---

## Initialization & Lifecycle

### Entry Point: src/main.jsx
```js
import App from './App.jsx';
import './index.css';  // Global reset
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### App.jsx Lifecycle
```
1. Mount
   - useDrill() initializes with phase='setup'
   - useScorePersistence() ready to read localStorage
   
2. Render → FormSelector (phase is 'setup')
   
3. User selects form + tense, clicks start
   - FormSelector calls drill.startDrill(formNum, tense)
   - useDrill updates: phase='drill', queue shuffled, cardIndex=0
   
4. Render → DrillCard (phase is 'drill')
   - Shows PRONOUNS[queue[0]] (first pronoun)
   - Shows FORMS[formNum][tense][queue[0]] as correctAnswer
   
5. User types and submits
   - DrillCard calls drill.submitAnswer(inputValue)
   - useDrill checks correctness, updates queue/results
   - If correct: cardIndex++, render next pronoun
   - If wrong: append to queue, stay on same input, retype mode
   
6. After 13 correct (all sessionResults set)
   - phase='results'
   
7. Render → ResultsScreen (phase is 'results')
   - useEffect fire: saveScore(formNum, tense, firstTimeCorrect)
   - Saves to localStorage
   
8. User clicks "New Drill"
   - phase='setup'
   - Loop back to step 2
```

### Component Re-render Chain
```
useDrill() state change
  ↓
App.jsx re-renders
  ↓
Conditional render: which child component?
  ├─ phase='setup' → FormSelector
  ├─ phase='drill' → DrillCard + ProgressPips + ProgressPips
  └─ phase='results' → ResultsScreen
  ↓
Child component receives new props
  ├─ DrillCard gets new pronoun/correctAnswer/retypeMode
  ├─ ProgressPips gets new sessionResults/currentPronounIndex
  └─ ResultsScreen gets new sessionResults/mistakeMap
```

No re-render happens in other children (React's conditional rendering is efficient).

---

## Debugging Checklist

**App won't start drill**
- Check useDrill() queue is shuffled (not null/empty)
- Verify FORMS[formNum] exists (1–10)
- Confirm tense is 'past' or 'present'

**Wrong answer not showing correct form**
- Check FORMS[formNum][tense][pronounIndex] exists
- Verify PRONOUNS[pronounIndex] matches index
- Test in console: `FORMS[1]['past'][0]` should be 'فَعَلَ'

**Scores not persisting**
- Check localStorage is enabled (not blocked by browser)
- Verify useEffect in App.jsx fires (log drill.phase)
- Check localStorage key: `localStorage.getItem('drill_scores')`
- Confirm saveScore() is called (drill phase ends)

**Progress pips wrong**
- Verify sessionResults array has exactly 13 items
- Check currentPronounIndex is 0–12 (not out of bounds)
- Confirm PRONOUNS.length === 13

**RTL text broken**
- Check `direction: rtl` + `unicode-bidi: embed` on element
- Verify `font-family: serif` (not sans-serif)
- Inspect element in DevTools → Computed styles

**Mobile layout broken**
- Check @media max-width: 768px rule applies
- Verify grid uses grid-template-columns: 1fr
- Check padding/font-size reduced in mobile

---

## Quick Reference: Key File Locations

| What | Where |
|------|-------|
| Drill logic state machine | `src/hooks/useDrill.js` |
| Conjugation data | `src/data/conjugations.js` |
| Main input component | `src/components/DrillCard.jsx` |
| Progress indicator | `src/components/ProgressPips.jsx` |
| Score tracker | `src/hooks/useScorePersistence.js` |
| All styling + RTL | `src/App.css` |
| App router (phase logic) | `src/App.jsx` |
| localStorage schema | `src/hooks/useScorePersistence.js` (line 24–35) |
| CSS variables | `src/App.css` (line 1–46) |

