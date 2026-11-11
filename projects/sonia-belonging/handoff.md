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

## Next steps (in order)
1. **4K master on GitHub** (the old session's local render dies with it). Needs the repo secret
   `GDRIVE_RCLONE_TOKEN` (the owner is adding it). Run the workflow `remotion-render.yml` on `main` with:
   film `sonia-belonging`, drive `Telugu/sonia-belonging`, comp `Sonia`, scale `2`, runners `6`, crf `18`,
   name `sonia-belonging_4k_v3.mp4`. The film lands in Drive `Telugu/sonia-belonging/renders/`.
   If `remotion/public` changes (new media), re-tar it (`tar -cf public_media.tar public` from `remotion/`) and upload
   to `render-media/` first.
2. **QA the 4K** (pull it from Drive): `freezedetect=n=0.002:d=1.5`, `blackdetect`, `ebur128` (expect −14.2 LUFS,
   peak ≈ −1.4), picture and sound both 756.0 s, a contact sheet every 5 s.
3. **YouTube upload** to *Be Practical with Kishore Telugu*: the token is the new environment secret
   `YT_REFRESH_TOKEN_BEPRACTICALWITHKISHORETELUGU` (with `YT_CLIENT_ID`, `YT_CLIENT_SECRET`). First check the token
   opens that channel. **Ask the owner for the publish time and public/scheduled before uploading.** Upload with
   the metadata, the Telugu SRT, the main thumbnail; AI use = No.
4. Within 24 h of upload: re-check the fresh-fact rows 39–44 in `claims.csv`.
