"""Build the SUPER ULTIMATE runtime assets from the AI images (prompts: guide/super-ultimate-prompts.md).

Sources per dedemit (flat magenta or green background, like the other strips):
  assets/ghosts/super/<dedemit>-cutin.png     cinematic banner, character in the right half
  assets/ghosts/strips/<dedemit>/super.png    4 character poses
  assets/ghosts/super/<dedemit>-fx.png        4 frames of the hit effect
Writes, next to the sources:
  assets/ghosts/super/<dedemit>-cutin.webp    1400x600, cover-cropped toward the right
  assets/ghosts/super/<dedemit>-pose.webp     4 cells in the slot's atlas cell size and anchor, poses scaled to the
                                              fighter's standing height exactly like the move strips
  assets/ghosts/super/<dedemit>-fx.webp       4 equal cells, background removed, effect standing on the cell bottom
  assets/ghosts/super/manifest.js             window.SUPER_ASSETS[slot] = { cutin, pose:{...}, fx:{...} }
A dedemit with a missing source simply keeps the generic super visuals in game.js for that part.

Run from the project root:  python guide/tools/build_super_assets.py [dedemit ...]
Then:                       node guide/tools/update_precache.mjs
"""
import json, sys
from pathlib import Path
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
import build_ghost_assets as B   # noqa: E402  (cutout, split_poses, strip_frames, place_pose, manifests, GHOSTS)

ROOT = Path.cwd()
SUPER = ROOT / 'assets/ghosts/super'
CUTIN_SIZE = (1400, 600)
FX_HEIGHT = 340            # world px of the tallest fx frame (the last, finishing strike is drawn larger in game)


def build_cutin(name):
    src = SUPER / f'{name}-cutin.png'
    if not src.exists(): return None
    img = Image.open(src).convert('RGB'); W, H = CUTIN_SIZE
    k = max(W / img.width, H / img.height)
    img = img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)
    x = img.width - W; y = (img.height - H) // 2           # keep the right side: that is where the character is
    out = SUPER / f'{name}-cutin.webp'
    img.crop((x, y, x + W, y + H)).save(out, 'WEBP', quality=82, method=6)
    return out.relative_to(ROOT).as_posix()


def clean(p):
    """Drop slivers of a neighbouring pose that the strip cut left at a pose's left or right edge (a hair tip, a rock):
    small separate pieces touching the side of the crop."""
    import numpy as np
    from scipy import ndimage
    a = np.asarray(p).copy(); mask = a[..., 3] > 20
    lab, n = ndimage.label(mask)
    if n < 2: return p
    sizes = ndimage.sum(mask, lab, range(1, n + 1)); big = sizes.max()
    for i, s in enumerate(sizes, 1):
        cols = np.nonzero((lab == i).any(0))[0]
        if s < big * .2 and (cols[0] <= 2 or cols[-1] >= a.shape[1] - 3): a[lab == i, 3] = 0
    img = Image.fromarray(a, 'RGBA'); bb = img.getbbox()
    # keep the bottom edge where it was so the pose's rise above the ground line does not change
    return img.crop((bb[0], bb[1], bb[2], img.height)) if bb else p


def build_pose(name, cfg):
    if not B.strip_file(B.STRIP_DIR / name, 'super'): return None
    sf = B.slot_files(cfg['slot'])
    manifest, prefix = sf['manifest'][0], sf['prefix'][0]
    data = B.read_manifest(ROOT / manifest)
    man, met = data[prefix + '_MANIFEST'], data[prefix + '_METRICS']
    cw, ch = man['frame_layout']['cellWidth'], man['frame_layout']['cellHeight']
    ax, ay = met['anchor']['x'], met['anchor']['y']
    height = min(round(B.STAND[manifest] * cfg.get('scale', 1)), ch - 16 - cfg.get('lift', 0))
    poses = B.strip_frames(name, cfg['key'], 'super', 4, height)
    if not poses: return None
    poses = [(clean(p), rise) for p, rise in poses]
    sheet = Image.new('RGBA', (cw * 4, ch))
    for i, p in enumerate(poses):
        cell, _ = B.place_pose(p, cw, ch, ax, ay, cfg.get('lift', 0))
        sheet.alpha_composite(cell, (cw * i, 0))
    out = SUPER / f'{name}-pose.webp'
    sheet.save(out, 'WEBP', lossless=True, method=6)
    return {'src': out.relative_to(ROOT).as_posix(), 'cellW': cw, 'cellH': ch, 'ax': ax, 'ay': ay, 'frames': 4}


def build_fx(name, cfg):
    src = SUPER / f'{name}-fx.png'
    if not src.exists(): return None
    frames = B.split_poses(B.cutout(src, cfg['key']), 4)
    if len(frames) != 4: print(f'   {name}: fx split into {len(frames)} frames, expected 4');
    if not frames: return None
    ground = max(b for _, b in frames)
    top = min(b - p.height for p, b in frames)              # keep each frame's height above the shared ground line
    k = FX_HEIGHT / (ground - top)
    cw = round(max(p.width for p, _ in frames) * k) + 8; ch = FX_HEIGHT + 4
    sheet = Image.new('RGBA', (cw * len(frames), ch))
    for i, (p, b) in enumerate(frames):
        q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
        y = ch - 2 - round((ground - b) * k) - q.height
        sheet.alpha_composite(q, (cw * i + (cw - q.width) // 2, max(0, y)))
    out = SUPER / f'{name}-fx.webp'
    sheet.save(out, 'WEBP', quality=86, alpha_quality=90, method=6)
    return {'src': out.relative_to(ROOT).as_posix(), 'cellW': cw, 'cellH': ch, 'frames': len(frames)}


def main(names):
    path = SUPER / 'manifest.js'
    assets = {}
    if path.exists():
        txt = path.read_text(encoding='utf-8')
        assets = json.loads(txt[txt.index('{'):txt.rindex('}') + 1])
    for name in names:
        cfg = B.GHOSTS[name]
        entry = {k: v for k, v in (('cutin', build_cutin(name)), ('pose', build_pose(name, cfg)), ('fx', build_fx(name, cfg))) if v}
        if entry: assets[cfg['slot']] = {'ghost': name, **entry}
        print(f'{name} ({cfg["slot"]}): {", ".join(entry) or "no super sources"}')
    path.write_text('/* Generated by guide/tools/build_super_assets.py: super ultimate cut-in, pose and hit-effect sheets per slot. Do not edit. */\n'
                    'window.SUPER_ASSETS = ' + json.dumps(assets, indent=1) + ';\n', encoding='utf-8')


if __name__ == '__main__':
    main(sys.argv[1:] or list(B.GHOSTS))
