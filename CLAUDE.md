# Telugu: Claude Code guide

This repo makes **Be Practical with Kishore Telugu**: films in spoken Telugu for Telugu viewers. The first film is
`projects/sonia-belonging/` (Sonia Gandhi's memoir *Belonging*, released 10 Nov 2026).

**Reference only, never edit:** `mkmk749278/Creator` (rules and playbook of the English channel; the old Telugu
rules are in its `docs/archive/PLAYBOOK_2026-11-05.md` §4a, §4b) and `mkmk749278/Built-on-Bharat` (the Tata film,
a Remotion reference). Owner, 2026-11-10: "Work on Telugu, don't edit anything in other repos."

## Current work (read first when the owner says "continue")
- **Sonia film:** released 11 Nov 2026 (https://youtu.be/OYa9YW5YwEI); `projects/sonia-belonging/handoff.md` has the open
  release items (pinned comment, fresh-facts re-check, 24 h Studio read).
- Renders run on GitHub Actions (`.github/workflows/remotion-render.yml`, needs the repo secret `GDRIVE_RCLONE_TOKEN`),
  not in the session.

## Package (owner, 2026-11-11)
- **Show the owner the title and the thumbnails in the chat and get the choice before anything goes public.**
  `scripts/yt_upload.py` uploads private; `--only publish` runs only after the owner has chosen.

## Audio (owner, 2026-11-10)
- **The owner generates the audio himself. Never call ElevenLabs or any TTS API from a session.**
- Give him recording blocks of **at most 1,500 characters each** (owner, 2026-11-10: 10,000-character blocks skipped
  content when generated), all in one file, as click-to-copy code blocks in the chat and in
  `projects/<slug>/audio_blocks.md`, built by `python3 scripts/vo_blocks.py projects/<slug>/vo.txt --title "<film>"`
  (it lints the text and splits at paragraphs).
- Recording text: Telugu script only (English words written in Telugu, numbers as English number words in Telugu
  script: టూ థౌజండ్ ఫోర్), no `...`, `!`, quotes, brackets, tags, digits or Latin letters; questions end with `?`.

## Narration
Spoken Telugu with natural Tenglish, an elder brother talking over chai (Creator archive §4b). Start inside a real
moment; sentence 1 confirms the thumbnail; no greeting; never నువ్వు to the viewer; no newspaper connectors.

## Facts and fairness
- Facts only from sources; every factual line has a row in `projects/<slug>/claims.csv` with a verbatim quote.
  Knowledge stops at June 2026: never state a fact from memory.
- Political films: her/his claims are attributed; critics' side given with names; no party colours; tragedies told
  with dignity. Drafts sent by the owner from other chatbots are leads, not facts: check every line.
- Book films: we use published excerpts and interviews (owner, 2026-11-10: the full book is not available legally).
