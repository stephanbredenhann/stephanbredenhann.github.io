/**
 * Navigation drawer + theme preference + footer year.
 * Theme: localStorage key `sb-theme` (`light` | `dark`). If unset, follows system until user toggles.
 */

const THEME_KEY = "sb-theme";

const nav = document.getElementById("site-nav");
const toggle = document.querySelector("[data-nav-toggle]");
const menu = document.querySelector("[data-nav-menu]");
const themeBtn = document.querySelector("[data-theme-toggle]");
const root = document.documentElement;

function setNavOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
}

toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!isOpen);
});

menu?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
        setNavOpen(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setNavOpen(false);
    }
});

const mqNav = window.matchMedia("(min-width: 768px)");
function closeNavOnDesktop(event) {
    if (event.matches) {
        setNavOpen(false);
    }
}
if (typeof mqNav.addEventListener === "function") {
    mqNav.addEventListener("change", closeNavOnDesktop);
} else if (typeof mqNav.addListener === "function") {
    mqNav.addListener(closeNavOnDesktop);
}

for (const el of document.querySelectorAll("[data-year]")) {
    el.textContent = String(new Date().getFullYear());
}

/* ----- Theme ----- */

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch {
        return null;
    }
}

function getSystemDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme) {
    const dark = theme === "dark";
    const value = dark ? "dark" : "light";
    root.setAttribute("data-theme", value);
    root.style.colorScheme = dark ? "dark" : "light";

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.content = dark ? "#0c0c16" : "#1a1a2e";
    }

    if (themeBtn) {
        themeBtn.setAttribute("aria-pressed", String(dark));
        themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
        themeBtn.title = dark ? "Switch to light theme" : "Switch to dark theme";
    }
}

function resolveTheme() {
    const stored = getStoredTheme();
    if (stored === "light" || stored === "dark") {
        return stored;
    }
    return getSystemDark() ? "dark" : "light";
}

function initTheme() {
    applyTheme(resolveTheme());
}

themeBtn?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try {
        localStorage.setItem(THEME_KEY, next);
    } catch {
        /* private mode */
    }
    applyTheme(next);
});

const mqScheme = window.matchMedia("(prefers-color-scheme: dark)");
function onSystemThemeChange() {
    if (getStoredTheme() === null) {
        applyTheme(getSystemDark() ? "dark" : "light");
    }
}
if (typeof mqScheme.addEventListener === "function") {
    mqScheme.addEventListener("change", onSystemThemeChange);
} else if (typeof mqScheme.addListener === "function") {
    mqScheme.addListener(onSystemThemeChange);
}

initTheme();
