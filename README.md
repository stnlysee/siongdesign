# Siong Design Website

Static HTML/CSS/JS website for Siong Design with calculator, gallery, mobile one-page layout, AI-friendly files and an editable admin portal.

## Main files

- `index.html` - Homepage
- `services.html` - Services
- `why-us.html` - Why choose us
- `works.html` - Completed works
- `calculator.html` - Carpentry calculator
- `faq.html` - FAQ
- `contact.html` - Contact page
- `content/site-content.json` - Editable website content
- `admin/index.html` - Simple Wix-style admin editor
- `admin/decap.html` - Optional GitHub CMS template
- `AI_ADMIN_SETUP.md` - Setup notes

## Admin portal

Open `admin/index.html` and login with the demo password `siongadmin`.

For a real public login that saves directly into GitHub, use Decap CMS with GitHub OAuth or host the website on Netlify/Cloudflare Pages with authentication.

## v21 Admin Portal Upgrade

This package includes an enhanced `/admin/` portal with:

- Auto-save to GitHub
- Drag-and-drop photo replacement
- Drag-and-drop navigation ordering
- Drag-and-drop calculator dropdown ordering
- Backup JSON export

Read `AUTO_SAVE_AND_PHOTO_PORTAL_SETUP.md` for setup steps.
