import os
from PIL import Image

def optimize_images(directory):
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if not os.path.isfile(filepath):
            continue
            
        try:
            # We don't want to optimize logo.png too much as it might lose transparency
            if filename == "logo.png":
                continue
                
            with Image.open(filepath) as img:
                original_size = os.path.getsize(filepath)
                # Max dimension 800px to save space for mobile/desktop view
                max_dim = 800
                
                # Resize if needed
                if img.width > max_dim or img.height > max_dim:
                    img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                
                # Save optimized
                if filepath.lower().endswith('.jpg') or filepath.lower().endswith('.jpeg'):
                    img.save(filepath, "JPEG", optimize=True, quality=80)
                elif filepath.lower().endswith('.png'):
                    # PNG optimization
                    img.save(filepath, "PNG", optimize=True)
                    
            new_size = os.path.getsize(filepath)
            if new_size < original_size:
                print(f"Optimized {filename}: {original_size // 1024}KB -> {new_size // 1024}KB")
        except Exception as e:
            print(f"Failed to optimize {filename}: {e}")

if __name__ == "__main__":
    optimize_images("images")
