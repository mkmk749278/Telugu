# Medigadda film: handoff (13 Nov 2026, evening)

## Where it stands
- **Research:** `research.md`; **claims:** `claims.csv` (61 rows, each with its status).
- **Plan:** `plan.md` (promise, three titles, thumbnail and two challengers, beat sheet, hero cutaways, fairness
  flags). **Waiting for the owner's approval of the title and thumbnail concept.**
- **Narration v2:** `vo.txt`, 16,577 characters, about 18 minutes. Independent audience review done
  (`review/audience_v1.md`, eight viewers); every point answered in `review/audience_v1_check.md`.
  **Waiting for the owner's approval.**
- **Audio blocks:** `audio_blocks.md`, 2 blocks under 10,000 characters, sent to the owner.

## Open with the owner
1. Approve the plan (title, thumbnail) and the narration; then generate the audio from the two blocks.
2. Numbers: the review's elder and farmer could not follow English number words (ఎయిటీ ఫైవ్, సిక్స్). The standing
   rule keeps them. If the owner switches to Telugu words for counts and money, change `vo.txt` and rebuild the blocks
   **before** audio.
3. The voice A/B (PLAYBOOK §7).

## Must happen before the film is published
- **Read the two dam-safety reports themselves.** The final report (24 April 2025, about 350 pages) is not online.
  One Cowork request to the owner: the NDSA final report on the Medigadda, Annaram and Sundilla barrages and the
  committee report of 1 Nov 2023, as PDFs, into Drive `Creator/Telugu/medigadda/docs/` (try the Telangana Irrigation
  Department, NDSA, the Telangana Legislature papers and the Ghose Commission exhibits). Then close every `claims.csv`
  row marked "secondary: needs the report" and fix any line the report contradicts (cut it into the audio at its
  pauses, or ask the owner to regenerate that block).
- Read the High Court order of 22 April 2026 itself; check for an appeal.
- Re-check every "fresh" row within 24 hours of upload (start date, cost, target, Block 7 decision).

## Next build steps
Audio from the owner → `scripts/align_script.py` → word map → Blender heroes (plan.md) → document and photo requests
(one Cowork request) → Remotion build → 720p cut → independent viewer review → owner → 4K → package → the Short with
its own script.
