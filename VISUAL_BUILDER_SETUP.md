# Siong Design Visual Builder Setup

This version replaces the old admin page with a more Wix-style visual builder.

## Open the admin builder

After uploading the full folder to GitHub and redeploying on Vercel, open:

```text
https://siongdesign.vercel.app/admin/
```

Default password:

```text
siongadmin
```

## What the builder can edit

- Homepage headline, tagline, description and buttons
- Navigation bar labels, links and ordering
- Promo box content, price and chips
- Proof points under the hero section
- Calculator dropdown options and prices
- Photos by drag-and-drop replacement
- Mobile page section order
- AI and SEO content
- Advanced JSON content

## How publishing works

The builder can publish directly to GitHub using the GitHub Contents API.

Go to:

```text
Auto Save Setup
```

Fill in:

```text
Owner: stnlysee
Repository: siongdesign
Branch: main
GitHub token: your fine-grained token
```

The token needs this permission:

```text
Repository Contents: Read and Write
```

Then click:

```text
Save Settings → Test Connection → Publish to GitHub
```

## Photo update

Go to:

```text
Photos
```

Drag a new photo onto any image card. Then click:

```text
Publish to GitHub
```

The builder will replace the image in the matching `assets/...` path.

## Auto publish

Auto publish is available inside Auto Save Setup, but it creates many GitHub commits. It is better to leave it off while testing, then click Publish to GitHub manually.

## Important limitation

This is a static website builder designed for GitHub + Vercel. It is closer to Wix, but it is not a full Wix clone. It supports visual editing, reordering and photo replacement. A true Wix-style system with user accounts, section resizing, full page block creation and media library needs a backend such as Supabase/Firebase plus image hosting such as Cloudinary.
