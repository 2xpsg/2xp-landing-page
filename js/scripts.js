// Loading Screen Animation
let loadingComplete = false;
let particlesLoaded = false;
let explosionComplete = false;

// Create text explosion effect using proper tsParticles
function createTextExplosion() {
    const loadingText = document.getElementById('loadingText');
    const loadingScreen = document.getElementById('loadingScreen');
    const heroContent = document.querySelector('#hero .section-fade-in');
    const textRect = loadingText.getBoundingClientRect();
    const centerX = textRect.left + textRect.width / 2;
    const centerY = textRect.top + textRect.height / 2;

    // Create a dedicated explosion container
    const explosionContainer = document.createElement('div');
    explosionContainer.id = 'explosion-particles';
    explosionContainer.style.position = 'fixed';
    explosionContainer.style.top = '0';
    explosionContainer.style.left = '0';
    explosionContainer.style.width = '100%';
    explosionContainer.style.height = '100%';
    explosionContainer.style.zIndex = '10000';
    explosionContainer.style.pointerEvents = 'none';
    document.body.appendChild(explosionContainer);

    // Create master timeline
    const masterTl = gsap.timeline({
        onComplete: () => {
            explosionContainer.remove();
            explosionComplete = true;
            // Enable hero title animations after explosion
            enableHeroTitleAnimations();
        }
    });

    // Step 1: Text scale and pulse (slower)
    const loadingContainer = document.querySelector('.loading-container');
    masterTl.to(loadingContainer, {
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
    })
    .to(loadingContainer, {
        scale: 1.5,
        opacity: 0,
        duration: 1.0,
        ease: "power2.out",
        onStart: () => {
            // Start the tsParticles explosion as text begins fading
            initializeExplosionParticles(explosionContainer, centerX, centerY);
        }
    });

    // Step 2: Keep hero hidden during explosion - it will be revealed later

    // Step 3: Start hero reveal earlier during explosion
    masterTl.to(heroContent, {
        clipPath: 'circle(150% at 50% 50%)',
        duration: 3.0,
        ease: "power2.out",
        onStart: () => {
            // Start text animations immediately when radial reveal begins
            animateMainContent();
        }
    }, "+=0.8")

    // Step 4: Transition to background particles during hero reveal
    .call(() => {
        transitionToBackgroundParticles();
    }, null, "-=2.0")

    // Step 5: Hide loading screen after hero starts revealing
    .to(loadingScreen, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
            loadingScreen.classList.add('hidden');
        }
    }, "-=2.5");
}

// Initialize explosion particles using tsParticles engine
async function initializeExplosionParticles(container, centerX, centerY) {

    // tsParticles is already loaded with full version

    await tsParticles.load(container.id, {
        background: {
            color: {
                value: "transparent",
            },
        },
        fpsLimit: 120,
        particles: {
            color: {
                value: ["#7F5AF0", "#00CFFF", "#9F7AFA"],
            },
            links: {
                color: "#7F5AF0",
                distance: 100,
                enable: true,
                opacity: 0.6,
                width: 1,
                triangles: {
                    enable: false
                }
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "out",
                },
                random: true,
                speed: { min: 3, max: 8 },
                straight: true,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                },
                angle: {
                    offset: 0,
                    value: { min: 0, max: 360 }
                }
            },
            number: {
                value: 0, // Start with 0, emitter will add them
            },
            opacity: {
                value: { min: 0.5, max: 1 },
                animation: {
                    enable: true,
                    speed: 2,
                    minimumValue: 0.1,
                    sync: false
                }
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
                animation: {
                    enable: true,
                    speed: 2,
                    minimumValue: 1,
                    sync: false
                }
            },
            life: {
                duration: {
                    sync: false,
                    value: 4
                },
                count: 1
            },
        },
        // Emitter to create explosion from center
        emitters: [
            {
                position: {
                    x: 50,
                    y: 50
                },
                rate: {
                    quantity: 8,
                    delay: 0.15
                },
                size: {
                    width: 0,
                    height: 0
                },
                particles: {
                    move: {
                        direction: "none",
                        straight: true,
                        speed: { min: 6, max: 12 },
                        outModes: {
                            default: "out"
                        },
                        angle: {
                            offset: 0,
                            value: { min: 0, max: 360 }
                        }
                    },
                    size: {
                        value: { min: 1, max: 3 }
                    }
                },
                life: {
                    duration: 3,
                    count: 1
                }
            }
        ],
        detectRetina: true,
    });
}

// This function is no longer needed as hero reveal is integrated into main timeline

// Transition from explosion to background particles
function transitionToBackgroundParticles() {

    // Update the main tsParticles container to show particles
    if (window.tsParticles && tsParticles.domItem(0)) {
        const container = tsParticles.domItem(0);

        // Gradually increase particle count
        let currentCount = 0;
        const targetCount = window.innerWidth < 768 ? 60 : 120;

        const addBatch = () => {
            if (currentCount < targetCount) {
                const batchSize = Math.min(10, targetCount - currentCount);

                for (let i = 0; i < batchSize; i++) {
                    // Simply add particles - let tsParticles handle positioning
                    container.particles.addParticle();
                }

                currentCount += batchSize;
                setTimeout(addBatch, 100);
            }
        };

        addBatch();
    }
}

// SPECTACULAR Enhanced Hero Animation (concurrent with radial reveal)
function animateMainContent() {

    // Create spectacular timeline (3 seconds to match radial reveal)
    const heroTl = gsap.timeline({
        onComplete: () => startHeroContinuousAnimations()
    });

    // 1. Navigation entrance (independent)
    heroTl.fromTo('nav',
        { opacity: 0, y: -30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        }
    );

    // 2. FLOATING ORB - Cosmic manifestation
    heroTl.to('.hero-floating-orb', {
        scale: 1,
        duration: 2.5,
        ease: "elastic.out(1, 0.4)"
    }, 0);

    // 3. TITLE WORDS - Simplified cascade
    heroTl.to('.title-word', {
        scale: 1,
        y: 0,
        duration: 2.0,
        stagger: {
            each: 0.15,
            from: "start"
        },
        ease: "back.out(1.7)"
    }, 0.2);

    // Skip non-existent subtitle and description elements


    // 7. FINAL IMPACT - Title word highlight
    heroTl.to('.word-5', {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
    }, 2.7);

    return heroTl;
}

// Minimal ambient animations for Hero (to avoid transform conflicts)
function startHeroContinuousAnimations() {
    // Only animate the floating orb (no text transforms)
    gsap.to('.hero-floating-orb', {
        scale: 1.1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // CTA button gentle pulse (safe, no conflicting transforms)
    gsap.to('.hero-cta', {
        scale: 1.02,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

// Enhanced hover effects for hero elements
function initHeroHoverEffects() {
    // Title words individual hover
    document.querySelectorAll('.title-word').forEach((word, index) => {
        word.addEventListener('mouseenter', () => {
            gsap.to(word, {
                scale: 1.1,
                rotationY: 10,
                z: 50,
                duration: 0.4,
                ease: "power3.out"
            });
        });

        word.addEventListener('mouseleave', () => {
            gsap.to(word, {
                scale: 1,
                rotationY: 0,
                z: 0,
                duration: 0.4,
                ease: "power3.out"
            });
        });
    });

    // Floating orb interaction
    const floatingOrb = document.querySelector('.hero-floating-orb');
    if (floatingOrb) {
        floatingOrb.addEventListener('mouseenter', () => {
            gsap.to(floatingOrb, {
                scale: 1.3,
                duration: 0.5,
                ease: "power3.out"
            });
        });

        floatingOrb.addEventListener('mouseleave', () => {
            gsap.to(floatingOrb, {
                scale: 1.1,
                duration: 0.5,
                ease: "power3.out"
            });
        });
    }
}

// Initialize enhanced hero hover effects
initHeroHoverEffects();

// Initialize Hero Scroll Effects
function initHeroScrollEffects() {
    // Hero text parallax and fade on scroll
    gsap.to('.hero-title', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        },
        y: -150,
        opacity: 0.3,
        scale: 0.9,
        ease: 'none'
    });

    // Subtitle moves slower (different parallax speed)
    gsap.to('.hero-subtitle', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
        },
        y: -100,
        opacity: 0.5,
        ease: 'none'
    });

    // CTA button moves slowest
    gsap.to('.hero-cta', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8
        },
        y: -80,
        opacity: 0.4,
        scale: 0.95,
        ease: 'none'
    });

    // Floating orb moves in opposite direction for depth
    gsap.to('.hero-floating-orb', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        },
        y: 100,
        scale: 1.3,
        opacity: 0.2,
        ease: 'none'
    });

    // Individual title words staggered parallax
    gsap.to('.title-word', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.8
        },
        y: (i) => -120 - (i * 10), // Each word moves slightly different
        rotationX: (i) => i * 5,
        ease: 'none',
        stagger: 0.1
    });
}

// Initialize hero scroll effects
initHeroScrollEffects();

// Hero title color sweep on scroll (only after explosion completes)
function initHeroTitleSweep() {
    const titleWords = document.querySelectorAll('.hero-title .title-word');

    titleWords.forEach((word, index) => {
        ScrollTrigger.create({
            trigger: word,
            start: "top 80%",
            onEnter: () => {
                // Only animate if explosion has completed
                if (explosionComplete) {
                    // Add staggered delay for each word
                    setTimeout(() => {
                        word.classList.add('animate');
                    }, index * 200); // 200ms delay between each word
                }
            },
            once: true // Only trigger once
        });
    });
}

// Function to enable hero title animations after explosion
function enableHeroTitleAnimations() {
    // Reinitialize ScrollTriggers to check for words already in view
    const titleWords = document.querySelectorAll('.hero-title .title-word');
    titleWords.forEach((word, index) => {
        const rect = word.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // If word is already in view (top 80% threshold), animate it
        if (rect.top < windowHeight * 0.8) {
            setTimeout(() => {
                word.classList.add('animate');
            }, index * 200 + 500); // Extra 500ms delay after explosion
        }
    });
}

// Initialize hero title sweep animation
initHeroTitleSweep();

// Hero title mouseover animations
function initHeroTitleHovers() {
    const titleWords = document.querySelectorAll('.hero-title .title-word');

    titleWords.forEach((word) => {
        let hoverTimeout;
        let isAnimating = false;

        word.addEventListener('mouseenter', () => {
            // Only trigger hover animation if explosion has completed
            if (explosionComplete && !isAnimating) {
                isAnimating = true;

                // Remove existing animation classes
                word.classList.remove('animate', 'hover-animate');

                // Force reflow to ensure class removal takes effect
                word.offsetHeight;

                // Add hover animation class
                word.classList.add('hover-animate');

                // Reset animation flag after animation completes
                hoverTimeout = setTimeout(() => {
                    isAnimating = false;
                }, 1500); // Duration of heroHoverSweep animation
            }
        });

        word.addEventListener('mouseleave', () => {
            // Clear any pending timeout
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }

            // Allow for a brief delay before allowing new hover
            setTimeout(() => {
                isAnimating = false;
            }, 100);
        });
    });
}

// Initialize hero title hover animations
initHeroTitleHovers();

// Initialize tsParticles
(async () => {
    await loadFull(tsParticles);

    await tsParticles.load("tsparticles", {
        background: {
            color: {
                value: "transparent",
            },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "grab",
                },
                resize: true,
            },
            modes: {
                push: {
                    quantity: 4,
                },
                grab: {
                    distance: 140,
                    links: {
                        opacity: 0.8,
                    }
                },
            },
        },
        particles: {
            color: {
                value: ["#7F5AF0", "#00CFFF", "#9F7AFA"],
            },
            links: {
                color: "#7F5AF0",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 0, // Start with 0 particles
            },
            opacity: {
                value: 0.5,
                animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.2,
                    sync: false
                }
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
                animation: {
                    enable: true,
                    speed: 2,
                    minimumValue: 1,
                    sync: false
                }
            },
        },
        detectRetina: true,
    });

    particlesLoaded = true;
    checkLoadingComplete();
})();

// Check if all resources are loaded
function checkLoadingComplete() {
    if (particlesLoaded && document.readyState === 'complete' && !loadingComplete) {
        // Wait a moment for visual effect, then start explosion
        setTimeout(() => {
            createTextExplosion();
            loadingComplete = true;
        }, 1200); // Increased delay for better visual impact
    }
}

// Handle page load
window.addEventListener('load', () => {
    // Additional scroll reset on full page load
    window.scrollTo(0, 0);
    checkLoadingComplete();
});

// Fallback in case particles don't load
setTimeout(() => {
    if (!loadingComplete) {
        createTextExplosion();
        loadingComplete = true;
    }
}, 3000);

// Disable browser scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Prevent content from showing during load
document.addEventListener('DOMContentLoaded', () => {
    // Ensure page starts at top (especially important for mobile)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Hide main content initially
    gsap.set('nav', { opacity: 0 });
    gsap.set('#hero .section-fade-in', { opacity: 1, clipPath: 'circle(0% at 50% 50%)' });
    // Set initial states for enhanced animations (simplified to avoid conflicts)
    gsap.set('.hero-floating-orb', { scale: 0 });
    gsap.set('.title-word', {
        scale: 0.5,
        y: 30,
        transformOrigin: 'center'
    });

});


// Set current year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Mobile menu toggle - removed since navigation is now simplified

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Enhanced smooth scrolling with custom timing
            const targetPosition = target.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000; // 1 second
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            // Easing function for smooth animation
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        }
    });
});

// Keyboard navigation for sections
document.addEventListener('keydown', function(e) {
    const sections = ['hero', 'about', 'product', 'contact'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);

    if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        e.preventDefault();
        document.getElementById(sections[currentIndex + 1]).scrollIntoView({
            behavior: 'smooth'
        });
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        document.getElementById(sections[currentIndex - 1]).scrollIntoView({
            behavior: 'smooth'
        });
    }
});

// Get current section in viewport
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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('.section-fade-in').forEach(section => {
    observer.observe(section);
});

// Show first section immediately
document.querySelector('#hero .section-fade-in').classList.add('visible');

// Make sure all sections are visible by default (remove fade-in behavior for now)
document.querySelectorAll('.section-fade-in').forEach(section => {
    section.classList.add('visible');
});

// Simple Navigation scroll animation
function initNavbarAnimations() {
    const navbar = document.getElementById('navbar');
    let isScrolled = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        if (scrollY > 50 && !isScrolled) {
            // Add scrolled class
            navbar.classList.add('navbar-scrolled');
            isScrolled = true;
        } else if (scrollY <= 50 && isScrolled) {
            // Remove scrolled class
            navbar.classList.remove('navbar-scrolled');
            isScrolled = false;
        }
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateNavbar);

    // Check initial state
    updateNavbar();
}

// Initialize navbar animations
initNavbarAnimations();

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// GSAP Bounce-in effect for 2XP loading text
const animatedText = document.getElementById('loadingText');

if (animatedText) {
    gsap.from(animatedText, {
        scrollTrigger: {
            trigger: animatedText,
            start: "top 85%", // Animation starts when the element enters the viewport
            end: "top 50%",  // End point ensures it doesn't trigger prematurely
            toggleActions: "play none none reset", // Plays animation once and doesn't reset
        },
        y: -200,           // Reduced bounce distance to prevent cutoff
        opacity: 0,       // Fades in as it bounces
        ease: "bounce.out", // Bounce easing for a dynamic effect
        duration: 1.5,    // Total animation duration
    });
}

// OUT-OF-THIS-WORLD GSAP Animations for Artistic "Who We Are" Section
function initArtisticAboutAnimations() {
    const aboutSection = document.querySelector('#about');
    if (!aboutSection) return;

    // Set initial states for existing elements only
    gsap.set('.floating-orb', { scale: 0, opacity: 0 });
    gsap.set('#about .title-main', { scale: 0, rotationX: -90, transformOrigin: 'center bottom' });
    gsap.set('#about .title-sub', { opacity: 0, y: 100, skewX: -20 });
    gsap.set('#about .title-line', { scaleX: 0, transformOrigin: 'center' });

    // Set initial states for about-content elements
    gsap.set('.story-paragraph', { opacity: 0, y: 50, scale: 0.95 });
    gsap.set('.stat-item', { opacity: 0, y: 30, scale: 0.9 });
    gsap.set('.mission-paragraph', { opacity: 0, y: 40, scale: 0.95 });
    gsap.set('.mission-word', { opacity: 0, y: 20, scale: 0.8 });

    // Animation Timeline - Starts early when section comes into view
    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: aboutSection,
            start: "top 95%", // Animation starts when section is 10% visible
            end: "bottom 20%", // Animation ends when section bottom is at 20% of viewport
            scrub: 1
        }
    });

    // Pin Timeline - Pins section when 80% is visible to complete animations (desktop only)
    gsap.timeline({
        scrollTrigger: {
            trigger: aboutSection,
            start: "top 0%", // Pin starts when 90% of section is visible
            end: "+=100%", // Pin duration - equivalent to 100% of viewport height
            pin: window.innerWidth > 768, // Pin only on desktop (screen width > 768px)
            pinSpacing: window.innerWidth > 768, // Add spacing only on desktop
            anticipatePin: 1 // Smooth pin start
        }
    });

    // 1. FLOATING ORBS - Scroll-based entrance (0% - 15% of scroll)
    masterTl.to('.floating-orb', {
        scale: 1,
        opacity: 1,
        duration: 0.15,
        stagger: 0.03,
        ease: "power2.out"
    });

    // 2. TITLE MAIN - Scroll-based entrance (10% - 25% of scroll)
    masterTl.to('#about .title-main', {
        scale: 1,
        rotationX: 0,
        duration: 0.15,
        ease: "power2.out"
    }, 0.1);

    // 3. SUBTITLE - Scroll-based entrance (20% - 35% of scroll)
    masterTl.to('#about .title-sub', {
        opacity: 1,
        y: 0,
        skewX: 0,
        duration: 0.15,
        ease: "power2.out"
    }, 0.2);

    // 4. TITLE LINE - Scroll-based entrance (30% - 40% of scroll)
    masterTl.to('#about .title-line', {
        scaleX: 1,
        duration: 0.1,
        ease: "power2.out"
    }, 0.3);

    // Skip non-existent elements and move to content animations

    // 9. ABOUT CONTENT - Story paragraphs reveal (40% - 60% of scroll)
    masterTl.to('.story-paragraph', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.out"
    }, 0.4);

    // 10. STATS ROW - Stats items cascade (55% - 75% of scroll)
    masterTl.to('.stat-item', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        stagger: 0.08,
        ease: "back.out(1.4)"
    }, 0.55);

    // 11. MISSION STATEMENT - Mission paragraph reveal (70% - 85% of scroll)
    masterTl.to('.mission-paragraph', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.15,
        ease: "power2.out"
    }, 0.7);

    // 12. MISSION WORDS - Word-by-word reveal (75% - 95% of scroll)
    masterTl.to('.mission-word', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        stagger: 0.02,
        ease: "back.out(1.2)"
    }, 0.75);



    // Removed central card hover effects - element doesn't exist
}

// SPECTACULAR GSAP Animations for Product Section
function initArtisticProductAnimations() {
    const productSection = document.querySelector('#product');
    if (!productSection) return;

    // Set initial states for product header elements
    gsap.set('#product .title-main', { scale: 0, rotationX: -90, transformOrigin: 'center bottom' });
    gsap.set('#product .title-sub', { opacity: 0, y: 100, skewX: -20 });
    gsap.set('#product .title-line', { scaleX: 0, transformOrigin: 'center' });

    // Set initial states for Hoopers Hub letters - keep them visible
    gsap.set('.hoopers-letter, .hub-letter', {
        opacity: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        transformOrigin: 'center'
    });

    // Set initial states for content elements only
    gsap.set('#product .product-title', { opacity: 1 }); // Keep title visible for letter animations
    gsap.set('#product .product-description', { opacity: 0, y: 40 });
    gsap.set('#product .feature-card', { opacity: 0, y: 20 });
    gsap.set('#product .product-screenshot', { opacity: 0, y: 30 });


    // Wave Animation - trigger on scroll
    ScrollTrigger.create({
        trigger: ".product-title",
        start: "top 80%",
        onEnter: () => {
            // Create enhanced wave effect
            gsap.to('.hoopers-letter', {
                y: -30,
                scale: 1.1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.inOut(1.7)",
                yoyo: true,
                repeat: 1
            });

            gsap.to('.hub-letter', {
                y: -30,
                scale: 1.1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.inOut(1.7)",
                yoyo: true,
                repeat: 1,
                delay: 0.4
            });
        }
    });

    // Simple Animation Timeline for other content
    const productTl = gsap.timeline({
        scrollTrigger: {
            trigger: productSection,
            start: "top 85%",
            end: "bottom 20%",
            scrub: 1
        }
    });

    // Product header animations
    productTl.to('#product .title-main', {
        scale: 1,
        rotationX: 0,
        duration: 0.15,
        ease: "power2.out"
    }, 0)
    .to('#product .title-sub', {
        opacity: 1,
        y: 0,
        skewX: 0,
        duration: 0.15,
        ease: "power2.out"
    }, 0.05)
    .to('#product .title-line', {
        scaleX: 1,
        duration: 0.1,
        ease: "power2.out"
    }, 0.1)
    .to('#product .product-description', {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out"
    }, 0.05)
    .to('#product .feature-card', {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.03,
        ease: "power2.out"
    }, 0.1)
    .to('#product .product-screenshot', {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out"
    }, 0.15);


    // SPECTACULAR Hoopers Hub letter hover effects
    document.querySelectorAll('.hoopers-letter, .hub-letter').forEach((letter, index) => {
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

    // SIMPLIFIED HOVER EFFECTS (scoped to #product)
    document.querySelectorAll('#product .feature-card').forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -5,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

}

// Contact section artistic animations
function initArtisticContactAnimations() {
    const contactSection = document.querySelector('#contact');
    if (!contactSection) return;

    // Set initial states for all elements
    gsap.set('.contact-orb-1, .contact-orb-2, .contact-orb-3', { scale: 0, opacity: 0 });

    // Contact header elements - use scoped selectors
    gsap.set('#contact .title-main', { scale: 0, rotationX: -90, transformOrigin: 'center bottom' });
    gsap.set('#contact .title-sub', { opacity: 0, y: 100, skewX: -20 });
    gsap.set('#contact .title-line', { scaleX: 0, transformOrigin: 'center' });

    // Set initial states for contact-content elements (scoped to #contact)
    gsap.set('#contact .contact-content', { opacity: 0, y: 50, scale: 0.95 });
    gsap.set('#contact .central-contact-card', { opacity: 0, y: 30, scale: 0.95 });
    gsap.set('#contact .contact-description', { opacity: 0, y: 30, scale: 0.95 });
    gsap.set('#contact .contact-button', { opacity: 0, y: 40, scale: 0.95 });
    gsap.set('#contact .vision-word', { opacity: 0, y: 20, scale: 0.8 });

    // Animation Timeline - Starts early when section comes into view
    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: contactSection,
            start: "top 85%", // Animation starts when section is 15% visible
            end: "bottom 20%", // Animation ends when section top is at 30% of viewport
            scrub: 1, // Smooth scrubbing tied to scroll position
            immediateRender: false,
            onToggle: self => {
                if (self.isActive) {
                    startContactContinuousAnimations();
                } else {
                    // Stop continuous animations when not active
                    gsap.killTweensOf(['.contact-orb-1', '.contact-orb-2', '.contact-orb-3', '.central-contact-card']);
                }
            }
        }
    });

    // Pin Timeline - Pins section when 90% is visible to complete animations (desktop only)
    gsap.timeline({
        scrollTrigger: {
            trigger: contactSection,
            start: "top 0%", // Pin starts when 90% of section is visible
            end: "+=100%", // Pin duration - equivalent to 100% of viewport height
            pin: window.innerWidth > 768, // Pin only on desktop (screen width > 768px)
            pinSpacing: window.innerWidth > 768, // Add spacing only on desktop
            anticipatePin: 1 // Smooth pin start
        }
    });

    // 1. FLOATING ORBS - Scroll-based entrance (0% - 10% of scroll)
    contactTl.to('.contact-orb-1, .contact-orb-2, .contact-orb-3', {
        scale: 1,
        opacity: 1,
        duration: 0.1,
        stagger: 0.02,
        ease: "power2.out"
    });

    // 2. TITLE MAIN - Scroll-based entrance (consistent with other sections)
    contactTl.to('#contact .title-main', {
        scale: 1,
        rotationX: 0,
        duration: 0.15,
        ease: "power2.out"
    }, 0);

    // 3. TITLE SUB - Overlaps with main title (consistent timing)
    contactTl.to('#contact .title-sub', {
        opacity: 1,
        y: 0,
        skewX: 0,
        duration: 0.15,
        ease: "power2.out"
    }, 0.05);

    // 4. TITLE LINE - Scroll-based entrance (wait for subtitle to finish)
    contactTl.to('#contact .title-line', {
        scaleX: 1,
        duration: 0.1,
        ease: "power2.out"
    }, 0.2);

    // 5. CONTACT CONTENT CONTAINER - Animate after header completes
    contactTl.to('#contact .contact-content', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
    }, 0.2)

    // 6. CENTRAL CONTACT CARD - Animate with container
    .to('#contact .central-contact-card', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
    }, 0.2)

    // 7. CONTENT - All content animates with container
    .to('#contact .contact-description', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
    }, 0.2)
    .to('#contact .contact-button', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
    }, 0.2);

    // 8. VISION WORDS - Animate after content
    contactTl.to('#contact .vision-word', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.1,
        stagger: 0.02,
        ease: "power2.out"
    }, 0.3);

    // Fallback animation to ensure completion when section is fully visible
    gsap.timeline({
        scrollTrigger: {
            trigger: contactSection,
            start: "top 50%",
            onEnter: () => {
                // Force complete all contact animations if they're not already at 100%
                gsap.to('#contact .contact-content, #contact .central-contact-card, #contact .contact-description, #contact .contact-button', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
                gsap.to('#contact .title-main', {
                    scale: 1,
                    rotationX: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
                gsap.to('#contact .title-sub', {
                    opacity: 1,
                    y: 0,
                    skewX: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
                gsap.to('#contact .title-line', {
                    scaleX: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
                gsap.to('#contact .vision-word', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        }
    });

    // Continuous animations function for contact orbs
    function startContactContinuousAnimations() {
        // Floating orbs gentle movement
        gsap.to('.contact-orb-1', {
            x: -40,
            y: 30,
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to('.contact-orb-2', {
            x: 30,
            y: -25,
            duration: 11,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to('.contact-orb-3', {
            x: 25,
            y: 20,
            duration: 13,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}

// Initialize the artistic animations
initArtisticAboutAnimations();
initArtisticProductAnimations();
initArtisticContactAnimations();