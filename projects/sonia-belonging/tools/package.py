#!/usr/bin/env python3
"""YouTube package for the Sonia film: Telugu SRT from the approved timing, metadata.json (title, alternatives,
description with chapters, tags). Chapter times are sentence starts in vo/timing.json (the film starts at 0:00)."""
import json
from pathlib import Path
D = Path(__file__).resolve().parents[1]
t = json.load(open(D / 'vo/timing.json'))
S = t['sentences']

def ts(x):
    h, r = divmod(x, 3600); m, s = divmod(r, 60)
    return f'{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}'

srt = []
for i, s in enumerate(S, 1):
    end = min(s['end'] + 0.25, S[i]['start'] - 0.05) if i < len(S) else s['end'] + 1.5
    srt.append(f"{i}\n{ts(s['start'])} --> {ts(end)}\n{s['text']}\n")
(D / 'youtube/sonia-belonging_te.srt').write_text('\n'.join(srt), encoding='utf-8')

CH = [(0, 'ఆ రాత్రి సోనియా గాంధీ "సరే" అన్నారు'), (34, 'Belonging పుస్తకం: ఏం ఉంది?'), (43, 'కేంబ్రిడ్జ్ లో రాజీవ్ గాంధీతో పరిచయం'),
      (75, '1984: ఇందిరా గాంధీ హత్య, "వద్దు" అని వేడుకున్న సోనియా'), (100, '1991: రాజీవ్ గాంధీ హత్య'),
      (111, 'సోనియా గాంధీ మళ్ళీ పాలిటిక్స్ లోకి ఎందుకు?'), (125, '2004: రాహుల్, ప్రియాంక అమ్మని ఎలా ఆపారు'),
      (176, 'ఆ రాత్రి ఏం జరిగింది'), (196, 'సెంట్రల్ హాల్: PM పదవి వద్దు'), (216, 'మన్మోహన్ సింగ్ నే ఎందుకు?'),
      (226, 'Emergency, బాబ్రీ, మోదీ: పుస్తకంలో ఇంకా'), (232, 'BJP, AAP విమర్శలు, Penguin గొడవ'), (245, 'హైదరాబాద్ లో ఈ పుస్తకం, మీరేమంటారు?')]
def mmss(x): return f'{int(x // 60):02d}:{int(x % 60):02d}'
chap = '\n'.join(f'{mmss(S[i]["start"] if i else 0)} {name}' for i, name in CH)
desc = ('Sonia Gandhi Belonging పుస్తకంలో 2004 లో PM పదవి గురించి ఆమె ఏం రాశారు? ఒకసారి "సరే" అన్న సోనియా, ఒక్క రాత్రిలో ఎందుకు వద్దన్నారు.\n'
        '1984 లో రాజీవ్ గాంధీని వేడుకున్న రోజు నుంచి, 2004 లో రాహుల్ గాంధీ, ప్రియాంక గాంధీ అమ్మని ఆపిన రాత్రి వరకు, ఆమె సొంత మాటల్లో.\n'
        'Sonia Gandhi memoir Belonging: A Journey of Love (HarperCollins India, 10 Nov 2026), పేపర్లు పబ్లిష్ చేసిన భాగాలు, ఆమె ఇంటర్వ్యూల నుంచి మాత్రమే. BJP, AAP విమర్శలు కూడా.\n\n'
        + chap)
meta = {
    'title': 'Sonia Gandhi PM ఎందుకు కాలేదు? ఆమె పుస్తకంలోనే సమాధానం',
    'title_alternatives': ['ఆ రాత్రి సోనియా గాంధీ "సరే" అన్నారు | Belonging Book', 'Sonia Gandhi Book: PM పదవి వద్దన్న ఆ రాత్రి'],
    'description': desc,
    'tags': ['Sonia Gandhi', 'Sonia Gandhi Belonging', 'Belonging book', 'Sonia Gandhi memoir', 'Sonia Gandhi book', 'సోనియా గాంధీ',
             'సోనియా గాంధీ పుస్తకం', 'Sonia Gandhi PM 2004', 'why Sonia Gandhi did not become PM', 'Sonia Gandhi inner voice',
             'Rahul Gandhi', 'Priyanka Gandhi', 'Rajiv Gandhi', 'Manmohan Singh', 'Belonging A Journey of Love', 'Telugu news analysis',
             'Be Practical with Kishore Telugu'],
    'language': 'te', 'category': 'News & Politics', 'made_for_kids': False, 'ai_use': 'No',
    'ai_use_note': 'Synthetic narrator of no real person; real photos and real stock footage, stock labelled ILLUSTRATIVE FOOTAGE; no AI imagery.',
    'thumbnails': {'main': 'thumb_main.jpg', 'test_and_compare': ['thumb_challenger_a.jpg', 'thumb_challenger_b.jpg']},
    'captions': 'sonia-belonging_te.srt',
    'pinned_comment': 'Sources: excerpts of Belonging printed by The Indian Express, The Hindu, The Times of India, Hindustan Times and The Guardian; interviews via AFP, Business Standard; critics via Moneycontrol, Gulf News/IANS, PTI; Hyderabad sales via The Hindu. Photos: Wikimedia Commons (GODL-India, public domain, CC BY, CC BY-SA), credited on screen. Stock footage: Pixabay. Full list: claims.csv in our records.',
}
json.dump(meta, open(D / 'youtube/metadata.json', 'w'), ensure_ascii=False, indent=1)
print(meta['title'], len(meta['title'])); print(desc)
