// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/reference/configuration-reference/
// Preview builds for GitHub Pages live under a sub-path (SITE_BASE=/repo-name/).
// The normal build (attachmenthippo.com) leaves it unset.
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site: 'https://attachmenthippo.com',
  base,
  // `preserve` keeps the old URLs working: src/pages/pricing.astro → /pricing.html,
  // src/pages/blog/index.astro → /blog/. The Gmail add-on links to
  // /pricing.html?plan=…#email=…, so that URL must not change.
  build: {
    format: 'preserve',
    // The site's Content-Security-Policy only allows scripts from 'self',
    // so never inline the bundled CSS/JS into the HTML.
    inlineStylesheets: 'never',
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/lab/'),
      // Match the real URLs produced by `format: 'preserve'`.
      serialize(item) {
        if (/\/(pricing|legal\/[a-z_]+)$/.test(item.url)) item.url += '.html';
        else if (!item.url.endsWith('/')) item.url += '/';
        return item;
      },
    }),
  ],
});
