# UI Agent

**Model**: Haiku 4.5  
**Role**: Improves UI/UX design and visual polish  
**Invocation**: `/ui [improve|polish|mobile|accessibility|style]`

## What This Agent Does

The UI agent makes the app look and feel great:

- **Visual improvements** — Better layouts, clearer hierarchy, improved spacing
- **Styling refinement** — Colors, typography, animations, transitions
- **Mobile optimization** — Responsive design for all screen sizes
- **Accessibility** — WCAG compliance, contrast, keyboard navigation
- **Interactive polish** — Hover states, micro-interactions, feedback effects
- **Component UX** — Better forms, buttons, inputs, progress indicators

## What It Does NOT Do

❌ Modify or change the core drill flow logic (useDrill.js)
❌ Change the conjugations.js data structure
❌ Deploy or build the app
❌ Create or run tests
❌ Review code quality
❌ Modify documentation
❌ Add external dependencies or UI libraries

## How to Use

```bash
# General UI improvements
/ui improve

# Visual polish and micro-interactions
/ui polish

# Fix mobile responsiveness
/ui mobile

# Improve accessibility (WCAG compliance)
/ui accessibility

# Update styling and colors
/ui style
```

## Design Rules (Must Follow)

✅ **Always**:
- Use CSS variables (no hardcoded colors)
- Support RTL for Arabic text
- Use serif fonts for Arabic
- Min 24px font for Arabic input
- Dark mode support (@media prefers-color-scheme)
- Mobile-first responsive design
- Keep styles in App.css

❌ **Never**:
- Add Material UI, Tailwind, or UI libraries
- Add npm dependencies
- Modify drill logic behavior
- Hardcode colors in components

## Example Commands

```bash
# Make the app look polished
/ui polish

# Ensure it works great on mobile
/ui mobile

# Improve WCAG accessibility
/ui accessibility

# Refine colors and spacing
/ui style
```

## What Gets Changed

| Item | Status |
|------|--------|
| `src/App.css` | ✅ Modified freely |
| Component JSX layout | ✅ Can improve UX |
| RTL/Arabic display | ✅ Fully supported |
| Animations/transitions | ✅ Can add |
| Mobile responsiveness | ✅ Optimized |
| Dark mode | ✅ Enhanced |
| Form inputs | ✅ Improved |

## Related Documentation

- [RULES.md](RULES.md) — Styling constraints and CSS rules
- [AGENTS-CLI.md](../../AGENTS-CLI.md) — CLI commands
- [CLAUDE.md](../../CLAUDE.md) — Project guidelines
- [TECHNICAL.md](../../TECHNICAL.md) — Architecture
