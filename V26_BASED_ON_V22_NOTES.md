# Siong Design v26 - Based on v22 Easy Visual Builder

This version keeps the simpler v22 static website structure. It is not the full backend version.

## Added

- Fixed GitHub publish SHA mismatch by always fetching the latest SHA and retrying publish.
- Added `Reload Latest Content` in Auto Save Setup.
- Promo boxes can now be added, removed, edited and dragged to reorder.
- WhatsApp settings can now be edited from the Homepage Hero block:
  - WhatsApp number
  - Floating WhatsApp button text
  - Default WhatsApp message
  - Show/hide floating WhatsApp button
- Facebook settings can now be edited from the Homepage Hero block:
  - Facebook URL
  - Facebook button text
  - Show/hide Facebook button
- Calculator page now also loads `content-loader.js` so shared settings can update there too.

## How to update

1. Unzip this package.
2. Replace the files in your GitHub repo with these files.
3. Commit and push.
4. Wait for Vercel to redeploy.
5. Open `/admin/`.
6. Go to `Auto Save Setup`.
7. Save settings, test connection, then click `Reload Latest Content` before editing.

## Admin password

Default: `siongadmin`
