# Siong Design Admin Portal and AI-Friendly Website Setup

## What was added

1. `admin/index.html`  
   A simple Wix-style editing portal for business info, homepage text, navigation/dropdown bar, calculator dropdowns and AI/SEO data.

2. `content/site-content.json`  
   Central editable content file. The website reads this file and updates selected text/navigation/dropdown options automatically.

3. `assets/content-loader.js`  
   Loads the JSON content and applies it to the live website.

4. `admin/decap.html` and `admin/config.yml`  
   Optional GitHub CMS setup template using Decap CMS.

5. AI-friendly files  
   `robots.txt`, `sitemap.xml`, `llms.txt` and structured data were added to help search engines and AI crawlers understand the website better.

## How to use the simple admin portal

1. Upload the whole folder to GitHub.
2. Open `/admin/index.html`.
3. Login with the demo password: `siongadmin`.
4. Edit content.
5. Click `Download JSON`.
6. Replace `content/site-content.json` in GitHub with the downloaded file.
7. Commit the change.

## Important security note

The simple admin portal is suitable for easy editing, but it is not a secure public login system because GitHub Pages is static hosting. For a real login portal that saves directly to GitHub, connect the `admin/decap.html` setup to GitHub OAuth, Netlify Identity, Cloudflare Pages Functions, or another authentication backend.

## To make Decap CMS work

Edit `admin/config.yml` and replace:

```yml
repo: YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME
```

with your real GitHub repo, for example:

```yml
repo: username/siong-design-website
```

Then configure an OAuth backend. GitHub Pages alone cannot securely perform CMS login by itself.
