"""
Builds the Attachment Hippo brand kit from brand/tools/mark.json.

  python3 brand/tools/build_mark.py            # 1. regenerate the mark path (only if you edited it)
  <venv>/bin/python brand/tools/build_kit.py   # 2. write SVGs, render PNGs (needs fonttools + brotli, and Google Chrome)

Outputs go to brand/svg and brand/png. The script also refreshes the website's
favicon + social image in public/.
"""
import json, os, subprocess, sys, tempfile, shutil
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / 'brand'
SVG_DIR, PNG_DIR = BRAND / 'svg', BRAND / 'png'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
FONT = ROOT / 'node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2'

# ---------------------------------------------------------------- palette
INK = '#0B0B0B'
PAPER = '#FFFFFF'
LAVENDER = '#9B7BDA'   # the hippo. White on it ≥ 3:1 (graphics), black on it ≥ 7:1
VIOLET = '#6A4BD0'     # text/UI accent on white, 5.9:1 (AA)
MIST = '#F1EDFA'       # quiet tint field

mark = json.loads((BRAND / 'tools/mark.json').read_text())
VB_W, VB_H = 1000, float(mark['viewBox'].split()[3])
BODY, FEATURES = mark['body'], mark['features']


def mark_paths(fill, simple=False):
    """Eye and nostril are cut out (evenodd) so the mark works in one colour on any background."""
    d = BODY if simple else BODY + FEATURES
    return f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/>'


def place_mark(fill, x, y, width, simple=False):
    s = width / VB_W
    return f'<g transform="translate({x:.2f} {y:.2f}) scale({s:.5f})">{mark_paths(fill, simple)}</g>'


# ---------------------------------------------------------------- wordmark → outlines
def wordmark_path(text='Attachment Hippo', weight=700, tracking=-0.02):
    font = TTFont(str(FONT))
    font = instantiateVariableFont(font, {'wght': weight})
    gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font['hmtx']
    upm = font['head'].unitsPerEm
    cap = font['OS/2'].sCapHeight
    x, parts = 0, []
    for ch in text:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        # flip y (font units are y-up), baseline at y=0
        gs[g].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
        parts.append(pen.getCommands())
        x += hmtx[g][0] + tracking * upm
    width = x - tracking * upm
    return ' '.join(parts), width, cap, upm


WM_D, WM_W, WM_CAP, UPM = wordmark_path()


def place_wordmark(fill, x, baseline_y, cap_height):
    s = cap_height / WM_CAP
    return f'<g transform="translate({x:.2f} {baseline_y:.2f}) scale({s:.5f})"><path fill="{fill}" d="{WM_D}"/></g>', WM_W * s


def svg_doc(w, h, inner, bg=None, title='Attachment Hippo'):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" width="{w:g}" height="{h:g}" '
            f'role="img" aria-label="{title}"><title>{title}</title>{rect}{inner}</svg>\n')


# ---------------------------------------------------------------- compositions
def mark_svg(fill, simple=False):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 {VB_H:g}" role="img" aria-label="Attachment Hippo">'
            f'<title>Attachment Hippo</title>{mark_paths(fill, simple)}</svg>\n')


def lockup_svg(mark_fill, text_fill, bg=None):
    mark_w = 1000
    mark_h = VB_H
    cap = mark_h * 0.42
    gap = mark_h * 0.32
    pad = 0 if bg is None else mark_h * 0.5
    baseline = pad + mark_h / 2 + cap / 2
    wm, wm_w = place_wordmark(text_fill, pad + mark_w + gap, baseline, cap)
    w = pad * 2 + mark_w + gap + wm_w
    h = pad * 2 + mark_h
    return svg_doc(round(w, 1), round(h, 1), place_mark(mark_fill, pad, pad, mark_w) + wm, bg)


def square_icon(size, bg, fill, fill_ratio, simple=False, radius=0):
    """Mark centred in a square. fill_ratio = mark width / icon width."""
    mw = size * fill_ratio
    mh = mw * VB_H / VB_W
    x, y = (size - mw) / 2, (size - mh) / 2 + mh * 0.02
    rect = ''
    if bg:
        rect = f'<rect width="{size}" height="{size}" rx="{radius}" fill="{bg}"/>'
    return svg_doc(size, size, rect + place_mark(fill, x, y, mw, simple))


def banner_svg(w, h, bg, fill):
    mw = w * 0.62
    mh = mw * VB_H / VB_W
    return svg_doc(w, h, place_mark(fill, (w - mw) / 2, (h - mh) / 2, mw), bg)


def og_svg():
    """1200×630 social card in the website's Swiss style."""
    w, h, m = 1200, 630, 64
    inner = f'<rect width="{w}" height="{h}" fill="{PAPER}"/>'
    inner += f'<rect x="{m}" y="{m + 70}" width="{w - 2 * m}" height="3" fill="{INK}"/>'
    lock, _ = place_wordmark(INK, m + 88, m + 34, 26)
    inner += place_mark(INK, m, m, 72) + lock
    inner += f'<rect x="{m}" y="{h - m - 3}" width="{w - 2 * m}" height="1" fill="{INK}"/>'
    # headline set as live text and rendered by Chrome with the bundled font
    inner += (f'<text x="{m - 4}" y="{m + 210}" font-family="Inter Tight" font-size="104" letter-spacing="-4" fill="{INK}">'
              f'<tspan>Save </tspan><tspan font-weight="700">Gmail™</tspan><tspan> attachments</tspan>'
              f'<tspan x="{m - 4}" dy="100">to </tspan><tspan font-weight="700">Drive™</tspan><tspan> automatically</tspan></text>')
    inner += place_mark(LAVENDER, w - m - 260, h - m - 3 - 151, 260)
    inner += (f'<text x="{m}" y="{h - m - 24}" font-family="Inter Tight" font-size="22" font-weight="600" '
              f'letter-spacing="1.5" fill="{INK}">ATTACHMENTHIPPO.COM</text>')
    return svg_doc(w, h, inner)


# ---------------------------------------------------------------- render
def render(svg_text, out_png, w, h):
    out_png.parent.mkdir(parents=True, exist_ok=True)
    font_url = FONT.as_uri()
    html = (f'<!doctype html><html><head><style>@font-face{{font-family:"Inter Tight";src:url("{font_url}") format("woff2");'
            f'font-weight:100 900}}html,body{{margin:0;background:transparent}}svg{{display:block;width:{w}px;height:{h}px}}'
            f'</style></head><body>{svg_text}</body></html>')
    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / 'page.html'
        page.write_text(html)
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
                        '--default-background-color=00000000', f'--window-size={w},{h}',
                        f'--screenshot={out_png}', page.as_uri()],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)


def main():
    if SVG_DIR.exists(): shutil.rmtree(SVG_DIR)
    if PNG_DIR.exists(): shutil.rmtree(PNG_DIR)

    # --- master SVGs
    for name, fill in [('black', INK), ('white', PAPER), ('lavender', LAVENDER)]:
        write(SVG_DIR / f'mark-{name}.svg', mark_svg(fill))
        write(SVG_DIR / f'mark-simple-{name}.svg', mark_svg(fill, simple=True))
    write(SVG_DIR / 'lockup-black.svg', lockup_svg(INK, INK))
    write(SVG_DIR / 'lockup-white.svg', lockup_svg(PAPER, PAPER))
    write(SVG_DIR / 'lockup-lavender.svg', lockup_svg(LAVENDER, INK))
    write(SVG_DIR / 'app-icon-tile.svg', square_icon(512, LAVENDER, PAPER, 0.78))
    write(SVG_DIR / 'app-icon-transparent.svg', square_icon(512, None, LAVENDER, 0.92))
    write(SVG_DIR / 'favicon.svg', square_icon(64, None, LAVENDER, 0.96, simple=True))

    # --- Google Workspace Marketplace
    mk = PNG_DIR / 'marketplace'
    for s in (32, 48, 96, 128):
        simple = s <= 48
        render(square_icon(s, LAVENDER, PAPER, 0.80, simple), mk / f'app-icon-{s}.png', s, s)
        render(square_icon(s, None, LAVENDER, 0.94, simple), mk / f'app-icon-transparent-{s}.png', s, s)
    render(square_icon(120, LAVENDER, PAPER, 0.78), mk / 'oauth-consent-logo-120.png', 120, 120)
    render(banner_svg(220, 140, LAVENDER, PAPER), mk / 'card-banner-220x140.png', 220, 140)
    render(banner_svg(220, 140, PAPER, INK), mk / 'card-banner-220x140-mono.png', 220, 140)

    # --- general use
    gen = PNG_DIR / 'general'
    for name, fill in [('black', INK), ('white', PAPER), ('lavender', LAVENDER)]:
        render(mark_svg(fill), gen / f'mark-{name}-1024.png', 1024, round(1024 * VB_H / VB_W))
    for name, (mf, tf) in {'black': (INK, INK), 'white': (PAPER, PAPER), 'lavender': (LAVENDER, INK)}.items():
        svg = lockup_svg(mf, tf)
        vb = svg.split('viewBox="0 0 ')[1].split('"')[0].split()
        w = 1600
        render(svg, gen / f'lockup-{name}-1600.png', w, round(w * float(vb[1]) / float(vb[0])))
    render(square_icon(512, LAVENDER, PAPER, 0.78), gen / 'app-icon-512.png', 512, 512)
    render(square_icon(1024, LAVENDER, PAPER, 0.78), gen / 'app-icon-1024.png', 1024, 1024)
    render(og_svg(), gen / 'social-card-1200x630.png', 1200, 630)

    # --- website
    pub = ROOT / 'public'
    shutil.copy(SVG_DIR / 'favicon.svg', pub / 'favicon.svg')
    shutil.copy(gen / 'social-card-1200x630.png', pub / 'og-default.png')
    render(square_icon(180, LAVENDER, PAPER, 0.78), pub / 'apple-touch-icon.png', 180, 180)
    ico_src = PNG_DIR / 'tmp-ico.png'
    render(square_icon(64, LAVENDER, PAPER, 0.84, simple=True), ico_src, 64, 64)
    try:
        from PIL import Image
        Image.open(ico_src).save(pub / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    except ImportError:
        print('Pillow not installed — favicon.ico not refreshed')
    ico_src.unlink()

    print('done:', sum(1 for _ in BRAND.rglob('*.svg')), 'svg,', sum(1 for _ in BRAND.rglob('*.png')), 'png')


if __name__ == '__main__':
    main()
