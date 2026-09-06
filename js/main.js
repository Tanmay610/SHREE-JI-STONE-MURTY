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

    // --- Stagger: Add delay classes to grid children ---
    const staggerContainers = document.querySelectorAll('.products-grid, .catalog-grid, .order-steps-grid, .footer-grid');
    staggerContainers.forEach(container => {
        const children = container.querySelectorAll('.animate-on-scroll');
        children.forEach((child, i) => {
            child.classList.add(`stagger-${(i % 6) + 1}`);
        });
    });

    // --- Direction Variants for About Section ---
    const aboutLeft = document.querySelector('.about-container > div:first-child');
    const aboutRight = document.querySelector('.about-container > div:last-child');
    if (aboutLeft) aboutLeft.classList.add('anim-left');
    if (aboutRight) aboutRight.classList.add('anim-right');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
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

    // --- Old Side Drawer Mobile Menu (Removed) ---

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
                        card.style.display = '';  // Reset to CSS default (flex)
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // --- Sorting Logic ---
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            // Keep original order for "relevance"
            const originalOrder = Array.from(productCards);

            sortSelect.addEventListener('change', (e) => {
                const sortType = e.target.value;
                const catalogGrid = document.getElementById('catalogGrid');
                
                // Get currently visible cards or all cards to sort
                let cardsArray = Array.from(productCards);

                if (sortType === 'price-asc' || sortType === 'price-desc') {
                    cardsArray.sort((a, b) => {
                        const priceStrA = a.querySelector('.card-price strong')?.textContent || '0';
                        const priceStrB = b.querySelector('.card-price strong')?.textContent || '0';
                        const priceA = parseInt(priceStrA.replace(/[^0-9]/g, '')) || 0;
                        const priceB = parseInt(priceStrB.replace(/[^0-9]/g, '')) || 0;
                        
                        return sortType === 'price-asc' ? priceA - priceB : priceB - priceA;
                    });
                } else {
                    // Relevance - restore original order
                    cardsArray = originalOrder;
                }

                // Re-append to grid in sorted order
                cardsArray.forEach(card => {
                    catalogGrid.appendChild(card);
                });
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Hero 3-Image Auto Slider ---
    const heroAutoSlider = document.querySelector('.hero-auto-slider');
    if (heroAutoSlider && typeof Swiper !== 'undefined') {
        new Swiper('.hero-auto-slider', {
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
            allowTouchMove: false
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
        { "src": "images/shiv ji 10.jpg", "title": "Shiv Ji Statues" },
        { "src": "images/hanumaan ji marble murty 01.jpg", "title": "Hanuman Ji murtys" },
        { "src": "images/hanumaan ji marble murty 02.jpeg", "title": "Hanuman Ji murtys" },
        { "src": "images/hanumaan ji marble murty 03.jpg", "title": "Hanuman Ji murtys" },
        { "src": "images/hanumaan ji marble murty 04.jpg", "title": "Hanuman Ji murtys" },
        { "src": "images/hanumaan ji marble murty 05.jpg", "title": "Hanuman Ji murtys" },
        { "src": "images/hanumaan ji marble murty 06.jpg", "title": "Hanuman Ji murtys" },
        { "src": "images/hanumaan ji marble murty 07.jpg", "title": "Hanuman Ji murtys" },
        { "src": "images/hanumaan ji marble murty 08.jpg", "title": "Hanuman Ji murtys" },
        { "src": "images/hanumaan ji marble murty 09.jpg", "title": "Hanuman Ji murtys" },
        { "src": "images/hanumaan ji marble murty 10.jpg", "title": "Hanuman Ji murtys" },
        { "src": "images/GANGA MAA MARBLE MURTY 01.jpg", "title": "Ganga Maa Murty" },
        { "src": "images/GANGA MAA MARBLE MURTY 02.jpg", "title": "Ganga Maa Murty" },
        { "src": "images/GANGA MAA MARBLE MURTY 03.png", "title": "Ganga Maa Murty" },
        { "src": "images/GANGA MAA MARBLE MURTY 04.jpg", "title": "Ganga Maa Murty" },
        { "src": "images/GANGA MAA MARBLE MURTY 05.jpg", "title": "Ganga Maa Murty" },
        { "src": "images/Lakshmi narayan ji marble murty 01.jpg", "title": "Lakshmi Narayan Ji Murty" },
        { "src": "images/Lakshmi narayan ji marble murty 02 .jpeg.jpg", "title": "Lakshmi Narayan Ji Murty" },
        { "src": "images/Lakshmi narayan ji marble murty 03 .jpeg.jpg", "title": "Lakshmi Narayan Ji Murty" },
        { "src": "images/Lakshmi narayan ji marble murty 04 .jpeg.jpg", "title": "Lakshmi Narayan Ji Murty" },
        { "src": "images/Lakshmi narayan ji marble murty 05.jpeg.jpg", "title": "Lakshmi Narayan Ji Murty" },
        { "src": "images/Lakshmi narayan ji marble murty 06 .jpeg.jpg", "title": "Lakshmi Narayan Ji Murty" },
        { "src": "images/Lakshmi narayan ji marble murty 08 .jpeg.jpg", "title": "Lakshmi Narayan Ji Murty" },
        { "src": "images/Lakshmi narayan ji marble murty 09 .jpeg.jpg", "title": "Lakshmi Narayan Ji Murty" },
        { "src": "images/BHAGWAN PARSHURAM JI MARBLE MURTY 01.jpg", "title": "Parshuram Ji Murty" },
        { "src": "images/BHAGWAN PARSHURAM JI MARBLE MURTY 02.jpg", "title": "Parshuram Ji Murty" },
        { "src": "images/BHAGWAN PARSHURAM JI MARBLE MURTY 03.jpg", "title": "Parshuram Ji Murty" },
        { "src": "images/BHAGWAN PARSHURAM JI MARBLE MURTY 04.jpg", "title": "Parshuram Ji Murty" },
        { "src": "images/BHAGWAN PARSHURAM JI MARBLE MURTY 05.jpg", "title": "Parshuram Ji Murty" },
        { "src": "images/BHAGWAN PARSHURAM JI MARBLE MURTY 06.jpg", "title": "Parshuram Ji Murty" },
        { "src": "images/BHAGWAN PARSHURAM JI MARBLE MURTY 07.jpg", "title": "Parshuram Ji Murty" },
        { "src": "images/BHAGWAN PARSHURAM JI MARBLE MURTY 08.jpg", "title": "Parshuram Ji Murty" },
        { "src": "images/MARBLE BENCH 01.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 02.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 03.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 04.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 05.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 06.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 07.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 08.png", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 09.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 10.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 11.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 12.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 13.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 14.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 15.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 16.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 17.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 18.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 19.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 20.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 21.jpg", "title": "Marble Bench" },
        { "src": "images/MARBLE BENCH 22.jpg", "title": "Marble Bench" }
    ];
    // --- Premium Products Slider (CoverFlow 3D) ---
    const premiumData = [
        { 
            tag: "#Premium", titleLine1: "STONE FOUNTAIN", titleLine2: "– MASTERPIECE",
            desc: "An elegant, hand-carved stone fountain to bring tranquility to your garden or courtyard.",
            img: "images/fountain 04.jpg" 
        },
        { 
            tag: "#Exclusive", titleLine1: "STONE FOUNTAIN", titleLine2: "– LUXURY",
            desc: "A breathtaking centerpiece featuring intricate artisanal detailing.",
            img: "images/fountain 03.jpg" 
        },
        { 
            tag: "#Signature", titleLine1: "STONE FOUNTAIN", titleLine2: "– HERITAGE",
            desc: "Classic Indian stone carving that stands the test of time.",
            img: "images/fountain 11.jpg" 
        },
        { 
            tag: "#Divine", titleLine1: "GANESH MURTY", titleLine2: "– MAKRANA",
            desc: "Intricately detailed pure white Makrana marble Ganesh with subtle gold leaf accents.",
            img: "images/ganesh ji 01.jpg" 
        },
        { 
            tag: "#Divine", titleLine1: "SHIV JI MURTY", titleLine2: "– HAND PAINTED",
            desc: "A mesmerizing representation of Lord Shiva, featuring hand-painted traditional motifs.",
            img: "images/shiv ji 01.png" 
        },
        { 
            tag: "#Divine", titleLine1: "LAKSHMI NARAYAN", titleLine2: "– SACRED",
            desc: "A divine depiction of prosperity and preservation.",
            img: "images/Lakshmi narayan ji marble murty 01.jpg" 
        }
    ];
    
    const coverflowContainer = document.getElementById('coverflow-container');
    if (coverflowContainer && typeof CoverFlowCarousel !== 'undefined') {
        new CoverFlowCarousel(coverflowContainer, {
            items: premiumData,
            sectionLabel: "OUR PREMIUM COLLECTION"
        });
    }

    /* ==========================================================================
       Product Details Modal Logic
       ========================================================================== */
    const productModal = document.getElementById('productModal');
    if (productModal) {
        const modalCloseBtn = productModal.querySelector('.modal-close-btn');
        const modalProductImage = document.getElementById('modalProductImage');
        const modalProductTitle = document.getElementById('modalProductTitle');
        const modalProductSku = document.getElementById('modalProductSku');
        const modalProductPrice = document.getElementById('modalProductPrice');
        const modalProductSize = document.getElementById('modalProductSize');
        const modalProductMaterial = document.getElementById('modalProductMaterial');
        const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');

        // Function to close modal
        const closeModal = () => {
            productModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        };

        modalCloseBtn.addEventListener('click', closeModal);

        // Close on background click
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && productModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Delegate click event to document for dynamically added product cards
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-details-btn');
            if (btn) {
                e.preventDefault();
                const card = btn.closest('.product-card');
                if (card) {
                    // Extract data
                    const title = card.querySelector('h3').textContent;
                    const imgSrc = card.querySelector('img').src;
                    const sku = card.getAttribute('data-sku') || 'N/A';
                    const price = card.getAttribute('data-price') || 'On Request';
                    const size = card.getAttribute('data-size') || 'Customizable';
                    const material = card.getAttribute('data-material') || 'Premium Marble';

                    // Populate modal
                    modalProductTitle.textContent = title;
                    modalProductImage.src = imgSrc;
                    modalProductSku.textContent = sku;
                    modalProductPrice.textContent = price;
                    modalProductSize.textContent = size;
                    modalProductMaterial.textContent = material;

                    // Update WhatsApp link
                    const message = encodeURIComponent(`Hi, I'm inquiring about the ${title} (SKU: ${sku}). Please provide more details.`);
                    modalWhatsappBtn.href = `https://wa.me/918947967791?text=${message}`;

                    // Show modal
                    productModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scroll
                }
            }
        });
    }

    // Grid/List View Toggles
    const btnGrid = document.getElementById('btnGrid');
    const btnList = document.getElementById('btnList');
    const catalogGrid = document.getElementById('catalogGrid');

    if (btnGrid && btnList && catalogGrid) {
        btnGrid.addEventListener('click', () => {
            catalogGrid.classList.remove('list-view');
            btnGrid.classList.add('active');
            btnList.classList.remove('active');
        });

        btnList.addEventListener('click', () => {
            catalogGrid.classList.add('list-view');
            btnList.classList.add('active');
            btnGrid.classList.remove('active');
        });
    }

});