import os

files = ['index.html', 'about.html', 'collections.html', 'inquiry.html']

nav_target_old_index = """            <div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">
                <button class="search-btn" aria-label="Search" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; color: #101317; padding: 0;">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <a href="inquiry.html" class="btn btn-primary">Enquire Now</a>
                <button class="mobile-menu-btn" aria-label="Toggle Menu">"""

nav_target_other = """            <div class="nav-actions">
                <a href="inquiry.html" class="btn btn-primary">Enquire Now</a>
                <button class="mobile-menu-btn" aria-label="Toggle Menu">"""

nav_replacement = """            <div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">
                <button class="search-btn" aria-label="Search" style="background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #101317; padding: 0; transition: all 300ms ease; box-shadow: 0 2px 8px rgba(0,0,0,0.03);" onmouseover="this.style.background='rgba(0,0,0,0.06)'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='rgba(0,0,0,0.03)'; this.style.transform='scale(1)';">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <a href="inquiry.html" class="btn btn-primary">Enquire Now</a>
                <button class="mobile-menu-btn" aria-label="Toggle Menu">"""

search_modal_html = """
    <script src="js/search.js"></script>

    <!-- Search Modal Overlay -->
    <div id="search-modal" class="search-modal">
        <div class="search-modal-backdrop"></div>
        <div class="search-modal-content">
            <button class="close-search-btn" aria-label="Close search">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="search-input-wrapper">
                <svg class="search-input-icon" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" id="search-input" placeholder="Search for fountains, statues..." autocomplete="off">
            </div>
            <div class="search-results" id="search-results">
                <!-- Search results injected here -->
            </div>
        </div>
    </div>
</body>"""

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r') as file:
        content = file.read()
    
    # 1. Update the Nav
    if f == 'index.html':
        content = content.replace(nav_target_old_index, nav_replacement)
    else:
        content = content.replace(nav_target_other, nav_replacement)
        
    # 2. Append the Modal if not already there
    if '<script src="js/search.js"></script>' not in content:
        content = content.replace('</body>', search_modal_html)
    else:
        # In index.html, it is already there, but we might want to ensure we don't duplicate. We won't touch it.
        pass
        
    with open(f, 'w') as file:
        file.write(content)

print("Updated all HTML files successfully.")
