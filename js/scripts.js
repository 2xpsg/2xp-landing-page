// Global variables
let loadingComplete = false;
let particlesLoaded = false;
let explosionComplete = false;

// Animation configuration
const ANIMATION_CONFIG = {
    durations: {
        explosion: 3.0,
        heroReveal: 3.0,
        sectionFade: 0.2
    },
    particles: {
        explosion: { min: 6, max: 12, count: 8 },
        background: { mobile: 60, desktop: 120 }
    },
    colors: {
        primary: ["#7F5AF0", "#00CFFF", "#9F7AFA"],
        accent: "#7F5AF0"
    }
};

// Utility functions
function isMobile() {
    return window.innerWidth < 768;
}

function setInitialStates() {
    gsap.set('nav', { opacity: 0 });
    gsap.set('#hero .section-fade-in', { opacity: 1, clipPath: 'circle(0% at 50% 50%)' });
    gsap.set('.hero-floating-orb', { scale: 0 });
    gsap.set('.title-word', { scale: 0.5, y: 30, transformOrigin: 'center' });

    // Section-specific initial states
    const sections = ['#about', '#product', '#contact'];
    sections.forEach(section => {
        gsap.set(`${section} .title-main`, { scale: 0, rotationX: -90, transformOrigin: 'center bottom' });
        gsap.set(`${section} .title-sub`, { opacity: 0, y: 100, skewX: -20 });
        gsap.set(`${section} .title-line`, { scaleX: 0, transformOrigin: 'center' });
    });

    // Content initial states
    gsap.set('.floating-orb, .contact-orb-1, .contact-orb-2, .contact-orb-3', { scale: 0, opacity: 0 });
    gsap.set('.story-paragraph, .mission-paragraph, .contact-content', { opacity: 0, y: 50, scale: 0.95 });
    gsap.set('.stat-item, .feature-card', { opacity: 0, y: 30, scale: 0.9 });
    gsap.set('.mission-word, .vision-word', { opacity: 0, y: 20, scale: 0.8 });
    gsap.set('.hoopers-letter, .hub-letter', { opacity: 1, y: 0, scale: 1, transformOrigin: 'center' });
}

// Text explosion effect
function createTextExplosion() {
    const loadingScreen = document.getElementById('loadingScreen');
    const heroContent = document.querySelector('#hero .section-fade-in');

    const explosionContainer = document.createElement('div');
    explosionContainer.id = 'explosion-particles';
    Object.assign(explosionContainer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '10000',
        pointerEvents: 'none'
    });
    document.body.appendChild(explosionContainer);

    const masterTl = gsap.timeline({
        onComplete: () => {
            explosionContainer.remove();
            explosionComplete = true;
            enableHeroTitleAnimations();
        }
    });

    const loadingContainer = document.querySelector('.loading-container');

    masterTl
        .to(loadingContainer, {
            scale: 1,
            duration: 0.8,
            ease: "power2.out"
        })
        .to(loadingContainer, {
            scale: 1.5,
            opacity: 0,
            duration: 1.0,
            ease: "power2.out",
            onStart: () => initializeExplosionParticles(explosionContainer)
        })
        .to(heroContent, {
            clipPath: 'circle(150% at 50% 50%)',
            duration: ANIMATION_CONFIG.durations.heroReveal,
            ease: "power2.out",
            onStart: () => animateMainContent()
        }, "+=0.8")
        .call(() => transitionToBackgroundParticles(), null, "-=2.0")
        .to(loadingScreen, {
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
            onComplete: () => loadingScreen.classList.add('hidden')
        }, "-=2.5");
}

// Initialize explosion particles
async function initializeExplosionParticles(container) {
    await tsParticles.load(container.id, {
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        particles: {
            color: { value: ANIMATION_CONFIG.colors.primary },
            links: {
                color: ANIMATION_CONFIG.colors.accent,
                distance: 100,
                enable: true,
                opacity: 0.6,
                width: 1,
                triangles: { enable: false }
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "out" },
                random: true,
                speed: { min: 3, max: 8 },
                straight: true,
                angle: { offset: 0, value: { min: 0, max: 360 } }
            },
            number: { value: 0 },
            opacity: {
                value: { min: 0.5, max: 1 },
                animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false }
            },
            shape: { type: "circle" },
            size: {
                value: { min: 1, max: 3 },
                animation: { enable: true, speed: 2, minimumValue: 1, sync: false }
            },
            life: { duration: { sync: false, value: 4 }, count: 1 }
        },
        emitters: [{
            position: { x: 50, y: 50 },
            rate: { quantity: ANIMATION_CONFIG.particles.explosion.count, delay: 0.15 },
            size: { width: 0, height: 0 },
            particles: {
                move: {
                    direction: "none",
                    straight: true,
                    speed: { min: ANIMATION_CONFIG.particles.explosion.min, max: ANIMATION_CONFIG.particles.explosion.max },
                    outModes: { default: "out" },
                    angle: { offset: 0, value: { min: 0, max: 360 } }
                },
                size: { value: { min: 1, max: 3 } }
            },
            life: { duration: 3, count: 1 }
        }],
        detectRetina: true
    });
}

// Transition to background particles
function transitionToBackgroundParticles() {
    if (window.tsParticles && tsParticles.domItem(0)) {
        const container = tsParticles.domItem(0);
        let currentCount = 0;
        const targetCount = isMobile() ?
            ANIMATION_CONFIG.particles.background.mobile :
            ANIMATION_CONFIG.particles.background.desktop;

        const addBatch = () => {
            if (currentCount < targetCount) {
                const batchSize = Math.min(10, targetCount - currentCount);
                for (let i = 0; i < batchSize; i++) {
                    container.particles.addParticle();
                }
                currentCount += batchSize;
                setTimeout(addBatch, 100);
            }
        };
        addBatch();
    }
}

// Main content animation
function animateMainContent() {
    const heroTl = gsap.timeline({
        onComplete: () => startHeroContinuousAnimations()
    });

    heroTl
        .fromTo('nav', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to('.hero-floating-orb', { scale: 1, duration: 2.5, ease: "elastic.out(1, 0.4)" }, 0)
        .to('.title-word', {
            scale: 1,
            y: 0,
            duration: 2.0,
            stagger: { each: 0.15, from: "start" },
            ease: "back.out(1.7)"
        }, 0.2)
        .to('.word-5', {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        }, 2.7);

    return heroTl;
}

// Continuous hero animations
function startHeroContinuousAnimations() {
    gsap.to('.hero-floating-orb', {
        scale: 1.1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to('.hero-cta', {
        scale: 1.02,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

// Generic hover effects
function initHoverEffects() {
    // Title words hover
    document.querySelectorAll('.title-word').forEach(word => {
        word.addEventListener('mouseenter', () => {
            gsap.to(word, { scale: 1.1, rotationY: 10, z: 50, duration: 0.4, ease: "power3.out" });
        });
        word.addEventListener('mouseleave', () => {
            gsap.to(word, { scale: 1, rotationY: 0, z: 0, duration: 0.4, ease: "power3.out" });
        });
    });

    // Floating orb hover
    const floatingOrb = document.querySelector('.hero-floating-orb');
    if (floatingOrb) {
        floatingOrb.addEventListener('mouseenter', () => {
            gsap.to(floatingOrb, { scale: 1.3, duration: 0.5, ease: "power3.out" });
        });
        floatingOrb.addEventListener('mouseleave', () => {
            gsap.to(floatingOrb, { scale: 1.1, duration: 0.5, ease: "power3.out" });
        });
    }

    // Product letters hover
    document.querySelectorAll('.hoopers-letter, .hub-letter').forEach(letter => {
        letter.addEventListener('mouseenter', () => {
            gsap.to(letter, {
                scale: 1.3,
                rotationY: 360,
                color: '#00CFFF',
                textShadow: '0 0 20px #00CFFF',
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        });
        letter.addEventListener('mouseleave', () => {
            gsap.to(letter, {
                scale: 1,
                rotationY: 0,
                color: '',
                textShadow: 'none',
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });

    // Feature cards hover
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -5, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
        });
    });
}

// Hero scroll effects
function initHeroScrollEffects() {
    const scrollElements = [
        { selector: '.hero-title', y: -150, opacity: 0.3, scale: 0.9, scrub: 1.5 },
        { selector: '.hero-subtitle', y: -100, opacity: 0.5, scrub: 1.2 },
        { selector: '.hero-cta', y: -80, opacity: 0.4, scale: 0.95, scrub: 0.8 },
        { selector: '.hero-floating-orb', y: 100, scale: 1.3, opacity: 0.2, scrub: 2 }
    ];

    scrollElements.forEach(({ selector, scrub, ...props }) => {
        gsap.to(selector, {
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub
            },
            ...props,
            ease: 'none'
        });
    });

    // Remove individual word scroll effects to maintain spacing
    // The hero-title class already has proper scroll effects
}

// Hero title animations
function initHeroTitleEffects() {
    const titleWords = document.querySelectorAll('.hero-title .title-word');

    // Scroll-triggered sweep animation
    titleWords.forEach((word, index) => {
        ScrollTrigger.create({
            trigger: word,
            start: "top 80%",
            onEnter: () => {
                if (explosionComplete) {
                    setTimeout(() => {
                        word.classList.add('animate');
                    }, index * 200);
                }
            },
            once: true
        });
    });

    // Hover animations
    titleWords.forEach(word => {
        let hoverTimeout;
        let isAnimating = false;

        word.addEventListener('mouseenter', () => {
            if (explosionComplete && !isAnimating) {
                isAnimating = true;
                word.classList.remove('animate', 'hover-animate');
                word.offsetHeight; // Force reflow
                word.classList.add('hover-animate');
                hoverTimeout = setTimeout(() => { isAnimating = false; }, 1500);
            }
        });

        word.addEventListener('mouseleave', () => {
            if (hoverTimeout) clearTimeout(hoverTimeout);
            setTimeout(() => { isAnimating = false; }, 100);
        });
    });
}

function enableHeroTitleAnimations() {
    const titleWords = document.querySelectorAll('.hero-title .title-word');
    titleWords.forEach((word, index) => {
        const rect = word.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8) {
            setTimeout(() => {
                word.classList.add('animate');
            }, index * 200 + 500);
        }
    });
}

// Generic section animation
function createSectionAnimation(sectionId, customAnimations = {}) {
    const section = document.querySelector(sectionId);
    if (!section) return;

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 20%",
            scrub: 1
        }
    });

    // Pin for desktop only
    if (!isMobile()) {
        gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 0%",
                end: "+=100%",
                pin: true,
                pinSpacing: true,
                anticipatePin: 1
            }
        });
    }

    // Standard animations
    const standardAnimations = [
        { selector: `${sectionId} .title-main`, props: { scale: 1, rotationX: 0, duration: 0.15 }, delay: 0 },
        { selector: `${sectionId} .title-sub`, props: { opacity: 1, y: 0, skewX: 0, duration: 0.15 }, delay: 0.05 },
        { selector: `${sectionId} .title-line`, props: { scaleX: 1, duration: 0.1 }, delay: 0.1 }
    ];

    standardAnimations.forEach(({ selector, props, delay }) => {
        timeline.to(selector, props, delay);
    });

    // Apply custom animations
    Object.entries(customAnimations).forEach(([selector, { props, delay }]) => {
        timeline.to(selector, props, delay);
    });

    return timeline;
}

// Section-specific animations
function initSectionAnimations() {
    // About section
    createSectionAnimation('#about', {
        '.floating-orb': { props: { scale: 1, opacity: 1, duration: 0.15, stagger: 0.03 }, delay: 0 },
        '.story-paragraph': { props: { opacity: 1, y: 0, scale: 1, duration: 0.2, stagger: 0.05 }, delay: 0.4 },
        '.stat-item': { props: { opacity: 1, y: 0, scale: 1, duration: 0.2, stagger: 0.08 }, delay: 0.55 },
        '.mission-paragraph': { props: { opacity: 1, y: 0, scale: 1, duration: 0.15 }, delay: 0.7 },
        '.mission-word': { props: { opacity: 1, y: 0, scale: 1, duration: 0.2, stagger: 0.02 }, delay: 0.75 }
    });

    // Product section
    createSectionAnimation('#product', {
        '#product .product-description': { props: { opacity: 1, y: 0, duration: 0.2 }, delay: 0.05 },
        '#product .feature-card': { props: { opacity: 1, y: 0, duration: 0.2, stagger: 0.03 }, delay: 0.1 },
        '#product .product-screenshot': { props: { opacity: 1, y: 0, duration: 0.2 }, delay: 0.15 }
    });

    // Contact section with continuous animations
    const contactTl = createSectionAnimation('#contact', {
        '.contact-orb-1, .contact-orb-2, .contact-orb-3': { props: { scale: 1, opacity: 1, duration: 0.1, stagger: 0.02 }, delay: 0 },
        '#contact .contact-content': { props: { opacity: 1, y: 0, scale: 1, duration: 0.2 }, delay: 0.2 },
        '#contact .central-contact-card': { props: { opacity: 1, y: 0, scale: 1, duration: 0.2 }, delay: 0.2 },
        '#contact .contact-description': { props: { opacity: 1, y: 0, scale: 1, duration: 0.2 }, delay: 0.2 },
        '#contact .contact-button': { props: { opacity: 1, y: 0, scale: 1, duration: 0.2 }, delay: 0.2 },
        '#contact .vision-word': { props: { opacity: 1, y: 0, scale: 1, duration: 0.1, stagger: 0.02 }, delay: 0.3 }
    });

    // Contact continuous animations
    contactTl.scrollTrigger.vars.onToggle = (self) => {
        if (self.isActive) {
            startContactContinuousAnimations();
        } else {
            gsap.killTweensOf(['.contact-orb-1', '.contact-orb-2', '.contact-orb-3']);
        }
    };
}

function startContactContinuousAnimations() {
    const orbAnimations = [
        { selector: '.contact-orb-1', x: -40, y: 30, duration: 9 },
        { selector: '.contact-orb-2', x: 30, y: -25, duration: 11 },
        { selector: '.contact-orb-3', x: 25, y: 20, duration: 13 }
    ];

    orbAnimations.forEach(({ selector, x, y, duration }) => {
        gsap.to(selector, {
            x, y, duration,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
}

// Product specific animations
function initProductAnimations() {
    ScrollTrigger.create({
        trigger: ".product-title",
        start: "top 80%",
        onEnter: () => {
            gsap.to('.hoopers-letter', {
                y: -30, scale: 1.1, duration: 0.5, stagger: 0.1,
                ease: "back.inOut(1.7)", yoyo: true, repeat: 1
            });
            gsap.to('.hub-letter', {
                y: -30, scale: 1.1, duration: 0.5, stagger: 0.1,
                ease: "back.inOut(1.7)", yoyo: true, repeat: 1, delay: 0.4
            });
        }
    });
}

// Initialize main tsParticles
async function initializeMainParticles() {
    await loadFull(tsParticles);
    await tsParticles.load("tsparticles", {
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "grab" },
                resize: true
            },
            modes: {
                push: { quantity: 4 },
                grab: { distance: 140, links: { opacity: 0.8 } }
            }
        },
        particles: {
            color: { value: ANIMATION_CONFIG.colors.primary },
            links: {
                color: ANIMATION_CONFIG.colors.accent,
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 1,
                straight: false
            },
            number: {
                density: { enable: true, area: 800 },
                value: 0
            },
            opacity: {
                value: 0.5,
                animation: { enable: true, speed: 1, minimumValue: 0.2, sync: false }
            },
            shape: { type: "circle" },
            size: {
                value: { min: 1, max: 3 },
                animation: { enable: true, speed: 2, minimumValue: 1, sync: false }
            }
        },
        detectRetina: true
    });

    particlesLoaded = true;
    checkLoadingComplete();
}

// Loading management
function checkLoadingComplete() {
    if (particlesLoaded && document.readyState === 'complete' && !loadingComplete) {
        setTimeout(() => {
            createTextExplosion();
            loadingComplete = true;
        }, 1200);
    }
}

// Navigation and scrolling
function initNavigation() {
    // Current year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const sections = ['hero', 'about', 'product', 'contact'];
        const currentSection = getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);

        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            e.preventDefault();
            document.getElementById(sections[currentIndex + 1]).scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            document.getElementById(sections[currentIndex - 1]).scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Navbar scroll effects
    const navbar = document.getElementById('navbar');
    let isScrolled = false;

    function updateNavbar() {
        const scrollY = window.scrollY;
        if (scrollY > 50 && !isScrolled) {
            navbar.classList.add('navbar-scrolled');
            isScrolled = true;
        } else if (scrollY <= 50 && isScrolled) {
            navbar.classList.remove('navbar-scrolled');
            isScrolled = false;
        }
    }

    window.addEventListener('scroll', updateNavbar);
    updateNavbar();
}

function getCurrentSection() {
    const sections = ['hero', 'about', 'product', 'contact'];
    for (let section of sections) {
        const element = document.getElementById(section);
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            return section;
        }
    }
    return 'hero';
}

// Intersection Observer for fallback
function initObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.section-fade-in').forEach(section => {
        observer.observe(section);
        section.classList.add('visible'); // Ensure all sections are visible
    });
}

// Loading text bounce animation
function initLoadingTextAnimation() {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        gsap.from(loadingText, {
            scrollTrigger: {
                trigger: loadingText,
                start: "top 85%",
                end: "top 50%",
                toggleActions: "play none none reset"
            },
            y: -200,
            opacity: 0,
            ease: "bounce.out",
            duration: 1.5
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Prevent scroll restoration and ensure top position
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Set initial states
    setInitialStates();

    // Initialize all features
    initNavigation();
    initHoverEffects();
    initHeroScrollEffects();
    initHeroTitleEffects();
    initSectionAnimations();
    initProductAnimations();
    initLoadingTextAnimation();
    initObserver();
});

// Initialize particles and start loading sequence
initializeMainParticles();

// Handle page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    checkLoadingComplete();
});

// Fallback for loading
setTimeout(() => {
    if (!loadingComplete) {
        createTextExplosion();
        loadingComplete = true;
    }
}, 3000);