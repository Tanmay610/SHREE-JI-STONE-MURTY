class CoverFlowCarousel {
    constructor(container, options = {}) {
        this.container = container;
        this.items = options.items || [];
        this.sectionLabel = options.sectionLabel || "OUR PREMIUM COLLECTION";
        this.autoplay = options.autoplay !== undefined ? options.autoplay : true;
        this.autoplayDelay = options.autoplayDelay || 3000;
        
        this.currentIndex = 0;
        this.isHovered = false;
        this.touchStartX = 0;
        this.total = this.items.length;
        this.interval = null;

        if (this.total === 0) return;
        this.initDOM();
        this.bindEvents();
        this.startAutoplay();
        this.update();
    }

    initDOM() {
        // Base styling for container
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.minHeight = '760px';
        this.container.style.display = 'flex';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.overflow = 'hidden';
        this.container.style.padding = '3rem 0';
        this.container.style.userSelect = 'none';
        this.container.style.backgroundColor = 'transparent';
        this.container.style.color = '#101317';

        // Background Ambience removed for cleaner look

        // Content Wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.style.position = 'relative';
        contentWrapper.style.width = '100%';
        contentWrapper.style.maxWidth = '1152px';
        contentWrapper.style.margin = '0 auto';
        contentWrapper.style.padding = '0 1rem';
        contentWrapper.style.zIndex = '10';
        contentWrapper.style.display = 'flex';
        contentWrapper.style.flexDirection = 'column';
        contentWrapper.style.alignItems = 'center';

        // Eyebrow
        if (this.sectionLabel) {
            const eyebrow = document.createElement('div');
            eyebrow.style.display = 'flex';
            eyebrow.style.alignItems = 'center';
            eyebrow.style.gap = '12px';
            eyebrow.style.marginBottom = '2rem';
            eyebrow.innerHTML = `
                <span style="width: 36px; height: 1px; background: linear-gradient(90deg, transparent, #c5a880)"></span>
                <h3 style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: #c5a880; margin: 0;">
                    ${this.sectionLabel}
                </h3>
                <span style="width: 36px; height: 1px; background: linear-gradient(90deg, #c5a880, transparent)"></span>
            `;
            contentWrapper.appendChild(eyebrow);
        }

        // 3D Stage
        this.stage = document.createElement('div');
        this.stage.style.position = 'relative';
        this.stage.style.width = '100%';
        this.stage.style.height = '520px';
        this.stage.style.display = 'flex';
        this.stage.style.justifyContent = 'center';
        this.stage.style.alignItems = 'center';
        this.stage.style.marginBottom = '2rem';
        this.stage.style.perspective = '1400px';

        this.cards = [];
        this.items.forEach((item, idx) => {
            const card = document.createElement('div');
            card.style.position = 'absolute';
            card.style.borderRadius = '18px';
            card.style.overflow = 'hidden';
            card.style.backgroundColor = '#ffffff';
            card.style.border = '1px solid rgba(0, 0, 0, 0.08)';
            card.style.transformOrigin = 'center center';
            card.style.transition = 'all 800ms cubic-bezier(0.25, 1, 0.5, 1)';
            card.innerHTML = `
                <img src="${item.img}" alt="${item.titleLine1 || ''}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" />
                <div class="card-content" style="position: absolute; inset: 0; pointer-events: none; z-index: 20; transition: opacity 500ms ease, transform 500ms ease;">
                    <div style="position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.95); padding: 5px 14px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); backdrop-filter: blur(8px);">
                        <span style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; color: #101317; text-transform: uppercase;">
                            ${item.tag || ''}
                        </span>
                    </div>
                    <div style="position: absolute; bottom: 14px; left: 14px; right: 14px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border-radius: 14px; padding: 20px 14px; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); pointer-events: auto; border: 1px solid rgba(255,255,255,1);">
                        <h2 class="cf-title" style="font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #101317; margin: 0; line-height: 1.2;">
                            ${item.titleLine1 || ''}
                        </h2>
                        ${item.titleLine2 ? `<span style="font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #555; line-height: 1.2;">${item.titleLine2}</span>` : ''}
                        <div style="width: 32px; height: 2px; background-color: #c5a880; border-radius: 2px; margin: 8px auto 6px; box-shadow: 0 0 8px rgba(197,168,128,0.3);"></div>
                        ${item.desc ? `<p style="font-size: 0.8rem; font-style: italic; color: #555; max-width: 260px; margin: 0 0 14px; line-height: 1.4;">${item.desc}</p>` : ''}
                        <a href="${item.ctaUrl || '#'}" style="display: inline-flex; align-items: center; gap: 6px; padding: 9px 22px; border-radius: 9999px; background: #101317; color: #fff; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 200ms ease, box-shadow 200ms ease;">
                            <span>${item.ctaText || "View Menu"}</span>
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', (e) => {
                if (idx !== this.currentIndex) {
                    e.preventDefault();
                    this.goToSlide(idx);
                } else if (item.ctaUrl === '#') {
                    e.preventDefault();
                }
            });

            this.cards.push(card);
            this.stage.appendChild(card);
        });

        contentWrapper.appendChild(this.stage);

        // Arrows
        const arrowBaseStyle = `position: absolute; top: 50%; transform: translateY(-50%); width: 46px; height: 46px; border-radius: 50%; background-color: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.1); color: #101317; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 40; transition: all 200ms ease;`;
        
        this.prevBtn = document.createElement('button');
        this.prevBtn.style.cssText = arrowBaseStyle + " left: 24px;";
        this.prevBtn.innerHTML = `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>`;
        
        this.nextBtn = document.createElement('button');
        this.nextBtn.style.cssText = arrowBaseStyle + " right: 24px;";
        this.nextBtn.innerHTML = `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>`;
        
        contentWrapper.appendChild(this.prevBtn);
        contentWrapper.appendChild(this.nextBtn);

        // Pagination
        this.pagination = document.createElement('div');
        this.pagination.style.display = 'flex';
        this.pagination.style.alignItems = 'center';
        this.pagination.style.justifyContent = 'center';
        this.pagination.style.gap = '8px';
        this.pagination.style.zIndex = '30';
        
        this.dots = [];
        this.items.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.style.height = '8px';
            dot.style.width = '8px';
            dot.style.borderRadius = '9999px';
            dot.style.border = 'none';
            dot.style.cursor = 'pointer';
            dot.style.transition = 'all 300ms ease';
            dot.addEventListener('click', () => this.goToSlide(idx));
            this.dots.push(dot);
            this.pagination.appendChild(dot);
        });

        contentWrapper.appendChild(this.pagination);
        this.container.appendChild(contentWrapper);
    }

    bindEvents() {
        this.nextSlide = this.nextSlide.bind(this);
        this.prevSlide = this.prevSlide.bind(this);

        this.prevBtn.addEventListener('click', this.prevSlide);
        this.nextBtn.addEventListener('click', this.nextSlide);

        this.container.addEventListener('mouseenter', () => this.isHovered = true);
        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
        });

        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientX - this.touchStartX;
            if (Math.abs(diff) > 45) {
                if (diff < 0) this.nextSlide();
                else this.prevSlide();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
    }

    handleResize() {
        const isMobile = window.innerWidth < 768;
        this.container.style.minHeight = isMobile ? '600px' : '760px';
        this.stage.style.height = isMobile ? '440px' : '520px';
        
        this.cards.forEach(card => {
            card.style.width = isMobile ? '260px' : '330px';
            card.style.height = isMobile ? '400px' : '500px';
            
            const title = card.querySelector('.cf-title');
            if (title) title.style.fontSize = isMobile ? '1.15rem' : '1.35rem';
        });
        
        this.update();
    }

    startAutoplay() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.autoplay && this.total > 1) {
                this.nextSlide();
            }
        }, this.autoplayDelay);
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.total;
        this.update();
        this.startAutoplay(); // Reset timer
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.total) % this.total;
        this.update();
        this.startAutoplay(); // Reset timer
    }

    goToSlide(idx) {
        this.currentIndex = idx % this.total;
        this.update();
        this.startAutoplay(); // Reset timer
    }

    update() {

        const isMobile = window.innerWidth < 768;
        const xOffset1 = isMobile ? 150 : 285;
        const xOffset2 = isMobile ? 260 : 510;
        const scale1 = isMobile ? 0.8 : 0.84;
        const scale2 = isMobile ? 0.6 : 0.68;
        const rot1 = isMobile ? 30 : 24;
        const rot2 = isMobile ? 45 : 38;

        this.cards.forEach((card, idx) => {
            const offset = (idx - this.currentIndex + this.total) % this.total;
            
            let transform = "translateX(0px) scale(0.4) rotateY(0deg)";
            let opacity = 0;
            let zIndex = 0;
            let filter = "none";
            let isCenter = false;

            if (offset === 0) {
                isCenter = true;
                transform = "translateX(0px) scale(1) rotateY(0deg)";
                opacity = 1;
                zIndex = 30;
                filter = "none";
            } else if (offset === 1) {
                transform = `translateX(${xOffset1}px) scale(${scale1}) rotateY(-${rot1}deg)`;
                opacity = 0.8;
                zIndex = 20;
                filter = "none";
            } else if (offset === 2) {
                transform = `translateX(${xOffset2}px) scale(${scale2}) rotateY(-${rot2}deg)`;
                opacity = 0.5;
                zIndex = 10;
                filter = "none";
            } else if (offset === this.total - 1) {
                transform = `translateX(-${xOffset1}px) scale(${scale1}) rotateY(${rot1}deg)`;
                opacity = 0.8;
                zIndex = 20;
                filter = "none";
            } else if (offset === this.total - 2) {
                transform = `translateX(-${xOffset2}px) scale(${scale2}) rotateY(${rot2}deg)`;
                opacity = 0.5;
                zIndex = 10;
                filter = "none";
            }

            card.style.transform = transform;
            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
            card.style.filter = filter;
            card.style.boxShadow = isCenter 
                ? "0 25px 60px rgba(0,0,0,0.15), 0 0 35px rgba(197,168,128,0.1)" 
                : "0 15px 35px rgba(0,0,0,0.05)";
            card.style.cursor = isCenter ? "default" : "pointer";
            
            const content = card.querySelector('.card-content');
            if (content) {
                content.style.opacity = isCenter ? 1 : 0;
                content.style.transform = isCenter ? "translateY(0px)" : "translateY(16px)";
                content.style.pointerEvents = isCenter ? "auto" : "none";
            }
        });

        this.dots.forEach((dot, idx) => {
            const isActive = idx === this.currentIndex;
            dot.style.width = isActive ? '28px' : '8px';
            dot.style.backgroundColor = isActive ? '#c5a880' : 'rgba(0,0,0,0.15)';
            dot.style.boxShadow = isActive ? '0 0 10px rgba(197,168,128,0.4)' : 'none';
        });
    }
}

window.CoverFlowCarousel = CoverFlowCarousel;
