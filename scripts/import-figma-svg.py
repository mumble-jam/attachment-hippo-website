"""
Cleans SVGs exported from Figma's vector generator so they can be inlined and animated.

  python3 scripts/import-figma-svg.py <exported.svg>... --out src/illustrations

- drops the grey preview background Figma adds
- turns layer names (<g id="pen">) into data-part="pen" hooks for CSS animation
- removes per-path ids (they would collide when several SVGs share a page)
- removes the fixed width/height so CSS controls the size

Source file: Figma "Attachment Hippo — icons & illustrations"
https://www.figma.com/design/oEAZXMsLboi305HbV4zTNN
"""
import re, sys
from pathlib import Path

args = sys.argv[1:]
out = Path(args[args.index('--out') + 1]) if '--out' in args else Path('src/illustrations')
files = [a for a in args if a.endswith('.svg')]
out.mkdir(parents=True, exist_ok=True)

for f in files:
    s = Path(f).read_text()
    s = re.sub(r'<rect width="\d+" height="\d+" fill="#E5E5E5"/>\s*', '', s)
    s = re.sub(r'<g id="Generated icon">', '<g>', s)
    s = re.sub(r'<g id="([^"]+)">', lambda m: f'<g data-part="{m.group(1)}">', s)
    s = re.sub(r' id="Vector[^"]*"', '', s)
    s = re.sub(r'<svg width="\d+" height="\d+" ', '<svg ', s)
    s = s.replace('stroke="black"', 'stroke="currentColor"')
    s = re.sub(r'>\s+<', '><', s).strip() + '\n'
    (out / Path(f).name).write_text(s)
    print('wrote', out / Path(f).name, len(s), 'bytes')
