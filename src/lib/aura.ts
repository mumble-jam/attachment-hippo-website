/**
 * Aura illustration engine.
 *
 * Turns the Figma-generated line icons in src/illustrations/*.svg into "aura"
 * illustrations: every filled shape becomes a soft-edged mask lit from inside by
 * blurred colour blobs; every line-only shape (dollar sign, text lines, stems…)
 * becomes a soft mark on top. Colours come from the site palette.
 */

export type PaletteName = 'lavender' | 'violet' | 'peach' | 'butter' | 'mint' | 'sky' | 'paper';

interface Palette {
  base: string;
  /** brightest zone (top of the form) */
  top: string;
  /** deep, saturated core */
  core: string;
  /** cool side light */
  side: string;
  /** warm colour where the form meets the ground */
  bottom: string;
}

/**
 * Palette colours are CSS variables (--a-<palette>-<role>) set by the active theme
 * (src/lib/themes.ts), so switching theme recolours every illustration.
 */
const roles = ['base', 'top', 'core', 'side', 'bottom'] as const;
const names: PaletteName[] = ['lavender', 'violet', 'peach', 'butter', 'mint', 'sky', 'paper'];
export const palettes = Object.fromEntries(
  names.map((n) => [n, Object.fromEntries(roles.map((r) => [r, `var(--a-${n}-${r})`])) as unknown as Palette]),
) as Record<PaletteName, Palette>;

export type DetailStyle = 'ink' | 'light' | 'stem' | 'violet' | 'none';
const detailStyles: Record<Exclude<DetailStyle, 'none'>, { color: string; opacity: number; blur: number }> = {
  ink: { color: '#2A1D63', opacity: 0.38, blur: 1.3 },
  light: { color: '#FFFFFF', opacity: 0.6, blur: 1.2 },
  violet: { color: '#5236B8', opacity: 0.7, blur: 0.8 },
  stem: { color: '#3E9C7A', opacity: 0.85, blur: 0.7 },
};

export interface LayerRecipe {
  /** data-part name(s) in the source SVG */
  part: string;
  palette: PaletteName;
  /** only use these filled paths of the part (0-based) — e.g. split leaves from pot */
  pick?: number[];
  details?: DetailStyle;
  /** stroke width of the line details, in source units (default 8) */
  detailWidth?: number;
  /** grow the shape by this outline width (default 8, the Figma outline) — lower for thin shapes */
  expand?: number;
  /** draw soft seams around the pieces of this layer (off by default) */
  seams?: boolean;
  /** extra data-part names for animation hooks */
  hook?: string;
}

export interface Blob {
  x: number; // % of scene width
  y: number; // % of scene height
  r: number; // % of scene width
  blur: number; // % of scene width
  color: string;
  drift?: 'a' | 'b' | 'c';
  delay?: number;
  opacity?: number;
}

export interface Layer {
  part: string;
  mask: string; // CSS url(...) value
  base: string;
  blobs: Blob[];
  details: { d: string[]; color: string; opacity: number; blur: number; width: number }[];
  box: { l: number; t: number; r: number; b: number }; // % of scene
}

/* ------------------------------------------------------------------ SVG parsing */

function extractGroup(svg: string, part: string): string {
  const open = `<g data-part="${part}">`;
  const start = svg.indexOf(open);
  if (start < 0) throw new Error(`aura: part "${part}" not found`);
  let i = start + open.length;
  let depth = 1;
  while (depth > 0 && i < svg.length) {
    const nextOpen = svg.indexOf('<g', i);
    const nextClose = svg.indexOf('</g>', i);
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 2;
    } else {
      depth--;
      i = nextClose + 4;
    }
  }
  return svg.slice(start + open.length, i - 4);
}

function paths(group: string) {
  return [...group.matchAll(/<path ([^>]*)\/>/g)].map((m) => {
    const attrs = m[1];
    const d = /\bd="([^"]+)"/.exec(attrs)![1];
    const fill = /\bfill="([^"]+)"/.exec(attrs)?.[1] ?? 'none';
    return { d, filled: fill !== 'none' };
  });
}

/** Rough bounding box from absolute path commands (M L C H V Z — what Figma exports). */
function bbox(ds: string[]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const add = (x: number, y: number) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  };
  for (const d of ds) {
    let cmd = 'M';
    let cx = 0,
      cy = 0;
    const tokens = d.match(/[MLCHVZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
    let k = 0;
    while (k < tokens.length) {
      const t = tokens[k];
      if (/[MLCHVZ]/i.test(t)) {
        cmd = t.toUpperCase();
        k++;
        if (cmd === 'Z') continue;
      }
      if (cmd === 'H') {
        cx = +tokens[k++];
        add(cx, cy);
      } else if (cmd === 'V') {
        cy = +tokens[k++];
        add(cx, cy);
      } else {
        cx = +tokens[k++];
        cy = +tokens[k++];
        add(cx, cy);
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

/* ------------------------------------------------------------------ build */

function maskUrl(viewBox: string, ds: string[], edge: number, expand: number) {
  const [, , vw, vh] = viewBox.split(/\s+/).map(Number);
  const pad = Math.max(vw, vh) * 0.1;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="none">` +
    // The blur area must cover the whole drawing: a region sized to each shape's own box
    // (the default) clips thin shapes and leaves hard-cut edges.
    `<filter id="e" filterUnits="userSpaceOnUse" x="${-pad}" y="${-pad}" width="${vw + 2 * pad}" height="${vh + 2 * pad}">` +
    `<feGaussianBlur stdDeviation="${edge}"/></filter>` +
    `<g fill="#fff" stroke="#fff" stroke-width="${expand}" stroke-linejoin="round" stroke-linecap="round" filter="url(#e)">` +
    `${ds.map((d) => `<path d="${d}"/>`).join('')}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Light a box with a palette: glow on top, deep core, cool side, warm base. */
export function lightBlobs(
  box: { l: number; t: number; r: number; b: number },
  p: Palette,
  seed = 0,
): Blob[] {
  const w = box.r - box.l;
  const h = box.b - box.t;
  const m = Math.max(w, h);
  const drifts = ['a', 'b', 'c'] as const;
  const dr = (i: number) => drifts[(i + seed) % 3];
  return [
    { x: box.l + w * 0.05, y: box.t + h * 0.45, r: m * 0.32, blur: m * 0.17, color: p.side, drift: dr(1), delay: -seed * 1.7 },
    { x: box.l + w * 0.46, y: box.t + h * 0.58, r: m * 0.4, blur: m * 0.18, color: p.core, drift: dr(0), delay: -seed * 2.3 },
    { x: box.l + w * 0.58, y: box.t + h * 0.1, r: m * 0.28, blur: m * 0.15, color: p.top, drift: dr(2), delay: -seed * 1.1, opacity: 0.85 },
    { x: box.l + w * 0.5, y: box.b + h * 0.02, r: m * 0.28, blur: m * 0.13, color: p.bottom, opacity: 0.9 },
    { x: box.l + w * 0.82, y: box.t + h * 0.3, r: m * 0.14, blur: m * 0.08, color: p.top, opacity: 0.9 },
  ];
}

export function buildLayers(
  svg: string,
  recipe: LayerRecipe[],
): { viewBox: string; layers: Layer[]; ground: { x: number; y: number; w: number } } {
  const viewBox = /viewBox="([^"]+)"/.exec(svg)![1];
  const [, , vw, vh] = viewBox.split(/\s+/).map(Number);
  const toBox = (bb: ReturnType<typeof bbox>, pad: number) => ({
    l: ((bb.minX - pad) / vw) * 100,
    t: ((bb.minY - pad) / vh) * 100,
    r: ((bb.maxX + pad) / vw) * 100,
    b: ((bb.maxY + pad) / vh) * 100,
  });

  const layers = recipe.map((rc, i) => {
    const ps = paths(extractGroup(svg, rc.part));
    const allFilled = ps.filter((p) => p.filled).map((p) => p.d);
    const filled = rc.pick ? rc.pick.map((k) => allFilled[k]).filter(Boolean) : allFilled;
    const lines = ps.filter((p) => !p.filled).map((p) => p.d);
    // The Figma shapes were drawn with an 8-unit outline; pieces often meet only
    // through that outline. Grow the mask by the same amount so seams close.
    const expand = rc.expand ?? 8;
    // Light the piece itself, but animate around the whole part, so split
    // pieces of one part (pen body, band, nib…) move together.
    const lightBox = toBox(bbox(filled.length ? filled : lines), expand / 2);
    const box = toBox(bbox(allFilled.length ? allFilled : lines), expand / 2);
    const p = palettes[rc.palette];

    const details: Layer['details'] = [];
    // soft seams between the pieces of a layer (pot rim / body, pen band…)
    if (filled.length > 1 && rc.seams === true) {
      details.push({ d: filled, color: p.core, opacity: 0.5, blur: 1, width: 3 });
    }
    const style = rc.details && rc.details !== 'none' ? detailStyles[rc.details] : null;
    if (style && lines.length) details.push({ d: lines, ...style, width: rc.detailWidth ?? 8 });

    return {
      part: rc.hook ? `${rc.part} ${rc.hook}` : rc.part,
      mask: filled.length ? maskUrl(viewBox, filled, Math.max(vw, vh) / 220, expand) : '',
      base: `linear-gradient(170deg, ${p.base} 0%, ${p.base} 55%, ${p.bottom} 115%)`,
      blobs: filled.length ? lightBlobs(lightBox, p, i) : [],
      details,
      box,
    };
  });

  // a soft shadow under the whole illustration
  const all = layers.filter((L) => L.blobs.length);
  const l = Math.min(...all.map((L) => L.box.l));
  const r = Math.max(...all.map((L) => L.box.r));
  const b = Math.max(...all.map((L) => L.box.b));
  return { viewBox, layers, ground: { x: (l + r) / 2, y: b, w: (r - l) * 0.8 } };
}
