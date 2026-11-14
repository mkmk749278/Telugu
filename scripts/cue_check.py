#!/usr/bin/env python3
"""Check every W(sentence, 'word'[, nth]) cue in a film's Remotion source against vo/timing.json (PLAYBOOK §8: the
picture lands on its word). A cue whose word is not in that sentence would stop the render; this lists them all at once.

  python3 scripts/cue_check.py projects/<slug>
"""
import json, re, sys
from pathlib import Path

film = Path(sys.argv[1])
t = json.loads((film / "vo/timing.json").read_text("utf-8"))
words = {}
for w in t["words"]:
    words.setdefault(w["s"], []).append(w["w"])
bad = n = 0
for src in sorted((film / "remotion/src").glob("*.tsx")):
    for m in re.finditer(r"\bW\((\d+),\s*'([^']+)'(?:,\s*(\d+))?\)", src.read_text("utf-8")):
        n += 1
        sid, pre, nth = int(m[1]), m[2], int(m[3] or 0)
        hits = [w for w in words.get(sid, []) if w.startswith(pre)]
        if len(hits) <= nth:
            bad += 1
            print(f"{src.name}: W({sid}, '{pre}'{', ' + str(nth) if nth else ''}) not in: {' '.join(words.get(sid, []))}")
print(f"{n} word cues, {bad} wrong")
sys.exit(1 if bad else 0)
