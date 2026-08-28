import re

with open('js/main.js', 'r') as f:
    content = f.read()

# Extract the sliderData string
match = re.search(r'const sliderData = (\[.*?\]);', content)
if match:
    full_slider_data = match.group(1)
    
    # Replace sliderData with a smaller array
    small_slider_data = '''[
        {"src": "images/ganesh ji 11.jpg", "title": "Sacred", "highlight": "Ganesh Murtys", "subtitle": "Intricately detailed premium marble murtys crafted with devotion and precision."},
        {"src": "images/shiv ji 08.jpg", "title": "Exquisite", "highlight": "Shiv Ji Statues", "subtitle": "Mesmerizing representations of divine energy, featuring handcrafted details."},
        {"src": "images/fountain 14.jpg", "title": "Majestic", "highlight": "Stone Fountains", "subtitle": "Elegant stone water features designed to bring tranquility to your outdoor spaces."}
    ]'''
    
    content = content.replace(f'const sliderData = {full_slider_data};', f'const sliderData = {small_slider_data};')
    
    # Append the gallery Swiper logic before the closing of DOMContentLoaded
    gallery_logic = f'''
    // --- Gallery Swiper Slider ---
    const galleryData = {full_slider_data};
    const galleryWrapper = document.getElementById('gallery-slider-wrapper');

    if (galleryWrapper && galleryData.length > 0) {{
        galleryData.forEach(data => {{
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            const img = document.createElement('img');
            img.src = data.src;
            img.alt = data.title;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '10px';
            
            slide.appendChild(img);
            galleryWrapper.appendChild(slide);
        }});

        const gallerySwiper = new Swiper('.gallery-swiper', {{
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {{
                delay: 2500,
                disableOnInteraction: false,
            }},
            pagination: {{
                el: '.gallery-swiper .swiper-pagination',
                clickable: true,
            }},
            breakpoints: {{
                640: {{
                    slidesPerView: 2,
                    spaceBetween: 20,
                }},
                768: {{
                    slidesPerView: 3,
                    spaceBetween: 30,
                }},
                1024: {{
                    slidesPerView: 4,
                    spaceBetween: 30,
                }},
            }}
        }});
    }}
'''
    
    # Insert gallery_logic before the last '});'
    content = re.sub(r'\}\);\s*$', gallery_logic + '\n});', content)
    
    with open('js/main.js', 'w') as f:
        f.write(content)
    print("Successfully updated js/main.js")
else:
    print("Could not find sliderData")
