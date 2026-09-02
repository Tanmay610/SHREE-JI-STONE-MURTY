document.addEventListener('DOMContentLoaded', () => {
    // Shared Data for Search
    const searchData = [
        { title: "Stone Fountain – Masterpiece", tag: "Fountain", img: "images/fountain 04.jpg", url: "collections.html" },
        { title: "Stone Fountain – Luxury", tag: "Fountain", img: "images/fountain 03.jpg", url: "collections.html" },
        { title: "Stone Fountain – Heritage", tag: "Fountain", img: "images/fountain 11.jpg", url: "collections.html" },
        { title: "Ganesh Murty – Makrana", tag: "Statue", img: "images/ganesh ji 01.jpg", url: "collections.html" },
        { title: "Shiv Ji Murty – Hand Painted", tag: "Statue", img: "images/shiv ji 01.png", url: "collections.html" },
        { title: "Lakshmi Narayan – Sacred", tag: "Statue", img: "images/Lakshmi narayan ji marble murty 01.jpg", url: "collections.html" },
        { title: "Goutam Buddha Marble Murty", tag: "Statue", img: "images/GOUTAM BUDHA MARBLE MURTY 09.jpg", url: "collections.html" },
        { title: "Hanuman Ji Marble Murty", tag: "Statue", img: "images/hanumaan ji marble murty 01.jpg", url: "collections.html" },
        { title: "Mahaveer Jain Marble Murty", tag: "Statue", img: "images/MAHAVEER JAIN MARBLE MURTY 01 (1).jpg", url: "collections.html" },
        { title: "Kali Mata Ji Marble Murty", tag: "Statue", img: "images/KALI MATA JI MARBLE MURTY 01.jpg", url: "collections.html" },
        { title: "Parwati Mata Ji Marble Murty", tag: "Statue", img: "images/PARWATI MATA JI MARBLE MURTY 01.jpg", url: "collections.html" },
        { title: "Marble Bench", tag: "Garden", img: "images/MARBLE BENCH 22.jpg", url: "collections.html" }
    ];

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
