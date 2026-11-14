# Medigadda film: handoff (14 Nov 2026, night)

## Done in the session of 14 Nov, night
- **Fresh-machine rebuild in one command:** `projects/medigadda/tools/build_media.sh` pulls from Drive and builds
  every gitignored file the Remotion project needs (docs pages, Sentinel views, photos and clips, the 21 takes joined
  exactly as locked: 1108.1 s, the 14 library tracks, the SFX stem, the mix), then `./sync_hero.sh` for the plates.
- **Real evidence from the NDSA committee report (pages 8–10, its own photos and drawings)** on the words they prove:
  the real road deck, guarded, right after our drawing sinks (s9) and again under "ఇది కుట్ర" (s210–211); the
  committee's crack map of pier 20 on "పగిలాయి" (s193); its photo of the structure at the water line on "ఫౌండేషన్
  ఇంకా నీళ్ళ కిందే" (s232). `media_manifest.csv` row added.
- **1.256 m is now primary:** the committee's survey of Block 7, 27 Oct 2023 6 PM (report p. 9): P-20 at 101.744
  against 103.000 = 1.256 m (`claims.csv` row 25). The "by 24 October" date is still from the news report.
- **Sound effects:** `tools/sfx_cues.py` reads every visual event from the code (documents, cards, rings, piles,
  pins) into `vo/sfx_cues.json`; `tools/sfx.py` synthesises them (paper slide, pencil tap, three taps for pins, the
  river under the raft s174–190); `tools/mix.py` mixes them 13–18 dB under the voice (measured). Still −14.3 LUFS.
  **Nobody has listened to the mix yet**: the owner's ears are the check.
- **s304–310 (the three-year wait)** is now a month ruler the camera rides: 38 ticks, the three monsoons that passed,
  a month counter that stops at 24 on "రెండేళ్ళకి". Document highlights can sit above captions (`DocPage lift`).
- **Credits:** the core store photo (MARUM, V. Diekamp, CC BY 4.0) and the pile wall (Falk Arnhold) from the files'
  EXIF; both now on screen. Commons answered HTTP 429 all session: the rest is in `cowork_request.md` (second request,
  with a High Court building photo for s254–261).


## Where it stood on 14 Nov, evening
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
1. **The 720p review cut r1** was sent to GitHub on 14 Nov (run 43618928493, `remotion-render.yml` on this branch;
   output Drive `Telugu/Medigadda/renders/medigadda_review_720p_r1.mp4`). The media it used is Drive
   `render-media/public_media.tar` (rebuilt 14 Nov night; rebuild and re-upload it after any media change). If the run
   failed, read its log first (this workflow has not yet finished a film end to end).
2. **Our own review of r1** (`review-cut` checks: flash, freeze, loudness, the 15% text rule, no static plate over
   1.5 s) and a listen to the SFX and the mix. The whole-film contact sheet of 14 Nov found and fixed: the camera
   leaving its plate, the clipped 2016 label, highlights under captions, the thin s304 timeline, the empty s354.
3. **Still type on paper:** the court passage (s254–261) and the four-voices cards (s216–228). A High Court building
   photo is asked for in `cowork_request.md` (second request); with it, s254–260 can sit on the real building.
4. **Licences:** pump_pipes, paddy, sandboil, polavaram and the MEIL clip still wait for their Commons page (Cowork
   second request); the Sentinel dates in the Copernicus Browser. Drive `hero/hero_plates_22.tar` is superseded by
   `hero_plates_44.tar` (the owner may delete it).
5. Independent viewer review of the cut (PLAYBOOK §11.1), fixes, then the owner.

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
Media on a fresh machine: `projects/medigadda/tools/build_media.sh`, then untar Drive `hero/hero_plates_44.tar` into
`assets/hero/` and run `./sync_hero.sh`. Sound effects after any picture change: `tools/sfx_cues.py`, `tools/sfx.py`,
`tools/mix.py`. Plates (only if a plate changes): `pip install bpy==5.3.0 pillow`, then
`python3 scripts/blender/medigadda_hero.py --out projects/medigadda/assets/hero --w 1920 --h 1080 --samples 40`
(`--only h3_` for one family). Stills: `node scripts/remotion_stills.mjs projects/medigadda/remotion Medigadda OUT FRAMES`.
