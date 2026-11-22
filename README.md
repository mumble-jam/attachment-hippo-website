# attachmenthippo.com

The marketing site for Attachment Hippo, built with [Astro](https://astro.build) as a static site.

**Look:** tall condensed display type (Antonio), a friendly sans for reading (Figtree) and mono
labels (Chivo Mono). Pages are stacks of big rounded panels — pastel gradients, white, grey — on
black, with a peach accent. Imagery is soft, glowing "aura" illustrations (no photos) that drift
slowly; motion stops for visitors who prefer reduced motion.

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
│   ├── aura.css            the aura illustration look + motion
│   └── article.css         blog article blocks (class contract for post bodies)
├── components/             Header, Footer, Logo, AuraIcon, AuraHippo, HeroScene, Marquee, Stamp
├── illustrations/          source shapes from Figma (see "Illustrations" below)
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

### Illustrations — the "aura" style

Soft silhouettes lit from inside by blurred colour, with fine grain: a light zone on top, a deep
core, warm colour where the form meets the ground, soft edges, no outlines. Colours come only from
the site palette.

How it is built:

- **Shapes** come from the icons Figma generated (`src/illustrations/*.svg`, file
  [Attachment Hippo — icons & illustrations](https://www.figma.com/design/oEAZXMsLboi305HbV4zTNN),
  cleaned with `scripts/import-figma-svg.py`). Filled shapes become soft-edged masks; line-only
  shapes (dollar sign, text lines, stems) become soft marks on top.
- **Recipes** in `src/lib/aura-recipes.ts` say which part becomes which glowing layer and which
  palette lights it (`lavender`, `violet`, `peach`, `butter`, `mint`, `sky`, `paper` — defined in
  `src/lib/aura.ts`).
- **Rendering**: `<AuraIcon name="uc-invoice" />`. Each colour blob is its own blurred element and
  only transforms animate, so motion stays cheap; animations run only while the illustration is on
  screen and never for reduced motion. Part motion (the invoice dropping, leaves swaying…) is in
  `src/styles/aura.css`.
- **The hippo** is hand-tuned in `src/components/AuraHippo.astro`.

To add one: generate it in Figma with named layers (any flat style — only the shapes are used),
export as SVG, run the import script, add a recipe, use `<AuraIcon name="…" />`. Preview every
illustration at `/lab/aura.html` (not linked, not in the sitemap).

### Colour themes

`src/lib/themes.ts` defines four themes — **Aurora** (the default; closest to the original site:
sky → pink → cream panels on black), **Pastel** (mint, lilac, butter, peach on black), **Lagoon** (teal, indigo, orange) and **Sunset** (apricot,
rose, plum). Each sets the page and panel colours, the accent, and the colours that light the
illustrations, so a theme recolours everything.

While deciding, a floating **Colours** picker shows on every page (bottom left). Picking a theme adds
`?theme=…` to the URL — send that link and others see the same version; "Copy link to this theme"
does it in one click. When you've chosen: set `defaultTheme` and `themeSwitcher: false` in
`src/site.config.ts`.

### Contact form

`src/components/ContactForm.astro` — name, email, message. With no form service connected it opens
the visitor's email app with the message pre-filled. To receive messages directly, set
`contactForm.endpoint` in `src/site.config.ts` to a form service URL (Formspree, Web3Forms, …) and add
that origin to `form-action` and `connect-src` in `firebase.json`. `/?topic=custom#contact` (used by
the pricing page's Custom plan) puts the topic in the subject line.

### Logo

`src/components/Logo.astro` draws the mark from `brand/tools/mark.json`, so regenerating the
brand kit updates the site too.

## Preview on GitHub Pages

Every push to `main` publishes a preview to GitHub Pages
(`.github/workflows/pages.yml`) at `https://<owner>.github.io/<repo>/`. The preview is built with
`SITE_BASE=/<repo>/` and `PUBLIC_PREVIEW=1`: links get the sub-path (`scripts/rebase.mjs`), search
engines are told not to index it, and analytics are off. To build the same thing locally:

```bash
SITE_BASE=/attachment-hippo-website/ PUBLIC_PREVIEW=1 npm run build
node scripts/rebase.mjs dist /attachment-hippo-website
```

## Deploy

The current site is on Firebase Hosting. `firebase.json` serves `dist/` with the same security
headers (including the Content-Security-Policy) as the live site:

```bash
npm run build && firebase deploy --only hosting
```

The CSP only allows scripts from the site itself, Paddle, Umami and Google Analytics, so the build
is configured never to inline scripts. Analytics are only included in production builds.
