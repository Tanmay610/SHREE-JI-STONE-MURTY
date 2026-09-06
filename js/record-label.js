// js/record-label.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Motion Model Check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.body.classList.add('reduced-motion');
        return; // Skip complex JS animations if reduced motion is preferred
    }


    // --- Statement Fold Animation (Standalone) ---
    const statementImage = document.querySelector('.statement-image');
    let currentScroll = 0;
    let targetScroll = 0;
    
    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
    }, { passive: true });

    function renderAnimation() {
        currentScroll += (targetScroll - currentScroll) * 0.08;
        const windowHeight = window.innerHeight;

        const statementFold = document.querySelector('.statement-fold');
        if (statementFold && statementImage) {
            const statementRect = statementFold.getBoundingClientRect();
            if (statementRect.top < windowHeight && statementRect.bottom > 0) {
                const offset = (windowHeight - statementRect.top) * 0.2;
                const rotation = (windowHeight - statementRect.top) * 0.05;
                statementImage.style.transform = `translate3d(0, -${offset}px, 0) rotate(${rotation}deg)`;
            }
        }
        requestAnimationFrame(renderAnimation);
    }
    renderAnimation();



    // 3. Throwable Card Deck
    initDeck();


});

function initDeck() {
    const container = document.querySelector('.deck-container');
    if (!container) return;

    let cards = Array.from(container.querySelectorAll('.deck-card'));
    const dots = Array.from(document.querySelectorAll('.deck-dot'));
    if (!cards.length) return;

    function updateStack() {
        cards.forEach((card, i) => {
            if (i === 0) {
                card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
                card.style.zIndex = cards.length;
                card.style.opacity = 1;
            } else {
                const offset = i * 15;
                const scale = 1 - (i * 0.05);
                const rotate = i % 2 === 0 ? i * 2 : -i * 2;
                card.style.transform = `translate3d(${offset}px, ${offset}px, 0) scale(${scale}) rotate(${rotate}deg)`;
                card.style.zIndex = cards.length - i;
                card.style.opacity = i > 3 ? 0 : 1;
            }
        });

        if (dots.length === cards.length) {
            dots.forEach((dot, idx) => {
                const originalIndex = parseInt(cards[0].getAttribute('data-index'));
                dot.classList.toggle('active', idx === originalIndex);
            });
        }

    }

    cards.forEach((c, i) => c.setAttribute('data-index', i));
    updateStack();

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let topCard = null;

    container.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.deck-card')) {
            topCard = cards[0]; 
            if(e.target.closest('.deck-card') !== topCard) return;

            isDragging = true;
            startX = e.clientX;
            topCard.classList.add('dragging');
            container.setPointerCapture(e.pointerId);
        }
    });

    container.addEventListener('pointermove', (e) => {
        if (!isDragging || !topCard) return;
        currentX = e.clientX - startX;
        
        const rotate = currentX * 0.05;
        topCard.style.transform = `translate3d(${currentX}px, -10px, 0) scale(1.02) rotate(${rotate}deg)`;
    });

    const release = (e) => {
        if (!isDragging || !topCard) return;
        isDragging = false;
        topCard.classList.remove('dragging');
        
        const threshold = container.offsetWidth * 0.15;

        if (Math.abs(currentX) > threshold) {
            const direction = currentX > 0 ? 1 : -1;
            const throwX = container.offsetWidth * direction * 1.5;
            
            topCard.style.transform = `translate3d(${throwX}px, -50px, 0) scale(1) rotate(${direction * 30}deg)`;
            
            setTimeout(() => {
                const thrown = cards.shift();
                cards.push(thrown);
                updateStack();
            }, 400); 
        } else {
            updateStack();
        }
        
        currentX = 0;
        topCard = null;
    };

    container.addEventListener('pointerup', release);
    container.addEventListener('pointercancel', release);

    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const direction = e.key === 'ArrowRight' ? 1 : -1;
            topCard = cards[0];
            const throwX = container.offsetWidth * direction * 1.5;
            topCard.style.transform = `translate3d(${throwX}px, -50px, 0) scale(1) rotate(${direction * 30}deg)`;
            
            setTimeout(() => {
                const thrown = cards.shift();
                cards.push(thrown);
                updateStack();
            }, 400);
        }
    });
}
