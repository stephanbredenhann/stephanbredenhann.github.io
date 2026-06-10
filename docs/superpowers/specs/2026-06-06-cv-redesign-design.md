# CV Redesign — "Warm Personal"

**Date:** 2026-06-06
**Status:** Approved

## Overview

Complete redesign of the single-page CV at `index.html`. Replaces the current navy+gold scheme with a warm, personal aesthetic that focuses on handwritten typography, floating particles, scroll-triggered animations, and a cozy cream+gold+amber palette. The page should feel "alive" through subtle continuous motion and reactive scroll behavior.

## Design System

### Colors

| Role | Light Mode | Dark Mode |
|------|-----------|-----------|
| Background | `#FAFAF5` | `#1C1410` |
| Surface / Card | `#FFFFFF` | `#2A1F18` |
| Text | `#1C1917` | `#F0E6D8` |
| Muted Text | `#78716C` | `#A89F94` |
| Heading | `#92400E` | `#D4A853` |
| Gold Accent | `#B8A165` | `#B8A165` |
| Gold Light | `#D6B85A` | `#D6B85A` |
| Border (light) | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.08)` |
| Border (gold) | `rgba(184,161,101,0.25)` | `rgba(184,161,101,0.25)` |

### Typography

- **Headings (name, section titles):** Caveat — Google Fonts, weights 400-700
- **Body:** Quicksand — Google Fonts, weights 300-700
- **CSS import:** `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Quicksand:wght@300..700&display=swap');`
- Font stack: `--font-hand: 'Caveat', cursive; --font-body: 'Quicksand', sans-serif;`
- System fallback: `system-ui, -apple-system, sans-serif` for body

### Dark Mode Toggle

- Preserved from current site
- Uses `data-theme` attribute on `<html>` and `localStorage` key `sb-theme`
- Default: follows system `prefers-color-scheme`, then dark
- Meta theme-color updates accordingly

## Page Structure

### 1. Header / Nav
- Sticky floating pill-style nav, centered, sits at top with slight margin
- Links: Home, Experience, Education, Projects, Skills, Contact
- Active section highlighting on scroll (Intersection Observer)
- Dark/light toggle button inside the pill
- Mobile: hamburger menu, opens full-width dropdown
- Gold border, transparent background with backdrop-blur

### 2. Hero Section (`#landing`)
- Full viewport (min-height: 85vh), centered content
- Canvas background layer with ~30 floating golden/cream particles
- Content layers:
  - Eyebrow: "Portfolio & CV" in small uppercase pill
  - Name: "Stephan Bredenhann" — character-stagger fade-in (or CSS stroke-dashoffset SVG animation) in Caveat
  - Tagline: "Third-year BIT · Information Science · University of Pretoria"
  - Social links: GitHub + LinkedIn as small pill buttons
  - Scroll-down chevron indicator (animated bounce)
- On load: staggered entrance animation for content
- Particles continuously animate via requestAnimationFrame
- Respects `prefers-reduced-motion`: particles static, no stagger

### 3. Experience Section (`#experience`)
- **Layout:** Vertical timeline along left-aligned gold gradient line
- Each entry: gold dot on timeline, card to the right with role/dates/description
- Entries (in reverse chronological order):
  1. **Tutor, Information Science Department** — University of Pretoria, Feb 2025 – Nov 2025. Tutored INL 110 and INL 120.
  2. **Part-Time Bartender** — Buffelsfontein Beesboerdery, Mar 2024 – Present
  3. **Various Hospitality Roles** — Seasonal/Holiday Staff, 2020 – Present
- Section title "Experience" in Caveat with hand-drawn underline (SVG stroke-dashoffset animation on scroll-into-view)

### 4. Education Section (`#education`)
- **Layout:** Same timeline style as Experience, gold line continues
- Entries:
  1. **BIT (Information Science)** — University of Pretoria, 2024 – 2026. 1st Year: 76%, 2nd Year: 71%
  2. **IEB National Senior Certificate** — 2022, 81% average (3 Distinctions)
- Links to UP website, School of IT, Programme Yearbook preserved

### 5. Projects Section (`#projects`)
- **Layout:** Two-card grid (1 col on mobile)
- Each card: title, description, links (Open app / Source code)
- Cards have subtle hover lift + gold border glow
- Entries: ADS-B Flight Tracker, Road Paving Platform (unchanged)

### 6. Skills Section (`#skills`)
- **Layout:** Two-column card grid (1 col on mobile)
  - Left: Technical Skills with category labels + pill badges
  - Right: Soft Skills with outlined pill badges
- Badges use warm gold-tinted backgrounds
- Subtle hover lift on badges

### 7. Contact Section (`#contact`)
- **Layout:** Single card with contact rows (icon + label + value)
- Rows: Personal email, Academic email, Address, Phone
- Icons use gold tint
- Hover: icon background transitions to gold wash

### 8. Footer
- Dark brown background (`#1C1410` in light, slightly lighter in dark)
- Golden text
- Year auto-updates, GitHub source link, "Hosted on GitHub Pages"

## Animations & Motion

### Floating Particles
- Canvas element positioned behind hero, absolutely positioned
- ~30 small circles (radius 1-3px) in warm colors (gold, cream, amber)
- Each has random position, velocity, opacity, and size
- Drift slowly upward/random, wrap around when off-screen
- Low opacity (0.15-0.4) so they don't distract
- Paused when `prefers-reduced-motion: reduce`

### Name Writing Animation
- On page load / hero entry, "Stephan Bredenhann" characters appear one by one
- Implementation: CSS animation with staggered `animation-delay` per character (wrapping each char in a `<span>`)
- 50-80ms stagger per character
- Fade + slight translateY (4px → 0)
- Total duration: ~1.5s for full name

### Scroll Reveals
- Sections use `IntersectionObserver` with `threshold: 0.15`
- On entry: elements get class `is-visible` triggering CSS transition
- `opacity: 0; transform: translateY(24px)` → `opacity: 1; transform: translateY(0)`
- Staggered delays for cards within sections
- Duration: 600ms, ease-out

### Hand-Drawn Underlines
- Section titles have an inline SVG underline below them
- SVG `<path>` with stroke-dasharray/stroke-dashoffset
- On scroll-into-view: animate stroke-dashoffset from full length to 0
- Looks like it's being drawn by hand
- Duration: 800ms

### Timeline Animation
- Timeline dots and connecting line animate on scroll-into-view
- Line draws from top to bottom (height animation or clip-path)
- Dots pop in sequentially with stagger

### Hover Effects
- Cards: translateY(-3px) + box-shadow increase + gold border, 200ms ease
- Badges: translateY(-1px), 150ms ease
- Links: color shift to gold, 200ms transition
- Nav pill links: gold background highlight on hover

## Accessibility

- Skip-to-content link preserved
- All interactive elements: `cursor: pointer`, visible `:focus-visible` ring (gold outline)
- ARIA labels on nav, theme toggle, social links
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<address>`, `<footer>`
- All `prefers-reduced-motion` respected: disable particles, disable scroll reveals, instant transitions
- Sufficient color contrast (4.5:1 minimum for text)
- Meta viewport + responsive breakpoints

## Responsive Breakpoints

- **Mobile (<768px):** Single column, nav becomes hamburger, timeline aligns left, full-width cards, reduced particle count
- **Tablet (768-1024px):** Comfortable reading width, timeline with more spacing
- **Desktop (>1024px):** Max content width ~42rem, centered, wider timeline, two-column project/skill cards

## Technical Approach

- **Stack:** Vanilla HTML + CSS + JS (no frameworks, consistent with current GitHub Pages setup)
- **Single file:** All in `index.html`, `style.css`, `main.js`
- **Google Fonts:** Caveat + Quicksand via `<link>` in `<head>`
- **Canvas:** Separate `<canvas>` element for particles, managed in JS
- **IntersectionObserver:** For scroll reveals, active nav highlighting, underline animations
- **localStorage:** For theme preference (`sb-theme` key, preserved)
- **No external dependencies** beyond Google Fonts

## File Changes

| File | Action | Notes |
|------|--------|-------|
| `index.html` | Rewrite | Complete HTML restructure |
| `style.css` | Rewrite | New warm palette, Caveat/Quicksand, animations |
| `main.js` | Rewrite | Particles, scroll reveals, name animation, theme toggle, nav |

## Content Changes

- **Added:** Tutoring role at UP Info Science Dept (INL 110 & 120, Feb–Nov 2025) under Experience
- All other content preserved from current CV
