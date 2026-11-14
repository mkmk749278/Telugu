# Medigadda film: handoff (14 Nov 2026, evening)

## Where it stands (session closed by the owner on 14 Nov 2026, evening; a new session continues)
- **Audio: locked.** The owner's take 13 (the police-case line) and take 7 (Anil Jain as "మెంబర్") are in. Joined
  narration 18:28 in Drive `Creator/Telugu/Medigadda/medigadda_vo_full.mp3`; `audio_check.md`; `vo.txt`,
  `audio_blocks.md` and `vo/timing.json` (359 sentences) all match it. In Drive `VO/`, take 7 is `b7_new.mp3` (the
  first `b7.mp3` is still there): when pulling the takes, use `b7_new.mp3` as take 7.
- **Documents from Cowork** (Drive `.../Medigadda/docs/`): the NDSA committee report and covering letter of 1 Nov
  2023 (read), the High Court order of 22 Apr 2026 (conclusion read), the full CAG report, the L&T statement and the
  state's reply (both as news pages). The NDSA final report of 2025 and the Ghose Commission report are not public.
- **Fact-check against the primary documents:** `claims.csv` rows 9, 12–16, 23, 24, 34, 53, 57 quote the NDSA
  letter and the court order word for word; nothing else in the narration is contradicted by them. The High Court
  made inoperative only the findings against the four petitioners; the screen says so.
- **Picture:** the whole film is built in `remotion/` (composition `Medigadda`, 30 fps): chapters `chA`–`chG`, 276
  word cues (`python3 scripts/cue_check.py projects/medigadda` passes, `npx tsc --noEmit` passes). In it: the hero
  cutaway, the real NDSA, CAG and High Court pages, Sentinel-2 views (2019, 2022, 2025), the MEIL pump-house clips,
  Commons photos. `media_manifest.csv` lists every asset; four rows still say TO CHECK (author and licence on the
  Commons page): Cowork wrote no `manifest.csv` for the photos.
- **Hero plates: 22 of 44 rendered** (all `h1_front_*`, all `h1_under_*`, `h1_wide_road`), in Drive
  `.../Medigadda/hero/hero_plates_22.tar`. Still to render: `h1_wide_water`, `h1_wide_settled`, `h1_thumb_*`, all
  `h2_*` (piles and pencils) and all `h3_*` (the plan and pins). The script skips plates already on disk, so untar
  into `assets/hero/` and run it again. **A cloud session is paused when its turn ends and background jobs die:
  render the plates while the session is working, or add the Blender workflow from the English channel.**
  `remotion/public/hero/` on a fresh machine has nothing: `sync_hero.sh` fills it from `assets/hero/`.
- **Sound:** `tools/mix.py` (14 library tracks by chapter, the thud twice, −14.3 LUFS) → `remotion/public/media/mix.wav`
  (pull the tracks first: the ids are in `media_manifest.csv`).
- **The media the Remotion project needs** (all gitignored; rebuild on a fresh machine): `public/hero` (plates),
  `public/docs` (`pdftoppm` of the PDFs in Drive `docs/`: `cag-1..7.png` at 130 dpi from the executive summary,
  `ndsa-1,2,3,5.png` at 144 dpi, `hc-109.png` at 130 dpi), `public/sat` (the four Sentinel images as JPEG:
  `s2_2019-02-18.jpg`, `s2_2022-11-19.jpg`, `s2_2025-02-21.jpg`, `s2_wide.jpg`), `public/photos` (from Drive
  `photos/`: `pump_pipes`, `pile_rig`, `pile_wall`, `paddy`, `sandboil`, `cores`, `polavaram` as JPEG ≤ 2560 px; and
  `v_pump.mp4` 9.0–12.7 s, `v_pipes.mp4` 6.0–8.65 s, `v_pipes2.mp4` 17.45–21.65 s of
  "Lakshmi Pumphouse of KLIP video by MEIL.webm", H.264 30 fps, no audio), `public/media/mix.wav`.

## Still to do before the 720p cut goes to the owner
1. Render the 22 remaining plates; look at every plate (the `h2_*` and `h3_*` families have only been seen as
   low-resolution stand-ins: check the cameras), upload them to Drive.
2. A contact sheet of the whole film with the real plates; fix what is wrong. Known: captions over the document
   pages sit on the text in places; the court shot's top label overlaps the page; the timeline at s304 is thin.
3. Chapter F (the four voices, the court) is still mostly type on paper, against the "never a slide deck" rule.
   Cowork found no High Court photo. Ideas: the NDSA report's own site photos and drawings as pages of the report
   (crack mapping of pier 20, the settlement table) at s9 and s193–195; the state's reply and L&T's statement exist
   only as news pages, so they stay as typed quotes with their source.
4. The four TO CHECK rows of `media_manifest.csv`; the Sentinel dates (as Cowork saved them) in the Copernicus Browser.
5. Sound effects on the visual events (pins, paper, water); only the two thuds are in. Nobody has listened to the
   mix: only its loudness was measured.
6. Our own full review (labels readable, nothing clipped, no static plate over 1.5 s, the 15% text rule).
7. `public_media.tar` (public/hero, docs, sat, photos, media/mix.wav) to Drive `Telugu/Medigadda/render-media/`,
   then the `remotion-render` workflow: film `medigadda`, drive `Telugu/Medigadda`, comp `Medigadda`, scale `2/3`.
8. Independent viewer review of the cut (PLAYBOOK §11.1), fixes, then the owner.

## Must happen before the film is published
- The NDSA final report is not public: every line from it stays attributed to news reports of it, as narrated.
  Rows whose quote says "paraphrase of the page as read on 13 Nov 2026" still need the page's exact words.
- Check for an appeal against the High Court order.
- Re-check every "fresh" row within 24 hours of upload.
- The owner's choice of title and thumbnail (`plan.md`).

## Commands
Takes are in `assets/vo/` (pull: `scripts/gdrive_ls.sh Telugu/Medigadda/VO --pull projects/medigadda/assets/vo`), in
order b1 … b21 (`b16 (1).mp3`, `17.mp3`); gaps 0.8 s, and 1.1 s before takes 3, 7, 10, 13, 16, 17 and 20:
`python3 scripts/vo_rejoin.py medigadda_vo_full.wav <takes> --gaps <20 gaps> --mp3 medigadda_vo_full.mp3`, then
`python3 scripts/vo_timing.py projects/medigadda --takes <takes> --gaps <the same gaps>`.
Plates: `pip install bpy==5.3.0 pillow`, then
`python3 scripts/blender/medigadda_hero.py --out projects/medigadda/assets/hero --w 1920 --h 1080 --samples 40`
(`--only h3_` for one family). Stills: `node scripts/remotion_stills.mjs projects/medigadda/remotion Medigadda OUT FRAMES`.
