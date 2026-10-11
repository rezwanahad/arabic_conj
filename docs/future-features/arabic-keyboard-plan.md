
# On-Screen Clickable Arabic Keyboard

## Context

`fixes.md` and general usability feedback point at the same friction: typing Arabic conjugations (with full diacritics/harakat) requires a physical Arabic keyboard or OS-level IME, which not every student has set up. The drill's `handleSubmit` in `DrillCard.jsx` does an exact string match (`inputValue.trim() === correctAnswer`) against fully-vocalized forms like `فَعَلَ` or `إِسْتَفْعَلَ`, so users need a reliable way to produce both base letters *and* diacritics. This plan adds a mouse-clickable on-screen Arabic keyboard so students can type answers without a physical Arabic layout.

This is additive UI only — it does not touch the retype/mastery state machine, timing, or scoring logic that CLAUDE.md flags as off-limits.

**Difficulty: low-to-moderate**, roughly half a day. Self-contained component, no new dependencies, no backend, no changes to drill pedagogy.

## Key Design Facts

- **Diacritics are simple to insert.** Every string in `conjugations.js` (`FORMS[n].past`/`.present`) is authored as flat sequence *base letter → its diacritic → next base letter → ...* — no precomposed characters, no reordering needed. So key clicks can just append to the string: `setInputValue(prev => prev + char)`. No cursor-position tracking needed — verbs are short single words typed start-to-finish; if a student needs to fix a middle letter, backspace-and-retype is the expected flow anyway (mirrors physical typing).
- **No spacebar needed** — no entry in `FORMS` contains a space (verified).
- **User decision: full Arabic alphabet**, not just the letters currently used in Forms I–X. Include all 28 base letters, hamza variants (أ إ ؤ ئ ء آ), ta marbuta (ة), alef maksura (ى), plus the 5 diacritics (fatha َ, damma ُ, kasra ِ, sukun ْ, shadda ّ). This future-proofs the keyboard for new verb forms/roots without needing to touch the keyboard's character set again.
- **User decision: toggleable everywhere** (not always-visible). Same collapse/expand behavior on desktop and mobile — one `<details>/<summary>` (or equivalent) affordance, no viewport-based branching logic needed.

## Files to Create/Modify

### 1. `src/components/ArabicKeyboard.jsx` (new)
- Stateless, presentational component — same pattern as sibling `FeedbackDisplay.jsx`/`PatternDisplay.jsx`.
- API: `ArabicKeyboard({ onKeyPress, onBackspace, onClear, disabled })`
  - `onKeyPress(char)` — fires on any letter/diacritic click.
  - `onBackspace()` — remove last character.
  - `onClear()` — reset to empty string.
  - `disabled` — passed through so keys lock during the `correct` feedback window (mirrors existing submit-button disabled logic).
- Layout: grouped rows — base letters (full alphabet, in standard Arabic keyboard order), then a visually separated diacritics row, then backspace/clear as distinct "action" keys.
- Wrapped in `<details><summary>⌨ Show keyboard</summary>...</details>` for zero-JS collapse/expand, consistent everywhere (desktop + mobile) per the toggleable decision.
- Every key is `<button type="button">` — critical since these live inside `DrillCard`'s `<form onSubmit={handleSubmit}>`; without `type="button"` a key click would submit the form.
- Character arrays defined as local constants at the top of the file with a short comment noting they represent the full MSA alphabet (not derived from `conjugations.js`), so no runtime coupling to the data file.

### 2. `src/components/DrillCard.jsx` (minimal, additive edit only)
- Import `ArabicKeyboard`.
- Add three handlers, no changes to anything else:
  ```js
  const handleKeyPress = (char) => setInputValue((prev) => prev + char);
  const handleBackspace = () => setInputValue((prev) => prev.slice(0, -1));
  const handleClear = () => setInputValue('');
  ```
- Mount `<ArabicKeyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} onClear={handleClear} disabled={feedbackState === 'correct'} />` inside the `<form>`, directly under the `<input>` (before `FeedbackDisplay`) so the visual flow reads: input → keyboard toggle → feedback → submit.
- Zero changes to `handleSubmit`, `handleKeyDown`, the `useEffect` timing, or retype logic.

### 3. `src/App.css` (safe to modify — new classes only, no edits to existing rules)
Follow existing kebab-case + `.thing-modifier` convention, reuse CSS variables (`--primary`, `--border`, `--bg`, `--bg-light`, `--text`, `--space-*`):
- `.arabic-keyboard` — container, `direction: rtl`, flex column, `gap: var(--space-sm)`.
- `.keyboard-toggle` (the `<summary>`) — styled like `.btn-back` (small, secondary, `cursor: pointer`).
- `.keyboard-row` — flex row, wraps, `justify-content: center`, `gap: var(--space-xs)`.
- `.keyboard-key` — modeled on `.tense-btn`: `var(--border)` border, `var(--bg)` background, `border-radius: 8px`, `font-family: serif`, hover → `var(--primary)` border/color, `:disabled` → `opacity: 0.5; cursor: not-allowed` (matches existing disabled pattern).
- `.keyboard-key-diacritic` — modifier: larger font-size and a `min-width` so tiny combining marks stay clickable.
- `.keyboard-key-action` — modifier for backspace/clear: `background: var(--bg-light)` to visually separate from character keys.
- Mobile additions inside the existing `@media (max-width: 768px)` block: smaller padding/font-size on `.keyboard-key`, tighter `.keyboard-row` gap.

## Verification Plan

1. `npm run dev` → select Form I, past tense, start drill.
2. Confirm physical-keyboard/IME typing into `.drill-input` still works unchanged (existing behavior untouched).
3. Click keyboard keys only to spell a known correct answer (e.g., `فَعَلَ`) — confirm diacritics visually stack correctly and the exact-match submit still triggers green feedback + advance.
4. Deliberately submit a wrong answer via keyboard clicks — confirm red → 1.4s correct-answer display → amber retype → cleared input → refocus, all unchanged, and that keyboard clicks still work during retype.
5. Click Backspace mid-word — confirm correct single-character removal. Click Clear — confirm full reset.
6. Confirm keys are disabled (no-op) during the `correct` feedback lock window, matching submit-button behavior.
7. Toggle the `<details>` open/closed on both desktop width and ≤768px emulated width — confirm no horizontal overflow, touch targets are reasonably sized on mobile.
8. Toggle OS dark mode — confirm all keyboard colors come from CSS variables (no hardcoded hex).
9. `npm run lint` — should pass with no new oxlint errors.
