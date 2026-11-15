#!/usr/bin/env python3
"""Cut the real-footage shots (PLAYBOOK §8, owner 2026-11-15: real footage first, 3D only for the science) from the
Creative Commons YouTube downloads in assets/footage/raw/ (Drive Telugu/Medigadda/footage/raw/, fetched on the
owner's phone by tools/termux_footage_get.sh) into remotion/public/footage/<name>.mp4: 1920x1080, 30 fps, H.264,
no audio. Each source's licence is checked in its .info.json before it is cut; a source that is not Creative Commons
stops the run. `crop` keeps a part of the frame (x, y, w, h as fractions) to leave out a burned-in banner or mark.

  python3 projects/medigadda/tools/cut_footage.py            # cuts what is missing
  python3 projects/medigadda/tools/cut_footage.py --force    # cuts everything again
"""
import json
import subprocess
import sys
from pathlib import Path

P = Path(__file__).resolve().parents[1]
RAW = P / 'assets/footage/raw'
OUT = P / 'remotion/public/footage'

# name: (YouTube id, start s, end s, crop or None)
CUTS = {
    'evening':       ('6-b6lIz6XNc', 183.6, 189.0, (0.0, 0.12, 0.86, 0.88)),
    'barrage_air':   ('ucvwS7_agjc', 219.7, 223.3, None),
    'barrage_deck':  ('ucvwS7_agjc', 227.3, 234.3, None),
    'engineer':      ('aEaW_vrhh7U', 36.0, 39.3, None),
    'bridge_walk':   ('wGT6_7GilIk', 146.6, 152.4, (0.0, 0.16, 0.84, 0.84)),
    'flood_gates':   ('dwQwthZWIxA', 98.0, 104.1, None),
    'flood_jet':     ('dwQwthZWIxA', 104.4, 109.3, None),
    'flood_above':   ('5PflA9BPugQ', 20.1, 25.5, None),
    'flood_close':   ('ucvwS7_agjc', 307.5, 310.3, None),
    'flood_air':     ('dwQwthZWIxA', 39.6, 46.9, None),
    'pranahita':     ('wGT6_7GilIk', 67.0, 75.0, (0.0, 0.16, 0.84, 0.84)),
    'kaleshwaram':   ('_2pSvHo0fQM', 359.3, 370.3, (0.0, 0.0, 1.0, 0.70)),
    'first_pumping': ('8E123wCyx_o', 171.9, 178.0, (0.04, 0.12, 0.84, 0.64)),
    'auger':         ('ENM4ERlL8G8', 26.3, 41.6, None),
    'rig':           ('ENM4ERlL8G8', 60.0, 62.7, None),
    'gates_down':    ('ucvwS7_agjc', 87.1, 94.6, None),
    'water_held':    ('6-b6lIz6XNc', 108.0, 118.0, (0.0, 0.12, 0.86, 0.88)),
    'gate_jet':      ('ucvwS7_agjc', 202.0, 205.3, None),
    'farmer_pipe':   ('96Q0httFo8k', 161.0, 166.4, None),
    'farmer_walk':   ('96Q0httFo8k', 166.8, 176.9, None),
    'farmer_field':  ('96Q0httFo8k', 104.5, 121.0, None),
    'paddy_air':     ('NipCI-uW-IM', 36.7, 39.7, None),
    'paddy':         ('NipCI-uW-IM', 34.0, 36.3, None),
    'release':       ('5PflA9BPugQ', 25.8, 30.6, None),
    'dwall_grab':    ('dwQwthZWIxA', 111.5, 113.0, (0.06, 0.08, 0.94, 0.92)),
    'dwall_works':   ('dwQwthZWIxA', 10.4, 14.8, None),
    'construction':  ('8E123wCyx_o', 60.6, 64.6, (0.04, 0.14, 0.86, 0.86)),
    'see_gates':     ('dwQwthZWIxA', 35.4, 39.2, (0.06, 0.08, 0.94, 0.92)),
    'see_water':     ('6-b6lIz6XNc', 103.1, 106.8, (0.0, 0.14, 0.84, 0.86)),
    'godavari_air':  ('ucvwS7_agjc', 0.2, 8.3, None),
    'tunnel_crew':   ('9-_NYDAAxyQ', 100.2, 102.8, None),
    'tunnel_deep':   ('9-_NYDAAxyQ', 184.0, 187.5, None),
}


def licence(vid):
    m = json.loads((RAW / f'{vid}.info.json').read_text())
    lic = m.get('license') or ''
    if 'creative commons' not in lic.lower():
        sys.exit(f'{vid}: licence is "{lic}", not Creative Commons: not cut')
    return m.get('channel') or m.get('uploader'), lic


def main():
    force = '--force' in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (vid, a, b, crop) in CUTS.items():
        dest = OUT / f'{name}.mp4'
        if dest.exists() and not force:
            continue
        licence(vid)
        src = next(RAW.glob(f'{vid}.mp4'))
        vf = []
        if crop:
            x, y, w, h = crop
            vf.append(f'crop=iw*{w}:ih*{h}:iw*{x}:ih*{y}')
        vf += ['scale=1920:1080:force_original_aspect_ratio=increase', 'crop=1920:1080', 'fps=30', 'format=yuv420p']
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a}', '-to', f'{b}', '-i', str(src), '-an', '-vf', ','.join(vf),
                        '-c:v', 'libx264', '-crf', '19', '-preset', 'medium', '-maxrate', '14M', '-bufsize', '28M', str(dest)], check=True)
        print(f'{name:14s} {vid} {a}-{b} s')


if __name__ == '__main__':
    main()
