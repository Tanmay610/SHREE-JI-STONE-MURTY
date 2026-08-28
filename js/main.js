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

    // --- Collections Page Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.catalog-grid .product-card');

    if (filterBtns.length > 0 && productCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                productCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Hero Swiper Slider ---
    const sliderData = [
        { "src": "images/hero_bg.jpg", "title": "Divine", "highlight": "Craftsmanship", "subtitle": "Explore our exquisite collection of premium white marble god statues, intricately carved pink stone temples, and exclusive home decor." },
        { "src": "images/ganesh ji 11.jpg", "title": "Divine", "highlight": "Ganesh murtys", "subtitle": "Intricately detailed premium marble murtys crafted with devotion and precision." },
        { "src": "images/shiv ji 08.jpg", "title": "Exquisite", "highlight": "Shiv Ji Statues", "subtitle": "Mesmerizing representations of divine energy, featuring handcrafted details." },
        { "src": "images/fountain 03.jpg", "title": "Majestic", "highlight": "Stone Fountains", "subtitle": "Elegant stone water features designed to bring tranquility to your outdoor spaces." }
    ];
    const wrapper = document.getElementById('hero-slider-wrapper');
    const titleEl = document.getElementById('hero-dynamic-title');
    const subtitleEl = document.getElementById('hero-dynamic-subtitle');
    const contentInner = document.querySelector('.hero-content-inner');

    if (wrapper && sliderData.length > 0) {
        sliderData.forEach(data => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.style.backgroundImage = `url('${data.src}')`;
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
            wrapper.appendChild(slide);
        });

        const heroSwiper = new Swiper('.hero-swiper', {
            effect: 'fade',
            fadeEffect: { crossFade: true },
            loop: true,
            speed: 1500,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                slideChange: function () {
                    const activeIndex = this.realIndex;
                    const data = sliderData[activeIndex];

                    contentInner.style.opacity = 0;
                    contentInner.style.transform = 'translateY(10px)';

                    setTimeout(() => {
                        titleEl.innerHTML = `${data.title}<br><span class="text-highlight">${data.highlight}</span>`;
                        subtitleEl.textContent = data.subtitle;

                        contentInner.style.transition = 'all 0.8s ease';
                        contentInner.style.opacity = 1;
                        contentInner.style.transform = 'translateY(0)';
                    }, 400);
                }
            }
        });
    }

    // --- Gallery Swiper Slider ---
    const galleryData = [
        { "src": "images/fountain 01.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 02.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 03.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 04.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 06.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 07.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 08.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 09.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 10.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 11.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 12.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 13.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 14.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 15.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 16.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 17.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 18.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 19.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 20.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 21.jpg", "title": "Stone Fountains" },
        { "src": "images/fountain 22.jpg", "title": "Stone Fountains" },
        { "src": "images/fountin 05.jpg", "title": "Stone Fountains" },
        { "src": "images/ganesh ji 01.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 02.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 03.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 04.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 05.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 06.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 07.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 08.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 09.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 10.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 11.jpg", "title": "Ganesh murtys" },
        { "src": "images/ganesh ji 12.jpg", "title": "Ganesh murtys" },
        { "src": "images/shiv ji 01.png", "title": "Shiv Ji Statues" },
        { "src": "images/shiv ji 02.jpg", "title": "Shiv Ji Statues" },
        { "src": "images/shiv ji 03.jpg", "title": "Shiv Ji Statues" },
        { "src": "images/shiv ji 04.jpg", "title": "Shiv Ji Statues" },
        { "src": "images/shiv ji 05.jpg", "title": "Shiv Ji Statues" },
        { "src": "images/shiv ji 06.jpg", "title": "Shiv Ji Statues" },
        { "src": "images/shiv ji 07.jpg", "title": "Shiv Ji Statues" },
        { "src": "images/shiv ji 08.jpg", "title": "Shiv Ji Statues" },
        { "src": "images/shiv ji 09.png", "title": "Shiv Ji Statues" },
        { "src": "images/shiv ji 10.jpg", "title": "Shiv Ji Statues" }
    ];
    const galleryWrapper = document.getElementById('gallery-slider-wrapper');

    if (galleryWrapper && galleryData.length > 0) {
        galleryData.forEach(data => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            const img = document.createElement('img');
            img.src = data.src;
            img.alt = data.title;
            img.loading = 'lazy';

            slide.appendChild(img);
            galleryWrapper.appendChild(slide);
        });

        new Swiper('.gallery-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.gallery-swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
            }
        });
    }
});