/**
 * SQLite Deep Dive - JavaScript Functionality
 * Provides interactive features for the documentation site
 */

// ===================================
// Dark Mode Toggle
// ===================================

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeToggle.querySelector('i');

    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        updateDarkModeIcon(icon, true);
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isNowDark = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isNowDark);
        updateDarkModeIcon(icon, isNowDark);
    });
}

function updateDarkModeIcon(icon, isDark) {
    if (isDark) {
        icon.classList.remove('bi-moon-stars');
        icon.classList.add('bi-sun');
    } else {
        icon.classList.remove('bi-sun');
        icon.classList.add('bi-moon-stars');
    }
}

// ===================================
// Back to Top Button
// ===================================

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Smooth Scroll for Navigation Links
// ===================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore empty anchors
            if (href === '#' || href === '#!') {
                return;
            }

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }

                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// Active Navigation Highlight
// ===================================

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .sticky-toc .nav-link');

    function highlightNavigation() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Update on scroll
    window.addEventListener('scroll', highlightNavigation);
    
    // Initial highlight
    highlightNavigation();
}

// ===================================
// Accordion State Management
// ===================================

function initAccordionState() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const accordionId = accordion.getAttribute('id');
        
        if (!accordionId) return;

        // Load saved state
        const savedState = localStorage.getItem(`accordion_${accordionId}`);
        
        if (savedState) {
            try {
                const openItems = JSON.parse(savedState);
                openItems.forEach(itemId => {
                    const item = document.getElementById(itemId);
                    if (item && item.classList.contains('collapse')) {
                        item.classList.add('show');
                        const button = document.querySelector(`[data-bs-target="#${itemId}"]`);
                        if (button) {
                            button.classList.remove('collapsed');
                        }
                    }
                });
            } catch (e) {
                console.error('Error loading accordion state:', e);
            }
        }

        // Save state on change
        accordion.addEventListener('shown.bs.collapse', function() {
            saveAccordionState(accordionId);
        });

        accordion.addEventListener('hidden.bs.collapse', function() {
            saveAccordionState(accordionId);
        });
    });
}

function saveAccordionState(accordionId) {
    const accordion = document.getElementById(accordionId);
    if (!accordion) return;

    const openItems = [];
    accordion.querySelectorAll('.collapse.show').forEach(item => {
        openItems.push(item.getAttribute('id'));
    });

    localStorage.setItem(`accordion_${accordionId}`, JSON.stringify(openItems));
}

// ===================================
// Reading Progress Indicator
// ===================================

function initReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.id = 'readingProgress';
    progressBar.style.cssText = `
        position: fixed;
        top: 56px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        z-index: 1040;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ===================================
// Tooltip Initialization
// ===================================

function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// ===================================
// Code Copy Functionality
// ===================================

function initCodeCopy() {
    // Add copy buttons to code blocks
    document.querySelectorAll('code').forEach(codeBlock => {
        // Skip if already has a copy button
        if (codeBlock.parentElement.classList.contains('code-wrapper')) {
            return;
        }

        // Only add to code blocks with meaningful content
        if (codeBlock.textContent.length < 10) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper position-relative d-inline-block';
        codeBlock.parentNode.insertBefore(wrapper, codeBlock);
        wrapper.appendChild(codeBlock);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-sm btn-outline-secondary copy-btn';
        copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
        copyBtn.style.cssText = 'position: absolute; top: -5px; right: -5px; display: none;';
        
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                copyBtn.innerHTML = '<i class="bi bi-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                }, 2000);
            });
        });

        wrapper.appendChild(copyBtn);

        // Show copy button on hover
        wrapper.addEventListener('mouseenter', () => {
            copyBtn.style.display = 'block';
        });

        wrapper.addEventListener('mouseleave', () => {
            copyBtn.style.display = 'none';
        });
    });
}

// ===================================
// Print Functionality
// ===================================

function initPrintButton() {
    // Add print button to navigation
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
        const printLi = document.createElement('li');
        printLi.className = 'nav-item d-none d-lg-block';
        printLi.innerHTML = `
            <button class="btn btn-outline-light btn-sm ms-2" id="printBtn" title="Print">
                <i class="bi bi-printer"></i>
            </button>
        `;
        navbarNav.appendChild(printLi);

        document.getElementById('printBtn').addEventListener('click', function() {
            window.print();
        });
    }
}

// ===================================
// Search Functionality
// ===================================

function initSearch() {
    // This is a placeholder for future search implementation
    // Could integrate with libraries like Fuse.js for client-side search
    console.log('Search functionality initialized (placeholder)');
}

// ===================================
// Analytics (Placeholder)
// ===================================

function initAnalytics() {
    // Track page views, clicks, etc.
    // Placeholder for analytics integration
    console.log('Analytics initialized (placeholder)');
}

// ===================================
// Performance Monitoring
// ===================================

function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${pageLoadTime}ms`);
            }, 0);
        });
    }
}

// ===================================
// Accessibility Enhancements
// ===================================

function initAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#architecture';
    skipLink.className = 'skip-link position-absolute';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        top: -40px;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px;
        z-index: 100;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add ARIA labels where needed
    document.querySelectorAll('.card').forEach((card, index) => {
        if (!card.hasAttribute('aria-label')) {
            const heading = card.querySelector('h5, h6');
            if (heading) {
                card.setAttribute('aria-label', heading.textContent);
            }
        }
    });
}

// ===================================
// Error Handling
// ===================================

function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.message);
        // Could send to error tracking service
    });
}

// ===================================
// Initialize All Features
// ===================================

function init() {
    // Core features
    initDarkMode();
    initBackToTop();
    initSmoothScroll();
    initActiveNavigation();
    initAccordionState();
    initReadingProgress();
    
    // Enhanced features
    initTooltips();
    initCodeCopy();
    initPrintButton();
    initAccessibility();
    
    // Monitoring and analytics
    logPerformance();
    initErrorHandling();
    
    console.log('SQLite Deep Dive website initialized successfully');
}

// ===================================
// Execute on DOM Ready
// ===================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===================================
// Export for potential module usage
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        initDarkMode,
        initBackToTop,
        initSmoothScroll
    };
}
