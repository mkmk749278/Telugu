# Medigadda film: handoff (14 Nov 2026, evening)

## Where it stands
- **Audio:** approved by the owner on 14 Nov 2026, with the new take 13 (the police-case line). Joined narration
  18:28 in Drive `Creator/Telugu/Medigadda/medigadda_vo_full.mp3`; `audio_check.md`; `vo/timing.json` (359 sentences).
  **One take must be made again: block 7** (`audio_block7_fix.md`). The committee's own letter says Anil Jain chaired
  it as Member (Disaster & Resilience) of the NDSA; the narration calls him its chairman. When `b7.mp3` arrives:
  change the word in `vo.txt`, rebuild `audio_blocks.md`, re-join and re-time (commands below), run
  `scripts/cue_check.py`, re-run `tools/mix.py`. The screen already says "NDSA మెంబర్".
- **Documents from Cowork** (Drive `.../Medigadda/docs/`, pulled to `assets/docs/`): the NDSA committee report and
  covering letter of 1 Nov 2023 (43 pages, read), the High Court order of 22 Apr 2026 (111 pages, conclusion read),
  the full CAG report, the L&T statement and the state's reply (both as news pages, not the originals). The NDSA
  final report of 2025 and the Ghose Commission report are not public (Cowork's `notes.txt`). Photos and satellite
  plates had not arrived when this was written.
- **Fact-check against the primary documents:** `claims.csv` rows 9, 12–16, 23, 24, 34, 53, 57 now quote the NDSA
  letter and the court order word for word. Nothing else in the narration is contradicted by them. The High Court made
  inoperative only the findings against the four petitioners; the screen says "పిటిషనర్లకు వ్యతిరేకంగా రాసిన మాటలు".
- **Picture:** the whole film is built in `remotion/` (composition `Medigadda`, 30 fps, 33,429 frames): chapters
  `chA`–`chG`, 264 word cues (`python3 scripts/cue_check.py projects/medigadda` passes), the real NDSA pages, the CAG
  pages and the court's conclusion page as document walks. Hero plates come from
  `scripts/blender/medigadda_hero.py` (Cycles, about 2 minutes a plate on 3 threads at 1920×1080, 40 samples; 44
  plates) into `assets/hero/`, then `projects/medigadda/sync_hero.sh` copies them into `remotion/public/hero/`.
  `remotion/src/anchors.json` is the script's `anchors.json` (points of each camera, for the overlays).
- **Sound:** `tools/mix.py` (14 library tracks by chapter, the thud twice, −14.3 LUFS) → `remotion/public/media/mix.wav`.

## Still to do before the 720p cut goes to the owner
1. Finish the plate render (the `h3_*` plates must be rendered again with the current script: its camera and pins
   were changed after the long render started), look at every plate, upload them to Drive `.../Medigadda/hero/`.
2. Real pictures: when Cowork's photos, clips and satellite plates arrive, put them where `picture_plan.md` says.
   Chapter F (the four voices, the court) and parts of G are still mostly type on paper: they need the High Court
   photo, the pump-house clips, the paddy and river photos, and Polavaram for the diaphragm wall. Without them the
   film breaks the "never a slide deck" rule.
3. The NDSA report's own drawings (crack mapping of pier 20, the settlement table) and site photos can be shown as
   pages of the report at s9, s193–195.
4. Sound effects on the visual events (pins, paper, water); only the two thuds are in.
5. Our own full review on stills and a low-resolution render: every label readable, nothing clipped, no static plate
   over 1.5 s, the 15% text rule.
6. `public_media.tar` (public/hero, public/docs, public/media/mix.wav) to Drive `Telugu/Medigadda/render-media/`,
   then the `remotion-render` workflow: film `medigadda`, drive `Telugu/Medigadda`, comp `Medigadda`, scale `2/3`.
7. Independent viewer review of the cut (PLAYBOOK §11.1), fixes, then the owner.

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
