#!/usr/bin/env python3
"""Demand and supply check for film topics on Telugu YouTube (docs/PLAYBOOK.md §5).

For each search phrase: the top 15 results in India with Telugu preferred, with channel, date, length and views, then
a summary of the long-form films (8 minutes and over). Many views on clips and Shorts with few long films = demand
without supply. With --channels it also profiles the channels behind those results (subscribers, median views of
their recent long films, best and worst) so a breakout can be told from a big channel's normal day.

Usage:
  scripts/yt_topic_scan.py --out docs/research/data/<date>_topic_scan.tsv "మేడిగడ్డ బ్యారేజ్ ఎందుకు కుంగింది" "SLBC tunnel"
  scripts/yt_topic_scan.py --out FILE --channels "Kranthi Vlogger,INFO GEEKS" PHRASE...
  A phrase that starts with ! is sorted by views instead of relevance.

Cost: 100 quota units per phrase (the project's 10,000 a day is shared with uploads on every channel: keep a scan
under about 30 phrases). Needs YT_CLIENT_ID, YT_CLIENT_SECRET and YT_REFRESH_TOKEN_BEPRACTICALWITHKISHORETELUGU.
"""
import argparse
import collections
import csv
import json
import os
import re
import statistics
import urllib.error
import urllib.parse
import urllib.request

API = "https://www.googleapis.com/youtube/v3/"
LONG = 480  # seconds: what we count as a long-form film


def token() -> str:
    d = urllib.parse.urlencode({
        "client_id": os.environ["YT_CLIENT_ID"], "client_secret": os.environ["YT_CLIENT_SECRET"],
        "refresh_token": os.environ["YT_REFRESH_TOKEN_BEPRACTICALWITHKISHORETELUGU"],
        "grant_type": "refresh_token"}).encode()
    return json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", d, timeout=30))["access_token"]


def get(at, path, **params):
    req = urllib.request.Request(API + path + "?" + urllib.parse.urlencode(params),
                                 headers={"Authorization": "Bearer " + at})
    try:
        return json.load(urllib.request.urlopen(req, timeout=60))
    except urllib.error.HTTPError as e:  # fail soft per phrase
        print("  API error", e.code, e.read()[:200].decode("utf8", "ignore"))
        return {}


def seconds(iso: str) -> int:
    m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    return 0 if not m else int(m.group(1) or 0) * 3600 + int(m.group(2) or 0) * 60 + int(m.group(3) or 0)


def clock(s: int) -> str:
    return f"{s // 60}:{s % 60:02d}"


def scan(at, phrase):
    order = "relevance"
    if phrase.startswith("!"):
        order, phrase = "viewCount", phrase[1:]
    found = get(at, "search", part="snippet", q=phrase, type="video", maxResults=15, regionCode="IN",
                relevanceLanguage="te", order=order)
    ids = [i["id"]["videoId"] for i in found.get("items", [])]
    if not ids:
        return []
    by = {v["id"]: v for v in get(at, "videos", part="snippet,statistics,contentDetails",
                                  id=",".join(ids)).get("items", [])}
    rows = []
    for rank, vid in enumerate(ids, 1):
        v = by.get(vid)
        if v:
            rows.append({"phrase": phrase, "rank": rank, "video": vid, "channel": v["snippet"]["channelTitle"],
                         "channel_id": v["snippet"]["channelId"], "date": v["snippet"]["publishedAt"][:10],
                         "seconds": seconds(v["contentDetails"]["duration"]),
                         "views": int(v["statistics"].get("viewCount", 0)),
                         "title": v["snippet"]["title"].replace("\t", " ")})
    return rows


def profile(at, channel_id):
    ch = get(at, "channels", part="statistics,contentDetails,snippet", id=channel_id).get("items", [])
    if not ch:
        return
    ch = ch[0]
    ids = [i["contentDetails"]["videoId"] for i in get(
        at, "playlistItems", part="contentDetails", maxResults=50,
        playlistId=ch["contentDetails"]["relatedPlaylists"]["uploads"]).get("items", [])]
    vids = get(at, "videos", part="snippet,statistics,contentDetails", id=",".join(ids)).get("items", [])
    films = sorted(((int(v["statistics"].get("viewCount", 0)), seconds(v["contentDetails"]["duration"]),
                     v["snippet"]["publishedAt"][:10], v["snippet"]["title"]) for v in vids
                    if seconds(v["contentDetails"]["duration"]) >= LONG), reverse=True)
    st = ch["statistics"]
    print(f'\n### {ch["snippet"]["title"]} | {int(st.get("subscriberCount", 0)):,} subscribers | '
          f'{st["videoCount"]} videos | long films in the last 50 uploads: {len(films)}')
    if films:
        print(f'   median views {int(statistics.median(f[0] for f in films)):,}, '
              f'median length {int(statistics.median(f[1] for f in films)) // 60} min')
        for views, secs, date, title in films[:6]:
            print(f"   {views:>10,} {secs // 60:>3}m {date} | {title[:85]}")
        for views, secs, date, title in films[-2:]:
            print(f"   (low) {views:>8,} {secs // 60:>3}m {date} | {title[:80]}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("phrases", nargs="+")
    ap.add_argument("--out", required=True, help="TSV to append the rows to")
    ap.add_argument("--channels", default="", help="comma-separated channel names (as shown in results) to profile")
    a = ap.parse_args()
    at = token()
    rows = []
    for p in a.phrases:
        rows += scan(at, p)
    by = collections.OrderedDict()
    for r in rows:
        by.setdefault(r["phrase"], []).append(r)
    for phrase, rs in by.items():
        films = sorted((r for r in rs if r["seconds"] >= LONG), key=lambda r: -r["views"])
        clips = sorted((r for r in rs if r["seconds"] < LONG), key=lambda r: -r["views"])
        print(f"\n## {phrase} | long films: {len(films)} of {len(rs)}")
        for r in films[:5]:
            print(f'   {r["views"]:>10,} {clock(r["seconds"]):>7} {r["date"]} {r["channel"][:22]:22} | {r["title"][:70]}')
        for r in clips[:2]:
            print(f'   (clip) {r["views"]:>10,} {clock(r["seconds"]):>6} {r["date"]} {r["channel"][:20]:20} | {r["title"][:55]}')
    new = not os.path.exists(a.out)
    with open(a.out, "a", newline="") as f:
        w = csv.writer(f, delimiter="\t", quoting=csv.QUOTE_NONE, escapechar="\\")
        if new:
            w.writerow(["phrase", "rank", "video", "channel", "date", "length", "views", "title"])
        for r in rows:
            w.writerow([r["phrase"], r["rank"], r["video"], r["channel"], r["date"], clock(r["seconds"]), r["views"],
                        r["title"]])
    wanted = [c.strip() for c in a.channels.split(",") if c.strip()]
    seen = set()
    for name in wanted:
        for r in rows:
            if r["channel"].startswith(name) and r["channel_id"] not in seen:
                seen.add(r["channel_id"])
                profile(at, r["channel_id"])
                break


if __name__ == "__main__":
    main()
