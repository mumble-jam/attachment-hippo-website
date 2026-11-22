/**
 * Preview builds (GitHub Pages) are served from a sub-path, e.g.
 * https://mumble-jam.github.io/attachment-hippo-website/.
 * Astro already prefixes its own assets (/_astro/…) with `base`; this rewrites the
 * site's hand-written root links (/pricing.html, /js/…, /blog/…, url(/…)) in the
 * built HTML so they work under that sub-path too.
 *
 *   node scripts/rebase.mjs dist /attachment-hippo-website
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const [dir = 'dist', rawBase = ''] = process.argv.slice(2);
const base = rawBase.replace(/\/$/, '');
if (!base) {
  console.log('rebase: no base given, nothing to do');
  process.exit(0);
}

const files = [];
const walk = (d) => {
  for (const name of readdirSync(d)) {
    const p = join(d, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
};
walk(dir);

// href="/x" src="/x" action="/x" content="/x" — but not "//host", not already-based paths
const attr = /\b(href|src|action|poster)=(["'])\/(?!\/)/g;
const cssUrl = /url\((["']?)\/(?!\/)/g;

let changed = 0;
for (const f of files) {
  const before = readFileSync(f, 'utf8');
  const after = before
    .replace(attr, (m, name, q, offset, s) =>
      s.startsWith(`${base}/`, offset + m.length - 1) ? m : `${name}=${q}${base}/`,
    )
    .replace(cssUrl, (m, q, offset, s) => (s.startsWith(`${base}/`, offset + m.length - 1) ? m : `url(${q}${base}/`));
  if (after !== before) {
    writeFileSync(f, after);
    changed++;
  }
}
console.log(`rebase: updated ${changed} of ${files.length} HTML files for ${base}/`);
