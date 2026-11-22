/**
 * Colour themes. Each theme sets the page colours, the panel gradients, the
 * accent, and the palettes that light the aura illustrations — so switching a
 * theme recolours everything, illustrations included.
 *
 * The switcher (src/components/ThemeSwitcher.astro) is for comparing options;
 * turn it off in src/site.config.ts once you've picked one, and set `defaultTheme`.
 */

export type Role = 'base' | 'top' | 'core' | 'side' | 'bottom';
export type PaletteName = 'lavender' | 'violet' | 'peach' | 'butter' | 'mint' | 'sky' | 'paper';
type Palettes = Record<PaletteName, Record<Role, string>>;

export interface Theme {
  id: string;
  name: string;
  note: string;
  /** a few colours for the switcher swatch */
  swatch: string[];
  vars: Record<string, string>;
  aura: Palettes;
  hippo: Record<'back' | 'rump' | 'core' | 'shoulder' | 'head' | 'snout' | 'ear' | 'light' | 'glow' | 'belly' | 'leg' | 'base', string>;
}

const g = (a: string, b: string, c: string) => `linear-gradient(125deg, ${a} 0%, ${b} 50%, ${c} 100%)`;

export const themes: Theme[] = [
  {
    id: 'pastel',
    name: 'Pastel',
    note: 'Mint, lilac, butter and peach on black',
    swatch: ['#BDEFD8', '#C9B6F2', '#FFE7A3', '#FFAB7B'],
    vars: {
      '--page-bg': '#0b0b0b',
      '--band-fg': '#ffffff',
      '--band-fg-muted': 'rgba(255,255,255,.78)',
      '--primary': '#ffab7b',
      '--lilac': '#c9b6f2',
      '--mint': '#bdefd8',
      '--butter': '#ffe7a3',
      '--sky': '#bfe3ff',
      '--lavender': '#9b7bda',
      '--grey': '#f0f0ee',
      '--g-mint': g('#d3f3f2', '#e2f7e8', '#f3fad6'),
      '--g-lilac': g('#e8e0ff', '#f3ecfb', '#ffe7d8'),
      '--g-butter': g('#eef8d1', '#faf3d7', '#fde5d2'),
      '--g-sky': g('#dcecff', '#e9f5f1', '#f5f9df'),
    },
    aura: {
      lavender: { base: '#B9A3EC', top: '#E6F3FF', core: '#7A5AD6', side: '#8FCFF0', bottom: '#FFB38A' },
      violet: { base: '#8E73DB', top: '#C9B6F2', core: '#5236B8', side: '#7FB8F0', bottom: '#FF9B6A' },
      peach: { base: '#FFB38A', top: '#FFE7A3', core: '#FF7A3D', side: '#FFD3B0', bottom: '#FF6F2E' },
      butter: { base: '#FFE2A0', top: '#FFF8E6', core: '#FFB38A', side: '#BDEFD8', bottom: '#FF9B5E' },
      mint: { base: '#A9E8CF', top: '#EEFFF7', core: '#4FBF98', side: '#8FCFF0', bottom: '#FFE7A3' },
      sky: { base: '#A9D6F7', top: '#F2FAFF', core: '#7A9BEB', side: '#9FE3CF', bottom: '#C9B6F2' },
      paper: { base: '#F4F0FF', top: '#FFFFFF', core: '#D9CEF9', side: '#D3EDFF', bottom: '#FFE2CC' },
    },
    hippo: {
      back: '#8FCFF0', rump: '#9FE3CF', core: '#6A4BD0', shoulder: '#9B7BDA', head: '#FFE7A3', snout: '#FFB38A',
      ear: '#FFD3B0', light: '#EAF6FF', glow: '#FFF3CF', belly: '#FFB38A', leg: '#FF7A3D',
      base: 'linear-gradient(160deg, #cdbdf4 0%, #b9a3ec 55%, #ffb38a 100%)',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    note: 'Default · closest to the original: sky → pink → cream',
    swatch: ['#C7DCFF', '#FFC2DA', '#FFF1C9', '#FF9CC2'],
    vars: {
      '--page-bg': '#0b0b0b',
      '--band-fg': '#ffffff',
      '--band-fg-muted': 'rgba(255,255,255,.78)',
      '--primary': '#ff9cc2',
      '--lilac': '#d9c8ff',
      '--mint': '#c9f0e4',
      '--butter': '#fff1c9',
      '--sky': '#c7dcff',
      '--lavender': '#8d9cf0',
      '--grey': '#f5f3f9',
      '--g-mint': g('#e1edff', '#f1e8fd', '#ffe3ef'),
      '--g-lilac': g('#ffe3ef', '#fff0ec', '#fff8e1'),
      '--g-butter': g('#fff8e1', '#f5f2ec', '#e1edff'),
      '--g-sky': g('#e1edff', '#eaf3ff', '#fff8e1'),
    },
    aura: {
      lavender: { base: '#B7C6FF', top: '#F0F5FF', core: '#7C8CF0', side: '#FFC2DA', bottom: '#FFB8CF' },
      violet: { base: '#9AA4F2', top: '#DCE3FF', core: '#5A63D6', side: '#FFB3D1', bottom: '#FF9EC0' },
      peach: { base: '#FFB8D2', top: '#FFF1C9', core: '#FF7FAF', side: '#FFD9E6', bottom: '#FF6F9F' },
      butter: { base: '#FFEDBF', top: '#FFFBEF', core: '#FFC2DA', side: '#C7DCFF', bottom: '#FFA8C9' },
      mint: { base: '#BEE9F0', top: '#F2FDFF', core: '#6FC3D6', side: '#C7DCFF', bottom: '#FFF1C9' },
      sky: { base: '#BFD7FF', top: '#F5F9FF', core: '#7FA0F5', side: '#D9C8FF', bottom: '#FFC2DA' },
      paper: { base: '#F6F3FF', top: '#FFFFFF', core: '#E0DAFB', side: '#DDEBFF', bottom: '#FFE3EE' },
    },
    hippo: {
      back: '#C7DCFF', rump: '#CBEFE4', core: '#7C8CF0', shoulder: '#B7A7F5', head: '#FFF1C9', snout: '#FFB8D2',
      ear: '#FFD9E6', light: '#F3F8FF', glow: '#FFFBEF', belly: '#FFC2DA', leg: '#FF8FB8',
      base: 'linear-gradient(160deg, #d6dcff 0%, #b7c6ff 55%, #ffb8d2 100%)',
    },
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    note: 'Teal, indigo and orange — the colours of the reference figure',
    swatch: ['#A8E6E3', '#7C88D6', '#FFD9A8', '#FF8A3D'],
    vars: {
      '--page-bg': '#0b0b0b',
      '--band-fg': '#ffffff',
      '--band-fg-muted': 'rgba(255,255,255,.78)',
      '--primary': '#ff8a3d',
      '--lilac': '#b9c6f2',
      '--mint': '#a8e6e3',
      '--butter': '#ffd9a8',
      '--sky': '#a9ddf5',
      '--lavender': '#5b6bd6',
      '--grey': '#eef2f4',
      '--g-mint': g('#d2f1f2', '#ddeff7', '#eaf0ff'),
      '--g-lilac': g('#e1e6ff', '#ece8fb', '#ffe7d6'),
      '--g-butter': g('#fff0dc', '#fcefe6', '#e3f4f4'),
      '--g-sky': g('#d6ecff', '#dff4f4', '#fff1e2'),
    },
    aura: {
      lavender: { base: '#9AB0E8', top: '#E6F7FF', core: '#4E5BB8', side: '#6FD0DA', bottom: '#FF9A55' },
      violet: { base: '#7C88D6', top: '#C3CCF5', core: '#3E4AA8', side: '#67C6D3', bottom: '#FF8A3D' },
      peach: { base: '#FFAA6E', top: '#FFE2B8', core: '#FF6A1F', side: '#FFC9A3', bottom: '#FF5A14' },
      butter: { base: '#FFD9A8', top: '#FFF4E3', core: '#FF9A55', side: '#9EDFE0', bottom: '#FF7F3A' },
      mint: { base: '#8FDAD8', top: '#EAFDFC', core: '#3FB2B4', side: '#7FB9EE', bottom: '#FFD9A8' },
      sky: { base: '#9CCFF0', top: '#EFF9FF', core: '#5E8EDD', side: '#8FE0D8', bottom: '#B9C6F2' },
      paper: { base: '#F1F5FF', top: '#FFFFFF', core: '#D3DDF7', side: '#CDEFF0', bottom: '#FFE0C8' },
    },
    hippo: {
      back: '#8FE0E8', rump: '#A8E6E3', core: '#4E5BB8', shoulder: '#7C88D6', head: '#FFE2B8', snout: '#FFAA6E',
      ear: '#FFC9A3', light: '#E8FBFF', glow: '#FFF4E3', belly: '#FF9A55', leg: '#FF6A1F',
      base: 'linear-gradient(160deg, #b5c8f0 0%, #9ab0e8 55%, #ffaa6e 100%)',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    note: 'Apricot, rose and plum on deep plum',
    swatch: ['#FFE0A8', '#F4B9CF', '#D9A9E6', '#FF7A6B'],
    vars: {
      '--page-bg': '#1c1020',
      '--band-fg': '#ffffff',
      '--band-fg-muted': 'rgba(255,255,255,.78)',
      '--primary': '#ff8f7e',
      '--lilac': '#e3c4f0',
      '--mint': '#c8e9d8',
      '--butter': '#ffe2b0',
      '--sky': '#f7c6d9',
      '--lavender': '#b26ac7',
      '--grey': '#f7f0f2',
      '--g-mint': g('#ffe8d6', '#ffe1e4', '#f6ddf2'),
      '--g-lilac': g('#f3e0fa', '#fbe3ec', '#ffe9d9'),
      '--g-butter': g('#fff2d6', '#ffe6d6', '#ffdde6'),
      '--g-sky': g('#ffe3ec', '#f8e6f5', '#eee3fb'),
    },
    aura: {
      lavender: { base: '#D9A9E6', top: '#FFF0F7', core: '#9B4FC2', side: '#FF9EB5', bottom: '#FF8A5C' },
      violet: { base: '#B37CD3', top: '#EBCDF5', core: '#7A3AA8', side: '#FF8FAB', bottom: '#FF7A6B' },
      peach: { base: '#FFB08F', top: '#FFE6B8', core: '#FF6F55', side: '#FFC7D3', bottom: '#FF5A45' },
      butter: { base: '#FFE0A8', top: '#FFF8EA', core: '#FFA27F', side: '#F6B7D2', bottom: '#FF8A5C' },
      mint: { base: '#B6E3CF', top: '#F2FFF8', core: '#5FBF98', side: '#FFC7D3', bottom: '#FFE0A8' },
      sky: { base: '#F4B9CF', top: '#FFF3F7', core: '#D9668F', side: '#D9A9E6', bottom: '#FFB08F' },
      paper: { base: '#FFF3F1', top: '#FFFFFF', core: '#F6D9E6', side: '#F3E0FA', bottom: '#FFE2D3' },
    },
    hippo: {
      back: '#F6B7D2', rump: '#FFC7D3', core: '#9B4FC2', shoulder: '#D9A9E6', head: '#FFE6B8', snout: '#FFB08F',
      ear: '#FFC7D3', light: '#FFF0F7', glow: '#FFF8EA', belly: '#FF8A5C', leg: '#FF6F55',
      base: 'linear-gradient(160deg, #e9c3f0 0%, #d9a9e6 55%, #ffb08f 100%)',
    },
  },
];

/** CSS custom properties for one theme. */
export function themeVars(t: Theme): string {
  const out: string[] = Object.entries(t.vars).map(([k, v]) => `${k}:${v}`);
  for (const [pal, roles] of Object.entries(t.aura)) {
    for (const [role, v] of Object.entries(roles)) out.push(`--a-${pal}-${role}:${v}`);
  }
  for (const [k, v] of Object.entries(t.hippo)) out.push(`--h-${k}:${v}`);
  return out.join(';');
}

/** All theme CSS: the default theme on :root, others on html[data-theme=…]. */
export function themeCss(defaultId: string): string {
  return themes
    .map((t) => `${t.id === defaultId ? "html:not([data-theme])," : ""}html[data-theme="${t.id}"]{${themeVars(t)}}`)
    .join('\n');
}
