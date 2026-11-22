/**
 * The real public path of the page being rendered.
 *
 * With `build.format: 'preserve'`, src/pages/pricing.astro becomes /pricing.html,
 * but Astro.url.pathname reports it as "/pricing/" at build time. This maps it back,
 * and strips the GitHub Pages preview sub-path (SITE_BASE) if there is one.
 */
const FILE_PAGES = /^\/(pricing|404|legal\/[a-z_]+|lab\/[a-z-]+)$/; // pages published as name.html

export function publicPath(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let p = (base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname) || '/';
  p = p.replace(/index\.html$/, '').replace(/\.html$/, '');
  const bare = p.replace(/\/$/, '');
  if (FILE_PAGES.test(bare)) return `${bare}.html`;
  return bare === '' ? '/' : `${bare}/`;
}
