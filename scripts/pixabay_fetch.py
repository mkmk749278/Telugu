#!/usr/bin/env python3
"""Real footage from Pixabay (Pixabay Content License: free for commercial use, no attribution required; we credit
anyway and list every clip in media_manifest.csv). Needs PIXABAY_API_KEY in the environment.

  python3 scripts/pixabay_fetch.py search OUT_DIR "query one" "query two" ...   # results.json + thumbnail sheets
  python3 scripts/pixabay_fetch.py get OUT_DIR ID [ID ...] [--size large|medium] # the clip files, named px_<id>.mp4

`search` writes OUT_DIR/results.json (id, query, duration, size, tags, user, page URL) and OUT_DIR/sheet-<query>.jpg:
each hit as its preview frame labelled with its id and length, so clips are chosen by eye, not by tags.
"""
import io
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

KEY = os.environ.get('PIXABAY_API_KEY')
UA = {'User-Agent': 'TeluguDocResearch/1.0'}


def get(url, binary=False):
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
                data = r.read()
            return data if binary else json.loads(data)
        except Exception as e:  # rate limit or a dropped connection: back off and retry
            if attempt == 3:
                raise
            time.sleep(5 * (attempt + 1))


def font(size):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf'):
        if Path(f).exists():
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def search(out, queries, per=24):
    out.mkdir(parents=True, exist_ok=True)
    res_path = out / 'results.json'
    allres = json.loads(res_path.read_text()) if res_path.exists() else {}
    for q in queries:
        d = get('https://pixabay.com/api/videos/?' + urllib.parse.urlencode({'key': KEY, 'q': q, 'per_page': per, 'safesearch': 'true'}))
        hits = []
        for h in d['hits']:
            v = h['videos']
            big = v.get('large') if v.get('large', {}).get('url') else v['medium']
            hits.append({'id': h['id'], 'query': q, 'duration': h['duration'], 'w': big['width'], 'h': big['height'], 'tags': h['tags'],
                         'user': h['user'], 'page': h['pageURL'], 'thumb': v['medium'].get('thumbnail') or v['tiny'].get('thumbnail')})
        allres[q] = hits
        tiles = []
        for h in hits:
            try:
                im = Image.open(io.BytesIO(get(h['thumb'], binary=True))).convert('RGB').resize((384, 216))
            except Exception:
                im = Image.new('RGB', (384, 216), (40, 40, 40))
            dr = ImageDraw.Draw(im)
            dr.rectangle([0, 0, 384, 26], fill=(0, 0, 0))
            dr.text((6, 3), f"{h['id']}  {h['duration']}s  {h['w']}x{h['h']}", fill=(255, 220, 0), font=font(18))
            tiles.append(im)
        if tiles:
            cols = 4
            sheet = Image.new('RGB', (384 * cols, 216 * (-(-len(tiles) // cols))), (0, 0, 0))
            for i, t in enumerate(tiles):
                sheet.paste(t, ((i % cols) * 384, (i // cols) * 216))
            sheet.save(out / f"sheet-{q.replace(' ', '_')}.jpg", quality=85)
        print(f'{q!r}: {d["totalHits"]} hits, {len(hits)} shown')
    res_path.write_text(json.dumps(allres, indent=1))


def fetch(out, ids, size='large'):
    out.mkdir(parents=True, exist_ok=True)
    for i in ids:
        dest = out / f'px_{i}.mp4'
        if dest.exists():
            continue
        d = get('https://pixabay.com/api/videos/?' + urllib.parse.urlencode({'key': KEY, 'id': i}))
        h = d['hits'][0]
        v = h['videos']
        pick = v.get(size) if v.get(size, {}).get('url') else (v.get('large') if v.get('large', {}).get('url') else v['medium'])
        dest.write_bytes(get(pick['url'], binary=True))
        meta = {'id': i, 'page': h['pageURL'], 'user': h['user'], 'tags': h['tags'], 'w': pick['width'], 'h': pick['height'], 'duration': h['duration'],
                'licence': 'Pixabay Content License'}
        (out / f'px_{i}.json').write_text(json.dumps(meta, indent=1))
        print(i, pick['width'], pick['height'], h['duration'], 's', h['user'])


if __name__ == '__main__':
    if not KEY:
        sys.exit('PIXABAY_API_KEY is not set')
    cmd, out, *rest = sys.argv[1:]
    if cmd == 'search':
        search(Path(out), rest)
    else:
        size = 'large'
        if '--size' in rest:
            size = rest[rest.index('--size') + 1]
            rest = [r for r in rest if r not in ('--size', size)]
        fetch(Path(out), rest, size)
