# attachmenthippo.com

The marketing site for Attachment Hippo, built with [Astro](https://astro.build) as a static site.

**Look:** tall condensed display type (Antonio), a friendly sans for reading (Figtree) and mono
labels (Chivo Mono). Pages are stacks of big rounded panels — pastel gradients, white, grey — on
black, with a peach accent. Imagery is flat, outlined vector art (no photos) that moves with CSS
and SVG animation; it all stops for visitors who prefer reduced motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site → dist/
npm run preview    # serve dist/ locally
```

Requires Node 22.12+. (Astro is pinned to 6.x because 7.x needs Node 22.23+; upgrade Node,
then `npm install astro@latest` when you want it.)

## Where things live

```
src/
├── site.config.ts          links, email, install URL, nav, analytics IDs  ← edit here first
├── styles/
│   ├── global.css          design tokens, panels, type scale, buttons, marquee
│   ├── illustrations.css   the illustration animations
│   └── article.css         blog article blocks (class contract for post bodies)
├── components/             Header, Footer, Logo, Illo (inline SVG), HeroScene, Marquee, Stamp
├── illustrations/          vector icons from Figma (see "Illustrations" below)
├── layouts/Base.astro      <head>, SEO/OG tags, analytics, header + footer
├── pages/
│   ├── index.astro         home: hero, use cases, contact
│   ├── pricing.astro       → /pricing.html   (Paddle checkout)
│   ├── blog/index.astro    → /blog/
│   ├── blog/[slug]/        → /blog/<slug>/
│   ├── legal/[doc].astro   → /legal/<doc>.html
│   └── 404.astro
├── content/
│   ├── blog/<slug>.md      post frontmatter (title, date, cover, tags…)
│   ├── blog/<slug>.html    post body — hand-written HTML using the article classes
│   └── legal/*.html        legal texts
└── lib/blog.ts             post loading, reading time, dates
public/
├── js/pricing.js           Paddle init + email-from-URL handling (plain JS, load order matters)
├── js/analytics.js         gtag bootstrap
└── blog/<slug>/            post cover images
brand/                      logo + Google Workspace Marketplace kit (see brand/README.md)
```

### URLs are unchanged

`build.format: 'preserve'` keeps every old address working: `/pricing.html`, `/blog/<slug>/`,
`/legal/terms_of_service.html`… The Gmail add-on deep-links to
`/pricing.html?plan=essential|pro-annual|pro-monthly#email=…`, and that flow behaves exactly as
before (the email is read and stripped from the URL before analytics load).

### Writing a blog post

1. Add `src/content/blog/my-post.md` with frontmatter (copy an existing one — the schema is in
   `src/content.config.ts`).
2. Add `src/content/blog/my-post.html` with the body, using the article blocks (`post-lead`,
   `post-toc`, `callout callout--tip`, `steps`, `table-wrap`, `takeaways`, `post-cta`, `related`…).
3. Put the cover in `public/blog/my-post/`.

The title, date, author, reading time and cover are rendered by the template, so the body starts
with the lead paragraph. Reading time is computed (words ÷ 220).

### Illustrations

The icons in `src/illustrations/` were generated with Figma's vector generator in the file
[Attachment Hippo — icons & illustrations](https://www.figma.com/design/oEAZXMsLboi305HbV4zTNN)
and cleaned with `scripts/import-figma-svg.py`. Each Figma layer becomes a `data-part="…"` hook
that `src/styles/illustrations.css` animates. To add one: generate it in Figma with named layers,
export it as SVG, run the script, then use `<Illo name="my-icon" />`.

House style for new ones: chunky rounded shapes, 8 px black outline on a 256 px canvas, flat fills
from the palette (lilac `#C9B6F2`, peach `#FFB38A`, mint `#BDEFD8`, butter `#FFE7A3`, sky `#BFE3FF`),
no gradients or shadows.

### Logo

`src/components/Logo.astro` draws the mark from `brand/tools/mark.json`, so regenerating the
brand kit updates the site too.

## Deploy

The current site is on Firebase Hosting. `firebase.json` serves `dist/` with the same security
headers (including the Content-Security-Policy) as the live site:

```bash
npm run build && firebase deploy --only hosting
```

The CSP only allows scripts from the site itself, Paddle, Umami and Google Analytics, so the build
is configured never to inline scripts. Analytics are only included in production builds.
