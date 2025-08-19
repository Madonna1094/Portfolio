// ===== MODERN PORTFOLIO JAVASCRIPT =====
// Author: Alex Johnson
// Description: Interactive functionality for ultra-modern portfolio website

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        typingSpeed: 100,
        deletingSpeed: 50,
        delayBetweenWords: 2000,
        particleCount: 50,
        scrollThreshold: 100,
        animationDuration: 800,
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phoneRegex: /^[\+]?[1-9][\d]{0,15}$/
    };

    // ===== UTILITY FUNCTIONS =====
    const utils = {
        // Debounce function for performance optimization
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function for scroll events
        throttle(func, limit) {
            let inThrottle;
            return function () {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Generate random number between min and max
        random(min, max) {
            return Math.random() * (max - min) + min;
        },

        // Check if element is in viewport
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Animate number counting
        animateNumber(element, start, end, duration) {
            const startTime = performance.now();
            const animate = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const current = Math.floor(progress * (end - start) + start);
                element.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        }
    };

    // ===== LOADER FUNCTIONALITY =====
    class Loader {
        constructor() {
            this.loader = document.getElementById('loader');
            this.init();
        }

        init() {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.hide();
                }, 1000);
            });
        }

        hide() {
            if (this.loader) {
                this.loader.classList.add('hidden');
                setTimeout(() => {
                    this.loader.style.display = 'none';
                }, 500);
            }
        }
    }

    // ===== CUSTOM CURSOR =====
    class CustomCursor {
        constructor() {
            this.cursor = document.querySelector('.cursor');
            this.cursorFollower = document.querySelector('.cursor-follower');
            this.init();
        }

        init() {
            if (!this.cursor || !this.cursorFollower) return;

            // Hide cursor on touch devices
            if ('ontouchstart' in window) {
                this.cursor.style.display = 'none';
                this.cursorFollower.style.display = 'none';
                document.body.style.cursor = 'auto';
                return;
            }

            this.bindEvents();
        }

        bindEvents() {
            // Mouse move event
            document.addEventListener('mousemove', (e) => {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';

                setTimeout(() => {
                    this.cursorFollower.style.left = e.clientX + 'px';
                    this.cursorFollower.style.top = e.clientY + 'px';
                }, 100);
            });

            // Interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, input, textarea, select');

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.style.transform = 'scale(2)';
                    this.cursorFollower.style.transform = 'scale(1.5)';
                });

                el.addEventListener('mouseleave', () => {
                    this.cursor.style.transform = 'scale(1)';
                    this.cursorFollower.style.transform = 'scale(1)';
                });
            });
        }
    }

    // ===== FLOATING PARTICLES =====
    class ParticleSystem {
        constructor() {
            this.container = document.getElementById('particles');
            this.particles = [];
            this.init();
        }

        init() {
            if (!this.container) return;
            this.createParticles();
        }

        createParticles() {
            for (let i = 0; i < CONFIG.particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = utils.random(0, 100) + '%';
                particle.style.animationDelay = utils.random(0, 10) + 's';
                particle.style.animationDuration = utils.random(8, 15) + 's';
                this.container.appendChild(particle);
                this.particles.push(particle);
            }
        }
    }

    // ===== NAVIGATION =====
    class Navigation {
        constructor() {
            this.navbar = document.getElementById('navbar');
            this.hamburger = document.getElementById('hamburger');
            this.navMenu = document.getElementById('navMenu');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.sections = document.querySelectorAll('section[id]');
            this.init();
        }

        init() {
            this.bindEvents();
            this.handleActiveLinks();
            this.handleScroll();
        }

        bindEvents() {
            // Mobile menu toggle
            if (this.hamburger && this.navMenu) {
                this.hamburger.addEventListener('click', () => {
                    this.toggleMobileMenu();
                });
            }

            // Close mobile menu when clicking on links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                    this.handleSmoothScroll(link);
                });
            });

            // Scroll event for navbar styling
            window.addEventListener('scroll', utils.throttle(() => {
                this.handleScroll();
                this.updateActiveNavigation();
            }, 16));
        }

        toggleMobileMenu() {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
        }

        closeMobileMenu() {
            this.navMenu.classList.remove('active');
            this.hamburger.classList.remove('active');
        }

        handleSmoothScroll(link) {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        }

        handleScroll() {
            if (window.scrollY > 50) {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                this.navbar.style.borderBottom = '1px solid rgba(0, 255, 255, 0.2)';
            } else {
                this.navbar.style.background = 'rgba(255, 255, 255, 0.05)';
                this.navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            }
        }

        handleActiveLinks() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleSmoothScroll(anchor);
                });
            });
        }

        updateActiveNavigation() {
            const scrollPosition = window.scrollY + 150;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    }

    // ===== TYPING ANIMATION =====
    class TypingAnimation {
        constructor() {
            this.element = document.getElementById('typingText');
            this.texts = [
                'digital experiences',
                'interactive websites',
                'modern applications',
                'creative solutions',
                'user interfaces',
                'stunning designs'
            ];
            this.textIndex = 0;
            this.charIndex = 0;
            this.isDeleting = false;
            this.init();
        }

        init() {
            if (!this.element) return;
            setTimeout(() => {
                this.type();
            }, 2000);
        }

        type() {
            const currentText = this.texts[this.textIndex];

            if (this.isDeleting) {
                this.element.textContent = currentText.substring(0, this.charIndex - 1);
                this.charIndex--;
            } else {
                this.element.textContent = currentText.substring(0, this.charIndex + 1);
                this.charIndex++;
            }

            let typeSpeed = this.isDeleting ? CONFIG.deletingSpeed : CONFIG.typingSpeed;

            if (!this.isDeleting && this.charIndex === currentText.length) {
                typeSpeed = CONFIG.delayBetweenWords;
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
                typeSpeed = 500;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    // ===== SCROLL ANIMATIONS =====
    class ScrollAnimations {
        constructor() {
            this.observer = null;
            this.init();
        }

        init() {
            this.createObserver();
            this.observeElements();
        }

        createObserver() {
            const options = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, options);
        }

        observeElements() {
            const elements = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
            elements.forEach(el => this.observer.observe(el));
        }
    }

    // ===== COUNTER ANIMATIONS =====
    class CounterAnimations {
        constructor() {
            this.counters = document.querySelectorAll('.stat-number[data-count]');
            this.animated = new Set();
            this.init();
        }

        init() {
            if (this.counters.length === 0) return;
            this.createObserver();
        }

        createObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateCounter(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            });

            this.counters.forEach(counter => observer.observe(counter));
        }

        animateCounter(counter) {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            utils.animateNumber(counter, 0, target, duration);
        }
    }

    // ===== SKILL PROGRESS BARS =====
    class SkillProgressBars {
        constructor() {
            this.skillBars = document.querySelectorAll('.skill-progress-bar');
            this.animated = new Set();
            this.init();
        }

        init() {
            if (this.skillBars.length === 0) return;
            this.createObserver();
        }

        createObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateSkillBar(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            });

            this.skillBars.forEach(bar => observer.observe(bar.closest('.skill-card')));
        }

        animateSkillBar(card) {
            const bars = card.querySelectorAll('.skill-progress-bar');
            bars.forEach((bar, index) => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, index * 200);
            });
        }
    }

    // ===== PROJECT FILTERING =====
    class ProjectFilter {
        constructor() {
            this.filterButtons = document.querySelectorAll('.filter-btn');
            this.projectCards = document.querySelectorAll('.project-card');
            this.init();
        }

        init() {
            if (this.filterButtons.length === 0) return;
            this.bindEvents();
        }

        bindEvents() {
            this.filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.getAttribute('data-filter');
                    this.filterProjects(filter);
                    this.updateActiveButton(button);
                });
            });
        }

        filterProjects(filter) {
            this.projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        }

        updateActiveButton(activeButton) {
            this.filterButtons.forEach(button => {
                button.classList.remove('active');
            });
            activeButton.classList.add('active');
        }
    }

    // ===== PROJECT INTERACTIONS =====
    class ProjectInteractions {
        constructor() {
            this.projectCards = document.querySelectorAll('.project-card');
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            this.projectCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    // Don't trigger if clicking on project links
                    if (e.target.closest('.project-link')) return;

                    this.handleProjectClick(card);
                });

                // Add parallax effect on mouse move
                card.addEventListener('mousemove', (e) => {
                    this.handleMouseMove(card, e);
                });

                card.addEventListener('mouseleave', () => {
                    this.resetCardTransform(card);
                });
            });
        }

        handleProjectClick(card) {
            const title = card.querySelector('.project-title').textContent;
            const description = card.querySelector('.project-description').textContent;

            // Create modal or redirect to project page
            this.showProjectModal(title, description);
        }

        showProjectModal(title, description) {
            // Simple alert for demo - replace with proper modal
            alert(`Project: ${title}\n\n${description}\n\nThis would typically open a detailed project page with live demo, source code, and project details.`);
        }

        handleMouseMove(card, e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        }

        resetCardTransform(card) {
            card.style.transform = '';
        }
    }

    // ===== CONTACT FORM =====
    class ContactForm {
        constructor() {
            this.form = document.getElementById('contactForm');
            this.submitButton = null;
            this.successMessage = document.getElementById('formSuccess');
            this.init();
        }

        init() {
            if (!this.form) return;
            this.submitButton = this.form.querySelector('.btn-submit');
            this.bindEvents();
        }

        bindEvents() {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            // Real-time validation
            const inputs = this.form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        }

        handleSubmit() {
            if (!this.validateForm()) return;

            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            this.setLoading(true);

            // Simulate API call
            setTimeout(() => {
                this.handleSuccess();
                this.setLoading(false);
            }, 2000);
        }

        validateForm() {
            let isValid = true;
            const requiredFields = this.form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                errorMessage = 'This field is required';
                isValid = false;
            }
            // Email validation
            else if (fieldName === 'email' && value && !CONFIG.emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            // Name validation
            else if ((fieldName === 'firstName' || fieldName === 'lastName') && value && value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long';
                isValid = false;
            }
            // Message validation
            else if (fieldName === 'message' && value && value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long';
                isValid = false;
            }

            this.showFieldError(field, errorMessage);
            return isValid;
        }

        showFieldError(field, message) {
            const errorElement = field.parentNode.querySelector('.form-error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.toggle('show', !!message);
            }

            field.style.borderColor = message ? '#ff0080' : '';
        }

        clearFieldError(field) {
            this.showFieldError(field, '');
        }

        setLoading(loading) {
            if (this.submitButton) {
                this.submitButton.classList.toggle('loading', loading);
                this.submitButton.disabled = loading;
            }
        }

        handleSuccess() {
            if (this.successMessage) {
                this.successMessage.classList.add('show');
            }
            this.form.reset();

            setTimeout(() => {
                if (this.successMessage) {
                    this.successMessage.classList.remove('show');
                }
            }, 5000);
        }
    }

    // ===== BACK TO TOP BUTTON =====
    class BackToTop {
        constructor() {
            this.button = document.getElementById('backToTop');
            this.init();
        }

        init() {
            if (!this.button) return;
            this.bindEvents();
        }

        bindEvents() {
            window.addEventListener('scroll', utils.throttle(() => {
                this.toggleVisibility();
            }, 100));

            this.button.addEventListener('click', () => {
                this.scrollToTop();
            });
        }

        toggleVisibility() {
            if (window.scrollY > CONFIG.scrollThreshold) {
                this.button.classList.add('show');
            } else {
                this.button.classList.remove('show');
            }
        }

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // ===== PARALLAX EFFECTS =====
    class ParallaxEffects {
        constructor() {
            this.elements = document.querySelectorAll('.floating-3d');
            this.init();
        }

        init() {
            if (this.elements.length === 0) return;
            this.bindEvents();
        }

        bindEvents() {
            window.addEventListener('scroll', utils.throttle(() => {
                this.updateParallax();
            }, 16));
        }

        updateParallax() {
            const scrolled = window.pageYOffset;

            this.elements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = scrolled * speed;
                const rotation = scrolled * 0.1;

                element.style.transform = `translateY(${yPos}px) rotateY(${rotation}deg)`;
            });
        }
    }

    // ===== EASTER EGGS =====
    class EasterEggs {
        constructor() {
            this.konamiCode = [];
            this.konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
            this.init();
        }

        init() {
            this.bindEvents();
            this.addConsoleMessage();
        }

        bindEvents() {
            document.addEventListener('keydown', (e) => {
                this.handleKonamiCode(e.keyCode);
            });

            // Secret click combination
            let clickCount = 0;
            document.querySelector('.logo').addEventListener('click', () => {
                clickCount++;
                if (clickCount === 5) {
                    this.triggerSecretAnimation();
                    clickCount = 0;
                }
                setTimeout(() => { clickCount = 0; }, 2000);
            });
        }

        handleKonamiCode(keyCode) {
            this.konamiCode.push(keyCode);
            if (this.konamiCode.length > this.konamiSequence.length) {
                this.konamiCode.shift();
            }

            if (this.konamiCode.toString() === this.konamiSequence.toString()) {
                this.triggerKonamiEffect();
                this.konamiCode = [];
            }
        }

        triggerKonamiEffect() {
            document.body.style.animation = 'rainbow 2s infinite';
            alert('🎉 Konami Code activated! You found the easter egg!');

            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }

        triggerSecretAnimation() {
            const elements = document.querySelectorAll('.skill-card, .project-card');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.animation = 'bounce 0.5s ease';
                    setTimeout(() => {
                        el.style.animation = '';
                    }, 500);
                }, index * 100);
            });
        }

        addConsoleMessage() {
            const styles = [
                'color: #00ffff',
                'font-size: 16px',
                'font-weight: bold',
                'text-shadow: 2px 2px 4px rgba(0,0,0,0.5)'
            ].join(';');

            console.log(`%c
        🌟 Welcome to my ultra-modern portfolio!
        
        Built with cutting-edge technologies:
        • Custom CSS animations & effects
        • Interactive JavaScript features
        • Glassmorphism design
        • Particle systems
        • 3D transforms
        • Custom cursor
        • And much more! ✨
        
        Try the Konami Code: ↑↑↓↓←→←→BA
        Or click the logo 5 times quickly!
        
        Want to collaborate? Let's create something amazing together!
        `, styles);
        }
    }

    // ===== PERFORMANCE MONITORING =====
    class PerformanceMonitor {
        constructor() {
            this.init();
        }

        init() {
            this.logPerformanceMetrics();
            this.addImageLazyLoading();
        }

        logPerformanceMetrics() {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;

                    console.log(`%cPage Load Time: ${loadTime}ms`, 'color: #39ff14; font-weight: bold;');

                    // Log to analytics if needed
                    // analytics.track('page_load_time', { duration: loadTime });
                }, 0);
            });
        }

        addImageLazyLoading() {
            const images = document.querySelectorAll('img[loading="lazy"]');

            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            }
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            }
        }
    }

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    class AccessibilityEnhancements {
        constructor() {
            this.init();
        }

        init() {
            this.addKeyboardNavigation();
            this.addAriaLabels();
            this.respectReducedMotion();
            this.addFocusManagement();
        }

        addKeyboardNavigation() {
            // Allow keyboard navigation for custom elements
            const interactiveElements = document.querySelectorAll('.project-card, .skill-card');

            interactiveElements.forEach(el => {
                if (!el.hasAttribute('tabindex')) {
                    el.setAttribute('tabindex', '0');
                }

                el.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        el.click();
                    }
                });
            });
        }

        addAriaLabels() {
            // Add missing aria-labels
            const buttons = document.querySelectorAll('button:not([aria-label])');
            buttons.forEach(button => {
                if (button.textContent.trim()) {
                    button.setAttribute('aria-label', button.textContent.trim());
                }
            });
        }

        respectReducedMotion() {
            // Check for reduced motion preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

            if (prefersReducedMotion.matches) {
                document.body.classList.add('reduced-motion');
            }
        }

        addFocusManagement() {
            // Manage focus for mobile menu
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('navMenu');

            if (hamburger && navMenu) {
                hamburger.addEventListener('click', () => {
                    if (navMenu.classList.contains('active')) {
                        navMenu.querySelector('a').focus();
                    }
                });
            }
        }
    }

    // ===== INITIALIZATION =====
    class Portfolio {
        constructor() {
            this.components = [];
            this.init();
        }

        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initializeComponents();
                });
            } else {
                this.initializeComponents();
            }
        }

        initializeComponents() {
            try {
                // Initialize all components
                this.components = [
                    new Loader(),
                    new CustomCursor(),
                    new ParticleSystem(),
                    new Navigation(),
                    new TypingAnimation(),
                    new ScrollAnimations(),
                    new CounterAnimations(),
                    new SkillProgressBars(),
                    new ProjectFilter(),
                    new ProjectInteractions(),
                    new ContactForm(),
                    new BackToTop(),
                    new ParallaxEffects(),
                    new EasterEggs(),
                    new PerformanceMonitor(),
                    new AccessibilityEnhancements()
                ];

                console.log('✅ Portfolio initialized successfully');

            } catch (error) {
                console.error('❌ Error initializing portfolio:', error);
            }
        }
    }

    // ===== CSS ANIMATIONS (Added dynamically) =====
    const additionalStyles = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-30px); }
            60% { transform: translateY(-15px); }
        }
        
        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;

    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);

    // ===== START APPLICATION =====
    new Portfolio();

})();