# CV Redesign — "Warm Personal" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the single-page CV with a warm cream+gold palette, Caveat/Quicksand fonts, floating canvas particles, staggered name reveal, timeline layouts for Experience/Education, scroll-triggered reveals, and preserved dark/light toggle.

**Architecture:** Three-file vanilla stack (index.html, style.css, main.js). All design tokens in CSS custom properties with `[data-theme="dark"]` overrides. Canvas particles and IntersectionObserver-driven animations in JS. No frameworks, no dependencies beyond Google Fonts.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, grid, flexbox, keyframes), Vanilla JS (Canvas API, IntersectionObserver, localStorage)

---

### Task 1: Rewrite `index.html` — head section with Google Fonts and theme init

**Files:**
- Rewrite: `index.html`

- [ ] **Step 1: Write the complete head and opening body tags**

Replace the entire contents of `index.html` with the head section including Google Fonts link and theme initialization:

```html
<!DOCTYPE html>
<html lang="en-ZA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Stephan Bredenhann — CV</title>

    <meta name="description" content="Third-year BIT student (Information Science) at the University of Pretoria. CV and contact details.">
    <meta name="theme-color" content="#FAFAF5">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Quicksand:wght@300..700&display=swap" rel="stylesheet">

    <script>
        (function () {
            try {
                var k = "sb-theme";
                var s = localStorage.getItem(k);
                var dark = s ? s === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
                document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
                document.documentElement.style.colorScheme = dark ? "dark" : "light";
                var meta = document.querySelector('meta[name="theme-color"]');
                if (meta) meta.content = dark ? "#1C1410" : "#FAFAF5";
            } catch (e) {}
        })();
    </script>

    <meta property="og:type" content="website">
    <meta property="og:title" content="Stephan Bredenhann">
    <meta property="og:description" content="Third-year BIT student (Information Science) at the University of Pretoria.">
    <meta property="og:url" content="https://stephanbredenhann.github.io/">
    <meta property="og:image" content="https://stephanbredenhann.github.io/preview.png">

    <link rel="canonical" href="https://stephanbredenhann.github.io/">
    <link rel="icon" href="icon.png" type="image/png">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <a class="skip-link" href="#main">Skip to content</a>
```

- [ ] **Step 2: Verify the file exists with correct head**

Run: `head -5 index.html`
Expected: Shows `<!DOCTYPE html>` followed by `<html lang="en-ZA">` and `<head>`

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add head section with Caveat/Quicksand fonts and theme init"
```

---

### Task 2: Write `style.css` — custom properties, reset, and typography foundation

**Files:**
- Rewrite: `style.css`

- [ ] **Step 1: Write the complete CSS foundation (custom properties, reset, typography)**

Replace the entire contents of `style.css`:

```css
:root {
    color-scheme: light;

    --bg: #FAFAF5;
    --surface: #FFFFFF;
    --text: #1C1917;
    --muted: #78716C;
    --heading: #92400E;
    --gold: #B8A165;
    --gold-light: #D6B85A;
    --gold-wash: rgba(184, 161, 101, 0.12);
    --gold-border: rgba(184, 161, 101, 0.25);
    --hairline: rgba(0, 0, 0, 0.06);
    --hairline-strong: rgba(0, 0, 0, 0.1);
    --nav-bg: rgba(255, 255, 255, 0.72);
    --footer-bg: #1C1410;
    --footer-text: #D4A853;

    --font-hand: 'Caveat', cursive;
    --font-body: 'Quicksand', sans-serif;

    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;

    --space-xs: 0.35rem;
    --space-sm: 0.75rem;
    --space-md: 1.25rem;
    --space-lg: 2rem;
    --space-xl: clamp(2.5rem, 6vw, 4rem);

    --content-max: 42rem;
    --header-h: 3.5rem;

    --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04);
    --shadow-md: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 2px 4px rgba(0, 0, 0, 0.04), 0 16px 40px rgba(0, 0, 0, 0.08);

    --focus-ring: 2px solid var(--gold);
    --focus-offset: 3px;
}

:root[data-theme="dark"] {
    color-scheme: dark;

    --bg: #1C1410;
    --surface: #2A1F18;
    --text: #F0E6D8;
    --muted: #A89F94;
    --heading: #D4A853;
    --gold-wash: rgba(184, 161, 101, 0.1);
    --gold-border: rgba(184, 161, 101, 0.25);
    --hairline: rgba(255, 255, 255, 0.08);
    --hairline-strong: rgba(255, 255, 255, 0.12);
    --nav-bg: rgba(28, 20, 16, 0.82);
    --footer-bg: #120E0A;
    --footer-text: #D4A853;

    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 1px 2px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.25);
    --shadow-lg: 0 2px 4px rgba(0, 0, 0, 0.25), 0 16px 40px rgba(0, 0, 0, 0.3);
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
    html {
        scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

body {
    margin: 0;
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.7;
    color: var(--text);
    background-color: var(--bg);
    transition: background-color 0.4s ease, color 0.4s ease;
}

body.nav-open {
    overflow: hidden;
}

:focus {
    outline: none;
}

:focus-visible {
    outline: var(--focus-ring);
    outline-offset: var(--focus-offset);
}

img,
svg {
    display: block;
    max-width: 100%;
}

a {
    color: inherit;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.18em;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.muted {
    color: var(--muted);
    font-size: 0.95rem;
}

.flow > * + * {
    margin-top: var(--space-md);
}

.icon {
    width: 1.15em;
    height: 1.15em;
    flex-shrink: 0;
}

.skip-link {
    position: absolute;
    left: var(--space-sm);
    top: var(--space-sm);
    z-index: 2000;
    padding: 0.5rem 1rem;
    background: var(--gold);
    color: #1C1917;
    font-weight: 600;
    border-radius: var(--radius-sm);
    transform: translateY(-160%);
    transition: transform 0.2s var(--ease-out);
    text-decoration: none;
}

.skip-link:focus-visible {
    transform: translateY(0);
}
```

- [ ] **Step 2: Verify CSS loaded correctly**

Run: `head -3 style.css`
Expected: `:root {`

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add CSS foundation — warm palette, reset, typography"
```

---

### Task 3: Add navigation HTML to `index.html` and nav CSS to `style.css`

**Files:**
- Modify: `index.html` (append after skip-link, before `<main>`)
- Modify: `style.css` (append nav styles)

- [ ] **Step 1: Append navigation HTML to `index.html`**

Add after the skip-link line and before `<main id="main">`:

```html
    <header class="site-header">
        <nav class="site-nav" id="site-nav" aria-label="Primary">
            <div class="site-nav__inner">
                <ul id="site-nav-menu" class="site-nav__list" data-nav-menu>
                    <li><a href="#landing">Home</a></li>
                    <li><a href="#experience">Experience</a></li>
                    <li><a href="#education">Education</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#skills">Skills</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <button
                    type="button"
                    class="theme-toggle"
                    data-theme-toggle
                    aria-pressed="false"
                    aria-label="Switch to dark mode"
                    title="Switch to dark mode"
                >
                    <svg class="icon theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.45 5.45 0 0 1-5.86-5 5.39 5.39 0 0 1 3.24-5.2c-.44-.06-.9-.1-1.36-.1Z"/>
                    </svg>
                    <svg class="icon theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>
                        <path fill="none" d="M12 2.25v2.5M12 19.25v2.5M2.25 12h2.5M19.25 12h2.5M5.4 5.4l1.77 1.77M16.83 16.83l1.77 1.77M18.6 5.4l-1.77 1.77M7.4 16.83l-1.77 1.77"/>
                    </svg>
                </button>
                <button
                    type="button"
                    class="site-nav__toggle"
                    aria-expanded="false"
                    aria-controls="site-nav-menu"
                    data-nav-toggle
                >
                    <span class="site-nav__toggle-box" aria-hidden="true">
                        <span class="site-nav__toggle-line"></span>
                        <span class="site-nav__toggle-line"></span>
                        <span class="site-nav__toggle-line"></span>
                    </span>
                    <span class="visually-hidden">Menu</span>
                </button>
            </div>
        </nav>
    </header>
```

- [ ] **Step 2: Append nav CSS to `style.css`**

Append after the `.skip-link` block:

```css
.site-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 0.5rem var(--space-md);
}

.site-nav {
    max-width: var(--content-max);
    margin-inline: auto;
    background: var(--nav-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--gold-border);
    border-radius: 999px;
    box-shadow: var(--shadow-md);
    transition: background-color 0.4s ease, border-color 0.4s ease;
}

.site-nav__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 2.75rem;
    padding-inline: 0.5rem;
    gap: 0.5rem;
}

.site-nav__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 0.15rem;
}

.site-nav__list a {
    display: block;
    padding: 0.4rem 0.7rem;
    color: var(--muted);
    text-decoration: none;
    border-radius: 999px;
    font-size: 0.88rem;
    font-weight: 600;
    transition: background-color 0.2s ease, color 0.2s ease;
}

@media (hover: hover) {
    .site-nav__list a:hover {
        background: var(--gold-wash);
        color: var(--heading);
    }
}

.site-nav__list a.active {
    background: var(--gold-wash);
    color: var(--heading);
}

.site-nav__list a:focus-visible {
    background: var(--gold-wash);
    color: var(--heading);
}

.theme-toggle {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
}

@media (hover: hover) {
    .theme-toggle:hover {
        background: var(--gold-wash);
        color: var(--gold);
    }
}

.theme-toggle:focus-visible {
    outline: var(--focus-ring);
    outline-offset: var(--focus-offset);
}

.theme-toggle__icon {
    width: 1.15rem;
    height: 1.15rem;
    display: none;
}

.theme-toggle__icon--moon { display: block; }
.theme-toggle__icon--sun { display: none; }

:root[data-theme="dark"] .theme-toggle__icon--moon { display: none; }
:root[data-theme="dark"] .theme-toggle__icon--sun { display: block; }

.site-nav__toggle {
    display: none;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    place-items: center;
    transition: background-color 0.2s ease, color 0.2s ease;
}

@media (hover: hover) {
    .site-nav__toggle:hover {
        background: var(--gold-wash);
        color: var(--gold);
    }
}

.site-nav__toggle:focus-visible {
    outline: var(--focus-ring);
    outline-offset: var(--focus-offset);
}

.site-nav__toggle-box {
    display: grid;
    gap: 5px;
    width: 1.25rem;
}

.site-nav__toggle-line {
    display: block;
    height: 2px;
    background: currentColor;
    border-radius: 1px;
    transition: transform 0.25s var(--ease-out), opacity 0.2s ease;
}

.site-nav.is-open .site-nav__toggle-line:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}
.site-nav.is-open .site-nav__toggle-line:nth-child(2) {
    opacity: 0;
}
.site-nav.is-open .site-nav__toggle-line:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html style.css
git commit -m "feat: add floating pill nav with theme toggle and hamburger"
```

---

### Task 4: Add Hero section HTML to `index.html` and Hero CSS to `style.css`

**Files:**
- Modify: `index.html` (add `<main>` with hero section after nav)
- Modify: `style.css` (append hero styles)

- [ ] **Step 1: Add hero HTML (including `<main>` wrapper and canvas)**

Add after `</header>`:

```html
    <main id="main">
        <section id="landing" class="hero" aria-labelledby="hero-heading">
            <canvas class="hero__canvas" aria-hidden="true" data-particle-canvas></canvas>
            <div class="hero__inner">
                <div class="hero__copy">
                    <p class="hero__eyebrow">Portfolio &amp; CV</p>
                    <h1 id="hero-heading" class="hero__title" data-name-reveal>Stephan Bredenhann</h1>
                    <p class="hero__tagline">
                        Third-year BIT &middot; Information Science &middot; University of Pretoria
                    </p>
                    <ul class="hero__links" aria-label="Social links">
                        <li>
                            <a class="hero__link" href="https://github.com/stephanbredenhann" target="_blank" rel="noopener noreferrer me">
                                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.5 3.58 10.15 8.55 11.8.63.12.86-.27.86-.6 0-.3-.01-1.12-.01-2.2-3.48.76-4.22-1.68-4.22-1.68-.57-1.45-1.4-1.84-1.4-1.84-1.14-.78.09-.76.09-.76 1.26.09 1.93 1.3 1.93 1.3 1.12 1.92 2.94 1.37 3.65 1.05.11-.83.44-1.37.8-1.68-2.78-.32-5.7-1.39-5.7-6.18 0-1.37.49-2.49 1.29-3.37-.13-.32-.56-1.61.12-3.36 0 0 1.05-.34 3.44 1.29a12 12 0 0 1 3.12-.42c1.06 0 2.12.14 3.12.42 2.39-1.63 3.44-1.29 3.44-1.29.68 1.75.25 3.04.12 3.36.8.88 1.29 2 1.29 3.37 0 4.8-2.93 5.85-5.73 6.16.45.39.85 1.15.85 2.32 0 1.68-.02 3.03-.02 3.44 0 .33.23.73.88.6A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a class="hero__link" href="https://linkedin.com/in/stephan-bredenhann-a67803326" target="_blank" rel="noopener noreferrer me">
                                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.31 2.4 4.31 5.52v6.22ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.11 20.45H3.56V9h3.55v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.2.79 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>
                                LinkedIn
                            </a>
                        </li>
                    </ul>
                    <div class="hero__scroll" aria-hidden="true">
                        <span class="hero__scroll-chevron"></span>
                    </div>
                </div>
            </div>
        </section>
```

- [ ] **Step 2: Append hero CSS to `style.css`**

Append:

```css
.hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    min-height: min(90vh, 44rem);
    display: flex;
    align-items: center;
    background: linear-gradient(180deg, var(--bg) 0%, rgba(184, 161, 101, 0.05) 50%, var(--bg) 100%);
    transition: background 0.4s ease;
}

.hero__canvas {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
}

.hero__inner {
    position: relative;
    z-index: 1;
    max-width: var(--content-max);
    margin-inline: auto;
    padding: clamp(2.5rem, 8vw, 4rem) var(--space-md) clamp(2rem, 6vw, 3rem);
    width: 100%;
    text-align: center;
}

.hero__eyebrow {
    display: inline-block;
    margin: 0 0 var(--space-sm);
    padding: 0.25rem 0.85rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--heading);
    background: var(--gold-wash);
    border-radius: 999px;
    border: 1px solid var(--gold-border);
}

.hero__title {
    margin: 0 0 var(--space-sm);
    font-family: var(--font-hand);
    font-size: clamp(2.75rem, 7vw, 4rem);
    font-weight: 600;
    line-height: 1.05;
    color: var(--heading);
    transition: color 0.4s ease;
    text-wrap: balance;
}

.hero__title .char {
    display: inline-block;
    opacity: 0;
    transform: translateY(8px);
    animation: char-reveal 0.45s var(--ease-out) forwards;
}

@keyframes char-reveal {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero__tagline {
    margin: 0 auto var(--space-md);
    max-width: 36ch;
    font-size: clamp(1rem, 2.2vw, 1.1rem);
    font-weight: 500;
    line-height: 1.55;
    color: var(--muted);
    opacity: 0.9;
}

.hero__links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
}

.hero__link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.9rem;
    border: 1px solid var(--gold-border);
    border-radius: 999px;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text);
    text-decoration: none;
    background: var(--surface);
    transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
    cursor: pointer;
}

@media (hover: hover) {
    .hero__link:hover {
        border-color: var(--gold);
        color: var(--heading);
        box-shadow: var(--shadow-sm);
    }
}

.hero__link:active {
    transform: scale(0.97);
}

.hero__link:focus-visible {
    outline: var(--focus-ring);
    outline-offset: var(--focus-offset);
}

.hero__scroll {
    margin-top: var(--space-lg);
    display: flex;
    justify-content: center;
    opacity: 0.45;
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
    0%, 100% { transform: translateY(0); opacity: 0.45; }
    50% { transform: translateY(6px); opacity: 0.8; }
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html style.css
git commit -m "feat: add hero section with canvas, name reveal, and social links"
```

---

### Task 5: Add page content wrapper + Experience section (timeline) to HTML and CSS

**Files:**
- Modify: `index.html` (append after hero section, inside `<main>`)
- Modify: `style.css` (append layout + timeline styles)

- [ ] **Step 1: Add content wrapper and Experience section HTML**

Add after `</section>` (closing hero):

```html
        <div class="layout">
            <section id="experience" class="flow section" aria-labelledby="experience-heading">
                <h2 id="experience-heading" class="section-title">
                    Experience
                    <svg class="section-title__line" viewBox="0 0 160 6" aria-hidden="true">
                        <path d="M 0 3 Q 40 0, 80 3 T 160 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                </h2>
                <div class="timeline">
                    <div class="timeline__line" aria-hidden="true"></div>
                    <article class="timeline__entry" data-reveal>
                        <div class="timeline__dot" aria-hidden="true"></div>
                        <div class="timeline__card">
                            <h3 class="timeline__title">Tutor — Information Science Department</h3>
                            <p class="timeline__meta"><span>University of Pretoria</span> <span aria-hidden="true">&middot;</span> <span>Feb 2025 – Nov 2025</span></p>
                            <p>Tutored first-year students in INL 110 and INL 120, assisting with coursework, practical lab sessions, and exam preparation.</p>
                        </div>
                    </article>
                    <article class="timeline__entry" data-reveal>
                        <div class="timeline__dot" aria-hidden="true"></div>
                        <div class="timeline__card">
                            <h3 class="timeline__title">Part-Time Bartender</h3>
                            <p class="timeline__meta"><span>Buffelsfontein Beesboerdery</span> <span aria-hidden="true">&middot;</span> <span>Mar 2024 – Present</span></p>
                            <p>Currently working part-time, gaining valuable skills in teamwork, customer service, and operational efficiency. This experience has enhanced my ability to balance work and study responsibilities effectively.</p>
                        </div>
                    </article>
                    <article class="timeline__entry" data-reveal>
                        <div class="timeline__dot" aria-hidden="true"></div>
                        <div class="timeline__card">
                            <h3 class="timeline__title">Various Hospitality Roles</h3>
                            <p class="timeline__meta"><span>Seasonal and Holiday Staff</span> <span aria-hidden="true">&middot;</span> <span>2020 – Present</span></p>
                            <p>Over school and university holidays since 2020, I have worked in several hospitality roles. These roles have improved my adaptability, communication skills, and ability to perform well in high-pressure environments.</p>
                        </div>
                    </article>
                </div>
            </section>
```

- [ ] **Step 2: Append layout + timeline + section title CSS to `style.css`**

Append:

```css
.layout {
    max-width: var(--content-max);
    margin-inline: auto;
    padding-inline: var(--space-md);
    padding-block: var(--space-xl);
}

.section {
    padding-block: var(--space-lg);
    border-bottom: 1px solid var(--hairline);
    transition: border-color 0.4s ease;
}

.section:last-child {
    border-bottom: none;
}

.section-title {
    margin: 0 0 var(--space-md);
    font-family: var(--font-hand);
    font-size: clamp(1.6rem, 3vw, 2rem);
    font-weight: 600;
    color: var(--heading);
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
}

.section-title__line {
    width: 10rem;
    height: auto;
    color: var(--gold);
}

.section-title__line path {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    transition: stroke-dashoffset 0.8s var(--ease-out);
}

.section-title.is-drawn .section-title__line path {
    stroke-dashoffset: 0;
}

.timeline {
    position: relative;
    padding-left: 1.75rem;
}

.timeline__line {
    position: absolute;
    left: 0.4rem;
    top: 0.3rem;
    bottom: 0.3rem;
    width: 1px;
    background: linear-gradient(180deg, var(--gold), rgba(184, 161, 101, 0.15));
    transform-origin: top;
    transform: scaleY(0);
    transition: transform 0.6s var(--ease-out);
}

.timeline.is-visible .timeline__line {
    transform: scaleY(1);
}

.timeline__entry {
    position: relative;
    padding-bottom: var(--space-md);
    transition: opacity 0.6s ease, transform 0.6s var(--ease-out);
}

.timeline__entry:last-child {
    padding-bottom: 0;
}

.timeline__dot {
    position: absolute;
    left: -1.35rem;
    top: 0.5rem;
    width: 0.6rem;
    height: 0.6rem;
    background: var(--gold);
    border-radius: 50%;
    box-shadow: 0 0 0 4px var(--gold-wash);
    transform: scale(0);
    transition: transform 0.4s var(--ease-out);
}

.timeline.is-visible .timeline__entry:nth-child(2) .timeline__dot { transition-delay: 0.1s; }
.timeline.is-visible .timeline__entry:nth-child(3) .timeline__dot { transition-delay: 0.2s; }
.timeline.is-visible .timeline__entry:nth-child(4) .timeline__dot { transition-delay: 0.3s; }
.timeline.is-visible .timeline__dot {
    transform: scale(1);
}

.timeline__card {
    padding: var(--space-md);
    background: var(--surface);
    border-radius: var(--radius-md);
    border: 1px solid var(--hairline);
    box-shadow: var(--shadow-sm);
    transition: background-color 0.4s ease, border-color 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

@media (hover: hover) {
    .timeline__card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--gold-border);
    }
}

.timeline__title {
    margin: 0 0 0.2rem;
    font-family: var(--font-body);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--heading);
}

.timeline__meta {
    margin: 0 0 0.5rem;
    font-size: 0.85rem;
    color: var(--muted);
    font-weight: 500;
}

.timeline__card p {
    margin: 0;
    font-size: 0.93rem;
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html style.css
git commit -m "feat: add experience section with animated timeline"
```

---

### Task 6: Add Education section (timeline) to HTML

**Files:**
- Modify: `index.html` (append after experience closing `</section>`)

- [ ] **Step 1: Add Education section HTML**

Add after `</section>` (closing experience):

```html
            <section id="education" class="flow section" aria-labelledby="education-heading">
                <h2 id="education-heading" class="section-title">
                    Education
                    <svg class="section-title__line" viewBox="0 0 160 6" aria-hidden="true">
                        <path d="M 0 3 Q 40 0, 80 3 T 160 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                </h2>
                <div class="timeline">
                    <div class="timeline__line" aria-hidden="true"></div>
                    <article class="timeline__entry" data-reveal>
                        <div class="timeline__dot" aria-hidden="true"></div>
                        <div class="timeline__card">
                            <h3 class="timeline__title">Bachelor of Information Technology (BIT)</h3>
                            <p class="timeline__meta"><span>University of Pretoria</span> <span aria-hidden="true">&middot;</span> <span>2024 – 2026</span></p>
                            <p>Currently enrolled as a third-year student with a focus on Information Science. First Year: 76% average. Second Year: 71% average. Coursework in programming, systems analysis, and IT concepts.</p>
                            <p class="muted" style="margin-top:0.5rem">
                                <a href="https://www.up.ac.za/" target="_blank" rel="noopener noreferrer">UP</a>
                                <span aria-hidden="true"> &middot; </span>
                                <a href="https://www.up.ac.za/school-of-information-technology" target="_blank" rel="noopener noreferrer">School of IT</a>
                                <span aria-hidden="true"> &middot; </span>
                                <a href="https://www.up.ac.za/yearbooks/2024/EBIT-faculty/UD-programmes/view/12133300" target="_blank" rel="noopener noreferrer">Yearbook</a>
                            </p>
                        </div>
                    </article>
                    <article class="timeline__entry" data-reveal>
                        <div class="timeline__dot" aria-hidden="true"></div>
                        <div class="timeline__card">
                            <h3 class="timeline__title">IEB National Senior Certificate (NSC)</h3>
                            <p class="timeline__meta"><span>Independent Examinations Board (IEB)</span> <span aria-hidden="true">&middot;</span> <span>2022</span></p>
                            <p>Achieved my National Senior Certificate with 81% average and 3 distinctions, laying a strong foundation for my IT studies.</p>
                        </div>
                    </article>
                </div>
            </section>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add education section with timeline"
```

---

### Task 7: Add Projects section to HTML and cards CSS to `style.css`

**Files:**
- Modify: `index.html` (append after education)
- Modify: `style.css` (append card grid styles)

- [ ] **Step 1: Add Projects section HTML**

Add after `</section>` (closing education):

```html
            <section id="projects" class="flow section" aria-labelledby="projects-heading">
                <h2 id="projects-heading" class="section-title">
                    Projects
                    <svg class="section-title__line" viewBox="0 0 160 6" aria-hidden="true">
                        <path d="M 0 3 Q 40 0, 80 3 T 160 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                </h2>
                <div class="cards">
                    <article class="card" data-reveal>
                        <h3 class="card__title">ADS-B Flight Tracker (South Africa)</h3>
                        <p>Live aircraft on a map using public ADS-B data, built with Angular and Leaflet. Coverage centred on South Africa with presets for Pretoria, Johannesburg, and Cape Town.</p>
                        <p class="card__links">
                            <a href="radar/index.html">Open the app</a>
                            <span aria-hidden="true"> &middot; </span>
                            <a href="https://github.com/stephanbredenhann/Radar---South-Africa-ADS-B-Radar" target="_blank" rel="noopener noreferrer">Source code</a>
                        </p>
                    </article>
                    <article class="card" data-reveal>
                        <h3 class="card__title">Community Road Paving Crowdfunding Platform</h3>
                        <p>Full-stack web app enabling residents to collectively fund road paving by purchasing 1 m&sup2; sections via an interactive map. Tracks construction progress with role-based access.</p>
                        <p class="card__links">
                            <a href="https://diamantlaan-sb.azurewebsites.net/" target="_blank" rel="noopener noreferrer">Open the app</a>
                            <span aria-hidden="true"> &middot; </span>
                            <a href="https://github.com/stephanbredenhann/Diamant-Laan-Projek" target="_blank" rel="noopener noreferrer">Source code</a>
                        </p>
                    </article>
                </div>
            </section>
```

- [ ] **Step 2: Append cards CSS to `style.css`**

Append:

```css
.cards {
    display: grid;
    gap: var(--space-md);
}

@media (min-width: 640px) {
    .cards {
        grid-template-columns: 1fr 1fr;
    }
}

.card {
    padding: var(--space-md);
    background: var(--surface);
    border-radius: var(--radius-md);
    border: 1px solid var(--hairline);
    box-shadow: var(--shadow-sm);
    transition: background-color 0.4s ease, border-color 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
}

@media (hover: hover) {
    .card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md);
        border-color: var(--gold-border);
    }
}

.card__title {
    margin: 0 0 0.35rem;
    font-family: var(--font-body);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--heading);
}

.card p {
    margin: 0.25rem 0;
    font-size: 0.93rem;
}

.card p:last-child {
    margin-bottom: 0;
}

.card__links {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
}

.card__links a {
    text-decoration: none;
    color: var(--heading);
}

@media (hover: hover) {
    .card__links a:hover {
        text-decoration: underline;
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html style.css
git commit -m "feat: add projects section with card grid and link styles"
```

---

### Task 8: Add Skills section to HTML and badge CSS to `style.css`

**Files:**
- Modify: `index.html` (append after projects)
- Modify: `style.css` (append badge + skills styles)

- [ ] **Step 1: Add Skills section HTML**

Add after `</section>` (closing projects):

```html
            <section id="skills" class="flow section" aria-labelledby="skills-heading">
                <h2 id="skills-heading" class="section-title">
                    Skills
                    <svg class="section-title__line" viewBox="0 0 160 6" aria-hidden="true">
                        <path d="M 0 3 Q 40 0, 80 3 T 160 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                </h2>
                <div class="cards">
                    <article class="card" data-reveal>
                        <h3 class="card__title">Technical Skills</h3>
                        <div class="skills-cat">
                            <span class="skills-cat__label">Languages</span>
                            <div class="skills-cat__badges">
                                <span class="skill-badge">Python</span>
                                <span class="skill-badge">JavaScript</span>
                                <span class="skill-badge">HTML &amp; CSS</span>
                                <span class="skill-badge">C++</span>
                                <span class="skill-badge">C#</span>
                            </div>
                        </div>
                        <div class="skills-cat">
                            <span class="skills-cat__label">Web &amp; Development</span>
                            <div class="skills-cat__badges">
                                <span class="skill-badge">Front-End</span>
                                <span class="skill-badge">Responsive Design</span>
                                <span class="skill-badge">OOP</span>
                                <span class="skill-badge">Debugging</span>
                            </div>
                        </div>
                        <div class="skills-cat">
                            <span class="skills-cat__label">Tools &amp; Systems</span>
                            <div class="skills-cat__badges">
                                <span class="skill-badge">Git &amp; GitHub</span>
                                <span class="skill-badge">Linux</span>
                                <span class="skill-badge">Windows</span>
                                <span class="skill-badge">RDBMS</span>
                                <span class="skill-badge">UML</span>
                                <span class="skill-badge">Systems Design</span>
                            </div>
                        </div>
                    </article>
                    <article class="card" data-reveal>
                        <h3 class="card__title">Soft Skills</h3>
                        <div class="skills-cat">
                            <div class="skills-cat__badges">
                                <span class="skill-badge skill-badge--soft">Communication</span>
                                <span class="skill-badge skill-badge--soft">Teamwork</span>
                                <span class="skill-badge skill-badge--soft">Problem Solving</span>
                                <span class="skill-badge skill-badge--soft">Adaptability</span>
                                <span class="skill-badge skill-badge--soft">Time Management</span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
```

- [ ] **Step 2: Append badge + skills CSS to `style.css`**

Append:

```css
.skills-cat {
    margin-bottom: 0.85rem;
}

.skills-cat:last-child {
    margin-bottom: 0;
}

.skills-cat__label {
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--heading);
}

.skills-cat__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
}

.skill-badge {
    display: inline-block;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--heading);
    background: var(--gold-wash);
    border: 1px solid var(--gold-border);
    cursor: default;
    transition: transform 0.15s ease, background-color 0.2s ease;
}

@media (hover: hover) {
    .skill-badge:hover {
        transform: translateY(-1px);
        background: rgba(184, 161, 101, 0.18);
    }
}

.skill-badge--soft {
    background: transparent;
    color: var(--gold);
    border: 1.5px solid var(--gold-border);
}

@media (hover: hover) {
    .skill-badge--soft:hover {
        background: var(--gold-wash);
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html style.css
git commit -m "feat: add skills section with pill badges"
```

---

### Task 9: Add Contact section + Footer to HTML and CSS

**Files:**
- Modify: `index.html` (append after skills, close main, add footer)
- Modify: `style.css` (append contact + footer styles)

- [ ] **Step 1: Add Contact section, close main, add Footer HTML**

Add after `</section>` (closing skills):

```html
            <section id="contact" class="flow section" aria-labelledby="contact-heading">
                <h2 id="contact-heading" class="section-title">
                    Contact
                    <svg class="section-title__line" viewBox="0 0 160 6" aria-hidden="true">
                        <path d="M 0 3 Q 40 0, 80 3 T 160 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                </h2>
                <address class="contact-card">
                    <ul class="contact-list">
                        <li class="contact-row">
                            <span class="contact-icon" aria-hidden="true">
                                <svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/></svg>
                            </span>
                            <div>
                                <span class="contact-label">Personal email</span>
                                <a href="mailto:s.bredenhann456@gmail.com">s.bredenhann456@gmail.com</a>
                            </div>
                        </li>
                        <li class="contact-row">
                            <span class="contact-icon" aria-hidden="true">
                                <svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M4 6h16v2H4V6Zm0 5h10v2H4v-2Zm0 5h16v2H4v-2Z"/></svg>
                            </span>
                            <div>
                                <span class="contact-label">Academic email</span>
                                <a href="mailto:u23667436@tuks.co.za">u23667436@tuks.co.za</a>
                            </div>
                        </li>
                        <li class="contact-row">
                            <span class="contact-icon" aria-hidden="true">
                                <svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>
                            </span>
                            <div>
                                <span class="contact-label">Address</span>
                                <span>1233 Burnett Street, Hatfield, Pretoria, South Africa</span>
                            </div>
                        </li>
                        <li class="contact-row">
                            <span class="contact-icon" aria-hidden="true">
                                <svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8c1.7 3.3 4.3 5.9 7.6 7.6l2.5-2.5c.4-.4 1-.5 1.5-.3 1 .4 2.1.6 3.2.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C9.4 21 3 14.6 3 6.9a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.1.2 2.2.6 3.2.2.5.1 1.1-.3 1.5l-2.5 2.5Z"/></svg>
                            </span>
                            <div>
                                <span class="contact-label">Phone</span>
                                <a href="tel:+27715660997">+27 71 566 0997</a>
                            </div>
                        </li>
                    </ul>
                </address>
            </section>
        </div>
    </main>

    <footer class="site-footer">
        <div class="site-footer__inner">
            <p>&copy; <span data-year>2026</span> Stephan Bredenhann</p>
            <p class="site-footer__meta">
                <a href="https://github.com/stephanbredenhann/stephanbredenhann.github.io" target="_blank" rel="noopener noreferrer">Source</a>
                <span aria-hidden="true"> &middot; </span>
                <span class="muted">Hosted on GitHub Pages</span>
            </p>
        </div>
    </footer>

    <script src="main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Append contact + footer CSS to `style.css`**

Append:

```css
.contact-card {
    font-style: normal;
}

.contact-list {
    list-style: none;
    margin: 0;
    padding: var(--space-md);
    background: var(--surface);
    border-radius: var(--radius-md);
    border: 1px solid var(--hairline);
    box-shadow: var(--shadow-sm);
    display: grid;
    gap: var(--space-md);
    transition: background-color 0.4s ease, border-color 0.4s ease;
}

@media (hover: hover) {
    .contact-list:hover {
        border-color: var(--gold-border);
        box-shadow: var(--shadow-md);
    }
}

.contact-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-sm);
    align-items: start;
}

.contact-icon {
    width: 2.35rem;
    height: 2.35rem;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: var(--gold-wash);
    color: var(--gold);
    transition: background-color 0.22s ease, color 0.22s ease;
}

@media (hover: hover) {
    .contact-row:hover .contact-icon {
        background: rgba(184, 161, 101, 0.22);
        color: var(--heading);
    }
}

.contact-label {
    display: block;
    margin-bottom: 0.1rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--heading);
}

.contact-row a {
    font-weight: 600;
    text-decoration: none;
    color: var(--text);
}

@media (hover: hover) {
    .contact-row a:hover {
        text-decoration: underline;
    }
}

.site-footer {
    background: var(--footer-bg);
    color: var(--footer-text);
    padding-block: var(--space-lg);
    margin-top: var(--space-md);
    transition: background-color 0.4s ease;
}

.site-footer__inner {
    max-width: var(--content-max);
    margin-inline: auto;
    padding-inline: var(--space-md);
    text-align: center;
}

.site-footer a {
    color: inherit;
    text-decoration: none;
    font-weight: 600;
}

@media (hover: hover) {
    .site-footer a:hover {
        text-decoration: underline;
    }
}

.site-footer__meta {
    margin: var(--space-sm) 0 0;
    font-size: 0.9rem;
    opacity: 0.85;
}

.site-footer .muted {
    color: rgba(255, 255, 255, 0.6);
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html style.css
git commit -m "feat: add contact section and footer"
```

---

### Task 10: Add scroll reveal CSS + responsive breakpoints to `style.css`

**Files:**
- Modify: `style.css` (append reveal styles + responsive)

- [ ] **Step 1: Append reveal + responsive CSS to `style.css`**

Append:

```css
[data-reveal] {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
}

[data-reveal].is-visible {
    opacity: 1;
    transform: translateY(0);
}

.cards [data-reveal]:nth-child(2) { transition-delay: 0.1s; }

.timeline__entry { transition-delay: 0s; }
.timeline__entry:nth-child(2) { transition-delay: 0.1s; }
.timeline__entry:nth-child(3) { transition-delay: 0.2s; }
.timeline__entry:nth-child(4) { transition-delay: 0.3s; }

@media (max-width: 767px) {
    .site-nav__toggle {
        display: grid;
        place-items: center;
    }

    .site-nav {
        border-radius: var(--radius-md);
    }

    .site-nav__list {
        position: fixed;
        z-index: 999;
        inset: var(--header-h) 0 auto 0;
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        padding: var(--space-md);
        background: var(--surface);
        border: 1px solid var(--gold-border);
        border-top: none;
        border-radius: 0 0 var(--radius-md) var(--radius-md);
        box-shadow: var(--shadow-lg);

        transform: translateY(-120%);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.35s var(--ease-out), opacity 0.25s ease;
    }

    .site-nav.is-open .site-nav__list {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
    }

    .site-nav__list a {
        padding: 0.75rem 0.85rem;
        border-radius: var(--radius-sm);
    }

    .cards {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 420px) {
    .hero__title {
        font-size: 2.4rem;
    }

    .timeline {
        padding-left: 1.25rem;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "feat: add scroll reveal transitions and responsive breakpoints"
```

---

### Task 11: Write `main.js` — particle canvas, name reveal, scroll observers, theme toggle, nav

**Files:**
- Rewrite: `main.js`

- [ ] **Step 1: Write the complete `main.js`**

Replace the entire contents of `main.js`:

```js
/**
 * CV — Warm Personal
 * Particles, name reveal, scroll animations, theme toggle, nav drawer.
 */

const ROOT = document.documentElement;
const THEME_KEY = 'sb-theme';

/* ── Theme toggle ── */

const themeBtn = document.querySelector('[data-theme-toggle]');

function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}

function applyTheme(theme) {
    const dark = theme === 'dark';
    const value = dark ? 'dark' : 'light';
    ROOT.setAttribute('data-theme', value);
    ROOT.style.colorScheme = dark ? 'dark' : 'light';

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#1C1410' : '#FAFAF5';

    if (themeBtn) {
        themeBtn.setAttribute('aria-pressed', String(dark));
        themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        themeBtn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    }
}

themeBtn?.addEventListener('click', () => {
    const next = ROOT.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    applyTheme(next);
});

const mqScheme = window.matchMedia('(prefers-color-scheme: dark)');
mqScheme.addEventListener('change', () => {
    if (getStoredTheme() === null) applyTheme(mqScheme.matches ? 'dark' : 'light');
});

/* ── Nav drawer ── */

const nav = document.getElementById('site-nav');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');

function setNavOpen(open) {
    if (!navToggle || !nav) return;
    navToggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
}

navToggle?.addEventListener('click', () => {
    setNavOpen(navToggle.getAttribute('aria-expanded') !== 'true');
});

navMenu?.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') setNavOpen(false);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setNavOpen(false);
});

const mqNav = window.matchMedia('(min-width: 768px)');
mqNav.addEventListener('change', (e) => { if (e.matches) setNavOpen(false); });

/* ── Footer year ── */

for (const el of document.querySelectorAll('[data-year]')) {
    el.textContent = String(new Date().getFullYear());
}

/* ── Particle canvas ── */

const canvas = document.querySelector('[data-particle-canvas]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (canvas && !reducedMotion.matches) {
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const COLORS = ['#B8A165', '#D6B85A', '#C8A87C', '#E8D5A3', '#92400E'];

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    function createParticles(count) {
        particles = [];
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 0.8 + Math.random() * 2.2,
                vx: (Math.random() - 0.5) * 0.12,
                vy: -(Math.random() * 0.25 + 0.05),
                opacity: 0.1 + Math.random() * 0.25,
                color: COLORS[Math.floor(Math.random() * COLORS.length)]
            });
        }
    }

    function draw() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        ctx.clearRect(0, 0, w, h);

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10;
            if (p.y > h + 10) p.y = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles(window.innerWidth < 768 ? 18 : 30);
    draw();

    window.addEventListener('resize', () => {
        resize();
        createParticles(window.innerWidth < 768 ? 18 : 30);
    });

    reducedMotion.addEventListener('change', (e) => {
        if (e.matches) {
            cancelAnimationFrame(animId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            resize();
            createParticles(window.innerWidth < 768 ? 18 : 30);
            draw();
        }
    });
}

/* ── Name character reveal ── */

const nameEl = document.querySelector('[data-name-reveal]');
if (nameEl && !reducedMotion.matches) {
    const text = nameEl.textContent.trim();
    nameEl.textContent = '';
    [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = (i * 55) + 'ms';
        nameEl.appendChild(span);
    });
}

/* ── Scroll reveals ── */

const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        }
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
}

/* ── Section title underline drawing ── */

const sectionTitles = document.querySelectorAll('.section-title');
if (sectionTitles.length && !reducedMotion.matches) {
    const titleObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-drawn');
                titleObserver.unobserve(entry.target);
            }
        }
    }, { threshold: 0.5 });

    sectionTitles.forEach((el) => titleObserver.observe(el));
}

/* ── Timeline line drawing ── */

const timelines = document.querySelectorAll('.timeline');
if (timelines.length && !reducedMotion.matches) {
    const timelineObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                timelineObserver.unobserve(entry.target);
            }
        }
    }, { threshold: 0.2 });

    timelines.forEach((el) => timelineObserver.observe(el));
}

/* ── Active nav link highlighting ── */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-nav__list a');

if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        }
    }, { threshold: 0.3, rootMargin: '-20% 0px -70% 0px' });

    sections.forEach((sec) => navObserver.observe(sec));
}
```

- [ ] **Step 2: Commit**

```bash
git add main.js
git commit -m "feat: add particles, name reveal, scroll observers, theme, nav JS"
```

---

### Task 12: Verification and final polish

**Files:**
- Verify: `index.html`, `style.css`, `main.js`

- [ ] **Step 1: Check for any syntax issues**

Run: `grep -n "Unclosed\|MISSING" index.html`
Expected: No output

Run: `grep -c "{" style.css` and `grep -c "}" style.css`
Expected: Both return the same number

- [ ] **Step 2: Verify all sections are present**

Run: `grep -c 'id="' index.html`
Expected: Shows count >= 7 (landing, experience, education, projects, skills, contact, site-nav)

- [ ] **Step 3: Verify the tutoring entry is present**

Run: `grep "Tutor" index.html`
Expected: Matches the new tutoring entry

- [ ] **Step 4: Commit if any fixes were needed**

```bash
git add index.html style.css main.js
git commit -m "fix: verification polish"
```

---
