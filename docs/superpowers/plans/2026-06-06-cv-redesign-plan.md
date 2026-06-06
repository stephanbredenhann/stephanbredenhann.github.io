# CV Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Subtle UI refresh — centered hero, badge-based skills, mobile hover fix, section reorder.

**Architecture:** Three-file static site (index.html, style.css, main.js). CSS-only mobile fix via `@media (hover: hover)`. No new dependencies. No JS changes.

**Tech Stack:** HTML, CSS (custom properties), vanilla JS

---

### Task 1: Reorder sections — Projects after Education

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Move Projects section block**

Delete lines 260–297 (the entire `<section id="projects">` block) from its current position after Skills and insert it after the Education section closing tag (after line 229).

The HTML to move:

```html
            <section id="projects" class="flow section" aria-labelledby="projects-heading">
                <h2 id="projects-heading" class="section-title">Projects</h2>
                <div class="cards">
                    <article class="card">
                        <h3 class="card__title">ADS‑B flight tracker (South Africa)</h3>
                        <p>
                            Live aircraft on a map using public ADS‑B data, built with Angular and Leaflet and hosted on GitHub Pages.
                            Coverage centred on South Africa with presets for Pretoria, Johannesburg, and Cape Town.
                        </p>
                        <p>
                            <a href="radar/index.html">Open the app</a>
                            <span aria-hidden="true"> · </span>
                            <a
                                href="https://github.com/stephanbredenhann/Radar---South-Africa-ADS-B-Radar"
                                target="_blank"
                                rel="noopener noreferrer"
                            >Source code</a>
                        </p>
                    </article>
                    <article class="card">
                        <h3 class="card__title">Community Road Paving Crowdfunding Platform</h3>
                        <p>
                            Full-stack web app enabling residents to collectively fund road paving by purchasing
                            1&nbsp;m&sup2; sections via an interactive map. Tracks construction progress in real time
                            with role-based access for buyers and administrators. The project currently serves as a proof of concept for a real-world application.
                        </p>
                        <p>
                            <a href="https://diamantlaan-sb.azurewebsites.net/" target="_blank" rel="noopener noreferrer">Open the app</a>
                            <span aria-hidden="true"> · </span>
                            <a
                                href="https://github.com/stephanbredenhann/Diamant-Laan-Projek"
                                target="_blank"
                                rel="noopener noreferrer"
                            >Source code</a>
                        </p>
                    </article>
                </div>
            </section>
```

Resulting section order in the `<div class="layout">` block:
1. `#experience`
2. `#education`
3. `#projects`
4. `#skills`
5. `#contact`

- [ ] **Step 2: Verify section order in browser**

Open `index.html` in a browser and confirm the sections appear in the new order: Hero → Experience → Education → Projects → Skills → Contact. Nav links should still work (they use `id` anchors, so they self-repair).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "reorder: move Projects section after Education"
```

---

### Task 2: Rewrite Skills section HTML

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the Skills section**

Replace the entire `<section id="skills">` block (currently lines 231–258 in the original) with:

```html
            <section id="skills" class="flow section" aria-labelledby="skills-heading">
                <h2 id="skills-heading" class="section-title">Skills</h2>
                <div class="cards">
                    <article class="card card--skills">
                        <h3 class="card__title card__title--skills">Technical Skills</h3>
                        <div class="skills-cat">
                            <span class="skills-cat__label">Languages</span>
                            <div class="skills-cat__badges">
                                <span class="skill-badge skill-badge--lang">Python</span>
                                <span class="skill-badge skill-badge--lang">JavaScript</span>
                                <span class="skill-badge skill-badge--lang">HTML &amp; CSS</span>
                                <span class="skill-badge skill-badge--lang">C++</span>
                                <span class="skill-badge skill-badge--lang">C#</span>
                            </div>
                        </div>
                        <div class="skills-cat">
                            <span class="skills-cat__label">Web &amp; Development</span>
                            <div class="skills-cat__badges">
                                <span class="skill-badge skill-badge--web">Front-End</span>
                                <span class="skill-badge skill-badge--web">Responsive Design</span>
                                <span class="skill-badge skill-badge--web">OOP</span>
                                <span class="skill-badge skill-badge--web">Debugging</span>
                            </div>
                        </div>
                        <div class="skills-cat">
                            <span class="skills-cat__label">Tools &amp; Systems</span>
                            <div class="skills-cat__badges">
                                <span class="skill-badge skill-badge--tools">Git &amp; GitHub</span>
                                <span class="skill-badge skill-badge--tools">Linux</span>
                                <span class="skill-badge skill-badge--tools">Windows</span>
                                <span class="skill-badge skill-badge--tools">RDBMS</span>
                                <span class="skill-badge skill-badge--tools">UML</span>
                                <span class="skill-badge skill-badge--tools">Systems Design</span>
                            </div>
                        </div>
                    </article>
                    <article class="card card--skills card--skills-soft">
                        <h3 class="card__title card__title--skills-soft">Soft Skills</h3>
                        <div class="skills-cat__badges">
                            <span class="skill-badge skill-badge--soft">Communication</span>
                            <span class="skill-badge skill-badge--soft">Teamwork</span>
                            <span class="skill-badge skill-badge--soft">Problem Solving</span>
                            <span class="skill-badge skill-badge--soft">Adaptability</span>
                            <span class="skill-badge skill-badge--soft">Time Management</span>
                        </div>
                    </article>
                </div>
            </section>
```

- [ ] **Step 2: Verify in browser**

Open `index.html` and confirm the skills section renders (badges won't be styled yet — that's Task 3). Confirm the HTML structure is valid and no elements are malformed.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: replace skills section with badge-based layout"
```

---

### Task 3: Add badge CSS styles

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add badge styles**

Insert the following block after the existing `.label::after` rule (after line 782):

```css
/* ----- Skills badges ----- */

.skills-cat {
    margin-bottom: 1rem;
}

.skills-cat:last-child {
    margin-bottom: 0;
}

.skills-cat__label {
    display: block;
    margin-bottom: 0.45rem;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--blue);
}

.skills-cat__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.skill-badge {
    display: inline-block;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
    color: inherit;
    cursor: default;
    user-select: none;
    transition: transform 0.15s ease;
}

@media (hover: hover) {
    .skill-badge:hover {
        transform: translateY(-1px);
    }
}

.skill-badge--lang {
    background: rgba(11, 74, 138, 0.1);
    color: var(--blue);
}

.skill-badge--web {
    background: rgba(11, 74, 138, 0.07);
    color: rgba(11, 74, 138, 0.85);
}

.skill-badge--tools {
    background: var(--wash-navy);
    color: var(--navy);
}

.skill-badge--soft {
    background: transparent;
    color: var(--gold);
    border: 1.5px solid rgba(184, 161, 101, 0.4);
}
```

- [ ] **Step 2: Verify in browser**

Open in browser at both narrow and wide viewports. Badges should flow and wrap nicely. Soft skill badges should have outlined style. Tech badges should be filled with category tints.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add skills badge CSS styles"
```

---

### Task 4: Add dark mode badge variants

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Insert dark mode overrides**

Insert the following block after the badge styles added in Task 3:

```css
:root[data-theme="dark"] .skill-badge--lang {
    background: rgba(11, 74, 138, 0.22);
}

:root[data-theme="dark"] .skill-badge--web {
    background: rgba(11, 74, 138, 0.16);
}

:root[data-theme="dark"] .skill-badge--tools {
    background: rgba(255, 255, 255, 0.06);
    color: #d0d4e0;
}

:root[data-theme="dark"] .skill-badge--soft {
    border-color: rgba(184, 161, 101, 0.5);
}
```

- [ ] **Step 2: Verify in dark mode**

Open the site, toggle to dark mode. Confirm all badge colors are legible:
- Language badges: deeper blue bg, light text
- Web badges: slightly lighter blue bg
- Tools badges: light bg, light text
- Soft badges: stronger gold border

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add dark mode badge color variants"
```

---

### Task 5: Update Hero to centered layout + scroll indicator

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: Add scroll indicator HTML**

After the closing `</ul>` of `.hero__links` (after line 135), add:

```html
                        <div class="hero__scroll" aria-hidden="true">
                            <span class="hero__scroll-chevron"></span>
                        </div>
```

- [ ] **Step 2: Update hero CSS for centered layout**

**Remove** the two-column grid at `.hero__inner` (lines 442–451). Replace with:

```css
.hero__inner {
    max-width: var(--wide-max);
    margin-inline: auto;
    padding: clamp(2.75rem, 8vw, 4.5rem) var(--space-md) clamp(2.25rem, 6vw, 3.5rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: clamp(2rem, 5vw, 3.25rem);
    width: 100%;
}
```

**Remove** the mobile media query overrides for `.hero__inner`, `.hero__eyebrow::after`, `.hero__tagline`, `.hero__links`, and `.hero__art` at lines 642–664 that handle the two-column-to-stacked switch. Replace with:

```css
@media (max-width: 860px) {
    .hero__art {
        order: -1;
    }
}
```

**Update** `.hero__eyebrow::after` to always center (remove the left-anchored version). Replace lines 507–518:

```css
.hero__eyebrow::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 2.75rem;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--blue), var(--gold));
    transform: translateX(-50%);
}
```

**Update** `.hero__tagline` to always center (lines 535–542). Change `max-width: 36ch` to:

```css
.hero__tagline {
    margin: 0 auto var(--space-md);
    max-width: 36ch;
    font-size: clamp(1.02rem, 2.2vw, 1.12rem);
    line-height: 1.55;
    color: var(--text);
    opacity: 0.94;
}
```

**Update** `.hero__links` to always justify center (lines 565–572). Change `justify-content` from left-aligned default to:

```css
.hero__links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem 0.75rem;
}
```

- [ ] **Step 3: Add scroll indicator CSS**

Add new block after `.hero__link:focus-visible` rule (after line 622):

```css
.hero__scroll {
    margin-top: var(--space-md);
    display: flex;
    justify-content: center;
    opacity: 0.5;
}

.hero__scroll-chevron {
    display: block;
    width: 10px;
    height: 10px;
    border-right: 2px solid var(--gold);
    border-bottom: 2px solid var(--gold);
    transform: rotate(45deg);
}

@media (prefers-reduced-motion: no-preference) {
    .hero__scroll {
        animation: scroll-bounce 2s ease-in-out infinite;
    }
}

@keyframes scroll-bounce {
    0%, 100% {
        transform: translateY(0);
        opacity: 0.5;
    }
    50% {
        transform: translateY(6px);
        opacity: 0.8;
    }
}
```

- [ ] **Step 4: Verify in browser**

Confirm hero is centered at all viewports. The SVG art should appear above the text on all screens. The scroll chevron should gently bounce. Toggle dark mode — hero background and gradients should still work.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "feat: center hero layout, add scroll indicator"
```

---

### Task 6: Mobile hover fix — wrap all hover rules

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Wrap card hover in @media (hover: hover)**

Replace lines 743–748:

```css
@media (hover: hover) {
    .card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow);
        border-color: var(--gold);
    }
}

.card:active {
    transform: scale(0.98);
}
```

- [ ] **Step 2: Wrap card title hover**

Replace lines 757–759:

```css
@media (hover: hover) {
    .card:hover .card__title {
        color: var(--gold);
    }
}
```

- [ ] **Step 3: Wrap contact list hover**

Replace lines 819–823:

```css
@media (hover: hover) {
    .contact-list:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow);
        border-color: var(--gold);
    }
}

.contact-list:active {
    transform: scale(0.98);
}
```

- [ ] **Step 4: Wrap contact row icon hover**

Replace lines 843–846:

```css
@media (hover: hover) {
    .contact-row:hover .contact-icon {
        background: var(--wash-gold);
        color: var(--gold);
    }
}
```

- [ ] **Step 5: Wrap hero link hover**

Replace lines 600–605 (the first `.hero__link:hover` block, light mode default):

```css
@media (hover: hover) {
    .hero__link:hover {
        border-color: rgba(11, 74, 138, 0.55);
        color: var(--text);
        background: rgba(255, 255, 255, 0.88);
        box-shadow: 0 2px 14px rgba(26, 26, 46, 0.08);
    }
}

.hero__link:active {
    transform: scale(0.97);
}
```

Replace lines 612–617 (dark mode `.hero__link:hover`):

```css
@media (hover: hover) {
    :root[data-theme="dark"] .hero__link:hover {
        color: var(--text);
        background: rgba(22, 22, 42, 0.88);
        border-color: rgba(184, 161, 101, 0.5);
        box-shadow: 0 2px 18px rgba(0, 0, 0, 0.25);
    }
}
```

- [ ] **Step 6: Wrap nav link hover**

Replace lines 366–374:

```css
@media (hover: hover) {
    .site-nav__list a:hover {
        background: rgba(255, 255, 255, 0.09);
        color: #f5ead4;
    }
}

.site-nav__list a:active {
    background: rgba(255, 255, 255, 0.12);
}
```

- [ ] **Step 7: Wrap theme toggle hover**

Replace lines 247–256:

```css
@media (hover: hover) {
    .theme-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #f5ead4;
        border-color: rgba(184, 161, 101, 0.55);
    }
}

.theme-toggle:active {
    transform: scale(0.93);
}
```

Replace lines 253–256 (dark mode toggle hover):

```css
@media (hover: hover) {
    :root[data-theme="dark"] .theme-toggle:hover {
        color: var(--navy);
        background: rgba(184, 161, 101, 0.88);
    }
}
```

- [ ] **Step 8: Wrap nav toggle button hover**

Replace lines 300–309:

```css
@media (hover: hover) {
    .site-nav__toggle:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #f5ead4;
        border-color: rgba(184, 161, 101, 0.55);
    }
}

.site-nav__toggle:active {
    transform: scale(0.93);
}
```

Replace lines 306–308 (dark mode toggle hover):

```css
@media (hover: hover) {
    :root[data-theme="dark"] .site-nav__toggle:hover {
        color: var(--navy);
        background: rgba(184, 161, 101, 0.88);
    }
}
```

- [ ] **Step 9: Verify on mobile**

Open the site in Chrome DevTools with device emulation (touch mode). Tap cards, nav links, theme toggle, hero links — nothing should "stick" in hover state. All elements should have a brief press-down feel from `:active`.

- [ ] **Step 10: Commit**

```bash
git add style.css
git commit -m "fix: wrap hover rules in @media (hover: hover), add :active states"
```

---

### Task 7: Typography & spacing refinements

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Slightly increase body line-height**

Replace line 105:

```css
    line-height: 1.7;
```

- [ ] **Step 2: Verify and commit**

```bash
git add style.css
git commit -m "tune: increase body line-height to 1.7"
```

---

### Task 8: Final verification

- [ ] **Step 1: Full walkthrough**

Open the site and check every section at desktop and mobile widths:
1. Hero — centered, scroll chevron bouncing, links work
2. Experience — cards look correct, hover only with mouse, active works on touch
3. Education — same
4. Projects — now after Education, ADSB card untouched
5. Skills — badges render correctly in both themes, categories flow
6. Contact — icons and links work, hover/active fixed
7. Theme toggle — works in both directions

- [ ] **Step 2: Navigation check**

Click every nav link — each scrolls to the correct section. Mobile hamburger menu opens/closes, links close the menu on tap.

- [ ] **Step 3: Commit if clean**

```bash
git status
# If clean: nothing to commit. If there are tweaks:
git add -A
git commit -m "chore: final verification tweaks"
```
