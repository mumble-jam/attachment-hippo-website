# attachmenthippo.com

The marketing site for Attachment Hippo, rebuilt with [Astro](https://astro.build) as a static
site in a Swiss / International Typographic Style: one grotesque family (Inter + Inter Tight),
a 12-column grid, black on white, structure drawn with rules, one accent colour.

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
│   ├── global.css          design tokens, grid, type scale, buttons
│   └── article.css         blog article blocks (class contract for post bodies)
├── components/             Header, Footer, Logo
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
