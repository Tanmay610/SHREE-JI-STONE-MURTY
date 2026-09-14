# Shree Ji Stone Murty - E-Commerce Catalog

A high-performance, dynamic e-commerce catalog website built for **Shree Ji Stone Murty**, showcasing premium handcrafted marble murtis, stone temples, fountains, and artifacts.

## 🌟 Project Overview

This project is a hybrid static-dynamic website designed for speed, SEO, and extremely easy content management. It relies on a static site generation (SSG) approach using a Python build script, combined with vanilla JavaScript for dynamic client-side rendering of product details, real-time search, and WhatsApp order inquiries.

### Key Features
* **Automated Catalog Generation:** Product data and SKUs are completely generated based on the actual image files in the `images/` directory. No database required.
* **Dynamic Product Details (`product.html`):** A single HTML page that dynamically populates product info, calculates custom sizing metrics, and handles custom price scaling depending on the category.
* **Global Real-Time Search:** A site-wide search overlay that dynamically loads the entire catalog database and instantly filters products by name or category tag.
* **WhatsApp Integration:** "Add to Cart" is replaced with direct WhatsApp inquiries containing precisely formatted order details (SKU, size, price, and product name).
* **Deterministic SKUs:** Product IDs (e.g., `SJM-PAN-1465`) are generated via stable MD5 hashes of their image filenames, ensuring links never break when the catalog is rebuilt.

## 🛠️ Architecture & Tech Stack

* **Frontend:** HTML5, Vanilla CSS, Vanilla JavaScript (ES6)
* **Backend / Dev Server:** Node.js with Express (`server.js`)
* **Static Site Generator:** Python 3 (`build_collections.py`)

### Core Files & Directories
- `images/`: The source of truth for the catalog. Simply dropping a new image here (named correctly, e.g., `ganesh ji 01.jpg`) adds it to the store.
- `build_collections.py`: The Python engine. When executed, it scans the `images/` folder, sorts products by filename prefixes into categories, assigns base pricing, writes the grid into `collections.html`, and exports the full database to `js/products_data.js`.
- `js/products_data.js`: The generated JSON array acting as the client-side database.
- `js/product.js`: Handles sizing options, custom pricing tables (e.g., specific prices for PanchMukhi Hanuman Ji vs Ganga Ma), and WhatsApp link generation.
- `js/search.js`: Handles the global search functionality across all pages.
- `server.js`: An Express server optimized with compression and caching headers for running the site locally.

## 🚀 Running the Project Locally

1. **Install Dependencies:**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install express helmet compression
   ```

2. **Start the Development Server:**
   ```bash
   node server.js
   ```
   The site will be available at `http://localhost:3000`.

## 📦 Content Management (Adding New Products)

Because this project uses a file-based SSG approach, adding new products is incredibly simple:

1. **Add the Image:** Place the new image in the `images/` directory.
2. **Name it Correctly:** The filename prefix determines the category. (e.g., an image named `shiv ji black marble.jpg` will automatically be categorized under "Shiv Ji").
3. **Rebuild the Catalog:**
   Run the Python build script from the root directory to generate the new SKUs and update the database:
   ```bash
   python3 build_collections.py
   ```
4. **Hard Refresh:** Refresh your browser (Cmd+Shift+R) to see the new products instantly injected into the Collections page and Search Bar.

## 💾 Version Control (Saving to GitHub)

Whenever you add new images, update pricing in the scripts, or modify any files, you should save your changes to GitHub so they are safely backed up and visible on your contribution graph.

Run the following commands in your terminal:

```bash
# 1. Stage all your changes
git add .

# 2. Commit the changes with a descriptive message
git commit -m "Update catalog with new products and pricing"

# 3. Push the changes to GitHub
git push origin main
```
