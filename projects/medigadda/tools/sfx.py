#!/usr/bin/env python3
"""The film's sound effects as one stem, synthesised (no third-party samples, nothing to license), on the frames in
vo/sfx_cues.json (tools/sfx_cues.py): a paper slide when a document arrives, a pencil tap on a ring, a card, a pile
or a pin, and the river under the raft through the set piece. Writes assets/sfx_stem.wav (48 kHz stereo) for tools/mix.py.
"""
import json, wave
from pathlib import Path
import numpy as np

P = Path(__file__).resolve().parents[1]
SR = 48000
T = json.loads((P / 'vo/timing.json').read_text('utf-8'))
END = T['durationInFrames'] / T['fps']
CUES = json.loads((P / 'vo/sfx_cues.json').read_text('utf-8'))
rng = np.random.default_rng(7)


def band(x, lo, hi):
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR)
    X[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(X, len(x))


def norm(x, peak): return x / (np.abs(x).max() + 1e-9) * peak


def paper(k):
    n = int(0.42 * SR); t = np.arange(n) / SR
    env = np.minimum(t / 0.07, 1) * np.exp(-np.maximum(t - 0.07, 0) / 0.11)
    flutter = 1 + 0.35 * np.sin(2 * np.pi * (23 + 4 * k % 7) * t)
    return norm(band(rng.standard_normal(n), 1400, 7000) * env * flutter, 0.30)


def tap():
    n = int(0.09 * SR); t = np.arange(n) / SR
    body = 0.7 * np.sin(2 * np.pi * 1850 * t) * np.exp(-t / 0.012) + 0.4 * np.sin(2 * np.pi * 3150 * t) * np.exp(-t / 0.007)
    click = band(rng.standard_normal(n), 2500, 9000) * np.exp(-t / 0.0015)
    return norm(body + 0.6 * click, 0.55)


def water(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    river = band(rng.standard_normal(n), 60, 520)
    swell = 0.7 + 0.3 * np.sin(2 * np.pi * 0.13 * t) * np.sin(2 * np.pi * 0.051 * t + 1)
    bub = np.zeros(n)
    for s in rng.uniform(0, dur - 0.1, int(dur * 2.2)):   # sparse low bubbles
        m = int(0.06 * SR); tt = np.arange(m) / SR; f0 = rng.uniform(260, 520)
        i = int(s * SR); bub[i:i + m] += np.sin(2 * np.pi * f0 * (1 + 2.5 * tt) * tt) * np.exp(-tt / 0.018) * rng.uniform(0.3, 1)
    fade = np.minimum(1, np.minimum(t / 1.5, (dur - t) / 1.5))
    return norm(river, 0.17) * swell * fade + norm(bub, 0.08) * fade


L = np.zeros(int(END * SR) + SR); R = np.zeros_like(L)
for k, c in enumerate(CUES):
    i = int(c['t'] * SR)
    if c['kind'] == 'water':
        s = water(c['until'] - c['t']); sr = np.roll(s, 240)   # a little width
        L[i:i + len(s)] += s; R[i:i + len(sr)] += sr; continue
    parts = [(0, paper(k))] if c['kind'] == 'paper' else [(0, tap())] if c['kind'] == 'tap' else [(j * 0.13, tap()) for j in range(3)]
    pan = 0.5 + 0.18 * np.sin(k * 1.7)   # each event from a slightly different place
    for d, s in parts:
        j = i + int(d * SR)
        L[j:j + len(s)] += s * (1 - pan) * 1.4; R[j:j + len(s)] += s * pan * 1.4
out = np.stack([L, R], 1)[: int(END * SR)]
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
dst = P / 'assets/sfx_stem.wav'
with wave.open(str(dst), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(dst, len(CUES), 'cues', f'{END:.1f} s')
