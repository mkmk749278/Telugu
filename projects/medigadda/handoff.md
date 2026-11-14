# Medigadda film: handoff (14 Nov 2026)

## Where it stands
- **Research:** `research.md`; **claims:** `claims.csv` (62 rows, each with its status).
- **Plan:** `plan.md` (promise, three titles, thumbnail and two challengers, beat sheet, hero cutaways, fairness
  flags). The owner has not yet said which title and thumbnail; the package is shown to him again before anything
  goes public (CLAUDE.md, Package).
- **Narration v2:** `vo.txt`, 16,577 characters. The owner generated the audio from it on 14 Nov 2026 (21 takes in
  Drive `Creator/Telugu/Medigadda/VO/`), with English number words as written.
- **Audio:** all 21 takes checked (`audio_check.md`: every sentence spoken, every number right, no take to redo)
  and joined: `medigadda_vo_full.mp3`, 18:22, in Drive `Creator/Telugu/Medigadda/`.
  **Waiting for the owner's approval of the joined audio.**
- **Timing:** `vo/timing.json` (358 sentences, 2,364 words, 30 fps) from `scripts/vo_timing.py`.
- **Picture plan and word map:** `picture_plan.md` (the look, the motif and its returns, every sentence's picture,
  the three Blender heroes, sound).
- **Cowork request:** `cowork_request.md` (the reports and orders, Commons photos and clips, satellite plates), to be
  run by the owner on the home laptop. The CAG executive summary is already in Drive `.../Medigadda/docs/`; every
  money figure in the narration matches it word for word.
- **Drive folder:** the owner made `Creator/Telugu/Medigadda/` (capital M); use that name everywhere.

## Open with the owner
1. Approve the joined audio.
2. **Block 13, one added sentence (recommended):** on 22 Oct 2026 the BRS said the police closed the 2023 complaint
   in 2025 as undetected and asked for a fresh probe (claims row 62; Telangana Today; no police statement found).
   The narration says only that no investigation report was found. `audio_block13_option.md` has the block with the
   sentence added, said as the BRS's statement. If the owner makes the take: replace `b13.mp3`, add the sentence to
   `vo.txt`, rebuild `audio_blocks.md`, re-run `vo_rejoin.py` and `vo_timing.py` (same gaps), and re-check the take.
3. Run the Cowork request.
4. The title and thumbnail choice (`plan.md`).

## Must happen before the film is published
- **Read the two dam-safety reports themselves** (Cowork request, part 1). Then close every `claims.csv` row marked
  "secondary: needs the report" and fix any line the report contradicts (the owner regenerates that one take; takes
  are about 1,000 characters each).
- Rows whose quote says "paraphrase of the page as read on 13 Nov 2026": open the page and copy the exact words.
- Read the High Court order of 22 April 2026 itself; check for an appeal.
- Re-check every "fresh" row within 24 hours of upload. Checked 14 Nov 2026: start moved to December (CM's review,
  5 Nov), about Rs 4,193 crore for the three barrages, contractors pay for structural defects, lifting "not
  technically feasible" now: all as narrated. Not re-read on 14 Nov: the June 2027 target (row 60) and the
  Block 7 options (row 44).

## Next build steps
Owner's audio approval (and the block 13 take, if made) → Blender heroes H1–H3 on GitHub runners (copy
`blender-render.yml` from the English channel) → the Remotion project `projects/medigadda/remotion/` built to
`picture_plan.md` and `vo/timing.json` → Cowork assets into `public/` → 720p cut → our full review → independent
viewer review → the owner → 4K → package → the Short with its own script.

## How the audio was joined (to repeat it exactly)
From `projects/medigadda/assets/vo/` (takes pulled with `scripts/gdrive_ls.sh Telugu/Medigadda/VO --pull …`), takes
in order b1 … b21, gaps 0.8 s, and 1.1 s before takes 3, 7, 10, 13, 16, 17 and 20:
`python3 scripts/vo_rejoin.py medigadda_vo_full.wav <takes> --gaps <20 gaps> --mp3 medigadda_vo_full.mp3`, then
`python3 scripts/vo_timing.py projects/medigadda --takes <takes> --gaps <the same gaps>`.
