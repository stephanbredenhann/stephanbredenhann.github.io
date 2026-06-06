# CV Website Redesign — Design Spec

**Date:** 2026-06-06  
**Scope:** Subtle UI refresh with skills section overhaul and mobile interactivity fixes

---

## Summary

Refine the single-page CV website design while preserving the existing navy (`#1a1a2e`), gold (`#b8a165`), and blue (`#0b4a8a`) color palette. The ADSB flight tracker section remains untouched. Primary focus: declutter the skills section with a badge-based layout, fix sticky hover on touch devices, and reorder sections.

---

## Section Order (new)

1. Hero (Landing)
2. Experience
3. Education
4. **Projects** (moved up from after Skills)
5. Skills
6. Contact

---

## 1. Hero — Centered with Scroll Hint

- Keep the glass card (`hero__copy-surface`) but center the content
- SVG art above the text (already orders on mobile), keep existing SVG
- Remove two-column grid; single centered column at all breakpoints
- Add a subtle "Scroll" indicator below the links: small downward arrow or chevron in `--gold` at low opacity, with a gentle bounce animation
- Same eyebrow, title, tagline, and social pill links — just centered
- Remove the `hero__eyebrow::after` underline pseudo-element (or keep it centered as currently on mobile)

### CSS changes
- `.hero__inner`: single column, `text-align: center`, no `grid-template-columns`
- `.hero__copy-surface`: centered text alignment
- `.hero__links`: `justify-content: center`
- `.hero__tagline`: keep `margin-inline: auto`
- New element: scroll-down indicator (HTML + CSS)

---

## 2. Skills Section — Badge Cloud (Two-Card Split)

Replace the two text-heavy cards with a cleaner badge-based layout.

### Layout
- Section heading: "Skills" (same `.section-title`)
- **Card 1 — Technical Skills** (heading in blue)
  - Categories with small uppercase labels + colored dot prefix:
    - **Languages** (blue): Python, JavaScript, HTML & CSS, C++, C#
    - **Web & Development** (blue): Front-End, Responsive Design, OOP, Debugging
    - **Tools & Systems** (neutral/navy): Git & GitHub, Linux, Windows, RDBMS, UML, Systems Design
  - Each skill is a filled pill badge (`border-radius: 999px`)
  - Language badges: `rgba(11,74,138,0.1)` background, blue text
  - Web/Dev badges: slightly lighter blue tint
  - Tools badges: `rgba(26,26,46,0.06)` background, navy text (dark mode: light bg, light text)

- **Card 2 — Soft Skills** (heading in gold)
  - Flat list of outlined pill badges in gold
  - `border: 1.5px solid rgba(184,161,101,0.4)`, gold text, transparent background
  - Skills: Communication, Teamwork, Problem Solving, Adaptability, Time Management

### Badge styling
- `padding: 0.25rem 0.7rem`, `font-weight: 600`, `font-size: 0.78rem`
- Subtle hover lift (`translateY(-1px)`) — only in `@media (hover: hover)`
- Wrap in flex container with `gap: 0.4rem`, `flex-wrap: wrap`
- Category labels: `font-size: 0.68rem`, `letter-spacing: 0.12em`, uppercase, bold

### Dark mode
- Language badges: deeper blue background (`rgba(11,74,138,0.22)`)
- Web/Dev badges: slightly lighter (`rgba(11,74,138,0.16)`)
- Tools badges: light background (`rgba(255,255,255,0.06)`), light text
- Soft skill badges: stronger gold border (`rgba(184,161,101,0.5)`)

---

## 3. Mobile Hover Fix — All Interactive Elements

**Problem:** `:hover` effects persist on touch devices after a tap, causing cards to stay lifted/discolored.

**Fix:** Wrap all `:hover` rules in `@media (hover: hover) { ... }`. Add `:active` states for all devices.

### Elements to fix
| Element | Current hover behavior | New active behavior |
|---|---|---|
| `.card` | `translateY(-3px)`, shadow + border color change | `transform: scale(0.98)` |
| `.card__title` (inside `.card:hover`) | Color changes to gold | Same, but scoped to `@media (hover: hover)` |
| `.contact-list` | Same as `.card` | `transform: scale(0.98)` |
| `.contact-row:hover .contact-icon` | Background/color change | Active state feedback |
| `.hero__link` | Border, background, shadow changes | Brief scale-down |
| `.site-nav__list a:hover` | Background, color change | Active background flash |
| `.theme-toggle:hover` | Background, color changes | Scale-down on tap |
| `.site-nav__toggle:hover` | Background, color changes | Scale-down on tap |

### Implementation
- All `:hover` rules that change `transform`, `box-shadow`, `border-color`, `background-color`, or `color` get wrapped in `@media (hover: hover)`
- Add `:active` rules with `transform: scale(0.98)` and `transition` where appropriate
- This is **CSS-only**, no JavaScript changes

---

## 4. Other Sections — Minimal Changes

### Experience, Education, Projects, Contact
- Keep current HTML structure and layout
- Apply mobile hover fix to their cards
- Section order change: Projects moves between Education and Skills
- No visual redesign beyond the hover fix

### ADSB Section (Projects card #1)
- **Untouched.** No changes to content or styling.

---

## 5. Typography & Spacing Tuning

- Body `line-height`: `1.65` → `1.7` (slightly airier)
- Section vertical rhythm: consistent `padding-block` values
- `.card` top-level padding: already good at `var(--space-lg)`

---

## Implementation Plan

1. **HTML (`index.html`):**
   - Rewrite skills section with badge markup
   - Move projects section after education
   - Update hero to centered layout + add scroll indicator
2. **CSS (`style.css`):**
   - Replace skills `.card` content styles with badge styles
   - Wrap hover rules in `@media (hover: hover)`
   - Add `:active` states
   - Update hero to centered layout
   - Add dark mode badge variants
3. **JS (`main.js`):**
   - No changes needed (unless scroll indicator needs JS animation — keep it CSS-only)

---

## Non-Goals

- No changes to the ADSB flight tracker section
- No changes to the color palette
- No JavaScript refactoring
- No new dependencies or libraries
- No changes to theme toggle or navigation logic
