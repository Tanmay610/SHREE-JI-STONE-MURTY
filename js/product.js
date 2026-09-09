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
    // We assume the basePrice in the DB is for 12 inch.
    const basePrice = product.basePrice;
    
    // Multipliers for different sizes (rough estimates for demo)
    const sizeMultipliers = {
        "12": 1.0,  // base price
        "18": 1.8,
        "24": 2.8,
        "30": 4.0
    };

    const priceDisplay = document.getElementById('pdPrice');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const whatsappBtn = document.getElementById('btnWhatsappCheckout');

    let currentSize = "12";
    let currentPrice = basePrice;

    function updatePriceAndLink() {
        // Calculate new price
        currentPrice = Math.round(basePrice * sizeMultipliers[currentSize]);
        
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
});
