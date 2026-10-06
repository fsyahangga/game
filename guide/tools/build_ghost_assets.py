"""Build PERANG DEDEMIT placeholder assets from one base image per dedemit.

From assets/ghosts/base/<dedemit>.(webp|png) (full body, facing RIGHT, flat magenta or green background) this writes,
for the dedemit's engine slot:
  - a puppet sprite atlas with the slot's exact layout (same cells, rows and anchor), where each state is the base
    pose squashed, leaned, shifted or rotated (idle breath, walk bob, lunge, hurt recoil, fall ...);
  - the slot's metrics bounds/heights recomputed from those frames (emitters and playback stay as tuned);
  - HUD portrait (384x384), character-select art and the ultimate cut-in (1600x686);
  - four skill icons and the slot's effect sprites (recoloured in the dedemit's colour, or replaced by the dedemit
    itself, a kepeng coin, a rope or a spirit orb).
It is a stand-in until real animation strips go through the sprite pipeline (guide/character-workflow.md).

Run from the project root:  python guide/tools/build_ghost_assets.py [dedemit ...]
Needs Python 3 with Pillow and numpy (pip install pillow numpy) and Node.js on PATH (to read/write manifest.js).
Afterwards run:  node guide/tools/update_precache.mjs
"""
import json, math, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path.cwd()
BASE_DIR = ROOT / 'assets/ghosts/base'

# slot = engine kit slot; portrait = [cx, cy, size] in base pixels (1254 px images); color = glow colour;
# scale = height relative to the slot's old fighter; lift = px the figure floats above the ground (heads);
# fx = effect file -> 'recolor' | 'self' | 'self-rot' (dedemit turned to fly head-first) | 'orb' | 'coin' | 'rope'.
GHOSTS = {
    'pocong':        dict(slot='isolde', key='magenta', portrait=[760, 440, 430], color=(150, 215, 220),
                          fx={'piercer': 'rope', 'skyfall': 'self-rot', 'shatter': 'recolor', 'frost': 'recolor'}),
    'kuntilanak':    dict(slot='arco',   key='magenta', portrait=[800, 410, 460], color=(170, 185, 215), fx={'drone': 'self'}),
    'sundelbolong':  dict(slot='edda',   key='magenta', portrait=[870, 330, 380], color=(90, 210, 215),
                          fx={'stone': 'orb', 'ripple': 'recolor', 'shell': 'recolor', 'stomp': 'recolor', 'tortoise': 'self'}),
    'wewegombel':    dict(slot='zanni',  key='green',   portrait=[840, 400, 440], color=(190, 160, 110),
                          fx={'ring': 'recolor', 'bigring': 'recolor', 'snatch': 'recolor', 'confetti': 'recolor'}),
    'genderuwo':     dict(slot='haldor', key='green',   portrait=[920, 400, 440], color=(230, 120, 40), scale=1.1,
                          fx={'slag': 'recolor', 'splash': 'recolor', 'steam': 'recolor', 'quake': 'recolor'}),
    'eyangsukmocapo': dict(slot='solan', key='magenta', portrait=[740, 420, 440], color=(225, 195, 120),
                          fx={'crescent': 'recolor', 'roar': 'recolor', 'impact': 'recolor', 'sunburst': 'recolor'}),
    'leyak':         dict(slot='fenr',   key='green',   portrait=[890, 540, 460], color=(250, 140, 40),
                          fx={'claw': 'recolor', 'gale': 'recolor', 'rush': 'recolor', 'bite': 'recolor', 'howl': 'recolor', 'transform': 'recolor'}),
    'kuyang':        dict(slot='cora',   key='green',   portrait=[860, 400, 440], color=(225, 50, 70),
                          fx={'feather': 'recolor', 'gust': 'recolor', 'raven': 'self'}),
    'palasik':       dict(slot='rhea',   key='green',   portrait=[780, 560, 560], color=(230, 70, 50), scale=.55, lift=70,
                          fx={'drift': 'self', 'planet': 'self', 'well': 'recolor', 'burst': 'recolor'}),
    'tuyul':         dict(slot='nib',    key='magenta', portrait=[770, 420, 460], color=(235, 195, 80),
                          fx={'letter': 'coin', 'plane': 'self', 'slip': 'recolor', 'stamp': 'recolor'}),
    'jenglot':       dict(slot='mira',   key='green',   portrait=[830, 470, 440], color=(200, 60, 50), scale=.62,
                          fx={'star': 'orb', 'rocket': 'self-rot', 'burst': 'recolor', 'crash': 'recolor'}),
    'beguganjang':   dict(slot='naja',   key='magenta', portrait=[790, 180, 330], color=(140, 160, 180), scale=1.32,
                          fx={'sandwave': 'recolor', 'cyclone': 'recolor', 'ripple': 'recolor', 'serpent': 'self'}),
}
SLOT_FILES = {
    'arco':  dict(atlas=['assets/mecha/run/sprite-sheet-alpha.webp'], manifest=['assets/mecha/manifest.js'], prefix=['MECHA'],
                  portrait=['assets/ui/arco-avatar.webp'], select='assets/menu/arco-select.webp', cutin='assets/ui/ultimate-cutin.webp',
                  icons=[['assets/ui/attack.webp', 'assets/ui/skill1.webp', 'assets/ui/skill2.webp', 'assets/ui/squadron-icon.webp']],
                  fx={'drone': 'assets/ui/drone.png'}),
    'fenr':  dict(atlas=['assets/fenr/human/run/sprite-sheet-alpha.webp', 'assets/fenr/wolf/run/sprite-sheet-alpha.webp'],
                  manifest=['assets/fenr/human/manifest.js', 'assets/fenr/wolf/manifest.js'], prefix=['FENR_HUMAN', 'FENR_WOLF'],
                  portrait=['assets/fenr/ui/portrait-human.webp', 'assets/fenr/ui/portrait-wolf.webp'],
                  select='assets/menu/fenr-select.webp', cutin='assets/fenr/ui/cutin.webp',
                  icons=[[f'assets/fenr/ui/icon-human-{s}.webp' for s in ('basic', 'skill1', 'skill2')] + ['assets/fenr/ui/icon-ultimate.webp'],
                         [f'assets/fenr/ui/icon-wolf-{s}.webp' for s in ('basic', 'skill1', 'skill2')] + [None]]),
}
def slot_files(slot):
    d = dict(atlas=[f'assets/{slot}/run/sprite-sheet-alpha.webp'], manifest=[f'assets/{slot}/manifest.js'], prefix=[slot.upper()],
             portrait=[f'assets/{slot}/ui/portrait.webp'], select=f'assets/menu/{slot}-select.webp', cutin=f'assets/{slot}/ui/cutin.webp',
             icons=[[f'assets/{slot}/ui/icon-{s}.webp' for s in ('basic', 'skill1', 'skill2', 'ultimate')]])
    d.update(SLOT_FILES.get(slot, {}))
    return d

# ---------------------------------------------------------------- cutout
def cutout(path, key):
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    if key == 'magenta':
        spill = np.minimum(r, b) - g          # how much "magenta" is in the pixel
        dist = np.sqrt((r - 255) ** 2 + g ** 2 + (b - 255) ** 2)
    else:
        spill = g - np.maximum(r, b)
        dist = np.sqrt(r ** 2 + (g - 255) ** 2 + b ** 2)
    alpha = np.clip((dist - 60) / 70, 0, 1)   # soft edge between 60 and 130 colour distance from the key
    # Despill: remove the key colour that bled into edges and semi-transparent cloth.
    s = np.clip(spill, 0, None) * (spill > 25)
    if key == 'magenta': r, b = r - s * .85, b - s * .85
    else: g = g - s * .85
    rgb = np.stack([r, g, b], -1).clip(0, 255)
    img = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), 'RGBA')
    # Drop specks left over from compression noise.
    m = (np.asarray(img)[..., 3] > 0).astype(np.uint8) * 255
    m = np.asarray(Image.fromarray(m).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(5)))
    arr = np.asarray(img).copy(); arr[..., 3] = np.minimum(arr[..., 3], m); img = Image.fromarray(arr, 'RGBA')
    return img.crop(img.getbbox())

def feet_x(img):
    """Horizontal centre of the lowest 12% of the figure: where the fighter stands."""
    a = np.asarray(img)[..., 3] > 40
    h = a.shape[0]; rows = a[int(h * .88):]
    xs = np.nonzero(rows)[1]
    return float(xs.mean()) if len(xs) else img.width / 2

# ---------------------------------------------------------------- puppet poses
def pose(state, i, n):
    """(scale_x, scale_y, angle_deg [+ = lean back], dx, dy, flash, ground) for frame i of a state."""
    t = i / max(1, n - 1)
    P = dict(sx=1, sy=1, ang=0, dx=0, dy=0, flash=0, ground=True)
    if state == 'idle':   P.update(sy=[1, .985, .97, .985][i % 4], sx=[1, 1.006, 1.012, 1.006][i % 4])
    elif state == 'walk': P.update(dy=[0, -4, 0, -4][i % 4], ang=[-2, 0, -2, 0][i % 4], sy=[1, .99, 1, .99][i % 4])
    elif state == 'run':  P.update(dy=[0, -7, 0, -7][i % 4], ang=[-9, -7, -9, -7][i % 4], sx=1.03, sy=.97)
    elif state == 'jump': P.update(ang=-8, sy=1.05, sx=.97)
    elif state == 'doublejump': P.update(sx=.86, sy=.74)
    elif state == 'crouch': P.update(sy=[.86, .76, .74, .74][i % 4], sx=[1.04, 1.08, 1.08, 1.08][i % 4])
    elif state.startswith('attack'):
        k = int(state[-1])
        P.update(dx=[-6, 14 + 4 * k, 24 + 6 * k, 6][i % 4], ang=[6, -8 - 2 * k, -12 - 3 * k, -2][i % 4],
                 sx=[.98, 1.03, 1.06, 1][i % 4], sy=[1, .98, .96, 1][i % 4])
    elif state == 'skill1': P.update(dx=[-8, 4, 18, 4][i % 4], ang=[8, -4, -10, -2][i % 4], sx=[.97, 1.02, 1.05, 1][i % 4])
    elif state == 'skill2': P.update(dx=[-4, 22, 40, 10][i % 4], ang=[4, -14, -18, -4][i % 4], sx=[1, 1.06, 1.1, 1][i % 4], sy=[1, .95, .93, 1][i % 4])
    elif state == 'ultimate': P.update(sy=[1, 1.04, 1.07, 1.02][i % 4], ang=[0, 5, 8, 2][i % 4], flash=[0, 0, .25, 0][i % 4])
    elif state == 'hurt': P.update(dx=[-10, -14, -8, -2][i % 4], ang=[12, 15, 9, 3][i % 4], flash=[.55, .2, 0, 0][i % 4])
    elif state == 'down': P.update(dx=[-12, -24, -32, -34][i % 4], ang=[30, 62, 86, 90][i % 4], flash=[.3, 0, 0, 0][i % 4])
    elif state == 'recover': P.update(dx=[-30, -20, -8, 0][i % 4], ang=[70, 40, 15, 0][i % 4], sy=[1, .9, .95, 1][i % 4])
    return P

def render_frame(fig, fx, P, cell_w, cell_h, ax, ay, tint=None):
    w, h = fig.size
    sw, sh = max(1, round(w * P['sx'])), max(1, round(h * P['sy']))
    img = fig.resize((sw, sh), Image.LANCZOS)
    if tint is not None:
        arr = np.asarray(img).astype(np.float32); c = np.array(tint, np.float32)
        arr[..., :3] = arr[..., :3] * .72 + c * .28; img = Image.fromarray(arr.clip(0, 255).astype(np.uint8), 'RGBA')
    if P['flash']:
        arr = np.asarray(img).astype(np.float32); arr[..., :3] += (255 - arr[..., :3]) * P['flash']
        img = Image.fromarray(arr.clip(0, 255).astype(np.uint8), 'RGBA')
    R = int(max(sw, sh) * 1.2) + 4
    canvas = Image.new('RGBA', (2 * R, 2 * R))
    px, py = fx * P['sx'], sh            # pivot = feet point
    canvas.paste(img, (round(R - px), round(R - py)), img)
    if P['ang']: canvas = canvas.rotate(P['ang'], resample=Image.BICUBIC, center=(R, R))
    cell = Image.new('RGBA', (cell_w, cell_h))
    big =Image.new('RGBA', (cell_w + 4 * R, cell_h + 4 * R))
    big.alpha_composite(canvas, (round(2 * R + ax - R + P['dx']), round(2 * R + ay - R)))
    bb = big.getbbox()
    if bb is None: return cell, None
    shift_y = 0
    if P['ground']: shift_y = (2 * R + ay) - bb[3]          # stand on the ground line
    shift_y += P['dy']
    shift_x = 0
    l, r = bb[0] - 2 * R, bb[2] - 2 * R
    margin = 6
    if l < margin: shift_x = margin - l                      # keep long falls inside the cell
    if r + shift_x > cell_w - margin: shift_x -= (r + shift_x) - (cell_w - margin)
    cell.alpha_composite(big.crop((2 * R - shift_x, 2 * R - shift_y, 2 * R - shift_x + cell_w, 2 * R - shift_y + cell_h)))
    return cell, cell.getbbox()

# ---------------------------------------------------------------- manifest.js io (via node)
def read_manifest(path):
    js = "const vm=require('vm');const s={window:{}};vm.runInNewContext(require('fs').readFileSync(process.argv[1],'utf8'),s);console.log(JSON.stringify(s.window));"
    return json.loads(subprocess.check_output(['node', '-e', js, str(path)]))

def write_manifest(path, data):
    path.write_text(''.join(f'window.{k} = {json.dumps(v, separators=(", ", ": "))};\n' for k, v in data.items()), encoding='utf-8')

# ---------------------------------------------------------------- animation strips (real frames)
# Drop a strip at assets/ghosts/strips/<dedemit>/<state>.png|webp: one row of poses on the same flat chroma as the base
# (see guide/ghost-animation-prompts.md). States without a strip keep the puppet frames. Leyak's fire form reads
# assets/ghosts/strips/leyak-api/.
# Image generators draw every strip at a slightly different size, so strips are scaled by silhouette area: the
# median pose of each strip gets the same area as the median idle pose, and the tallest idle pose gets the fighter's
# standing height. A pose that is really taller (a stretch, a rise) or lower (a crouch, lying down) stays so. An optional
# scale.json in the folder ({"attack": 0.95}) multiplies a strip's size. Without an idle strip, the tallest pose of each
# strip is scaled to STRIP_FIT of the standing height instead.
STRIP_DIR = ROOT / 'assets/ghosts/strips'
# Idle height of each slot in the original Aether Clash atlases; scale in GHOSTS is relative to it.
STAND = {'assets/isolde/manifest.js': 199, 'assets/mecha/manifest.js': 180, 'assets/edda/manifest.js': 171, 'assets/zanni/manifest.js': 176,
         'assets/haldor/manifest.js': 169, 'assets/solan/manifest.js': 175, 'assets/fenr/human/manifest.js': 194,
         'assets/fenr/wolf/manifest.js': 216, 'assets/cora/manifest.js': 184, 'assets/rhea/manifest.js': 170,
         'assets/nib/manifest.js': 150, 'assets/mira/manifest.js': 182, 'assets/naja/manifest.js': 182}
STRIP_SOURCES = {   # engine row -> strip files to try, in order; a trailing '<' plays that strip backwards
    'idle': ['idle'], 'walk': ['walk'], 'run': ['run', 'walk'], 'crouch': ['crouch'], 'jump': ['jump'], 'doublejump': ['doublejump'],
    'attack1': ['attack1', 'attack'], 'attack2': ['attack2', 'attack'], 'attack3': ['attack3', 'attack'],
    'skill1': ['skill1'], 'skill2': ['skill2'], 'ultimate': ['ultimate'], 'hurt': ['hurt'], 'down': ['down'], 'recover': ['recover', 'down<'],
}
# Fallback when there is no idle strip: the tallest pose of a strip is scaled to this share of the standing height.
STRIP_FIT = {'idle': 1.0, 'walk': 1.0, 'run': .98, 'crouch': .82, 'jump': 1.0, 'doublejump': .78, 'attack1': 1.04, 'attack2': 1.04, 'attack3': 1.06,
             'skill1': 1.04, 'skill2': 1.04, 'ultimate': 1.08, 'hurt': .98, 'down': .9, 'recover': .95, 'land': .85}

def split_poses(img, n):
    """Cut a cut-out strip into n poses at the widest empty column gaps (equal slices if the gaps are missing)."""
    a = np.asarray(img)[..., 3] > 40; cols = a.any(0); w = len(cols)
    gaps, x = [], 0
    while x < w:
        if not cols[x]:
            s0 = x
            while x < w and not cols[x]: x += 1
            if s0 > 0 and x < w: gaps.append((x - s0, (s0 + x) // 2))
        else: x += 1
    cuts = sorted(c for _, c in sorted(gaps, reverse=True)[:n - 1]) if len(gaps) >= n - 1 else [round(w * k / n) for k in range(1, n)]
    edges = [0, *cuts, w]; poses = []
    for l, r in zip(edges, edges[1:]):
        piece = img.crop((l, 0, r, img.height)); bb = piece.getbbox()
        if bb: poses.append((piece.crop(bb), bb[3]))   # the pose and its lowest row in the strip
    return poses

def strip_file(d, name):
    return next((d / f'{name}.{e}' for e in ('png', 'webp') if (d / f'{name}.{e}').exists()), None)

def area(p):
    return int((np.asarray(p)[..., 3] > 40).sum())

_IDLE_REF = {}
def idle_area(d, key, height):
    """Silhouette area of the median idle pose once the tallest idle pose is the standing height (None without idle)."""
    if (d, height) not in _IDLE_REF:
        path = strip_file(d, 'idle'); ref = None
        if path:
            poses = [p for p, _ in split_poses(cutout(path, key), 4)]
            if poses: ref = float(np.median([area(p) for p in poses])) * (height / max(p.height for p in poses)) ** 2
        _IDLE_REF[(d, height)] = ref
    return _IDLE_REF[(d, height)]

def strip_frames(ghost, key, state, count, height, folder=None):
    """Poses for one engine row from the dedemit's strips, scaled to its standing height, or None.
    Each pose comes with its rise: how far above the ground line it was drawn (a hop, a float), in atlas pixels."""
    d = STRIP_DIR / (folder or ghost)
    if not d.exists(): return None
    extra = json.loads((d / 'scale.json').read_text()) if (d / 'scale.json').exists() else {}
    ref = idle_area(d, key, height)
    for src in STRIP_SOURCES.get(state, [state]):
        name, rev = src.rstrip('<'), src.endswith('<')
        path = strip_file(d, name)
        if not path: continue
        want = 1 if state in ('jump', 'doublejump') else 4
        poses = split_poses(cutout(path, key), want)
        if not poses: continue
        if rev: poses = poses[::-1]
        if ref: k = (ref / float(np.median([area(p) for p, _ in poses]))) ** .5
        else: k = height * STRIP_FIT.get(state, 1.0) / max(p.height for p, _ in poses)
        k *= extra.get(name, extra.get(state, 1.0))
        ground = max(b for _, b in poses)              # the lowest pose stands on the ground line
        out = []
        for p, b in poses:                             # a pose drawn higher in the strip (a hop, a rise) keeps its height
            rise = (ground - b) * k
            out.append((p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS), 0 if rise < height * .03 else round(rise)))
        return [out[min(len(out) - 1, round(i * (len(out) - 1) / max(1, count - 1)))] if len(out) != count else out[i] for i in range(count)]
    return None

def place_pose(pose_img, cell_w, cell_h, ax, ay, lift=0, tint=None):
    """A real pose in a cell: feet on the ground line (raised by lift and by the pose's own rise in the strip),
    feet centre on the anchor, kept inside the cell."""
    p, rise = pose_img if isinstance(pose_img, tuple) else (pose_img, 0)
    if p.width > cell_w - 12: p = p.resize((cell_w - 12, round(p.height * (cell_w - 12) / p.width)), Image.LANCZOS)
    if p.height > ay - 4 - lift: p = p.resize((round(p.width * (ay - 4 - lift) / p.height), ay - 4 - lift), Image.LANCZOS)
    lift += max(0, min(rise, ay - 4 - lift - p.height))
    if tint is not None:
        arr = np.asarray(p).astype(np.float32); arr[..., :3] = arr[..., :3] * .72 + np.array(tint, np.float32) * .28
        p = Image.fromarray(arr.clip(0, 255).astype(np.uint8), 'RGBA')
    x = round(ax - feet_x(p)); x = min(max(6, x), cell_w - 6 - p.width); y = ay - lift - p.height
    cell = Image.new('RGBA', (cell_w, cell_h)); cell.alpha_composite(p, (x, y)); return cell, cell.getbbox()

def add_land_row(man, met, ghost, strip_folder):
    """The Aether Clash slots have no landing row. A dedemit with a land strip gets one appended below the last row;
    the engine plays it for a moment after touching down (game.js LAND_TIME)."""
    lay = man['frame_layout']
    if 'land' in lay['rows'] or not ghost: return
    d = STRIP_DIR / (strip_folder or ghost)
    if not strip_file(d, 'land') and not strip_file(STRIP_DIR / ghost, 'land'): return
    cw, ch, y = lay['cellWidth'], lay['cellHeight'], lay['sheetHeight']
    lay['rows']['land'] = [{'x': cw * i, 'y': y, 'w': cw, 'h': ch} for i in range(4)]
    lay['sheetHeight'] = y + ch
    rows = man['animation']['rows']
    rows['land'] = {'row': max(r['row'] for r in rows.values()) + 1, 'frames': 4, 'fps': 20, 'durations_ms': [50] * 4,
                    'loop': False, 'frame_variant': 'pixel'}
    met.setdefault('states', {})['land'] = {'frames': []}

def build_atlas(fig, atlas_path, manifest_path, prefix, height, tint=None, lift=0, ghost=None, key=None, strip_folder=None):
    data = read_manifest(manifest_path)
    man, met = data[prefix + '_MANIFEST'], data[prefix + '_METRICS']
    lay = man['frame_layout']; cw, ch = lay['cellWidth'], lay['cellHeight']
    ax, ay = met['anchor']['x'], met['anchor']['y']
    scale = height / fig.height
    f = fig.resize((max(1, round(fig.width * scale)), height), Image.LANCZOS)
    max_w = cw - 24                                       # very wide ghosts are narrowed to fit the cell
    if f.width > max_w: f = f.resize((max_w, round(f.height * max_w / f.width)), Image.LANCZOS)
    fx = feet_x(f)
    add_land_row(man, met, ghost, strip_folder)
    sheet = Image.new('RGBA', (lay['sheetWidth'], lay['sheetHeight']))
    used = []
    for state, rects in lay['rows'].items():
        n = len(rects)
        frames_out = []
        real = strip_frames(ghost, key, state, n, f.height, strip_folder) if ghost else None
        if real: used.append(state)
        for i, rc in enumerate(rects):
            if real:                                   # a floating dedemit still drops to the ground when knocked down
                cell, bb = place_pose(real[i], rc['w'], rc['h'], ax, ay, 0 if state in ('down', 'recover') else lift,
                                      tint if (not strip_folder or strip_folder == ghost) else None)
            else:
                P = pose(state, i, n); P['dy'] -= lift
                cell, bb = render_frame(f, fx, P, rc['w'], rc['h'], ax, ay, tint)
            sheet.alpha_composite(cell, (rc['x'], rc['y']))
            if bb: frames_out.append({'frame': i, 'bounds': {'left': bb[0] - ax, 'right': bb[2] - ax, 'top': bb[1] - ay, 'bottom': bb[3] - ay}, 'height': ay - bb[1]})
        if state in met.get('states', {}): met['states'][state]['frames'] = frames_out
    sheet.save(atlas_path, 'WEBP', lossless=True, method=6)
    man['base_image'] = 'assets/ghosts/base + strips (' + (', '.join(used) or 'puppet only') + '), guide/tools/build_ghost_assets.py'
    if used: print(f'   strips used for {atlas_path.parent.parent.name}: {", ".join(used)}')
    write_manifest(manifest_path, data)

# ---------------------------------------------------------------- UI art
def glow_bg(size, color, dark=(10, 14, 24)):
    w, h = size
    bg = Image.new('RGB', size, dark)
    g = Image.new('L', size, 0); d = ImageDraw.Draw(g)
    d.ellipse((-w * .2, -h * .1, w * .9, h * 1.2), fill=150)
    g = g.filter(ImageFilter.GaussianBlur(min(w, h) * .18))
    return Image.composite(Image.new('RGB', size, tuple(int(c * .55) for c in color)), bg, g)

def portrait(raw, box, color, out, size=384):
    cx, cy, s = box
    crop = raw.crop((cx - s // 2, cy - s // 2, cx + s // 2, cy + s // 2)).resize((size, size), Image.LANCZOS)
    bg = glow_bg((size, size), color); bg.paste(crop, (0, 0), crop)
    bg.save(out, 'WEBP', quality=92)

def select_art(fig, out):
    old = Image.open(out); W, H = old.size
    s = min((W * .96) / fig.width, (H * .96) / fig.height)
    f = fig.resize((round(fig.width * s), round(fig.height * s)), Image.LANCZOS)
    c = Image.new('RGBA', (W, H)); c.alpha_composite(f, ((W - f.width) // 2, H - f.height))
    c.save(out, 'WEBP', quality=92)

def cutin(fig, color, out, W=1600, H=686):
    bg = glow_bg((W, H), color).convert('RGBA')
    d = ImageDraw.Draw(bg)
    for k in range(9):                                   # diagonal speed streaks
        x = 380 + k * 140; d.polygon([(x, 0), (x + 40, 0), (x - 260, H), (x - 300, H)], fill=(*color, 18))
    s = (H * 1.25) / fig.height
    f = fig.resize((round(fig.width * s), round(fig.height * s)), Image.LANCZOS)
    bg.alpha_composite(f, (max(-80, 420 - f.width // 2), int(H * .06)))
    shade = Image.linear_gradient('L').rotate(90).resize((W, H))      # dark right side for the HTML title
    shade = shade.point(lambda v: int(v * .75))
    bg = Image.composite(Image.new('RGBA', (W, H), (6, 8, 14, 255)), bg, shade)
    bg.convert('RGB').save(out, 'WEBP', quality=90)

# ---------------------------------------------------------------- main
# ---------------------------------------------------------------- icons
def icon(full, fig, box, color, kind, out, size=256):
    """Skill icon: the dedemit's face on a dark glow, with a glyph for the move type (claw, shot, swirl, burst)."""
    cx, cy, s0 = box
    zoom = {'basic': 1.0, 'skill1': .85, 'skill2': 1.15, 'ultimate': .75}[kind]
    s1 = int(s0 * zoom)
    face = full.crop((cx - s1 // 2, cy - s1 // 2, cx + s1 // 2, cy + s1 // 2)).resize((size, size), Image.LANCZOS)
    bg = glow_bg((size, size), color, dark=(8, 10, 18)).convert('RGBA')
    if kind == 'ultimate':
        rays = Image.new('RGBA', (size, size)); d = ImageDraw.Draw(rays)
        for k in range(16):
            a = k * math.pi / 8
            d.polygon([(size / 2, size / 2), (size / 2 + math.cos(a - .09) * size, size / 2 + math.sin(a - .09) * size),
                       (size / 2 + math.cos(a + .09) * size, size / 2 + math.sin(a + .09) * size)], fill=(*color, 70))
        bg.alpha_composite(rays)
    bg.alpha_composite(face)
    shade = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(shade)
    d.rectangle((0, int(size * .55), size, size), fill=(0, 0, 0, 0))
    bg.alpha_composite(Image.composite(Image.new('RGBA', (size, size), (6, 6, 12, 150)), shade, Image.linear_gradient('L').resize((size, size))))
    g = Image.new('RGBA', (size, size)); d = ImageDraw.Draw(g)
    def stroke(pts, w):
        d.line(pts, fill=(20, 12, 10, 255), width=w + 8, joint='curve'); d.line(pts, fill=(*color, 255), width=w + 2, joint='curve')
        d.line(pts, fill=(255, 250, 235, 255), width=max(2, w - 6), joint='curve')
    if kind == 'basic':
        for k in range(3): stroke([(size * (.42 + k * .14), size * .56), (size * (.30 + k * .14), size * .94)], 14)
    elif kind == 'skill1':
        stroke([(size * .12, size * .80), (size * .80, size * .80)], 16)
        d.polygon([(size * .80, size * .68), (size * .96, size * .80), (size * .80, size * .92)], fill=(255, 250, 235, 255), outline=(20, 12, 10, 255))
    elif kind == 'skill2':
        pts = [(size * (.5 + math.cos(t) * (.10 + t * .045)), size * (.76 + math.sin(t) * (.06 + t * .03))) for t in np.linspace(0, 4.4 * math.pi / 2, 40)]
        stroke(pts, 12)
    else:
        d.ellipse((size * .05, size * .05, size * .95, size * .95), outline=(*color, 255), width=10)
        d.ellipse((size * .05, size * .05, size * .95, size * .95), outline=(255, 240, 200, 255), width=3)
    bg.alpha_composite(g)
    frame = ImageDraw.Draw(bg); frame.rectangle((0, 0, size - 1, size - 1), outline=(*color, 255), width=4)
    bg.convert('RGB').save(out, 'WEBP', quality=92)

# ---------------------------------------------------------------- effects
def recolor(path, color, out=None):
    im = Image.open(path).convert('RGBA'); a = np.asarray(im).astype(np.float32)
    lum = (a[..., 0] * .3 + a[..., 1] * .59 + a[..., 2] * .11) / 255
    c = np.array(color, np.float32); dark = c * .2
    lo = np.clip(lum / .55, 0, 1)[..., None]; hi = np.clip((lum - .55) / .45, 0, 1)[..., None]
    rgb = np.where(lum[..., None] < .55, dark + (c - dark) * lo, c + (255 - c) * hi)
    a[..., :3] = rgb
    Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA').save(out or path, 'WEBP' if str(out or path).endswith('webp') else 'PNG', lossless=True)

def fit_on(canvas_size, sprite, pad=.06, bottom=False):
    W, H = canvas_size; sp = sprite.copy(); sp.thumbnail((int(W * (1 - 2 * pad)), int(H * (1 - 2 * pad))), Image.LANCZOS)
    c = Image.new('RGBA', (W, H)); x = (W - sp.width) // 2; y = H - sp.height if bottom else (H - sp.height) // 2
    c.alpha_composite(sp, (x, y)); return c

def ghostly(sprite, color, alpha=.85):
    """Spirit look for summoned copies: tinted towards the dedemit's colour with a soft outer glow."""
    a = np.asarray(sprite).astype(np.float32); c = np.array(color, np.float32)
    a[..., :3] = a[..., :3] * .7 + c * .3; a[..., 3] *= alpha
    sp = Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA')
    glow = Image.new('RGBA', sp.size, (*color, 0)); m = sp.split()[3].filter(ImageFilter.GaussianBlur(max(2, sp.width // 40)))
    glow.putalpha(m.point(lambda v: int(v * .7)))
    out = Image.new('RGBA', sp.size); out.alpha_composite(glow); out.alpha_composite(sp); return out

def orb(size, color):
    W, H = size; im = Image.new('RGBA', (W, H)); d = ImageDraw.Draw(im)
    for k in range(14):                                    # tail to the left (the sprite flies to the right)
        t = k / 13; r = W * (.22 - .15 * t); x = W * (.62 - .5 * t)
        d.ellipse((x - r, H / 2 - r, x + r, H / 2 + r), fill=(*color, int(150 * (1 - t))))
    im = im.filter(ImageFilter.GaussianBlur(W / 40)); d = ImageDraw.Draw(im)
    d.ellipse((W * .5, H * .4, W * .74, H * .6), fill=(255, 250, 240, 255)); return im

def coin(size, color):
    """Uang kepeng: a round bronze-gold coin with a square hole."""
    W, H = size; r = W * .3; cx, cy = W * .58, H / 2
    trail = Image.new('RGBA', (W, H)); t = ImageDraw.Draw(trail)
    t.polygon([(cx, cy - r * .7), (W * .04, cy - r * .15), (W * .04, cy + r * .15), (cx, cy + r * .7)], fill=(*color, 110))
    im = trail.filter(ImageFilter.GaussianBlur(W / 30)); d = ImageDraw.Draw(im)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(150, 105, 30, 255), outline=(50, 30, 10, 255), width=6)
    d.ellipse((cx - r * .8, cy - r * .8, cx + r * .8, cy + r * .8), outline=(250, 215, 110, 255), width=5)
    h = r * .28; d.rectangle((cx - h, cy - h, cx + h, cy + h), fill=(0, 0, 0, 0), outline=(50, 30, 10, 255), width=5)
    return im

def rope(size, color):
    """Tali pocong: a knotted shroud rope with a loop at the front."""
    W, H = size; im = Image.new('RGBA', (W, H)); d = ImageDraw.Draw(im)
    for w, c in ((22, (40, 32, 20, 255)), (14, (*color, 255)), (5, (255, 252, 240, 255))):
        d.line([(W * .06, H * .52), (W * .3, H * .45), (W * .5, H * .55), (W * .66, H * .5)], fill=c, width=w, joint='curve')
        d.ellipse((W * .62, H * .3, W * .94, H * .7), outline=c, width=w)
    d.ellipse((W * .56, H * .43, W * .7, H * .59), fill=(*color, 255), outline=(40, 32, 20, 255), width=4)
    return im

def build_fx(fig, cfg, sf):
    color = cfg['color']; slot = cfg['slot']
    for name, kind in cfg.get('fx', {}).items():
        path = ROOT / sf.get('fx', {}).get(name, f'assets/{slot}/ui/fx-{name}.webp')
        if not path.exists(): continue
        size = Image.open(path).size
        if kind == 'recolor':
            # Recolour from a pristine copy so running the script again gives the same result.
            src = ROOT / 'assets/ghosts/fx-src' / path.relative_to(ROOT)
            if not src.exists(): src.parent.mkdir(parents=True, exist_ok=True); src.write_bytes(path.read_bytes())
            recolor(src, color, path); continue
        if kind == 'self': im = fit_on(size, ghostly(fig, color), bottom=size[0] >= 512)
        elif kind == 'self-rot': im = fit_on(size, ghostly(fig.rotate(-90, expand=True), color))
        elif kind == 'orb': im = orb(size, color)
        elif kind == 'coin': im = coin(size, color)
        elif kind == 'rope': im = rope(size, color)
        im.save(path, 'PNG' if path.suffix == '.png' else 'WEBP', lossless=True)

# ---------------------------------------------------------------- main
def base_path(name):
    for ext in ('webp', 'png'):
        p = BASE_DIR / f'{name}.{ext}'
        if p.exists(): return p

def build(name):
    cfg = GHOSTS[name]; p = base_path(name)
    if not p: print(f'skip {name}: no base image'); return
    sf = slot_files(cfg['slot'])
    raw = Image.open(p).convert('RGBA')
    fig = cutout(p, cfg['key'])
    # Portrait and icon crops come from the cut-out figure placed back on the original canvas.
    full = Image.new('RGBA', raw.size); bb = cutout_box(p, cfg['key']); full.alpha_composite(fig, bb[:2])
    for i, (atlas, manifest, prefix) in enumerate(zip(sf['atlas'], sf['manifest'], sf['prefix'])):
        data = read_manifest(ROOT / manifest)
        lay = data[prefix + '_MANIFEST']['frame_layout']
        height = round(STAND[manifest] * cfg.get('scale', 1))     # the slot's original idle height, so rebuilding never compounds
        height = min(height, lay['cellHeight'] - 16 - cfg.get('lift', 0))
        tint = (255, 110, 30) if (cfg['slot'] == 'fenr' and i == 1) else None   # Leyak's fire form glows like embers
        folder = (name + '-api') if (cfg['slot'] == 'fenr' and i == 1) else None
        if folder and not (STRIP_DIR / folder).exists(): folder = name      # fire form falls back to the human strips, tinted
        build_atlas(fig, ROOT / atlas, ROOT / manifest, prefix, height, tint, cfg.get('lift', 0), name, cfg['key'], folder)
    for i, out in enumerate(sf['portrait']):
        portrait(full, cfg['portrait'], (255, 110, 30) if i else cfg['color'], ROOT / out)
    select_art(fig, ROOT / sf['select'])
    cutin(fig, cfg['color'], ROOT / sf['cutin'])
    for set_i, paths in enumerate(sf['icons']):
        col = (255, 110, 30) if set_i else cfg['color']
        for kind, out in zip(('basic', 'skill1', 'skill2', 'ultimate'), paths):
            if out: icon(full, fig, cfg['portrait'], col, kind, ROOT / out, size=Image.open(ROOT / out).size[0])
    build_fx(fig, cfg, sf)
    print(f'{name}: slot {cfg["slot"]} updated')

def cutout_box(p, key):
    a = np.asarray(Image.open(p).convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    dist = np.sqrt((r - 255) ** 2 + g ** 2 + (b - 255) ** 2) if key == 'magenta' else np.sqrt(r ** 2 + (g - 255) ** 2 + b ** 2)
    m = Image.fromarray(((dist > 60) * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(5))
    return m.getbbox()

if __name__ == '__main__':
    for n in (sys.argv[1:] or list(GHOSTS)): build(n)
