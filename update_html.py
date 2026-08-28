import sys

with open("collections.html", "r") as f:
    content = f.read()

top_part = content[:content.find('<div class="catalog-filters">')]
bottom_part = content[content.find('<div class="text-center" style="margin-top: 4rem;">'):]

with open("generated_grid.html", "r") as f:
    grid_content = f.read()

filters = """<div class="catalog-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="ganesh">Ganesh Ji</button>
                <button class="filter-btn" data-filter="shiv">Shiv Ji</button>
                <button class="filter-btn" data-filter="fountain">Fountains</button>
            </div>

            """

new_content = top_part + filters + grid_content + "\n            " + bottom_part

with open("collections.html", "w") as f:
    f.write(new_content)
