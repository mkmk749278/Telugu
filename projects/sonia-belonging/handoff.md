# Sonia film: handoff (11 Nov 2026)

## Where it stands
- **Audio:** approved by the owner (10 Nov). Mix in Drive `Creator/Telugu/sonia-belonging/render-media/public_media.tar`
  (inside: `public/media/mix.wav`, −14 LUFS).
- **Picture v3** (owner, 11 Nov: "Don't use that stick man animations… realistic clips and images for every word"):
  every ink scene is gone. Each sentence sits on a real photo (Commons: GODL-India / PD / CC BY / CC BY-SA, credited on
  screen) or real Pixabay stock of the object the sentence names, labelled ILLUSTRATIVE FOOTAGE. Plan:
  `picture_plan.md`. Code: `remotion/src/shots.tsx`, `kit.tsx` (ClipShot), `split.tsx` (1984 | 2004), `media2.ts`.
  Stills reviewed every 4 s; fixes applied (whisky-glass clip removed, Penguin card on a photo). `tsc` clean.
- **No YouTube archive footage** in v3: the owner asked to finish without another phone round trip; real photos cover
  the 2004 beats (Sonia voting 10 May 2004, Kalam naming Manmohan Singh 19 May 2004, the oath 22 May 2004).
  The phone search results are in Drive `search/results.csv` if a later version wants clips.
- **Package:** `youtube/metadata.json` (title, 2 alternatives, description with chapters, tags, pinned-comment
  sources), `youtube/sonia-belonging_te.srt`. Thumbnails (main + 2 challengers) built by `tools/thumbs.py`, in Drive
  `Creator/Telugu/sonia-belonging/youtube/`.

## Released (11 Nov 2026)
- **Public on YouTube:** https://youtu.be/OYa9YW5YwEI (Be Practical with Kishore Telugu). Title as in
  `youtube/metadata.json`; thumbnail = challenger B (owner's choice); Telugu SRT on; AI use = No.
  It was public for about a minute with the first thumbnail before the owner asked to finalise the package; it went
  back to private (0 views) and was published again after the owner chose.
- **4K master:** Drive `Creator/Telugu/sonia-belonging/renders/sonia-belonging_4k_v3.mp4` (3840x2160, 30 fps,
  756.0 s, 1.7 GB). Rendered on GitHub run 42983265541 (six runners, 37 to 91 minutes each); the runner's own Drive
  upload failed with rclone's shared Google app rate limit (403 "Queries per minute", project 202264815644), so the
  shards were pulled from the run's artifacts, joined in the session with the mix, and uploaded to Drive from there.
- **QA:** -14.2 LUFS, true peak -1.4 dB; no black frames (the dark candle scene near 4:58 is intended); three quote
  cards hold still 1.5 to 2 s (2:16, 11:14, 11:24), left as they are; contact sheet every 5 s looked at.

## Next steps
1. **Owner:** pin the source comment in YouTube Studio (text in `youtube/metadata.json` "pinned_comment"); add the two
   other thumbnails to Test & Compare if wanted.
2. **Within 24 h of upload:** re-check the fresh-fact rows 39-44 in `claims.csv`.
3. **At 24 h:** read Studio (impressions, CTR).
4. **Drive uploads from GitHub runners:** give rclone the owner's own Google OAuth client ID so uploads stop sharing
   rclone's default quota; until then, if "Film to Drive" hangs, join from the artifacts as above.
5. **Next film:** `scripts/yt_upload.py` uploads private; show the owner the title and thumbnails and get the choice
   **before** the `publish` step (owner, 11 Nov 2026).
