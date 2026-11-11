#!/usr/bin/env bash
# List (or with --pull DEST, copy) a folder inside the Drive "Creator" folder: scripts/gdrive_ls.sh Telugu/<slug>/photos [--pull DIR]
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
RCLONE="$ROOT/.cache/rclone/rclone-v1.71.1-linux-amd64/rclone"
if [[ ! -x $RCLONE ]]; then  # fresh machine (a GitHub runner): fetch the same pinned rclone upload_gdrive.sh uses
  mkdir -p "$ROOT/.cache/rclone"
  curl -sSL -m 300 -o "$ROOT/.cache/rclone/rclone.zip" "https://downloads.rclone.org/v1.71.1/rclone-v1.71.1-linux-amd64.zip"
  (cd "$ROOT/.cache/rclone" && unzip -q -o rclone.zip && rm rclone.zip)
fi
TOKEN=$(sed -n '/^TOKEN=\$(python3/,/^)$/p' "$ROOT/scripts/upload_gdrive.sh" | sed '1s/^TOKEN=\$(//;$d' | bash)
export RCLONE_CONFIG_GD_TYPE=drive RCLONE_CONFIG_GD_SCOPE=drive RCLONE_CONFIG_GD_TOKEN="$TOKEN"
export RCLONE_CONFIG_GD_ROOT_FOLDER_ID="${GDRIVE_CREATOR_FOLDER_ID:-1NOCNjqPX5dOzKpp71oyEIIj0xoF-W68M}" RCLONE_CONFIG=/dev/null
if [[ ${2:-} == --pull ]]; then "$RCLONE" copy "gd:$1" "$3"; else "$RCLONE" lsf "gd:$1"; fi
