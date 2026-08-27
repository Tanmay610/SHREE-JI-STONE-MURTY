document.addEventListener('DOMContentLoaded', () => {
    // --- Luxury Scroll Animations ---
    const animateTargets = document.querySelectorAll(`
        section h2, 
        .section > .container > p, 
        .product-card, 
        .contact-card, 
        .footer-grid > div,
        .about-container > div,
        .inquiry-form-container,
        .inquiry-map,
        .features-list li,
        .hero-buttons,
        .order-step-card
    `);
    
    // Auto-inject the animation class
    animateTargets.forEach(el => el.classList.add('animate-on-scroll'));

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once it has animated in
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Side Drawer Mobile Menu ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinksContainer) {
        // Inject Menu Header
        const menuHeader = document.createElement('div');
        menuHeader.className = 'mobile-menu-header';
        menuHeader.innerHTML = '<h3>My Menu</h3><button class="close-menu-btn" aria-label="Close menu">&times;</button>';
        navLinksContainer.insertBefore(menuHeader, navLinksContainer.firstChild);

        // Inject Overlay
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);

        const closeBtn = menuHeader.querySelector('.close-menu-btn');

        const openMenu = () => {
            navLinksContainer.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            navLinksContainer.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        mobileMenuBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        // Close menu on link click with a slight delay
        // This ensures mobile browsers register the navigation before the menu moves
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 150);
            });
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const hashIndex = href.indexOf('#');
            if (hashIndex === -1) return;
            
            const targetId = href.substring(hashIndex);
            if (targetId === '#') return;
            
            // Only intercept if the target element exists on the current page
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // If it's a link to another page (e.g. index.html#products) but we are on index.html,
                // we want to scroll. If we are on about.html and click index.html#contact, 
                // it might scroll to about's footer. To be fully correct, check pathname:
                const pathParts = href.split('#')[0];
                const currentPath = window.location.pathname;
                
                // Only scroll if path is empty (just '#...') or matches current page
                if (pathParts !== '' && !currentPath.endsWith(pathParts) && !(currentPath.endsWith('/') && pathParts === 'index.html')) {
                    return; // Let browser navigate to the other page
                }

                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state in nav
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                if (this.classList.contains('active') === false && this.closest('.nav-links')) {
                     this.classList.add('active');
                }
            }
        });
    });

    // Intersection Observer for active nav links based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
