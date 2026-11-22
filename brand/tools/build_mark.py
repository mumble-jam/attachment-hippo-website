"""Generates the hippo mark path from hand-placed cubic Bézier segments.
Edit POINTS to adjust the silhouette, then run:  python3 brand/tools/build_mark.py
Coordinates are traced from the 1536x1024 reference render, then normalised."""
import json, sys

START = (868, 272)
# Each segment: (control 1, control 2, end point) — image coordinates of the reference render.
SEGMENTS = [
    # ear
    ((876, 268), (874, 256), (874, 236)),
    ((874, 211.7), (893.7, 192), (918, 192)),
    ((942.3, 192), (962, 211.7), (962, 236)),
    ((962, 256), (959, 268), (968, 272)),
    # forehead -> snout
    ((1004, 288), (1078, 322), (1098, 378)),
    ((1107, 397), (1125, 413), (1150, 413)),
    ((1250, 413), (1365, 450), (1365, 575)),
    ((1365, 690), (1310, 755), (1230, 755)),
    # under the jaw
    ((1150, 755), (1060, 725), (1000, 712)),
    ((965, 704), (932, 735), (932, 772)),
    # front leg
    ((932, 815), (925, 868), (880, 868)),
    ((840, 868), (790, 867), (752, 866)),
    ((722, 866), (712, 845), (712, 815)),
    # belly
    ((712, 785), (695, 774), (668, 774)),
    ((610, 772), (540, 776), (488, 778)),
    ((462, 779), (447, 795), (447, 820)),
    # back leg
    ((447, 850), (440, 868), (405, 868)),
    ((370, 868), (330, 867), (300, 866)),
    ((275, 866), (264, 845), (264, 820)),
    # rump + back
    ((264, 795), (250, 768), (232, 748)),
    ((214, 728), (190, 660), (190, 600)),
    ((190, 480), (250, 395), (330, 350)),
    ((410, 305), (520, 282), (620, 282)),
    ((720, 282), (820, 296), (868, 272)),
]
POINTS = [START] + [p for seg in SEGMENTS for p in seg]
EYE = (1025, 392, 21)            # cx, cy, r
NOSTRIL = (1287, 512, 22, 15, 25)  # cx, cy, rx, ry, rotation°

# bounds -> normalise into a viewBox with a little padding
xs = [p[0] for p in POINTS]; ys = [p[1] for p in POINTS]
PAD = 8
ox, oy = min(xs) - PAD, min(ys) - PAD
W, H = max(xs) - min(xs) + 2 * PAD, max(ys) - min(ys) + 2 * PAD
SCALE = 1000 / W  # normalise width to 1000 units
def T(x, y): return (round((x - ox) * SCALE, 1), round((y - oy) * SCALE, 1))
def f(v): return ('%g' % v)

def body_path():
    x, y = T(*START)
    d = 'M%s %s' % (f(x), f(y))
    for seg in SEGMENTS:
        d += 'C' + ' '.join('%s %s' % tuple(f(v) for v in T(*p)) for p in seg)
    return d + 'Z'

def circle(cx, cy, r):
    cx, cy = T(cx, cy); r = round(r * SCALE, 1)
    # counter-clockwise so it cuts a hole with nonzero OR evenodd
    return 'M%s %sa%s %s 0 1 0 %s 0a%s %s 0 1 0 %s 0Z' % (f(round(cx - r, 1)), f(cy), f(r), f(r), f(2 * r), f(r), f(r), f(-2 * r))

def ellipse(cx, cy, rx, ry, rot):
    cx, cy = T(cx, cy); rx = round(rx * SCALE, 1); ry = round(ry * SCALE, 1)
    import math
    a = math.radians(rot); dx, dy = rx * math.cos(a), rx * math.sin(a)
    sx, sy = round(cx - dx, 1), round(cy - dy, 1)
    return 'M%s %sa%s %s %s 1 0 %s %sa%s %s %s 1 0 %s %sZ' % (
        f(sx), f(sy), f(rx), f(ry), f(rot), f(round(2 * dx, 1)), f(round(2 * dy, 1)),
        f(rx), f(ry), f(rot), f(round(-2 * dx, 1)), f(round(-2 * dy, 1)))

out = {
    'viewBox': '0 0 1000 %s' % f(round(H * SCALE)),
    'body': body_path(),
    'features': circle(*EYE) + ellipse(*NOSTRIL),
}
json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else 'brand/tools/mark.json', 'w'), indent=1)
print(out['viewBox']); print(len(out['body']), 'chars')
