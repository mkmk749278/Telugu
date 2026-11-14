#!/usr/bin/env python3
"""Sound on every visual event (picture_plan.md, Sound and music): read the film's code and list when each event
happens, so the mix puts its sound on the same frame. Writes vo/sfx_cues.json; tools/mix.py synthesises the sounds.

  paper  a document or card arrives: <DocPage from=…>, <Sheet at=…>, <Quote at=…>
  tap    a pencil tap: <Ring at=…>, <Point at=…>, a pile placed (h2_piles_build*), the gap (h2_*_gap), the pins (h3_*_85 / _6)
  water  the set piece under the raft (s174 to s191): river under the raft

Only times written as S(n) / W(n, 'word'[, k]) ± frames are read; anything else is listed as skipped.
  python3 projects/medigadda/tools/sfx_cues.py
"""
import json, re
from pathlib import Path

P = Path(__file__).resolve().parents[1]
T = json.loads((P / 'vo/timing.json').read_text('utf-8'))
FPS = T['fps']


def S(i): return max(0, T['sentences'][i]['startFrame'] - 3)


def W(i, pre, nth=0):
    hits = [w for w in T['words'] if w['s'] == i and w['w'].startswith(pre)]
    return max(0, hits[nth]['startFrame'] - 2)


def ev(expr):
    if not re.fullmatch(r"[\sSW()\d,+\-'ఀ-౿‌‍]+", expr): return None
    try: return eval(expr, {'__builtins__': {}}, {'S': S, 'W': W})
    except Exception: return None


TAG = {'DocPage': ('from', 'paper'), 'Sheet': ('at', 'paper'), 'Quote': ('at', 'paper'), 'Ring': ('at', 'tap'), 'Point': ('at', 'tap')}
PLATE_TAP = re.compile(r"hero\('(h2_piles_build\d+|h2_\w+_gap|h3_\w+_(?:85|6))'\),\s*at:\s*([SW]\([^)]*\)(?:\s*[+-]\s*\d+)?)")
cues, skipped = [], []
for src in sorted((P / 'remotion/src').glob('ch*.tsx')):
    code = src.read_text('utf-8').replace('sunk + ', "W(9, 'దిగిపోయి') + ")   # chA's named frame
    for m in re.finditer(r'<(DocPage|Sheet|Quote|Ring|Point)\b([^>]*)', code):
        attr, kind = TAG[m.group(1)]
        a = re.search(attr + r'=\{((?:[^{}]|\{[^{}]*\})*)\}', m.group(2))
        v = ev(a.group(1)) if a else None
        (cues.append((v, kind)) if v is not None else skipped.append(f'{src.name}: <{m.group(1)} {attr}={a.group(1) if a else "?"}>'))
    for m in PLATE_TAP.finditer(code):
        v = ev(m.group(2))
        (cues.append((v, 'pins' if m.group(1).startswith('h3') else 'tap')) if v is not None else skipped.append(f'{src.name}: {m.group(1)} at {m.group(2)}'))
# one sound per event: drop repeats of the same kind within half a second
cues.sort()
out = []
for f, k in cues:
    if out and out[-1]['kind'] == k and f - out[-1]['frame'] < FPS // 2: continue
    out.append({'frame': f, 't': round(f / FPS, 3), 'kind': k})
out.append({'frame': S(174), 't': round(S(174) / FPS, 3), 'kind': 'water', 'until': round(S(191) / FPS, 3)})
(P / 'vo/sfx_cues.json').write_text(json.dumps(out, ensure_ascii=False, indent=0), 'utf-8')
print(len(out), 'cues:', {k: sum(c['kind'] == k for c in out) for k in ('paper', 'tap', 'pins', 'water')})
for s in skipped: print('  skipped', s)
