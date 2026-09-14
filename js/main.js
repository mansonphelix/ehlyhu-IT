// EHLYHU Global IT Solutions – Premium Interactions

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const toggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            toggle.classList.toggle('active');
        });
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.classList.remove('active');
            });
        });
    }

    // Header scroll
    const header = document.getElementById('header');
    if (header) {
        const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        onScroll();
    }

    // Active nav
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === current || (current === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Hero Slideshow
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const showSlide = (index) => {
            slides.forEach((s, i) => s.classList.toggle('active', i === index));
        };
        showSlide(0);
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5500);
    }

    // Animated counters
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        const animateCounter = (el) => {
            const target = parseInt(el.dataset.count, 10);
            const duration = 2000;
            const start = performance.now();
            const update = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target).toLocaleString() + (el.dataset.suffix || '');
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    // Contact form demo
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '✓ Request Received';
                btn.style.background = 'linear-gradient(135deg, #34d399, #22d3ee)';
                const note = form.querySelector('.form-note');
                if (note) {
                    note.innerHTML = '<strong style="color:#34d399">Thank you!</strong> Our team will contact you shortly. (Demo form — connect a real backend for production.)';
                }
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4500);
            }, 1200);
        });
    }

    // Subtle 3D tilt on logo (skipped for users who prefer reduced motion)
    const logo3d = document.querySelector('.logo-3d');
    if (logo3d && !prefersReducedMotion && !isMobile && !isTouch) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 18;
            const y = (e.clientY / window.innerHeight - 0.5) * 12;
            logo3d.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        });
    }

    // Scroll reveal (simple)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const revealEls = document.querySelectorAll(
        '.service-card, .step-card, .testimonial-card, .value-card, .why-item, .industry-pill, .faq-item, .timeline-item'
    );
    if (revealEls.length) {
        const shouldReveal = !isMobile && !isTouch && !prefersReducedMotion;
        const revObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.15 });

        if (shouldReveal) {
            revealEls.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(24px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                revObserver.observe(el);
            });
        }
    }

    // FAQ accordion
    document.querySelectorAll('.faq-item').forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach((openItem) => {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            item.classList.toggle('open', !isOpen);
            answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
        });
    });

    initNetworkCanvas();
});

/**
 * Renders a slowly rotating point-cloud globe on the hero canvas —
 * a lightweight (no library) stand-in for EHLYHU's worldwide network.
 * Pauses automatically off-screen, in background tabs, and for users
 * who prefer reduced motion.
 */
function initNetworkCanvas() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let points = [];
    let angle = 0;
    let running = !prefersReducedMotion;
    let frame = null;

    const NUM_POINTS = (window.matchMedia('(max-width: 768px)').matches ? 45 : 90);
    const RADIUS_RATIO = 0.42;
    const LINK_DIST = 95;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function buildPoints() {
        points = [];
        for (let i = 0; i < NUM_POINTS; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / NUM_POINTS);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            points.push({ phi, theta, pulse: Math.random() * Math.PI * 2 });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const cx = width * 0.72;
        const cy = height * 0.5;
        const r = Math.min(width, height) * RADIUS_RATIO;

        const projected = points.map((p) => {
            const t = p.theta + angle;
            const x = Math.sin(p.phi) * Math.cos(t);
            const y = Math.cos(p.phi);
            const z = Math.sin(p.phi) * Math.sin(t);
            return {
                x: cx + x * r,
                y: cy + y * r,
                z,
                pulse: p.pulse
            };
        });

        // Connections between nearby points (front-facing only, for a clean look)
        ctx.lineWidth = 1;
        for (let i = 0; i < projected.length; i++) {
            if (projected[i].z < -0.15) continue;
            for (let j = i + 1; j < projected.length; j++) {
                if (projected[j].z < -0.15) continue;
                const dx = projected[i].x - projected[j].x;
                const dy = projected[i].y - projected[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    const alpha = (1 - dist / LINK_DIST) * 0.35 * ((projected[i].z + projected[j].z) / 2 + 1) / 2;
                    ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(projected[i].x, projected[i].y);
                    ctx.lineTo(projected[j].x, projected[j].y);
                    ctx.stroke();
                }
            }
        }

        // Nodes
        projected.forEach((p) => {
            const depth = (p.z + 1) / 2;
            const size = 0.8 + depth * 1.8;
            const glow = 0.4 + 0.3 * Math.sin(p.pulse + angle * 6);
            ctx.beginPath();
            ctx.fillStyle = depth > 0.55
                ? `rgba(34, 211, 238, ${0.35 + depth * 0.5 * glow})`
                : `rgba(212, 175, 55, ${0.25 + depth * 0.45})`;
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function tick() {
        angle += 0.0018;
        draw();
        if (running) frame = requestAnimationFrame(tick);
    }

    function start() {
        if (frame) return;
        running = true;
        frame = requestAnimationFrame(tick);
    }

    function stop() {
        running = false;
        if (frame) cancelAnimationFrame(frame);
        frame = null;
    }

    resize();
    buildPoints();
    draw();

    if (!prefersReducedMotion) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
        }, { threshold: 0.05 });
        io.observe(canvas);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop();
            else if (canvas.getBoundingClientRect().top < window.innerHeight) start();
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resize();
                draw();
            }, 150);
        });
    }
}
