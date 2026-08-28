import os
import json

images_dir = "images"
files = sorted(os.listdir(images_dir))

slider_data = []
for f in files:
    if f.startswith("ganesh"):
        slider_data.append({
            "src": f"images/{f}",
            "title": "Divine",
            "highlight": "Ganesh murtys",
            "subtitle": "Intricately detailed premium marble murtys crafted with devotion and precision."
        })
    elif f.startswith("shiv"):
        slider_data.append({
            "src": f"images/{f}",
            "title": "Exquisite",
            "highlight": "Shiv Ji Statues",
            "subtitle": "Mesmerizing representations of divine energy, featuring handcrafted details."
        })
    elif f.startswith("fount"):
        slider_data.append({
            "src": f"images/{f}",
            "title": "Majestic",
            "highlight": "Stone Fountains",
            "subtitle": "Elegant stone water features designed to bring tranquility to your outdoor spaces."
        })

# 1. Update index.html
with open("index.html", "r") as file:
    html = file.read()

# Inject Swiper CSS
if "swiper-bundle.min.css" not in html:
    html = html.replace("</head>", '    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />\n</head>')

# Inject Swiper JS
if "swiper-bundle.min.js" not in html:
    html = html.replace("</body>", '    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>\n</body>')

# Replace Hero Section
import re
hero_pattern = re.compile(r'<section id="home" class="hero">.*?</section>', re.DOTALL)

new_hero = """<section id="home" class="hero">
        <!-- Swiper Container -->
        <div class="swiper hero-swiper">
            <div class="swiper-wrapper" id="hero-slider-wrapper">
                <!-- Slides will be dynamically injected here -->
            </div>
            <!-- Add Pagination if needed, but we focus on arrows -->
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>

        <div class="hero-overlay"></div>
        
        <div class="container hero-content">
            <div class="hero-content-inner">
                <span class="badge">Master Artisans Since 1995</span>
                <h1 class="hero-title" id="hero-dynamic-title">Divine Craftsmanship<br><span class="text-highlight" id="hero-dynamic-highlight">in Every Detail</span></h1>
                <p class="hero-subtitle" id="hero-dynamic-subtitle">Explore our exquisite collection of premium white marble god statues, intricately carved pink stone temples, and exclusive home decor.</p>
                <div class="hero-buttons">
                    <a href="collections.html" class="btn btn-primary btn-lg btn-glow">Explore Collection</a>
                    <a href="about.html" class="btn btn-outline-glass btn-lg">Our Story</a>
                </div>
            </div>
        </div>
    </section>"""

html = hero_pattern.sub(new_hero, html)

with open("index.html", "w") as file:
    file.write(html)

# 2. Update JS
js_injection = f"""
    // --- Hero Swiper Slider ---
    const sliderData = {json.dumps(slider_data)};
    const wrapper = document.getElementById('hero-slider-wrapper');
    const titleEl = document.getElementById('hero-dynamic-title');
    const highlightEl = document.getElementById('hero-dynamic-highlight');
    const subtitleEl = document.getElementById('hero-dynamic-subtitle');
    const contentInner = document.querySelector('.hero-content-inner');

    if (wrapper && sliderData.length > 0) {{
        // Shuffle or just use as is. We'll use as is.
        sliderData.forEach(data => {{
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            // We use inline background for better cover behavior
            slide.style.backgroundImage = `url('${{data.src}}')`;
            wrapper.appendChild(slide);
        }});

        const heroSwiper = new Swiper('.hero-swiper', {{
            effect: 'fade',
            fadeEffect: {{ crossFade: true }},
            loop: true,
            speed: 1500,
            autoplay: {{
                delay: 4000,
                disableOnInteraction: false,
            }},
            navigation: {{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }},
            on: {{
                slideChange: function () {{
                    // Update Text
                    const activeIndex = this.realIndex;
                    const data = sliderData[activeIndex];
                    
                    // Simple fade animation for text
                    contentInner.style.opacity = 0;
                    contentInner.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {{
                        titleEl.innerHTML = `${{data.title}}<br><span class="text-highlight" id="hero-dynamic-highlight">${{data.highlight}}</span>`;
                        subtitleEl.textContent = data.subtitle;
                        
                        contentInner.style.transition = 'all 0.8s ease';
                        contentInner.style.opacity = 1;
                        contentInner.style.transform = 'translateY(0)';
                    }}, 400); // Wait for fade out
                }}
            }}
        }});
    }}
"""

with open("js/main.js", "a") as file:
    file.write(js_injection)

# 3. Update CSS
css_injection = """
/* Swiper additions */
.hero-swiper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
}
.swiper-slide {
    background-size: cover;
    background-position: center;
}
.swiper-button-next, .swiper-button-prev {
    color: rgba(255, 255, 255, 0.7) !important;
    transition: color 0.3s ease;
}
.swiper-button-next:hover, .swiper-button-prev:hover {
    color: var(--accent-color) !important;
}
/* Ensure the text transition doesn't mess up the first load animation */
.hero-content-inner {
    transition: all 0.8s ease;
}
"""

with open("css/components/hero.css", "a") as file:
    file.write(css_injection)

print("Done injecting slider.")
