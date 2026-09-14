/**
 * EHLYHU Global IT Solutions - Interactive Controller
 * Mobile Drawer State, 3D Canvas Mesh, Emblem Tilt, Dynamic Counters
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initNetworkCanvas();
    init3DHeroTilt();
    initStatsCounter();
    initFaqAccordion();
    initContactForm();
});

// Sticky Header Blur and Elevation
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

// Mobile Hamburger Toggle with Scroll-Lock & Outside Dismissal
function initMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav');
    if (!toggle || !nav) return;

    function closeNav() {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function openNav() {
        nav.classList.add('open');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (nav.classList.contains('open')) {
            closeNav();
        } else {
            openNav();
        }
    });

    // Close when tapping any link inside mobile navigation
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeNav();
        });
    });

    // Dismiss drawer when clicking anywhere outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
            closeNav();
        }
    });

    // Dismiss on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeNav();
        }
    });

    // Restore default layout if screen is expanded to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('open')) {
            closeNav();
        }
    }, { passive: true });
}

// 3D Canvas Interactive Node Globe
function initNetworkCanvas() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, points = [];
    const numPoints = window.innerWidth < 768 ? 32 : 65;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Point {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
            ctx.fill();
        }
    }

    for (let i = 0; i < numPoints; i++) points.push(new Point());

    let animationFrame;
    function render() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < points.length; i++) {
            points[i].update();
            points[i].draw();
            for (let j = i + 1; j < points.length; j++) {
                const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
                if (dist < 115) {
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.strokeStyle = `rgba(34, 211, 238, ${0.22 * (1 - dist / 115)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        animationFrame = requestAnimationFrame(render);
    }

    // Freeze animation when hero is off-screen for battery/GPU performance
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) render();
        else cancelAnimationFrame(animationFrame);
    });
    observer.observe(canvas);
}

// 3D Tilt Effect on Hero Emblem
function init3DHeroTilt() {
    const stage = document.querySelector('.hero-visual');
    const emblemStage = document.querySelector('.logo-3d-stage');
    if (!stage || !emblemStage) return;

    stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        emblemStage.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 30}deg) scale(1.04)`;
    });

    stage.addEventListener('mouseleave', () => {
        emblemStage.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
    });
}

// Animated Numbers on Scroll
function initStatsCounter() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                let current = 0;
                const step = Math.ceil(target / 40);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        el.textContent = current + suffix;
                    }
                }, 25);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));
}

// FAQ Accordion
function initFaqAccordion() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            const expanded = q.getAttribute('aria-expanded') === 'true';
            
            // Close other accordion elements
            questions.forEach(item => {
                item.setAttribute('aria-expanded', 'false');
                if (item.nextElementSibling) item.nextElementSibling.style.display = 'none';
            });

            if (!expanded && answer) {
                q.setAttribute('aria-expanded', 'true');
                answer.style.display = 'block';
            }
        });
    });
}

// Contact Form Handler
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Sending Request...';

        setTimeout(() => {
            btn.innerHTML = '✔ Request Dispatched!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            btn.style.color = '#ffffff';
            form.reset();
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.removeAttribute('style');
            }, 4000);
        }, 1000);
    });
}