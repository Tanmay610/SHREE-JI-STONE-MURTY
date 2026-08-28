with open("index.html", "r") as f:
    html = f.read()

html = html.replace(
    '<script src="js/main.js"></script>\n    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>',
    '<script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>\n    <script src="js/main.js"></script>'
)

with open("index.html", "w") as f:
    f.write(html)

with open("js/main.js", "r") as f:
    js_code = f.read()

# Currently, the file ends with:
#     }
# });
# 
#     // --- Hero Swiper Slider ---
#     const sliderData = [...]

# Let's just find "    // --- Hero Swiper Slider ---" and inject it inside the DOMContentLoaded block.
# Actually, the easiest way is to wrap the rest of the code in another DOMContentLoaded or window.addEventListener('load')

import re

# Split at "    // --- Hero Swiper Slider ---"
parts = js_code.split("    // --- Hero Swiper Slider ---")
if len(parts) == 2:
    fixed_js = parts[0] + "document.addEventListener('DOMContentLoaded', () => {\\n    // --- Hero Swiper Slider ---" + parts[1] + "\\n});"
    with open("js/main.js", "w") as f:
        f.write(fixed_js)
    print("Fixed JS and HTML")
else:
    print("Could not find the split point in main.js")

