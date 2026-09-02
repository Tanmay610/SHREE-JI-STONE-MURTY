class ImageStreamHero {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        
        this.images = options.images || [];
        this.cards = options.cards || 9;
        this.speed = options.speed || 18;
        this.axis = options.axis || 55;
        
        this.path = {
            perspective: 30,
            cardWidth: 18,
            cardHeight: 25,
            cardRadius: 0.4,
            birthHeight: 2.6,
            exitHeight: 46,
            railBirth: -11,
            railExit: 44,
            fan: 3.3,
            turnBirth: 6,
            turnExit: 28,
            stops: 24,
            ...(options.path || {})
        };

        this.id = Math.random().toString(36).substring(2, 9);
        this.rightName = `ish-r-${this.id}`;
        this.leftName = `ish-l-${this.id}`;
        this.cardClass = `ish-c-${this.id}`;

        this.init();
    }

    generateKeyframes(dir, name, p) {
        const steps = [];
        for (let s = 0; s <= p.stops; s++) {
            const u = s / p.stops;
            const scale = (p.birthHeight / p.cardHeight) * Math.pow(p.exitHeight / p.birthHeight, u);
            const z = p.perspective * (1 - 1 / scale);
            const rail = p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
            const turn = p.turnBirth + (p.turnExit - p.turnBirth) * u;
            steps.push(`${(u * 100).toFixed(2)}%{transform:translate3d(${(dir * rail).toFixed(2)}cqw,0,${z.toFixed(2)}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)}`);
        }
        return `@keyframes ${name}{${steps.join("")}}`;
    }

    init() {
        // Prepare container
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        this.container.style.containerType = 'inline-size';

        // Inject dynamic CSS
        const css = `
            ${this.generateKeyframes(1, this.rightName, this.path)}
            ${this.generateKeyframes(-1, this.leftName, this.path)}
            @media(prefers-reduced-motion:reduce) {
                .${this.cardClass} { animation-play-state: paused; }
            }
        `;
        const styleTag = document.createElement('style');
        styleTag.innerHTML = css;
        this.container.appendChild(styleTag);

        // Build 3D wrapper
        const wrapper = document.createElement('div');
        wrapper.setAttribute('aria-hidden', 'true');
        wrapper.style.pointerEvents = 'none';
        wrapper.style.position = 'absolute';
        wrapper.style.inset = '0';
        wrapper.style.perspective = `${this.path.perspective}cqw`;
        wrapper.style.perspectiveOrigin = `50% ${this.axis}%`;

        const scene = document.createElement('div');
        scene.style.position = 'absolute';
        scene.style.inset = '0';
        scene.style.transformStyle = 'preserve-3d';

        // Generate cards for both rails
        const rails = [
            { dir: 1, name: this.rightName }, 
            { dir: -1, name: this.leftName }
        ];

        rails.forEach(rail => {
            for (let i = 0; i < this.cards; i++) {
                const imgData = this.images[i % Math.max(this.images.length, 1)];
                
                const card = document.createElement('div');
                card.className = `${this.cardClass}`;
                card.style.position = 'absolute';
                card.style.overflow = 'hidden';
                card.style.left = '50%';
                card.style.top = `${this.axis}%`;
                card.style.width = `${this.path.cardWidth}cqw`;
                card.style.height = `${this.path.cardHeight}cqw`;
                card.style.marginLeft = `${-this.path.cardWidth / 2}cqw`;
                card.style.marginTop = `${-this.path.cardHeight / 2}cqw`;
                card.style.borderRadius = `${this.path.cardRadius}cqw`;
                card.style.animation = `${rail.name} ${this.speed}s linear infinite`;
                card.style.animationDelay = `${-(i * this.speed) / this.cards}s`;
                card.style.backfaceVisibility = 'hidden';

                if (imgData) {
                    const img = document.createElement('img');
                    img.src = imgData.src;
                    img.alt = imgData.alt || '';
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.draggable = false;
                    card.appendChild(img);
                }
                
                scene.appendChild(card);
            }
        });

        wrapper.appendChild(scene);
        
        // Ensure the 3D wrapper is prepended so it sits behind any children in the container
        this.container.insertBefore(wrapper, this.container.firstChild);
    }
}

// Make globally available
window.ImageStreamHero = ImageStreamHero;
