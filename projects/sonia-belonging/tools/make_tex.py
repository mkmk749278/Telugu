#!/usr/bin/env python3
"""Pre-render the film's textures into remotion/public/tex (grain frames, the desk): cheaper than SVG noise per frame."""
import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter
out = Path(__file__).resolve().parents[1] / 'remotion/public/tex'
out.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)
for i in range(6):
    Image.fromarray(rng.normal(128, 40, (540, 960)).clip(0, 255).astype('uint8'), 'L').save(out / f'grain{i}.png', optimize=True)
H, W = 1300, 2300
base = np.zeros((H, W))
for s, amp in [(4, 1.0), (16, 0.6), (64, 0.35)]:
    small = rng.normal(0, 1, (max(2, H // s), max(2, W // (s * 12))))
    im = Image.fromarray(((small - small.min()) / np.ptp(small) * 255).astype('uint8')).resize((W, H), Image.BICUBIC)
    base += amp * np.asarray(im, dtype=float)
base = (base - base.min()) / np.ptp(base)
rgb = np.dstack([(14 + base * 26), (10 + base * 17), (7 + base * 10)]).astype('uint8')
Image.fromarray(rgb, 'RGB').filter(ImageFilter.GaussianBlur(1.2)).save(out / 'desk.jpg', quality=88)
