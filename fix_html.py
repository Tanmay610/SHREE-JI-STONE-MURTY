import os
from bs4 import BeautifulSoup
from PIL import Image

def fix_html_files():
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
            
        # 1. Add width and height to images
        for img in soup.find_all('img'):
            if not img.get('width') or not img.get('height'):
                src = img.get('src')
                if src and not src.startswith('http') and not src.startswith('data:'):
                    # Local image
                    try:
                        with Image.open(src) as image:
                            img['width'] = str(image.width)
                            img['height'] = str(image.height)
                    except Exception as e:
                        print(f"Could not open image {src}: {e}")
        
        # 2. Add aria-label to icon buttons and links without text
        for el in soup.find_all(['button', 'a']):
            text = el.get_text(strip=True)
            if not text and not el.get('aria-label'):
                # Try to infer from class or icons
                classes = el.get('class', [])
                if 'swiper-button-next' in classes:
                    el['aria-label'] = "Next slide"
                elif 'swiper-button-prev' in classes:
                    el['aria-label'] = "Previous slide"
                elif 'zoom-whatsapp' in classes:
                    el['aria-label'] = "Contact via WhatsApp"
                elif el.find('i', class_=lambda c: c and 'fa-whatsapp' in c):
                    el['aria-label'] = "Contact via WhatsApp"
                elif el.find('i', class_=lambda c: c and 'fa-instagram' in c):
                    el['aria-label'] = "Instagram"
                elif el.find('i', class_=lambda c: c and 'fa-facebook' in c):
                    el['aria-label'] = "Facebook"
                elif el.find('i', class_=lambda c: c and 'fa-bars' in c):
                    el['aria-label'] = "Toggle navigation menu"
                elif el.find('i', class_=lambda c: c and 'fa-th-large' in c):
                    el['aria-label'] = "Grid View"
                elif el.find('i', class_=lambda c: c and 'fa-list' in c):
                    el['aria-label'] = "List View"
                else:
                    el['aria-label'] = "Interactive element"
                    
        # 3. Add defer to external scripts
        for script in soup.find_all('script'):
            if script.get('src') and not script.get('defer') and not script.get('async'):
                script['defer'] = ''
                
        # 4. Try to add <main> if it doesn't exist
        if not soup.find('main'):
            # Find elements between nav/header and footer
            header = soup.find('nav')
            footer = soup.find('footer')
            if header and footer:
                # Get siblings after header
                main_tag = soup.new_tag('main')
                
                # We need to find all top-level elements that are between header and footer
                # This is tricky with bs4 if they are siblings in body
                body = soup.body
                if body:
                    elements_to_wrap = []
                    started = False
                    for child in body.children:
                        if child == header:
                            started = True
                            continue
                        if child == footer:
                            break
                        if started and child.name not in ['script', 'style']:
                            elements_to_wrap.append(child)
                            
                    if elements_to_wrap:
                        # Insert main after header
                        header.insert_after(main_tag)
                        for el in elements_to_wrap:
                            main_tag.append(el.extract())

        # Save the file
        with open(file, 'w', encoding='utf-8') as f:
            f.write(str(soup))
            print(f"Fixed {file}")

if __name__ == "__main__":
    fix_html_files()
