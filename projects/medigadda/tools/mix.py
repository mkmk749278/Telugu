#!/usr/bin/env python3
"""Music bed, the two thuds and the final mix for the Medigadda film (picture_plan.md, Sound and music): library tracks
placed by chapter from vo/timing.json, crossfaded, near silence under the set piece, silenced before three key
moments, ducked under the voice, then the whole mix normalised to -14 LUFS, true peak -1.5 dB.
Sound effects: tools/sfx_cues.py then tools/sfx.py write assets/sfx_stem.wav, mixed in under the voice.
Writes remotion/public/media/mix.wav (the film's only audio) and prints loudness.

  scripts/music_pull.sh projects/medigadda/assets/music <ids>   then   python3 projects/medigadda/tools/mix.py
"""
import json, subprocess
from pathlib import Path

P = Path(__file__).resolve().parents[1]
MUS = P / 'assets/music'
VO = P / 'assets/vo/medigadda_vo_full.wav'
SFX = P / 'assets/sfx_stem.wav'   # tools/sfx_cues.py, then tools/sfx.py
OUT = P / 'remotion/public/media/mix.wav'
T = json.loads((P / 'vo/timing.json').read_text('utf-8'))
S = lambda i: T['sentences'][i]['start']
W = lambda i, pre: next(w['start'] for w in T['words'] if w['s'] == i and w['w'].startswith(pre))
END = T['durationInFrames'] / T['fps']
XF = 2.5
# (track, from sentence, offset into the track, gain dB): each runs to the next one's start
PLAN = [
    ('bp03_low_tension', 0, 0, -2),      # the void, the evening, the paradox
    ('bp01_curious_pulse', 24, 0, -4),   # where it is, the staircase, why here
    ('bp08_flow', 52, 0, -3),            # sand, raft, seepage, the tank bund, cutoffs
    ('fx07_evidence', 92, 0, -3),        # the two reports
    ('fx07_evidence', 130, 70, -3),
    ('fx02_mechanism', 151, 0, -4),      # the reconstruction
    ('fx08_countdown', 174, 0, -11),     # under the raft: almost nothing but the voice
    ('fx09_aftermath', 191, 0, -3),      # the evening, the snag
    ('fx03_boardroom', 207, 0, -4),      # the other side
    ('bp09_precision', 246, 0, -4),
    ('pr01_investigation', 269, 0, -5),  # the money
    ('pr04_hopeful', 289, 0, -4),        # today, the repair
    ('bp05_resolve', 311, 0, -4),
    ('bp10_landing', 340, 0, -1),        # the saying
    ('pr11_outro', 350, 0, -2),
]
SEG = [(tr, S(i) if i else 0.0, (S(PLAN[k + 1][1]) if k + 1 < len(PLAN) else END), off, g) for k, (tr, i, off, g) in enumerate(PLAN)]
THUD = [(W(7, 'శబ్దం'), 0), (W(191, 'దిగింది') - 0.45, -7)]   # the sound of the evening; the same sound, softer
HUSH = [(THUD[0][0] - 1.2, THUD[0][0] + 1.5), (W(121, 'కిటికీ') - 0.8, W(121, 'కిటికీ') + 1.6), (THUD[1][0] - 1.5, THUD[1][0] + 2.0)]

inputs, chains, labels = [], [], []
for i, (tr, a, b, off, g) in enumerate(SEG):
    a0 = max(0.0, a - (XF if i else 0))
    dur = b - a0 + (XF if i < len(SEG) - 1 else 0)
    inputs += ['-stream_loop', '-1', '-ss', str(off), '-t', f'{dur:.3f}', '-i', str(MUS / f'{tr}.wav')]
    chains.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={g}dB,afade=t=in:st=0:d={XF if i else 0.5},'
                  f'afade=t=out:st={max(0, dur - XF):.3f}:d={XF},adelay={int(a0 * 1000)}|{int(a0 * 1000)}[m{i}]')
    labels.append(f'[m{i}]')
n = len(SEG)
hush = '*'.join(f"(1-between(t,{x - 0.4:.2f},{y:.2f})+between(t,{x - 0.4:.2f},{y:.2f})*max(0,min(1,max(({x:.2f}-t)/0.4,(t-{y:.2f})/0.6))))" for x, y in HUSH)
fc = ';'.join(chains) + ';' + ''.join(labels) + f"amix=inputs={n}:normalize=0,atrim=0:{END},volume=-17dB,volume='{hush}':eval=frame[bed];"
# the thud: a low body (48 Hz falling), a short knock of filtered noise, a tail
th = []
for k, (t0, g) in enumerate(THUD):
    fc += (f"aevalsrc='0.9*sin(2*PI*(48-14*t)*t)*exp(-4.5*t)+0.25*sin(2*PI*95*t)*exp(-9*t)':s=48000:d=1.6[b{k}];"
           f"anoisesrc=d=0.25:c=brown:r=48000:a=0.8,lowpass=f=420,afade=t=out:st=0.02:d=0.2[k{k}];"
           f"[b{k}][k{k}]amix=inputs=2:normalize=0,aformat=channel_layouts=stereo,volume={g - 3}dB,adelay={int(t0 * 1000)}|{int(t0 * 1000)},apad=whole_dur={END}[t{k}];")
    th.append(f'[t{k}]')
fc += f'[{n}:a]aformat=sample_rates=48000:channel_layouts=stereo,apad=whole_dur={END}[vo];[vo]asplit=2[vo1][vokey];'
fc += f'[{n + 1}:a]aformat=sample_rates=48000:channel_layouts=stereo,apad=whole_dur={END}[fx];'
fc += '[bed][vokey]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450:makeup=1[duck];'
fc += f"[vo1][duck][fx]{''.join(th)}amix=inputs={3 + len(th)}:normalize=0,atrim=0:{END},loudnorm=I=-14:TP=-1.5:LRA=11[out]"
subprocess.run(['ffmpeg', '-y', '-v', 'error', *inputs, '-i', str(VO), '-i', str(SFX), '-filter_complex', fc, '-map', '[out]', '-ar', '48000', '-c:a', 'pcm_s16le', str(OUT)], check=True)
r = subprocess.run(['ffmpeg', '-i', str(OUT), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print([l.strip() for l in r.splitlines() if 'I:' in l or 'Peak:' in l or 'LRA:' in l][-3:], f'{END:.1f} s')
