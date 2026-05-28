Siong Design V37 Calculator Property Type Fix

This fixes the real calculator page so it shows:
- Property Type dropdown: HDB / Condo
- Carpentry Type dropdown changes based on HDB or Condo
- The other calculator dropdowns still load from content/site-content.json

Why this was needed:
The admin had HDB/Condo categories, but the actual calculator.html page did not have a visible Property Type dropdown. This version adds it directly into calculator.html and also patches assets/main.js to load the categories.

Install:
1. Unzip this file.
2. Replace your GitHub repo files with this version.
3. Delete api/publish.js if it exists.
4. Commit changes.
5. Open https://stnlysee.github.io/siongdesign/calculator.html
6. Press Ctrl + F5.
7. You should now see Property Type above Carpentry Type.
