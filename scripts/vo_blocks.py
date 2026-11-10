#!/usr/bin/env python3
"""Lint a Telugu vo.txt and split it into recording blocks for the owner.

The owner generates the audio himself (owner, 2026-11-10): no TTS API from the session.
Blocks break only at blank lines (paragraphs), each at most --max characters (default 1,500: the owner heard long blocks skip content, 2026-11-10), and are
balanced so no block is tiny. Writes a Markdown file with one click-to-copy block each.

Usage: python3 scripts/vo_blocks.py projects/<slug>/vo.txt --title "<film>" [--max 1500]
"""
import argparse
import math
import re
import sys
from pathlib import Path

BANNED = {
    "...": "three dots give no pause; use a comma, full stop or blank line",
    "!": "no exclamation marks",
    '"': "no quotes", "“": "no quotes", "”": "no quotes",
    ";": "no semicolons", "(": "no brackets", ")": "no brackets",
    "[": "no tags or brackets", "]": "no tags or brackets", "₹": "write rupees in words",
}


def lint(text: str) -> list[str]:
    problems = []
    for i, line in enumerate(text.splitlines(), 1):
        for bad, why in BANNED.items():
            if bad in line:
                problems.append(f"line {i}: '{bad}' ({why})")
        if re.search(r"[A-Za-z0-9]", line):
            problems.append(f"line {i}: Latin letters or digits (write them in Telugu script)")
        for sentence in re.split(r"[.?]", line):
            if len(sentence.split()) > 25:
                problems.append(f"line {i}: a sentence over 25 words")
    return problems


def split(paragraphs: list[str], limit: int) -> list[str]:
    """Contiguous groups of paragraphs, fewest blocks within the limit, sizes as even as possible."""
    sep = 2  # the blank line between paragraphs
    lens = [len(p) for p in paragraphs]
    m = len(lens)

    def size(i: int, j: int) -> int:  # paragraphs i..j-1 joined
        return sum(lens[i:j]) + sep * (j - i - 1)

    if any(n > limit for n in lens):
        raise SystemExit("a single paragraph is longer than the block limit: split it in vo.txt")
    total = size(0, m)
    for n in range(max(1, math.ceil(total / limit)), m + 1):
        # best[k][j]: smallest possible largest block when the first j paragraphs make k blocks
        inf = float("inf")
        best = [[inf] * (m + 1) for _ in range(n + 1)]
        cut = [[0] * (m + 1) for _ in range(n + 1)]
        best[0][0] = 0
        for k in range(1, n + 1):
            for j in range(1, m + 1):
                for i in range(k - 1, j):
                    s_ij = size(i, j)
                    if s_ij > limit:
                        continue
                    v = max(best[k - 1][i], s_ij)
                    if v < best[k][j]:
                        best[k][j], cut[k][j] = v, i
        if best[n][m] < inf:
            bounds, j = [], m
            for k in range(n, 0, -1):
                i = cut[k][j]
                bounds.append((i, j))
                j = i
            return ["\n\n".join(paragraphs[i:j]) for i, j in reversed(bounds)]
    raise SystemExit("could not split")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("vo")
    ap.add_argument("--title", required=True)
    ap.add_argument("--max", type=int, default=1500)
    ap.add_argument("--out")
    a = ap.parse_args()
    vo = Path(a.vo)
    text = vo.read_text(encoding="utf-8").strip()
    problems = lint(text)
    if problems:
        print("\n".join(problems))
        return 1
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    blocks = split(paragraphs, a.max)
    out = Path(a.out) if a.out else vo.with_name("audio_blocks.md")
    secs = len(text) / 14.0  # about 14 characters a second, measured on Telugu narration
    lines = [
        f"# {a.title}: audio blocks",
        "",
        f"{len(blocks)} blocks, {len(text):,} characters in all, each at most {a.max:,}. "
        f"Estimated length about {secs / 60:.0f} minutes.",
        "Paste each block whole, in order. Pauses come from the commas, full stops and blank lines.",
        "",
    ]
    for i, b in enumerate(blocks, 1):
        lines += [f"## Block {i} of {len(blocks)} ({len(b):,} characters)", "", "```text", b, "```", ""]
    out.write_text("\n".join(lines), encoding="utf-8")
    for i, b in enumerate(blocks, 1):
        print(f"block {i}: {len(b)} chars")
    print(f"wrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
