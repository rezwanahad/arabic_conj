# UI Agent — Styling Rules & Constraints

## What UI Agent Can Modify

✅ **Can Freely Modify**:
- `src/App.css` — All styling
- Component JSX layout (if UX improves)
- CSS animations and transitions
- Responsive design breakpoints
- Color scheme and typography
- Hover/focus states
- Mobile layouts

✅ **Can Improve**:
- Visual hierarchy
- Spacing and alignment
- Component organization
- Form input styling
- Button states
- Progress indicators
- Loading states
- Error messages

## CSS Variable Rules

All colors must use CSS variables from `:root`:

```css
/* DO THIS */
color: var(--text);
background: var(--bg-light);
border-color: var(--primary);

/* DON'T DO THIS */
color: #333333;
background: #F5F5F5;
border-color: #0066CC;
```

**Available Variables** (defined in App.css `:root`):
```css
--correct-bg, --correct-text, --correct-border
--wrong-bg, --wrong-text, --wrong-border
--retype-bg, --retype-text, --retype-border
--primary, --primary-hover
--bg, --text, --text-light, --border, --bg-light
```

## RTL Requirements

All Arabic text MUST have:
```css
direction: rtl;
unicode-bidi: embed;
text-align: right;
font-family: serif;
```

**Check these elements**:
- `.drill-input` — Arabic input field
- `.pattern-pronoun`, `.pattern-answer` — References
- `.feedback` — Feedback messages
- `.pip-label` — Pronoun labels
- Any element showing Arabic text

## Dark Mode Support

All colors must work in both light and dark:

```css
/* Light mode (default) */
:root {
  --bg: #FFFFFF;
  --text: #333333;
  --primary: #0066CC;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1F1F1F;
    --text: #FFFFFF;
    --primary: #3B82F6;
  }
}
```

## Typography Rules

**Arabic Text**:
- Font: serif only (never sans-serif)
- Min size: 24px for input
- Size for labels/feedback: 18px+

**English Text**:
- Font: system fonts (Apple System Font, Segoe UI, Roboto, etc.)
- Size: 16px base, 14px small

**Never use web fonts** — keep file size small.

## Spacing Rules

Use consistent spacing:
```css
/* Standard spacing scale */
0.5rem, 1rem, 1.5rem, 2rem, 2.5rem, 3rem
```

**Don't use arbitrary values**:
```css
/* GOOD */
padding: 1.5rem;
margin: 2rem 0;
gap: 1rem;

/* AVOID */
padding: 23px;
margin: 31px 0;
gap: 13px;
```

## Responsive Design Rules

**Mobile-first approach**:
```css
/* Base styles (mobile) */
.form-card {
  padding: 1rem;
  font-size: 0.95rem;
}

/* Larger screens */
@media (min-width: 768px) {
  .form-card {
    padding: 1.5rem;
    font-size: 1rem;
  }
}
```

**Breakpoints**:
- Mobile: < 768px
- Tablet/Desktop: ≥ 768px

**Test on**:
- iPhone (375px)
- iPad (768px)
- Desktop (1200px+)

## Animation Rules

**Use sparingly** for polish, not distraction:
```css
/* GOOD - subtle, quick */
transition: all 0.2s ease;
opacity: 0.6;

/* AVOID - distracting */
animation: spin 5s infinite;
transform: rotate(720deg);
```

**Good animations**:
- Hover effects (0.2s)
- Feedback appearance (0.3s)
- Progress pip pulse (2s loop, subtle)
- Smooth scrolling

**Avoid**:
- Animations longer than 0.5s (unless intentional)
- Spinning, bouncing, flashing
- Anything that distracts from learning

## Accessibility Requirements

**Color Contrast**:
- Normal text: 4.5:1 ratio minimum
- Large text: 3:1 ratio minimum
- Example: `#333333` on `#FFFFFF` = 12.6:1 ✅

**Keyboard Navigation**:
- All buttons must be focusable
- `:focus` state must be visible
- Tab order must make sense

**ARIA Labels** (if needed):
- Form inputs should have labels
- Buttons should have clear text
- Images should have alt text

## Component-Specific Rules

### DrillCard.jsx (Input)
- ✅ Must be `dir="rtl"`
- ✅ Must be ≥24px font
- ✅ Must show state (correct/wrong/retype) via color
- ✅ Must auto-focus on new card
- ❌ Don't add placeholder (distracting)

### ProgressPips.jsx (Progress Dots)
- ✅ 13 dots always
- ✅ Current pip slightly enlarged + pulsing
- ✅ Mastered: teal/primary color
- ✅ Needed help: gray
- ✅ Pending: hollow
- ❌ Don't change number of pips

### FormSelector.jsx (Form Picker)
- ✅ Grid layout responsive
- ✅ Form cards should be clickable with clear feedback
- ✅ Score badge visible
- ✅ Pattern display clear

### ResultsScreen.jsx (Results)
- ✅ Summary cards clearly show stats
- ✅ Breakdown list is readable
- ✅ "New Drill" button is prominent
- ✅ Results are clear

## What NOT to Do

❌ **Never**:
- Add Material UI, Tailwind, Shadcn
- Add npm dependencies
- Change drill flow behavior
- Hardcode colors
- Use inline styles (use CSS instead)
- Remove responsive design
- Break dark mode
- Break RTL support

❌ **Don't Change**:
- useDrill.js (core logic)
- conjugations.js (data structure)
- Component responsibility/behavior

## Testing UI Changes

After making UI changes:

1. **Visual check**:
   ```bash
   npm run dev
   # Open http://localhost:5173
   # Check: desktop, mobile, dark mode
   ```

2. **Mobile responsive**:
   - Landscape orientation
   - Portrait orientation
   - Touch targets ≥44px

3. **Dark mode**:
   - Toggle system theme
   - All colors should invert properly

4. **Keyboard**:
   - Tab through all elements
   - Enter key submits
   - Escape closes modals (if any)

5. **Arabic**:
   - RTL text is right-aligned
   - No garbled text
   - Input accepts Arabic correctly

## Decision Matrix

| Change | Can Do? | Notes |
|--------|---------|-------|
| Change button color | ✅ YES | Use CSS variable |
| Add hover effect | ✅ YES | Keep subtle |
| Improve spacing | ✅ YES | Use spacing scale |
| Fix mobile layout | ✅ YES | Test responsiveness |
| Add animation | ✅ YES | Keep short & subtle |
| Add new component | ⚠️ MAYBE | Only if UX improves |
| Change drill logic | ❌ NO | Untouchable |
| Add dependency | ❌ NO | Forbidden |
| Use Tailwind | ❌ NO | Forbidden |
| Remove dark mode | ❌ NO | Must support |
| Break RTL | ❌ NO | Must support |

---

**UI Agent Goal**: Make the app beautiful, accessible, and delightful to use — without adding complexity or dependencies.
