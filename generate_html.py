import os

images_dir = "images"
files = sorted(os.listdir(images_dir))

html = []

html.append('<div class="products-grid catalog-grid">\n')

for file in files:
    if file.startswith("ganesh ji"):
        html.append(f'''                <div class="product-card" data-category="ganesh">
                    <div class="product-image">
                        <img src="images/{file}" alt="Ganesh Ji murty" loading="lazy">
                        <div class="product-overlay">
                            <a href="inquiry.html" class="btn btn-light">Request Quote</a>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>Ganesh Ji murty</h3>
                        <p>Intricately detailed premium marble murty.</p>
                    </div>
                </div>\n''')
    elif file.startswith("shiv ji"):
        html.append(f'''                <div class="product-card" data-category="shiv">
                    <div class="product-image">
                        <img src="images/{file}" alt="Shiv Ji murty" loading="lazy">
                        <div class="product-overlay">
                            <a href="inquiry.html" class="btn btn-light">Request Quote</a>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>Shiv Ji murty</h3>
                        <p>Exquisite craftsmanship for spiritual devotion.</p>
                    </div>
                </div>\n''')
    elif file.startswith("fountain") or file.startswith("fountin"):
        html.append(f'''                <div class="product-card" data-category="fountain">
                    <div class="product-image">
                        <img src="images/{file}" alt="Stone Fountain" loading="lazy">
                        <div class="product-overlay">
                            <a href="inquiry.html" class="btn btn-light">Request Quote</a>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>Stone Fountain</h3>
                        <p>Elegant stone water feature for outdoor spaces.</p>
                    </div>
                </div>\n''')

html.append('            </div>')

with open("generated_grid.html", "w") as f:
    f.writelines(html)
