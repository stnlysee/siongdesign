# Auto Save + Drag & Drop Photo Portal Setup

This version adds a stronger admin portal at `/admin/`.

## What the portal can do

- Edit website text content.
- Edit navigation and dropdown items.
- Drag and drop menu items to reorder them.
- Drag and drop calculator dropdown items to reorder them.
- Drag and drop replacement photos into image slots.
- Save text and photos directly to GitHub using the GitHub Contents API.

## Important security note

GitHub Pages is a static host. It cannot safely keep a server-side login session by itself.

To make auto-save work, the admin user must paste a GitHub token into the admin portal. The token is stored only in that browser's localStorage. Do not share the token publicly.

For a production business website, the safer upgrade is:

- GitHub + Netlify Identity + Decap CMS, or
- GitHub + a small backend API that keeps the token secret.

## First-time setup

1. Upload the whole website folder to a GitHub repository.
2. Turn on GitHub Pages from Settings > Pages.
3. Create a fine-grained GitHub token with access to this repository only.
4. Give the token Repository Contents read/write permission.
5. Open your website `/admin/` page.
6. Login using the admin password.
7. Open **Auto Save Setup**.
8. Enter:
   - GitHub username / owner
   - Repository name
   - Branch, usually `main`
   - GitHub token
9. Click **Save GitHub Settings**.
10. Click **Test Connection**.

## Updating text

1. Edit the content in the admin portal.
2. Click **Preview** to check.
3. Click **Save to GitHub**.

The portal updates `content/site-content.json` automatically.

## Updating photos

1. Open **Drag & Drop Photos**.
2. Drop a new image into the correct image card.
3. Keep the same file path if you want to replace the old photo.
4. Click **Save to GitHub**.

The portal uploads the image into the selected `assets/...` path automatically.

## Notes

- GitHub Pages may take a short while to refresh after saving.
- If the image does not change immediately, refresh the browser cache.
- For best performance, use compressed `.webp`, `.jpg`, or `.png` images.
