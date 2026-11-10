#!/usr/bin/env python3
"""Music bed and final mix for the Sonia film: library tracks placed by section, crossfaded, silenced before the
three key lines, ducked under the voice (sidechain), then the whole mix normalised to -14 LUFS, true peak -1.5 dB.
Writes remotion/public/media/mix.wav (the film's only audio) and prints loudness.

  python3 tools/mix.py VO.wav
"""
import subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MUS = ROOT / 'assets/sonia-belonging/music'
OUT = ROOT / 'projects/sonia-belonging/remotion/public/media/mix.wav'
VO = sys.argv[1]
END = 756.0  # film length in seconds (audio 751.0 + outro tail)
XF = 2.5
# (track, film start, film end, offset into track, gain dB)
SEG = [
    ('bp03_low_tension', 0.0, 58.9, 0, -2),
    ('fx07_evidence', 58.9, 111.0, 0, -3),
    ('bh07_archive', 111.0, 172.0, 0, -2),
    ('pr10_human', 172.0, 203.0, 0, -2),
    ('bh04_loss', 203.0, 283.0, 0, -1),
    ('fx09_aftermath', 283.0, 312.0, 0, -1),
    ('pr10_human', 312.0, 359.0, 40, -2),
    ('bh03_tension', 359.0, 486.0, 0, -3),
    ('bp10_landing', 486.0, 532.0, 0, -1),
    ('fx08_countdown', 532.0, 581.0, 0, -3),
    ('fx07_evidence', 581.0, 650.0, 60, -3),
    ('fx03_boardroom', 650.0, 699.0, 0, -3),
    ('bh11_reflective', 699.0, END, 0, -1),
]
# music silence before the key lines: "Theek hai", "They will kill me anyway", "Just leave it"
HUSH = [(44.6, 46.4), (254.6, 256.4), (518.0, 520.2)]

inputs, chains, labels = [], [], []
for i, (tr, a, b, off, g) in enumerate(SEG):
    a0 = max(0.0, a - (XF if i else 0))
    dur = b - a0 + (XF if i < len(SEG) - 1 else 0)
    inputs += ['-ss', str(off), '-t', f'{dur:.3f}', '-i', str(MUS / f'{tr}.wav')]
    fi = XF if i else 0.5
    chains.append(
        f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={g}dB,'
        f'afade=t=in:st=0:d={fi},afade=t=out:st={max(0, dur - XF):.3f}:d={XF},adelay={int(a0 * 1000)}|{int(a0 * 1000)}[m{i}]'
    )
    labels.append(f'[m{i}]')
n = len(SEG)
hush = '*'.join(f"(1-between(t,{x - 0.4:.2f},{y:.2f})*(1-0)+between(t,{x - 0.4:.2f},{y:.2f})*max(0,min(1,max(({x:.2f}-t)/0.4,(t-{y:.2f})/0.6))))" for x, y in HUSH)
fc = ';'.join(chains) + ';' + ''.join(labels) + f'amix=inputs={n}:normalize=0,atrim=0:{END},volume=-17dB,volume=\'{hush}\':eval=frame[bed];'
fc += f'[{n}:a]aformat=sample_rates=48000:channel_layouts=stereo,apad=whole_dur={END}[vo];'
fc += '[vo]asplit=2[vo1][vokey];'
fc += '[bed][vokey]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450:makeup=1[duck];'
fc += '[vo1][duck]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[out]'
cmd = ['ffmpeg', '-y', '-v', 'error', *inputs, '-i', VO, '-filter_complex', fc, '-map', '[out]', '-ar', '48000', '-c:a', 'pcm_s16le', str(OUT)]
subprocess.run(cmd, check=True)
r = subprocess.run(['ffmpeg', '-i', str(OUT), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print([l.strip() for l in r.splitlines() if 'I:' in l or 'Peak:' in l][-2:])
