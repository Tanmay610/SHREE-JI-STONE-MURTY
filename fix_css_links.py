import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    new_lines = []
    bundle_added = False
    for line in lines:
        if 'rel="stylesheet"' in line and 'href="css/' in line:
            if not bundle_added:
                new_lines.append('    <link rel="stylesheet" href="css/bundle.min.css">')
                bundle_added = True
        else:
            new_lines.append(line)
            
    with open(file, 'w') as f:
        f.write('\n'.join(new_lines))
        
print("Updated HTML files to use bundle.min.css")
