#!/usr/bin/env python3
"""Lint a Telugu vo.txt and split it into recording blocks for the owner.

The owner generates the audio himself (owner, 2026-11-10): no TTS API from the session.
Blocks break only at blank lines (paragraphs), each at most --max characters, and are
balanced so no block is tiny. Writes a Markdown file with one click-to-copy block each.

Usage: python3 scripts/vo_blocks.py projects/<slug>/vo.txt --title "<film>" [--max 10000]
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
    total = len("\n\n".join(paragraphs))
    n = max(1, math.ceil(total / limit))
    while True:
        target = total / n
        blocks, cur = [], []
        for p in paragraphs:
            cand = "\n\n".join(cur + [p])
            if cur and (len(cand) > limit or (len(cand) > target and len(blocks) < n - 1)):
                blocks.append("\n\n".join(cur))
                cur = [p]
            else:
                cur.append(p)
        blocks.append("\n\n".join(cur))
        if all(len(b) <= limit for b in blocks):
            return blocks
        n += 1


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("vo")
    ap.add_argument("--title", required=True)
    ap.add_argument("--max", type=int, default=10000)
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
