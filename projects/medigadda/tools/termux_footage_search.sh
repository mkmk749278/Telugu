#!/data/data/com.termux/files/usr/bin/bash
# Step 1 of the real-footage pass (owner, 15 Nov 2026): run on the owner's phone in Termux, because yt-dlp reads each
# YouTube video's real licence and the cloud session may not. For every shot of the film it searches YouTube with the
# Creative Commons filter, reads each result's licence, channel and length, keeps only "Creative Commons" videos from
# channels that are not TV news, saves their thumbnails, and uploads the list to Drive
# Creator/Telugu/Medigadda/footage/candidates/. Nothing is downloaded but metadata and thumbnails.
set -e
pkg install -y python ffmpeg rclone >/dev/null 2>&1 || true
pip install -q -U yt-dlp
R=$(rclone listremotes | head -1)
[ -n "$R" ] || { echo "rclone has no Drive remote set up"; exit 1; }
D=$HOME/medigadda_footage; mkdir -p "$D/candidates/thumbs"; cd "$D"
python - <<'EOF'
import csv, urllib.parse, urllib.request, yt_dlp
Q = [
 ('B01', 'barrage gates evening'), ('B01', 'Godavari barrage drone'),
 ('B03', 'barrage gates flood water'), ('B03', 'Godavari flood 2022 barrage'), ('B03', 'dam gates open water flow'),
 ('B05', 'Kaleshwaram triveni sangamam'), ('B05', 'Godavari river drone Telangana'),
 ('B06', 'Medigadda barrage'), ('B06', 'Lakshmi barrage Kaleshwaram'), ('B06', 'మేడిగడ్డ బ్యారేజ్'),
 ('B07', 'Kannepalli pump house'), ('B07', 'Lakshmi pump house Kaleshwaram'),
 ('B08', 'Annaram barrage'), ('B08', 'Sundilla barrage'), ('B08', 'Kaleshwaram project drone'),
 ('B09', 'barrage construction concrete'), ('B11', 'bored pile drilling rig'), ('B11', 'secant pile wall construction'),
 ('B10', 'village tank bund Telangana'), ('B10', 'చెరువు కట్ట'),
 ('B12', 'soil boring core sample'),
 ('B14', 'sluice gate water'), ('B14', 'dam gate opening water jet'),
 ('B18', 'Kaleshwaram pumps running'), ('B18', 'lift irrigation delivery pipes water'),
 ('B19', 'Telangana paddy fields drone'), ('B19', 'paddy transplanting Telangana farmers'),
 ('B21', 'diaphragm wall construction'), ('B21', 'Polavaram project drone'),
 ('B22', 'barrage repair work'), ('B24', 'tunnel boring machine'), ('B24', 'SLBC tunnel'),
]
NEWS = ['tv9', 'ntv', 'v6', 'abn', 'sakshi', 'tv5', '10tv', 't news', 'tnews', 'etv', 'ndtv', 'india today', 'mango', 'hmtv',
        'raj news', 'bbc', 'news', 'times', 'zee', 'aaj tak', 'republic', 'cvr', 'mahaa', 'prime9', 'brs', 'congress', 'bjp']
rows, seen = [], {}
for shot, q in Q:
    url = 'https://www.youtube.com/results?search_query=' + urllib.parse.quote(q) + '&sp=EgIwAQ%253D%253D'
    try:
        with yt_dlp.YoutubeDL({'extract_flat': True, 'quiet': True, 'playlistend': 12}) as y:
            ents = y.extract_info(url, download=False).get('entries') or []
    except Exception as e:
        print('search failed', q, e); continue
    for e in ents:
        vid = e.get('id')
        if not vid: continue
        if vid in seen:
            seen[vid]['shots'] += ' ' + shot; continue
        try:
            with yt_dlp.YoutubeDL({'quiet': True, 'skip_download': True}) as y:
                m = y.extract_info('https://www.youtube.com/watch?v=' + vid, download=False)
        except Exception as ex:
            print('skip', vid, ex); continue
        lic = m.get('license') or ''
        ch = m.get('channel') or m.get('uploader') or ''
        ok = 'creative commons' in lic.lower() and not any(n in ch.lower() for n in NEWS)
        r = {'shots': shot, 'query': q, 'id': vid, 'ok': 'yes' if ok else 'no', 'licence': lic, 'channel': ch,
             'title': m.get('title', ''), 'duration': m.get('duration', ''), 'upload_date': m.get('upload_date', ''),
             'height': m.get('height', ''), 'url': 'https://www.youtube.com/watch?v=' + vid}
        seen[vid] = r; rows.append(r)
        if ok and m.get('thumbnail'):
            try: urllib.request.urlretrieve(m['thumbnail'], f'candidates/thumbs/{vid}.jpg')
            except Exception: pass
        print(r['ok'], shot, vid, ch[:30], lic[:40])
with open('candidates/candidates.tsv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else ['id'], delimiter='\t'); w.writeheader(); w.writerows(rows)
print(len(rows), 'videos checked,', sum(r['ok'] == 'yes' for r in rows), 'Creative Commons and not news')
EOF
rclone copy "$D/candidates" "${R}Creator/Telugu/Medigadda/footage/candidates" && echo "uploaded to ${R}Creator/Telugu/Medigadda/footage/candidates"
