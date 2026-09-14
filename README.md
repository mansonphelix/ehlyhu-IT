<<<<<<< HEAD
# EHLYHU Global IT Solutions — Website

A static marketing site for EHLYHU Global IT Solutions: hardware, software,
networking, cloud, cybersecurity and managed IT services. Pure HTML/CSS/JS —
no build step, no framework, no server required.

## Structure

```
ehlyhu-it/
├── index.html          Home — hero, services overview, stack visual, why-us,
│                        industries, testimonials, FAQ
├── services.html        Full service breakdown + SLA table + FAQ
├── about.html            Mission, values, milestones timeline, stats
├── resources.html        Downloadable flyers
├── contact.html          Contact form + direct channels
├── 404.html              Branded not-found page (used automatically by GitHub Pages)
├── css/styles.css        All styling (single stylesheet, CSS custom properties)
├── js/main.js            Nav, hero slideshow, counters, FAQ accordion,
│                        3D tilt, and the hero network-canvas animation
├── assets/                Logo variants (WebP + PNG), favicons, flyer PDFs
├── robots.txt / sitemap.xml   Basic SEO plumbing
└── .nojekyll               Tells GitHub Pages not to run Jekyll on this repo
```

## Running locally

No build tools needed. Either:

- Open `index.html` directly in a browser, or
- Serve it (recommended, avoids relative-path quirks):
  ```bash
  cd ehlyhu-it
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```

## Deploying to GitHub Pages

1. Push the contents of `ehlyhu-it/` to the root of a GitHub repository
   (or to a `/docs` folder, or a dedicated branch — your choice).
2. In the repo: **Settings → Pages → Build and deployment → Source** →
   select the branch/folder you pushed to.
3. GitHub will publish at `https://<username>.github.io/<repo>/`.
4. Update the placeholder URLs before going live:
   - `robots.txt`, `sitemap.xml`, and the `<link rel="canonical">` /
     `og:*` tags in every page currently point at `https://ehlyhu.example`.
     Replace with your real GitHub Pages (or custom) domain.
   - Swap the placeholder email (`support@ehlyhu.example`) and phone
     number (`+1 (555) 123-4567`) for real contact details in all five
     HTML files and in `contact.html`'s sidebar.
5. The contact form is a front-end demo only (see `js/main.js`) — it
   simulates a submission. Wire it to a real backend or a form service
   (Formspree, Netlify Forms, etc.) before relying on it for leads.

## Performance notes

- The original logo asset was a 3.1 MB PNG loaded at full size in the
  nav bar on every page. It's been replaced with purpose-sized WebP
  (with PNG fallback via `<picture>`) for the nav/footer, a separate
  hero-sized image, and dedicated favicon/apple-touch-icon files —
  cutting the repeated nav image from ~3.1 MB to under 10 KB.
- Fonts use `font-display: swap` and `preconnect` hints.
- The hero network animation runs on `<canvas>` (no external library),
  pauses automatically when scrolled out of view, when the browser
  tab is hidden, and is skipped entirely for users with
  `prefers-reduced-motion` enabled.
- `js/main.js` is loaded with `defer`.
- The three flyer PDFs in `assets/` are ~5.8 MB each. They're only
  fetched on click ("Download PDF"), not on page load, so they don't
  affect page speed — but if you replace them, consider compressing
  with a PDF optimizer if file size matters for your audience.

## Editing content

Everything is plain HTML — copy is written directly into each page.
Shared styling lives in `css/styles.css` under CSS custom properties
in `:root` (colors, fonts, spacing) at the top of the file, so brand
color or font changes only need to happen in one place.
=======
# ehlyhu-IT
>>>>>>> 49ab5f0e71301aec3e76d4ea0e032a631f2ba9e4
