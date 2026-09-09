import os
import re
import json

images_dir = "images"
files = sorted(os.listdir(images_dir))

categories = [
    {"id": "ganesh", "name": "Ganesh Ji", "prefixes": ["ganesh ji"]},
    {"id": "shiv", "name": "Shiv Ji", "prefixes": ["shiv ji"]},
    {"id": "hanuman", "name": "Hanuman Ji", "prefixes": ["hanumaan ji"]},
    {"id": "fountain", "name": "Fountains", "prefixes": ["fountain", "fountin"]},
    {"id": "ganga", "name": "Ganga Maa", "prefixes": ["ganga maa"]},
    {"id": "lakshmi_narayan", "name": "Lakshmi Narayan Ji", "prefixes": ["lakshmi narayan"]},
    {"id": "parshuram", "name": "Parshuram Ji", "prefixes": ["bhagwan parshuram"]},
    {"id": "bench", "name": "Marble Bench", "prefixes": ["marble bench"]},
    {"id": "datta", "name": "Datta Maharaj", "prefixes": ["datta maharaj"]},
    {"id": "buddha", "name": "Gautam Buddha", "prefixes": ["goutam budha"]},
    {"id": "parvati", "name": "Parvati Mataji", "prefixes": ["parwati mata"]},
    {"id": "kali", "name": "Kali Mataji", "prefixes": ["kali mata"]},
    {"id": "durga", "name": "Durga Mataji", "prefixes": ["durga mata"]},
    {"id": "mahaveer", "name": "Mahaveer Jain", "prefixes": ["mahaveer jain"]},
    {"id": "bal_radha_krishna", "name": " Radha and Krishna ji", "prefixes": ["bal gopal radha and krishna"]}
]

products_data = []

filters_html = '            <div class="catalog-filters">\n'
filters_html += '                <button class="filter-btn active" data-filter="all">All</button>\n'
for cat in categories:
    filters_html += f'                <button class="filter-btn" data-filter="{cat["id"]}">{cat["name"]}</button>\n'
filters_html += '            </div>\n'

top_bar_html = '''
            <div class="catalog-top-bar">
                <div class="view-toggles">
                    <button class="view-btn active" id="btnGrid" aria-label="Grid View"><i class="fas fa-th-large"></i></button>
                    <button class="view-btn" id="btnList" aria-label="List View"><i class="fas fa-list"></i></button>
                </div>
                <div class="sort-dropdown">
                    <span>Sort by</span>
                    <select>
                        <option>Relevance</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>
            </div>
'''

grid_html = '            <div class="products-grid catalog-grid" id="catalogGrid">\n'

for file in files:
    if file.startswith('.') or file == 'logo.png': continue
    file_lower = file.lower()
    matched_cat = None
    for cat in categories:
        for prefix in cat["prefixes"]:
            if file_lower.startswith(prefix):
                matched_cat = cat
                break
        if matched_cat:
            break
            
    if matched_cat:
        # Generate mock details based on file name or index for consistency
        sku = f"SJM-{matched_cat['id'][:3].upper()}-{str(abs(hash(file)) % 9999).zfill(4)}"
        base_price = 15000 if matched_cat["id"] != "fountain" else 35000
        material = "Premium Makrana Marble" if matched_cat["id"] != "fountain" else "Natural Sandstone & Marble"
        
        products_data.append({
            "sku": sku,
            "title": matched_cat["name"],
            "image": f"images/{file}",
            "basePrice": base_price,
            "material": material,
            "category": matched_cat["id"]
        })
        
        grid_html += f'''                <div class="product-card" data-category="{matched_cat["id"]}">
                    <div class="product-image-container">
                        <span class="badge-in-stock">IN STOCK</span>
                        <img src="images/{file}" alt="{matched_cat["name"]}" loading="lazy">
                        <div class="watermark-overlay">© SHREE JI</div>
                        <a href="https://wa.me/918947967791?text={sku}" class="zoom-whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i> <small>+91 7877379557</small>
                        </a>
                    </div>
                    <div class="product-info">
                        <h3>{matched_cat["name"]}</h3>
                        <div class="card-sku">Product ID : {sku}</div>
                        <div class="card-price">Price : <strong>₹ {base_price}</strong> INR</div>
                        
                        <p class="list-desc">Handcrafted {matched_cat["name"]} in premium makrana marble with exquisite detailing. This masterpiece perfectly exemplifies our mastery in traditional stone carving.</p>
                        <div class="list-sizes">Available Sizes: 12" H X 3" D X 8.5" W (Customizable)</div>
                        
                        <a href="product.html?sku={sku}" class="btn-teal-view">VIEW DETAILS</a>
                    </div>
                </div>\n'''
    else:
        print(f"Warning: No category matched for {file}")

grid_html += '            </div>'

with open("collections.html", "r") as f:
    content = f.read()

# Find the start of the filters
start_idx = content.find('<div class="catalog-filters">')
if start_idx == -1:
    print("Could not find start of catalog filters")
    exit(1)

# Find the end of the grid. It ends right before the next section
end_idx = content.find('<div class="text-center" style="margin-top: 4rem;">')
if end_idx == -1:
    print("Could not find end of grid")
    exit(1)

new_content = content[:start_idx] + filters_html + '\n' + top_bar_html + '\n' + grid_html + '\n\n            ' + content[end_idx:]

with open("collections.html", "w") as f:
    f.write(new_content)

# Write products_data.js
js_content = f"window.PRODUCTS_DATA = {json.dumps(products_data, indent=4)};\n"
with open("js/products_data.js", "w") as f:
    f.write(js_content)

print("Updated collections.html and js/products_data.js successfully.")
