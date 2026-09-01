import os
import re

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
    {"id": "bal_radha_krishna", "name": "Balaram Radha and Krishna ji", "prefixes": ["bal gopal radha and krishna"]}
]

filters_html = '            <div class="catalog-filters">\n'
filters_html += '                <button class="filter-btn active" data-filter="all">All</button>\n'
for cat in categories:
    filters_html += f'                <button class="filter-btn" data-filter="{cat["id"]}">{cat["name"]}</button>\n'
filters_html += '            </div>\n'

grid_html = '            <div class="products-grid catalog-grid">\n'

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
        grid_html += f'''                <div class="product-card" data-category="{matched_cat["id"]}">
                    <div class="product-image">
                        <img src="images/{file}" alt="{matched_cat["name"]}" loading="lazy">
                        <div class="product-overlay">
                            <a href="inquiry.html" class="btn btn-light">Request Quote</a>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>{matched_cat["name"]}</h3>
                        <p>Beautifully crafted {matched_cat["name"]} marble murty.</p>
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

new_content = content[:start_idx] + filters_html + '\n' + grid_html + '\n\n            ' + content[end_idx:]

with open("collections.html", "w") as f:
    f.write(new_content)

print("Updated collections.html successfully.")
