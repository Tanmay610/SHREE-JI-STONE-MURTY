document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
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
