document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Data for Search
    let searchData = [];

    // Asynchronously load products data so search works on all pages
    const script = document.createElement('script');
    script.src = 'js/products_data.js?v=8'; // bumped cache version
    script.onload = () => {
        if (window.PRODUCTS_DATA) {
            searchData = window.PRODUCTS_DATA.map(p => {
                let tag = "Statue";
                if (p.category === "fountain") tag = "Fountain";
                if (p.category === "bench") tag = "Garden";
                
                return {
                    title: p.title,
                    tag: tag,
                    img: p.image,
                    url: `product.html?sku=${p.sku}`
                };
            });
        }
    };
    document.head.appendChild(script);

    const searchBtn = document.querySelector('.search-btn');
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.querySelector('.close-search-btn');
    const searchBackdrop = document.querySelector('.search-modal-backdrop');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchBtn || !searchModal) return;

    // Open Search
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
        renderResults(''); // show all initially or clear
    });

    // Close Search
    const closeSearch = () => {
        searchModal.classList.remove('active');
        searchInput.value = '';
    };

    closeSearchBtn.addEventListener('click', closeSearch);
    searchBackdrop.addEventListener('click', closeSearch);
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearch();
        }
    });

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        renderResults(query);
    });

    function renderResults(query) {
        searchResults.innerHTML = '';
        
        const filtered = searchData.filter(item => {
            return item.title.toLowerCase().includes(query) || item.tag.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            searchResults.innerHTML = `<div class="search-empty">No results found for "${query}"</div>`;
            return;
        }

        filtered.forEach(item => {
            const a = document.createElement('a');
            a.href = item.url;
            a.className = 'search-result-item';
            a.innerHTML = `
                <img src="${item.img}" class="search-result-img" alt="${item.title}" loading="lazy">
                <div class="search-result-info">
                    <span class="search-result-tag">${item.tag}</span>
                    <h4 class="search-result-title">${item.title}</h4>
                </div>
            `;
            a.addEventListener('click', () => {
                closeSearch();
            });
            searchResults.appendChild(a);
        });
    }
});
