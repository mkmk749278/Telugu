#!/usr/bin/env bash
# Rebuild everything the Medigadda Remotion project needs on a fresh machine (all gitignored), from Drive
# Creator/Telugu/Medigadda/ (handoff.md, "The media the Remotion project needs"). Skips what is already built.
#   projects/medigadda/tools/build_media.sh            docs, satellite, photos, clips, narration, music, mix
#   then projects/medigadda/sync_hero.sh               the hero plates (assets/hero -> remotion/public/hero)
set -euo pipefail
P=$(cd "$(dirname "$0")/.." && pwd); ROOT=$(cd "$P/../.." && pwd); PUB=$P/remotion/public
DL="$ROOT/scripts/gdrive_ls.sh"
mkdir -p "$P/assets"/{docs,sat,photos,vo,music} "$PUB"/{docs,sat,photos,media}

pull() { [ -n "$(ls -A "$2" 2>/dev/null)" ] || "$DL" "Telugu/Medigadda/$1" --pull "$2"; }
pull docs "$P/assets/docs"; pull satellite "$P/assets/sat"; pull VO "$P/assets/vo"

# Photos: only the files the film uses (the Drive folder holds about 90 candidates)
RC="$ROOT/.cache/rclone/rclone-v1.71.1-linux-amd64/rclone"
want=$(mktemp); cat > "$want" <<'EOF'
Medigadda Water pumping systern.jpg
Drilling secant piles to support a catenary foundation in Harold Interlocking. (CH058A, 11-02-2019) (49034420537).jpg
L03 310 Elsterbrücke, Bohrpfahlwand.jpg
Rice saplings in telangana.jpeg
Sand boil discovered in Tallulah, Louisiana.jpg
IODP Kernlager Bremen.jpg
Polavaram Project -1.jpg
Lakshmi Pumphouse of KLIP video by MEIL.webm
EOF
"$DL" Telugu/Medigadda >/dev/null   # makes sure rclone is fetched
TOKEN=$(sed -n '/^TOKEN=\$(python3/,/^)$/p' "$ROOT/scripts/upload_gdrive.sh" | sed '1s/^TOKEN=\$(//;$d' | bash)
RCLONE_CONFIG_GD_TYPE=drive RCLONE_CONFIG_GD_SCOPE=drive RCLONE_CONFIG_GD_TOKEN="$TOKEN" \
RCLONE_CONFIG_GD_ROOT_FOLDER_ID="${GDRIVE_CREATOR_FOLDER_ID:-1NOCNjqPX5dOzKpp71oyEIIj0xoF-W68M}" RCLONE_CONFIG=/dev/null \
  "$RC" copy gd:Telugu/Medigadda/photos "$P/assets/photos" --files-from "$want"; rm "$want"

ph() { [ -f "$PUB/photos/$2.jpg" ] || ffmpeg -v error -y -i "$P/assets/photos/$1" -vf "scale='min(2560,iw)':-2" -q:v 2 "$PUB/photos/$2.jpg"; }
ph "Medigadda Water pumping systern.jpg" pump_pipes
ph "Drilling secant piles to support a catenary foundation in Harold Interlocking. (CH058A, 11-02-2019) (49034420537).jpg" pile_rig
ph "L03 310 Elsterbrücke, Bohrpfahlwand.jpg" pile_wall
ph "Rice saplings in telangana.jpeg" paddy
ph "Sand boil discovered in Tallulah, Louisiana.jpg" sandboil
ph "IODP Kernlager Bremen.jpg" cores
ph "Polavaram Project -1.jpg" polavaram
clip() { [ -f "$PUB/photos/$1.mp4" ] || ffmpeg -v error -y -ss "$2" -to "$3" -i "$P/assets/photos/Lakshmi Pumphouse of KLIP video by MEIL.webm" \
  -an -r 30 -c:v libx264 -crf 18 -maxrate 12M -bufsize 24M -pix_fmt yuv420p "$PUB/photos/$1.mp4"; }
clip v_pump 9.0 12.7; clip v_pipes 6.0 8.65; clip v_pipes2 17.45 21.65

# Document pages
D=$P/assets/docs
[ -f "$PUB/docs/cag-7.png" ] || { pdftoppm -r 130 -f 1 -l 7 -png "$D/cag_kaleshwaram_executive_summary_2024.pdf" "$PUB/docs/cag"
  for f in "$PUB"/docs/cag-0*.png; do [ -e "$f" ] && mv "$f" "${f/cag-0/cag-}"; done; }
for n in 1 2 3 5 8 9 10; do [ -f "$PUB/docs/ndsa-$n.png" ] || pdftoppm -r 144 -f $n -l $n -singlefile -png "$D/ndsa_committee_report_2023-11-01.pdf" "$PUB/docs/ndsa-$n"; done
[ -f "$PUB/docs/hc-109.png" ] || pdftoppm -r 130 -f 109 -l 109 -singlefile -png "$D/hc_order_2026-04-22.pdf" "$PUB/docs/hc-109"

# Sentinel-2 views
for d in 2019-02-18 2022-11-19 2025-02-21; do [ -f "$PUB/sat/s2_$d.jpg" ] || ffmpeg -v error -y -i "$P/assets/sat/medigadda_s2_$d.png" -q:v 2 "$PUB/sat/s2_$d.jpg"; done
[ -f "$PUB/sat/s2_wide.jpg" ] || ffmpeg -v error -y -i "$P/assets/sat/medigadda_s2_godavari_yellampalli_150km.png" -q:v 2 "$PUB/sat/s2_wide.jpg"

# Narration: the 21 locked takes (take 7 = b7_new.mp3), joined exactly as for the locked audio
V=$P/assets/vo
if [ ! -f "$V/medigadda_vo_full.wav" ]; then
  takes=(); for i in $(seq 1 21); do case $i in 7) f=b7_new.mp3;; 16) f="b16 (1).mp3";; 17) f=17.mp3;; *) f=b$i.mp3;; esac; takes+=("$V/$f"); done
  gaps=(); for i in $(seq 2 21); do case $i in 3|7|10|13|16|17|20) gaps+=(1.1);; *) gaps+=(0.8);; esac; done
  python3 "$ROOT/scripts/vo_rejoin.py" "$V/medigadda_vo_full.wav" "${takes[@]}" --gaps "${gaps[@]}"
fi

# Music and the mix
ids=$(python3 - "$P/tools/mix.py" <<'EOF'
import re, sys
print(" ".join(sorted(set(re.findall(r"\('((?:bp|fx|pr)\d\d_[a-z_]+)'", open(sys.argv[1]).read())))))
EOF
)
"$ROOT/scripts/music_pull.sh" "$P/assets/music" $ids
[ -f "$PUB/media/mix.wav" ] || python3 "$P/tools/mix.py"
echo "media ready"; du -sh "$PUB"/*
