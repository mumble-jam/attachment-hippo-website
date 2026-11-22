# Attachment Hippo — brand kit

A flat, single-colour hippo traced from the 3D reference render. The eye and nostril
are **cut out** of the shape (not drawn on top), so every file works in one colour on
any background — black, white or lavender.

## Files

```
brand/
├── svg/                          ← masters, use these whenever a tool accepts SVG
│   ├── mark-black.svg            hippo only
│   ├── mark-white.svg
│   ├── mark-lavender.svg
│   ├── mark-simple-*.svg         no eye/nostril — for anything rendered under ~40 px
│   ├── lockup-black.svg          hippo + “Attachment Hippo” (text outlined, no font needed)
│   ├── lockup-white.svg
│   ├── lockup-lavender.svg       lavender hippo + black wordmark
│   ├── app-icon-tile.svg         white hippo on a lavender square
│   ├── app-icon-transparent.svg  lavender hippo, transparent square
│   └── favicon.svg
├── png/
│   ├── marketplace/              ← upload these to Google Cloud (see below)
│   └── general/                  1024 px marks, 1600 px lockups, 512/1024 app icons, social card
└── tools/                        the scripts that generate everything above
```

## Google Workspace Marketplace — what goes where

| Where (Google Cloud console) | Field | File |
|---|---|---|
| Marketplace SDK → Store listing → Graphic assets | Application icon 128 × 128 | `png/marketplace/app-icon-128.png` |
| Marketplace SDK → Store listing → Graphic assets | Application icon 32 × 32 | `png/marketplace/app-icon-32.png` |
| Marketplace SDK → Store listing → Graphic assets | Application card banner 220 × 140 | `png/marketplace/card-banner-220x140.png` |
| Google Auth Platform → Branding | App logo 120 × 120 | `png/marketplace/oauth-consent-logo-120.png` |
| Apps Script `appsscript.json` → `addOns.common.logoUrl` | Icon in Gmail’s side panel | host `png/marketplace/app-icon-transparent-96.png` (or `-128`) on attachmenthippo.com and use its HTTPS URL |
| Store listing → Screenshots (1280 × 800) | — | **Not included** — capture these from the real add-on in Gmail |

Notes:

- The 32 and 48 px icons use the simplified hippo — at that size the eye and nostril
  turn into noise.
- The tiles are full squares; any corner rounding is left to wherever Google displays them.
- Check the current size requirements in the console before uploading. Google changes them
  from time to time, and you can regenerate the files at any size (see *Regenerating*).

## Colour

| Name | Hex | Use |
|---|---|---|
| Ink | `#0B0B0B` | Text, mono logo |
| Paper | `#FFFFFF` | Backgrounds, logo on dark/lavender |
| Hippo Lavender | `#9B7BDA` | The hippo, icon tiles, large fields. White on it passes 3 : 1 (graphics); black text on it passes 7 : 1. **Do not set white body text on it.** |
| Violet | `#6A4BD0` | Links, buttons and accents on white (5.9 : 1, WCAG AA) |
| Mist | `#F1EDFA` | Quiet tinted panels |

## Type

Inter Tight (wordmark, headings) and Inter (running text), both open source (SIL OFL).
The wordmark is Inter Tight Bold, tracking −2 %. In the SVG lockups it is converted
to outlines, so no font has to be installed.

## Usage

- **Clear space:** keep at least the height of the ear free on every side.
- **Minimum size:** 16 px wide for the simple mark, 40 px wide for the full mark,
  120 px wide for the lockup.
- Use it in one colour only. No gradients, outlines, shadows or 3D: the glossy render was
  the reference, not the logo.
- Don’t stretch it, rotate it or flip it. The hippo always faces right, toward the content.

## Regenerating

The silhouette is defined as hand-placed Bézier segments in `tools/build_mark.py`.

```bash
python3 brand/tools/build_mark.py                  # writes tools/mark.json
python3 -m venv .venv && .venv/bin/pip install -r brand/tools/requirements.txt
.venv/bin/python brand/tools/build_kit.py          # writes svg/ + png/, refreshes the site favicon + og image
```

`build_kit.py` renders PNGs with your installed Google Chrome (headless). The website
reads the same `mark.json`, so a logo change updates the site on the next build.
