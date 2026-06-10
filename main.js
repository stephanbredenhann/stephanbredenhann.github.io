const THEME_KEY = 'sb-theme';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ==================== 1. THEME TOGGLE ====================

const themeBtn = document.querySelector('[data-theme-toggle]');
const root = document.documentElement;

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch {
        return null;
    }
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    const value = isDark ? 'dark' : 'light';
    root.setAttribute('data-theme', value);
    root.style.colorScheme = isDark ? 'dark' : 'light';

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isDark ? '#1C1410' : '#FAFAF5';

    if (themeBtn) {
        themeBtn.setAttribute('aria-pressed', String(isDark));
        themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
}

function resolveTheme() {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    return 'dark';
}

function initTheme() {
    applyTheme(resolveTheme());
}

themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try {
        localStorage.setItem(THEME_KEY, next);
    } catch {}
    applyTheme(next);
});

initTheme();

// ==================== 2. NAV DRAWER ====================

const siteNav = document.getElementById('site-nav');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const navBackdrop = document.querySelector('[data-nav-backdrop]');

function setNavOpen(open) {
    if (!siteNav || !navToggle) return;
    navToggle.setAttribute('aria-expanded', String(open));
    siteNav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (navBackdrop) {
        navBackdrop.classList.toggle('is-visible', open);
        navBackdrop.hidden = !open;
    }
}

navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setNavOpen(!isOpen);
});

navBackdrop?.addEventListener('click', () => setNavOpen(false));

navMenu?.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) setNavOpen(false);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNavOpen(false);
});

const mqNav = window.matchMedia('(min-width: 768px)');
mqNav.addEventListener('change', (e) => {
    if (e.matches) setNavOpen(false);
});

// ==================== 3. FOOTER YEAR ====================

for (const el of document.querySelectorAll('[data-year]')) {
    el.textContent = String(new Date().getFullYear());
}

// ==================== 4. PARTICLE CANVAS ====================

const canvas = document.querySelector('[data-particle-canvas]');
let animFrameId = null;
let running = false;

if (canvas) {
    const ctx = canvas.getContext('2d');
    const colors = ['#B8A165', '#D6B85A', '#C8A87C', '#E8D5A3', '#92400E'];
    let particles = [];
    let w = 0;
    let h = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let touchFadeTimer = null;

    function setPointer(x, y) {
        targetMouseX = x;
        targetMouseY = y;
    }

    function createParticles() {
        const count = window.innerWidth < 768 ? 24 : 40;
        particles = [];
        for (let i = 0; i < count; i++) {
            const baseR = Math.random() * 2.5 + 1.5;
            const baseOpacity = Math.random() * 0.35 + 0.1;
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                baseR,
                baseOpacity,
                r: baseR,
                vx: (Math.random() - 0.5) * 0.35,
                vy: -(Math.random() * 0.35 + 0.1),
                opacity: baseOpacity,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    function updateCanvasBg() {
        const styles = getComputedStyle(document.documentElement);
        const bg = styles.getPropertyValue('--bg').trim() || '#1C1410';
        canvas.style.background = bg;
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        updateCanvasBg();
        targetMouseX = w / 2;
        targetMouseY = h / 2;
        mouseX = targetMouseX;
        mouseY = targetMouseY;
        createParticles();
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const proximity = Math.max(0, 1 - dist / 200);
            const drawR = p.baseR + proximity * 1.5;
            const drawOpacity = Math.min(0.85, p.baseOpacity + proximity * 0.4);

            ctx.beginPath();
            ctx.arc(p.x, p.y, drawR, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = drawOpacity;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    document.addEventListener('mousemove', (e) => {
        setPointer(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            setPointer(e.touches[0].clientX, e.touches[0].clientY);
            clearTimeout(touchFadeTimer);
            touchFadeTimer = setTimeout(() => {
                setPointer(w / 2, h / 2);
            }, 1000);
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        clearTimeout(touchFadeTimer);
        touchFadeTimer = setTimeout(() => {
            setPointer(w / 2, h / 2);
        }, 1000);
    });

    function update() {
        mouseX += (targetMouseX - mouseX) * 0.08;
        mouseY += (targetMouseY - mouseY) * 0.08;

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < -p.r) p.y = h + p.r;
            if (p.y > h + p.r) p.y = -p.r;
            if (p.x < -p.r) p.x = w + p.r;
            if (p.x > w + p.r) p.x = -p.r;

            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 40) {
                const force = -0.0008;
                p.vx += dx * force;
                p.vy += dy * force;
            } else if (dist >= 80 && dist < 250) {
                const force = 0.0004;
                p.vx += dx * force;
                p.vy += dy * force;
            }

            p.vx *= 0.9995;
            p.vy *= 0.9995;
        }
    }

    function tick() {
        if (!running) return;
        update();
        draw();
        animFrameId = requestAnimationFrame(tick);
    }

    function startParticles() {
        if (running) return;
        running = true;
        resize();
        animFrameId = requestAnimationFrame(tick);
    }

    function stopParticles() {
        running = false;
        if (animFrameId !== null) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (!reducedMotion.matches) {
        startParticles();
    }

    reducedMotion.addEventListener('change', (e) => {
        if (e.matches) {
            stopParticles();
        } else {
            startParticles();
        }
    });

    window.addEventListener('resize', resize);

    new MutationObserver(() => updateCanvasBg()).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

// ==================== 5. NAME CHARACTER REVEAL ====================

const nameEl = document.querySelector('[data-name-reveal]');
if (nameEl && !reducedMotion.matches) {
    const text = nameEl.textContent;
    nameEl.innerHTML = '';
    const chars = [...text];
    chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        if (char !== ' ') {
            span.style.animationDelay = (i * 55) + 'ms';
        }
        nameEl.appendChild(span);
    });
}

// ==================== 6. SCROLL REVEALS — data-reveal ====================
// ==================== 7. SECTION TITLE UNDERLINE DRAWING ====================
// ==================== 8. TIMELINE ANIMATION ====================

const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    }
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

for (const el of document.querySelectorAll('[data-reveal]')) {
    revealObserver.observe(el);
}

const titleObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-drawn');
            titleObserver.unobserve(entry.target);
        }
    }
}, { threshold: 0.5 });

for (const el of document.querySelectorAll('.section-title')) {
    titleObserver.observe(el);
}

const timelineObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            timelineObserver.unobserve(entry.target);
        }
    }
}, { threshold: 0.2 });

for (const el of document.querySelectorAll('.timeline')) {
    timelineObserver.observe(el);
}

// ==================== 9. ACTIVE NAV LINK HIGHLIGHTING ====================

const navLinks = document.querySelectorAll('.site-nav__list a');
const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            for (const link of navLinks) {
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        }
    }
}, { threshold: 0.3, rootMargin: '-20% 0px -70% 0px' });

for (const el of document.querySelectorAll('section[id]')) {
    sectionObserver.observe(el);
}
