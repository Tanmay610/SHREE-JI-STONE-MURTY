document.addEventListener('DOMContentLoaded', () => {
    // 1. Get SKU from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sku = urlParams.get('sku');

    if (!sku) {
        document.getElementById('pdTitle').textContent = "Product Not Found";
        return;
    }

    // 2. Find product in PRODUCTS_DATA
    const product = window.PRODUCTS_DATA ? window.PRODUCTS_DATA.find(p => p.sku === sku) : null;

    if (!product) {
        document.getElementById('pdTitle').textContent = "Product Not Found";
        const debugInfo = document.createElement('p');
        debugInfo.textContent = `Debug: Looked for SKU '${sku}'. Data loaded: ${window.PRODUCTS_DATA ? window.PRODUCTS_DATA.length : 'NONE'}`;
        document.getElementById('pdTitle').parentNode.appendChild(debugInfo);
        return;
    }

    // 3. Populate basic details
    document.getElementById('pdTitle').textContent = product.title;
    document.getElementById('pdBreadcrumbTitle').textContent = product.title;
    document.getElementById('pdSku').textContent = product.sku;
    document.getElementById('pdMaterial').textContent = product.material;
    document.getElementById('pdImage').src = product.image;
    document.getElementById('pdImage').alt = product.title;

    // 4. Handle Size & Pricing logic
    const category = product.category;
    const priceDisplay = document.getElementById('pdPrice');
    const priceWrap = document.querySelector('.pd-price-wrap');
    const sizeSelector = document.querySelector('.pd-size-selector');
    const whatsappBtn = document.getElementById('btnWhatsappCheckout');

    if (category === 'fountain' || category === 'bench') {
        priceWrap.style.display = 'none';
        sizeSelector.style.display = 'none';
        whatsappBtn.innerHTML = '<i class="fas fa-envelope"></i> Contact for pricing or more details';
        whatsappBtn.href = `inquiry.html?sku=${product.sku}`;
        return; // Skip standard size/price logic
    }

    const customPrices = {
        'ganesh': { "12": 20500, "15": 24000, "18": 35500, "24": 55500, "30": 65500 },
        'panchmukhi_hanuman': { "12": 24000, "18": 38500, "24": 55000, "30": 67500 },
        'ganga': { "12": 20500, "18": 36500, "24": 48500, "30": 65000 },
        'lakshmi_narayan': { "12": 27500, "18": 38500, "24": 49500, "30": 69500 },
        'datta': { "12": 24500, "18": 38500, "24": 49500, "30": 69500 },
        'durga': { "12": 18500, "18": 35000, "24": 45500, "30": 60000 },
        'ram_darbar': { "12": 27500, "18": 42000, "24": 62500, "30": 79500 }
    };

    let activeCustomPrices = null;
    if (customPrices[category]) {
        activeCustomPrices = customPrices[category];
        // Rebuild size buttons for categories with custom prices
        const sizeOptionsContainer = document.querySelector('.size-options');
        sizeOptionsContainer.innerHTML = Object.keys(activeCustomPrices).map((size, index) => {
            return `<button class="size-btn ${index === 0 ? 'active' : ''}" data-size="${size}">${size} inch</button>`;
        }).join('');
    }

    // We assume the basePrice in the DB is for 12 inch.
    const basePrice = product.basePrice;
    
    // Multipliers for different sizes for categories without custom pricing
    const sizeMultipliers = {
        "12": 1.0,  // base price
        "18": 1.8,
        "24": 2.8,
        "30": 4.0
    };

    let sizeButtons = document.querySelectorAll('.size-btn');
    let currentSize = sizeButtons[0] ? sizeButtons[0].getAttribute('data-size') : "12";
    let currentPrice = activeCustomPrices ? activeCustomPrices[currentSize] : basePrice;

    function updatePriceAndLink() {
        if (activeCustomPrices) {
            currentPrice = activeCustomPrices[currentSize];
        } else {
            // Calculate new price using fallback multiplier logic
            currentPrice = Math.round(basePrice * (sizeMultipliers[currentSize] || 1.0));
        }
        
        // Format with commas (e.g., 15,000)
        priceDisplay.textContent = currentPrice.toLocaleString('en-IN');

        // Update WhatsApp link
        const message = encodeURIComponent(`Hi, I would like to buy the ${product.title}.\n\nSKU: ${product.sku}\nSize: ${currentSize} inch\nPrice: ₹${currentPrice.toLocaleString('en-IN')}\n\nPlease let me know the next steps for payment and delivery.`);
        whatsappBtn.href = `https://wa.me/918947967791?text=${message}`;
    }

    // Initialize
    updatePriceAndLink();

    // Size Button Click Listeners
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            sizeButtons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            
            // Update state
            currentSize = btn.getAttribute('data-size');
            updatePriceAndLink();
        });
    });

    // --- Recommended Products Logic ---
    if (window.PRODUCTS_DATA) {
        let recommended = window.PRODUCTS_DATA.filter(p => p.category === category && p.sku !== product.sku);
        // Shuffle
        recommended.sort(() => 0.5 - Math.random());
        // Pick 4
        recommended = recommended.slice(0, 4);
        
        // If not enough, pad with others
        if (recommended.length < 4) {
            let others = window.PRODUCTS_DATA.filter(p => p.category !== category && p.sku !== product.sku);
            others.sort(() => 0.5 - Math.random());
            recommended = recommended.concat(others.slice(0, 4 - recommended.length));
        }

        const recommendedGrid = document.getElementById('recommendedGrid');
        if (recommendedGrid) {
            recommendedGrid.innerHTML = recommended.map(p => {
                let priceDisplay = `<strong>₹ ${p.basePrice}</strong> INR`;
                let sizesDisplay = 'Available Sizes: 12" H X 3" D X 8.5" W (Customizable)';
                
                if (p.category === 'fountain' || p.category === 'bench') {
                    priceDisplay = `<a href="inquiry.html?sku=${p.sku}" style="text-decoration: underline; color: inherit;"><strong>Contact for pricing or more details</strong></a>`;
                    sizesDisplay = '';
                } else if (customPrices[p.category]) {
                    priceDisplay = `<strong>₹ ${customPrices[p.category]["12"]}</strong> INR`;
                }

                return `
                <div class="product-card" data-category="${p.category}" data-price="${p.basePrice}">
                    <div class="product-image-container">
                        <span class="badge-in-stock" style="background: #1a1a2e; color: #fff;">SALE</span>
                        <img src="${p.image}" alt="${p.title}" loading="lazy">
                        <div class="watermark-overlay">© SHREE JI</div>
                        <a href="https://wa.me/918947967791?text=${p.sku}" class="zoom-whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i> <small>+91 7877379557</small>
                        </a>
                    </div>
                    <div class="product-info">
                        <h3>${p.title}</h3>
                        <div class="card-sku">Product ID : ${p.sku}</div>
                        <div class="card-price">Price : ${priceDisplay}</div>
                        
                        <p class="list-desc">Handcrafted ${p.title} in premium makrana marble with exquisite detailing. This masterpiece perfectly exemplifies our mastery in traditional stone carving.</p>
                        <div class="list-sizes">${sizesDisplay}</div>
                        <div style="display: flex; gap: 10px; margin-top: auto; width: 100%;">
                            <a href="product.html?sku=${p.sku}" class="btn-teal-view" style="flex: 1; text-align: center; padding: 10px 5px; white-space: nowrap; font-size: 0.7rem;">VIEW DETAILS</a>
                            <a href="https://wa.me/918947967791?text=${p.sku}" class="btn-teal-view" style="flex: 1; text-align: center; padding: 10px 5px; white-space: nowrap; font-size: 0.7rem; background: var(--primary-color); color: #fff; border-color: var(--primary-color);">INQUIRE NOW</a>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }
    }

    // --- Reviews Slider Drag to Scroll ---
    const slider = document.getElementById('reviewsSlider');
    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast
            slider.scrollLeft = scrollLeft - walk;
        });
        slider.style.cursor = 'grab';
    }
});
