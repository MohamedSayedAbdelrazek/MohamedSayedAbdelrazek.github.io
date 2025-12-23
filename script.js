/* ====================================
   Mohamed Sayed - Portfolio JavaScript
   Interactive Features & Animations
   Premium Experience v2.0
   ==================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initLoadingScreen();
    initScrollProgress();
    initNavigation();
    initThemeToggle();
    initParticlesLight(); // Optimized particles
    initTypingAnimation();
    initCounterAnimation();
    initVideoModal();
    initBackToTop();
    initAOS();
    initLazyLoading();
    // Disabled heavy effects for better performance:
    // initTiltEffect();
    // initMagneticButtons();
    initSmoothReveal();
    initSkillHover();
});

/* ====================================
   Loading Screen
   ==================================== */
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;

    // Update current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Hide loading screen after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Enable scroll after loading
            document.body.style.overflow = '';
        }, 500);
    });

    // Fallback: hide after 3 seconds max
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = '';
    }, 3000);
}

/* ====================================
   Scroll Progress Bar
   ==================================== */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

/* ====================================
   Navigation
   ==================================== */
function initNavigation() {
    const nav = document.querySelector('nav');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = navLinks?.querySelectorAll('a');

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show on scroll direction (optional)
        // if (currentScroll > lastScroll && currentScroll > 500) {
        //     nav.style.transform = 'translateY(-100%)';
        // } else {
        //     nav.style.transform = 'translateY(0)';
        // }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');

            // Toggle body scroll
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        navLinksItems?.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefValue = this.getAttribute('href');
            if (hrefValue === '#') return;

            e.preventDefault();
            const target = document.querySelector(hrefValue);
            if (target) {
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksItems?.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ====================================
   Theme Toggle
   ==================================== */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        // Add transition effect
        document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

/* ====================================
   Particle Effect - OPTIMIZED for Performance
   ==================================== */
function initParticlesLight() {
    const container = document.querySelector('.particles-container');
    if (!container) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // REDUCED particle count for better performance
    const particleCount = window.innerWidth < 768 ? 8 : 15;

    for (let i = 0; i < particleCount; i++) {
        createParticleLight(container, i);
    }
}

function createParticleLight(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties - simplified
    const size = Math.random() * 3 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 15 + 20; // Slower = less CPU

    // Fewer color options
    const colors = ['#00d4ff', '#7b2ff7', '#f107a3'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        background: ${color};
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: 0.4;
    `;

    container.appendChild(particle);
}

/* ====================================
   Typing Animation
   ==================================== */
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const phrases = [
        'Software Engineer',
        'Back-end Developer',
        'Laravel Expert',
        'Problem Solver',
        'Competitive Programmer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let timeout = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentPhrase.length) {
            timeout = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            timeout = 500;
        }

        setTimeout(type, timeout);
    }

    // Start typing after a delay
    setTimeout(type, 1000);
}

/* ====================================
   Counter Animation
   ==================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/^(\d+(\.\d+)?)/);

    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = text.replace(match[1], '');
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;
    const isDecimal = text.includes('.');

    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        current = Math.min(target, increment * step);

        if (isDecimal) {
            element.textContent = current.toFixed(2) + suffix;
        } else {
            element.textContent = Math.floor(current) + suffix;
        }

        if (step >= steps) {
            element.textContent = text; // Ensure exact final value
            clearInterval(timer);
        }
    }, stepTime);
}

/* ====================================
   Video Modal
   ==================================== */
function initVideoModal() {
    const modal = document.getElementById('videoModal');
    if (!modal) return;

    const modalIframe = modal.querySelector('iframe');
    const modalPlaceholder = modal.querySelector('.video-placeholder');
    const modalClose = document.getElementById('modalClose');
    const liveDemoLinks = document.querySelectorAll('.live-demo');

    // Open modal
    liveDemoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const videoUrl = link.getAttribute('data-video');
            const placeholderUrl = link.getAttribute('data-placeholder');

            if (videoUrl) {
                modalIframe.src = videoUrl + '?autoplay=1&enablejsapi=1';
            }
            if (placeholderUrl && modalPlaceholder) {
                modalPlaceholder.src = placeholderUrl;
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (modalPlaceholder) {
                modalPlaceholder.style.display = 'none';
            }
        });
    });

    // Close modal functions
    function closeModal() {
        modal.classList.remove('active');
        modalIframe.src = '';
        document.body.style.overflow = '';
        if (modalPlaceholder) {
            modalPlaceholder.style.display = 'none';
        }
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ====================================
   Back to Top Button
   ==================================== */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ====================================
   AOS Initialization
   ==================================== */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic',
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }
}

/* ====================================
   Lazy Loading Images
   ==================================== */
function initLazyLoading() {
    // Using native lazy loading with fallback
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback with Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

/* ====================================
   Utility Functions
   ==================================== */

// Debounce function
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit = 100) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ====================================
   Performance Optimizations
   ==================================== */

// Optimize scroll events - minimal handler
window.addEventListener('scroll', throttle(() => {
    // Scroll handler kept minimal for performance
}, 100), { passive: true });

// Resize handler - disabled particle recreation for performance
// Particles will stay as-is on resize

/* ====================================
   Error Handling
   ==================================== */
window.addEventListener('error', (e) => {
    console.warn('Resource loading error:', e.target?.src || e.message);
});

/* ====================================
   Service Worker Registration (PWA Ready)
   ==================================== */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

console.log('%c👋 Hello Fellow Developer!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%c🚀 Built with passion by Mohamed Sayed', 'color: #7b2ff7; font-size: 14px;');

/* ====================================
   Tilt Effect for Cards - Premium 3D
   ==================================== */
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .certification-card, .skill-category, .stat-item');

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return; // Disable on mobile

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}

/* ====================================
   Magnetic Buttons Effect
   ==================================== */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .social-link, .nav-cv-btn');

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return; // Disable on mobile

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

/* ====================================
   Smooth Reveal Animation
   ==================================== */
function initSmoothReveal() {
    const revealElements = document.querySelectorAll('.section-title, .section-subtitle, .project-card, .certification-card');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal-item');
        revealObserver.observe(el);
    });

    // Add styles for reveal animation
    if (!document.querySelector('#reveal-styles')) {
        const style = document.createElement('style');
        style.id = 'reveal-styles';
        style.textContent = `
            .reveal-item {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .reveal-item.revealed {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

/* ====================================
   Enhanced Skill Hover Effect
   ==================================== */
function initSkillHover() {
    const skillTags = document.querySelectorAll('.skill-tag');

    skillTags.forEach((tag, index) => {
        // Add stagger animation delay
        tag.style.animationDelay = `${index * 0.05}s`;

        // Random color on hover
        tag.addEventListener('mouseenter', () => {
            const colors = ['#00d4ff', '#7b2ff7', '#f107a3', '#00f5a0', '#ff6b35'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            tag.style.setProperty('--hover-color', randomColor);
            tag.style.boxShadow = `0 0 20px ${randomColor}40`;
        });

        tag.addEventListener('mouseleave', () => {
            tag.style.boxShadow = '';
        });
    });
}

/* ====================================
   Enhanced Active Link Detection
   ==================================== */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// Initialize active link detection
updateActiveNavLink();

/* ====================================
   Touch Device Optimizations
   ==================================== */
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
    document.body.classList.add('touch-device');

    // Add touch-specific styles
    const touchStyles = document.createElement('style');
    touchStyles.textContent = `
        .touch-device .project-image-overlay {
            opacity: 1;
            background: linear-gradient(transparent 60%, rgba(0, 0, 0, 0.8));
        }
        .touch-device .overlay-btn {
            transform: scale(0.9);
        }
    `;
    document.head.appendChild(touchStyles);
}

/* ====================================
   Keyboard Navigation Enhancement
   ==================================== */
document.addEventListener('keydown', (e) => {
    // Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        // Only if not typing in an input
        if (document.activeElement.tagName !== 'INPUT' &&
            document.activeElement.tagName !== 'TEXTAREA') {
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) themeToggle.click();
        }
    }

    // Press 'Home' to go to top
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Press 'End' to go to bottom
    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

/* ====================================
   Performance Monitoring (Dev Only)
   ==================================== */
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`%c⚡ Page load time: ${loadTime}ms`, 'color: #00f5a0; font-size: 12px;');
    });
}
