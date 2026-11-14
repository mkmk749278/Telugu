#!/usr/bin/env bash
# Hero plates (PNG, assets/hero) -> the Remotion project's public/hero as JPEG (quality 2).
cd "$(dirname "$0")" && mkdir -p remotion/public/hero
for f in assets/hero/h*.png; do o=remotion/public/hero/$(basename "${f%.png}").jpg; [ "$o" -nt "$f" ] || ffmpeg -v error -y -i "$f" -q:v 2 "$o"; done
ls remotion/public/hero | wc -l
