#!/usr/bin/env python3
"""Time every sentence and word of vo.txt on the owner's takes (PLAYBOOK §7): no speech recognition.

  python3 scripts/vo_timing.py projects/<slug> --takes t1.mp3 t2.mp3 ... [--gaps 0.8 1.1 ...] [--fps 30] [--outro 6]

1. The takes are matched to runs of whole paragraphs of vo.txt by their length (each take's seconds against its
   share of the characters); a take whose pace is more than 12% off the film's is listed to listen to.
2. Inside each take, sentences are placed on the take's own pauses (scripts/align_script.py).
3. Take times are moved to the joined narration: the same order and --gaps given to scripts/vo_rejoin.py.
4. Words are spread inside a sentence by their share of its Telugu letters.
Writes projects/<slug>/vo/: script.tsv (one sentence a line), timing.json (fps, durationInFrames, audioSeconds, takes,
sentences, words; seconds and frames) and timing.md (the takes table and every sentence to check by ear).
"""
import argparse
import json
import re
import statistics
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
SR = 44100


def samples(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                         capture_output=True, check=True).stdout
    return len(raw) // 2


def letters(s):
    return len(re.sub(r"[^ఀ-౿]", "", s))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("film", type=Path)
    ap.add_argument("--takes", type=Path, nargs="+", required=True)
    ap.add_argument("--gaps", type=float, nargs="*")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--outro", type=float, default=6.0)
    a = ap.parse_args()
    paras = [p.replace("\n", " ").strip() for p in re.split(r"\n\s*\n", (a.film / "vo.txt").read_text("utf-8").strip())]
    dur = [samples(t) / SR for t in a.takes]
    gaps = a.gaps or [0.8] * (len(dur) - 1)
    if len(gaps) != len(dur) - 1:
        sys.exit("one gap per join")
    starts = [0.0]
    for d, g in zip(dur, gaps):
        starts.append(starts[-1] + d + round(g * SR) / SR)
    audio = starts[-1] + dur[-1] if len(dur) > 1 else dur[0]
    starts = starts[:len(dur)]

    # 1. paragraphs -> takes
    L = [len(p) for p in paras]
    cs = [0]
    for x in L:
        cs.append(cs[-1] + x)
    rate = cs[-1] / sum(dur)
    n, k = len(L), len(dur)
    if k > n:
        sys.exit("more takes than paragraphs")
    INF = float("inf")
    best = [[INF] * (n + 1) for _ in range(k + 1)]
    back = [[0] * (n + 1) for _ in range(k + 1)]
    best[0][0] = 0.0
    for j in range(1, k + 1):
        for i in range(j, n + 1):
            for p in range(j - 1, i):
                c = best[j - 1][p] + ((cs[i] - cs[p]) / rate - dur[j - 1]) ** 2
                if c < best[j][i]:
                    best[j][i], back[j][i] = c, p
    seg, i = [], n
    for j in range(k, 0, -1):
        seg.append((back[j][i], i))
        i = back[j][i]
    seg.reverse()

    # 2-3. sentences inside each take
    sents, takes = [], []
    with tempfile.TemporaryDirectory() as tmp:
        for t, (p0, p1) in enumerate(seg):
            lines = [(pi, s.strip()) for pi in range(p0, p1) for s in re.findall(r"[^.?]+[.?]", paras[pi])]
            txt = Path(tmp) / f"t{t}.txt"
            txt.write_text("\n".join(s for _, s in lines) + "\n", "utf-8")
            subprocess.run([sys.executable, str(HERE / "align_script.py"), str(a.takes[t]), str(txt),
                            "--out", f"{tmp}/al{t}"], capture_output=True, check=True)
            al = json.loads(Path(f"{tmp}/al{t}/align.json").read_text("utf-8"))
            if len(al) != len(lines):
                sys.exit(f"take {t + 1}: {len(al)} aligned lines for {len(lines)} sentences")
            chars = cs[p1] - cs[p0]
            takes.append(dict(take=t + 1, file=a.takes[t].name, start=round(starts[t], 3), seconds=round(dur[t], 3),
                              paragraphs=[p0 + 1, p1], characters=chars, pace=round(chars / dur[t] / rate, 3)))
            for (pi, s), x in zip(lines, al):
                sents.append(dict(id=len(sents), take=t + 1, para=pi + 1, text=s,
                                  start=round(x["start"] + starts[t], 3), end=round(x["end"] + starts[t], 3),
                                  confidence=x.get("confidence", "")))
    fps = a.fps
    words = []
    for s in sents:
        s["startFrame"], s["endFrame"] = round(s["start"] * fps), round(s["end"] * fps)
        ws = s["text"].split()
        tot = sum(max(1, letters(w)) for w in ws)
        t0 = s["start"]
        for w in ws:
            d = (s["end"] - s["start"]) * max(1, letters(w)) / tot
            words.append(dict(s=s["id"], w=w, start=round(t0, 3), end=round(t0 + d, 3),
                              startFrame=round(t0 * fps), endFrame=round((t0 + d) * fps)))
            t0 += d
    out = a.film / "vo"
    out.mkdir(exist_ok=True)
    (out / "script.tsv").write_text("\n".join(s["text"] for s in sents) + "\n", "utf-8")
    (out / "timing.json").write_text(json.dumps(dict(
        fps=fps, durationInFrames=round((audio + a.outro) * fps), audioSeconds=round(audio, 3), takes=takes,
        sentences=sents, words=words), ensure_ascii=False, indent=0), "utf-8")
    pace = [(s["end"] - s["start"]) / max(1, letters(s["text"])) for s in sents]
    med = statistics.median(pace)
    md = [f"# Timing: {a.film.resolve().name}", "", f"Joined narration {audio:.1f} s; {len(sents)} sentences; {len(words)} words; {fps} fps.", "",
          "| Take | File | Starts (s) | Seconds | Paragraphs | Characters | Pace vs film |", "|---|---|---|---|---|---|---|"]
    md += [f"| {t['take']} | {t['file']} | {t['start']:.2f} | {t['seconds']:.1f} | {t['paragraphs'][0]}–{t['paragraphs'][1]} | "
           f"{t['characters']} | {t['pace']:.2f} |" for t in takes]
    flags = [f"- take {t['take']} ({t['file']}): pace {t['pace']:.2f} of the film's" for t in takes if abs(t["pace"] - 1) > 0.12]
    flags += [f"- sentence {s['id']} at {s['start']:.1f} s: {x / med:.2f} of the median pace: {s['text']}"
              for s, x in zip(sents, pace) if letters(s["text"]) >= 12 and not 0.6 <= x / med <= 1.6]
    flags += [f"- sentence {s['id']} at {s['start']:.1f} s: boundary could move one pause: {s['text']}"
              for s in sents if s["confidence"] == "low"]
    md += ["", "## To check by ear", ""] + (flags or ["Nothing flagged."])
    (out / "timing.md").write_text("\n".join(md) + "\n", "utf-8")
    print(f"{len(sents)} sentences, {len(words)} words, {audio:.3f} s, {len(flags)} flags -> {out}")


if __name__ == "__main__":
    main()
